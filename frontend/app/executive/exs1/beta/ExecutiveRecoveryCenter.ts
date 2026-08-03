/**
 * Phase E — Recovery Center (Retry / Resume / Cancel / Review / Continue Later).
 */

import {
  createExecutiveError,
  type ExecutiveError,
  type ExecutiveErrorCode,
  type ExecutiveRecoveryAction,
} from "./ExecutiveBetaErrors";

export type RecoveryRecord = {
  readonly id: string;
  readonly error: ExecutiveError;
  readonly status: "Open" | "Resolved" | "Deferred";
  readonly lastAction: ExecutiveRecoveryAction | null;
};

export type ExecutiveRecoveryCenter = {
  readonly list: () => readonly RecoveryRecord[];
  report: (code: ExecutiveErrorCode, detail?: string) => RecoveryRecord;
  act: (id: string, action: ExecutiveRecoveryAction) => RecoveryRecord | null;
  clearResolved: () => void;
};

export function createRecoveryCenter(): ExecutiveRecoveryCenter {
  let records: RecoveryRecord[] = [];

  return {
    list: () => records,
    report(code, detail) {
      const error = createExecutiveError(code, detail);
      const record: RecoveryRecord = {
        id: `recovery-${Date.now().toString(36)}`,
        error,
        status: "Open",
        lastAction: null,
      };
      records = [record, ...records].slice(0, 24);
      return record;
    },
    act(id, action) {
      const current = records.find((r) => r.id === id);
      if (!current) return null;
      const status: RecoveryRecord["status"] =
        action === "Continue Later"
          ? "Deferred"
          : action === "Cancel"
            ? "Resolved"
            : action === "Retry" || action === "Resume"
              ? "Resolved"
              : "Open";
      const next: RecoveryRecord = {
        ...current,
        status,
        lastAction: action,
      };
      records = records.map((r) => (r.id === id ? next : r));
      return next;
    },
    clearResolved() {
      records = records.filter((r) => r.status === "Open" || r.status === "Deferred");
    },
  };
}
