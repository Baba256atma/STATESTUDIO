/**
 * APP-4:12 — Executive Memory Dashboard error model.
 */

import { EXECUTIVE_MEMORY_DASHBOARD_ERROR_CODES } from "./executiveMemoryDashboardConstants.ts";
import type { ExecutiveMemoryDashboardError } from "./executiveMemoryDashboardTypes.ts";

export { EXECUTIVE_MEMORY_DASHBOARD_ERROR_CODES };

export function createExecutiveMemoryDashboardError(
  code: string,
  message: string,
  field?: string
): ExecutiveMemoryDashboardError {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

export function executiveMemoryDashboardErrorFromCode(
  code: keyof typeof EXECUTIVE_MEMORY_DASHBOARD_ERROR_CODES,
  message: string,
  field?: string
): ExecutiveMemoryDashboardError {
  return createExecutiveMemoryDashboardError(
    EXECUTIVE_MEMORY_DASHBOARD_ERROR_CODES[code],
    message,
    field
  );
}
