export type QuizTopicId = 'us-states' | 'world-countries';
export type QuizModeId =
  | 'map-identify'
  | 'map-locate'
  | 'flashcard-forward'
  | 'flashcard-reverse'
  | 'matching';
export type AnswerFormatId = 'multiple-choice' | 'spelling';

export interface GeographicEntity {
  name: string;          // "California" / "Canada"
  abbreviation: string;  // "CA" / "CA" (ISO alpha-2)
  capital: string;       // "Sacramento" / "Ottawa"
  altCapitals?: string[]; // other accepted capitals, e.g. ["Cotonou"] for Benin
  svgId: string;         // FIPS code e.g. "06" (us-atlas) — numeric ISO for world ("124")
  region?: string;       // world micro-region e.g. "north-america"
}

export interface QuizConfig {
  topicId: QuizTopicId;
  modeId: QuizModeId;
  formatId: AnswerFormatId;
  questionCount: number;
  showTimer: boolean;
  allowClose: boolean;
  worldRegion?: string; // micro- or macro-region filter for world quiz, e.g. "north-america" / "americas" / "all"
  usRegion?: string;    // region filter for US quiz, e.g. "new-england" / "all"
}

export interface QuizQuestion {
  entity: GeographicEntity;
  options: string[];         // 4 options (MC) or empty (spelling/map-locate)
  correctAnswer: string;
  acceptedAnswers?: string[]; // other answers that also count as correct (typed spelling)
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
