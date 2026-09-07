from fastapi import Depends,HTTPException
from fastapi.security import HTTPBearer,HTTPAuthorizationCredentials
from firebase_admin import auth as firebase_auth 
import firebase_admin_config 

security = HTTPBearer()

def get_current_user(
    credentials:HTTPAuthorizationCredentials=Depends(security)
):
    """
    Verfiy the Firebase ID token sent by the frontend
    Expected header:
    Authorization: Bearer <firebase_id_token> 
    """
    token = credentials.credentials
    try:
        # token = credentials.credentials
        decoded_token = firebase_auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials")
def require_student(
    current_user:dict = Depends(get_current_user)
):
    """
    Only allow students to access.
    """
    role = current_user.get("role")
    if role != "student":
        raise HTTPException(status_code=403, detail="Only students can access")
    
    return current_user
def require_teacher(
    current_user:dict = Depends(get_current_user)
):
    """
    Only allow teachers to access.
    """
    role = current_user.get("role")
    if role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can access")
    
    return current_user