export interface QuizOption {
  id: number;
  text: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
}

export interface ArticleDetailData {
  id?: number;
  quizId: number | null;
  title: string;
  content: string;
  summary: string;
  questions: QuizQuestion[];
}

export interface QuestionResult {
  questionId: number;
  isCorrect: boolean;
  correctOptionId: number | null;
  explanation: string | null;
}

export interface AttemptResult {
  score: number;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  results: QuestionResult[];
}

export type QuizPhase = "closed" | "answering" | "submitting" | "submitted";

export interface SubmittedAnswer {
  questionId: number;
  selectedOptionId: number;
}

export interface SavedArticle {
  id: number;
  title: string;
  summary: string;
  created_at: string;
}
