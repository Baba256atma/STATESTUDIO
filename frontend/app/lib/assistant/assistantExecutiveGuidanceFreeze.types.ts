/** ASSISTANT-4:8 — Readonly metadata types for Executive Guidance Freeze. */
export interface AssistantExecutiveGuidanceFreezeBaselineMetadata {
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

export interface AssistantExecutiveGuidanceFreezeCompatibilityMetadata {
  readonly id: string;
  readonly name: string;
  readonly state: "Compatible";
  readonly sourceCertification: "ASSISTANT-4:7/ExecutiveGuidanceCertification";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveGuidanceFreezeArchitecturalLockMetadata {
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

export interface AssistantExecutiveGuidanceFreezeRegistryEntryMetadata {
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

export interface AssistantExecutiveGuidanceFreezeIdentityMetadata {
  readonly id: "ASSISTANT-4:8/ExecutiveGuidanceFreeze";
  readonly name: "Assistant Executive Guidance Freeze";
  readonly phaseId: "ASSISTANT-4:8";
  readonly namespace: "nexora.assistant.executive-guidance.freeze";
  readonly version: "1.0.0";
  readonly status: "Frozen";
  readonly readiness: "ReadyForPublicIndex";
  readonly sourceCertification: "ASSISTANT-4:7/ExecutiveGuidanceCertification";
  readonly lockIdentifier: "ASSISTANT-4-EXECUTIVE-GUIDANCE-LOCKED";
  readonly metadataOnly: true;
  readonly immutable: true;
}
