/**
 * NEA-3:5 — Session & Conversation Manifest Inventory.
 *
 * Canonical architecture inventory derived exclusively through
 * NEA-3:4 Validation → Model → Registry → Foundation public platforms.
 * No hardcoded counts. No duplicated upstream collections.
 *
 * Ownership: owned exclusively by NEA-3:5.
 */

import {
  SessionConversationValidationId,
  SessionConversationValidationPlatform,
} from "./sessionConversationValidation.ts";
import type {
  SessionConversationManifestInventoryEntry,
  SessionConversationManifestPhaseReference,
} from "./sessionConversationManifestTypes.ts";

const validation = SessionConversationValidationPlatform;
const model = validation.modelPlatform;
const registry = model.registryPlatform;
const foundation = registry.foundationPlatform;

const phaseRef = (
  phaseId: string,
  phaseName: string,
  version: string,
  namespace: string,
  status: string,
  module: string,
  order: number,
): SessionConversationManifestPhaseReference =>
  Object.freeze({
    phaseId,
    phaseName,
    version,
    namespace,
    status,
    module,
    ownership: "Referenced" as const,
    reconstructsPhase: false as const,
    duplicatesInventory: false as const,
    deterministicOrder: order,
  });

/** Canonical phase references — NEA-3:1 through NEA-3:4 only. */
export const SessionConversationManifestPhaseReferences: readonly SessionConversationManifestPhaseReference[] =
  Object.freeze([
    phaseRef(
      foundation.identity.foundationId,
      foundation.identity.foundationName,
      foundation.identity.foundationVersion,
      foundation.identity.foundationNamespace,
      foundation.identity.status,
      "sessionConversationFoundation.ts",
      1,
    ),
    phaseRef(
      registry.identity.registryId,
      registry.identity.registryName,
      registry.identity.registryVersion,
      registry.identity.registryNamespace,
      registry.identity.status,
      "sessionConversationRegistry.ts",
      2,
    ),
    phaseRef(
      model.identity.modelId,
      model.identity.modelName,
      model.identity.modelVersion,
      model.identity.modelNamespace,
      model.identity.status,
      "sessionConversationModel.ts",
      3,
    ),
    phaseRef(
      validation.identity.validationId,
      validation.identity.validationName,
      validation.identity.validationVersion,
      validation.identity.validationNamespace,
      validation.identity.status,
      "sessionConversationValidation.ts",
      4,
    ),
  ]);

const inventory = (
  inventoryKey: string,
  label: string,
  count: number,
  sourcePhase: SessionConversationManifestInventoryEntry["sourcePhase"],
  order: number,
): SessionConversationManifestInventoryEntry =>
  Object.freeze({
    inventoryKey,
    label,
    count,
    sourcePhase,
    ownership: "Referenced" as const,
    hardcoded: false as const,
    reconstructed: false as const,
    deterministicOrder: order,
  });

const SESSION_CONTRACT_SUFFIXES = Object.freeze([
  "/Contract/SessionIdentity",
  "/Contract/SessionReference",
  "/Contract/SessionMetadata",
  "/Contract/SessionState",
] as const);

const CONVERSATION_CONTRACT_SUFFIXES = Object.freeze([
  "/Contract/ConversationIdentity",
  "/Contract/ConversationReference",
  "/Contract/ConversationMetadata",
  "/Contract/ConversationContext",
] as const);

const sessionContractCount = foundation.contracts.contracts.filter((item) =>
  SESSION_CONTRACT_SUFFIXES.some((suffix) => item.contractId.endsWith(suffix)),
).length;

const conversationContractCount = foundation.contracts.contracts.filter(
  (item) =>
    CONVERSATION_CONTRACT_SUFFIXES.some((suffix) =>
      item.contractId.endsWith(suffix),
    ),
).length;

/**
 * Architecture inventory — every count derived from canonical upstream collections.
 */
export const SessionConversationManifestArchitectureInventory: readonly SessionConversationManifestInventoryEntry[] =
  Object.freeze([
    inventory(
      "sessionContracts",
      "Session Contracts",
      sessionContractCount,
      "NEA-3:1",
      1,
    ),
    inventory(
      "conversationContracts",
      "Conversation Contracts",
      conversationContractCount,
      "NEA-3:1",
      2,
    ),
    inventory(
      "participantRoles",
      "Participant Roles",
      registry.collections.participantRoleCount,
      "NEA-3:2",
      3,
    ),
    inventory(
      "contextDimensions",
      "Context Dimensions",
      registry.collections.contextDimensionCount,
      "NEA-3:2",
      4,
    ),
    inventory(
      "messageReferenceTypes",
      "Message Reference Types",
      registry.collections.messageReferenceTypeCount,
      "NEA-3:2",
      5,
    ),
    inventory(
      "correlationTypes",
      "Correlation Types",
      registry.collections.correlationTypeCount,
      "NEA-3:2",
      6,
    ),
    inventory(
      "traceTypes",
      "Trace Types",
      registry.collections.traceTypeCount,
      "NEA-3:2",
      7,
    ),
    inventory(
      "sessionIdentities",
      "Session Identity Registry",
      registry.collections.sessionIdentityCount,
      "NEA-3:2",
      8,
    ),
    inventory(
      "conversationIdentities",
      "Conversation Identity Registry",
      registry.collections.conversationIdentityCount,
      "NEA-3:2",
      9,
    ),
    inventory(
      "conversationTypes",
      "Conversation Types",
      registry.collections.conversationTypeCount,
      "NEA-3:2",
      10,
    ),
    inventory(
      "sessionStates",
      "Session States",
      registry.collections.sessionStateCount,
      "NEA-3:2",
      11,
    ),
    inventory(
      "conversationStates",
      "Conversation States",
      registry.collections.conversationStateCount,
      "NEA-3:2",
      12,
    ),
    inventory(
      "capabilities",
      "Capabilities",
      registry.capabilities.capabilityCount,
      "NEA-3:2",
      13,
    ),
    inventory(
      "lifecycleEntries",
      "Lifecycle Entries",
      registry.collections.lifecycleEntryCount,
      "NEA-3:2",
      14,
    ),
    inventory(
      "domainModels",
      "Domain Models",
      model.domainModels.modelCount,
      "NEA-3:3",
      15,
    ),
    inventory(
      "modelRelationships",
      "Model Relationships",
      model.relationships.relationshipCount,
      "NEA-3:3",
      16,
    ),
    inventory(
      "validationCategories",
      "Validation Categories",
      validation.categories.length,
      "NEA-3:4",
      17,
    ),
    inventory(
      "validationRules",
      "Validation Rules",
      validation.rules.ruleCount,
      "NEA-3:4",
      18,
    ),
    inventory(
      "policies",
      "Policies",
      registry.policies.policyCount + validation.policies.policyCount,
      "NEA-3:2",
      19,
    ),
    inventory(
      "ownership",
      "Ownership",
      foundation.ownership.ownsCount +
        registry.ownership.ownsCount +
        model.ownership.ownsCount +
        validation.ownership.ownsCount,
      "NEA-3:1",
      20,
    ),
    inventory(
      "publicExports",
      "Public Exports",
      foundation.apiRegistry.length +
        registry.apiRegistry.length +
        model.apiRegistry.length +
        validation.apiRegistry.length,
      "NEA-3:1",
      21,
    ),
  ]);

/** Derived total architecture count across inventory entries. */
export const SessionConversationManifestTotalArchitectureCount =
  SessionConversationManifestArchitectureInventory.reduce(
    (total, entry) => total + entry.count,
    0,
  );

/** Canonical immutable inventory catalog. */
export const SessionConversationManifestInventoryCatalog = Object.freeze({
  catalogId: "NEA-3:5/ManifestInventory",
  sourcePhase: "NEA-3:5" as const,
  validationId: SessionConversationValidationId,
  phaseReferences: SessionConversationManifestPhaseReferences,
  phaseReferenceCount: SessionConversationManifestPhaseReferences.length,
  inventory: SessionConversationManifestArchitectureInventory,
  inventoryEntryCount: SessionConversationManifestArchitectureInventory.length,
  totalArchitectureCount: SessionConversationManifestTotalArchitectureCount,
  countingRule:
    "NEA-3:5 → NEA-3:4 ValidationPlatform → Model → Registry → Foundation (canonical reference chain only)",
  hardcoded: false as const,
  reconstructed: false as const,
  duplicatesUpstreamCollections: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
