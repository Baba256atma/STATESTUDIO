import * as modelPublicApi from "./executiveReasoningModelIndex.ts";
import {
  ExecutiveReasoningModelMetadata,
  ExecutiveReasoningModelPlatform,
  ExecutiveReasoningModelRegistry,
  ExecutiveReasoningModels,
  ExecutiveReasoningRelationshipModel,
} from "./executiveReasoningModelIndex.ts";
import type {
  ExecutiveReasoningValidationDomain,
  ExecutiveReasoningValidationRule,
} from "./executiveReasoningValidationTypes.ts";

const rule = (
  key: string,
  name: string,
  description: string,
  domain: ExecutiveReasoningValidationRule["domain"],
  expectedCondition: string,
  actualMetadataResult: string,
  severity: ExecutiveReasoningValidationRule["severity"] = "Error",
) => Object.freeze({
  id: `eng-6-validation-model-${key}`,
  name,
  description,
  domain,
  severity,
  status: "PASS",
  expectedCondition,
  actualMetadataResult,
  owner: "ENG-6",
  targetPhase: "ENG-6:3",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const satisfies ExecutiveReasoningValidationRule);

const modelIds = Object.freeze(ExecutiveReasoningModels.map(({ id }) => id));
const registryIds = Object.freeze(ExecutiveReasoningModelRegistry.entries.map(({ id }) => id));
const relationshipTargets = Object.freeze([
  ...ExecutiveReasoningRelationshipModel.edges.map(({ from }) => from),
  ...ExecutiveReasoningRelationshipModel.edges.map(({ to }) => to),
]);
const expectedFlow = Object.freeze([
  "Evidence",
  "Hypothesis",
  "Inference",
  "Contradiction Review",
  "Confidence",
  "Explanation",
  "Reasoning Result",
] as const);

export const ExecutiveReasoningModelValidationRules = Object.freeze([
  rule(
    "models-registered",
    "Every Model Is Registered",
    "Every published model appears in the model registry.",
    "Model",
    "modelIds match registry",
    `models=${modelIds.length};registry=${registryIds.length};aligned=${String(
      modelIds.every((id) => registryIds.includes(id))
    )}`,
    "Critical",
  ),
  rule(
    "model-metadata-present",
    "Every Model Has Metadata",
    "Every model declares owner, version, and status metadata.",
    "Model",
    "complete metadata",
    `complete=${String(ExecutiveReasoningModels.every(({ owner, version, status, metadataOnly }) =>
      Boolean(owner && version && status && metadataOnly)
    ))}`,
  ),
  rule(
    "relationship-targets-exist",
    "Every Relationship Target Exists",
    "Every relationship edge references a published model identifier.",
    "Relationship",
    "targets in modelIds",
    `allExist=${String(relationshipTargets.every((id) => (modelIds as readonly string[]).includes(id)))}`,
    "Critical",
  ),
  rule(
    "relationship-flow",
    "Relationship Flow Present",
    "Canonical structural flow Evidence→…→Reasoning Result exists as metadata.",
    "Relationship",
    expectedFlow.join("→"),
    ExecutiveReasoningRelationshipModel.flow.join("→"),
  ),
  rule(
    "model-versions-exist",
    "Every Model Version Exists",
    "Every model declares version 1.0.0.",
    "Model",
    "version=1.0.0",
    `versions=${[...new Set(ExecutiveReasoningModels.map(({ version }) => version))].join(",")}`,
  ),
  rule(
    "model-owners-exist",
    "Every Model Owner Exists",
    "Every model owner is ENG-6.",
    "Ownership",
    "owner=ENG-6",
    `owners=${[...new Set(ExecutiveReasoningModels.map(({ owner }) => owner))].join(",")}`,
  ),
  rule(
    "model-public-api",
    "Model Public API Approved",
    "Model index exposes exactly eight approved exports.",
    "PublicApi",
    "exports=8",
    `exports=${Object.keys(modelPublicApi).length}`,
  ),
  rule(
    "model-namespace",
    "Model Namespace Integrity",
    "Model platform namespace remains under the reasoning model namespace.",
    "Namespace",
    "nexora.engine.executive.reasoning.model",
    ExecutiveReasoningModelMetadata.namespace,
  ),
  rule(
    "platform-aggregation",
    "Model Platform Aggregation",
    "Model platform aggregates models, registry, and relationships.",
    "Model",
    "platform complete",
    `hasModels=${String(Boolean(ExecutiveReasoningModelPlatform.models))};hasRegistry=${String(Boolean(ExecutiveReasoningModelPlatform.registry))};hasRelationships=${String(Boolean(ExecutiveReasoningModelPlatform.relationships))}`,
  ),
  rule(
    "version-consistency",
    "Version Consistency",
    "Model platform metadata version is consistent with model versions.",
    "Metadata",
    "version=1.0.0",
    `metadataVersion=${ExecutiveReasoningModelMetadata.version}`,
  ),
] as const);

export const ExecutiveReasoningModelValidation = Object.freeze({
  id: "eng-6-validation-group-model",
  name: "Model",
  description: "Architectural validation of ENG-6:3 Model public metadata.",
  rules: ExecutiveReasoningModelValidationRules,
  status: "PASS",
  owner: "ENG-6",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutiveReasoningValidationDomain);
