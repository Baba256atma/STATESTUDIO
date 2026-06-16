/**
 * Nexora Constitution Rule #12 — Intelligence Ownership Contract.
 *
 * MRP owns intelligence. Assistant owns conversation.
 * Intelligence must originate from certified workspaces — never from Assistant authority.
 */

export const NEXORA_RULE_12_INTELLIGENCE_OWNERSHIP_TAG =
  "[NEXORA_RULE_12_INTELLIGENCE_OWNERSHIP]" as const;
export const NEXORA_RULE_12_ACTIVE_TAG = "[NEXORA_RULE_12_ACTIVE]" as const;

export const NEXORA_RULE_12_VERSION = "1.0";

export type CertifiedIntelligenceWorkspaceId =
  | "executive_summary"
  | "operational"
  | "risk"
  | "timeline"
  | "scenario"
  | "war_room"
  | "future_certified_workspace";

export type AssistantIntelligenceAction =
  | "read_workspace_intelligence"
  | "explain_workspace_intelligence"
  | "summarize_workspace_intelligence"
  | "compare_workspace_intelligence"
  | "discuss_workspace_intelligence";

export type Rule12ViolationKind =
  | "replace_workspace_intelligence"
  | "invent_workspace_intelligence"
  | "override_workspace_intelligence"
  | "execute_workspace_decisions"
  | "act_as_decision_authority"
  | "generate_unsupported_risk_scores"
  | "generate_unsupported_scenario_forecasts"
  | "override_workspace_conclusions"
  | "bypass_workspace_intelligence";

export type Rule12IntelligenceOwnershipAttempt = Readonly<{
  source: "assistant";
  action?: AssistantIntelligenceAction | null;
  violationKind: Rule12ViolationKind;
  workspaceId?: CertifiedIntelligenceWorkspaceId | null;
  hasWorkspaceGrounding?: boolean;
  sourceLabel?: string | null;
}>;

export type Rule12IntelligenceOwnershipGuardResult =
  | Readonly<{
      allowed: true;
      tag: typeof NEXORA_RULE_12_INTELLIGENCE_OWNERSHIP_TAG;
    }>
  | Readonly<{
      allowed: false;
      tag: typeof NEXORA_RULE_12_INTELLIGENCE_OWNERSHIP_TAG;
      reason: string;
      violationKind: Rule12ViolationKind;
    }>;

export type Rule12CertificationResult = Readonly<{
  compliant: boolean;
  tag: typeof NEXORA_RULE_12_INTELLIGENCE_OWNERSHIP_TAG;
  violations: readonly string[];
}>;

export const CERTIFIED_INTELLIGENCE_WORKSPACE_IDS: readonly CertifiedIntelligenceWorkspaceId[] =
  Object.freeze([
    "executive_summary",
    "operational",
    "risk",
    "timeline",
    "scenario",
    "war_room",
    "future_certified_workspace",
  ]);

export const ASSISTANT_ALLOWED_INTELLIGENCE_ACTIONS: readonly AssistantIntelligenceAction[] =
  Object.freeze([
    "read_workspace_intelligence",
    "explain_workspace_intelligence",
    "summarize_workspace_intelligence",
    "compare_workspace_intelligence",
    "discuss_workspace_intelligence",
  ]);

export const RULE_12_BLOCKED_ASSISTANT_VIOLATIONS: readonly Rule12ViolationKind[] =
  Object.freeze([
    "replace_workspace_intelligence",
    "invent_workspace_intelligence",
    "override_workspace_intelligence",
    "execute_workspace_decisions",
    "act_as_decision_authority",
    "generate_unsupported_risk_scores",
    "generate_unsupported_scenario_forecasts",
    "override_workspace_conclusions",
    "bypass_workspace_intelligence",
  ]);

export const MRP_INTELLIGENCE_AUTHORITY_QUESTIONS: Readonly<
  Record<CertifiedIntelligenceWorkspaceId, string>
> = Object.freeze({
  executive_summary: "What is happening?",
  operational: "How is it operating?",
  risk: "What can go wrong?",
  timeline: "What happened before?",
  scenario: "What could happen next?",
  war_room: "What should we do now?",
  future_certified_workspace: "What is the certified workspace signal?",
});

export const ASSISTANT_CONVERSATION_QUESTIONS = Object.freeze({
  explain: "Explain this.",
  why: "Why?",
  how: "How?",
  meaning: "What does this mean?",
  review: "What should I review?",
});

export const MRP_INTELLIGENCE_OWNERSHIP_MANDATE = Object.freeze({
  owner: "mrp",
  domain: "certified_workspace_intelligence",
  responsibilities: Object.freeze([
    "Executive Summary intelligence",
    "Operational intelligence",
    "Risk intelligence",
    "Timeline intelligence",
    "Scenario intelligence",
    "War Room intelligence",
    "Future certified workspace intelligence",
  ]),
  authoritative: true,
});

export const ASSISTANT_CONVERSATION_OWNERSHIP_MANDATE = Object.freeze({
  owner: "assistant",
  domain: "executive_conversation",
  responsibilities: Object.freeze([
    "Executive explanations",
    "Executive discussion",
    "Executive guidance",
    "Executive questioning",
    "Executive learning support",
    "Executive clarification",
  ]),
  isIntelligenceAuthority: false,
});

export const RULE_12_RUNTIME_FLOW = Object.freeze([
  "Executive Workspace",
  "Certified Intelligence",
  "Assistant Reads",
  "Assistant Explains",
  "Executive Understands",
]);
