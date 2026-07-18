/**
 * DKL-5:7 — Knowledge Validation Certification Readiness.
 *
 * Freeze-readiness determination derived from Certification results.
 * Metadata only. No side effects.
 *
 * Ownership: owned exclusively by DKL-5:7.
 */

import type { FreezeReadinessResult } from "./knowledgeValidationCertificationTypes.ts";

export const buildFreezeReadiness = (input: {
  readonly platformComplete: boolean;
  readonly platformReadyForCertification: boolean;
  readonly allMandatoryGatesPass: boolean;
  readonly overallCertified: boolean;
  readonly allRegressionChecksPass: boolean;
  readonly noOwnershipConflicts: boolean;
  readonly noDependencyViolations: boolean;
  readonly noCompatibilityFailures: boolean;
  readonly noExtensionPolicyFailures: boolean;
  readonly runtimeOrganizationalValidationProhibited: boolean;
  readonly numericScoringProhibited: boolean;
  readonly trustCalculationProhibited: boolean;
  readonly cleansingAndRemediationProhibited: boolean;
  readonly aiAndInferenceProhibited: boolean;
  readonly certificationMetadataFrozen: boolean;
  readonly publicArchitectureStable: boolean;
}): FreezeReadinessResult => {
  const readyForFreeze =
    input.platformComplete &&
    input.platformReadyForCertification &&
    input.allMandatoryGatesPass &&
    input.overallCertified &&
    input.allRegressionChecksPass &&
    input.noOwnershipConflicts &&
    input.noDependencyViolations &&
    input.noCompatibilityFailures &&
    input.noExtensionPolicyFailures &&
    input.runtimeOrganizationalValidationProhibited &&
    input.numericScoringProhibited &&
    input.trustCalculationProhibited &&
    input.cleansingAndRemediationProhibited &&
    input.aiAndInferenceProhibited &&
    input.certificationMetadataFrozen &&
    input.publicArchitectureStable;

  return Object.freeze({
    readinessId: "DKL-5:7/FreezeReadiness",
    status: readyForFreeze
      ? ("ReadyForFreeze" as const)
      : ("NotReady" as const),
    platformComplete: input.platformComplete,
    platformReadyForCertification: input.platformReadyForCertification,
    allMandatoryGatesPass: input.allMandatoryGatesPass,
    overallCertified: input.overallCertified,
    allRegressionChecksPass: input.allRegressionChecksPass,
    noOwnershipConflicts: input.noOwnershipConflicts,
    noDependencyViolations: input.noDependencyViolations,
    noCompatibilityFailures: input.noCompatibilityFailures,
    noExtensionPolicyFailures: input.noExtensionPolicyFailures,
    runtimeOrganizationalValidationProhibited:
      input.runtimeOrganizationalValidationProhibited,
    numericScoringProhibited: input.numericScoringProhibited,
    trustCalculationProhibited: input.trustCalculationProhibited,
    cleansingAndRemediationProhibited: input.cleansingAndRemediationProhibited,
    aiAndInferenceProhibited: input.aiAndInferenceProhibited,
    certificationMetadataFrozen: input.certificationMetadataFrozen,
    publicArchitectureStable: input.publicArchitectureStable,
    readyForFreeze,
    nextPhase: "DKL-5:8 — Knowledge Validation Freeze",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  });
};
