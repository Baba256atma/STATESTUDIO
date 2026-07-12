import { ExecutiveTaskIntelligencePublicIndexId } from "./executiveTaskIntelligencePublicIndex.ts";
import { ExecutiveWorkflowIntelligencePublicIndexId } from "./executiveWorkflowIntelligencePublicIndex.ts";
import { ExecutiveProjectExecutionPublicIndexId } from "./executiveProjectExecutionPublicIndex.ts";
import type { ResourceLinkageDescriptor } from "./resourceModelTypes.ts";

const metadata = Object.freeze({
  platformId: "OPS-5:1",
  platformVersion: "1.0.0",
  compatibilityVersion: "1.0.0",
  sourceDependencies: Object.freeze([
    "OPS-2:9",
    "OPS-3:9",
    "OPS-4:9",
    "OPS-5:1",
    "OPS-5:2",
  ]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const ResourceLinkageModel = Object.freeze({
  id: "resource-linkage-model",
  name: "Resource Linkage Metadata",
  description:
    "Canonical metadata linking resources to project, workflow, and task execution layers.",
  linkedProjects: Object.freeze([
    "project-resource-planning",
    "project-readiness-support",
  ]),
  linkedWorkflows: Object.freeze([
    "workflow-resource-coordination",
    "workflow-capacity-support",
  ]),
  linkedTasks: Object.freeze([
    "task-resource-requirements",
    "task-execution-support",
  ]),
  executionReadinessSupport: Object.freeze([
    Object.freeze({
      id: "resource-readiness-task",
      category: "Task Support",
      description: "Resource metadata supports task-level execution readiness descriptors.",
      supportedExecutionLevels: Object.freeze([ExecutiveTaskIntelligencePublicIndexId]),
      readinessMetadata: Object.freeze([
        "owner-availability",
        "capacity-fit",
        "access-readiness",
      ]),
    }),
    Object.freeze({
      id: "resource-readiness-workflow-project",
      category: "Workflow and Project Support",
      description:
        "Resource metadata supports workflow and project readiness summaries.",
      supportedExecutionLevels: Object.freeze([
        ExecutiveWorkflowIntelligencePublicIndexId,
        ExecutiveProjectExecutionPublicIndexId,
      ]),
      readinessMetadata: Object.freeze([
        "dependency-coverage",
        "handoff-compatibility",
        "resource-governance-fit",
      ]),
    }),
  ]),
  metadata,
} as const satisfies ResourceLinkageDescriptor);
