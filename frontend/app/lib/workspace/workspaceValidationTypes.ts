/** WS-1:4 — Immutable validation metadata shapes. */
export type WorkspaceValidationOutcome = "Pass" | "Fail" | "Warning" | "Not Applicable";
export type WorkspaceValidationSeverity = "Informational" | "Low" | "Medium" | "High" | "Critical";
export interface WorkspaceValidationDescriptor {
  readonly id: string; readonly name: string; readonly description: string;
  readonly source: unknown; readonly mandatory: boolean;
  readonly outcome: WorkspaceValidationOutcome; readonly metadataOnly: true; readonly immutable: true;
}

