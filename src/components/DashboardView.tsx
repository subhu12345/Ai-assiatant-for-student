import React from 'react';
import { UserProfile, ChatMessage, ViewMode } from '../types';
import {
  MessageSquare,
  Sparkles,
  Database,
  Calendar,
  Mail,
  Fingerprint,
  ArrowRight,
  Plus,
  BookOpen,
  Clock,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

interface DashboardViewProps {
  currentUser: UserProfile;
  chatHistory: ChatMessage[];
  onNavigate: (view: ViewMode) => void;
  onClearHistory: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  chatHistory,
  onNavigate,
  onClearHistory,
}) => {
  return (
    <div id="dashboard-view" className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-xs font-medium mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Active Student Session</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, <span className="text-blue-600">{currentUser.name}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Your AI academic tutor is ready to help you with mathematics, science, programming, history, and literature.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            id="dashboard-open-chat-btn"
            onClick={() => onNavigate('chat')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[13px] transition shadow-xs"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Open Chat Tutor</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Questions</span>
            <div className="text-xl font-bold text-slate-900">{chatHistory.length}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Firestore Sync</span>
            <div className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Connected</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">AI Model</span>
            <div className="text-sm font-semibold text-slate-900">Gemini 3.7 Flash</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Student Profile + Recent Chat Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="text-center pb-4 border-b border-slate-100">
              <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl mx-auto mb-3 border border-blue-200">
                {(currentUser.name || 'S')[0].toUpperCase()}
              </div>
              <h2 className="text-base font-bold text-slate-900">{currentUser.name}</h2>
              <span className="inline-block mt-1 text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                Verified Student
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  Email
                </span>
                <span className="font-medium text-slate-700 text-right truncate max-w-[180px]">
                  {currentUser.email}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Fingerprint className="w-3.5 h-3.5" />
                  User UID
                </span>
                <span className="font-mono text-slate-500 text-[11px] truncate max-w-[150px]">
                  {currentUser.uid}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Member Since
                </span>
                <span className="font-medium text-slate-700">
                  {currentUser.created_at ? currentUser.created_at.substring(0, 10) : 'Today'}
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('chat')}
              className="w-full py-2 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ask New Question</span>
            </button>
          </div>
        </div>

        {/* Recent Chat History Card */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <h3 className="font-semibold text-slate-900 text-sm">Recent Questions (Firestore)</h3>
              </div>
              {chatHistory.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 transition"
                  title="Clear history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            {chatHistory.length === 0 ? (
              <div className="text-center py-10 px-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2.5">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-semibold text-slate-700">No questions asked yet</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Launch the AI Tutor to ask your first academic question and save your step-by-step solutions.
                </p>
                <button
                  onClick={() => onNavigate('chat')}
                  className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition"
                >
                  <span>Start Chatting</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {chatHistory.slice(0, 6).map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-3.5 rounded-lg bg-slate-50/70 hover:bg-slate-100 border border-slate-200/70 transition cursor-pointer"
                    onClick={() => onNavigate('chat')}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                            {item.subject || 'Academic'}
                          </span>
                          <span className="font-semibold text-xs sm:text-[13px] text-slate-900 truncate">
                            {item.question}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 pl-1">
                          {item.response.replace(/[#*`_]/g, '')}
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {item.timestamp ? item.timestamp.substring(11, 16) : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
