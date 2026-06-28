import assert from "node:assert/strict";
import test from "node:test";

import { runExecutiveBusinessDataSourceAnalysis } from "../datasource/executiveBusinessDataSourceCertification.ts";
import { runWorkspaceRegistryAdapterAnalysis } from "../datasource/workspaceDataSourceRegistryAdapterCertification.ts";
import {
  BUSINESS_KNOWLEDGE_CONCEPT_HIERARCHY,
  BUSINESS_KNOWLEDGE_CONCEPT_TYPES,
  BUSINESS_KNOWLEDGE_FORBIDDEN_PATTERNS,
  BUSINESS_KNOWLEDGE_LAYER_FREEZE_TAGS,
  BUSINESS_KNOWLEDGE_LAYER_SELF_MANIFEST,
  BUSINESS_KNOWLEDGE_LAYER_TAGS,
  BUSINESS_KNOWLEDGE_LAYER_VERSION,
  BUSINESS_KNOWLEDGE_LIFECYCLE_STATES,
  BUSINESS_KNOWLEDGE_MUST_NOT_OWN,
  buildBusinessKnowledgeOwnershipContract,
  computeBusinessKnowledgeLayerOverallScore,
  meetsBusinessKnowledgeLayerMinimumScore,
  resolveBusinessKnowledgeConceptExample,
  resolveBusinessKnowledgeRelationshipExample,
  validateBusinessKnowledgeArtifactRecord,
  validateBusinessKnowledgeOwnership,
  validateBusinessKnowledgeRelationshipRecord,
} from "./businessKnowledgeLayerContract.ts";
import {
  isBusinessKnowledgeLayerFrozen,
  resetBusinessKnowledgeLayerFreezeForTests,
  runBusinessKnowledgeLayerAnalysis,
  runBusinessKnowledgeLayerCertification,
} from "./businessKnowledgeLayerCertification.ts";
import {
  getBusinessKnowledgeDiagnosticsLog,
  getBusinessKnowledgeEvents,
  recordBusinessKnowledgeEvent,
  resetBusinessKnowledgeDiagnosticsForTests,
} from "./businessKnowledgeLayerDiagnostics.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { STAGE_MINIMUM_OVERALL_SCORE } from "../stage/stageArchitectureContract.ts";

test.beforeEach(() => {
  resetBusinessKnowledgeDiagnosticsForTests();
  resetBusinessKnowledgeLayerFreezeForTests();
  runExecutiveBusinessDataSourceAnalysis();
  runWorkspaceRegistryAdapterAnalysis();
});

test("exports business knowledge layer version, concepts, and tags", () => {
  assert.equal(BUSINESS_KNOWLEDGE_LAYER_VERSION, "PHASE-2/DS1:3");
  assert.equal(BUSINESS_KNOWLEDGE_CONCEPT_TYPES.length, 12);
  assert.equal(BUSINESS_KNOWLEDGE_LIFECYCLE_STATES.length, 6);
  assert.ok(BUSINESS_KNOWLEDGE_LAYER_TAGS.includes("[DS13_BUSINESS_KNOWLEDGE]"));
});

test("validates self manifest and rejects forbidden intelligence paths", () => {
  const validation = validateStageManifest(BUSINESS_KNOWLEDGE_LAYER_SELF_MANIFEST);
  assert.equal(validation.valid, true);

  const kpiEngineDecision = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/dashboardIntelligence/workspaceKpiCalculationEngine.ts",
    allowedFiles: BUSINESS_KNOWLEDGE_LAYER_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: BUSINESS_KNOWLEDGE_FORBIDDEN_PATTERNS,
  });
  assert.equal(kpiEngineDecision.allowed, false);
});

test("rejects registry runtime and scene paths", () => {
  for (const filePath of [
    "frontend/app/lib/data-sources/dataSourceRegistryRuntime.ts",
    "frontend/app/lib/workspace/workspaceDataSourceRegistry.ts",
    "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
  ]) {
    const decision = evaluateStageFileBoundary({
      filePath,
      allowedFiles: BUSINESS_KNOWLEDGE_LAYER_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: BUSINESS_KNOWLEDGE_FORBIDDEN_PATTERNS,
    });
    assert.equal(decision.allowed, false, filePath);
  }
});

test("validates all twelve concept examples and concept hierarchy", () => {
  for (const conceptType of BUSINESS_KNOWLEDGE_CONCEPT_TYPES) {
    const artifact = resolveBusinessKnowledgeConceptExample(conceptType);
    assert.equal(validateBusinessKnowledgeArtifactRecord(artifact).valid, true, conceptType);
    assert.ok(Array.isArray(BUSINESS_KNOWLEDGE_CONCEPT_HIERARCHY[conceptType]));
    const ownership = buildBusinessKnowledgeOwnershipContract(artifact);
    assert.equal(ownership.isolationPolicy, "workspace-exclusive");
  }
});

test("validates semantic relationship example", () => {
  const relationship = resolveBusinessKnowledgeRelationshipExample();
  assert.equal(validateBusinessKnowledgeRelationshipRecord(relationship).valid, true);
  assert.equal(relationship.relationshipType, "contains");
});

test("rejects knowledge artifacts without workspace ownership", () => {
  const validation = validateBusinessKnowledgeOwnership({
    record: { knowledgeArtifactId: "bkl-001", workspaceId: "" },
    expectedWorkspaceId: "workspace-001",
  });
  assert.equal(validation.valid, false);
  assert.ok(validation.issues.some((entry) => entry.code === "missing_workspace_id"));
});

test("documents MUST NOT OWN exclusions", () => {
  assert.ok(BUSINESS_KNOWLEDGE_MUST_NOT_OWN.includes("kpi_calculations"));
  assert.ok(BUSINESS_KNOWLEDGE_MUST_NOT_OWN.includes("ai_reasoning"));
  assert.ok(BUSINESS_KNOWLEDGE_MUST_NOT_OWN.includes("relationship_discovery"));
});

test("records business knowledge diagnostic lifecycle events", () => {
  recordBusinessKnowledgeEvent({
    type: "DraftCreated",
    knowledgeArtifactId: "bkl-001",
    workspaceId: "workspace-001",
  });
  recordBusinessKnowledgeEvent({ type: "Published", knowledgeArtifactId: "bkl-001" });
  assert.equal(getBusinessKnowledgeEvents().length, 2);
});

test("computeBusinessKnowledgeLayerOverallScore meets minimum when dimensions are strong", () => {
  const overall = computeBusinessKnowledgeLayerOverallScore({
    architecture: 97,
    maintainability: 97,
    regressionSafety: 98,
    scalability: 95,
    certificationReadiness: 98,
  });
  assert.ok(overall >= STAGE_MINIMUM_OVERALL_SCORE);
  assert.equal(meetsBusinessKnowledgeLayerMinimumScore(overall), true);
});

test("business knowledge layer certification passes all gates", () => {
  const result = runBusinessKnowledgeLayerCertification();
  assert.equal(result.certified, true);
  assert.ok(result.scoreReport.meetsMinimum);
  assert.ok(result.scoreReport.overall >= STAGE_MINIMUM_OVERALL_SCORE);
  assert.ok(result.checks.every((entry) => entry.passed));
  assert.ok(getBusinessKnowledgeDiagnosticsLog().length > 0);
});

test("business knowledge layer analysis freezes contract on pass", () => {
  const result = runBusinessKnowledgeLayerAnalysis();
  assert.equal(result.certified, true);
  assert.equal(isBusinessKnowledgeLayerFrozen(), true);
  assert.ok(result.scoreReport.overall >= STAGE_MINIMUM_OVERALL_SCORE);
  for (const tag of BUSINESS_KNOWLEDGE_LAYER_FREEZE_TAGS) {
    assert.ok(result.tags.includes(tag));
  }
});
