from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.signup import router as signup_router
from api.login import router as login_router
from api.verify import router as verify_router
from api.logout import router as logout_router

app = FastAPI(title="Authentication API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(signup_router)
app.include_router(login_router)
app.include_router(verify_router)
app.include_router(logout_router)


@app.get("/")
def read_root():
    return {"message": "Authentication API is running"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)
