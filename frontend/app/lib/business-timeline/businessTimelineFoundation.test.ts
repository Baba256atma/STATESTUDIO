import assert from "node:assert/strict";
import test from "node:test";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { DECISION_TIMELINE_PLATFORM_IDENTITY } from "../decision-timeline/decisionTimelineContracts.ts";
import {
  SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
  SCENARIO_TIMELINE_PLATFORM_IDENTITY,
} from "../scenario-timeline/scenarioTimelinePlatformContracts.ts";
import {
  BUSINESS_TIMELINE_CATEGORY_KEYS,
  BUSINESS_TIMELINE_COMPATIBILITY_REGISTRY,
  BUSINESS_TIMELINE_EVENT_TYPE_KEYS,
  BUSINESS_TIMELINE_EXTENSION_REGISTRY,
  BUSINESS_TIMELINE_FUTURE_COMPATIBILITY,
  BUSINESS_TIMELINE_FUTURE_PHASE_KEYS,
  BUSINESS_TIMELINE_IMPORTANCE_KEYS,
  BUSINESS_TIMELINE_MANDATORY_EVENT_FIELDS,
  BUSINESS_TIMELINE_MUST_NOT_OWN,
  BUSINESS_TIMELINE_PLATFORM_CAPABILITIES,
  BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION,
  BUSINESS_TIMELINE_PLATFORM_PRINCIPLES,
  BUSINESS_TIMELINE_PLATFORM_TAGS,
  BUSINESS_TIMELINE_RELEASE_METADATA,
  BUSINESS_TIMELINE_SOURCE_KEYS,
  BUSINESS_TIMELINE_STATUS_KEYS,
} from "./businessTimelineConstants.ts";
import {
  BUSINESS_TIMELINE_FREEZE_RULES,
  BUSINESS_TIMELINE_PLATFORM_IDENTITY,
  BUSINESS_TIMELINE_PLATFORM_SELF_MANIFEST,
  BUSINESS_TIMELINE_PUBLIC_API_RULES,
  BusinessTimelinePlatformContract,
  createBusinessTimeline,
  getBusinessTimelineContractVersionMetadata,
  getBusinessTimelineFutureCompatibility,
  getBusinessTimelineManifest,
  isBusinessTimelineReady,
  registerBusinessTimeline,
  resolveBusinessEventExample,
  resolveBusinessEventTypeRegistrationExample,
  validateBusinessTimeline,
} from "./businessTimelineContracts.ts";
import {
  createBusinessTimelineFoundation,
  getBusinessTimeline,
  isBusinessTimelinePlatformInitialized,
} from "./businessTimelineFoundation.ts";
import {
  getBusinessTimelineRegistry,
  registerBusinessEventType,
  registerMetadataExtension,
} from "./businessTimelineRegistry.ts";
import {
  resetBusinessTimelinePlatformForTests,
  runBusinessTimelineFoundation,
} from "./businessTimelineRunner.ts";
import {
  hasDuplicateIds,
  isBusinessEventCategory,
  isBusinessEventImportance,
  isBusinessEventSource,
  isBusinessEventStatus,
  isBusinessEventType,
  isReservedBusinessEventTypeId,
  validateBusinessEventContractShape,
  validateBusinessEventTypeRegistration,
  validatePlatformIdentity,
  validateTimelineIdentity,
  validateWorkspaceIsolation,
} from "./businessTimelineValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetBusinessTimelinePlatformForTests();
});

test("exports APP-7 identity and contract vocabulary", () => {
  assert.equal(BUSINESS_TIMELINE_PLATFORM_IDENTITY.appId, "APP-7");
  assert.equal(BUSINESS_TIMELINE_PLATFORM_IDENTITY.title, "Business Timeline");
  assert.equal(BUSINESS_TIMELINE_PLATFORM_IDENTITY.platformId, "business-timeline-platform");
  assert.equal(BUSINESS_TIMELINE_PLATFORM_IDENTITY.version, BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION);
  assert.equal(BUSINESS_TIMELINE_CATEGORY_KEYS.length, 19);
  assert.equal(BUSINESS_TIMELINE_EVENT_TYPE_KEYS.length, 17);
  assert.equal(BUSINESS_TIMELINE_IMPORTANCE_KEYS.length, 4);
  assert.equal(BUSINESS_TIMELINE_STATUS_KEYS.length, 4);
  assert.equal(BUSINESS_TIMELINE_SOURCE_KEYS.length, 6);
});

test("validates business event enum guards", () => {
  assert.equal(isBusinessEventCategory("corporate"), true);
  assert.equal(isBusinessEventCategory("invalid"), false);
  assert.equal(isBusinessEventType("milestone"), true);
  assert.equal(isBusinessEventType("invalid"), false);
  assert.equal(isBusinessEventImportance("critical"), true);
  assert.equal(isBusinessEventStatus("completed"), true);
  assert.equal(isBusinessEventSource("manual"), true);
});

test("validates business event contract example shape", () => {
  const event = resolveBusinessEventExample(FIXED_TIME);
  assert.equal(validateBusinessEventContractShape(event).valid, true);
  assert.equal(event.readOnly, true);
  assert.equal(event.version, "APP-7/1");
  assert.equal(event.category, "corporate");
  assert.equal(event.type, "milestone");
  assert.equal(event.importance, "critical");
});

test("creates business timeline foundation correctly", () => {
  assert.equal(isBusinessTimelineReady(), false);
  const init = createBusinessTimeline(FIXED_TIME);
  assert.equal(init.success, true);
  assert.equal(isBusinessTimelinePlatformInitialized(), true);
  assert.equal(init.data?.contractVersion, "APP-7/1");
  assert.equal(init.data?.supportedCategories.length, 19);
});

test("registers business timeline and event types", () => {
  createBusinessTimelineFoundation(FIXED_TIME);
  const timeline = registerBusinessTimeline(
    Object.freeze({
      timelineId: "business-timeline-ws-test-001",
      workspaceId: "ws-test-001",
      label: "Organization Life Story",
      description: "Primary business timeline for test workspace.",
    }),
    FIXED_TIME
  );
  assert.equal(timeline.success, true);
  const registration = resolveBusinessEventTypeRegistrationExample();
  const registered = registerBusinessEventType(registration, FIXED_TIME);
  assert.equal(registered.success, true);
  assert.equal(getBusinessTimelineRegistry().eventTypes.length, 1);
});

test("rejects reserved business event type ids", () => {
  createBusinessTimelineFoundation(FIXED_TIME);
  assert.equal(isReservedBusinessEventTypeId("business-system"), true);
  const rejected = registerBusinessEventType(
    Object.freeze({ ...resolveBusinessEventTypeRegistrationExample(), typeId: "business-system" }),
    FIXED_TIME
  );
  assert.equal(rejected.success, false);
});

test("builds immutable business timeline manifest", () => {
  createBusinessTimelineFoundation(FIXED_TIME);
  const manifest = getBusinessTimelineManifest(FIXED_TIME);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.manifestVersion, "APP-7/1");
  assert.equal(manifest.extensionRegistry.length, 4);
  assert.equal(manifest.compatibilityRegistry.length, 6);
  assert.equal(manifest.platformPrinciples.length, 10);
});

test("validates business timeline foundation", () => {
  const report = validateBusinessTimeline(FIXED_TIME);
  assert.equal(report.valid, true);
  assert.equal(report.platformInitialized, true);
  assert.equal(report.manifestValid, true);
  assert.equal(report.compatibilityValid, true);
  assert.equal(report.workspaceIsolationValid, true);
  assert.equal(report.timelineIdentityValid, true);
});

test("validates APP-7:1 stage manifest and architecture boundaries", () => {
  assert.equal(validateStageManifest(BUSINESS_TIMELINE_PLATFORM_SELF_MANIFEST).valid, true);
  assert.equal(
    evaluateStageFileBoundary({
      filePath: "frontend/app/lib/business-timeline/businessTimelineRegistry.ts",
      allowedFiles: BUSINESS_TIMELINE_PLATFORM_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: BUSINESS_TIMELINE_PLATFORM_SELF_MANIFEST.forbiddenPatterns,
    }).allowed,
    true
  );
});

test("exports extension and compatibility registries", () => {
  assert.ok(BUSINESS_TIMELINE_EXTENSION_REGISTRY.some((entry) => entry.extensionId === "business-dashboard"));
  assert.ok(BUSINESS_TIMELINE_COMPATIBILITY_REGISTRY.some((entry) => entry.guaranteeId === "frozen-prior-platforms"));
  assert.equal(BUSINESS_TIMELINE_FUTURE_COMPATIBILITY.metadataOnly, true);
  assert.equal(BUSINESS_TIMELINE_FUTURE_COMPATIBILITY.visualizationReady, false);
});

test("enforces public API and freeze rules", () => {
  assert.equal(BUSINESS_TIMELINE_PUBLIC_API_RULES.noVisualization, true);
  assert.equal(BUSINESS_TIMELINE_PUBLIC_API_RULES.noRuntime, true);
  assert.equal(BUSINESS_TIMELINE_FREEZE_RULES.publicInterfacesExtendOnly, true);
  assert.equal(BUSINESS_TIMELINE_FREEZE_RULES.noRuntimeExecution, true);
});

test("validates platform identity timeline identity and workspace isolation", () => {
  assert.equal(validatePlatformIdentity(BUSINESS_TIMELINE_PLATFORM_IDENTITY).valid, true);
  assert.equal(validateTimelineIdentity("business-timeline-ws-001").valid, true);
  assert.equal(validateTimelineIdentity("invalid-timeline").valid, false);
  assert.equal(validateWorkspaceIsolation("ws-001", "ws-001").valid, true);
  assert.equal(validateWorkspaceIsolation("ws-001", "ws-002").valid, false);
});

test("detects duplicate ids", () => {
  assert.equal(hasDuplicateIds(["a", "b", "a"]), true);
  assert.equal(hasDuplicateIds(["a", "b", "c"]), false);
});

test("regression: APP-5 and APP-6 platforms remain valid", () => {
  assert.equal(SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId, "APP-5");
  assert.equal(SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION, "APP-5/1");
  assert.equal(DECISION_TIMELINE_PLATFORM_IDENTITY.appId, "APP-6");
});

test("registers metadata extensions", () => {
  createBusinessTimelineFoundation(FIXED_TIME);
  const result = registerMetadataExtension(
    Object.freeze({
      extensionId: "business-context-v1",
      label: "Business Context v1",
      description: "Context metadata extension.",
    })
  );
  assert.equal(result.success, true);
  assert.equal(getBusinessTimelineRegistry().metadataExtensions.length, 1);
});

test("getBusinessTimeline returns platform state", () => {
  createBusinessTimelineFoundation(FIXED_TIME);
  const state = getBusinessTimeline(FIXED_TIME);
  assert.equal(state.platformId, "business-timeline-platform");
  assert.equal(state.initialized, true);
});

test("runs business timeline foundation certification", () => {
  const result = runBusinessTimelineFoundation(FIXED_TIME);
  assert.equal(result.certified, true);
  assert.equal(result.failedCount, 0);
  assert.ok(result.passedCount >= 20);
  assert.equal(result.phase, "APP-7/1");
});

test("exports business timeline platform contract bundle", () => {
  assert.equal(BusinessTimelinePlatformContract.version, "APP-7/1");
  assert.equal(BusinessTimelinePlatformContract.identity.appId, "APP-7");
  assert.equal(getBusinessTimelineContractVersionMetadata().contractVersion, "APP-7/1");
  assert.equal(getBusinessTimelineFutureCompatibility().decisionTimelineConsumerReady, true);
  assert.equal(BUSINESS_TIMELINE_MUST_NOT_OWN.includes("visualization"), true);
  assert.equal(BUSINESS_TIMELINE_MANDATORY_EVENT_FIELDS.length, 15);
  assert.equal(BUSINESS_TIMELINE_FUTURE_PHASE_KEYS.length, 9);
  assert.equal(BUSINESS_TIMELINE_PLATFORM_CAPABILITIES.length, 7);
  assert.equal(BUSINESS_TIMELINE_RELEASE_METADATA.freezeState, "open");
  assert.equal(BUSINESS_TIMELINE_PLATFORM_PRINCIPLES.includes("business_event_ids_are_immutable"), true);
});

test("validates business event type registration shape", () => {
  assert.equal(validateBusinessEventTypeRegistration(resolveBusinessEventTypeRegistrationExample()).valid, true);
});
