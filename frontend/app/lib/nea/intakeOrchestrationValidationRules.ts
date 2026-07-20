/**
 * NEA-7:4 — Intake Orchestration Validation Rules.
 *
 * Immutable declarative validation rules for NEA-7:3 domain models.
 * Metadata only. No validation engine.
 *
 * Ownership: owned exclusively by NEA-7:4.
 */

import {
  IntakeOrchestrationModelId,
  IntakeOrchestrationModelPlatform,
} from "./intakeOrchestrationModel.ts";
import type {
  IntakeOrchestrationValidationCategory,
  IntakeOrchestrationValidationCategoryId,
  IntakeOrchestrationValidationRule,
  IntakeOrchestrationValidationSeverity,
  IntakeOrchestrationValidationTarget,
} from "./intakeOrchestrationValidationTypes.ts";

const model = IntakeOrchestrationModelPlatform;

const category = (
  categoryId: IntakeOrchestrationValidationCategoryId,
  categoryName: string,
  description: string,
  targetModelKind: IntakeOrchestrationValidationTarget,
  order: number,
): IntakeOrchestrationValidationCategory =>
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

/**
 * Validation categories: exactly 20 matching Model kinds, plus CrossModel and
 * PlatformIntegrity. Domain category count remains 20.
 */
export const IntakeOrchestrationValidationCategories: readonly IntakeOrchestrationValidationCategory[] =
  Object.freeze([
    category("ExecutiveIntakePackage", "Executive Intake Package Validation", "Validate executive intake package composition and required references.", "ExecutiveIntakePackage", 1),
    category("IntakeIdentity", "Intake Identity Validation", "Validate intake identity completeness and uniqueness.", "IntakeIdentity", 2),
    category("IntakeSource", "Intake Source Validation", "Validate intake source structure — no channel execution.", "IntakeSource", 3),
    category("IntakeContext", "Intake Context Validation", "Validate intake context completeness and references.", "IntakeContext", 4),
    category("IntakeMetadata", "Intake Metadata Validation", "Validate intake metadata completeness and references.", "IntakeMetadata", 5),
    category("MessageReference", "Message Reference Validation", "Validate message references — no message duplication.", "MessageReference", 6),
    category("SessionReference", "Session Reference Validation", "Validate opaque session references — no session runtime.", "SessionReference", 7),
    category("ConversationReference", "Conversation Reference Validation", "Validate opaque conversation references — no conversation management.", "ConversationReference", 8),
    category("AuthenticationReference", "Authentication Reference Validation", "Validate authentication references — no authentication execution.", "AuthenticationReference", 9),
    category("RoutingReference", "Routing Reference Validation", "Validate routing references — no routing execution.", "RoutingReference", 10),
    category("ConnectorReference", "Connector Reference Validation", "Validate connector references — no connector runtime.", "ConnectorReference", 11),
    category("WorkspaceReference", "Workspace Reference Validation", "Validate workspace context references.", "WorkspaceReference", 12),
    category("TenantReference", "Tenant Reference Validation", "Validate tenant context references.", "TenantReference", 13),
    category("CorrelationReference", "Correlation Reference Validation", "Validate correlation identity and format — no correlation runtime.", "CorrelationReference", 14),
    category("TraceReference", "Trace Reference Validation", "Validate trace identity consistency — no runtime tracing.", "TraceReference", 15),
    category("AttachmentReference", "Attachment Reference Validation", "Validate attachment references — no file storage.", "AttachmentReference", 16),
    category("IntakeConfiguration", "Intake Configuration Validation", "Validate declarative intake configuration completeness.", "IntakeConfiguration", 17),
    category("IntakeDiagnostics", "Intake Diagnostics Validation", "Validate diagnostic metadata only — no diagnostic execution.", "IntakeDiagnostics", 18),
    category("IntakeResult", "Intake Result Validation", "Validate intake result declaration — no result processing.", "IntakeResult", 19),
    category("IntakeSummary", "Intake Summary Validation", "Validate summary composition and package references.", "IntakeSummary", 20),
    category("CrossModel", "Cross-Model Validation", "Declarative relationship validation across intake orchestration models.", "CrossModel", 21),
    category("PlatformIntegrity", "Platform Integrity Validation", "Validate canonical references, ownership, and immutable composition.", "Platform", 22),
  ]);

const rule = (
  key: string,
  ruleName: string,
  categoryId: IntakeOrchestrationValidationCategoryId,
  targetModelKind: IntakeOrchestrationValidationTarget,
  description: string,
  severity: IntakeOrchestrationValidationSeverity,
  order: number,
): IntakeOrchestrationValidationRule =>
  Object.freeze({
    ruleId: `NEA-7:4/Rule/${key}`,
    ruleName,
    categoryId,
    targetModelKind,
    description,
    severity,
    modelReference: `${IntakeOrchestrationModelId}/domainModels/${targetModelKind}`,
    validationIntent: "DeclarativeStructureOnly" as const,
    executionStatus: "None" as const,
    ownership: "NEA-7:4" as const,
    executesValidation: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly fifty-eight declarative validation rules.
 * 42 domain + 10 cross-model + 6 platform integrity.
 * All reference Model kinds. No rule executes validation.
 */
export const IntakeOrchestrationValidationRules: readonly IntakeOrchestrationValidationRule[] =
  Object.freeze([
    // ExecutiveIntakePackage — 8
    rule("ExecutiveIntakePackage-Identity", "Package Identity", "ExecutiveIntakePackage", "ExecutiveIntakePackage", "Executive intake package must declare package identity.", "Error", 1),
    rule("ExecutiveIntakePackage-CanonicalContract", "Canonical Package Contract", "ExecutiveIntakePackage", "ExecutiveIntakePackage", "Executive intake package must reference the canonical package contract.", "Error", 2),
    rule("ExecutiveIntakePackage-Composition", "Required Model Composition", "ExecutiveIntakePackage", "ExecutiveIntakePackage", "Executive intake package must compose required child models.", "Error", 3),
    rule("ExecutiveIntakePackage-ReferenceCompleteness", "Reference Completeness", "ExecutiveIntakePackage", "ExecutiveIntakePackage", "Executive intake package must declare required upstream references.", "Error", 4),
    rule("ExecutiveIntakePackage-MetadataCompleteness", "Metadata Completeness", "ExecutiveIntakePackage", "ExecutiveIntakePackage", "Executive intake package must declare complete metadata.", "Error", 5),
    rule("ExecutiveIntakePackage-ResultReference", "Result Reference", "ExecutiveIntakePackage", "ExecutiveIntakePackage", "Executive intake package must declare an intake result reference.", "Error", 6),
    rule("ExecutiveIntakePackage-SummaryCompatibility", "Summary Compatibility", "ExecutiveIntakePackage", "ExecutiveIntakePackage", "Executive intake package must remain compatible with intake summary.", "Error", 7),
    rule("ExecutiveIntakePackage-DklReadiness", "DKL Readiness Declaration", "ExecutiveIntakePackage", "ExecutiveIntakePackage", "Executive intake package may declare DKL readiness but must not invoke DKL.", "Info", 8),

    // IntakeIdentity — 7
    rule("IntakeIdentity-Completeness", "Identity Completeness", "IntakeIdentity", "IntakeIdentity", "Intake identity fields must be declared completely.", "Error", 9),
    rule("IntakeIdentity-Unique", "Identity Uniqueness", "IntakeIdentity", "IntakeIdentity", "Intake identity ids must be unique.", "Error", 10),
    rule("IntakeIdentity-CanonicalRegistry", "Canonical Registry Reference", "IntakeIdentity", "IntakeIdentity", "Intake identity must preserve canonical Registry references.", "Error", 11),
    rule("IntakeIdentity-Version", "Version Consistency", "IntakeIdentity", "IntakeIdentity", "Intake version must be consistent with declared identity version.", "Error", 12),
    rule("IntakeIdentity-Category", "Category Reference", "IntakeIdentity", "IntakeIdentity", "Intake identity must declare a category reference.", "Error", 13),
    rule("IntakeIdentity-Priority", "Priority Reference", "IntakeIdentity", "IntakeIdentity", "Intake identity must declare a priority reference.", "Error", 14),
    rule("IntakeIdentity-Status", "Status Reference", "IntakeIdentity", "IntakeIdentity", "Intake identity must declare a status reference.", "Error", 15),

    // IntakeSource — 2
    rule("IntakeSource-Structure", "Source Structure", "IntakeSource", "IntakeSource", "Intake source structure must be declared.", "Error", 16),
    rule("IntakeSource-Completeness", "Source Completeness", "IntakeSource", "IntakeSource", "Intake source fields must be declared completely.", "Error", 17),

    // IntakeContext — 3
    rule("IntakeContext-Completeness", "Context Completeness", "IntakeContext", "IntakeContext", "Intake context must be complete.", "Error", 18),
    rule("IntakeContext-Workspace", "Context Workspace Reference", "IntakeContext", "IntakeContext", "Intake context must declare a workspace reference.", "Error", 19),
    rule("IntakeContext-Tenant", "Context Tenant Reference", "IntakeContext", "IntakeContext", "Intake context must declare a tenant reference.", "Error", 20),

    // IntakeMetadata — 2
    rule("IntakeMetadata-Completeness", "Metadata Completeness", "IntakeMetadata", "IntakeMetadata", "Intake metadata structure must be complete.", "Error", 21),
    rule("IntakeMetadata-References", "Metadata References", "IntakeMetadata", "IntakeMetadata", "Intake metadata references must remain canonical.", "Error", 22),

    // MessageReference — 2
    rule("MessageReference-Presence", "Message Reference Presence", "MessageReference", "MessageReference", "Message reference must be present.", "Error", 23),
    rule("MessageReference-NonDuplication", "Message Non-Duplication", "MessageReference", "MessageReference", "Message reference must not embed duplicated message content.", "Error", 24),

    // Session / Conversation — 1 each
    rule("SessionReference-Opaque", "Session Reference Opaque", "SessionReference", "SessionReference", "Session reference must remain opaque — no session runtime.", "Error", 25),
    rule("ConversationReference-Opaque", "Conversation Reference Opaque", "ConversationReference", "ConversationReference", "Conversation reference must remain opaque — no conversation management.", "Error", 26),

    // Auth / Routing — 1 each
    rule("AuthenticationReference-ReferenceOnly", "Authentication Reference Only", "AuthenticationReference", "AuthenticationReference", "Authentication reference must remain declarative — no authentication execution.", "Error", 27),
    rule("RoutingReference-ReferenceOnly", "Routing Reference Only", "RoutingReference", "RoutingReference", "Routing reference must remain declarative — no routing execution.", "Error", 28),

    // Connector / Workspace / Tenant — 1 each
    rule("ConnectorReference-Canonical", "Connector Reference Canonical", "ConnectorReference", "ConnectorReference", "Connector reference must remain canonical.", "Error", 29),
    rule("WorkspaceReference-Canonical", "Workspace Reference Canonical", "WorkspaceReference", "WorkspaceReference", "Workspace reference must remain canonical.", "Error", 30),
    rule("TenantReference-Canonical", "Tenant Reference Canonical", "TenantReference", "TenantReference", "Tenant reference must remain canonical.", "Error", 31),

    // Correlation — 2
    rule("CorrelationReference-Identity", "Correlation Identity", "CorrelationReference", "CorrelationReference", "Correlation must declare a correlation identity.", "Error", 32),
    rule("CorrelationReference-Format", "Correlation Canonical Format", "CorrelationReference", "CorrelationReference", "Correlation reference format must remain canonical.", "Error", 33),

    // Trace — 1
    rule("TraceReference-Consistency", "Trace Consistency", "TraceReference", "TraceReference", "Trace metadata structure must be consistent.", "Error", 34),

    // Attachment — 2
    rule("AttachmentReference-Structure", "Attachment Reference Structure", "AttachmentReference", "AttachmentReference", "Attachment must declare a reference structure only.", "Error", 35),
    rule("AttachmentReference-Multiplicity", "Attachment Optional Multiplicity", "AttachmentReference", "AttachmentReference", "Attachment references may be zero or many — no file storage.", "Info", 36),

    // Configuration / Diagnostics — 1 each
    rule("IntakeConfiguration-Completeness", "Configuration Completeness", "IntakeConfiguration", "IntakeConfiguration", "Intake configuration completeness must be declared.", "Error", 37),
    rule("IntakeDiagnostics-MetadataOnly", "Diagnostics Metadata Only", "IntakeDiagnostics", "IntakeDiagnostics", "Intake diagnostics must remain metadata only.", "Error", 38),

    // IntakeResult — 2
    rule("IntakeResult-Identity", "Result Identity", "IntakeResult", "IntakeResult", "Intake result must declare result identity.", "Error", 39),
    rule("IntakeResult-Status", "Result Status Declaration", "IntakeResult", "IntakeResult", "Intake result must declare result status without runtime execution claims.", "Error", 40),

    // IntakeSummary — 2
    rule("IntakeSummary-PackageReference", "Summary Package Reference", "IntakeSummary", "IntakeSummary", "Intake summary must reference an executive intake package.", "Error", 41),
    rule("IntakeSummary-Composition", "Summary Composition", "IntakeSummary", "IntakeSummary", "Intake summary must compose package and result references.", "Error", 42),

    // Cross-model — 10
    rule("CrossModel-ExecutiveIntakePackageIdentity", "Cross-Model Package Identity", "CrossModel", "CrossModel", "ExecutiveIntakePackage ↔ IntakeIdentity relationship must remain consistent.", "Error", 43),
    rule("CrossModel-ExecutiveIntakePackageSource", "Cross-Model Package Source", "CrossModel", "CrossModel", "ExecutiveIntakePackage ↔ IntakeSource relationship must remain consistent.", "Error", 44),
    rule("CrossModel-ExecutiveIntakePackageContext", "Cross-Model Package Context", "CrossModel", "CrossModel", "ExecutiveIntakePackage ↔ IntakeContext relationship must remain consistent.", "Error", 45),
    rule("CrossModel-ExecutiveIntakePackageMessage", "Cross-Model Package Message", "CrossModel", "CrossModel", "ExecutiveIntakePackage ↔ MessageReference relationship must remain consistent.", "Error", 46),
    rule("CrossModel-ExecutiveIntakePackageSession", "Cross-Model Package Session", "CrossModel", "CrossModel", "ExecutiveIntakePackage ↔ SessionReference relationship must remain consistent.", "Error", 47),
    rule("CrossModel-ExecutiveIntakePackageConversation", "Cross-Model Package Conversation", "CrossModel", "CrossModel", "ExecutiveIntakePackage ↔ ConversationReference relationship must remain consistent.", "Error", 48),
    rule("CrossModel-ExecutiveIntakePackageAuthentication", "Cross-Model Package Authentication", "CrossModel", "CrossModel", "ExecutiveIntakePackage ↔ AuthenticationReference relationship must remain consistent.", "Error", 49),
    rule("CrossModel-ExecutiveIntakePackageRouting", "Cross-Model Package Routing", "CrossModel", "CrossModel", "ExecutiveIntakePackage ↔ RoutingReference relationship must remain consistent.", "Error", 50),
    rule("CrossModel-CorrelationTrace", "Cross-Model Correlation Trace", "CrossModel", "CrossModel", "CorrelationReference ↔ TraceReference relationship must remain consistent.", "Error", 51),
    rule("CrossModel-SummaryPackageResult", "Cross-Model Summary Package Result", "CrossModel", "CrossModel", "IntakeSummary ↔ ExecutiveIntakePackage and IntakeResult relationships must remain consistent.", "Error", 52),

    // Platform integrity — 6
    rule("Platform-CanonicalModelReferences", "Canonical Model Reference Integrity", "PlatformIntegrity", "Platform", "Canonical Model references must be preserved.", "Error", 53),
    rule("Platform-RegistryReferencePreservation", "Registry Reference Preservation", "PlatformIntegrity", "Platform", "Registry references preserved through Model must remain intact.", "Error", 54),
    rule("Platform-Ownership", "Ownership Integrity", "PlatformIntegrity", "Platform", "Ownership declarations must remain unique and immutable.", "Error", 55),
    rule("Platform-DuplicatePrevention", "Duplicate Prevention", "PlatformIntegrity", "Platform", "Duplicate validation rules and model values are forbidden.", "Error", 56),
    rule("Platform-RelationshipIntegrity", "Relationship Integrity", "PlatformIntegrity", "Platform", "Relationship integrity must be preserved.", "Error", 57),
    rule("Platform-ImmutableComposition", "Immutable Composition Integrity", "PlatformIntegrity", "Platform", "Immutable composition of Validation over Model must be preserved without reconstructing upstream architecture.", "Error", 58),
  ]);

const DOMAIN_CATEGORIES = IntakeOrchestrationValidationCategories.filter(
  (item) =>
    item.categoryId !== "CrossModel" &&
    item.categoryId !== "PlatformIntegrity",
);

const CROSS_MODEL_RULES = IntakeOrchestrationValidationRules.filter(
  (item) => item.categoryId === "CrossModel",
);

const PLATFORM_INTEGRITY_RULES = IntakeOrchestrationValidationRules.filter(
  (item) => item.categoryId === "PlatformIntegrity",
);

/** Model anchors proving rules target NEA-7:3 domain models. */
export const IntakeOrchestrationValidationModelAnchors = Object.freeze({
  modelId: IntakeOrchestrationModelId,
  sourcePhase: "NEA-7:4" as const,
  domainModelCount: model.domainModels.modelCount,
  intakeIdentityModelCount: model.domainModels.intakeIdentityModelCount,
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
export const IntakeOrchestrationValidationRuleCatalog = Object.freeze({
  catalogId: "NEA-7:4/ValidationRuleCatalog",
  sourcePhase: "NEA-7:4" as const,
  categories: IntakeOrchestrationValidationCategories,
  rules: IntakeOrchestrationValidationRules,
  categoryCount: IntakeOrchestrationValidationCategories.length,
  domainCategoryCount: DOMAIN_CATEGORIES.length,
  ruleCount: IntakeOrchestrationValidationRules.length,
  crossModelRuleCount: CROSS_MODEL_RULES.length,
  platformIntegrityRuleCount: PLATFORM_INTEGRITY_RULES.length,
  modelAnchors: IntakeOrchestrationValidationModelAnchors,
  executesValidation: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
