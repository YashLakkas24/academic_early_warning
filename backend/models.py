from sqlalchemy import Column, Integer, String, Float
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        String,
        unique=True,
        nullable=False,
        index=True
    )

    full_name = Column(
        String,
        nullable=False
    )

    password_hash = Column(
        String,
        nullable=False
    )

    role = Column(
        String,
        nullable=False
    )
class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        String,
        unique=True,
        nullable=False,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    roll_number = Column(
        String,
        nullable=False
    )

    attendance = Column(
        Integer,
        nullable=False
    )

    previous_sem_cgpa = Column(
        Float,
        nullable=False
    )

    extracurricular_count = Column(
        Integer,
        nullable=False
    )
class StudentInterest(Base):
    __tablename__ = "student_interests"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    student_id = Column(
        String,
        nullable=False,
        index=True
    )

    interest = Column(
        String,
        nullable=False
    )

    status = Column(
        String,
        nullable=False,
        default="active"
    )
class QuizAnswer(Base):
    __tablename__ = "quiz_answers"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    student_id = Column(
        String,
        nullable=False,
        index=True
    )

    interest = Column(
        String,
        nullable=False
    )
    question_id = Column(
        String,
        nullable=False
    )

    question = Column(
        String,
        nullable=False
    )

    answer = Column(
        String,
        nullable=False
    )

    question_order = Column(
        Integer,
        nullable=False
    )
class InterestAnalysis(Base):
    __tablename__ = "interest_analysis"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    student_id = Column(
        String,
        nullable=False,
        index=True
    )

    interest = Column(
        String,
        nullable=False
    )

    interest_score = Column(
        Float,
        nullable=True
    )

    capability_score = Column(
        Float,
        nullable=True
    )

    experience_level = Column(
        String,
        nullable=True
    )

    analysis = Column(
        String,
        nullable=True
    )


    __tablename__ = "interest_questions"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    interest = Column(
        String,
        nullable=False,
        index=True
    )

    question = Column(
        String,
        nullable=False
    )

    question_order = Column(
        Integer,
        nullable=False
    )