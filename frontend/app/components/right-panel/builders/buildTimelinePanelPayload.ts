import type { PanelPayloadSourceFlags } from "./panelPayloadBuilderTypes";
import { resolveTimelinePayloadPolicy } from "../panelPayloadPolicy";

type BuildTimelinePanelPayloadArgs = {
  currentView: string | null | undefined;
  resolvedPanelData: unknown;
  canonicalTimeline: unknown;
  rawTimelineImpact: unknown;
  rawSimulationTimeline: unknown;
  canonicalPanelPayload: Record<string, unknown>;
  advicePayload: unknown;
  fallbackStrategicAdvice: unknown;
};

export function buildTimelinePanelPayload(args: BuildTimelinePanelPayloadArgs): {
  payload: Record<string, unknown>;
  sourceFlags: PanelPayloadSourceFlags;
} {
  const resolved = resolveTimelinePayloadPolicy<unknown>({
    resolved: args.currentView === "timeline" ? args.resolvedPanelData : null,
    canonical: args.canonicalTimeline ?? null,
    rawTimelineImpact: args.rawTimelineImpact ?? null,
    rawSimulationTimeline: args.rawSimulationTimeline ?? null,
  });

  return {
    payload: {
      ...args.canonicalPanelPayload,
      timeline_impact: resolved.payload,
      strategic_advice: args.advicePayload ?? args.fallbackStrategicAdvice ?? null,
    },
    sourceFlags: resolved.sourceFlags,
  };
}
