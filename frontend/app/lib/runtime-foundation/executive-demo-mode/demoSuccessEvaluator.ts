import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import { buildGuidedExecutiveJourney } from "./guidedExecutiveJourney.ts";
import { validateDemoHealth } from "./demoValidation.ts";
import type { DemoSuccessAssessment, DemoSuccessEvaluation, ExecutiveDemoModeInput } from "./executiveDemoModeTypes.ts";

function clampScore(value: number): number {
  return Math.max(0, Math.min(1, Number(value.toFixed(4))));
}

function assessmentFromScores(input: ExecutiveDemoModeInput, confidenceLevel: number, warnings: readonly string[]): DemoSuccessAssessment {
  if (input.mode === "disabled" || confidenceLevel < 0.55 || warnings.some((warning) => warning.includes("critical"))) {
    return "not_ready";
  }
  if (input.mode === "pilot_mode" && confidenceLevel >= 0.82 && input.launchGate?.state !== "blocked") {
    return "pilot_ready";
  }
  if (confidenceLevel >= 0.78 && warnings.length === 0) return "demo_ready";
  return "demo_ready_with_warnings";
}

export function evaluateDemoSuccess(input: ExecutiveDemoModeInput): DemoSuccessEvaluation {
  const journeys = buildGuidedExecutiveJourney(input);
  const health = validateDemoHealth(input);
  const presentationQuality = clampScore(
    0.35 +
      (input.dashboard?.healthSurface.status === "healthy" ? 0.25 : 0.1) +
      (health.workflowAvailability === "available" ? 0.2 : 0) +
      (health.scenarioIntegrity === "available" ? 0.2 : 0)
  );
  const workflowCoverage = clampScore(journeys.length === 0 ? 0 : journeys.filter((journey) => !journey.blocked).length / journeys.length);
  const pilotPreparedness = clampScore(
    0.25 +
      (input.mode === "pilot_mode" ? 0.15 : 0) +
      (input.validationSuite?.summary.validationPassed ? 0.25 : 0) +
      (input.launchGate?.state === "pilot_ready" || input.launchGate?.state === "release_candidate" ? 0.25 : 0) +
      (input.dashboard?.launchAssessment === "pilot_ready" || input.dashboard?.launchAssessment === "production_candidate" ? 0.1 : 0)
  );
  const warnings = health.warnings.map((warning) => `${warning.severity}: ${warning.description}`);
  const confidenceLevel = clampScore((presentationQuality + workflowCoverage + pilotPreparedness) / 3);
  const assessment = assessmentFromScores(input, confidenceLevel, warnings);

  return {
    assessment,
    presentationQuality,
    workflowCoverage,
    pilotPreparedness,
    confidenceLevel,
    warnings: Object.freeze(warnings),
    advisoryOnly: true,
    signature: stableSignature(["d10-demo-success", assessment, presentationQuality, workflowCoverage, pilotPreparedness, warnings]),
  };
}
