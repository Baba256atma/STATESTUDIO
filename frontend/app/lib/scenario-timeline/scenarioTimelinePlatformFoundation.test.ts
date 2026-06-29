import assert from "node:assert/strict";
import test from "node:test";

import {
  resolveScenarioIdentityExample,
  validateScenarioIdentityShape,
} from "../app-2-scenario-intelligence/scenarioIntelligenceContract.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  SCENARIO_TIMELINE_COMPATIBILITY_REGISTRY,
  SCENARIO_TIMELINE_EXTENSION_REGISTRY,
  SCENARIO_TIMELINE_FUTURE_COMPATIBILITY,
  SCENARIO_TIMELINE_FUTURE_PHASE_KEYS,
  SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS,
  SCENARIO_TIMELINE_MANDATORY_EVENT_FIELDS,
  SCENARIO_TIMELINE_MUST_NOT_OWN,
  SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
  SCENARIO_TIMELINE_PLATFORM_TAGS,
  SCENARIO_TIMELINE_RELEASE_METADATA,
} from "./scenarioTimelinePlatformConstants.ts";
import {
  SCENARIO_TIMELINE_FREEZE_RULES,
  SCENARIO_TIMELINE_PLATFORM_IDENTITY,
  SCENARIO_TIMELINE_PLATFORM_SELF_MANIFEST,
  SCENARIO_TIMELINE_PUBLIC_API_RULES,
  ScenarioTimelinePlatformContract,
  getScenarioTimelineContractVersionMetadata,
  getScenarioTimelineFutureCompatibility,
  resolveScenarioTimelineEventExample,
  resolveScenarioTimelineTypeRegistrationExample,
} from "./scenarioTimelinePlatformContracts.ts";
import {
  initializeScenarioTimelinePlatform,
  isScenarioTimelinePlatformInitialized,
} from "./scenarioTimelinePlatformFoundation.ts";
import { buildScenarioTimelineManifest } from "./scenarioTimelinePlatformManifest.ts";
import {
  ScenarioTimelinePlatform,
  getTimelineRegistry,
  getTimelineType,
  registerTimelineType,
  resetScenarioTimelinePlatformForTests,
  validateScenarioTimelinePlatform,
} from "./scenarioTimelinePlatform.ts";
import {
  isReservedScenarioTimelineTypeId,
  isScenarioTimelineEventType,
  isScenarioTimelineLifecycleStage,
  validateTimelineEventContractShape,
  validateTimelineTypeRegistration,
} from "./scenarioTimelinePlatformValidation.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

test.beforeEach(() => {
  resetScenarioTimelinePlatformForTests();
});

test("exports APP-5 identity and contract vocabulary", () => {
  assert.equal(SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId, "APP-5");
  assert.equal(SCENARIO_TIMELINE_PLATFORM_IDENTITY.title, "Scenario Timeline");
  assert.equal(SCENARIO_TIMELINE_PLATFORM_IDENTITY.version, SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION);
  assert.equal(SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS.length, 8);
  for (const tag of [
    "[APP5_1]",
    "[SCENARIO_TIMELINE_FOUNDATION]",
    "[METADATA_ONLY]",
    "[NO_VISUALIZATION]",
  ]) {
    assert.ok(SCENARIO_TIMELINE_PLATFORM_TAGS.includes(tag as (typeof SCENARIO_TIMELINE_PLATFORM_TAGS)[number]), tag);
  }
});

test("validates lifecycle stage and event type guards", () => {
  assert.equal(isScenarioTimelineLifecycleStage("scenario_created"), true);
  assert.equal(isScenarioTimelineLifecycleStage("lessons_learned"), true);
  assert.equal(isScenarioTimelineLifecycleStage("timeline_playback"), false);
  assert.equal(isScenarioTimelineEventType("lifecycle_transition"), true);
  assert.equal(isScenarioTimelineEventType("invalid_event"), false);
});

test("validates timeline event contract example shape", () => {
  const event = resolveScenarioTimelineEventExample(FIXED_TIME);
  assert.equal(validateTimelineEventContractShape(event).valid, true);
  assert.equal(event.readOnly, true);
  assert.equal(event.contractVersion, "APP-5/1");
  assert.equal(event.lifecycleStage, "scenario_created");
});

test("initializes scenario timeline platform correctly", () => {
  assert.equal(isScenarioTimelinePlatformInitialized(), false);
  const init = initializeScenarioTimelinePlatform(FIXED_TIME);
  assert.equal(init.success, true);
  assert.equal(isScenarioTimelinePlatformInitialized(), true);
  assert.equal(init.data?.contractVersion, "APP-5/1");
});

test("registers and retrieves timeline types", () => {
  initializeScenarioTimelinePlatform(FIXED_TIME);
  const registration = resolveScenarioTimelineTypeRegistrationExample();
  const registered = registerTimelineType(registration, FIXED_TIME);
  assert.equal(registered.success, true);
  assert.equal(getTimelineType(registration.typeId)?.label, registration.label);
  assert.equal(getTimelineRegistry().length, 1);
});

test("rejects reserved timeline type ids", () => {
  initializeScenarioTimelinePlatform(FIXED_TIME);
  assert.equal(isReservedScenarioTimelineTypeId("timeline-system"), true);
  const rejected = registerTimelineType(
    Object.freeze({
      ...resolveScenarioTimelineTypeRegistrationExample(),
      typeId: "timeline-system",
    }),
    FIXED_TIME
  );
  assert.equal(rejected.success, false);
});

test("builds immutable scenario timeline manifest", () => {
  initializeScenarioTimelinePlatform(FIXED_TIME);
  const manifest = buildScenarioTimelineManifest(SCENARIO_TIMELINE_PLATFORM_SELF_MANIFEST, FIXED_TIME);
  assert.equal(Object.isFrozen(manifest), true);
  assert.equal(manifest.manifestVersion, "APP-5/1");
  assert.equal(manifest.releaseMetadata.platformStatus, "build");
  assert.equal(manifest.extensionRegistry.length, 6);
  assert.equal(manifest.compatibilityRegistry.length, 5);
});

test("validates scenario timeline platform", () => {
  const report = validateScenarioTimelinePlatform(FIXED_TIME);
  assert.equal(report.valid, true);
  assert.equal(report.platformInitialized, true);
  assert.equal(report.manifestValid, true);
  assert.equal(report.compatibilityValid, true);
});

test("validates APP-5:1 stage manifest and architecture boundaries", () => {
  assert.equal(validateStageManifest(SCENARIO_TIMELINE_PLATFORM_SELF_MANIFEST).valid, true);
  assert.equal(
    evaluateStageFileBoundary({
      filePath: "frontend/app/lib/scenario-timeline/scenarioTimelinePlatformRegistry.ts",
      allowedFiles: SCENARIO_TIMELINE_PLATFORM_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: SCENARIO_TIMELINE_PLATFORM_SELF_MANIFEST.forbiddenPatterns,
    }).allowed,
    true
  );
  assert.equal(
    evaluateStageFileBoundary({
      filePath: "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
      allowedFiles: SCENARIO_TIMELINE_PLATFORM_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: SCENARIO_TIMELINE_PLATFORM_SELF_MANIFEST.forbiddenPatterns,
    }).allowed,
    false
  );
});

test("exports extension and compatibility registries", () => {
  assert.ok(SCENARIO_TIMELINE_EXTENSION_REGISTRY.some((entry) => entry.extensionId === "timeline-visualization"));
  assert.ok(SCENARIO_TIMELINE_COMPATIBILITY_REGISTRY.some((entry) => entry.guaranteeId === "frozen-app1-app4"));
  assert.equal(SCENARIO_TIMELINE_FUTURE_COMPATIBILITY.metadataOnly, true);
  assert.equal(SCENARIO_TIMELINE_FUTURE_COMPATIBILITY.visualizationReady, false);
});

test("enforces public API and freeze rules", () => {
  assert.equal(SCENARIO_TIMELINE_PUBLIC_API_RULES.noVisualization, true);
  assert.equal(SCENARIO_TIMELINE_PUBLIC_API_RULES.noPersistence, true);
  assert.equal(SCENARIO_TIMELINE_FREEZE_RULES.publicInterfacesExtendOnly, true);
  assert.equal(SCENARIO_TIMELINE_FREEZE_RULES.noRuntimeExecution, true);
});

test("regression: APP-2 scenario identity contracts remain valid", () => {
  assert.equal(validateScenarioIdentityShape(resolveScenarioIdentityExample()).valid, true);
});

test("certifies platform contract metadata and future phases", () => {
  assert.equal(getScenarioTimelineContractVersionMetadata().contractVersion, "APP-5/1");
  assert.equal(getScenarioTimelineFutureCompatibility().scenarioIntelligenceConsumerReady, true);
  assert.equal(SCENARIO_TIMELINE_MUST_NOT_OWN.includes("timeline_ui"), true);
  assert.equal(SCENARIO_TIMELINE_MANDATORY_EVENT_FIELDS.length, 8);
  assert.equal(SCENARIO_TIMELINE_FUTURE_PHASE_KEYS.length, 10);
  assert.equal(SCENARIO_TIMELINE_RELEASE_METADATA.freezeState, "open");
  assert.equal(ScenarioTimelinePlatform.version, "APP-5/1");
});

test("validates timeline type registration shape", () => {
  assert.equal(validateTimelineTypeRegistration(resolveScenarioTimelineTypeRegistrationExample()).valid, true);
});
