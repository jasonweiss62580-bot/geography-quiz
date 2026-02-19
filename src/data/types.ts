export type QuizTopicId = 'us-states' | 'world-countries';
export type QuizModeId =
  | 'map-identify'
  | 'map-locate'
  | 'flashcard-forward'
  | 'flashcard-reverse'
  | 'matching';
export type AnswerFormatId = 'multiple-choice' | 'spelling';

export interface GeographicEntity {
  name: string;          // "California"
  abbreviation: string;  // "CA"
  capital: string;       // "Sacramento"
  svgId: string;         // FIPS code e.g. "06" (us-atlas) — isoA3 for world countries
}

export interface QuizConfig {
  topicId: QuizTopicId;
  modeId: QuizModeId;
  formatId: AnswerFormatId;
  questionCount: number;
  showTimer: boolean;
  allowClose: boolean;
}

export interface QuizQuestion {
  entity: GeographicEntity;
  options: string[];         // 4 options (MC) or empty (spelling/map-locate)
  correctAnswer: string;
  prompt: string;
}

export interface AnswerRecord {
  question: QuizQuestion;
  userAnswer: string;
  correct: boolean;
  wasClose: boolean;
  timeMs: number;
}

export interface SessionResult {
  config: QuizConfig;
  answers: AnswerRecord[];
  totalTimeMs: number;
  score: number;
  completedAt: number;
}
