/** WS-1:7 — Immutable Certification metadata shapes. */
export type WorkspaceCertificationResult = "Pass" | "Fail" | "Warning" | "Not Applicable";
export interface WorkspaceCertificationDescriptor {
  readonly id: string; readonly name: string; readonly description: string;
  readonly category: string; readonly requirement: string; readonly evidenceSource: unknown;
  readonly severity: "Critical"; readonly mandatory: true;
  readonly result: WorkspaceCertificationResult; readonly immutable: true;
}

