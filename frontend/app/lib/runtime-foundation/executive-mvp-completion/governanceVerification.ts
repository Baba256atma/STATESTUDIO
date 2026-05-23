import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type { ExecutiveMVPCompletionInput, GovernanceVerification } from "./mvpCompletionTypes.ts";

export function verifyFinalGovernance(input: ExecutiveMVPCompletionInput): GovernanceVerification {
  const checks = {
    readinessEvaluationsExist: Boolean(input.readinessSnapshot && input.dashboard),
    trustEvaluationsExist: Boolean(input.reliabilitySnapshot && input.dashboard),
    stabilityEvaluationsExist: Boolean(input.interactionSnapshot && input.dashboard),
    validationEvaluationsExist: Boolean(input.validationSuite),
    hardeningEvaluationsExist: Boolean(input.finalHardening),
    publicationAssessmentsExist: Boolean(input.launchGate && input.finalHardening),
  };
  const missingElements = Object.entries(checks)
    .filter(([, exists]) => !exists)
    .map(([key]) => key);
  return {
    ...checks,
    missingElements: Object.freeze(missingElements),
    signature: stableSignature(["d10-final-governance", checks, missingElements]),
  };
}
