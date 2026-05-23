import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type { ExecutiveIntelligenceCertification, ExecutiveMVPCompletionInput, MVPCompletionScorecard } from "./mvpCompletionTypes.ts";

export function certifyExecutiveIntelligence(input: ExecutiveMVPCompletionInput, scorecard: MVPCompletionScorecard): ExecutiveIntelligenceCertification {
  const reliability = scorecard.validationScore >= 0.75 && scorecard.stabilityScore >= 0.75;
  const explainability = (input.launchGate?.explainability.supportingEvidence.length ?? 0) > 0;
  const trustworthiness = scorecard.trustScore >= 0.75;
  const stability = scorecard.stabilityScore >= 0.75;
  const operationalUsefulness = scorecard.readinessScore >= 0.75 && scorecard.pilotScore >= 0.65;
  const executiveUsability = input.demoPresentation?.successEvaluation.assessment === "pilot_ready" || input.demoPresentation?.successEvaluation.assessment === "demo_ready";
  const evidence = [
    `reliability:${reliability}`,
    `explainability:${explainability}`,
    `trustworthiness:${trustworthiness}`,
    `stability:${stability}`,
    `operationalUsefulness:${operationalUsefulness}`,
    `executiveUsability:${executiveUsability}`,
  ];
  const certified = reliability && explainability && trustworthiness && stability && operationalUsefulness && executiveUsability;
  return {
    certificationId: stableSignature(["d10-executive-certification", input.organizationId ?? "nexora-default"]).slice(0, 56),
    reliability,
    explainability,
    trustworthiness,
    stability,
    operationalUsefulness,
    executiveUsability,
    certified,
    evidence: Object.freeze(evidence),
    signature: stableSignature(["d10-executive-certification", evidence, certified]),
  };
}
