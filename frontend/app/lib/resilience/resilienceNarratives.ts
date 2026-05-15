import type { ResilienceState } from "./organizationalResilienceTypes.ts";

function objectPhrase(ids: string[]): string {
  if (!ids.length) return "the active operating path";
  if (ids.length === 1) return ids[0].replace(/_/g, " ");
  return ids.slice(0, 3).map((id) => id.replace(/_/g, " ")).join(" - ");
}

function stateLabel(state: ResilienceState): string {
  if (state === "resilient") return "Resilient";
  if (state === "adaptive") return "Adaptive";
  if (state === "stable") return "Stable";
  if (state === "recovering") return "Recovering";
  return "Fragile";
}

export function buildResilienceTitle(params: {
  resilienceState: ResilienceState;
  relatedObjectIds: string[];
}): string {
  return `${stateLabel(params.resilienceState)} Resilience: ${objectPhrase(params.relatedObjectIds)}`;
}

export function buildResilienceSummary(params: {
  resilienceState: ResilienceState;
  relatedObjectIds: string[];
}): string {
  const path = objectPhrase(params.relatedObjectIds);
  if (params.resilienceState === "resilient") {
    return `Operational resilience is strong across ${path}, with evidence of recovery capacity and adaptive control.`;
  }
  if (params.resilienceState === "adaptive") {
    return `Operational resilience is improving across ${path} as adaptation capacity absorbs pressure.`;
  }
  if (params.resilienceState === "stable") {
    return `Operational stability is holding across ${path}, though resilience should continue to be monitored.`;
  }
  if (params.resilienceState === "recovering") {
    return `Operational recovery is emerging across ${path}, but resilience remains sensitive to renewed pressure.`;
  }
  return `Organizational resilience remains fragile across ${path} due to unresolved pressure and limited recovery evidence.`;
}

export function buildResilienceExecutiveImpact(params: {
  resilienceState: ResilienceState;
}): string {
  if (params.resilienceState === "resilient") {
    return "The organization appears better able to absorb pressure without immediate escalation.";
  }
  if (params.resilienceState === "adaptive") {
    return "Adaptive capacity is improving, giving leadership more room to stabilize operations deliberately.";
  }
  if (params.resilienceState === "stable") {
    return "Current operating conditions are stable, but resilience has not yet become durable.";
  }
  if (params.resilienceState === "recovering") {
    return "Recovery capacity is visible, but executive attention should remain on preventing relapse.";
  }
  return "Limited resilience evidence means operational pressure may re-escalate if conditions worsen.";
}

export function buildResilienceStrengtheningGuidance(params: {
  resilienceState: ResilienceState;
  relatedObjectIds: string[];
}): string {
  const path = objectPhrase(params.relatedObjectIds);
  if (params.resilienceState === "resilient") {
    return `Preserve monitoring alignment and dependency flexibility across ${path}.`;
  }
  if (params.resilienceState === "adaptive") {
    return `Continue strengthening adaptive capacity and coordination across ${path}.`;
  }
  if (params.resilienceState === "stable") {
    return `Maintain stabilization discipline and watch for drift across ${path}.`;
  }
  if (params.resilienceState === "recovering") {
    return `Sustain recovery actions and reduce dependency concentration across ${path}.`;
  }
  return `Prioritize stabilization, monitoring visibility, and dependency reduction across ${path}.`;
}
