/**
 * DKL-4:7 — Knowledge Modeling Certification Types.
 *
 * Readonly contracts for the canonical immutable Certification layer.
 * Metadata only. No runtime behavior.
 *
 * Ownership: owned exclusively by DKL-4:7.
 */

export type CertificationGateResult = "Pass" | "Fail" | "NotApplicable";
export type CertificationSeverity = "Critical" | "High" | "Medium";
export type CertificationOverallStatus = "Certified" | "Failed" | "NotReady";
export type CertificationReadinessStatus = "ReadyForFreeze" | "NotReady";

export type CertificationCategory =
  | "Identity"
  | "Foundation"
  | "Registry"
  | "Model"
  | "Validation"
  | "Manifest"
  | "Platform"
  | "Ownership"
  | "Dependencies"
  | "Compatibility"
  | "Extension"
  | "Immutability"
  | "Determinism"
  | "Runtime Prohibition"
  | "Regression Protection"
  | "Freeze Readiness";

export interface KnowledgeModelingCertificationIdentityDescriptor {
  readonly certificationId: string;
  readonly certificationVersion: string;
  readonly certificationName: string;
  readonly certificationNamespace: string;
  readonly platformId: "DKL-4";
  readonly platformVersion: string;
  readonly owner: string;
  readonly sourcePhase: "DKL-4:7";
  readonly status: "Certified";
  readonly readiness: "ReadyForFreeze";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface CertificationGateDefinition {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: CertificationCategory;
  readonly severity: CertificationSeverity;
  readonly source: string;
  readonly requirement: string;
  readonly evidenceTarget: string;
  readonly expectedCondition: string;
  readonly failureMeaning: string;
  readonly ownership: string;
  readonly deterministic: true;
  readonly mandatory: true;
}

export interface CertificationGateEvaluation {
  readonly gateId: string;
  readonly name: string;
  readonly category: CertificationCategory;
  readonly severity: CertificationSeverity;
  readonly mandatory: true;
  readonly result: CertificationGateResult;
  readonly expected: string;
  readonly observed: string;
  readonly evidenceId: string;
}

export interface CertificationEvidenceRecord {
  readonly evidenceId: string;
  readonly gateId: string;
  readonly sourceComponent: string;
  readonly sourcePhase: string;
  readonly inspectedMetadata: string;
  readonly expectedValue: string;
  readonly observedValue: string;
  readonly result: CertificationGateResult;
  readonly deterministic: true;
  readonly evidenceOwnership: string;
}

export interface CertificationCategoryResult {
  readonly category: CertificationCategory;
  readonly gateCount: number;
  readonly passCount: number;
  readonly failCount: number;
  readonly notApplicableCount: number;
  readonly allMandatoryPass: boolean;
}

export interface CertificationFailure {
  readonly gateId: string;
  readonly name: string;
  readonly category: CertificationCategory;
  readonly severity: CertificationSeverity;
  readonly expected: string;
  readonly observed: string;
  readonly failureMeaning: string;
}

export interface CertificationSummaryDescriptor {
  readonly certificationId: string;
  readonly version: string;
  readonly namespace: string;
  readonly phase: "DKL-4:7";
  readonly status: CertificationOverallStatus;
  readonly readiness: CertificationReadinessStatus;
  readonly gateCount: number;
  readonly mandatoryGateCount: number;
  readonly passCount: number;
  readonly failCount: number;
  readonly categoryCount: number;
  readonly evidenceCount: number;
  readonly regressionCheckCount: number;
  readonly regressionPassCount: number;
  readonly allMandatoryGatesPass: boolean;
  readonly allRegressionChecksPass: boolean;
  readonly readyForFreeze: boolean;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface CertificationResult {
  readonly certificationId: string;
  readonly status: CertificationOverallStatus;
  readonly readiness: CertificationReadinessStatus;
  readonly gateResults: readonly CertificationGateEvaluation[];
  readonly categoryResults: readonly CertificationCategoryResult[];
  readonly evidence: readonly CertificationEvidenceRecord[];
  readonly failures: readonly CertificationFailure[];
  readonly passCount: number;
  readonly failCount: number;
  readonly mandatoryGateCount: number;
  readonly allMandatoryGatesPass: boolean;
  readonly regressionPassCount: number;
  readonly regressionCheckCount: number;
  readonly allRegressionChecksPass: boolean;
  readonly readyForFreeze: boolean;
  readonly metadataOnly: true;
  readonly inputMutated: false;
  readonly repaired: false;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface FreezeReadinessResult {
  readonly readinessId: string;
  readonly status: CertificationReadinessStatus;
  readonly platformComplete: boolean;
  readonly platformReadyForCertification: boolean;
  readonly allMandatoryGatesPass: boolean;
  readonly overallCertified: boolean;
  readonly noOwnershipConflicts: boolean;
  readonly noDependencyViolations: boolean;
  readonly noCompatibilityFailures: boolean;
  readonly noRegressionFailures: boolean;
  readonly noRuntimeBehavior: boolean;
  readonly certificationMetadataFrozen: boolean;
  readonly publicArchitectureStable: boolean;
  readonly extensionPolicyControlled: boolean;
  readonly readyForFreeze: boolean;
  readonly nextPhase: "DKL-4:8 — Knowledge Modeling Freeze";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}
