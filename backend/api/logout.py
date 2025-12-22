from fastapi import APIRouter, Response

router = APIRouter()


@router.post("/logout")
async def logout(response: Response):
    # Delete the token cookie
    response.delete_cookie(key="token")
    return {"message": "Logged out successfully"}
