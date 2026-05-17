/**
 * D7:4:6 — Stabilization interruption analysis.
 */

import type { PredictiveCascadeState } from "./cascadingConsequenceTypes.ts";
import type { PredictiveRecoveryOpportunityState } from "./recoveryOpportunityTypes.ts";
import type {
  CollapsePreventionSignal,
  StabilizationInterruptionRecord,
} from "./collapsePreventionTypes.ts";
import { logPreventionDev } from "./preventionDevLog.ts";

export function analyzeStabilizationInterruption(input: {
  signals: readonly CollapsePreventionSignal[];
  cascadeState: PredictiveCascadeState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  collapseInterruptionScore: number;
}): readonly StabilizationInterruptionRecord[] {
  const records: StabilizationInterruptionRecord[] = [];

  const amplifyingSignals = input.signals.filter(
    (s) => s.preventionState === "intervenable" || s.preventionState === "stabilizing"
  );

  for (const signal of amplifyingSignals) {
    if (signal.signalId.includes("logistics")) {
      records.push(
        Object.freeze({
          recordId: "interruption::logistics-cascade",
          originRegionId: "logistics",
          interruptedCascadePath: "logistics→manufacturing→finance",
          interruptionScore: Number(signal.preventionStrength.toFixed(4)),
          explanation:
            "Early logistics stabilization may interrupt cascading recovery collapse propagation across manufacturing and finance domains.",
          contributingSignalIds: Object.freeze([signal.signalId]),
        })
      );
    }
  }

  if (
    input.cascadeState.cascadeAmplificationScore >= 0.45 &&
    input.recoveryOpportunityState.stabilizationPotentialScore >= 0.4
  ) {
    records.push(
      Object.freeze({
        recordId: "interruption::preventable-cascade",
        originRegionId: input.cascadeState.amplificationZones[0] ?? "logistics",
        interruptedCascadePath: "amplification→degradation",
        interruptionScore: Number(input.collapseInterruptionScore.toFixed(4)),
        explanation:
          "A preventable instability cascade may be interrupted where recovery stabilization and cascade dampening align.",
        contributingSignalIds: Object.freeze(
          amplifyingSignals.map((s) => s.signalId).slice(0, 6)
        ),
      })
    );
  }

  const fragileEquilibrium =
    input.cascadeState.predictiveCascadeLabel === "amplifying" ||
    input.cascadeState.predictiveCascadeLabel === "critical";
  if (fragileEquilibrium && input.recoveryOpportunityState.recoveryAccelerationScore > 0.35) {
    records.push(
      Object.freeze({
        recordId: "interruption::fragile-equilibrium",
        originRegionId: "manufacturing",
        interruptedCascadePath: "equilibrium→collapse",
        interruptionScore: Number(
          Math.min(
            1,
            input.recoveryOpportunityState.recoveryAccelerationScore * 0.6 +
              input.collapseInterruptionScore * 0.3
          ).toFixed(4)
        ),
        explanation:
          "Fragile equilibrium thresholds may be eased through intervention-sensitive recovery windows before collapse acceleration.",
        contributingSignalIds: Object.freeze([]),
      })
    );
  }

  const coordinationSignal = input.signals.find((s) =>
    s.signalId.includes("trust-coordination")
  );
  if (coordinationSignal) {
    records.push(
      Object.freeze({
        recordId: "interruption::degradation-amplification",
        originRegionId: coordinationSignal.affectedRegionIds[0] ?? "logistics",
        interruptedCascadePath: "trust→coordination→operational_slowdown",
        interruptionScore: Number(coordinationSignal.preventionStrength.toFixed(4)),
        explanation:
          "Minor recovery coordination improvement may interrupt future degradation amplification across connected operational systems.",
        contributingSignalIds: Object.freeze([coordinationSignal.signalId]),
      })
    );
  }

  if (input.cascadeState.amplificationZones.length >= 2) {
    records.push(
      Object.freeze({
        recordId: "interruption::collapse-hotspot",
        originRegionId: input.cascadeState.amplificationZones[0] ?? "logistics",
        interruptedCascadePath: "hotspot→systemic",
        interruptionScore: Number(
          Math.min(1, input.cascadeState.cascadeAmplificationScore + 0.15).toFixed(4)
        ),
        explanation:
          "Collapse acceleration hotspots may be dampened through targeted stabilization leverage chains.",
        contributingSignalIds: Object.freeze(
          input.signals
            .filter((s) => s.preventionState === "intervenable")
            .map((s) => s.signalId)
        ),
      })
    );
  }

  logPreventionDev("StabilizationWindow", { recordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
