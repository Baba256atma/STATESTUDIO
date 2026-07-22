export type DashboardExecutiveWorkspaceValidationSeverity =
  | "Information" | "Advisory" | "Warning" | "Minor" | "Major" | "Critical";

export type DashboardExecutiveWorkspaceValidationOutcome =
  | "Passed" | "PassedWithNotes" | "ReviewRequired" | "Deferred" | "Blocked"
  | "NotApplicable";

export interface DashboardExecutiveWorkspaceValidationRule {
  readonly id: `EVE-6:4/Rule/${string}`;
  readonly name: string;
  readonly categoryReference: unknown;
  readonly description: string;
  readonly expectedOutcome: "Passed";
  readonly modelReference: "EVE-6:3/DashboardExecutiveWorkspaceVisualizationModel";
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DashboardExecutiveWorkspaceValidationGate {
  readonly id: `EVE-6:4/Gate/${string}`;
  readonly name: string;
  readonly outcome: "Passed";
  readonly description: string;
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
