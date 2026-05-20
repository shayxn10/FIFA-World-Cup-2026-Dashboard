import { createFileRoute } from "@tanstack/react-router";
import { SimulatorPage } from "@/components/simulator/SimulatorPage";

export const Route = createFileRoute("/simulator")({
  head: () => ({
    meta: [
      { title: "FIFA World Cup 2026 Simulator" },
      { name: "description", content: "Interactive World Cup 2026 simulator — play every match or follow your team's journey to the trophy." },
      { property: "og:title", content: "FIFA World Cup 2026 Simulator" },
      { property: "og:description", content: "Simulate the entire World Cup 2026 match-by-match, or pick a nation and track their road to glory." },
    ],
  }),
  component: SimulatorPage,
});
