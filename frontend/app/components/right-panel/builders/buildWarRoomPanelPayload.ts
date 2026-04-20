import type { PanelPayloadSourceFlags } from "./panelPayloadBuilderTypes";
import { resolveWarRoomPayloadPolicy } from "../panelPayloadPolicy";

type BuildWarRoomPanelPayloadArgs = {
  currentView: string | null | undefined;
  resolvedPanelData: unknown;
  warRoom: unknown;
  strategicCouncil: unknown;
  canonicalRecommendation: unknown;
  normalizedWarRoomPanelData: unknown;
  rawWarRoomIntelligence: unknown;
  canonicalPanelPayload: Record<string, unknown>;
  advicePayload: unknown;
  fallbackStrategicAdvice: unknown;
  warRoomRecommendation: unknown;
  dashboardRecommendation: unknown;
};

export function buildWarRoomPanelPayload(args: BuildWarRoomPanelPayloadArgs): {
  payload: Record<string, unknown>;
  sourceFlags: PanelPayloadSourceFlags;
} {
  const resolved = resolveWarRoomPayloadPolicy<unknown>({
    resolved: args.currentView === "war_room" ? args.resolvedPanelData : null,
    canonicalWarRoom: args.warRoom ?? null,
    canonicalStrategicCouncil: args.strategicCouncil ?? null,
    rawWarRoom: args.normalizedWarRoomPanelData ?? args.rawWarRoomIntelligence ?? null,
  });
  const warRoomPayload = resolved.payload;

  return {
    payload: {
      ...args.canonicalPanelPayload,
      ...(warRoomPayload && typeof warRoomPayload === "object" && !Array.isArray(warRoomPayload)
        ? (warRoomPayload as Record<string, unknown>)
        : {}),
      warRoom: warRoomPayload,
      multi_agent_decision: warRoomPayload,
      strategic_advice: args.advicePayload ?? args.fallbackStrategicAdvice ?? null,
      canonical_recommendation:
        args.canonicalRecommendation ??
        args.warRoomRecommendation ??
        args.dashboardRecommendation ??
        null,
    },
    sourceFlags: resolved.sourceFlags,
  };
}
