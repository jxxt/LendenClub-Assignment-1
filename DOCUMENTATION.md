# Authentication System Documentation

## Project Overview

This is a full-stack authentication system with React frontend and FastAPI backend, using Firebase Realtime Database for data storage.

## Technology Stack

-   **Frontend**: React + Vite
-   **Backend**: FastAPI (Python)
-   **Database**: Firebase Realtime Database
-   **Routing**: React Router DOM

## Project Structure

```
LendenClub-Assignment-1/
├── backend/
│   ├── api/
│   │   ├── __init__.py
│   │   ├── login.py          # Login endpoint
│   │   └── signup.py         # Signup endpoint
│   ├── firebase_config.py    # Firebase initialization
│   ├── utils.py              # Helper functions
│   ├── main.py               # FastAPI app entry point
│   ├── requirements.txt      # Python dependencies
│   ├── .env                  # Environment variables (DO NOT COMMIT)
│   └── .env.example          # Environment template
├── src/
│   ├── pages/
│   │   ├── Home.jsx          # Home page (shows after login)
│   │   ├── Login.jsx         # Login page
│   │   └── Signup.jsx        # Signup page
│   ├── App.jsx               # Routes configuration
│   └── main.jsx              # React entry point
├── .env                      # Frontend environment variables
├── vite.config.js            # Vite configuration (port 8001)
└── package.json              # Node dependencies
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
-   **Validation**:
    -   All fields required
    -   Email format validation
    -   Aadhaar must be exactly 12 digits
    -   Password confirmation match
    -   Email uniqueness check
-   **On Success**: Redirects to `/login`

### 2. User Login

-   **Route**: `/login`
-   **Fields**:
    -   Email
    -   Password
-   **Backend Endpoint**: `POST http://localhost:8002/login`
-   **Validation**:
    -   All fields required
    -   Email/password verification against database
-   **On Success**: Sets user state and redirects to `/`

### 3. Home Page

-   **Route**: `/`
-   **Display**: "Hello {name}" message
-   **Protection**: Redirects to `/login` if user not authenticated
-   **Note**: No session persistence - user data lost on refresh

## Database Structure

Firebase Realtime Database stores users with the following structure:

```json
{
    "authID_10chars": {
        "name": "John Doe",
        "email": "john@example.com",
        "aadhaar": "123456789012",
        "password": "password123"
    }
}
```

-   **authID**: 10-character unique identifier (alphanumeric)
-   **name**: User's full name
-   **email**: User's email (unique)
-   **aadhaar**: 12-digit Aadhaar number
-   **password**: Plain text password (Note: In production, use hashing)

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
    "aadhaar": "123456789012"
  }
}

Response (Error - 401):
{
  "detail": "Invalid email or password"
}
```

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

5. Configure Firebase credentials in `backend/.env`:
    - Go to Firebase Console > Project Settings > Service Accounts
    - Generate new private key (downloads JSON file)
    - Extract values from the JSON and add to `.env`:

```env
FIREBASE_PROJECT_ID=assignment1-e31db
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@assignment1-e31db.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40assignment1-e31db.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://assignment1-e31db-default-rtdb.asia-southeast1.firebasedatabase.app
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

-   **Background**: Black (#000)
-   **Text**: White (#fff)
-   **Secondary**: Grey (#888, #555, #333, #222, #111)
-   **Error**: Red (#ff4444)
-   **Minimalist**: Clean, centered forms with subtle borders

## Important Notes

1. **No Session Persistence**: User session is stored in React state only. Refreshing the page will clear the session and require re-login.

2. **No Cookies/LocalStorage**: As per requirements, no client-side storage is used.

3. **Password Security**: Currently stores passwords in plain text. For production, implement proper hashing (bcrypt, argon2, etc.).

4. **Auth ID Generation**: Uses 10-character alphanumeric string, checked for uniqueness against existing database entries.

5. **CORS Configuration**: Backend allows requests only from `http://localhost:8001`.

6. **Firebase Rules**: Ensure your Firebase Realtime Database rules allow read/write access from the backend.

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
2. Fill in all fields with valid data
3. Click "Sign Up"
4. Should redirect to `/login` with success message

### Test Login Flow

1. Navigate to `http://localhost:8001/login`
2. Enter registered email and password
3. Click "Login"
4. Should redirect to `/` showing "Hello {name}"

### Test Session Behavior

1. After successful login
2. Refresh the page
3. Should redirect back to `/login` (no session persistence)

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

### Test Login

```bash
curl -X POST http://localhost:8002/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Troubleshooting

### Frontend Issues

-   **Port already in use**: Change port in `vite.config.js`
-   **API connection failed**: Ensure backend is running on port 8002
-   **Router not working**: Verify `react-router-dom` is installed

### Backend Issues

-   **Firebase connection failed**: Check `.env` credentials
-   **Port 8002 in use**: Change port in `main.py` uvicorn.run()
-   **Import errors**: Ensure all dependencies are installed
-   **CORS errors**: Verify CORS settings in `main.py`

### Database Issues

-   **User creation fails**: Check Firebase database rules
-   **Duplicate auth ID**: Should be rare with 62^10 combinations
-   **Email not unique**: Check email exists before signup

## Future Enhancements (Not Implemented)

-   Password hashing
-   JWT token authentication
-   Session management with cookies
-   Email verification
-   Password reset functionality
-   Rate limiting
-   Input sanitization
-   Aadhaar format validation improvements
-   User profile management
-   Logout functionality

## Security Considerations (Production)

1. Implement password hashing (bcrypt/argon2)
2. Use HTTPS for all communications
3. Implement JWT or session tokens
4. Add rate limiting
5. Validate and sanitize all inputs
6. Use environment variables properly
7. Implement proper Firebase security rules
8. Add CSRF protection
9. Implement proper error handling
10. Never expose sensitive data in responses

## Dependencies

### Frontend (package.json)

```json
{
    "dependencies": {
        "react": "^19.2.0",
        "react-dom": "^19.2.0",
        "react-router-dom": "^7.1.0"
    }
}
```

### Backend (requirements.txt)

```
fastapi==0.115.0
uvicorn==0.32.0
python-dotenv==1.0.1
firebase-admin==6.5.0
pydantic==2.10.0
pydantic-core==2.27.0
email-validator==2.2.0
```

## License

This project is for educational purposes.

## Contact

For issues or questions, please refer to the project repository.
