/**
 * Assistant Rule #12 boundary runtime — conversation only, never intelligence authority.
 */

import {
  guardAssistantIntelligenceAction,
  guardNexoraRule12IntelligenceOwnership,
  traceNexoraRule12ActiveOnce,
} from "../ui/mrpWorkspace/governance/nexoraRule12IntelligenceOwnershipRuntime.ts";
import {
  NEXORA_RULE_12_INTELLIGENCE_OWNERSHIP_TAG,
  type AssistantIntelligenceAction,
  type CertifiedIntelligenceWorkspaceId,
  type Rule12IntelligenceOwnershipGuardResult,
  type Rule12ViolationKind,
} from "../ui/mrpWorkspace/governance/nexoraRule12IntelligenceOwnershipContract.ts";

export type AssistantForbiddenIntelligenceAction =
  | "invent_risk_score"
  | "invent_scenario_forecast"
  | "override_workspace_conclusion"
  | "execute_workspace_decision"
  | "replace_workspace_intelligence";

const ACTION_TO_VIOLATION: Readonly<
  Record<AssistantForbiddenIntelligenceAction, Rule12ViolationKind>
> = Object.freeze({
  invent_risk_score: "generate_unsupported_risk_scores",
  invent_scenario_forecast: "generate_unsupported_scenario_forecasts",
  override_workspace_conclusion: "override_workspace_conclusions",
  execute_workspace_decision: "execute_workspace_decisions",
  replace_workspace_intelligence: "replace_workspace_intelligence",
});

const loggedGuardKeys = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logAssistantBoundaryOnce(
  key: string,
  detail: Readonly<Record<string, unknown>>
): void {
  if (!isDev()) return;
  if (loggedGuardKeys.has(key)) return;
  loggedGuardKeys.add(key);
  globalThis.console?.debug?.(NEXORA_RULE_12_INTELLIGENCE_OWNERSHIP_TAG, detail);
}

export function guardAssistantForbiddenIntelligenceAction(input: {
  action: AssistantForbiddenIntelligenceAction;
  workspaceId?: CertifiedIntelligenceWorkspaceId | null;
  sourceLabel?: string | null;
}): Rule12IntelligenceOwnershipGuardResult {
  const violationKind = ACTION_TO_VIOLATION[input.action];
  const result = guardNexoraRule12IntelligenceOwnership({
    source: "assistant",
    violationKind,
    workspaceId: input.workspaceId ?? null,
    sourceLabel: input.sourceLabel ?? null,
  });

  if (!result.allowed) {
    logAssistantBoundaryOnce(`${input.action}:${input.sourceLabel ?? "assistant"}`, {
      action: "assistant_intelligence_boundary_blocked",
      assistantAction: input.action,
      violationKind,
    });
  }

  return result;
}

export function guardAssistantConversationAction(input: {
  action: AssistantIntelligenceAction;
  workspaceId?: CertifiedIntelligenceWorkspaceId | null;
  hasWorkspaceGrounding?: boolean;
  sourceLabel?: string | null;
}): Rule12IntelligenceOwnershipGuardResult {
  return guardAssistantIntelligenceAction(input);
}

export function traceAssistantRule12BoundaryOnce(scopeKey?: string | null): void {
  traceNexoraRule12ActiveOnce(scopeKey ?? "assistant");
}

export function resetAssistantRule12BoundaryRuntimeForTests(): void {
  loggedGuardKeys.clear();
}
