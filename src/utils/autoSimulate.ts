// Realistic random scoreline generator. Used ONLY by journey mode for
// non-selected-team matches. Engine remains deterministic; this only
// generates engine input.

const SCORE_POOL: Array<[number, number]> = [
  [1,0],[1,0],[1,0],
  [2,0],[2,0],
  [2,1],[2,1],[2,1],
  [1,1],[1,1],[1,1],
  [0,0],[0,0],
  [3,0],
  [3,1],[3,1],
  [3,2],
  [0,1],[0,1],[0,1],
  [0,2],[0,2],
  [1,2],[1,2],[1,2],
  [0,3],
  [1,3],
  [2,3],
  [4,0],
  [4,1],
  [0,4],
];

export function autoSimulate(): { goals1: number; goals2: number } {
  const pick = SCORE_POOL[Math.floor(Math.random() * SCORE_POOL.length)];
  return { goals1: pick[0], goals2: pick[1] };
}
