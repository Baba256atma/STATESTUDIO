/** ASSISTANT-7:3 — Readonly metadata types for Executive Action Planning Model. */
export type AssistantExecutiveActionPlanningModelStatus = "Model";
export type AssistantExecutiveActionPlanningModelReadiness =
  "ReadyForValidation";

export interface AssistantExecutiveActionPlanningDomainModelMetadata {
  readonly identifier: string;
  readonly canonicalName: string;
  readonly description: string;
  readonly category: "Executive Action Planning Domain Model";
  readonly parentModel: string | null;
  readonly childModels: readonly string[];
  readonly relationshipReferences: readonly string[];
  readonly lifecycleReference: "ASSISTANT-7:3/Lifecycle";
  readonly registryReference: string;
  readonly version: "1.0.0";
  readonly status: "Canonical";
  readonly tags: readonly string[];
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveActionPlanningRelationshipMetadata {
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

export interface AssistantExecutiveActionPlanningLifecycleMetadata {
  readonly identifier: string;
  readonly name: string;
  readonly order: number;
  readonly transitionsAtRuntime: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveActionPlanningModelIdentityMetadata {
  readonly id: "ASSISTANT-7:3/ExecutiveActionPlanningModel";
  readonly name: "Assistant Executive Action Planning Model";
  readonly phaseId: "ASSISTANT-7:3";
  readonly namespace: "nexora.assistant.executive-action-planning.model";
  readonly version: "1.0.0";
  readonly layer: "Nexora Assistant";
  readonly status: AssistantExecutiveActionPlanningModelStatus;
  readonly readiness: AssistantExecutiveActionPlanningModelReadiness;
  readonly sourceRegistry: "ASSISTANT-7:2/ExecutiveActionPlanningRegistry";
  readonly metadataOnly: true;
  readonly immutable: true;
}
