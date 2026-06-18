/**
 * DS:4:7 — Relationship Visualization Contract.
 *
 * Visualization-ready read model for relationship intelligence. This contract
 * exposes scores to Scene and Dashboard consumers without rendering authority.
 */

export const RELATIONSHIP_VISUALIZATION_CONTRACT_DIAGNOSTIC =
  "[RELATIONSHIP_VISUALIZATION_CONTRACT]" as const;

export const RELATIONSHIP_VISUALIZATION_READY_DIAGNOSTIC =
  "[RELATIONSHIP_VISUALIZATION_READY]" as const;

export const RELATIONSHIP_VISUALIZATION_CONTRACT_VERSION = "4.7.0" as const;

export type RelationshipInfluenceDirection =
  | "source-to-target"
  | "target-to-source"
  | "bidirectional"
  | "neutral";

export type RelationshipVisualizationContract = Readonly<{
  relationshipId: string;
  sourceId?: string;
  targetId?: string;
  strengthScore: number;
  dependencyScore: number;
  riskExposureScore: number;
  influenceDirection: RelationshipInfluenceDirection;
}>;

export type RelationshipVisualizationRegistry = Readonly<{
  version: typeof RELATIONSHIP_VISUALIZATION_CONTRACT_VERSION;
  relationships: readonly RelationshipVisualizationContract[];
  relationshipCount: number;
  sceneMutation: false;
  dashboardMutation: false;
  renderingMutation: false;
  diagnostics: readonly [
    typeof RELATIONSHIP_VISUALIZATION_CONTRACT_DIAGNOSTIC,
    typeof RELATIONSHIP_VISUALIZATION_READY_DIAGNOSTIC,
  ];
}>;

export const RELATIONSHIP_VISUALIZATION_DIAGNOSTICS = Object.freeze([
  RELATIONSHIP_VISUALIZATION_CONTRACT_DIAGNOSTIC,
  RELATIONSHIP_VISUALIZATION_READY_DIAGNOSTIC,
] as const);

export const EMPTY_RELATIONSHIP_VISUALIZATION_REGISTRY: RelationshipVisualizationRegistry =
  Object.freeze({
    version: RELATIONSHIP_VISUALIZATION_CONTRACT_VERSION,
    relationships: Object.freeze([]),
    relationshipCount: 0,
    sceneMutation: false,
    dashboardMutation: false,
    renderingMutation: false,
    diagnostics: RELATIONSHIP_VISUALIZATION_DIAGNOSTICS,
  });
