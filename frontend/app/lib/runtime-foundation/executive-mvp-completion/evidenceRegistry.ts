import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import type { CompletionEvidenceItem, ExecutiveMVPCompletionInput } from "./mvpCompletionTypes.ts";

function evidence(category: CompletionEvidenceItem["category"], source: string, description: string, supportsPublication: boolean, confidence: number): CompletionEvidenceItem {
  const safeConfidence = Number.isFinite(confidence) ? confidence : 0.5;
  const clamped = Math.max(0, Math.min(1, Number(safeConfidence.toFixed(4))));
  return {
    evidenceId: stableSignature(["d10-completion-evidence", category, source, description]).slice(0, 56),
    category,
    source,
    description,
    supportsPublication,
    confidence: clamped,
    signature: stableSignature(["d10-completion-evidence", category, source, description, supportsPublication, clamped]),
  };
}

export function buildCompletionEvidenceRegistry(input: ExecutiveMVPCompletionInput): readonly CompletionEvidenceItem[] {
  const items: CompletionEvidenceItem[] = [];
  if (input.readinessSnapshot) items.push(evidence("readiness", "strategic_readiness", `Readiness: ${input.readinessSnapshot.isNexoraReady ? "ready" : "not_ready"}`, input.readinessSnapshot.isNexoraReady, 0.86));
  if (input.reliabilitySnapshot) items.push(evidence("trust", "executive_reliability", `Trust score: ${input.reliabilitySnapshot.summary.trustScore}`, input.reliabilitySnapshot.summary.trustScore >= 0.75, input.reliabilitySnapshot.summary.trustScore));
  if (input.interactionSnapshot) items.push(evidence("stability", "interaction_stability", `Interaction: ${input.interactionSnapshot.summary.interfaceStable ? "stable" : "unstable"}`, input.interactionSnapshot.summary.interfaceStable, input.interactionSnapshot.summary.interfaceStable ? 0.86 : 0.42));
  if (input.dashboard) items.push(evidence("governance", "readiness_dashboard", `Dashboard: ${input.dashboard.launchAssessment}`, input.dashboard.launchAssessment === "production_candidate" || input.dashboard.launchAssessment === "pilot_ready", input.dashboard.healthSurface.confidence));
  if (input.validationSuite) items.push(evidence("validation", "validation_suite", `Validation: ${input.validationSuite.state}`, input.validationSuite.summary.validationPassed, input.validationSuite.coverage.coverageScore));
  if (input.launchGate) items.push(evidence("governance", "launch_gate", `Launch gate: ${input.launchGate.state}`, input.launchGate.state === "release_candidate" || input.launchGate.state === "pilot_ready", input.launchGate.scorecard.launchConfidence));
  if (input.demoPresentation) items.push(evidence("demo", "demo_mode", `Demo: ${input.demoPresentation.successEvaluation.assessment}`, input.demoPresentation.safety.safeToPresent, input.demoPresentation.successEvaluation.confidenceLevel));
  if (input.feedbackLearning) items.push(evidence("pilot_learning", "feedback_learning", `Pilot success: ${input.feedbackLearning.success.evaluation}`, input.feedbackLearning.success.evaluation === "successful" || input.feedbackLearning.success.evaluation === "highly_successful", input.feedbackLearning.success.executiveSatisfactionScore));
  if (input.finalHardening) items.push(evidence("hardening", "final_hardening", `Hardening: ${input.finalHardening.classification}`, input.finalHardening.summary.isProductionCandidate, input.finalHardening.riskInventory.length === 0 ? 0.9 : 0.72));
  return Object.freeze(items);
}
