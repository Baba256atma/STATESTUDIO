/**
 * APP-4:10 — Executive Memory Lifecycle error model.
 */

import { EXECUTIVE_MEMORY_LIFECYCLE_ERROR_CODES } from "./executiveMemoryLifecycleConstants.ts";
import type { ExecutiveMemoryLifecycleError } from "./executiveMemoryLifecycleTypes.ts";

export { EXECUTIVE_MEMORY_LIFECYCLE_ERROR_CODES };

export function createExecutiveMemoryLifecycleError(
  code: string,
  message: string,
  field?: string
): ExecutiveMemoryLifecycleError {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

export function executiveMemoryLifecycleErrorFromCode(
  code: keyof typeof EXECUTIVE_MEMORY_LIFECYCLE_ERROR_CODES,
  message: string,
  field?: string
): ExecutiveMemoryLifecycleError {
  return createExecutiveMemoryLifecycleError(EXECUTIVE_MEMORY_LIFECYCLE_ERROR_CODES[code], message, field);
}
