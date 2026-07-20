/**
 * NEA-3:3 — Session & Conversation Model Types.
 *
 * Strongly typed immutable domain model contracts for Session & Conversation.
 * Consumes Registry declarations by reference only. Metadata-only.
 *
 * Ownership: owned exclusively by NEA-3:3.
 */

/** Model status for NEA-3:3. */
export type SessionConversationModelStatus = "Model";

/** Immediate downstream readiness — Validation only. */
export type SessionConversationModelReadiness = "ReadyForValidation";

/** Canonical domain model kind identifiers. */
export type SessionConversationModelKind =
  | "SessionIdentity"
  | "ConversationIdentity"
  | "Session"
  | "Conversation"
  | "Participant"
  | "MessageReference"
  | "ConversationContext"
  | "Correlation"
  | "Trace"
  | "SessionLifecycle"
  | "ConversationLifecycle"
  | "ConversationState"
  | "SessionState"
  | "ConversationType"
  | "SessionMetadata"
  | "ConversationMetadata"
  | "ConversationConfiguration"
  | "ConversationDiagnostics"
  | "ConversationResult"
  | "ConversationSummary";

/** Model-phase lifecycle states for domain model artifacts. */
export type SessionConversationModelLifecycleState =
  | "Declared"
  | "Typed"
  | "Composed"
  | "Related"
  | "Boundaried"
  | "ReadyForValidation";

/** Registry collection names referenced by models. */
export type SessionConversationRegistryCollectionName =
  | "sessionIdentities"
  | "conversationIdentities"
  | "participants"
  | "conversationTypes"
  | "sessionStates"
  | "conversationStates"
  | "contextDimensions"
  | "messageReferenceTypes"
  | "correlationTypes"
  | "traceTypes"
  | "lifecycleEntries"
  | "statuses"
  | "capabilities"
  | "policies";

/** Registry reference — never duplicates registry values. */
export interface SessionConversationRegistryReference {
  readonly registryEntryId: string;
  readonly registryCollection: SessionConversationRegistryCollectionName;
  readonly preservesCanonicalReference: true;
  readonly duplicatesRegistryValue: false;
}

/** Domain model kind descriptor. */
export interface SessionConversationModelKindDescriptor {
  readonly modelKind: SessionConversationModelKind;
  readonly modelName: string;
  readonly description: string;
  readonly registryCollections: readonly SessionConversationRegistryCollectionName[];
  readonly fieldCount: number;
  readonly composesModels: readonly SessionConversationModelKind[];
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Model relationship declaration. */
export interface SessionConversationModelRelationship {
  readonly relationshipId: string;
  readonly relationshipName: string;
  readonly sourceModelKind: SessionConversationModelKind;
  readonly targetModelKind: SessionConversationModelKind;
  readonly cardinality: "one-to-one" | "one-to-many" | "many-to-one";
  readonly required: boolean;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Session Identity Model — structure only. */
export interface SessionIdentityModel {
  readonly modelKind: "SessionIdentity";
  readonly sessionId: string;
  readonly sessionVersion: string;
  readonly sessionState: string;
  readonly sessionLifecycle: string;
  readonly sessionStatus: string;
  readonly registryIdentityRef: string;
  readonly managesRuntimeSession: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Conversation Identity Model — structure only. */
export interface ConversationIdentityModel {
  readonly modelKind: "ConversationIdentity";
  readonly conversationId: string;
  readonly conversationVersion: string;
  readonly conversationType: string;
  readonly conversationState: string;
  readonly conversationLifecycle: string;
  readonly conversationStatus: string;
  readonly registryIdentityRef: string;
  readonly managesRuntimeConversation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical model identity. */
export interface SessionConversationModelIdentity {
  readonly modelId: string;
  readonly modelName: string;
  readonly modelVersion: string;
  readonly modelNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-3:3";
  readonly stage: "Model";
  readonly sourcePhase: "NEA-3:3";
  readonly owner: string;
  readonly status: SessionConversationModelStatus;
  readonly readiness: SessionConversationModelReadiness;
  readonly registryId: string;
  readonly registryVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic model summary. */
export interface SessionConversationModelSummary {
  readonly modelId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-3:3";
  readonly status: SessionConversationModelStatus;
  readonly readiness: SessionConversationModelReadiness;
  readonly registryId: string;
  readonly domainModelCount: number;
  readonly sessionIdentityModelCount: number;
  readonly conversationIdentityModelCount: number;
  readonly relationshipCount: number;
  readonly lifecycleStateCount: number;
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
