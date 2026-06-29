/**
 * APP-4:2 — Executive Memory evidence and outcome contracts.
 */

export type ExecutiveMemoryEvidence = Readonly<{
  evidenceId: string;
  source: string;
  summary: string;
  capturedAt: string;
  reliability: string | null;
  readOnly: true;
}>;

export type ExecutiveMemoryOutcome = Readonly<{
  outcomeId: string;
  label: string;
  description: string;
  achieved: boolean | null;
  measuredAt: string | null;
  readOnly: true;
}>;

export type ExecutiveMemoryLessonLearned = Readonly<{
  lessonId: string;
  summary: string;
  context: string;
  capturedAt: string;
  readOnly: true;
}>;

export type ExecutiveMemoryAssumption = Readonly<{
  assumptionId: string;
  label: string;
  description: string;
  readOnly: true;
}>;

export type ExecutiveMemoryConstraint = Readonly<{
  constraintId: string;
  label: string;
  description: string;
  readOnly: true;
}>;

export function createExecutiveMemoryEvidence(
  input: Omit<ExecutiveMemoryEvidence, "readOnly">
): ExecutiveMemoryEvidence {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveMemoryOutcome(
  input: Omit<ExecutiveMemoryOutcome, "readOnly">
): ExecutiveMemoryOutcome {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveMemoryLessonLearned(
  input: Omit<ExecutiveMemoryLessonLearned, "readOnly">
): ExecutiveMemoryLessonLearned {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveMemoryAssumption(
  input: Omit<ExecutiveMemoryAssumption, "readOnly">
): ExecutiveMemoryAssumption {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveMemoryConstraint(
  input: Omit<ExecutiveMemoryConstraint, "readOnly">
): ExecutiveMemoryConstraint {
  return Object.freeze({ ...input, readOnly: true as const });
}
