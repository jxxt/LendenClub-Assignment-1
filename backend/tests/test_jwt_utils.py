import pytest
import jwt
import time
from datetime import datetime, timedelta
from jwt_utils import create_jwt_token, verify_jwt_token, JWT_SECRET_KEY, JWT_ALGORITHM


class TestJWTUtils:
    """Test suite for JWT token generation and verification utilities"""

    def test_create_jwt_token_returns_string(self):
        """Test that create_jwt_token returns a string"""
        user_id = "test_user_123"
        token = create_jwt_token(user_id)
        assert isinstance(token, str)
        assert len(token) > 0

    def test_create_jwt_token_contains_user_id(self):
        """Test that created token contains the user_id"""
        user_id = "test_user_456"
        token = create_jwt_token(user_id)
        payload = verify_jwt_token(token)
        assert payload is not None
        assert payload['user_id'] == user_id

    def test_verify_jwt_token_valid_token(self):
        """Test verification of a valid token"""
        user_id = "valid_user"
        token = create_jwt_token(user_id)
        payload = verify_jwt_token(token)
        assert payload is not None
        assert 'user_id' in payload
        assert 'exp' in payload
        assert payload['user_id'] == user_id

    def test_verify_jwt_token_invalid_token(self):
        """Test verification of an invalid token"""
        invalid_token = "invalid.token.string"
        payload = verify_jwt_token(invalid_token)
        assert payload is None

    def test_verify_jwt_token_empty_string(self):
        """Test verification with empty string"""
        payload = verify_jwt_token("")
        assert payload is None

    def test_verify_jwt_token_with_wrong_secret(self):
        """Test token created with different secret"""
        user_id = "test_user"
        wrong_token = jwt.encode(
            {"user_id": user_id, "exp": datetime.utcnow() + timedelta(days=1)},
            "wrong_secret_key",
            algorithm=JWT_ALGORITHM
        )
        payload = verify_jwt_token(wrong_token)
        assert payload is None

    def test_token_expiration_time(self):
        """Test that token has correct expiration time (1 day)"""
        user_id = "expiry_test_user"
        token = create_jwt_token(user_id)
        payload = verify_jwt_token(token)
        
        exp_timestamp = payload['exp']
        exp_datetime = datetime.utcfromtimestamp(exp_timestamp)
        now = datetime.utcnow()
        
        # Should expire in approximately 1 day (with 1 minute tolerance)
        time_diff = exp_datetime - now
        assert timedelta(hours=23, minutes=59) <= time_diff <= timedelta(days=1, minutes=1)

    def test_verify_jwt_token_expired(self):
        """Test verification of an expired token"""
        user_id = "expired_user"
        # Create token that expires immediately
        expired_payload = {
            "user_id": user_id,
            "exp": datetime.utcnow() - timedelta(seconds=1)
        }
        expired_token = jwt.encode(expired_payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
        
        # Wait a moment to ensure expiration
        time.sleep(0.1)
        
        payload = verify_jwt_token(expired_token)
        assert payload is None

    def test_create_multiple_tokens_different_users(self):
        """Test creating tokens for different users"""
        user_id_1 = "user_one"
        user_id_2 = "user_two"
        
        token_1 = create_jwt_token(user_id_1)
        token_2 = create_jwt_token(user_id_2)
        
        assert token_1 != token_2
        
        payload_1 = verify_jwt_token(token_1)
        payload_2 = verify_jwt_token(token_2)
        
        assert payload_1['user_id'] == user_id_1
        assert payload_2['user_id'] == user_id_2

    def test_token_with_special_characters_in_user_id(self):
        """Test token creation with special characters in user_id"""
        user_id = "user@123_test-id"
        token = create_jwt_token(user_id)
        payload = verify_jwt_token(token)
        assert payload is not None
        assert payload['user_id'] == user_id

    def test_token_with_long_user_id(self):
        """Test token creation with long user_id"""
        user_id = "a" * 100
        token = create_jwt_token(user_id)
        payload = verify_jwt_token(token)
        assert payload is not None
        assert payload['user_id'] == user_id

    def test_verify_malformed_token(self):
        """Test verification of malformed token"""
        malformed_tokens = [
            "not.enough.parts",
            "too.many.parts.in.token.here",
            "invalid_format",
            None,
        ]
        for token in malformed_tokens:
            if token is not None:
                payload = verify_jwt_token(token)
                assert payload is None

    def test_token_with_numeric_user_id(self):
        """Test token creation with numeric user_id"""
        user_id = "1234567890"
        token = create_jwt_token(user_id)
        payload = verify_jwt_token(token)
        assert payload is not None
        assert payload['user_id'] == user_id
