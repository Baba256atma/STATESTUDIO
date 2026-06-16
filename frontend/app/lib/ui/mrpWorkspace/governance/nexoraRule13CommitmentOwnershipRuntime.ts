/**
 * Nexora Constitution Rule #13 — Commitment Ownership runtime guard.
 */

import {
  COMMITMENT_WORKSPACE_IDS,
  NEXORA_RULE_13_ACTIVE_TAG,
  NEXORA_RULE_13_COMMITMENT_OWNERSHIP_TAG,
  NEXORA_RULE_13_VERSION,
  RULE_13_BLOCKED_VIOLATIONS_BY_WORKSPACE,
  WAR_ROOM_ALLOWED_COMMITMENT_ACTIONS,
  type CommitmentWorkspaceId,
  type Rule13CertificationResult,
  type Rule13CommitmentOwnershipAttempt,
  type Rule13CommitmentOwnershipGuardResult,
  type Rule13ViolationKind,
  type WarRoomCommitmentAction,
} from "./nexoraRule13CommitmentOwnershipContract.ts";

const loggedGuardKeys = new Set<string>();
const loggedActiveKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logCommitmentOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedGuardKeys.has(key)) return;
  loggedGuardKeys.add(key);
  globalThis.console?.debug?.(NEXORA_RULE_13_COMMITMENT_OWNERSHIP_TAG, detail);
}

function logActiveOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedActiveKeys.has(key)) return;
  loggedActiveKeys.add(key);
  globalThis.console?.debug?.(NEXORA_RULE_13_ACTIVE_TAG, detail);
}

function buildBlockedResult(
  attempt: Rule13CommitmentOwnershipAttempt,
  violationKind: Rule13ViolationKind,
  reason: string
): Extract<Rule13CommitmentOwnershipGuardResult, { allowed: false }> {
  return Object.freeze({
    allowed: false as const,
    tag: NEXORA_RULE_13_COMMITMENT_OWNERSHIP_TAG,
    reason,
    violationKind,
    sourceWorkspace: attempt.sourceWorkspace,
  });
}

function violationReason(
  workspace: CommitmentWorkspaceId,
  violationKind: Rule13ViolationKind
): string {
  switch (violationKind) {
    case "execute_actions":
      return `${workspace} workspace must not execute actions — War Room owns commitment execution.`;
    case "commit_decisions":
      return `${workspace} workspace must not commit decisions — War Room owns commitment.`;
    case "rewrite_history":
      return "War Room workspace must not rewrite history — Timeline owns history.";
    case "generate_simulations":
      return "War Room workspace must not generate simulations — Scenario owns possibility.";
    case "own_forecasting_logic":
      return "War Room workspace must not own forecasting logic — Scenario owns possibility.";
    default:
      return "Rule #13 commitment ownership contract violated.";
  }
}

function isViolationBlockedForWorkspace(
  workspace: CommitmentWorkspaceId,
  violationKind: Rule13ViolationKind
): boolean {
  return (RULE_13_BLOCKED_VIOLATIONS_BY_WORKSPACE[workspace] as readonly string[]).includes(
    violationKind
  );
}

export function guardNexoraRule13CommitmentOwnership(
  attempt: Rule13CommitmentOwnershipAttempt
): Rule13CommitmentOwnershipGuardResult {
  if (attempt.violationKind && isViolationBlockedForWorkspace(attempt.sourceWorkspace, attempt.violationKind)) {
    const result = buildBlockedResult(
      attempt,
      attempt.violationKind,
      violationReason(attempt.sourceWorkspace, attempt.violationKind)
    );
    logCommitmentOnce(`${attempt.sourceWorkspace}:${attempt.violationKind}`, {
      action: "commitment_ownership_blocked",
      violationKind: attempt.violationKind,
      sourceWorkspace: attempt.sourceWorkspace,
      source: attempt.source ?? null,
    });
    return result;
  }

  if (
    attempt.sourceWorkspace === "war_room" &&
    attempt.commitmentAction &&
    (WAR_ROOM_ALLOWED_COMMITMENT_ACTIONS as readonly string[]).includes(attempt.commitmentAction)
  ) {
    logCommitmentOnce(`allowed:${attempt.commitmentAction}`, {
      action: "war_room_commitment_allowed",
      commitmentAction: attempt.commitmentAction,
      source: attempt.source ?? null,
    });
    return Object.freeze({
      allowed: true as const,
      tag: NEXORA_RULE_13_COMMITMENT_OWNERSHIP_TAG,
    });
  }

  if (
    (attempt.sourceWorkspace === "timeline" || attempt.sourceWorkspace === "scenario") &&
    attempt.commitmentAction
  ) {
    const violationKind: Rule13ViolationKind =
      attempt.commitmentAction === "select_strategy" ||
      attempt.commitmentAction === "create_action_plans"
        ? "commit_decisions"
        : "execute_actions";
    return guardNexoraRule13CommitmentOwnership({
      sourceWorkspace: attempt.sourceWorkspace,
      violationKind,
      source: attempt.source ?? null,
    });
  }

  return Object.freeze({
    allowed: true as const,
    tag: NEXORA_RULE_13_COMMITMENT_OWNERSHIP_TAG,
  });
}

export function guardTimelineCommitmentAction(input: {
  action: "execute_action" | "commit_decision";
  source?: string | null;
}): Rule13CommitmentOwnershipGuardResult {
  return guardNexoraRule13CommitmentOwnership({
    sourceWorkspace: "timeline",
    violationKind: input.action === "commit_decision" ? "commit_decisions" : "execute_actions",
    source: input.source ?? null,
  });
}

export function guardScenarioCommitmentAction(input: {
  action: "execute_action" | "commit_decision";
  source?: string | null;
}): Rule13CommitmentOwnershipGuardResult {
  return guardNexoraRule13CommitmentOwnership({
    sourceWorkspace: "scenario",
    violationKind: input.action === "commit_decision" ? "commit_decisions" : "execute_actions",
    source: input.source ?? null,
  });
}

export function guardWarRoomCommitmentAction(input: {
  action: WarRoomCommitmentAction | "rewrite_history" | "generate_simulation" | "own_forecasting";
  source?: string | null;
}): Rule13CommitmentOwnershipGuardResult {
  if (
    input.action === "rewrite_history" ||
    input.action === "generate_simulation" ||
    input.action === "own_forecasting"
  ) {
    const violationKind: Rule13ViolationKind =
      input.action === "rewrite_history"
        ? "rewrite_history"
        : input.action === "generate_simulation"
          ? "generate_simulations"
          : "own_forecasting_logic";
    return guardNexoraRule13CommitmentOwnership({
      sourceWorkspace: "war_room",
      violationKind,
      source: input.source ?? null,
    });
  }

  return guardNexoraRule13CommitmentOwnership({
    sourceWorkspace: "war_room",
    commitmentAction: input.action,
    source: input.source ?? null,
  });
}

export function verifyNexoraRule13CertificationCompliance(
  workspaceId: CommitmentWorkspaceId
): Rule13CertificationResult {
  const violations: string[] = [];

  const assertBlocked = (
    attempt: Rule13CommitmentOwnershipAttempt,
    label: string
  ): void => {
    if (!attempt.violationKind) return;
    const result = guardNexoraRule13CommitmentOwnership(attempt);
    if (result.allowed) {
      violations.push(`${label} is not blocked by Rule #13 guard.`);
    }
  };

  switch (workspaceId) {
    case "timeline":
      assertBlocked(
        { sourceWorkspace: "timeline", violationKind: "execute_actions" },
        "Timeline action execution"
      );
      assertBlocked(
        { sourceWorkspace: "timeline", violationKind: "commit_decisions" },
        "Timeline decision commit"
      );
      break;
    case "scenario":
      assertBlocked(
        { sourceWorkspace: "scenario", violationKind: "execute_actions" },
        "Scenario action execution"
      );
      assertBlocked(
        { sourceWorkspace: "scenario", violationKind: "commit_decisions" },
        "Scenario decision commit"
      );
      break;
    case "war_room":
      assertBlocked(
        { sourceWorkspace: "war_room", violationKind: "rewrite_history" },
        "War Room history rewrite"
      );
      assertBlocked(
        { sourceWorkspace: "war_room", violationKind: "generate_simulations" },
        "War Room simulation generation"
      );
      assertBlocked(
        { sourceWorkspace: "war_room", violationKind: "own_forecasting_logic" },
        "War Room forecasting ownership"
      );
      for (const action of WAR_ROOM_ALLOWED_COMMITMENT_ACTIONS) {
        const allowed = guardWarRoomCommitmentAction({ action, source: "certification" });
        if (!allowed.allowed) {
          violations.push(`${action} is blocked but must be allowed under Rule #13.`);
        }
      }
      break;
    default:
      violations.push("Unknown commitment workspace for Rule #13 certification.");
  }

  return Object.freeze({
    compliant: violations.length === 0,
    workspaceId,
    tag: NEXORA_RULE_13_COMMITMENT_OWNERSHIP_TAG,
    violations: Object.freeze(violations),
  });
}

export function verifyAllCommitmentWorkspacesRule13Compliance(): Rule13CertificationResult[] {
  return COMMITMENT_WORKSPACE_IDS.map((workspaceId) =>
    verifyNexoraRule13CertificationCompliance(workspaceId)
  );
}

export function traceNexoraRule13ActiveOnce(scopeKey?: string | null): void {
  logActiveOnce(`active:${scopeKey ?? "default"}`, {
    action: "rule_13_active",
    version: NEXORA_RULE_13_VERSION,
    tag: NEXORA_RULE_13_ACTIVE_TAG,
    timelineOwnsHistory: true,
    scenarioOwnsPossibility: true,
    warRoomOwnsCommitment: true,
    scopeKey: scopeKey ?? null,
  });
}

export function resetNexoraRule13CommitmentOwnershipRuntimeForTests(): void {
  loggedGuardKeys.clear();
  loggedActiveKeys.clear();
}
