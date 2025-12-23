import pytest
from unittest.mock import Mock, patch, MagicMock
from utils import generate_auth_id, email_exists, get_user_by_email, create_user, get_user_by_auth_id


class TestUtils:
    """Test suite for utility functions"""

    @patch('utils.get_database')
    def test_generate_auth_id_length(self, mock_db):
        """Test that generated auth_id is 10 characters long"""
        mock_db_instance = Mock()
        mock_db_instance.child.return_value.get.return_value = None
        mock_db.return_value = mock_db_instance
        
        auth_id = generate_auth_id()
        assert len(auth_id) == 10

    @patch('utils.get_database')
    def test_generate_auth_id_alphanumeric(self, mock_db):
        """Test that generated auth_id contains only alphanumeric characters"""
        mock_db_instance = Mock()
        mock_db_instance.child.return_value.get.return_value = None
        mock_db.return_value = mock_db_instance
        
        auth_id = generate_auth_id()
        assert auth_id.isalnum()

    @patch('utils.get_database')
    def test_generate_auth_id_unique(self, mock_db):
        """Test that generate_auth_id checks for uniqueness"""
        mock_db_instance = Mock()
        # First call returns existing user, second returns None (unique)
        mock_db_instance.child.return_value.get.side_effect = [{"name": "existing"}, None]
        mock_db.return_value = mock_db_instance
        
        auth_id = generate_auth_id()
        assert auth_id is not None
        assert len(auth_id) == 10

    @patch('utils.get_database')
    def test_email_exists_returns_true_when_email_found(self, mock_db):
        """Test email_exists returns True when email is found"""
        mock_db_instance = Mock()
        mock_db_instance.get.return_value = {
            "user1": {"email": "test@example.com", "name": "Test"},
            "user2": {"email": "other@example.com", "name": "Other"}
        }
        mock_db.return_value = mock_db_instance
        
        result = email_exists("test@example.com")
        assert result is True

    @patch('utils.get_database')
    def test_email_exists_returns_false_when_email_not_found(self, mock_db):
        """Test email_exists returns False when email is not found"""
        mock_db_instance = Mock()
        mock_db_instance.get.return_value = {
            "user1": {"email": "test@example.com", "name": "Test"}
        }
        mock_db.return_value = mock_db_instance
        
        result = email_exists("notfound@example.com")
        assert result is False

    @patch('utils.get_database')
    def test_email_exists_returns_false_when_no_users(self, mock_db):
        """Test email_exists returns False when database is empty"""
        mock_db_instance = Mock()
        mock_db_instance.get.return_value = None
        mock_db.return_value = mock_db_instance
        
        result = email_exists("test@example.com")
        assert result is False

    @patch('utils.get_database')
    def test_get_user_by_email_found(self, mock_db):
        """Test get_user_by_email returns user data when found"""
        mock_db_instance = Mock()
        mock_db_instance.get.return_value = {
            "auth123": {
                "email": "test@example.com",
                "name": "Test User",
                "aadhaar": "encrypted_aadhaar",
                "password": "hashed_password"
            }
        }
        mock_db.return_value = mock_db_instance
        
        user = get_user_by_email("test@example.com")
        assert user is not None
        assert user['email'] == "test@example.com"
        assert user['name'] == "Test User"
        assert user['auth_id'] == "auth123"

    @patch('utils.get_database')
    def test_get_user_by_email_not_found(self, mock_db):
        """Test get_user_by_email returns None when not found"""
        mock_db_instance = Mock()
        mock_db_instance.get.return_value = {
            "auth123": {"email": "other@example.com", "name": "Other"}
        }
        mock_db.return_value = mock_db_instance
        
        user = get_user_by_email("notfound@example.com")
        assert user is None

    @patch('utils.get_database')
    def test_get_user_by_email_empty_database(self, mock_db):
        """Test get_user_by_email with empty database"""
        mock_db_instance = Mock()
        mock_db_instance.get.return_value = None
        mock_db.return_value = mock_db_instance
        
        user = get_user_by_email("test@example.com")
        assert user is None

    @patch('utils.get_database')
    def test_create_user_success(self, mock_db):
        """Test create_user successfully creates a user"""
        mock_db_instance = Mock()
        mock_child = Mock()
        mock_db_instance.child.return_value = mock_child
        mock_db.return_value = mock_db_instance
        
        result = create_user(
            auth_id="auth123",
            name="Test User",
            email="test@example.com",
            aadhaar="encrypted_aadhaar",
            password="hashed_password"
        )
        
        assert result is True
        mock_db_instance.child.assert_called_once_with("auth123")
        mock_child.set.assert_called_once()

    @patch('utils.get_database')
    def test_create_user_with_special_characters(self, mock_db):
        """Test create_user with special characters in name"""
        mock_db_instance = Mock()
        mock_child = Mock()
        mock_db_instance.child.return_value = mock_child
        mock_db.return_value = mock_db_instance
        
        result = create_user(
            auth_id="auth456",
            name="Test O'Brien-Smith",
            email="test@example.com",
            aadhaar="encrypted",
            password="hashed"
        )
        
        assert result is True

    @patch('utils.get_database')
    def test_get_user_by_auth_id_found(self, mock_db):
        """Test get_user_by_auth_id returns user when found"""
        mock_db_instance = Mock()
        mock_child = Mock()
        mock_child.get.return_value = {
            "name": "Test User",
            "email": "test@example.com",
            "aadhaar": "encrypted",
            "password": "hashed"
        }
        mock_db_instance.child.return_value = mock_child
        mock_db.return_value = mock_db_instance
        
        user = get_user_by_auth_id("auth123")
        assert user is not None
        assert user['name'] == "Test User"
        assert user['auth_id'] == "auth123"

    @patch('utils.get_database')
    def test_get_user_by_auth_id_not_found(self, mock_db):
        """Test get_user_by_auth_id returns None when not found"""
        mock_db_instance = Mock()
        mock_child = Mock()
        mock_child.get.return_value = None
        mock_db_instance.child.return_value = mock_child
        mock_db.return_value = mock_db_instance
        
        user = get_user_by_auth_id("nonexistent")
        assert user is None
