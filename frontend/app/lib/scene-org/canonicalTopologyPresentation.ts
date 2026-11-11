/**
 * NPA-T TOPOLOGY-STAGE-INTERACTION:1
 *
 * Presentation rules for a topology the Canonical Topology Engine already
 * recognized. This module does not analyze graphs and does not create edges.
 *
 * Position precedence:
 * 1. Positions the manager moved, and positions restored from a Scene.
 * 2. A layout the manager explicitly applies.
 * 3. A proposed layout fills only objects that have no position yet.
 * 4. Objects with no position stay with the existing Stage solver.
 */

import type {
  CanonicalTopologyAnalysis,
  CanonicalTopologyStructuralStatus,
  CanonicalTopologyType,
} from "./canonicalTopologyEngine.ts";
import { parseStagePlanePosition } from "./sceneOrgSavedSceneSpatialState.ts";

export const canonicalTopologyPresentationIdentity =
  "NPA-T TOPOLOGY-STAGE-INTERACTION:1/TopologyPresentation" as const;

export const TOPOLOGY_STATUS_LABEL: Readonly<Record<CanonicalTopologyStructuralStatus, string>> = Object.freeze({
  MATCH: "Detected",
  PARTIAL_MATCH: "Partially matched",
  NO_MATCH: "Not detected",
  INSUFFICIENT_DATA: "Insufficient data",
  UNSUPPORTED_SEMANTICS: "Unsupported semantics",
});

export type TopologyStructuralRole = "center" | "peripheral" | "root" | "member" | "unclassified";

export type StagePlanePoint = Readonly<{ x: number; y: number }>;

export function canonicalTopologyStatusLabel(status: CanonicalTopologyStructuralStatus): string {
  return TOPOLOGY_STATUS_LABEL[status];
}

export function topologyPresentationSelectable(
  topologyType: CanonicalTopologyType,
  status: CanonicalTopologyStructuralStatus,
): boolean {
  return topologyType !== "BUS" && status === "MATCH";
}

export function describeTopologyMembership(input: {
  readonly analysis: CanonicalTopologyAnalysis | null;
  readonly objectId: string | null;
  readonly selectedType: CanonicalTopologyType | null;
  readonly hierarchy: boolean;
}): Readonly<{
  presentation: CanonicalTopologyType | null;
  role: TopologyStructuralRole;
  explanation: string;
  hierarchyClaim: boolean;
}> {
  if (input.analysis == null || input.objectId == null || input.selectedType == null) {
    return Object.freeze({
      presentation: null,
      role: "unclassified" as const,
      explanation: "No topology presentation is selected.",
      hierarchyClaim: false,
    });
  }
  const candidate = input.analysis.candidates.find((entry) =>
    entry.topologyType === input.selectedType &&
    entry.hierarchy === input.hierarchy &&
    entry.structuralStatus === "MATCH");
  if (candidate == null || !candidate.nodeIds.includes(input.objectId)) {
    return Object.freeze({
      presentation: input.selectedType,
      role: "unclassified" as const,
      explanation: candidate?.explanation ?? "The selected presentation does not include this object.",
      hierarchyClaim: false,
    });
  }
  let role: TopologyStructuralRole = "member";
  if (candidate.topologyType === "STAR" && candidate.centerNodeId === input.objectId) role = "center";
  else if (candidate.topologyType === "STAR") role = "peripheral";
  else if (candidate.hierarchy && candidate.rootNodeIds.includes(input.objectId)) role = "root";
  return Object.freeze({
    presentation: candidate.topologyType,
    role,
    explanation: candidate.explanation,
    hierarchyClaim: candidate.hierarchy,
  });
}

function acceptedPoint(value: { readonly x: number; readonly y: number } | undefined): StagePlanePoint | null {
  if (value == null) return null;
  const parsed = parseStagePlanePosition({ x: value.x, y: value.y, z: 0 });
  return parsed ? { x: parsed.x, y: parsed.y } : null;
}

/**
 * `preserve` keeps every current valid position, including manual moves.
 * A proposal only fills objects that do not yet have a position.
 * `apply` replaces the arrangement with the proposal and clears manual marks.
 * Invalid coordinates are omitted. They are not clamped.
 */
export function mergePresentationPositions(input: {
  readonly current: Readonly<Record<string, StagePlanePoint>>;
  readonly manualIds: readonly string[];
  readonly proposed: Readonly<Record<string, StagePlanePoint>> | null;
  readonly action: "preserve" | "apply";
}): Readonly<{
  positions: Readonly<Record<string, StagePlanePoint>>;
  manualIds: readonly string[];
}> {
  if (input.action === "apply") {
    const positions: Record<string, StagePlanePoint> = {};
    for (const [id, point] of Object.entries(input.proposed ?? {})) {
      const accepted = acceptedPoint(point);
      if (accepted) positions[id] = accepted;
    }
    return Object.freeze({ positions: Object.freeze(positions), manualIds: Object.freeze([]) });
  }
  const positions: Record<string, StagePlanePoint> = {};
  for (const [id, point] of Object.entries(input.current)) {
    const accepted = acceptedPoint(point);
    if (accepted) positions[id] = accepted;
  }
  for (const [id, point] of Object.entries(input.proposed ?? {})) {
    if (positions[id]) continue;
    const accepted = acceptedPoint(point);
    if (accepted) positions[id] = accepted;
  }
  const manualIds = input.manualIds.filter((id) => positions[id] != null);
  return Object.freeze({ positions: Object.freeze(positions), manualIds: Object.freeze(manualIds) });
}
