import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
  SCENARIO_TIMELINE_PLATFORM_IDENTITY,
} from "../scenario-timeline/scenarioTimelinePlatformContracts.ts";
import {
  DECISION_TIMELINE_CATEGORY_KEYS,
  DECISION_TIMELINE_COMPATIBILITY_REGISTRY,
  DECISION_TIMELINE_EXTENSION_REGISTRY,
  DECISION_TIMELINE_FUTURE_COMPATIBILITY,
  DECISION_TIMELINE_FUTURE_PHASE_KEYS,
  DECISION_TIMELINE_MANDATORY_DECISION_FIELDS,
  DECISION_TIMELINE_MUST_NOT_OWN,
  DECISION_TIMELINE_PLATFORM_CAPABILITIES,
  DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION,
  DECISION_TIMELINE_PLATFORM_PRINCIPLES,
  DECISION_TIMELINE_PLATFORM_TAGS,
  DECISION_TIMELINE_RELEASE_METADATA,
  DECISION_TIMELINE_STATUS_KEYS,
} from "./decisionTimelineConstants.ts";
import {
  DECISION_TIMELINE_FREEZE_RULES,
  DECISION_TIMELINE_PLATFORM_IDENTITY,
  DECISION_TIMELINE_PLATFORM_SELF_MANIFEST,
  DECISION_TIMELINE_PUBLIC_API_RULES,
  DecisionTimelinePlatformContract,
  getDecisionTimelineContractVersionMetadata,
  getDecisionTimelineFutureCompatibility,
  getDecisionTimelineManifest,
  resolveDecisionEventExample,
  resolveDecisionExample,
  resolveDecisionTimelineEntryExample,
  resolveDecisionTypeRegistrationExample,
  validateDecisionTimelineFoundation,
} from "./decisionTimelineContracts.ts";
import {
  createDecisionTimelineFoundation,
  isDecisionTimelinePlatformInitialized,
} from "./decisionTimelineFoundation.ts";
import {
  getDecisionTimelineRegistry,
  getDecisionType,
  registerDecisionType,
  registerMetadataExtension,
} from "./decisionTimelineRegistry.ts";
import {
  resetDecisionTimelinePlatformForTests,
  runDecisionTimelineFoundation,
} from "./decisionTimelineRunner.ts";
import {
  hasDuplicateIds,
  isDecisionCategory,
  isDecisionEventType,
  isDecisionSource,
  isDecisionStatus,
  isReservedDecisionTypeId,
  validateDecisionContractShape,
  validateDecisionEventContractShape,
  validateDecisionTimelineEntryShape,
  validateDecisionTypeRegistration,
  validatePlatformIdentity,
  validateTimelineIdentity,
  validateWorkspaceIsolation,
} from "./decisionTimelineValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetDecisionTimelinePlatformForTests();
});

test("exports APP-6 identity and contract vocabulary", () => {
  assert.equal(DECISION_TIMELINE_PLATFORM_IDENTITY.appId, "APP-6");
  assert.equal(DECISION_TIMELINE_PLATFORM_IDENTITY.title, "Decision Timeline");
  assert.equal(DECISION_TIMELINE_PLATFORM_IDENTITY.platformId, "decision-timeline-platform");
  assert.equal(DECISION_TIMELINE_PLATFORM_IDENTITY.version, DECISION_TIMELINE_PLATFORM_CONTRACT_VERSION);
  assert.equal(DECISION_TIMELINE_STATUS_KEYS.length, 6);
  assert.equal(DECISION_TIMELINE_CATEGORY_KEYS.length, 7);
  for (const tag of [
    "[APP6_1]",
    "[DECISION_TIMELINE_FOUNDATION]",
    "[METADATA_ONLY]",
    "[NO_ANALYTICS]",
  ]) {
    assert.ok(DECISION_TIMELINE_PLATFORM_TAGS.includes(tag as (typeof DECISION_TIMELINE_PLATFORM_TAGS)[number]), tag);
  }
});

test("validates decision status, source, category, and event type guards", () => {
  assert.equal(isDecisionStatus("committed"), true);
  assert.equal(isDecisionStatus("superseded"), true);
  assert.equal(isDecisionStatus("timeline_playback"), false);
  assert.equal(isDecisionSource("executive_direct"), true);
  assert.equal(isDecisionSource("invalid_source"), false);
  assert.equal(isDecisionCategory("strategic"), true);
  assert.equal(isDecisionCategory("invalid_category"), false);
  assert.equal(isDecisionEventType("decision_committed"), true);
  assert.equal(isDecisionEventType("invalid_event"), false);
});

test("validates decision and event contract example shapes", () => {
  const decision = resolveDecisionExample(FIXED_TIME);
  assert.equal(validateDecisionContractShape(decision).valid, true);
  assert.equal(decision.readOnly, true);
  assert.equal(decision.contractVersion, "APP-6/1");
  assert.equal(decision.status, "committed");

  const event = resolveDecisionEventExample(FIXED_TIME);
  assert.equal(validateDecisionEventContractShape(event).valid, true);
  assert.equal(event.eventType, "decision_committed");
});

test("validates decision timeline entry shape", () => {
  const entry = resolveDecisionTimelineEntryExample(FIXED_TIME);
  assert.equal(validateDecisionTimelineEntryShape(entry).valid, true);
  assert.equal(entry.sequenceNumber, 0);
});

test("creates decision timeline foundation correctly", () => {
  assert.equal(isDecisionTimelinePlatformInitialized(), false);
  const init = createDecisionTimelineFoundation(FIXED_TIME);
  assert.equal(init.success, true);
  assert.equal(isDecisionTimelinePlatformInitialized(), true);
  assert.equal(init.data?.contractVersion, "APP-6/1");
  assert.equal(init.data?.supportedCategories.length, 7);
});

test("registers and retrieves decision types", () => {
  createDecisionTimelineFoundation(FIXED_TIME);
  const registration = resolveDecisionTypeRegistrationExample();
  const registered = registerDecisionType(registration, FIXED_TIME);
  assert.equal(registered.success, true);
  assert.equal(getDecisionType(registration.typeId)?.label, registration.label);
  assert.equal(getDecisionTimelineRegistry().decisionTypes.length, 1);
});

test("rejects reserved decision type ids", () => {
  createDecisionTimelineFoundation(FIXED_TIME);
  assert.equal(isReservedDecisionTypeId("decision-system"), true);
  const rejected = registerDecisionType(
    Object.freeze({
      ...resolveDecisionTypeRegistrationExample(),
      typeId: "decision-system",
    }),
    FIXED_TIME
  );
  assert.equal(rejected.success, false);
});

test("rejects duplicate decision type registration", () => {
  createDecisionTimelineFoundation(FIXED_TIME);
  const registration = resolveDecisionTypeRegistrationExample();
  assert.equal(registerDecisionType(registration, FIXED_TIME).success, true);
  assert.equal(registerDecisionType(registration, FIXED_TIME).success, false);
});

test("builds immutable decision timeline manifest", () => {
  createDecisionTimelineFoundation(FIXED_TIME);
  const manifest = getDecisionTimelineManifest(FIXED_TIME);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.manifestVersion, "APP-6/1");
  assert.equal(manifest.releaseMetadata.platformStatus, "build");
  assert.equal(manifest.extensionRegistry.length, 6);
  assert.equal(manifest.compatibilityRegistry.length, 5);
  assert.equal(manifest.platformPrinciples.length, 10);
});

test("validates decision timeline foundation", () => {
  const report = validateDecisionTimelineFoundation(FIXED_TIME);
  assert.equal(report.valid, true);
  assert.equal(report.platformInitialized, true);
  assert.equal(report.manifestValid, true);
  assert.equal(report.compatibilityValid, true);
  assert.equal(report.workspaceIsolationValid, true);
  assert.equal(report.timelineIdentityValid, true);
});

test("validates APP-6:1 stage manifest and architecture boundaries", () => {
  assert.equal(validateStageManifest(DECISION_TIMELINE_PLATFORM_SELF_MANIFEST).valid, true);
  assert.equal(
    evaluateStageFileBoundary({
      filePath: "frontend/app/lib/decision-timeline/decisionTimelineRegistry.ts",
      allowedFiles: DECISION_TIMELINE_PLATFORM_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: DECISION_TIMELINE_PLATFORM_SELF_MANIFEST.forbiddenPatterns,
    }).allowed,
    true
  );
  assert.equal(
    evaluateStageFileBoundary({
      filePath: "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
      allowedFiles: DECISION_TIMELINE_PLATFORM_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: DECISION_TIMELINE_PLATFORM_SELF_MANIFEST.forbiddenPatterns,
    }).allowed,
    false
  );
});

test("exports extension and compatibility registries", () => {
  assert.ok(DECISION_TIMELINE_EXTENSION_REGISTRY.some((entry) => entry.extensionId === "decision-replay"));
  assert.ok(DECISION_TIMELINE_COMPATIBILITY_REGISTRY.some((entry) => entry.guaranteeId === "frozen-app1-app5"));
  assert.equal(DECISION_TIMELINE_FUTURE_COMPATIBILITY.metadataOnly, true);
  assert.equal(DECISION_TIMELINE_FUTURE_COMPATIBILITY.replayReady, false);
  assert.equal(DECISION_TIMELINE_FUTURE_COMPATIBILITY.analyticsReady, false);
});

test("enforces public API and freeze rules", () => {
  assert.equal(DECISION_TIMELINE_PUBLIC_API_RULES.noAnalytics, true);
  assert.equal(DECISION_TIMELINE_PUBLIC_API_RULES.noPersistence, true);
  assert.equal(DECISION_TIMELINE_PUBLIC_API_RULES.noReplay, true);
  assert.equal(DECISION_TIMELINE_FREEZE_RULES.publicInterfacesExtendOnly, true);
  assert.equal(DECISION_TIMELINE_FREEZE_RULES.noRuntimeExecution, true);
});

test("validates platform identity and timeline identity", () => {
  assert.equal(validatePlatformIdentity(DECISION_TIMELINE_PLATFORM_IDENTITY).valid, true);
  assert.equal(validateTimelineIdentity("decision-timeline-ws-001").valid, true);
  assert.equal(validateTimelineIdentity("invalid-timeline").valid, false);
});

test("validates workspace isolation contracts", () => {
  assert.equal(validateWorkspaceIsolation("ws-001", "ws-001").valid, true);
  assert.equal(validateWorkspaceIsolation("ws-001", "ws-002").valid, false);
});

test("detects duplicate ids", () => {
  assert.equal(hasDuplicateIds(["a", "b", "a"]), true);
  assert.equal(hasDuplicateIds(["a", "b", "c"]), false);
});

test("regression: APP-5 scenario timeline identity remains valid", () => {
  assert.equal(SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId, "APP-5");
  assert.equal(SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION, "APP-5/1");
});

test("certifies platform contract metadata and future phases", () => {
  assert.equal(getDecisionTimelineContractVersionMetadata().contractVersion, "APP-6/1");
  assert.equal(getDecisionTimelineFutureCompatibility().scenarioTimelineConsumerReady, true);
  assert.equal(DECISION_TIMELINE_MUST_NOT_OWN.includes("decision_storage"), true);
  assert.equal(DECISION_TIMELINE_MANDATORY_DECISION_FIELDS.length, 8);
  assert.equal(DECISION_TIMELINE_FUTURE_PHASE_KEYS.length, 10);
  assert.equal(DECISION_TIMELINE_PLATFORM_CAPABILITIES.length, 7);
  assert.equal(DECISION_TIMELINE_RELEASE_METADATA.freezeState, "open");
  assert.equal(DECISION_TIMELINE_PLATFORM_PRINCIPLES.includes("timeline_events_are_append_only"), true);
});

test("validates decision type registration shape", () => {
  assert.equal(validateDecisionTypeRegistration(resolveDecisionTypeRegistrationExample()).valid, true);
});

test("registers metadata extensions", () => {
  createDecisionTimelineFoundation(FIXED_TIME);
  const result = registerMetadataExtension(
    Object.freeze({
      extensionId: "decision-context-v1",
      label: "Decision Context v1",
      description: "Context metadata extension.",
    })
  );
  assert.equal(result.success, true);
  assert.equal(getDecisionTimelineRegistry().metadataExtensions.length, 1);
});

test("runs decision timeline foundation certification", () => {
  const result = runDecisionTimelineFoundation(FIXED_TIME);
  assert.equal(result.certified, true);
  assert.equal(result.failedCount, 0);
  assert.ok(result.passedCount >= 18);
  assert.equal(result.phase, "APP-6/1");
});

test("exports decision timeline platform contract bundle", () => {
  assert.equal(DecisionTimelinePlatformContract.version, "APP-6/1");
  assert.equal(DecisionTimelinePlatformContract.identity.appId, "APP-6");
  assert.equal(DecisionTimelinePlatformContract.principles.length, 10);
});
