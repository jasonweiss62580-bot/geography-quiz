import { useCallback } from 'react';
import { playCorrect, playWrong, playFanfare, resumeCtx } from '../lib/audio';

export function useAudio() {
  const correct = useCallback(async () => {
    await resumeCtx();
    playCorrect();
  }, []);

  const wrong = useCallback(async () => {
    await resumeCtx();
    playWrong();
  }, []);

  const fanfare = useCallback(async () => {
    await resumeCtx();
    playFanfare();
  }, []);

  return { playCorrect: correct, playWrong: wrong, playFanfare: fanfare };
}
