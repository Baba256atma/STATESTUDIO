import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import { createHardeningFinding } from "./findingHelpers.ts";
import type { ExecutiveFinalHardeningInput, ExecutiveWorkflowHardeningReview, StabilizationChecklistState } from "./finalHardeningTypes.ts";

function pass(condition: boolean, warning = false): StabilizationChecklistState {
  if (condition) return "verified";
  return warning ? "warning" : "blocked";
}

export function reviewExecutiveWorkflowHardening(input: ExecutiveFinalHardeningInput): ExecutiveWorkflowHardeningReview {
  const findings = [];
  const demo = input.demoPresentation;
  const dashboard = input.dashboard;
  const validation = input.validationSuite;
  if (!demo?.safety.safeToPresent) {
    findings.push(createHardeningFinding("executive_workflows", "critical", "Demo path is not safe to present.", "Executive workflows may expose unstable states.", 0.9, "Resolve demo safety controls before publication."));
  }
  if ((dashboard?.gaps.length ?? 0) > 0) {
    findings.push(createHardeningFinding("dashboard_systems", "warning", "Dashboard has unresolved readiness gaps.", "Executive clarity may be reduced.", 0.82, "Review dashboard gaps and confirm executive-facing explanations."));
  }
  if (validation && !validation.summary.validationPassed) {
    findings.push(createHardeningFinding("validation_systems", "critical", "Executive validation did not pass.", "Critical journeys are not hardened.", 0.94, "Resolve failed validation scenarios."));
  }

  return {
    reviewId: stableSignature(["d10-workflow-review", input.organizationId ?? "nexora-default"]).slice(0, 56),
    stability: pass(demo?.healthValidation.stabilityStatus === "available"),
    clarity: pass((dashboard?.executiveSummary.shouldHappenNext.length ?? 0) > 0, true),
    explainability: pass((input.launchGate?.explainability.supportingEvidence.length ?? 0) > 0, true),
    consistency: pass((input.launchGate?.blockers.length ?? 1) === 0),
    predictability: pass(demo?.successEvaluation.assessment === "pilot_ready" || demo?.successEvaluation.assessment === "demo_ready", true),
    confidenceVisibility: pass((input.launchGate?.scorecard.launchConfidence ?? 0) >= 0.75, true),
    findings: Object.freeze(findings),
    signature: stableSignature(["d10-workflow-review", findings.map((finding) => finding.signature), demo?.signature, dashboard?.signature]),
  };
}
