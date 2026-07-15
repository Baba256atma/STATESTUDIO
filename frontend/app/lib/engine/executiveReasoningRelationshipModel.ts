import {
  ExecutiveConfidenceModel,
  ExecutiveContradictionModel,
  ExecutiveEvidenceModel,
  ExecutiveExplanationModel,
  ExecutiveHypothesisModel,
  ExecutiveInferenceModel,
  ExecutiveReasoningResultModel,
} from "./executiveReasoningModels.ts";

const edge = (
  key: string,
  from: string,
  to: string,
  description: string,
) => Object.freeze({
  id: `eng-6-model-relationship-${key}`,
  from,
  to,
  description,
  relationshipType: "StructuralMetadata",
  executable: false,
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
} as const);

/**
 * Structural relationship metadata for ENG-6:3.
 * Describes model adjacency only — not an execution order.
 */
export const ExecutiveReasoningRelationshipModel = Object.freeze({
  id: "eng-6-model-relationship-graph",
  name: "Executive Reasoning Relationship Model",
  description:
    "Immutable structural relationship metadata linking evidence through reasoning result models without execution semantics.",
  owner: "ENG-6",
  version: "1.0.0",
  flow: Object.freeze([
    "Evidence",
    "Hypothesis",
    "Inference",
    "Contradiction Review",
    "Confidence",
    "Explanation",
    "Reasoning Result",
  ] as const),
  edges: Object.freeze([
    edge(
      "evidence-to-hypothesis",
      ExecutiveEvidenceModel.id,
      ExecutiveHypothesisModel.id,
      "Evidence metadata may structurally support or conflict with hypothesis metadata.",
    ),
    edge(
      "hypothesis-to-inference",
      ExecutiveHypothesisModel.id,
      ExecutiveInferenceModel.id,
      "Hypothesis metadata may structurally feed inference definitions.",
    ),
    edge(
      "inference-to-contradiction",
      ExecutiveInferenceModel.id,
      ExecutiveContradictionModel.id,
      "Inference metadata may structurally relate to contradiction review definitions.",
    ),
    edge(
      "contradiction-to-confidence",
      ExecutiveContradictionModel.id,
      ExecutiveConfidenceModel.id,
      "Contradiction review metadata may structurally inform confidence metadata.",
    ),
    edge(
      "confidence-to-explanation",
      ExecutiveConfidenceModel.id,
      ExecutiveExplanationModel.id,
      "Confidence metadata may structurally inform explanation metadata.",
    ),
    edge(
      "explanation-to-result",
      ExecutiveExplanationModel.id,
      ExecutiveReasoningResultModel.id,
      "Explanation metadata may structurally compose the reasoning result envelope.",
    ),
  ]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const);
