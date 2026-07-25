/** ASSISTANT-6:8 — Readonly metadata types for Object & Context Management Freeze. */
export interface AssistantObjectContextManagementFreezeBaselineMetadata {
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

export interface AssistantObjectContextManagementFreezeCompatibilityMetadata {
  readonly id: string;
  readonly name: string;
  readonly state: "Compatible";
  readonly sourceCertification:
    "ASSISTANT-6:7/ObjectContextManagementCertification";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantObjectContextManagementFreezeArchitecturalLockMetadata {
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

export interface AssistantObjectContextManagementFreezeRegistryEntryMetadata {
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

export interface AssistantObjectContextManagementFreezeIdentityMetadata {
  readonly id: "ASSISTANT-6:8/ObjectContextManagementFreeze";
  readonly name: "Assistant Object & Context Management Freeze";
  readonly phaseId: "ASSISTANT-6:8";
  readonly namespace: "nexora.assistant.object-context-management.freeze";
  readonly version: "1.0.0";
  readonly status: "Frozen";
  readonly readiness: "ReadyForPublicIndex";
  readonly sourceCertification:
    "ASSISTANT-6:7/ObjectContextManagementCertification";
  readonly lockIdentifier: "ASSISTANT-6-OBJECT-CONTEXT-MANAGEMENT-LOCKED";
  readonly metadataOnly: true;
  readonly immutable: true;
}
