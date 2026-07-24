/** WS-2:2 — Immutable Executive Home Registry metadata shapes. */
export interface ExecutiveHomeRegistryIdentity {
  readonly id: "WS-2:2/ExecutiveHomeWorkspaceRegistry";
  readonly name: "Executive Home Workspace Registry";
  readonly layer: "Workspace";
  readonly phase: "2:2";
  readonly version: "1.0.0";
  readonly status: "ReadyForModel";
  readonly namespace: "nexora.workspace.executive-home.registry";
}

export interface ExecutiveHomeRegistryRecord<TSource = unknown> {
  readonly id: string;
  readonly key: string;
  readonly name: string;
  readonly description: string;
  readonly registryCategory: "Category" | "Contract" | "Capability" | "Responsibility"
    | "Lifecycle" | "Boundary" | "Terminology";
  readonly sourcePhase: "WS-2:1";
  readonly source: TSource;
  readonly version: "1.0.0";
  readonly stability: "Stable";
  readonly ownership: "Executive Home Workspace";
  readonly extensionPolicy: "Additive";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ExecutiveHomeCategoryRecord<TSource = unknown>
  extends ExecutiveHomeRegistryRecord<TSource> {
  readonly category: string;
  readonly purpose: string;
  readonly visibility: "Executive";
  readonly lifecycleAvailability: readonly string[];
}

