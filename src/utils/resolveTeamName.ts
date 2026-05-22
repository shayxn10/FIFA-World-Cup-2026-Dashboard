export function resolveTeamName(
  raw: string,
  bracket: Record<string, string | null>,
): string {
  if (!raw) return "TBD";
  if (/^(T3_|W_|R_|L_)/.test(raw)) {
    return bracket[raw] ?? "TBD";
  }
  return raw;
}

export function allT3SlotsResolved(
  bracket: Record<string, string | null>,
): boolean {
  const t3keys = Object.keys(bracket).filter(k => k.startsWith("T3_"));
  if (t3keys.length === 0) return false;
  return t3keys.every(k => bracket[k] !== null && bracket[k] !== undefined);
}
