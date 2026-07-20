/**
 * NEA-6:1 — Message Normalization Contracts.
 *
 * Immutable contract, context, attachment, and result declarations
 * for Message Normalization Foundation. Declarations only. No runtime
 * normalization.
 *
 * Ownership: owned exclusively by NEA-6:1.
 */

import type {
  MessageNormalizationAttachmentKindDeclaration,
  MessageNormalizationAttachmentKindId,
  MessageNormalizationContextDimensionDeclaration,
  MessageNormalizationContextDimensionId,
  MessageNormalizationContractDeclaration,
  MessageNormalizationResultDeclaration,
  MessageNormalizationResultId,
} from "./messageNormalizationFoundationTypes.ts";

const contract = (
  key: string,
  contractName: string,
  description: string,
  fields: readonly string[],
  order: number,
  isCanonicalExecutiveMessage = false,
): MessageNormalizationContractDeclaration =>
  Object.freeze({
    contractId: `NEA-6:1/Contract/${key}`,
    contractName,
    description,
    fields: Object.freeze([...fields]),
    isCanonicalExecutiveMessage,
    metadataOnly: true as const,
    immutable: true as const,
    runtimeBehavior: "None" as const,
    deterministicOrder: order,
  });

/**
 * Exactly twenty message normalization foundation contracts.
 * Exactly one is the canonical Executive Message.
 * Order is deterministic and immutable.
 */
export const MessageNormalizationContracts: readonly MessageNormalizationContractDeclaration[] =
  Object.freeze([
    contract(
      "ExecutiveMessage",
      "Executive Message",
      "Canonical Executive Message contract every external interaction must normalize into before DKL — structure only, no business interpretation.",
      Object.freeze([
        "messageIdentity",
        "sender",
        "recipient",
        "timestamp",
        "channel",
        "connector",
        "workspace",
        "tenant",
        "sessionReference",
        "conversationReference",
        "payloadReference",
        "attachmentReferences",
        "correlation",
        "trace",
        "metadata",
      ]),
      1,
      true,
    ),
    contract(
      "MessageIdentity",
      "Message Identity",
      "Declarative message identity vocabulary — no identity resolution runtime.",
      Object.freeze([
        "messageId",
        "messageVersion",
        "messageType",
        "messageStatus",
      ]),
      2,
    ),
    contract(
      "Sender",
      "Sender",
      "Declarative sender contract — no authentication.",
      Object.freeze([
        "senderIdentity",
        "senderKind",
        "senderDisplayName",
      ]),
      3,
    ),
    contract(
      "Recipient",
      "Recipient",
      "Declarative recipient contract — no delivery execution.",
      Object.freeze([
        "recipientIdentity",
        "recipientKind",
        "recipientDisplayName",
      ]),
      4,
    ),
    contract(
      "ConversationReference",
      "Conversation Reference",
      "Opaque conversation reference only — no conversation management.",
      Object.freeze([
        "conversationRefId",
        "conversationKind",
        "managesConversation",
      ]),
      5,
    ),
    contract(
      "SessionReference",
      "Session Reference",
      "Opaque session reference only — no runtime sessions.",
      Object.freeze([
        "sessionRefId",
        "sessionKind",
        "managesSession",
      ]),
      6,
    ),
    contract(
      "WorkspaceContext",
      "Workspace Context",
      "Immutable workspace context reference — no workspace lookup runtime.",
      Object.freeze([
        "workspaceContextId",
        "workspaceRef",
        "resolvesAtRuntime",
      ]),
      7,
    ),
    contract(
      "TenantContext",
      "Tenant Context",
      "Immutable tenant context reference — no tenant resolution runtime.",
      Object.freeze([
        "tenantContextId",
        "tenantRef",
        "resolvesAtRuntime",
      ]),
      8,
    ),
    contract(
      "ChannelContext",
      "Channel Context",
      "Immutable channel context reference — no channel execution.",
      Object.freeze([
        "channelContextId",
        "channelRef",
        "resolvesAtRuntime",
      ]),
      9,
    ),
    contract(
      "ConnectorContext",
      "Connector Context",
      "Immutable connector context reference — no connector runtime.",
      Object.freeze([
        "connectorContextId",
        "connectorRef",
        "resolvesAtRuntime",
      ]),
      10,
    ),
    contract(
      "Attachments",
      "Attachments",
      "Attachment references only — no file storage.",
      Object.freeze([
        "attachmentRefId",
        "attachmentKind",
        "attachmentUriRef",
        "storesFiles",
      ]),
      11,
    ),
    contract(
      "Metadata",
      "Metadata",
      "Immutable message metadata including source and delivery information — no metadata mutation runtime.",
      Object.freeze([
        "source",
        "receivedTime",
        "originalChannel",
        "originalConnector",
        "deliveryInformation",
      ]),
      12,
    ),
    contract(
      "Correlation",
      "Correlation",
      "Declarative correlation vocabulary — no correlation runtime.",
      Object.freeze([
        "correlationId",
        "parentMessageReference",
        "rootConversationReference",
      ]),
      13,
    ),
    contract(
      "Trace",
      "Trace",
      "Immutable tracing metadata — no distributed tracing runtime.",
      Object.freeze([
        "traceId",
        "spanRef",
        "traceMetadata",
        "tracesAtRuntime",
      ]),
      14,
    ),
    contract(
      "DeliveryMetadata",
      "Delivery Metadata",
      "Declarative delivery metadata — no delivery execution.",
      Object.freeze([
        "deliveryStatus",
        "deliveryTime",
        "deliveryChannel",
      ]),
      15,
    ),
    contract(
      "NormalizationResult",
      "Normalization Result",
      "Declarative normalization result vocabulary — no runtime processing.",
      Object.freeze([
        "resultId",
        "resultStatus",
        "resultReason",
        "processesAtRuntime",
      ]),
      16,
    ),
    contract(
      "NormalizationLifecycle",
      "Normalization Lifecycle",
      "Declarative normalization lifecycle vocabulary — no state machine runtime.",
      Object.freeze([
        "lifecycleId",
        "lifecycleState",
        "initialState",
        "terminalState",
        "stateMachine",
      ]),
      17,
    ),
    contract(
      "Capabilities",
      "Capabilities",
      "Declarative capability vocabulary for message normalization architecture.",
      Object.freeze([
        "capabilityId",
        "capabilityName",
        "description",
        "executesRuntime",
      ]),
      18,
    ),
    contract(
      "Ownership",
      "Ownership",
      "Declarative ownership boundary vocabulary for message normalization architecture.",
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

const contextDimension = (
  dimensionId: MessageNormalizationContextDimensionId,
  dimensionName: string,
  description: string,
  order: number,
): MessageNormalizationContextDimensionDeclaration =>
  Object.freeze({
    dimensionId,
    dimensionName,
    description,
    resolvesAtRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical context dimensions — exactly seven. Architecture only. */
export const MessageNormalizationContextDimensions: readonly MessageNormalizationContextDimensionDeclaration[] =
  Object.freeze([
    contextDimension(
      "Tenant",
      "Tenant",
      "Declarative tenant context dimension — no tenant resolution runtime.",
      1,
    ),
    contextDimension(
      "Workspace",
      "Workspace",
      "Declarative workspace context dimension — no workspace lookup runtime.",
      2,
    ),
    contextDimension(
      "Channel",
      "Channel",
      "Declarative channel context dimension — no channel execution.",
      3,
    ),
    contextDimension(
      "Connector",
      "Connector",
      "Declarative connector context dimension — no connector runtime.",
      4,
    ),
    contextDimension(
      "Locale",
      "Locale",
      "Declarative locale context dimension — no locale resolution runtime.",
      5,
    ),
    contextDimension(
      "Organization",
      "Organization",
      "Declarative organization context dimension — no organization lookup runtime.",
      6,
    ),
    contextDimension(
      "Timezone",
      "Timezone",
      "Declarative timezone context dimension — no timezone conversion runtime.",
      7,
    ),
  ]);

const attachmentKind = (
  attachmentKindId: MessageNormalizationAttachmentKindId,
  attachmentKindName: string,
  description: string,
  order: number,
): MessageNormalizationAttachmentKindDeclaration =>
  Object.freeze({
    attachmentKindId,
    attachmentKindName,
    description,
    storesFiles: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical attachment kinds — exactly six. References only. */
export const MessageNormalizationAttachmentKinds: readonly MessageNormalizationAttachmentKindDeclaration[] =
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
      "Video",
      "Video",
      "Declarative video attachment reference — no video storage.",
      3,
    ),
    attachmentKind(
      "Audio",
      "Audio",
      "Declarative audio attachment reference — no audio storage.",
      4,
    ),
    attachmentKind(
      "Document",
      "Document",
      "Declarative document attachment reference — no document storage.",
      5,
    ),
    attachmentKind(
      "Link",
      "Link",
      "Declarative link attachment reference — no link fetching.",
      6,
    ),
  ]);

const result = (
  resultId: MessageNormalizationResultId,
  resultName: string,
  description: string,
  order: number,
): MessageNormalizationResultDeclaration =>
  Object.freeze({
    resultId,
    resultName,
    description,
    processesAtRuntime: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical normalization results — exactly three. Architecture only. */
export const MessageNormalizationResults: readonly MessageNormalizationResultDeclaration[] =
  Object.freeze([
    result(
      "Success",
      "Success",
      "Declarative success result — no success processing runtime.",
      1,
    ),
    result(
      "Warning",
      "Warning",
      "Declarative warning result — no warning handling runtime.",
      2,
    ),
    result(
      "Failed",
      "Failed",
      "Declarative failed result — no failure handling runtime.",
      3,
    ),
  ]);

const CANONICAL_EXECUTIVE_MESSAGE_CONTRACTS =
  MessageNormalizationContracts.filter(
    (item) => item.isCanonicalExecutiveMessage,
  );

/** Canonical immutable contract catalog. */
export const MessageNormalizationContractCatalog = Object.freeze({
  catalogId: "NEA-6:1/ContractCatalog",
  sourcePhase: "NEA-6:1" as const,
  contracts: MessageNormalizationContracts,
  contractCount: MessageNormalizationContracts.length,
  canonicalExecutiveMessageContracts: Object.freeze([
    ...CANONICAL_EXECUTIVE_MESSAGE_CONTRACTS,
  ]),
  canonicalExecutiveMessageCount: CANONICAL_EXECUTIVE_MESSAGE_CONTRACTS.length,
  contextDimensions: MessageNormalizationContextDimensions,
  contextDimensionCount: MessageNormalizationContextDimensions.length,
  attachmentKinds: MessageNormalizationAttachmentKinds,
  attachmentKindCount: MessageNormalizationAttachmentKinds.length,
  results: MessageNormalizationResults,
  resultCount: MessageNormalizationResults.length,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
