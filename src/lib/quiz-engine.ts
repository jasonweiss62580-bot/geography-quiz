import type { GeographicEntity, QuizConfig, QuizQuestion } from '../data/types';

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Generate 4 multiple-choice options for a given correct answer string,
 * drawn from the full entity pool.
 */
export function generateOptions(
  correctAnswer: string,
  pool: GeographicEntity[],
  getAnswer: (e: GeographicEntity) => string,
): string[] {
  const others = pool
    .map(getAnswer)
    .filter((a) => a !== correctAnswer);
  const distractors = shuffle(others).slice(0, 3);
  return shuffle([correctAnswer, ...distractors]);
}

/** Generate quiz questions from config + entity pool. */
export function generateQuestions(
  config: QuizConfig,
  pool: GeographicEntity[],
): QuizQuestion[] {
  const selected = shuffle(pool).slice(0, config.questionCount);

  return selected.map((entity): QuizQuestion => {
    switch (config.modeId) {
      case 'map-identify': {
        // Highlighted state → identify the state name
        const correctAnswer = entity.name;
        const options =
          config.formatId === 'multiple-choice'
            ? generateOptions(correctAnswer, pool, (e) => e.name)
            : [];
        return {
          entity,
          correctAnswer,
          options,
          prompt: 'Which state is highlighted?',
        };
      }
      case 'flashcard-forward': {
        // State → capital
        const correctAnswer = entity.capital;
        const options =
          config.formatId === 'multiple-choice'
            ? generateOptions(correctAnswer, pool, (e) => e.capital)
            : [];
        return {
          entity,
          correctAnswer,
          options,
          prompt: `What is the capital of ${entity.name}?`,
        };
      }
      case 'flashcard-reverse': {
        // Capital → state
        const correctAnswer = entity.name;
        const options =
          config.formatId === 'multiple-choice'
            ? generateOptions(correctAnswer, pool, (e) => e.name)
            : [];
        return {
          entity,
          correctAnswer,
          options,
          prompt: `${entity.capital} is the capital of which state?`,
        };
      }
      case 'map-locate': {
        return {
          entity,
          correctAnswer: entity.name,
          options: [],
          prompt: `Click on ${entity.name}`,
        };
      }
      case 'matching': {
        // Matching generates its own structure; return a placeholder
        return {
          entity,
          correctAnswer: entity.capital,
          options: [],
          prompt: 'Match states to their capitals',
        };
      }
    }
  });
}
