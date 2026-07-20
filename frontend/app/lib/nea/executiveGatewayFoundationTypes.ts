/**
 * NEA-1:1 — Executive Gateway Foundation Types.
 *
 * Readonly contracts and closed vocabularies for the Nexora Executive Gateway.
 * Metadata-only. No runtime enforcement.
 *
 * Ownership: owned exclusively by NEA-1:1.
 */

/** Foundation status for NEA-1:1. */
export type ExecutiveGatewayFoundationStatus = "Foundation";

/** Immediate downstream readiness — Registry only. */
export type ExecutiveGatewayFoundationReadiness = "ReadyForRegistry";

/** Ordered gateway processing lifecycle states. */
export type ExecutiveGatewayLifecycleState =
  | "Received"
  | "Identified"
  | "ContextResolved"
  | "Authenticated"
  | "Authorized"
  | "Normalized"
  | "Validated"
  | "RoutingPrepared"
  | "Accepted"
  | "Rejected"
  | "Failed"
  | "Completed";

/** Architectural external source-family classifications. */
export type ExecutiveGatewaySourceFamily =
  | "Messaging"
  | "Collaboration"
  | "Email"
  | "Voice"
  | "REST"
  | "MCP"
  | "SDK"
  | "EnterpriseSystem"
  | "ExternalApplication"
  | "HumanOperator"
  | "ApprovedAgent"
  | "UnknownExternalSource";

/** Channel-type declarations — classification only, no connectors. */
export type ExecutiveGatewayChannelType =
  | "Telegram"
  | "WhatsApp"
  | "MicrosoftTeams"
  | "Slack"
  | "Email"
  | "Voice"
  | "RestApi"
  | "MCP"
  | "SDK"
  | "Webhook"
  | "EnterpriseConnector"
  | "ExternalApplication"
  | "CustomApprovedChannel";

/** Interaction modality classifications for gateway input. */
export type ExecutiveGatewayInteractionModality =
  | "Text"
  | "StructuredData"
  | "Command"
  | "Event"
  | "File"
  | "Document"
  | "Audio"
  | "TranscribedVoice"
  | "ImageReference"
  | "FormSubmission"
  | "APIRequest"
  | "AgentRequest"
  | "SystemNotification";

/** Sender identity kind references — no resolution. */
export type ExecutiveGatewaySenderKind =
  | "Person"
  | "Employee"
  | "Manager"
  | "Customer"
  | "Supplier"
  | "Partner"
  | "ExternalApplication"
  | "EnterpriseSystem"
  | "ApprovedAgent"
  | "UnknownSender";

/** Declared routing destination families — no execution. */
export type ExecutiveGatewayRoutingDestination =
  | "DKL"
  | "ExecutiveEngine"
  | "KnowledgeServices"
  | "IntegrationService"
  | "NotificationService"
  | "HumanReview"
  | "Rejected"
  | "Quarantine"
  | "Unsupported";

/** Gateway processing status for response envelopes. */
export type ExecutiveGatewayProcessingStatus =
  | "Accepted"
  | "Rejected"
  | "ConditionallyAccepted"
  | "Failed"
  | "Pending";

/** Validation outcome declarations. */
export type ExecutiveGatewayValidationStatus =
  | "Valid"
  | "Invalid"
  | "ConditionallyAccepted"
  | "Rejected";

/** Normalization outcome declarations. */
export type ExecutiveGatewayNormalizationStatus =
  | "Normalized"
  | "PartiallyNormalized"
  | "Failed"
  | "Skipped";

/** Authentication status declarations. */
export type ExecutiveGatewayAuthenticationStatus =
  | "Authenticated"
  | "Unauthenticated"
  | "Unknown"
  | "NotApplicable";

/** Authorization status declarations. */
export type ExecutiveGatewayAuthorizationStatus =
  | "Authorized"
  | "Unauthorized"
  | "Partial"
  | "Unknown"
  | "NotApplicable";

/** Trust status declarations. */
export type ExecutiveGatewayTrustStatus =
  | "Trusted"
  | "Conditional"
  | "Untrusted"
  | "Unknown";

/** Consent status declarations. */
export type ExecutiveGatewayConsentStatus =
  | "Granted"
  | "Denied"
  | "Expired"
  | "Revoked"
  | "Unknown"
  | "NotRequired";

/** Capability identifiers for the Executive Gateway Foundation. */
export type ExecutiveGatewayCapabilityId =
  | "ExternalInteractionIntake"
  | "SourceIdentification"
  | "ChannelClassification"
  | "SenderReferenceCapture"
  | "TenantContextCapture"
  | "WorkspaceContextCapture"
  | "AuthenticationContextCapture"
  | "AuthorizationContextCapture"
  | "TrustContextCapture"
  | "ConsentContextCapture"
  | "InteractionNormalization"
  | "GatewayValidationDeclaration"
  | "RoutingPreparation"
  | "CorrelationAndTracing"
  | "DiagnosticGeneration"
  | "GatewayResponseDeclaration";

/** Deterministic ISO-compatible timestamp contract (declaration only). */
export interface ExecutiveGatewayTimestamp {
  readonly iso8601: string;
  readonly deterministic: true;
  readonly runtimeGenerated: false;
}

/** Sender identity reference — no resolution or persistence. */
export interface ExecutiveGatewaySenderReference {
  readonly senderReferenceId: string;
  readonly senderKind: ExecutiveGatewaySenderKind;
  readonly externalSubjectRef: string;
  readonly displayLabelRef: string;
  readonly resolved: false;
  readonly persisted: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Tenant context reference — no discovery or lookup. */
export interface ExecutiveGatewayTenantContext {
  readonly tenantRef: string;
  readonly organizationRef: string;
  readonly environmentRef: string;
  readonly regionRef: string;
  readonly localeRef: string;
  readonly timezoneRef: string;
  readonly discovered: false;
  readonly loaded: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Workspace context reference — no membership resolution. */
export interface ExecutiveGatewayWorkspaceContext {
  readonly workspaceRef: string;
  readonly tenantRef: string;
  readonly environmentRef: string;
  readonly membershipResolved: false;
  readonly permissionLookedUp: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Session and conversation references. */
export interface ExecutiveGatewaySessionReference {
  readonly sessionRef: string;
  readonly conversationRef: string;
  readonly correlationId: string;
  readonly traceId: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Payload and attachment references — no content interpretation. */
export interface ExecutiveGatewayPayloadReference {
  readonly payloadRef: string;
  readonly contentTypeRef: string;
  readonly sizeHintRef: string;
  readonly interpreted: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveGatewayAttachmentReference {
  readonly attachmentRef: string;
  readonly attachmentKindRef: string;
  readonly contentTypeRef: string;
  readonly interpreted: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Authentication context — declaration only. */
export interface ExecutiveGatewayAuthenticationContext {
  readonly authenticationStatus: ExecutiveGatewayAuthenticationStatus;
  readonly authenticationMethodRef: string;
  readonly identityProviderRef: string;
  readonly credentialRef: string;
  readonly authenticationTimestamp: ExecutiveGatewayTimestamp;
  readonly assuranceLevelRef: string;
  readonly executesAuthentication: false;
  readonly validatesTokens: false;
  readonly storesSecrets: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Authorization context — declaration only. */
export interface ExecutiveGatewayAuthorizationContext {
  readonly authorizationStatus: ExecutiveGatewayAuthorizationStatus;
  readonly requestedActionRef: string;
  readonly requestedResourceRef: string;
  readonly grantedScopes: ReadonlyArray<string>;
  readonly deniedScopes: ReadonlyArray<string>;
  readonly policyReferences: ReadonlyArray<string>;
  readonly authorizationReasonRef: string;
  readonly executesAuthorization: false;
  readonly evaluatesPermissions: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Trust context — descriptive only. */
export interface ExecutiveGatewayTrustContext {
  readonly trustStatus: ExecutiveGatewayTrustStatus;
  readonly sourceTrustLevelRef: string;
  readonly senderTrustLevelRef: string;
  readonly channelTrustLevelRef: string;
  readonly verificationReferences: ReadonlyArray<string>;
  readonly trustWarnings: ReadonlyArray<string>;
  readonly legalDecisionEngine: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Consent context — descriptive only. */
export interface ExecutiveGatewayConsentContext {
  readonly consentStatus: ExecutiveGatewayConsentStatus;
  readonly consentScopeRef: string;
  readonly consentSourceRef: string;
  readonly consentTimestamp: ExecutiveGatewayTimestamp;
  readonly expirationRef: string;
  readonly revocationRef: string;
  readonly complianceWorkflow: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Declared intent — no semantic interpretation. */
export interface ExecutiveGatewayDeclaredIntent {
  readonly declaredIntentRef: string;
  readonly intentCategoryRef: string;
  readonly interpreted: false;
  readonly businessMeaningAssigned: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/**
 * Immutable Executive Gateway request envelope contract.
 * External interaction → safe, normalized, traceable gateway request shape.
 */
export interface ExecutiveGatewayRequestEnvelope {
  readonly requestId: string;
  readonly correlationId: string;
  readonly traceId: string;
  readonly source: ExecutiveGatewaySourceFamily;
  readonly channel: ExecutiveGatewayChannelType;
  readonly modality: ExecutiveGatewayInteractionModality;
  readonly sender: ExecutiveGatewaySenderReference;
  readonly tenantContext: ExecutiveGatewayTenantContext;
  readonly workspaceContext: ExecutiveGatewayWorkspaceContext;
  readonly sessionReference: ExecutiveGatewaySessionReference;
  readonly conversationReference: string;
  readonly receivedAt: ExecutiveGatewayTimestamp;
  readonly payloadReference: ExecutiveGatewayPayloadReference;
  readonly attachmentReferences: ReadonlyArray<ExecutiveGatewayAttachmentReference>;
  readonly authenticationContext: ExecutiveGatewayAuthenticationContext;
  readonly authorizationContext: ExecutiveGatewayAuthorizationContext;
  readonly trustContext: ExecutiveGatewayTrustContext;
  readonly consentContext: ExecutiveGatewayConsentContext;
  readonly declaredIntent: ExecutiveGatewayDeclaredIntent;
  readonly requestedDestination: ExecutiveGatewayRoutingDestination;
  readonly metadata: Readonly<Record<string, string>>;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly runtimeState: false;
}

/** Normalization result — canonical envelope conversion only. */
export interface ExecutiveGatewayNormalizationResult {
  readonly normalizationId: string;
  readonly originalSourceFamily: ExecutiveGatewaySourceFamily;
  readonly originalChannel: ExecutiveGatewayChannelType;
  readonly originalModality: ExecutiveGatewayInteractionModality;
  readonly normalizedModality: ExecutiveGatewayInteractionModality;
  readonly normalizedSenderReference: string;
  readonly normalizedTenantContextRef: string;
  readonly normalizedWorkspaceContextRef: string;
  readonly normalizedPayloadReference: string;
  readonly normalizationStatus: ExecutiveGatewayNormalizationStatus;
  readonly normalizationDiagnostics: ReadonlyArray<string>;
  readonly preservedSourceMetadata: Readonly<Record<string, string>>;
  readonly interpretsBusinessMeaning: false;
  readonly createsBusinessObjects: false;
  readonly performsDkl: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Validation result — declaration only; engine belongs to a later phase. */
export interface ExecutiveGatewayValidationResult {
  readonly validationId: string;
  readonly validationStatus: ExecutiveGatewayValidationStatus;
  readonly validationRuleReferences: ReadonlyArray<string>;
  readonly errors: ReadonlyArray<string>;
  readonly warnings: ReadonlyArray<string>;
  readonly missingFields: ReadonlyArray<string>;
  readonly unsupportedSource: boolean;
  readonly unsupportedModality: boolean;
  readonly missingIdentity: boolean;
  readonly missingTenantContext: boolean;
  readonly missingWorkspaceContext: boolean;
  readonly unauthorizedDestination: boolean;
  readonly malformedEnvelope: boolean;
  readonly executesValidationEngine: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Routing destination declaration — no invocation. */
export interface ExecutiveGatewayRoutingDecision {
  readonly routingDecisionId: string;
  readonly destination: ExecutiveGatewayRoutingDestination;
  readonly destinationReasonRef: string;
  readonly normalizedRequestRef: string;
  readonly executesRouting: false;
  readonly invokesDkl: false;
  readonly invokesEngine: false;
  readonly invokesAssistant: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Gateway diagnostic declaration. */
export interface ExecutiveGatewayDiagnostic {
  readonly diagnosticId: string;
  readonly severityRef: string;
  readonly codeRef: string;
  readonly messageRef: string;
  readonly relatedRequestId: string;
  readonly relatedLifecycleState: ExecutiveGatewayLifecycleState;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/**
 * Immutable Executive Gateway response envelope.
 * Represents gateway processing result only — never Engine/DKL outcomes.
 */
export interface ExecutiveGatewayResponseEnvelope {
  readonly responseId: string;
  readonly requestId: string;
  readonly correlationId: string;
  readonly processingStatus: ExecutiveGatewayProcessingStatus;
  readonly acceptance: boolean;
  readonly rejection: boolean;
  readonly normalizedRequestRef: string;
  readonly routingResultRef: string;
  readonly diagnostics: ReadonlyArray<ExecutiveGatewayDiagnostic>;
  readonly downstreamDestination: ExecutiveGatewayRoutingDestination;
  readonly createdAt: ExecutiveGatewayTimestamp;
  readonly completedAt: ExecutiveGatewayTimestamp | null;
  readonly containsEngineDecisions: false;
  readonly containsDklKnowledge: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Contract declaration metadata entry. */
export interface ExecutiveGatewayContractDeclaration {
  readonly contractId: string;
  readonly contractName: string;
  readonly description: string;
  readonly fields: ReadonlyArray<string>;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly runtimeBehavior: "None";
  readonly deterministicOrder: number;
}

/** Capability declaration metadata entry. */
export interface ExecutiveGatewayCapabilityDeclaration {
  readonly capabilityId: ExecutiveGatewayCapabilityId;
  readonly capabilityName: string;
  readonly description: string;
  readonly ownedByNea: true;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Source-family / channel / modality descriptor. */
export interface ExecutiveGatewayVocabularyEntry<T extends string> {
  readonly id: T;
  readonly label: string;
  readonly description: string;
  readonly connectorImplemented: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical foundation identity. */
export interface ExecutiveGatewayIdentity {
  readonly foundationId: string;
  readonly foundationName: string;
  readonly foundationVersion: string;
  readonly foundationNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-1:1";
  readonly stage: "Foundation";
  readonly sourcePhase: "NEA-1:1";
  readonly owner: string;
  readonly status: ExecutiveGatewayFoundationStatus;
  readonly readiness: ExecutiveGatewayFoundationReadiness;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic foundation summary. */
export interface ExecutiveGatewayFoundationSummary {
  readonly foundationId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-1:1";
  readonly status: ExecutiveGatewayFoundationStatus;
  readonly readiness: ExecutiveGatewayFoundationReadiness;
  readonly sourceFamilyCount: number;
  readonly channelTypeCount: number;
  readonly modalityCount: number;
  readonly senderKindCount: number;
  readonly contractCount: number;
  readonly capabilityCount: number;
  readonly lifecycleStateCount: number;
  readonly routingDestinationCount: number;
  readonly ownershipCount: number;
  readonly nonOwnershipCount: number;
  readonly prohibitedSurfaceCount: number;
  readonly policyCount: number;
  readonly sectionCount: number;
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
