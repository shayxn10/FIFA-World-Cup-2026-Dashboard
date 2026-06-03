
CREATE TABLE public.simulator_winners (
  team_name TEXT PRIMARY KEY,
  win_count INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.simulator_winners TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.simulator_winners TO authenticated;
GRANT ALL ON public.simulator_winners TO service_role;

ALTER TABLE public.simulator_winners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view leaderboard"
  ON public.simulator_winners FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert winners"
  ON public.simulator_winners FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update winners"
  ON public.simulator_winners FOR UPDATE
  USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.increment_winner(p_team TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.simulator_winners (team_name, win_count, updated_at)
  VALUES (p_team, 1, now())
  ON CONFLICT (team_name)
  DO UPDATE SET win_count = public.simulator_winners.win_count + 1,
                updated_at = now();
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_winner(TEXT) TO anon, authenticated, service_role;
