/**
 * APP-4:2 — Executive Memory goal contract.
 */

export type ExecutiveMemoryGoal = Readonly<{
  goalId: string;
  title: string;
  description: string;
  targetMetric: string | null;
  targetValue: string | null;
  horizon: string | null;
  readOnly: true;
}>;

export function createExecutiveMemoryGoal(
  input: Omit<ExecutiveMemoryGoal, "readOnly">
): ExecutiveMemoryGoal {
  return Object.freeze({ ...input, readOnly: true as const });
}
