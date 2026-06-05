/**
 * E2:99 — Executive Advisor store (module-level, event-driven).
 */

import { buildExecutiveAdvisorState } from "./executiveAdvisorRuntime.ts";
import {
  buildSafeExecutiveAdvisorInputSignature,
  logAdvisorAlertAccumulation,
  logAdvisorSignatureAudit,
  logAdvisorSignatureGuard,
} from "./executiveAdvisorSignatureSafety.ts";
import type {
  BuildExecutiveAdvisorInput,
  ExecutiveAdvisorRecommendationStatus,
  ExecutiveAdvisorState,
} from "./executiveAdvisorTypes.ts";

type AdvisorListener = () => void;

let state: ExecutiveAdvisorState | null = null;
let lastInputSignature: string | null = null;
let lastAlertCount = 0;
const recommendationStatus = new Map<string, ExecutiveAdvisorRecommendationStatus>();
const listeners = new Set<AdvisorListener>();

function notify(): void {
  listeners.forEach((listener) => listener());
}

function inputSignature(input: BuildExecutiveAdvisorInput): string {
  const result = buildSafeExecutiveAdvisorInputSignature(input);
  logAdvisorSignatureAudit({
    signatureLength: result.truncatedLength,
    alertCount: result.alertCount,
    recommendationCount: state?.recommendations.length ?? 0,
    selectedObjectId: input.selectedObjectId ?? null,
    dependencyCounts: {
      timelineEvents: input.timelineEvents?.length ?? 0,
      cognitiveTwinBranches: input.cognitiveTwin?.futureBranches.length ?? 0,
      warRoomAlerts: input.warRoom?.alerts.length ?? 0,
      warRoomRecommendations: input.warRoom?.recommendations.length ?? 0,
      scenarioRows: input.scenarioComparison?.rows.length ?? 0,
      memoryEntries: input.memoryState?.entries.length ?? 0,
    },
    guardActivated: result.guardActivated,
  });
  logAdvisorSignatureGuard({
    originalLength: result.originalLengthEstimate,
    truncatedLength: result.truncatedLength,
    guardActivated: result.guardActivated,
    alertCount: result.alertCount,
    recommendationCount: state?.recommendations.length ?? 0,
  });
  return result.signature;
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
  const nextAlertCount = input.alerts?.length ?? 0;
  const alertDelta = nextAlertCount - lastAlertCount;
  logAdvisorAlertAccumulation({
    previousCount: lastAlertCount,
    nextCount: nextAlertCount,
    delta: alertDelta,
    abnormalGrowth: alertDelta > 20 || nextAlertCount > 250,
    selectedObjectId: input.selectedObjectId ?? null,
  });
  lastAlertCount = nextAlertCount;
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
  lastAlertCount = 0;
  notify();
}

export function resetExecutiveAdvisorForTests(): void {
  state = null;
  lastInputSignature = null;
  lastAlertCount = 0;
  recommendationStatus.clear();
  listeners.clear();
}
