# Authentication System Documentation

## Project Overview

This is a production-ready full-stack authentication system with React frontend and FastAPI backend, featuring industry-standard security practices including JWT authentication, Argon2 password hashing, and AES-256 encryption for sensitive data.

## Technology Stack

-   **Frontend**: React + Vite
-   **Backend**: FastAPI (Python)
-   **Database**: Firebase Realtime Database
-   **Routing**: React Router DOM
-   **Authentication**: JWT (JSON Web Tokens) with HTTP-only cookies
-   **Password Security**: Argon2 (industry-standard hashing)
-   **Data Encryption**: AES-256-CBC with HKDF key derivation
-   **Cryptography**: PyJWT, cryptography library

## Project Structure

```
LendenClub-Assignment-1/
├── backend/
│   ├── api/
│   │   ├── __init__.py
│   │   ├── signup.py         # Signup endpoint with encryption
│   │   ├── login.py          # Login endpoint with JWT
│   │   ├── verify.py         # Token verification endpoint
│   │   └── logout.py         # Logout endpoint
│   ├── firebase_config.py    # Firebase initialization
│   ├── utils.py              # Database helper functions
│   ├── password_utils.py     # Argon2 password hashing
│   ├── jwt_utils.py          # JWT token creation & verification
│   ├── encryption_utils.py   # AES-256 encryption/decryption
│   ├── main.py               # FastAPI app entry point
│   ├── requirements.txt      # Python dependencies
│   ├── .env                  # Environment variables (DO NOT COMMIT)
│   └── FirebaseServiceAccount.json # Firebase credentials
├── src/
│   ├── pages/
│   │   ├── Home.jsx          # Protected home page
│   │   ├── Login.jsx         # Login page with JWT auth
│   │   ├── Signup.jsx        # Signup page
│   │   └── Profile.jsx       # User profile page
│   ├── App.jsx               # Routes configuration
│   └── main.jsx              # React entry point
├── .env                      # Frontend environment variables
├── vite.config.js            # Vite configuration (port 8001)
├── package.json              # Node dependencies
└── DOCUMENTATION.md          # This file
```

## Features

### 1. User Signup

-   **Route**: `/signup`
-   **Fields**:
    -   Name (text)
    -   Email (email validation)
    -   Aadhaar Number (12 digits validation)
    -   Password (minimum 6 characters)
    -   Confirm Password (must match password)
-   **Backend Endpoint**: `POST http://localhost:8002/signup`
-   **Security**:
    -   Password hashed using **Argon2** (industry-standard)
    -   Aadhaar encrypted using **AES-256-CBC** encryption
    -   Email uniqueness check
-   **Validation**:
    -   All fields required
    -   Email format validation
    -   Aadhaar must be exactly 12 digits
    -   Password confirmation match
-   **On Success**: Redirects to `/login`

### 2. User Login

-   **Route**: `/login`
-   **Fields**:
    -   Email
    -   Password
-   **Backend Endpoint**: `POST http://localhost:8002/login`
-   **Security**:
    -   Password verified using Argon2
    -   JWT token generated with 1-day expiration
    -   Token stored in **HTTP-only cookie** (secure, XSS-proof)
-   **Validation**:
    -   All fields required
    -   Email/password verification against database
-   **On Success**: Sets JWT cookie and redirects to `/`

### 3. Home Page

-   **Route**: `/`
-   **Display**: "Hello {name}" message with navigation buttons
-   **Protection**: Automatically verifies JWT token on load
-   **Features**:
    -   View Profile button
    -   Sign Out button
-   **Session**: Persistent - token verified on page load

### 4. Profile Page (NEW)

-   **Route**: `/profile`
-   **Display**: Complete user profile with detailed information
-   **Features**:
    -   User avatar with first letter of name
    -   Full name, email, Aadhaar (decrypted), and user ID display
    -   Security badge showing encryption status
    -   Back to Home and Sign Out buttons
-   **Protection**: Requires valid JWT token
-   **Design**: Modern dark theme with gradient effects

### 5. Token Verification (NEW)

-   **Endpoint**: `GET http://localhost:8002/verify`
-   **Purpose**: Verifies JWT token from HTTP-only cookie
-   **Returns**: User data if token is valid
-   **Security**: Automatically decrypts Aadhaar before sending to client
-   **Usage**: Called on page load/refresh to maintain session

### 6. Logout (NEW)

-   **Endpoint**: `POST http://localhost:8002/logout`
-   **Purpose**: Clears JWT token cookie
-   **Action**: Deletes HTTP-only cookie
-   **Result**: User redirected to login page

## Security Implementation

### 1. Password Security (Argon2)

-   **Algorithm**: Argon2 (winner of Password Hashing Competition 2015)
-   **Implementation**: Using `argon2-cffi` library
-   **Features**:
    -   Memory-hard algorithm (resistant to GPU attacks)
    -   Automatic salt generation
    -   Configurable time/memory cost
-   **Functions**:
    -   `hash_password(password)`: Creates Argon2 hash
    -   `verify_password(hash, password)`: Verifies password

### 2. Data Encryption (AES-256-CBC)

-   **Algorithm**: AES-256 with CBC mode
-   **Key Derivation**: HKDF (HMAC-based Key Derivation Function) with SHA-256
-   **Implementation**: Using `cryptography` library
-   **Process**:
    1. Master key stored in environment variable
    2. HKDF derives 256-bit AES key from master key
    3. Random 16-byte IV generated for each encryption
    4. PKCS7 padding applied (128-bit block size)
    5. Result: Base64(IV || ciphertext)
-   **Usage**: Encrypts sensitive data like Aadhaar numbers
-   **Functions**:
    -   `encrypt_message(plaintext)`: Encrypts and returns Base64 string
    -   `decrypt_message(encrypted)`: Decrypts Base64 string

### 3. JWT Authentication

-   **Algorithm**: HS256 (HMAC with SHA-256)
-   **Token Lifetime**: 1 day (24 hours)
-   **Storage**: HTTP-only cookie (XSS-proof)
-   **Cookie Settings**:
    -   `httponly=True`: Not accessible via JavaScript
    -   `max_age=86400`: 1 day in seconds
    -   `samesite="lax"`: CSRF protection
    -   `secure=False`: Set to True in production with HTTPS
-   **Payload**:
    ```json
    {
        "user_id": "auth_id",
        "exp": "timestamp"
    }
    ```
-   **Functions**:
    -   `create_jwt_token(user_id)`: Creates signed JWT
    -   `verify_jwt_token(token)`: Verifies and decodes JWT

### 4. Environment Variables

Required in `backend/.env`:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your@email.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_CLIENT_CERT_URL=your_cert_url
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com

# Security Keys (generate strong random keys)
JWT_SECRET_KEY=your_jwt_secret_key_here
JWT_ALGORITHM=HS256
ENCRYPTION_KEY=your_32_byte_encryption_key_here
```

Firebase Realtime Database stores users with the following structure:

```json
{
    "authID_10chars": {
        "name": "John Doe",
        "email": "john@example.com",
        "aadhaar": "base64_encrypted_aadhaar_string",
        "password": "$argon2id$v=19$m=65536,t=3,p=4$..."
    }
}
```

-   **authID**: 10-character unique identifier (alphanumeric)
-   **name**: User's full name
-   **email**: User's email (unique)
-   **aadhaar**: AES-256 encrypted Aadhaar number (Base64 encoded with IV prepended)
-   **password**: Argon2 hashed password with embedded salt

## API Endpoints

### 1. Signup Endpoint

```
POST http://localhost:8002/signup

Request Body:
{
  "name": "string",
  "email": "string",
  "aadhaar": "string",
  "password": "string"
}

Response (Success - 200):
{
  "message": "User created successfully",
  "auth_id": "abc123xyz0"
}

Response (Error - 400):
{
  "detail": "Email already registered"
}
```

**Security Features**:

-   Password hashed with Argon2
-   Aadhaar encrypted with AES-256-CBC
-   Email uniqueness validation

### 2. Login Endpoint

```
POST http://localhost:8002/login

Request Body:
{
  "email": "string",
  "password": "string"
}

Response (Success - 200):
{
  "message": "Login successful",
  "user": {
    "auth_id": "abc123xyz0",
    "name": "John Doe",
    "email": "john@example.com",
    "aadhaar": "base64_encrypted_string"
  }
}
Sets HTTP-only cookie: token=<jwt_token>

Response (Error - 401):
{
  "detail": "Invalid email or password"
}
```

**Security Features**:

-   Argon2 password verification
-   JWT token in HTTP-only cookie
-   1-day token expiration

### 3. Verify Endpoint (NEW)

```
GET http://localhost:8002/verify

Reads cookie: token=<jwt_token>

Response (Success - 200):
{
  "valid": true,
  "user": {
    "auth_id": "abc123xyz0",
    "name": "John Doe",
    "email": "john@example.com",
    "aadhaar": "123456789012"  // Decrypted
  }
}

Response (Error - 401):
{
  "detail": "No token provided" | "Invalid or expired token" | "User not found"
}
```

**Security Features**:

-   Verifies JWT signature and expiration
-   Automatically decrypts Aadhaar
-   Returns plain Aadhaar for display

### 4. Logout Endpoint (NEW)

```
POST http://localhost:8002/logout

Response (Success - 200):
{
  "message": "Logged out successfully"
}

Action: Deletes token cookie
```

**Security Features**:

-   Clears HTTP-only cookie
-   Prevents further authenticated requests

## Setup Instructions

### Prerequisites

-   Node.js (v16 or higher)
-   Python (v3.8 or higher)
-   Firebase Project with Realtime Database enabled

### Frontend Setup

1. Install Node dependencies:

```bash
npm install
```

2. Install React Router DOM:

```bash
npm install react-router-dom
```

3. Configure environment variables in `.env`:

```
VITE_API_URL=http://localhost:8002
```

4. Start the development server:

```bash
npm run dev
```

Frontend will run on `http://localhost:8001`

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Create a virtual environment (recommended):

```bash
python -m venv venv
```

3. Activate virtual environment:

    - Windows: `venv\Scripts\activate`
    - Mac/Linux: `source venv/bin/activate`

4. Install Python dependencies:

```bash
pip install -r requirements.txt
```

5. Configure Firebase credentials and security keys in `backend/.env`:
    - Go to Firebase Console > Project Settings > Service Accounts
    - Generate new private key (downloads JSON file)
    - Extract values from the JSON and add to `.env`:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=assignment1-e31db
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@assignment1-e31db.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40assignment1-e31db.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://assignment1-e31db-default-rtdb.asia-southeast1.firebasedatabase.app

# Security Keys (IMPORTANT: Generate strong random keys)
JWT_SECRET_KEY=your_jwt_secret_key_minimum_32_characters
JWT_ALGORITHM=HS256
ENCRYPTION_KEY=your_32_byte_encryption_key_minimum_32_characters
```

**Generating Secure Keys**:

```python
# For JWT_SECRET_KEY and ENCRYPTION_KEY
import secrets
print(secrets.token_hex(32))  # Generates 64-character hex string
```

6. Start the backend server:

```bash
python main.py
```

Backend will run on `http://localhost:8002`

## Running the Application

1. **Start Backend** (Terminal 1):

```bash
cd backend
python main.py
```

2. **Start Frontend** (Terminal 2):

```bash
npm run dev
```

3. Open browser and navigate to `http://localhost:8001`

## Design Theme

-   **Background**: Black (#000, #0a0a0a, #1a1a1a)
-   **Text**: White (#fff)
-   **Secondary**: Grey (#888, #555, #333, #222, #111)
-   **Accent**: Blue (#3b82f6)
-   **Error**: Red (#ff4444, #dc2626)
-   **Success**: Green gradients
-   **Style**: Minimalist dark theme with gradients, shadows, and modern UI components

## Important Notes

### Security Features (IMPLEMENTED)

1. **Session Persistence**: JWT tokens stored in HTTP-only cookies - sessions persist across page refreshes
2. **Password Hashing**: Argon2 algorithm (industry-standard, memory-hard)
3. **Data Encryption**: AES-256-CBC encryption for sensitive data (Aadhaar)
4. **JWT Authentication**: Secure token-based authentication with 1-day expiration
5. **HTTP-only Cookies**: XSS-proof token storage
6. **CSRF Protection**: SameSite cookie attribute

### Additional Technical Details

7. **Auth ID Generation**: Uses 10-character alphanumeric string, checked for uniqueness
8. **CORS Configuration**: Backend allows requests from `http://localhost:8001` with credentials
9. **Firebase Rules**: Admin SDK bypasses security rules
10. **Token Storage**: Credentials included in all fetch requests for cookie handling

## Firebase Realtime Database Rules

For development, you can use these rules (update for production):

```json
{
    "rules": {
        ".read": "auth != null",
        ".write": "auth != null"
    }
}
```

Since we're using Admin SDK, it bypasses security rules.

## Testing the Application

### Test Signup Flow

1. Navigate to `http://localhost:8001/signup`
2. Fill in all fields with valid data:
    - Name: Any text
    - Email: Valid email format
    - Aadhaar: Exactly 12 digits
    - Password: Minimum 6 characters
    - Confirm Password: Must match password
3. Click "Sign Up"
4. Password is hashed with Argon2
5. Aadhaar is encrypted with AES-256
6. Should redirect to `/login` with success message

### Test Login Flow

1. Navigate to `http://localhost:8001/login`
2. Enter registered email and password
3. Click "Login"
4. Backend verifies password with Argon2
5. JWT token generated and set as HTTP-only cookie
6. Should redirect to `/` showing "Hello {name}"
7. Session persists on page refresh

### Test Session Persistence (NEW)

1. After successful login, navigate to `/`
2. Refresh the page (F5)
3. Should remain logged in - token automatically verified
4. User data retrieved from database

### Test Profile Page (NEW)

1. After login, click "View Profile" button
2. Should navigate to `/profile`
3. Displays:
    - User avatar with first letter
    - Full name, email, decrypted Aadhaar, user ID
    - Security badge
    - Navigation buttons

### Test Logout (NEW)

1. Click "Sign Out" button on Home or Profile page
2. JWT cookie is deleted
3. Should redirect to `/login`
4. Attempting to access `/` or `/profile` redirects to login

## API Testing with curl

### Test Signup

```bash
curl -X POST http://localhost:8002/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "aadhaar": "123456789012",
    "password": "password123"
  }'
```

**Expected**: Password hashed with Argon2, Aadhaar encrypted with AES-256

### Test Login with Cookie

```bash
curl -X POST http://localhost:8002/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected**: JWT token set in cookies.txt file

### Test Verify Token (NEW)

```bash
curl -X GET http://localhost:8002/verify \
  -b cookies.txt
```

**Expected**: Returns user data with decrypted Aadhaar

### Test Logout (NEW)

```bash
curl -X POST http://localhost:8002/logout \
  -b cookies.txt \
  -c cookies.txt
```

**Expected**: Token cookie deleted from cookies.txt

## Troubleshooting

### Frontend Issues

-   **Port already in use**: Change port in `vite.config.js`
-   **API connection failed**: Ensure backend is running on port 8002
-   **Router not working**: Verify `react-router-dom` is installed

### Backend Issues

-   **Firebase connection failed**: Check `.env` credentials
-   **Port 8002 in use**: Change port in `main.py` uvicorn.run()
-   **Import errors**: Ensure all dependencies are installed
-   **CORS errors**: Verify CORS settings in `main.py` and credentials in fetch
-   **JWT errors**: Ensure JWT_SECRET_KEY is set in `.env`
-   **Encryption errors**: Ensure ENCRYPTION_KEY is set in `.env` (minimum 32 characters)
-   **Argon2 errors**: Verify `argon2-cffi` is installed

### Database Issues

-   **User creation fails**: Check Firebase database rules
-   **Duplicate auth ID**: Should be rare with 62^10 combinations
-   **Email not unique**: Check email exists before signup
-   **Aadhaar decryption fails**: Verify ENCRYPTION_KEY matches the one used for encryption

### Security Issues

-   **Token not persisting**: Ensure `credentials: "include"` in all fetch requests
-   **Cookie not set**: Verify CORS allows credentials
-   **Token expired**: JWT expires after 24 hours, user must re-login

## Implemented Features ✅

-   ✅ User Signup with validation
-   ✅ User Login with JWT authentication
-   ✅ Password hashing with Argon2
-   ✅ Aadhaar encryption with AES-256-CBC
-   ✅ JWT token authentication with HTTP-only cookies
-   ✅ Session persistence across page refreshes
-   ✅ Token verification endpoint
-   ✅ Logout functionality
-   ✅ Protected routes (Home, Profile)
-   ✅ User profile page with complete information
-   ✅ Automatic token verification on page load
-   ✅ Secure cookie configuration (HTTP-only, SameSite)
-   ✅ Aadhaar decryption for display

## Future Enhancements (Not Implemented)

-   Email verification during signup
-   Password reset/forgot password functionality
-   Rate limiting for API endpoints
-   Advanced input sanitization
-   Two-factor authentication (2FA)
-   User profile editing capabilities
-   Account deletion
-   Password change functionality
-   Session timeout warnings
-   Remember me functionality with longer token expiration
-   OAuth integration (Google, GitHub, etc.)
-   Admin dashboard
-   Activity logs/audit trail

## Production Deployment Checklist

### Security

-   ✅ Password hashing (Argon2) - IMPLEMENTED
-   ✅ JWT token authentication - IMPLEMENTED
-   ✅ HTTP-only cookies - IMPLEMENTED
-   ✅ Data encryption (AES-256) - IMPLEMENTED
-   ⚠️ Change `secure=True` in cookie settings (requires HTTPS)
-   ⚠️ Set strong, unique JWT_SECRET_KEY and ENCRYPTION_KEY
-   ⚠️ Implement rate limiting
-   ⚠️ Add input sanitization
-   ⚠️ Set up proper Firebase security rules
-   ⚠️ Enable HTTPS/TLS
-   ⚠️ Add request logging and monitoring
-   ⚠️ Implement CSRF token validation
-   ⚠️ Add helmet.js or equivalent security headers

### Environment

-   ⚠️ Use production Firebase project
-   ⚠️ Set production environment variables
-   ⚠️ Configure proper CORS for production domain
-   ⚠️ Use environment-specific configurations
-   ⚠️ Set up proper error logging (Sentry, LogRocket, etc.)

### Performance

-   ⚠️ Enable caching strategies
-   ⚠️ Optimize database queries
-   ⚠️ Add CDN for static assets
-   ⚠️ Implement compression
-   ⚠️ Set up load balancing if needed

## Dependencies

### Frontend (package.json)

```json
{
    "dependencies": {
        "react": "^19.2.0",
        "react-dom": "^19.2.0",
        "react-router-dom": "^7.11.0"
    },
    "devDependencies": {
        "@eslint/js": "^9.39.1",
        "@types/react": "^19.2.5",
        "@types/react-dom": "^19.2.3",
        "@vitejs/plugin-react": "^5.1.1",
        "eslint": "^9.39.1",
        "eslint-plugin-react-hooks": "^7.0.1",
        "eslint-plugin-react-refresh": "^0.4.24",
        "globals": "^16.5.0",
        "vite": "^7.2.4"
    }
}
```

### Backend (requirements.txt)

```
fastapi==0.115.0           # Modern web framework
uvicorn==0.32.0            # ASGI server
python-dotenv==1.0.1       # Environment variable management
firebase-admin==6.5.0      # Firebase SDK
pydantic==2.10.0           # Data validation
pydantic-core==2.27.0      # Pydantic core
email-validator==2.2.0     # Email validation
PyJWT==2.9.0              # JWT token handling (NEW)
argon2-cffi==23.1.0       # Argon2 password hashing (NEW)
cryptography==42.0.5      # AES-256 encryption (NEW)
```

## Key Security Features Summary

| Feature             | Implementation       | Library      |
| ------------------- | -------------------- | ------------ |
| Password Hashing    | Argon2 (memory-hard) | argon2-cffi  |
| Data Encryption     | AES-256-CBC          | cryptography |
| Key Derivation      | HKDF with SHA-256    | cryptography |
| Authentication      | JWT with HS256       | PyJWT        |
| Token Storage       | HTTP-only cookies    | FastAPI      |
| Session Persistence | JWT verification     | Custom       |
| CSRF Protection     | SameSite cookies     | FastAPI      |

## Project Highlights

1. **Production-Ready Security**: Industry-standard Argon2 password hashing and AES-256 encryption
2. **Modern Authentication**: JWT tokens with HTTP-only cookies for XSS protection
3. **Session Management**: Persistent sessions with automatic token verification
4. **Clean Architecture**: Separated concerns with dedicated utility modules
5. **Type Safety**: Pydantic models for request/response validation
6. **Modern UI**: Dark theme with gradient effects and responsive design
7. **Complete Flow**: Signup → Login → Protected Routes → Profile → Logout

## Data Flow Architecture

### Signup Flow

```
User Input → Frontend Validation → POST /signup
→ Backend validates Aadhaar format
→ Check email uniqueness
→ Hash password with Argon2
→ Encrypt Aadhaar with AES-256
→ Store in Firebase
→ Return success → Redirect to /login
```

### Login Flow

```
User Input → POST /login
→ Backend retrieves user by email
→ Verify password with Argon2
→ Generate JWT token (1-day expiration)
→ Set HTTP-only cookie
→ Return user data
→ Frontend stores in state → Redirect to /
```

### Session Verification Flow

```
Page Load/Refresh → GET /verify (sends cookie automatically)
→ Backend reads JWT from cookie
→ Verify JWT signature and expiration
→ Retrieve user from Firebase by auth_id
→ Decrypt Aadhaar
→ Return user data
→ Frontend updates state
```

### Logout Flow

```
User clicks Sign Out → POST /logout (sends cookie)
→ Backend deletes cookie
→ Return success
→ Frontend clears state → Redirect to /login
```

## File Structure Details

### Backend Modules

| File                  | Purpose                                      | Key Functions                                                                                           |
| --------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `main.py`             | FastAPI app setup, CORS, router registration | -                                                                                                       |
| `firebase_config.py`  | Firebase initialization                      | `get_database()`                                                                                        |
| `utils.py`            | Database operations                          | `generate_auth_id()`, `email_exists()`, `create_user()`, `get_user_by_email()`, `get_user_by_auth_id()` |
| `password_utils.py`   | Argon2 password handling                     | `hash_password()`, `verify_password()`                                                                  |
| `encryption_utils.py` | AES-256 encryption                           | `encrypt_message()`, `decrypt_message()`, `derive_aes_key()`                                            |
| `jwt_utils.py`        | JWT token handling                           | `create_jwt_token()`, `verify_jwt_token()`                                                              |
| `api/signup.py`       | Signup endpoint                              | `/signup` POST                                                                                          |
| `api/login.py`        | Login endpoint                               | `/login` POST                                                                                           |
| `api/verify.py`       | Token verification                           | `/verify` GET                                                                                           |
| `api/logout.py`       | Logout endpoint                              | `/logout` POST                                                                                          |

### Frontend Components

| File                | Purpose             | Key Features                      |
| ------------------- | ------------------- | --------------------------------- |
| `App.jsx`           | Route configuration | BrowserRouter, Routes, user state |
| `pages/Signup.jsx`  | Signup page         | Form validation, API call         |
| `pages/Login.jsx`   | Login page          | Authentication, cookie handling   |
| `pages/Home.jsx`    | Protected home page | Token verification, navigation    |
| `pages/Profile.jsx` | User profile page   | Display user info, decrypted data |

## License

This project is for educational purposes.

## Contact

For issues or questions, please refer to the project repository.
