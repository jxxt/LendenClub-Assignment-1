import os
import base64
import secrets
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import hashes, padding
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.backends import default_backend
from dotenv import load_dotenv

load_dotenv()

# Get encryption key from environment or generate one
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")
if not ENCRYPTION_KEY:
    raise ValueError("ENCRYPTION_KEY not found in environment variables")

# Derive AES key using HKDF


def derive_aes_key(master_key: bytes, salt: bytes = b"woosh-chat-salt", info: bytes = b"aes-session-key") -> bytes:
    """
    Derive 256-bit AES key using HKDF with HMAC-SHA256.

    Args:
        master_key: Master secret key
        salt: Salt for HKDF
        info: Context info for HKDF

    Returns:
        32-byte AES key
    """
    hkdf = HKDF(
        algorithm=hashes.SHA256(),
        length=32,  # 256 bits
        salt=salt,
        info=info,
        backend=default_backend()
    )
    return hkdf.derive(master_key)


# Derive the AES key from the master encryption key
AES_KEY = derive_aes_key(ENCRYPTION_KEY.encode())


def encrypt_message(plaintext: str) -> str:
    """
    Encrypt a message using AES-256-CBC.

    Flow:
    1. Generate random 16-byte IV
    2. Apply PKCS7 padding to plaintext
    3. Encrypt using AES-256-CBC
    4. Prepend IV to ciphertext
    5. Base64 encode the result

    Args:
        plaintext: Plain text message to encrypt

    Returns:
        Base64 encoded string: Base64(IV || ciphertext)
    """
    # Generate random 16-byte IV
    iv = secrets.token_bytes(16)

    # Create cipher
    cipher = Cipher(
        algorithms.AES(AES_KEY),
        modes.CBC(iv),
        backend=default_backend()
    )
    encryptor = cipher.encryptor()

    # Apply PKCS7 padding (128-bit block size)
    padder = padding.PKCS7(128).padder()
    padded_data = padder.update(plaintext.encode('utf-8')) + padder.finalize()

    # Encrypt
    ciphertext = encryptor.update(padded_data) + encryptor.finalize()

    # Prepend IV to ciphertext and Base64 encode
    result = iv + ciphertext
    return base64.b64encode(result).decode('utf-8')


def decrypt_message(encrypted_message: str) -> str:
    """
    Decrypt a message encrypted with AES-256-CBC.

    Flow:
    1. Base64 decode the message
    2. Split IV (first 16 bytes) and ciphertext
    3. Decrypt using AES-256-CBC
    4. Remove PKCS7 padding
    5. Decode to UTF-8 string

    Args:
        encrypted_message: Base64 encoded encrypted message

    Returns:
        Decrypted plaintext string
    """
    # Base64 decode
    encrypted_data = base64.b64decode(encrypted_message)

    # Split IV and ciphertext
    iv = encrypted_data[:16]
    ciphertext = encrypted_data[16:]

    # Create cipher
    cipher = Cipher(
        algorithms.AES(AES_KEY),
        modes.CBC(iv),
        backend=default_backend()
    )
    decryptor = cipher.decryptor()

    # Decrypt
    padded_plaintext = decryptor.update(ciphertext) + decryptor.finalize()

    # Remove PKCS7 padding
    unpadder = padding.PKCS7(128).unpadder()
    plaintext = unpadder.update(padded_plaintext) + unpadder.finalize()

    return plaintext.decode('utf-8')
