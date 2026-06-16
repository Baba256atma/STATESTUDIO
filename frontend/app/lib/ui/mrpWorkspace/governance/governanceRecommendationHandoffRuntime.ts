/**
 * MRP:5A:5 — Governance runtime store for RecommendationPackage consumption.
 */

import type { RecommendationPackage } from "../advisory/advisoryHandoffContract.ts";
import { buildRecommendationPackageSignature } from "../advisory/advisoryHandoffResolver.ts";
import {
  DEFAULT_GOVERNANCE_RECOMMENDATION_HANDOFF_STATE,
  GOVERNANCE_RECOMMENDATION_HANDOFF_TAG,
  type GovernanceRecommendationHandoffState,
} from "./governanceRecommendationHandoffContract.ts";

const listeners = new Set<() => void>();
const loggedReceiveKeys = new Set<string>();

let state: GovernanceRecommendationHandoffState =
  DEFAULT_GOVERNANCE_RECOMMENDATION_HANDOFF_STATE;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function notifyListeners(): void {
  for (const listener of listeners) listener();
}

function logReceiveOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedReceiveKeys.has(key)) return;
  loggedReceiveKeys.add(key);
  globalThis.console?.debug?.(GOVERNANCE_RECOMMENDATION_HANDOFF_TAG, detail);
}

export function getGovernanceRecommendationHandoffState(): GovernanceRecommendationHandoffState {
  return state;
}

export function subscribeGovernanceRecommendationHandoffState(
  listener: () => void
): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function receiveRecommendationPackage(
  recommendationPackage: RecommendationPackage
): GovernanceRecommendationHandoffState {
  const signature = buildRecommendationPackageSignature(recommendationPackage);
  state = Object.freeze({
    recommendationPackage,
    receivedAt: recommendationPackage.createdAt,
    approvalBlocked: true,
    executionBlocked: true,
  });
  notifyListeners();
  logReceiveOnce(signature, {
    action: "recommendation_package_received",
    recommendationId: recommendationPackage.recommendationId,
    recommendationTitle: recommendationPackage.recommendationTitle,
    confidence: recommendationPackage.confidence,
    approvalBlocked: true,
    executionBlocked: true,
  });
  return state;
}

export function consumeGovernanceRecommendationPackage(): RecommendationPackage | null {
  return state.recommendationPackage;
}

export function resetGovernanceRecommendationHandoffRuntimeForTests(): void {
  loggedReceiveKeys.clear();
  state = DEFAULT_GOVERNANCE_RECOMMENDATION_HANDOFF_STATE;
  notifyListeners();
}
