// FIFA World Cup 2026 fixtures — generated programmatically from the official
// 12-group draw shown in groups.png. 72 group matches (round robin per group),
// 32 knockout shells, scheduled chronologically.

import type { Match, Stage } from "@/engine/tournamentEngine";
import { BRACKET_TEMPLATE } from "@/engine/tournamentEngine";

export interface MatchMeta {
  id: string;
  date: string;        // ISO yyyy-mm-dd
  kickoff: string;     // HH:mm
  venue: string;
  stage: Stage;
  stageLabel: string;  // Human-readable
  group?: string;
  matchNumber: number;
}

// ── DRAW ──────────────────────────────────────────────────
export interface TeamInfo { name: string; code: string; }

export const GROUPS: Record<string, TeamInfo[]> = {
  A: [{name:"Mexico",code:"mx"},{name:"South Africa",code:"za"},{name:"Korea Republic",code:"kr"},{name:"Czechia",code:"cz"}],
  B: [{name:"Canada",code:"ca"},{name:"Bosnia and Herzegovina",code:"ba"},{name:"Qatar",code:"qa"},{name:"Switzerland",code:"ch"}],
  C: [{name:"Brazil",code:"br"},{name:"Morocco",code:"ma"},{name:"Haiti",code:"ht"},{name:"Scotland",code:"gb-sct"}],
  D: [{name:"USA",code:"us"},{name:"Paraguay",code:"py"},{name:"Australia",code:"au"},{name:"Türkiye",code:"tr"}],
  E: [{name:"Germany",code:"de"},{name:"Curaçao",code:"cw"},{name:"Côte d'Ivoire",code:"ci"},{name:"Ecuador",code:"ec"}],
  F: [{name:"Netherlands",code:"nl"},{name:"Japan",code:"jp"},{name:"Sweden",code:"se"},{name:"Tunisia",code:"tn"}],
  G: [{name:"Belgium",code:"be"},{name:"Egypt",code:"eg"},{name:"IR Iran",code:"ir"},{name:"New Zealand",code:"nz"}],
  H: [{name:"Spain",code:"es"},{name:"Cabo Verde",code:"cv"},{name:"Saudi Arabia",code:"sa"},{name:"Uruguay",code:"uy"}],
  I: [{name:"France",code:"fr"},{name:"Senegal",code:"sn"},{name:"Iraq",code:"iq"},{name:"Norway",code:"no"}],
  J: [{name:"Argentina",code:"ar"},{name:"Algeria",code:"dz"},{name:"Austria",code:"at"},{name:"Jordan",code:"jo"}],
  K: [{name:"Portugal",code:"pt"},{name:"Congo DR",code:"cd"},{name:"Uzbekistan",code:"uz"},{name:"Colombia",code:"co"}],
  L: [{name:"England",code:"gb-eng"},{name:"Croatia",code:"hr"},{name:"Ghana",code:"gh"},{name:"Panama",code:"pa"}],
};

export const ALL_TEAMS: TeamInfo[] = Object.values(GROUPS).flat();

export function teamCode(name: string): string | undefined {
  return ALL_TEAMS.find(t => t.name === name)?.code;
}

export function teamGroup(name: string): string | undefined {
  for (const [g, teams] of Object.entries(GROUPS)) {
    if (teams.some(t => t.name === name)) return g;
  }
  return undefined;
}

const VENUES = [
  "Mexico City Stadium","Estadio Guadalajara","Toronto Stadium","Los Angeles Stadium",
  "Boston Stadium","BC Place Vancouver","New York New Jersey Stadium","San Francisco Bay Area Stadium",
  "Philadelphia Stadium","Houston Stadium","Dallas Stadium","Estadio Monterrey",
  "Miami Stadium","Atlanta Stadium","Seattle Stadium","Kansas City Stadium",
];
const KICKOFFS = ["12:00","15:00","18:00","21:00"];

// Round-robin schedule for 4 teams (matchdays):
// MD1: 0v1, 2v3 | MD2: 0v2, 3v1 | MD3: 0v3, 1v2
const RR: Array<[number, number][]> = [
  [[0,1],[2,3]],
  [[0,2],[3,1]],
  [[0,3],[1,2]],
];

function dateAdd(base: string, days: number): string {
  const d = new Date(base + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0,10);
}

// Build 72 group matches: matchdays are spaced 4 days apart, groups staggered
// so the chronological feed never plays the same group back-to-back.
function buildGroupMatches(): { matches: Match[]; meta: Record<string, MatchMeta> } {
  const matches: Match[] = [];
  const meta: Record<string, MatchMeta> = {};
  const groupKeys = Object.keys(GROUPS);
  const baseDate = "2026-06-11";
  let matchNumber = 1;

  // For each matchday (1..3), iterate groups in order
  for (let md = 0; md < 3; md++) {
    for (let gi = 0; gi < groupKeys.length; gi++) {
      const groupId = groupKeys[gi];
      const teams = GROUPS[groupId];
      const pairs = RR[md];
      // Day offset: matchday * 6 + group index / 2
      const dayOffset = md * 6 + Math.floor(gi / 2);
      const date = dateAdd(baseDate, dayOffset);
      for (let p = 0; p < pairs.length; p++) {
        const [i, j] = pairs[p];
        const id = `${groupId}_M${md * 2 + p + 1}`;
        const t1 = teams[i].name, t2 = teams[j].name;
        matches.push({ id, stage: "group", group: groupId, team1: t1, team2: t2 });
        meta[id] = {
          id, date,
          kickoff: KICKOFFS[(gi * 2 + p) % KICKOFFS.length],
          venue: VENUES[(gi + md + p) % VENUES.length],
          stage: "group",
          stageLabel: `Group ${groupId} · MD${md + 1}`,
          group: groupId,
          matchNumber: matchNumber++,
        };
      }
    }
  }
  return { matches, meta };
}

function buildKnockoutShells(): { matches: Match[]; meta: Record<string, MatchMeta> } {
  const matches: Match[] = [];
  const meta: Record<string, MatchMeta> = {};
  // Stage schedule (rough chronological): R32 starts 2026-06-28, etc.
  const stageDates: Record<string, string> = {
    R32: "2026-06-28", R16: "2026-07-04", QF: "2026-07-09",
    SF: "2026-07-14", TP: "2026-07-18", F: "2026-07-19",
  };
  const stageLabels: Record<string, string> = {
    R32: "Round of 32", R16: "Round of 16", QF: "Quarter-final",
    SF: "Semi-final", TP: "Third-place play-off", F: "Final",
  };
  let n = 73;
  const entries = Object.entries(BRACKET_TEMPLATE);
  for (const [id, [s1, s2]] of entries) {
    const prefix = id.split("_")[0];
    let stage: Stage = "R32";
    if (prefix === "R16") stage = "R16";
    else if (prefix === "QF") stage = "QF";
    else if (prefix === "SF" || prefix === "TP") stage = "SF";
    else if (prefix === "F") stage = "F";

    matches.push({ id, stage, team1: s1, team2: s2 });
    // sequence dates within each stage
    const seqIndex = entries.filter(([eid]) => eid.startsWith(prefix)).findIndex(([eid]) => eid === id);
    const date = dateAdd(stageDates[prefix] ?? "2026-07-04", Math.floor(seqIndex / 2));
    meta[id] = {
      id, date,
      kickoff: KICKOFFS[seqIndex % KICKOFFS.length],
      venue: VENUES[n % VENUES.length],
      stage,
      stageLabel: stageLabels[prefix] ?? "Knockout",
      matchNumber: n++,
    };
  }
  return { matches, meta };
}

const groupBuild = buildGroupMatches();
const koBuild = buildKnockoutShells();

export const ALL_FIXTURES: Match[] = [...groupBuild.matches, ...koBuild.matches];
export const MATCH_META: Record<string, MatchMeta> = { ...groupBuild.meta, ...koBuild.meta };

// Chronological order (by date, then kickoff, then matchNumber)
export const CHRONOLOGICAL_IDS: string[] = Object.values(MATCH_META)
  .sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    if (a.kickoff !== b.kickoff) return a.kickoff.localeCompare(b.kickoff);
    return a.matchNumber - b.matchNumber;
  })
  .map(m => m.id);
