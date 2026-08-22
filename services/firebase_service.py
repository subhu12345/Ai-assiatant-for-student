"""
Firebase Service Module for Student AI Assistant
Handles Firebase Admin SDK initialization, Authentication verification, and Firestore Database operations.
"""

import os
import datetime
import firebase_admin
from firebase_admin import credentials, firestore, auth
import requests
from firebase_config import firebaseConfig
from config import FIREBASE_CREDENTIALS_PATH

# Global Firestore DB client
db = None
_is_firebase_initialized = False

def init_firebase():
    """Initializes the Firebase Admin SDK safely."""
    global db, _is_firebase_initialized
    if _is_firebase_initialized:
        return db

    try:
        if os.path.exists(FIREBASE_CREDENTIALS_PATH):
            cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
            firebase_admin.initialize_app(cred)
            db = firestore.client()
            _is_firebase_initialized = True
            print("Firebase Admin SDK initialized successfully with service account.")
        elif os.environ.get("FIREBASE_PROJECT_ID"):
            # Attempt default application credentials
            cred = credentials.ApplicationDefault()
            firebase_admin.initialize_app(cred, {
                'projectId': os.environ.get("FIREBASE_PROJECT_ID"),
            })
            db = firestore.client()
            _is_firebase_initialized = True
            print("Firebase Admin SDK initialized with ApplicationDefault credentials.")
        else:
            print("Notice: No serviceAccountKey.json found. In-memory demo persistence will be used as fallback.")
            db = None
    except Exception as e:
        print(f"Warning: Firebase Admin SDK initialization error: {e}")
        db = None

    return db

# In-memory storage fallback for local testing without Firebase credentials
_mock_users_db = {}
_mock_chats_db = []

def register_user_with_email_password(email, password, name):
    """
    Registers a new student user using Firebase Auth REST API or Admin SDK.
    Returns (user_data, error_message).
    """
    api_key = firebaseConfig.get("apiKey")
    
    # 1. Try Firebase Auth REST API if apiKey is provided
    if api_key:
        url = f"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={api_key}"
        payload = {
            "email": email,
            "password": password,
            "returnSecureToken": True
        }
        try:
            res = requests.post(url, json=payload)
            data = res.json()
            if res.status_code == 200:
                uid = data.get("localId")
                # Save user to Firestore
                save_user_profile(uid, name, email)
                return {"uid": uid, "email": email, "name": name}, None
            else:
                error_msg = data.get("error", {}).get("message", "Registration failed")
                return None, error_msg
        except Exception as e:
            return None, str(e)
            
    # 2. Try Firebase Admin SDK
    try:
        user_record = auth.create_user(
            email=email,
            password=password,
            display_name=name
        )
        save_user_profile(user_record.uid, name, email)
        return {"uid": user_record.uid, "email": email, "name": name}, None
    except Exception as e:
        # Fallback for local sandbox testing
        uid = f"user_{len(_mock_users_db) + 1}_{abs(hash(email)) % 10000}"
        save_user_profile(uid, name, email)
        return {"uid": uid, "email": email, "name": name}, None

def login_user_with_email_password(email, password):
    """
    Logs in an existing student user using Firebase Auth REST API.
    Returns (user_data, error_message).
    """
    api_key = firebaseConfig.get("apiKey")
    
    if api_key:
        url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={api_key}"
        payload = {
            "email": email,
            "password": password,
            "returnSecureToken": True
        }
        try:
            res = requests.post(url, json=payload)
            data = res.json()
            if res.status_code == 200:
                uid = data.get("localId")
                profile = get_user_profile(uid)
                name = profile.get("name") if profile else email.split("@")[0].capitalize()
                return {"uid": uid, "email": email, "name": name}, None
            else:
                error_msg = data.get("error", {}).get("message", "Invalid email or password")
                return None, error_msg
        except Exception as e:
            return None, str(e)

    # Local fallback if Firebase API Key is not set yet
    for uid, u in _mock_users_db.items():
        if u.get("email") == email:
            return {"uid": uid, "email": email, "name": u.get("name")}, None
            
    # Allow instant demo login if no registered mock users match
    uid = f"user_demo_{abs(hash(email)) % 10000}"
    name = email.split("@")[0].replace(".", " ").capitalize()
    save_user_profile(uid, name, email)
    return {"uid": uid, "email": email, "name": name}, None

def save_user_profile(uid, name, email):
    """Saves student profile in Firestore 'users' collection."""
    user_data = {
        "uid": uid,
        "name": name,
        "email": email,
        "created_at": datetime.datetime.utcnow().isoformat()
    }
    
    client = init_firebase()
    if client:
        try:
            client.collection("users").document(uid).set(user_data)
            return user_data
        except Exception as e:
            print(f"Error saving to Firestore users: {e}")
            
    # Mock fallback
    _mock_users_db[uid] = user_data
    return user_data

def get_user_profile(uid):
    """Retrieves student profile from Firestore 'users' collection."""
    client = init_firebase()
    if client:
        try:
            doc = client.collection("users").document(uid).get()
            if doc.exists:
                return doc.to_dict()
        except Exception as e:
            print(f"Error fetching from Firestore users: {e}")
            
    return _mock_users_db.get(uid)

def save_chat_message(uid, question, response):
    """
    Saves conversation in Firestore 'chats' collection:
    {
      "uid": "",
      "question": "",
      "response": "",
      "timestamp": ""
    }
    """
    timestamp = datetime.datetime.utcnow().isoformat()
    chat_data = {
        "uid": uid,
        "question": question,
        "response": response,
        "timestamp": timestamp
    }
    
    client = init_firebase()
    if client:
        try:
            client.collection("chats").add(chat_data)
            return chat_data
        except Exception as e:
            print(f"Error saving to Firestore chats: {e}")
            
    # Mock fallback
    _mock_chats_db.append(chat_data)
    return chat_data

def get_user_chat_history(uid, limit=50):
    """Retrieves chat history for a specific student sorted chronologically."""
    client = init_firebase()
    if client:
        try:
            chats_ref = client.collection("chats").where("uid", "==", uid).order_by(
                "timestamp", direction=firestore.Query.ASCENDING
            ).limit(limit)
            results = [doc.to_dict() for doc in chats_ref.stream()]
            return results
        except Exception as e:
            print(f"Error querying Firestore chats: {e}")
            
    # Mock fallback
    user_chats = [c for c in _mock_chats_db if c.get("uid") == uid]
    return user_chats[-limit:]

def clear_user_chat_history(uid):
    """Deletes all chat messages for a student."""
    global _mock_chats_db
    client = init_firebase()
    if client:
        try:
            docs = client.collection("chats").where("uid", "==", uid).stream()
            for doc in docs:
                doc.reference.delete()
            return True
        except Exception as e:
            print(f"Error deleting Firestore chats: {e}")
            
    _mock_chats_db = [c for c in _mock_chats_db if c.get("uid") != uid]
    return True
