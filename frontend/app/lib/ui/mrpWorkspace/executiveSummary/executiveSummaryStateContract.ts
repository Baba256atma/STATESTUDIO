/**
 * MRP:4:2 / MRP:4:3 — Executive Summary runtime state contract.
 *
 * Runtime structure only — no business calculations or AI recommendations.
 */

import type { ExecutiveSummarySystemStatus } from "./executiveSummaryWorkspaceContract.ts";
import {
  DEFAULT_EXECUTIVE_SUMMARY_OBJECT_CONTEXT,
  type ExecutiveSummaryObjectContext,
} from "./executiveSummaryObjectContextContract.ts";

export const EXEC_SUMMARY_STATE_TAG = "[EXEC_SUMMARY_STATE]" as const;
export const EXEC_SUMMARY_RUNTIME_TAG = "[EXEC_SUMMARY_RUNTIME]" as const;

export const EXECUTIVE_SUMMARY_STATE_VERSION = "4.3.0";

export type ExecutiveSummaryStatePhase = "loading" | "ready" | "empty";

export type ExecutiveSummaryFieldSnapshot = Readonly<{
  headline: string;
  detail: string;
}>;

export type ExecutiveSummaryState = Readonly<{
  phase: ExecutiveSummaryStatePhase;
  systemStatus: ExecutiveSummarySystemStatus;
  topRisk: ExecutiveSummaryFieldSnapshot;
  topOpportunity: ExecutiveSummaryFieldSnapshot;
  recommendedAttention: ExecutiveSummaryFieldSnapshot;
  objectContext: ExecutiveSummaryObjectContext;
  revision: number;
  signature: string;
}>;

export type ExecutiveSummaryStatePublishResult = Readonly<{
  changed: boolean;
  state: ExecutiveSummaryState;
  revision: number;
  guarded: boolean;
  guardReason?: string;
}>;

export const DEFAULT_EXECUTIVE_SUMMARY_SYSTEM_STATUS: ExecutiveSummarySystemStatus = "healthy";

export const EXECUTIVE_SUMMARY_LOADING_HEADLINE = "Loading…";
export const EXECUTIVE_SUMMARY_LOADING_DETAIL =
  "Retrieving executive summary runtime state.";

export const EXECUTIVE_SUMMARY_EMPTY_HEADLINE = "No data available";
export const EXECUTIVE_SUMMARY_EMPTY_DETAIL =
  "Executive summary runtime returned an empty state.";

export const DEFAULT_EXECUTIVE_SUMMARY_TOP_RISK: ExecutiveSummaryFieldSnapshot = Object.freeze({
  headline: "No elevated risk signal",
  detail: "Runtime connected — risk intelligence not wired in MRP:4:2.",
});

export const DEFAULT_EXECUTIVE_SUMMARY_TOP_OPPORTUNITY: ExecutiveSummaryFieldSnapshot = Object.freeze({
  headline: "No prioritized opportunity signal",
  detail: "Runtime connected — opportunity intelligence not wired in MRP:4:2.",
});

export const DEFAULT_EXECUTIVE_SUMMARY_RECOMMENDED_ATTENTION: ExecutiveSummaryFieldSnapshot =
  Object.freeze({
    headline: "No active management focus signal",
    detail: "Runtime connected — advisory intelligence not wired in MRP:4:2.",
  });

export const DEFAULT_EXECUTIVE_SUMMARY_READY_STATE: ExecutiveSummaryState = Object.freeze({
  phase: "ready",
  systemStatus: DEFAULT_EXECUTIVE_SUMMARY_SYSTEM_STATUS,
  topRisk: DEFAULT_EXECUTIVE_SUMMARY_TOP_RISK,
  topOpportunity: DEFAULT_EXECUTIVE_SUMMARY_TOP_OPPORTUNITY,
  recommendedAttention: DEFAULT_EXECUTIVE_SUMMARY_RECOMMENDED_ATTENTION,
  objectContext: DEFAULT_EXECUTIVE_SUMMARY_OBJECT_CONTEXT,
  revision: 0,
  signature: "executive_summary:ready:defaults",
});
