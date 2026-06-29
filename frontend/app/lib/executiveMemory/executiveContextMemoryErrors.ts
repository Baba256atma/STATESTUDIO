/**
 * APP-4:8 — Executive Context Memory error model.
 */

import { EXECUTIVE_CONTEXT_MEMORY_ERROR_CODES } from "./executiveContextMemoryConstants.ts";
import type { ExecutiveContextMemoryError } from "./executiveContextMemoryTypes.ts";

export { EXECUTIVE_CONTEXT_MEMORY_ERROR_CODES };

export function createExecutiveContextMemoryError(
  code: string,
  message: string,
  field?: string
): ExecutiveContextMemoryError {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

export function executiveContextMemoryErrorFromCode(
  code: keyof typeof EXECUTIVE_CONTEXT_MEMORY_ERROR_CODES,
  message: string,
  field?: string
): ExecutiveContextMemoryError {
  return createExecutiveContextMemoryError(EXECUTIVE_CONTEXT_MEMORY_ERROR_CODES[code], message, field);
}
