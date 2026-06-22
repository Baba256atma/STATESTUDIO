/**
 * NW-B:8-FIX-2 — Relationship scene regression certification contract.
 */

export const NWB8_FIX2_CERTIFICATION_TAG = "[NWB8_FIX2]" as const;

export const RELATIONSHIP_SCENE_REGRESSION_CERTIFICATION_TAGS = Object.freeze([
  "[NWB8_FIX2]",
  "[RELATIONSHIP_CERTIFIED]",
  "[SCENE_REGRESSION_PASS]",
  "[RELATIONSHIP_RENDERING_FROZEN]",
  "[SCENE_RUNTIME_CERTIFIED]",
] as const);

export const RELATIONSHIP_SCENE_REGRESSION_COMPLETE_DIAGNOSTIC =
  "[RelationshipSceneRegression] Certification Complete" as const;

export type RelationshipSceneRegressionGateId =
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
  | "L";

export type RelationshipSceneRegressionGate = Readonly<{
  id: RelationshipSceneRegressionGateId;
  name: string;
  status: "PASS" | "FAIL";
  detail: string;
}>;

export type RelationshipSceneRegressionScenarioId =
  | "zero_relationships"
  | "single_relationship"
  | "ten_relationships"
  | "workspace_switching"
  | "selection_after_render"
  | "scene_reload"
  | "invalid_payload";

export type RelationshipSceneRegressionScenario = Readonly<{
  id: RelationshipSceneRegressionScenarioId;
  name: string;
  status: "PASS" | "FAIL";
  detail: string;
}>;

export type RelationshipSceneRegressionCertificationInput = Readonly<{
  buildPassed?: boolean;
  testsPassed?: boolean;
}>;

export type RelationshipSceneRegressionCertificationResult = Readonly<{
  tag: typeof NWB8_FIX2_CERTIFICATION_TAG;
  version: "NW-B:8-FIX-2";
  certified: boolean;
  result: "PASS" | "FAIL";
  diagnostics: readonly [typeof RELATIONSHIP_SCENE_REGRESSION_COMPLETE_DIAGNOSTIC];
  gates: readonly RelationshipSceneRegressionGate[];
  scenarios: readonly RelationshipSceneRegressionScenario[];
  freezeTags: typeof RELATIONSHIP_SCENE_REGRESSION_CERTIFICATION_TAGS;
  evidence: readonly string[];
}>;
