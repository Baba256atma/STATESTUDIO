/**
 * APP-4:7 — Executive Decision Memory error model.
 */

import { EXECUTIVE_DECISION_MEMORY_ERROR_CODES } from "./executiveDecisionMemoryConstants.ts";
import type { ExecutiveDecisionMemoryError } from "./executiveDecisionMemoryTypes.ts";

export { EXECUTIVE_DECISION_MEMORY_ERROR_CODES };

export function createExecutiveDecisionMemoryError(
  code: string,
  message: string,
  field?: string
): ExecutiveDecisionMemoryError {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

export function executiveDecisionMemoryErrorFromCode(
  code: keyof typeof EXECUTIVE_DECISION_MEMORY_ERROR_CODES,
  message: string,
  field?: string
): ExecutiveDecisionMemoryError {
  return createExecutiveDecisionMemoryError(EXECUTIVE_DECISION_MEMORY_ERROR_CODES[code], message, field);
}
