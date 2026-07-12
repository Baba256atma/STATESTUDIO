import type {
  ProjectCapability,
  ProjectMetadata,
  ProjectPublicApi,
} from "./projectExecutionTypes.ts";
import { ProjectExecutionIdentity } from "./projectExecutionIdentity.ts";

const projectMetadata = Object.freeze({
  platformId: ProjectExecutionIdentity.platformId,
  platformVersion: ProjectExecutionIdentity.platformVersion,
  releaseStage: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  sourceDependencies: Object.freeze(["OPS-1:9", "OPS-2:9", "OPS-3:9"]),
  tags: Object.freeze(["ops", "project-execution", "metadata-only"]),
} as const satisfies ProjectMetadata);

export const ExecutiveProjectContract = Object.freeze({
  id: "project-executive",
  name: "Executive Project",
  description: "Canonical metadata contract for executive-level project execution definitions.",
  category: "Executive",
  lifecycle: "Defined",
  phase: "Initiation",
  readiness: "ConceptReady",
  workflowReference: "workflow-executive",
  taskReference: "task-executive",
  metadata: projectMetadata,
} as const satisfies ProjectCapability);

export const OperationalProjectContract = Object.freeze({
  id: "project-operational",
  name: "Operational Project",
  description: "Canonical metadata contract for operational project execution definitions.",
  category: "Operational",
  lifecycle: "Structured",
  phase: "Planning",
  readiness: "TaskReady",
  workflowReference: "workflow-operational",
  taskReference: "task-operational",
  metadata: projectMetadata,
} as const satisfies ProjectCapability);

export const StrategicProjectContract = Object.freeze({
  id: "project-strategic",
  name: "Strategic Project",
  description: "Canonical metadata contract for strategic project execution definitions.",
  category: "Strategic",
  lifecycle: "Structured",
  phase: "Planning",
  readiness: "WorkflowReady",
  workflowReference: "workflow-review",
  taskReference: "task-strategic",
  metadata: projectMetadata,
} as const satisfies ProjectCapability);

export const TransformationProjectContract = Object.freeze({
  id: "project-transformation",
  name: "Transformation Project",
  description: "Canonical metadata contract for transformation project execution definitions.",
  category: "Transformation",
  lifecycle: "Sequenced",
  phase: "ExecutionDesign",
  readiness: "WorkflowReady",
  workflowReference: "workflow-escalation",
  taskReference: "task-review",
  metadata: projectMetadata,
} as const satisfies ProjectCapability);

export const ProgramProjectContract = Object.freeze({
  id: "project-program",
  name: "Program Project",
  description: "Canonical metadata contract for program-scale project execution definitions.",
  category: "Program",
  lifecycle: "Sequenced",
  phase: "ExecutionDesign",
  readiness: "GovernanceReady",
  workflowReference: "workflow-approval",
  taskReference: "task-approval",
  metadata: projectMetadata,
} as const satisfies ProjectCapability);

export const PortfolioProjectContract = Object.freeze({
  id: "project-portfolio",
  name: "Portfolio Project",
  description: "Canonical metadata contract for portfolio-level project execution definitions.",
  category: "Portfolio",
  lifecycle: "Ready",
  phase: "Readiness",
  readiness: "GovernanceReady",
  workflowReference: "workflow-executive",
  taskReference: "task-executive",
  metadata: projectMetadata,
} as const satisfies ProjectCapability);

export const ContinuousImprovementProjectContract = Object.freeze({
  id: "project-continuous-improvement",
  name: "Continuous Improvement Project",
  description: "Canonical metadata contract for continuous improvement project execution definitions.",
  category: "ContinuousImprovement",
  lifecycle: "Cataloged",
  phase: "ClosureDefinition",
  readiness: "TaskReady",
  workflowReference: "workflow-manual",
  taskReference: "task-manual",
  metadata: projectMetadata,
} as const satisfies ProjectCapability);

export const ProjectExecutionContracts = Object.freeze({
  executive: ExecutiveProjectContract,
  operational: OperationalProjectContract,
  strategic: StrategicProjectContract,
  transformation: TransformationProjectContract,
  program: ProgramProjectContract,
  portfolio: PortfolioProjectContract,
  continuousImprovement: ContinuousImprovementProjectContract,
  all: Object.freeze([
    ExecutiveProjectContract,
    OperationalProjectContract,
    StrategicProjectContract,
    TransformationProjectContract,
    ProgramProjectContract,
    PortfolioProjectContract,
    ContinuousImprovementProjectContract,
  ]),
} as const);

export const ProjectExecutionPublicApis = Object.freeze([
  Object.freeze({
    name: "ExecutiveProjectExecutionFoundation",
    exportPath: "./projectExecutionIndex.ts",
    kind: "Object",
    stability: "Stable",
    description: "Immutable namespace for project execution foundation.",
  } as const satisfies ProjectPublicApi),
  Object.freeze({
    name: "buildProjectExecutionManifest",
    exportPath: "./projectExecutionIndex.ts",
    kind: "Function",
    stability: "Stable",
    description: "Deterministic manifest builder for project execution metadata.",
  } as const satisfies ProjectPublicApi),
  Object.freeze({
    name: "validateProjectExecutionFoundation",
    exportPath: "./projectExecutionIndex.ts",
    kind: "Function",
    stability: "Stable",
    description: "Architectural integrity validator for project execution metadata.",
  } as const satisfies ProjectPublicApi),
] as const);

