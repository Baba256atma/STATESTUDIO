/**
 * NEA-1:4 — Executive Gateway Validation Relationships.
 *
 * Immutable declarative relationships between validation categories.
 * No runtime validation execution.
 *
 * Ownership: owned exclusively by NEA-1:4.
 */

import type { ExecutiveGatewayValidationRelationship } from "./executiveGatewayValidationTypes.ts";

const relationship = (
  key: string,
  relationshipName: string,
  sourceCategoryId: ExecutiveGatewayValidationRelationship["sourceCategoryId"],
  targetCategoryId: ExecutiveGatewayValidationRelationship["targetCategoryId"],
  description: string,
  order: number,
): ExecutiveGatewayValidationRelationship =>
  Object.freeze({
    relationshipId: `NEA-1:4/ValidationRelationship/${key}`,
    relationshipName,
    sourceCategoryId,
    targetCategoryId,
    description,
    executesValidation: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical validation category relationships. */
export const ExecutiveGatewayValidationRelationships: readonly ExecutiveGatewayValidationRelationship[] =
  Object.freeze([
    relationship("Context-Tenant", "Context depends on Tenant", "Context", "Tenant", "Context validation requires tenant validation.", 1),
    relationship("Context-Workspace", "Context depends on Workspace", "Context", "Workspace", "Context validation requires workspace validation.", 2),
    relationship("Conversation-Session", "Conversation depends on Session", "Conversation", "Session", "Conversation validation requires session validation.", 3),
    relationship("Request-Identity", "Request depends on Identity", "Request", "Identity", "Request validation requires identity validation.", 4),
    relationship("Request-Sender", "Request depends on Sender", "Request", "Sender", "Request validation requires sender validation.", 5),
    relationship("Request-Context", "Request depends on Context", "Request", "Context", "Request validation requires context validation.", 6),
    relationship("Request-Session", "Request depends on Session", "Request", "Session", "Request validation requires session validation.", 7),
    relationship("Request-Conversation", "Request depends on Conversation", "Request", "Conversation", "Request validation requires conversation validation.", 8),
    relationship("Request-Authentication", "Request depends on Authentication", "Request", "Authentication", "Request validation requires authentication validation.", 9),
    relationship("Request-Authorization", "Request depends on Authorization", "Request", "Authorization", "Request validation requires authorization validation.", 10),
    relationship("Request-Trust", "Request depends on Trust", "Request", "Trust", "Request validation requires trust validation.", 11),
    relationship("Request-Consent", "Request depends on Consent", "Request", "Consent", "Request validation requires consent validation.", 12),
    relationship("Request-Payload", "Request depends on Payload", "Request", "Payload", "Request validation requires payload validation.", 13),
    relationship("Request-Attachment", "Request depends on Attachment", "Request", "Attachment", "Request validation may require attachment validation.", 14),
    relationship("Request-Metadata", "Request depends on Metadata", "Request", "Metadata", "Request validation requires metadata validation.", 15),
    relationship("Response-Request", "Response depends on Request", "Response", "Request", "Response validation requires request validation.", 16),
    relationship("Response-Routing", "Response depends on Routing", "Response", "Routing", "Response validation requires routing validation.", 17),
    relationship("Response-ValidationOutcome", "Response depends on Validation Outcome", "Response", "ValidationOutcome", "Response validation requires validation outcome validation.", 18),
    relationship("Response-Diagnostic", "Response depends on Diagnostic", "Response", "Diagnostic", "Response validation may require diagnostic validation.", 19),
    relationship("Response-ProcessingResult", "Response depends on Processing Result", "Response", "ProcessingResult", "Response validation requires processing result validation.", 20),
    relationship("CrossModel-Request", "Cross-Model covers Request", "CrossModel", "Request", "Cross-model validation includes request relationships.", 21),
    relationship("CrossModel-Response", "Cross-Model covers Response", "CrossModel", "Response", "Cross-model validation includes response relationships.", 22),
    relationship("Platform-CrossModel", "Platform Integrity covers Cross-Model", "PlatformIntegrity", "CrossModel", "Platform integrity includes cross-model consistency.", 23),
    relationship("Platform-Request", "Platform Integrity covers Request", "PlatformIntegrity", "Request", "Platform integrity includes request composition integrity.", 24),
    relationship("Platform-Response", "Platform Integrity covers Response", "PlatformIntegrity", "Response", "Platform integrity includes response composition integrity.", 25),
  ]);

/** Canonical immutable validation relationship catalog. */
export const ExecutiveGatewayValidationRelationshipCatalog = Object.freeze({
  catalogId: "NEA-1:4/ValidationRelationshipCatalog",
  sourcePhase: "NEA-1:4" as const,
  relationships: ExecutiveGatewayValidationRelationships,
  relationshipCount: ExecutiveGatewayValidationRelationships.length,
  executesValidation: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
