/**
 * NPA-T ORGANIZATIONAL-SOLAR-VIEW:1
 *
 * Neutral Solar presentation on the Executive stage plane.
 * Rings are presentation groupings. They are not departments, and this
 * module does not create topology edges.
 */

import { SCENE_ORG_STAGE_PLANE_LIMIT } from "./sceneOrgSavedSceneSpatialState.ts";

export const organizationalSolarViewIdentity =
  "NPA-T ORGANIZATIONAL-SOLAR-VIEW:1/NeutralStagePlaneSolarPresentation" as const;

export const STAGE_PRESENTATION_VIEW = "stage" as const;
export const ORGANIZATIONAL_SOLAR_VIEW = "organizational-solar" as const;
export const DECISION_SOLAR_VIEW = "decision-solar" as const;
export const CAUSAL_INVESTIGATION_VIEW = "causal-investigation" as const;

export type StagePresentationView =
  | typeof STAGE_PRESENTATION_VIEW
  | typeof ORGANIZATIONAL_SOLAR_VIEW
  | typeof DECISION_SOLAR_VIEW
  | typeof CAUSAL_INVESTIGATION_VIEW;

/** Objects per presentation ring before another ring is opened. */
export const ORGANIZATIONAL_SOLAR_RING_CAPACITY = 8 as const;

export const ORGANIZATIONAL_SOLAR_NEUTRAL_NOTICE =
  "Organizational relationship data is not available. This is a neutral Solar arrangement." as const;

export const ORGANIZATIONAL_SOLAR_VALIDATED_EDGE_NOTICE =
  "Validated relationships are shown. Rings remain a neutral presentation arrangement." as const;

export type OrganizationalSolarEdge = Readonly<{
  relationshipId: string;
  sourceObjectId: string;
  targetObjectId: string;
  relationshipType: string;
  direction: "DIRECTED" | "UNDIRECTED";
}>;

export type OrganizationalSolarCenter = Readonly<{
  kind: "presentation-marker";
  canonicalObjectId: null;
  x: 0;
  y: 0;
  z: 0;
}>;

export type OrganizationalSolarRing = Readonly<{
  ringId: string;
  label: string;
  semanticType: "presentation-ring" | "organizational-level";
  level: number;
  radius: number;
  objectIds: readonly string[];
}>;

export type OrganizationalSolarPlacement = Readonly<{
  canonicalObjectId: string;
  ringId: string;
  indexOnRing: number;
  angleRadians: number;
  position: Readonly<{ x: number; y: number; z: 0 }>;
}>;

export type OrganizationalSolarLayout = Readonly<{
  viewType: "ORGANIZATIONAL_SOLAR";
  semanticLevel: "neutral-presentation" | "organizational-hierarchy";
  relationshipEdges: readonly OrganizationalSolarEdge[];
  center: OrganizationalSolarCenter;
  rings: readonly OrganizationalSolarRing[];
  placements: readonly OrganizationalSolarPlacement[];
  notice: string;
}>;

/**
 * Stage topology families audited for this gate.
 * Flow and hub exist as layout generators, but they invent edges from node
 * order. They are not organizational relationship authority.
 */
export const STAGE_TOPOLOGY_FAMILY_STATUS = Object.freeze({
  star: "NOT IMPLEMENTED",
  ring: "DECLARED ONLY",
  mesh: "NOT IMPLEMENTED",
  bus: "NOT IMPLEMENTED",
  tree: "NOT IMPLEMENTED",
  hybrid: "DECLARED ONLY",
} as const);

const CENTER: OrganizationalSolarCenter = Object.freeze({
  kind: "presentation-marker" as const,
  canonicalObjectId: null,
  x: 0 as const,
  y: 0 as const,
  z: 0 as const,
});

function roundPlane(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function ringRadius(level: number, countOnRing: number): number {
  let radius = Math.min(SCENE_ORG_STAGE_PLANE_LIMIT - 0.25, 1.45 + level * 1.05);
  if (countOnRing > 1) {
    const needed = 1.05 / (2 * Math.sin(Math.PI / countOnRing));
    radius = Math.max(radius, needed);
  }
  return roundPlane(Math.min(SCENE_ORG_STAGE_PLANE_LIMIT - 0.25, radius));
}

/** Absent or "stage" stays on the existing Stage. Unknown values are omitted. */
export function parseStagePresentationView(value: unknown): StagePresentationView | null {
  if (value == null || value === STAGE_PRESENTATION_VIEW) return null;
  if (value === ORGANIZATIONAL_SOLAR_VIEW) return ORGANIZATIONAL_SOLAR_VIEW;
  if (value === DECISION_SOLAR_VIEW) return DECISION_SOLAR_VIEW;
  if (value === CAUSAL_INVESTIGATION_VIEW) return CAUSAL_INVESTIGATION_VIEW;
  return null;
}

function placeRing(
  rings: OrganizationalSolarRing[],
  placements: OrganizationalSolarPlacement[],
  members: readonly string[],
  semanticType: "presentation-ring" | "organizational-level",
  label: string,
): void {
  const level = rings.length;
  const radius = ringRadius(level, members.length);
  const ringId = semanticType === "organizational-level"
    ? `organizational-level-${level + 1}`
    : `presentation-ring-${level + 1}`;
  rings.push(Object.freeze({
    ringId,
    label,
    semanticType,
    level,
    radius,
    objectIds: Object.freeze(members),
  }));
  members.forEach((canonicalObjectId, indexOnRing) => {
    const angleRadians = members.length === 1
      ? -Math.PI / 2
      : -Math.PI / 2 + (indexOnRing * 2 * Math.PI) / members.length;
    placements.push(Object.freeze({
      canonicalObjectId,
      ringId,
      indexOnRing,
      angleRadians,
      position: Object.freeze({
        x: roundPlane(radius * Math.cos(angleRadians)),
        y: roundPlane(radius * Math.sin(angleRadians)),
        z: 0 as const,
      }),
    }));
  });
}

function hierarchyLevels(
  objectIds: readonly string[],
  edges: readonly OrganizationalSolarEdge[],
): readonly (readonly string[])[] | null {
  const hierarchical = edges.filter((edge) =>
    edge.relationshipType === "REPORTS_TO" || edge.relationshipType === "CONTAINS");
  if (hierarchical.length === 0 || hierarchical.length !== edges.length) return null;
  const present = new Set(objectIds);
  const parentCount = new Map<string, number>();
  const children = new Map<string, string[]>();
  for (const edge of hierarchical) {
    if (!present.has(edge.sourceObjectId) || !present.has(edge.targetObjectId)) return null;
    const child = edge.relationshipType === "REPORTS_TO" ? edge.sourceObjectId : edge.targetObjectId;
    const parent = edge.relationshipType === "REPORTS_TO" ? edge.targetObjectId : edge.sourceObjectId;
    parentCount.set(child, (parentCount.get(child) ?? 0) + 1);
    if ((parentCount.get(child) ?? 0) > 1) return null;
    const next = children.get(parent) ?? [];
    next.push(child);
    children.set(parent, next);
  }
  const connected = new Set<string>();
  for (const edge of hierarchical) {
    connected.add(edge.sourceObjectId);
    connected.add(edge.targetObjectId);
  }
  if (objectIds.some((id) => !connected.has(id))) return null;
  const roots = objectIds.filter((id) => (parentCount.get(id) ?? 0) === 0).sort();
  const levels: string[][] = [];
  let frontier = roots;
  const seen = new Set<string>();
  while (frontier.length > 0) {
    if (frontier.some((id) => seen.has(id))) return null;
    frontier.forEach((id) => seen.add(id));
    levels.push(frontier);
    frontier = frontier.flatMap((id) => children.get(id) ?? []).sort();
  }
  if (seen.size !== objectIds.length) return null;
  return levels;
}

/**
 * Places authorized ids on concentric rings.
 * Supplied edges are copied. This function does not invent edges.
 * Hierarchy rings are used only for a complete REPORTS_TO or CONTAINS tree.
 */
export function projectOrganizationalSolarLayout(input: {
  readonly objectIds: readonly string[];
  readonly relationships?: readonly OrganizationalSolarEdge[];
}): OrganizationalSolarLayout {
  const ordered = [...new Set(input.objectIds.map((id) => id.trim()).filter((id) => id.length > 0))].sort();
  const present = new Set(ordered);
  const relationshipEdges = Object.freeze((input.relationships ?? []).filter((edge) =>
    present.has(edge.sourceObjectId) && present.has(edge.targetObjectId)));
  const rings: OrganizationalSolarRing[] = [];
  const placements: OrganizationalSolarPlacement[] = [];
  const levels = hierarchyLevels(ordered, relationshipEdges);
  if (levels) {
    levels.forEach((members, level) => {
      placeRing(rings, placements, members, "organizational-level", `Organizational level ${level + 1}`);
    });
  } else {
    for (let start = 0; start < ordered.length; start += ORGANIZATIONAL_SOLAR_RING_CAPACITY) {
      const members = ordered.slice(start, start + ORGANIZATIONAL_SOLAR_RING_CAPACITY);
      placeRing(
        rings,
        placements,
        members,
        "presentation-ring",
        `Presentation ring ${rings.length + 1}`,
      );
    }
  }
  return Object.freeze({
    viewType: "ORGANIZATIONAL_SOLAR" as const,
    semanticLevel: levels ? "organizational-hierarchy" as const : "neutral-presentation" as const,
    relationshipEdges,
    center: CENTER,
    rings: Object.freeze(rings),
    placements: Object.freeze(placements),
    notice: levels
      ? "Rings follow validated REPORTS_TO or CONTAINS structure."
      : relationshipEdges.length > 0
        ? ORGANIZATIONAL_SOLAR_VALIDATED_EDGE_NOTICE
        : ORGANIZATIONAL_SOLAR_NEUTRAL_NOTICE,
  });
}
