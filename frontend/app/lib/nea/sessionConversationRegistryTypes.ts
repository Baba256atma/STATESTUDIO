/**
 * NEA-3:2 — Session & Conversation Registry Types.
 *
 * Readonly contracts and closed vocabularies for the Session & Conversation Registry.
 * Metadata-only. No runtime enforcement.
 *
 * Ownership: owned exclusively by NEA-3:2.
 */

/** Registry status for NEA-3:2. */
export type SessionConversationRegistryStatus = "Registry";

/** Immediate downstream readiness — Model only. */
export type SessionConversationRegistryReadiness = "ReadyForModel";

/** Registry-owned conversation type identifiers. */
export type SessionConversationTypeId =
  | "ExecutiveConversation"
  | "AdvisoryConversation"
  | "OperationalConversation"
  | "SupportConversation"
  | "NotificationConversation"
  | "SystemConversation"
  | "ExternalConversation"
  | "InternalConversation";

/** Registry-owned message reference type identifiers. */
export type SessionConversationMessageReferenceTypeId =
  | "Root"
  | "Parent"
  | "Reply"
  | "Forward"
  | "Reference"
  | "System";

/** Registry-owned correlation type identifiers. */
export type SessionConversationCorrelationTypeId =
  | "CorrelationId"
  | "TraceId"
  | "ConversationGroup"
  | "SessionGroup";

/** Registry-owned trace type identifiers. */
export type SessionConversationTraceTypeId =
  | "RootTrace"
  | "ChildTrace"
  | "SessionTrace"
  | "ConversationTrace";

/** Registry-owned architectural status identifiers. */
export type SessionConversationStatusId =
  | "Declared"
  | "Registered"
  | "Certified"
  | "Frozen"
  | "Deprecated";

/** Base registry entry shape. */
export interface SessionConversationRegistryEntry {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly sourcePhase: "NEA-3:1" | "NEA-3:2";
  readonly foundationReference: string | null;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Declarative session identity registry entry. */
export interface SessionIdentityDeclaration {
  readonly sessionId: string;
  readonly sessionName: string;
  readonly sessionVersion: string;
  readonly sessionState: string;
  readonly sessionLifecycle: string;
  readonly sessionStatus: SessionConversationStatusId;
  readonly managesRuntimeSession: false;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Declarative conversation identity registry entry. */
export interface ConversationIdentityDeclaration {
  readonly conversationId: string;
  readonly conversationName: string;
  readonly conversationVersion: string;
  readonly conversationType: SessionConversationTypeId;
  readonly conversationStatus: SessionConversationStatusId;
  readonly conversationLifecycle: string;
  readonly managesRuntimeConversation: false;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical registry identity. */
export interface SessionConversationRegistryIdentity {
  readonly registryId: string;
  readonly registryName: string;
  readonly registryVersion: string;
  readonly registryNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-3:2";
  readonly stage: "Registry";
  readonly sourcePhase: "NEA-3:2";
  readonly owner: string;
  readonly status: SessionConversationRegistryStatus;
  readonly readiness: SessionConversationRegistryReadiness;
  readonly foundationId: string;
  readonly foundationVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic registry summary. */
export interface SessionConversationRegistrySummary {
  readonly registryId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-3:2";
  readonly status: SessionConversationRegistryStatus;
  readonly readiness: SessionConversationRegistryReadiness;
  readonly foundationId: string;
  readonly sessionIdentityCount: number;
  readonly conversationIdentityCount: number;
  readonly participantRoleCount: number;
  readonly conversationTypeCount: number;
  readonly sessionStateCount: number;
  readonly conversationStateCount: number;
  readonly contextDimensionCount: number;
  readonly messageReferenceTypeCount: number;
  readonly correlationTypeCount: number;
  readonly traceTypeCount: number;
  readonly capabilityCount: number;
  readonly lifecycleEntryCount: number;
  readonly statusCount: number;
  readonly policyCount: number;
  readonly totalRegistryEntryCount: number;
  readonly publicExportCount: number;
  readonly sectionCount: number;
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
