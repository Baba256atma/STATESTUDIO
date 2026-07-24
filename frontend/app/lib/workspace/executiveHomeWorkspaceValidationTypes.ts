/** WS-2:4 — Immutable validation metadata shapes. */
export type ExecutiveHomeValidationOutcome = "Pass" | "Fail" | "Warning" | "NotApplicable";
export type ExecutiveHomeValidationSeverity = "Informational" | "Low" | "Medium" | "High" | "Critical";
export interface ExecutiveHomeValidationDescriptor {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly source: unknown;
  readonly severity: ExecutiveHomeValidationSeverity;
  readonly mandatory: true;
  readonly outcome: ExecutiveHomeValidationOutcome;
  readonly metadataOnly: true;
  readonly immutable: true;
}

