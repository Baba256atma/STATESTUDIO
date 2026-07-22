export type ChartMetricVisualizationValidationSeverity =
  | "Info" | "Notice" | "Warning" | "Error" | "Critical" | "Fatal";

export type ChartMetricVisualizationValidationOutcome =
  | "Passed" | "PassedWithNotes" | "Warning" | "Failed" | "Blocked"
  | "NotApplicable";

export interface ChartMetricVisualizationValidationRule {
  readonly id: `EVE-5:4/Rule/${string}`;
  readonly name: string;
  readonly categoryReference: unknown;
  readonly description: string;
  readonly expectedOutcome: "Passed";
  readonly modelReference: "EVE-5:3/ChartMetricVisualizationModel";
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface ChartMetricVisualizationValidationGate {
  readonly id: `EVE-5:4/Gate/${string}`;
  readonly name: string;
  readonly status: "Verified";
  readonly description: string;
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
