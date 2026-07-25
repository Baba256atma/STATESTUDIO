/** ASSISTANT-2:3 — Readonly metadata types for Executive Memory Model. */
export type AssistantExecutiveMemoryModelStatus = "Model";
export type AssistantExecutiveMemoryModelReadiness = "ReadyForValidation";

export interface AssistantExecutiveMemoryDomainModelMetadata {
  readonly identifier: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: "Executive Memory Domain Model";
  readonly parentModel: string | null;
  readonly childModels: readonly string[];
  readonly relationshipReferences: readonly string[];
  readonly lifecycleReference: "ASSISTANT-2:3/Lifecycle";
  readonly registryReference: string;
  readonly version: "1.0.0";
  readonly status: "Canonical";
  readonly tags: readonly string[];
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveMemoryRelationshipMetadata {
  readonly identifier: string;
  readonly source: string;
  readonly target: string;
  readonly relationshipType: string;
  readonly registryReference: string;
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveMemoryLifecycleMetadata {
  readonly identifier: string;
  readonly name: string;
  readonly order: number;
  readonly transitionsAtRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveMemoryModelIdentityMetadata {
  readonly id: "ASSISTANT-2:3/ExecutiveMemoryModel";
  readonly name: "Assistant Executive Memory Model";
  readonly phaseId: "ASSISTANT-2:3";
  readonly namespace: "nexora.assistant.executive-memory.model";
  readonly version: "1.0.0";
  readonly layer: "Nexora Assistant";
  readonly status: AssistantExecutiveMemoryModelStatus;
  readonly readiness: AssistantExecutiveMemoryModelReadiness;
  readonly sourceRegistry: "ASSISTANT-2:2/ExecutiveMemoryRegistry";
  readonly metadataOnly: true;
  readonly immutable: true;
}
