/**
 * NEA-7:1 — Intake Orchestration Contracts.
 *
 * Immutable contract, reference, attachment, and result declarations
 * for Intake Orchestration Foundation. Declarations only. No runtime
 * orchestration.
 *
 * Ownership: owned exclusively by NEA-7:1.
 */

import type {
  IntakeOrchestrationAttachmentKindDeclaration,
  IntakeOrchestrationAttachmentKindId,
  IntakeOrchestrationContractDeclaration,
  IntakeOrchestrationReferenceGroupDeclaration,
  IntakeOrchestrationReferenceGroupId,
  IntakeOrchestrationResultDeclaration,
  IntakeOrchestrationResultId,
} from "./intakeOrchestrationFoundationTypes.ts";

const contract = (
  key: string,
  contractName: string,
  description: string,
  fields: readonly string[],
  order: number,
  isCanonicalExecutiveIntakePackage = false,
): IntakeOrchestrationContractDeclaration =>
  Object.freeze({
    contractId: `NEA-7:1/Contract/${key}`,
    contractName,
    description,
    fields: Object.freeze([...fields]),
    isCanonicalExecutiveIntakePackage,
    metadataOnly: true as const,
    immutable: true as const,
    runtimeBehavior: "None" as const,
    deterministicOrder: order,
  });

/**
 * Exactly twenty intake orchestration foundation contracts.
 * Exactly one is the canonical Executive Intake Package.
 * Order is deterministic and immutable.
 */
export const IntakeOrchestrationContracts: readonly IntakeOrchestrationContractDeclaration[] =
  Object.freeze([
    contract(
      "ExecutiveIntakePackage",
      "Executive Intake Package",
      "Canonical Executive Intake Package — the sole architectural handoff contract to DKL. References prior NEA outputs only; never duplicates their contents.",
      Object.freeze([
        "intakeIdentity",
        "intakeMetadata",
        "intakeContext",
        "intakeSource",
        "messageReference",
        "sessionReference",
        "conversationReference",
        "authenticationReference",
        "routingReference",
        "connectorReference",
        "workspaceReference",
        "tenantReference",
        "correlationReference",
        "traceReference",
        "attachmentReferences",
        "intakeResult",
        "lifecycle",
        "ownership",
        "boundaries",
      ]),
      1,
      true,
    ),
    contract(
      "IntakeIdentity",
      "Intake Identity",
      "Declarative intake identity vocabulary — no identity resolution runtime.",
      Object.freeze([
        "intakeId",
        "intakeVersion",
        "intakeKind",
        "intakeStatus",
      ]),
      2,
    ),
    contract(
      "IntakeMetadata",
      "Intake Metadata",
      "Immutable intake metadata — no metadata mutation runtime.",
      Object.freeze([
        "sourcePhase",
        "assembledAt",
        "architectureVersion",
        "completeness",
      ]),
      3,
    ),
    contract(
      "IntakeContext",
      "Intake Context",
      "Declarative intake context — no context resolution runtime.",
      Object.freeze([
        "contextId",
        "workspaceRef",
        "tenantRef",
        "channelRef",
      ]),
      4,
    ),
    contract(
      "IntakeSource",
      "Intake Source",
      "Declarative intake source — no channel or connector execution.",
      Object.freeze([
        "sourceId",
        "sourceKind",
        "originPhase",
        "originPublicIndex",
      ]),
      5,
    ),
    contract(
      "MessageReference",
      "Message Reference",
      "Opaque message reference to NEA-6 normalized output — no message duplication.",
      Object.freeze([
        "messageRefId",
        "messageKind",
        "duplicatesMessageContent",
      ]),
      6,
    ),
    contract(
      "SessionReference",
      "Session Reference",
      "Opaque session reference to NEA-3 — no session management.",
      Object.freeze([
        "sessionRefId",
        "sessionKind",
        "managesSession",
      ]),
      7,
    ),
    contract(
      "ConversationReference",
      "Conversation Reference",
      "Opaque conversation reference to NEA-3 — no conversation management.",
      Object.freeze([
        "conversationRefId",
        "conversationKind",
        "managesConversation",
      ]),
      8,
    ),
    contract(
      "AuthenticationReference",
      "Authentication Reference",
      "Opaque authentication reference to NEA-4 — no authentication execution.",
      Object.freeze([
        "authenticationRefId",
        "identityKind",
        "executesAuthentication",
      ]),
      9,
    ),
    contract(
      "RoutingReference",
      "Routing Reference",
      "Opaque routing reference to NEA-5 — no routing execution.",
      Object.freeze([
        "routingRefId",
        "routeKind",
        "executesRouting",
      ]),
      10,
    ),
    contract(
      "ConnectorReference",
      "Connector Reference",
      "Opaque connector reference to NEA-2 — no connector runtime.",
      Object.freeze([
        "connectorRefId",
        "connectorKind",
        "executesConnector",
      ]),
      11,
    ),
    contract(
      "WorkspaceReference",
      "Workspace Reference",
      "Opaque workspace reference — no workspace lookup runtime.",
      Object.freeze([
        "workspaceRefId",
        "workspaceKind",
        "resolvesAtRuntime",
      ]),
      12,
    ),
    contract(
      "TenantReference",
      "Tenant Reference",
      "Opaque tenant reference — no tenant resolution runtime.",
      Object.freeze([
        "tenantRefId",
        "tenantKind",
        "resolvesAtRuntime",
      ]),
      13,
    ),
    contract(
      "CorrelationReference",
      "Correlation Reference",
      "Declarative correlation reference — no correlation runtime.",
      Object.freeze([
        "correlationRefId",
        "parentIntakeReference",
        "rootCorrelationReference",
      ]),
      14,
    ),
    contract(
      "TraceReference",
      "Trace Reference",
      "Immutable tracing reference — no distributed tracing runtime.",
      Object.freeze([
        "traceRefId",
        "spanRef",
        "tracesAtRuntime",
      ]),
      15,
    ),
    contract(
      "AttachmentReferences",
      "Attachment References",
      "Attachment references only — no file storage or fetching.",
      Object.freeze([
        "attachmentRefId",
        "attachmentKind",
        "attachmentUriRef",
        "storesFiles",
      ]),
      16,
    ),
    contract(
      "IntakeResult",
      "Intake Result",
      "Declarative intake result vocabulary — no result processing runtime.",
      Object.freeze([
        "resultId",
        "resultStatus",
        "resultReason",
        "processesAtRuntime",
      ]),
      17,
    ),
    contract(
      "Lifecycle",
      "Lifecycle",
      "Declarative intake lifecycle vocabulary — no state machine runtime.",
      Object.freeze([
        "lifecycleId",
        "lifecycleState",
        "initialState",
        "terminalState",
        "stateMachine",
      ]),
      18,
    ),
    contract(
      "Ownership",
      "Ownership",
      "Declarative ownership boundary vocabulary for intake orchestration architecture.",
      Object.freeze([
        "ownershipId",
        "owns",
        "doesNotOwn",
        "ownsCount",
        "runtimeBehavior",
      ]),
      19,
    ),
    contract(
      "Boundaries",
      "Boundaries",
      "Declarative prohibited-surface and boundary vocabulary — no enforcement.",
      Object.freeze([
        "boundariesId",
        "consumes",
        "provides",
        "prohibitedSurfaces",
        "runtimeEnforcement",
      ]),
      20,
    ),
  ]);

const referenceGroup = (
  referenceGroupId: IntakeOrchestrationReferenceGroupId,
  referenceGroupName: string,
  description: string,
  order: number,
): IntakeOrchestrationReferenceGroupDeclaration =>
  Object.freeze({
    referenceGroupId,
    referenceGroupName,
    description,
    resolvesAtRuntime: false as const,
    duplicatesUpstreamContent: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical reference groups — exactly ten. Architecture only. */
export const IntakeOrchestrationReferenceGroups: readonly IntakeOrchestrationReferenceGroupDeclaration[] =
  Object.freeze([
    referenceGroup(
      "MessageReference",
      "Message Reference",
      "Declarative message reference group — no message content duplication.",
      1,
    ),
    referenceGroup(
      "SessionReference",
      "Session Reference",
      "Declarative session reference group — no session runtime.",
      2,
    ),
    referenceGroup(
      "ConversationReference",
      "Conversation Reference",
      "Declarative conversation reference group — no conversation runtime.",
      3,
    ),
    referenceGroup(
      "AuthenticationReference",
      "Authentication Reference",
      "Declarative authentication reference group — no authentication execution.",
      4,
    ),
    referenceGroup(
      "RoutingReference",
      "Routing Reference",
      "Declarative routing reference group — no routing execution.",
      5,
    ),
    referenceGroup(
      "ConnectorReference",
      "Connector Reference",
      "Declarative connector reference group — no connector runtime.",
      6,
    ),
    referenceGroup(
      "WorkspaceReference",
      "Workspace Reference",
      "Declarative workspace reference group — no workspace lookup runtime.",
      7,
    ),
    referenceGroup(
      "TenantReference",
      "Tenant Reference",
      "Declarative tenant reference group — no tenant resolution runtime.",
      8,
    ),
    referenceGroup(
      "CorrelationReference",
      "Correlation Reference",
      "Declarative correlation reference group — no correlation runtime.",
      9,
    ),
    referenceGroup(
      "TraceReference",
      "Trace Reference",
      "Declarative trace reference group — no tracing runtime.",
      10,
    ),
  ]);

const attachmentKind = (
  attachmentKindId: IntakeOrchestrationAttachmentKindId,
  attachmentKindName: string,
  description: string,
  order: number,
): IntakeOrchestrationAttachmentKindDeclaration =>
  Object.freeze({
    attachmentKindId,
    attachmentKindName,
    description,
    storesFiles: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical attachment kinds — exactly four. References only. */
export const IntakeOrchestrationAttachmentKinds: readonly IntakeOrchestrationAttachmentKindDeclaration[] =
  Object.freeze([
    attachmentKind(
      "File",
      "File",
      "Declarative file attachment reference — no file storage.",
      1,
    ),
    attachmentKind(
      "Image",
      "Image",
      "Declarative image attachment reference — no image storage.",
      2,
    ),
    attachmentKind(
      "Document",
      "Document",
      "Declarative document attachment reference — no document storage.",
      3,
    ),
    attachmentKind(
      "Link",
      "Link",
      "Declarative link attachment reference — no link fetching.",
      4,
    ),
  ]);

const result = (
  resultId: IntakeOrchestrationResultId,
  resultName: string,
  description: string,
  order: number,
): IntakeOrchestrationResultDeclaration =>
  Object.freeze({
    resultId,
    resultName,
    description,
    processesAtRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical intake results — exactly three. Architecture only. */
export const IntakeOrchestrationResults: readonly IntakeOrchestrationResultDeclaration[] =
  Object.freeze([
    result(
      "Complete",
      "Complete",
      "Declarative complete intake result — no completion processing runtime.",
      1,
    ),
    result(
      "Incomplete",
      "Incomplete",
      "Declarative incomplete intake result — no incomplete handling runtime.",
      2,
    ),
    result(
      "Failed",
      "Failed",
      "Declarative failed intake result — no failure handling runtime.",
      3,
    ),
  ]);

const CANONICAL_EXECUTIVE_INTAKE_PACKAGE_CONTRACTS =
  IntakeOrchestrationContracts.filter(
    (item) => item.isCanonicalExecutiveIntakePackage,
  );

/** Canonical immutable contract catalog. */
export const IntakeOrchestrationContractCatalog = Object.freeze({
  catalogId: "NEA-7:1/ContractCatalog",
  sourcePhase: "NEA-7:1" as const,
  contracts: IntakeOrchestrationContracts,
  contractCount: IntakeOrchestrationContracts.length,
  canonicalExecutiveIntakePackageContracts: Object.freeze([
    ...CANONICAL_EXECUTIVE_INTAKE_PACKAGE_CONTRACTS,
  ]),
  canonicalExecutiveIntakePackageCount:
    CANONICAL_EXECUTIVE_INTAKE_PACKAGE_CONTRACTS.length,
  referenceGroups: IntakeOrchestrationReferenceGroups,
  referenceGroupCount: IntakeOrchestrationReferenceGroups.length,
  attachmentKinds: IntakeOrchestrationAttachmentKinds,
  attachmentKindCount: IntakeOrchestrationAttachmentKinds.length,
  results: IntakeOrchestrationResults,
  resultCount: IntakeOrchestrationResults.length,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
