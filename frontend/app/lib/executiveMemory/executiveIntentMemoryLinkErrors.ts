/**
 * APP-4:5 — Executive Intent ↔ Memory linking errors.
 */

import { EXECUTIVE_INTENT_MEMORY_LINK_ERROR_CODES } from "./executiveIntentMemoryLinkConstants.ts";
import type { ExecutiveIntentMemoryLinkError } from "./executiveIntentMemoryLinkTypes.ts";

export { EXECUTIVE_INTENT_MEMORY_LINK_ERROR_CODES };

export function createExecutiveIntentMemoryLinkError(
  code: string,
  message: string,
  field?: string
): ExecutiveIntentMemoryLinkError {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

export function executiveIntentMemoryLinkErrorFromCode(
  code: keyof typeof EXECUTIVE_INTENT_MEMORY_LINK_ERROR_CODES,
  message: string,
  field?: string
): ExecutiveIntentMemoryLinkError {
  return createExecutiveIntentMemoryLinkError(EXECUTIVE_INTENT_MEMORY_LINK_ERROR_CODES[code], message, field);
}
