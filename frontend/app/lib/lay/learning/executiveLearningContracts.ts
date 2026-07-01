export const EXECUTIVE_LEARNING_SESSION_CONTRACT = Object.freeze({ contractId: "lay-11:learning-session", immutable: true, memoryMutation: false });
export const EXECUTIVE_LEARNING_INPUT_CONTRACT = Object.freeze({ contractId: "lay-11:learning-input", immutable: true, consumesLay2ThroughLay10: true });
export const EXECUTIVE_LEARNING_RESULT_CONTRACT = Object.freeze({ contractId: "lay-11:learning-result", immutable: true, modelTraining: false });
export const EXECUTIVE_LEARNING_PATTERN_CONTRACT = Object.freeze({ contractId: "lay-11:pattern", immutable: true, deterministic: true });
export const EXECUTIVE_ASSUMPTION_PATTERN_CONTRACT = Object.freeze({ contractId: "lay-11:assumption-pattern", immutable: true, profileUpdate: false });
export const EXECUTIVE_JUDGMENT_REFLECTION_CONTRACT = Object.freeze({ contractId: "lay-11:judgment-reflection", immutable: true, recommendationGeneration: false });
export const EXECUTIVE_PLAN_REFLECTION_CONTRACT = Object.freeze({ contractId: "lay-11:plan-reflection", immutable: true, simulation: false });
export const EXECUTIVE_COACHING_REFLECTION_CONTRACT = Object.freeze({ contractId: "lay-11:coaching-reflection", immutable: true, feedbackMutation: false });
export const EXECUTIVE_LESSON_CONTRACT = Object.freeze({ contractId: "lay-11:lesson", immutable: true, metadataOnly: true });
export const EXECUTIVE_LEARNING_EXPLANATION_CONTRACT = Object.freeze({ contractId: "lay-11:explanation", immutable: true, llmGenerated: false });
export const EXECUTIVE_LEARNING_VALIDATION_CONTRACT = Object.freeze({ contractId: "lay-11:validation", immutable: true, structuredIssuesOnly: true });

export const EXECUTIVE_LEARNING_CONTRACTS = Object.freeze([
  EXECUTIVE_LEARNING_SESSION_CONTRACT,
  EXECUTIVE_LEARNING_INPUT_CONTRACT,
  EXECUTIVE_LEARNING_RESULT_CONTRACT,
  EXECUTIVE_LEARNING_PATTERN_CONTRACT,
  EXECUTIVE_ASSUMPTION_PATTERN_CONTRACT,
  EXECUTIVE_JUDGMENT_REFLECTION_CONTRACT,
  EXECUTIVE_PLAN_REFLECTION_CONTRACT,
  EXECUTIVE_COACHING_REFLECTION_CONTRACT,
  EXECUTIVE_LESSON_CONTRACT,
  EXECUTIVE_LEARNING_EXPLANATION_CONTRACT,
  EXECUTIVE_LEARNING_VALIDATION_CONTRACT,
] as const);
