import type { StrategicCouncilResult } from "../../../lib/council/strategicCouncilTypes";

export function normalizeStrategicCouncilPanelData(input: StrategicCouncilResult | null | undefined) {
  if (!input?.active) return null;
  return {
    summary: input.synthesis?.summary ?? input.synthesis?.headline ?? null,
    recommendation: input.synthesis?.recommended_direction ?? input.synthesis?.top_actions?.[0] ?? null,
  };
}
