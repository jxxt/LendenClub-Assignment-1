from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel, EmailStr
from utils import get_user_by_email
from jwt_utils import create_jwt_token
from password_utils import verify_password

router = APIRouter()


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


@router.post("/login")
async def login(request: LoginRequest, response: Response):
    # Get user by email
    user = get_user_by_email(request.email)

    if not user:
        raise HTTPException(
            status_code=401, detail="Invalid email or password")

    # Verify password using Argon2
    if not verify_password(user['password'], request.password):
        raise HTTPException(
            status_code=401, detail="Invalid email or password")

    # Create JWT token with user_id (auth_id)
    token = create_jwt_token(user['auth_id'])

    # Set JWT as httpOnly cookie (expires in 1 day = 86400 seconds)
    response.set_cookie(
        key="token",
        value=token,
        httponly=True,
        max_age=86400,  # 1 day in seconds
        samesite="lax",
        secure=False  # Set to True in production with HTTPS
    )

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
