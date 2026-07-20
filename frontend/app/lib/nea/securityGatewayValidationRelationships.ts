/**
 * NEA-4:4 — Security Gateway Validation Relationships.
 *
 * Immutable declarative relationships between validation categories.
 * No runtime validation execution.
 *
 * Ownership: owned exclusively by NEA-4:4.
 */

import type {
  SecurityGatewayValidationCategoryId,
  SecurityGatewayValidationRelationship,
} from "./securityGatewayValidationTypes.ts";

const relationship = (
  key: string,
  relationshipName: string,
  sourceCategoryId: SecurityGatewayValidationCategoryId,
  targetCategoryId: SecurityGatewayValidationCategoryId,
  description: string,
  order: number,
): SecurityGatewayValidationRelationship =>
  Object.freeze({
    relationshipId: `NEA-4:4/ValidationRelationship/${key}`,
    relationshipName,
    sourceCategoryId,
    targetCategoryId,
    description,
    executesValidation: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Exactly twenty-six validation category relationships. */
export const SecurityGatewayValidationRelationships: readonly SecurityGatewayValidationRelationship[] =
  Object.freeze([
    relationship("Identity-Principal", "Identity depends on Principal", "SecurityIdentity", "SecurityPrincipal", "Security identity validation requires principal validation.", 1),
    relationship("Identity-Classification", "Identity depends on Classification", "SecurityIdentity", "SecurityClassification", "Security identity validation requires classification validation.", 2),
    relationship("Identity-Metadata", "Identity depends on Metadata", "SecurityIdentity", "SecurityMetadata", "Security identity validation requires metadata validation.", 3),
    relationship("Context-Identity", "Context depends on Identity", "SecurityContext", "SecurityIdentity", "Security context validation requires identity validation.", 4),
    relationship("Context-Authentication", "Context depends on Authentication", "SecurityContext", "AuthenticationContext", "Security context validation requires authentication context validation.", 5),
    relationship("Context-Authorization", "Context depends on Authorization", "SecurityContext", "AuthorizationContext", "Security context validation requires authorization context validation.", 6),
    relationship("Context-Trust", "Context depends on Trust", "SecurityContext", "TrustContext", "Security context validation requires trust context validation.", 7),
    relationship("Context-Consent", "Context depends on Consent", "SecurityContext", "ConsentContext", "Security context validation requires consent context validation.", 8),
    relationship("Context-Role", "Context depends on Role", "SecurityContext", "Role", "Security context validation requires role validation.", 9),
    relationship("Context-Permission", "Context depends on Permission", "SecurityContext", "Permission", "Security context validation requires permission validation.", 10),
    relationship("Context-Policy", "Context depends on Policy", "SecurityContext", "SecurityPolicy", "Security context validation requires policy validation.", 11),
    relationship("Authorization-Resource", "Authorization depends on Resource", "AuthorizationContext", "SecurityResource", "Authorization validation requires resource validation.", 12),
    relationship("Authorization-Action", "Authorization depends on Action", "AuthorizationContext", "SecurityAction", "Authorization validation requires action validation.", 13),
    relationship("Authorization-Role", "Authorization depends on Role", "AuthorizationContext", "Role", "Authorization validation may require role validation.", 14),
    relationship("Authorization-Permission", "Authorization depends on Permission", "AuthorizationContext", "Permission", "Authorization validation may require permission validation.", 15),
    relationship("Permission-Resource", "Permission depends on Resource", "Permission", "SecurityResource", "Permission validation requires resource validation.", 16),
    relationship("Permission-Action", "Permission depends on Action", "Permission", "SecurityAction", "Permission validation requires action validation.", 17),
    relationship("Permission-Constraint", "Permission depends on Constraint", "Permission", "SecurityConstraint", "Permission validation may require constraint validation.", 18),
    relationship("Policy-Constraint", "Policy depends on Constraint", "SecurityPolicy", "SecurityConstraint", "Policy validation may require constraint validation.", 19),
    relationship("Decision-Authorization", "Decision depends on Authorization", "SecurityDecisionDeclaration", "AuthorizationContext", "Decision declaration validation requires authorization validation.", 20),
    relationship("Result-Decision", "Result depends on Decision", "SecurityResult", "SecurityDecisionDeclaration", "Result validation requires decision declaration validation.", 21),
    relationship("Result-Diagnostic", "Result depends on Diagnostic", "SecurityResult", "SecurityDiagnostic", "Result validation may require diagnostic validation.", 22),
    relationship("Summary-Context", "Summary depends on Context", "SecuritySummary", "SecurityContext", "Summary validation requires security context validation.", 23),
    relationship("Summary-Result", "Summary depends on Result", "SecuritySummary", "SecurityResult", "Summary validation may require result validation.", 24),
    relationship("CrossModel-Context", "Cross-Model covers Context", "CrossModel", "SecurityContext", "Cross-model validation includes security context relationships.", 25),
    relationship("Platform-CrossModel", "Platform Integrity covers Cross-Model", "PlatformIntegrity", "CrossModel", "Platform integrity includes cross-model consistency.", 26),
  ]);

/** Canonical immutable validation relationship catalog. */
export const SecurityGatewayValidationRelationshipCatalog = Object.freeze({
  catalogId: "NEA-4:4/ValidationRelationshipCatalog",
  sourcePhase: "NEA-4:4" as const,
  relationships: SecurityGatewayValidationRelationships,
  relationshipCount: SecurityGatewayValidationRelationships.length,
  executesValidation: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
