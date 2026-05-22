import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { TodayMatches } from "@/components/TodayMatches/TodayMatches";
import wc2026Logo from "@/assets/wc2026-logo.png";

const TOURNAMENT_START = new Date("2026-06-11T15:00:00-06:00");
const TOURNAMENT_END = new Date("2026-07-19T23:59:59-04:00");

const CHAMPION = { name: "", flag: "", date: "July 19, 2026 · New York / New Jersey" };

function getPhase(now = new Date()) {
  if (now < TOURNAMENT_START) return "pre" as const;
  if (now > TOURNAMENT_END) return "post" as const;
  return "live" as const;
}

function FlipNumber({ value, label }: { value: number; label: string }) {
  return (
    <div
      className="relative flex flex-col items-center justify-center overflow-hidden rounded-md
                 w-[80px] sm:w-[120px] xl:w-[160px]"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(245,166,35,0.15)",
        padding: "28px 16px 20px",
        perspective: "400px",
      }}
    >
      <div
        className="absolute top-0 left-0 w-full"
        style={{ height: 1, background: "rgba(245,166,35,0.3)" }}
      />
      <div style={{ transformStyle: "preserve-3d" }} className="h-[56px] sm:h-[72px] xl:h-[96px] flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ rotateX: 90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: -90, opacity: 0 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            style={{
              fontFamily: "Bebas Neue, var(--font-display)",
              color: "#f5a623",
              lineHeight: 1,
              display: "inline-block",
            }}
            className="text-[52px] sm:text-[72px] xl:text-[96px] tabular-nums"
          >
            {String(value).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
      </div>
      <span
        className="mt-2 text-[10px] sm:text-[11px] text-center"
        style={{
          color: "#8899aa",
          letterSpacing: "0.25em",
          fontFamily: "var(--font-display)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function Colon({ hideOnMobile = false }: { hideOnMobile?: boolean }) {
  return (
    <span
      className={`${hideOnMobile ? "hidden sm:inline" : ""} self-start`}
      style={{
        fontFamily: "Bebas Neue, var(--font-display)",
        color: "#f5a623",
        paddingTop: 16,
        animation: "blink 1s infinite",
        lineHeight: 1,
      }}
    >
      <span className="text-[40px] sm:text-[64px]">:</span>
    </span>
  );
}

function Divider() {
  return (
    <div
      style={{
        height: 1,
        margin: "24px 0",
        background:
          "linear-gradient(to right, transparent 0%, rgba(245,166,35,0.6) 20%, rgba(245,166,35,0.9) 50%, rgba(245,166,35,0.6) 80%, transparent 100%)",
      }}
    />
  );
}

function PhaseCountdown() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, TOURNAMENT_START.getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 text-center">
      {/* Logo / brand lockup */}
      <div className="flex justify-center" style={{ marginTop: 16 }}>
        <img
          src={wc2026Logo}
          alt="FIFA World Cup 2026"
          style={{
            width: 140,
            height: "auto",
            filter: "drop-shadow(0 0 24px rgba(245,166,35,0.4))",
          }}
        />
      </div>

      <Divider />

      <h3
        style={{
          fontFamily: "Bebas Neue, var(--font-display)",
          color: "#ffffff",
          letterSpacing: "0.2em",
          textShadow: "0 0 40px rgba(245,166,35,0.2)",
        }}
        className="text-[28px] sm:text-[36px] xl:text-[44px] mb-8"
      >
        THE WAIT IS ALMOST OVER
      </h3>

      <div className="flex items-stretch justify-center gap-1.5 sm:gap-2">
        <FlipNumber value={d} label="Days" />
        <Colon />
        <FlipNumber value={h} label="Hours" />
        <Colon />
        <FlipNumber value={m} label="Minutes" />
        <Colon hideOnMobile />
        <FlipNumber value={s} label="Seconds" />
      </div>

      <Divider />

      <div className="text-center mt-7">
        <span
          className="inline-flex items-center"
          style={{
            background: "rgba(245,166,35,0.08)",
            border: "1px solid rgba(245,166,35,0.25)",
            borderRadius: 20,
            padding: "5px 20px",
            color: "#f5a623",
            fontFamily: "var(--font-sans), DM Sans",
            fontSize: 11,
            letterSpacing: "0.2em",
            marginBottom: 16,
          }}
        >
          ⚽ OPENING MATCH
        </span>
        <p
          style={{
            fontFamily: "Bebas Neue, var(--font-display)",
            color: "#8899aa",
            letterSpacing: "0.15em",
            fontSize: 18,
            marginBottom: 12,
          }}
        >
          JUNE 11, 2026 · 15:00 EST
        </p>

        {/* Teams */}
        <p
          className="hidden sm:block"
          style={{
            fontFamily: "Bebas Neue, var(--font-display)",
            color: "#ffffff",
            letterSpacing: "0.1em",
            fontSize: 36,
            lineHeight: 1.1,
          }}
        >
          🇲🇽&nbsp;&nbsp;MEXICO&nbsp;&nbsp;
          <span style={{ color: "#f5a623", fontSize: 28 }}>vs</span>
          &nbsp;&nbsp;SOUTH AFRICA&nbsp;&nbsp;🇿🇦
        </p>
        <div
          className="sm:hidden flex flex-col items-center"
          style={{
            fontFamily: "Bebas Neue, var(--font-display)",
            color: "#ffffff",
            letterSpacing: "0.1em",
            fontSize: 24,
            lineHeight: 1.2,
          }}
        >
          <span>🇲🇽 MEXICO</span>
          <span style={{ color: "#f5a623", fontSize: 18 }}>vs</span>
          <span>SOUTH AFRICA 🇿🇦</span>
        </div>

        <p
          style={{
            fontFamily: "var(--font-sans), DM Sans",
            color: "#445566",
            fontSize: 13,
            marginTop: 6,
          }}
        >
          Estadio Azteca · Mexico City, Mexico
        </p>
      </div>

      <Link
        to="/simulator"
        className="broadcast-cta inline-flex items-center justify-center mx-4 sm:mx-0"
        style={{
          marginTop: 36,
          gap: 10,
          background: "linear-gradient(135deg, #f5a623 0%, #e8941a 50%, #d4820f 100%)",
          color: "#000",
          fontFamily: "Bebas Neue, var(--font-display)",
          fontSize: 20,
          letterSpacing: "0.12em",
          padding: "18px 56px",
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(245,166,35,0.35), 0 0 60px rgba(245,166,35,0.1)",
          transition: "all 200ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        ⚽ SIMULATE THE TOURNAMENT NOW
      </Link>

      <style>{`
        @keyframes blink { 0%,100% { opacity: 0.8; } 50% { opacity: 0.2; } }
        @keyframes goldPulse {
          0%,100% { opacity: 0.5; transform: translate(-50%,-50%) scale(1); }
          50%     { opacity: 1;   transform: translate(-50%,-50%) scale(1.1); }
        }
        .broadcast-cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 32px rgba(245,166,35,0.5), 0 0 80px rgba(245,166,35,0.15);
          background: linear-gradient(135deg, #fdb93a 0%, #f5a623 100%) !important;
        }
        .broadcast-cta:active { transform: translateY(-1px); }
      `}</style>
    </div>
  );
}

function PhasePost() {
  return (
    <div className="text-center relative py-6">
      <div className="absolute inset-0 -z-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(245,166,35,0.2), transparent 60%)" }} />
      <div className="text-7xl sm:text-8xl">{CHAMPION.flag || "🏆"}</div>
      <h2 style={{ fontFamily: "Bebas Neue, var(--font-display)", color: "#f5a623" }}
        className="text-[36px] sm:text-[56px] mt-2">{CHAMPION.name || "TBD"}</h2>
      <p style={{ fontFamily: "Bebas Neue, var(--font-display)", letterSpacing: "0.12em" }}
        className="text-white text-2xl mt-1">FIFA WORLD CHAMPIONS 2026</p>
      <p className="text-[13px] text-[#8899aa] mt-2">{CHAMPION.date}</p>
    </div>
  );
}

export function TournamentStatus() {
  const [phase, setPhase] = useState(() => getPhase());
  useEffect(() => { setPhase(getPhase()); }, []);

  return (
    <section
      className="relative w-full overflow-hidden rounded-2xl"
      style={{
        minHeight: 520,
        background: "#000000",
      }}
    >
      {/* Atmosphere gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(20,10,0,0.9) 0%, #000000 100%)",
        }}
      />
      {/* Golden center pulse */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: "50%",
          top: "50%",
          width: 600,
          height: 300,
          background:
            "radial-gradient(ellipse, rgba(245,166,35,0.07) 0%, transparent 70%)",
          transform: "translate(-50%,-50%)",
          animation: "goldPulse 4s ease-in-out infinite",
        }}
      />
      {/* Top vignette */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{ height: 120, background: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)" }}
      />
      {/* Bottom vignette */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: 120, background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative flex items-center justify-center py-10 sm:py-12"
        style={{ minHeight: 520 }}
      >
        {phase === "pre" && <PhaseCountdown />}
        {phase === "live" && <TodayMatches />}
        {phase === "post" && <PhasePost />}
      </motion.div>
    </section>
  );
}
