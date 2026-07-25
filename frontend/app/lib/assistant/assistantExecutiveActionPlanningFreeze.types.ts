/** ASSISTANT-7:8 — Readonly metadata types for Executive Action Planning Freeze. */
export interface AssistantExecutiveActionPlanningFreezeBaselineMetadata {
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

export interface AssistantExecutiveActionPlanningFreezeCompatibilityMetadata {
  readonly id: string;
  readonly name: string;
  readonly state: "Compatible";
  readonly sourceCertification:
    "ASSISTANT-7:7/ExecutiveActionPlanningCertification";
  readonly order: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface AssistantExecutiveActionPlanningFreezeArchitecturalLockMetadata {
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

export interface AssistantExecutiveActionPlanningFreezeRegistryEntryMetadata {
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

export interface AssistantExecutiveActionPlanningFreezeIdentityMetadata {
  readonly id: "ASSISTANT-7:8/ExecutiveActionPlanningFreeze";
  readonly name: "Assistant Executive Action Planning Freeze";
  readonly phaseId: "ASSISTANT-7:8";
  readonly namespace: "nexora.assistant.executive-action-planning.freeze";
  readonly version: "1.0.0";
  readonly status: "Frozen";
  readonly readiness: "ReadyForPublicIndex";
  readonly sourceCertification:
    "ASSISTANT-7:7/ExecutiveActionPlanningCertification";
  readonly lockIdentifier: "ASSISTANT-7-EXECUTIVE-ACTION-PLANNING-LOCKED";
  readonly metadataOnly: true;
  readonly immutable: true;
}
