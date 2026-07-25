/** ASSISTANT-3:8 — Readonly metadata types for Intent & Dialogue Freeze. */
export interface AssistantIntentDialogueFreezeBaselineMetadata {
  readonly baselineId: string;
  readonly name: string;
  readonly description: string;
  readonly sourcePhase: string;
  readonly status: "Frozen";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantIntentDialogueFreezeCompatibilityMetadata {
  readonly id: string;
  readonly name: string;
  readonly state: "Compatible";
  readonly sourceCertification:
    "ASSISTANT-3:7/IntentDialogueUnderstandingCertification";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantIntentDialogueFreezeArchitecturalLockMetadata {
  readonly lockId: string;
  readonly name: string;
  readonly description: string;
  readonly protectedTarget: string;
  readonly lockStatus: "Locked";
  readonly version: "1.0.0";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantIntentDialogueFreezeRegistryEntryMetadata {
  readonly entryId: string;
  readonly name: string;
  readonly canonicalIdentity: string;
  readonly status: "Frozen";
  readonly order: number;
  readonly descriptiveOnly: true;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantIntentDialogueFreezeIdentityMetadata {
  readonly id: "ASSISTANT-3:8/IntentDialogueUnderstandingFreeze";
  readonly name: "Assistant Intent & Dialogue Understanding Freeze";
  readonly phaseId: "ASSISTANT-3:8";
  readonly namespace: "nexora.assistant.intent-dialogue.freeze";
  readonly version: "1.0.0";
  readonly status: "Frozen";
  readonly readiness: "ReadyForPublicIndex";
  readonly sourceCertification:
    "ASSISTANT-3:7/IntentDialogueUnderstandingCertification";
  readonly lockIdentifier: "ASSISTANT-3-INTENT-DIALOGUE-UNDERSTANDING-LOCKED";
  readonly metadataOnly: true;
  readonly immutable: true;
}
