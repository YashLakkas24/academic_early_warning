from sqlalchemy.orm import Session

from database import SessionLocal
from models import Student


students = [
    ("STU001", "Aarav Sharma", "01", 92, 8.4, 3),
    ("STU002", "Riya Patil", "02", 61, 6.1, 1),
    ("STU003", "Aditya Kulkarni", "03", 88, 8.0, 2),
    ("STU004", "Sneha Joshi", "04", 74, 7.1, 3),
    ("STU005", "Vedant Shah", "05", 45, 5.4, 0),
    ("STU006", "Ananya Deshmukh", "06", 96, 9.1, 4),
    ("STU007", "Rahul Mehta", "07", 68, 6.8, 2),
    ("STU008", "Isha Gupta", "08", 82, 7.6, 3),
    ("STU009", "Om More", "09", 18, 7.4, 2),
    ("STU010", "Kavya Nair", "10", 90, 7.9, 4),
]


def create_students():

    db: Session = SessionLocal()

    try:

        for student_id, name, roll_number, attendance, cgpa, extracurricular in students:

            existing_student = (
                db.query(Student)
                .filter(Student.student_id == student_id)
                .first()
            )

            if existing_student:
                print(f"{student_id} already exists. Skipping.")
                continue

            student = Student(
                student_id=student_id,
                name=name,
                roll_number=roll_number,
                attendance=attendance,
                previous_sem_cgpa=cgpa,
                extracurricular_count=extracurricular
            )

            db.add(student)

            print(f"Created student: {student_id}")

        db.commit()

        print("\nALL STUDENTS CREATED SUCCESSFULLY!")

    except Exception as e:

        db.rollback()

        print("\nERROR:")
        print(e)

    finally:
        db.close()


create_students()