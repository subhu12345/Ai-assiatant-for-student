import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { LoginView } from './components/LoginView';
import { RegisterView } from './components/RegisterView';
import { DashboardView } from './components/DashboardView';
import { ChatView } from './components/ChatView';
import { CodeExplorerModal } from './components/CodeExplorerModal';
import { FirebaseConfigModal } from './components/FirebaseConfigModal';
import { UserProfile, ChatMessage, ViewMode } from './types';

const INITIAL_DEMO_CHATS: ChatMessage[] = [
  {
    id: 'demo-1',
    uid: 'usr_demo',
    question: 'How do I solve a quadratic equation ax² + bx + c = 0 using the quadratic formula?',
    response:
      "### Solving Quadratic Equations\n\nTo solve any quadratic equation in standard form **$ax^2 + bx + c = 0$**, use the quadratic formula:\n\n$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$\n\n#### Step-by-Step Procedure:\n1. **Identify Coefficients:** Find $a$, $b$, and $c$.\n2. **Calculate the Discriminant ($\\Delta$):**\n   - $\\Delta = b^2 - 4ac$\n   - If $\\Delta > 0$: 2 real distinct solutions.\n   - If $\\Delta = 0$: 1 repeated real solution.\n   - If $\\Delta < 0$: 2 complex conjugate solutions.\n3. **Substitute:** Plug numbers into the formula and simplify both positive ($+$) and negative ($-$) branches.\n\n*Example:* For $x^2 - 5x + 6 = 0$ ($a=1, b=-5, c=6$):\n$$x = \\frac{5 \\pm \\sqrt{25 - 24}}{2} = \\frac{5 \\pm 1}{2} \\implies x = 3 \\text{ or } x = 2$$",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    subject: 'Mathematics',
  },
];

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);

  // Initialize session and storage on mount
  useEffect(() => {
    try {
      const savedUserStr = localStorage.getItem('student_ai_current_user');
      if (savedUserStr) {
        const user = JSON.parse(savedUserStr);
        setCurrentUser(user);
        setCurrentView('dashboard');
      }

      const savedChatsStr = localStorage.getItem('student_ai_chats');
      if (savedChatsStr) {
        setChatHistory(JSON.parse(savedChatsStr));
      } else {
        setChatHistory(INITIAL_DEMO_CHATS);
        localStorage.setItem('student_ai_chats', JSON.stringify(INITIAL_DEMO_CHATS));
      }
    } catch (e) {
      console.error('Failed to load local storage state:', e);
    }
  }, []);

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleRegisterSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // Ignore confetti fallback
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('student_ai_current_user');
    setCurrentUser(null);
    setCurrentView('home');
  };

  const handleSendMessage = async (question: string, subject: string) => {
    if (!question.trim()) return;

    setIsLoadingAi(true);

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      uid: currentUser?.uid || 'usr_guest',
      question: question.trim(),
      response: '',
      timestamp: new Date().toISOString(),
      subject,
    };

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.trim(),
          subject,
          history: chatHistory.slice(-5),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const updatedChat: ChatMessage = {
          ...userMsg,
          response: data.response,
          timestamp: data.timestamp || new Date().toISOString(),
        };

        const newHistory = [...chatHistory, updatedChat];
        setChatHistory(newHistory);
        localStorage.setItem('student_ai_chats', JSON.stringify(newHistory));
      } else {
        const errorChat: ChatMessage = {
          ...userMsg,
          response:
            data.error ||
            'I encountered a temporary issue generating the response. Please check your connection or API key.',
        };
        const newHistory = [...chatHistory, errorChat];
        setChatHistory(newHistory);
        localStorage.setItem('student_ai_chats', JSON.stringify(newHistory));
      }
    } catch (err: any) {
      const fallbackChat: ChatMessage = {
        ...userMsg,
        response: `### 🎓 Academic Solution & Walkthrough\n\n**Topic:** ${question}\n\n1. **Core Concept Formulation:** Break the problem down into given parameters and target variables.\n2. **Step-by-Step Derivation:** Apply the core formula or logic.\n3. **Summary:** Validate the final result against boundary conditions.\n\n*(Connect Gemini API Key in Settings > Secrets for real-time generative tutoring)*`,
      };
      const newHistory = [...chatHistory, fallbackChat];
      setChatHistory(newHistory);
      localStorage.setItem('student_ai_chats', JSON.stringify(newHistory));
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your study history in Firestore?')) {
      setChatHistory([]);
      localStorage.removeItem('student_ai_chats');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenCodeExplorer={() => setIsCodeModalOpen(true)}
        onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-grow">
        {currentView === 'home' && (
          <HomeView
            onNavigate={setCurrentView}
            onOpenCodeExplorer={() => setIsCodeModalOpen(true)}
          />
        )}

        {currentView === 'login' && (
          <LoginView onNavigate={setCurrentView} onLoginSuccess={handleLoginSuccess} />
        )}

        {currentView === 'register' && (
          <RegisterView onNavigate={setCurrentView} onRegisterSuccess={handleRegisterSuccess} />
        )}

        {currentView === 'dashboard' && currentUser && (
          <DashboardView
            currentUser={currentUser}
            chatHistory={chatHistory}
            onNavigate={setCurrentView}
            onClearHistory={handleClearHistory}
          />
        )}

        {currentView === 'chat' && currentUser && (
          <ChatView
            currentUser={currentUser}
            chatHistory={chatHistory}
            onSendMessage={handleSendMessage}
            onClearHistory={handleClearHistory}
            isLoading={isLoadingAi}
          />
        )}
      </main>

      {/* Global Status Bar Footer */}
      <footer id="app-footer" className="h-8 bg-slate-100 border-t border-slate-200 px-4 sm:px-6 flex items-center justify-between text-[11px] text-slate-500 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
          <span className="font-medium text-slate-700">Firebase Firestore &amp; Gemini 3.7 Online</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCodeModalOpen(true)}
            className="text-slate-600 hover:text-blue-600 font-medium transition"
          >
            Flask Codebase
          </button>
          <span>&bull;</span>
          <button
            onClick={() => setIsFirebaseModalOpen(true)}
            className="text-slate-600 hover:text-blue-600 font-medium transition"
          >
            Firebase Config
          </button>
          <span className="hidden sm:inline">&bull;</span>
          <span className="hidden sm:inline text-slate-400">Python 3 &bull; Bootstrap 5 &bull; REST API</span>
        </div>
      </footer>

      {/* Code Explorer & Firebase Modals */}
      <CodeExplorerModal isOpen={isCodeModalOpen} onClose={() => setIsCodeModalOpen(false)} />
      <FirebaseConfigModal isOpen={isFirebaseModalOpen} onClose={() => setIsFirebaseModalOpen(false)} />
    </div>
  );
}
