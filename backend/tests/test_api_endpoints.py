import pytest
from fastapi.testclient import TestClient
from unittest.mock import Mock, patch
from main import app


client = TestClient(app)


class TestSignupEndpoint:
    """Test suite for /signup endpoint"""

    @patch('api.signup.email_exists')
    @patch('api.signup.generate_auth_id')
    @patch('api.signup.hash_password')
    @patch('api.signup.encrypt_message')
    @patch('api.signup.create_user')
    def test_signup_success(self, mock_create_user, mock_encrypt, mock_hash, mock_gen_auth, mock_email_exists):
        """Test successful user signup"""
        mock_email_exists.return_value = False
        mock_gen_auth.return_value = "test_auth_id"
        mock_hash.return_value = "hashed_password"
        mock_encrypt.return_value = "encrypted_aadhaar"
        mock_create_user.return_value = True
        
        response = client.post("/signup", json={
            "name": "Test User",
            "email": "test@example.com",
            "aadhaar": "123456789012",
            "password": "TestPass123"
        })
        
        assert response.status_code == 200
        assert response.json()["message"] == "User created successfully"
        assert response.json()["auth_id"] == "test_auth_id"

    @patch('api.signup.email_exists')
    def test_signup_invalid_aadhaar_length(self, mock_email_exists):
        """Test signup with invalid Aadhaar length"""
        mock_email_exists.return_value = False
        
        response = client.post("/signup", json={
            "name": "Test User",
            "email": "test@example.com",
            "aadhaar": "12345",  # Invalid length
            "password": "TestPass123"
        })
        
        assert response.status_code == 400
        assert "Invalid Aadhaar number" in response.json()["detail"]

    @patch('api.signup.email_exists')
    def test_signup_invalid_aadhaar_non_numeric(self, mock_email_exists):
        """Test signup with non-numeric Aadhaar"""
        mock_email_exists.return_value = False
        
        response = client.post("/signup", json={
            "name": "Test User",
            "email": "test@example.com",
            "aadhaar": "12345678901a",  # Contains letter
            "password": "TestPass123"
        })
        
        assert response.status_code == 400
        assert "Invalid Aadhaar number" in response.json()["detail"]

    @patch('api.signup.email_exists')
    def test_signup_email_already_exists(self, mock_email_exists):
        """Test signup with already registered email"""
        mock_email_exists.return_value = True
        
        response = client.post("/signup", json={
            "name": "Test User",
            "email": "existing@example.com",
            "aadhaar": "123456789012",
            "password": "TestPass123"
        })
        
        assert response.status_code == 400
        assert "Email already registered" in response.json()["detail"]

    def test_signup_invalid_email_format(self):
        """Test signup with invalid email format"""
        response = client.post("/signup", json={
            "name": "Test User",
            "email": "invalid-email",
            "aadhaar": "123456789012",
            "password": "TestPass123"
        })
        
        assert response.status_code == 422  # Validation error


class TestLoginEndpoint:
    """Test suite for /login endpoint"""

    @patch('api.login.get_user_by_email')
    @patch('api.login.verify_password')
    @patch('api.login.create_jwt_token')
    @patch('api.login.decrypt_message')
    def test_login_success(self, mock_decrypt, mock_create_token, mock_verify_pwd, mock_get_user):
        """Test successful login"""
        mock_get_user.return_value = {
            "auth_id": "test_auth",
            "name": "Test User",
            "email": "test@example.com",
            "aadhaar": "encrypted_aadhaar",
            "password": "hashed_password"
        }
        mock_verify_pwd.return_value = True
        mock_create_token.return_value = "jwt_token"
        mock_decrypt.return_value = "123456789012"
        
        response = client.post("/login", json={
            "email": "test@example.com",
            "password": "TestPass123"
        })
        
        assert response.status_code == 200
        assert response.json()["message"] == "Login successful"
        assert "user" in response.json()

    @patch('api.login.get_user_by_email')
    def test_login_user_not_found(self, mock_get_user):
        """Test login with non-existent email"""
        mock_get_user.return_value = None
        
        response = client.post("/login", json={
            "email": "notfound@example.com",
            "password": "TestPass123"
        })
        
        assert response.status_code == 401
        assert "Invalid email or password" in response.json()["detail"]

    @patch('api.login.get_user_by_email')
    @patch('api.login.verify_password')
    def test_login_wrong_password(self, mock_verify_pwd, mock_get_user):
        """Test login with incorrect password"""
        mock_get_user.return_value = {
            "auth_id": "test_auth",
            "password": "hashed_password"
        }
        mock_verify_pwd.return_value = False
        
        response = client.post("/login", json={
            "email": "test@example.com",
            "password": "WrongPassword"
        })
        
        assert response.status_code == 401
        assert "Invalid email or password" in response.json()["detail"]


class TestVerifyEndpoint:
    """Test suite for /verify endpoint"""

    @patch('api.verify.verify_jwt_token')
    @patch('api.verify.get_user_by_auth_id')
    @patch('api.verify.decrypt_message')
    def test_verify_success(self, mock_decrypt, mock_get_user, mock_verify_token):
        """Test successful token verification"""
        mock_verify_token.return_value = {"user_id": "test_auth"}
        mock_get_user.return_value = {
            "auth_id": "test_auth",
            "name": "Test User",
            "email": "test@example.com",
            "aadhaar": "encrypted_aadhaar"
        }
        mock_decrypt.return_value = "123456789012"
        
        response = client.get("/verify", cookies={"token": "valid_jwt_token"})
        
        assert response.status_code == 200
        assert response.json()["valid"] is True
        assert "user" in response.json()

    def test_verify_no_token(self):
        """Test verification without token"""
        response = client.get("/verify")
        
        assert response.status_code == 401
        assert response.json()["valid"] is False

    @patch('api.verify.verify_jwt_token')
    def test_verify_invalid_token(self, mock_verify_token):
        """Test verification with invalid token"""
        mock_verify_token.return_value = None
        
        response = client.get("/verify", cookies={"token": "invalid_token"})
        
        assert response.status_code == 401
        assert response.json()["valid"] is False

    @patch('api.verify.verify_jwt_token')
    @patch('api.verify.get_user_by_auth_id')
    def test_verify_user_not_found(self, mock_get_user, mock_verify_token):
        """Test verification when user no longer exists"""
        mock_verify_token.return_value = {"user_id": "deleted_user"}
        mock_get_user.return_value = None
        
        response = client.get("/verify", cookies={"token": "valid_token"})
        
        assert response.status_code == 404


class TestLogoutEndpoint:
    """Test suite for /logout endpoint"""

    def test_logout_success(self):
        """Test successful logout"""
        response = client.post("/logout")
        
        assert response.status_code == 200
        assert response.json()["message"] == "Logged out successfully"
        # Check that token cookie is cleared
        assert "token" in response.cookies or response.headers.get("set-cookie")
