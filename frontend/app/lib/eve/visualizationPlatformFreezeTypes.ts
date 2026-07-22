export interface VisualizationPlatformFreezeLock {
  readonly id: `EVE-8:8/Lock/${string}`;
  readonly canonicalName: string;
  readonly lockIdentifier: "EVE-8-VISUALIZATION-PLATFORM-LOCKED";
  readonly status: "Locked";
  readonly description: string;
  readonly deterministicOrder: number;
  readonly runtimeLocking: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface VisualizationPlatformFrozenBaseline {
  readonly id: `EVE-8:8/Baseline/${string}`;
  readonly name: string;
  readonly canonicalReference: unknown;
  readonly preservedByReference: true;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface VisualizationPlatformFreezeDeclaration {
  readonly id: `EVE-8:8/${"Compatibility" | "Extension"}/${string}`;
  readonly name: string;
  readonly canonicalReference: unknown;
  readonly preservedByReference: true;
  readonly deterministicOrder: number;
  readonly runtimeExecution: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface VisualizationPlatformFreezeRegistryEntry {
  readonly id: `EVE-8:8/Registry/${string}`;
  readonly phase: string;
  readonly canonicalReference: unknown;
  readonly certificationReference: "EVE-8:7/VisualizationPlatformCertification";
  readonly deterministicOrder: number;
  readonly preservedByReference: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}
