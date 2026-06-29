/**
 * APP-6:2 — Decision Event Engine.
 * Canonical authority for immutable Decision Events.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  buildDecisionEventFromInput,
  createDecisionEventInternal,
} from "./decisionEventFactory.ts";
import {
  DECISION_EVENT_ENGINE_CONTRACT_VERSION,
  DECISION_EVENT_ENGINE_FORBIDDEN_PATTERNS,
  DECISION_EVENT_ENGINE_TAGS,
  DECISION_EVENT_MANDATORY_FIELDS,
  DECISION_ENGINE_EVENT_TYPE_KEYS,
  DECISION_ENGINE_LIFECYCLE_KEYS,
  type CreateDecisionEventInput,
  type DecisionEventContractSurface,
  type DecisionEventEngineState,
  type DecisionEventResult,
  type DecisionEngineEvent,
  decisionEventEngineErrorFromCode,
} from "./decisionEventTypes.ts";
import { resetDecisionEventIdentityForTests } from "./decisionEventBuilder.ts";
import {
  getDecisionEventRegistry,
  registerDecisionEventType,
  resetDecisionEventRegistryForTests,
} from "./decisionEventRegistry.ts";
import { validateDecisionEvent } from "./decisionEventValidation.ts";
import { DECISION_TIMELINE_MUST_NOT_OWN } from "./decisionTimelineConstants.ts";
import { DECISION_TIMELINE_PLATFORM_SELF_MANIFEST } from "./decisionTimelineContracts.ts";

export const DECISION_EVENT_ENGINE_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...DECISION_EVENT_ENGINE_FORBIDDEN_PATTERNS,
] as const);

export const DECISION_EVENT_ENGINE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-6/2",
  title: "Decision Event Engine",
  goal: "Canonical immutable decision event creation, validation, normalization, and in-memory publication.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...DECISION_TIMELINE_PLATFORM_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/decision-timeline/decisionEventTypes.ts",
    "frontend/app/lib/decision-timeline/decisionEventValidation.ts",
    "frontend/app/lib/decision-timeline/decisionEventBuilder.ts",
    "frontend/app/lib/decision-timeline/decisionEventFactory.ts",
    "frontend/app/lib/decision-timeline/decisionEventRegistry.ts",
    "frontend/app/lib/decision-timeline/decisionEventEngine.ts",
    "frontend/app/lib/decision-timeline/decisionEventRunner.ts",
    "frontend/app/lib/decision-timeline/decisionEventEngine.test.ts",
    "docs/app-6-2-decision-event-engine-report.md",
  ]),
  forbiddenPatterns: DECISION_EVENT_ENGINE_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-6/1"]),
  runtimePath: "library-only" as const,
  tags: DECISION_EVENT_ENGINE_TAGS,
} satisfies StageManifest);

export const DECISION_EVENT_ENGINE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noHiddenState: true,
  noPersistence: true,
  noAnalytics: true,
  noReplay: true,
  noSearch: true,
  noReact: true,
  noAssistantIntegration: true,
  noDashboardIntegration: true,
  immutableEvents: true,
  appendOnly: true,
} as const);

let engineInitialized = false;
let engineTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeDecisionEventEngine(timestamp: string = engineTimestamp): DecisionEventEngineState {
  engineInitialized = true;
  engineTimestamp = timestamp;
  return getDecisionEventEngineState(timestamp);
}

export function isDecisionEventEngineInitialized(): boolean {
  return engineInitialized;
}

export function getDecisionEventEngineState(timestamp: string = engineTimestamp): DecisionEventEngineState {
  const registry = getDecisionEventRegistry();
  return Object.freeze({
    engineId: "decision-event-engine",
    contractVersion: DECISION_EVENT_ENGINE_CONTRACT_VERSION,
    initialized: engineInitialized,
    publishedEventCount: registry.publishedEventCount,
    registeredEventTypeCount: registry.registeredEventTypeCount,
    timestamp,
    readOnly: true as const,
  });
}

export function resetDecisionEventEngineForTests(): void {
  engineInitialized = false;
  engineTimestamp = "2026-01-01T00:00:00.000Z";
  resetDecisionEventRegistryForTests();
  resetDecisionEventIdentityForTests();
}

export function createDecisionEvent(input: CreateDecisionEventInput): DecisionEventResult<DecisionEngineEvent> {
  if (!isDecisionEventEngineInitialized()) {
    return Object.freeze({
      success: false,
      reason: "Decision Event Engine is not initialized.",
      data: null,
      error: decisionEventEngineErrorFromCode("engineNotInitialized", "Engine not initialized."),
      readOnly: true as const,
    });
  }
  return createDecisionEventInternal(input);
}

export function getDecisionEventContract(): DecisionEventContractSurface {
  return Object.freeze({
    contractVersion: DECISION_EVENT_ENGINE_CONTRACT_VERSION,
    mandatoryFields: DECISION_EVENT_MANDATORY_FIELDS,
    supportedEventTypes: DECISION_ENGINE_EVENT_TYPE_KEYS,
    supportedLifecycles: DECISION_ENGINE_LIFECYCLE_KEYS,
    readOnly: true as const,
  });
}

export { buildDecisionEventFromInput as buildDecisionEvent };
export { validateDecisionEvent };
export { registerDecisionEventType, getDecisionEventRegistry };
export { runDecisionEventEngine } from "./decisionEventRunner.ts";

export const DECISION_EVENT_ENGINE_VERSION = DECISION_EVENT_ENGINE_CONTRACT_VERSION;
export const DECISION_EVENT_ENGINE_OWNER = "decision-event-engine";

export const DecisionEventEngine = Object.freeze({
  initializeDecisionEventEngine,
  isDecisionEventEngineInitialized,
  getDecisionEventEngineState,
  createDecisionEvent,
  buildDecisionEvent: buildDecisionEventFromInput,
  validateDecisionEvent,
  registerDecisionEventType,
  getDecisionEventRegistry,
  getDecisionEventContract,
  version: DECISION_EVENT_ENGINE_CONTRACT_VERSION,
  tags: DECISION_EVENT_ENGINE_TAGS,
  mustNotOwn: DECISION_TIMELINE_MUST_NOT_OWN,
});

export const DecisionEventEngineContract = Object.freeze({
  getDecisionEventContract,
  version: DECISION_EVENT_ENGINE_CONTRACT_VERSION,
  tags: DECISION_EVENT_ENGINE_TAGS,
  mustNotOwn: DECISION_TIMELINE_MUST_NOT_OWN,
});

export { DECISION_EVENT_MANDATORY_FIELDS, DECISION_EVENT_ENGINE_TAGS };
