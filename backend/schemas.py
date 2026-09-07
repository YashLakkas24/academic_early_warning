from pydantic import BaseModel

class LoginRequest(BaseModel):
    user_id:str
    password:str  #what react will send to FASTAPI
    role:str
class LoginResponse(BaseModel):
    message:str
    user_id:str
    full_name:str # what fastapi will return after successful login
    role:str
    firebase_token: str
