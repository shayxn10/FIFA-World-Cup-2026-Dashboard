import { useEffect, useState } from "react";
import { fetchLeaderboard, fetchTotalSimulations, type LeaderboardRow } from "@/hooks/useLeaderboard";
import { TEAM_CODES } from "@/utils/teamCodes";

interface Props {
  refreshKey?: number;
}

type Status = "loading" | "ok" | "empty" | "error";

export function SimulatorLeaderboard({ refreshKey = 0 }: Props) {
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    (async () => {
      try {
        const [list, sum] = await Promise.all([fetchLeaderboard(), fetchTotalSimulations()]);
        if (cancelled) return;
        setRows(list);
        setTotal(sum);
        if (list.length === 0) setStatus("empty");
        else setStatus("ok");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => { cancelled = true; };
  }, [refreshKey]);

  if (status === "error") return null;

  const max = rows[0]?.win_count ?? 1;

  return (
    <div
      style={{
        background: "#111827",
        border: "1px solid #1f2d45",
        borderRadius: 8,
        padding: 24,
        maxWidth: 480,
        width: "100%",
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontFamily: "Bebas Neue, var(--font-display)",
          fontSize: 20,
          color: "#ffffff",
          letterSpacing: "0.15em",
        }}
      >
        🏆 SIMULATOR LEADERBOARD
      </div>
      <div
        style={{
          fontFamily: "DM Sans, system-ui, sans-serif",
          fontSize: 12,
          color: "#8899aa",
          marginTop: 4,
        }}
      >
        Who are people simulating as champion?
      </div>
      <div
        style={{
          fontFamily: "DM Sans, system-ui, sans-serif",
          fontSize: 12,
          color: "#f5a623",
          marginTop: 4,
          marginBottom: 20,
        }}
      >
        Based on {total.toLocaleString()} completed simulation{total === 1 ? "" : "s"}
      </div>

      {status === "loading" && (
        <div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: 38,
                marginBottom: 8,
                borderRadius: 4,
                background: "#1f2d45",
                animation: "lbShimmer 2s ease-in-out infinite",
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
          <style>{`
            @keyframes lbShimmer {
              0% { opacity: 0.4 }
              50% { opacity: 0.8 }
              100% { opacity: 0.4 }
            }
          `}</style>
        </div>
      )}

      {status === "empty" && (
        <div
          style={{
            fontFamily: "DM Sans, system-ui, sans-serif",
            fontSize: 13,
            color: "#8899aa",
            textAlign: "center",
            padding: 24,
            lineHeight: 1.5,
          }}
        >
          No simulations completed yet.<br />
          Be the first to simulate the 2026 World Cup.
        </div>
      )}

      {status === "ok" && rows.map((row, idx) => {
        const meta = TEAM_CODES[row.team_name] ?? { code: "", flag: "🏳️" };
        const pct = total > 0 ? Math.round((row.win_count / total) * 100) : 0;
        const barPct = max > 0 ? (row.win_count / max) * 100 : 0;
        return (
          <div
            key={row.team_name}
            style={{
              padding: "8px 0",
              borderBottom: "1px solid #1f2d45",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  fontFamily: "DM Sans, system-ui, sans-serif",
                  fontSize: 13,
                  color: "#8899aa",
                  width: 20,
                }}
              >
                {idx + 1}
              </div>
              <div style={{ fontSize: 20, lineHeight: 1 }}>{meta.flag}</div>
              <div
                style={{
                  flex: 1,
                  fontFamily: "DM Sans, system-ui, sans-serif",
                  fontSize: 13,
                  color: "#ffffff",
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {row.team_name}
              </div>
              <div
                style={{
                  fontFamily: "JetBrains Mono, ui-monospace, monospace",
                  fontSize: 13,
                  color: "#f5a623",
                  width: 48,
                  textAlign: "right",
                }}
              >
                {row.win_count}
              </div>
              <div
                style={{
                  fontFamily: "DM Sans, system-ui, sans-serif",
                  fontSize: 11,
                  color: "#8899aa",
                  width: 36,
                  textAlign: "right",
                }}
              >
                {pct}%
              </div>
            </div>
            <div
              style={{
                height: 3,
                background: "#1f2d45",
                borderRadius: 2,
                marginTop: 6,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${barPct}%`,
                  background: "#f5a623",
                  borderRadius: 2,
                  transition: "width 400ms ease",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
