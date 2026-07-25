/** ASSISTANT-7:2 — Readonly metadata types for Executive Action Planning Registry. */
export type AssistantExecutiveActionPlanningRegistryStatus = "Registry";
export type AssistantExecutiveActionPlanningRegistryReadiness = "ReadyForModel";

export interface AssistantExecutiveActionPlanningRegistryEntry {
  readonly identifier: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly version: "1.0.0";
  readonly lifecycle: "Active";
  readonly status: "Registered";
  readonly tags: readonly string[];
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveActionPlanningRegistryIdentityMetadata {
  readonly id: "ASSISTANT-7:2/ExecutiveActionPlanningRegistry";
  readonly name: "Assistant Executive Action Planning Registry";
  readonly phaseId: "ASSISTANT-7:2";
  readonly namespace: "nexora.assistant.executive-action-planning.registry";
  readonly version: "1.0.0";
  readonly layer: "Nexora Assistant";
  readonly status: AssistantExecutiveActionPlanningRegistryStatus;
  readonly readiness: AssistantExecutiveActionPlanningRegistryReadiness;
  readonly sourceFoundation:
    "ASSISTANT-7:1/ExecutiveActionPlanningFoundation";
  readonly metadataOnly: true;
  readonly immutable: true;
}
