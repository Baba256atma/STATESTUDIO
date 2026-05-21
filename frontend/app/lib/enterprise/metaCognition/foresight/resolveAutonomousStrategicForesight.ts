import { stableSignature } from "../../../intelligence/shared/dedupe";
import { resilienceForesightLayer } from "./resilienceForesightLayer";
import { strategicTimingIntelligenceLayer } from "./strategicTimingIntelligenceLayer";
import {
  buildInstitutionalFutureStateProjectionSignature,
  synthesizeInstitutionalFutureStateProjection,
} from "./synthesizeInstitutionalFutureStateProjection";
import type {
  AutonomousStrategicForesightLayerSnapshot,
  InstitutionalFutureStateProjection,
  StrategicForesightPosture,
  SynthesizeInstitutionalFutureStateProjectionInput,
} from "./institutionalFutureStateTypes";

export type ResolveAutonomousStrategicForesightInput =
  SynthesizeInstitutionalFutureStateProjectionInput & {
    enabled: boolean;
    sessionHydrated: boolean;
    runtimeStable: boolean;
    onboardingActive: boolean;
  };

function resolveStrategicForesightPosture(
  projection: InstitutionalFutureStateProjection | null,
  continuityPreserved: boolean
): StrategicForesightPosture {
  if (!continuityPreserved) return "attention";
  if (!projection) return "idle";

  if (
    projection.governanceEvolution === "maturing" &&
    projection.resilienceTrajectory === "strengthening"
  ) {
    return "sustained";
  }
  if (projection.currentTrajectory === "ascending" || projection.currentTrajectory === "adapting") {
    return "anticipating";
  }
  if (projection.possibleFutureStates.length >= 2) return "projecting";
  return "observing";
}

export function resolveAutonomousStrategicForesight(
  input: ResolveAutonomousStrategicForesightInput
): AutonomousStrategicForesightLayerSnapshot {
  const canonical =
    input.enabled && input.continuityPreserved
      ? synthesizeInstitutionalFutureStateProjection(input)
      : null;

  const strategicForesightPosture = resolveStrategicForesightPosture(
    canonical,
    input.continuityPreserved
  );

  const futureStateIntelligenceActive =
    strategicForesightPosture === "sustained" || strategicForesightPosture === "anticipating";

  const strategicForesightActive =
    futureStateIntelligenceActive || strategicForesightPosture === "projecting";

  const visible =
    input.enabled &&
    input.sessionHydrated &&
    !input.onboardingActive &&
    strategicForesightPosture !== "idle";

  const foresightHeadline =
    strategicForesightPosture === "sustained"
      ? "Strategic foresight intelligence sustained"
      : strategicForesightPosture === "anticipating"
        ? "Institutional future-state intelligence active"
        : strategicForesightPosture === "projecting"
          ? "Possible institutional futures under analysis"
          : strategicForesightPosture === "observing"
            ? "Trajectory awareness observing emerging patterns"
            : strategicForesightPosture === "attention"
              ? "Strategic foresight requires continuity attention"
              : "Autonomous strategic foresight idle";

  const foresightSubline = canonical
    ? canonical.strategicForesightSummary
    : "Foresight reasons about possible futures — not prediction certainty";

  const trajectoryLine = canonical
    ? `Trajectory ${canonical.currentTrajectory} · fragility ${canonical.fragilityTrajectory}`
    : "Organizational trajectory cognition establishes with reflection stack depth";

  const resilienceForecastLine = canonical
    ? resilienceForesightLayer.synthesizeResilienceForecastLine(canonical.resilienceTrajectory)
    : "";

  const strategicTimingLine = canonical
    ? strategicTimingIntelligenceLayer.synthesizeStrategicTimingLine(
        canonical.timingConsiderations
      )
    : "";

  const uncertaintyFactorsLine = canonical
    ? canonical.uncertaintyFactors.join(" · ")
    : "Uncertainty awareness preserved — possible trajectories, not guaranteed futures";

  const timelineFutureStateLine =
    "Timeline reflects future-oriented institutional cognition — projected escalation paths, resilience possibilities, adaptation timing windows, and strategic transitions";

  const assistantStrategicForesightLine =
    strategicForesightActive || strategicForesightPosture === "observing"
      ? "Strategic foresight is available — discuss possible organizational futures, trajectory concerns, resilience possibilities, and timing considerations without claiming future certainty."
      : "Future-state intelligence is establishing — foresight awareness will synchronize with institutional reflection.";

  const signature = canonical
    ? buildInstitutionalFutureStateProjectionSignature(canonical)
    : stableSignature(["f10-4-foresight-idle", String(input.cognitionConverged)]);

  return {
    signature,
    enabled: input.enabled,
    hydrated: input.sessionHydrated,
    visible,
    strategicForesightPosture,
    foresightHeadline,
    foresightSubline,
    trajectoryLine,
    resilienceForecastLine,
    strategicTimingLine,
    uncertaintyFactorsLine,
    timelineFutureStateLine,
    assistantStrategicForesightLine,
    strategicForesightActive,
    futureStateIntelligenceActive,
    canonical,
    foresightStable: input.continuityPreserved && input.runtimeStable,
  };
}
