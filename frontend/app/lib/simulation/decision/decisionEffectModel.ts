/**
 * D7:1:7 — Deterministic operational intervention modeling.
 */

import type { SimulationOperationalMetrics } from "../simulationTypes.ts";
import type {
  DecisionConsequenceEffect,
  StrategicDecisionInput,
  StrategicDecisionType,
} from "./strategicDecisionTypes.ts";

export interface ModeledDecisionImpact {
  effects: readonly DecisionConsequenceEffect[];
  metricsPatch: Partial<SimulationOperationalMetrics>;
  objectStatePatches: Readonly<Record<string, Record<string, unknown>>>;
  propagationSeedIntensity: number;
  benefitThemes: readonly string[];
  costThemes: readonly string[];
}

type EffectProfile = Readonly<{
  fragility: number;
  operationalLoad: number;
  confidence: number;
  recovery: number;
  propagation: number;
  stabilization: number;
  stateShift: "strained" | "degraded" | "recovering" | "stable" | "accelerated" | "monitoring";
  benefits: readonly string[];
  costs: readonly string[];
}>;

const PROFILES: Record<StrategicDecisionType, EffectProfile> = {
  resource_reallocation: {
    fragility: 0.04,
    operationalLoad: 0.12,
    confidence: -0.03,
    recovery: 0.05,
    propagation: 0.15,
    stabilization: -0.02,
    stateShift: "strained",
    benefits: ["Improved resource alignment across targeted operations"],
    costs: ["Short-term coordination strain during reallocation"],
  },
  risk_mitigation: {
    fragility: -0.14,
    operationalLoad: 0.06,
    confidence: 0.08,
    recovery: 0.1,
    propagation: 0.08,
    stabilization: 0.18,
    stateShift: "recovering",
    benefits: ["Reduced systemic risk exposure on targeted objects"],
    costs: ["Moderate operational load while controls are applied"],
  },
  cost_reduction: {
    fragility: 0.16,
    operationalLoad: -0.1,
    confidence: -0.05,
    recovery: -0.12,
    propagation: 0.05,
    stabilization: -0.08,
    stateShift: "strained",
    benefits: ["Near-term operational efficiency gains"],
    costs: ["Long-term fragility and resilience erosion"],
  },
  expansion: {
    fragility: 0.1,
    operationalLoad: 0.18,
    confidence: 0.04,
    recovery: -0.04,
    propagation: 0.22,
    stabilization: -0.06,
    stateShift: "accelerated",
    benefits: ["Growth velocity and market expansion potential"],
    costs: ["Operational strain and stabilization lag"],
  },
  stabilization: {
    fragility: -0.1,
    operationalLoad: -0.04,
    confidence: 0.06,
    recovery: 0.14,
    propagation: 0.04,
    stabilization: 0.22,
    stateShift: "stable",
    benefits: ["Improved operational stability and recovery progression"],
    costs: ["Slower expansion velocity during stabilization window"],
  },
  operational_pause: {
    fragility: -0.06,
    operationalLoad: -0.14,
    confidence: 0.02,
    recovery: 0.08,
    propagation: -0.1,
    stabilization: 0.12,
    stateShift: "monitoring",
    benefits: ["Reduced immediate operational pressure"],
    costs: ["Deferred revenue and throughput during pause"],
  },
  capacity_increase: {
    fragility: 0.08,
    operationalLoad: 0.2,
    confidence: 0.05,
    recovery: -0.02,
    propagation: 0.18,
    stabilization: -0.04,
    stateShift: "accelerated",
    benefits: ["Higher throughput and production headroom"],
    costs: ["Resource pressure, logistics stress, delayed stabilization"],
  },
};

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

function scaleDelta(base: number, intensity: number): number {
  return Number((base * intensity).toFixed(4));
}

export function modelStrategicDecisionImpact(
  decision: StrategicDecisionInput,
  intensity: number
): ModeledDecisionImpact {
  const profile = PROFILES[decision.type];
  const targets = [...new Set((decision.targetObjectIds ?? []).map((id) => String(id).trim()).filter(Boolean))].sort();
  const i = clamp01(intensity);

  const metricsPatch: Partial<SimulationOperationalMetrics> = {
    fragility: clamp01(0.2 + scaleDelta(profile.fragility, i)),
    operationalLoad: clamp01(0.3 + scaleDelta(profile.operationalLoad, i)),
    confidence: clamp01(0.75 + scaleDelta(profile.confidence, i)),
  };

  const objectStatePatches: Record<string, Record<string, unknown>> = {};
  for (const objectId of targets.length > 0 ? targets : ["__global__"]) {
    if (objectId === "__global__") continue;
    objectStatePatches[objectId] = {
      operationalState: profile.stateShift,
      metadata: {
        severity: clamp01(0.2 + Math.abs(scaleDelta(profile.fragility, i))),
        operationalLoad: clamp01(0.3 + scaleDelta(profile.operationalLoad, i)),
      },
    };
  }

  const effects: DecisionConsequenceEffect[] = [
    {
      affectedObjectIds: targets.length > 0 ? targets : ["operations"],
      operationalImpact: scaleDelta(profile.operationalLoad, i),
      fragilityImpact: scaleDelta(profile.fragility, i),
      stabilizationImpact: scaleDelta(profile.stabilization, i),
      propagationImpact: scaleDelta(profile.propagation, i),
      confidenceImpact: scaleDelta(profile.confidence, i),
      summary: `${decision.type} applied at intensity ${i}`,
    },
  ];

  return {
    effects,
    metricsPatch,
    objectStatePatches,
    propagationSeedIntensity: clamp01(0.35 + Math.abs(scaleDelta(profile.propagation, i))),
    benefitThemes: profile.benefits,
    costThemes: profile.costs,
  };
}

export function extractMetricsRecord(
  metrics?: SimulationOperationalMetrics
): Record<string, number> {
  return {
    fragility: Number(metrics?.fragility ?? 0.2),
    operationalLoad: Number(metrics?.operationalLoad ?? 0.3),
    confidence: Number(metrics?.confidence ?? 0.75),
  };
}
