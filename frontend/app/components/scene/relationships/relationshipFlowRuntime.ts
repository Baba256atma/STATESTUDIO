import type { RelationshipFocusRole } from "../../../lib/relationships/executive/executiveRelationshipTypes";
import type { NexoraRelationship } from "../../../lib/relationships/relationshipTypes";

export type RelationshipFlowStrengthTier =
  | "very_weak"
  | "weak"
  | "normal"
  | "strong"
  | "very_strong";

export type RelationshipFlowBallConfig = {
  tier: RelationshipFlowStrengthTier;
  ballCount: number;
  speedMultiplier: number;
};

const SELECTED_OBJECT_FLOW_ROLES = new Set<RelationshipFocusRole>([
  "direct_dependency",
  "critical_influence",
  "major_risk_route",
]);

const MAX_FLOW_BALLS = 5;
const BASE_FLOW_CYCLE_SECONDS = 2.4;
const FLOW_ENDPOINT_PADDING = 0.08;

export function readRelationshipFlowStrength(relationship: NexoraRelationship): number {
  const metadata = relationship.metadata;
  const raw =
    (typeof metadata?.strength === "number" ? metadata.strength : null) ??
    (typeof metadata?.relationshipStrength === "number" ? metadata.relationshipStrength : null);
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return Math.min(1, Math.max(0, raw));
  }
  return 0.5;
}

export function resolveRelationshipFlowStrengthTier(strength: number): RelationshipFlowStrengthTier {
  const normalized = Math.min(1, Math.max(0, strength));
  if (normalized < 0.2) return "very_weak";
  if (normalized < 0.4) return "weak";
  if (normalized < 0.6) return "normal";
  if (normalized < 0.8) return "strong";
  return "very_strong";
}

export function resolveRelationshipFlowBallConfig(strength: number): RelationshipFlowBallConfig {
  const tier = resolveRelationshipFlowStrengthTier(strength);
  switch (tier) {
    case "very_weak":
      return { tier, ballCount: 1, speedMultiplier: 0.3 };
    case "weak":
      return { tier, ballCount: 2, speedMultiplier: 0.5 };
    case "normal":
      return { tier, ballCount: 3, speedMultiplier: 1 };
    case "strong":
      return { tier, ballCount: 4, speedMultiplier: 1.5 };
    case "very_strong":
      return { tier, ballCount: 5, speedMultiplier: 2 };
  }
}

export function shouldShowRelationshipFlowBalls(input: {
  selectedObjectId?: string | null;
  focusRole?: RelationshipFocusRole | null;
}): boolean {
  if (!input.selectedObjectId?.trim()) return false;
  if (!input.focusRole) return false;
  return SELECTED_OBJECT_FLOW_ROLES.has(input.focusRole);
}

export function resolveFlowBallPhaseOffset(ballIndex: number, ballCount: number): number {
  if (ballCount <= 1) return 0;
  return ballIndex / ballCount;
}

export function resolveFlowBallProgress(
  elapsedSeconds: number,
  speedMultiplier: number,
  phaseOffset: number
): number {
  const cycleDuration = BASE_FLOW_CYCLE_SECONDS / Math.max(0.1, speedMultiplier);
  const linear = (elapsedSeconds / cycleDuration + phaseOffset) % 1;
  return FLOW_ENDPOINT_PADDING + linear * (1 - FLOW_ENDPOINT_PADDING * 2);
}

export function interpolateLinePoint(
  start: readonly [number, number, number],
  end: readonly [number, number, number],
  progress: number
): [number, number, number] {
  const t = Math.min(1, Math.max(0, progress));
  return [
    start[0] + (end[0] - start[0]) * t,
    start[1] + (end[1] - start[1]) * t,
    start[2] + (end[2] - start[2]) * t,
  ];
}

export function clampRelationshipFlowBallCount(ballCount: number): number {
  return Math.min(MAX_FLOW_BALLS, Math.max(1, Math.round(ballCount)));
}
