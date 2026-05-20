import { motion } from "framer-motion";
import { TeamFlag } from "./TeamFlag";
import { MATCH_META } from "@/data/wc2026Fixtures";
import { BRACKET_TEMPLATE } from "@/engine/tournamentEngine";
import type { ResolvedMatch, TournamentState } from "@/engine/tournamentEngine";
import bracketImg from "@/assets/wc2026-bracket.png";

interface Props {
  state: TournamentState;
  onPickWinner: (matchId: string, winner: string) => void;
  highlightTeam?: string | null;
}

const ROUND_ORDER: Array<{ key: string; label: string; prefix: string }> = [
  { key: "R32", label: "Round of 32", prefix: "R32_" },
  { key: "R16", label: "Round of 16", prefix: "R16_" },
  { key: "QF",  label: "Quarter-finals", prefix: "QF_" },
  { key: "SF",  label: "Semi-finals", prefix: "SF_" },
  { key: "F",   label: "Final & Bronze", prefix: "" }, // F_M01 + TP_M01
];

export function KnockoutView({ state, onPickWinner, highlightTeam }: Props) {
  const matches = state.resolvedMatches;

  function roundMatches(key: string): ResolvedMatch[] {
    if (key === "F") {
      return ["F_M01", "TP_M01"].map(id => matches[id]).filter(Boolean) as ResolvedMatch[];
    }
    return Object.keys(BRACKET_TEMPLATE)
      .filter(id => id.startsWith(key + "_"))
      .map(id => matches[id])
      .filter(Boolean) as ResolvedMatch[];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent">Knockout Stage</p>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">The road to the trophy</h2>
        </div>
        {state.bracket["W_F_M01"] && (
          <div className="px-4 py-2 rounded-lg bg-accent/15 border border-accent/40">
            <p className="text-[10px] font-mono uppercase text-accent">Champion</p>
            <p className="text-lg font-black">🏆 {state.bracket["W_F_M01"]}</p>
          </div>
        )}
      </div>

      <details className="bg-card/50 border border-border rounded-lg overflow-hidden">
        <summary className="cursor-pointer px-4 py-2.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition">
          📊 View official bracket reference
        </summary>
        <div className="border-t border-border bg-black/40 p-3">
          <img src={bracketImg} alt="FIFA 2026 bracket structure" className="w-full rounded" />
        </div>
      </details>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {ROUND_ORDER.map(round => {
          const ms = roundMatches(round.key);
          return (
            <section key={round.key} className="bg-card/60 border border-border rounded-xl overflow-hidden">
              <header className="px-4 py-3 border-b border-border bg-background/40 flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-wider">{round.label}</h3>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {ms.filter(m => m.isComplete).length}/{ms.length}
                </span>
              </header>
              <div className="divide-y divide-border">
                {ms.map(m => (
                  <BracketMatch
                    key={m.id}
                    match={m}
                    onPickWinner={onPickWinner}
                    highlightTeam={highlightTeam}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function BracketMatch({
  match, onPickWinner, highlightTeam,
}: { match: ResolvedMatch; onPickWinner: (id: string, w: string) => void; highlightTeam?: string | null }) {
  const meta = MATCH_META[match.id];
  const ready = match.isReady && !match.isComplete;
  const locked = !match.isReady;
  const winner =
    match.result
      ? match.result.goals1 > match.result.goals2 ? match.team1
      : match.result.goals2 > match.result.goals1 ? match.team2
      : match.result.winnerId
      : null;

  return (
    <motion.div
      layout
      className={`px-4 py-3 transition-colors ${
        ready ? "bg-accent/5" : ""
      } ${locked ? "opacity-60" : ""}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
          {meta?.stageLabel} · #{meta?.matchNumber}
        </span>
        {match.isComplete && (
          <span className="text-[9px] font-mono font-bold text-pitch">✓ DONE</span>
        )}
        {ready && (
          <span className="text-[9px] font-mono font-bold text-accent">● READY</span>
        )}
      </div>

      {[match.team1, match.team2].map((team, i) => {
        const isSlot = /^(W_|R_|T3_|L_)/.test(team);
        const isWin = winner === team;
        const isHi = highlightTeam && team === highlightTeam;
        const goals = match.result ? (i === 0 ? match.result.goals1 : match.result.goals2) : null;
        return (
          <div
            key={i}
            className={`flex items-center justify-between gap-2 py-1.5 ${
              match.isComplete && !isWin ? "opacity-50 line-through" : ""
            } ${isHi ? "text-accent font-bold" : ""}`}
          >
            <div className="flex items-center gap-2 min-w-0">
              {!isSlot && <TeamFlag name={team} size={20} />}
              <span className={`text-sm truncate ${isWin ? "font-black" : "font-medium"} ${isSlot ? "text-muted-foreground italic" : ""}`}>
                {isSlot ? "TBD" : team}
              </span>
            </div>
            <span className="font-mono text-sm font-bold tabular-nums">{goals ?? "–"}</span>
          </div>
        );
      })}

      {ready && (
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {[match.team1, match.team2].map(t => (
            <button
              key={t}
              onClick={() => onPickWinner(match.id, t)}
              className="min-h-[40px] px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded bg-accent/15 hover:bg-accent/30 text-accent border border-accent/30 transition"
            >
              {t} wins
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
