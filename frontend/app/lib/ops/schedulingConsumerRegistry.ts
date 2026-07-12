import { SchedulingPlatformMetadata } from "./schedulingMetadata.ts";

export interface SchedulingConsumerRegistryEntry {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly accessMode: "PublicApi";
  readonly runtimeBinding: false;
}

export const SchedulingConsumerRegistry = Object.freeze([
  Object.freeze({
    id: "consumer-task-intelligence",
    name: "Task Intelligence",
    description: "Task platform consumers of scheduling intelligence metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
  Object.freeze({
    id: "consumer-workflow-intelligence",
    name: "Workflow Intelligence",
    description: "Workflow platform consumers of scheduling intelligence metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
  Object.freeze({
    id: "consumer-project-execution",
    name: "Project Execution",
    description: "Project execution platform consumers of scheduling intelligence metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
  Object.freeze({
    id: "consumer-resource-intelligence",
    name: "Resource Intelligence",
    description: "Resource platform consumers of scheduling intelligence metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
  Object.freeze({
    id: "consumer-monitoring-alerts",
    name: "Monitoring & Alerts",
    description: "Monitoring and alerting consumers of scheduling intelligence metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
  Object.freeze({
    id: "consumer-automation-platform",
    name: "Automation Platform",
    description: "Automation platform consumers of scheduling intelligence metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
  Object.freeze({
    id: "consumer-executive-operations-dashboard",
    name: "Executive Operations Dashboard",
    description: "Executive dashboard consumers of scheduling intelligence metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
  Object.freeze({
    id: "consumer-advisor",
    name: "Advisor",
    description: "Advisory consumers of scheduling intelligence metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
  Object.freeze({
    id: "consumer-bus",
    name: "BUS",
    description: "Business intelligence consumers of scheduling intelligence metadata.",
    accessMode: "PublicApi",
    runtimeBinding: false,
  }),
] as const satisfies readonly SchedulingConsumerRegistryEntry[]);

export const SchedulingConsumerRegistryMetadata = Object.freeze({
  registryId: "ops.scheduling-intelligence.consumer-registry",
  registryVersion: SchedulingPlatformMetadata.compatibilityVersion,
  consumerCount: SchedulingConsumerRegistry.length,
  metadataOnly: true,
  immutable: true,
} as const);
