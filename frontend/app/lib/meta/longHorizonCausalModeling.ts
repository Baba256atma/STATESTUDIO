/**
 * D7:8:3 — Long-horizon strategic causal modeling.
 */

import type { StrategicRealityIntelligenceState } from "../reality/strategicRealityTypes.ts";
import type { OperationalUniverseState } from "../reality/strategicRealityTypes.ts";
import type { MetaStrategicIntelligenceState } from "./metaStrategicTypes.ts";
import type { StrategicPatternEvolutionIntelligenceState } from "./strategicPatternEvolutionTypes.ts";
import type { PredictiveExecutiveForesightState } from "../simulation/predictive/executiveForesightTypes.ts";
import type { MultiFutureDivergenceState } from "../simulation/predictive/multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "../simulation/predictive/futureTrajectoryTypes.ts";
import type { PredictiveCascadeState } from "../simulation/predictive/cascadingConsequenceTypes.ts";
import type {
  LongHorizonCausalRecord,
  StrategicMetaCausalitySignal,
  StrategicMetaCausalityStateLabel,
} from "./strategicMetaCausalityTypes.ts";
import { logStrategicMetaCausalityDev } from "./strategicMetaCausalityDevLog.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function metaCausalityStateFromProfile(
  localization: number,
  propagation: number,
  destabilization: number
): StrategicMetaCausalityStateLabel {
  if (destabilization >= 0.72) return "critical";
  if (destabilization >= 0.58) return "destabilizing";
  if (propagation >= 0.55 && localization >= 0.45) return "systemic";
  if (propagation >= 0.45) return "propagating";
  return destabilization > propagation ? "destabilizing" : "localized";
}

export function deriveStrategicMetaCausalitySignals(input: {
  strategicPatternState: StrategicPatternEvolutionIntelligenceState;
  metaStrategicState: MetaStrategicIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  foresightState: PredictiveExecutiveForesightState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
  causalityLeverageFactor?: number;
  forcePropagationStressFactor?: number;
}): StrategicMetaCausalitySignal[] {
  const leverage = clamp01(input.causalityLeverageFactor ?? 0);
  const stress = clamp01(input.forcePropagationStressFactor ?? 0);
  const signals: StrategicMetaCausalitySignal[] = [];

  const zoneSets = [
    input.strategicPatternState.adaptivePatternZones,
    input.strategicPatternState.unstablePatternZones,
    input.metaStrategicState.adaptiveStrategyZones,
    input.metaStrategicState.unstableMetaZones,
  ];

  for (let i = 0; i < zoneSets.length; i++) {
    const zones = (zoneSets[i]?.length ?? 0) > 0 ? [...zoneSets[i]!].sort().slice(0, 3) : [];
    if (zones.length === 0) continue;

    const localization = clamp01(
      input.strategicPatternState.patternCoherenceScore * 0.3 +
        input.metaStrategicState.strategicMetaCoherenceScore * 0.25 +
        leverage * 0.1
    );
    const propagation = clamp01(
      input.strategicPatternState.longHorizonPatternScore * 0.35 +
        input.strategicRealityState.unifiedOperationalStateScore * 0.25 +
        input.cascadeState.cascadePropagationScore * 0.15 +
        leverage * 0.08
    );
    const destabilization = clamp01(
      input.strategicPatternState.patternInstabilityScore * 0.35 +
        input.metaStrategicState.metaInstabilityScore * 0.25 +
        input.trajectoryState.trajectoryVolatilityScore * 0.2 +
        stress * 0.1
    );

    const metaCausalityState = metaCausalityStateFromProfile(
      localization,
      propagation,
      destabilization
    );
    const metaCausalityStrength = clamp01(
      localization * 0.3 + propagation * 0.35 + (1 - destabilization) * 0.3
    );

    const drivers: string[] = [];
    if (metaCausalityState === "localized") drivers.push("localized_cause", "domain_specific_force");
    if (metaCausalityState === "propagating") drivers.push("causal_propagation", "cross_domain_influence");
    if (metaCausalityState === "systemic") drivers.push("systemic_force", "enterprise_wide_causality");
    if (metaCausalityState === "destabilizing") drivers.push("destabilizing_force", "instability_amplification");
    if (metaCausalityState === "critical") drivers.push("critical_causality", "recursive_instability_driver");

    signals.push(
      Object.freeze({
        metaCausalityId: `meta-causality::zone-cluster-${i}`,
        affectedRegionIds: Object.freeze(zones),
        metaCausalityState,
        metaCausalityStrength,
        dominantMetaCausalDrivers: Object.freeze(
          drivers.length > 0 ? drivers : ["meta_causal_assessment"]
        ),
        executiveLabel:
          metaCausalityState === "localized" || metaCausalityState === "propagating"
            ? "Strategic meta-causal forces may be shaping recurring pattern evolution across connected domains"
            : metaCausalityState === "systemic"
              ? "Systemic meta-causal structures may be influencing long-horizon enterprise evolution"
              : undefined,
      })
    );
  }

  if (signals.length === 0) {
    const fallback = ["logistics", "manufacturing"];
    signals.push(
      Object.freeze({
        metaCausalityId: "meta-causality::fallback-force",
        affectedRegionIds: Object.freeze(fallback),
        metaCausalityState: "propagating",
        metaCausalityStrength: clamp01(
          input.strategicPatternState.patternCoherenceScore * 0.4 + leverage * 0.2
        ),
        dominantMetaCausalDrivers: Object.freeze(["baseline_meta_causal_assessment"]),
        executiveLabel:
          "Baseline strategic meta-causality assessment may apply across enterprise force structures",
      })
    );
  }

  logStrategicMetaCausalityDev("MetaCausality", {
    metaCausalitySignalCount: signals.length,
  });
  return signals.sort((a, b) => a.metaCausalityId.localeCompare(b.metaCausalityId));
}

export function analyzeLongHorizonCausalStructures(input: {
  metaCausalitySignals: readonly StrategicMetaCausalitySignal[];
  strategicPatternState: StrategicPatternEvolutionIntelligenceState;
  metaStrategicState: MetaStrategicIntelligenceState;
  strategicRealityState: StrategicRealityIntelligenceState;
  operationalUniverseState: OperationalUniverseState;
  foresightState: PredictiveExecutiveForesightState;
  divergenceState: MultiFutureDivergenceState;
  trajectoryState: PredictiveTrajectoryState;
  cascadeState: PredictiveCascadeState;
}): readonly LongHorizonCausalRecord[] {
  const records: LongHorizonCausalRecord[] = [];
  const metaCausalityIds = input.metaCausalitySignals.map((s) => s.metaCausalityId);

  const regions =
    input.metaCausalitySignals.flatMap((s) => s.affectedRegionIds).length > 0
      ? [...new Set(input.metaCausalitySignals.flatMap((s) => s.affectedRegionIds))].sort().slice(0, 4)
      : ["logistics", "manufacturing", "finance"];

  records.push(
    Object.freeze({
      recordId: "causal::strategic-force-propagation",
      causalType: "strategic_force_propagation",
      causalStrength: clamp01(
        input.cascadeState.cascadePropagationScore * 0.45 +
          input.strategicPatternState.longHorizonPatternScore * 0.35
      ),
      explanation:
        "Strategic-force propagation may explain how optimization and recovery pressures spread across interconnected operational domains over long horizons.",
      contributingMetaCausalityIds: Object.freeze(metaCausalityIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "causal::governance-driven",
      causalType: "governance_driven_causality",
      causalStrength: clamp01(
        input.operationalUniverseState.governanceState.governanceStabilityScore * 0.5 +
          input.metaStrategicState.strategicMetaCoherenceScore * 0.35
      ),
      explanation:
        "Governance-driven causality may shape whether recurring transparency strengthens coordination trust or fragmentation weakens continuity coherence.",
      contributingMetaCausalityIds: Object.freeze(metaCausalityIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "causal::resilience-structures",
      causalType: "resilience_causality_structures",
      causalStrength: clamp01(
        input.operationalUniverseState.resilienceState.enterpriseResilienceScore * 0.45 +
          input.operationalUniverseState.momentumState.recoveryMomentumScore * 0.35
      ),
      explanation:
        "Resilience causality structures may reveal how repeated recovery adaptation either strengthens or erodes long-horizon equilibrium capacity.",
      contributingMetaCausalityIds: Object.freeze(metaCausalityIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "causal::optimization-risk-chains",
      causalType: "optimization_risk_causal_chains",
      causalStrength: clamp01(
        input.operationalUniverseState.equilibriumState.equilibriumScore * 0.35 +
          input.strategicPatternState.patternInstabilityScore * 0.35 +
          (input.strategicPatternState.longHorizonPatternRecords.find((r) =>
            r.recordId.includes("optimization-risk")
          )?.patternStrength ?? 0.3)
      ),
      explanation:
        "Aggressive optimization governance with reduced resilience redundancy may form long-horizon fragility propagation causal chains.",
      contributingMetaCausalityIds: Object.freeze(metaCausalityIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "causal::continuity-degradation",
      causalType: "continuity_degradation_pathways",
      causalStrength: clamp01(
        input.strategicRealityState.realityInstabilityScore * 0.45 +
          input.strategicPatternState.patternInstabilityScore * 0.35
      ),
      explanation:
        "Continuity degradation pathways may emerge when recurring efficiency-maximization strategies reduce redundancy and amplify dependency concentration.",
      contributingMetaCausalityIds: Object.freeze(metaCausalityIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    }),
    Object.freeze({
      recordId: "causal::adaptive-transformation",
      causalType: "adaptive_strategic_transformation_causes",
      causalStrength: clamp01(
        input.foresightState.futureReadinessScore * 0.4 +
          input.divergenceState.futureConvergenceScore * 0.35 +
          input.metaStrategicState.strategicEvolutionScore * 0.2
      ),
      explanation:
        "Adaptive strategic transformation causes may explain how governance transparency and coordination trust reinforce long-horizon resilience strengthening.",
      contributingMetaCausalityIds: Object.freeze(metaCausalityIds.slice(0, 4)),
      affectedRegionIds: Object.freeze(regions),
    })
  );

  logStrategicMetaCausalityDev("LongHorizonCausality", {
    longHorizonCausalRecordCount: records.length,
  });
  return Object.freeze(records.sort((a, b) => a.recordId.localeCompare(b.recordId)));
}

export function calculateLongHorizonCausalScore(input: {
  metaCausalitySignals: readonly StrategicMetaCausalitySignal[];
  longHorizonCausalRecords: readonly LongHorizonCausalRecord[];
  strategicPatternState: StrategicPatternEvolutionIntelligenceState;
}): number {
  if (input.metaCausalitySignals.length === 0) return 0;
  const signalAvg =
    input.metaCausalitySignals.reduce((s, sig) => s + sig.metaCausalityStrength, 0) /
    input.metaCausalitySignals.length;
  const recordAvg =
    input.longHorizonCausalRecords.length === 0
      ? 0
      : input.longHorizonCausalRecords.reduce((s, r) => s + r.causalStrength, 0) /
        input.longHorizonCausalRecords.length;
  return clamp01(
    signalAvg * 0.35 +
      recordAvg * 0.35 +
      input.strategicPatternState.longHorizonPatternScore * 0.2 -
      input.strategicPatternState.patternInstabilityScore * 0.05
  );
}

export function identifyStrategicForceZones(
  signals: readonly StrategicMetaCausalitySignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.metaCausalityState === "localized" ||
      signal.metaCausalityState === "propagating" ||
      signal.metaCausalityState === "systemic"
    ) {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifySystemicMetaRiskZones(
  signals: readonly StrategicMetaCausalitySignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (
      signal.metaCausalityState === "destabilizing" ||
      signal.metaCausalityState === "critical"
    ) {
      for (const z of signal.affectedRegionIds) zones.add(z);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyExecutiveMetaCausalityLabel(input: {
  metaCausalityCoherenceScore: number;
  longHorizonCausalScore: number;
  metaCausalityInstabilityScore: number;
  metaCausalitySignals: readonly StrategicMetaCausalitySignal[];
}): StrategicMetaCausalityStateLabel {
  const critical = input.metaCausalitySignals.filter(
    (s) => s.metaCausalityState === "critical"
  ).length;
  if (critical > 0 || input.metaCausalityInstabilityScore >= 0.68) return "critical";
  const destabilizing = input.metaCausalitySignals.filter(
    (s) => s.metaCausalityState === "destabilizing"
  ).length;
  if (destabilizing > 0 || input.metaCausalityInstabilityScore >= 0.55) return "destabilizing";
  const systemic = input.metaCausalitySignals.filter(
    (s) => s.metaCausalityState === "systemic"
  ).length;
  if (systemic > 0 && input.longHorizonCausalScore >= 0.5) return "systemic";
  const propagating = input.metaCausalitySignals.filter(
    (s) => s.metaCausalityState === "propagating"
  ).length;
  if (propagating > 0 && input.metaCausalityCoherenceScore >= 0.5) return "propagating";
  if (input.metaCausalityCoherenceScore >= 0.45 && input.metaCausalityInstabilityScore < 0.45) {
    return "localized";
  }
  return input.metaCausalityInstabilityScore > input.metaCausalityCoherenceScore
    ? "destabilizing"
    : "propagating";
}
