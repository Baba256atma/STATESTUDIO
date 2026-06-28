import assert from "node:assert/strict";
import test from "node:test";

import { runDs1FoundationAnalysis } from "../datasourceCertification/ds1FoundationCertification.ts";
import { runExecutiveModelGenerationAnalysis } from "../executiveModel/executiveModelGenerationCertification.ts";
import { runExecutiveModelPipelineAnalysis } from "../executiveModelPipeline/executiveModelPipelineCertification.ts";
import { runExecutiveModelRuntimeAnalysis } from "../executiveModelRuntime/executiveModelRuntimeCertification.ts";
import { runExecutiveObjectIntegrationAnalysis } from "../executiveObject/executiveObjectCertification.ts";
import { resolveExecutiveObjectRegistryExample } from "../executiveObject/executiveObjectContract.ts";
import {
  EXECUTIVE_RELATIONSHIP_DIRECTIONS,
  EXECUTIVE_RELATIONSHIP_INTEGRATION_FORBIDDEN_PATTERNS,
  EXECUTIVE_RELATIONSHIP_INTEGRATION_FREEZE_TAGS,
  EXECUTIVE_RELATIONSHIP_INTEGRATION_MINIMUM_OVERALL_SCORE,
  EXECUTIVE_RELATIONSHIP_INTEGRATION_MUST_NOT_OWN,
  EXECUTIVE_RELATIONSHIP_INTEGRATION_SELF_MANIFEST,
  EXECUTIVE_RELATIONSHIP_INTEGRATION_TAGS,
  EXECUTIVE_RELATIONSHIP_INTEGRATION_VERSION,
  EXECUTIVE_RELATIONSHIP_LIFECYCLE_STATES,
  EXECUTIVE_RELATIONSHIP_TYPES,
  RELATIONSHIP_DECLARATIONS_EXTENSION_KEY,
  attachRelationshipDeclarationsToObjectRegistry,
  buildExecutiveRelationshipOwnershipContract,
  computeExecutiveRelationshipIntegrationAnalysisScore,
  computeExecutiveRelationshipIntegrationOverallScore,
  extractRelationshipDeclarationsFromRegistry,
  integrateExecutiveRelationshipsFromObjectRegistry,
  listExecutiveRelationshipsByType,
  listExecutiveRelationshipsForObject,
  meetsExecutiveRelationshipIntegrationMinimumScore,
  resolveExecutiveObjectRegistryWithDeclarationsExample,
  resolveExecutiveRelationshipById,
  resolveExecutiveRelationshipExample,
  resolveExecutiveRelationshipRegistryExample,
  validateDeclaredRelationshipStub,
  validateEriNoInferenceIntegrity,
  validateEriObjectRegistryInputBoundary,
  validateExecutiveRelationship,
  validateExecutiveRelationshipRegistry,
  validateRelationshipEndpoints,
} from "./executiveRelationshipContract.ts";
import {
  isExecutiveRelationshipIntegrationFrozen,
  runExecutiveRelationshipIntegrationAnalysis,
  runExecutiveRelationshipIntegrationCertification,
} from "./executiveRelationshipCertification.ts";
import {
  getExecutiveRelationshipDiagnosticsLog,
  recordExecutiveRelationshipDiagnosticEvent,
  resetExecutiveRelationshipDiagnosticsForTests,
} from "./executiveRelationshipDiagnostics.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

test.beforeEach(() => {
  resetExecutiveRelationshipDiagnosticsForTests();
  runDs1FoundationAnalysis();
  runExecutiveModelGenerationAnalysis();
  runExecutiveModelPipelineAnalysis();
  runExecutiveModelRuntimeAnalysis();
  runExecutiveObjectIntegrationAnalysis();
});

test("exports integration version, relationship types, directions, and tags", () => {
  assert.equal(EXECUTIVE_RELATIONSHIP_INTEGRATION_VERSION, "PHASE-5/DS3-INT-1");
  assert.equal(EXECUTIVE_RELATIONSHIP_TYPES.length, 8);
  assert.equal(EXECUTIVE_RELATIONSHIP_DIRECTIONS.length, 3);
  assert.equal(EXECUTIVE_RELATIONSHIP_LIFECYCLE_STATES.length, 6);
  assert.ok(EXECUTIVE_RELATIONSHIP_INTEGRATION_TAGS.includes("[DS3_INT_EXECUTIVE_RELATIONSHIP]"));
});

test("validates self manifest and rejects forbidden paths", () => {
  const validation = validateStageManifest(EXECUTIVE_RELATIONSHIP_INTEGRATION_SELF_MANIFEST);
  assert.equal(validation.valid, true);

  for (const filePath of [
    "frontend/app/lib/datasourceCertification/ds1FoundationCertification.ts",
    "frontend/app/lib/executiveModel/executiveModelGenerationContract.ts",
    "frontend/app/lib/relationships/executive/relationshipFocusRuntime.ts",
    "frontend/app/lib/workspace/workspaceRelationshipSceneSyncContract.ts",
    "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
  ]) {
    const decision = evaluateStageFileBoundary({
      filePath,
      allowedFiles: EXECUTIVE_RELATIONSHIP_INTEGRATION_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_RELATIONSHIP_INTEGRATION_FORBIDDEN_PATTERNS,
    });
    assert.equal(decision.allowed, false, filePath);
  }
});

test("validates executive relationship example with mandatory fields", () => {
  const relationship = resolveExecutiveRelationshipExample();
  assert.equal(validateExecutiveRelationship(relationship).valid, true);
  assert.equal(relationship.lifecycleState, "validated");
  assert.equal(relationship.relationshipType, "depends_on");
  assert.equal(relationship.direction, "forward");
  const registry = resolveExecutiveRelationshipRegistryExample();
  const ownership = buildExecutiveRelationshipOwnershipContract(registry);
  assert.equal(ownership.isolationPolicy, "workspace-exclusive");
});

test("validates relationship registry example and lookup helpers", () => {
  const objectRegistry = resolveExecutiveObjectRegistryWithDeclarationsExample();
  const registry = resolveExecutiveRelationshipRegistryExample();
  assert.equal(validateExecutiveRelationshipRegistry(registry, objectRegistry).valid, true);
  const first = registry.relationships[0];
  assert.ok(first);
  assert.equal(resolveExecutiveRelationshipById(registry, first.executiveRelationshipId)?.executiveRelationshipId, first.executiveRelationshipId);
  assert.ok(listExecutiveRelationshipsByType(registry, first.relationshipType).length >= 1);
  assert.ok(listExecutiveRelationshipsForObject(registry, first.sourceObjectId).length >= 1);
});

test("extracts declarations from object registry metadata extension", () => {
  const objectRegistry = resolveExecutiveObjectRegistryWithDeclarationsExample();
  const declarations = extractRelationshipDeclarationsFromRegistry(objectRegistry);
  assert.equal(declarations.length, 1);
  assert.equal(declarations[0]?.executiveRelationshipId, "eri-rel-supplier-outcome-001");
  assert.equal(validateDeclaredRelationshipStub(declarations[0]!).valid, true);
});

test("validates object registry input boundary and no-inference integrity", () => {
  assert.equal(validateEriObjectRegistryInputBoundary().valid, true);
  assert.equal(validateEriNoInferenceIntegrity().valid, true);
});

test("documents MUST NOT OWN exclusions", () => {
  assert.ok(EXECUTIVE_RELATIONSHIP_INTEGRATION_MUST_NOT_OWN.includes("relationship_discovery"));
  assert.ok(EXECUTIVE_RELATIONSHIP_INTEGRATION_MUST_NOT_OWN.includes("relationship_inference"));
  assert.ok(EXECUTIVE_RELATIONSHIP_INTEGRATION_MUST_NOT_OWN.includes("persistence"));
  assert.ok(EXECUTIVE_RELATIONSHIP_INTEGRATION_MUST_NOT_OWN.includes("ds1_direct_consumption"));
  assert.ok(EXECUTIVE_RELATIONSHIP_INTEGRATION_MUST_NOT_OWN.includes("emg_direct_consumption"));
});

test("integrates relationships from object registry declarations only", () => {
  const objectRegistry = resolveExecutiveObjectRegistryWithDeclarationsExample();
  const integration = integrateExecutiveRelationshipsFromObjectRegistry({
    objectRegistry,
    integrationSessionId: "eri-test-integration-001",
  });
  assert.equal(integration.success, true);
  assert.ok(integration.registry);
  assert.equal(integration.relationships.length, 1);
  assert.equal(validateExecutiveRelationshipRegistry(integration.registry!, objectRegistry).valid, true);
});

test("accepts empty declaration list as valid empty registry", () => {
  const baseRegistry = resolveExecutiveObjectRegistryExample();
  const integration = integrateExecutiveRelationshipsFromObjectRegistry({
    objectRegistry: baseRegistry,
    integrationSessionId: "eri-test-empty-001",
  });
  assert.equal(integration.success, true);
  assert.ok(integration.registry);
  assert.equal(integration.relationships.length, 0);
  assert.equal(integration.registry!.relationshipCount, 0);
});

test("records relationship diagnostic lifecycle events", () => {
  recordExecutiveRelationshipDiagnosticEvent({
    type: "RelationshipDeclared",
    integrationSessionId: "session-001",
    workspaceId: "workspace-001",
    executiveRelationshipId: "rel-001",
  });
  assert.ok(getExecutiveRelationshipDiagnosticsLog().length >= 0);
});

test("computeExecutiveRelationshipIntegrationOverallScore meets minimum when dimensions are strong", () => {
  const overall = computeExecutiveRelationshipIntegrationOverallScore({
    architecture: 100,
    maintainability: 98,
    regressionSafety: 99,
    scalability: 96,
    certificationReadiness: 100,
  });
  assert.ok(overall >= EXECUTIVE_RELATIONSHIP_INTEGRATION_MINIMUM_OVERALL_SCORE);
  assert.equal(meetsExecutiveRelationshipIntegrationMinimumScore(overall), true);
});

test("computeExecutiveRelationshipIntegrationAnalysisScore meets minimum when dimensions are strong", () => {
  const overall = computeExecutiveRelationshipIntegrationAnalysisScore({
    architectureHealth: 100,
    maintainability: 98,
    scalability: 96,
    regressionSafety: 99,
    objectRegistryInputBoundaryIntegrity: 100,
    relationshipModelIntegrity: 100,
    noInferenceIntegrity: 100,
    bugTraceability: 97,
    certificationReadiness: 100,
  });
  assert.ok(overall >= EXECUTIVE_RELATIONSHIP_INTEGRATION_MINIMUM_OVERALL_SCORE);
});

test("executive relationship integration certification passes all gates", () => {
  const result = runExecutiveRelationshipIntegrationCertification();
  assert.equal(result.certified, true);
  assert.ok(result.scoreReport.meetsMinimum);
  assert.ok(result.scoreReport.overall >= EXECUTIVE_RELATIONSHIP_INTEGRATION_MINIMUM_OVERALL_SCORE);
  assert.ok(result.checks.every((entry) => entry.passed));
});

test("executive relationship integration analysis passes and freezes contract", () => {
  const result = runExecutiveRelationshipIntegrationAnalysis();
  assert.equal(result.certified, true);
  assert.ok(result.analysisScoreReport);
  assert.ok(result.analysisScoreReport!.meetsMinimum);
  assert.ok(result.analysisScoreReport!.overall >= EXECUTIVE_RELATIONSHIP_INTEGRATION_MINIMUM_OVERALL_SCORE);
  assert.ok(result.freezeReport?.frozen);
  assert.equal(isExecutiveRelationshipIntegrationFrozen(), true);
  for (const tag of EXECUTIVE_RELATIONSHIP_INTEGRATION_FREEZE_TAGS) {
    assert.ok(result.tags.includes(tag), tag);
  }
  assert.equal(result.checks.length, 32);
});

test("rejects relationship without workspace id", () => {
  const relationship = resolveExecutiveRelationshipExample();
  const invalid = Object.freeze({ ...relationship, workspaceId: "" });
  assert.equal(validateExecutiveRelationship(invalid).valid, false);
});

test("rejects missing endpoint in object registry", () => {
  const objectRegistry = resolveExecutiveObjectRegistryWithDeclarationsExample();
  assert.equal(
    validateRelationshipEndpoints({
      relationship: {
        sourceObjectId: "missing-source",
        targetObjectId: "emg-obj-outcome",
      },
      objectRegistry,
    }).valid,
    false
  );
});

test("uses relationshipDeclarations extension key on object metadata", () => {
  const objectRegistry = resolveExecutiveObjectRegistryWithDeclarationsExample();
  const host = objectRegistry.objects.find((entry) => entry.executiveObjectId === "emg-obj-supplier");
  assert.ok(host);
  const extension = host!.metadata.extension.futureExtension;
  assert.ok(extension);
  assert.ok(Array.isArray((extension as Record<string, unknown>)[RELATIONSHIP_DECLARATIONS_EXTENSION_KEY]));
});

test("attachRelationshipDeclarationsToObjectRegistry preserves object registry shape", () => {
  const base = resolveExecutiveObjectRegistryExample();
  const enriched = attachRelationshipDeclarationsToObjectRegistry(base, {
    "emg-obj-supplier": Object.freeze([
      Object.freeze({
        executiveRelationshipId: "eri-test-rel-001",
        sourceObjectId: "emg-obj-supplier",
        targetObjectId: "emg-obj-outcome",
        relationshipType: "supports" as const,
        direction: "forward" as const,
        strengthHint: null,
      }),
    ]),
  });
  assert.equal(enriched.objectCount, base.objectCount);
  assert.equal(extractRelationshipDeclarationsFromRegistry(enriched).length, 1);
});
