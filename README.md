# LendenClub Authentication System

A full-stack authentication system with React frontend and FastAPI backend.

## Quick Start

### Install Frontend Dependencies

```bash
npm install
npm install react-router-dom
```

### Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Configure Firebase

1. Get your Firebase service account key from Firebase Console
2. Update `backend/.env` with your credentials

### Run the Application

**Terminal 1 - Backend:**

```bash
cd backend
python main.py
```

**Terminal 2 - Frontend:**

```bash
npm run dev
```

**Access:** `http://localhost:8001`

## Features

-   User signup with name, email, Aadhaar, password
-   User login with email and password
-   Session management (in-memory, no persistence)
-   Black/white/grey minimalist theme

For detailed documentation, see [DOCUMENTATION.md](DOCUMENTATION.md)
