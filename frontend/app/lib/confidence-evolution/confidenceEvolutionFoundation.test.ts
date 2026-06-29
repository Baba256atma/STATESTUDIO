import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { BUSINESS_TIMELINE_PLATFORM_IDENTITY } from "../business-timeline/businessTimelineContracts.ts";
import { DECISION_JOURNAL_PLATFORM_IDENTITY } from "../decision-journal/decisionJournalContracts.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "../decision-timeline/decisionTimelineContracts.ts";
import {
  SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
  SCENARIO_TIMELINE_PLATFORM_IDENTITY,
} from "../scenario-timeline/scenarioTimelinePlatformContracts.ts";
import {
  CONFIDENCE_EVOLUTION_CHANGE_REASON_KEYS,
  CONFIDENCE_EVOLUTION_COMPATIBILITY_REGISTRY,
  CONFIDENCE_EVOLUTION_CONFIDENCE_LEVEL_KEYS,
  CONFIDENCE_EVOLUTION_EXTENSION_REGISTRY,
  CONFIDENCE_EVOLUTION_FUTURE_COMPATIBILITY,
  CONFIDENCE_EVOLUTION_FUTURE_PHASE_KEYS,
  CONFIDENCE_EVOLUTION_MANDATORY_RECORD_FIELDS,
  CONFIDENCE_EVOLUTION_MUST_NOT_OWN,
  CONFIDENCE_EVOLUTION_PLATFORM_CAPABILITIES,
  CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION,
  CONFIDENCE_EVOLUTION_PLATFORM_PRINCIPLES,
  CONFIDENCE_EVOLUTION_PLATFORM_TAGS,
  CONFIDENCE_EVOLUTION_RELEASE_METADATA,
  CONFIDENCE_EVOLUTION_SOURCE_KEYS,
} from "./confidenceEvolutionConstants.ts";
import {
  CONFIDENCE_EVOLUTION_FREEZE_RULES,
  CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY,
  CONFIDENCE_EVOLUTION_PLATFORM_SELF_MANIFEST,
  CONFIDENCE_EVOLUTION_PUBLIC_API_RULES,
  ConfidenceEvolutionPlatformContract,
  createConfidenceEvolution,
  getConfidenceEvolutionContractVersionMetadata,
  getConfidenceEvolutionFutureCompatibility,
  getConfidenceEvolutionManifest,
  isConfidenceEvolutionReady,
  registerConfidenceEvolution,
  resolveConfidenceRecordExample,
  validateConfidenceEvolution,
} from "./confidenceEvolutionContracts.ts";
import {
  createConfidenceEvolutionFoundation,
  getConfidenceEvolution,
  isConfidenceEvolutionPlatformInitialized,
} from "./confidenceEvolutionFoundation.ts";
import {
  getConfidenceEvolutionRegistry,
  registerMetadataExtension,
} from "./confidenceEvolutionRegistry.ts";
import {
  resetConfidenceEvolutionPlatformForTests,
  runConfidenceEvolutionFoundation,
} from "./confidenceEvolutionRunner.ts";
import {
  hasDuplicateIds,
  isConfidenceChangeReason,
  isConfidenceLevel,
  isConfidenceSource,
  isReservedConfidenceEvolutionId,
  validateConfidenceEvolutionRegistration,
  validateConfidenceRecordContractShape,
  validateEvolutionIdentity,
  validatePlatformIdentity,
  validateWorkspaceIsolation,
} from "./confidenceEvolutionValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetConfidenceEvolutionPlatformForTests();
});

test("exports APP-9 identity and contract vocabulary", () => {
  assert.equal(CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.appId, "APP-9");
  assert.equal(CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.title, "Confidence Evolution");
  assert.equal(CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.platformId, "confidence-evolution-platform");
  assert.equal(CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY.version, CONFIDENCE_EVOLUTION_PLATFORM_CONTRACT_VERSION);
  assert.equal(CONFIDENCE_EVOLUTION_CONFIDENCE_LEVEL_KEYS.length, 5);
  assert.equal(CONFIDENCE_EVOLUTION_SOURCE_KEYS.length, 8);
  assert.equal(CONFIDENCE_EVOLUTION_CHANGE_REASON_KEYS.length, 8);
});

test("validates confidence enum guards", () => {
  assert.equal(isConfidenceLevel("medium"), true);
  assert.equal(isConfidenceLevel("invalid"), false);
  assert.equal(isConfidenceSource("manual"), true);
  assert.equal(isConfidenceSource("journal"), true);
  assert.equal(isConfidenceChangeReason("new_evidence"), true);
  assert.equal(isConfidenceChangeReason("invalid"), false);
});

test("validates confidence record contract example shape", () => {
  const record = resolveConfidenceRecordExample(FIXED_TIME);
  assert.equal(validateConfidenceRecordContractShape(record).valid, true);
  assert.equal(record.readOnly, true);
  assert.equal(record.version, "APP-9/1");
  assert.equal(record.confidenceLevel, "medium");
  assert.equal(record.previousConfidence, "high");
  assert.equal(record.evidenceReferences.length, 2);
});

test("creates confidence evolution foundation correctly", () => {
  assert.equal(isConfidenceEvolutionReady(), false);
  const init = createConfidenceEvolution(FIXED_TIME);
  assert.equal(init.success, true);
  assert.equal(isConfidenceEvolutionPlatformInitialized(), true);
  assert.equal(init.data?.contractVersion, "APP-9/1");
  assert.equal(init.data?.supportedConfidenceLevels.length, 5);
  assert.equal(init.data?.supportedSources.length, 8);
  assert.equal(init.data?.supportedChangeReasons.length, 8);
});

test("registers confidence evolution", () => {
  createConfidenceEvolutionFoundation(FIXED_TIME);
  const evolution = registerConfidenceEvolution(
    Object.freeze({
      evolutionId: "confidence-evolution-ws-test-001",
      workspaceId: "ws-test-001",
      label: "Executive Confidence Evolution",
      description: "Primary confidence evolution for test workspace.",
    }),
    FIXED_TIME
  );
  assert.equal(evolution.success, true);
  assert.equal(getConfidenceEvolutionRegistry().evolutions.length, 1);
});

test("rejects reserved confidence evolution ids", () => {
  createConfidenceEvolutionFoundation(FIXED_TIME);
  assert.equal(isReservedConfidenceEvolutionId("confidence-evolution-system"), true);
  const rejected = registerConfidenceEvolution(
    Object.freeze({
      evolutionId: "confidence-evolution-system",
      workspaceId: "ws-test-001",
      label: "Reserved",
      description: "Should fail.",
    }),
    FIXED_TIME
  );
  assert.equal(rejected.success, false);
});

test("builds immutable confidence evolution manifest", () => {
  createConfidenceEvolutionFoundation(FIXED_TIME);
  const manifest = getConfidenceEvolutionManifest(FIXED_TIME);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.manifestVersion, "APP-9/1");
  assert.equal(manifest.extensionRegistry.length, 4);
  assert.equal(manifest.compatibilityRegistry.length, 5);
  assert.equal(manifest.platformPrinciples.length, 12);
});

test("validates confidence evolution foundation", () => {
  const report = validateConfidenceEvolution(FIXED_TIME);
  assert.equal(report.valid, true);
  assert.equal(report.platformInitialized, true);
  assert.equal(report.manifestValid, true);
  assert.equal(report.compatibilityValid, true);
  assert.equal(report.workspaceIsolationValid, true);
  assert.equal(report.evolutionIdentityValid, true);
});

test("validates APP-9:1 stage manifest and architecture boundaries", () => {
  assert.equal(validateStageManifest(CONFIDENCE_EVOLUTION_PLATFORM_SELF_MANIFEST).valid, true);
  assert.equal(
    evaluateStageFileBoundary({
      filePath: "frontend/app/lib/confidence-evolution/confidenceEvolutionRegistry.ts",
      allowedFiles: CONFIDENCE_EVOLUTION_PLATFORM_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: CONFIDENCE_EVOLUTION_PLATFORM_SELF_MANIFEST.forbiddenPatterns,
    }).allowed,
    true
  );
});

test("exports extension and compatibility registries", () => {
  assert.ok(CONFIDENCE_EVOLUTION_EXTENSION_REGISTRY.some((entry) => entry.extensionId === "confidence-dashboard"));
  assert.ok(CONFIDENCE_EVOLUTION_COMPATIBILITY_REGISTRY.some((entry) => entry.guaranteeId === "frozen-prior-platforms"));
  assert.equal(CONFIDENCE_EVOLUTION_FUTURE_COMPATIBILITY.metadataOnly, true);
  assert.equal(CONFIDENCE_EVOLUTION_FUTURE_COMPATIBILITY.evolutionEngineReady, false);
  assert.equal(CONFIDENCE_EVOLUTION_FUTURE_COMPATIBILITY.trendEngineReady, false);
  assert.equal(CONFIDENCE_EVOLUTION_FUTURE_COMPATIBILITY.decisionJournalLinkReady, false);
  assert.equal(CONFIDENCE_EVOLUTION_FUTURE_COMPATIBILITY.decisionTimelineLinkReady, false);
});

test("enforces public API and freeze rules", () => {
  assert.equal(CONFIDENCE_EVOLUTION_PUBLIC_API_RULES.noVisualization, true);
  assert.equal(CONFIDENCE_EVOLUTION_PUBLIC_API_RULES.noRuntime, true);
  assert.equal(CONFIDENCE_EVOLUTION_PUBLIC_API_RULES.noDecisionJournalIntegration, true);
  assert.equal(CONFIDENCE_EVOLUTION_FREEZE_RULES.publicInterfacesExtendOnly, true);
  assert.equal(CONFIDENCE_EVOLUTION_FREEZE_RULES.noAiReasoning, true);
  assert.equal(CONFIDENCE_EVOLUTION_FREEZE_RULES.noTrendAnalysis, true);
});

test("validates platform identity evolution identity and workspace isolation", () => {
  assert.equal(validatePlatformIdentity(CONFIDENCE_EVOLUTION_PLATFORM_IDENTITY).valid, true);
  assert.equal(validateEvolutionIdentity("confidence-evolution-ws-001").valid, true);
  assert.equal(validateEvolutionIdentity("invalid-evolution").valid, false);
  assert.equal(validateWorkspaceIsolation("ws-001", "ws-001").valid, true);
  assert.equal(validateWorkspaceIsolation("ws-001", "ws-002").valid, false);
});

test("detects duplicate ids", () => {
  assert.equal(hasDuplicateIds(["a", "b", "a"]), true);
  assert.equal(hasDuplicateIds(["a", "b", "c"]), false);
});

test("regression: APP-5 APP-6 APP-7 and APP-8 platforms remain valid", () => {
  assert.equal(SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId, "APP-5");
  assert.equal(SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION, "APP-5/1");
  assert.equal(DECISION_TIMELINE_PLATFORM_IDENTITY.appId, "APP-6");
  assert.equal(BUSINESS_TIMELINE_PLATFORM_IDENTITY.appId, "APP-7");
  assert.equal(DECISION_JOURNAL_PLATFORM_IDENTITY.appId, "APP-8");
});

test("registers metadata extensions", () => {
  createConfidenceEvolutionFoundation(FIXED_TIME);
  const result = registerMetadataExtension(
    Object.freeze({
      extensionId: "confidence-stability-v1",
      label: "Confidence Stability v1",
      description: "Stability metadata extension.",
    })
  );
  assert.equal(result.success, true);
  assert.equal(getConfidenceEvolutionRegistry().metadataExtensions.length, 1);
});

test("getConfidenceEvolution returns platform state", () => {
  createConfidenceEvolutionFoundation(FIXED_TIME);
  const state = getConfidenceEvolution(FIXED_TIME);
  assert.equal(state.platformId, "confidence-evolution-platform");
  assert.equal(state.initialized, true);
});

test("runs confidence evolution foundation certification", () => {
  const result = runConfidenceEvolutionFoundation(FIXED_TIME);
  assert.equal(result.certified, true);
  assert.equal(result.failedCount, 0);
  assert.ok(result.passedCount >= 15);
  assert.equal(result.phase, "APP-9/1");
});

test("exports confidence evolution platform contract bundle", () => {
  assert.equal(ConfidenceEvolutionPlatformContract.version, "APP-9/1");
  assert.equal(ConfidenceEvolutionPlatformContract.identity.appId, "APP-9");
  assert.equal(getConfidenceEvolutionContractVersionMetadata().contractVersion, "APP-9/1");
  assert.equal(getConfidenceEvolutionFutureCompatibility().scenarioTimelineConsumerReady, true);
  assert.equal(CONFIDENCE_EVOLUTION_MUST_NOT_OWN.includes("visualization"), true);
  assert.equal(CONFIDENCE_EVOLUTION_MANDATORY_RECORD_FIELDS.length, 13);
  assert.equal(CONFIDENCE_EVOLUTION_FUTURE_PHASE_KEYS.length, 10);
  assert.equal(CONFIDENCE_EVOLUTION_PLATFORM_CAPABILITIES.length, 8);
  assert.equal(CONFIDENCE_EVOLUTION_RELEASE_METADATA.freezeState, "open");
  assert.equal(CONFIDENCE_EVOLUTION_PLATFORM_PRINCIPLES.includes("confidence_record_ids_are_immutable"), true);
  assert.equal(CONFIDENCE_EVOLUTION_PLATFORM_TAGS.length, 9);
});

test("validates confidence evolution registration shape", () => {
  assert.equal(
    validateConfidenceEvolutionRegistration(
      Object.freeze({
        evolutionId: "confidence-evolution-ws-shape-001",
        workspaceId: "ws-shape-001",
        label: "Shape Test Evolution",
        description: "Registration shape validation.",
      })
    ).valid,
    true
  );
});
