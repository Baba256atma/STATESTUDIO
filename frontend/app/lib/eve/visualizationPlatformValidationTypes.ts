export type VisualizationPlatformValidationSeverity =
  | "Information" | "Advisory" | "Warning" | "Minor" | "Major" | "Critical";

export type VisualizationPlatformValidationOutcome =
  | "Passed" | "PassedWithNotes" | "ReviewRequired" | "Deferred" | "Blocked"
  | "NotApplicable";

export interface VisualizationPlatformValidationRule {
  readonly id: `EVE-8:4/Rule/${string}`;
  readonly name: string;
  readonly categoryReference: unknown;
  readonly description: string;
  readonly expectedOutcome: "Passed";
  readonly modelReference: "EVE-8:3/VisualizationPlatformModel";
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface VisualizationPlatformValidationGate {
  readonly id: `EVE-8:4/Gate/${string}`;
  readonly name: string;
  readonly outcome: "Passed";
  readonly description: string;
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
