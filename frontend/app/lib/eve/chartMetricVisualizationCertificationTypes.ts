export interface ChartMetricVisualizationCertificationCriterion {
  readonly id: `EVE-5:7/Criterion/${string}`;
  readonly name: string;
  readonly description: string;
  readonly platformReference: "EVE-5:6/ChartMetricVisualizationPlatform";
  readonly status: "Certified";
  readonly deterministicOrder: number;
  readonly verification: "DeclarativeOnly";
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ChartMetricVisualizationCertificationGate {
  readonly id: `EVE-5:7/Gate/${string}`;
  readonly name: string;
  readonly outcome: "Passed";
  readonly description: string;
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ChartMetricVisualizationCertificationCompatibilityEntry {
  readonly id: `EVE-5:7/Compatibility/${string}`;
  readonly name: string;
  readonly verified: true;
  readonly canonicalReference: string;
  readonly deterministicOrder: number;
  readonly runtimeVerification: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
