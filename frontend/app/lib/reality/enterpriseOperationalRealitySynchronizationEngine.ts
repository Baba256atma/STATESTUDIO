/**
 * D7:7:2 — Enterprise operational reality synchronization engine (immutable, operationally grounded).
 */

import type {
  EvaluateEnterpriseRealitySynchronizationInput,
  EvaluateEnterpriseRealitySynchronizationResult,
  EnterpriseRealitySynchronizationSnapshot,
  EnterpriseRealitySynchronizationIntelligenceState,
  EnterpriseRealitySynchronizationPanelContract,
} from "./enterpriseRealitySynchronizationTypes.ts";
import {
  SYNCHRONIZATION_AMBIGUITY_DISCLAIMER,
  NON_AUTONOMOUS_SYNCHRONIZATION_DISCLAIMER,
  buildSynchronizationContentFingerprint,
  guardEvaluateEnterpriseRealitySynchronization,
  guardEnterpriseRealitySynchronizationSemantics,
} from "./enterpriseRealitySynchronizationGuards.ts";
import {
  analyzeCrossDomainSynchronization,
  calculateCrossDomainSyncScore,
  calculateSynchronizationCoherenceScore,
  classifyExecutiveSynchronizationLabel,
  deriveEnterpriseRealitySynchronizationSignals,
  identifyOperationalDriftZones,
  identifySynchronizedOperationalZones,
} from "./crossDomainSynchronizationModel.ts";
import {
  analyzeOperationalDrift,
  calculateOperationalDriftScore,
} from "./operationalDriftAnalysis.ts";
import { analyzeEnterpriseContinuity } from "./enterpriseContinuityIntelligence.ts";
import { buildEnterpriseRealitySynchronizationSemantics } from "./enterpriseRealitySynchronizationSemantics.ts";
import { logEnterpriseRealitySynchronizationDev } from "./enterpriseRealitySynchronizationDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function syncBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildEnterpriseRealitySynchronizationPanelContract(input: {
  snapshot: EnterpriseRealitySynchronizationSnapshot;
}): EnterpriseRealitySynchronizationPanelContract {
  const viewHint =
    input.snapshot.state.operationalDriftRecords.length > 3
      ? "drift_heatmap"
      : input.snapshot.state.enterpriseContinuityRecords.length > 4
        ? "synchronization_timeline"
        : input.snapshot.state.executiveSynchronizationLabel === "critical"
          ? "cross_domain_continuity_panel"
          : input.snapshot.state.executiveSynchronizationLabel === "aligned"
            ? "enterprise_alignment_dashboard"
            : input.snapshot.state.activeSynchronizationSignals.length > 3
              ? "operational_synchronization_overlay"
              : "operational_synchronization_overlay";

  return Object.freeze({
    synchronizationStateId: input.snapshot.synchronizationStateId,
    topologyId: input.snapshot.topologyId,
    synchronizationCoherenceScore: input.snapshot.state.synchronizationCoherenceScore,
    executiveSynchronizationLabel: input.snapshot.state.executiveSynchronizationLabel,
    synchronizationAmbiguityDisclaimer: input.snapshot.state.synchronizationAmbiguityDisclaimer,
    nonAutonomousSynchronizationDisclaimer:
      input.snapshot.state.nonAutonomousSynchronizationDisclaimer,
    synchronizationSignals: Object.freeze(
      input.snapshot.state.activeSynchronizationSignals.map((s) =>
        Object.freeze({
          synchronizationId: s.synchronizationId,
          synchronizationState: s.synchronizationState,
          synchronizationStrength: s.synchronizationStrength,
        })
      )
    ),
    alignmentSummaries: Object.freeze(
      input.snapshot.state.crossDomainSynchronizationRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate enterprise operational reality synchronization (read-only; never autonomously governs enterprise systems).
 */
export function evaluateEnterpriseRealitySynchronization(
  input: EvaluateEnterpriseRealitySynchronizationInput
): EvaluateEnterpriseRealitySynchronizationResult {
  const topology = input.topology;
  const operational = input.operationalUniverseState;
  const tick = Math.floor(
    Number(input.tick ?? input.synchronizationContext?.tick) || 0
  );
  const synchronizationStateId = String(
    input.synchronizationStateId ??
      `enterprise-reality-sync::${topology.topologyId}::${tick}`
  ).trim();

  const synchronizationLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.synchronizationContext?.synchronizationLeverageFactor ?? 0)
  );
  const driftStressFactor = clamp01Stress(
    input.synchronizationContext?.driftStressFactor ?? 0
  );

  logEnterpriseRealitySynchronizationDev("RealitySync", {
    synchronizationStateId,
    topologyId: topology.topologyId,
    tick,
    realityLabel: input.strategicRealityState.executiveRealityLabel,
    orchestrationLabel: input.orchestrationState.executiveOrchestrationLabel,
  });

  const activeSynchronizationSignals = deriveEnterpriseRealitySynchronizationSignals({
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: operational,
    orchestrationState: input.orchestrationState,
    governanceState: input.governanceState,
    foresightState: input.foresightState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    cascadeState: input.cascadeState,
    synchronizationLeverageFactor,
    driftStressFactor,
  });

  const crossDomainSynchronizationRecords = analyzeCrossDomainSynchronization({
    synchronizationSignals: activeSynchronizationSignals,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: operational,
    orchestrationState: input.orchestrationState,
    governanceState: input.governanceState,
    foresightState: input.foresightState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    cascadeState: input.cascadeState,
  });

  const synchronizationCoherenceScore = calculateSynchronizationCoherenceScore({
    synchronizationSignals: activeSynchronizationSignals,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: operational,
    orchestrationState: input.orchestrationState,
  });

  const crossDomainSyncScore = calculateCrossDomainSyncScore({
    syncRecords: crossDomainSynchronizationRecords,
  });

  const operationalDriftRecords = analyzeOperationalDrift({
    synchronizationSignals: activeSynchronizationSignals,
    strategicRealityState: input.strategicRealityState,
    operationalUniverseState: operational,
    orchestrationState: input.orchestrationState,
    governanceState: input.governanceState,
    foresightState: input.foresightState,
    divergenceState: input.divergenceState,
    trajectoryState: input.trajectoryState,
    cascadeState: input.cascadeState,
  });

  const operationalDriftScore = calculateOperationalDriftScore({
    synchronizationSignals: activeSynchronizationSignals,
    driftRecords: operationalDriftRecords,
    strategicRealityState: input.strategicRealityState,
    divergenceState: input.divergenceState,
    orchestrationState: input.orchestrationState,
  });

  const enterpriseContinuityRecords = analyzeEnterpriseContinuity({
    synchronizationSignals: activeSynchronizationSignals,
    syncRecords: crossDomainSynchronizationRecords,
    driftRecords: operationalDriftRecords,
    trajectoryState: input.trajectoryState,
    momentumState: operational.momentumState,
    equilibriumState: operational.equilibriumState,
    divergenceState: input.divergenceState,
  });

  const realityFingerprint = stableStringify({
    label: input.strategicRealityState.executiveRealityLabel,
    coherence: input.strategicRealityState.operationalRealityCoherenceScore,
    instability: input.strategicRealityState.realityInstabilityScore,
  });
  const orchestrationFingerprint = stableStringify({
    label: input.orchestrationState.executiveOrchestrationLabel,
    coherence: input.orchestrationState.orchestrationCoherenceScore,
  });
  const momentumFingerprint = stableStringify({
    momentum: operational.momentumState.organizationalMomentumScore,
    recovery: operational.momentumState.recoveryMomentumScore,
  });
  const equilibriumFingerprint = stableStringify({
    score: operational.equilibriumState.equilibriumScore,
  });
  const governanceFingerprint = stableStringify({
    label: input.governanceState.executiveGovernanceLabel,
    stability: input.governanceState.governanceStabilityScore,
  });
  const foresightFingerprint = stableStringify({
    label: input.foresightState.predictiveForesightLabel,
    preparedness: input.foresightState.strategicPreparednessScore,
  });
  const trajectoryFingerprint = stableStringify({
    stability: input.trajectoryState.futureStabilityScore,
    volatility: input.trajectoryState.trajectoryVolatilityScore,
  });
  const divergenceFingerprint = stableStringify({
    fragmentation: input.divergenceState.futureFragmentationScore,
  });

  const pendingFingerprint = buildSynchronizationContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    realityFingerprint,
    orchestrationFingerprint,
    momentumFingerprint,
    equilibriumFingerprint,
    governanceFingerprint,
    foresightFingerprint,
    trajectoryFingerprint,
    divergenceFingerprint,
    tick,
  });

  const guard = guardEvaluateEnterpriseRealitySynchronization({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    synchronizationSignals: activeSynchronizationSignals,
    priorSynchronizationFingerprints: input.priorSynchronizationFingerprints,
    pendingFingerprint,
    synchronizationCoherenceScore,
    operationalDriftScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const executiveSynchronizationLabel = classifyExecutiveSynchronizationLabel({
    synchronizationCoherenceScore,
    crossDomainSyncScore,
    operationalDriftScore,
    synchronizationSignals: activeSynchronizationSignals,
  });

  const state: EnterpriseRealitySynchronizationIntelligenceState = Object.freeze({
    activeSynchronizationSignals: Object.freeze(activeSynchronizationSignals),
    crossDomainSynchronizationRecords,
    operationalDriftRecords,
    enterpriseContinuityRecords,
    synchronizedOperationalZones: identifySynchronizedOperationalZones(
      activeSynchronizationSignals
    ),
    operationalDriftZones: identifyOperationalDriftZones(activeSynchronizationSignals),
    synchronizationCoherenceScore,
    crossDomainSyncScore,
    operationalDriftScore,
    executiveSynchronizationLabel,
    synchronizationAmbiguityDisclaimer: SYNCHRONIZATION_AMBIGUITY_DISCLAIMER,
    nonAutonomousSynchronizationDisclaimer: NON_AUTONOMOUS_SYNCHRONIZATION_DISCLAIMER,
  });

  const semantics = buildEnterpriseRealitySynchronizationSemantics({ state });
  const semanticsGuard = guardEnterpriseRealitySynchronizationSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    synchronizationStateId,
    executiveSynchronizationLabel,
    synchronizationCoherenceScore,
    crossDomainSyncScore,
  });

  const snapshot: EnterpriseRealitySynchronizationSnapshot = Object.freeze({
    synchronizationStateId,
    topologyId: topology.topologyId,
    realityStateId:
      input.realityStateId ?? `strategic-reality::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      synchronizationSummaries: Object.freeze([...semantics.synchronizationSummaries]),
      alignmentSummaries: Object.freeze([...semantics.alignmentSummaries]),
      driftSummaries: Object.freeze([...semantics.driftSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: syncBuiltAt(tick),
  });

  const panelContract = buildEnterpriseRealitySynchronizationPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezeEnterpriseRealitySynchronizationSnapshot(
  snapshot: EnterpriseRealitySynchronizationSnapshot
): EnterpriseRealitySynchronizationSnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeSynchronizationSignals: Object.freeze(
        snapshot.state.activeSynchronizationSignals.map((s) => Object.freeze({ ...s }))
      ),
      crossDomainSynchronizationRecords: Object.freeze(
        snapshot.state.crossDomainSynchronizationRecords.map((r) => Object.freeze({ ...r }))
      ),
      operationalDriftRecords: Object.freeze(
        snapshot.state.operationalDriftRecords.map((r) => Object.freeze({ ...r }))
      ),
      enterpriseContinuityRecords: Object.freeze(
        snapshot.state.enterpriseContinuityRecords.map((r) => Object.freeze({ ...r }))
      ),
      synchronizedOperationalZones: Object.freeze([
        ...snapshot.state.synchronizedOperationalZones,
      ]),
      operationalDriftZones: Object.freeze([...snapshot.state.operationalDriftZones]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
