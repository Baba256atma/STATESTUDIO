/**
 * D7:7:1 — Unified operational-state modeling for strategic reality.
 */

import type { ExecutiveCognitiveCompletionIntelligenceState } from "../cognitive/executiveCognitiveCompletionTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type {
  OperationalUniverseState,
  StrategicRealityIntelligenceState,
  StrategicRealitySignal,
  StrategicRealityStateLabel,
  UnifiedOperationalStateRecord,
} from "./strategicRealityTypes.ts";
import { logStrategicRealityDev } from "./strategicRealityDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function realityStateFromProfile(
  coherence: number,
  evolution: number,
  instability: number
): StrategicRealityStateLabel {
  if (instability >= 0.72) return "critical";
  if (instability >= 0.58) return "volatile";
  if (evolution >= 0.55 && coherence >= 0.5) return "adaptive";
  if (coherence >= 0.55 && instability < 0.45) return "stable";
  if (evolution >= 0.45) return "evolving";
  return instability > coherence ? "volatile" : "evolving";
}

export function deriveStrategicRealitySignals(input: {
  cognitiveCompletionState: ExecutiveCognitiveCompletionIntelligenceState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  operationalUniverseState: OperationalUniverseState;
  foresightState: PredictiveExecutiveForesightState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
  realityLeverageFactor?: number;
  evolutionStressFactor?: number;
}): StrategicRealitySignal[] {
  const leverage = clamp01(input.realityLeverageFactor ?? 0);
  const stress = clamp01(input.evolutionStressFactor ?? 0);
  const signals: StrategicRealitySignal[] = [];

  const zoneSets = [
    input.cognitiveCompletionState.synchronizedExecutiveZones,
    input.cognitiveCompletionState.orchestrationInstabilityZones,
    input.operationalUniverseState.momentumState.accelerationZones,
    input.operationalUniverseState.momentumState.degradationZones,
    input.operationalUniverseState.equilibriumState.stabilityZones,
    input.operationalUniverseState.equilibriumState.imbalanceZones,
    input.operationalUniverseState.resilienceState.adaptiveRecoveryZones,
    input.operationalUniverseState.resilienceState.resilienceFragilityZones,
  ];

  for (let i = 0; i < zoneSets.length; i++) {
    const zones = zoneSets[i].length > 0 ? [...zoneSets[i]].sort().slice(0, 3) : [];
    if (zones.length === 0) continue;

    const coherence = clamp01(
      input.cognitiveCompletionState.overallCognitiveCoherenceScore * 0.25 +
        input.orchestrationState.orchestrationCoherenceScore * 0.25 +
        input.operationalUniverseState.equilibriumState.equilibriumScore * 0.2 +
        input.operationalUniverseState.resilienceState.enterpriseResilienceScore * 0.15 +
        leverage * 0.08
    );
    const evolution = clamp01(
      input.operationalUniverseState.momentumState.organizationalMomentumScore * 0.3 +
        input.operationalUniverseState.recoveryOpportunityState.recoveryAccelerationScore * 0.25 +
        input.foresightState.futureReadinessScore * 0.2 +
        stress * 0.1
    );
    const instability = clamp01(
      input.divergenceState.futureFragmentationScore * 0.3 +
        input.trajectoryState.trajectoryVolatilityScore * 0.25 +
        input.cascadeState.cascadePropagationScore * 0.2 +
        input.cognitiveCompletionState.platformCoherenceDegradationScore * 0.15
    );

    const realityState = realityStateFromProfile(coherence, evolution, instability);
    const realityStrength = clamp01(
      coherence * 0.35 + evolution * 0.3 + (1 - instability) * 0.25
    );

    const drivers: string[] = [];
    if (realityState === "stable") drivers.push("operational_stability", "coherent_world_state");
    if (realityState === "evolving") drivers.push("continuous_evolution", "state_progression");
    if (realityState === "adaptive") drivers.push("adaptive_resilience", "positive_trajectory");
    if (realityState === "volatile") drivers.push("volatility_pressure", "divergence_risk");
    if (realityState === "critical") drivers.push("reality_instability", "ecosystem_risk");

    signals.push(
      Object.freeze({
        realityId: `reality::zone-cluster-${i}`,
        affectedRegionIds: Object.freeze(zones),
        realityState,
        realityStrength,
        dominantRealityDrivers: Object.freeze(
          drivers.length > 0 ? drivers : ["reality_assessment"]
        ),
        executiveLabel:
          realityState === "stable" || realityState === "adaptive"
            ? "Operational reality may evolve toward stabilization across interconnected enterprise systems"
            : realityState === "volatile" || realityState === "critical"
              ? "Strategic reality may require attention when operational ecosystems diverge across domains"
              : undefined,
      })
    );
  }

  if (signals.length === 0) {
    const fallback = ["logistics", "manufacturing"];
    signals.push(
      Object.freeze({
        realityId: "reality::fallback-operational",
        affectedRegionIds: Object.freeze(fallback),
        realityState: "evolving",
        realityStrength: clamp01(
          input.operationalUniverseState.equilibriumState.equilibriumScore * 0.4 +
            leverage * 0.2
        ),
        dominantRealityDrivers: Object.freeze(["baseline_reality_assessment"]),
        executiveLabel:
          "Baseline strategic operational reality assessment may apply across enterprise regions",
      })
    );
  }

  logStrategicRealityDev("StrategicReality", { realitySignalCount: signals.length });
  return signals.sort((a, b) => a.realityId.localeCompare(b.realityId));
}

export function analyzeUnifiedOperationalStates(input: {
  realitySignals: readonly StrategicRealitySignal[];
  cognitiveCompletionState: ExecutiveCognitiveCompletionIntelligenceState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  operationalUniverseState: OperationalUniverseState;
  foresightState: PredictiveExecutiveForesightState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
}): readonly UnifiedOperationalStateRecord[] {
  const records: UnifiedOperationalStateRecord[] = [];
  const realityIds = input.realitySignals.map((s) => s.realityId);

  const regions =
    input.realitySignals.flatMap((s) => s.affectedRegionIds).length > 0
      ? [...new Set(input.realitySignals.flatMap((s) => s.affectedRegionIds))].sort().slice(0, 3)
      : ["logistics", "manufacturing"];

  const fragilityScore =
    input.operationalUniverseState.fragilityMap?.systemicExposureScore ?? 0.4;

  records.push(
    Object.freeze({
      recordId: "state::evolving-ecosystem",
      stateType: "evolving_operational_ecosystem",
      stateStrength: clamp01(
        input.operationalUniverseState.momentumState.organizationalMomentumScore * 0.45 +
          input.trajectoryState.futureStabilityScore * 0.35
      ),
      explanation:
        "Evolving operational ecosystems may reflect continuous strategic movement across interconnected enterprise systems.",
      contributingRealityIds: Object.freeze(realityIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "state::interconnected-enterprise",
      stateType: "interconnected_enterprise_states",
      stateStrength: clamp01(
        input.orchestrationState.orchestrationCoherenceScore * 0.45 +
          input.cognitiveCompletionState.fullCognitiveSyncScore * 0.35
      ),
      explanation:
        "Interconnected enterprise states may synchronize operational, cognitive, and governance layers into one reality.",
      contributingRealityIds: Object.freeze(realityIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "state::resilience-evolution",
      stateType: "resilience_evolution",
      stateStrength: clamp01(
        input.operationalUniverseState.resilienceState.enterpriseResilienceScore * 0.5 +
          input.operationalUniverseState.recoveryOpportunityState.recoveryAccelerationScore * 0.35
      ),
      explanation:
        "Resilience evolution may indicate positive strategic reality movement when recovery stabilization progresses.",
      contributingRealityIds: Object.freeze(realityIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "state::fragility-propagation",
      stateType: "fragility_propagation",
      stateStrength: clamp01(
        fragilityScore * 0.5 + input.cascadeState.cascadePropagationScore * 0.35
      ),
      explanation:
        "Fragility propagation may trace how dependency concentration spreads through operational reality layers.",
      contributingRealityIds: Object.freeze(realityIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "state::governance-transformation",
      stateType: "governance_transformation",
      stateStrength: clamp01(
        input.operationalUniverseState.governanceState.governanceStabilityScore * 0.5 +
          (1 - input.operationalUniverseState.governanceState.oversightRequirementScore) * 0.25
      ),
      explanation:
        "Governance transformation may reflect improving policy coherence amid operational evolution.",
      contributingRealityIds: Object.freeze(realityIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "state::operational-continuity",
      stateType: "strategic_operational_continuity",
      stateStrength: clamp01(
        input.operationalUniverseState.equilibriumState.equilibriumScore * 0.45 +
          input.foresightState.strategicPreparednessScore * 0.35
      ),
      explanation:
        "Strategic operational continuity may preserve enterprise coherence as reality evolves under executive control.",
      contributingRealityIds: Object.freeze(realityIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    })
  );

  logStrategicRealityDev("EnterpriseState", { stateRecordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateOperationalRealityCoherenceScore(input: {
  realitySignals: readonly StrategicRealitySignal[];
  cognitiveCompletionState: ExecutiveCognitiveCompletionIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
}): number {
  if (input.realitySignals.length === 0) return 0;
  const avgStrength =
    input.realitySignals.reduce((s, r) => s + r.realityStrength, 0) / input.realitySignals.length;
  return clamp01(
    avgStrength * 0.35 +
      input.cognitiveCompletionState.overallCognitiveCoherenceScore * 0.25 +
      input.operationalUniverseState.equilibriumState.equilibriumScore * 0.2 +
      input.orchestrationState.orchestrationCoherenceScore * 0.15
  );
}

export function calculateUnifiedOperationalStateScore(input: {
  stateRecords: readonly UnifiedOperationalStateRecord[];
}): number {
  if (input.stateRecords.length === 0) return 0;
  return clamp01(
    input.stateRecords.reduce((s, r) => s + r.stateStrength, 0) / input.stateRecords.length
  );
}

export function identifyEvolvingRealityZones(
  signals: readonly StrategicRealitySignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.realityState === "stable" ||
      signal.realityState === "evolving" ||
      signal.realityState === "adaptive"
    ) {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyUnstableRealityZones(
  signals: readonly StrategicRealitySignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.realityState === "volatile" || signal.realityState === "critical") {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutiveRealityLabel(input: {
  operationalRealityCoherenceScore: number;
  unifiedOperationalStateScore: number;
  realityInstabilityScore: number;
  realitySignals: readonly StrategicRealitySignal[];
}): StrategicRealityIntelligenceState["executiveRealityLabel"] {
  const critical = input.realitySignals.filter((s) => s.realityState === "critical").length;
  if (critical > 0 || input.realityInstabilityScore >= 0.68) return "critical";
  if (input.realityInstabilityScore >= 0.55) return "volatile";
  const adaptive = input.realitySignals.filter((s) => s.realityState === "adaptive").length;
  if (adaptive > 0 && input.unifiedOperationalStateScore >= 0.55) return "adaptive";
  if (input.unifiedOperationalStateScore >= 0.58 && input.operationalRealityCoherenceScore >= 0.5) {
    return "stable";
  }
  if (input.operationalRealityCoherenceScore >= 0.45) return "evolving";
  return input.realityInstabilityScore > input.operationalRealityCoherenceScore
    ? "volatile"
    : "evolving";
}
