/**
 * E2:99 — Executive Advisor store (module-level, event-driven).
 */

import { buildExecutiveAdvisorState } from "./executiveAdvisorRuntime.ts";
import type {
  BuildExecutiveAdvisorInput,
  ExecutiveAdvisorRecommendationStatus,
  ExecutiveAdvisorState,
} from "./executiveAdvisorTypes.ts";

type AdvisorListener = () => void;

let state: ExecutiveAdvisorState | null = null;
let lastInputSignature: string | null = null;
const recommendationStatus = new Map<string, ExecutiveAdvisorRecommendationStatus>();
const listeners = new Set<AdvisorListener>();

function notify(): void {
  listeners.forEach((listener) => listener());
}

function inputSignature(input: BuildExecutiveAdvisorInput): string {
  return [
    input.cognitiveTwin?.signature ?? "none",
    input.warRoom?.signature ?? "none",
    input.activeSimulation?.scenarioId ?? "none",
    input.scenarioComparison?.id ?? "none",
    input.decisionRecommendation?.recommendedScenarioId ?? "none",
    input.selectedObjectId ?? "none",
    (input.alerts ?? []).map((alert) => `${alert.id}:${alert.acknowledged}`).join("|") || "none",
  ].join("::");
}

function applyRecommendationStatuses(next: ExecutiveAdvisorState): ExecutiveAdvisorState {
  const recommendations = next.recommendations.map((entry) => ({
    ...entry,
    status: recommendationStatus.get(entry.id) ?? entry.status,
  }));
  return {
    ...next,
    recommendations,
    hud: {
      ...next.hud,
      recommendations: recommendations.slice(0, 4),
      topRecommendation: recommendations[0] ?? null,
    },
  };
}

export function getExecutiveAdvisorState(): ExecutiveAdvisorState | null {
  return state;
}

export function getExecutiveAdvisorServerSnapshot(): ExecutiveAdvisorState | null {
  return state;
}

export function subscribeExecutiveAdvisor(listener: AdvisorListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function refreshExecutiveAdvisor(input: BuildExecutiveAdvisorInput): ExecutiveAdvisorState | null {
  if (!input.cognitiveTwin?.active && !input.warRoom?.active) {
    clearExecutiveAdvisor();
    return null;
  }
  const nextSignature = inputSignature(input);
  if (state && lastInputSignature === nextSignature) return state;
  lastInputSignature = nextSignature;
  state = applyRecommendationStatuses(buildExecutiveAdvisorState(input));
  notify();
  return state;
}

export function setExecutiveAdvisorRecommendationStatus(
  recommendationId: string,
  status: ExecutiveAdvisorRecommendationStatus
): ExecutiveAdvisorState | null {
  if (!state) return null;
  recommendationStatus.set(recommendationId, status);
  state = applyRecommendationStatuses(state);
  notify();
  return state;
}

export function clearExecutiveAdvisor(): void {
  if (!state) return;
  state = null;
  lastInputSignature = null;
  notify();
}

export function resetExecutiveAdvisorForTests(): void {
  state = null;
  lastInputSignature = null;
  recommendationStatus.clear();
  listeners.clear();
}
