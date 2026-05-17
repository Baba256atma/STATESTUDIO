/**
 * D7:3:3 — Decision latency and approval-chain analysis.
 */

import type { ExecutiveCoordinationState } from "../coordination/coordinationDynamicsTypes.ts";
import type { HumanActorSimulationState } from "../actors/humanActorTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { DecisionFrictionSignal, DecisionLatencyRecord } from "./decisionFrictionTypes.ts";
import { logDecisionFrictionDev } from "./decisionFrictionDevLog.ts";

export function analyzeDecisionLatency(input: {
  topology: OperationalUniverseTopology;
  actorState: HumanActorSimulationState;
  coordinationState: ExecutiveCoordinationState;
  signals: readonly DecisionFrictionSignal[];
  momentumState?: EnterpriseMomentumState;
  approvalChainDelayFactor?: number;
}): readonly DecisionLatencyRecord[] {
  const records: DecisionLatencyRecord[] = [];
  const delay = Math.min(1, Math.max(0, input.approvalChainDelayFactor ?? 0));
  const executives = input.actorState.activeActors.filter((a) => a.role === "executive");
  const managers = input.actorState.activeActors.filter((a) => a.role === "manager");

  for (const region of input.topology.operationalRegions) {
    const regionSignals = input.signals.filter((s) =>
      s.affectedRegionIds.includes(region.regionId)
    );
    if (regionSignals.length === 0) continue;

    const maxIntensity = Math.max(...regionSignals.map((s) => s.intensity));
    const chainDepth = executives.length + managers.filter((m) =>
      m.assignedRegionIds.includes(region.regionId)
    ).length;

    let latencyScore = Math.min(
      1,
      maxIntensity * 0.5 + delay * 0.3 + input.coordinationState.coordinationFrictionScore * 0.2
    );
    let explanation = "";

    if (chainDepth >= 3 && delay > 0.4) {
      explanation = `Executive approval bottleneck is delaying stabilization in ${region.label}.`;
      latencyScore = Math.min(1, latencyScore + 0.1);
    } else if (
      input.coordinationState.coordinationBottlenecks.some((b) => b.regionId === region.regionId)
    ) {
      explanation = `Cross-domain coordination delays are slowing decision execution in ${region.label}.`;
    } else if (input.momentumState?.momentumTrendLabel === "accelerating_failure") {
      explanation = `Recovery implementation is slowing under degrading momentum in ${region.label}.`;
    } else if (regionSignals.some((s) => s.frictionState === "critical")) {
      explanation = `Fragmented implementation flow is elevating decision latency in ${region.label}.`;
    } else {
      explanation = `Decision execution chains show moderate latency in ${region.label}.`;
    }

    records.push(
      Object.freeze({
        recordId: `latency::${region.regionId}`,
        regionId: region.regionId,
        latencyScore: Number(latencyScore.toFixed(4)),
        chainDepth,
        explanation,
        contributingSignalIds: Object.freeze(
          regionSignals.map((s) => s.signalId).sort()
        ),
      })
    );
  }

  if (
    delay > 0.45 &&
    input.coordinationState.coordinationDynamicsLabel !== "synchronized"
  ) {
    records.push(
      Object.freeze({
        recordId: "latency::enterprise-approval-chain",
        regionId: "finance",
        latencyScore: Number(Math.min(1, delay + 0.2).toFixed(4)),
        chainDepth: executives.length,
        explanation:
          "Overloaded approval paths are delaying strategic decision propagation across the enterprise.",
        contributingSignalIds: Object.freeze(
          input.signals.map((s) => s.signalId).slice(0, 8)
        ),
      })
    );
  }

  logDecisionFrictionDev("ExecutionLatency", { recordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
