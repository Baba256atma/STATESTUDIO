import { stableSignature } from "../../intelligence/shared/dedupe.ts";
import { listDemoScenariosForMode } from "./demoContentRegistry.ts";
import { evaluateDemoSafetyControls } from "./demoSafetyControls.ts";
import type {
  DemoAudience,
  DemoJourneyId,
  DemoModeRuntimeState,
  DemoModeTransitionResult,
  ExecutiveDemoModeInput,
  ExecutiveDemoModeState,
} from "./executiveDemoModeTypes.ts";

function allowedPilotTransition(input: ExecutiveDemoModeInput): boolean {
  if (input.launchGate?.state === "pilot_ready" || input.launchGate?.state === "release_candidate") {
    return input.validationSuite?.summary.validationPassed === true;
  }
  return false;
}

export function requestDemoModeTransition(
  from: ExecutiveDemoModeState,
  to: ExecutiveDemoModeState,
  input: ExecutiveDemoModeInput
): DemoModeTransitionResult {
  let allowed = false;
  let reason = "Transition is not supported for the current presentation context.";
  let recommendedCorrection: string | null = "Use disabled, demo, pilot, or review mode based on evaluated readiness.";

  if (from === to) {
    allowed = true;
    reason = "Mode is unchanged.";
    recommendedCorrection = null;
  } else if (to === "disabled" || from === "disabled") {
    allowed = to !== "pilot_mode" || allowedPilotTransition(input);
    reason = allowed ? "Explicit manual transition is allowed." : "Pilot mode requires pilot-ready launch evidence.";
    recommendedCorrection = allowed ? null : "Evaluate launch gate and validation before entering pilot mode.";
  } else if (to === "review_mode" || from === "review_mode") {
    allowed = true;
    reason = "Manual review transitions are allowed for controlled presentation review.";
    recommendedCorrection = null;
  } else if (to === "pilot_mode") {
    allowed = allowedPilotTransition(input);
    reason = allowed ? "Pilot transition has validation and launch evidence." : "Pilot mode requires pilot-ready launch evidence.";
    recommendedCorrection = allowed ? null : "Resolve validation and launch gate prerequisites before pilot mode.";
  } else if (to === "demo_mode") {
    allowed = true;
    reason = "Manual transition to demo mode is allowed.";
    recommendedCorrection = null;
  }

  return {
    allowed,
    from,
    to,
    reason,
    recommendedCorrection,
    signature: stableSignature(["d10-demo-transition", from, to, allowed, reason]),
  };
}

export function buildDemoModeRuntimeState(input: ExecutiveDemoModeInput): DemoModeRuntimeState {
  const audience: DemoAudience = input.audience ?? (input.mode === "pilot_mode" ? "pilot_participant" : "executive");
  const supported = listDemoScenariosForMode(input.mode);
  const safety = evaluateDemoSafetyControls(input);
  const requested = input.requestedJourneyIds?.length
    ? input.requestedJourneyIds
    : supported.map((scenario) => scenario.scenarioId);
  const allowedJourneyIds = requested.filter((journeyId): journeyId is DemoJourneyId =>
    supported.some((scenario) => scenario.scenarioId === journeyId) && !safety.blockedJourneys.includes(journeyId)
  );
  const activeJourneyId = input.activeJourneyId && allowedJourneyIds.includes(input.activeJourneyId)
    ? input.activeJourneyId
    : allowedJourneyIds[0] ?? null;

  return {
    mode: input.mode,
    audience,
    activeJourneyId,
    allowedJourneyIds: Object.freeze(allowedJourneyIds),
    blockedJourneyIds: Object.freeze(safety.blockedJourneys),
    updatedAt: input.now ?? Date.now(),
    signature: stableSignature(["d10-demo-runtime-state", input.mode, audience, activeJourneyId, allowedJourneyIds]),
  };
}
