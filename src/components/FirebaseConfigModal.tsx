import React, { useState } from 'react';
import { X, Database, ShieldCheck, CheckCircle2, Copy, Check } from 'lucide-react';

interface FirebaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseConfigModal: React.FC<FirebaseConfigModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const firebaseSnippet = `firebaseConfig = {
    "apiKey": "YOUR_FIREBASE_API_KEY",
    "authDomain": "YOUR_PROJECT_ID.firebaseapp.com",
    "projectId": "YOUR_PROJECT_ID",
    "storageBucket": "YOUR_PROJECT_ID.appspot.com",
    "messagingSenderId": "YOUR_MESSAGING_SENDER_ID",
    "appId": "YOUR_APP_ID",
    "measurementId": "YOUR_MEASUREMENT_ID"
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-400 text-indigo-950 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Firebase &amp; Firestore Configuration</h3>
              <p className="text-[11px] text-indigo-200">Variables configured in firebase_config.py</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-indigo-800 text-indigo-200 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs sm:text-sm text-slate-700">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <strong className="block text-xs uppercase font-bold">Firestore Schema Ready</strong>
              <span>Collections <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono font-bold">users</code> and <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono font-bold">chats</code> are configured.</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                File: firebase_config.py
              </label>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(firebaseSnippet);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Snippet'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto">
              <code>{firebaseSnippet}</code>
            </pre>
          </div>

          <div className="text-xs text-slate-500 space-y-1">
            <p><strong>Collections:</strong></p>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li><code>users</code>: uid, name, email, created_at</li>
              <li><code>chats</code>: uid, question, response, timestamp</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};

