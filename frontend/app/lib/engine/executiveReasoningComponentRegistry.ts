const component = (
  key: string,
  name: string,
  description: string,
  responsibility: string,
  supportedCapabilities: readonly string[],
  supportedStages: readonly string[],
  dependencies: readonly string[],
) => Object.freeze({
  id: `eng-6-component-${key}`,
  name,
  description,
  owner: "ENG-6",
  responsibility,
  supportedCapabilities: Object.freeze([...supportedCapabilities]),
  supportedStages: Object.freeze([...supportedStages]),
  dependencies: Object.freeze([...dependencies]),
  status: "Registered",
  version: "1.0.0",
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
  aiFree: true,
} as const);

export const ExecutiveReasoningComponentRegistry = Object.freeze([
  component(
    "evidence-collector",
    "EvidenceCollector",
    "Registry component describing evidence-collection architecture without collecting evidence.",
    "Describe evidence collection metadata boundaries for the reasoning pipeline.",
    Object.freeze(["eng-6-capability-collect-evidence"]),
    Object.freeze(["eng-6-lifecycle-input", "eng-6-lifecycle-evidence-collection"]),
    Object.freeze(["eng-6-foundation"]),
  ),
  component(
    "evidence-evaluator",
    "EvidenceEvaluator",
    "Registry component describing evidence-evaluation architecture without scoring evidence.",
    "Describe evidence evaluation metadata boundaries without runtime evaluation.",
    Object.freeze(["eng-6-capability-validate-evidence"]),
    Object.freeze(["eng-6-lifecycle-evidence-evaluation"]),
    Object.freeze(["eng-6-component-evidence-collector"]),
  ),
  component(
    "hypothesis-builder",
    "HypothesisBuilder",
    "Registry component describing hypothesis-building architecture without generating hypotheses.",
    "Describe hypothesis metadata construction vocabulary without hypothesis engines.",
    Object.freeze(["eng-6-capability-build-hypothesis"]),
    Object.freeze(["eng-6-lifecycle-hypothesis-generation"]),
    Object.freeze(["eng-6-component-evidence-evaluator"]),
  ),
  component(
    "inference-coordinator",
    "InferenceCoordinator",
    "Registry component describing inference coordination architecture without executing inference.",
    "Describe inference type coordination metadata without AI or algorithm execution.",
    Object.freeze(["eng-6-capability-execute-inference"]),
    Object.freeze(["eng-6-lifecycle-inference"]),
    Object.freeze(["eng-6-component-hypothesis-builder"]),
  ),
  component(
    "contradiction-resolver",
    "ContradictionResolver",
    "Registry component describing contradiction-resolution architecture without resolving contradictions.",
    "Describe contradiction metadata boundaries without contradiction runtime.",
    Object.freeze(["eng-6-capability-detect-contradictions"]),
    Object.freeze(["eng-6-lifecycle-contradiction-resolution"]),
    Object.freeze(["eng-6-component-inference-coordinator"]),
  ),
  component(
    "confidence-evaluator",
    "ConfidenceEvaluator",
    "Registry component describing confidence-evaluation architecture without calculating confidence.",
    "Describe confidence classification metadata without scoring.",
    Object.freeze(["eng-6-capability-evaluate-confidence"]),
    Object.freeze(["eng-6-lifecycle-confidence-evaluation"]),
    Object.freeze(["eng-6-component-contradiction-resolver"]),
  ),
  component(
    "explanation-composer",
    "ExplanationComposer",
    "Registry component describing explanation composition architecture without generating explanations.",
    "Describe executive explanation metadata without Advisor or narrative generation.",
    Object.freeze(["eng-6-capability-generate-explanation"]),
    Object.freeze(["eng-6-lifecycle-executive-explanation"]),
    Object.freeze(["eng-6-component-confidence-evaluator"]),
  ),
  component(
    "reasoning-summarizer",
    "ReasoningSummarizer",
    "Registry component describing reasoning-summary architecture without producing runtime summaries.",
    "Describe reasoning summary envelopes for decision-engine handoff metadata.",
    Object.freeze(["eng-6-capability-produce-reasoning-summary"]),
    Object.freeze(["eng-6-lifecycle-reasoning-result"]),
    Object.freeze(["eng-6-component-explanation-composer"]),
  ),
] as const);

const componentIndex = Object.freeze(
  Object.fromEntries(ExecutiveReasoningComponentRegistry.map((entry) => [entry.id, entry])) as Readonly<
    Record<string, (typeof ExecutiveReasoningComponentRegistry)[number] | undefined>
  >,
);

export const getReasoningComponentById = (
  id: string,
): (typeof ExecutiveReasoningComponentRegistry)[number] | undefined => componentIndex[id];
