import pytest
import base64
from encryption_utils import encrypt_message, decrypt_message


class TestEncryptionUtils:
    """Test suite for AES-256-CBC encryption and decryption utilities"""

    def test_encrypt_message_returns_base64_string(self):
        """Test that encrypt_message returns a base64 encoded string"""
        plaintext = "Hello, World!"
        encrypted = encrypt_message(plaintext)
        assert isinstance(encrypted, str)
        # Should be valid base64
        try:
            base64.b64decode(encrypted)
        except Exception:
            pytest.fail("Encrypted message is not valid base64")

    def test_encrypt_decrypt_round_trip(self):
        """Test that encryption and decryption work correctly"""
        plaintext = "This is a secret message"
        encrypted = encrypt_message(plaintext)
        decrypted = decrypt_message(encrypted)
        assert decrypted == plaintext

    def test_encrypt_decrypt_with_special_characters(self):
        """Test encryption/decryption with special characters"""
        plaintext = "!@#$%^&*()_+-=[]{}|;:',.<>?/~`"
        encrypted = encrypt_message(plaintext)
        decrypted = decrypt_message(encrypted)
        assert decrypted == plaintext

    def test_encrypt_decrypt_with_unicode(self):
        """Test encryption/decryption with unicode characters"""
        plaintext = "Hello 世界! Привет नमस्ते"
        encrypted = encrypt_message(plaintext)
        decrypted = decrypt_message(encrypted)
        assert decrypted == plaintext

    def test_encrypt_empty_string(self):
        """Test encryption of empty string"""
        plaintext = ""
        encrypted = encrypt_message(plaintext)
        decrypted = decrypt_message(encrypted)
        assert decrypted == plaintext

    def test_encrypt_long_message(self):
        """Test encryption of a long message"""
        plaintext = "A" * 10000
        encrypted = encrypt_message(plaintext)
        decrypted = decrypt_message(encrypted)
        assert decrypted == plaintext

    def test_encrypt_aadhaar_number(self):
        """Test encryption of 12-digit Aadhaar number"""
        aadhaar = "123456789012"
        encrypted = encrypt_message(aadhaar)
        decrypted = decrypt_message(encrypted)
        assert decrypted == aadhaar

    def test_different_encryptions_same_plaintext(self):
        """Test that same plaintext produces different ciphertexts (random IV)"""
        plaintext = "Same message"
        encrypted1 = encrypt_message(plaintext)
        encrypted2 = encrypt_message(plaintext)
        assert encrypted1 != encrypted2
        # Both should decrypt to same plaintext
        assert decrypt_message(encrypted1) == plaintext
        assert decrypt_message(encrypted2) == plaintext

    def test_encrypt_with_newlines(self):
        """Test encryption with newlines"""
        plaintext = "Line 1\nLine 2\nLine 3"
        encrypted = encrypt_message(plaintext)
        decrypted = decrypt_message(encrypted)
        assert decrypted == plaintext

    def test_encrypt_with_tabs(self):
        """Test encryption with tab characters"""
        plaintext = "Column1\tColumn2\tColumn3"
        encrypted = encrypt_message(plaintext)
        decrypted = decrypt_message(encrypted)
        assert decrypted == plaintext

    def test_decrypt_invalid_base64(self):
        """Test decryption with invalid base64 string"""
        invalid_encrypted = "not_valid_base64!!!"
        with pytest.raises(Exception):
            decrypt_message(invalid_encrypted)

    def test_decrypt_tampered_ciphertext(self):
        """Test decryption with tampered ciphertext"""
        plaintext = "Original message"
        encrypted = encrypt_message(plaintext)
        # Tamper with the encrypted message
        encrypted_bytes = base64.b64decode(encrypted)
        tampered = encrypted_bytes[:-1] + b'X'
        tampered_encrypted = base64.b64encode(tampered).decode('utf-8')
        with pytest.raises(Exception):
            decrypt_message(tampered_encrypted)

    def test_encrypt_numeric_string(self):
        """Test encryption of numeric strings"""
        plaintext = "1234567890"
        encrypted = encrypt_message(plaintext)
        decrypted = decrypt_message(encrypted)
        assert decrypted == plaintext

    def test_encrypt_json_string(self):
        """Test encryption of JSON-like string"""
        plaintext = '{"name": "John", "age": 30}'
        encrypted = encrypt_message(plaintext)
        decrypted = decrypt_message(encrypted)
        assert decrypted == plaintext
