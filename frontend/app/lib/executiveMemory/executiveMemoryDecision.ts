/**
 * APP-4:2 — Executive Memory decision contract.
 */

export type ExecutiveMemoryDecision = Readonly<{
  decisionId: string;
  title: string;
  rationale: string;
  status: "proposed" | "approved" | "rejected" | "deferred" | "executed" | "archived";
  decidedAt: string | null;
  decidedBy: string | null;
  readOnly: true;
}>;

export function createExecutiveMemoryDecision(
  input: Omit<ExecutiveMemoryDecision, "readOnly">
): ExecutiveMemoryDecision {
  return Object.freeze({ ...input, readOnly: true as const });
}
