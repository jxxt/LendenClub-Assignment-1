import string
import random
from firebase_config import get_database


def generate_auth_id():
    """Generate a unique 10-character auth ID"""
    characters = string.ascii_letters + string.digits
    db = get_database()

    while True:
        auth_id = ''.join(random.choices(characters, k=10))
        # Check if auth_id already exists
        existing_user = db.child(auth_id).get()
        if not existing_user:
            return auth_id


def email_exists(email):
    """Check if email already exists in database"""
    db = get_database()
    all_users = db.get()

    if all_users:
        for auth_id, user_data in all_users.items():
            if user_data.get('email') == email:
                return True
    return False


def get_user_by_email(email):
    """Get user data by email"""
    db = get_database()
    all_users = db.get()

    if all_users:
        for auth_id, user_data in all_users.items():
            if user_data.get('email') == email:
                return {**user_data, 'auth_id': auth_id}
    return None


def create_user(auth_id, name, email, aadhaar, password):
    """Create a new user in the database"""
    db = get_database()
    db.child(auth_id).set({
        'name': name,
        'email': email,
        'aadhaar': aadhaar,
        'password': password
    })
    return True


def get_user_by_auth_id(auth_id):
    """Get user data by auth_id"""
    db = get_database()
    user_data = db.child(auth_id).get()

    if user_data:
        return {**user_data, 'auth_id': auth_id}
    return None
