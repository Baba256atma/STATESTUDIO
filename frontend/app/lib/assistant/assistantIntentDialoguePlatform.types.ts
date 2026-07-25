/** ASSISTANT-3:6 — Readonly metadata types for Intent & Dialogue Platform. */
export interface AssistantIntentDialoguePlatformDeclaration {
  readonly id: string;
  readonly name: string;
  readonly state: "Published" | "Guaranteed" | "Compatible";
  readonly sourceManifest: "ASSISTANT-3:5/IntentDialogueUnderstandingManifest";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantIntentDialoguePlatformIdentityMetadata {
  readonly id: "ASSISTANT-3:6/IntentDialogueUnderstandingPlatform";
  readonly name: "Assistant Intent & Dialogue Understanding Platform";
  readonly phaseId: "ASSISTANT-3:6";
  readonly namespace: "nexora.assistant.intent-dialogue.platform";
  readonly version: "1.0.0";
  readonly status: "Platform";
  readonly readiness: "ReadyForCertification";
  readonly sourceManifest: "ASSISTANT-3:5/IntentDialogueUnderstandingManifest";
  readonly metadataOnly: true;
  readonly immutable: true;
}
