# from sqlalchemy.orm import Session

# from database import SessionLocal
# from models import Student


# students = [
#     ("STU001", "Aarav Sharma", "01", 92, 8.4, 3),
#     ("STU002", "Riya Patil", "02", 61, 6.1, 1),
#     ("STU003", "Aditya Kulkarni", "03", 88, 8.0, 2),
#     ("STU004", "Sneha Joshi", "04", 74, 7.1, 3),
#     ("STU005", "Vedant Shah", "05", 45, 5.4, 0),
#     ("STU006", "Ananya Deshmukh", "06", 96, 9.1, 4),
#     ("STU007", "Rahul Mehta", "07", 68, 6.8, 2),
#     ("STU008", "Isha Gupta", "08", 82, 7.6, 3),
#     ("STU009", "Om More", "09", 18, 7.4, 2),
#     ("STU010", "Kavya Nair", "10", 90, 7.9, 4),
# ]


# def create_students():

#     db: Session = SessionLocal()

#     try:

#         for student_id, name, roll_number, attendance, cgpa, extracurricular in students:

#             existing_student = (
#                 db.query(Student)
#                 .filter(Student.student_id == student_id)
#                 .first()
#             )

#             if existing_student:
#                 print(f"{student_id} already exists. Skipping.")
#                 continue

#             student = Student(
#                 student_id=student_id,
#                 name=name,
#                 roll_number=roll_number,
#                 attendance=attendance,
#                 previous_sem_cgpa=cgpa,
#                 extracurricular_count=extracurricular
#             )

#             db.add(student)

#             print(f"Created student: {student_id}")

#         db.commit()

#         print("\nALL STUDENTS CREATED SUCCESSFULLY!")

#     except Exception as e:

#         db.rollback()

#         print("\nERROR:")
#         print(e)

#     finally:
#         db.close()


# create_students()


import pandas as pd
from pathlib import Path
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Student

# Path to the single source-of-truth CSV
CSV_PATH = Path(__file__).resolve().parent.parent / "ai" / "data" / "students.csv"


def create_students():

    db: Session = SessionLocal()

    try:

        # -------------------------
        # LOAD STUDENTS FROM CSV
        # -------------------------

        if not CSV_PATH.exists():
            raise FileNotFoundError(f"Students CSV not found: {CSV_PATH}")

        df = pd.read_csv(CSV_PATH)

        required_columns = [
            "student_id",
            "name",
            "attendance",
            "previous_sem_cgpa",
            "extracurricular_count",
        ]

        missing_columns = [
            column for column in required_columns if column not in df.columns
        ]

        if missing_columns:
            raise ValueError(f"Missing columns in students.csv: {missing_columns}")

        print(f"Loaded {len(df)} students from CSV")

        # -------------------------
        # CREATE / UPDATE STUDENTS
        # -------------------------

        for _, row in df.iterrows():

            student_id = str(row["student_id"]).strip()
            name = str(row["name"]).strip()

            existing_student = (
                db.query(Student).filter(Student.student_id == student_id).first()
            )

            if existing_student:

                # Update existing student
                existing_student.name = name
                existing_student.roll_number = student_id[-3:]
                existing_student.attendance = int(row["attendance"])
                existing_student.previous_sem_cgpa = float(row["previous_sem_cgpa"])
                existing_student.extracurricular_count = int(
                    row["extracurricular_count"]
                )

                print(f"Updated: {student_id}")

            else:

                student = Student(
                    student_id=student_id,
                    name=name,
                    roll_number=student_id[-3:],
                    attendance=int(row["attendance"]),
                    previous_sem_cgpa=float(row["previous_sem_cgpa"]),
                    extracurricular_count=int(row["extracurricular_count"]),
                )

                db.add(student)

                print(f"Created: {student_id}")

        db.commit()

        print("\nALL STUDENTS SYNCHRONIZED SUCCESSFULLY!")
        print(f"Total students: {len(df)}")

    except Exception as e:

        db.rollback()

        print("\nERROR:")
        print(e)

    finally:
        db.close()


create_students()
