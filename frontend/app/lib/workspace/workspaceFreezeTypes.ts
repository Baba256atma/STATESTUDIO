/** WS-1:8 — Immutable Freeze metadata shapes. */
export interface WorkspaceFreezeLock {
  readonly id: string; readonly name: string; readonly description: string;
  readonly lockedTarget: string; readonly sourceEvidence: unknown; readonly lockStatus: "Locked";
  readonly version: "1.0.0"; readonly mutationPolicy: "Immutable";
}

