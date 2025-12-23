import pytest
import os
from dotenv import load_dotenv


@pytest.fixture(scope="session", autouse=True)
def load_test_env():
    """Load environment variables for testing"""
    load_dotenv()
    
    # Set test environment variables if not already set
    if not os.getenv("ENCRYPTION_KEY"):
        os.environ["ENCRYPTION_KEY"] = "test_encryption_key_32_bytes_long"
    
    if not os.getenv("JWT_SECRET_KEY"):
        os.environ["JWT_SECRET_KEY"] = "test_jwt_secret_key"
    
    if not os.getenv("JWT_ALGORITHM"):
        os.environ["JWT_ALGORITHM"] = "HS256"


@pytest.fixture
def sample_user_data():
    """Fixture providing sample user data for tests"""
    return {
        "auth_id": "testAuth123",
        "name": "Test User",
        "email": "test@example.com",
        "aadhaar": "123456789012",
        "password": "TestPassword123"
    }


@pytest.fixture
def sample_encrypted_data():
    """Fixture providing sample encrypted data"""
    return {
        "encrypted_aadhaar": "base64_encrypted_string_here",
        "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$hash_here"
    }


@pytest.fixture
def valid_jwt_payload():
    """Fixture providing valid JWT payload"""
    return {
        "user_id": "testAuth123",
        "exp": 1735689600  # Future timestamp
    }
