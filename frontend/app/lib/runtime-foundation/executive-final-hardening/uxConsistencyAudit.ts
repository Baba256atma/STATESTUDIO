import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import { createHardeningFinding } from "./findingHelpers.ts";
import type { ExecutiveFinalHardeningInput, StabilizationChecklistState, UXConsistencyAudit } from "./finalHardeningTypes.ts";

function state(ok: boolean, warn = false): StabilizationChecklistState {
  return ok ? "verified" : warn ? "warning" : "blocked";
}

export function auditUXConsistency(input: ExecutiveFinalHardeningInput): UXConsistencyAudit {
  const findings = [];
  const feedback = input.feedbackLearning;
  const dashboard = input.dashboard;
  const confusion = feedback?.insights.confusionSources.filter((source) => !source.includes("No recurring")).length ?? 0;
  if (confusion > 0) {
    findings.push(createHardeningFinding("pilot_systems", "warning", "Pilot feedback includes recurring confusion sources.", "Executive UX consistency may require refinement.", 0.82, "Review terminology, navigation, and onboarding explanations."));
  }

  return {
    auditId: stableSignature(["d10-ux-audit", input.organizationId ?? "nexora-default"]).slice(0, 56),
    panelConsistency: state(input.demoPresentation?.safety.safeToPresent === true, true),
    terminologyConsistency: state(confusion === 0, true),
    navigationConsistency: state(confusion === 0, true),
    workflowConsistency: state(input.validationSuite?.summary.validationPassed === true),
    executiveClarity: state((dashboard?.executiveSummary.shouldHappenNext.length ?? 0) > 0, true),
    interactionExpectations: state(input.demoPresentation?.healthValidation.scenarioIntegrity === "available", true),
    findings: Object.freeze(findings),
    signature: stableSignature(["d10-ux-audit", confusion, dashboard?.signature, feedback?.signature, findings.map((finding) => finding.signature)]),
  };
}
