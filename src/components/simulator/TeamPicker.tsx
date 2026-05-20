import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ALL_TEAMS, GROUPS } from "@/data/wc2026Fixtures";
import { TeamFlag } from "./TeamFlag";
import groupsImg from "@/assets/wc2026-groups.png";

interface Props {
  onConfirm: (team: string) => void;
  onBack: () => void;
}

export function TeamPicker({ onConfirm, onBack }: Props) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const teamGroups = useMemo(() => {
    const map: Record<string, string> = {};
    for (const [g, teams] of Object.entries(GROUPS)) {
      for (const t of teams) map[t.name] = g;
    }
    return map;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_TEAMS;
    return ALL_TEAMS.filter(t => t.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="relative min-h-[calc(100vh-220px)] px-4 sm:px-6 py-8">
      <div className="absolute inset-0 -z-10">
        <img src={groupsImg} alt="" className="w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/90 to-background" />
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back
          </button>
          <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
            Team Journey · pick one of 48
          </p>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-5">
          Choose your nation
        </h1>

        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="🔍  Search for your team…"
          className="w-full bg-card/80 backdrop-blur border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/60 mb-6"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 mb-24">
          {filtered.map(team => {
            const isSel = selected === team.name;
            return (
              <button
                key={team.name}
                onClick={() => setSelected(team.name)}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg border text-left min-h-[56px] transition-all ${
                  isSel
                    ? "border-accent bg-accent/10 ring-2 ring-accent/40"
                    : "border-border/60 bg-card/60 hover:border-foreground/40 hover:bg-card"
                }`}
              >
                <TeamFlag name={team.name} size={32} />
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">{team.name}</p>
                  <p className="text-[10px] font-mono uppercase text-muted-foreground">
                    Group {teamGroups[team.name]}
                  </p>
                </div>
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground text-sm py-12">
              No teams match "{query}".
            </p>
          )}
        </div>

        {selected && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl"
          >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <TeamFlag name={selected} size={36} />
                <div className="min-w-0">
                  <p className="text-[10px] font-mono uppercase text-muted-foreground">Selected</p>
                  <p className="text-base font-bold truncate">{selected}</p>
                </div>
              </div>
              <button
                onClick={() => onConfirm(selected)}
                className="px-5 sm:px-6 py-3 min-h-[48px] bg-accent text-accent-foreground rounded-lg text-[11px] sm:text-xs font-bold uppercase tracking-widest hover:brightness-110 transition shrink-0"
              >
                Simulate as {selected.split(" ")[0]} →
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
