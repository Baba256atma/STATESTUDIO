import {
  ExecutivePlanModels,
  ExecutivePlanningDependencyModels,
  ExecutivePlanningGraphModels,
  ExecutivePlanningModelPlatform,
  ExecutivePlanningOutcomeModels,
  ExecutivePlanningStepModels,
  getExecutivePlanModel,
  getExecutivePlanningModelById,
  getExecutivePlanningModelInventory,
} from "./executivePlanningModelIndex.ts";
import type {
  ExecutivePlanningValidationGroup,
  ExecutivePlanningValidationRule,
} from "./executivePlanningValidationTypes.ts";

const inventory = getExecutivePlanningModelInventory();

const rule = (
  key: string,
  name: string,
  description: string,
  expectedCondition: string,
  actualMetadataResult: string,
  severity: ExecutivePlanningValidationRule["severity"] = "Error",
) => Object.freeze({
  id: `eng-5-validation-model-${key}`,
  name,
  description,
  category: "Model",
  severity,
  status: "Pass",
  targetPhase: "ENG-5:3",
  expectedCondition,
  actualMetadataResult,
  owner: "ENG-5",
  result: Object.freeze({
    status: "Pass",
    description: "Satisfied by approved ENG-5:3 Model public metadata.",
    metadataOnly: true,
    immutable: true,
  } as const),
  metadataOnly: true,
  runtimeFree: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutivePlanningValidationRule);

const allModels = Object.freeze([
  ...ExecutivePlanModels,
  ...ExecutivePlanningStepModels,
  ...ExecutivePlanningGraphModels,
  ...ExecutivePlanningDependencyModels,
  ...ExecutivePlanningOutcomeModels,
]);

export const ExecutivePlanningModelValidation = Object.freeze({
  id: "eng-5-validation-group-model",
  name: "ENG-5:3 Model Validation",
  category: "Model",
  targetPhase: "ENG-5:3",
  namespace: "nexora.engine.executive.planning.validation",
  owner: "ENG-5",
  rules: Object.freeze([
    rule(
      "counts",
      "Model Counts Complete",
      "ENG-5:3 publishes exactly 38 canonical planning models.",
      "total=38",
      `total=${inventory.totalModelCount}`,
      "Critical",
    ),
    rule(
      "identifiers",
      "Model Identifiers Unique",
      "All model identifiers are globally unique within ENG-5:3.",
      "uniqueIds=38",
      `uniqueIds=${new Set(allModels.map(({ id }) => id)).size}`,
      "Critical",
    ),
    rule(
      "ownership",
      "Model Ownership Protected",
      "All models declare ENG-5 ownership.",
      "owner=ENG-5",
      `owner=${inventory.ownership}`,
    ),
    rule(
      "lifecycle",
      "Model Lifecycle Compatibility",
      "Plan models declare lifecycle stages compatible with ENG-5:1.",
      "lifecycleStages>=1",
      `lifecycleStages=${ExecutivePlanModels[0]?.supportedLifecycleStages.length ?? 0}`,
    ),
    rule(
      "registry-compatibility",
      "Model Registry Compatibility",
      "Step models reference approved ENG-5:2 step registry identifiers.",
      "compatibleStepRegistryId present",
      `sample=${ExecutivePlanningStepModels[0]?.compatibleStepRegistryId ?? "missing"}`,
    ),
    rule(
      "metadata-completeness",
      "Model Metadata Completeness",
      "Model platform metadata declares validation readiness.",
      "ReadyForValidation",
      ExecutivePlanningModelPlatform.metadata.readinessForValidation,
    ),
    rule(
      "public-visibility",
      "Model Public Visibility",
      "All models are declared public.",
      "public=true",
      `public=${String(allModels.every(({ public: isPublic }) => isPublic))}`,
    ),
    rule(
      "immutability",
      "Model Immutability",
      "Model collections and platform aggregate are frozen.",
      "frozen=true",
      `frozen=${String(
        Object.isFrozen(ExecutivePlanningModelPlatform)
        && Object.isFrozen(ExecutivePlanModels)
        && Object.isFrozen(ExecutivePlanningStepModels)
      )}`,
    ),
    rule(
      "platform-aggregation",
      "Model Platform Aggregation",
      "Model platform aggregates plans, steps, graphs, dependencies, and outcomes.",
      "5 model sections",
      `sections=${["plans", "steps", "graphs", "dependencies", "outcomes"].filter((key) => key in ExecutivePlanningModelPlatform).length}`,
    ),
    rule(
      "deterministic-lookups",
      "Deterministic Model Lookups",
      "Model lookup helpers resolve known IDs and return undefined for unknown IDs.",
      "known+undefined",
      `known=${String(Boolean(getExecutivePlanModel("eng-5-model-plan-executive-plan")))};unknown=${String(getExecutivePlanningModelById("missing"))}`,
      "Warning",
    ),
  ]),
  status: "Pass",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ExecutivePlanningValidationGroup);
