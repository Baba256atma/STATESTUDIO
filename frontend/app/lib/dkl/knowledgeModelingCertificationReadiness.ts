/**
 * DKL-4:7 — Knowledge Modeling Certification Readiness.
 *
 * Freeze-readiness determination derived from Certification results.
 * Metadata only. No side effects.
 *
 * Ownership: owned exclusively by DKL-4:7.
 */

import type { FreezeReadinessResult } from "./knowledgeModelingCertificationTypes.ts";

export const buildFreezeReadiness = (input: {
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
}): FreezeReadinessResult => {
  const readyForFreeze =
    input.platformComplete &&
    input.platformReadyForCertification &&
    input.allMandatoryGatesPass &&
    input.overallCertified &&
    input.noOwnershipConflicts &&
    input.noDependencyViolations &&
    input.noCompatibilityFailures &&
    input.noRegressionFailures &&
    input.noRuntimeBehavior &&
    input.certificationMetadataFrozen &&
    input.publicArchitectureStable &&
    input.extensionPolicyControlled;

  return Object.freeze({
    readinessId: "DKL-4:7/FreezeReadiness",
    status: readyForFreeze ? ("ReadyForFreeze" as const) : ("NotReady" as const),
    platformComplete: input.platformComplete,
    platformReadyForCertification: input.platformReadyForCertification,
    allMandatoryGatesPass: input.allMandatoryGatesPass,
    overallCertified: input.overallCertified,
    noOwnershipConflicts: input.noOwnershipConflicts,
    noDependencyViolations: input.noDependencyViolations,
    noCompatibilityFailures: input.noCompatibilityFailures,
    noRegressionFailures: input.noRegressionFailures,
    noRuntimeBehavior: input.noRuntimeBehavior,
    certificationMetadataFrozen: input.certificationMetadataFrozen,
    publicArchitectureStable: input.publicArchitectureStable,
    extensionPolicyControlled: input.extensionPolicyControlled,
    readyForFreeze,
    nextPhase: "DKL-4:8 — Knowledge Modeling Freeze",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  });
};
