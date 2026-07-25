/** ASSISTANT-2:8 — Readonly metadata types for Executive Memory Freeze. */
export interface AssistantExecutiveMemoryFreezeBaselineMetadata {
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

export interface AssistantExecutiveMemoryFreezeCompatibilityMetadata {
  readonly id: string;
  readonly name: string;
  readonly state: "Compatible";
  readonly sourceCertification: "ASSISTANT-2:7/ExecutiveMemoryCertification";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveMemoryFreezeArchitecturalLockMetadata {
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

export interface AssistantExecutiveMemoryFreezeRegistryEntryMetadata {
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

export interface AssistantExecutiveMemoryFreezeIdentityMetadata {
  readonly id: "ASSISTANT-2:8/ExecutiveMemoryFreeze";
  readonly name: "Assistant Executive Memory Freeze";
  readonly phaseId: "ASSISTANT-2:8";
  readonly namespace: "nexora.assistant.executive-memory.freeze";
  readonly version: "1.0.0";
  readonly status: "Frozen";
  readonly readiness: "ReadyForPublicIndex";
  readonly sourceCertification: "ASSISTANT-2:7/ExecutiveMemoryCertification";
  readonly lockIdentifier: "ASSISTANT-2-EXECUTIVE-MEMORY-LOCKED";
  readonly metadataOnly: true;
  readonly immutable: true;
}
