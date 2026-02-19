/** Wagner-Fischer Levenshtein distance, O(n) space. */
export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let curr = new Array<number>(n + 1);
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n + 1; j++) {
      curr[j] =
        a[i - 1] === b[j - 1]
          ? prev[j - 1]
          : 1 + Math.min(prev[j - 1], prev[j], curr[j - 1]);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

/**
 * Proportional close-enough threshold:
 * max distance = min(2, floor(target.length / 3))
 * Avoids false positives on short words.
 */
export function isClose(input: string, target: string): boolean {
  const a = input.trim().toLowerCase();
  const b = target.trim().toLowerCase();
  if (a === b) return true;
  const threshold = Math.min(2, Math.floor(b.length / 3));
  return threshold > 0 && levenshtein(a, b) <= threshold;
}
