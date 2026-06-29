/**
 * APP-7:2 — Business Event Engine.
 * Canonical authority for immutable business event creation and controlled metadata updates.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { BUSINESS_TIMELINE_MUST_NOT_OWN, BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION } from "./businessTimelineConstants.ts";
import { BUSINESS_TIMELINE_PLATFORM_SELF_MANIFEST } from "./businessTimelineContracts.ts";
import { isBusinessTimelinePlatformInitialized } from "./businessTimelineFoundation.ts";
import { filterBusinessEvents } from "./businessEventEngineFilters.ts";
import { normalizeBusinessEvent } from "./businessEventEngineNormalization.ts";
import {
  allocateBusinessEventSequenceNumber,
  generateBusinessEventId,
  getBusinessEventById,
  getBusinessEventRegistrySnapshot,
  getBusinessEventRevisionHistory,
  getBusinessEventsByWorkspace,
  registerBusinessEvent,
  resetBusinessEventRegistryForTests,
} from "./businessEventEngineRegistry.ts";
import { archiveBusinessEvent, updateBusinessEventMetadata } from "./businessEventEngineMutations.ts";
import {
  BUSINESS_EVENT_ENGINE_CONTRACT_VERSION,
  BUSINESS_EVENT_ENGINE_FORBIDDEN_PATTERNS,
  BUSINESS_EVENT_ENGINE_MANDATORY_FIELDS,
  BUSINESS_EVENT_ENGINE_TAGS,
  type BusinessEngineEvent,
  type BusinessEventEngineState,
  type BusinessEventResult,
  type CreateBusinessEventInput,
  type NormalizedBusinessEventInput,
  businessEventEngineErrorFromCode,
} from "./businessEventEngineTypes.ts";
import {
  validateBusinessEngineEvent,
  validateBusinessEventInput,
  validationFailureResult,
} from "./businessEventEngineValidation.ts";

export const BUSINESS_EVENT_ENGINE_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...BUSINESS_EVENT_ENGINE_FORBIDDEN_PATTERNS,
] as const);

export const BUSINESS_EVENT_ENGINE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-7/2",
  title: "Business Event Engine",
  goal: "Immutable business event creation, validation, normalization, append-only registry, and controlled metadata updates.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...BUSINESS_TIMELINE_PLATFORM_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/business-timeline/businessEventEngineTypes.ts",
    "frontend/app/lib/business-timeline/businessEventEngineNormalization.ts",
    "frontend/app/lib/business-timeline/businessEventEngineValidation.ts",
    "frontend/app/lib/business-timeline/businessEventEngineRegistry.ts",
    "frontend/app/lib/business-timeline/businessEventEngineFilters.ts",
    "frontend/app/lib/business-timeline/businessEventEngineMutations.ts",
    "frontend/app/lib/business-timeline/businessEventEngine.ts",
    "frontend/app/lib/business-timeline/businessEventEngineRunner.ts",
    "frontend/app/lib/business-timeline/businessEventEngine.test.ts",
    "docs/app-7-2-business-event-engine.md",
  ]),
  forbiddenPatterns: BUSINESS_EVENT_ENGINE_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-7/1"]),
  runtimePath: "library-only" as const,
  tags: BUSINESS_EVENT_ENGINE_TAGS,
} satisfies StageManifest);

export const BUSINESS_EVENT_ENGINE_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noHiddenState: true,
  noPersistence: true,
  noAnalytics: true,
  noVisualization: true,
  noReact: true,
  noAssistantIntegration: true,
  noDashboardIntegration: true,
  noScenarioCoupling: true,
  noDecisionCoupling: true,
  immutableEvents: true,
  appendOnly: true,
  noHardDelete: true,
} as const);

let engineInitialized = false;
let engineTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeBusinessEventEngine(timestamp: string = engineTimestamp): BusinessEventEngineState {
  engineInitialized = true;
  engineTimestamp = timestamp;
  return getBusinessEventEngineState(timestamp);
}

export function isBusinessEventEngineInitialized(): boolean {
  return engineInitialized;
}

export function getBusinessEventEngineState(timestamp: string = engineTimestamp): BusinessEventEngineState {
  const registry = getBusinessEventRegistrySnapshot();
  return Object.freeze({
    engineId: "business-event-engine",
    contractVersion: BUSINESS_EVENT_ENGINE_CONTRACT_VERSION,
    initialized: engineInitialized,
    publishedEventCount: registry.publishedEventCount,
    timestamp,
    readOnly: true as const,
  });
}

export function resetBusinessEventEngineForTests(): void {
  engineInitialized = false;
  engineTimestamp = "2026-01-01T00:00:00.000Z";
  resetBusinessEventRegistryForTests();
}

function assertEngineReady<T>(): BusinessEventResult<T> | null {
  if (!isBusinessTimelinePlatformInitialized()) {
    return Object.freeze({
      success: false,
      reason: "APP-7:1 Business Timeline Foundation is not initialized.",
      data: null,
      error: businessEventEngineErrorFromCode("foundationIncompatible", "Foundation not initialized."),
      readOnly: true as const,
    });
  }
  if (!isBusinessEventEngineInitialized()) {
    return Object.freeze({
      success: false,
      reason: "Business Event Engine is not initialized.",
      data: null,
      error: businessEventEngineErrorFromCode("engineNotInitialized", "Engine not initialized."),
      readOnly: true as const,
    });
  }
  return null;
}

function buildEngineEvent(normalized: NormalizedBusinessEventInput, eventId: string): BusinessEngineEvent {
  return Object.freeze({
    id: eventId,
    workspaceId: normalized.workspaceId,
    title: normalized.title,
    description: normalized.description,
    category: normalized.category,
    type: normalized.type,
    importance: normalized.importance,
    status: normalized.status,
    source: normalized.source,
    createdAt: normalized.createdAt,
    occurredAt: normalized.occurredAt,
    createdBy: normalized.createdBy,
    tags: normalized.tags,
    metadata: normalized.metadata,
    contractVersion: BUSINESS_TIMELINE_PLATFORM_CONTRACT_VERSION,
    revisionVersion: 1,
    archived: normalized.status === "archived",
    readOnly: true as const,
  });
}

export function createBusinessEvent(input: CreateBusinessEventInput): BusinessEventResult<BusinessEngineEvent> {
  const readiness = assertEngineReady<BusinessEngineEvent>();
  if (readiness) {
    return readiness;
  }

  const normalized = normalizeBusinessEvent(input);
  const validation = validateBusinessEventInput(normalized, { checkDuplicate: Boolean(normalized.id) });
  if (!validation.valid) {
    return validationFailureResult(validation, "Event creation");
  }

  const eventId =
    normalized.id ??
    generateBusinessEventId(normalized.workspaceId, allocateBusinessEventSequenceNumber(normalized.workspaceId));

  const event = buildEngineEvent(normalized, eventId);
  const eventValidation = validateBusinessEngineEvent(event);
  if (!eventValidation.valid) {
    return validationFailureResult(eventValidation, "Event creation");
  }

  return registerBusinessEvent(event);
}

export { normalizeBusinessEvent };
export { validateBusinessEventInput };
export { registerBusinessEvent, getBusinessEventById, getBusinessEventsByWorkspace, getBusinessEventRevisionHistory };
export { filterBusinessEvents };
export { updateBusinessEventMetadata, archiveBusinessEvent };
export { runBusinessEventEngineCertification } from "./businessEventEngineRunner.ts";

export const BUSINESS_EVENT_ENGINE_VERSION = BUSINESS_EVENT_ENGINE_CONTRACT_VERSION;
export const BUSINESS_EVENT_ENGINE_OWNER = "business-event-engine";

export const BusinessEventEngine = Object.freeze({
  initializeBusinessEventEngine,
  isBusinessEventEngineInitialized,
  getBusinessEventEngineState,
  createBusinessEvent,
  normalizeBusinessEvent,
  validateBusinessEventInput,
  registerBusinessEvent,
  getBusinessEventById,
  getBusinessEventsByWorkspace,
  filterBusinessEvents,
  updateBusinessEventMetadata,
  archiveBusinessEvent,
  version: BUSINESS_EVENT_ENGINE_CONTRACT_VERSION,
  mandatoryFields: BUSINESS_EVENT_ENGINE_MANDATORY_FIELDS,
  tags: BUSINESS_EVENT_ENGINE_TAGS,
  mustNotOwn: BUSINESS_TIMELINE_MUST_NOT_OWN,
});

export { BUSINESS_EVENT_ENGINE_MANDATORY_FIELDS, BUSINESS_EVENT_ENGINE_TAGS };
