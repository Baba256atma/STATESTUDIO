const stage = (id: string, name: string, description: string, order: number) => Object.freeze({
  id,
  name,
  description,
  order,
  status: "Defined",
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
} as const);

export const ExecutiveReasoningLifecycle = Object.freeze([
  stage(
    "eng-6-lifecycle-input",
    "Input",
    "Reasoning pipeline receives planning-derived input references as metadata only.",
    1,
  ),
  stage(
    "eng-6-lifecycle-evidence-collection",
    "Evidence Collection",
    "Evidence collection stage described architecturally without collecting runtime data.",
    2,
  ),
  stage(
    "eng-6-lifecycle-evidence-evaluation",
    "Evidence Evaluation",
    "Evidence evaluation stage described architecturally without scoring evidence.",
    3,
  ),
  stage(
    "eng-6-lifecycle-hypothesis-generation",
    "Hypothesis Generation",
    "Hypothesis generation stage described architecturally without generating hypotheses.",
    4,
  ),
  stage(
    "eng-6-lifecycle-inference",
    "Inference",
    "Inference stage described architecturally without executing inference or AI models.",
    5,
  ),
  stage(
    "eng-6-lifecycle-contradiction-resolution",
    "Contradiction Resolution",
    "Contradiction resolution stage described architecturally without resolving contradictions at runtime.",
    6,
  ),
  stage(
    "eng-6-lifecycle-confidence-evaluation",
    "Confidence Evaluation",
    "Confidence evaluation stage described architecturally without calculating confidence.",
    7,
  ),
  stage(
    "eng-6-lifecycle-executive-explanation",
    "Executive Explanation",
    "Executive explanation stage described architecturally without generating explanations.",
    8,
  ),
  stage(
    "eng-6-lifecycle-reasoning-result",
    "Reasoning Result",
    "Reasoning result stage describing the terminal metadata envelope before decision-engine handoff.",
    9,
  ),
] as const);
