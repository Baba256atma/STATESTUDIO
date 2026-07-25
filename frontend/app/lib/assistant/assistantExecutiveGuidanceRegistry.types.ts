/** ASSISTANT-4:2 — Readonly metadata types for Executive Guidance Registry. */
export type AssistantExecutiveGuidanceRegistryStatus = "Registry";
export type AssistantExecutiveGuidanceRegistryReadiness = "ReadyForModel";

export interface AssistantExecutiveGuidanceRegistryEntry {
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

export interface AssistantExecutiveGuidanceRegistryIdentityMetadata {
  readonly id: "ASSISTANT-4:2/ExecutiveGuidanceRegistry";
  readonly name: "Assistant Executive Guidance Registry";
  readonly phaseId: "ASSISTANT-4:2";
  readonly namespace: "nexora.assistant.executive-guidance.registry";
  readonly version: "1.0.0";
  readonly layer: "Nexora Assistant";
  readonly status: AssistantExecutiveGuidanceRegistryStatus;
  readonly readiness: AssistantExecutiveGuidanceRegistryReadiness;
  readonly sourceFoundation: "ASSISTANT-4:1/ExecutiveGuidanceFoundation";
  readonly metadataOnly: true;
  readonly immutable: true;
}
