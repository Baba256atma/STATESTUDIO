/**
 * APP-4:4 — Executive Memory retrieval error model.
 */

import { EXECUTIVE_MEMORY_RETRIEVAL_ERROR_CODES } from "./executiveMemoryRetrievalConstants.ts";
import type { ExecutiveMemoryRetrievalError } from "./executiveMemoryRetrievalTypes.ts";

export { EXECUTIVE_MEMORY_RETRIEVAL_ERROR_CODES };

export function createExecutiveMemoryRetrievalError(
  code: string,
  message: string,
  field?: string
): ExecutiveMemoryRetrievalError {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

export function executiveMemoryRetrievalErrorFromCode(
  code: keyof typeof EXECUTIVE_MEMORY_RETRIEVAL_ERROR_CODES,
  message: string,
  field?: string
): ExecutiveMemoryRetrievalError {
  return createExecutiveMemoryRetrievalError(EXECUTIVE_MEMORY_RETRIEVAL_ERROR_CODES[code], message, field);
}
