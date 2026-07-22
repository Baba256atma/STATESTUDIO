export interface TimelineVisualizationFreezeLock {
  readonly id: `EVE-4:8/Lock/${string}`;
  readonly name: string;
  readonly lockIdentifier: "EVE-4-TIMELINE-VISUALIZATION-LOCKED";
  readonly lockVersion: "1.0.0";
  readonly status: "Frozen";
  readonly stableIdentity: string;
  readonly deterministicOrder: number;
  readonly runtimeLocking: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface TimelineVisualizationFrozenBaseline {
  readonly id: `EVE-4:8/Baseline/${string}`;
  readonly name: string;
  readonly canonicalReference: unknown;
  readonly preservedByReference: true;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface TimelineVisualizationFreezeRegistryEntry {
  readonly id: `EVE-4:8/Registry/${string}`;
  readonly phase: string;
  readonly canonicalReference: unknown;
  readonly certificationReference: "EVE-4:7/TimelineVisualizationCertification";
  readonly deterministicOrder: number;
  readonly preservedByReference: true;
  readonly immutable: true;
}

export interface TimelineVisualizationFreezeDeclaration {
  readonly id: `EVE-4:8/${"Compatibility" | "Extension"}/${string}`;
  readonly name: string;
  readonly canonicalReference: unknown;
  readonly preservedByReference: true;
  readonly deterministicOrder: number;
  readonly runtimeExecution: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
