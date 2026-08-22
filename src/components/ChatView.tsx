import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Send,
  Sparkles,
  Bot,
  Trash2,
  Copy,
  Check,
  Plus,
  MessageSquare,
  BookOpen,
  Calculator,
  Atom,
  Code2,
  History as HistoryIcon,
  Database,
  Search,
} from 'lucide-react';
import { UserProfile, ChatMessage } from '../types';

interface ChatViewProps {
  currentUser: UserProfile;
  chatHistory: ChatMessage[];
  onSendMessage: (question: string, subject: string) => Promise<void>;
  onClearHistory: () => void;
  isLoading: boolean;
}

const SUBJECT_OPTIONS = [
  { id: 'General', name: 'All Subjects' },
  { id: 'Mathematics', name: 'Mathematics' },
  { id: 'Physics', name: 'Physics' },
  { id: 'Chemistry', name: 'Chemistry' },
  { id: 'Computer Science', name: 'Computer Science' },
  { id: 'History', name: 'History' },
];

const PROMPT_SUGGESTIONS = [
  {
    label: 'Pythagorean Theorem',
    text: 'Can you explain the Pythagorean Theorem with a clear geometric intuition and a step-by-step example?',
    subject: 'Mathematics',
  },
  {
    label: "Newton's 2nd Law",
    text: "Explain Newton's Second Law (F = m*a) with a relatable real-world analogy and how to solve for acceleration.",
    subject: 'Physics',
  },
  {
    label: 'Python Recursion',
    text: 'How does recursion work in Python? Provide a simple factorial code snippet and explain the call stack & base case.',
    subject: 'Computer Science',
  },
  {
    label: 'Photosynthesis',
    text: 'Break down the light-dependent and light-independent stages of photosynthesis for biology exam revision.',
    subject: 'General',
  },
];

export const ChatView: React.FC<ChatViewProps> = ({
  currentUser,
  chatHistory,
  onSendMessage,
  onClearHistory,
  isLoading,
}) => {
  const [question, setQuestion] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('General');
  const [selectedChatIndex, setSelectedChatIndex] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    const currentQ = question.trim();
    setQuestion('');
    await onSendMessage(currentQ, selectedSubject);
    textareaRef.current?.focus();
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNewChat = () => {
    setSelectedChatIndex(null);
    setQuestion('');
    textareaRef.current?.focus();
  };

  return (
    <div id="chat-view-container" className="flex flex-1 h-[calc(100vh-64px-32px)] overflow-hidden bg-slate-50">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-5 hidden md:flex flex-col flex-shrink-0">
        {/* + New Chat Button */}
        <button
          id="new-chat-btn"
          onClick={handleNewChat}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-3 rounded-lg font-semibold text-[13px] mb-5 flex items-center justify-center gap-2 transition shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Chat</span>
        </button>

        {/* Section Label */}
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-1">
          Recent History
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {chatHistory.length === 0 ? (
            <div className="text-xs text-slate-400 px-2 py-4 italic">No previous questions</div>
          ) : (
            chatHistory.map((item, idx) => {
              const isActive = selectedChatIndex === idx;
              return (
                <button
                  key={item.id || idx}
                  onClick={() => setSelectedChatIndex(idx)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-[13px] flex items-center gap-2 transition truncate ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  title={item.question}
                >
                  <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                  <span className="truncate">{item.question}</span>
                </button>
              );
            })
          )}
        </div>

        {/* Sidebar Footer Controls */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Database className="w-3 h-3 text-emerald-500" />
            <span>Firestore Synced</span>
          </span>
          {chatHistory.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-[11px] text-slate-400 hover:text-rose-600 flex items-center gap-1 transition"
              title="Clear all chat history"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Chat Pane */}
      <section className="flex-1 flex flex-col bg-slate-50 min-w-0">
        {/* Chat Header */}
        <div className="px-6 py-3.5 border-b border-slate-200 bg-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <span>{selectedChatIndex !== null ? chatHistory[selectedChatIndex]?.question : 'Student AI Academic Tutor'}</span>
              </h2>
              <span className="text-[11px] text-slate-400">
                Gemini 3.7 Flash &bull; Step-by-Step Learning
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Subject Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 hidden sm:inline">Subject:</span>
              <select
                id="subject-dropdown"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="text-xs font-medium bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                {SUBJECT_OPTIONS.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-6 md:p-8 flex flex-col gap-5 overflow-y-auto">
          {/* Welcome Message */}
          <div className="max-w-[78%] p-4 rounded-xl text-sm leading-relaxed bg-white border border-slate-200 self-start shadow-xs space-y-2">
            <div className="text-xs font-semibold text-blue-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hello, {currentUser.name}!</span>
            </div>
            <p className="text-slate-700 text-[13px]">
              I'm your academic tutor. Ask me any homework problem, code query, or concept clarification for step-by-step guidance.
            </p>
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Suggested Topics:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PROMPT_SUGGESTIONS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuestion(item.text);
                      setSelectedSubject(item.subject);
                      textareaRef.current?.focus();
                    }}
                    className="text-xs text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md transition"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-[10px] text-slate-400 pt-1">
              Gemini &bull; Always Active
            </div>
          </div>

          {/* Conversation Stream */}
          {chatHistory.map((msg, idx) => {
            const msgId = msg.id || `msg-${idx}`;
            return (
              <React.Fragment key={msgId}>
                {/* User Message */}
                <div className="max-w-[75%] p-3.5 px-4 rounded-xl text-sm leading-relaxed bg-blue-600 text-white self-end shadow-xs">
                  <p className="whitespace-pre-wrap">{msg.question}</p>
                  <div className="text-[10px] text-blue-100/75 mt-1.5 text-right">
                    You &bull; {msg.timestamp ? msg.timestamp.substring(11, 16) : 'Just now'}
                  </div>
                </div>

                {/* AI Assistant Response */}
                <div className="max-w-[85%] sm:max-w-[78%] p-4 rounded-xl text-sm leading-relaxed bg-white border border-slate-200 self-start shadow-xs space-y-2 text-slate-800">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100 text-xs text-slate-500">
                    <span className="font-semibold text-blue-600 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>Solution Walkthrough</span>
                    </span>
                    <button
                      onClick={() => handleCopy(msg.response, msgId)}
                      className="text-slate-400 hover:text-slate-600 p-1 rounded transition"
                      title="Copy response"
                    >
                      {copiedId === msgId ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="markdown-body prose prose-sm max-w-none text-slate-800 text-[13px] leading-relaxed">
                    <ReactMarkdown>{msg.response}</ReactMarkdown>
                  </div>

                  <div className="text-[10px] text-slate-400 mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between">
                    <span>Gemini 3.7 Flash &bull; Firestore</span>
                    <span>{msg.timestamp ? msg.timestamp.substring(11, 16) : ''}</span>
                  </div>
                </div>
              </React.Fragment>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="max-w-[75%] p-3.5 px-4 rounded-xl text-xs bg-white border border-slate-200 self-start shadow-xs flex items-center gap-2.5 text-slate-600">
              <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Formulating step-by-step academic response with Gemini...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Pane */}
        <div className="p-4 sm:px-8 bg-white border-t border-slate-200 flex-shrink-0">
          <form onSubmit={handleSubmit} className="input-minimal-wrapper">
            <input
              ref={textareaRef}
              id="chat-input"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask Gemini about your studies, math proofs, or code..."
              className="flex-1 border-none bg-transparent py-2 outline-none text-sm text-slate-800 placeholder-slate-400"
              disabled={isLoading}
            />
            <button
              id="send-btn"
              type="submit"
              disabled={!question.trim() || isLoading}
              className="bg-transparent border-none text-blue-600 hover:text-blue-700 font-semibold text-sm cursor-pointer pl-3 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Send
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
