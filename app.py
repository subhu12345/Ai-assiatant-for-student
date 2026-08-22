"""
Student AI Assistant - Flask Web Application
A full-stack student learning platform powered by Flask, Bootstrap 5, Firebase Auth/Firestore, and Google Gemini API.
"""

import os
from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from config import SECRET_KEY
from services.firebase_service import (
    register_user_with_email_password,
    login_user_with_email_password,
    get_user_profile,
    save_chat_message,
    get_user_chat_history,
    clear_user_chat_history,
    init_firebase
)
from services.gemini_service import generate_student_response

# Initialize Flask application
app = Flask(__name__)
app.secret_key = SECRET_KEY

# Initialize Firebase services on app start
with app.app_context():
    init_firebase()


# -------------------------------------------------------------
# Authentication Helper Decorator / Verification
# -------------------------------------------------------------
def is_logged_in():
    """Checks if a student session is active."""
    return "user_id" in session


# -------------------------------------------------------------
# Routes
# -------------------------------------------------------------

@app.route("/")
def index():
    """Home Page - Welcome banner, features overview, call-to-actions."""
    if is_logged_in():
        return redirect(url_for("dashboard"))
    return render_template("index.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register Page - Creates a new student account and profile."""
    if is_logged_in():
        return redirect(url_for("dashboard"))

    if request.method == "POST":
        name = request.form.get("name", "").strip()
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")
        confirm_password = request.form.get("confirm_password", "")

        # Form Validation
        if not name or not email or not password:
            flash("All fields are required. Please fill out the entire form.", "danger")
            return render_template("register.html", name=name, email=email)

        if len(password) < 6:
            flash("Password must be at least 6 characters long.", "warning")
            return render_template("register.html", name=name, email=email)

        if confirm_password and password != confirm_password:
            flash("Passwords do not match. Please re-enter.", "warning")
            return render_template("register.html", name=name, email=email)

        # Register via Firebase Auth & Firestore
        user_data, error = register_user_with_email_password(email, password, name)
        if error:
            flash(f"Registration Error: {error}", "danger")
            return render_template("register.html", name=name, email=email)

        # Establish user session
        session["user_id"] = user_data["uid"]
        session["user_email"] = user_data["email"]
        session["user_name"] = user_data["name"]

        flash(f"Welcome to Student AI Assistant, {user_data['name']}! Your account was created successfully.", "success")
        return redirect(url_for("dashboard"))

    return render_template("register.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    """Login Page - Authenticates student with Firebase."""
    if is_logged_in():
        return redirect(url_for("dashboard"))

    if request.method == "POST":
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")

        if not email or not password:
            flash("Please enter both email and password.", "danger")
            return render_template("login.html", email=email)

        user_data, error = login_user_with_email_password(email, password)
        if error:
            flash(f"Login failed: {error}", "danger")
            return render_template("login.html", email=email)

        # Establish user session
        session["user_id"] = user_data["uid"]
        session["user_email"] = user_data["email"]
        session["user_name"] = user_data.get("name", email.split("@")[0].capitalize())

        flash(f"Welcome back, {session['user_name']}!", "success")
        return redirect(url_for("dashboard"))

    return render_template("login.html")


@app.route("/dashboard")
def dashboard():
    """Dashboard Page - User overview, study statistics, quick actions, recent questions."""
    if not is_logged_in():
        flash("Please log in to access your student dashboard.", "info")
        return redirect(url_for("login"))

    uid = session["user_id"]
    profile = get_user_profile(uid) or {
        "uid": uid,
        "name": session.get("user_name", "Student"),
        "email": session.get("user_email", ""),
        "created_at": "Active Now"
    }

    # Fetch recent conversations from Firestore
    chat_history = get_user_chat_history(uid, limit=10)
    total_questions = len(chat_history)

    return render_template(
        "dashboard.html",
        user=profile,
        chat_history=chat_history,
        total_questions=total_questions
    )


@app.route("/chat")
def chat():
    """Chat Page - Interactive study tutor interface with conversation history."""
    if not is_logged_in():
        flash("Please log in to start chatting with your AI tutor.", "info")
        return redirect(url_for("login"))

    uid = session["user_id"]
    chat_history = get_user_chat_history(uid, limit=50)

    return render_template("chat.html", user_name=session.get("user_name"), chat_history=chat_history)


@app.route("/api/chat", methods=["POST"])
def api_chat():
    """API endpoint for sending a message to Gemini and saving to Firestore."""
    if not is_logged_in():
        return jsonify({"error": "Unauthorized. Please log in."}), 401

    data = request.get_json() or {}
    question = data.get("question", "").strip()
    subject = data.get("subject", "General")

    if not question:
        return jsonify({"error": "Question cannot be empty."}), 400

    uid = session["user_id"]

    try:
        # 1. Fetch recent history for conversational context
        history = get_user_chat_history(uid, limit=5)

        # 2. Query Gemini AI model
        ai_response = generate_student_response(question, conversation_history=history, subject=subject)

        # 3. Persist question and response in Firebase Firestore
        saved_chat = save_chat_message(uid, question, ai_response)

        return jsonify({
            "success": True,
            "question": question,
            "response": ai_response,
            "timestamp": saved_chat.get("timestamp")
        })

    except Exception as e:
        return jsonify({"error": f"An error occurred while processing your request: {str(e)}"}), 500


@app.route("/api/clear-history", methods=["POST"])
def api_clear_history():
    """Clears all conversation records for the authenticated student."""
    if not is_logged_in():
        return jsonify({"error": "Unauthorized."}), 401

    uid = session["user_id"]
    clear_user_chat_history(uid)
    return jsonify({"success": True, "message": "Chat history cleared successfully."})


@app.route("/logout")
def logout():
    """Logout route - Clears session and redirects to home."""
    session.clear()
    flash("You have been logged out successfully. Happy studying!", "info")
    return redirect(url_for("index"))


# -------------------------------------------------------------
# Entry Point
# -------------------------------------------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
