/** WS-2:1 — Immutable Executive Home Foundation metadata shapes. */
export type ExecutiveHomeWorkspaceFoundationStatus = "ReadyForRegistry";

export interface ExecutiveHomeWorkspaceFoundationIdentity {
  readonly id: "WS-2:1/ExecutiveHomeWorkspaceFoundation";
  readonly name: "Executive Home Workspace Foundation";
  readonly layer: "Workspace";
  readonly phase: "2:1";
  readonly version: "1.0.0";
  readonly status: ExecutiveHomeWorkspaceFoundationStatus;
  readonly namespace: "nexora.workspace.executive-home.foundation";
}

export interface ExecutiveHomeContract {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly requiredMetadata: readonly string[];
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveHomeDeclaration {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveHomeBoundary {
  readonly id: string;
  readonly prohibitedConcern: string;
  readonly implemented: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

