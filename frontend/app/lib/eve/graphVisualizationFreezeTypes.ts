export interface GraphVisualizationFreezeLock {
  readonly id: `EVE-3:8/Lock/${string}`;
  readonly name: string;
  readonly lockIdentifier: "EVE-3-GRAPH-VISUALIZATION-LOCKED";
  readonly status: "Locked";
  readonly description: string;
  readonly deterministicOrder: number;
  readonly runtimeLocking: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface GraphVisualizationFrozenBaseline {
  readonly id: `EVE-3:8/Baseline/${string}`;
  readonly name: string;
  readonly canonicalReference: unknown;
  readonly preservedByReference: true;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface GraphVisualizationFreezeRegistryEntry {
  readonly id: `EVE-3:8/Registry/${string}`;
  readonly phase: string;
  readonly canonicalReference: unknown;
  readonly certificationReference: "EVE-3:7/GraphVisualizationCertification";
  readonly deterministicOrder: number;
  readonly preservedByReference: true;
  readonly immutable: true;
}

export interface GraphVisualizationFreezeDeclaration {
  readonly id: `EVE-3:8/${"Compatibility" | "Extension"}/${string}`;
  readonly name: string;
  readonly canonicalReference: unknown;
  readonly preservedByReference: true;
  readonly deterministicOrder: number;
  readonly runtimeExecution: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
