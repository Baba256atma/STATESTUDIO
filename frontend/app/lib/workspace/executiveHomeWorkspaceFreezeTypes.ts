/** WS-2:8 — Immutable Freeze metadata shapes. */
export interface ExecutiveHomeWorkspaceFreezeLock {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly lockedTarget: string;
  readonly certificationEvidenceReference: unknown;
  readonly lockStatus: "Locked";
  readonly version: "1.0.0";
  readonly mutationPolicy: "Immutable";
}

