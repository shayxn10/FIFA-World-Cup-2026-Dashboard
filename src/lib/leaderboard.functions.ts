import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { TEAM_CODES } from "@/utils/teamCodes";

const VALID_TEAMS = new Set(Object.keys(TEAM_CODES));

export const recordWinnerFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ team: z.string().min(1).max(64) }).parse(data),
  )
  .handler(async ({ data }) => {
    if (!VALID_TEAMS.has(data.team)) {
      throw new Error("Invalid team");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.rpc("increment_winner", { p_team: data.team });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
