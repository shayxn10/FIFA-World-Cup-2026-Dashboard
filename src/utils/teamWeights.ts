// ─────────────────────────────────────────────────────
// teamWeights.ts — wider tier gaps + more decisive formula
// ─────────────────────────────────────────────────────

export const TEAM_TIER: Record<string, number> = {
  // TIER 1 — Elite (90-100)
  "Argentina": 100, "France": 98, "Brazil": 97, "Spain": 95,
  "England": 93, "Portugal": 91, "Germany": 90, "Netherlands": 89,

  // TIER 2 — Strong (75-87)
  "Belgium": 87, "Uruguay": 84, "Colombia": 82, "Morocco": 81,
  "Croatia": 80, "Mexico": 78, "USA": 76, "Japan": 75,

  // TIER 3 — Competitive (58-72)
  "Senegal": 72, "Switzerland": 71, "Denmark": 70, "Sweden": 69,
  "Ecuador": 68, "Türkiye": 68, "Australia": 67,
  "Korea Republic": 67, "South Korea": 67,
  "IR Iran": 66, "Iran": 66,
  "Côte d'Ivoire": 66, "Ivory Coast": 66,
  "Norway": 65, "Poland": 65, "Canada": 64,
  "Austria": 63, "Serbia": 63, "Ghana": 62,
  "Czechia": 61, "Czech Republic": 61,
  "Scotland": 60, "Algeria": 59, "Tunisia": 58,
  "Cameroon": 60,

  // TIER 4 — Mid-lower (42-55)
  "Egypt": 55, "Paraguay": 54, "Bosnia and Herzegovina": 53,
  "South Africa": 50, "Saudi Arabia": 50, "Uzbekistan": 48,
  "Congo DR": 47, "Cabo Verde": 46, "Iraq": 45,
  "Panama": 44, "Slovakia": 43,

  // TIER 5 — Underdogs (25-38)
  "Qatar": 38, "Jordan": 35, "Bolivia": 33,
  "Haiti": 30, "Curaçao": 27, "New Zealand": 25,
};

export function getTeamStrength(team: string): number {
  return TEAM_TIER[team] ?? 55;
}

export function weightedAutoSimulate(
  team1: string,
  team2: string,
): { goals1: number; goals2: number } {
  const r1 = getTeamStrength(team1);
  const r2 = getTeamStrength(team2);
  const diff = r1 - r2;

  // Divisor 12 = decisive. Stronger teams win much more consistently.
  const team1WinProb = 1 / (1 + Math.pow(10, -diff / 12));
  const drawProb = Math.max(0.04, 0.20 - Math.abs(diff) * 0.004);

  const rand = Math.random();
  const team1WinChance = team1WinProb * (1 - drawProb);

  let winner: "team1" | "team2" | "draw";
  if (rand < team1WinChance) winner = "team1";
  else if (rand < team1WinChance + drawProb) winner = "draw";
  else winner = "team2";

  const winScores: Array<[number, number]> = [
    [1,0],[1,0],[1,0],[2,0],[2,0],[2,1],[2,1],[2,1],
    [3,0],[3,1],[3,2],[4,0],[4,1],[1,0],[2,1],
  ];
  const drawScores: Array<[number, number]> = [
    [0,0],[0,0],[1,1],[1,1],[1,1],[2,2],
  ];

  if (winner === "draw") {
    const p = drawScores[Math.floor(Math.random() * drawScores.length)];
    return { goals1: p[0], goals2: p[1] };
  }
  const p = winScores[Math.floor(Math.random() * winScores.length)];
  return winner === "team1"
    ? { goals1: p[0], goals2: p[1] }
    : { goals1: p[1], goals2: p[0] };
}
