/**
 * APP-4:11 — Executive Assistant Memory Integration builders.
 */

import type {
  CreateExecutiveAssistantMemoryRequestInput,
  ExecutiveAssistantMemoryRequest,
  ExecutiveAssistantRetrievalProfile,
} from "./executiveAssistantMemoryIntegrationTypes.ts";

export function createExecutiveAssistantMemoryRequest(
  input: CreateExecutiveAssistantMemoryRequestInput = {}
): ExecutiveAssistantMemoryRequest {
  return Object.freeze({
    ...input,
    allowArchived: input.allowArchived ?? true,
    allowLocked: input.allowLocked ?? false,
    includeSuperseded: input.includeSuperseded ?? false,
    readOnly: true as const,
  });
}

export function createExecutiveAssistantRetrievalProfile(
  input: Omit<ExecutiveAssistantRetrievalProfile, "readOnly">
): ExecutiveAssistantRetrievalProfile {
  return Object.freeze({ ...input, readOnly: true as const });
}

export const ExecutiveAssistantMemoryIntegrationBuilder = Object.freeze({
  createExecutiveAssistantMemoryRequest,
  createExecutiveAssistantRetrievalProfile,
});
