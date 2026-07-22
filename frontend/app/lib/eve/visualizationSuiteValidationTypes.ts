export type VisualizationSuiteValidationSeverity =
  | "Information" | "Advisory" | "Warning" | "Minor" | "Major" | "Critical";

export type VisualizationSuiteValidationOutcome =
  | "Passed" | "PassedWithNotes" | "ReviewRequired" | "Deferred" | "Blocked"
  | "NotApplicable";

export interface VisualizationSuiteValidationRule {
  readonly id: `EVE-9:4/Rule/${string}`;
  readonly name: string;
  readonly categoryReference: unknown;
  readonly description: string;
  readonly expectedOutcome: "Passed";
  readonly modelReference: "EVE-9:3/VisualizationSuiteModel";
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface VisualizationSuiteValidationGate {
  readonly id: `EVE-9:4/Gate/${string}`;
  readonly name: string;
  readonly outcome: "Passed";
  readonly description: string;
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
