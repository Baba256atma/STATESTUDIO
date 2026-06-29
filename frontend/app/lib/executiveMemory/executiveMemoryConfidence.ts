/**
 * APP-4:2 — Executive Memory confidence contract.
 * Reusable confidence shape — no scoring engine.
 */

import { EXECUTIVE_MEMORY_CONFIDENCE_LEVEL_KEYS } from "./executiveMemoryRecordConstants.ts";

export type ExecutiveMemoryConfidenceLevel =
  (typeof EXECUTIVE_MEMORY_CONFIDENCE_LEVEL_KEYS)[number];

export type ExecutiveMemoryConfidence = Readonly<{
  confidenceId: string;
  score: number | null;
  level: ExecutiveMemoryConfidenceLevel;
  source: string;
  explanation: string;
  calculationMethod: string;
  readOnly: true;
}>;

export function createExecutiveMemoryConfidence(
  input: Omit<ExecutiveMemoryConfidence, "readOnly">
): ExecutiveMemoryConfidence {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function isExecutiveMemoryConfidenceLevel(
  value: string
): value is ExecutiveMemoryConfidenceLevel {
  return (EXECUTIVE_MEMORY_CONFIDENCE_LEVEL_KEYS as readonly string[]).includes(value);
}
