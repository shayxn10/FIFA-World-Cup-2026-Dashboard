import { supabase } from "@/integrations/supabase/client";

export interface LeaderboardRow {
  team_name: string;
  win_count: number;
}

export async function recordWinner(teamName: string): Promise<void> {
  if (!teamName) return;
  try {
    await supabase.rpc("increment_winner", { p_team: teamName });
  } catch (err) {
    console.warn("[leaderboard] recordWinner failed", err);
  }
}

export async function fetchLeaderboard(): Promise<LeaderboardRow[]> {
  try {
    const { data, error } = await supabase
      .from("simulator_winners")
      .select("team_name, win_count")
      .order("win_count", { ascending: false })
      .limit(10);
    if (error) throw error;
    return (data ?? []) as LeaderboardRow[];
  } catch (err) {
    console.warn("[leaderboard] fetchLeaderboard failed", err);
    return [];
  }
}

export async function fetchTotalSimulations(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from("simulator_winners")
      .select("win_count");
    if (error) throw error;
    return (data ?? []).reduce((s: number, r: { win_count: number }) => s + (r.win_count ?? 0), 0);
  } catch (err) {
    console.warn("[leaderboard] fetchTotalSimulations failed", err);
    return 0;
  }
}
