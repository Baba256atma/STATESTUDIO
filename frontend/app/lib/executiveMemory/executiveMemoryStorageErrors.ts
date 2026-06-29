/**
 * APP-4:3 — Executive Memory storage error model.
 */

import { EXECUTIVE_MEMORY_STORAGE_ERROR_CODES } from "./executiveMemoryStorageConstants.ts";
import type { ExecutiveMemoryStorageError } from "./executiveMemoryStorageTypes.ts";

export { EXECUTIVE_MEMORY_STORAGE_ERROR_CODES };

export function createExecutiveMemoryStorageError(
  code: string,
  message: string,
  field?: string
): ExecutiveMemoryStorageError {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

export function executiveMemoryStorageErrorFromCode(
  code: keyof typeof EXECUTIVE_MEMORY_STORAGE_ERROR_CODES,
  message: string,
  field?: string
): ExecutiveMemoryStorageError {
  return createExecutiveMemoryStorageError(EXECUTIVE_MEMORY_STORAGE_ERROR_CODES[code], message, field);
}
