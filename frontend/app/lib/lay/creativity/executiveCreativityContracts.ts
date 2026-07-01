export const EXECUTIVE_CREATIVITY_SESSION_CONTRACT = Object.freeze({ contractId: "lay-10:creativity-session", immutable: true, autonomousDecision: false });
export const EXECUTIVE_CREATIVITY_INPUT_CONTRACT = Object.freeze({ contractId: "lay-10:creativity-input", immutable: true, consumesLay2ThroughLay9: true });
export const EXECUTIVE_CREATIVITY_RESULT_CONTRACT = Object.freeze({ contractId: "lay-10:creativity-result", immutable: true, finalRecommendation: false });
export const EXECUTIVE_REFRAME_CONTRACT = Object.freeze({ contractId: "lay-10:reframe", immutable: true, deterministic: true });
export const EXECUTIVE_CREATIVE_ALTERNATIVE_CONTRACT = Object.freeze({ contractId: "lay-10:creative-alternative", immutable: true, notSelected: true });
export const EXECUTIVE_OPPORTUNITY_IDEA_CONTRACT = Object.freeze({ contractId: "lay-10:opportunity-idea", immutable: true, domainSpecific: false });
export const EXECUTIVE_CONSTRAINT_REFRAME_CONTRACT = Object.freeze({ contractId: "lay-10:constraint-reframe", immutable: true, blockerReframed: true });
export const EXECUTIVE_STRATEGIC_ANGLE_CONTRACT = Object.freeze({ contractId: "lay-10:strategic-angle", immutable: true, metadataOnly: true });
export const EXECUTIVE_INNOVATION_PATH_CONTRACT = Object.freeze({ contractId: "lay-10:innovation-path", immutable: true, conceptualOnly: true });
export const EXECUTIVE_CREATIVITY_EXPLANATION_CONTRACT = Object.freeze({ contractId: "lay-10:explanation", immutable: true, llmGenerated: false });
export const EXECUTIVE_CREATIVITY_VALIDATION_CONTRACT = Object.freeze({ contractId: "lay-10:validation", immutable: true, structuredIssuesOnly: true });

export const EXECUTIVE_CREATIVITY_CONTRACTS = Object.freeze([
  EXECUTIVE_CREATIVITY_SESSION_CONTRACT,
  EXECUTIVE_CREATIVITY_INPUT_CONTRACT,
  EXECUTIVE_CREATIVITY_RESULT_CONTRACT,
  EXECUTIVE_REFRAME_CONTRACT,
  EXECUTIVE_CREATIVE_ALTERNATIVE_CONTRACT,
  EXECUTIVE_OPPORTUNITY_IDEA_CONTRACT,
  EXECUTIVE_CONSTRAINT_REFRAME_CONTRACT,
  EXECUTIVE_STRATEGIC_ANGLE_CONTRACT,
  EXECUTIVE_INNOVATION_PATH_CONTRACT,
  EXECUTIVE_CREATIVITY_EXPLANATION_CONTRACT,
  EXECUTIVE_CREATIVITY_VALIDATION_CONTRACT,
] as const);
