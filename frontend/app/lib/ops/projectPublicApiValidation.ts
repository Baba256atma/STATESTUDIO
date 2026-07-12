import { ProjectPublicApiRegistry } from "./projectMetadataIndex.ts";
import {
  ProjectDependencyModel,
  ProjectGovernanceModel,
  ProjectIdentityModel,
  ProjectLifecycleModel,
  ProjectMilestoneModel,
  ProjectPhaseModel,
  ProjectPortfolioModel,
  ProjectReadinessModel,
  ProjectTaskReferenceModel,
  ProjectWorkflowReferenceModel,
} from "./projectModelIndex.ts";
import {
  ProjectExecutionPublicApis,
  ProjectExecutionIdentity,
} from "./projectExecutionIndex.ts";
import type { ProjectValidationEntry } from "./projectValidationTypes.ts";

const objectModels = Object.freeze([
  ProjectIdentityModel,
  ProjectLifecycleModel,
  ProjectDependencyModel,
  ProjectWorkflowReferenceModel,
  ProjectTaskReferenceModel,
  ProjectGovernanceModel,
]);

const arrayModels = Object.freeze([
  ProjectPhaseModel,
  ProjectMilestoneModel,
  ProjectReadinessModel,
  ProjectPortfolioModel,
]);

export const ProjectPublicApiValidation = Object.freeze([
  Object.freeze({
    id: "project-public-api-stability",
    name: "Public API Stability",
    description: "Validates stable public API exposure across OPS-4 phases.",
    category: "PublicApi",
    status:
      ProjectExecutionPublicApis.length === 3 && ProjectPublicApiRegistry.length >= 9
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ProjectValidationEntry),
  Object.freeze({
    id: "project-public-api-consumer-only",
    name: "Public API Consumer Only",
    description: "Validates public API remains consumer-facing and metadata-only.",
    category: "PublicApi",
    status:
      objectModels.every((model) => model.metadata.metadataOnly) &&
      arrayModels.every(
        (model) => Object.isFrozen(model) && model.every((entry) => entry.metadata.metadataOnly),
      ) &&
      ProjectExecutionIdentity.metadataOnly
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ProjectValidationEntry),
  Object.freeze({
    id: "project-public-api-immutability",
    name: "Public API Immutability",
    description: "Validates immutable public API registry and exported models.",
    category: "Immutability",
    status:
      Object.isFrozen(ProjectPublicApiRegistry) &&
      Object.isFrozen(ProjectIdentityModel) &&
      Object.isFrozen(ProjectLifecycleModel) &&
      Object.isFrozen(ProjectPhaseModel) &&
      Object.isFrozen(ProjectMilestoneModel) &&
      Object.isFrozen(ProjectDependencyModel) &&
      Object.isFrozen(ProjectWorkflowReferenceModel) &&
      Object.isFrozen(ProjectTaskReferenceModel) &&
      Object.isFrozen(ProjectGovernanceModel) &&
      Object.isFrozen(ProjectReadinessModel) &&
      Object.isFrozen(ProjectPortfolioModel)
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies ProjectValidationEntry),
] as const);

