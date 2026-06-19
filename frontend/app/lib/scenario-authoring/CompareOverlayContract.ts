/**
 * C:2 — Canonical Compare Scene Overlay contract.
 *
 * Immutable, read-only overlay metadata for Scenario A vs B visualization.
 * This contract does not render UI and has no scene or topology mutation
 * authority.
 */

import type { ScenarioComparisonResult } from "./ScenarioComparisonContract.ts";

export const COMPARE_OVERLAY_CONTRACT_DIAGNOSTIC = "[COMPARE_OVERLAY_CONTRACT]" as const;

export const COMPARE_OVERLAY_READY_DIAGNOSTIC = "[COMPARE_OVERLAY_READY]" as const;

export const C2_OVERLAY_CONTRACT_COMPLETE_TAG = "[C2_OVERLAY_CONTRACT_COMPLETE]" as const;

export const COMPARE_OVERLAY_CONTRACT_VERSION = "1.0.0" as const;

export type CompareOverlayScenarioRole = "scenarioA" | "scenarioB" | "shared";

export type CompareOverlayMarkerKind = "object" | "relationship" | "kpi" | "risk" | "summary";

export type CompareOverlayMarker = Readonly<{
  markerId: string;
  scenarioRole: CompareOverlayScenarioRole;
  markerKind: CompareOverlayMarkerKind;
  targetId: string;
  label: string;
  intensity: number;
  confidence: number;
  readOnly: true;
  sceneMutation: false;
  topologyMutation: false;
}>;

export type CompareOverlayProfile = Readonly<{
  profileId: string;
  comparisonId: string;
  scenarioAId: string;
  scenarioBId: string;
  markers: readonly CompareOverlayMarker[];
  markerCount: number;
  supportsScenarioAvsB: true;
  readOnly: true;
  sceneMutation: false;
  topologyMutation: false;
}>;

export type CompareOverlayState = Readonly<{
  version: typeof COMPARE_OVERLAY_CONTRACT_VERSION;
  activeComparisonId: string;
  profiles: readonly CompareOverlayProfile[];
  markers: readonly CompareOverlayMarker[];
  profileCount: number;
  markerCount: number;
  supportsScenarioAvsB: true;
  readOnly: true;
  sceneMutation: false;
  topologyMutation: false;
  routingMutation: false;
  diagnostics: readonly [
    typeof COMPARE_OVERLAY_CONTRACT_DIAGNOSTIC,
    typeof COMPARE_OVERLAY_READY_DIAGNOSTIC,
  ];
}>;

export type CompareOverlayContract = Readonly<{
  version: typeof COMPARE_OVERLAY_CONTRACT_VERSION;
  stateContract: "CompareOverlayState";
  profileContract: "CompareOverlayProfile";
  markerContract: "CompareOverlayMarker";
  supportsScenarioAvsB: true;
  readOnly: true;
  sceneMutation: false;
  topologyMutation: false;
  diagnostics: readonly [
    typeof COMPARE_OVERLAY_CONTRACT_DIAGNOSTIC,
    typeof COMPARE_OVERLAY_READY_DIAGNOSTIC,
  ];
}>;

export const COMPARE_OVERLAY_DIAGNOSTICS = Object.freeze([
  COMPARE_OVERLAY_CONTRACT_DIAGNOSTIC,
  COMPARE_OVERLAY_READY_DIAGNOSTIC,
] as const);

export const COMPARE_OVERLAY_CONTRACT: CompareOverlayContract = Object.freeze({
  version: COMPARE_OVERLAY_CONTRACT_VERSION,
  stateContract: "CompareOverlayState",
  profileContract: "CompareOverlayProfile",
  markerContract: "CompareOverlayMarker",
  supportsScenarioAvsB: true,
  readOnly: true,
  sceneMutation: false,
  topologyMutation: false,
  diagnostics: COMPARE_OVERLAY_DIAGNOSTICS,
});

export const EMPTY_COMPARE_OVERLAY_STATE: CompareOverlayState = Object.freeze({
  version: COMPARE_OVERLAY_CONTRACT_VERSION,
  activeComparisonId: "",
  profiles: Object.freeze([]),
  markers: Object.freeze([]),
  profileCount: 0,
  markerCount: 0,
  supportsScenarioAvsB: true,
  readOnly: true,
  sceneMutation: false,
  topologyMutation: false,
  routingMutation: false,
  diagnostics: COMPARE_OVERLAY_DIAGNOSTICS,
});

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function buildCompareOverlayMarker(
  input: Omit<CompareOverlayMarker, "readOnly" | "sceneMutation" | "topologyMutation">
): CompareOverlayMarker {
  return Object.freeze({
    ...input,
    intensity: clampScore(input.intensity),
    confidence: clampScore(input.confidence),
    readOnly: true as const,
    sceneMutation: false as const,
    topologyMutation: false as const,
  });
}

export function buildCompareOverlayProfile(
  input: Omit<
    CompareOverlayProfile,
    "markers" | "markerCount" | "supportsScenarioAvsB" | "readOnly" | "sceneMutation" | "topologyMutation"
  > & {
    markers: readonly CompareOverlayMarker[];
  }
): CompareOverlayProfile {
  const markers = Object.freeze(input.markers.map((marker) => buildCompareOverlayMarker(marker)));
  return Object.freeze({
    profileId: input.profileId,
    comparisonId: input.comparisonId,
    scenarioAId: input.scenarioAId,
    scenarioBId: input.scenarioBId,
    markers,
    markerCount: markers.length,
    supportsScenarioAvsB: true as const,
    readOnly: true as const,
    sceneMutation: false as const,
    topologyMutation: false as const,
  });
}

export function buildCompareOverlayState(input: {
  activeComparisonId: string;
  profiles: readonly CompareOverlayProfile[];
}): CompareOverlayState {
  const profiles = Object.freeze(input.profiles.map((profile) => buildCompareOverlayProfile(profile)));
  const markers = Object.freeze(profiles.flatMap((profile) => [...profile.markers]));
  return Object.freeze({
    version: COMPARE_OVERLAY_CONTRACT_VERSION,
    activeComparisonId: input.activeComparisonId,
    profiles,
    markers,
    profileCount: profiles.length,
    markerCount: markers.length,
    supportsScenarioAvsB: true as const,
    readOnly: true as const,
    sceneMutation: false as const,
    topologyMutation: false as const,
    routingMutation: false as const,
    diagnostics: COMPARE_OVERLAY_DIAGNOSTICS,
  });
}

function markerKind(category: string | undefined): CompareOverlayMarkerKind {
  if (category === "object" || category === "relationship" || category === "kpi" || category === "risk") {
    return category;
  }
  return "summary";
}

export function buildCompareOverlayProfileFromComparison(
  comparison: ScenarioComparisonResult
): CompareOverlayProfile {
  const markers = comparison.differences.map((difference) =>
    buildCompareOverlayMarker({
      markerId: `compare-marker:${difference.differenceId}`,
      scenarioRole: difference.advantage === "scenarioA" || difference.advantage === "scenarioB"
        ? difference.advantage
        : "shared",
      markerKind: markerKind(difference.category),
      targetId: difference.differenceId,
      label: difference.summary,
      intensity: Math.abs(difference.overallImpactDelta) + Math.abs(difference.riskMovementDelta),
      confidence: 100 - Math.abs(difference.confidenceDelta),
    })
  );

  return buildCompareOverlayProfile({
    profileId: `compare-overlay:${comparison.request.comparisonId}`,
    comparisonId: comparison.request.comparisonId,
    scenarioAId: comparison.comparedScenarioIds[0],
    scenarioBId: comparison.comparedScenarioIds[1],
    markers,
  });
}
