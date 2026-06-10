import type { ExecutiveToolbarAction } from "./sceneToolbarActionRegistry";

export type ExecutiveNavigationActionProposal = {
  actionId: string;
  businessPurpose: string;
  executiveValue: string;
  ownership: string;
  justification: string;
};

export type ExecutiveNavigationGovernanceResult =
  | { approved: true; actionId: string }
  | { approved: false; actionId: string; reason: string };

const APPROVED_ACTIONS = new Set<ExecutiveToolbarAction>([
  "toggle_view_mode",
  "global_view",
  "fit_scene",
]);

const logKeys = new Set<string>();

function devLog(label: string, payload: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${label}:${JSON.stringify(payload)}`;
  if (logKeys.has(key)) return;
  logKeys.add(key);
  globalThis.console?.debug?.(label, payload);
}

export function evaluateExecutiveNavigationActionProposal(
  proposal: ExecutiveNavigationActionProposal
): ExecutiveNavigationGovernanceResult {
  if (APPROVED_ACTIONS.has(proposal.actionId as ExecutiveToolbarAction)) {
    devLog("[Nexora][NavigationGovernance]", { actionId: proposal.actionId, status: "approved_existing" });
    return { approved: true, actionId: proposal.actionId };
  }

  if (!proposal.businessPurpose.trim() || !proposal.executiveValue.trim()) {
    const reason = "Missing businessPurpose or executiveValue";
    devLog("[Nexora][NavigationGovernance]", { actionId: proposal.actionId, status: "rejected", reason });
    return { approved: false, actionId: proposal.actionId, reason };
  }

  if (/zoom|orbit|pan|select|fullscreen|editor|debug|developer/i.test(proposal.actionId)) {
    const reason = "Developer-only or editor-style action rejected";
    devLog("[Nexora][NavigationGovernance]", { actionId: proposal.actionId, status: "rejected", reason });
    return { approved: false, actionId: proposal.actionId, reason };
  }

  devLog("[Nexora][NavigationGovernance]", { actionId: proposal.actionId, status: "requires_review" });
  return {
    approved: false,
    actionId: proposal.actionId,
    reason: "New toolbar actions require explicit executive governance review",
  };
}

export function logExecutiveToolbarFinalized(): void {
  devLog("[Nexora][ToolbarFinalized]", {
    actions: Array.from(APPROVED_ACTIONS),
    policy: "three_executive_navigation_actions_only",
  });
}

export function resetExecutiveNavigationGovernanceForTests(): void {
  logKeys.clear();
}
