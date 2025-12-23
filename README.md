# LendenClub Assignment 1

## Project Overview

Full-stack authentication system using React (Vite) + FastAPI with Firebase Realtime Database, implementing Argon2 password hashing, AES encryption for Aadhaar, and JWT auth via HTTPS-only cookies.

## Setup/Run Instructions

### Prerequisites

-   Node.js (LTS) for frontend.
-   Python 3.10+ for backend.

### Frontend (React + Vite)

1. Install deps: `npm install`
2. Run dev server: `npm run dev`
3. Open: `https://localhost:8001`

### Backend (FastAPI)

1. Create/activate a virtual env (recommended).
2. Install deps:
    - `cd backend`
    - `pip install -r requirements.txt`
3. Run API:
    - `python main.py`
4. Backend base URL: `https://localhost:8002`

### Backend Environment

-   Ensure Firebase + security keys are configured (see `backend/.env` expectations in `DOCUMENTATION.md`).

## API Documentation

Base URL: `https://localhost:8002`

-   `POST /signup` — Create user (validates Aadhaar, hashes password, encrypts Aadhaar).

    -   Body: `{ name, email, aadhaar, password }`
    -   Response: `{ message, auth_id }`

-   `POST /login` — Login and set `token` as HTTPS-only cookie.

    -   Body: `{ email, password }`
    -   Response: `{ message, user: { auth_id, name, email, aadhaar } }`

-   `GET /verify` — Verify JWT from cookie and return user (Aadhaar decrypted).

    -   Cookie: `token`
    -   Response: `{ valid: true, user: { auth_id, name, email, aadhaar } }`

-   `POST /logout` — Clears the `token` cookie.
    -   Response: `{ message }`

## Database Schema

Firebase Realtime Database (users stored under a generated user id / auth id key):

```json
{
    "<userId>": {
        "name": "user name",
        "email": "user email",
        "aadhaar": "<AES-256 encrypted base64 string>",
        "password": "<argon2id hash>"
    }
}
```

## AI Tool Usage Log

| Section                 | Detail                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **AI-Assisted Tasks**   | - Used GitHub Copilot to help draft backend helper/utility modules (password hashing via Argon2, JWT helpers, AES encryption/decryption helpers, Firebase/DB helper utilities). <br/> - Used Copilot to help wire the FastAPI auth endpoints (`/signup`, `/login`, `/verify`, `/logout`) to those helpers and keep request/response handling consistent. <br/> - Used Copilot to draft the README structure and keep sections concise, and to extract endpoint names/ports by reviewing the existing route files. |
| **Effectiveness Score** | **Score: 4/5** — Faster implementation of backend helper functions and auth endpoints plus quicker documentation; still required manual verification/testing for env configuration (Firebase keys), cookie/CORS behavior, and crypto correctness.                                                                                                                                                                                                                                                                                                                                                                              |


