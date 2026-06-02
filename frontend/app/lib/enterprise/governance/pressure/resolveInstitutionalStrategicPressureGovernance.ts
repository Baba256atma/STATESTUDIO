import { stableSignature } from "../../../intelligence/shared/dedupe";
import { executiveStabilityInterpretationLayer } from "./executiveStabilityInterpretationLayer";
import { escalationGovernanceCognitionLayer } from "./escalationGovernanceCognitionLayer";
import {
  buildStrategicPressureGovernanceSignature,
  synthesizeStrategicPressureGovernance,
} from "./synthesizeStrategicPressureGovernance";
import type {
  InstitutionalStrategicPressureGovernanceSnapshot,
  PressureGovernancePosture,
  StrategicPressureGovernance,
  SynthesizeStrategicPressureGovernanceInput,
} from "./strategicPressureGovernanceTypes";

export type ResolveInstitutionalStrategicPressureGovernanceInput =
  SynthesizeStrategicPressureGovernanceInput & {
    enabled: boolean;
    sessionHydrated: boolean;
    runtimeStable: boolean;
    onboardingActive: boolean;
  };

function resolvePressurePosture(
  pressure: StrategicPressureGovernance | null,
  continuityPreserved: boolean
): PressureGovernancePosture {
  if (!continuityPreserved) return "attention";
  if (!pressure) return "idle";

  if (
    pressure.executiveStability === "composed" &&
    pressure.strategicComposure === "composed"
  ) {
    return "resilient";
  }
  if (pressure.executiveStability === "stable" || pressure.executiveStability === "composed") {
    return "composed";
  }
  if (pressure.escalationGovernance === "disciplined" || pressure.escalationGovernance === "contained") {
    return "stabilizing";
  }
  if (pressure.operationalPressure === "elevated" || pressure.operationalPressure === "critical") {
    return "monitoring";
  }
  return "monitoring";
}

export function resolveInstitutionalStrategicPressureGovernance(
  input: ResolveInstitutionalStrategicPressureGovernanceInput
): InstitutionalStrategicPressureGovernanceSnapshot {
  const canonical =
    input.enabled && input.continuityPreserved
      ? synthesizeStrategicPressureGovernance(input)
      : null;

  const pressurePosture = resolvePressurePosture(canonical, input.continuityPreserved);

  const executiveStabilityActive =
    pressurePosture === "resilient" ||
    pressurePosture === "composed" ||
    pressurePosture === "stabilizing";

  const pressureGovernanceActive =
    executiveStabilityActive || pressurePosture === "monitoring";

  const visible =
    input.enabled &&
    input.sessionHydrated &&
    !input.onboardingActive &&
    pressurePosture !== "idle";

  const stabilityHeadline =
    pressurePosture === "resilient"
      ? "Executive operational stability resilient under pressure"
      : pressurePosture === "composed"
        ? "Institutional strategic composure maintained"
        : pressurePosture === "stabilizing"
          ? "Strategic pressure governance stabilizing operations"
          : pressurePosture === "monitoring"
            ? "Pressure governance monitoring escalation continuity"
            : pressurePosture === "attention"
              ? "Executive stability requires continuity attention"
              : "Strategic pressure governance idle";

  const stabilitySubline = canonical
    ? `Pressure ${canonical.operationalPressure} · escalation ${canonical.escalationGovernance} · stability ${canonical.executiveStability}`
    : "Pressure governance derives from fragility and institutional stack — not stress scoring";

  const executiveStabilityLine = canonical
    ? executiveStabilityInterpretationLayer.synthesizeExecutiveStabilityLine(
        canonical.executiveStability,
        canonical.strategicComposure
      )
    : "Executive stability cognition establishes with governance stack depth";

  const escalationGovernanceLine = canonical
    ? escalationGovernanceCognitionLayer.synthesizeEscalationLine(
        canonical.escalationGovernance,
        canonical.operationalPressure
      )
    : "Escalation governance interpretation forming";

  const pressureStabilizationLine = canonical
    ? executiveStabilityInterpretationLayer.synthesizeStabilizationLine(
        canonical.stabilizationMaturity,
        canonical.resilienceContinuity
      )
    : "";

  const timelineStabilityLine =
    "Timeline reflects organizational stability memory — escalation stabilization, resilience continuity, and strategic composure evolution";

  const assistantStabilityLine =
    executiveStabilityActive
      ? "Executive stability cognition is available — discuss escalation governance, operational stabilization, and resilience continuity without executive stress monitoring."
      : "Strategic pressure governance is establishing — institutional operational steadiness will synchronize with the governance stack.";

  const signature = canonical
    ? buildStrategicPressureGovernanceSignature(canonical)
    : stableSignature(["f9-4-pressure-idle", String(input.fragilityElevated)]);

  return {
    signature,
    enabled: input.enabled,
    hydrated: input.sessionHydrated,
    visible,
    pressurePosture,
    stabilityHeadline,
    stabilitySubline,
    executiveStabilityLine,
    escalationGovernanceLine,
    pressureStabilizationLine,
    timelineStabilityLine,
    assistantStabilityLine,
    executiveStabilityActive,
    pressureGovernanceActive,
    canonical,
    stabilityStable: input.continuityPreserved && input.runtimeStable,
  };
}
