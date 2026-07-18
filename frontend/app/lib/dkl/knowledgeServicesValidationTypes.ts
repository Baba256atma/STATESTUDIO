/**
 * DKL-7:4 — Knowledge Services Validation Types.
 *
 * Readonly contracts for architectural validation of DKL-7:1–7:3.
 * Metadata-only. No runtime request/response validation.
 *
 * Ownership: owned exclusively by DKL-7:4.
 */

export type KnowledgeServicesValidationRuleStatus =
  | "Pass"
  | "Fail"
  | "NotApplicable";

export type KnowledgeServicesValidationSeverity =
  | "Critical"
  | "High"
  | "Medium"
  | "Low"
  | "Informational";

export type KnowledgeServicesValidationGroupId =
  | "Identity"
  | "Dependency"
  | "Foundation"
  | "Registry"
  | "ModelStructure"
  | "RequestModels"
  | "ResponseModels"
  | "ResultModels"
  | "ContextAndReferenceModels"
  | "Relationships"
  | "Ownership"
  | "Boundaries"
  | "Immutability"
  | "RuntimeProhibitions"
  | "Readiness";

export type KnowledgeServicesValidationRuleId =
  | "KS-V-ID-001"
  | "KS-V-ID-002"
  | "KS-V-ID-003"
  | "KS-V-ID-004"
  | "KS-V-DEP-001"
  | "KS-V-DEP-002"
  | "KS-V-DEP-003"
  | "KS-V-DEP-004"
  | "KS-V-FND-001"
  | "KS-V-FND-002"
  | "KS-V-REG-001"
  | "KS-V-REG-002"
  | "KS-V-REG-003"
  | "KS-V-REG-004"
  | "KS-V-REG-005"
  | "KS-V-MOD-001"
  | "KS-V-MOD-002"
  | "KS-V-MOD-003"
  | "KS-V-MOD-004"
  | "KS-V-REQ-001"
  | "KS-V-REQ-002"
  | "KS-V-REQ-003"
  | "KS-V-REQ-004"
  | "KS-V-REQ-005"
  | "KS-V-RES-001"
  | "KS-V-RES-002"
  | "KS-V-RES-003"
  | "KS-V-RES-004"
  | "KS-V-RSL-001"
  | "KS-V-RSL-002"
  | "KS-V-RSL-003"
  | "KS-V-RSL-004"
  | "KS-V-RSL-005"
  | "KS-V-CTX-001"
  | "KS-V-CTX-002"
  | "KS-V-CTX-003"
  | "KS-V-REL-001"
  | "KS-V-REL-002"
  | "KS-V-REL-003"
  | "KS-V-OWN-001"
  | "KS-V-OWN-002"
  | "KS-V-BND-001"
  | "KS-V-BND-002"
  | "KS-V-IMM-001"
  | "KS-V-IMM-002"
  | "KS-V-RUN-001"
  | "KS-V-RUN-002"
  | "KS-V-RDY-001";

export interface KnowledgeServicesValidationIdentity {
  readonly validationId: "DKL-7:4/KnowledgeServicesValidation";
  readonly validationName: "Knowledge Services Validation";
  readonly validationVersion: string;
  readonly validationNamespace: "nexora.dkl.knowledge-services.validation";
  readonly layer: "Data Knowledge Layer";
  readonly phase: "DKL-7";
  readonly stage: "Validation";
  readonly sourcePhase: "DKL-7:4";
  readonly owner: string;
  readonly status: "ValidationComplete";
  readonly overallResult: "Pass";
  readonly readiness: "ReadyForManifest";
  readonly modelId: string;
  readonly modelVersion: string;
  readonly registryId: string;
  readonly foundationId: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface KnowledgeServicesValidationMetadata {
  readonly metadataId: "DKL-7:4/KnowledgeServicesValidationMetadata";
  readonly validationId: "DKL-7:4/KnowledgeServicesValidation";
  readonly description: string;
  readonly metadataOnly: true;
  readonly declarationOnly: true;
  readonly runtimeValidation: false;
  readonly sourceInspection: false;
  readonly reflection: false;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface KnowledgeServicesValidationGroup {
  readonly groupId: KnowledgeServicesValidationGroupId;
  readonly name: string;
  readonly description: string;
  readonly ruleCount: number;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
}

export interface KnowledgeServicesValidationEvidence {
  readonly evidenceId: string;
  readonly name: string;
  readonly subject: string;
  readonly observedValue: string;
  readonly sourceReference: string;
  readonly metadataOnly: true;
  readonly runtimeLog: false;
  readonly networkResponse: false;
  readonly databaseQuery: false;
  readonly sourceScanning: false;
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesValidationEvidenceReference {
  readonly evidenceId: string;
  readonly role: string;
}

export interface KnowledgeServicesValidationRule {
  readonly ruleId: KnowledgeServicesValidationRuleId;
  readonly name: string;
  readonly description: string;
  readonly group: KnowledgeServicesValidationGroupId;
  readonly severity: KnowledgeServicesValidationSeverity;
  readonly subject: string;
  readonly expectedCondition: string;
  readonly actualEvidence: string;
  readonly status: KnowledgeServicesValidationRuleStatus;
  readonly evidenceReferences: readonly KnowledgeServicesValidationEvidenceReference[];
  readonly failureImpact: string;
  readonly readinessRelevance: true;
  readonly runtimeCallback: false;
  readonly executablePredicate: false;
  readonly metadataOnly: true;
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesValidationRuleResult {
  readonly resultId: string;
  readonly ruleId: KnowledgeServicesValidationRuleId;
  readonly status: KnowledgeServicesValidationRuleStatus;
  readonly severity: KnowledgeServicesValidationSeverity;
  readonly evidenceReferences: readonly string[];
  readonly message: string;
  readonly metadataOnly: true;
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesValidationFinding {
  readonly findingId: string;
  readonly severity: KnowledgeServicesValidationSeverity;
  readonly ruleId: KnowledgeServicesValidationRuleId;
  readonly message: string;
  readonly metadataOnly: true;
}

export interface KnowledgeServicesValidationInventory {
  readonly inventoryId: "DKL-7:4/KnowledgeServicesValidationInventory";
  readonly groupCount: 15;
  readonly ruleCount: 48;
  readonly evidenceCount: number;
  readonly resultCount: 48;
  readonly passCount: number;
  readonly failCount: number;
  readonly notApplicableCount: number;
  readonly findingCount: number;
  readonly guaranteeCount: 16;
  readonly modelInventoryCount: number;
  readonly modelRelationshipCount: number;
  readonly registryServiceCount: number;
  readonly registryCapabilityCount: number;
  readonly registryContractCount: number;
  readonly prohibitedSurfaceCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface KnowledgeServicesValidationGuarantee {
  readonly guaranteeId: string;
  readonly statement: string;
  readonly status: true;
  readonly deterministicOrder: number;
}

export interface KnowledgeServicesValidationDependencyReference {
  readonly directPreviousPhaseModule: "knowledgeServicesModel.ts";
  readonly modelId: string;
  readonly registryReachedThroughModel: true;
  readonly foundationReachedThroughRegistry: true;
  readonly dkl6DirectImport: false;
  readonly registryDirectImport: false;
  readonly foundationDirectImport: false;
  readonly metadataOnly: true;
}

export interface KnowledgeServicesValidationSummary {
  readonly validationId: "DKL-7:4/KnowledgeServicesValidation";
  readonly version: string;
  readonly status: "ValidationComplete";
  readonly overallResult: "Pass" | "Fail";
  readonly readiness: "ReadyForManifest" | "Blocked";
  readonly modelId: string;
  readonly registryId: string;
  readonly foundationId: string;
  readonly groupCount: number;
  readonly ruleCount: number;
  readonly evidenceCount: number;
  readonly resultCount: number;
  readonly passCount: number;
  readonly failCount: number;
  readonly notApplicableCount: number;
  readonly findingCount: number;
  readonly guaranteeCount: number;
  readonly modelInventoryCount: number;
  readonly requestModelCount: number;
  readonly responseModelCount: number;
  readonly resultModelCount: number;
  readonly contextModelCount: number;
  readonly referenceModelCount: number;
  readonly graphModelCount: number;
  readonly relationshipCount: number;
  readonly serviceCount: number;
  readonly capabilityCount: number;
  readonly contractCount: number;
  readonly accessModeCount: number;
  readonly mutationModeCount: number;
  readonly prohibitedSurfaceCount: number;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface KnowledgeServicesValidationReadiness {
  readonly readiness: "ReadyForManifest" | "Blocked";
  readonly allRulesPassed: boolean;
  readonly criticalFailures: 0 | number;
  readonly highFailures: 0 | number;
  readonly failCount: number;
  readonly modelStatus: string;
  readonly modelReadiness: string;
  readonly validationStatus: "ValidationComplete" | "Incomplete";
  readonly metadataOnly: true;
}
