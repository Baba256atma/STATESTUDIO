import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import { createHardeningFinding } from "./findingHelpers.ts";
import type { ExecutiveFinalHardeningInput, RuntimeReliabilityVerification, StabilizationChecklistState } from "./finalHardeningTypes.ts";

function state(ok: boolean, warn = false): StabilizationChecklistState {
  return ok ? "verified" : warn ? "warning" : "blocked";
}

export function verifyRuntimeReliability(input: ExecutiveFinalHardeningInput): RuntimeReliabilityVerification {
  const findings = [];
  const demo = input.demoPresentation;
  const dashboard = input.dashboard;
  if (dashboard?.interactionStability === "degraded" || dashboard?.interactionStability === "critical") {
    findings.push(createHardeningFinding("stability_systems", "critical", "Interaction stability is not healthy.", "Context and workflow continuity may degrade.", 0.9, "Stabilize interaction state before publication."));
  }
  if (dashboard?.runtimeTrust === "degraded" || dashboard?.runtimeTrust === "critical") {
    findings.push(createHardeningFinding("trust_systems", "critical", "Runtime trust is degraded.", "Executives may not trust recommendations.", 0.9, "Resolve trust classifications before publication."));
  }

  return {
    verificationId: stableSignature(["d10-runtime-verification", input.organizationId ?? "nexora-default"]).slice(0, 56),
    stateConsistency: state(dashboard?.healthSurface.status === "healthy", dashboard?.healthSurface.status === "warning"),
    contextPreservation: state(demo?.healthValidation.scenarioIntegrity === "available", true),
    workflowContinuity: state(demo?.healthValidation.workflowAvailability === "available", true),
    interactionStability: state(dashboard?.interactionStability === "healthy", dashboard?.interactionStability === "warning"),
    confidencePropagation: state((input.launchGate?.scorecard.launchConfidence ?? 0) >= 0.75, true),
    trustPropagation: state(dashboard?.runtimeTrust === "healthy", dashboard?.runtimeTrust === "warning"),
    recommendationConsistency: state((input.launchGate?.blockers.length ?? 1) === 0),
    findings: Object.freeze(findings),
    signature: stableSignature(["d10-runtime-verification", dashboard?.signature, demo?.signature, findings.map((finding) => finding.signature)]),
  };
}
