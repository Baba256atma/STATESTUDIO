/**
 * D7:4:5 — Predictive recovery opportunity intelligence engine (immutable, non-mutating).
 */

import type {
  EvaluateRecoveryOpportunitiesInput,
  EvaluateRecoveryOpportunitiesResult,
  PredictiveRecoveryOpportunitySnapshot,
  PredictiveRecoveryOpportunityState,
  RecoveryOpportunityPanelContract,
} from "./recoveryOpportunityTypes.ts";
import {
  buildRecoveryOpportunityContentFingerprint,
  guardEvaluateRecoveryOpportunities,
  guardRecoveryOpportunityExecutiveSemantics,
  RECOVERY_OPPORTUNITY_UNCERTAINTY_DISCLAIMER,
} from "./recoveryOpportunityGuards.ts";
import {
  calculateRecoveryAccelerationScore,
  calculateStabilizationPotentialScore,
  classifyRecoveryOpportunityLabel,
  deriveRecoveryOpportunitySignals,
  identifyFragileRecoveryZones,
  identifyResilienceAccelerationZones,
  identifyStabilizationOpportunityZones,
} from "./opportunityEmergenceModel.ts";
import { analyzeRecoveryLeveragePoints } from "./recoveryLeveragePointAnalysis.ts";
import { analyzePredictiveStabilization } from "./predictiveStabilizationIntelligence.ts";
import { buildExecutiveRecoveryOpportunitySemantics } from "./executiveRecoveryOpportunitySemantics.ts";
import { CANONICAL_REGION_LABELS } from "../topology/operationalUniverseClassification.ts";
import { logRecoveryOpportunityDev } from "./recoveryOpportunityDevLog.ts";

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(record[k])}`).join(",")}}`;
}

function recoveryOpportunityBuiltAt(tick: number): string {
  return new Date(Date.UTC(2026, 0, 1) + tick * 1000).toISOString();
}

function clamp01Stress(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function buildRecoveryOpportunityPanelContract(input: {
  snapshot: PredictiveRecoveryOpportunitySnapshot;
}): RecoveryOpportunityPanelContract {
  const regionLabel = (id: string) =>
    CANONICAL_REGION_LABELS[id as keyof typeof CANONICAL_REGION_LABELS] ?? id;

  const viewHint =
    input.snapshot.state.recoveryLeveragePointRecords.length > 2
      ? "stabilization_leverage_heatmap"
      : input.snapshot.state.resilienceAccelerationZones.length > 2
        ? "resilience_opportunity_panel"
        : input.snapshot.state.recoveryOpportunityLabel === "accelerating"
          ? "predictive_recovery_dashboard"
          : input.snapshot.state.stabilizationOpportunityZones.length > 0
            ? "executive_recovery_timeline"
            : "recovery_opportunity_overlay";

  return Object.freeze({
    recoveryOpportunityStateId: input.snapshot.recoveryOpportunityStateId,
    topologyId: input.snapshot.topologyId,
    recoveryAccelerationScore: input.snapshot.state.recoveryAccelerationScore,
    recoveryOpportunityLabel: input.snapshot.state.recoveryOpportunityLabel,
    uncertaintyDisclaimer: input.snapshot.state.uncertaintyDisclaimer,
    signals: Object.freeze(
      input.snapshot.state.activeRecoverySignals.slice(0, 16).map((signal) =>
        Object.freeze({
          signalId: signal.signalId,
          label: signal.affectedRegionIds.map(regionLabel).join(" · "),
          opportunityState: signal.opportunityState,
          opportunityStrength: signal.opportunityStrength,
        })
      )
    ),
    leverageSummaries: Object.freeze(
      input.snapshot.state.recoveryLeveragePointRecords.map((r) => r.explanation)
    ),
    headline: input.snapshot.semantics.headline,
    viewHint,
  });
}

/**
 * Evaluate predictive recovery opportunities (read-only; does not promise guaranteed recovery).
 */
export function evaluateRecoveryOpportunities(
  input: EvaluateRecoveryOpportunitiesInput
): EvaluateRecoveryOpportunitiesResult {
  const topology = input.topology;
  const tick = Math.floor(Number(input.tick ?? input.recoveryOpportunityContext?.tick) || 0);
  const recoveryOpportunityStateId = String(
    input.recoveryOpportunityStateId ??
      `predictive-recovery-opportunity::${topology.topologyId}::${tick}`
  ).trim();

  const interventionLeverageFactor = clamp01Stress(
    (input.simulationEvents?.length ?? 0) * 0.004 +
      (input.recoveryOpportunityContext?.interventionLeverageFactor ?? 0)
  );
  const stabilizationStressFactor = clamp01Stress(
    input.recoveryOpportunityContext?.stabilizationStressFactor ?? 0
  );

  logRecoveryOpportunityDev("RecoveryOpportunity", {
    recoveryOpportunityStateId,
    topologyId: topology.topologyId,
    tick,
    cascadeLabel: input.cascadeState.predictiveCascadeLabel,
    trajectoryLabel: input.trajectoryState.predictiveTrajectoryLabel,
  });

  const activeRecoverySignals = deriveRecoveryOpportunitySignals({
    topology,
    cascadeState: input.cascadeState,
    trajectoryState: input.trajectoryState,
    divergenceState: input.divergenceState,
    resilienceState: input.resilienceState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    recoveryState: input.recoveryState,
    coordinationState: input.coordinationState,
    pressureState: input.pressureState,
    trustState: input.trustState,
    interventionLeverageFactor: interventionLeverageFactor - stabilizationStressFactor * 0.5,
  });

  const recoveryAccelerationScore = calculateRecoveryAccelerationScore({
    signals: activeRecoverySignals,
    momentumState: input.momentumState,
    resilienceState: input.resilienceState,
  });

  const stabilizationPotentialScore = calculateStabilizationPotentialScore({
    signals: activeRecoverySignals,
    cascadeState: input.cascadeState,
    equilibriumState: input.equilibriumState,
  });

  const recoveryLeveragePointRecords = analyzeRecoveryLeveragePoints({
    topology,
    signals: activeRecoverySignals,
    trajectoryState: input.trajectoryState,
  });

  const predictiveStabilizationRecords = analyzePredictiveStabilization({
    topology,
    signals: activeRecoverySignals,
    trajectoryState: input.trajectoryState,
    divergenceState: input.divergenceState,
    cascadeState: input.cascadeState,
    momentumState: input.momentumState,
    equilibriumState: input.equilibriumState,
    stabilizationPotentialScore,
  });

  const fragileRecoveryZones = identifyFragileRecoveryZones(
    activeRecoverySignals,
    input.trajectoryState
  );

  const cascadeFingerprint = stableStringify({
    label: input.cascadeState.predictiveCascadeLabel,
    stabilization: input.cascadeState.cascadeStabilizationScore,
  });
  const trajectoryFingerprint = stableStringify({
    label: input.trajectoryState.predictiveTrajectoryLabel,
    recovery: input.trajectoryState.futureStabilityScore,
  });
  const resilienceFingerprint = stableStringify({
    label: input.resilienceState.resilienceStabilityLabel,
    score: input.resilienceState.enterpriseResilienceScore,
  });

  const pendingFingerprint = buildRecoveryOpportunityContentFingerprint({
    topologyFingerprint: topology.fingerprint,
    cascadeFingerprint,
    trajectoryFingerprint,
    resilienceFingerprint,
    tick,
  });

  const guard = guardEvaluateRecoveryOpportunities({
    topologyId: topology.topologyId,
    regionIds: topology.operationalRegions.map((r) => r.regionId),
    signals: activeRecoverySignals,
    priorRecoveryOpportunityFingerprints: input.priorRecoveryOpportunityFingerprints,
    pendingFingerprint,
    recoveryAccelerationScore,
    stabilizationPotentialScore,
  });
  if (!guard.ok) return { ok: false, guard };

  const recoveryOpportunityLabel = classifyRecoveryOpportunityLabel({
    recoveryAccelerationScore,
    stabilizationPotentialScore,
    fragileZoneCount: fragileRecoveryZones.length,
  });

  const state: PredictiveRecoveryOpportunityState = Object.freeze({
    activeRecoverySignals: Object.freeze(activeRecoverySignals),
    recoveryLeveragePointRecords,
    predictiveStabilizationRecords,
    stabilizationOpportunityZones: identifyStabilizationOpportunityZones(activeRecoverySignals),
    fragileRecoveryZones,
    resilienceAccelerationZones: identifyResilienceAccelerationZones(
      activeRecoverySignals,
      input.resilienceState
    ),
    recoveryAccelerationScore,
    stabilizationPotentialScore,
    recoveryOpportunityLabel,
    uncertaintyDisclaimer: RECOVERY_OPPORTUNITY_UNCERTAINTY_DISCLAIMER,
  });

  const semantics = buildExecutiveRecoveryOpportunitySemantics({ state });
  const semanticsGuard = guardRecoveryOpportunityExecutiveSemantics({
    headline: semantics.headline,
    summary: semantics.summary,
  });
  if (!semanticsGuard.ok) return { ok: false, guard: semanticsGuard };

  const fingerprint = stableStringify({
    content: pendingFingerprint,
    recoveryOpportunityStateId,
    recoveryOpportunityLabel,
    recoveryAccelerationScore,
    stabilizationPotentialScore,
  });

  const snapshot: PredictiveRecoveryOpportunitySnapshot = Object.freeze({
    recoveryOpportunityStateId,
    topologyId: topology.topologyId,
    cascadeStateId: `predictive-cascade::${topology.topologyId}::${tick}`,
    tick,
    state,
    semantics: Object.freeze({
      ...semantics,
      signalSummaries: Object.freeze([...semantics.signalSummaries]),
      leverageSummaries: Object.freeze([...semantics.leverageSummaries]),
      stabilizationSummaries: Object.freeze([...semantics.stabilizationSummaries]),
      bullets: Object.freeze([...semantics.bullets]),
    }),
    fingerprint,
    builtAt: recoveryOpportunityBuiltAt(tick),
  });

  const panelContract = buildRecoveryOpportunityPanelContract({ snapshot });

  return { ok: true, snapshot, panelContract };
}

export function freezePredictiveRecoveryOpportunitySnapshot(
  snapshot: PredictiveRecoveryOpportunitySnapshot
): PredictiveRecoveryOpportunitySnapshot {
  return Object.freeze({
    ...snapshot,
    state: Object.freeze({
      ...snapshot.state,
      activeRecoverySignals: Object.freeze(
        snapshot.state.activeRecoverySignals.map((s) => Object.freeze({ ...s }))
      ),
      recoveryLeveragePointRecords: Object.freeze(
        snapshot.state.recoveryLeveragePointRecords.map((r) => Object.freeze({ ...r }))
      ),
      predictiveStabilizationRecords: Object.freeze(
        snapshot.state.predictiveStabilizationRecords.map((r) => Object.freeze({ ...r }))
      ),
      stabilizationOpportunityZones: Object.freeze([
        ...snapshot.state.stabilizationOpportunityZones,
      ]),
      fragileRecoveryZones: Object.freeze([...snapshot.state.fragileRecoveryZones]),
      resilienceAccelerationZones: Object.freeze([
        ...snapshot.state.resilienceAccelerationZones,
      ]),
    }),
    semantics: Object.freeze({ ...snapshot.semantics }),
  });
}
