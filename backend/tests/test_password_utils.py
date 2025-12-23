import pytest
from password_utils import hash_password, verify_password
from argon2.exceptions import InvalidHashError


class TestPasswordUtils:
    """Test suite for password hashing and verification utilities"""

    def test_hash_password_returns_string(self):
        """Test that hash_password returns a string"""
        password = "testpassword123"
        hashed = hash_password(password)
        assert isinstance(hashed, str)
        assert len(hashed) > 0

    def test_hash_password_different_hashes_for_same_password(self):
        """Test that same password produces different hashes (salt is random)"""
        password = "testpassword123"
        hash1 = hash_password(password)
        hash2 = hash_password(password)
        assert hash1 != hash2

    def test_verify_password_correct_password(self):
        """Test that verify_password returns True for correct password"""
        password = "mySecurePassword123!"
        hashed = hash_password(password)
        assert verify_password(hashed, password) is True

    def test_verify_password_incorrect_password(self):
        """Test that verify_password returns False for incorrect password"""
        password = "correctPassword"
        wrong_password = "wrongPassword"
        hashed = hash_password(password)
        assert verify_password(hashed, wrong_password) is False

    def test_verify_password_empty_password(self):
        """Test verification with empty password"""
        password = "testpassword"
        hashed = hash_password(password)
        assert verify_password(hashed, "") is False

    def test_verify_password_with_special_characters(self):
        """Test password with special characters"""
        password = "p@ssw0rd!#$%^&*()"
        hashed = hash_password(password)
        assert verify_password(hashed, password) is True

    def test_verify_password_with_unicode_characters(self):
        """Test password with unicode characters"""
        password = "पासवर्ड123"
        hashed = hash_password(password)
        assert verify_password(hashed, password) is True

    def test_verify_password_case_sensitive(self):
        """Test that password verification is case-sensitive"""
        password = "TestPassword"
        hashed = hash_password(password)
        assert verify_password(hashed, "testpassword") is False
        assert verify_password(hashed, "TESTPASSWORD") is False

    def test_verify_password_with_invalid_hash(self):
        """Test verify_password with invalid hash format"""
        invalid_hash = "not_a_valid_argon2_hash"
        password = "testpassword"
        assert verify_password(invalid_hash, password) is False

    def test_hash_password_long_password(self):
        """Test hashing a very long password"""
        long_password = "a" * 1000
        hashed = hash_password(long_password)
        assert verify_password(hashed, long_password) is True

    def test_hash_password_with_whitespace(self):
        """Test password with leading/trailing whitespace"""
        password = "  password with spaces  "
        hashed = hash_password(password)
        assert verify_password(hashed, password) is True
        assert verify_password(hashed, password.strip()) is False
