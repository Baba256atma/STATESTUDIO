const contract = (id: string, name: string, description: string) => Object.freeze({
  id,
  name,
  description,
  status: "Defined",
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
} as const);

export const ExecutiveReasoningPipelineContracts = Object.freeze([
  contract(
    "eng-6-contract-reasoning-pipeline",
    "ExecutiveReasoningPipelineContract",
    "Architectural contract describing the Executive Reasoning Pipeline as metadata-only reasoning architecture between planning and decision making.",
  ),
  contract(
    "eng-6-contract-evidence",
    "ExecutiveEvidenceContract",
    "Architectural contract describing evidence categories and evidence evaluation metadata without collecting or scoring evidence.",
  ),
  contract(
    "eng-6-contract-hypothesis",
    "ExecutiveHypothesisContract",
    "Architectural contract describing hypothesis types and formation metadata without generating or testing hypotheses.",
  ),
  contract(
    "eng-6-contract-inference",
    "ExecutiveInferenceContract",
    "Architectural contract describing inference type vocabulary without performing inference or AI execution.",
  ),
  contract(
    "eng-6-contract-confidence",
    "ExecutiveConfidenceContract",
    "Architectural contract describing confidence level classifications without calculating confidence scores.",
  ),
  contract(
    "eng-6-contract-reasoning-lifecycle",
    "ExecutiveReasoningLifecycleContract",
    "Architectural contract describing ordered reasoning lifecycle stages as immutable metadata only.",
  ),
] as const);
