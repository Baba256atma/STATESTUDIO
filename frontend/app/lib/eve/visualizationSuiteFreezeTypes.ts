export interface VisualizationSuiteFreezeLock {
  readonly id: `EVE-9:8/Lock/${string}`;
  readonly canonicalName: string;
  readonly lockIdentifier: "EVE-9-VISUALIZATION-SUITE-LOCKED";
  readonly status: "Locked";
  readonly description: string;
  readonly deterministicOrder: number;
  readonly runtimeLocking: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface VisualizationSuiteFrozenBaseline {
  readonly id: `EVE-9:8/Baseline/${string}`;
  readonly name: string;
  readonly canonicalReference: unknown;
  readonly preservedByReference: true;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface VisualizationSuiteFreezeDeclaration {
  readonly id: `EVE-9:8/${"Compatibility" | "Extension"}/${string}`;
  readonly name: string;
  readonly canonicalReference: unknown;
  readonly preservedByReference: true;
  readonly deterministicOrder: number;
  readonly runtimeExecution: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface VisualizationSuiteFreezeRegistryEntry {
  readonly id: `EVE-9:8/Registry/${string}`;
  readonly phase: string;
  readonly canonicalReference: unknown;
  readonly certificationReference: "EVE-9:7/VisualizationSuiteCertification";
  readonly deterministicOrder: number;
  readonly preservedByReference: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}
