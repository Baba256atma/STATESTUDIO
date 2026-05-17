/**
 * D7:1:4 — Executive-readable timeline phase semantics.
 */

import type { SimulationOperationalMetrics } from "../simulationTypes.ts";
import type { SimulationPropagationSnapshotState } from "../simulationPropagationTypes.ts";
import type { ExecutiveTimelinePhase, ExecutiveTimelinePhaseMarker } from "./timelineTypes.ts";

export const EXECUTIVE_TIMELINE_PHASE_LABELS: Readonly<Record<ExecutiveTimelinePhase, string>> = {
  stable_operations: "Stable operations",
  pressure_emergence: "Pressure emergence",
  escalation_phase: "Escalation phase",
  operational_degradation: "Operational degradation",
  recovery_progression: "Recovery progression",
  stabilization_period: "Stabilization period",
  operational_slowdown: "Operational slowdown",
};

export function resolveExecutiveTimelinePhase(input: {
  tick: number;
  metrics?: SimulationOperationalMetrics;
  propagationState?: unknown;
  affectedObjectCount?: number;
}): ExecutiveTimelinePhaseMarker {
  const metrics = input.metrics ?? {};
  const fragility = Number(metrics.fragility ?? 0);
  const load = Number(metrics.operationalLoad ?? 0);
  const confidence = Number(metrics.confidence ?? 0.75);
  const propagation = input.propagationState as SimulationPropagationSnapshotState | undefined;
  const cascadeCount = propagation?.cascadeHistory?.length ?? 0;
  const affected = input.affectedObjectCount ?? propagation?.affectedObjectIds?.length ?? 0;

  let phase: ExecutiveTimelinePhase = "stable_operations";
  if (propagation?.activePropagations?.some((p) => p.propagationType === "recovery")) {
    phase = "recovery_progression";
  } else if (propagation?.activePropagations?.some((p) => p.propagationType === "stabilization")) {
    phase = "stabilization_period";
  } else if (fragility >= 0.75 || affected >= 4) {
    phase = "operational_degradation";
  } else if (fragility >= 0.55 || cascadeCount >= 2) {
    phase = "escalation_phase";
  } else if (load >= 0.5 || affected >= 2) {
    phase = "pressure_emergence";
  } else if (confidence < 0.55) {
    phase = "operational_slowdown";
  } else if (input.tick === 0) {
    phase = "stable_operations";
  }

  const label = EXECUTIVE_TIMELINE_PHASE_LABELS[phase];
  const summary =
    phase === "stable_operations"
      ? "Operations are within expected bounds."
      : phase === "pressure_emergence"
        ? "Early supply or dependency pressure is emerging."
        : phase === "escalation_phase"
          ? "Consequences are spreading across connected systems."
          : phase === "operational_degradation"
            ? "Operational performance is materially degraded."
            : phase === "recovery_progression"
              ? "Recovery actions are improving stability."
              : phase === "stabilization_period"
                ? "Systems are moving toward stabilization."
                : "Execution pace has slowed due to uncertainty.";

  return { tick: input.tick, phase, label, summary };
}
