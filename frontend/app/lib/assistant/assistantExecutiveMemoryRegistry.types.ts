/** ASSISTANT-2:2 — Readonly metadata types for Executive Memory Registry. */
export type AssistantExecutiveMemoryRegistryStatus = "Registry";
export type AssistantExecutiveMemoryRegistryReadiness = "ReadyForModel";

export interface AssistantExecutiveMemoryRegistryEntry {
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

export interface AssistantExecutiveMemoryRegistryIdentityMetadata {
  readonly id: "ASSISTANT-2:2/ExecutiveMemoryRegistry";
  readonly name: "Assistant Executive Memory Registry";
  readonly phaseId: "ASSISTANT-2:2";
  readonly namespace: "nexora.assistant.executive-memory.registry";
  readonly version: "1.0.0";
  readonly layer: "Nexora Assistant";
  readonly status: AssistantExecutiveMemoryRegistryStatus;
  readonly readiness: AssistantExecutiveMemoryRegistryReadiness;
  readonly sourceFoundation: "ASSISTANT-2:1/ExecutiveMemoryFoundation";
  readonly metadataOnly: true;
  readonly immutable: true;
}
