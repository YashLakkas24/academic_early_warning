from sqlalchemy import Column, Integer, String
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

    roll_number = Column(
        String,
        nullable=False
    )

    name = Column(
        String,
        nullable=False
    )

    education_level = Column(
        String,
        nullable=False
    )

    class_name = Column(
        String,
        nullable=True
    )

    division = Column(
        String,
        nullable=True
    )