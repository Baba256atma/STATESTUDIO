export const EXECUTIVE_JUDGMENT_SESSION_CONTRACT = Object.freeze({
  contractId: "lay-3:judgment-session",
  immutable: true,
  autonomousDecision: false,
});

export const EXECUTIVE_JUDGMENT_INPUT_CONTRACT = Object.freeze({
  contractId: "lay-3:judgment-input",
  immutable: true,
  consumesLay2Reasoning: true,
});

export const EXECUTIVE_JUDGMENT_RESULT_CONTRACT = Object.freeze({
  contractId: "lay-3:judgment-result",
  immutable: true,
  planning: false,
});

export const EXECUTIVE_CONFIDENCE_CONTRACT = Object.freeze({
  contractId: "lay-3:confidence",
  immutable: true,
  probabilisticMl: false,
});

export const EXECUTIVE_RATIONALE_CONTRACT = Object.freeze({
  contractId: "lay-3:rationale",
  immutable: true,
  recommendations: false,
});

export const EXECUTIVE_JUDGMENT_VALIDATION_CONTRACT = Object.freeze({
  contractId: "lay-3:validation",
  immutable: true,
  structuredIssuesOnly: true,
});

export const EXECUTIVE_JUDGMENT_CONTRACTS = Object.freeze([
  EXECUTIVE_JUDGMENT_SESSION_CONTRACT,
  EXECUTIVE_JUDGMENT_INPUT_CONTRACT,
  EXECUTIVE_JUDGMENT_RESULT_CONTRACT,
  EXECUTIVE_CONFIDENCE_CONTRACT,
  EXECUTIVE_RATIONALE_CONTRACT,
  EXECUTIVE_JUDGMENT_VALIDATION_CONTRACT,
] as const);
