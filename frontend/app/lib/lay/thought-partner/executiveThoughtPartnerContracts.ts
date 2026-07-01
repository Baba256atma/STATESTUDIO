export const EXECUTIVE_THOUGHT_PARTNER_SESSION_CONTRACT = Object.freeze({
  contractId: "lay-6:thought-partner-session",
  immutable: true,
  assistantChatRuntime: false,
});

export const EXECUTIVE_THOUGHT_PARTNER_INPUT_CONTRACT = Object.freeze({
  contractId: "lay-6:thought-partner-input",
  immutable: true,
  consumesLay2Lay3Lay4Lay5: true,
});

export const EXECUTIVE_THOUGHT_PARTNER_RESULT_CONTRACT = Object.freeze({
  contractId: "lay-6:thought-partner-result",
  immutable: true,
  autonomousDecision: false,
});

export const EXECUTIVE_THOUGHT_PARTNER_PERSPECTIVE_CONTRACT = Object.freeze({
  contractId: "lay-6:perspective-frame",
  immutable: true,
  deterministic: true,
});

export const EXECUTIVE_THOUGHT_PARTNER_COUNTERPOINT_CONTRACT = Object.freeze({
  contractId: "lay-6:counterpoint",
  immutable: true,
  finalRecommendation: false,
});

export const EXECUTIVE_THOUGHT_PARTNER_ALTERNATIVE_VIEWPOINT_CONTRACT = Object.freeze({
  contractId: "lay-6:alternative-viewpoint",
  immutable: true,
  domainSpecificLogic: false,
});

export const EXECUTIVE_THOUGHT_PARTNER_REFLECTION_CONTRACT = Object.freeze({
  contractId: "lay-6:strategic-reflection",
  immutable: true,
  conversationMemory: false,
});

export const EXECUTIVE_THOUGHT_PARTNER_DEBATE_PATH_CONTRACT = Object.freeze({
  contractId: "lay-6:debate-path",
  immutable: true,
  noFinalDecision: true,
});

export const EXECUTIVE_THOUGHT_PARTNER_TENSION_MAP_CONTRACT = Object.freeze({
  contractId: "lay-6:tension-map",
  immutable: true,
  traceable: true,
});

export const EXECUTIVE_THOUGHT_PARTNER_EXPLANATION_CONTRACT = Object.freeze({
  contractId: "lay-6:explanation",
  immutable: true,
  llmGenerated: false,
});

export const EXECUTIVE_THOUGHT_PARTNER_VALIDATION_CONTRACT = Object.freeze({
  contractId: "lay-6:validation",
  immutable: true,
  structuredIssuesOnly: true,
});

export const EXECUTIVE_THOUGHT_PARTNER_CONTRACTS = Object.freeze([
  EXECUTIVE_THOUGHT_PARTNER_SESSION_CONTRACT,
  EXECUTIVE_THOUGHT_PARTNER_INPUT_CONTRACT,
  EXECUTIVE_THOUGHT_PARTNER_RESULT_CONTRACT,
  EXECUTIVE_THOUGHT_PARTNER_PERSPECTIVE_CONTRACT,
  EXECUTIVE_THOUGHT_PARTNER_COUNTERPOINT_CONTRACT,
  EXECUTIVE_THOUGHT_PARTNER_ALTERNATIVE_VIEWPOINT_CONTRACT,
  EXECUTIVE_THOUGHT_PARTNER_REFLECTION_CONTRACT,
  EXECUTIVE_THOUGHT_PARTNER_DEBATE_PATH_CONTRACT,
  EXECUTIVE_THOUGHT_PARTNER_TENSION_MAP_CONTRACT,
  EXECUTIVE_THOUGHT_PARTNER_EXPLANATION_CONTRACT,
  EXECUTIVE_THOUGHT_PARTNER_VALIDATION_CONTRACT,
] as const);
