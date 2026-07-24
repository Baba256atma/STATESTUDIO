/**
 * WS-1:1 — Compile-time shapes for immutable Workspace Foundation metadata.
 */

export type WorkspaceFoundationStatus = "ReadyForRegistry";

export type WorkspaceCategory =
  | "Executive Home"
  | "Goal"
  | "Problem"
  | "Decision"
  | "Scenario"
  | "Strategy"
  | "Risk"
  | "Organization"
  | "Knowledge"
  | "Dashboard"
  | "Custom";

export type WorkspaceLifecycleState =
  | "Declared"
  | "Registered"
  | "Configured"
  | "Initialized"
  | "Active"
  | "Suspended"
  | "Restored"
  | "Archived"
  | "Retired";

export interface WorkspaceFoundationIdentity {
  readonly id: "WS-1:1/WorkspaceFoundation";
  readonly name: "Workspace Foundation";
  readonly layer: "Workspace";
  readonly phase: "1:1";
  readonly version: "1.0.0";
  readonly status: WorkspaceFoundationStatus;
}

export interface WorkspaceContractDefinition {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly requiredMetadata: readonly string[];
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface WorkspaceCapabilityDefinition {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface WorkspaceResponsibilityDefinition {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly runtimeBehavior: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface WorkspaceBoundaryDefinition {
  readonly id: string;
  readonly prohibitedConcern: string;
  readonly implemented: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
