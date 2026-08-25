from database import engine
from models import Base, Student

print("Resetting students table...")

Student.__table__.drop(bind=engine, checkfirst=True)

Student.__table__.create(bind=engine, checkfirst=True)

print("Students table recreated successfully!")