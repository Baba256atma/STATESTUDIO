/** ASSISTANT-4:1 — Readonly metadata types for Executive Guidance Foundation. */
export type AssistantExecutiveGuidanceFoundationStatus = "Foundation";
export type AssistantExecutiveGuidanceFoundationReadiness = "ReadyForRegistry";

export interface AssistantExecutiveGuidanceIdentityMetadata {
  readonly id: "ASSISTANT-4:1/ExecutiveGuidanceFoundation";
  readonly name: "Assistant Executive Guidance Foundation";
  readonly phaseId: "ASSISTANT-4:1";
  readonly namespace: "nexora.assistant.executive-guidance.foundation";
  readonly version: "1.0.0";
  readonly layer: "Nexora Assistant";
  readonly status: AssistantExecutiveGuidanceFoundationStatus;
  readonly readiness: AssistantExecutiveGuidanceFoundationReadiness;
  readonly sourceIntentDialogue:
    "ASSISTANT-3:9/IntentDialogueUnderstandingPublicIndex";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveGuidanceContractMetadata {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveGuidanceCapabilityMetadata {
  readonly id: string;
  readonly name: string;
  readonly order: number;
  readonly implemented: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveGuidanceCategoryMetadata {
  readonly id: string;
  readonly name: string;
  readonly order: number;
  readonly conceptualOnly: true;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveGuidanceConceptMetadata {
  readonly id: string;
  readonly name: string;
  readonly order: number;
  readonly descriptiveOnly: true;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveGuidanceBoundaryMetadata {
  readonly id: string;
  readonly name: string;
  readonly order: number;
  readonly permitted: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
