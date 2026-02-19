import { useCallback } from 'react';
import confetti from 'canvas-confetti';

export function useConfetti() {
  const fire = useCallback(() => {
    // Dual burst from left and right corners
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { x: 0.1, y: 0.7 },
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { x: 0.9, y: 0.7 },
      disableForReducedMotion: true,
    });
  }, []);

  return { fire };
}
