import React from 'react';
import { GraduationCap, LayoutDashboard, MessageSquare, LogIn, UserPlus, LogOut, Code, Database, Sparkles } from 'lucide-react';
import { UserProfile, ViewMode } from '../types';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
  onOpenCodeExplorer: () => void;
  onOpenFirebaseModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  currentUser,
  onLogout,
  onOpenCodeExplorer,
  onOpenFirebaseModal,
}) => {
  return (
    <nav id="app-navbar" className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <button
            id="brand-logo-btn"
            onClick={() => onNavigate(currentUser ? 'dashboard' : 'home')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs transition-transform group-hover:scale-105">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-slate-900 flex items-center gap-1.5">
                Student <span className="text-blue-600">AI</span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  Flask &bull; Firebase
                </span>
              </span>
            </div>
          </button>

          {/* Navigation links */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Python Code Viewer Shortcut */}
            <button
              id="open-code-explorer-btn"
              onClick={onOpenCodeExplorer}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
              title="Inspect Python Flask, Firebase & Gemini project files"
            >
              <Code className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden md:inline">Flask Files</span>
            </button>

            {/* Firebase Config / Status Button */}
            <button
              id="open-firebase-config-btn"
              onClick={onOpenFirebaseModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
              title="View Firebase & Firestore Connection Config"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden lg:inline">Firebase Status</span>
            </button>

            {currentUser ? (
              <>
                <button
                  id="nav-dashboard-btn"
                  onClick={() => onNavigate('dashboard')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                    currentView === 'dashboard'
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </button>

                <button
                  id="nav-chat-btn"
                  onClick={() => onNavigate('chat')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                    currentView === 'chat'
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">Chat</span>
                </button>

                <div className="h-5 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-200">
                    {(currentUser.name || 'S')[0].toUpperCase()}
                  </div>
                  <span className="text-xs font-medium text-slate-700 hidden md:inline max-w-[120px] truncate">
                    {currentUser.name}
                  </span>
                  <button
                    id="nav-logout-btn"
                    onClick={onLogout}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  id="nav-login-btn"
                  onClick={() => onNavigate('login')}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                    currentView === 'login'
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>

                <button
                  id="nav-register-btn"
                  onClick={() => onNavigate('register')}
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-[13px] font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
