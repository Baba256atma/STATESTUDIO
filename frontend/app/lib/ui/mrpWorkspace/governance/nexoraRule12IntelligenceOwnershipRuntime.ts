/**
 * Nexora Constitution Rule #12 — Intelligence Ownership runtime guard.
 */

import {
  ASSISTANT_ALLOWED_INTELLIGENCE_ACTIONS,
  NEXORA_RULE_12_ACTIVE_TAG,
  NEXORA_RULE_12_INTELLIGENCE_OWNERSHIP_TAG,
  NEXORA_RULE_12_VERSION,
  RULE_12_BLOCKED_ASSISTANT_VIOLATIONS,
  type AssistantIntelligenceAction,
  type Rule12CertificationResult,
  type Rule12IntelligenceOwnershipAttempt,
  type Rule12IntelligenceOwnershipGuardResult,
  type Rule12ViolationKind,
} from "./nexoraRule12IntelligenceOwnershipContract.ts";

const loggedGuardKeys = new Set<string>();
const loggedActiveKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logOwnershipOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedGuardKeys.has(key)) return;
  loggedGuardKeys.add(key);
  globalThis.console?.debug?.(NEXORA_RULE_12_INTELLIGENCE_OWNERSHIP_TAG, detail);
}

function logActiveOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedActiveKeys.has(key)) return;
  loggedActiveKeys.add(key);
  globalThis.console?.debug?.(NEXORA_RULE_12_ACTIVE_TAG, detail);
}

function buildBlockedResult(
  attempt: Rule12IntelligenceOwnershipAttempt,
  reason: string
): Extract<Rule12IntelligenceOwnershipGuardResult, { allowed: false }> {
  return Object.freeze({
    allowed: false as const,
    tag: NEXORA_RULE_12_INTELLIGENCE_OWNERSHIP_TAG,
    reason,
    violationKind: attempt.violationKind,
  });
}

function violationReason(violationKind: Rule12ViolationKind): string {
  switch (violationKind) {
    case "replace_workspace_intelligence":
      return "Assistant must not replace certified workspace intelligence.";
    case "invent_workspace_intelligence":
      return "Assistant must not invent workspace intelligence without certified workspace grounding.";
    case "override_workspace_intelligence":
      return "Assistant must not override authoritative workspace intelligence.";
    case "execute_workspace_decisions":
      return "Assistant must not execute workspace decisions — War Room owns decision execution.";
    case "act_as_decision_authority":
      return "Assistant must not act as an independent decision authority.";
    case "generate_unsupported_risk_scores":
      return "Assistant must not generate unsupported risk scores — Risk workspace owns risk intelligence.";
    case "generate_unsupported_scenario_forecasts":
      return "Assistant must not generate unsupported scenario forecasts — Scenario workspace owns futures intelligence.";
    case "override_workspace_conclusions":
      return "Assistant must not override workspace conclusions.";
    case "bypass_workspace_intelligence":
      return "Assistant must not bypass certified workspace intelligence.";
    default:
      return "Rule #12 intelligence ownership contract violated.";
  }
}

function isBlockedViolation(violationKind: Rule12ViolationKind): boolean {
  return (RULE_12_BLOCKED_ASSISTANT_VIOLATIONS as readonly string[]).includes(violationKind);
}

export function guardNexoraRule12IntelligenceOwnership(
  attempt: Rule12IntelligenceOwnershipAttempt
): Rule12IntelligenceOwnershipGuardResult {
  if (isBlockedViolation(attempt.violationKind)) {
    const result = buildBlockedResult(attempt, violationReason(attempt.violationKind));
    logOwnershipOnce(`${attempt.violationKind}:${attempt.sourceLabel ?? "assistant"}`, {
      action: "intelligence_ownership_blocked",
      violationKind: attempt.violationKind,
      workspaceId: attempt.workspaceId ?? null,
      sourceLabel: attempt.sourceLabel ?? null,
    });
    return result;
  }

  return Object.freeze({
    allowed: true as const,
    tag: NEXORA_RULE_12_INTELLIGENCE_OWNERSHIP_TAG,
  });
}

export function guardAssistantIntelligenceAction(input: {
  action: AssistantIntelligenceAction;
  workspaceId?: Rule12IntelligenceOwnershipAttempt["workspaceId"];
  hasWorkspaceGrounding?: boolean;
  sourceLabel?: string | null;
}): Rule12IntelligenceOwnershipGuardResult {
  if (input.hasWorkspaceGrounding === false) {
    return guardNexoraRule12IntelligenceOwnership({
      source: "assistant",
      action: input.action,
      violationKind: "bypass_workspace_intelligence",
      workspaceId: input.workspaceId ?? null,
      hasWorkspaceGrounding: false,
      sourceLabel: input.sourceLabel ?? null,
    });
  }

  if (!(ASSISTANT_ALLOWED_INTELLIGENCE_ACTIONS as readonly string[]).includes(input.action)) {
    return guardNexoraRule12IntelligenceOwnership({
      source: "assistant",
      action: input.action,
      violationKind: "invent_workspace_intelligence",
      workspaceId: input.workspaceId ?? null,
      sourceLabel: input.sourceLabel ?? null,
    });
  }

  logOwnershipOnce(`allowed:${input.action}:${input.sourceLabel ?? "assistant"}`, {
    action: "assistant_intelligence_action_allowed",
    assistantAction: input.action,
    workspaceId: input.workspaceId ?? null,
    hasWorkspaceGrounding: input.hasWorkspaceGrounding ?? true,
  });

  return Object.freeze({
    allowed: true as const,
    tag: NEXORA_RULE_12_INTELLIGENCE_OWNERSHIP_TAG,
  });
}

export function verifyNexoraRule12CertificationCompliance(): Rule12CertificationResult {
  const violations: string[] = [];

  const assertBlocked = (violationKind: Rule12ViolationKind, label: string): void => {
    const result = guardNexoraRule12IntelligenceOwnership({
      source: "assistant",
      violationKind,
      sourceLabel: "certification",
    });
    if (result.allowed) {
      violations.push(`${label} is not blocked by Rule #12 guard.`);
    }
  };

  for (const violationKind of RULE_12_BLOCKED_ASSISTANT_VIOLATIONS) {
    assertBlocked(violationKind, violationKind);
  }

  for (const action of ASSISTANT_ALLOWED_INTELLIGENCE_ACTIONS) {
    const result = guardAssistantIntelligenceAction({
      action,
      workspaceId: "executive_summary",
      hasWorkspaceGrounding: true,
      sourceLabel: "certification",
    });
    if (!result.allowed) {
      violations.push(`${action} is blocked but must be allowed under Rule #12.`);
    }
  }

  const ungrounded = guardAssistantIntelligenceAction({
    action: "explain_workspace_intelligence",
    hasWorkspaceGrounding: false,
    sourceLabel: "certification",
  });
  if (ungrounded.allowed) {
    violations.push("Ungrounded Assistant explanation is not blocked.");
  }

  return Object.freeze({
    compliant: violations.length === 0,
    tag: NEXORA_RULE_12_INTELLIGENCE_OWNERSHIP_TAG,
    violations: Object.freeze(violations),
  });
}

export function traceNexoraRule12ActiveOnce(scopeKey?: string | null): void {
  logActiveOnce(`active:${scopeKey ?? "default"}`, {
    action: "rule_12_active",
    version: NEXORA_RULE_12_VERSION,
    tag: NEXORA_RULE_12_ACTIVE_TAG,
    mrpOwnsIntelligence: true,
    assistantOwnsConversation: true,
    scopeKey: scopeKey ?? null,
  });
}

export function resetNexoraRule12IntelligenceOwnershipRuntimeForTests(): void {
  loggedGuardKeys.clear();
  loggedActiveKeys.clear();
}
