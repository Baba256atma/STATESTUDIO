/**
 * D7:4:5 — Recovery leverage-point analysis.
 */

import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { PredictiveTrajectoryState } from "./futureTrajectoryTypes.ts";
import type {
  RecoveryLeveragePointRecord,
  RecoveryOpportunitySignal,
} from "./recoveryOpportunityTypes.ts";
import { logRecoveryOpportunityDev } from "./recoveryOpportunityDevLog.ts";

export function analyzeRecoveryLeveragePoints(input: {
  topology: OperationalUniverseTopology;
  signals: readonly RecoveryOpportunitySignal[];
  trajectoryState: PredictiveTrajectoryState;
}): readonly RecoveryLeveragePointRecord[] {
  const records: RecoveryLeveragePointRecord[] = [];

  const logisticsSignal = input.signals.find((s) =>
    s.signalId.includes("logistics-leverage")
  );
  if (logisticsSignal) {
    records.push(
      Object.freeze({
        recordId: "leverage::logistics-manufacturing",
        leverageRegionId: "logistics",
        impactedRegionIds: Object.freeze(["manufacturing", "logistics"]),
        leverageType: "coordination_recovery",
        leverageStrength: Number(logisticsSignal.opportunityStrength.toFixed(4)),
        explanation:
          "Minor logistics stabilization may unlock major manufacturing recovery acceleration under current dependency conditions.",
        contributingSignalIds: Object.freeze([logisticsSignal.signalId]),
      })
    );
  }

  const coordinationSignal = input.signals.find((s) =>
    s.signalId === "recovery-opportunity::coordination-resilience"
  );
  if (coordinationSignal) {
    records.push(
      Object.freeze({
        recordId: "leverage::coordination-resilience",
        leverageRegionId: coordinationSignal.affectedRegionIds[0] ?? "logistics",
        impactedRegionIds: Object.freeze([...coordinationSignal.affectedRegionIds]),
        leverageType: "resilience_amplification",
        leverageStrength: Number(coordinationSignal.opportunityStrength.toFixed(4)),
        explanation:
          "Strategic intervention leverage may emerge where coordination improvement amplifies resilience recovery pathways.",
        contributingSignalIds: Object.freeze([coordinationSignal.signalId]),
      })
    );
  }

  for (const rel of input.topology.crossDomainRelationships) {
    if (rel.relationshipType !== "dependency" && rel.relationshipType !== "resource_flow") {
      continue;
    }
    const sourceOpportunity = input.signals.find((s) =>
      s.affectedRegionIds.includes(rel.sourceRegionId)
    );
    if (!sourceOpportunity || sourceOpportunity.opportunityStrength < 0.45) continue;

    const targetInRecovery = input.trajectoryState.recoveryTrajectories.includes(
      rel.targetRegionId
    );
    if (!targetInRecovery && sourceOpportunity.opportunityState !== "accelerating") continue;

    records.push(
      Object.freeze({
        recordId: `leverage::${rel.sourceRegionId}-${rel.targetRegionId}`,
        leverageRegionId: rel.sourceRegionId,
        impactedRegionIds: Object.freeze([rel.targetRegionId, rel.sourceRegionId].sort()),
        leverageType: "pressure_relief",
        leverageStrength: Number(
          Math.min(1, sourceOpportunity.opportunityStrength * rel.intensity).toFixed(4)
        ),
        explanation: `Operational improvements in ${rel.sourceRegionId} may disproportionately support recovery stabilization in ${rel.targetRegionId}.`,
        contributingSignalIds: Object.freeze([sourceOpportunity.signalId]),
      })
    );
  }

  const financeSignal = input.signals.find((s) =>
    s.affectedRegionIds.includes("finance")
  );
  if (financeSignal && input.trajectoryState.recoveryTrajectories.length > 0) {
    records.push(
      Object.freeze({
        recordId: "leverage::finance-equilibrium",
        leverageRegionId: "finance",
        impactedRegionIds: Object.freeze(
          [...input.trajectoryState.recoveryTrajectories].sort().slice(0, 3)
        ),
        leverageType: "equilibrium_restoration",
        leverageStrength: Number(financeSignal.opportunityStrength.toFixed(4)),
        explanation:
          "Financial stability windows may create equilibrium restoration leverage across recovering operational regions.",
        contributingSignalIds: Object.freeze([financeSignal.signalId]),
      })
    );
  }

  logRecoveryOpportunityDev("RecoveryLeverage", { recordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
