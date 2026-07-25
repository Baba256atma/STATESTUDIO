/** ASSISTANT-9:1 — Foundation identity and shared metadata types. */

export interface AssistantActionMonitoringControlContractMetadata {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantActionMonitoringControlCapabilityMetadata {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly order: number;
  readonly implemented: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantActionMonitoringControlLifecycleMetadata {
  readonly id: string;
  readonly name: string;
  readonly order: number;
  readonly transitionsAtRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantActionMonitoringControlPolicyMetadata {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly order: number;
  readonly enforceableAtRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantActionMonitoringControlBoundaryMetadata {
  readonly id: string;
  readonly name: string;
  readonly prohibitedResponsibility: string;
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export const AssistantActionMonitoringControlFoundationIdentity =
  Object.freeze({
    id: "ASSISTANT-9:1/ExecutiveActionMonitoringControlFoundation",
    name: "Assistant Executive Action Monitoring & Control Foundation",
    phaseId: "ASSISTANT-9:1",
    namespace: "nexora.assistant.executive-action-monitoring-control.foundation",
    version: "1.0.0",
    status: "Foundation",
    stage: "ReadyForRegistry",
    readiness: "ReadyForRegistry",
    layer: "Assistant",
    domain: "Executive Action Monitoring & Control",
    canonical: true,
    mutable: false,
    sourceExecutiveActionExecution:
      "ASSISTANT-8:9/ExecutiveActionExecutionPublicIndex",
    metadataOnly: true,
    immutable: true,
  } as const);

export const AssistantActionMonitoringControlResponsibilities = Object.freeze([
  "Monitoring domain",
  "Control domain",
  "Observation contracts",
  "Monitoring lifecycle",
  "Monitoring capability metadata",
  "Monitoring policies",
  "Monitoring boundaries",
  "Foundation identities",
] as const);
