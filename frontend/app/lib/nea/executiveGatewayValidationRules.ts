/**
 * NEA-1:4 — Executive Gateway Validation Rules.
 *
 * Immutable declarative validation rules for NEA-1:3 domain models.
 * Metadata only. No validation engine.
 *
 * Ownership: owned exclusively by NEA-1:4.
 */

import {
  ExecutiveGatewayModelId,
  ExecutiveGatewayModelPlatform,
} from "./executiveGatewayModel.ts";
import type {
  ExecutiveGatewayValidationCategory,
  ExecutiveGatewayValidationCategoryId,
  ExecutiveGatewayValidationRule,
  ExecutiveGatewayValidationSeverity,
  ExecutiveGatewayValidationTarget,
} from "./executiveGatewayValidationTypes.ts";

const model = ExecutiveGatewayModelPlatform;

const category = (
  categoryId: ExecutiveGatewayValidationCategoryId,
  categoryName: string,
  description: string,
  targetModelKind: ExecutiveGatewayValidationTarget,
  order: number,
): ExecutiveGatewayValidationCategory =>
  Object.freeze({
    categoryId,
    categoryName,
    description,
    targetModelKind,
    executesValidation: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Exactly twenty-two validation categories. */
export const ExecutiveGatewayValidationCategories: readonly ExecutiveGatewayValidationCategory[] =
  Object.freeze([
    category("Identity", "Identity Validation", "Validate gateway identity presence and structure.", "GatewayIdentity", 1),
    category("Sender", "Sender Validation", "Validate sender kind and identity reference.", "GatewaySender", 2),
    category("Tenant", "Tenant Validation", "Validate tenant reference structure.", "GatewayTenant", 3),
    category("Workspace", "Workspace Validation", "Validate workspace reference structure.", "GatewayWorkspace", 4),
    category("Context", "Context Validation", "Validate context consistency across tenant and workspace.", "GatewayContext", 5),
    category("Session", "Session Validation", "Validate session structure.", "GatewaySession", 6),
    category("Conversation", "Conversation Validation", "Validate conversation structure.", "GatewayConversation", 7),
    category("Authentication", "Authentication Validation", "Validate authentication model completeness.", "GatewayAuthentication", 8),
    category("Authorization", "Authorization Validation", "Validate authorization model completeness.", "GatewayAuthorization", 9),
    category("Trust", "Trust Validation", "Validate trust metadata structure.", "GatewayTrust", 10),
    category("Consent", "Consent Validation", "Validate consent metadata structure.", "GatewayConsent", 11),
    category("Payload", "Payload Validation", "Validate payload model structure without business interpretation.", "GatewayPayload", 12),
    category("Attachment", "Attachment Validation", "Validate attachment references.", "GatewayAttachment", 13),
    category("Metadata", "Metadata Validation", "Validate metadata completeness.", "GatewayMetadata", 14),
    category("Request", "Request Validation", "Validate Gateway Request composition.", "GatewayRequest", 15),
    category("Routing", "Routing Validation", "Validate routing declaration structure.", "GatewayRouting", 16),
    category("ValidationOutcome", "Validation Outcome Validation", "Validate validation outcome model structure.", "GatewayValidation", 17),
    category("Diagnostic", "Diagnostic Validation", "Validate diagnostic model structure.", "GatewayDiagnostic", 18),
    category("ProcessingResult", "Processing Result Validation", "Validate processing result structure.", "GatewayProcessingResult", 19),
    category("Response", "Response Validation", "Validate Gateway Response composition.", "GatewayResponse", 20),
    category("CrossModel", "Cross-Model Validation", "Declarative relationship validation across domain models.", "CrossModel", 21),
    category("PlatformIntegrity", "Platform Integrity Validation", "Validate canonical references and ownership integrity.", "Platform", 22),
  ]);

const rule = (
  key: string,
  ruleName: string,
  categoryId: ExecutiveGatewayValidationCategoryId,
  targetModelKind: ExecutiveGatewayValidationTarget,
  description: string,
  severity: ExecutiveGatewayValidationSeverity,
  order: number,
): ExecutiveGatewayValidationRule =>
  Object.freeze({
    ruleId: `NEA-1:4/Rule/${key}`,
    ruleName,
    categoryId,
    targetModelKind,
    description,
    severity,
    modelReference: `${ExecutiveGatewayModelId}/domainModels/${targetModelKind}`,
    executesValidation: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Canonical declarative validation rules.
 * One or more rules per category; all reference Model kinds.
 */
export const ExecutiveGatewayValidationRules: readonly ExecutiveGatewayValidationRule[] =
  Object.freeze([
    rule("Identity-Presence", "Identity Presence", "Identity", "GatewayIdentity", "Identity fields must be declared.", "Error", 1),
    rule("Identity-Structure", "Identity Structure", "Identity", "GatewayIdentity", "Identity structure must match Gateway Identity Model.", "Error", 2),
    rule("Identity-Canonical", "Identity Canonical Reference", "Identity", "GatewayIdentity", "Identity must preserve canonical namespace and version references.", "Error", 3),

    rule("Sender-Kind", "Sender Kind", "Sender", "GatewaySender", "Sender kind must reference a Registry sender classification.", "Error", 4),
    rule("Sender-IdentityRef", "Sender Identity Reference", "Sender", "GatewaySender", "Sender identity reference must be present.", "Error", 5),
    rule("Sender-Classification", "Sender Canonical Classification", "Sender", "GatewaySender", "Sender classification must remain canonical.", "Warning", 6),

    rule("Tenant-Reference", "Tenant Reference", "Tenant", "GatewayTenant", "Tenant reference must be present.", "Error", 7),
    rule("Tenant-Canonical", "Tenant Canonical Model", "Tenant", "GatewayTenant", "Tenant must match Gateway Tenant Model structure.", "Error", 8),

    rule("Workspace-Reference", "Workspace Reference", "Workspace", "GatewayWorkspace", "Workspace reference must be present.", "Error", 9),
    rule("Workspace-Canonical", "Workspace Canonical Model", "Workspace", "GatewayWorkspace", "Workspace must match Gateway Workspace Model structure.", "Error", 10),

    rule("Context-Tenant", "Context Tenant Consistency", "Context", "GatewayContext", "Context must include tenant composition.", "Error", 11),
    rule("Context-Workspace", "Context Workspace Consistency", "Context", "GatewayContext", "Context must include workspace composition.", "Error", 12),
    rule("Context-Locale", "Context Locale", "Context", "GatewayContext", "Locale reference must be declared.", "Warning", 13),
    rule("Context-Timezone", "Context Timezone", "Context", "GatewayContext", "Timezone reference must be declared.", "Warning", 14),
    rule("Context-Organization", "Context Organization", "Context", "GatewayContext", "Organization reference must be declared.", "Warning", 15),
    rule("Context-Environment", "Context Environment", "Context", "GatewayContext", "Environment reference must be declared.", "Warning", 16),

    rule("Session-Structure", "Session Structure", "Session", "GatewaySession", "Session structure must include session, correlation, and trace refs.", "Error", 17),
    rule("Conversation-Structure", "Conversation Structure", "Conversation", "GatewayConversation", "Conversation must reference a session.", "Error", 18),

    rule("Authn-Completeness", "Authentication Completeness", "Authentication", "GatewayAuthentication", "Authentication model fields must be complete.", "Error", 19),
    rule("Authn-NoExecution", "Authentication Non-Execution", "Authentication", "GatewayAuthentication", "Authentication validation must not execute authentication.", "Info", 20),

    rule("Authz-Completeness", "Authorization Completeness", "Authorization", "GatewayAuthorization", "Authorization model fields must be complete.", "Error", 21),
    rule("Authz-NoExecution", "Authorization Non-Execution", "Authorization", "GatewayAuthorization", "Authorization validation must not execute authorization.", "Info", 22),

    rule("Trust-Metadata", "Trust Metadata", "Trust", "GatewayTrust", "Trust metadata must reference Registry trust levels.", "Error", 23),
    rule("Trust-NoEvaluation", "Trust Non-Evaluation", "Trust", "GatewayTrust", "Trust validation must not evaluate trust.", "Info", 24),

    rule("Consent-Metadata", "Consent Metadata", "Consent", "GatewayConsent", "Consent metadata must reference Registry consent statuses.", "Error", 25),
    rule("Consent-NoEvaluation", "Consent Non-Evaluation", "Consent", "GatewayConsent", "Consent validation must not evaluate consent.", "Info", 26),

    rule("Payload-Structure", "Payload Structure", "Payload", "GatewayPayload", "Payload model structure must be complete.", "Error", 27),
    rule("Payload-NoBusinessMeaning", "Payload Non-Interpretation", "Payload", "GatewayPayload", "Payload validation must not interpret business meaning.", "Info", 28),

    rule("Attachment-References", "Attachment References", "Attachment", "GatewayAttachment", "Attachment references must be structurally complete.", "Error", 29),
    rule("Metadata-Completeness", "Metadata Completeness", "Metadata", "GatewayMetadata", "Metadata model must declare metadata identity.", "Error", 30),

    rule("Request-Composition", "Request Composition", "Request", "GatewayRequest", "Request must compose required child models.", "Error", 31),
    rule("Request-SourceRefs", "Request Source References", "Request", "GatewayRequest", "Request must preserve source, channel, and modality Registry refs.", "Error", 32),

    rule("Routing-Structure", "Routing Structure", "Routing", "GatewayRouting", "Routing declaration structure must be complete.", "Error", 33),
    rule("Routing-NoExecution", "Routing Non-Execution", "Routing", "GatewayRouting", "Routing validation must not perform routing.", "Info", 34),

    rule("ValidationOutcome-Structure", "Validation Outcome Structure", "ValidationOutcome", "GatewayValidation", "Validation outcome model structure must be complete.", "Error", 35),
    rule("Diagnostic-Structure", "Diagnostic Structure", "Diagnostic", "GatewayDiagnostic", "Diagnostic model must reference a diagnostic category.", "Error", 36),
    rule("ProcessingResult-Structure", "Processing Result Structure", "ProcessingResult", "GatewayProcessingResult", "Processing result structure must be complete.", "Error", 37),

    rule("Response-Composition", "Response Composition", "Response", "GatewayResponse", "Response must compose processing result, routing, and validation.", "Error", 38),
    rule("Response-RequestRef", "Response Request Reference", "Response", "GatewayResponse", "Response must reference a request.", "Error", 39),

    rule("CrossModel-Relationships", "Cross-Model Relationships", "CrossModel", "CrossModel", "Declared model relationships must remain consistent.", "Error", 40),
    rule("CrossModel-Cardinality", "Cross-Model Cardinality", "CrossModel", "CrossModel", "Relationship cardinality declarations must be preserved.", "Warning", 41),

    rule("Platform-RegistryRefs", "Platform Registry References", "PlatformIntegrity", "Platform", "Canonical Registry references must be preserved through Model.", "Error", 42),
    rule("Platform-ModelRefs", "Platform Model References", "PlatformIntegrity", "Platform", "Canonical Model references must be preserved.", "Error", 43),
    rule("Platform-Ownership", "Platform Immutable Ownership", "PlatformIntegrity", "Platform", "Ownership declarations must remain unique and immutable.", "Error", 44),
    rule("Platform-RelationshipConsistency", "Platform Relationship Consistency", "PlatformIntegrity", "Platform", "Relationship consistency must be preserved.", "Error", 45),
    rule("Platform-DuplicatePrevention", "Platform Duplicate Prevention", "PlatformIntegrity", "Platform", "Duplicate validation rules and registry values are forbidden.", "Error", 46),
  ]);

/** Model anchors proving rules target NEA-1:3 domain models. */
export const ExecutiveGatewayValidationModelAnchors = Object.freeze({
  modelId: ExecutiveGatewayModelId,
  sourcePhase: "NEA-1:4" as const,
  domainModelCount: model.domainModels.modelCount,
  relationshipCount: model.relationships.relationshipCount,
  domainModelKinds: Object.freeze(
    model.domainModels.models.map((item) => item.modelKind),
  ),
  preservesCanonicalModelReferences: true as const,
  duplicatesModelValues: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/** Canonical immutable rules catalog. */
export const ExecutiveGatewayValidationRuleCatalog = Object.freeze({
  catalogId: "NEA-1:4/ValidationRuleCatalog",
  sourcePhase: "NEA-1:4" as const,
  categories: ExecutiveGatewayValidationCategories,
  rules: ExecutiveGatewayValidationRules,
  categoryCount: ExecutiveGatewayValidationCategories.length,
  ruleCount: ExecutiveGatewayValidationRules.length,
  modelAnchors: ExecutiveGatewayValidationModelAnchors,
  executesValidation: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
