/** WS-2:7 — Immutable Certification metadata shapes. */
export type ExecutiveHomeCertificationResult = "Pass" | "Fail" | "Warning" | "NotApplicable";
export interface ExecutiveHomeCertificationCriterion {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly requirement: string;
  readonly evidenceReference: unknown;
  readonly severity: "Critical";
  readonly mandatory: true;
  readonly result: ExecutiveHomeCertificationResult;
  readonly immutable: true;
}

