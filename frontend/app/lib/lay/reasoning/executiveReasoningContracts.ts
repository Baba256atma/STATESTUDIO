export const EXECUTIVE_REASONING_SESSION_CONTRACT = Object.freeze({
  contractId: "lay-2:reasoning-session",
  immutable: true,
  decisionMaking: false,
});

export const EXECUTIVE_REASONING_INPUT_CONTRACT = Object.freeze({
  contractId: "lay-2:reasoning-input",
  immutable: true,
  domainSpecific: false,
});

export const EXECUTIVE_REASONING_OUTPUT_CONTRACT = Object.freeze({
  contractId: "lay-2:reasoning-output",
  immutable: true,
  recommendations: false,
});

export const EXECUTIVE_REASONING_CHAIN_CONTRACT = Object.freeze({
  contractId: "lay-2:reasoning-chain",
  immutable: true,
  cyclesAllowed: false,
});

export const EXECUTIVE_REASONING_EXPLANATION_CONTRACT = Object.freeze({
  contractId: "lay-2:reasoning-explanation",
  immutable: true,
  requiresWhyBecauseTherefore: true,
});

export const EXECUTIVE_REASONING_VALIDATION_CONTRACT = Object.freeze({
  contractId: "lay-2:reasoning-validation",
  immutable: true,
  structuredIssuesOnly: true,
});

export const EXECUTIVE_REASONING_CONTRACTS = Object.freeze([
  EXECUTIVE_REASONING_SESSION_CONTRACT,
  EXECUTIVE_REASONING_INPUT_CONTRACT,
  EXECUTIVE_REASONING_OUTPUT_CONTRACT,
  EXECUTIVE_REASONING_CHAIN_CONTRACT,
  EXECUTIVE_REASONING_EXPLANATION_CONTRACT,
  EXECUTIVE_REASONING_VALIDATION_CONTRACT,
] as const);
