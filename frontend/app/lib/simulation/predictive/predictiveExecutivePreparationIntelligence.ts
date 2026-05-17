/**
 * D7:4:8 — Predictive executive preparation intelligence.
 */

import type { PredictiveCollapsePreventionState } from "./collapsePreventionTypes.ts";
import type { PredictiveRecoveryOpportunityState } from "./recoveryOpportunityTypes.ts";
import type { PredictiveStrategicAdaptationState } from "./strategicAdaptationTypes.ts";
import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { HumanSystemResilienceState } from "../resilience/humanSystemResilienceTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type {
  ExecutiveForesightSignal,
  ExecutivePreparationGapRecord,
} from "./executiveForesightTypes.ts";
import { logForesightDev } from "./foresightDevLog.ts";

export function analyzeExecutivePreparationGaps(input: {
  topology: OperationalUniverseTopology;
  signals: readonly ExecutiveForesightSignal[];
  adaptationState: PredictiveStrategicAdaptationState;
  preventionState: PredictiveCollapsePreventionState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  resilienceState: HumanSystemResilienceState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
}): readonly ExecutivePreparationGapRecord[] {
  const gaps: ExecutivePreparationGapRecord[] = [];

  if (input.adaptationState.adaptationFragilityScore >= 0.45) {
    gaps.push(
      Object.freeze({
        recordId: "prep-gap::coordination",
        gapType: "coordination_preparedness",
        regionId: "logistics",
        gapSeverity: Number(
          Math.min(0.92, input.adaptationState.adaptationFragilityScore).toFixed(4)
        ),
        explanation:
          "Executive coordination preparedness may need strengthening before long-horizon instability patterns fully emerge.",
      })
    );
  }

  if (input.resilienceState.enterpriseResilienceScore < 0.5) {
    gaps.push(
      Object.freeze({
        recordId: "prep-gap::resilience",
        gapType: "resilience_readiness",
        regionId: "manufacturing",
        gapSeverity: Number(
          Math.min(0.92, 1 - input.resilienceState.enterpriseResilienceScore).toFixed(4)
        ),
        explanation:
          "Human-system resilience readiness may lag emerging foresight signals across manufacturing operations.",
      })
    );
  }

  if (input.preventionState.criticalCollapseZones.length > 0) {
    const zone = input.preventionState.criticalCollapseZones[0] ?? "logistics";
    gaps.push(
      Object.freeze({
        recordId: "prep-gap::structural",
        gapType: "structural_fragility",
        regionId: zone,
        gapSeverity: Number(
          Math.min(0.92, input.preventionState.criticalThresholdProximityScore).toFixed(4)
        ),
        explanation:
          "Structural fragility buildup may require executive preparation across operations, logistics, and recovery systems.",
      })
    );
  }

  if (
    input.recoveryOpportunityState.recoveryOpportunityLabel === "fragile" ||
    input.recoveryOpportunityState.recoveryOpportunityLabel === "limited"
  ) {
    gaps.push(
      Object.freeze({
        recordId: "prep-gap::recovery",
        gapType: "recovery_readiness",
        regionId: "customer_systems",
        gapSeverity: Number(
          Math.min(
            0.92,
            1 - input.recoveryOpportunityState.recoveryAccelerationScore
          ).toFixed(4)
        ),
        explanation:
          "Recovery readiness may be insufficient to capitalize on stabilization foresight opportunities.",
      })
    );
  }

  if (input.equilibriumState.equilibriumScore < 0.45) {
    gaps.push(
      Object.freeze({
        recordId: "prep-gap::equilibrium",
        gapType: "equilibrium_preparedness",
        regionId: "finance",
        gapSeverity: Number(
          Math.min(0.92, 1 - input.equilibriumState.equilibriumScore).toFixed(4)
        ),
        explanation:
          "Systemic equilibrium preparedness may need attention as strategic momentum and finance domains shift.",
      })
    );
  }

  if (
    input.momentumState.momentumTrendLabel === "accelerating_failure" &&
    gaps.length === 0
  ) {
    gaps.push(
      Object.freeze({
        recordId: "prep-gap::momentum",
        gapType: "coordination_preparedness",
        regionId: "logistics",
        gapSeverity: 0.55,
        explanation:
          "Accelerating operational failure momentum may outpace current executive preparedness for emerging foresight patterns.",
      })
    );
  }

  const volatileSignals = input.signals.filter(
    (s) => s.foresightState === "volatile" || s.foresightState === "critical"
  );
  for (const signal of volatileSignals.slice(0, 2)) {
    const regionId = signal.affectedRegionIds[0] ?? "logistics";
    if (gaps.some((g) => g.regionId === regionId && g.gapType === "structural_fragility")) {
      continue;
    }
    gaps.push(
      Object.freeze({
        recordId: `prep-gap::volatile::${signal.signalId}`,
        gapType: "structural_fragility",
        regionId,
        gapSeverity: Number(Math.min(0.92, signal.foresightStrength).toFixed(4)),
        explanation: `Volatile foresight in ${regionId} may indicate a strategic preparation gap before escalation.`,
      })
    );
  }

  logForesightDev("ExecutivePreparedness", { gapCount: gaps.length });
  return Object.freeze(gaps.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
