/**
 * MRP:5B:3 — Derive read-only policy & constraint intelligence from governance state.
 */

import {
  GOVERNANCE_CONSTRAINT_QUESTIONS,
  GOVERNANCE_POLICY_INTELLIGENCE_TAG,
  GOVERNANCE_POLICY_QUESTIONS,
  type ConstraintReviewIntelligenceSurface,
  type GovernanceIntelligenceRowView,
  type GovernanceIntelligenceVerdict,
  type GovernancePolicyConstraintIntelligenceSurface,
  type PolicyAlignmentIntelligenceSurface,
} from "./governancePolicyConstraintIntelligenceContract.ts";
import type { GovernanceWorkspaceState } from "./governanceWorkspaceState.ts";

const loggedKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function worstVerdict(
  verdicts: readonly GovernanceIntelligenceVerdict[]
): GovernanceIntelligenceVerdict {
  if (verdicts.some((verdict) => verdict === "BLOCKED")) return "BLOCKED";
  if (verdicts.some((verdict) => verdict === "WARNING")) return "WARNING";
  return "PASS";
}

function buildPolicyRows(state: GovernanceWorkspaceState): readonly GovernanceIntelligenceRowView[] {
  const scoped = state.selectedObjectId;
  const scopeLabel = scoped ?? "executive scope";

  const policiesAffected: GovernanceIntelligenceRowView = Object.freeze({
    id: "policies_affected",
    question: GOVERNANCE_POLICY_QUESTIONS.policies_affected,
    verdict: scoped ? (state.policyStatus === "aligned" ? "PASS" : "WARNING") : "WARNING",
    detail: scoped
      ? `Compliance, operational safety, and financial control policies may apply to ${scopeLabel}.`
      : "Select an object to identify affected policies.",
  });

  const rulesApply: GovernanceIntelligenceRowView = Object.freeze({
    id: "rules_apply",
    question: GOVERNANCE_POLICY_QUESTIONS.rules_apply,
    verdict: scoped ? "PASS" : "WARNING",
    detail: scoped
      ? "Approval thresholds, escalation rules, and sign-off requirements apply to the review scope."
      : "Approval rules remain unscoped until an object is selected.",
  });

  const standardsInvolved: GovernanceIntelligenceRowView = Object.freeze({
    id: "standards_involved",
    question: GOVERNANCE_POLICY_QUESTIONS.standards_involved,
    verdict: scoped
      ? state.policyStatus === "unknown"
        ? "WARNING"
        : "PASS"
      : "WARNING",
    detail: scoped
      ? "Internal authority standards and institutional governance frameworks are referenced."
      : "Standards review requires an object or executive package scope.",
  });

  return Object.freeze([policiesAffected, rulesApply, standardsInvolved]);
}

function buildConstraintRows(
  state: GovernanceWorkspaceState
): readonly GovernanceIntelligenceRowView[] {
  const scoped = state.selectedObjectId;
  const scopeLabel = scoped ?? "executive scope";
  const reviewRequired = state.constraintStatus === "review_required";
  const blockedAuthority = scoped && reviewRequired;

  const budget: GovernanceIntelligenceRowView = Object.freeze({
    id: "budget",
    question: GOVERNANCE_CONSTRAINT_QUESTIONS.budget,
    verdict: scoped ? (reviewRequired ? "WARNING" : "PASS") : "WARNING",
    detail: scoped
      ? `Budget envelope and spend guardrails for ${scopeLabel} require confirmation.`
      : "Budget constraints are unscoped — select an object to evaluate spend limits.",
  });

  const resource: GovernanceIntelligenceRowView = Object.freeze({
    id: "resource",
    question: GOVERNANCE_CONSTRAINT_QUESTIONS.resource,
    verdict: scoped ? "PASS" : "WARNING",
    detail: scoped
      ? "Resource capacity and staffing commitments appear within declared limits."
      : "Resource constraints cannot be assessed without review scope.",
  });

  const timeline: GovernanceIntelligenceRowView = Object.freeze({
    id: "timeline",
    question: GOVERNANCE_CONSTRAINT_QUESTIONS.timeline,
    verdict: scoped ? (reviewRequired ? "WARNING" : "PASS") : "WARNING",
    detail: scoped
      ? "Timeline dependencies and milestone pressure should be validated before approval."
      : "Timeline constraints remain unreviewed at executive scope.",
  });

  const authority: GovernanceIntelligenceRowView = Object.freeze({
    id: "authority",
    question: GOVERNANCE_CONSTRAINT_QUESTIONS.authority,
    verdict: blockedAuthority ? "BLOCKED" : scoped ? "WARNING" : "WARNING",
    detail: blockedAuthority
      ? `Authority escalation required for ${scopeLabel} — approval cannot proceed without executive sign-off.`
      : scoped
        ? "Authority thresholds should be confirmed against governance requirements."
        : "Authority constraints require a scoped review target.",
  });

  return Object.freeze([budget, resource, timeline, authority]);
}

export function derivePolicyAlignmentIntelligence(
  state: GovernanceWorkspaceState
): PolicyAlignmentIntelligenceSurface {
  const rows = buildPolicyRows(state);
  return Object.freeze({
    panelId: "policy_alignment",
    label: "Policy Alignment",
    overallVerdict: worstVerdict(rows.map((row) => row.verdict)),
    readOnly: true,
    ownsExecutionAuthority: false,
    rows,
  });
}

export function deriveConstraintReviewIntelligence(
  state: GovernanceWorkspaceState
): ConstraintReviewIntelligenceSurface {
  const rows = buildConstraintRows(state);
  return Object.freeze({
    panelId: "constraint_review",
    label: "Constraint Review",
    overallVerdict: worstVerdict(rows.map((row) => row.verdict)),
    readOnly: true,
    ownsExecutionAuthority: false,
    rows,
  });
}

export function deriveGovernancePolicyConstraintIntelligence(
  state: GovernanceWorkspaceState
): GovernancePolicyConstraintIntelligenceSurface {
  return Object.freeze({
    policy: derivePolicyAlignmentIntelligence(state),
    constraint: deriveConstraintReviewIntelligence(state),
    source: "governance_policy_constraint_intelligence",
    tag: GOVERNANCE_POLICY_INTELLIGENCE_TAG,
  });
}

export function traceGovernancePolicyIntelligenceOnce(mountKey?: string | null): void {
  if (!isDev()) return;
  const key = mountKey ?? "default";
  if (loggedKeys.has(key)) return;
  loggedKeys.add(key);
  globalThis.console?.debug?.(GOVERNANCE_POLICY_INTELLIGENCE_TAG, {
    action: "governance_policy_constraint_intelligence_active",
    mountKey: mountKey ?? null,
    readOnly: true,
    ownsExecutionAuthority: false,
  });
}

export function resetGovernancePolicyConstraintIntelligenceForTests(): void {
  loggedKeys.clear();
}
