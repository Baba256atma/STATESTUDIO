/**
 * NEA-3:1 — Session & Conversation Foundation Types.
 *
 * Readonly contracts and closed vocabularies for Executive Session & Conversation.
 * Metadata-only. No runtime session management or message processing.
 *
 * Ownership: owned exclusively by NEA-3:1.
 */

/** Foundation status for NEA-3:1. */
export type SessionConversationFoundationStatus = "Foundation";

/** Immediate downstream readiness — Registry only. */
export type SessionConversationFoundationReadiness = "ReadyForRegistry";

/** Declarative participant role classifications — identity only. */
export type SessionConversationParticipantRole =
  | "HumanUser"
  | "Executive"
  | "ExternalUser"
  | "ApprovedAgent"
  | "InternalService"
  | "Connector"
  | "System";

/** Immutable session lifecycle states. */
export type SessionLifecycleState =
  | "Created"
  | "Active"
  | "Suspended"
  | "Closed";

/** Immutable conversation lifecycle states. */
export type ConversationLifecycleState =
  | "Started"
  | "Active"
  | "Waiting"
  | "Completed"
  | "Archived";

/** Declarative session & conversation capability identifiers. */
export type SessionConversationCapabilityId =
  | "SessionTracking"
  | "ConversationTracking"
  | "ParticipantRegistration"
  | "ContextDeclaration"
  | "CorrelationDeclaration"
  | "ConversationContinuity"
  | "MetadataManagement"
  | "SummaryDeclaration";

/** Contract declaration for a session/conversation foundation surface. */
export interface SessionConversationContractDeclaration {
  readonly contractId: string;
  readonly contractName: string;
  readonly description: string;
  readonly fields: readonly string[];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly runtimeBehavior: "None";
  readonly deterministicOrder: number;
}

/** Participant role declaration — identity only. */
export interface SessionConversationParticipantDeclaration {
  readonly participantRoleId: SessionConversationParticipantRole;
  readonly participantRoleName: string;
  readonly description: string;
  readonly managesRuntimeParticipant: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Capability declaration. */
export interface SessionConversationCapabilityDeclaration {
  readonly capabilityId: SessionConversationCapabilityId;
  readonly capabilityName: string;
  readonly description: string;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical foundation identity. */
export interface SessionConversationFoundationIdentity {
  readonly foundationId: string;
  readonly foundationName: string;
  readonly foundationVersion: string;
  readonly foundationNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-3:1";
  readonly stage: "Foundation";
  readonly sourcePhase: "NEA-3:1";
  readonly owner: string;
  readonly status: SessionConversationFoundationStatus;
  readonly readiness: SessionConversationFoundationReadiness;
  readonly description: string;
  readonly publicIndexId: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic foundation summary. */
export interface SessionConversationFoundationSummary {
  readonly foundationId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-3:1";
  readonly status: SessionConversationFoundationStatus;
  readonly readiness: SessionConversationFoundationReadiness;
  readonly publicIndexId: string;
  readonly contractCount: number;
  readonly participantRoleCount: number;
  readonly capabilityCount: number;
  readonly sessionLifecycleStateCount: number;
  readonly conversationLifecycleStateCount: number;
  readonly ownershipCount: number;
  readonly nonOwnershipCount: number;
  readonly prohibitedSurfaceCount: number;
  readonly publicExportCount: number;
  readonly sectionCount: number;
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
