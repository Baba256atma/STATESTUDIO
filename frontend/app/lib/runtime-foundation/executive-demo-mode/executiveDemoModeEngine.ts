import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import { buildDemoModeRuntimeState } from "./demoModeState.ts";
import { evaluateDemoSafetyControls } from "./demoSafetyControls.ts";
import { buildGuidedExecutiveJourney } from "./guidedExecutiveJourney.ts";
import { buildExecutivePresentationSnapshot } from "./presentationSnapshot.ts";
import { buildPilotPresentationPlan } from "./pilotPresentation.ts";
import { validateDemoHealth } from "./demoValidation.ts";
import { generateExecutiveDemoNarrative } from "./executiveNarrative.ts";
import { evaluateDemoSuccess } from "./demoSuccessEvaluator.ts";
import type { ExecutiveDemoModeInput, ExecutiveDemoModePresentation } from "./executiveDemoModeTypes.ts";

export function buildExecutiveDemoModePresentation(input: ExecutiveDemoModeInput): ExecutiveDemoModePresentation {
  const organizationId =
    input.organizationId?.trim() ||
    input.dashboard?.organizationId ||
    input.validationSuite?.organizationId ||
    input.launchGate?.organizationId ||
    "nexora-default";
  const generatedAt = input.now ?? Date.now();
  const runtimeState = buildDemoModeRuntimeState({ ...input, organizationId, now: generatedAt });
  const normalizedInput: ExecutiveDemoModeInput = {
    ...input,
    organizationId,
    audience: runtimeState.audience,
    activeJourneyId: runtimeState.activeJourneyId,
    requestedJourneyIds: runtimeState.allowedJourneyIds.length > 0 ? runtimeState.allowedJourneyIds : input.requestedJourneyIds,
    now: generatedAt,
  };
  const safety = evaluateDemoSafetyControls(normalizedInput);
  const journeys = buildGuidedExecutiveJourney(normalizedInput);
  const snapshot = buildExecutivePresentationSnapshot(normalizedInput);
  const pilotPlan = buildPilotPresentationPlan(normalizedInput);
  const healthValidation = validateDemoHealth(normalizedInput);
  const narrative = generateExecutiveDemoNarrative(normalizedInput);
  const successEvaluation = evaluateDemoSuccess(normalizedInput);
  const signature = stableSignature([
    "d10-executive-demo-mode",
    organizationId,
    generatedAt,
    runtimeState.signature,
    safety.signature,
    journeys.map((journey) => journey.signature),
    snapshot.signature,
    pilotPlan.signature,
    healthValidation.signature,
    narrative.signature,
    successEvaluation.signature,
  ]);

  return {
    presentationId: stableSignature(["d10-executive-demo-mode", organizationId, generatedAt]).slice(0, 56),
    organizationId,
    generatedAt,
    runtimeState,
    safety,
    journeys: Object.freeze(journeys),
    snapshot,
    pilotPlan,
    healthValidation,
    narrative,
    successEvaluation,
    signature,
  };
}
