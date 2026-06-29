/**
 * APP-4:1 — Executive Memory contracts.
 * Immutable architecture vocabulary — metadata-only foundation for APP-4.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  EXECUTIVE_MEMORY_ARCHITECTURE_VERSION,
  EXECUTIVE_MEMORY_CATEGORY_KEYS,
  EXECUTIVE_MEMORY_CONTRACT_VERSION,
  EXECUTIVE_MEMORY_FUTURE_COMPATIBILITY,
  EXECUTIVE_MEMORY_FUTURE_PHASE_KEYS,
  EXECUTIVE_MEMORY_LOG_PREFIX,
  EXECUTIVE_MEMORY_MANDATORY_METADATA_FIELDS,
  EXECUTIVE_MEMORY_MUST_NOT_OWN,
  EXECUTIVE_MEMORY_PLATFORM,
  EXECUTIVE_MEMORY_RESERVED_MEMORY_IDS,
  EXECUTIVE_MEMORY_RESERVED_PROVIDER_IDS,
  EXECUTIVE_MEMORY_SOURCE,
  EXECUTIVE_MEMORY_TAGS,
} from "./executiveMemoryConstants.ts";
import type {
  ExecutiveMemory,
  ExecutiveMemoryCategory,
  ExecutiveMemoryFutureCompatibility,
  ExecutiveMemoryMetadata,
  ExecutiveMemoryPlatformIdentity,
  ExecutiveMemoryProvider,
  ExecutiveMemoryReference,
  ExecutiveMemoryTag,
} from "./executiveMemoryTypes.ts";
import {
  isExecutiveMemoryCategory,
  validateExecutiveMemoryMetadataShape,
  validateExecutiveMemoryShape,
} from "./executiveMemoryValidation.ts";

export {
  EXECUTIVE_MEMORY_ARCHITECTURE_VERSION,
  EXECUTIVE_MEMORY_CATEGORY_KEYS,
  EXECUTIVE_MEMORY_CONTRACT_VERSION,
  EXECUTIVE_MEMORY_FUTURE_COMPATIBILITY,
  EXECUTIVE_MEMORY_FUTURE_PHASE_KEYS,
  EXECUTIVE_MEMORY_LOG_PREFIX,
  EXECUTIVE_MEMORY_MANDATORY_METADATA_FIELDS,
  EXECUTIVE_MEMORY_MUST_NOT_OWN,
  EXECUTIVE_MEMORY_PLATFORM,
  EXECUTIVE_MEMORY_RESERVED_MEMORY_IDS,
  EXECUTIVE_MEMORY_RESERVED_PROVIDER_IDS,
  EXECUTIVE_MEMORY_SOURCE,
  EXECUTIVE_MEMORY_TAGS,
  isExecutiveMemoryCategory,
  validateExecutiveMemoryMetadataShape,
  validateExecutiveMemoryShape,
};

export type {
  ExecutiveMemory,
  ExecutiveMemoryCategory,
  ExecutiveMemoryFutureCompatibility,
  ExecutiveMemoryId,
  ExecutiveMemoryMetadata,
  ExecutiveMemoryPlatformIdentity,
  ExecutiveMemoryPlatformState,
  ExecutiveMemoryProvider,
  ExecutiveMemoryProviderId,
  ExecutiveMemoryProviderRegistration,
  ExecutiveMemoryReference,
  ExecutiveMemoryResult,
  ExecutiveMemoryTag,
  ExecutiveMemoryValidationResult,
  ExecutiveMemoryWorkspaceId,
} from "./executiveMemoryTypes.ts";

export const EXECUTIVE_MEMORY_IDENTITY: ExecutiveMemoryPlatformIdentity = Object.freeze({
  appId: "APP-4",
  title: "Executive Memory",
  version: EXECUTIVE_MEMORY_CONTRACT_VERSION,
  status: "build",
  certificationStatus: "pending",
  freezeState: "open",
  architectureVersion: EXECUTIVE_MEMORY_ARCHITECTURE_VERSION,
});

export const EXECUTIVE_MEMORY_FORBIDDEN_PATTERNS = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  "app-2-scenario-intelligence/",
  "executiveIntent/",
  "executive-time/",
  "dashboard/",
  "assistant/",
  "components/",
  ".tsx",
  "MemoryRetrievalEngine",
  "MemoryRankingEngine",
  "ChatMemory",
] as const);

export const EXECUTIVE_MEMORY_SELF_MANIFEST = Object.freeze({
  stageId: "APP-4/1",
  title: "Executive Memory Foundation",
  goal: "Immutable APP-4 architecture foundation — contracts, registry, validation, and certification only.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    "frontend/app/lib/executiveMemory/executiveMemoryTypes.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryConstants.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryContracts.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryValidation.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryRegistry.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryFoundation.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryPlatform.ts",
    "frontend/app/lib/executiveMemory/executiveMemoryFoundation.test.ts",
    "docs/app-4-1-executive-memory-foundation-report.md",
  ]),
  forbiddenPatterns: EXECUTIVE_MEMORY_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["APP-1", "APP-2", "APP-3", "DS", "INT"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_MEMORY_TAGS,
} satisfies StageManifest);

export const EXECUTIVE_MEMORY_FREEZE_RULES = Object.freeze({
  contractImmutable: true,
  publicInterfacesExtendOnly: true,
  breakingChangesForbidden: true,
  metadataOnly: true,
  noRuntimeExecution: true,
  notChatMemory: true,
} as const);

export const EXECUTIVE_MEMORY_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  noHiddenState: true,
  noPersistence: true,
  noRetrieval: true,
  noRanking: true,
  noStorage: true,
  noReact: true,
  noAssistantIntegration: true,
  noDashboardIntegration: true,
  metadataOnly: true,
} as const);

export function createExecutiveMemoryReferenceExample(): ExecutiveMemoryReference {
  return Object.freeze({
    referenceId: "memory-ref-example-001",
    referenceType: "intent",
    targetId: "intent-example-001",
    label: "Executive intent reference",
    module: "executive-intent",
    readOnly: true as const,
  });
}

export function createExecutiveMemoryTagExample(): ExecutiveMemoryTag {
  return Object.freeze({
    tagId: "memory-tag-example-001",
    label: "executive-knowledge",
    readOnly: true as const,
  });
}

export function resolveExecutiveMemoryMetadataExample(
  timestamp: string = "2026-01-01T00:00:00.000Z"
): ExecutiveMemoryMetadata {
  return Object.freeze({
    memoryId: "memory-example-001",
    workspaceId: "ws-memory-example-001",
    category: "decision",
    title: "Approved market expansion decision",
    summary: "Executive decision to expand into the European market next fiscal year.",
    createdAt: timestamp,
    updatedAt: timestamp,
    owner: "executive-owner",
    sourceModule: "executive-memory-foundation",
    contractVersion: EXECUTIVE_MEMORY_CONTRACT_VERSION,
    tags: Object.freeze([createExecutiveMemoryTagExample()]),
    references: Object.freeze([createExecutiveMemoryReferenceExample()]),
    customMetadata: Object.freeze({ reviewCycle: "quarterly" }),
    readOnly: true as const,
  });
}

export function resolveExecutiveMemoryExample(
  timestamp: string = "2026-01-01T00:00:00.000Z"
): ExecutiveMemory {
  const metadata = resolveExecutiveMemoryMetadataExample(timestamp);
  return Object.freeze({
    memoryId: metadata.memoryId,
    workspaceId: metadata.workspaceId,
    category: metadata.category,
    metadata,
    contractVersion: EXECUTIVE_MEMORY_CONTRACT_VERSION,
    readOnly: true as const,
  });
}

export function resolveExecutiveMemoryProviderExample(
  timestamp: string = "2026-01-01T00:00:00.000Z"
): ExecutiveMemoryProvider {
  return Object.freeze({
    providerId: "executive-memory-foundation-provider",
    label: "Executive Memory Foundation Provider",
    version: "1.0.0",
    supportedCategories: Object.freeze(["decision", "evidence", "business_context"] as const),
    metadata: Object.freeze({ owner: "executive-memory-foundation", registeredAt: timestamp }),
    registeredAt: timestamp,
    readOnly: true as const,
  });
}

export function getExecutiveMemoryContractVersionMetadata(): Readonly<{
  contractVersion: typeof EXECUTIVE_MEMORY_CONTRACT_VERSION;
  architectureVersion: typeof EXECUTIVE_MEMORY_ARCHITECTURE_VERSION;
  source: typeof EXECUTIVE_MEMORY_SOURCE;
}> {
  return Object.freeze({
    contractVersion: EXECUTIVE_MEMORY_CONTRACT_VERSION,
    architectureVersion: EXECUTIVE_MEMORY_ARCHITECTURE_VERSION,
    source: EXECUTIVE_MEMORY_SOURCE,
  });
}

export function getExecutiveMemoryFutureCompatibility(): ExecutiveMemoryFutureCompatibility {
  return EXECUTIVE_MEMORY_FUTURE_COMPATIBILITY;
}

export const ExecutiveMemoryContract = Object.freeze({
  resolveExecutiveMemoryExample,
  resolveExecutiveMemoryMetadataExample,
  resolveExecutiveMemoryProviderExample,
  validateExecutiveMemoryShape,
  validateExecutiveMemoryMetadataShape,
  getExecutiveMemoryContractVersionMetadata,
  getExecutiveMemoryFutureCompatibility,
  identity: EXECUTIVE_MEMORY_IDENTITY,
  version: EXECUTIVE_MEMORY_CONTRACT_VERSION,
  tags: EXECUTIVE_MEMORY_TAGS,
});
