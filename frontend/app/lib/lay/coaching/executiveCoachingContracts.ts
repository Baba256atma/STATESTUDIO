export const EXECUTIVE_COACHING_SESSION_CONTRACT = Object.freeze({
  contractId: "lay-5:coaching-session",
  immutable: true,
  assistantRuntime: false,
});

export const EXECUTIVE_COACHING_INPUT_CONTRACT = Object.freeze({
  contractId: "lay-5:coaching-input",
  immutable: true,
  consumesLay2Lay3Lay4: true,
});

export const EXECUTIVE_COACHING_RESULT_CONTRACT = Object.freeze({
  contractId: "lay-5:coaching-result",
  immutable: true,
  autonomousDecision: false,
});

export const EXECUTIVE_COACHING_QUESTION_CONTRACT = Object.freeze({
  contractId: "lay-5:question",
  immutable: true,
  deterministic: true,
});

export const EXECUTIVE_COACHING_CHALLENGE_CONTRACT = Object.freeze({
  contractId: "lay-5:challenge",
  immutable: true,
  deterministic: true,
});

export const EXECUTIVE_COACHING_BLIND_SPOT_CONTRACT = Object.freeze({
  contractId: "lay-5:blind-spot",
  immutable: true,
  deterministic: true,
});

export const EXECUTIVE_COACHING_REFLECTION_CONTRACT = Object.freeze({
  contractId: "lay-5:reflection",
  immutable: true,
  conversationMemory: false,
});

export const EXECUTIVE_COACHING_EXPLANATION_CONTRACT = Object.freeze({
  contractId: "lay-5:explanation",
  immutable: true,
  llmGenerated: false,
});

export const EXECUTIVE_COACHING_VALIDATION_CONTRACT = Object.freeze({
  contractId: "lay-5:validation",
  immutable: true,
  structuredIssuesOnly: true,
});

export const EXECUTIVE_COACHING_CONTRACTS = Object.freeze([
  EXECUTIVE_COACHING_SESSION_CONTRACT,
  EXECUTIVE_COACHING_INPUT_CONTRACT,
  EXECUTIVE_COACHING_RESULT_CONTRACT,
  EXECUTIVE_COACHING_QUESTION_CONTRACT,
  EXECUTIVE_COACHING_CHALLENGE_CONTRACT,
  EXECUTIVE_COACHING_BLIND_SPOT_CONTRACT,
  EXECUTIVE_COACHING_REFLECTION_CONTRACT,
  EXECUTIVE_COACHING_EXPLANATION_CONTRACT,
  EXECUTIVE_COACHING_VALIDATION_CONTRACT,
] as const);
