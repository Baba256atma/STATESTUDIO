/**
 * Nexora Constitution Rule #14 — Recommendation Ownership Contract.
 *
 * War Room owns commitment. Advisory owns recommendation. Governance owns approval.
 * No workspace may violate this boundary.
 */

export const NEXORA_RULE_14_RECOMMENDATION_OWNERSHIP_TAG =
  "[NEXORA_RULE_14_RECOMMENDATION_OWNERSHIP]" as const;
export const NEXORA_RULE_14_ACTIVE_TAG = "[NEXORA_RULE_14_ACTIVE]" as const;

export const NEXORA_RULE_14_VERSION = "1.0";

export type RecommendationOwnershipActorId =
  | "executive_summary"
  | "operational"
  | "risk"
  | "timeline"
  | "scenario"
  | "war_room"
  | "advisory"
  | "governance";

export type Rule14ViolationKind =
  | "issue_recommendations"
  | "approve_decisions"
  | "commit_decisions";

export type AdvisoryRecommendationAction =
  | "generate_recommendation"
  | "rank_alternatives"
  | "suggest_guidance"
  | "evaluate_tradeoffs";

export type GovernanceApprovalAction =
  | "approve_decision"
  | "reject_decision"
  | "escalate_approval"
  | "record_approval_status";

export type WarRoomCommitmentOwnershipAction =
  | "select_strategy"
  | "create_action_plans"
  | "track_execution_status"
  | "monitor_active_decisions";

export type Rule14RecommendationOwnershipAttempt = Readonly<{
  sourceActor: RecommendationOwnershipActorId;
  violationKind?: Rule14ViolationKind | null;
  recommendationAction?: AdvisoryRecommendationAction | null;
  approvalAction?: GovernanceApprovalAction | null;
  commitmentAction?: WarRoomCommitmentOwnershipAction | null;
  source?: string | null;
}>;

export type Rule14RecommendationOwnershipGuardResult =
  | Readonly<{
      allowed: true;
      tag: typeof NEXORA_RULE_14_RECOMMENDATION_OWNERSHIP_TAG;
    }>
  | Readonly<{
      allowed: false;
      tag: typeof NEXORA_RULE_14_RECOMMENDATION_OWNERSHIP_TAG;
      reason: string;
      violationKind: Rule14ViolationKind;
      sourceActor: RecommendationOwnershipActorId;
    }>;

export type Rule14CertificationResult = Readonly<{
  compliant: boolean;
  actorId: RecommendationOwnershipActorId;
  tag: typeof NEXORA_RULE_14_RECOMMENDATION_OWNERSHIP_TAG;
  violations: readonly string[];
}>;

export const RECOMMENDATION_OWNERSHIP_ACTOR_IDS: readonly RecommendationOwnershipActorId[] =
  Object.freeze([
    "executive_summary",
    "operational",
    "risk",
    "timeline",
    "scenario",
    "war_room",
    "advisory",
    "governance",
  ]);

export const RULE_14_PRIMARY_ACTOR_IDS: readonly RecommendationOwnershipActorId[] = Object.freeze([
  "scenario",
  "war_room",
  "advisory",
  "governance",
]);

export const ADVISORY_ALLOWED_RECOMMENDATION_ACTIONS: readonly AdvisoryRecommendationAction[] =
  Object.freeze([
    "generate_recommendation",
    "rank_alternatives",
    "suggest_guidance",
    "evaluate_tradeoffs",
  ]);

export const GOVERNANCE_ALLOWED_APPROVAL_ACTIONS: readonly GovernanceApprovalAction[] = Object.freeze([
  "approve_decision",
  "reject_decision",
  "escalate_approval",
  "record_approval_status",
]);

export const WAR_ROOM_ALLOWED_RULE_14_COMMITMENT_ACTIONS: readonly WarRoomCommitmentOwnershipAction[] =
  Object.freeze([
    "select_strategy",
    "create_action_plans",
    "track_execution_status",
    "monitor_active_decisions",
  ]);

export const RULE_14_BLOCKED_VIOLATIONS_BY_ACTOR = Object.freeze({
  executive_summary: Object.freeze([
    "issue_recommendations",
    "approve_decisions",
    "commit_decisions",
  ] as const),
  operational: Object.freeze([
    "issue_recommendations",
    "approve_decisions",
    "commit_decisions",
  ] as const),
  risk: Object.freeze([
    "issue_recommendations",
    "approve_decisions",
    "commit_decisions",
  ] as const),
  timeline: Object.freeze([
    "issue_recommendations",
    "approve_decisions",
    "commit_decisions",
  ] as const),
  scenario: Object.freeze([
    "issue_recommendations",
    "approve_decisions",
    "commit_decisions",
  ] as const),
  war_room: Object.freeze(["issue_recommendations", "approve_decisions"] as const),
  advisory: Object.freeze(["approve_decisions", "commit_decisions"] as const),
  governance: Object.freeze(["issue_recommendations", "commit_decisions"] as const),
} satisfies Readonly<
  Record<RecommendationOwnershipActorId, readonly Rule14ViolationKind[]>
>);

export const RECOMMENDATION_OWNERSHIP_QUESTIONS: Readonly<
  Record<"scenario" | "war_room" | "advisory" | "governance", string>
> = Object.freeze({
  scenario: "What could happen?",
  war_room: "What are we going to do?",
  advisory: "What do I recommend?",
  governance: "Is this approved?",
});

export const SCENARIO_RECOMMENDATION_MANDATE = Object.freeze({
  domain: "possibility",
  question: RECOMMENDATION_OWNERSHIP_QUESTIONS.scenario,
  forbidden: Object.freeze([
    "issue_recommendations",
    "approve_decisions",
    "commit_decisions",
  ]),
});

export const WAR_ROOM_RECOMMENDATION_MANDATE = Object.freeze({
  domain: "commitment",
  question: RECOMMENDATION_OWNERSHIP_QUESTIONS.war_room,
  allowed: WAR_ROOM_ALLOWED_RULE_14_COMMITMENT_ACTIONS,
  forbidden: Object.freeze(["issue_recommendations", "approve_decisions"]),
});

export const ADVISORY_RECOMMENDATION_MANDATE = Object.freeze({
  domain: "recommendation",
  question: RECOMMENDATION_OWNERSHIP_QUESTIONS.advisory,
  allowed: ADVISORY_ALLOWED_RECOMMENDATION_ACTIONS,
  forbidden: Object.freeze(["approve_decisions", "commit_decisions"]),
});

export const GOVERNANCE_RECOMMENDATION_MANDATE = Object.freeze({
  domain: "approval",
  question: RECOMMENDATION_OWNERSHIP_QUESTIONS.governance,
  allowed: GOVERNANCE_ALLOWED_APPROVAL_ACTIONS,
  forbidden: Object.freeze(["issue_recommendations", "commit_decisions"]),
});
