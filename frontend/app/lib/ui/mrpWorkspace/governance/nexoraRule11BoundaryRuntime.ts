/**
 * Nexora Constitution Rule #11 — Executive Decision Boundary runtime guard.
 */

import {
  EXECUTIVE_BOUNDARY_OWNERSHIP_MATRIX,
  NEXORA_RULE_11_ACTIVE_TAG,
  NEXORA_RULE_11_BOUNDARY_TAG,
  NEXORA_RULE_11_VERSION,
  RULE_11_BLOCKED_VIOLATIONS_BY_WORKSPACE,
  type ExecutiveBoundaryCapability,
  type ExecutiveBoundaryIntent,
  type ExecutiveDecisionWorkspaceId,
  type Rule11BoundaryAttempt,
  type Rule11BoundaryGuardResult,
  type Rule11CertificationResult,
  type Rule11ViolationKind,
} from "./nexoraRule11BoundaryContract.ts";

const loggedGuardKeys = new Set<string>();
const loggedActiveKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logBoundaryOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedGuardKeys.has(key)) return;
  loggedGuardKeys.add(key);
  globalThis.console?.debug?.(NEXORA_RULE_11_BOUNDARY_TAG, detail);
}

function logActiveOnce(key: string, detail: Readonly<Record<string, unknown>>): void {
  if (!isDev()) return;
  if (loggedActiveKeys.has(key)) return;
  loggedActiveKeys.add(key);
  globalThis.console?.debug?.(NEXORA_RULE_11_ACTIVE_TAG, detail);
}

function buildBlockedResult(
  attempt: Rule11BoundaryAttempt,
  reason: string
): Extract<Rule11BoundaryGuardResult, { allowed: false }> {
  return Object.freeze({
    allowed: false as const,
    tag: NEXORA_RULE_11_BOUNDARY_TAG,
    reason,
    violationKind: attempt.violationKind,
    sourceWorkspace: attempt.sourceWorkspace,
  });
}

function violationReason(
  workspace: ExecutiveDecisionWorkspaceId,
  violationKind: Rule11ViolationKind
): string {
  switch (violationKind) {
    case "render_foreign_panel":
      return `${workspace} workspace must not render foreign Scenario or War Room panels.`;
    case "predict_future_outcomes":
      return "Timeline workspace explains the past and must not predict future outcomes.";
    case "generate_alternative_futures":
      return "Timeline workspace must not generate alternative futures — Scenario owns simulation.";
    case "recommend_actions":
      return "Timeline workspace must not recommend actions — War Room owns commitment surfaces.";
    case "commit_decisions":
      return "Timeline workspace must not commit decisions.";
    case "execute_decisions":
      return "Scenario workspace must not execute decisions — War Room owns decision execution.";
    case "commit_actions":
      return "Scenario workspace must not commit actions.";
    case "modify_timeline_history":
      return "Timeline history is immutable outside Timeline ownership.";
    case "rewrite_historical_records":
      return "Scenario workspace must not rewrite historical records.";
    case "rewrite_timeline_events":
      return "War Room workspace must not rewrite timeline events.";
    case "alter_historical_records":
      return "War Room workspace must not alter historical records.";
    case "own_simulation_generation":
      return "War Room workspace must not own simulation generation — Scenario is the simulation owner.";
    case "capability_boundary_crossing":
      return "Workspace attempted a capability outside its Rule #11 ownership boundary.";
    default:
      return "Rule #11 executive decision boundary violated.";
  }
}

function isViolationAllowedForWorkspace(
  workspace: ExecutiveDecisionWorkspaceId,
  violationKind: Rule11ViolationKind
): boolean {
  return !(RULE_11_BLOCKED_VIOLATIONS_BY_WORKSPACE[workspace] as readonly string[]).includes(
    violationKind
  );
}

function resolveOwnershipIntent(
  ownership: (typeof EXECUTIVE_BOUNDARY_OWNERSHIP_MATRIX)[ExecutiveBoundaryCapability][ExecutiveDecisionWorkspaceId],
  intent: ExecutiveBoundaryIntent
): boolean {
  if (ownership === "forbidden") return false;
  if (ownership === "owner") return intent === "own" || intent === "consume" || intent === "read";
  if (ownership === "consumer") return intent === "consume" || intent === "read";
  return intent === "read";
}

export function guardNexoraRule11Boundary(attempt: Rule11BoundaryAttempt): Rule11BoundaryGuardResult {
  if (attempt.violationKind === "render_foreign_panel") {
    if (
      attempt.sourceWorkspace === "timeline" &&
      (attempt.targetWorkspace === "scenario" || attempt.targetWorkspace === "war_room")
    ) {
      const result = buildBlockedResult(
        attempt,
        violationReason(attempt.sourceWorkspace, attempt.violationKind)
      );
      logBoundaryOnce(`${attempt.sourceWorkspace}:${attempt.violationKind}:${attempt.targetWorkspace}`, {
        action: "boundary_blocked",
        violationKind: attempt.violationKind,
        sourceWorkspace: attempt.sourceWorkspace,
        targetWorkspace: attempt.targetWorkspace ?? null,
        source: attempt.source ?? null,
      });
      return result;
    }
  }

  if (!isViolationAllowedForWorkspace(attempt.sourceWorkspace, attempt.violationKind)) {
    const result = buildBlockedResult(
      attempt,
      violationReason(attempt.sourceWorkspace, attempt.violationKind)
    );
    logBoundaryOnce(`${attempt.sourceWorkspace}:${attempt.violationKind}`, {
      action: "boundary_blocked",
      violationKind: attempt.violationKind,
      sourceWorkspace: attempt.sourceWorkspace,
      source: attempt.source ?? null,
    });
    return result;
  }

  if (attempt.capability && attempt.intent) {
    const ownership = EXECUTIVE_BOUNDARY_OWNERSHIP_MATRIX[attempt.capability][attempt.sourceWorkspace];
    if (!resolveOwnershipIntent(ownership, attempt.intent)) {
      const blockedAttempt: Rule11BoundaryAttempt = {
        ...attempt,
        violationKind: "capability_boundary_crossing",
      };
      const result = buildBlockedResult(
        blockedAttempt,
        `${attempt.sourceWorkspace} workspace is ${ownership} for ${attempt.capability} and cannot ${attempt.intent} it under Rule #11.`
      );
      logBoundaryOnce(`${attempt.sourceWorkspace}:${attempt.capability}:${attempt.intent}`, {
        action: "capability_blocked",
        capability: attempt.capability,
        intent: attempt.intent,
        ownership,
        sourceWorkspace: attempt.sourceWorkspace,
        source: attempt.source ?? null,
      });
      return result;
    }
  }

  return Object.freeze({
    allowed: true as const,
    tag: NEXORA_RULE_11_BOUNDARY_TAG,
  });
}

export function guardExecutiveWorkspacePanelRender(input: {
  hostWorkspace: ExecutiveDecisionWorkspaceId;
  panelWorkspace: ExecutiveDecisionWorkspaceId;
  source?: string | null;
}): Rule11BoundaryGuardResult {
  if (input.hostWorkspace !== "timeline") {
    return Object.freeze({
      allowed: true as const,
      tag: NEXORA_RULE_11_BOUNDARY_TAG,
    });
  }

  if (input.panelWorkspace === "scenario" || input.panelWorkspace === "war_room") {
    return guardNexoraRule11Boundary({
      sourceWorkspace: input.hostWorkspace,
      violationKind: "render_foreign_panel",
      targetWorkspace: input.panelWorkspace,
      source: input.source ?? null,
    });
  }

  return Object.freeze({
    allowed: true as const,
    tag: NEXORA_RULE_11_BOUNDARY_TAG,
  });
}

export function guardExecutiveWorkspaceCapability(input: {
  workspace: ExecutiveDecisionWorkspaceId;
  capability: ExecutiveBoundaryCapability;
  intent: ExecutiveBoundaryIntent;
  source?: string | null;
}): Rule11BoundaryGuardResult {
  return guardNexoraRule11Boundary({
    sourceWorkspace: input.workspace,
    violationKind: "capability_boundary_crossing",
    capability: input.capability,
    intent: input.intent,
    source: input.source ?? null,
  });
}

export function verifyNexoraRule11CertificationCompliance(
  workspaceId: ExecutiveDecisionWorkspaceId
): Rule11CertificationResult {
  const violations: string[] = [];

  const assertBlocked = (attempt: Rule11BoundaryAttempt, label: string): void => {
    const result = guardNexoraRule11Boundary(attempt);
    if (result.allowed) {
      violations.push(`${label} is not blocked by Rule #11 guard.`);
    }
  };

  switch (workspaceId) {
    case "timeline":
      assertBlocked(
        { sourceWorkspace: "timeline", violationKind: "predict_future_outcomes" },
        "Timeline future prediction"
      );
      assertBlocked(
        { sourceWorkspace: "timeline", violationKind: "commit_decisions" },
        "Timeline decision commit"
      );
      if (
        guardExecutiveWorkspacePanelRender({
          hostWorkspace: "timeline",
          panelWorkspace: "scenario",
        }).allowed
      ) {
        violations.push("Timeline Scenario panel rendering is not blocked.");
      }
      if (
        guardExecutiveWorkspacePanelRender({
          hostWorkspace: "timeline",
          panelWorkspace: "war_room",
        }).allowed
      ) {
        violations.push("Timeline War Room panel rendering is not blocked.");
      }
      break;
    case "scenario":
      assertBlocked(
        { sourceWorkspace: "scenario", violationKind: "execute_decisions" },
        "Scenario decision execution"
      );
      assertBlocked(
        { sourceWorkspace: "scenario", violationKind: "modify_timeline_history" },
        "Scenario timeline history modification"
      );
      break;
    case "war_room":
      assertBlocked(
        { sourceWorkspace: "war_room", violationKind: "modify_timeline_history" },
        "War Room timeline history modification"
      );
      assertBlocked(
        { sourceWorkspace: "war_room", violationKind: "own_simulation_generation" },
        "War Room simulation generation ownership"
      );
      break;
    default:
      violations.push("Unknown executive workspace for Rule #11 certification.");
  }

  return Object.freeze({
    compliant: violations.length === 0,
    workspaceId,
    tag: NEXORA_RULE_11_BOUNDARY_TAG,
    violations: Object.freeze(violations),
  });
}

export function traceNexoraRule11ActiveOnce(scopeKey?: string | null): void {
  logActiveOnce(`active:${scopeKey ?? "default"}`, {
    action: "rule_11_active",
    version: NEXORA_RULE_11_VERSION,
    tag: NEXORA_RULE_11_ACTIVE_TAG,
    scopeKey: scopeKey ?? null,
    workspaces: ["timeline", "scenario", "war_room"],
  });
}

export function resetNexoraRule11BoundaryRuntimeForTests(): void {
  loggedGuardKeys.clear();
  loggedActiveKeys.clear();
}
