from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from utils import get_user_by_email

router = APIRouter()


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


@router.post("/login")
async def login(request: LoginRequest):
    # Get user by email
    user = get_user_by_email(request.email)

    if not user:
        raise HTTPException(
            status_code=401, detail="Invalid email or password")

    # Verify password
    if user['password'] != request.password:
        raise HTTPException(
            status_code=401, detail="Invalid email or password")

    # Return user data (excluding password)
    return {
        "message": "Login successful",
        "user": {
            "auth_id": user['auth_id'],
            "name": user['name'],
            "email": user['email'],
            "aadhaar": user['aadhaar']
        }
    }
