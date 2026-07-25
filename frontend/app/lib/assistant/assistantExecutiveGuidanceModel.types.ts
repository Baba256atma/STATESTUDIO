/** ASSISTANT-4:3 — Readonly metadata types for Executive Guidance Model. */
export type AssistantExecutiveGuidanceModelStatus = "Model";
export type AssistantExecutiveGuidanceModelReadiness = "ReadyForValidation";

export interface AssistantExecutiveGuidanceDomainModelMetadata {
  readonly identifier: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: "Executive Guidance Domain Model";
  readonly parentModel: string | null;
  readonly childModels: readonly string[];
  readonly relationshipReferences: readonly string[];
  readonly lifecycleReference: "ASSISTANT-4:3/Lifecycle";
  readonly registryReference: string;
  readonly version: "1.0.0";
  readonly status: "Canonical";
  readonly tags: readonly string[];
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveGuidanceRelationshipMetadata {
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

export interface AssistantExecutiveGuidanceLifecycleMetadata {
  readonly identifier: string;
  readonly name: string;
  readonly order: number;
  readonly transitionsAtRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveGuidanceModelIdentityMetadata {
  readonly id: "ASSISTANT-4:3/ExecutiveGuidanceModel";
  readonly name: "Assistant Executive Guidance Model";
  readonly phaseId: "ASSISTANT-4:3";
  readonly namespace: "nexora.assistant.executive-guidance.model";
  readonly version: "1.0.0";
  readonly layer: "Nexora Assistant";
  readonly status: AssistantExecutiveGuidanceModelStatus;
  readonly readiness: AssistantExecutiveGuidanceModelReadiness;
  readonly sourceRegistry: "ASSISTANT-4:2/ExecutiveGuidanceRegistry";
  readonly metadataOnly: true;
  readonly immutable: true;
}
