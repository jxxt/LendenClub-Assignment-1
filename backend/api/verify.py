from fastapi import APIRouter, HTTPException, Cookie
from pydantic import BaseModel
from jwt_utils import verify_jwt_token
from utils import get_user_by_auth_id
from encryption_utils import decrypt_message

router = APIRouter()


class VerifyResponse(BaseModel):
    valid: bool
    user: dict = None


@router.get("/verify")
async def verify_token(token: str = Cookie(None)):
    if not token:
        raise HTTPException(status_code=401, detail="No token provided")

    # Verify token
    payload = verify_jwt_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    # Get user data
    user = get_user_by_auth_id(payload['user_id'])

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    # Decrypt Aadhaar before sending to client
    decrypted_aadhaar = decrypt_message(user['aadhaar'])

    return {
        "valid": True,
        "user": {
            "auth_id": user['auth_id'],
            "name": user['name'],
            "email": user['email'],
            "aadhaar": decrypted_aadhaar
        }
    }
