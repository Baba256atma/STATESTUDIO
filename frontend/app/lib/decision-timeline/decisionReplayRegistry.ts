/**
 * APP-6:8 — Decision Replay registry.
 * Ephemeral replay session cache — no persistence.
 */

import {
  DECISION_REPLAY_ENGINE_CONTRACT_VERSION,
  DECISION_REPLAY_ENGINE_LIMITS,
  type DecisionReplay,
  type DecisionReplayRegistrySnapshot,
  type DecisionReplayResponse,
  type DecisionReplaySession,
  replayFailure,
  replaySuccess,
} from "./decisionReplayTypes.ts";

const replayRegistry = new Map<string, DecisionReplaySession>();
const replayViewRegistry = new Map<string, DecisionReplay>();

export function resetDecisionReplayRegistryForTests(): void {
  replayRegistry.clear();
  replayViewRegistry.clear();
}

export function registerDecisionReplaySession(
  session: DecisionReplaySession,
  replayView: DecisionReplay
): DecisionReplayResponse {
  if (replayRegistry.has(session.replayId)) {
    return replayFailure(`Replay already registered: ${session.replayId}.`);
  }
  if (replayRegistry.size >= DECISION_REPLAY_ENGINE_LIMITS.maxRegisteredReplays) {
    return replayFailure("Decision replay registry is full.");
  }
  replayRegistry.set(session.replayId, session);
  replayViewRegistry.set(replayView.replayId, replayView);
  return replaySuccess("Decision replay registered.", replayView);
}

export function updateDecisionReplaySession(
  session: DecisionReplaySession,
  replayView: DecisionReplay
): DecisionReplayResponse {
  if (!replayRegistry.has(session.replayId)) {
    return replayFailure(`Replay not found: ${session.replayId}.`);
  }
  replayRegistry.set(session.replayId, session);
  replayViewRegistry.set(replayView.replayId, replayView);
  return replaySuccess("Decision replay updated.", replayView);
}

export function getDecisionReplaySession(replayId: string): DecisionReplaySession | null {
  return replayRegistry.get(replayId) ?? null;
}

export function getRegisteredDecisionReplay(replayId: string): DecisionReplay | null {
  return replayViewRegistry.get(replayId) ?? null;
}

export function getDecisionReplayRegistry(): DecisionReplayRegistrySnapshot {
  return Object.freeze({
    registryVersion: DECISION_REPLAY_ENGINE_CONTRACT_VERSION,
    registeredReplayCount: replayRegistry.size,
    replayIds: Object.freeze([...replayRegistry.keys()]),
    readOnly: true as const,
  });
}

export const DecisionReplayRegistry = Object.freeze({
  resetDecisionReplayRegistryForTests,
  registerDecisionReplaySession,
  updateDecisionReplaySession,
  getDecisionReplaySession,
  getRegisteredDecisionReplay,
  getDecisionReplayRegistry,
});
