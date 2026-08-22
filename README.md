# Student AI Assistant 🎓

A full-stack AI-powered educational web application built with **Python Flask**, **Bootstrap 5**, **Firebase Firestore Database**, **Firebase Authentication**, and **Google Gemini API**.

---

## 🌟 Project Overview

**Student AI Assistant** is designed to provide learners with an interactive, 24/7 AI-powered academic tutor. Whether you need step-by-step math solutions, physics derivations, chemistry balancing, coding debugging, or essay feedback, Student AI Assistant guides you pedagogically through every concept.

### Key Features
- **User Authentication**: Secure student registration and login powered by Firebase Authentication.
- **Persistent Cloud Database**: Student profiles and complete conversation history stored securely in Firebase Firestore.
- **Intelligent Gemini AI Chat**: Context-aware academic assistant that delivers structured, step-by-step explanations with markdown formatting and code highlights.
- **Modern Bootstrap 5 UI**: Fully responsive, mobile-friendly interface with subject filters, prompt chips, and real-time loading feedback.
- **Student Dashboard**: Overview of recent questions, cloud sync status, and quick session launchers.

---

## 📁 Project Structure

```text
student_ai_assistant/
│
├── app.py                      # Flask routes and application controller
├── config.py                   # Gemini API and Flask configuration
├── firebase_config.py          # Firebase client credentials
├── requirements.txt            # Python dependencies
├── README.md                   # Documentation and deployment guide
│
├── static/
│   ├── css/
│   │   └── style.css           # Custom theme and chat styles
│   ├── js/
│   │   └── main.js             # Client-side scripts and validations
│
├── templates/
│   ├── base.html               # Base layout with navbar and footer
│   ├── index.html              # Landing page with hero banner & features
│   ├── login.html              # Student login form
│   ├── register.html           # Student registration form
│   ├── dashboard.html          # Student dashboard & stats
│   └── chat.html               # Real-time AI chat tutor interface
│
└── services/
    ├── firebase_service.py     # Firebase Admin & Auth/Firestore handlers
    └── gemini_service.py       # Google Gemini API integration
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd student_ai_assistant
```

### 2. Create and Activate Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Linux / macOS:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 🔐 Configuration

### 1. Configure Firebase (`firebase_config.py`)

Open `firebase_config.py` and supply your Firebase Web project credentials:

```python
firebaseConfig = {
    "apiKey": "YOUR_FIREBASE_API_KEY",
    "authDomain": "YOUR_PROJECT_ID.firebaseapp.com",
    "projectId": "YOUR_PROJECT_ID",
    "storageBucket": "YOUR_PROJECT_ID.appspot.com",
    "messagingSenderId": "YOUR_MESSAGING_SENDER_ID",
    "appId": "YOUR_APP_ID",
    "measurementId": "YOUR_MEASUREMENT_ID"
}
```

*Optional for Firebase Admin SDK:* Place your Firebase service account JSON key file in the root folder named `serviceAccountKey.json`.

### 2. Configure Gemini (`config.py` or `.env`)

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
SECRET_KEY=your-random-flask-secret-key
```

Or edit `config.py`:

```python
GEMINI_API_KEY = "YOUR_GEMINI_API_KEY"
```

---

## 🚀 Run the Project Locally

```bash
python app.py
```

Open your browser and navigate to:

```text
http://127.0.0.1:5000
```

---

## 🌐 Deploy on Render

Follow these steps to deploy to [Render](https://render.com/):

1. **Create GitHub Repository:**
   - Commit and push your `student_ai_assistant` project to GitHub.
2. **Create Render Web Service:**
   - Log in to your Render dashboard.
   - Click **New +** and select **Web Service**.
   - Connect your GitHub repository.
3. **Configure Build and Start Commands:**
   - **Environment:** `Python 3`
   - **Build Command:**
     ```bash
     pip install -r requirements.txt
     ```
   - **Start Command:**
     ```bash
     gunicorn app:app
     ```
4. **Add Environment Variables:**
   - Navigate to **Environment** in your Render service settings and add:
     - `GEMINI_API_KEY` : Your Google Gemini API Key
     - `SECRET_KEY` : A secure random string for Flask sessions
     - `FIREBASE_API_KEY` : (Optional) Your Firebase API Key
     - `FIREBASE_PROJECT_ID` : (Optional) Your Firebase Project ID
5. **Deploy:**
   - Click **Create Web Service**. Render will automatically build and deploy your application!

---

## 📚 Firestore Collections Schema

### `users`
```json
{
  "uid": "USER_UNIQUE_ID",
  "name": "Student Name",
  "email": "student@example.edu",
  "created_at": "2026-08-22T02:00:00.000000"
}
```

### `chats`
```json
{
  "uid": "USER_UNIQUE_ID",
  "question": "Explain Newton's Second Law",
  "response": "Newton's Second Law states that F = m * a...",
  "timestamp": "2026-08-22T02:05:00.000000"
}
```

---

## 📄 License

This project is licensed under the Apache-2.0 License.
