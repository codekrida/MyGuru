
export type Standard = '8th' | '9th' | '10th';
export type Board = 'CBSE' | 'ICSE' | 'State Board';
export type Subject = 'Mathematics' | 'Science' | 'Social Science' | 'English' | 'Hindi';

export interface UserProfile {
  name: string;
  standard: Standard;
  board: Board;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface PerformanceData {
  subject: string;
  score: number;
  fullMark: number;
  date: string;
}
