from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from utils import generate_auth_id, email_exists, create_user

router = APIRouter()


class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    aadhaar: str
    password: str


@router.post("/signup")
async def signup(request: SignupRequest):
    # Validate Aadhaar number
    if len(request.aadhaar) != 12 or not request.aadhaar.isdigit():
        raise HTTPException(status_code=400, detail="Invalid Aadhaar number")

    # Check if email already exists
    if email_exists(request.email):
        raise HTTPException(status_code=400, detail="Email already registered")

    # Generate unique auth ID
    auth_id = generate_auth_id()

    # Create user in database
    try:
        create_user(
            auth_id=auth_id,
            name=request.name,
            email=request.email,
            aadhaar=request.aadhaar,
            password=request.password
        )
        return {
            "message": "User created successfully",
            "auth_id": auth_id
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to create user: {str(e)}")
