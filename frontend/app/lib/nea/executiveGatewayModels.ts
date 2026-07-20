/**
 * NEA-1:3 — Executive Gateway Domain Models.
 *
 * Immutable domain model kind declarations composed from Registry references.
 * Strongly typed structure only. No business logic. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-1:3.
 */

import {
  ExecutiveGatewayRegistryId,
  ExecutiveGatewayRegistryPlatform,
} from "./executiveGatewayRegistry.ts";
import type { ExecutiveGatewayModelKindDescriptor } from "./executiveGatewayModelTypes.ts";

const registry = ExecutiveGatewayRegistryPlatform;

const kind = (
  modelKind: ExecutiveGatewayModelKindDescriptor["modelKind"],
  modelName: string,
  description: string,
  registryCollections: ExecutiveGatewayModelKindDescriptor["registryCollections"],
  fieldCount: number,
  composesModels: ExecutiveGatewayModelKindDescriptor["composesModels"],
  order: number,
): ExecutiveGatewayModelKindDescriptor =>
  Object.freeze({
    modelKind,
    modelName,
    description,
    registryCollections: Object.freeze([...registryCollections]),
    fieldCount,
    composesModels: Object.freeze([...composesModels]),
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly twenty Executive Gateway domain model kinds.
 * Registry collections are referenced, never duplicated.
 */
export const ExecutiveGatewayDomainModels: readonly ExecutiveGatewayModelKindDescriptor[] =
  Object.freeze([
    kind(
      "GatewayIdentity",
      "Gateway Identity Model",
      "Immutable gateway identity structure.",
      Object.freeze([]),
      4,
      Object.freeze([]),
      1,
    ),
    kind(
      "GatewaySender",
      "Gateway Sender Model",
      "Sender identity using Registry sender kinds.",
      Object.freeze(["senders"]),
      5,
      Object.freeze([]),
      2,
    ),
    kind(
      "GatewayTenant",
      "Gateway Tenant Model",
      "Tenant reference structure without discovery.",
      Object.freeze([]),
      5,
      Object.freeze([]),
      3,
    ),
    kind(
      "GatewayWorkspace",
      "Gateway Workspace Model",
      "Workspace reference structure without membership resolution.",
      Object.freeze([]),
      4,
      Object.freeze([]),
      4,
    ),
    kind(
      "GatewayContext",
      "Gateway Context Model",
      "Tenant, workspace, locale, timezone, environment, and organization context.",
      Object.freeze([]),
      6,
      Object.freeze(["GatewayTenant", "GatewayWorkspace"]),
      5,
    ),
    kind(
      "GatewaySession",
      "Gateway Session Model",
      "Gateway session with correlation and trace references.",
      Object.freeze([]),
      4,
      Object.freeze([]),
      6,
    ),
    kind(
      "GatewayConversation",
      "Gateway Conversation Model",
      "Conversation metadata bound to a session.",
      Object.freeze([]),
      3,
      Object.freeze(["GatewaySession"]),
      7,
    ),
    kind(
      "GatewayAuthentication",
      "Gateway Authentication Model",
      "Authentication metadata using Registry authentication methods.",
      Object.freeze(["authenticationMethods"]),
      6,
      Object.freeze([]),
      8,
    ),
    kind(
      "GatewayAuthorization",
      "Gateway Authorization Model",
      "Authorization metadata using Registry authorization statuses.",
      Object.freeze(["authorizationStatuses"]),
      6,
      Object.freeze([]),
      9,
    ),
    kind(
      "GatewayTrust",
      "Gateway Trust Model",
      "Trust metadata using Registry trust levels.",
      Object.freeze(["trustLevels"]),
      5,
      Object.freeze([]),
      10,
    ),
    kind(
      "GatewayConsent",
      "Gateway Consent Model",
      "Consent metadata using Registry consent statuses.",
      Object.freeze(["consentStatuses"]),
      4,
      Object.freeze([]),
      11,
    ),
    kind(
      "GatewayPayload",
      "Gateway Payload Model",
      "Normalized payload metadata without business interpretation.",
      Object.freeze([]),
      4,
      Object.freeze([]),
      12,
    ),
    kind(
      "GatewayAttachment",
      "Gateway Attachment Model",
      "Attachment reference metadata only.",
      Object.freeze([]),
      4,
      Object.freeze([]),
      13,
    ),
    kind(
      "GatewayMetadata",
      "Gateway Metadata Model",
      "Shared gateway metadata across models.",
      Object.freeze([]),
      2,
      Object.freeze([]),
      14,
    ),
    kind(
      "GatewayRequest",
      "Gateway Request Model",
      "Normalized gateway request composing sender, context, security, and payload models.",
      Object.freeze(["sourceFamilies", "channels", "modalities", "senders"]),
      18,
      Object.freeze([
        "GatewayIdentity",
        "GatewaySender",
        "GatewayContext",
        "GatewaySession",
        "GatewayConversation",
        "GatewayPayload",
        "GatewayAttachment",
        "GatewayAuthentication",
        "GatewayAuthorization",
        "GatewayTrust",
        "GatewayConsent",
        "GatewayMetadata",
      ]),
      15,
    ),
    kind(
      "GatewayRouting",
      "Gateway Routing Model",
      "Routing declaration using Registry routing destinations.",
      Object.freeze(["routingDestinations"]),
      5,
      Object.freeze([]),
      16,
    ),
    kind(
      "GatewayValidation",
      "Gateway Validation Model",
      "Validation outcome using Registry validation statuses.",
      Object.freeze(["validationStatuses"]),
      5,
      Object.freeze([]),
      17,
    ),
    kind(
      "GatewayDiagnostic",
      "Gateway Diagnostic Model",
      "Gateway diagnostic using Registry diagnostic categories.",
      Object.freeze(["diagnosticCategories"]),
      6,
      Object.freeze([]),
      18,
    ),
    kind(
      "GatewayProcessingResult",
      "Gateway Processing Result Model",
      "Immutable processing outcome referencing Registry lifecycle states.",
      Object.freeze(["lifecycleStates"]),
      5,
      Object.freeze([]),
      19,
    ),
    kind(
      "GatewayResponse",
      "Gateway Response Model",
      "Gateway processing result composing routing, validation, and diagnostics.",
      Object.freeze([
        "routingDestinations",
        "validationStatuses",
        "diagnosticCategories",
        "lifecycleStates",
      ]),
      10,
      Object.freeze([
        "GatewayProcessingResult",
        "GatewayRouting",
        "GatewayValidation",
        "GatewayDiagnostic",
      ]),
      20,
    ),
  ]);

/** Verify Registry collections exist for every referenced collection name. */
const registryCollectionKeys = Object.freeze([
  "sourceFamilies",
  "channels",
  "modalities",
  "senders",
  "authenticationMethods",
  "authorizationStatuses",
  "trustLevels",
  "consentStatuses",
  "validationStatuses",
  "routingDestinations",
  "lifecycleStates",
  "diagnosticCategories",
] as const);

export const ExecutiveGatewayModelRegistryAnchors = Object.freeze({
  registryId: ExecutiveGatewayRegistryId,
  sourcePhase: "NEA-1:3" as const,
  availableCollections: registryCollectionKeys,
  sourceFamilyCount: registry.collections.sourceFamilies.length,
  channelCount: registry.collections.channels.length,
  modalityCount: registry.collections.modalities.length,
  senderCount: registry.collections.senders.length,
  authenticationMethodCount:
    registry.collections.authenticationMethods.length,
  authorizationStatusCount:
    registry.collections.authorizationStatuses.length,
  trustLevelCount: registry.collections.trustLevels.length,
  consentStatusCount: registry.collections.consentStatuses.length,
  validationStatusCount: registry.collections.validationStatuses.length,
  routingDestinationCount: registry.collections.routingDestinations.length,
  lifecycleStateCount: registry.collections.lifecycleStates.length,
  diagnosticCategoryCount: registry.collections.diagnosticCategories.length,
  capabilityCount: registry.capabilities.capabilityCount,
  policyCount: registry.policies.policyCount,
  duplicatesRegistryValues: false as const,
  preservesCanonicalReferences: true as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/** Canonical immutable domain model catalog. */
export const ExecutiveGatewayDomainModelCatalog = Object.freeze({
  catalogId: "NEA-1:3/DomainModelCatalog",
  sourcePhase: "NEA-1:3" as const,
  models: ExecutiveGatewayDomainModels,
  modelCount: ExecutiveGatewayDomainModels.length,
  registryAnchors: ExecutiveGatewayModelRegistryAnchors,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
