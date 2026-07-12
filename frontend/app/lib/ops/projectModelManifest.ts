import { ExecutiveProjectExecutionFoundation } from "./projectExecutionIndex.ts";
import { ProjectPlatformMetadata } from "./projectMetadataIndex.ts";
import { ProjectDependencyModel } from "./projectDependencyModel.ts";
import { ProjectGovernanceModel } from "./projectGovernanceModel.ts";
import { ProjectIdentityModel } from "./projectIdentityModel.ts";
import { ProjectLifecycleModel } from "./projectLifecycleModel.ts";
import { ProjectMilestoneModel } from "./projectMilestoneModel.ts";
import { ProjectPhaseModel } from "./projectPhaseModel.ts";
import { ProjectPortfolioModel } from "./projectPortfolioModel.ts";
import { ProjectReadinessModel } from "./projectReadinessModel.ts";
import { ProjectTaskReferenceModel } from "./projectTaskReferenceModel.ts";
import { ProjectWorkflowReferenceModel } from "./projectWorkflowReferenceModel.ts";

export const buildProjectModelManifest = () =>
  Object.freeze({
    foundation: ExecutiveProjectExecutionFoundation,
    metadata: ProjectPlatformMetadata,
    models: Object.freeze({
      identity: ProjectIdentityModel,
      lifecycle: ProjectLifecycleModel,
      phase: ProjectPhaseModel,
      milestone: ProjectMilestoneModel,
      dependency: ProjectDependencyModel,
      workflowReference: ProjectWorkflowReferenceModel,
      taskReference: ProjectTaskReferenceModel,
      governance: ProjectGovernanceModel,
      readiness: ProjectReadinessModel,
      portfolio: ProjectPortfolioModel,
    }),
    compatibility: Object.freeze({
      compatibilityVersion: ProjectPlatformMetadata.compatibilityVersion,
      supportedDomainCount: ProjectPlatformMetadata.supportedProjectDomains.length,
      phaseCount: ProjectPhaseModel.length,
      milestoneCount: ProjectMilestoneModel.length,
      workflowCompatibilityMetadataCount:
        ProjectWorkflowReferenceModel.workflowCompatibilityMetadata.length,
      taskCompatibilityMetadataCount:
        ProjectTaskReferenceModel.taskCompatibility.length,
      metadataOnly: true,
      immutable: true,
    }),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);

