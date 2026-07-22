export interface ChartMetricVisualizationFreezeLock {
  readonly id: `EVE-5:8/Lock/${string}`;
  readonly canonicalName: string;
  readonly lockIdentifier: "EVE-5-CHART-METRIC-VISUALIZATION-LOCKED";
  readonly status: "Locked";
  readonly description: string;
  readonly deterministicOrder: number;
  readonly runtimeLocking: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ChartMetricVisualizationFrozenBaseline {
  readonly id: `EVE-5:8/Baseline/${string}`;
  readonly name: string;
  readonly canonicalReference: unknown;
  readonly preservedByReference: true;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ChartMetricVisualizationFreezeDeclaration {
  readonly id: `EVE-5:8/${"Compatibility" | "Extension"}/${string}`;
  readonly name: string;
  readonly canonicalReference: unknown;
  readonly preservedByReference: true;
  readonly deterministicOrder: number;
  readonly runtimeExecution: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ChartMetricVisualizationFreezeRegistryEntry {
  readonly id: `EVE-5:8/Registry/${string}`;
  readonly phase: string;
  readonly canonicalReference: unknown;
  readonly certificationReference: "EVE-5:7/ChartMetricVisualizationCertification";
  readonly deterministicOrder: number;
  readonly preservedByReference: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}
