import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import { createHardeningFinding } from "./findingHelpers.ts";
import type { ExecutiveFinalHardeningInput, ProductionHardeningAssessment } from "./finalHardeningTypes.ts";

export function assessProductionHardening(input: ExecutiveFinalHardeningInput): ProductionHardeningAssessment {
  const unstablePaths: string[] = [];
  const incompleteWorkflows: string[] = [];
  const weakValidations: string[] = [];
  const ambiguousOutputs: string[] = [];
  const fragileInteractions: string[] = [];
  const missingSafeguards: string[] = [];
  const weakConfidenceVisibility: string[] = [];
  const findings = [];

  if (!input.demoPresentation?.safety.safeToPresent) unstablePaths.push("executive_demo_path");
  if ((input.demoPresentation?.journeys.some((journey) => journey.blocked) ?? true)) incompleteWorkflows.push("guided_executive_journeys");
  if (!input.validationSuite?.summary.validationPassed) weakValidations.push("executive_runtime_validation");
  if ((input.dashboard?.gaps.length ?? 0) > 0) ambiguousOutputs.push("executive_readiness_gaps");
  if (input.dashboard?.interactionStability !== "healthy") fragileInteractions.push("interaction_stability");
  if (!input.launchGate || input.launchGate.blockers.length > 0) missingSafeguards.push("launch_gate_clearance");
  if ((input.launchGate?.scorecard.launchConfidence ?? 0) < 0.75) weakConfidenceVisibility.push("launch_confidence");

  for (const description of [...unstablePaths, ...incompleteWorkflows, ...weakValidations, ...ambiguousOutputs, ...fragileInteractions, ...missingSafeguards, ...weakConfidenceVisibility]) {
    findings.push(createHardeningFinding("executive_workflows", description.includes("validation") ? "critical" : "warning", description.replace(/_/g, " "), "Production candidate confidence is reduced.", 0.84, "Review and resolve before final MVP publication."));
  }

  return {
    assessmentId: stableSignature(["d10-hardening-assessment", input.organizationId ?? "nexora-default"]).slice(0, 56),
    unstablePaths: Object.freeze(unstablePaths),
    incompleteWorkflows: Object.freeze(incompleteWorkflows),
    weakValidations: Object.freeze(weakValidations),
    ambiguousOutputs: Object.freeze(ambiguousOutputs),
    fragileInteractions: Object.freeze(fragileInteractions),
    missingSafeguards: Object.freeze(missingSafeguards),
    weakConfidenceVisibility: Object.freeze(weakConfidenceVisibility),
    findings: Object.freeze(findings),
    signature: stableSignature(["d10-hardening-assessment", unstablePaths, incompleteWorkflows, weakValidations, ambiguousOutputs, fragileInteractions, missingSafeguards, weakConfidenceVisibility]),
  };
}
