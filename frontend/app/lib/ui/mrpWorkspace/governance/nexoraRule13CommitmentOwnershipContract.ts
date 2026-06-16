/**
 * Nexora Constitution Rule #13 — Commitment Ownership Contract.
 *
 * Timeline owns history. Scenario owns possibility. War Room owns commitment.
 */

export const NEXORA_RULE_13_COMMITMENT_OWNERSHIP_TAG =
  "[NEXORA_RULE_13_COMMITMENT_OWNERSHIP]" as const;
export const NEXORA_RULE_13_ACTIVE_TAG = "[NEXORA_RULE_13_ACTIVE]" as const;

export const NEXORA_RULE_13_VERSION = "1.0";

export type CommitmentWorkspaceId = "timeline" | "scenario" | "war_room";

export type Rule13ViolationKind =
  | "execute_actions"
  | "commit_decisions"
  | "rewrite_history"
  | "generate_simulations"
  | "own_forecasting_logic";

export type WarRoomCommitmentAction =
  | "select_strategy"
  | "create_action_plans"
  | "track_execution_status"
  | "monitor_active_decisions";

export type Rule13CommitmentOwnershipAttempt = Readonly<{
  sourceWorkspace: CommitmentWorkspaceId;
  violationKind?: Rule13ViolationKind | null;
  commitmentAction?: WarRoomCommitmentAction | null;
  source?: string | null;
}>;

export type Rule13CommitmentOwnershipGuardResult =
  | Readonly<{
      allowed: true;
      tag: typeof NEXORA_RULE_13_COMMITMENT_OWNERSHIP_TAG;
    }>
  | Readonly<{
      allowed: false;
      tag: typeof NEXORA_RULE_13_COMMITMENT_OWNERSHIP_TAG;
      reason: string;
      violationKind: Rule13ViolationKind;
      sourceWorkspace: CommitmentWorkspaceId;
    }>;

export type Rule13CertificationResult = Readonly<{
  compliant: boolean;
  workspaceId: CommitmentWorkspaceId;
  tag: typeof NEXORA_RULE_13_COMMITMENT_OWNERSHIP_TAG;
  violations: readonly string[];
}>;

export const COMMITMENT_WORKSPACE_IDS: readonly CommitmentWorkspaceId[] = Object.freeze([
  "timeline",
  "scenario",
  "war_room",
]);

export const WAR_ROOM_ALLOWED_COMMITMENT_ACTIONS: readonly WarRoomCommitmentAction[] =
  Object.freeze([
    "select_strategy",
    "create_action_plans",
    "track_execution_status",
    "monitor_active_decisions",
  ]);

export const RULE_13_BLOCKED_VIOLATIONS_BY_WORKSPACE = Object.freeze({
  timeline: Object.freeze(["execute_actions", "commit_decisions"] as const),
  scenario: Object.freeze(["execute_actions", "commit_decisions"] as const),
  war_room: Object.freeze([
    "rewrite_history",
    "generate_simulations",
    "own_forecasting_logic",
  ] as const),
} satisfies Readonly<Record<CommitmentWorkspaceId, readonly Rule13ViolationKind[]>>);

export const COMMITMENT_WORKSPACE_QUESTIONS: Readonly<Record<CommitmentWorkspaceId, string>> =
  Object.freeze({
    timeline: "What happened?",
    scenario: "What could happen?",
    war_room: "What are we going to do?",
  });

export const TIMELINE_COMMITMENT_MANDATE = Object.freeze({
  domain: "history",
  question: COMMITMENT_WORKSPACE_QUESTIONS.timeline,
  forbidden: Object.freeze(["execute_actions", "commit_decisions"]),
});

export const SCENARIO_COMMITMENT_MANDATE = Object.freeze({
  domain: "possibility",
  question: COMMITMENT_WORKSPACE_QUESTIONS.scenario,
  forbidden: Object.freeze(["execute_actions", "commit_decisions"]),
});

export const WAR_ROOM_COMMITMENT_MANDATE = Object.freeze({
  domain: "commitment",
  question: COMMITMENT_WORKSPACE_QUESTIONS.war_room,
  allowed: WAR_ROOM_ALLOWED_COMMITMENT_ACTIONS,
  forbidden: Object.freeze([
    "rewrite_history",
    "generate_simulations",
    "own_forecasting_logic",
  ]),
});
