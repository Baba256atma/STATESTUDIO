import { WorkflowPlatformMetadata } from "./workflowMetadata.ts";

export interface WorkflowConsumerRegistryEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly accessMode: "PublicApi";
  readonly runtimeBinding: false;
}

export const WorkflowConsumerRegistry = Object.freeze([
  Object.freeze({
    id: "consumer-task-intelligence",
    name: "Task Intelligence",
    description: "Task intelligence consumers and collaborators of workflow metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
  Object.freeze({
    id: "consumer-project-execution",
    name: "Project Execution",
    description: "Project execution platform consumers of workflow intelligence metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
  Object.freeze({
    id: "consumer-scheduling-intelligence",
    name: "Scheduling Intelligence",
    description: "Scheduling intelligence consumers of workflow metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
  Object.freeze({
    id: "consumer-monitoring-alerts",
    name: "Monitoring & Alerts",
    description: "Monitoring and alert consumers of workflow intelligence metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
  Object.freeze({
    id: "consumer-automation-platform",
    name: "Automation Platform",
    description: "Automation platform consumers of workflow metadata boundaries.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
  Object.freeze({
    id: "consumer-executive-dashboard",
    name: "Executive Dashboard",
    description: "Executive dashboard consumers of workflow intelligence metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
  Object.freeze({
    id: "consumer-advisor",
    name: "Advisor",
    description: "Advisory consumers of workflow intelligence metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
  Object.freeze({
    id: "consumer-bus",
    name: "BUS",
    description: "Executive business intelligence consumers of workflow metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
] as const satisfies readonly WorkflowConsumerRegistryEntry[]);

export const WorkflowConsumerRegistryMetadata = Object.freeze({
  registryId: "ops.workflow-intelligence.consumer-registry",
  registryVersion: WorkflowPlatformMetadata.compatibilityVersion,
  consumerCount: WorkflowConsumerRegistry.length,
  metadataOnly: true,
  immutable: true,
} as const);
