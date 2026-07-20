/**
 * NEA-7:2 — Intake Orchestration Registry Collections.
 *
 * Canonical immutable registry collections.
 * Foundation contracts and lifecycle are referenced — not duplicated.
 * Registry-owned vocabularies and intake identities are declared here.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by NEA-7:2.
 */

import {
  IntakeOrchestrationFoundationId,
  IntakeOrchestrationFoundationPlatform,
} from "./intakeOrchestrationFoundation.ts";
import type {
  IntakeCategoryId,
  IntakeIdentityDeclaration,
  IntakeIdentityId,
  IntakeMetadataFieldId,
  IntakeOrchestrationRegistryEntry,
  IntakePriorityId,
  IntakeReferenceTypeId,
  IntakeStatusId,
} from "./intakeOrchestrationRegistryTypes.ts";

const foundation = IntakeOrchestrationFoundationPlatform;

const entry = (
  id: string,
  label: string,
  description: string,
  sourcePhase: "NEA-7:1" | "NEA-7:2",
  foundationReference: string | null,
  order: number,
): IntakeOrchestrationRegistryEntry =>
  Object.freeze({
    id,
    label,
    description,
    sourcePhase,
    foundationReference,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Contract registry — Foundation canonical references preserved. */
export const IntakeContractRegistry: readonly IntakeOrchestrationRegistryEntry[] =
  Object.freeze(
    foundation.contracts.contracts.map((item) =>
      entry(
        item.contractId.split("/").at(-1) ?? item.contractId,
        item.contractName,
        item.description,
        "NEA-7:1",
        `${IntakeOrchestrationFoundationId}/contracts/${item.contractId.split("/").at(-1)}`,
        item.deterministicOrder,
      ),
    ),
  );

/** Lifecycle registry — Foundation canonical references preserved. */
export const IntakeLifecycleRegistry: readonly IntakeOrchestrationRegistryEntry[] =
  Object.freeze(
    foundation.lifecycle.states.map((state, index) =>
      entry(
        state,
        state,
        `Foundation intake lifecycle state ${state}.`,
        "NEA-7:1",
        `${IntakeOrchestrationFoundationId}/lifecycle/${state}`,
        index + 1,
      ),
    ),
  );

const intakeIdentity = (
  identityKey: IntakeIdentityId,
  category: IntakeCategoryId,
  priority: IntakePriorityId,
  statusId: IntakeStatusId,
  order: number,
): IntakeIdentityDeclaration =>
  Object.freeze({
    intakeId: `NEA-7:2/IntakeIdentity/${identityKey}`,
    version: "1.0.0" as const,
    category,
    status: statusId,
    priority,
    assemblesRuntimePackage: false as const,
    executesRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Intake identity registry — declarative identities only.
 * No executable package assembly or orchestration.
 */
export const IntakeIdentityRegistry: readonly IntakeIdentityDeclaration[] =
  Object.freeze([
    intakeIdentity("ExecutiveRequest", "Request", "High", "Registered", 1),
    intakeIdentity("ExecutiveCommand", "Command", "Critical", "Registered", 2),
    intakeIdentity("ExecutiveQuestion", "Question", "Normal", "Registered", 3),
    intakeIdentity("ExecutiveReport", "Report", "Normal", "Registered", 4),
    intakeIdentity(
      "ExecutiveNotification",
      "Notification",
      "Normal",
      "Registered",
      5,
    ),
    intakeIdentity("ExecutiveEvent", "Event", "High", "Registered", 6),
    intakeIdentity("ExecutiveWorkflow", "Workflow", "High", "Registered", 7),
    intakeIdentity("ExecutiveSystem", "System", "Low", "Registered", 8),
  ]);

const category = (
  id: IntakeCategoryId,
  description: string,
  order: number,
): IntakeOrchestrationRegistryEntry =>
  entry(id, id, description, "NEA-7:2", null, order);

/** Category registry — Registry-owned. Declarations only. */
export const IntakeCategoryRegistry: readonly IntakeOrchestrationRegistryEntry[] =
  Object.freeze([
    category("Request", "Declarative request intake category.", 1),
    category("Command", "Declarative command intake category.", 2),
    category("Question", "Declarative question intake category.", 3),
    category("Report", "Declarative report intake category.", 4),
    category("Notification", "Declarative notification intake category.", 5),
    category("Event", "Declarative event intake category.", 6),
    category("Workflow", "Declarative workflow intake category.", 7),
    category("System", "Declarative system intake category.", 8),
  ]);

const priority = (
  id: IntakePriorityId,
  description: string,
  order: number,
): IntakeOrchestrationRegistryEntry =>
  entry(id, id, description, "NEA-7:2", null, order);

/** Priority registry — Registry-owned. Declarations only. */
export const IntakePriorityRegistry: readonly IntakeOrchestrationRegistryEntry[] =
  Object.freeze([
    priority("Critical", "Declarative critical intake priority.", 1),
    priority("High", "Declarative high intake priority.", 2),
    priority("Normal", "Declarative normal intake priority.", 3),
    priority("Low", "Declarative low intake priority.", 4),
    priority("Deferred", "Declarative deferred intake priority.", 5),
  ]);

const status = (
  id: IntakeStatusId,
  description: string,
  order: number,
): IntakeOrchestrationRegistryEntry =>
  entry(id, id, description, "NEA-7:2", null, order);

/** Status registry — Registry-owned. Declarations only. */
export const IntakeStatusRegistry: readonly IntakeOrchestrationRegistryEntry[] =
  Object.freeze([
    status("Registered", "Architecture registered intake status.", 1),
    status("Pending", "Architecture pending intake status.", 2),
    status("Ready", "Architecture ready intake status.", 3),
    status("Verified", "Architecture verified intake status.", 4),
    status("Published", "Architecture published intake status.", 5),
    status("Archived", "Architecture archived intake status.", 6),
  ]);

const referenceType = (
  id: IntakeReferenceTypeId,
  description: string,
  order: number,
): IntakeOrchestrationRegistryEntry =>
  entry(id, id, description, "NEA-7:2", null, order);

/** Reference type registry — Registry-owned. Declarations only. */
export const IntakeReferenceTypeRegistry: readonly IntakeOrchestrationRegistryEntry[] =
  Object.freeze([
    referenceType("Message", "Declarative message reference type.", 1),
    referenceType("Session", "Declarative session reference type.", 2),
    referenceType(
      "Conversation",
      "Declarative conversation reference type.",
      3,
    ),
    referenceType(
      "Authentication",
      "Declarative authentication reference type.",
      4,
    ),
    referenceType("Routing", "Declarative routing reference type.", 5),
    referenceType("Connector", "Declarative connector reference type.", 6),
    referenceType("Workspace", "Declarative workspace reference type.", 7),
    referenceType("Tenant", "Declarative tenant reference type.", 8),
    referenceType("Correlation", "Declarative correlation reference type.", 9),
    referenceType("Trace", "Declarative trace reference type.", 10),
  ]);

const metadataField = (
  id: IntakeMetadataFieldId,
  description: string,
  order: number,
): IntakeOrchestrationRegistryEntry =>
  entry(id, id, description, "NEA-7:2", null, order);

/** Metadata field registry — Registry-owned. Declarations only. */
export const IntakeMetadataFieldRegistry: readonly IntakeOrchestrationRegistryEntry[] =
  Object.freeze([
    metadataField(
      "SourcePhase",
      "Canonical source phase metadata field declaration.",
      1,
    ),
    metadataField(
      "AssembledAt",
      "Canonical assembled-at metadata field declaration.",
      2,
    ),
    metadataField(
      "ArchitectureVersion",
      "Canonical architecture version metadata field declaration.",
      3,
    ),
    metadataField(
      "Completeness",
      "Canonical completeness metadata field declaration.",
      4,
    ),
    metadataField(
      "ContextId",
      "Canonical context id metadata field declaration.",
      5,
    ),
    metadataField(
      "WorkspaceRef",
      "Canonical workspace reference metadata field declaration.",
      6,
    ),
    metadataField(
      "TenantRef",
      "Canonical tenant reference metadata field declaration.",
      7,
    ),
    metadataField(
      "ChannelRef",
      "Canonical channel reference metadata field declaration.",
      8,
    ),
    metadataField(
      "OriginPhase",
      "Canonical origin phase metadata field declaration.",
      9,
    ),
    metadataField(
      "OriginPublicIndex",
      "Canonical origin public index metadata field declaration.",
      10,
    ),
  ]);

/** Aggregate collections object for platform composition. */
export const IntakeOrchestrationRegistryCollections = Object.freeze({
  collectionsId: "NEA-7:2/RegistryCollections",
  sourcePhase: "NEA-7:2" as const,
  intakeIdentities: IntakeIdentityRegistry,
  categories: IntakeCategoryRegistry,
  priorities: IntakePriorityRegistry,
  statuses: IntakeStatusRegistry,
  referenceTypes: IntakeReferenceTypeRegistry,
  metadataFields: IntakeMetadataFieldRegistry,
  contracts: IntakeContractRegistry,
  lifecycleEntries: IntakeLifecycleRegistry,
  intakeIdentityCount: IntakeIdentityRegistry.length,
  categoryCount: IntakeCategoryRegistry.length,
  priorityCount: IntakePriorityRegistry.length,
  statusCount: IntakeStatusRegistry.length,
  referenceTypeCount: IntakeReferenceTypeRegistry.length,
  metadataFieldCount: IntakeMetadataFieldRegistry.length,
  contractCount: IntakeContractRegistry.length,
  lifecycleEntryCount: IntakeLifecycleRegistry.length,
  duplicatesFoundationValues: false as const,
  reconstructsFoundation: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
