import type { PanelPayloadSourceFlags } from "./panelPayloadBuilderTypes";
import { resolveDashboardPayloadPolicy } from "../panelPayloadPolicy";

type BuildDashboardPanelPayloadArgs = {
  currentView: string | null | undefined;
  resolvedPanelData: unknown;
  dashboard: unknown;
  decisionCockpitSlice: unknown;
  executiveSummary: unknown;
  rawExecutiveSummary: unknown;
  rawDecisionCockpit: unknown;
  canonicalPanelPayload: Record<string, unknown>;
  decisionCockpit: unknown;
  advicePayload: unknown;
  fallbackStrategicAdvice: unknown;
  conflictPayload: unknown;
  responseConflict: unknown;
  responseConflicts: unknown;
  legacyConflicts: unknown;
};

export function buildDashboardPanelPayload(args: BuildDashboardPanelPayloadArgs): {
  payload: Record<string, unknown>;
  sourceFlags: PanelPayloadSourceFlags;
} {
  const resolved = resolveDashboardPayloadPolicy<unknown>({
    resolved: args.currentView === "dashboard" || args.currentView === "simulate" ? args.resolvedPanelData : null,
    canonicalDashboard: args.dashboard ?? null,
    canonicalDecisionCockpit: args.decisionCockpitSlice ?? null,
    canonicalExecutiveSummary: args.executiveSummary ?? null,
    rawExecutiveSummary: args.rawExecutiveSummary ?? null,
    rawDecisionCockpit: args.rawDecisionCockpit ?? null,
  });

  return {
    payload: {
      ...args.canonicalPanelPayload,
      executive_summary_surface: resolved.payload,
      decision_cockpit: args.decisionCockpitSlice ?? args.decisionCockpit ?? args.rawDecisionCockpit ?? null,
      strategic_advice: args.advicePayload ?? args.fallbackStrategicAdvice ?? null,
      conflict: args.conflictPayload ?? args.responseConflict ?? null,
      conflicts:
        (Array.isArray(args.conflictPayload) ? args.conflictPayload : null) ??
        args.responseConflicts ??
        args.legacyConflicts ??
        null,
    },
    sourceFlags: resolved.sourceFlags,
  };
}
