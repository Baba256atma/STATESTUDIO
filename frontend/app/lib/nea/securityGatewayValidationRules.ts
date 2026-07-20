/**
 * NEA-4:4 — Security Gateway Validation Rules.
 *
 * Immutable declarative validation rules for NEA-4:3 domain models.
 * Metadata only. No validation engine.
 *
 * Ownership: owned exclusively by NEA-4:4.
 */

import {
  SecurityGatewayModelId,
  SecurityGatewayModelPlatform,
} from "./securityGatewayModel.ts";
import type {
  SecurityGatewayValidationCategory,
  SecurityGatewayValidationCategoryId,
  SecurityGatewayValidationRule,
  SecurityGatewayValidationSeverity,
  SecurityGatewayValidationTarget,
} from "./securityGatewayValidationTypes.ts";

const model = SecurityGatewayModelPlatform;

const category = (
  categoryId: SecurityGatewayValidationCategoryId,
  categoryName: string,
  description: string,
  targetModelKind: SecurityGatewayValidationTarget,
  order: number,
): SecurityGatewayValidationCategory =>
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
export const SecurityGatewayValidationCategories: readonly SecurityGatewayValidationCategory[] =
  Object.freeze([
    category("SecurityIdentity", "Security Identity Validation", "Validate security identity completeness and uniqueness.", "SecurityIdentity", 1),
    category("SecurityPrincipal", "Security Principal Validation", "Validate principal composition without identity verification.", "SecurityPrincipal", 2),
    category("SecurityContext", "Security Context Validation", "Validate security context composition and required references.", "SecurityContext", 3),
    category("AuthenticationContext", "Authentication Context Validation", "Validate authentication context metadata — no authentication execution.", "AuthenticationContext", 4),
    category("AuthorizationContext", "Authorization Context Validation", "Validate authorization context metadata — no authorization execution.", "AuthorizationContext", 5),
    category("TrustContext", "Trust Context Validation", "Validate trust context metadata — no trust evaluation.", "TrustContext", 6),
    category("ConsentContext", "Consent Context Validation", "Validate consent context metadata — no consent enforcement.", "ConsentContext", 7),
    category("Role", "Role Validation", "Validate canonical role references only.", "Role", 8),
    category("Permission", "Permission Validation", "Validate permission declarations — no permission evaluation.", "Permission", 9),
    category("SecurityClassification", "Security Classification Validation", "Validate canonical classification references.", "SecurityClassification", 10),
    category("SecurityPolicy", "Security Policy Validation", "Validate policy declarations — no policy execution.", "SecurityPolicy", 11),
    category("SecurityEvent", "Security Event Validation", "Validate security event declarations — no event processing.", "SecurityEvent", 12),
    category("SecurityMetadata", "Security Metadata Validation", "Validate security metadata completeness.", "SecurityMetadata", 13),
    category("SecurityDecisionDeclaration", "Security Decision Declaration Validation", "Validate decision declaration structure — no decision calculation.", "SecurityDecisionDeclaration", 14),
    category("SecurityResource", "Security Resource Validation", "Validate protected resource references.", "SecurityResource", 15),
    category("SecurityAction", "Security Action Validation", "Validate requested action declarations.", "SecurityAction", 16),
    category("SecurityConstraint", "Security Constraint Validation", "Validate constraint metadata — no constraint execution.", "SecurityConstraint", 17),
    category("SecurityDiagnostic", "Security Diagnostic Validation", "Validate diagnostic metadata composition.", "SecurityDiagnostic", 18),
    category("SecurityResult", "Security Result Validation", "Validate security result structure — no processing.", "SecurityResult", 19),
    category("SecuritySummary", "Security Summary Validation", "Validate security summary composition.", "SecuritySummary", 20),
    category("CrossModel", "Cross-Model Validation", "Declarative relationship validation across security models.", "CrossModel", 21),
    category("PlatformIntegrity", "Platform Integrity Validation", "Validate canonical references, ownership, and immutable composition.", "Platform", 22),
  ]);

const rule = (
  key: string,
  ruleName: string,
  categoryId: SecurityGatewayValidationCategoryId,
  targetModelKind: SecurityGatewayValidationTarget,
  description: string,
  severity: SecurityGatewayValidationSeverity,
  order: number,
): SecurityGatewayValidationRule =>
  Object.freeze({
    ruleId: `NEA-4:4/Rule/${key}`,
    ruleName,
    categoryId,
    targetModelKind,
    description,
    severity,
    modelReference: `${SecurityGatewayModelId}/domainModels/${targetModelKind}`,
    executesValidation: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly sixty declarative validation rules.
 * All reference Model kinds. No rule executes validation.
 */
export const SecurityGatewayValidationRules: readonly SecurityGatewayValidationRule[] =
  Object.freeze([
    rule("SecurityIdentity-Completeness", "Security Identity Completeness", "SecurityIdentity", "SecurityIdentity", "Security identity fields must be declared completely.", "Error", 1),
    rule("SecurityIdentity-Unique", "Unique Security Identity", "SecurityIdentity", "SecurityIdentity", "Security identity ids must be unique.", "Error", 2),
    rule("SecurityIdentity-Canonical", "Security Identity Canonical Reference", "SecurityIdentity", "SecurityIdentity", "Security identity must preserve canonical Registry references.", "Error", 3),

    rule("SecurityPrincipal-Completeness", "Security Principal Completeness", "SecurityPrincipal", "SecurityPrincipal", "Security principal fields must be declared completely.", "Error", 4),
    rule("SecurityPrincipal-Unique", "Unique Security Principal", "SecurityPrincipal", "SecurityPrincipal", "Security principal ids must be unique.", "Error", 5),
    rule("SecurityPrincipal-NoVerification", "Principal Non-Verification", "SecurityPrincipal", "SecurityPrincipal", "Principal validation must not verify identity.", "Info", 6),

    rule("SecurityContext-Composition", "Security Context Composition", "SecurityContext", "SecurityContext", "Security context must compose required child models.", "Error", 7),
    rule("SecurityContext-IdentityRefs", "Security Context Identity References", "SecurityContext", "SecurityContext", "Security context must declare canonical identity references.", "Error", 8),
    rule("SecurityContext-Metadata", "Security Context Metadata Completeness", "SecurityContext", "SecurityContext", "Security context metadata structure must be complete.", "Error", 9),

    rule("AuthenticationContext-Method", "Authentication Method Reference", "AuthenticationContext", "AuthenticationContext", "Authentication context must declare authentication method metadata.", "Error", 10),
    rule("AuthenticationContext-NoExecution", "Authentication Non-Execution", "AuthenticationContext", "AuthenticationContext", "Authentication context validation must not execute authentication.", "Info", 11),
    rule("AuthenticationContext-Completeness", "Authentication Context Completeness", "AuthenticationContext", "AuthenticationContext", "Authentication context fields must be declared completely.", "Error", 12),

    rule("AuthorizationContext-Composition", "Authorization Context Composition", "AuthorizationContext", "AuthorizationContext", "Authorization context must compose resource and action references.", "Error", 13),
    rule("AuthorizationContext-Level", "Authorization Level Consistency", "AuthorizationContext", "AuthorizationContext", "Authorization level must match canonical declarations.", "Error", 14),
    rule("AuthorizationContext-NoExecution", "Authorization Non-Execution", "AuthorizationContext", "AuthorizationContext", "Authorization context validation must not execute authorization.", "Info", 15),

    rule("TrustContext-Level", "Trust Level Consistency", "TrustContext", "TrustContext", "Trust level must match canonical declarations.", "Error", 16),
    rule("TrustContext-NoEvaluation", "Trust Non-Evaluation", "TrustContext", "TrustContext", "Trust context validation must not evaluate trust.", "Info", 17),

    rule("ConsentContext-State", "Consent State Consistency", "ConsentContext", "ConsentContext", "Consent state must match canonical declarations.", "Error", 18),
    rule("ConsentContext-NoEnforcement", "Consent Non-Enforcement", "ConsentContext", "ConsentContext", "Consent context validation must not enforce consent.", "Info", 19),

    rule("Role-Canonical", "Role Canonical Reference", "Role", "Role", "Role must reference a canonical Registry role.", "Error", 20),
    rule("Role-NoAssignment", "Role Non-Assignment", "Role", "Role", "Role validation must not assign runtime roles.", "Info", 21),

    rule("Permission-Completeness", "Permission Completeness", "Permission", "Permission", "Permission declarations must be complete.", "Error", 22),
    rule("Permission-Unique", "Unique Permission", "Permission", "Permission", "Permission ids must be unique.", "Error", 23),
    rule("Permission-NoEvaluation", "Permission Non-Evaluation", "Permission", "Permission", "Permission validation must not evaluate permissions.", "Info", 24),

    rule("Classification-Canonical", "Classification Canonical Reference", "SecurityClassification", "SecurityClassification", "Classification must reference a canonical Registry classification.", "Error", 25),
    rule("Classification-Completeness", "Classification Completeness", "SecurityClassification", "SecurityClassification", "Classification metadata must be complete.", "Error", 26),

    rule("Policy-Canonical", "Policy Canonical Reference", "SecurityPolicy", "SecurityPolicy", "Policy must reference a canonical Registry security policy.", "Error", 27),
    rule("Policy-NoExecution", "Policy Non-Execution", "SecurityPolicy", "SecurityPolicy", "Policy validation must not execute policies.", "Info", 28),

    rule("Event-Canonical", "Event Canonical Reference", "SecurityEvent", "SecurityEvent", "Security event must reference a canonical Registry event.", "Error", 29),
    rule("Event-NoProcessing", "Event Non-Processing", "SecurityEvent", "SecurityEvent", "Event validation must not process or publish events.", "Info", 30),

    rule("Metadata-Completeness", "Security Metadata Completeness", "SecurityMetadata", "SecurityMetadata", "Security metadata model must be complete.", "Error", 31),
    rule("Metadata-Lifecycle", "Security Metadata Lifecycle Consistency", "SecurityMetadata", "SecurityMetadata", "Security metadata lifecycle must remain consistent.", "Error", 32),

    rule("Decision-Structure", "Decision Declaration Structure", "SecurityDecisionDeclaration", "SecurityDecisionDeclaration", "Decision declaration structure must be complete.", "Error", 33),
    rule("Decision-NoCalculation", "Decision Non-Calculation", "SecurityDecisionDeclaration", "SecurityDecisionDeclaration", "Decision declaration validation must not calculate decisions.", "Info", 34),

    rule("Resource-Reference", "Security Resource Reference", "SecurityResource", "SecurityResource", "Security resource must be declared by immutable reference.", "Error", 35),
    rule("Resource-Completeness", "Security Resource Completeness", "SecurityResource", "SecurityResource", "Security resource metadata must be complete.", "Error", 36),

    rule("Action-Declaration", "Security Action Declaration", "SecurityAction", "SecurityAction", "Security action must be a canonical declaration.", "Error", 37),
    rule("Action-Completeness", "Security Action Completeness", "SecurityAction", "SecurityAction", "Security action metadata must be complete.", "Error", 38),

    rule("Constraint-Structure", "Constraint Structure", "SecurityConstraint", "SecurityConstraint", "Constraint metadata structure must be complete.", "Error", 39),
    rule("Constraint-NoExecution", "Constraint Non-Execution", "SecurityConstraint", "SecurityConstraint", "Constraint validation must not execute constraints.", "Info", 40),

    rule("Diagnostic-Structure", "Diagnostic Structure", "SecurityDiagnostic", "SecurityDiagnostic", "Diagnostic metadata structure must be complete.", "Error", 41),
    rule("Diagnostic-Composition", "Diagnostic Composition", "SecurityDiagnostic", "SecurityDiagnostic", "Diagnostics must compose declared warning and conflict metadata.", "Error", 42),

    rule("Result-Structure", "Result Structure", "SecurityResult", "SecurityResult", "Security result structure must be complete.", "Error", 43),
    rule("Result-NoProcessing", "Result Non-Processing", "SecurityResult", "SecurityResult", "Result validation must not execute security processing.", "Info", 44),
    rule("Result-DecisionRefs", "Result Decision References", "SecurityResult", "SecurityResult", "Result must declare decision declaration references.", "Error", 45),

    rule("Summary-Composition", "Summary Composition", "SecuritySummary", "SecuritySummary", "Summary must compose security context references.", "Error", 46),
    rule("Summary-ResultRefs", "Summary Result References", "SecuritySummary", "SecuritySummary", "Summary may declare security result references.", "Warning", 47),
    rule("Summary-Completeness", "Summary Completeness", "SecuritySummary", "SecuritySummary", "Security summary metadata must be complete.", "Error", 48),

    rule("CrossModel-IdentityPrincipal", "Cross-Model Identity Principal", "CrossModel", "CrossModel", "Identity ↔ Principal relationship must remain consistent.", "Error", 49),
    rule("CrossModel-IdentityClassification", "Cross-Model Identity Classification", "CrossModel", "CrossModel", "Identity ↔ Classification relationship must remain consistent.", "Error", 50),
    rule("CrossModel-ContextIdentity", "Cross-Model Context Identity", "CrossModel", "CrossModel", "Context ↔ Identity relationship must remain consistent.", "Error", 51),
    rule("CrossModel-ContextAuth", "Cross-Model Context Authentication", "CrossModel", "CrossModel", "Context ↔ Authentication relationship must remain consistent.", "Error", 52),
    rule("CrossModel-ContextAuthz", "Cross-Model Context Authorization", "CrossModel", "CrossModel", "Context ↔ Authorization relationship must remain consistent.", "Error", 53),
    rule("CrossModel-PermissionResource", "Cross-Model Permission Resource", "CrossModel", "CrossModel", "Permission ↔ Resource relationship must remain consistent.", "Error", 54),
    rule("CrossModel-ResultDecision", "Cross-Model Result Decision", "CrossModel", "CrossModel", "Result ↔ Decision relationship must remain consistent.", "Error", 55),
    rule("CrossModel-SummaryContext", "Cross-Model Summary Context", "CrossModel", "CrossModel", "Summary ↔ Context relationship must remain consistent.", "Error", 56),

    rule("Platform-ModelRefs", "Platform Model References", "PlatformIntegrity", "Platform", "Canonical Model references must be preserved.", "Error", 57),
    rule("Platform-Ownership", "Platform Ownership Consistency", "PlatformIntegrity", "Platform", "Ownership declarations must remain unique and immutable.", "Error", 58),
    rule("Platform-DuplicatePrevention", "Platform Duplicate Prevention", "PlatformIntegrity", "Platform", "Duplicate validation rules and model values are forbidden.", "Error", 59),
    rule("Platform-ImmutableComposition", "Platform Immutable Composition", "PlatformIntegrity", "Platform", "Immutable composition of Validation over Model must be preserved.", "Error", 60),
  ]);

/** Model anchors proving rules target NEA-4:3 domain models. */
export const SecurityGatewayValidationModelAnchors = Object.freeze({
  modelId: SecurityGatewayModelId,
  sourcePhase: "NEA-4:4" as const,
  domainModelCount: model.domainModels.modelCount,
  securityIdentityModelCount: model.domainModels.securityIdentityModelCount,
  securityPrincipalModelCount: model.domainModels.securityPrincipalModelCount,
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
export const SecurityGatewayValidationRuleCatalog = Object.freeze({
  catalogId: "NEA-4:4/ValidationRuleCatalog",
  sourcePhase: "NEA-4:4" as const,
  categories: SecurityGatewayValidationCategories,
  rules: SecurityGatewayValidationRules,
  categoryCount: SecurityGatewayValidationCategories.length,
  ruleCount: SecurityGatewayValidationRules.length,
  modelAnchors: SecurityGatewayValidationModelAnchors,
  executesValidation: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
