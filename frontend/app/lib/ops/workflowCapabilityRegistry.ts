import { WorkflowPlatformMetadata } from "./workflowMetadata.ts";

export interface WorkflowCapabilityRegistryEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly domainId: string;
  readonly phaseId: string;
  readonly releaseState: "Draft";
  readonly runtimeBehavior: false;
  readonly metadataOnly: true;
}

export const WorkflowCapabilityRegistry = Object.freeze([
  Object.freeze({
    id: "cap-executive-workflows",
    name: "Executive Workflows",
    description: "Descriptive registry entry for executive workflow intelligence.",
    domainId: "executive-workflows",
    phaseId: "OPS-3:2",
    releaseState: "Draft",
    runtimeBehavior: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-operational-workflows",
    name: "Operational Workflows",
    description: "Descriptive registry entry for operational workflow intelligence.",
    domainId: "operational-workflows",
    phaseId: "OPS-3:2",
    releaseState: "Draft",
    runtimeBehavior: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-approval-workflows",
    name: "Approval Workflows",
    description: "Descriptive registry entry for approval workflow intelligence.",
    domainId: "approval-workflows",
    phaseId: "OPS-3:2",
    releaseState: "Draft",
    runtimeBehavior: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-review-workflows",
    name: "Review Workflows",
    description: "Descriptive registry entry for review workflow intelligence.",
    domainId: "review-workflows",
    phaseId: "OPS-3:2",
    releaseState: "Draft",
    runtimeBehavior: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-escalation-workflows",
    name: "Escalation Workflows",
    description: "Descriptive registry entry for escalation workflow intelligence.",
    domainId: "escalation-workflows",
    phaseId: "OPS-3:2",
    releaseState: "Draft",
    runtimeBehavior: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-manual-workflows",
    name: "Manual Workflows",
    description: "Descriptive registry entry for manual workflow intelligence.",
    domainId: "manual-workflows",
    phaseId: "OPS-3:2",
    releaseState: "Draft",
    runtimeBehavior: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-automated-workflows",
    name: "Automated Workflows",
    description: "Descriptive registry entry for automated workflow intelligence.",
    domainId: "automated-workflows",
    phaseId: "OPS-3:2",
    releaseState: "Draft",
    runtimeBehavior: false,
    metadataOnly: true,
  }),
  Object.freeze({
    id: "cap-future-workflow-extensions",
    name: "Future Workflow Extensions",
    description: "Descriptive registry entry for future workflow intelligence extensions.",
    domainId: "future-workflow-extensions",
    phaseId: "OPS-3:2",
    releaseState: "Draft",
    runtimeBehavior: false,
    metadataOnly: true,
  }),
] as const satisfies readonly WorkflowCapabilityRegistryEntry[]);

export const WorkflowCapabilityRegistryMetadata = Object.freeze({
  registryId: "ops.workflow-intelligence.capability-registry",
  registryVersion: WorkflowPlatformMetadata.compatibilityVersion,
  platformId: WorkflowPlatformMetadata.platformId,
  capabilityCount: WorkflowCapabilityRegistry.length,
  metadataOnly: true,
  immutable: true,
} as const);
