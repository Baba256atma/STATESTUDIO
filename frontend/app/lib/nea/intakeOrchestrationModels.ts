/**
 * NEA-7:3 — Intake Orchestration Domain Models.
 *
 * Immutable domain model kind declarations composed from Registry references.
 * Strongly typed structure only. No orchestration execution. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-7:3.
 */

import {
  IntakeOrchestrationRegistryId,
  IntakeOrchestrationRegistryPlatform,
} from "./intakeOrchestrationRegistry.ts";
import type {
  IntakeIdentityModel,
  IntakeOrchestrationModelKindDescriptor,
} from "./intakeOrchestrationModelTypes.ts";

const registry = IntakeOrchestrationRegistryPlatform;

const kind = (
  modelKind: IntakeOrchestrationModelKindDescriptor["modelKind"],
  modelName: string,
  description: string,
  registryCollections: IntakeOrchestrationModelKindDescriptor["registryCollections"],
  fieldCount: number,
  composesModels: IntakeOrchestrationModelKindDescriptor["composesModels"],
  order: number,
): IntakeOrchestrationModelKindDescriptor =>
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
 * Exactly twenty Intake Orchestration domain model kinds.
 * Registry collections are referenced, never duplicated.
 */
export const IntakeOrchestrationDomainModels: readonly IntakeOrchestrationModelKindDescriptor[] =
  Object.freeze([
    kind(
      "ExecutiveIntakePackage",
      "Executive Intake Package Model",
      "Canonical Executive Intake Package structure composed from Registry references.",
      Object.freeze([
        "intakeIdentities",
        "contracts",
        "referenceTypes",
        "metadataFields",
        "categories",
        "statuses",
      ]),
      19,
      Object.freeze([
        "IntakeIdentity",
        "IntakeSource",
        "IntakeContext",
        "IntakeMetadata",
        "MessageReference",
        "SessionReference",
        "ConversationReference",
        "AuthenticationReference",
        "RoutingReference",
        "ConnectorReference",
        "WorkspaceReference",
        "TenantReference",
        "CorrelationReference",
        "TraceReference",
        "AttachmentReference",
        "IntakeConfiguration",
        "IntakeDiagnostics",
        "IntakeResult",
      ]),
      1,
    ),
    kind(
      "IntakeIdentity",
      "Intake Identity Model",
      "Immutable intake identity structure projected from Registry.",
      Object.freeze(["intakeIdentities", "statuses", "categories", "priorities"]),
      5,
      Object.freeze([]),
      2,
    ),
    kind(
      "IntakeSource",
      "Intake Source Model",
      "Immutable intake source structure — no channel execution.",
      Object.freeze(["contracts", "referenceTypes"]),
      4,
      Object.freeze([]),
      3,
    ),
    kind(
      "IntakeContext",
      "Intake Context Model",
      "Immutable intake context structure — no context resolution runtime.",
      Object.freeze(["contracts", "referenceTypes"]),
      4,
      Object.freeze([]),
      4,
    ),
    kind(
      "IntakeMetadata",
      "Intake Metadata Model",
      "Immutable intake metadata structure.",
      Object.freeze(["metadataFields", "contracts"]),
      4,
      Object.freeze([]),
      5,
    ),
    kind(
      "MessageReference",
      "Message Reference Model",
      "Opaque message reference — no message content duplication.",
      Object.freeze(["referenceTypes", "contracts"]),
      3,
      Object.freeze([]),
      6,
    ),
    kind(
      "SessionReference",
      "Session Reference Model",
      "Opaque session reference — no session management.",
      Object.freeze(["referenceTypes", "contracts"]),
      3,
      Object.freeze([]),
      7,
    ),
    kind(
      "ConversationReference",
      "Conversation Reference Model",
      "Opaque conversation reference — no conversation management.",
      Object.freeze(["referenceTypes", "contracts"]),
      3,
      Object.freeze([]),
      8,
    ),
    kind(
      "AuthenticationReference",
      "Authentication Reference Model",
      "Opaque authentication reference — no authentication execution.",
      Object.freeze(["referenceTypes", "contracts"]),
      3,
      Object.freeze([]),
      9,
    ),
    kind(
      "RoutingReference",
      "Routing Reference Model",
      "Opaque routing reference — no routing execution.",
      Object.freeze(["referenceTypes", "contracts"]),
      3,
      Object.freeze([]),
      10,
    ),
    kind(
      "ConnectorReference",
      "Connector Reference Model",
      "Opaque connector reference — no connector runtime.",
      Object.freeze(["referenceTypes", "contracts"]),
      3,
      Object.freeze([]),
      11,
    ),
    kind(
      "WorkspaceReference",
      "Workspace Reference Model",
      "Opaque workspace reference — no workspace lookup runtime.",
      Object.freeze(["referenceTypes", "contracts"]),
      3,
      Object.freeze([]),
      12,
    ),
    kind(
      "TenantReference",
      "Tenant Reference Model",
      "Opaque tenant reference — no tenant resolution runtime.",
      Object.freeze(["referenceTypes", "contracts"]),
      3,
      Object.freeze([]),
      13,
    ),
    kind(
      "CorrelationReference",
      "Correlation Reference Model",
      "Declarative correlation reference — no correlation runtime.",
      Object.freeze(["referenceTypes", "contracts"]),
      3,
      Object.freeze([]),
      14,
    ),
    kind(
      "TraceReference",
      "Trace Reference Model",
      "Immutable tracing reference — no distributed tracing runtime.",
      Object.freeze(["referenceTypes", "contracts"]),
      3,
      Object.freeze([]),
      15,
    ),
    kind(
      "AttachmentReference",
      "Attachment Reference Model",
      "Attachment reference structure — no file storage.",
      Object.freeze(["referenceTypes", "contracts"]),
      4,
      Object.freeze([]),
      16,
    ),
    kind(
      "IntakeConfiguration",
      "Intake Configuration Model",
      "Declarative intake configuration structure — no runtime configuration.",
      Object.freeze(["contracts", "metadataFields"]),
      4,
      Object.freeze([]),
      17,
    ),
    kind(
      "IntakeDiagnostics",
      "Intake Diagnostics Model",
      "Declarative intake diagnostics structure — no diagnostic execution.",
      Object.freeze(["contracts", "statuses"]),
      3,
      Object.freeze([]),
      18,
    ),
    kind(
      "IntakeResult",
      "Intake Result Model",
      "Declarative intake result structure — no result processing runtime.",
      Object.freeze(["contracts", "statuses"]),
      4,
      Object.freeze([]),
      19,
    ),
    kind(
      "IntakeSummary",
      "Intake Summary Model",
      "Immutable aggregate metadata for an executive intake package.",
      Object.freeze(["intakeIdentities", "statuses", "contracts"]),
      5,
      Object.freeze(["ExecutiveIntakePackage", "IntakeResult"]),
      20,
    ),
  ]);

/**
 * Intake identity model instances derived from Registry intake identities.
 * Structure only — no runtime package assembly.
 */
export const IntakeIdentityModels: readonly IntakeIdentityModel[] =
  Object.freeze(
    registry.collections.intakeIdentities.map((item) =>
      Object.freeze({
        modelKind: "IntakeIdentity" as const,
        intakeId: item.intakeId,
        version: item.version,
        category: item.category,
        priority: item.priority,
        status: item.status,
        registryIdentityRef: item.intakeId,
        assemblesRuntimePackage: false as const,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
        deterministicOrder: item.deterministicOrder,
      }),
    ),
  );

/** Registry anchors — counts derived from Registry collections by reference. */
export const IntakeOrchestrationModelRegistryAnchors = Object.freeze({
  registryId: IntakeOrchestrationRegistryId,
  sourcePhase: "NEA-7:3" as const,
  intakeIdentityCount: registry.collections.intakeIdentityCount,
  categoryCount: registry.collections.categoryCount,
  priorityCount: registry.collections.priorityCount,
  statusCount: registry.collections.statusCount,
  referenceTypeCount: registry.collections.referenceTypeCount,
  metadataFieldCount: registry.collections.metadataFieldCount,
  contractCount: registry.collections.contractCount,
  lifecycleEntryCount: registry.collections.lifecycleEntryCount,
  capabilityCount: registry.capabilities.capabilityCount,
  registryPolicyCount: registry.policies.policyCount,
  duplicatesRegistryValues: false as const,
  preservesCanonicalReferences: true as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/** Canonical immutable domain model catalog. */
export const IntakeOrchestrationDomainModelCatalog = Object.freeze({
  catalogId: "NEA-7:3/DomainModelCatalog",
  sourcePhase: "NEA-7:3" as const,
  models: IntakeOrchestrationDomainModels,
  modelCount: IntakeOrchestrationDomainModels.length,
  intakeIdentityModels: IntakeIdentityModels,
  intakeIdentityModelCount: IntakeIdentityModels.length,
  registryAnchors: IntakeOrchestrationModelRegistryAnchors,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
