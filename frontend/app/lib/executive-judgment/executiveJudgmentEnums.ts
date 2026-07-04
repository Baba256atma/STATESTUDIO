export const JudgmentStatus = Object.freeze({
  Draft: "draft",
  Candidate: "candidate",
  Validated: "validated",
  Archived: "archived",
} as const);
export type JudgmentStatus = (typeof JudgmentStatus)[keyof typeof JudgmentStatus];

export const JudgmentState = Object.freeze({
  Proposed: "proposed",
  UnderReview: "under-review",
  Accepted: "accepted",
  Rejected: "rejected",
} as const);
export type JudgmentState = (typeof JudgmentState)[keyof typeof JudgmentState];

export const JudgmentType = Object.freeze({
  Strategic: "strategic",
  Operational: "operational",
  Financial: "financial",
  Risk: "risk",
  Portfolio: "portfolio",
} as const);
export type JudgmentType = (typeof JudgmentType)[keyof typeof JudgmentType];

export const EvidenceStrength = Object.freeze({
  Weak: "weak",
  Moderate: "moderate",
  Strong: "strong",
  Conclusive: "conclusive",
} as const);
export type EvidenceStrength = (typeof EvidenceStrength)[keyof typeof EvidenceStrength];

export const ConfidenceLevel = Object.freeze({
  Low: "low",
  Medium: "medium",
  High: "high",
  VeryHigh: "very-high",
} as const);
export type ConfidenceLevel = (typeof ConfidenceLevel)[keyof typeof ConfidenceLevel];

export const PriorityLevel = Object.freeze({
  Low: "low",
  Medium: "medium",
  High: "high",
  Critical: "critical",
} as const);
export type PriorityLevel = (typeof PriorityLevel)[keyof typeof PriorityLevel];

export const TradeoffType = Object.freeze({
  CostBenefit: "cost-benefit",
  RiskReward: "risk-reward",
  SpeedQuality: "speed-quality",
  ScopeResource: "scope-resource",
} as const);
export type TradeoffType = (typeof TradeoffType)[keyof typeof TradeoffType];

export const ConstraintType = Object.freeze({
  Resource: "resource",
  Time: "time",
  Policy: "policy",
  Dependency: "dependency",
  Scope: "scope",
} as const);
export type ConstraintType = (typeof ConstraintType)[keyof typeof ConstraintType];

export const OutcomeType = Object.freeze({
  Accepted: "accepted",
  Deferred: "deferred",
  Rejected: "rejected",
  Escalated: "escalated",
} as const);
export type OutcomeType = (typeof OutcomeType)[keyof typeof OutcomeType];

export const DecisionDirection = Object.freeze({
  Proceed: "proceed",
  Pause: "pause",
  Revise: "revise",
  Stop: "stop",
  Escalate: "escalate",
} as const);
export type DecisionDirection = (typeof DecisionDirection)[keyof typeof DecisionDirection];
