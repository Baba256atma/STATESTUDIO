/**
 * D7:7:2 — Cross-domain operational reality synchronization modeling.
 */

import type { StrategicRealityIntelligenceState } from "./strategicRealityTypes.ts";
import type { OperationalUniverseState } from "./strategicRealityTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "../recommendation/strategicGovernanceTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type {
  CrossDomainSynchronizationRecord,
  EnterpriseRealitySynchronizationIntelligenceState,
  EnterpriseRealitySynchronizationSignal,
  EnterpriseRealitySynchronizationStateLabel,
} from "./enterpriseRealitySynchronizationTypes.ts";
import { logEnterpriseRealitySynchronizationDev } from "./enterpriseRealitySynchronizationDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function syncStateFromProfile(
  coherence: number,
  alignment: number,
  drift: number
): EnterpriseRealitySynchronizationStateLabel {
  if (drift >= 0.72) return "critical";
  if (drift >= 0.58) return "fragmented";
  if (drift >= 0.45) return "drifting";
  if (alignment >= 0.55 && coherence >= 0.5) return "aligned";
  if (coherence >= 0.5 && drift < 0.4) return "stable";
  return drift > coherence ? "drifting" : "stable";
}

export function deriveEnterpriseRealitySynchronizationSignals(input: {
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  governanceState: ExecutiveStrategicGovernanceState;
  foresightState: PredictiveExecutiveForesightState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
  synchronizationLeverageFactor?: number;
  driftStressFactor?: number;
}): EnterpriseRealitySynchronizationSignal[] {
  const leverage = clamp01(input.synchronizationLeverageFactor ?? 0);
  const stress = clamp01(input.driftStressFactor ?? 0);
  const signals: EnterpriseRealitySynchronizationSignal[] = [];

  const zoneSets = [
    input.strategicRealityState.evolvingRealityZones,
    input.strategicRealityState.unstableRealityZones,
    input.operationalUniverseState.momentumState.accelerationZones,
    input.operationalUniverseState.momentumState.degradationZones,
    input.operationalUniverseState.equilibriumState.stabilityZones,
    input.operationalUniverseState.equilibriumState.imbalanceZones,
    input.operationalUniverseState.resilienceState.adaptiveRecoveryZones,
    input.operationalUniverseState.resilienceState.resilienceFragilityZones,
  ];

  for (let i = 0; i < zoneSets.length; i++) {
    const zones = (zoneSets[i]?.length ?? 0) > 0 ? [...zoneSets[i]!].sort().slice(0, 3) : [];
    if (zones.length === 0) continue;

    const coherence = clamp01(
      input.strategicRealityState.operationalRealityCoherenceScore * 0.3 +
        input.orchestrationState.orchestrationCoherenceScore * 0.25 +
        input.operationalUniverseState.equilibriumState.equilibriumScore * 0.2 +
        leverage * 0.08
    );
    const alignment = clamp01(
      input.governanceState.governanceStabilityScore * 0.35 +
        input.strategicRealityState.unifiedOperationalStateScore * 0.3 +
        input.foresightState.strategicPreparednessScore * 0.2 +
        leverage * 0.08
    );
    const drift = clamp01(
      input.divergenceState.futureFragmentationScore * 0.3 +
        input.trajectoryState.trajectoryVolatilityScore * 0.25 +
        input.strategicRealityState.realityInstabilityScore * 0.25 +
        stress * 0.1
    );

    const synchronizationState = syncStateFromProfile(coherence, alignment, drift);
    const synchronizationStrength = clamp01(
      coherence * 0.35 + alignment * 0.35 + (1 - drift) * 0.25
    );

    const drivers: string[] = [];
    if (synchronizationState === "aligned") drivers.push("cross_domain_alignment", "state_coherence");
    if (synchronizationState === "stable") drivers.push("operational_consistency", "continuity_preservation");
    if (synchronizationState === "drifting") drivers.push("operational_drift", "domain_divergence");
    if (synchronizationState === "fragmented") drivers.push("sync_fragmentation", "continuity_risk");
    if (synchronizationState === "critical") drivers.push("sync_instability", "enterprise_drift");

    signals.push(
      Object.freeze({
        synchronizationId: `sync::zone-cluster-${i}`,
        affectedRegionIds: Object.freeze(zones),
        synchronizationState,
        synchronizationStrength,
        dominantSynchronizationDrivers: Object.freeze(
          drivers.length > 0 ? drivers : ["synchronization_assessment"]
        ),
        executiveLabel:
          synchronizationState === "aligned" || synchronizationState === "stable"
            ? "Enterprise operational synchronization may remain coherent across interconnected domains"
            : synchronizationState === "drifting" || synchronizationState === "fragmented"
              ? "Operational drift may weaken synchronization when domains diverge across the enterprise"
              : undefined,
      })
    );
  }

  if (signals.length === 0) {
    const fallback = ["logistics", "manufacturing"];
    signals.push(
      Object.freeze({
        synchronizationId: "sync::fallback-operational",
        affectedRegionIds: Object.freeze(fallback),
        synchronizationState: "stable",
        synchronizationStrength: clamp01(
          input.strategicRealityState.operationalRealityCoherenceScore * 0.4 + leverage * 0.2
        ),
        dominantSynchronizationDrivers: Object.freeze(["baseline_synchronization_assessment"]),
        executiveLabel:
          "Baseline enterprise operational synchronization assessment may apply across regions",
      })
    );
  }

  logEnterpriseRealitySynchronizationDev("RealitySync", {
    synchronizationSignalCount: signals.length,
  });
  return signals.sort((a, b) => a.synchronizationId.localeCompare(b.synchronizationId));
}

export function analyzeCrossDomainSynchronization(input: {
  synchronizationSignals: readonly EnterpriseRealitySynchronizationSignal[];
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  governanceState: ExecutiveStrategicGovernanceState;
  foresightState: PredictiveExecutiveForesightState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
}): readonly CrossDomainSynchronizationRecord[] {
  const records: CrossDomainSynchronizationRecord[] = [];
  const syncIds = input.synchronizationSignals.map((s) => s.synchronizationId);

  const regions =
    input.synchronizationSignals.flatMap((s) => s.affectedRegionIds).length > 0
      ? [...new Set(input.synchronizationSignals.flatMap((s) => s.affectedRegionIds))]
          .sort()
          .slice(0, 4)
      : ["logistics", "manufacturing", "finance"];

  records.push(
    Object.freeze({
      recordId: "sync::operational-domain",
      syncType: "operational_domain_sync",
      syncStrength: clamp01(
        input.orchestrationState.orchestrationCoherenceScore * 0.45 +
          input.strategicRealityState.operationalRealityCoherenceScore * 0.35
      ),
      explanation:
        "Operational-domain synchronization may align manufacturing, logistics, and recovery pathways into one enterprise reality.",
      contributingSynchronizationIds: Object.freeze(syncIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "sync::recovery-logistics",
      syncType: "recovery_logistics_coordination",
      syncStrength: clamp01(
        input.operationalUniverseState.recoveryOpportunityState.recoveryAccelerationScore * 0.45 +
          input.operationalUniverseState.momentumState.recoveryMomentumScore * 0.35
      ),
      explanation:
        "Recovery and logistics coordination may synchronize when manufacturing recovery stabilization progresses with logistics continuity.",
      contributingSynchronizationIds: Object.freeze(syncIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "sync::governance-alignment",
      syncType: "governance_state_alignment",
      syncStrength: clamp01(
        input.governanceState.governanceStabilityScore * 0.5 +
          (1 - input.governanceState.oversightRequirementScore) * 0.25
      ),
      explanation:
        "Governance-state alignment may reflect improving policy coherence amid cross-domain operational synchronization.",
      contributingSynchronizationIds: Object.freeze(syncIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "sync::predictive-continuity",
      syncType: "predictive_continuity_coherence",
      syncStrength: clamp01(
        input.foresightState.strategicPreparednessScore * 0.4 +
          input.trajectoryState.futureStabilityScore * 0.35 +
          (1 - input.divergenceState.futureFragmentationScore) * 0.15
      ),
      explanation:
        "Predictive-continuity coherence may preserve forecast alignment when operational states synchronize across domains.",
      contributingSynchronizationIds: Object.freeze(syncIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "sync::resilience",
      syncType: "resilience_synchronization",
      syncStrength: clamp01(
        input.operationalUniverseState.resilienceState.enterpriseResilienceScore * 0.5 +
          input.operationalUniverseState.resilienceState.humanSystemAdaptationLevel * 0.25
      ),
      explanation:
        "Resilience synchronization may indicate adaptive recovery capacity aligning across enterprise operational layers.",
      contributingSynchronizationIds: Object.freeze(syncIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "sync::enterprise-continuity",
      syncType: "enterprise_state_continuity",
      syncStrength: clamp01(
        input.operationalUniverseState.equilibriumState.equilibriumScore * 0.45 +
          input.strategicRealityState.unifiedOperationalStateScore * 0.35
      ),
      explanation:
        "Enterprise-state continuity may preserve strategic operational coherence as synchronized reality evolves under executive control.",
      contributingSynchronizationIds: Object.freeze(syncIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    })
  );

  logEnterpriseRealitySynchronizationDev("OperationalAlignment", {
    crossDomainRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateSynchronizationCoherenceScore(input: {
  synchronizationSignals: readonly EnterpriseRealitySynchronizationSignal[];
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
}): number {
  if (input.synchronizationSignals.length === 0) return 0;
  const avg =
    input.synchronizationSignals.reduce((s, sig) => s + sig.synchronizationStrength, 0) /
    input.synchronizationSignals.length;
  return clamp01(
    avg * 0.4 +
      input.strategicRealityState.operationalRealityCoherenceScore * 0.25 +
      input.orchestrationState.orchestrationCoherenceScore * 0.2 +
      input.operationalUniverseState.equilibriumState.equilibriumScore * 0.1
  );
}

export function calculateCrossDomainSyncScore(input: {
  syncRecords: readonly CrossDomainSynchronizationRecord[];
}): number {
  if (input.syncRecords.length === 0) return 0;
  return clamp01(
    input.syncRecords.reduce((s, r) => s + r.syncStrength, 0) / input.syncRecords.length
  );
}

export function identifySynchronizedOperationalZones(
  signals: readonly EnterpriseRealitySynchronizationSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.synchronizationState === "aligned" ||
      signal.synchronizationState === "stable"
    ) {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyOperationalDriftZones(
  signals: readonly EnterpriseRealitySynchronizationSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.synchronizationState === "drifting" ||
      signal.synchronizationState === "fragmented" ||
      signal.synchronizationState === "critical"
    ) {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutiveSynchronizationLabel(input: {
  synchronizationCoherenceScore: number;
  crossDomainSyncScore: number;
  operationalDriftScore: number;
  synchronizationSignals: readonly EnterpriseRealitySynchronizationSignal[];
}): EnterpriseRealitySynchronizationIntelligenceState["executiveSynchronizationLabel"] {
  const critical = input.synchronizationSignals.filter(
    (s) => s.synchronizationState === "critical"
  ).length;
  if (critical > 0 || input.operationalDriftScore >= 0.68) return "critical";
  if (input.operationalDriftScore >= 0.55) return "fragmented";
  const drifting = input.synchronizationSignals.filter(
    (s) => s.synchronizationState === "drifting"
  ).length;
  if (drifting > 0 && input.operationalDriftScore >= 0.45) return "drifting";
  const aligned = input.synchronizationSignals.filter(
    (s) => s.synchronizationState === "aligned"
  ).length;
  if (aligned > 0 && input.crossDomainSyncScore >= 0.55) return "aligned";
  if (
    input.synchronizationCoherenceScore >= 0.5 &&
    input.operationalDriftScore < 0.45
  ) {
    return "stable";
  }
  return input.operationalDriftScore > input.synchronizationCoherenceScore
    ? "drifting"
    : "stable";
}
