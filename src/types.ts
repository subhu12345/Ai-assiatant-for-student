export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  created_at: string;
}

export interface ChatMessage {
  id?: string;
  uid: string;
  question: string;
  response: string;
  timestamp: string;
  subject?: string;
}

export type ViewMode = 'home' | 'login' | 'register' | 'dashboard' | 'chat';

export interface SubjectOption {
  id: string;
  name: string;
  icon: string;
  color: string;
}
