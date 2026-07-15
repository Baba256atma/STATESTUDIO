import {
  ExecutiveConfidenceLevels,
  ExecutiveEvidenceCategories,
  ExecutiveInferenceTypes,
  ExecutiveReasoningLifecycle,
} from "./executiveReasoningPipelineFoundation.ts";
import {
  ExecutiveReasoningCapabilityRegistry,
  ExecutiveReasoningComponentRegistry,
  ExecutiveReasoningLifecycleRegistry,
} from "./executiveReasoningRegistryIndex.ts";

const modelBase = (
  key: string,
  name: string,
  description: string,
  fields: readonly string[],
) => Object.freeze({
  id: `eng-6-model-${key}`,
  name,
  description,
  fields: Object.freeze([...fields]),
  owner: "ENG-6",
  version: "1.0.0",
  status: "Defined",
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
  aiFree: true,
  public: true,
} as const);

export const ExecutiveReasoningModel = Object.freeze({
  ...modelBase(
    "executive-reasoning",
    "ExecutiveReasoningModel",
    "Canonical model describing one complete reasoning process as metadata only.",
    Object.freeze([
      "id",
      "name",
      "description",
      "lifecycleStage",
      "evidenceReferences",
      "hypothesisReferences",
      "inferenceReferences",
      "confidenceReference",
      "explanationReference",
      "status",
      "version",
    ]),
  ),
  compatibleLifecycleStages: Object.freeze(ExecutiveReasoningLifecycle.map(({ id }) => id)),
  compatibleComponents: Object.freeze(ExecutiveReasoningComponentRegistry.map(({ id }) => id)),
  compatibleCapabilities: Object.freeze(ExecutiveReasoningCapabilityRegistry.map(({ id }) => id)),
} as const);

export const ExecutiveEvidenceModel = Object.freeze({
  ...modelBase(
    "executive-evidence",
    "ExecutiveEvidenceModel",
    "Canonical model describing one evidence definition as metadata only.",
    Object.freeze([
      "id",
      "category",
      "source",
      "description",
      "reliability",
      "ownership",
      "status",
    ]),
  ),
  compatibleCategories: Object.freeze(ExecutiveEvidenceCategories.map(({ id }) => id)),
} as const);

export const ExecutiveHypothesisModel = Object.freeze({
  ...modelBase(
    "executive-hypothesis",
    "ExecutiveHypothesisModel",
    "Canonical model describing one reasoning hypothesis as metadata only.",
    Object.freeze([
      "id",
      "type",
      "description",
      "supportingEvidence",
      "conflictingEvidence",
      "status",
    ]),
  ),
} as const);

export const ExecutiveInferenceModel = Object.freeze({
  ...modelBase(
    "executive-inference",
    "ExecutiveInferenceModel",
    "Canonical model describing one inference definition as metadata only.",
    Object.freeze([
      "id",
      "inferenceType",
      "description",
      "inputReferences",
      "outputReferences",
      "status",
    ]),
  ),
  compatibleInferenceTypes: Object.freeze(ExecutiveInferenceTypes.map(({ id }) => id)),
} as const);

export const ExecutiveContradictionModel = Object.freeze({
  ...modelBase(
    "executive-contradiction",
    "ExecutiveContradictionModel",
    "Canonical model describing a contradiction definition as metadata only.",
    Object.freeze([
      "id",
      "description",
      "relatedEvidence",
      "severity",
      "status",
    ]),
  ),
  severityVocabulary: Object.freeze(["Info", "Warning", "Error", "Critical"] as const),
} as const);

export const ExecutiveConfidenceModel = Object.freeze({
  ...modelBase(
    "executive-confidence",
    "ExecutiveConfidenceModel",
    "Canonical model describing confidence metadata without calculating confidence.",
    Object.freeze([
      "id",
      "confidenceLevel",
      "description",
      "evidenceCoverage",
      "status",
    ]),
  ),
  compatibleConfidenceLevels: Object.freeze(ExecutiveConfidenceLevels.map(({ id }) => id)),
} as const);

export const ExecutiveExplanationModel = Object.freeze({
  ...modelBase(
    "executive-explanation",
    "ExecutiveExplanationModel",
    "Canonical model describing executive explanation metadata without generating explanations.",
    Object.freeze([
      "id",
      "summary",
      "supportingReasoning",
      "confidenceReference",
      "status",
    ]),
  ),
} as const);

export const ExecutiveReasoningResultModel = Object.freeze({
  ...modelBase(
    "executive-reasoning-result",
    "ExecutiveReasoningResultModel",
    "Canonical model describing the final reasoning output envelope as metadata only.",
    Object.freeze([
      "id",
      "reasoningReference",
      "explanationReference",
      "confidenceReference",
      "completionState",
      "status",
    ]),
  ),
  completionStateVocabulary: Object.freeze([
    "Draft",
    "Prepared",
    "ReadyForDecision",
    "Archived",
  ] as const),
  compatibleLifecycleTerminal: Object.freeze(
    ExecutiveReasoningLifecycleRegistry.filter(({ name }) => name === "Reasoning Result").map(({ id }) => id),
  ),
} as const);

export const ExecutiveReasoningModels = Object.freeze([
  ExecutiveReasoningModel,
  ExecutiveEvidenceModel,
  ExecutiveHypothesisModel,
  ExecutiveInferenceModel,
  ExecutiveContradictionModel,
  ExecutiveConfidenceModel,
  ExecutiveExplanationModel,
  ExecutiveReasoningResultModel,
] as const);

export const getExecutiveReasoningModels = () => ExecutiveReasoningModels;
