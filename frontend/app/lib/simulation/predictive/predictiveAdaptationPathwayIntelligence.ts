/**
 * D7:4:7 — Predictive adaptation pathway intelligence.
 */

import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { PredictiveCollapsePreventionState } from "./collapsePreventionTypes.ts";
import type { MultiFutureDivergenceState } from "./multiFutureDivergenceTypes.ts";
import type { PredictiveRecoveryOpportunityState } from "./recoveryOpportunityTypes.ts";
import type { PredictiveTrajectoryState } from "./futureTrajectoryTypes.ts";
import type {
  PredictiveAdaptationPathwayRecord,
  StrategicAdaptationSignal,
} from "./strategicAdaptationTypes.ts";
import { logAdaptationDev } from "./adaptationDevLog.ts";

export function analyzePredictiveAdaptationPathways(input: {
  topology: OperationalUniverseTopology;
  signals: readonly StrategicAdaptationSignal[];
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
  preventionState: PredictiveCollapsePreventionState;
  recoveryOpportunityState: PredictiveRecoveryOpportunityState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  adaptiveResilienceScore: number;
}): readonly PredictiveAdaptationPathwayRecord[] {
  const records: PredictiveAdaptationPathwayRecord[] = [];

  records.push(
    Object.freeze({
      recordId: "pathway::pressure-adaptation",
      pathwayId: "pathway::instability-coordination",
      originRegionId: input.preventionState.criticalCollapseZones[0] ?? "manufacturing",
      targetRegionIds: Object.freeze(
        input.preventionState.stabilizationInterventionZones.slice(0, 3)
      ),
      pathwayType: "pressure_response",
      pathwayStrength: Number(
        Math.min(1, input.preventionState.collapseInterruptionScore + 0.15).toFixed(4)
      ),
      explanation:
        "Operational instability may drive coordination adaptation that reshapes future recovery trajectories.",
    })
  );

  if (input.momentumState.momentumTrendLabel === "recovering") {
    records.push(
      Object.freeze({
        recordId: "pathway::recovery-adaptation",
        pathwayId: "pathway::recovery-momentum",
        originRegionId: input.trajectoryState.recoveryTrajectories[0] ?? "logistics",
        targetRegionIds: Object.freeze(
          [...input.recoveryOpportunityState.resilienceAccelerationZones].sort().slice(0, 4)
        ),
        pathwayType: "recovery_adaptation",
        pathwayStrength: Number(input.momentumState.recoveryMomentumScore.toFixed(4)),
        explanation:
          "Recovery adaptation pathways may strengthen as momentum and resilience-driven flexibility align.",
      })
    );
  }

  if (
    input.recoveryOpportunityState.stabilizationPotentialScore >= 0.4 &&
    input.trajectoryState.degradationTrajectories.length > 0
  ) {
    records.push(
      Object.freeze({
        recordId: "pathway::pressure-restructuring",
        pathwayId: "pathway::strategic-restructuring",
        originRegionId: input.recoveryOpportunityState.stabilizationOpportunityZones[0] ?? "logistics",
        targetRegionIds: Object.freeze(["manufacturing", "finance"].sort()),
        pathwayType: "flexibility_shift",
        pathwayStrength: Number(
          input.recoveryOpportunityState.stabilizationPotentialScore.toFixed(4)
        ),
        explanation:
          "Dependency pressure increase may prompt strategic restructuring toward operational flexibility and future stabilization opportunity.",
      })
    );
  }

  for (const rel of input.topology.crossDomainRelationships) {
    const sourceSignal = input.signals.find((s) =>
      s.affectedRegionIds.includes(rel.sourceRegionId)
    );
    if (!sourceSignal || sourceSignal.adaptationStrength < 0.4) continue;
    if (rel.relationshipType !== "dependency" && rel.relationshipType !== "resource_flow") {
      continue;
    }

    records.push(
      Object.freeze({
        recordId: `pathway::${rel.sourceRegionId}-${rel.targetRegionId}`,
        pathwayId: `pathway::${rel.relationshipType}`,
        originRegionId: rel.sourceRegionId,
        targetRegionIds: Object.freeze([rel.targetRegionId]),
        pathwayType: "survivability",
        pathwayStrength: Number(
          Math.min(1, sourceSignal.adaptationStrength * rel.intensity).toFixed(4)
        ),
        explanation: `Adaptation in ${rel.sourceRegionId} may reshape long-term survivability dynamics in ${rel.targetRegionId}.`,
      })
    );
  }

  if (input.equilibriumState.equilibriumLabel === "recovering" || input.equilibriumState.equilibriumScore >= 0.45) {
    records.push(
      Object.freeze({
        recordId: "pathway::equilibrium-adaptation",
        pathwayId: "pathway::equilibrium-restoration",
        originRegionId: input.equilibriumState.stabilityZones[0] ?? "finance",
        targetRegionIds: Object.freeze(
          [...input.divergenceState.convergingFutureZones].sort().slice(0, 3)
        ),
        pathwayType: "flexibility_shift",
        pathwayStrength: Number(input.equilibriumState.equilibriumScore.toFixed(4)),
        explanation:
          "Equilibrium restoration adaptation may reduce future divergence and support enterprise survivability.",
      })
    );
  }

  if (records.length === 0 && input.signals.length > 0) {
    records.push(
      Object.freeze({
        recordId: "pathway::enterprise-limited",
        pathwayId: "pathway::limited",
        originRegionId: "logistics",
        targetRegionIds: Object.freeze(["manufacturing"]),
        pathwayType: "survivability",
        pathwayStrength: Number(input.adaptiveResilienceScore.toFixed(4)),
        explanation:
          "Limited adaptation pathways may remain observable as organizational flexibility evolves under pressure.",
      })
    );
  }

  logAdaptationDev("Transformation", { pathwayRecordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
