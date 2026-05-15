import type { AdaptationState } from "./enterpriseAdaptationTypes.ts";

function objectPhrase(ids: string[]): string {
  if (!ids.length) return "the active operating path";
  if (ids.length === 1) return ids[0].replace(/_/g, " ");
  return ids.slice(0, 3).map((id) => id.replace(/_/g, " ")).join(" - ");
}

function stateLabel(state: AdaptationState): string {
  if (state === "evolving") return "Evolving";
  if (state === "adaptive") return "Adaptive";
  if (state === "adjusting") return "Adjusting";
  if (state === "strained") return "Strained";
  return "Rigid";
}

export function buildAdaptationTitle(params: {
  adaptationState: AdaptationState;
  relatedObjectIds: string[];
}): string {
  return `${stateLabel(params.adaptationState)} Adaptation: ${objectPhrase(params.relatedObjectIds)}`;
}

export function buildAdaptationSummary(params: {
  adaptationState: AdaptationState;
  relatedObjectIds: string[];
}): string {
  const path = objectPhrase(params.relatedObjectIds);
  if (params.adaptationState === "evolving") {
    return `Enterprise adaptation is strengthening across ${path} as flexibility and coordination improve together.`;
  }
  if (params.adaptationState === "adaptive") {
    return `Operational coordination is adapting across ${path} with visible flexibility under pressure.`;
  }
  if (params.adaptationState === "adjusting") {
    return `The organization is adjusting across ${path}, though adaptation capacity is still forming.`;
  }
  if (params.adaptationState === "strained") {
    return `Adaptation remains strained across ${path} because operational flexibility is limited.`;
  }
  return `Rigid operational dependencies continue limiting enterprise adaptability across ${path}.`;
}

export function buildAdaptationExecutiveImpact(params: {
  adaptationState: AdaptationState;
}): string {
  if (params.adaptationState === "evolving") {
    return "Enterprise systems appear able to adjust constructively as operating pressure changes.";
  }
  if (params.adaptationState === "adaptive") {
    return "Operational flexibility is improving, which can reduce the cost of future stabilization.";
  }
  if (params.adaptationState === "adjusting") {
    return "Adaptation is underway, but executive attention should keep pressure from re-concentrating.";
  }
  if (params.adaptationState === "strained") {
    return "Limited flexibility may slow recovery if operating pressure increases again.";
  }
  return "Rigid structures may amplify instability because the organization has limited room to adjust.";
}

export function buildAdaptationGuidance(params: {
  adaptationState: AdaptationState;
  bottleneckLabels: string[];
  relatedObjectIds: string[];
}): string {
  const path = objectPhrase(params.relatedObjectIds);
  const bottleneck = params.bottleneckLabels[0]?.toLowerCase();
  if (params.adaptationState === "evolving" || params.adaptationState === "adaptive") {
    return `Preserve flexibility and coordination responsiveness across ${path}.`;
  }
  if (params.adaptationState === "adjusting") {
    return `Continue reducing rigid dependencies and monitor adaptation progress across ${path}.`;
  }
  if (bottleneck) {
    return `Address ${bottleneck} before expecting durable adaptation across ${path}.`;
  }
  return `Increase operational flexibility and coordination responsiveness across ${path}.`;
}
