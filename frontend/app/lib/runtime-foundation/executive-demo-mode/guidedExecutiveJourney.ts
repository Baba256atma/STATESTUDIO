import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import { getDemoScenarioById, listDemoScenariosForMode } from "./demoContentRegistry.ts";
import type { GuidedExecutiveJourney, ExecutiveDemoModeInput } from "./executiveDemoModeTypes.ts";

export function buildGuidedExecutiveJourney(input: ExecutiveDemoModeInput): GuidedExecutiveJourney[] {
  const requested = input.requestedJourneyIds?.length
    ? input.requestedJourneyIds
    : input.activeJourneyId
      ? [input.activeJourneyId]
      : listDemoScenariosForMode(input.mode).map((scenario) => scenario.scenarioId);

  return requested.map((journeyId) => {
    const scenario = getDemoScenarioById(journeyId);
    const blocked = !scenario || !scenario.supportedModes.includes(input.mode) || input.mode === "disabled";
    const title = scenario?.title ?? `Unsupported journey ${journeyId}`;
    const steps = scenario?.sequence ?? [];
    const presentationFocus = scenario
      ? [scenario.capability, scenario.whyItMatters, scenario.valueProvided]
      : ["Unsupported journey requested."];
    const rationale = blocked
      ? "Journey is not available in the active presentation mode."
      : "Journey is available for controlled executive presentation.";

    return {
      journeyId,
      mode: input.mode,
      title,
      audience: input.audience ?? (input.mode === "pilot_mode" ? "pilot_participant" : "executive"),
      steps: Object.freeze(steps),
      presentationFocus: Object.freeze(presentationFocus),
      blocked,
      rationale,
      signature: stableSignature(["d10-guided-journey", input.mode, journeyId, blocked, steps.map((step) => step.stepId)]),
    };
  });
}
