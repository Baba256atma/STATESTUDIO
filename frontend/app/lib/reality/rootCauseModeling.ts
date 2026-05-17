/**
 * D7:7:3 — Root-cause modeling for enterprise operational causality.
 */

import type { StrategicRealityIntelligenceState } from "./strategicRealityTypes.ts";
import type { OperationalUniverseState } from "./strategicRealityTypes.ts";
import type { EnterpriseRealitySynchronizationIntelligenceState } from "./enterpriseRealitySynchronizationTypes.ts";
import type { UnifiedExecutiveOrchestrationState } from "../orchestration/unifiedExecutiveOrchestrationTypes.ts";
import type { ExecutiveStrategicGovernanceState } from "../recommendation/strategicGovernanceTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type {
  EnterpriseOperationalCausalityIntelligenceState,
  EnterpriseOperationalCausalitySignal,
  EnterpriseOperationalCausalityStateLabel,
  RootCauseRecord,
} from "./enterpriseOperationalCausalityTypes.ts";
import { logEnterpriseOperationalCausalityDev } from "./enterpriseOperationalCausalityDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function causalityStateFromProfile(
  clarity: number,
  propagation: number,
  escalation: number
): EnterpriseOperationalCausalityStateLabel {
  if (escalation >= 0.72) return "critical";
  if (escalation >= 0.58) return "unstable";
  if (propagation >= 0.55 && clarity >= 0.45) return "systemic";
  if (propagation >= 0.45) return "propagating";
  if (clarity >= 0.5 && escalation < 0.4) return "localized";
  return escalation > clarity ? "unstable" : "propagating";
}

export function deriveEnterpriseOperationalCausalitySignals(input: {
  synchronizationState: EnterpriseRealitySynchronizationIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  governanceState: ExecutiveStrategicGovernanceState;
  foresightState: PredictiveExecutiveForesightState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
  causalityLeverageFactor?: number;
  propagationStressFactor?: number;
}): EnterpriseOperationalCausalitySignal[] {
  const leverage = clamp01(input.causalityLeverageFactor ?? 0);
  const stress = clamp01(input.propagationStressFactor ?? 0);
  const signals: EnterpriseOperationalCausalitySignal[] = [];

  const zoneSets = [
    input.synchronizationState.operationalDriftZones,
    input.synchronizationState.synchronizedOperationalZones,
    input.strategicRealityState.unstableRealityZones,
    input.strategicRealityState.evolvingRealityZones,
    input.operationalUniverseState.momentumState.degradationZones,
    input.operationalUniverseState.equilibriumState.imbalanceZones,
    input.operationalUniverseState.resilienceState.resilienceFragilityZones,
    input.operationalUniverseState.resilienceState.adaptiveRecoveryZones,
  ];

  for (let i = 0; i < zoneSets.length; i++) {
    const zones = (zoneSets[i]?.length ?? 0) > 0 ? [...zoneSets[i]!].sort().slice(0, 3) : [];
    if (zones.length === 0) continue;

    const clarity = clamp01(
      input.synchronizationState.synchronizationCoherenceScore * 0.25 +
        input.strategicRealityState.operationalRealityCoherenceScore * 0.25 +
        input.governanceState.governanceStabilityScore * 0.2 +
        leverage * 0.08
    );
    const propagation = clamp01(
      input.cascadeState.cascadePropagationScore * 0.3 +
        input.synchronizationState.operationalDriftScore * 0.25 +
        input.divergenceState.futureFragmentationScore * 0.2 +
        stress * 0.1
    );
    const escalation = clamp01(
      input.strategicRealityState.realityInstabilityScore * 0.3 +
        input.operationalUniverseState.resilienceState.resilienceDegradationScore * 0.25 +
        input.orchestrationState.orchestrationInstabilityScore * 0.2
    );

    const causalityState = causalityStateFromProfile(clarity, propagation, escalation);
    const causalityStrength = clamp01(
      clarity * 0.35 + (1 - propagation) * 0.3 + (1 - escalation) * 0.25
    );

    const drivers: string[] = [];
    if (causalityState === "localized") drivers.push("localized_pressure", "contained_cause");
    if (causalityState === "propagating") drivers.push("causal_propagation", "downstream_effect");
    if (causalityState === "systemic") drivers.push("systemic_cause", "cross_domain_chain");
    if (causalityState === "unstable") drivers.push("causal_instability", "amplification_risk");
    if (causalityState === "critical") drivers.push("critical_causality", "enterprise_escalation");

    signals.push(
      Object.freeze({
        causalityId: `causality::zone-cluster-${i}`,
        affectedRegionIds: Object.freeze(zones),
        causalityState,
        causalityStrength,
        dominantCausalDrivers: Object.freeze(
          drivers.length > 0 ? drivers : ["causality_assessment"]
        ),
        executiveLabel:
          causalityState === "localized" || causalityState === "propagating"
            ? "Operational causes may remain traceable to evidence-grounded enterprise conditions"
            : causalityState === "systemic" || causalityState === "critical"
              ? "Systemic causality may require executive attention when propagation chains intensify"
              : undefined,
      })
    );
  }

  if (signals.length === 0) {
    const fallback = ["logistics", "manufacturing"];
    signals.push(
      Object.freeze({
        causalityId: "causality::fallback-operational",
        affectedRegionIds: Object.freeze(fallback),
        causalityState: "propagating",
        causalityStrength: clamp01(
          input.strategicRealityState.operationalRealityCoherenceScore * 0.4 + leverage * 0.2
        ),
        dominantCausalDrivers: Object.freeze(["baseline_causality_assessment"]),
        executiveLabel:
          "Baseline operational causality assessment may apply across enterprise regions",
      })
    );
  }

  logEnterpriseOperationalCausalityDev("Causality", {
    causalitySignalCount: signals.length,
  });
  return signals.sort((a, b) => a.causalityId.localeCompare(b.causalityId));
}

export function analyzeRootCauses(input: {
  causalitySignals: readonly EnterpriseOperationalCausalitySignal[];
  synchronizationState: EnterpriseRealitySynchronizationIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  orchestrationState: UnifiedExecutiveOrchestrationState;
  governanceState: ExecutiveStrategicGovernanceState;
  foresightState: PredictiveExecutiveForesightState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
}): readonly RootCauseRecord[] {
  const records: RootCauseRecord[] = [];
  const causalityIds = input.causalitySignals.map((s) => s.causalityId);

  const regions =
    input.causalitySignals.flatMap((s) => s.affectedRegionIds).length > 0
      ? [...new Set(input.causalitySignals.flatMap((s) => s.affectedRegionIds))]
          .sort()
          .slice(0, 4)
      : ["logistics", "manufacturing", "finance"];

  const fragilityScore =
    input.operationalUniverseState.fragilityMap?.systemicExposureScore ?? 0.4;
  const pressureScore =
    input.operationalUniverseState.pressureState?.cascadeRiskScore ?? 0.35;

  records.push(
    Object.freeze({
      recordId: "root::operational-cause",
      rootCauseType: "operational_root_cause",
      causeStrength: clamp01(
        input.operationalUniverseState.momentumState.organizationalMomentumScore * 0.35 +
          fragilityScore * 0.35 +
          input.synchronizationState.operationalDriftScore * 0.2
      ),
      explanation:
        "Operational root causes may include logistics instability originating from supplier dependency concentration and production slowdown pressure.",
      contributingCausalityIds: Object.freeze(causalityIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "root::governance-origin",
      rootCauseType: "governance_origin_instability",
      causeStrength: clamp01(
        (1 - input.governanceState.governanceStabilityScore) * 0.55 +
          input.governanceState.oversightRequirementScore * 0.3
      ),
      explanation:
        "Governance-origin instability may elevate when leadership coordination overload propagates into operational misalignment.",
      contributingCausalityIds: Object.freeze(causalityIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "root::dependency-propagation",
      rootCauseType: "dependency_driven_propagation",
      causeStrength: clamp01(pressureScore * 0.5 + fragilityScore * 0.35),
      explanation:
        "Dependency-driven propagation may trace supplier dependency concentration into logistics fragility escalation and recovery instability.",
      contributingCausalityIds: Object.freeze(causalityIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "root::resilience-breakdown",
      rootCauseType: "resilience_breakdown_pathway",
      causeStrength: clamp01(
        input.operationalUniverseState.resilienceState.resilienceDegradationScore * 0.55 +
          input.operationalUniverseState.resilienceState.enterpriseResilienceScore * 0.25
      ),
      explanation:
        "Resilience breakdown pathways may signal declining adaptive capacity when recovery fragility escalates across domains.",
      contributingCausalityIds: Object.freeze(causalityIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "root::strategic-pressure",
      rootCauseType: "strategic_pressure_accumulation",
      causeStrength: clamp01(
        input.strategicRealityState.realityInstabilityScore * 0.45 +
          input.divergenceState.futureFragmentationScore * 0.35
      ),
      explanation:
        "Strategic pressure accumulation may amplify when predictive volatility intersects with operational synchronization drift.",
      contributingCausalityIds: Object.freeze(causalityIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "root::organizational-structure",
      rootCauseType: "organizational_causality_structure",
      causeStrength: clamp01(
        input.orchestrationState.orchestrationInstabilityScore * 0.45 +
          input.synchronizationState.operationalDriftScore * 0.35
      ),
      explanation:
        "Organizational causality structures may link leadership overload to coordination degradation and operational fragmentation.",
      contributingCausalityIds: Object.freeze(causalityIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    })
  );

  logEnterpriseOperationalCausalityDev("RootCause", { rootCauseRecordCount: records.length });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateCausalityClarityScore(input: {
  causalitySignals: readonly EnterpriseOperationalCausalitySignal[];
  rootCauseRecords: readonly RootCauseRecord[];
  synchronizationState: EnterpriseRealitySynchronizationIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
}): number {
  if (input.causalitySignals.length === 0) return 0;
  const signalAvg =
    input.causalitySignals.reduce((s, sig) => s + sig.causalityStrength, 0) /
    input.causalitySignals.length;
  const rootAvg =
    input.rootCauseRecords.length === 0
      ? 0
      : input.rootCauseRecords.reduce((s, r) => s + r.causeStrength, 0) /
        input.rootCauseRecords.length;
  return clamp01(
    signalAvg * 0.4 +
      rootAvg * 0.3 +
      input.synchronizationState.synchronizationCoherenceScore * 0.15 +
      input.strategicRealityState.operationalRealityCoherenceScore * 0.1
  );
}

export function calculateRootCauseClarityScore(input: {
  rootCauseRecords: readonly RootCauseRecord[];
}): number {
  if (input.rootCauseRecords.length === 0) return 0;
  return clamp01(
    input.rootCauseRecords.reduce((s, r) => s + r.causeStrength, 0) /
      input.rootCauseRecords.length
  );
}

export function identifyRootCauseZones(
  signals: readonly EnterpriseOperationalCausalitySignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.causalityState === "localized" ||
      signal.causalityState === "propagating"
    ) {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyPropagationRiskZones(
  signals: readonly EnterpriseOperationalCausalitySignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.causalityState === "systemic" ||
      signal.causalityState === "unstable" ||
      signal.causalityState === "critical"
    ) {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutiveCausalityLabel(input: {
  causalityClarityScore: number;
  rootCauseClarityScore: number;
  causalPropagationScore: number;
  causalitySignals: readonly EnterpriseOperationalCausalitySignal[];
}): EnterpriseOperationalCausalityIntelligenceState["executiveCausalityLabel"] {
  const critical = input.causalitySignals.filter((s) => s.causalityState === "critical").length;
  if (critical > 0 || input.causalPropagationScore >= 0.68) return "critical";
  if (input.causalPropagationScore >= 0.55) return "unstable";
  const systemic = input.causalitySignals.filter((s) => s.causalityState === "systemic").length;
  if (systemic > 0 && input.rootCauseClarityScore >= 0.5) return "systemic";
  const propagating = input.causalitySignals.filter(
    (s) => s.causalityState === "propagating"
  ).length;
  if (propagating > 0 && input.causalPropagationScore >= 0.4) return "propagating";
  if (input.causalityClarityScore >= 0.5 && input.causalPropagationScore < 0.45) {
    return "localized";
  }
  return input.causalPropagationScore > input.causalityClarityScore
    ? "unstable"
    : "propagating";
}
