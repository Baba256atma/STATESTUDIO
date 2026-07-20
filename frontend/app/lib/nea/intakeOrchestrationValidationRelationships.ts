/**
 * NEA-7:4 — Intake Orchestration Validation Relationships.
 *
 * Immutable declarative relationships between validation categories.
 * No runtime validation execution.
 *
 * Ownership: owned exclusively by NEA-7:4.
 */

import type {
  IntakeOrchestrationValidationCategoryId,
  IntakeOrchestrationValidationRelationship,
} from "./intakeOrchestrationValidationTypes.ts";

const relationship = (
  key: string,
  relationshipName: string,
  sourceCategoryId: IntakeOrchestrationValidationCategoryId,
  targetCategoryId: IntakeOrchestrationValidationCategoryId,
  description: string,
  order: number,
): IntakeOrchestrationValidationRelationship =>
  Object.freeze({
    relationshipId: `NEA-7:4/ValidationRelationship/${key}`,
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
export const IntakeOrchestrationValidationRelationships: readonly IntakeOrchestrationValidationRelationship[] =
  Object.freeze([
    relationship("ExecutiveIntakePackage-IntakeIdentity", "Package depends on Intake Identity", "ExecutiveIntakePackage", "IntakeIdentity", "Package validation requires intake identity validation.", 1),
    relationship("ExecutiveIntakePackage-IntakeSource", "Package depends on Intake Source", "ExecutiveIntakePackage", "IntakeSource", "Package validation requires intake source validation.", 2),
    relationship("ExecutiveIntakePackage-IntakeContext", "Package depends on Intake Context", "ExecutiveIntakePackage", "IntakeContext", "Package validation requires intake context validation.", 3),
    relationship("ExecutiveIntakePackage-IntakeMetadata", "Package depends on Intake Metadata", "ExecutiveIntakePackage", "IntakeMetadata", "Package validation requires intake metadata validation.", 4),
    relationship("ExecutiveIntakePackage-MessageReference", "Package depends on Message Reference", "ExecutiveIntakePackage", "MessageReference", "Package validation requires message reference validation.", 5),
    relationship("ExecutiveIntakePackage-SessionReference", "Package depends on Session Reference", "ExecutiveIntakePackage", "SessionReference", "Package validation requires session reference validation.", 6),
    relationship("ExecutiveIntakePackage-ConversationReference", "Package depends on Conversation Reference", "ExecutiveIntakePackage", "ConversationReference", "Package validation requires conversation reference validation.", 7),
    relationship("ExecutiveIntakePackage-AuthenticationReference", "Package depends on Authentication Reference", "ExecutiveIntakePackage", "AuthenticationReference", "Package validation requires authentication reference validation.", 8),
    relationship("ExecutiveIntakePackage-RoutingReference", "Package depends on Routing Reference", "ExecutiveIntakePackage", "RoutingReference", "Package validation requires routing reference validation.", 9),
    relationship("ExecutiveIntakePackage-ConnectorReference", "Package depends on Connector Reference", "ExecutiveIntakePackage", "ConnectorReference", "Package validation requires connector reference validation.", 10),
    relationship("ExecutiveIntakePackage-WorkspaceReference", "Package depends on Workspace Reference", "ExecutiveIntakePackage", "WorkspaceReference", "Package validation requires workspace reference validation.", 11),
    relationship("ExecutiveIntakePackage-TenantReference", "Package depends on Tenant Reference", "ExecutiveIntakePackage", "TenantReference", "Package validation requires tenant reference validation.", 12),
    relationship("ExecutiveIntakePackage-CorrelationReference", "Package depends on Correlation Reference", "ExecutiveIntakePackage", "CorrelationReference", "Package validation requires correlation reference validation.", 13),
    relationship("CorrelationReference-TraceReference", "Correlation depends on Trace", "CorrelationReference", "TraceReference", "Correlation validation requires trace validation.", 14),
    relationship("ExecutiveIntakePackage-AttachmentReference", "Package depends on Attachment Reference", "ExecutiveIntakePackage", "AttachmentReference", "Package validation may require attachment reference validation.", 15),
    relationship("ExecutiveIntakePackage-IntakeConfiguration", "Package depends on Intake Configuration", "ExecutiveIntakePackage", "IntakeConfiguration", "Package validation requires intake configuration validation.", 16),
    relationship("ExecutiveIntakePackage-IntakeDiagnostics", "Package depends on Intake Diagnostics", "ExecutiveIntakePackage", "IntakeDiagnostics", "Package validation requires intake diagnostics validation.", 17),
    relationship("ExecutiveIntakePackage-IntakeResult", "Package depends on Intake Result", "ExecutiveIntakePackage", "IntakeResult", "Package validation requires intake result validation.", 18),
    relationship("IntakeSummary-ExecutiveIntakePackage", "Summary depends on Package", "IntakeSummary", "ExecutiveIntakePackage", "Summary validation requires executive intake package validation.", 19),
    relationship("IntakeSummary-IntakeResult", "Summary depends on Intake Result", "IntakeSummary", "IntakeResult", "Summary validation requires intake result validation.", 20),
    relationship("CrossModel-ExecutiveIntakePackage", "Cross-Model covers Package", "CrossModel", "ExecutiveIntakePackage", "Cross-model validation includes package relationships.", 21),
    relationship("CrossModel-IntakeSummary", "Cross-Model covers Summary", "CrossModel", "IntakeSummary", "Cross-model validation includes summary relationships.", 22),
    relationship("Platform-CrossModel", "Platform Integrity covers Cross-Model", "PlatformIntegrity", "CrossModel", "Platform integrity includes cross-model consistency.", 23),
    relationship("Platform-ExecutiveIntakePackage", "Platform Integrity covers Package", "PlatformIntegrity", "ExecutiveIntakePackage", "Platform integrity includes package composition integrity.", 24),
    relationship("Platform-IntakeSummary", "Platform Integrity covers Summary", "PlatformIntegrity", "IntakeSummary", "Platform integrity includes summary composition integrity.", 25),
  ]);

/** Canonical immutable validation relationship catalog. */
export const IntakeOrchestrationValidationRelationshipCatalog = Object.freeze({
  catalogId: "NEA-7:4/ValidationRelationshipCatalog",
  sourcePhase: "NEA-7:4" as const,
  relationships: IntakeOrchestrationValidationRelationships,
  relationshipCount: IntakeOrchestrationValidationRelationships.length,
  executesValidation: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
