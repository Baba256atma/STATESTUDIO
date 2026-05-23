import type {
  DemoHealthValidation,
  DemoModeRuntimeState,
  DemoSafetyControl,
  DemoSafetyEvaluation,
  DemoSuccessEvaluation,
  ExecutiveDemoModePresentation,
  ExecutivePresentationSnapshot,
  GuidedExecutiveJourney,
  PilotPresentationPlan,
} from "./executiveDemoModeTypes.ts";

export function validateDemoSafetyControl(control: DemoSafetyControl): boolean {
  return Boolean(
    control.controlId.trim() &&
      control.description.trim() &&
      control.source.trim() &&
      control.recommendedAction.trim() &&
      control.reversible === true
  );
}

export function validateDemoSafetyEvaluation(evaluation: DemoSafetyEvaluation): boolean {
  return Boolean(evaluation.signature.trim() && evaluation.controls.every(validateDemoSafetyControl));
}

export function validateDemoModeRuntimeState(state: DemoModeRuntimeState): boolean {
  return Boolean(state.signature.trim() && state.updatedAt >= 0 && (state.mode === "disabled" || state.allowedJourneyIds.length > 0));
}

export function validateGuidedExecutiveJourney(journey: GuidedExecutiveJourney): boolean {
  return Boolean(journey.signature.trim() && journey.title.trim() && journey.rationale.trim());
}

export function validateExecutivePresentationSnapshot(snapshot: ExecutivePresentationSnapshot): boolean {
  return Boolean(
    snapshot.snapshotId.trim() &&
      snapshot.capabilityDemonstrated.trim() &&
      snapshot.whyItMatters.trim() &&
      snapshot.valueProvided.trim() &&
      snapshot.executiveSummary.trim() &&
      snapshot.signature.trim()
  );
}

export function validatePilotPresentationPlan(plan: PilotPresentationPlan): boolean {
  return Boolean(plan.planId.trim() && plan.nonDestructive === true && plan.guidedExploration.length > 0 && plan.signature.trim());
}

export function validateDemoHealthValidation(validation: DemoHealthValidation): boolean {
  return Boolean(validation.validationId.trim() && validation.signature.trim() && validation.warnings.every(validateDemoSafetyControl));
}

export function validateDemoSuccessEvaluation(evaluation: DemoSuccessEvaluation): boolean {
  return Boolean(
    evaluation.advisoryOnly === true &&
      evaluation.presentationQuality >= 0 &&
      evaluation.presentationQuality <= 1 &&
      evaluation.workflowCoverage >= 0 &&
      evaluation.workflowCoverage <= 1 &&
      evaluation.pilotPreparedness >= 0 &&
      evaluation.pilotPreparedness <= 1 &&
      evaluation.confidenceLevel >= 0 &&
      evaluation.confidenceLevel <= 1 &&
      evaluation.signature.trim()
  );
}

export function validateExecutiveDemoModePresentation(presentation: ExecutiveDemoModePresentation): boolean {
  return Boolean(
    presentation.presentationId.trim() &&
      presentation.organizationId.trim() &&
      validateDemoModeRuntimeState(presentation.runtimeState) &&
      validateDemoSafetyEvaluation(presentation.safety) &&
      presentation.journeys.every(validateGuidedExecutiveJourney) &&
      validateExecutivePresentationSnapshot(presentation.snapshot) &&
      validatePilotPresentationPlan(presentation.pilotPlan) &&
      validateDemoHealthValidation(presentation.healthValidation) &&
      validateDemoSuccessEvaluation(presentation.successEvaluation) &&
      presentation.signature.trim()
  );
}
