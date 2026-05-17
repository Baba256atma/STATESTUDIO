/**
 * D7:4:4 — Predictive propagation modeling.
 */

import type { ExecutiveCoordinationState } from "../coordination/coordinationDynamicsTypes.ts";
import type { EnterpriseEquilibriumState } from "../equilibrium/equilibriumTypes.ts";
import type { EnterpriseMomentumState } from "../momentum/operationalMomentumTypes.ts";
import type { EnterprisePressureState } from "../pressure/dependencyPressureTypes.ts";
import type { HumanSystemResilienceState } from "../resilience/humanSystemResilienceTypes.ts";
import type { OperationalUniverseTopology } from "../topology/topologyTypes.ts";
import type { MultiFutureDivergenceState } from "./multiFutureDivergenceTypes.ts";
import type { PredictiveTrajectoryState } from "./futureTrajectoryTypes.ts";
import type {
  PredictiveCascadeSignal,
  PredictiveCascadeSignalState,
  PredictiveCascadeState,
  StrategicInflectionState,
} from "./cascadingConsequenceTypes.ts";
import { logCascadeDev } from "./cascadeDevLog.ts";
import { DEFAULT_MAX_PROPAGATION_HOP_DEPTH } from "./cascadeGuards.ts";

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Number(Math.min(1, Math.max(0, n)).toFixed(4));
}

function cascadeStateFromHop(
  hopDepth: number,
  intensity: number,
  stabilizing: boolean
): PredictiveCascadeSignalState {
  if (stabilizing && intensity >= 0.5) return "stabilizing";
  if (intensity >= 0.75 && hopDepth >= 2) return "critical";
  if (intensity >= 0.6 && hopDepth >= 1) return "amplifying";
  if (hopDepth >= 2) return "propagating";
  if (hopDepth === 0) return "localized";
  return hopDepth === 1 ? "propagating" : "amplifying";
}

function buildAdjacency(topology: OperationalUniverseTopology): Map<string, string[]> {
  const adj = new Map<string, string[]>();
  for (const region of topology.operationalRegions) {
    adj.set(region.regionId, []);
  }
  for (const rel of topology.crossDomainRelationships) {
    const list = adj.get(rel.sourceRegionId) ?? [];
    if (!list.includes(rel.targetRegionId)) list.push(rel.targetRegionId);
    adj.set(rel.sourceRegionId, list);
  }
  return adj;
}

export function resolveInflectionSurface(input: {
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
  inflectionState?: StrategicInflectionState;
}): StrategicInflectionState {
  if (input.inflectionState) return input.inflectionState;
  const criticalZones = [
    ...new Set([
      ...input.trajectoryState.degradationTrajectories,
      ...input.divergenceState.fragmentedFutureZones,
    ]),
  ].sort();
  const pressureScore = clamp01(
    input.trajectoryState.trajectoryVolatilityScore * 0.4 +
      input.divergenceState.futureFragmentationScore * 0.4 +
      criticalZones.length * 0.05
  );
  let label: StrategicInflectionState["strategicInflectionLabel"] = "stable";
  if (pressureScore >= 0.7) label = "critical";
  else if (pressureScore >= 0.55) label = "transitioning";
  else if (pressureScore >= 0.4) label = "strained";

  return {
    activeInflectionSignals: Object.freeze(
      criticalZones.slice(0, 4).map((regionId, i) =>
        Object.freeze({
          signalId: `inflection-derived::${regionId}`,
          affectedRegionIds: Object.freeze([regionId]),
          inflectionSeverity: clamp01(pressureScore - i * 0.05),
        })
      )
    ),
    inflectionPressureScore: pressureScore,
    criticalInflectionZones: Object.freeze(criticalZones),
    strategicInflectionLabel: label,
  };
}

export function identifyCascadeOriginRegions(input: {
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
  pressureState?: EnterprisePressureState;
  inflection: StrategicInflectionState;
}): readonly string[] {
  const origins = new Set<string>();
  for (const r of input.trajectoryState.degradationTrajectories) origins.add(r);
  for (const r of input.trajectoryState.volatilityHotspots) origins.add(r);
  for (const r of input.divergenceState.fragmentedFutureZones) origins.add(r);
  for (const r of input.pressureState?.saturationRegions ?? []) origins.add(r);
  for (const r of input.inflection.criticalInflectionZones) origins.add(r);
  if (origins.size === 0) origins.add("manufacturing");
  return Object.freeze([...origins].sort());
}

export function derivePredictiveCascadeSignals(input: {
  topology: OperationalUniverseTopology;
  trajectoryState: PredictiveTrajectoryState;
  divergenceState: MultiFutureDivergenceState;
  momentumState: EnterpriseMomentumState;
  equilibriumState: EnterpriseEquilibriumState;
  resilienceState: HumanSystemResilienceState;
  coordinationState?: ExecutiveCoordinationState;
  pressureState?: EnterprisePressureState;
  inflection: StrategicInflectionState;
  cascadeAmplificationFactor?: number;
  propagationStressFactor?: number;
}): PredictiveCascadeSignal[] {
  const signals: PredictiveCascadeSignal[] = [];
  const adj = buildAdjacency(input.topology);
  const origins = identifyCascadeOriginRegions({
    trajectoryState: input.trajectoryState,
    divergenceState: input.divergenceState,
    pressureState: input.pressureState,
    inflection: input.inflection,
  });
  const amplification = clamp01(input.cascadeAmplificationFactor ?? 0);
  const stress = clamp01(input.propagationStressFactor ?? 0);

  const coordinationStrong =
    (input.coordinationState?.organizationalSynchronizationScore ?? 0) >= 0.55;
  const recoveryRipple =
    input.momentumState.momentumTrendLabel === "recovering" &&
    input.resilienceState.resilienceStabilityLabel === "adaptive";

  for (const origin of origins) {
    const visited = new Set<string>([origin]);
    const queue: { regionId: string; hop: number }[] = [{ regionId: origin, hop: 0 }];

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) break;
      if (current.hop > DEFAULT_MAX_PROPAGATION_HOP_DEPTH) continue;

      const targets = adj.get(current.regionId) ?? [];
      for (const target of targets) {
        if (visited.has(target)) continue;
        visited.add(target);
        const hopDepth = current.hop + 1;
        if (hopDepth > DEFAULT_MAX_PROPAGATION_HOP_DEPTH) continue;

        const baseIntensity = clamp01(
          input.trajectoryState.trajectoryVolatilityScore * 0.25 +
            input.divergenceState.futureFragmentationScore * 0.2 +
            input.inflection.inflectionPressureScore * 0.15 +
            (input.pressureState?.saturationRegions.includes(origin) ? 0.15 : 0) +
            amplification * 0.1 +
            stress * 0.1 -
            hopDepth * 0.12
        );

        const stabilizing = recoveryRipple && coordinationStrong && hopDepth <= 2;
        const cascadeState = cascadeStateFromHop(hopDepth, baseIntensity, stabilizing);

        const drivers: string[] = ["dependency_propagation"];
        if (input.pressureState?.saturationRegions.includes(origin)) {
          drivers.push("dependency_pressure");
        }
        if (input.momentumState.momentumTrendLabel === "accelerating_failure") {
          drivers.push("momentum_escalation");
        }
        if (recoveryRipple && stabilizing) drivers.push("recovery_ripple");

        signals.push(
          Object.freeze({
            signalId: `cascade::${origin}->${target}::h${hopDepth}`,
            originatingRegionIds: Object.freeze([origin]),
            affectedRegionIds: Object.freeze([target]),
            cascadeState,
            propagationIntensity: baseIntensity,
            hopDepth,
            dominantCascadeDrivers: Object.freeze([...new Set(drivers)].sort()),
            executiveLabel: `Future consequence may propagate from ${origin} to ${target} at hop depth ${hopDepth}`,
          })
        );

        queue.push({ regionId: target, hop: hopDepth });
      }
    }
  }

  if (recoveryRipple && coordinationStrong) {
    signals.push(
      Object.freeze({
        signalId: "cascade::stabilization-ripple",
        originatingRegionIds: Object.freeze(
          [...input.resilienceState.adaptiveRecoveryZones].sort().slice(0, 3)
        ),
        affectedRegionIds: Object.freeze(
          [...input.trajectoryState.recoveryTrajectories].sort().slice(0, 4)
        ),
        cascadeState: "stabilizing",
        propagationIntensity: clamp01(
          input.resilienceState.enterpriseResilienceScore * 0.4 +
            (input.coordinationState?.organizationalSynchronizationScore ?? 0) * 0.35
        ),
        hopDepth: 1,
        dominantCascadeDrivers: Object.freeze([
          "executive_coordination",
          "trust_stabilization",
          "resilience_propagation",
        ]),
        executiveLabel:
          "Improved executive coordination may ripple through trust and resilience, reducing fragility concentration",
      })
    );
  }

  logCascadeDev("PredictivePropagation", { signalCount: signals.length });
  return signals.sort((a, b) => a.signalId.localeCompare(b.signalId));
}

export function calculateCascadePropagationScore(input: {
  signals: readonly PredictiveCascadeSignal[];
  trajectoryState: PredictiveTrajectoryState;
}): number {
  if (input.signals.length === 0) return 0;
  const propagating = input.signals.filter(
    (s) => s.cascadeState === "propagating" || s.cascadeState === "amplifying"
  );
  const score = clamp01(
    propagating.length / Math.max(1, input.signals.length) * 0.5 +
      input.trajectoryState.trajectoryDivergenceScore * 0.3 +
      propagating.reduce((s, sig) => s + sig.propagationIntensity, 0) /
        Math.max(1, propagating.length) *
        0.2
  );
  logCascadeDev("Cascade", { cascadePropagationScore: score });
  return score;
}

export function calculateCascadeAmplificationScore(input: {
  signals: readonly PredictiveCascadeSignal[];
  divergenceState: MultiFutureDivergenceState;
}): number {
  const amplifying = input.signals.filter(
    (s) => s.cascadeState === "amplifying" || s.cascadeState === "critical"
  );
  const score = clamp01(
    amplifying.length / Math.max(1, input.signals.length) * 0.45 +
      input.divergenceState.futureFragmentationScore * 0.35 +
      amplifying.reduce((s, sig) => s + sig.propagationIntensity, 0) /
        Math.max(1, amplifying.length) *
        0.2
  );
  logCascadeDev("CascadeAmplification", { cascadeAmplificationScore: score });
  return score;
}

export function calculateCascadeStabilizationScore(input: {
  signals: readonly PredictiveCascadeSignal[];
  resilienceState: HumanSystemResilienceState;
}): number {
  const stabilizing = input.signals.filter((s) => s.cascadeState === "stabilizing");
  const score = clamp01(
    stabilizing.length / Math.max(1, input.signals.length) * 0.4 +
      input.resilienceState.enterpriseResilienceScore * 0.35 +
      stabilizing.reduce((s, sig) => s + sig.propagationIntensity, 0) /
        Math.max(1, Math.max(1, stabilizing.length)) *
        0.25
  );
  logCascadeDev("Cascade", { cascadeStabilizationScore: score });
  return score;
}

export function identifyAmplificationZones(
  signals: readonly PredictiveCascadeSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.cascadeState === "amplifying" || signal.cascadeState === "critical") {
      for (const r of signal.affectedRegionIds) zones.add(r);
    }
  }
  return Object.freeze([...zones].sort());
}

export function identifyStabilizationZones(
  signals: readonly PredictiveCascadeSignal[]
): readonly string[] {
  const zones = new Set<string>();
  for (const signal of signals) {
    if (signal.cascadeState === "stabilizing") {
      for (const r of signal.affectedRegionIds) zones.add(r);
    }
  }
  return Object.freeze([...zones].sort());
}

export function classifyPredictiveCascadeLabel(input: {
  cascadePropagationScore: number;
  cascadeAmplificationScore: number;
  cascadeStabilizationScore: number;
}): PredictiveCascadeState["predictiveCascadeLabel"] {
  if (input.cascadeAmplificationScore >= 0.7) return "critical";
  if (input.cascadeAmplificationScore >= 0.55) return "amplifying";
  if (input.cascadePropagationScore >= 0.55 && input.cascadeStabilizationScore < 0.45) {
    return "propagating";
  }
  if (input.cascadeStabilizationScore >= 0.55 && input.cascadeAmplificationScore < 0.45) {
    return "stabilizing";
  }
  return "localized";
}
