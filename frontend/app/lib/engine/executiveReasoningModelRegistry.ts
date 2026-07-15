import {
  ExecutiveConfidenceModel,
  ExecutiveContradictionModel,
  ExecutiveEvidenceModel,
  ExecutiveExplanationModel,
  ExecutiveHypothesisModel,
  ExecutiveInferenceModel,
  ExecutiveReasoningModel,
  ExecutiveReasoningModels,
  ExecutiveReasoningResultModel,
} from "./executiveReasoningModels.ts";

const registryEntry = (
  model: (typeof ExecutiveReasoningModels)[number],
  category: string,
  relationships: readonly string[],
) => Object.freeze({
  id: model.id,
  name: model.name,
  category,
  owner: "ENG-6",
  version: model.version,
  status: model.status,
  relationships: Object.freeze([...relationships]),
  lifecycleMapping: Object.freeze(
    "compatibleLifecycleStages" in model
      ? [...(model as { compatibleLifecycleStages: readonly string[] }).compatibleLifecycleStages]
      : [],
  ),
  dependencyMapping: Object.freeze([...relationships]),
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
  aiFree: true,
} as const);

export const ExecutiveReasoningModelRegistry = Object.freeze({
  id: "eng-6-model-registry",
  name: "Executive Reasoning Model Registry",
  owner: "ENG-6",
  version: "1.0.0",
  namespace: "nexora.engine.executive.reasoning.model",
  entries: Object.freeze([
    registryEntry(
      ExecutiveReasoningModel,
      "ReasoningProcess",
      Object.freeze([
        ExecutiveEvidenceModel.id,
        ExecutiveHypothesisModel.id,
        ExecutiveInferenceModel.id,
        ExecutiveConfidenceModel.id,
        ExecutiveExplanationModel.id,
      ]),
    ),
    registryEntry(
      ExecutiveEvidenceModel,
      "Evidence",
      Object.freeze([ExecutiveHypothesisModel.id]),
    ),
    registryEntry(
      ExecutiveHypothesisModel,
      "Hypothesis",
      Object.freeze([ExecutiveEvidenceModel.id, ExecutiveInferenceModel.id]),
    ),
    registryEntry(
      ExecutiveInferenceModel,
      "Inference",
      Object.freeze([ExecutiveHypothesisModel.id, ExecutiveContradictionModel.id]),
    ),
    registryEntry(
      ExecutiveContradictionModel,
      "Contradiction",
      Object.freeze([ExecutiveEvidenceModel.id, ExecutiveConfidenceModel.id]),
    ),
    registryEntry(
      ExecutiveConfidenceModel,
      "Confidence",
      Object.freeze([ExecutiveExplanationModel.id]),
    ),
    registryEntry(
      ExecutiveExplanationModel,
      "Explanation",
      Object.freeze([ExecutiveConfidenceModel.id, ExecutiveReasoningResultModel.id]),
    ),
    registryEntry(
      ExecutiveReasoningResultModel,
      "ReasoningResult",
      Object.freeze([
        ExecutiveReasoningModel.id,
        ExecutiveExplanationModel.id,
        ExecutiveConfidenceModel.id,
      ]),
    ),
  ]),
  modelCount: 8,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const);
