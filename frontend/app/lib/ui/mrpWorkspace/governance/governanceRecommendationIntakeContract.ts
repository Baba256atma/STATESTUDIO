/**
 * MRP:5A:5 — Governance recommendation intake contract.
 *
 * Consumes RecommendationPackage — no approval or execution during intake.
 */

import type { RecommendationPackage } from "../advisory/advisoryHandoffContract.ts";

export const GOVERNANCE_RECOMMENDATION_INTAKE_TAG =
  "[GOVERNANCE_RECOMMENDATION_INTAKE]" as const;

export const GOVERNANCE_RECOMMENDATION_INTAKE_VERSION = "5A.5.0";

export type RecommendationPackageValidation = Readonly<{
  valid: boolean;
  errors: readonly string[];
}>;

export type GovernanceRecommendationIntakeResult = Readonly<{
  ok: boolean;
  reason?: string;
  recommendationPackage?: RecommendationPackage;
  approvedDecision?: false;
  executedAction?: false;
}>;
