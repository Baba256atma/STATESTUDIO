export const EXECUTIVE_VISUAL_REASONING_SESSION_CONTRACT = Object.freeze({
  contractId: "lay-7:visual-reasoning-session",
  immutable: true,
  rendersUi: false,
});

export const EXECUTIVE_VISUAL_REASONING_INPUT_CONTRACT = Object.freeze({
  contractId: "lay-7:visual-reasoning-input",
  immutable: true,
  consumesLay2Lay3Lay4Lay5Lay6: true,
});

export const EXECUTIVE_VISUAL_REASONING_RESULT_CONTRACT = Object.freeze({
  contractId: "lay-7:visual-reasoning-result",
  immutable: true,
  mutatesScene: false,
});

export const EXECUTIVE_VISUAL_NODE_CONTRACT = Object.freeze({
  contractId: "lay-7:visual-node",
  immutable: true,
  traceable: true,
});

export const EXECUTIVE_VISUAL_EDGE_CONTRACT = Object.freeze({
  contractId: "lay-7:visual-edge",
  immutable: true,
  noDanglingEdges: true,
});

export const EXECUTIVE_VISUAL_MAP_CONTRACT = Object.freeze({
  contractId: "lay-7:visual-map",
  immutable: true,
  metadataOnly: true,
});

export const EXECUTIVE_VISUAL_EXPLANATION_CONTRACT = Object.freeze({
  contractId: "lay-7:visual-explanation",
  immutable: true,
  llmGenerated: false,
});

export const EXECUTIVE_VISUAL_VALIDATION_CONTRACT = Object.freeze({
  contractId: "lay-7:visual-validation",
  immutable: true,
  structuredIssuesOnly: true,
});

export const EXECUTIVE_VISUAL_REASONING_CONTRACTS = Object.freeze([
  EXECUTIVE_VISUAL_REASONING_SESSION_CONTRACT,
  EXECUTIVE_VISUAL_REASONING_INPUT_CONTRACT,
  EXECUTIVE_VISUAL_REASONING_RESULT_CONTRACT,
  EXECUTIVE_VISUAL_NODE_CONTRACT,
  EXECUTIVE_VISUAL_EDGE_CONTRACT,
  EXECUTIVE_VISUAL_MAP_CONTRACT,
  EXECUTIVE_VISUAL_EXPLANATION_CONTRACT,
  EXECUTIVE_VISUAL_VALIDATION_CONTRACT,
] as const);
