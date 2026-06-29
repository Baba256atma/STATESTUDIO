/**
 * APP-4:2 — Executive Memory scenario contract.
 */

export type ExecutiveMemoryScenario = Readonly<{
  scenarioId: string;
  title: string;
  summary: string;
  scenarioType: string | null;
  packageId: string | null;
  readOnly: true;
}>;

export type ExecutiveMemoryIntent = Readonly<{
  intentId: string;
  title: string;
  summary: string;
  category: string | null;
  readiness: string | null;
  readOnly: true;
}>;

export function createExecutiveMemoryScenario(
  input: Omit<ExecutiveMemoryScenario, "readOnly">
): ExecutiveMemoryScenario {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveMemoryIntent(
  input: Omit<ExecutiveMemoryIntent, "readOnly">
): ExecutiveMemoryIntent {
  return Object.freeze({ ...input, readOnly: true as const });
}
