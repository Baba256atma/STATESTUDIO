export const EXECUTIVE_COMMUNICATION_SESSION_CONTRACT = Object.freeze({
  contractId: "lay-8:communication-session",
  immutable: true,
  sendsMessages: false,
});

export const EXECUTIVE_COMMUNICATION_INPUT_CONTRACT = Object.freeze({
  contractId: "lay-8:communication-input",
  immutable: true,
  consumesLay2ThroughLay7: true,
});

export const EXECUTIVE_COMMUNICATION_RESULT_CONTRACT = Object.freeze({
  contractId: "lay-8:communication-result",
  immutable: true,
  rendersUi: false,
});

export const EXECUTIVE_AUDIENCE_FRAME_CONTRACT = Object.freeze({
  contractId: "lay-8:audience-frame",
  immutable: true,
  deterministic: true,
});

export const EXECUTIVE_BRIEFING_CONTRACT = Object.freeze({
  contractId: "lay-8:briefing",
  immutable: true,
  emailSending: false,
});

export const EXECUTIVE_SUMMARY_CONTRACT = Object.freeze({
  contractId: "lay-8:summary",
  immutable: true,
  reportGeneration: false,
});

export const EXECUTIVE_RISK_COMMUNICATION_CONTRACT = Object.freeze({
  contractId: "lay-8:risk-communication",
  immutable: true,
  autonomousDecision: false,
});

export const EXECUTIVE_PLAN_COMMUNICATION_CONTRACT = Object.freeze({
  contractId: "lay-8:plan-communication",
  immutable: true,
  workflowRuntime: false,
});

export const EXECUTIVE_COMMUNICATION_VALIDATION_CONTRACT = Object.freeze({
  contractId: "lay-8:validation",
  immutable: true,
  structuredIssuesOnly: true,
});

export const EXECUTIVE_COMMUNICATION_CONTRACTS = Object.freeze([
  EXECUTIVE_COMMUNICATION_SESSION_CONTRACT,
  EXECUTIVE_COMMUNICATION_INPUT_CONTRACT,
  EXECUTIVE_COMMUNICATION_RESULT_CONTRACT,
  EXECUTIVE_AUDIENCE_FRAME_CONTRACT,
  EXECUTIVE_BRIEFING_CONTRACT,
  EXECUTIVE_SUMMARY_CONTRACT,
  EXECUTIVE_RISK_COMMUNICATION_CONTRACT,
  EXECUTIVE_PLAN_COMMUNICATION_CONTRACT,
  EXECUTIVE_COMMUNICATION_VALIDATION_CONTRACT,
] as const);
