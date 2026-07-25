/** ASSISTANT-6:3 — Readonly metadata types for Object & Context Management Model. */
export type AssistantObjectContextManagementModelStatus = "Model";
export type AssistantObjectContextManagementModelReadiness =
  "ReadyForValidation";

export interface AssistantObjectContextManagementDomainModelMetadata {
  readonly identifier: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: "Object & Context Management Domain Model";
  readonly parentModel: string | null;
  readonly childModels: readonly string[];
  readonly relationshipReferences: readonly string[];
  readonly lifecycleReference: "ASSISTANT-6:3/Lifecycle";
  readonly registryReference: string;
  readonly version: "1.0.0";
  readonly status: "Canonical";
  readonly tags: readonly string[];
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantObjectContextManagementRelationshipMetadata {
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

export interface AssistantObjectContextManagementLifecycleMetadata {
  readonly identifier: string;
  readonly name: string;
  readonly order: number;
  readonly transitionsAtRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantObjectContextManagementModelIdentityMetadata {
  readonly id: "ASSISTANT-6:3/ObjectContextManagementModel";
  readonly name: "Assistant Object & Context Management Model";
  readonly phaseId: "ASSISTANT-6:3";
  readonly namespace: "nexora.assistant.object-context-management.model";
  readonly version: "1.0.0";
  readonly layer: "Nexora Assistant";
  readonly status: AssistantObjectContextManagementModelStatus;
  readonly readiness: AssistantObjectContextManagementModelReadiness;
  readonly sourceRegistry: "ASSISTANT-6:2/ObjectContextManagementRegistry";
  readonly metadataOnly: true;
  readonly immutable: true;
}
