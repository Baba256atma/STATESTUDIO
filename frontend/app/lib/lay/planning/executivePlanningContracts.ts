export const EXECUTIVE_PLANNING_SESSION_CONTRACT = Object.freeze({
  contractId: "lay-4:planning-session",
  immutable: true,
  execution: false,
});

export const EXECUTIVE_PLANNING_INPUT_CONTRACT = Object.freeze({
  contractId: "lay-4:planning-input",
  immutable: true,
  consumesLay3Judgment: true,
});

export const EXECUTIVE_PLAN_CONTRACT = Object.freeze({
  contractId: "lay-4:plan",
  immutable: true,
  workflowRuntime: false,
});

export const EXECUTIVE_GOAL_CONTRACT = Object.freeze({
  contractId: "lay-4:goal",
  immutable: true,
  judgmentTraceRequired: true,
});

export const EXECUTIVE_MILESTONE_CONTRACT = Object.freeze({
  contractId: "lay-4:milestone",
  immutable: true,
  calendarDatesAllowed: false,
});

export const EXECUTIVE_TIMELINE_CONTRACT = Object.freeze({
  contractId: "lay-4:timeline",
  immutable: true,
  logicalOnly: true,
});

export const EXECUTIVE_PLANNING_VALIDATION_CONTRACT = Object.freeze({
  contractId: "lay-4:validation",
  immutable: true,
  structuredIssuesOnly: true,
});

export const EXECUTIVE_PLANNING_CONTRACTS = Object.freeze([
  EXECUTIVE_PLANNING_SESSION_CONTRACT,
  EXECUTIVE_PLANNING_INPUT_CONTRACT,
  EXECUTIVE_PLAN_CONTRACT,
  EXECUTIVE_GOAL_CONTRACT,
  EXECUTIVE_MILESTONE_CONTRACT,
  EXECUTIVE_TIMELINE_CONTRACT,
  EXECUTIVE_PLANNING_VALIDATION_CONTRACT,
] as const);
