/**
 * MRP:5A:5 — Controlled Advisory → Governance handoff runtime.
 *
 * Packages recommendation for governance review — no approval or execution from Advisory.
 */

import {
  getAdvisoryWorkspaceState,
  publishAdvisoryWorkspaceState,
} from "./advisoryWorkspaceStateRuntime.ts";
import {
  ADVISORY_HANDOFF_CONTEXT,
  ADVISORY_HANDOFF_QUESTION,
  MRP_ADVISORY_HANDOFF_TAG,
  type AdvisoryHandoffInput,
  type AdvisoryHandoffSurface,
  type RecommendationPackage,
} from "./advisoryHandoffContract.ts";
import {
  buildRecommendationPackage,
  buildRecommendationPackageSignature,
} from "./advisoryHandoffResolver.ts";
import {
  guardAdvisoryForbiddenAction,
  guardAdvisoryHandoffBoundary,
} from "./advisoryBoundaryRuntime.ts";
import { intakeRecommendationPackage } from "../governance/governanceRecommendationIntakeRuntime.ts";

const loggedHandoffKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logHandoffOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedHandoffKeys.has(key)) return;
  loggedHandoffKeys.add(key);
  globalThis.console?.debug?.(MRP_ADVISORY_HANDOFF_TAG, detail);
}

export type AdvisoryHandoffResult = Readonly<{
  ok: boolean;
  reason?: string;
  recommendationPackage?: RecommendationPackage;
}>;

export function buildAdvisoryHandoffSurface(input: {
  pendingRecommendationPackage: RecommendationPackage | null;
}): AdvisoryHandoffSurface {
  return Object.freeze({
    question: ADVISORY_HANDOFF_QUESTION,
    pendingRecommendationPackage: input.pendingRecommendationPackage,
    handoffReady: input.pendingRecommendationPackage !== null,
    dashboardContext: ADVISORY_HANDOFF_CONTEXT,
    preparesOnly: true,
    recommendsOnly: true,
    approvesDecisions: false,
    executesActions: false,
  });
}

export function guardRecommendationPackageExecution(
  source?: string | null
): ReturnType<typeof guardAdvisoryHandoffBoundary> {
  return guardAdvisoryHandoffBoundary({
    action: "execute_recommendation_package",
    source: source ?? null,
  });
}

export function commitRecommendationToGovernance(
  input: AdvisoryHandoffInput = {}
): AdvisoryHandoffResult {
  const boundary = guardAdvisoryHandoffBoundary({
    action: "handoff_to_governance",
    source: "prepare_for_governance",
  });
  if (!boundary.allowed) {
    return Object.freeze({
      ok: false,
      reason: boundary.reason,
    });
  }

  const approvalBlocked = guardAdvisoryForbiddenAction({
    action: "approve_decision",
    source: "prepare_for_governance",
  });
  if (approvalBlocked.allowed) {
    return Object.freeze({
      ok: false,
      reason: "Advisory may recommend but may not approve decisions.",
    });
  }

  const state = getAdvisoryWorkspaceState();
  const recommendationPackage = buildRecommendationPackage(state, input);
  if (!recommendationPackage) {
    return Object.freeze({
      ok: false,
      reason: "Recommendation package unavailable — sync advisory recommendation first.",
    });
  }

  const signature = buildRecommendationPackageSignature(recommendationPackage);
  const intake = intakeRecommendationPackage(recommendationPackage, "prepare_for_governance");
  if (!intake.ok) {
    return Object.freeze({
      ok: false,
      reason: intake.reason ?? "Governance recommendation intake failed.",
    });
  }

  const publishResult = publishAdvisoryWorkspaceState({
    phase: state.phase === "loading" ? "ready" : state.phase,
    pendingRecommendationPackage: recommendationPackage,
    handoffReady: true,
    assumptions: Object.freeze({
      headline: "Recommendation prepared for governance review",
      detail: `${MRP_ADVISORY_HANDOFF_TAG} ${ADVISORY_HANDOFF_QUESTION} ${recommendationPackage.recommendationTitle} handed to governance — no approval or execution from Advisory.`,
    }),
  });

  logHandoffOnce(signature, {
    action: "advisory_handoff_committed",
    changed: publishResult.changed,
    revision: publishResult.revision,
    recommendationId: recommendationPackage.recommendationId,
    confidence: recommendationPackage.confidence,
    dashboardContext: ADVISORY_HANDOFF_CONTEXT,
    governanceAutoOpen: false,
    approvalFromAdvisory: false,
    executionFromAdvisory: false,
  });

  return Object.freeze({
    ok: true,
    recommendationPackage,
  });
}

export function traceAdvisoryHandoffOnce(mountKey?: string | null): void {
  logHandoffOnce(`trace:${mountKey ?? "default"}`, {
    action: "advisory_handoff_active",
    question: ADVISORY_HANDOFF_QUESTION,
    dashboardContext: ADVISORY_HANDOFF_CONTEXT,
    mountKey: mountKey ?? null,
  });
}

export function resetAdvisoryHandoffRuntimeForTests(): void {
  loggedHandoffKeys.clear();
}
