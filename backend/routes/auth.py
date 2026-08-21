#authentication page , for student/teacher id and password

from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from pwdlib import PasswordHash
from database import SessionLocal
from models import User
from schemas import LoginRequest,LoginResponse

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

password_hash = PasswordHash.recommended()


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()

@router.post("/login",response_model=LoginResponse)
def login(login_data:LoginRequest,db:Session= Depends(get_db)):
    user=(
        db.query(User)
        .filter(User.user_id==login_data.user_id)
        .first()
    )
    if not user:
        raise HTTPException(
            status_code=401,detail="invalid ID or password "
        )
    if not password_hash.verify(
        login_data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=401,detail="invalid ID or password "
        )
    if user.role != login_data.role:
        raise HTTPException(
            status_code=401,
            detail="selected does not match with user role "
        )
    return LoginResponse(
        message="Login successful",
        user_id=user.user_id,
        full_name=user.full_name,
        role=user.role,
    )
        
        