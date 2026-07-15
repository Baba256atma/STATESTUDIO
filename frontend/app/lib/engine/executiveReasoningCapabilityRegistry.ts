const capability = (
  key: string,
  name: string,
  description: string,
  relatedComponentId: string,
) => Object.freeze({
  id: `eng-6-capability-${key}`,
  name,
  description,
  owner: "ENG-6",
  relatedComponentId,
  status: "Registered",
  version: "1.0.0",
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
  aiFree: true,
} as const);

export const ExecutiveReasoningCapabilityRegistry = Object.freeze([
  capability(
    "collect-evidence",
    "CollectEvidence",
    "Capability describing evidence-collection architecture without collecting evidence at runtime.",
    "eng-6-component-evidence-collector",
  ),
  capability(
    "validate-evidence",
    "ValidateEvidence",
    "Capability describing evidence-validation architecture without validating evidence at runtime.",
    "eng-6-component-evidence-evaluator",
  ),
  capability(
    "build-hypothesis",
    "BuildHypothesis",
    "Capability describing hypothesis-building architecture without generating hypotheses.",
    "eng-6-component-hypothesis-builder",
  ),
  capability(
    "execute-inference",
    "ExecuteInference",
    "Capability describing inference architecture without executing inference or AI models.",
    "eng-6-component-inference-coordinator",
  ),
  capability(
    "detect-contradictions",
    "DetectContradictions",
    "Capability describing contradiction-detection architecture without detecting contradictions at runtime.",
    "eng-6-component-contradiction-resolver",
  ),
  capability(
    "evaluate-confidence",
    "EvaluateConfidence",
    "Capability describing confidence-evaluation architecture without calculating confidence.",
    "eng-6-component-confidence-evaluator",
  ),
  capability(
    "generate-explanation",
    "GenerateExplanation",
    "Capability describing explanation-generation architecture without generating explanations.",
    "eng-6-component-explanation-composer",
  ),
  capability(
    "produce-reasoning-summary",
    "ProduceReasoningSummary",
    "Capability describing reasoning-summary architecture without producing runtime summaries.",
    "eng-6-component-reasoning-summarizer",
  ),
] as const);

const capabilityIndex = Object.freeze(
  Object.fromEntries(ExecutiveReasoningCapabilityRegistry.map((entry) => [entry.id, entry])) as Readonly<
    Record<string, (typeof ExecutiveReasoningCapabilityRegistry)[number] | undefined>
  >,
);

export const getReasoningCapabilityById = (
  id: string,
): (typeof ExecutiveReasoningCapabilityRegistry)[number] | undefined => capabilityIndex[id];
