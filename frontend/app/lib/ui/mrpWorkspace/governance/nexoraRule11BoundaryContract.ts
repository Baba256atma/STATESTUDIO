/**
 * Nexora Constitution Rule #11 — Executive Decision Boundary Contract.
 *
 * Permanent architectural boundary between Timeline, Scenario, and War Room workspaces.
 * Timeline = Past · Scenario = Possible Futures · War Room = Action
 */

export const NEXORA_RULE_11_BOUNDARY_TAG = "[NEXORA_RULE_11_BOUNDARY]" as const;
export const NEXORA_RULE_11_ACTIVE_TAG = "[NEXORA_RULE_11_ACTIVE]" as const;

export const NEXORA_RULE_11_VERSION = "1.0";

export type ExecutiveDecisionWorkspaceId = "timeline" | "scenario" | "war_room";

export type ExecutiveBoundaryCapability =
  | "historical_analysis"
  | "future_simulation"
  | "decision_execution"
  | "risk_forecast"
  | "historical_trend_analysis"
  | "active_strategy_tracking";

export type ExecutiveBoundaryOwnership = "owner" | "consumer" | "read_only" | "forbidden";

export type ExecutiveBoundaryIntent = "own" | "consume" | "read";

export type Rule11ViolationKind =
  | "render_foreign_panel"
  | "predict_future_outcomes"
  | "generate_alternative_futures"
  | "recommend_actions"
  | "commit_decisions"
  | "execute_decisions"
  | "commit_actions"
  | "modify_timeline_history"
  | "rewrite_historical_records"
  | "rewrite_timeline_events"
  | "alter_historical_records"
  | "own_simulation_generation"
  | "capability_boundary_crossing";

export type Rule11BoundaryAttempt = Readonly<{
  sourceWorkspace: ExecutiveDecisionWorkspaceId;
  violationKind: Rule11ViolationKind;
  targetWorkspace?: ExecutiveDecisionWorkspaceId | null;
  capability?: ExecutiveBoundaryCapability | null;
  intent?: ExecutiveBoundaryIntent | null;
  source?: string | null;
}>;

export type Rule11BoundaryGuardResult =
  | Readonly<{
      allowed: true;
      tag: typeof NEXORA_RULE_11_BOUNDARY_TAG;
    }>
  | Readonly<{
      allowed: false;
      tag: typeof NEXORA_RULE_11_BOUNDARY_TAG;
      reason: string;
      violationKind: Rule11ViolationKind;
      sourceWorkspace: ExecutiveDecisionWorkspaceId;
    }>;

export type Rule11CertificationResult = Readonly<{
  compliant: boolean;
  workspaceId: ExecutiveDecisionWorkspaceId;
  tag: typeof NEXORA_RULE_11_BOUNDARY_TAG;
  violations: readonly string[];
}>;

export const EXECUTIVE_DECISION_WORKSPACE_IDS: readonly ExecutiveDecisionWorkspaceId[] =
  Object.freeze(["timeline", "scenario", "war_room"]);

export const EXECUTIVE_BOUNDARY_OWNERSHIP_MATRIX: Readonly<
  Record<
    ExecutiveBoundaryCapability,
    Readonly<Record<ExecutiveDecisionWorkspaceId, ExecutiveBoundaryOwnership>>
  >
> = Object.freeze({
  historical_analysis: Object.freeze({
    timeline: "owner",
    scenario: "forbidden",
    war_room: "forbidden",
  }),
  future_simulation: Object.freeze({
    timeline: "forbidden",
    scenario: "owner",
    war_room: "consumer",
  }),
  decision_execution: Object.freeze({
    timeline: "forbidden",
    scenario: "forbidden",
    war_room: "owner",
  }),
  risk_forecast: Object.freeze({
    timeline: "forbidden",
    scenario: "owner",
    war_room: "consumer",
  }),
  historical_trend_analysis: Object.freeze({
    timeline: "owner",
    scenario: "read_only",
    war_room: "read_only",
  }),
  active_strategy_tracking: Object.freeze({
    timeline: "forbidden",
    scenario: "read_only",
    war_room: "owner",
  }),
});

export const TIMELINE_WORKSPACE_MANDATE = Object.freeze({
  question: "What happened?",
  domain: "past",
  responsibilities: Object.freeze([
    "Historical events",
    "Historical object state changes",
    "Historical decisions",
    "Historical risk events",
    "Historical operational trends",
    "Historical scenario outcomes",
  ]),
  forbidden: Object.freeze([
    "Predict future outcomes",
    "Generate alternative futures",
    "Recommend actions",
    "Commit decisions",
  ]),
});

export const SCENARIO_WORKSPACE_MANDATE = Object.freeze({
  question: "What could happen?",
  domain: "possible_futures",
  responsibilities: Object.freeze([
    "Alternative futures",
    "Future simulations",
    "Decision comparison",
    "Impact forecasting",
    "Risk forecasting",
    "Outcome probability analysis",
  ]),
  forbidden: Object.freeze([
    "Rewrite historical records",
    "Modify timeline history",
    "Execute decisions",
    "Commit actions",
  ]),
});

export const WAR_ROOM_WORKSPACE_MANDATE = Object.freeze({
  question: "What should we do now?",
  domain: "action",
  responsibilities: Object.freeze([
    "Decision execution",
    "Strategy selection",
    "Operational response plans",
    "Action tracking",
    "Executive command surfaces",
    "Monitoring active decisions",
  ]),
  forbidden: Object.freeze([
    "Alter historical records",
    "Rewrite timeline events",
    "Simulate futures without Scenario ownership",
  ]),
});

export const RULE_11_BLOCKED_VIOLATIONS_BY_WORKSPACE = Object.freeze({
  timeline: Object.freeze([
    "render_foreign_panel",
    "predict_future_outcomes",
    "generate_alternative_futures",
    "recommend_actions",
    "commit_decisions",
  ] as const),
  scenario: Object.freeze([
    "execute_decisions",
    "commit_actions",
    "modify_timeline_history",
    "rewrite_historical_records",
  ] as const),
  war_room: Object.freeze([
    "modify_timeline_history",
    "rewrite_timeline_events",
    "alter_historical_records",
    "own_simulation_generation",
  ] as const),
} satisfies Readonly<Record<ExecutiveDecisionWorkspaceId, readonly Rule11ViolationKind[]>>);
