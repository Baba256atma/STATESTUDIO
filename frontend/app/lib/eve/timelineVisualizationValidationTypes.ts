export type TimelineVisualizationValidationSeverity =
  | "Informational" | "Low" | "Moderate" | "High" | "Critical" | "Blocking";
export type TimelineVisualizationValidationOutcome =
  | "Passed" | "PassedWithNotes" | "ReviewRequired" | "Deferred"
  | "Rejected" | "CertifiedForManifest";

export interface TimelineVisualizationValidationRule {
  readonly id: `EVE-4:4/Rule/${string}`;
  readonly name: string;
  readonly categoryReference: unknown;
  readonly description: string;
  readonly expectedOutcome: "Passed";
  readonly modelReference: "EVE-4:3/TimelineVisualizationModel";
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface TimelineVisualizationValidationGate {
  readonly id: `EVE-4:4/Gate/${string}`;
  readonly name: string;
  readonly status: "Passed";
  readonly description: string;
  readonly deterministicOrder: number;
  readonly executes: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
