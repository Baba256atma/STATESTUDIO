import type { PanelSafeStatus } from "./panelDataResolverTypes";

export function getPanelSafeStatus(args: {
  hasPrimaryData: boolean;
  hasPartialData: boolean;
  hasFallbackData: boolean;
}): PanelSafeStatus {
  if (args.hasPrimaryData) return "ready";
  if (args.hasPartialData) return "partial";
  if (args.hasFallbackData) return "fallback";
  return "empty_but_guided";
}
