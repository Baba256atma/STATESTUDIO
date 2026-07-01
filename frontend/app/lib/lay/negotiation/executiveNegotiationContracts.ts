export const EXECUTIVE_NEGOTIATION_SESSION_CONTRACT = Object.freeze({ contractId: "lay-9:negotiation-session", immutable: true, autonomousNegotiation: false });
export const EXECUTIVE_NEGOTIATION_INPUT_CONTRACT = Object.freeze({ contractId: "lay-9:negotiation-input", immutable: true, consumesLay2ThroughLay8: true });
export const EXECUTIVE_NEGOTIATION_RESULT_CONTRACT = Object.freeze({ contractId: "lay-9:negotiation-result", immutable: true, messageSending: false });
export const EXECUTIVE_STAKEHOLDER_POSITION_CONTRACT = Object.freeze({ contractId: "lay-9:stakeholder-position", immutable: true, stakeholderMetadataOnly: true });
export const EXECUTIVE_INTEREST_CONTRACT = Object.freeze({ contractId: "lay-9:interest", immutable: true, separatesPositionFromInterest: true });
export const EXECUTIVE_LEVERAGE_CONTRACT = Object.freeze({ contractId: "lay-9:leverage", immutable: true, legalAdvice: false });
export const EXECUTIVE_CONCESSION_CONTRACT = Object.freeze({ contractId: "lay-9:concession", immutable: true, finalRecommendation: false });
export const EXECUTIVE_CONFLICT_ZONE_CONTRACT = Object.freeze({ contractId: "lay-9:conflict-zone", immutable: true, deterministic: true });
export const EXECUTIVE_NEGOTIATION_PATH_CONTRACT = Object.freeze({ contractId: "lay-9:negotiation-path", immutable: true, noFinalPathChosen: true });
export const EXECUTIVE_NEGOTIATION_EXPLANATION_CONTRACT = Object.freeze({ contractId: "lay-9:explanation", immutable: true, llmGenerated: false });
export const EXECUTIVE_NEGOTIATION_VALIDATION_CONTRACT = Object.freeze({ contractId: "lay-9:validation", immutable: true, structuredIssuesOnly: true });

export const EXECUTIVE_NEGOTIATION_CONTRACTS = Object.freeze([
  EXECUTIVE_NEGOTIATION_SESSION_CONTRACT,
  EXECUTIVE_NEGOTIATION_INPUT_CONTRACT,
  EXECUTIVE_NEGOTIATION_RESULT_CONTRACT,
  EXECUTIVE_STAKEHOLDER_POSITION_CONTRACT,
  EXECUTIVE_INTEREST_CONTRACT,
  EXECUTIVE_LEVERAGE_CONTRACT,
  EXECUTIVE_CONCESSION_CONTRACT,
  EXECUTIVE_CONFLICT_ZONE_CONTRACT,
  EXECUTIVE_NEGOTIATION_PATH_CONTRACT,
  EXECUTIVE_NEGOTIATION_EXPLANATION_CONTRACT,
  EXECUTIVE_NEGOTIATION_VALIDATION_CONTRACT,
] as const);
