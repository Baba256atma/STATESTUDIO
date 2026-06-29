/**
 * APP-11:2 — Executive Inbox Aggregation Engine.
 * Deterministic executive inbox aggregation from certified platform sources.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { EXECUTIVE_INBOX_MUST_NOT_OWN, EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION } from "./executiveInboxConstants.ts";
import { EXECUTIVE_INBOX_PLATFORM_SELF_MANIFEST } from "./executiveInboxContracts.ts";
import { isExecutiveInboxPlatformInitialized } from "./executiveInboxFoundation.ts";
import {
  EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION,
  EXECUTIVE_INBOX_AGGREGATION_ENGINE_FORBIDDEN_PATTERNS,
  EXECUTIVE_INBOX_AGGREGATION_ENGINE_PUBLIC_API_RULES,
  EXECUTIVE_INBOX_AGGREGATION_ENGINE_TAGS,
  EXECUTIVE_INBOX_AGGREGATION_MANDATORY_ITEM_FIELDS,
} from "./executiveInboxAggregationEngineConstants.ts";
import {
  aggregateExecutiveInbox as aggregateExecutiveInboxFromPipeline,
  buildExecutiveInboxItems,
} from "./executiveInboxAggregationPipeline.ts";
import {
  getInboxAggregationSnapshot,
  getInboxItem,
  getInboxItems,
  inboxItemExists,
  registerInboxItem,
  resetExecutiveInboxAggregationEngineRegistryForTests,
  unregisterInboxItem,
} from "./executiveInboxAggregationEngineRegistry.ts";
import type {
  ExecutiveInboxAggregationEngineState,
  ExecutiveInboxAggregationRequest,
  ExecutiveInboxAggregationResult,
  ExecutiveInboxItem,
  InboxAggregationEngineResult,
} from "./executiveInboxAggregationEngineTypes.ts";
import {
  validateExecutiveInboxAggregation,
  validateExecutiveInboxItem,
  validateExecutiveInboxItems,
  validateFoundationCompatibilityForEngine,
} from "./executiveInboxAggregationEngineValidation.ts";

export const EXECUTIVE_INBOX_AGGREGATION_ENGINE_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...EXECUTIVE_INBOX_AGGREGATION_ENGINE_FORBIDDEN_PATTERNS,
] as const);

export const EXECUTIVE_INBOX_AGGREGATION_ENGINE_SELF_MANIFEST = Object.freeze({
  stageId: "APP-11/2",
  title: "Executive Inbox Aggregation Engine",
  goal: "Deterministic executive inbox aggregation, source normalization, provenance, and immutable registry.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...EXECUTIVE_INBOX_PLATFORM_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/executive-inbox/executiveInboxAggregationEngineConstants.ts",
    "frontend/app/lib/executive-inbox/executiveInboxAggregationEngineTypes.ts",
    "frontend/app/lib/executive-inbox/executiveInboxAggregationEngineValidation.ts",
    "frontend/app/lib/executive-inbox/executiveInboxAggregationEngineRegistry.ts",
    "frontend/app/lib/executive-inbox/executiveInboxAggregationNormalizer.ts",
    "frontend/app/lib/executive-inbox/executiveInboxAggregationItemBuilder.ts",
    "frontend/app/lib/executive-inbox/executiveInboxAggregationPipeline.ts",
    "frontend/app/lib/executive-inbox/executiveInboxAggregationEngine.ts",
    "frontend/app/lib/executive-inbox/executiveInboxAggregationEngineRunner.ts",
    "frontend/app/lib/executive-inbox/executiveInboxAggregationEngine.test.ts",
    "docs/app-11-2-executive-inbox-aggregation-engine.md",
  ]),
  forbiddenPatterns: EXECUTIVE_INBOX_AGGREGATION_ENGINE_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-11/1"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_INBOX_AGGREGATION_ENGINE_TAGS,
} satisfies StageManifest);

let engineInitialized = false;
let engineTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeExecutiveInboxAggregation(
  timestamp: string = engineTimestamp
): ExecutiveInboxAggregationEngineState {
  engineInitialized = true;
  engineTimestamp = timestamp;
  return getExecutiveInboxAggregationEngineState(timestamp);
}

export function isExecutiveInboxAggregationInitialized(): boolean {
  return engineInitialized;
}

export function getExecutiveInboxAggregationEngineState(
  timestamp: string = engineTimestamp
): ExecutiveInboxAggregationEngineState {
  const registry = getInboxAggregationSnapshot();
  return Object.freeze({
    engineId: "executive-inbox-aggregation-engine",
    contractVersion: EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION,
    initialized: engineInitialized,
    registeredItemCount: registry.itemCount,
    timestamp,
    readOnly: true as const,
  });
}

export function resetExecutiveInboxAggregationEngineForTests(): void {
  engineInitialized = false;
  engineTimestamp = "2026-01-01T00:00:00.000Z";
  resetExecutiveInboxAggregationEngineRegistryForTests();
}

function assertEngineReady<T>(): InboxAggregationEngineResult<T> | null {
  const foundationValidation = validateFoundationCompatibilityForEngine(isExecutiveInboxPlatformInitialized());
  if (!foundationValidation.valid) {
    return Object.freeze({
      success: false,
      reason: "APP-11:1 Executive Inbox Foundation is not initialized.",
      data: null,
      error: Object.freeze({
        code: "foundation_incompatible",
        message: "Foundation not initialized.",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  if (!isExecutiveInboxAggregationInitialized()) {
    return Object.freeze({
      success: false,
      reason: "Executive Inbox Aggregation Engine is not initialized.",
      data: null,
      error: Object.freeze({
        code: "engine_not_initialized",
        message: "Engine not initialized.",
        readOnly: true as const,
      }),
      readOnly: true as const,
    });
  }
  return null;
}

export function aggregateExecutiveInboxWithEngine(
  request: ExecutiveInboxAggregationRequest
): ExecutiveInboxAggregationResult {
  const blocked = assertEngineReady<ExecutiveInboxAggregationResult>();
  if (blocked) {
    const timestamp = request.aggregationTimestamp ?? engineTimestamp;
    return Object.freeze({
      success: false,
      reason: blocked.reason,
      workspaceId: request.workspaceId,
      session: Object.freeze({
        sessionId: request.sessionId,
        workspaceId: request.workspaceId,
        label: request.sessionLabel,
        sourceTypes: Object.freeze([]),
        aggregationTimestamp: timestamp,
        engineVersion: EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION,
        readOnly: true as const,
      }),
      aggregate: Object.freeze({
        aggregateId: `inbox-aggregate-${request.workspaceId}-${timestamp}`,
        workspaceId: request.workspaceId,
        sessionId: request.sessionId,
        items: Object.freeze([]),
        itemCount: 0,
        aggregationTimestamp: timestamp,
        readOnly: true as const,
      }),
      aggregatedItems: Object.freeze([]),
      registeredItemIds: Object.freeze([]),
      skippedRecords: 0,
      pipelineStages: Object.freeze([]),
      aggregationTimestamp: timestamp,
      readOnly: true as const,
    });
  }
  return aggregateExecutiveInboxFromPipeline(request);
}

export { aggregateExecutiveInboxWithEngine as aggregateExecutiveInbox, buildExecutiveInboxItems, validateExecutiveInboxAggregation };
export {
  registerInboxItem,
  unregisterInboxItem,
  getInboxItem,
  getInboxItems,
  inboxItemExists,
  getInboxAggregationSnapshot,
};
export { validateExecutiveInboxItem, validateExecutiveInboxItems };
export { runExecutiveInboxAggregationCertification } from "./executiveInboxAggregationEngineRunner.ts";

export const EXECUTIVE_INBOX_AGGREGATION_ENGINE_VERSION = EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION;

export const ExecutiveInboxAggregationEngine = Object.freeze({
  initializeExecutiveInboxAggregation,
  isExecutiveInboxAggregationInitialized,
  getExecutiveInboxAggregationEngineState,
  aggregateExecutiveInbox: aggregateExecutiveInboxWithEngine,
  buildExecutiveInboxItems,
  validateExecutiveInboxAggregation,
  registerInboxItem,
  getInboxItems,
  getInboxItem,
  inboxItemExists,
  resetExecutiveInboxAggregationEngineForTests,
  version: EXECUTIVE_INBOX_AGGREGATION_ENGINE_CONTRACT_VERSION,
  foundationVersion: EXECUTIVE_INBOX_PLATFORM_CONTRACT_VERSION,
  mandatoryFields: EXECUTIVE_INBOX_AGGREGATION_MANDATORY_ITEM_FIELDS,
  tags: EXECUTIVE_INBOX_AGGREGATION_ENGINE_TAGS,
  publicApiRules: EXECUTIVE_INBOX_AGGREGATION_ENGINE_PUBLIC_API_RULES,
  mustNotOwn: EXECUTIVE_INBOX_MUST_NOT_OWN,
});
