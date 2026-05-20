import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GROUPS } from "@/data/wc2026Fixtures";
import { TeamFlag } from "./TeamFlag";
import type { TournamentState } from "@/engine/tournamentEngine";

interface Props {
  open: boolean;
  onClose: () => void;
  state: TournamentState;
  highlightTeam?: string | null;
}

const GROUP_KEYS = Object.keys(GROUPS);

export function StandingsDrawer({ open, onClose, state, highlightTeam }: Props) {
  const [tab, setTab] = useState<string>(GROUP_KEYS[0]);
  const table = state.groups[tab] ?? [];

  // Ensure every group has a placeholder row even before any matches are played
  const placeholder = !table.length
    ? GROUPS[tab].map((t, i) => ({
        team: t.name, played:0,won:0,drawn:0,lost:0,goalsFor:0,goalsAgainst:0,
        goalDifference:0, points:0, position: i + 1,
      }))
    : table;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50"
          />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full sm:max-w-md bg-card border-l border-border shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">Group Standings</p>
                <h2 className="text-xl font-black uppercase tracking-tight">Live tables</h2>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-border overflow-x-auto">
              <div className="flex min-w-max px-2">
                {GROUP_KEYS.map(g => (
                  <button
                    key={g}
                    onClick={() => setTab(g)}
                    className={`px-3.5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
                      tab === g
                        ? "border-accent text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <table className="w-full text-xs">
                <thead className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left pb-2 pl-1 w-8">#</th>
                    <th className="text-left pb-2">Team</th>
                    <th className="pb-2 w-7">P</th>
                    <th className="pb-2 w-7">W</th>
                    <th className="pb-2 w-7">D</th>
                    <th className="pb-2 w-7">L</th>
                    <th className="pb-2 w-9">GD</th>
                    <th className="pb-2 w-9 text-right pr-1">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {placeholder.map((r, i) => {
                    const accent =
                      i < 2 ? "border-l-pitch"
                      : i === 2 ? "border-l-amber"
                      : "border-l-transparent";
                    const isHi = highlightTeam && r.team === highlightTeam;
                    return (
                      <tr
                        key={r.team}
                        className={`border-l-2 ${accent} ${isHi ? "bg-accent/10" : ""}`}
                      >
                        <td className="py-2 pl-2 font-mono text-muted-foreground">{r.position}</td>
                        <td className="py-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <TeamFlag name={r.team} size={20} />
                            <span className={`truncate ${isHi ? "text-accent font-bold" : "font-semibold"}`}>{r.team}</span>
                          </div>
                        </td>
                        <td className="text-center font-mono">{r.played}</td>
                        <td className="text-center font-mono">{r.won}</td>
                        <td className="text-center font-mono">{r.drawn}</td>
                        <td className="text-center font-mono">{r.lost}</td>
                        <td className="text-center font-mono">{r.goalDifference > 0 ? `+${r.goalDifference}` : r.goalDifference}</td>
                        <td className="text-right pr-1 font-bold font-mono text-accent">{r.points}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="mt-4 flex items-center gap-4 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-pitch" /> Qualified</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-amber" /> Best 3rd</span>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
