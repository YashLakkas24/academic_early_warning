from database import Base, engine
from models import StudentInterest

print("Creating Interest+ tables...")

Base.metadata.create_all(bind=engine)

print("Interest+ tables created successfully!")