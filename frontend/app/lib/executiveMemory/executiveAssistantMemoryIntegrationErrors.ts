/**
 * APP-4:11 — Executive Assistant Memory Integration error model.
 */

import { EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_ERROR_CODES } from "./executiveAssistantMemoryIntegrationConstants.ts";
import type { ExecutiveAssistantMemoryIntegrationError } from "./executiveAssistantMemoryIntegrationTypes.ts";

export { EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_ERROR_CODES };

export function createExecutiveAssistantMemoryIntegrationError(
  code: string,
  message: string,
  field?: string
): ExecutiveAssistantMemoryIntegrationError {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

export function executiveAssistantMemoryIntegrationErrorFromCode(
  code: keyof typeof EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_ERROR_CODES,
  message: string,
  field?: string
): ExecutiveAssistantMemoryIntegrationError {
  return createExecutiveAssistantMemoryIntegrationError(
    EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_ERROR_CODES[code],
    message,
    field
  );
}
