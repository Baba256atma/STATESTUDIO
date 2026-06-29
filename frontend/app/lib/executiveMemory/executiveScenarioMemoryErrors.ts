/**
 * APP-4:6 — Executive Scenario Memory error model.
 */

import { EXECUTIVE_SCENARIO_MEMORY_ERROR_CODES } from "./executiveScenarioMemoryConstants.ts";
import type { ExecutiveScenarioMemoryError } from "./executiveScenarioMemoryTypes.ts";

export { EXECUTIVE_SCENARIO_MEMORY_ERROR_CODES };

export function createExecutiveScenarioMemoryError(
  code: string,
  message: string,
  field?: string
): ExecutiveScenarioMemoryError {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

export function executiveScenarioMemoryErrorFromCode(
  code: keyof typeof EXECUTIVE_SCENARIO_MEMORY_ERROR_CODES,
  message: string,
  field?: string
): ExecutiveScenarioMemoryError {
  return createExecutiveScenarioMemoryError(EXECUTIVE_SCENARIO_MEMORY_ERROR_CODES[code], message, field);
}
