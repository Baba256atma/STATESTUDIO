import {
  ProjectExecutionPlatformName,
} from "./projectExecutionIndex.ts";
import { ProjectGovernanceModel } from "./projectGovernanceModel.ts";
import { ProjectPortfolioModel } from "./projectPortfolioModel.ts";
import { ProjectReadinessModel } from "./projectReadinessModel.ts";
import type {
  ProjectModelIdentity,
  ProjectModelMetadata,
} from "./projectModelTypes.ts";

const metadata = Object.freeze({
  platformId: "OPS-4:1",
  platformVersion: "1.0.0",
  compatibilityVersion: "1.0.0",
  sourceDependencies: Object.freeze([
    "OPS-1:9",
    "OPS-2:9",
    "OPS-3:9",
    "OPS-4:1",
    "OPS-4:2",
  ]),
  releaseStage: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies ProjectModelMetadata);

export const ProjectIdentityModel = Object.freeze({
  projectIdPattern: "project-{category}-{scope}",
  displayName: "Project Execution Canonical Model",
  description:
    "Canonical metadata identity model for project execution intelligence.",
  category: "ProjectExecution",
  sourcePlatform: ProjectExecutionPlatformName,
  workflowDependencyMetadata: Object.freeze([
    "Depends on OPS-3 public workflow metadata",
    "Workflow reference groups are metadata-only",
  ]),
  taskDependencyMetadata: Object.freeze([
    "Depends on OPS-2 public task metadata",
    "Task execution references are metadata-only",
  ]),
  projectClassification: Object.freeze([
    "Executive",
    "Operational",
    "Strategic",
    "Transformation",
    "Program",
    "Portfolio",
    "ContinuousImprovement",
  ]),
  governanceMetadata: Object.freeze([ProjectGovernanceModel]),
  readinessMetadata: ProjectReadinessModel,
  portfolioLinkageMetadata: ProjectPortfolioModel,
  metadata,
} as const satisfies ProjectModelIdentity);

