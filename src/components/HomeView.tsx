import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Database, Cpu, CheckCircle2, BookOpen, Calculator, Atom, Code2, History } from 'lucide-react';
import { ViewMode } from '../types';

interface HomeViewProps {
  onNavigate: (view: ViewMode) => void;
  onOpenCodeExplorer: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenCodeExplorer }) => {
  return (
    <div id="home-view" className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Flask &bull; Firebase &bull; Google Gemini API</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
                Academic AI Tutor for <span className="text-blue-600">Students</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Break down complex homework problems step-by-step, master math proofs, explain scientific principles, and debug code instantly with your dedicated, 24/7 AI tutor.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
                <button
                  id="hero-register-btn"
                  onClick={() => onNavigate('register')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-all shadow-xs"
                >
                  <span>Start Studying Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="hero-login-btn"
                  onClick={() => onNavigate('login')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 transition-all"
                >
                  <span>Student Sign In</span>
                </button>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-6 pt-3 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Real-time Firestore Sync</span>
                </div>
              </div>
            </div>

            {/* Hero Right Mockup Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span>
                  </div>
                  <span className="text-xs font-medium text-slate-500">Student AI Assistant</span>
                  <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Gemini Online
                  </span>
                </div>

                <div className="py-4 space-y-3">
                  {/* User query bubble */}
                  <div className="bg-blue-600 text-white p-3 rounded-lg text-[13px] ml-6 shadow-xs">
                    <p className="font-normal">Can you explain the difference between speed and velocity with an everyday analogy?</p>
                  </div>

                  {/* AI Response bubble */}
                  <div className="bg-slate-50 text-slate-800 p-3.5 rounded-lg text-[13px] mr-4 border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-blue-600 font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Student AI Tutor</span>
                    </div>
                    <p className="text-slate-700">
                      Great physics question! Here is the clear difference:
                    </p>
                    <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 pl-1">
                      <li><strong>Speed</strong> is a scalar (magnitude only): e.g., <em>"60 mph"</em></li>
                      <li><strong>Velocity</strong> is a vector (magnitude + direction): e.g., <em>"60 mph North"</em></li>
                    </ul>
                    <div className="p-2 rounded bg-white border border-slate-200 text-xs text-slate-700 font-mono">
                      If you drive in a circle and return to start, your speed is 60 mph but displacement is 0!
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Database className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Saved to Firestore</span>
                  </span>
                  <span className="text-[11px] text-slate-400">Python Flask &bull; Bootstrap 5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack & Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Academic Architecture &amp; Production Stack
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            A cohesive full-stack architecture combining Google Gemini AI, Firebase Firestore Database, and Flask REST services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Gemini */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs hover:border-slate-300 transition">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4 font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Google Gemini API</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Provides intelligent pedagogical step-by-step tutoring rather than just answers. Configured in <code className="text-blue-600 bg-blue-50 px-1 py-0.5 rounded text-xs">config.py</code> and <code className="text-blue-600 bg-blue-50 px-1 py-0.5 rounded text-xs">services/gemini_service.py</code>.
            </p>
          </div>

          {/* Card 2: Firebase Auth */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs hover:border-slate-300 transition">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Firebase Authentication</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Secure registration, login, and token session verification via Firebase Auth. Configured in <code className="text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded text-xs">firebase_config.py</code>.
            </p>
          </div>

          {/* Card 3: Firestore Database */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs hover:border-slate-300 transition">
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-4 font-bold">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Firestore Collections</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Maintains durable <code className="text-slate-800 bg-slate-100 px-1 py-0.5 rounded text-xs">users</code> and <code className="text-slate-800 bg-slate-100 px-1 py-0.5 rounded text-xs">chats</code> documents for each student's revision history and analytics.
            </p>
          </div>
        </div>
      </section>

      {/* Supported Subjects Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 text-center shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-3">Supported Academic Disciplines</h3>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200">
              <Calculator className="w-3.5 h-3.5 text-blue-600" /> Mathematics &amp; Calculus
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200">
              <Atom className="w-3.5 h-3.5 text-emerald-600" /> Physics &amp; Mechanics
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200">
              <Code2 className="w-3.5 h-3.5 text-blue-600" /> Computer Science &amp; Python
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" /> Literature &amp; Essays
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200">
              <History className="w-3.5 h-3.5 text-rose-600" /> World &amp; History
            </span>
          </div>

          <div className="mt-5">
            <button
              onClick={onOpenCodeExplorer}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-4"
            >
              View Full Python Flask Project Files &rarr;
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
