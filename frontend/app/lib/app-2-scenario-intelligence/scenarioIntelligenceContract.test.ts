import assert from "node:assert/strict";
import test from "node:test";

import {
  SCENARIO_HEALTH_STATE_KEYS,
  SCENARIO_INTELLIGENCE_CONTRACT_VERSION,
  SCENARIO_INTELLIGENCE_FREEZE_RULES,
  SCENARIO_INTELLIGENCE_IDENTITY,
  SCENARIO_INTELLIGENCE_MUST_NOT_OWN,
  SCENARIO_INTELLIGENCE_SELF_MANIFEST,
  SCENARIO_INTELLIGENCE_TAGS,
  SCENARIO_SOURCE_KEYS,
  SCENARIO_STATUS_KEYS,
  SCENARIO_TYPE_KEYS,
  isScenarioHealthState,
  isScenarioLifecycleStageKey,
  isScenarioSource,
  isScenarioStatus,
  isScenarioType,
  resolveScenarioIdentityExample,
  validateScenarioIdentityShape,
} from "./scenarioIntelligenceContract.ts";
import {
  SCENARIO_DIAGNOSTIC_CODES,
  SCENARIO_DIAGNOSTIC_DEFINITIONS,
  createScenarioDiagnostic,
  getScenarioDiagnosticDefinition,
  isScenarioDiagnosticCode,
} from "./scenarioIntelligenceDiagnostics.ts";
import {
  SCENARIO_ARCHITECTURE_EVENT_TYPES,
  isScenarioArchitectureEventType,
  validateScenarioArchitectureEventShape,
} from "./scenarioIntelligenceEvents.ts";
import {
  SCENARIO_LIFECYCLE_STAGE_DEFINITIONS,
  SCENARIO_LIFECYCLE_TERMINAL_STAGES,
  getScenarioLifecycleStageDefinition,
  listScenarioLifecycleStageKeys,
} from "./scenarioIntelligenceLifecycle.ts";
import {
  SCENARIO_METADATA_MANDATORY_FIELDS,
  createScenarioMetadataRecord,
  validateScenarioMetadataShape,
} from "./scenarioIntelligenceMetadata.ts";
import {
  SCENARIO_INTELLIGENCE_FUTURE_COMPATIBILITY,
  ScenarioIntelligencePublicApiDeclaration,
  getScenarioIntelligenceApiVersionMetadata,
} from "./scenarioIntelligenceApi.ts";
import {
  SCENARIO_INTELLIGENCE_CERTIFICATION_GATES,
  SCENARIO_INTELLIGENCE_CERTIFICATION_SCOPES,
  listScenarioIntelligenceRequiredCertificationGates,
} from "./scenarioIntelligenceCertificationContract.ts";
import {
  SCENARIO_DEFAULT_HEALTH_STATE,
  SCENARIO_STATE_DEFINITIONS,
  getScenarioStateDefinition,
} from "./scenarioIntelligenceStates.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

test("exports APP-2 identity and contract vocabulary", () => {
  assert.equal(SCENARIO_INTELLIGENCE_IDENTITY.appId, "APP-2");
  assert.equal(SCENARIO_INTELLIGENCE_IDENTITY.title, "Scenario Intelligence");
  assert.equal(SCENARIO_INTELLIGENCE_IDENTITY.version, SCENARIO_INTELLIGENCE_CONTRACT_VERSION);
  assert.equal(SCENARIO_TYPE_KEYS.length, 7);
  assert.equal(SCENARIO_SOURCE_KEYS.length, 6);
  assert.equal(SCENARIO_STATUS_KEYS.length, 8);
  assert.equal(SCENARIO_HEALTH_STATE_KEYS.length, 6);
  for (const tag of [
    "[APP2_1_SCENARIO_INTELLIGENCE_CONTRACT]",
    "[SCENARIO_INTELLIGENCE_CONTRACT_READY]",
    "[SCENARIO_INTELLIGENCE_READ_ONLY]",
    "[NO_INTELLIGENCE_EXECUTION]",
  ]) {
    assert.ok(SCENARIO_INTELLIGENCE_TAGS.includes(tag as (typeof SCENARIO_INTELLIGENCE_TAGS)[number]), tag);
  }
});

test("validates scenario identity shape and type guards", () => {
  const example = resolveScenarioIdentityExample();
  assert.equal(validateScenarioIdentityShape(example).valid, true);
  assert.equal(isScenarioType("what_if"), true);
  assert.equal(isScenarioSource("compare_engine"), true);
  assert.equal(isScenarioStatus("active"), true);
  assert.equal(isScenarioHealthState("warning"), true);
  assert.equal(isScenarioLifecycleStageKey("monitoring"), true);
  assert.equal(isScenarioType("unknown_type"), false);
});

test("defines lifecycle stages in deterministic order", () => {
  assert.equal(SCENARIO_LIFECYCLE_STAGE_DEFINITIONS.length, 8);
  assert.equal(listScenarioLifecycleStageKeys().length, 8);
  assert.equal(getScenarioLifecycleStageDefinition("draft")?.order, 1);
  assert.equal((SCENARIO_LIFECYCLE_TERMINAL_STAGES as readonly string[]).includes("archived"), true);
  assert.equal((SCENARIO_LIFECYCLE_TERMINAL_STAGES as readonly string[]).includes("active"), false);
});

test("defines health states and default state", () => {
  assert.equal(SCENARIO_STATE_DEFINITIONS.length, 6);
  assert.equal(SCENARIO_DEFAULT_HEALTH_STATE, "unknown");
  assert.equal(getScenarioStateDefinition("critical")?.severityRank, 4);
});

test("defines diagnostics vocabulary", () => {
  assert.equal(SCENARIO_DIAGNOSTIC_CODES.length, 7);
  assert.equal(SCENARIO_DIAGNOSTIC_DEFINITIONS.length, 7);
  assert.equal(isScenarioDiagnosticCode("missing_scenario"), true);
  assert.equal(getScenarioDiagnosticDefinition("invalid_timeline")?.label, "Invalid Timeline");
  const diagnostic = createScenarioDiagnostic("contract_violation", "Contract boundary violated.");
  assert.equal(diagnostic.code, "contract_violation");
  assert.equal(diagnostic.severity, "error");
});

test("defines metadata contract shape", () => {
  const metadata = createScenarioMetadataRecord();
  assert.equal(validateScenarioMetadataShape(metadata).valid, true);
  assert.equal(SCENARIO_METADATA_MANDATORY_FIELDS.length, 9);
  assert.equal(metadata.platform, "nexora-type-c");
  assert.equal(metadata.architecture, SCENARIO_INTELLIGENCE_IDENTITY.architectureVersion);
});

test("defines architecture events without runtime bus", () => {
  assert.equal(SCENARIO_ARCHITECTURE_EVENT_TYPES.length, 6);
  assert.equal(isScenarioArchitectureEventType("scenario_created"), true);
  const validation = validateScenarioArchitectureEventShape({
    eventType: "scenario_updated",
    scenarioId: "scn-001",
    workspaceId: "ws-001",
    timestamp: new Date(0).toISOString(),
    actor: "system",
    metadata: Object.freeze({}),
  });
  assert.equal(validation.valid, true);
});

test("declares public API interfaces and future compatibility", () => {
  assert.equal(typeof ScenarioIntelligencePublicApiDeclaration.initializeScenarioIntelligence, "function");
  assert.equal(typeof ScenarioIntelligencePublicApiDeclaration.analyzeScenario, "function");
  assert.equal(typeof ScenarioIntelligencePublicApiDeclaration.getScenarioState, "function");
  assert.equal(typeof ScenarioIntelligencePublicApiDeclaration.getScenarioContext, "function");
  assert.equal(typeof ScenarioIntelligencePublicApiDeclaration.getScenarioMetadata, "function");
  assert.equal(typeof ScenarioIntelligencePublicApiDeclaration.getScenarioDiagnostics, "function");
  assert.equal(ScenarioIntelligencePublicApiDeclaration.getScenarioIdentity().appId, "APP-2");
  assert.equal(SCENARIO_INTELLIGENCE_FUTURE_COMPATIBILITY.executiveTimeConsumerOnly, true);
  assert.equal(SCENARIO_INTELLIGENCE_FUTURE_COMPATIBILITY.readOnly, true);
  assert.equal(getScenarioIntelligenceApiVersionMetadata().apiVersion, "APP-2/1");
});

test("prepares certification contract gates and scopes", () => {
  assert.equal(SCENARIO_INTELLIGENCE_CERTIFICATION_SCOPES.length, 7);
  assert.equal(SCENARIO_INTELLIGENCE_CERTIFICATION_GATES.length, 8);
  assert.equal(listScenarioIntelligenceRequiredCertificationGates().length, 8);
});

test("documents freeze rules and isolation manifest", () => {
  assert.equal(SCENARIO_INTELLIGENCE_FREEZE_RULES.contractImmutable, true);
  assert.equal(SCENARIO_INTELLIGENCE_FREEZE_RULES.publicInterfacesExtendOnly, true);
  assert.ok(SCENARIO_INTELLIGENCE_MUST_NOT_OWN.includes("recommendations"));
  assert.ok(SCENARIO_INTELLIGENCE_MUST_NOT_OWN.includes("scoring"));
  const manifestValidation = validateStageManifest(SCENARIO_INTELLIGENCE_SELF_MANIFEST);
  assert.equal(manifestValidation.valid, true, manifestValidation.issues.join("; "));
});

test("keeps APP-2 contract files inside stage allowlist", () => {
  for (const filePath of SCENARIO_INTELLIGENCE_SELF_MANIFEST.allowedFiles.filter((entry) =>
    entry.endsWith(".ts")
  )) {
    const boundary = evaluateStageFileBoundary({
      filePath,
      allowedFiles: SCENARIO_INTELLIGENCE_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: SCENARIO_INTELLIGENCE_SELF_MANIFEST.forbiddenPatterns,
    });
    assert.equal(boundary.allowed, true, `${filePath}: ${boundary.message}`);
  }
});
