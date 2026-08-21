from pwdlib import PasswordHash
from sqlalchemy.orm import Session

from database import SessionLocal, Base, engine
from models import User


print("CREATE_USERS SCRIPT STARTED")

password_hash = PasswordHash.recommended()

Base.metadata.create_all(bind=engine)


students = [
    ("STU001", "Aarav Sharma", "student001"),
    ("STU002", "Riya Patil", "student002"),
    ("STU003", "Aditya Kulkarni", "student003"),
    ("STU004", "Sneha Joshi", "student004"),
    ("STU005", "Vedant Shah", "student005"),
    ("STU006", "Ananya Deshmukh", "student006"),
    ("STU007", "Rahul Mehta", "student007"),
    ("STU008", "Isha Gupta", "student008"),
    ("STU009", "Om More", "student009"),
    ("STU010", "Kavya Nair", "student010"),
]


def create_users():

    print("Creating users...")

    db: Session = SessionLocal()

    try:

        for user_id, name, password in students:

            existing_user = (
                db.query(User)
                .filter(User.user_id == user_id)
                .first()
            )

            if existing_user:
                print(f"{user_id} already exists. Skipping.")
                continue

            student = User(
                user_id=user_id,
                full_name=name,
                password_hash=password_hash.hash(password),
                role="student"
            )

            db.add(student)

            print(f"Created {user_id}")

        db.commit()

        print("ALL 10 STUDENTS CREATED SUCCESSFULLY!")

    except Exception as e:

        db.rollback()

        print("ERROR:")
        print(e)

    finally:

        db.close()


create_users()



