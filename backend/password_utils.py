from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, InvalidHashError

# Initialize Argon2 PasswordHasher with secure defaults
ph = PasswordHasher()


def hash_password(password: str) -> str:
    """
    Hash a password using Argon2 algorithm.

    Args:
        password: Plain text password to hash

    Returns:
        Hashed password with embedded salt
    """
    return ph.hash(password)


def verify_password(hashed_password: str, password: str) -> bool:
    """
    Verify a password against its Argon2 hash.

    Args:
        hashed_password: The Argon2 hash to verify against
        password: Plain text password to verify

    Returns:
        True if password matches, False otherwise
    """
    try:
        ph.verify(hashed_password, password)
        return True
    except (VerifyMismatchError, InvalidHashError):
        return False
