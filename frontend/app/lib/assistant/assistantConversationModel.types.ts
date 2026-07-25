/** ASSISTANT-1:3 — Readonly metadata types for Conversation Model. */
export type AssistantConversationModelStatus = "Model";
export type AssistantConversationModelReadiness = "ReadyForValidation";

export interface AssistantConversationDomainModelMetadata {
  readonly identifier: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: "Conversation Domain Model";
  readonly parentModel: string | null;
  readonly childModels: readonly string[];
  readonly relationshipReferences: readonly string[];
  readonly lifecycleReference: "ASSISTANT-1:3/Lifecycle";
  readonly registryReference: string;
  readonly version: "1.0.0";
  readonly status: "Canonical";
  readonly tags: readonly string[];
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantConversationRelationshipMetadata {
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

export interface AssistantConversationLifecycleMetadata {
  readonly identifier: string;
  readonly name: string;
  readonly order: number;
  readonly transitionsAtRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
