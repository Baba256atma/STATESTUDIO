/**
 * DKL-1:7 — Data Knowledge Foundation Certification.
 *
 * Metadata-only type definitions and deterministic helpers for the DKL
 * Foundation certification platform. All evidence is derived from the official
 * public metadata of DKL-1:1 through DKL-1:6. No I/O, no reflection, no side
 * effects, no source or Git inspection.
 */

export type CertificationResult = "PASS" | "FAIL";

export type CertificationSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type CertificationDomain =
  | "foundation"
  | "registry"
  | "model"
  | "validation"
  | "manifest"
  | "platform"
  | "ownership"
  | "dependencies"
  | "public-api"
  | "immutability"
  | "determinism"
  | "metadata-only"
  | "runtime-free"
  | "compatibility"
  | "regression"
  | "freeze-readiness";

export type CertificationSourcePhase =
  | "DKL-1:1"
  | "DKL-1:2"
  | "DKL-1:3"
  | "DKL-1:4"
  | "DKL-1:5"
  | "DKL-1:6";

export type CertificationEvidenceValue = string | number | boolean;

export type CertificationEvidence = Readonly<Record<string, CertificationEvidenceValue>>;

export interface CertificationGateDescriptor {
  readonly id: string;
  readonly name: string;
  readonly domain: CertificationDomain;
  readonly description: string;
  readonly sourcePhases: readonly CertificationSourcePhase[];
  readonly severity: CertificationSeverity;
  readonly expected: string;
  readonly actual: string;
  readonly evidence: CertificationEvidence;
  readonly result: CertificationResult;
  readonly blocking: boolean;
}

export interface CertificationGateInput {
  readonly id: string;
  readonly name: string;
  readonly domain: CertificationDomain;
  readonly description: string;
  readonly sourcePhases: readonly CertificationSourcePhase[];
  readonly severity: CertificationSeverity;
  readonly expected: string;
  readonly actual: string;
  readonly evidence: CertificationEvidence;
  readonly condition: boolean;
}

export interface CertificationGuarantees {
  readonly metadataOnly: true;
  readonly runtimeFree: true;
  readonly deepFrozen: true;
  readonly deterministic: true;
  readonly publicApiStable: true;
  readonly ownershipProtected: true;
  readonly dependencyProtected: true;
  readonly manifestDriven: true;
  readonly canonicalReferencesPreserved: true;
  readonly readyForFreeze: true;
}

export interface CompatibilityCertificationDescriptor {
  readonly compatibilityId: "DKL-1:7-COMPAT";
  readonly certifiedPhases: readonly CertificationSourcePhase[];
  readonly dependencyCompatibility: readonly string[];
  readonly consumerCompatibility: readonly string[];
  readonly ownershipCompatibility: true;
  readonly publicApiCompatibility: true;
  readonly modelCompatibility: true;
  readonly validationCompatibility: true;
  readonly platformCompatibility: true;
  readonly guarantees: CertificationGuarantees;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface RegressionBaselineDescriptor {
  readonly foundationPublicApis: 7;
  readonly registryPublicApis: 8;
  readonly modelPublicApis: 8;
  readonly validationPublicApis: 8;
  readonly manifestPublicApis: 8;
  readonly platformPublicApis: 8;
  readonly totalPreCertificationApis: 47;
  readonly registryComponents: 5;
  readonly models: 4;
  readonly validationDomains: 5;
  readonly validationRules: 48;
  readonly manifestPhases: 4;
  readonly platformSections: 5;
}

export interface RegressionCertificationDescriptor {
  readonly regressionId: "DKL-1:7-REGRESSION";
  readonly foundationIdentityBaseline: Readonly<{
    layerId: string;
    version: string;
    namespace: string;
  }>;
  readonly ownershipBaseline: Readonly<{ ownedCount: number; nonOwnedCount: number }>;
  readonly dependencyBaseline: Readonly<{
    allowedCount: number;
    futureCount: number;
    forbiddenCount: number;
  }>;
  readonly baselines: RegressionBaselineDescriptor;
  readonly verified: boolean;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface CertificationManifestDescriptor {
  readonly certificationId: "DKL-1:7";
  readonly name: "Data Knowledge Foundation Certification";
  readonly namespace: "nexora.dkl.foundation.certification";
  readonly version: "1.0.0";
  readonly certifiedPhases: readonly CertificationSourcePhase[];
  readonly gateCount: number;
  readonly gateIds: readonly string[];
  readonly passedGates: number;
  readonly failedGates: number;
  readonly blockingFailures: number;
  readonly compatibilityCertification: CompatibilityCertificationDescriptor;
  readonly regressionCertification: RegressionCertificationDescriptor;
  readonly certificationStatus: "CERTIFIED";
  readonly stability: "STABLE";
  readonly readiness: "ReadyForFreeze";
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export interface CertificationMetadataDescriptor {
  readonly certificationId: "DKL-1:7";
  readonly name: "Data Knowledge Foundation Certification";
  readonly namespace: "nexora.dkl.foundation.certification";
  readonly version: "1.0.0";
  readonly certificationStatus: "CERTIFIED";
  readonly stability: "STABLE";
  readonly readiness: "ReadyForFreeze";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface CertificationSummaryDescriptor {
  readonly certificationId: "DKL-1:7";
  readonly totalGates: number;
  readonly passedGates: number;
  readonly failedGates: number;
  readonly blockingFailures: number;
  readonly certificationStatus: "CERTIFIED" | "FAILED";
  readonly stability: "STABLE";
  readonly readiness: "ReadyForFreeze" | "NotReady";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DataKnowledgeFoundationCertificationDescriptor {
  readonly metadata: CertificationMetadataDescriptor;
  readonly gates: readonly CertificationGateDescriptor[];
  readonly compatibility: CompatibilityCertificationDescriptor;
  readonly regression: RegressionCertificationDescriptor;
  readonly manifest: CertificationManifestDescriptor;
  readonly summary: CertificationSummaryDescriptor;
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

/**
 * Build a frozen, deterministic certification gate from static metadata.
 * A gate is blocking whenever its severity is CRITICAL.
 */
export const createCertificationGate = (input: CertificationGateInput): CertificationGateDescriptor =>
  Object.freeze({
    id: input.id,
    name: input.name,
    domain: input.domain,
    description: input.description,
    sourcePhases: Object.freeze([...input.sourcePhases]),
    severity: input.severity,
    expected: input.expected,
    actual: input.actual,
    evidence: Object.freeze({ ...input.evidence }),
    result: input.condition ? ("PASS" as const) : ("FAIL" as const),
    blocking: input.severity === "CRITICAL",
  });

/**
 * Deterministic deep-frozen predicate over plain metadata structures.
 * Reads only enumerable own values; performs no reflection over source code.
 */
export const isDeeplyFrozen = (value: unknown): boolean => {
  if (value === null || typeof value !== "object") {
    return true;
  }
  if (!Object.isFrozen(value)) {
    return false;
  }
  for (const nested of Object.values(value as Record<string, unknown>)) {
    if (!isDeeplyFrozen(nested)) {
      return false;
    }
  }
  return true;
};
