/**
 * NEA-1:3 — Executive Gateway Model Types.
 *
 * Strongly typed immutable domain model contracts for the Executive Gateway.
 * Consumes Registry declarations by reference only. Metadata-only.
 *
 * Ownership: owned exclusively by NEA-1:3.
 */

/** Model status for NEA-1:3. */
export type ExecutiveGatewayModelStatus = "Model";

/** Immediate downstream readiness — Validation only. */
export type ExecutiveGatewayModelReadiness = "ReadyForValidation";

/** Canonical domain model kind identifiers. */
export type ExecutiveGatewayModelKind =
  | "GatewayRequest"
  | "GatewayResponse"
  | "GatewayIdentity"
  | "GatewaySender"
  | "GatewaySession"
  | "GatewayConversation"
  | "GatewayContext"
  | "GatewayTenant"
  | "GatewayWorkspace"
  | "GatewayAuthentication"
  | "GatewayAuthorization"
  | "GatewayTrust"
  | "GatewayConsent"
  | "GatewayPayload"
  | "GatewayAttachment"
  | "GatewayRouting"
  | "GatewayValidation"
  | "GatewayDiagnostic"
  | "GatewayProcessingResult"
  | "GatewayMetadata";

/** Model-phase lifecycle states for domain model artifacts. */
export type ExecutiveGatewayModelLifecycleState =
  | "Declared"
  | "Typed"
  | "Composed"
  | "Related"
  | "Boundaried"
  | "ReadyForValidation";

/** Registry reference — never duplicates registry values. */
export interface ExecutiveGatewayRegistryReference {
  readonly registryEntryId: string;
  readonly registryCollection:
    | "sourceFamilies"
    | "channels"
    | "modalities"
    | "senders"
    | "authenticationMethods"
    | "authorizationStatuses"
    | "trustLevels"
    | "consentStatuses"
    | "validationStatuses"
    | "routingDestinations"
    | "lifecycleStates"
    | "diagnosticCategories"
    | "capabilities"
    | "policies";
  readonly preservesCanonicalReference: true;
  readonly duplicatesRegistryValue: false;
}

/** Deterministic ISO-compatible timestamp contract. */
export interface ExecutiveGatewayModelTimestamp {
  readonly iso8601: string;
  readonly deterministic: true;
  readonly runtimeGenerated: false;
}

/** Gateway Identity Model. */
export interface GatewayIdentityModel {
  readonly modelKind: "GatewayIdentity";
  readonly identityId: string;
  readonly gatewayNamespace: string;
  readonly gatewayVersion: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Gateway Sender Model. */
export interface GatewaySenderModel {
  readonly modelKind: "GatewaySender";
  readonly senderId: string;
  readonly senderKindRef: ExecutiveGatewayRegistryReference;
  readonly externalSubjectRef: string;
  readonly displayLabelRef: string;
  readonly resolved: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Gateway Tenant Model. */
export interface GatewayTenantModel {
  readonly modelKind: "GatewayTenant";
  readonly tenantRef: string;
  readonly organizationRef: string;
  readonly environmentRef: string;
  readonly regionRef: string;
  readonly discovered: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Gateway Workspace Model. */
export interface GatewayWorkspaceModel {
  readonly modelKind: "GatewayWorkspace";
  readonly workspaceRef: string;
  readonly tenantRef: string;
  readonly membershipResolved: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Gateway Context Model. */
export interface GatewayContextModel {
  readonly modelKind: "GatewayContext";
  readonly tenant: GatewayTenantModel;
  readonly workspace: GatewayWorkspaceModel;
  readonly localeRef: string;
  readonly timezoneRef: string;
  readonly environmentRef: string;
  readonly organizationRef: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Gateway Session Model. */
export interface GatewaySessionModel {
  readonly modelKind: "GatewaySession";
  readonly sessionRef: string;
  readonly correlationId: string;
  readonly traceId: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Gateway Conversation Model. */
export interface GatewayConversationModel {
  readonly modelKind: "GatewayConversation";
  readonly conversationRef: string;
  readonly sessionRef: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Gateway Authentication Model. */
export interface GatewayAuthenticationModel {
  readonly modelKind: "GatewayAuthentication";
  readonly authenticationMethodRef: ExecutiveGatewayRegistryReference;
  readonly authenticationStatusRef: string;
  readonly identityProviderRef: string;
  readonly credentialRef: string;
  readonly assuranceLevelRef: string;
  readonly executesAuthentication: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Gateway Authorization Model. */
export interface GatewayAuthorizationModel {
  readonly modelKind: "GatewayAuthorization";
  readonly authorizationStatusRef: ExecutiveGatewayRegistryReference;
  readonly requestedActionRef: string;
  readonly requestedResourceRef: string;
  readonly grantedScopeRefs: ReadonlyArray<string>;
  readonly deniedScopeRefs: ReadonlyArray<string>;
  readonly executesAuthorization: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Gateway Trust Model. */
export interface GatewayTrustModel {
  readonly modelKind: "GatewayTrust";
  readonly trustLevelRef: ExecutiveGatewayRegistryReference;
  readonly sourceTrustLevelRef: string;
  readonly senderTrustLevelRef: string;
  readonly channelTrustLevelRef: string;
  readonly evaluatesTrust: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Gateway Consent Model. */
export interface GatewayConsentModel {
  readonly modelKind: "GatewayConsent";
  readonly consentStatusRef: ExecutiveGatewayRegistryReference;
  readonly consentScopeRef: string;
  readonly consentSourceRef: string;
  readonly evaluatesConsent: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Gateway Payload Model. */
export interface GatewayPayloadModel {
  readonly modelKind: "GatewayPayload";
  readonly payloadRef: string;
  readonly contentTypeRef: string;
  readonly sizeHintRef: string;
  readonly interpretsBusinessMeaning: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Gateway Attachment Model. */
export interface GatewayAttachmentModel {
  readonly modelKind: "GatewayAttachment";
  readonly attachmentRef: string;
  readonly attachmentKindRef: string;
  readonly contentTypeRef: string;
  readonly interpretsContent: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Gateway Metadata Model. */
export interface GatewayMetadataModel {
  readonly modelKind: "GatewayMetadata";
  readonly metadataId: string;
  readonly entries: Readonly<Record<string, string>>;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Gateway Request Model. */
export interface GatewayRequestModel {
  readonly modelKind: "GatewayRequest";
  readonly requestId: string;
  readonly correlationId: string;
  readonly traceId: string;
  readonly identity: GatewayIdentityModel;
  readonly sender: GatewaySenderModel;
  readonly sourceFamilyRef: ExecutiveGatewayRegistryReference;
  readonly channelRef: ExecutiveGatewayRegistryReference;
  readonly modalityRef: ExecutiveGatewayRegistryReference;
  readonly context: GatewayContextModel;
  readonly session: GatewaySessionModel;
  readonly conversation: GatewayConversationModel;
  readonly payload: GatewayPayloadModel;
  readonly attachments: ReadonlyArray<GatewayAttachmentModel>;
  readonly authentication: GatewayAuthenticationModel;
  readonly authorization: GatewayAuthorizationModel;
  readonly trust: GatewayTrustModel;
  readonly consent: GatewayConsentModel;
  readonly metadata: GatewayMetadataModel;
  readonly receivedAt: ExecutiveGatewayModelTimestamp;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly runtimeState: false;
}

/** Gateway Routing Model. */
export interface GatewayRoutingModel {
  readonly modelKind: "GatewayRouting";
  readonly routingDecisionId: string;
  readonly destinationRef: ExecutiveGatewayRegistryReference;
  readonly destinationReasonRef: string;
  readonly requestRef: string;
  readonly executesRouting: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Gateway Validation Model. */
export interface GatewayValidationModel {
  readonly modelKind: "GatewayValidation";
  readonly validationId: string;
  readonly validationStatusRef: ExecutiveGatewayRegistryReference;
  readonly errorRefs: ReadonlyArray<string>;
  readonly warningRefs: ReadonlyArray<string>;
  readonly performsValidation: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Gateway Diagnostic Model. */
export interface GatewayDiagnosticModel {
  readonly modelKind: "GatewayDiagnostic";
  readonly diagnosticId: string;
  readonly categoryRef: ExecutiveGatewayRegistryReference;
  readonly severityRef: string;
  readonly codeRef: string;
  readonly messageRef: string;
  readonly relatedRequestId: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Gateway Processing Result Model. */
export interface GatewayProcessingResultModel {
  readonly modelKind: "GatewayProcessingResult";
  readonly resultId: string;
  readonly requestRef: string;
  readonly lifecycleStateRef: ExecutiveGatewayRegistryReference;
  readonly accepted: boolean;
  readonly rejected: boolean;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Gateway Response Model. */
export interface GatewayResponseModel {
  readonly modelKind: "GatewayResponse";
  readonly responseId: string;
  readonly requestRef: string;
  readonly correlationId: string;
  readonly processingResult: GatewayProcessingResultModel;
  readonly routing: GatewayRoutingModel;
  readonly validation: GatewayValidationModel;
  readonly diagnostics: ReadonlyArray<GatewayDiagnosticModel>;
  readonly createdAt: ExecutiveGatewayModelTimestamp;
  readonly completedAt: ExecutiveGatewayModelTimestamp | null;
  readonly containsEngineDecisions: false;
  readonly containsDklKnowledge: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Model kind descriptor for inventory and relationships. */
export interface ExecutiveGatewayModelKindDescriptor {
  readonly modelKind: ExecutiveGatewayModelKind;
  readonly modelName: string;
  readonly description: string;
  readonly registryCollections: ReadonlyArray<
    ExecutiveGatewayRegistryReference["registryCollection"]
  >;
  readonly fieldCount: number;
  readonly composesModels: ReadonlyArray<ExecutiveGatewayModelKind>;
  readonly executesRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Model relationship declaration. */
export interface ExecutiveGatewayModelRelationship {
  readonly relationshipId: string;
  readonly relationshipName: string;
  readonly sourceModelKind: ExecutiveGatewayModelKind;
  readonly targetModelKind: ExecutiveGatewayModelKind;
  readonly cardinality: "one-to-one" | "one-to-many" | "many-to-one";
  readonly required: boolean;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministicOrder: number;
}

/** Canonical model identity. */
export interface ExecutiveGatewayModelIdentity {
  readonly modelId: string;
  readonly modelName: string;
  readonly modelVersion: string;
  readonly modelNamespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-1:3";
  readonly stage: "Model";
  readonly sourcePhase: "NEA-1:3";
  readonly owner: string;
  readonly status: ExecutiveGatewayModelStatus;
  readonly readiness: ExecutiveGatewayModelReadiness;
  readonly registryId: string;
  readonly registryVersion: string;
  readonly description: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

/** Deterministic model summary. */
export interface ExecutiveGatewayModelSummary {
  readonly modelId: string;
  readonly version: string;
  readonly name: string;
  readonly namespace: string;
  readonly layer: "NEA";
  readonly phase: "NEA-1:3";
  readonly status: ExecutiveGatewayModelStatus;
  readonly readiness: ExecutiveGatewayModelReadiness;
  readonly registryId: string;
  readonly domainModelCount: number;
  readonly relationshipCount: number;
  readonly lifecycleStateCount: number;
  readonly ownershipCount: number;
  readonly nonOwnershipCount: number;
  readonly prohibitedSurfaceCount: number;
  readonly sectionCount: number;
  readonly nextPhase: string;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
