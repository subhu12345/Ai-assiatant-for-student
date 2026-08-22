import React, { useState } from 'react';
import { X, FileCode, Copy, Check, Terminal } from 'lucide-react';

interface CodeExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FILES_MAP: Record<string, { language: string; description: string; path: string }> = {
  'app.py': {
    language: 'python',
    description: 'Main Flask routes, session auth, validation, and API endpoints',
    path: 'app.py',
  },
  'config.py': {
    language: 'python',
    description: 'Gemini API key and Flask session secret configuration',
    path: 'config.py',
  },
  'firebase_config.py': {
    language: 'python',
    description: 'Firebase project credentials dictionary for Web / REST / Admin',
    path: 'firebase_config.py',
  },
  'services/firebase_service.py': {
    language: 'python',
    description: 'Firestore CRUD (users, chats) and Firebase Auth registration & login',
    path: 'services/firebase_service.py',
  },
  'services/gemini_service.py': {
    language: 'python',
    description: 'Google Generative AI SDK client and prompt engineering logic',
    path: 'services/gemini_service.py',
  },
  'requirements.txt': {
    language: 'text',
    description: 'Python package dependencies (Flask, firebase-admin, google-generativeai, gunicorn)',
    path: 'requirements.txt',
  },
  'README.md': {
    language: 'markdown',
    description: 'Setup, virtualenv, Firebase/Gemini config, and Render deployment guide',
    path: 'README.md',
  },
  'templates/base.html': {
    language: 'html',
    description: 'Bootstrap 5 base template with navigation, alerts, and footer',
    path: 'templates/base.html',
  },
  'templates/chat.html': {
    language: 'html',
    description: 'Interactive student chat interface with Markdown and Firestore storage',
    path: 'templates/chat.html',
  },
  'templates/dashboard.html': {
    language: 'html',
    description: 'Student dashboard with profile metrics and recent questions',
    path: 'templates/dashboard.html',
  },
  'templates/login.html': {
    language: 'html',
    description: 'Student login form connected to Firebase Auth',
    path: 'templates/login.html',
  },
  'templates/register.html': {
    language: 'html',
    description: 'Registration form with name, email, password validation',
    path: 'templates/register.html',
  },
  'templates/index.html': {
    language: 'html',
    description: 'Landing page hero section with live demo & feature cards',
    path: 'templates/index.html',
  },
};

export const CodeExplorerModal: React.FC<CodeExplorerModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<string>('app.py');
  const [fileContent, setFileContent] = useState<string>('');
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (!isOpen) return;

    // Load file preview content
    if (selectedFile === 'config.py') {
      setFileContent(`import os\nfrom dotenv import load_dotenv\n\nload_dotenv()\n\nGEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")\nSECRET_KEY = os.environ.get("SECRET_KEY", "student-ai-assistant-secret-key-2026")\nFIREBASE_CREDENTIALS_PATH = os.environ.get("FIREBASE_CREDENTIALS_PATH", "serviceAccountKey.json")`);
    } else if (selectedFile === 'firebase_config.py') {
      setFileContent(`import os\n\nfirebaseConfig = {\n    "apiKey": os.environ.get("FIREBASE_API_KEY", ""),\n    "authDomain": os.environ.get("FIREBASE_AUTH_DOMAIN", ""),\n    "projectId": os.environ.get("FIREBASE_PROJECT_ID", ""),\n    "storageBucket": os.environ.get("FIREBASE_STORAGE_BUCKET", ""),\n    "messagingSenderId": os.environ.get("FIREBASE_MESSAGING_SENDER_ID", ""),\n    "appId": os.environ.get("FIREBASE_APP_ID", ""),\n    "measurementId": os.environ.get("FIREBASE_MEASUREMENT_ID", "")\n}`);
    } else if (selectedFile === 'requirements.txt') {
      setFileContent(`Flask>=3.0.0\nfirebase-admin>=6.4.0\ngoogle-generativeai>=0.8.0\npython-dotenv>=1.0.0\ngunicorn>=21.2.0\nrequests>=2.31.0`);
    } else if (selectedFile === 'app.py') {
      setFileContent(`from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify\nfrom config import SECRET_KEY\nfrom services.firebase_service import register_user_with_email_password, login_user_with_email_password, save_chat_message, get_user_chat_history\nfrom services.gemini_service import generate_student_response\n\napp = Flask(__name__)\napp.secret_key = SECRET_KEY\n\n@app.route("/")\ndef index():\n    return render_template("index.html")\n\n@app.route("/register", methods=["GET", "POST"])\ndef register():\n    # Register student via Firebase Auth & Firestore\n    ...\n\n@app.route("/login", methods=["GET", "POST"])\ndef login():\n    # Authenticate student\n    ...\n\n@app.route("/dashboard")\ndef dashboard():\n    # View profile & Firestore stats\n    ...\n\n@app.route("/chat")\ndef chat():\n    # Interactive chat view\n    ...\n\n@app.route("/api/chat", methods=["POST"])\ndef api_chat():\n    # Generate Gemini response and save to Firestore\n    ...\n\nif __name__ == "__main__":\n    app.run(host="0.0.0.0", port=5000, debug=True)`);
    } else {
      setFileContent(`/* File: ${selectedFile} */\n/* Generated completely in root folder. Run 'python app.py' to launch in Python runtime. */`);
    }
  }, [selectedFile, isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-lg text-slate-900 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900">Python Project Files</h3>
              <p className="text-xs text-slate-500">Flask, Firebase, and Gemini implementation files</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
          {/* File Sidebar */}
          <div className="w-full md:w-60 border-r border-slate-100 p-2.5 space-y-1 overflow-y-auto bg-slate-50 text-xs font-mono">
            <div className="px-2 py-1 text-[11px] font-semibold text-slate-400">
              Files
            </div>
            {Object.keys(FILES_MAP).map((fileName) => (
              <button
                key={fileName}
                onClick={() => setSelectedFile(fileName)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 transition text-xs ${
                  selectedFile === fileName
                    ? 'bg-blue-600 text-white font-medium shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                }`}
              >
                <FileCode className={`w-3.5 h-3.5 flex-shrink-0 ${selectedFile === fileName ? 'text-white' : 'text-blue-600'}`} />
                <span className="truncate">{fileName}</span>
              </button>
            ))}
          </div>

          {/* File Content Area */}
          <div className="flex-grow flex flex-col p-4 bg-white overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <span className="font-mono text-xs font-semibold text-blue-600">{selectedFile}</span>
                <p className="text-xs text-slate-500">{FILES_MAP[selectedFile]?.description}</p>
              </div>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 border border-slate-200 flex items-center gap-1.5 transition font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <pre className="flex-grow overflow-auto p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-100 leading-relaxed">
              <code>{fileContent}</code>
            </pre>
          </div>
        </div>

        {/* Modal Footer / CLI command tips */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2 font-mono text-xs">
            <Terminal className="w-3.5 h-3.5 text-emerald-600" />
            <span>Terminal: <code className="text-blue-700 bg-white border border-slate-200 px-1 py-0.5 rounded">python app.py</code></span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
