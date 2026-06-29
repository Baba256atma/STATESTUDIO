import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { BUSINESS_TIMELINE_PLATFORM_IDENTITY } from "../business-timeline/businessTimelineContracts.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "../decision-timeline/decisionTimelineContracts.ts";
import {
  SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
  SCENARIO_TIMELINE_PLATFORM_IDENTITY,
} from "../scenario-timeline/scenarioTimelinePlatformContracts.ts";
import {
  DECISION_JOURNAL_COMPATIBILITY_REGISTRY,
  DECISION_JOURNAL_CONFIDENCE_KEYS,
  DECISION_JOURNAL_EXTENSION_REGISTRY,
  DECISION_JOURNAL_FUTURE_COMPATIBILITY,
  DECISION_JOURNAL_FUTURE_PHASE_KEYS,
  DECISION_JOURNAL_MANDATORY_ENTRY_FIELDS,
  DECISION_JOURNAL_MUST_NOT_OWN,
  DECISION_JOURNAL_PLATFORM_CAPABILITIES,
  DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION,
  DECISION_JOURNAL_PLATFORM_PRINCIPLES,
  DECISION_JOURNAL_PLATFORM_TAGS,
  DECISION_JOURNAL_RELEASE_METADATA,
  DECISION_JOURNAL_SOURCE_KEYS,
  DECISION_JOURNAL_STATUS_KEYS,
} from "./decisionJournalConstants.ts";
import {
  DECISION_JOURNAL_FREEZE_RULES,
  DECISION_JOURNAL_PLATFORM_IDENTITY,
  DECISION_JOURNAL_PLATFORM_SELF_MANIFEST,
  DECISION_JOURNAL_PUBLIC_API_RULES,
  DecisionJournalPlatformContract,
  createDecisionJournal,
  getDecisionJournalContractVersionMetadata,
  getDecisionJournalFutureCompatibility,
  getDecisionJournalManifest,
  isDecisionJournalReady,
  registerDecisionJournal,
  resolveDecisionJournalEntryExample,
  validateDecisionJournal,
} from "./decisionJournalContracts.ts";
import {
  createDecisionJournalFoundation,
  getDecisionJournal,
  isDecisionJournalPlatformInitialized,
} from "./decisionJournalFoundation.ts";
import {
  getDecisionJournalRegistry,
  registerMetadataExtension,
} from "./decisionJournalRegistry.ts";
import {
  resetDecisionJournalPlatformForTests,
  runDecisionJournalFoundation,
} from "./decisionJournalRunner.ts";
import {
  hasDuplicateIds,
  isDecisionJournalConfidence,
  isDecisionJournalSource,
  isDecisionJournalStatus,
  isReservedDecisionJournalId,
  validateDecisionJournalEntryContractShape,
  validateDecisionJournalRegistration,
  validateJournalIdentity,
  validatePlatformIdentity,
  validateWorkspaceIsolation,
} from "./decisionJournalValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetDecisionJournalPlatformForTests();
});

test("exports APP-8 identity and contract vocabulary", () => {
  assert.equal(DECISION_JOURNAL_PLATFORM_IDENTITY.appId, "APP-8");
  assert.equal(DECISION_JOURNAL_PLATFORM_IDENTITY.title, "Decision Journal");
  assert.equal(DECISION_JOURNAL_PLATFORM_IDENTITY.platformId, "decision-journal-platform");
  assert.equal(DECISION_JOURNAL_PLATFORM_IDENTITY.version, DECISION_JOURNAL_PLATFORM_CONTRACT_VERSION);
  assert.equal(DECISION_JOURNAL_STATUS_KEYS.length, 4);
  assert.equal(DECISION_JOURNAL_SOURCE_KEYS.length, 5);
  assert.equal(DECISION_JOURNAL_CONFIDENCE_KEYS.length, 5);
});

test("validates journal enum guards", () => {
  assert.equal(isDecisionJournalStatus("draft"), true);
  assert.equal(isDecisionJournalStatus("invalid"), false);
  assert.equal(isDecisionJournalSource("manual"), true);
  assert.equal(isDecisionJournalSource("workspace"), true);
  assert.equal(isDecisionJournalConfidence("very_high"), true);
  assert.equal(isDecisionJournalConfidence("invalid"), false);
});

test("validates journal entry contract example shape", () => {
  const entry = resolveDecisionJournalEntryExample(FIXED_TIME);
  assert.equal(validateDecisionJournalEntryContractShape(entry).valid, true);
  assert.equal(entry.readOnly, true);
  assert.equal(entry.version, "APP-8/1");
  assert.equal(entry.confidence, "high");
  assert.equal(entry.assumptions.length, 2);
  assert.equal(entry.alternatives.length, 3);
});

test("creates decision journal foundation correctly", () => {
  assert.equal(isDecisionJournalReady(), false);
  const init = createDecisionJournal(FIXED_TIME);
  assert.equal(init.success, true);
  assert.equal(isDecisionJournalPlatformInitialized(), true);
  assert.equal(init.data?.contractVersion, "APP-8/1");
  assert.equal(init.data?.supportedStatuses.length, 4);
  assert.equal(init.data?.supportedConfidenceLevels.length, 5);
});

test("registers decision journal", () => {
  createDecisionJournalFoundation(FIXED_TIME);
  const journal = registerDecisionJournal(
    Object.freeze({
      journalId: "decision-journal-ws-test-001",
      workspaceId: "ws-test-001",
      label: "Executive Decision Journal",
      description: "Primary decision journal for test workspace.",
    }),
    FIXED_TIME
  );
  assert.equal(journal.success, true);
  assert.equal(getDecisionJournalRegistry().journals.length, 1);
});

test("rejects reserved decision journal ids", () => {
  createDecisionJournalFoundation(FIXED_TIME);
  assert.equal(isReservedDecisionJournalId("decision-journal-system"), true);
  const rejected = registerDecisionJournal(
    Object.freeze({
      journalId: "decision-journal-system",
      workspaceId: "ws-test-001",
      label: "Reserved",
      description: "Should fail.",
    }),
    FIXED_TIME
  );
  assert.equal(rejected.success, false);
});

test("builds immutable decision journal manifest", () => {
  createDecisionJournalFoundation(FIXED_TIME);
  const manifest = getDecisionJournalManifest(FIXED_TIME);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.manifestVersion, "APP-8/1");
  assert.equal(manifest.extensionRegistry.length, 4);
  assert.equal(manifest.compatibilityRegistry.length, 6);
  assert.equal(manifest.platformPrinciples.length, 11);
});

test("validates decision journal foundation", () => {
  const report = validateDecisionJournal(FIXED_TIME);
  assert.equal(report.valid, true);
  assert.equal(report.platformInitialized, true);
  assert.equal(report.manifestValid, true);
  assert.equal(report.compatibilityValid, true);
  assert.equal(report.workspaceIsolationValid, true);
  assert.equal(report.journalIdentityValid, true);
});

test("validates APP-8:1 stage manifest and architecture boundaries", () => {
  assert.equal(validateStageManifest(DECISION_JOURNAL_PLATFORM_SELF_MANIFEST).valid, true);
  assert.equal(
    evaluateStageFileBoundary({
      filePath: "frontend/app/lib/decision-journal/decisionJournalRegistry.ts",
      allowedFiles: DECISION_JOURNAL_PLATFORM_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: DECISION_JOURNAL_PLATFORM_SELF_MANIFEST.forbiddenPatterns,
    }).allowed,
    true
  );
});

test("exports extension and compatibility registries", () => {
  assert.ok(DECISION_JOURNAL_EXTENSION_REGISTRY.some((entry) => entry.extensionId === "journal-dashboard"));
  assert.ok(DECISION_JOURNAL_COMPATIBILITY_REGISTRY.some((entry) => entry.guaranteeId === "frozen-prior-platforms"));
  assert.equal(DECISION_JOURNAL_FUTURE_COMPATIBILITY.metadataOnly, true);
  assert.equal(DECISION_JOURNAL_FUTURE_COMPATIBILITY.journalEngineReady, false);
  assert.equal(DECISION_JOURNAL_FUTURE_COMPATIBILITY.decisionTimelineLinkReady, false);
});

test("enforces public API and freeze rules", () => {
  assert.equal(DECISION_JOURNAL_PUBLIC_API_RULES.noVisualization, true);
  assert.equal(DECISION_JOURNAL_PUBLIC_API_RULES.noRuntime, true);
  assert.equal(DECISION_JOURNAL_PUBLIC_API_RULES.noDecisionTimelineIntegration, true);
  assert.equal(DECISION_JOURNAL_FREEZE_RULES.publicInterfacesExtendOnly, true);
  assert.equal(DECISION_JOURNAL_FREEZE_RULES.noAiReasoning, true);
});

test("validates platform identity journal identity and workspace isolation", () => {
  assert.equal(validatePlatformIdentity(DECISION_JOURNAL_PLATFORM_IDENTITY).valid, true);
  assert.equal(validateJournalIdentity("decision-journal-ws-001").valid, true);
  assert.equal(validateJournalIdentity("invalid-journal").valid, false);
  assert.equal(validateWorkspaceIsolation("ws-001", "ws-001").valid, true);
  assert.equal(validateWorkspaceIsolation("ws-001", "ws-002").valid, false);
});

test("detects duplicate ids", () => {
  assert.equal(hasDuplicateIds(["a", "b", "a"]), true);
  assert.equal(hasDuplicateIds(["a", "b", "c"]), false);
});

test("regression: APP-5 APP-6 and APP-7 platforms remain valid", () => {
  assert.equal(SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId, "APP-5");
  assert.equal(SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION, "APP-5/1");
  assert.equal(DECISION_TIMELINE_PLATFORM_IDENTITY.appId, "APP-6");
  assert.equal(BUSINESS_TIMELINE_PLATFORM_IDENTITY.appId, "APP-7");
});

test("registers metadata extensions", () => {
  createDecisionJournalFoundation(FIXED_TIME);
  const result = registerMetadataExtension(
    Object.freeze({
      extensionId: "journal-context-v1",
      label: "Journal Context v1",
      description: "Context metadata extension.",
    })
  );
  assert.equal(result.success, true);
  assert.equal(getDecisionJournalRegistry().metadataExtensions.length, 1);
});

test("getDecisionJournal returns platform state", () => {
  createDecisionJournalFoundation(FIXED_TIME);
  const state = getDecisionJournal(FIXED_TIME);
  assert.equal(state.platformId, "decision-journal-platform");
  assert.equal(state.initialized, true);
});

test("runs decision journal foundation certification", () => {
  const result = runDecisionJournalFoundation(FIXED_TIME);
  assert.equal(result.certified, true);
  assert.equal(result.failedCount, 0);
  assert.ok(result.passedCount >= 14);
  assert.equal(result.phase, "APP-8/1");
});

test("exports decision journal platform contract bundle", () => {
  assert.equal(DecisionJournalPlatformContract.version, "APP-8/1");
  assert.equal(DecisionJournalPlatformContract.identity.appId, "APP-8");
  assert.equal(getDecisionJournalContractVersionMetadata().contractVersion, "APP-8/1");
  assert.equal(getDecisionJournalFutureCompatibility().decisionTimelineConsumerReady, true);
  assert.equal(DECISION_JOURNAL_MUST_NOT_OWN.includes("visualization"), true);
  assert.equal(DECISION_JOURNAL_MANDATORY_ENTRY_FIELDS.length, 20);
  assert.equal(DECISION_JOURNAL_FUTURE_PHASE_KEYS.length, 9);
  assert.equal(DECISION_JOURNAL_PLATFORM_CAPABILITIES.length, 7);
  assert.equal(DECISION_JOURNAL_RELEASE_METADATA.freezeState, "open");
  assert.equal(DECISION_JOURNAL_PLATFORM_PRINCIPLES.includes("journal_entry_ids_are_immutable"), true);
  assert.equal(DECISION_JOURNAL_PLATFORM_TAGS.length, 9);
});

test("validates decision journal registration shape", () => {
  assert.equal(
    validateDecisionJournalRegistration(
      Object.freeze({
        journalId: "decision-journal-ws-shape-001",
        workspaceId: "ws-shape-001",
        label: "Shape Test Journal",
        description: "Registration shape validation.",
      })
    ).valid,
    true
  );
});
