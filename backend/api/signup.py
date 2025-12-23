from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from utils import generate_auth_id, email_exists, create_user
from password_utils import hash_password
from encryption_utils import encrypt_message

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

    # Hash password using Argon2
    hashed_password = hash_password(request.password)

    # Encrypt Aadhaar using AES-256-CBC
    encrypted_aadhaar = encrypt_message(request.aadhaar)

    # Create user in database
    try:
        create_user(
            auth_id=auth_id,
            name=request.name,
            email=request.email,
            aadhaar=encrypted_aadhaar,
            password=hashed_password
        )
        return {
            "message": "User created successfully",
            "auth_id": auth_id
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to create user: {str(e)}")
