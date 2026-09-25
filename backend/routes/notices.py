from pathlib import Path
from datetime import datetime
from io import BytesIO
import os
import uuid

import pytesseract
from PIL import Image
from pypdf import PdfReader

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    BackgroundTasks,
    Form,
)

from sqlalchemy.orm import Session

from database import SessionLocal
from models import Notice, Notification
from auth_dependencies import require_teacher, require_student

from services.notice_workflow import process_notice_workflow
from services.storage_service import (
    upload_notice_file,
    download_notice_file,
)

router = APIRouter(tags=["Notices"])

POPPLER_PATH = os.getenv("POPPLER_PATH")
TESSERACT_PATH = os.getenv("TESSERACT_PATH")

if TESSERACT_PATH:
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH

POPPLER_PATH = os.getenv("POPPLER_PATH")
TESSERACT_PATH = os.getenv("TESSERACT_PATH")

if TESSERACT_PATH:
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


def process_notice_in_background(
    storage_path: str,
    document_url: str | None = None,
    filename: str = "",
    content_type: str | None = None,
):
    """
    Background processing pipeline.

    The HTTP request only uploads the document.
    Extraction/OCR + AI processing happen here.
    """

    db = SessionLocal()

    try:
        file_bytes = download_notice_file(storage_path)

        extracted_text = extract_notice_text(
            file_bytes=file_bytes,
            filename=filename,
            content_type=content_type,
        )

        if not extracted_text.strip():
            print(
                f"Notice processing skipped: " f"could not extract text from {filename}"
            )
            return

        notice, notifications, routing_report = process_notice_workflow(
            db=db,
            raw_text=extracted_text,
            document_url=document_url,
        )

        print(f"Notice processed: {notice.title}")
        print(f"Routing report: {routing_report}")

    except Exception as e:
        db.rollback()

        print(f"Background notice processing failed " f"for {filename}: {e}")

    finally:
        db.close()


ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
}

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
}

MAX_BATCH_FILES = 20


def extract_notice_text(
    file_bytes: bytes,
    filename: str,
    content_type: str | None,
) -> str:

    extension = Path(filename).suffix.lower()

    # --------------------------------------------------
    # PDF
    # --------------------------------------------------

    if extension == ".pdf" or content_type == "application/pdf":
        reader = PdfReader(BytesIO(file_bytes))

        extracted_text = ""

        for page in reader.pages:
            page_text = page.extract_text()

            if page_text:
                extracted_text += page_text + "\n"

        # OCR fallback for scanned PDFs
        if not extracted_text.strip():

            from pdf2image import convert_from_bytes

            images = convert_from_bytes(
                file_bytes,
                poppler_path=POPPLER_PATH or None,
            )

            ocr_text = []

            for image in images:
                text = pytesseract.image_to_string(image)

                if text.strip():
                    ocr_text.append(text)

            extracted_text = "\n".join(ocr_text)

        return extracted_text.strip()

    # --------------------------------------------------
    # IMAGE
    # --------------------------------------------------

    if content_type in ALLOWED_IMAGE_TYPES or extension in {
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
    }:
        image = Image.open(BytesIO(file_bytes))

        extracted_text = pytesseract.image_to_string(image)

        return extracted_text.strip()

    raise ValueError(
        "Unsupported file type. " "Only PDF, JPG, JPEG, PNG and WEBP are supported."
    )


# ============================================================
# TEXT NOTICE
# ============================================================


@router.post("/api/admin/notice/text")
def upload_text_notice(
    background_tasks: BackgroundTasks,
    text: str = Form(...),
    current_user: dict = Depends(require_teacher),
):
    if not text.strip():
        raise HTTPException(
            status_code=400,
            detail="Notice text cannot be empty.",
        )

    background_tasks.add_task(
        process_notice_in_background,
        text,
    )

    return {"message": "Notice accepted for background processing."}


# ============================================================
# PDF NOTICE
# ============================================================


@router.post("/api/admin/notice/pdf")
async def upload_pdf_notice(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    current_user: dict = Depends(require_teacher),
):
    filename = file.filename or "notice.pdf"

    if not filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported.",
        )

    try:
        file_bytes = await file.read()

        if not file_bytes:
            raise HTTPException(
                status_code=400,
                detail="PDF file is empty.",
            )

        storage_path = f"notices/{uuid.uuid4()}.pdf"

        document_url = upload_notice_file(
            file_bytes=file_bytes,
            storage_path=storage_path,
            content_type="application/pdf",
        )

        background_tasks.add_task(
            process_notice_in_background,
            storage_path,
            document_url,
            filename,
            file.content_type,
        )

        return {
            "message": "PDF accepted for background processing.",
            "document_url": document_url,
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"PDF upload failed: {str(e)}",
        )


# ============================================================
# IMAGE NOTICE
# ============================================================


@router.post("/api/admin/notice/image")
async def upload_image_notice(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    current_user: dict = Depends(require_teacher),
):
    filename = file.filename or "notice-image"

    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, PNG, JPEG and WEBP images are supported.",
        )

    try:
        image_bytes = await file.read()

        if not image_bytes:
            raise HTTPException(
                status_code=400,
                detail="Image file is empty.",
            )

        extension = Path(filename).suffix.lower()

        if extension not in {
            ".jpg",
            ".jpeg",
            ".png",
            ".webp",
        }:
            extension = ".png"

        storage_path = f"notices/{uuid.uuid4()}{extension}"

        document_url = upload_notice_file(
            file_bytes=image_bytes,
            storage_path=storage_path,
            content_type=file.content_type,
        )

        background_tasks.add_task(
            process_notice_in_background,
            storage_path,
            document_url,
            filename,
            file.content_type,
        )

        return {
            "message": "Image accepted for background processing.",
            "document_url": document_url,
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Image upload failed: {str(e)}",
        )


# ============================================================
# ALL NOTICES
# ============================================================


@router.get("/api/notices")
def get_all_notices(
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_teacher),
):
    notices = db.query(Notice).order_by(Notice.created_at.desc()).all()

    return {
        "total": len(notices),
        "notices": [
            {
                "id": notice.id,
                "title": notice.title,
                "summary": notice.summary,
                "category": notice.category,
                "is_mandatory": notice.is_mandatory,
                "eligibility": notice.eligibility,
                "deadline": notice.deadline,
                "registration_link": notice.registration_link,
                "required_action": notice.required_action,
                "document_url": notice.pdf_url,
                "pdf_url": notice.pdf_url,
                "importance": notice.importance,
                "created_at": notice.created_at,
            }
            for notice in notices
        ],
    }


# ============================================================
# BATCH NOTICE UPLOAD
# ============================================================


@router.post("/api/admin/notice/image")
async def upload_image_notice(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    current_user: dict = Depends(require_teacher),
):
    filename = file.filename or "notice-image"

    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, PNG, JPEG and WEBP images are supported.",
        )

    try:
        image_bytes = await file.read()

        if not image_bytes:
            raise HTTPException(
                status_code=400,
                detail="Image file is empty.",
            )

        extension = Path(filename).suffix.lower()

        if extension not in {
            ".jpg",
            ".jpeg",
            ".png",
            ".webp",
        }:
            extension = ".png"

        storage_path = f"notices/{uuid.uuid4()}{extension}"

        document_url = upload_notice_file(
            file_bytes=image_bytes,
            storage_path=storage_path,
            content_type=file.content_type,
        )

        background_tasks.add_task(
            process_notice_in_background,
            storage_path,
            document_url,
            filename,
            file.content_type,
        )

        return {
            "message": "Image accepted for background processing.",
            "document_url": document_url,
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Image upload failed: {str(e)}",
        )


# ============================================================
# STUDENT PERSONALIZED FEED
# ============================================================


@router.get("/api/student/{student_id}/notifications")
def get_notifications(
    student_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_student),
):
    if current_user.get("uid") != student_id:
        raise HTTPException(
            status_code=403,
            detail="You can only access your own notifications.",
        )

    notifications = (
        db.query(Notification)
        .filter(Notification.student_id == student_id)
        .order_by(Notification.created_at.desc())
        .all()
    )

    result = []

    for notification in notifications:
        notice = db.query(Notice).filter(Notice.id == notification.notice_id).first()

        if not notice:
            continue

        result.append(
            {
                "notification_id": notification.id,
                "notice_id": notice.id,
                "title": notice.title,
                "summary": notice.summary,
                "document_url": notice.pdf_url,
                "pdf_url": notice.pdf_url,
                "category": notice.category,
                "deadline": notice.deadline,
                "registration_link": notice.registration_link,
                "required_action": notice.required_action,
                "priority": notification.priority,
                "urgency": notification.urgency,
                "days_left": notification.days_left,
                "relevance_score": notification.relevance_score,
                "reason": notification.reason,
                "status": notification.status,
                "created_at": notification.created_at,
            }
        )

    return {
        "student_id": student_id,
        "total": len(result),
        "notifications": result,
    }


# ============================================================
# STUDENT ALL NOTICES
# ============================================================


@router.get("/api/student/{student_id}/notices")
def get_student_all_notices(
    student_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_student),
):
    if current_user.get("uid") != student_id:
        raise HTTPException(
            status_code=403,
            detail="You can only access your own notices.",
        )

    notices = db.query(Notice).order_by(Notice.created_at.desc()).all()

    student_notifications = {
        notification.notice_id: notification
        for notification in (
            db.query(Notification).filter(Notification.student_id == student_id).all()
        )
    }

    result = []

    for notice in notices:
        notification = student_notifications.get(notice.id)

        result.append(
            {
                "notice_id": notice.id,
                "title": notice.title,
                "summary": notice.summary,
                "document_url": notice.pdf_url,
                "pdf_url": notice.pdf_url,
                "category": notice.category,
                "is_mandatory": notice.is_mandatory,
                "eligibility": notice.eligibility,
                "deadline": notice.deadline,
                "registration_link": notice.registration_link,
                "required_action": notice.required_action,
                "importance": notice.importance,
                # Present when this notice is relevant to the student
                "priority": (notification.priority if notification else None),
                "urgency": (notification.urgency if notification else None),
                "days_left": (notification.days_left if notification else None),
                "relevance_score": (
                    notification.relevance_score if notification else None
                ),
                "reason": (notification.reason if notification else None),
                "status": (notification.status if notification else "NOT_RELEVANT"),
                "created_at": notice.created_at,
            }
        )

    return {
        "student_id": student_id,
        "total": len(result),
        "notices": result,
    }


# ============================================================
# MARK NOTIFICATION READ
# ============================================================


@router.patch("/api/student/{student_id}/notifications/{notification_id}/read")
def mark_notification_read(
    student_id: str,
    notification_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_student),
):
    if current_user.get("uid") != student_id:
        raise HTTPException(
            status_code=403,
            detail="You can only modify your own notifications.",
        )

    notification = (
        db.query(Notification)
        .filter(
            Notification.id == notification_id,
            Notification.student_id == student_id,
        )
        .first()
    )

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification not found.",
        )

    notification.status = "READ"
    notification.read_at = datetime.utcnow()

    db.commit()

    return {"message": "Notification marked as read."}
