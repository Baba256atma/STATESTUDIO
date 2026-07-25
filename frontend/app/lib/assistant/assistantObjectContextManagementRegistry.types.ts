/** ASSISTANT-6:2 — Readonly metadata types for Object & Context Management Registry. */
export type AssistantObjectContextManagementRegistryStatus = "Registry";
export type AssistantObjectContextManagementRegistryReadiness = "ReadyForModel";

export interface AssistantObjectContextManagementRegistryEntry {
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

export interface AssistantObjectContextManagementRegistryIdentityMetadata {
  readonly id: "ASSISTANT-6:2/ObjectContextManagementRegistry";
  readonly name: "Assistant Object & Context Management Registry";
  readonly phaseId: "ASSISTANT-6:2";
  readonly namespace: "nexora.assistant.object-context-management.registry";
  readonly version: "1.0.0";
  readonly layer: "Nexora Assistant";
  readonly status: AssistantObjectContextManagementRegistryStatus;
  readonly readiness: AssistantObjectContextManagementRegistryReadiness;
  readonly sourceFoundation:
    "ASSISTANT-6:1/ObjectContextManagementFoundation";
  readonly metadataOnly: true;
  readonly immutable: true;
}
