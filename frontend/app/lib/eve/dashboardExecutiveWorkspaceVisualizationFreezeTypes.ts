export interface DashboardExecutiveWorkspaceFreezeLock {
  readonly id: `EVE-6:8/Lock/${string}`;
  readonly canonicalName: string;
  readonly lockIdentifier:
    "EVE-6-DASHBOARD-EXECUTIVE-WORKSPACE-VISUALIZATION-LOCKED";
  readonly status: "Locked";
  readonly description: string;
  readonly deterministicOrder: number;
  readonly runtimeLocking: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DashboardExecutiveWorkspaceFrozenBaseline {
  readonly id: `EVE-6:8/Baseline/${string}`;
  readonly name: string;
  readonly canonicalReference: unknown;
  readonly preservedByReference: true;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DashboardExecutiveWorkspaceFreezeDeclaration {
  readonly id: `EVE-6:8/${"Compatibility" | "Extension"}/${string}`;
  readonly name: string;
  readonly canonicalReference: unknown;
  readonly preservedByReference: true;
  readonly deterministicOrder: number;
  readonly runtimeExecution: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DashboardExecutiveWorkspaceFreezeRegistryEntry {
  readonly id: `EVE-6:8/Registry/${string}`;
  readonly phase: string;
  readonly canonicalReference: unknown;
  readonly certificationReference:
    "EVE-6:7/DashboardExecutiveWorkspaceVisualizationCertification";
  readonly deterministicOrder: number;
  readonly preservedByReference: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}
