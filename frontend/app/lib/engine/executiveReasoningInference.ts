const inference = (id: string, name: string, description: string) => Object.freeze({
  id,
  name,
  description,
  status: "Defined",
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
  aiFree: true,
} as const);

export const ExecutiveInferenceTypes = Object.freeze([
  inference(
    "eng-6-inference-deductive",
    "Deductive",
    "Inference type describing deductive reasoning vocabulary without performing deduction.",
  ),
  inference(
    "eng-6-inference-inductive",
    "Inductive",
    "Inference type describing inductive reasoning vocabulary without performing induction.",
  ),
  inference(
    "eng-6-inference-abductive",
    "Abductive",
    "Inference type describing abductive reasoning vocabulary without performing abduction.",
  ),
  inference(
    "eng-6-inference-comparative",
    "Comparative",
    "Inference type describing comparative inference vocabulary without performing comparisons.",
  ),
  inference(
    "eng-6-inference-causal",
    "Causal",
    "Inference type describing causal inference vocabulary without causal analysis engines.",
  ),
  inference(
    "eng-6-inference-temporal",
    "Temporal",
    "Inference type describing temporal inference vocabulary without temporal processing.",
  ),
  inference(
    "eng-6-inference-statistical",
    "Statistical",
    "Inference type describing statistical inference vocabulary without statistical computation.",
  ),
  inference(
    "eng-6-inference-rule-based",
    "Rule-Based",
    "Inference type describing rule-based inference vocabulary without rule engines.",
  ),
] as const);

const confidence = (id: string, name: string, description: string, order: number) => Object.freeze({
  id,
  name,
  description,
  order,
  status: "Defined",
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
} as const);

export const ExecutiveConfidenceLevels = Object.freeze([
  confidence(
    "eng-6-confidence-unknown",
    "Unknown",
    "Confidence classification for unspecified confidence metadata without scoring.",
    1,
  ),
  confidence(
    "eng-6-confidence-very-low",
    "Very Low",
    "Confidence classification for very-low confidence metadata without scoring.",
    2,
  ),
  confidence(
    "eng-6-confidence-low",
    "Low",
    "Confidence classification for low confidence metadata without scoring.",
    3,
  ),
  confidence(
    "eng-6-confidence-medium",
    "Medium",
    "Confidence classification for medium confidence metadata without scoring.",
    4,
  ),
  confidence(
    "eng-6-confidence-high",
    "High",
    "Confidence classification for high confidence metadata without scoring.",
    5,
  ),
  confidence(
    "eng-6-confidence-very-high",
    "Very High",
    "Confidence classification for very-high confidence metadata without scoring.",
    6,
  ),
  confidence(
    "eng-6-confidence-certain",
    "Certain",
    "Confidence classification for certain confidence metadata without scoring.",
    7,
  ),
] as const);
