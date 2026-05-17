/**
 * D7:5:9 — Consensus-fragmentation analysis.
 */

import type { ExecutiveConsensusSignal } from "./executiveConsensusTypes.ts";
import type { ExecutiveMultiStrategyState } from "./multiStrategyComparisonTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "./strategicGovernanceTypes.ts";
import type { ExecutiveStrategicAdvisoryState } from "./executiveStrategicAdvisoryTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { ConsensusFragmentationRecord } from "./executiveConsensusTypes.ts";
import { logExecutiveStrategicConsensusDev } from "./consensusDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

export function analyzeConsensusFragmentation(input: {
  consensusSignals: readonly ExecutiveConsensusSignal[];
  comparisonState: ExecutiveMultiStrategyState;
  governanceState: ExecutiveStrategicGovernanceState;
  advisoryState: ExecutiveStrategicAdvisoryState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
}): readonly ConsensusFragmentationRecord[] {
  const records: ConsensusFragmentationRecord[] = [];
  const consensusIds = input.consensusSignals.map((c) => c.consensusId);

  const unstableAlignment = input.consensusSignals.filter(
    (c) => c.consensusState === "volatile" || c.consensusState === "fragmented"
  ).length;
  if (unstableAlignment > 0) {
    records.push(
      Object.freeze({
        recordId: "fragmentation::unstable-alignment",
        fragmentationType: "unstable_alignment",
        fragmentationStrength: clamp01(unstableAlignment / Math.max(1, input.consensusSignals.length)),
        explanation:
          "Unstable executive alignment may elevate recovery volatility when agreement remains partial across domains.",
        contributingConsensusIds: Object.freeze(consensusIds.slice(0, 4)),
      })
    );
  }

  if (input.comparisonState.executiveComparisonLabel === "fragmented" ||
    input.comparisonState.pathwayDivergenceScore >= 0.5) {
    records.push(
      Object.freeze({
        recordId: "fragmentation::strategic-fragmentation",
        fragmentationType: "strategic_fragmentation",
        fragmentationStrength: input.comparisonState.pathwayDivergenceScore,
        explanation:
          "Strategic fragmentation may persist when competing pathways diverge across restructuring and stabilization priorities.",
        contributingConsensusIds: Object.freeze(consensusIds.slice(0, 4)),
      })
    );
  }

  const strategyB = input.comparisonState.activeStrategyComparisons.find(
    (s) => s.strategyId === "strategy-b"
  );
  const strategyA = input.comparisonState.activeStrategyComparisons.find(
    (s) => s.strategyId === "strategy-a"
  );
  if (strategyB && strategyA && strategyB.comparisonState !== strategyA.comparisonState) {
    records.push(
      Object.freeze({
        recordId: "fragmentation::competing-recovery-priorities",
        fragmentationType: "competing_recovery_priorities",
        fragmentationStrength: clamp01(
          strategyB.comparisonStrength * 0.4 + strategyA.comparisonStrength * 0.35
        ),
        explanation:
          "Recovery acceleration may be supported while restructuring sequencing remains disputed, creating consensus instability risk.",
        contributingConsensusIds: Object.freeze(consensusIds.slice(0, 4)),
      })
    );
  }

  if (
    input.governanceState.executiveGovernanceLabel === "volatile" ||
    input.governanceState.executiveGovernanceLabel === "restricted"
  ) {
    records.push(
      Object.freeze({
        recordId: "fragmentation::governance-coherence-instability",
        fragmentationType: "governance_coherence_instability",
        fragmentationStrength: input.governanceState.oversightRequirementScore,
        explanation:
          "Governance-coherence instability may reflect misalignment between advisory guidance and executive oversight expectations.",
        contributingConsensusIds: Object.freeze(consensusIds.slice(0, 4)),
      })
    );
  }

  if (input.advisoryState.executiveAdvisoryLabel === "preventive" &&
    input.comparisonState.executiveComparisonLabel === "divergent") {
    records.push(
      Object.freeze({
        recordId: "fragmentation::operational-consensus-gap",
        fragmentationType: "operational_consensus_gap",
        fragmentationStrength: clamp01(
          input.advisoryState.actionabilityScore * 0.4 +
            input.comparisonState.pathwayDivergenceScore * 0.4
        ),
        explanation:
          "Operational consensus gaps may appear when preventive advisory intent diverges from pathway comparison outcomes.",
        contributingConsensusIds: Object.freeze(consensusIds.slice(0, 4)),
      })
    );
  }

  records.push(
    Object.freeze({
      recordId: "fragmentation::divergence-volatility",
      fragmentationType: "divergence_volatility",
      fragmentationStrength: clamp01(
        input.divergenceState.futureFragmentationScore * 0.45 +
          input.trajectoryState.trajectoryVolatilityScore * 0.35
      ),
      explanation:
        "Future volatility caused by strategic divergence may increase when executive alignment weakens across operational futures.",
      contributingConsensusIds: Object.freeze(consensusIds.slice(0, 4)),
    })
  );

  logExecutiveStrategicConsensusDev("Fragmentation", { fragmentationRecordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}
