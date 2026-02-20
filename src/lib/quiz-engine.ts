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
        const correctAnswer = entity.name;
        const options =
          config.formatId === 'multiple-choice'
            ? generateOptions(correctAnswer, pool, (e) => e.name)
            : [];
        const prompt = config.topicId === 'world-countries'
          ? 'Which country is highlighted?'
          : 'Which state is highlighted?';
        return { entity, correctAnswer, options, prompt };
      }
      case 'flashcard-forward': {
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
        const correctAnswer = entity.name;
        const options =
          config.formatId === 'multiple-choice'
            ? generateOptions(correctAnswer, pool, (e) => e.name)
            : [];
        const prompt = config.topicId === 'world-countries'
          ? `${entity.capital} is the capital of which country?`
          : `${entity.capital} is the capital of which state?`;
        return { entity, correctAnswer, options, prompt };
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
        const prompt = config.topicId === 'world-countries'
          ? 'Match countries to their capitals'
          : 'Match states to their capitals';
        return {
          entity,
          correctAnswer: entity.capital,
          options: [],
          prompt,
        };
      }
    }
  });
}
