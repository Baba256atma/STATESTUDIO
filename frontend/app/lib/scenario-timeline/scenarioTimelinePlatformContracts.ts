/**
 * APP-5:1 — Scenario Timeline Platform contracts.
 * Immutable architecture vocabulary — foundation for APP-5.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  SCENARIO_TIMELINE_EVENT_TYPE_KEYS,
  SCENARIO_TIMELINE_FUTURE_COMPATIBILITY,
  SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS,
  SCENARIO_TIMELINE_MANDATORY_EVENT_FIELDS,
  SCENARIO_TIMELINE_MUST_NOT_OWN,
  SCENARIO_TIMELINE_PLATFORM_ARCHITECTURE_VERSION,
  SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
  SCENARIO_TIMELINE_PLATFORM_TAGS,
} from "./scenarioTimelinePlatformConstants.ts";
import type {
  ScenarioTimelineEventContract,
  ScenarioTimelineFutureCompatibility,
  ScenarioTimelinePlatformIdentity,
  ScenarioTimelinePlatformValidationReport,
  ScenarioTimelineTypeRegistration,
} from "./scenarioTimelinePlatformTypes.ts";
import {
  isScenarioTimelinePlatformInitialized,
  initializeScenarioTimelinePlatform,
} from "./scenarioTimelinePlatformFoundation.ts";
import {
  buildScenarioTimelineManifest,
  validateScenarioTimelineManifest,
} from "./scenarioTimelinePlatformManifest.ts";
import { getTimelineRegistrySnapshot } from "./scenarioTimelinePlatformRegistry.ts";
import {
  isScenarioTimelineEventType,
  isScenarioTimelineLifecycleStage,
  validateTimelineEventContractShape,
} from "./scenarioTimelinePlatformValidation.ts";

export const SCENARIO_TIMELINE_PLATFORM_IDENTITY: ScenarioTimelinePlatformIdentity = Object.freeze({
  appId: "APP-5",
  title: "Scenario Timeline",
  version: SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
  status: "build",
  certificationStatus: "pending",
  freezeState: "open",
  architectureVersion: SCENARIO_TIMELINE_PLATFORM_ARCHITECTURE_VERSION,
});

export const SCENARIO_TIMELINE_PLATFORM_FORBIDDEN_PATTERNS = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  "executiveMemory/",
  "executive-time/",
  "executiveIntent/",
  "dashboard/",
  "assistant/",
  "components/",
  ".tsx",
  "TimelineChart",
  "TimelineViewer",
  "PlaybackEngine",
  "vectorSearch",
  "semanticSearch",
] as const);

export const SCENARIO_TIMELINE_PLATFORM_SELF_MANIFEST = Object.freeze({
  stageId: "APP-5/1",
  title: "Scenario Timeline Platform Foundation",
  goal: "Immutable APP-5 architecture foundation — timeline contracts, lifecycle types, registry, and certification only.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/scenario-timeline/scenarioTimelinePlatformConstants.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelinePlatformTypes.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelinePlatformValidation.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelinePlatformRegistry.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelinePlatformFoundation.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelinePlatformManifest.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelinePlatformContracts.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelinePlatform.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelinePlatformFoundation.test.ts",
    "docs/app-5-1-scenario-timeline-platform-foundation.md",
  ]),
  forbiddenPatterns: SCENARIO_TIMELINE_PLATFORM_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["APP-1", "APP-2", "APP-3", "APP-4", "DS", "INT"]),
  runtimePath: "library-only" as const,
  tags: SCENARIO_TIMELINE_PLATFORM_TAGS,
} satisfies StageManifest);

export const SCENARIO_TIMELINE_FREEZE_RULES = Object.freeze({
  contractImmutable: true,
  publicInterfacesExtendOnly: true,
  breakingChangesForbidden: true,
  metadataOnly: true,
  noRuntimeExecution: true,
  noVisualization: true,
} as const);

export const SCENARIO_TIMELINE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noHiddenState: true,
  noPersistence: true,
  noVisualization: true,
  noPlayback: true,
  noSearch: true,
  noReact: true,
  noAssistantIntegration: true,
  noDashboardIntegration: true,
  metadataOnly: true,
} as const);

const DEFAULT_TIME = "2026-01-01T00:00:00.000Z";

export function resolveScenarioTimelineEventExample(
  timestamp: string = DEFAULT_TIME
): ScenarioTimelineEventContract {
  return Object.freeze({
    eventId: "timeline-event-example-001",
    scenarioId: "scenario-eu-expansion-001",
    workspaceId: "ws-scenario-timeline-001",
    eventType: "lifecycle_transition",
    lifecycleStage: "scenario_created",
    title: "Scenario created",
    summary: "Executive scenario lifecycle initialized for European expansion.",
    occurredAt: timestamp,
    sourceModule: "scenario-timeline-platform-foundation",
    contractVersion: SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
    timelineTypeId: "timeline-type-scenario-lifecycle",
    readOnly: true as const,
  });
}

export function resolveScenarioTimelineTypeRegistrationExample(): ScenarioTimelineTypeRegistration {
  return Object.freeze({
    typeId: "timeline-type-scenario-lifecycle",
    label: "Scenario Lifecycle Timeline",
    description: "Canonical scenario lifecycle timeline type for APP-5 foundation.",
    supportedLifecycleStages: SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS,
    supportedEventTypes: SCENARIO_TIMELINE_EVENT_TYPE_KEYS,
    metadata: Object.freeze({ owner: "scenario-timeline-platform-foundation" }),
  });
}

export function getScenarioTimelineContractVersionMetadata(): Readonly<{
  contractVersion: typeof SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION;
  architectureVersion: typeof SCENARIO_TIMELINE_PLATFORM_ARCHITECTURE_VERSION;
}> {
  return Object.freeze({
    contractVersion: SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
    architectureVersion: SCENARIO_TIMELINE_PLATFORM_ARCHITECTURE_VERSION,
  });
}

export function getScenarioTimelineFutureCompatibility(): ScenarioTimelineFutureCompatibility {
  return SCENARIO_TIMELINE_FUTURE_COMPATIBILITY;
}

export function validateScenarioTimelinePlatform(
  timestamp: string = DEFAULT_TIME
): ScenarioTimelinePlatformValidationReport {
  const issues: ScenarioTimelinePlatformValidationReport["issues"] = [];

  if (!isScenarioTimelinePlatformInitialized()) {
    initializeScenarioTimelinePlatform(timestamp);
  }

  const manifest = buildScenarioTimelineManifest(SCENARIO_TIMELINE_PLATFORM_SELF_MANIFEST, timestamp);
  const manifestValidation = validateScenarioTimelineManifest(manifest);
  if (!manifestValidation.valid) {
    issues.push(...manifestValidation.issues);
  }

  const eventValidation = validateTimelineEventContractShape(resolveScenarioTimelineEventExample(timestamp));
  if (!eventValidation.valid) {
    issues.push(...eventValidation.issues);
  }

  const registry = getTimelineRegistrySnapshot();
  if (registry.registryVersion.trim().length === 0) {
    issues.push(
      Object.freeze({
        code: "invalid_registry",
        message: "Registry version is missing.",
        field: "registryVersion",
        readOnly: true as const,
      })
    );
  }

  return Object.freeze({
    valid: issues.length === 0,
    platformInitialized: isScenarioTimelinePlatformInitialized(),
    registryValid: registry.timelineTypeCount >= 0,
    manifestValid: manifestValidation.valid,
    compatibilityValid: SCENARIO_TIMELINE_FUTURE_COMPATIBILITY.metadataOnly === true,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export const ScenarioTimelinePlatformContract = Object.freeze({
  resolveScenarioTimelineEventExample,
  resolveScenarioTimelineTypeRegistrationExample,
  validateScenarioTimelinePlatform,
  getScenarioTimelineContractVersionMetadata,
  getScenarioTimelineFutureCompatibility,
  isScenarioTimelineLifecycleStage,
  isScenarioTimelineEventType,
  identity: SCENARIO_TIMELINE_PLATFORM_IDENTITY,
  version: SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
  tags: SCENARIO_TIMELINE_PLATFORM_TAGS,
  mandatoryEventFields: SCENARIO_TIMELINE_MANDATORY_EVENT_FIELDS,
  mustNotOwn: SCENARIO_TIMELINE_MUST_NOT_OWN,
});

export {
  SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS,
  SCENARIO_TIMELINE_EVENT_TYPE_KEYS,
  SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
  SCENARIO_TIMELINE_PLATFORM_TAGS,
  SCENARIO_TIMELINE_MUST_NOT_OWN,
  SCENARIO_TIMELINE_FUTURE_COMPATIBILITY,
};
