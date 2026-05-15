import type { StrategicDriftType } from "./strategicDriftTypes.ts";

function objectPhrase(ids: string[]): string {
  if (!ids.length) return "the affected operating path";
  if (ids.length === 1) return ids[0].replace(/_/g, " ");
  return ids.slice(0, 3).map((id) => id.replace(/_/g, " ")).join(" - ");
}

function labelFor(type: StrategicDriftType): string {
  if (type === "fragility_reemergence") return "Fragility Re-Emergence";
  if (type === "propagation_expansion") return "Propagation Expansion";
  if (type === "coordination_decay") return "Coordination Decay";
  if (type === "monitoring_gap") return "Monitoring Gap";
  if (type === "confidence_erosion") return "Confidence Erosion";
  if (type === "intervention_decay") return "Intervention Decay";
  return "Stability Regression";
}

export function buildStrategicDriftTitle(params: {
  driftType: StrategicDriftType;
  relatedObjectIds: string[];
}): string {
  return `${labelFor(params.driftType)}: ${objectPhrase(params.relatedObjectIds)}`;
}

export function buildStrategicDriftSummary(params: {
  driftType: StrategicDriftType;
  relatedObjectIds: string[];
}): string {
  const path = objectPhrase(params.relatedObjectIds);
  if (params.driftType === "fragility_reemergence") {
    return `Previously stabilized fragility is gradually re-emerging across ${path}.`;
  }
  if (params.driftType === "propagation_expansion") {
    return `Propagation pressure is expanding again across ${path}.`;
  }
  if (params.driftType === "coordination_decay") {
    return `Operational alignment appears to be weakening across ${path}.`;
  }
  if (params.driftType === "monitoring_gap") {
    return `Operational visibility may be degrading across ${path}.`;
  }
  if (params.driftType === "confidence_erosion") {
    return `Decision confidence is softening as evidence becomes less stable across ${path}.`;
  }
  if (params.driftType === "intervention_decay") {
    return `Stabilization effect may be weakening across ${path}.`;
  }
  return `Operational stability is gradually drifting away from the prior baseline across ${path}.`;
}

export function buildStrategicDriftExecutiveImpact(params: {
  driftType: StrategicDriftType;
}): string {
  if (params.driftType === "coordination_decay") {
    return "Coordination drift can quietly weaken execution resilience before risk becomes visible.";
  }
  if (params.driftType === "monitoring_gap") {
    return "Reduced visibility may delay executive awareness of renewed operational pressure.";
  }
  if (params.driftType === "intervention_decay") {
    return "A weakening intervention effect may allow previously contained instability to return.";
  }
  if (params.driftType === "confidence_erosion") {
    return "Lower evidence stability should temper decision certainty until the signal clarifies.";
  }
  return "Gradual drift can increase enterprise fragility without producing an immediate crisis signal.";
}

export function buildDriftAttentionGuidance(params: {
  driftType: StrategicDriftType;
  relatedObjectIds: string[];
}): string {
  const path = objectPhrase(params.relatedObjectIds);
  if (params.driftType === "coordination_decay") {
    return `Review alignment and execution timing across ${path}.`;
  }
  if (params.driftType === "monitoring_gap") {
    return `Increase monitoring visibility across ${path}.`;
  }
  if (params.driftType === "intervention_decay") {
    return `Review whether the current stabilization action is still reducing pressure across ${path}.`;
  }
  if (params.driftType === "confidence_erosion") {
    return `Clarify evidence quality before increasing commitment around ${path}.`;
  }
  return `Re-evaluate stability conditions and dependency concentration across ${path}.`;
}
