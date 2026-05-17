/**
 * D7:7:4 — Drift-evolution modeling for enterprise strategic reality.
 */

import type { StrategicRealityIntelligenceState } from "./strategicRealityTypes.ts";
import type { OperationalUniverseState } from "./strategicRealityTypes.ts";
import type { EnterpriseRealitySynchronizationIntelligenceState } from "./enterpriseRealitySynchronizationTypes.ts";
import type { EnterpriseOperationalCausalityIntelligenceState } from "./enterpriseOperationalCausalityTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "../recommendation/strategicGovernanceTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type {
  DriftEvolutionRecord,
  EnterpriseStrategicRealityDriftIntelligenceState,
  EnterpriseStrategicRealityDriftSignal,
  EnterpriseStrategicRealityDriftStateLabel,
} from "./enterpriseStrategicRealityDriftTypes.ts";
import { logEnterpriseStrategicRealityDriftDev } from "./enterpriseStrategicRealityDriftDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function driftStateFromProfile(
  coherence: number,
  evolution: number,
  degradation: number
): EnterpriseStrategicRealityDriftStateLabel {
  if (degradation >= 0.72) return "critical";
  if (degradation >= 0.58) return "destabilizing";
  if (evolution >= 0.55 && coherence < 0.5) return "drifting";
  if (evolution >= 0.45 && degradation >= 0.4) return "emerging";
  if (coherence >= 0.55 && degradation < 0.4) return "stable";
  return degradation > coherence ? "drifting" : "emerging";
}

export function deriveEnterpriseStrategicRealityDriftSignals(input: {
  causalityState: EnterpriseOperationalCausalityIntelligenceState;
  synchronizationState: EnterpriseRealitySynchronizationIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  governanceState: ExecutiveStrategicGovernanceState;
  foresightState: PredictiveExecutiveForesightState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
  driftLeverageFactor?: number;
  degradationStressFactor?: number;
}): EnterpriseStrategicRealityDriftSignal[] {
  const leverage = clamp01(input.driftLeverageFactor ?? 0);
  const stress = clamp01(input.degradationStressFactor ?? 0);
  const signals: EnterpriseStrategicRealityDriftSignal[] = [];

  const zoneSets = [
    input.causalityState.propagationRiskZones,
    input.causalityState.rootCauseZones,
    input.synchronizationState.operationalDriftZones,
    input.strategicRealityState.unstableRealityZones,
    input.strategicRealityState.evolvingRealityZones,
    input.operationalUniverseState.momentumState.degradationZones,
    input.operationalUniverseState.equilibriumState.imbalanceZones,
    input.operationalUniverseState.resilienceState.resilienceFragilityZones,
  ];

  for (let i = 0; i < zoneSets.length; i++) {
    const zones = (zoneSets[i]?.length ?? 0) > 0 ? [...zoneSets[i]!].sort().slice(0, 3) : [];
    if (zones.length === 0) continue;

    const coherence = clamp01(
      input.strategicRealityState.operationalRealityCoherenceScore * 0.25 +
        input.synchronizationState.synchronizationCoherenceScore * 0.25 +
        input.causalityState.causalityClarityScore * 0.2 +
        leverage * 0.08
    );
    const evolution = clamp01(
      input.synchronizationState.operationalDriftScore * 0.3 +
        input.causalityState.causalPropagationScore * 0.25 +
        input.strategicRealityState.realityInstabilityScore * 0.2 +
        stress * 0.1
    );
    const degradation = clamp01(
      input.causalityState.causalPropagationScore * 0.25 +
        input.strategicRealityState.realityInstabilityScore * 0.25 +
        input.operationalUniverseState.resilienceState.resilienceDegradationScore * 0.2 +
        (1 - input.governanceState.governanceStabilityScore) * 0.15
    );

    const driftState = driftStateFromProfile(coherence, evolution, degradation);
    const driftStrength = clamp01(
      (1 - degradation) * 0.35 + coherence * 0.35 + (1 - evolution) * 0.25
    );

    const drivers: string[] = [];
    if (driftState === "stable") drivers.push("coherent_reality", "stable_alignment");
    if (driftState === "emerging") drivers.push("emerging_drift", "gradual_weakening");
    if (driftState === "drifting") drivers.push("operational_drift", "alignment_decay");
    if (driftState === "destabilizing") drivers.push("destabilizing_pressure", "coherence_loss");
    if (driftState === "critical") drivers.push("critical_drift", "systemic_fragility");

    signals.push(
      Object.freeze({
        driftId: `drift::zone-cluster-${i}`,
        affectedRegionIds: Object.freeze(zones),
        driftState,
        driftStrength,
        dominantDriftDrivers: Object.freeze(
          drivers.length > 0 ? drivers : ["drift_assessment"]
        ),
        executiveLabel:
          driftState === "stable" || driftState === "emerging"
            ? "Strategic reality may remain within gradual drift tolerance under current conditions"
            : driftState === "drifting" || driftState === "destabilizing"
              ? "Long-horizon strategic drift may require executive attention as coherence weakens"
              : undefined,
      })
    );
  }

  if (signals.length === 0) {
    const fallback = ["logistics", "manufacturing"];
    signals.push(
      Object.freeze({
        driftId: "drift::fallback-operational",
        affectedRegionIds: Object.freeze(fallback),
        driftState: "emerging",
        driftStrength: clamp01(
          input.strategicRealityState.operationalRealityCoherenceScore * 0.4 + leverage * 0.2
        ),
        dominantDriftDrivers: Object.freeze(["baseline_drift_assessment"]),
        executiveLabel:
          "Baseline strategic reality drift assessment may apply across enterprise regions",
      })
    );
  }

  logEnterpriseStrategicRealityDriftDev("RealityDrift", {
    driftSignalCount: signals.length,
  });
  return signals.sort((a, b) => a.driftId.localeCompare(b.driftId));
}

export function analyzeDriftEvolution(input: {
  driftSignals: readonly EnterpriseStrategicRealityDriftSignal[];
  causalityState: EnterpriseOperationalCausalityIntelligenceState;
  synchronizationState: EnterpriseRealitySynchronizationIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  governanceState: ExecutiveStrategicGovernanceState;
  foresightState: PredictiveExecutiveForesightState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
}): readonly DriftEvolutionRecord[] {
  const records: DriftEvolutionRecord[] = [];
  const driftIds = input.driftSignals.map((s) => s.driftId);

  const regions =
    input.driftSignals.flatMap((s) => s.affectedRegionIds).length > 0
      ? [...new Set(input.driftSignals.flatMap((s) => s.affectedRegionIds))]
          .sort()
          .slice(0, 4)
      : ["logistics", "manufacturing", "finance"];

  const fragilityScore =
    input.operationalUniverseState.fragilityMap?.systemicExposureScore ?? 0.4;
  const pressureScore =
    input.operationalUniverseState.pressureState?.cascadeRiskScore ?? 0.35;

  records.push(
    Object.freeze({
      recordId: "evolution::gradual-degradation",
      evolutionType: "gradual_operational_degradation",
      evolutionStrength: clamp01(
        input.synchronizationState.operationalDriftScore * 0.45 +
          input.strategicRealityState.realityInstabilityScore * 0.35
      ),
      explanation:
        "Gradual operational degradation may accumulate when coordination quality declines without immediate crisis signals.",
      contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "evolution::resilience-erosion",
      evolutionType: "resilience_erosion",
      evolutionStrength: clamp01(
        input.operationalUniverseState.resilienceState.resilienceDegradationScore * 0.55 +
          input.operationalUniverseState.resilienceState.enterpriseResilienceScore * 0.25
      ),
      explanation:
        "Resilience erosion may signal slow collapse of adaptive capacity across recovery pathways.",
      contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "evolution::governance-drift",
      evolutionType: "governance_drift",
      evolutionStrength: clamp01(
        (1 - input.governanceState.governanceStabilityScore) * 0.55 +
          input.governanceState.oversightRequirementScore * 0.3
      ),
      explanation:
        "Governance drift may emerge when policy clarity erodes and oversight requirements rise gradually.",
      contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "evolution::coordination-decay",
      evolutionType: "coordination_decay",
      evolutionStrength: clamp01(
        input.orchestrationState.orchestrationInstabilityScore * 0.5 +
          input.synchronizationState.operationalDriftScore * 0.35
      ),
      explanation:
        "Coordination decay may reflect leadership overload and declining recovery synchronization over time.",
      contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "evolution::dependency-accumulation",
      evolutionType: "dependency_accumulation",
      evolutionStrength: clamp01(pressureScore * 0.5 + fragilityScore * 0.4),
      explanation:
        "Dependency accumulation may intensify when supplier concentration and logistics fragility rise slowly.",
      contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "evolution::alignment-weakening",
      evolutionType: "strategic_alignment_weakening",
      evolutionStrength: clamp01(
        input.causalityState.causalPropagationScore * 0.4 +
          input.divergenceState.futureFragmentationScore * 0.35
      ),
      explanation:
        "Strategic alignment weakening may reshape enterprise trajectories as predictive coherence declines.",
      contributingDriftIds: Object.freeze(driftIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    })
  );

  logEnterpriseStrategicRealityDriftDev("OperationalDrift", {
    evolutionRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateStrategicCoherenceScore(input: {
  driftSignals: readonly EnterpriseStrategicRealityDriftSignal[];
  driftEvolutionRecords: readonly DriftEvolutionRecord[];
  strategicRealityState: StrategicRealityIntelligenceState;
  synchronizationState: EnterpriseRealitySynchronizationIntelligenceState;
  causalityState: EnterpriseOperationalCausalityIntelligenceState;
}): number {
  if (input.driftSignals.length === 0) return 0;
  const signalAvg =
    input.driftSignals.reduce((s, sig) => s + sig.driftStrength, 0) /
    input.driftSignals.length;
  const evolutionAvg =
    input.driftEvolutionRecords.length === 0
      ? 0
      : input.driftEvolutionRecords.reduce((s, r) => s + r.evolutionStrength, 0) /
        input.driftEvolutionRecords.length;
  return clamp01(
    signalAvg * 0.4 +
      input.strategicRealityState.operationalRealityCoherenceScore * 0.25 +
      input.synchronizationState.synchronizationCoherenceScore * 0.2 +
      input.causalityState.causalityClarityScore * 0.1 -
      evolutionAvg * 0.05
  );
}

export function calculateDriftEvolutionScore(input: {
  driftEvolutionRecords: readonly DriftEvolutionRecord[];
}): number {
  if (input.driftEvolutionRecords.length === 0) return 0;
  return clamp01(
    input.driftEvolutionRecords.reduce((s, r) => s + r.evolutionStrength, 0) /
      input.driftEvolutionRecords.length
  );
}

export function identifyEmergingDriftZones(
  signals: readonly EnterpriseStrategicRealityDriftSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.driftState === "stable" || signal.driftState === "emerging") {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyDestabilizedRealityZones(
  signals: readonly EnterpriseStrategicRealityDriftSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.driftState === "drifting" ||
      signal.driftState === "destabilizing" ||
      signal.driftState === "critical"
    ) {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutiveDriftLabel(input: {
  strategicCoherenceScore: number;
  driftEvolutionScore: number;
  coherenceDegradationScore: number;
  driftSignals: readonly EnterpriseStrategicRealityDriftSignal[];
}): EnterpriseStrategicRealityDriftIntelligenceState["executiveDriftLabel"] {
  const critical = input.driftSignals.filter((s) => s.driftState === "critical").length;
  if (critical > 0 || input.coherenceDegradationScore >= 0.68) return "critical";
  if (input.coherenceDegradationScore >= 0.55) return "destabilizing";
  const drifting = input.driftSignals.filter((s) => s.driftState === "drifting").length;
  if (drifting > 0 && input.driftEvolutionScore >= 0.45) return "drifting";
  const emerging = input.driftSignals.filter((s) => s.driftState === "emerging").length;
  if (emerging > 0 && input.driftEvolutionScore >= 0.4) return "emerging";
  if (input.strategicCoherenceScore >= 0.5 && input.coherenceDegradationScore < 0.45) {
    return "stable";
  }
  return input.coherenceDegradationScore > input.strategicCoherenceScore
    ? "drifting"
    : "emerging";
}
