import {
  ExecutiveOperationsPublicIndexId,
} from "./executiveOperationsPublicIndex.ts";
import {
  ExecutiveTaskIntelligencePublicIndexId,
} from "./executiveTaskIntelligencePublicIndex.ts";
import {
  WorkflowIntelligenceArchitecturalLevel,
  WorkflowIntelligenceIdentity,
  WorkflowIntelligencePlatformId,
  WorkflowIntelligencePlatformVersion,
} from "./workflowIntelligenceIndex.ts";

export interface WorkflowDomainDescriptor {
  readonly id: string;
  readonly name: string;
  readonly description: string;
}

export interface WorkflowPlatformMetadataDescriptor {
  readonly platformId: string;
  readonly platformName: string;
  readonly platformNamespace: string;
  readonly platformVersion: string;
  readonly workflowIntelligenceScope: string;
  readonly architecturalLevel: string;
  readonly supportedWorkflowDomains: readonly WorkflowDomainDescriptor[];
  readonly releaseStatus: string;
  readonly compatibilityVersion: string;
  readonly certificationState: string;
  readonly dependencySources: readonly [string, string];
  readonly metadataOnly: true;
  readonly immutable: true;
  readonly deterministic: true;
}

export const WorkflowSupportedDomains = Object.freeze([
  Object.freeze({
    id: "executive-workflows",
    name: "Executive Workflows",
    description: "Metadata domain for executive-level workflow definitions.",
  }),
  Object.freeze({
    id: "operational-workflows",
    name: "Operational Workflows",
    description: "Metadata domain for operational workflow definitions.",
  }),
  Object.freeze({
    id: "approval-workflows",
    name: "Approval Workflows",
    description: "Metadata domain for approval-oriented workflow definitions.",
  }),
  Object.freeze({
    id: "review-workflows",
    name: "Review Workflows",
    description: "Metadata domain for review-oriented workflow definitions.",
  }),
  Object.freeze({
    id: "escalation-workflows",
    name: "Escalation Workflows",
    description: "Metadata domain for escalation workflow definitions.",
  }),
  Object.freeze({
    id: "manual-workflows",
    name: "Manual Workflows",
    description: "Metadata domain for manual workflow definitions.",
  }),
  Object.freeze({
    id: "automated-workflows",
    name: "Automated Workflows",
    description: "Metadata domain for automated workflow definitions.",
  }),
  Object.freeze({
    id: "future-workflow-extensions",
    name: "Future Workflow Extensions",
    description: "Metadata domain for future workflow intelligence extensions.",
  }),
] as const);

export const WorkflowPlatformMetadata = Object.freeze({
  platformId: WorkflowIntelligencePlatformId,
  platformName: WorkflowIntelligenceIdentity.platformName,
  platformNamespace: WorkflowIntelligenceIdentity.platformNamespace,
  platformVersion: WorkflowIntelligencePlatformVersion,
  workflowIntelligenceScope: "Executive workflow intelligence architecture",
  architecturalLevel: WorkflowIntelligenceArchitecturalLevel,
  supportedWorkflowDomains: WorkflowSupportedDomains,
  releaseStatus: "Draft",
  compatibilityVersion: "1.0.0",
  certificationState: "Pending",
  dependencySources: Object.freeze([
    ExecutiveOperationsPublicIndexId,
    ExecutiveTaskIntelligencePublicIndexId,
  ]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies WorkflowPlatformMetadataDescriptor);
