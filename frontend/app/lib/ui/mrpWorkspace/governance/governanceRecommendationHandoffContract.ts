/**
 * MRP:5A:5 — Governance recommendation handoff consumer contract.
 *
 * Governance may consume RecommendationPackage — approval remains Governance owned.
 */

import type { RecommendationPackage } from "../advisory/advisoryHandoffContract.ts";

export const GOVERNANCE_RECOMMENDATION_HANDOFF_TAG =
  "[GOVERNANCE_RECOMMENDATION_HANDOFF]" as const;

export const GOVERNANCE_RECOMMENDATION_HANDOFF_VERSION = "5A.5.0";

export type GovernanceRecommendationHandoffState = Readonly<{
  recommendationPackage: RecommendationPackage | null;
  receivedAt: string | null;
  approvalBlocked: true;
  executionBlocked: true;
}>;

export const DEFAULT_GOVERNANCE_RECOMMENDATION_HANDOFF_STATE: GovernanceRecommendationHandoffState =
  Object.freeze({
    recommendationPackage: null,
    receivedAt: null,
    approvalBlocked: true,
    executionBlocked: true,
  });
