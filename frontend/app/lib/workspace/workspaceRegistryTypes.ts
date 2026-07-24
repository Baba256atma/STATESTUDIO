/**
 * WS-1:2 — Compile-time shapes for immutable Workspace Registry metadata.
 */

export type WorkspaceRegistryStatus = "ReadyForModel";

export type WorkspaceRegistryCategory =
  | "WorkspaceType"
  | "Contract"
  | "Capability"
  | "Responsibility"
  | "Lifecycle"
  | "Boundary"
  | "Terminology";

export interface WorkspaceRegistryIdentity {
  readonly id: "WS-1:2/WorkspaceRegistry";
  readonly name: "Workspace Registry";
  readonly layer: "Workspace";
  readonly phase: "1:2";
  readonly version: "1.0.0";
  readonly status: WorkspaceRegistryStatus;
  readonly namespace: "nexora.workspace.registry";
}

export interface WorkspaceRegistryRecord<TSource = unknown> {
  readonly id: string;
  readonly key: string;
  readonly name: string;
  readonly description: string;
  readonly registryCategory: WorkspaceRegistryCategory;
  readonly sourcePhase: "WS-1:1";
  readonly source: TSource;
  readonly stability: "Stable";
  readonly version: "1.0.0";
  readonly ownership: "Workspace";
  readonly extensionPolicy: "Additive";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface WorkspaceTypeRegistryRecord<TSource = unknown>
  extends WorkspaceRegistryRecord<TSource> {
  readonly category: string;
  readonly purpose: string;
  readonly supportedObjectives: readonly string[];
  readonly lifecycleAvailability: readonly string[];
  readonly customizationPolicy: "Canonical" | "Configurable";
}

export interface WorkspaceLifecycleRegistryRecord<TSource = unknown>
  extends WorkspaceRegistryRecord<TSource> {
  readonly allowedArchitecturalTransitions: readonly string[];
  readonly executesTransitions: false;
}

