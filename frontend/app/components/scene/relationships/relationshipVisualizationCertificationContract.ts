/**
 * REL-UX-3 — Executive relationship visualization certification contract.
 * Certification only — no feature creation or runtime mutation.
 */

export const REL_UX3_CERTIFICATION_VERSION = "REL-UX-3" as const;

export const REL_UX3_CERTIFICATION_TAGS = Object.freeze([
  "[REL_UX3_CERTIFIED]",
  "[FLOW_BALLS_CERTIFIED]",
  "[RELATIONSHIP_VISUALIZATION_STABLE]",
  "[EXECUTIVE_UX_READY]",
  "[REL_UX3_COMPLETE]",
] as const);

export const REL_UX3_CERTIFICATION_COMPLETE_DIAGNOSTIC =
  "[RelationshipVisualizationCertification] Certification Complete" as const;

export type RelationshipVisualizationCertificationStatus = "PASS" | "FAIL";

export type RelationshipVisualizationCertificationGateId =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O";

export type RelationshipVisualizationCertificationScenarioId =
  | "fifty_relationship_stress"
  | "hundred_relationship_stress"
  | "object_click_visual_response"
  | "workspace_switching_isolation"
  | "flow_ball_budget";

export type RelationshipVisualizationCertificationGate = Readonly<{
  id: RelationshipVisualizationCertificationGateId;
  name: string;
  status: RelationshipVisualizationCertificationStatus;
  detail: string;
}>;

export type RelationshipVisualizationCertificationScenario = Readonly<{
  id: RelationshipVisualizationCertificationScenarioId;
  name: string;
  status: RelationshipVisualizationCertificationStatus;
  detail: string;
}>;

export type RelationshipVisualizationCertificationInput = Readonly<{
  buildPassed?: boolean;
  testsPassed?: boolean;
}>;

export type RelationshipVisualizationCertificationResult = Readonly<{
  version: typeof REL_UX3_CERTIFICATION_VERSION;
  certified: boolean;
  result: RelationshipVisualizationCertificationStatus;
  diagnostics: readonly [typeof REL_UX3_CERTIFICATION_COMPLETE_DIAGNOSTIC];
  gates: readonly RelationshipVisualizationCertificationGate[];
  scenarios: readonly RelationshipVisualizationCertificationScenario[];
  tags: typeof REL_UX3_CERTIFICATION_TAGS;
  evidence: readonly string[];
}>;

export const REL_UX3_CERTIFICATION_GATE_TITLES: Readonly<
  Record<RelationshipVisualizationCertificationGateId, string>
> = Object.freeze({
  A: "Object Selection",
  B: "Relationship Highlight",
  C: "Flow Balls Runtime",
  D: "Relationship Renderer",
  E: "Scene Render Stability",
  F: "Topology Untouched",
  G: "Scene Sync Untouched",
  H: "DS-2 Untouched",
  I: "Object Panel Unaffected",
  J: "MRP Unaffected",
  K: "Assistant Unaffected",
  L: "Workspace Switching",
  M: "100 Relationship Stress Test",
  N: "No Memory Leak",
  O: "Build Passes",
});
