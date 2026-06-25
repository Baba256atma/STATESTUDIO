/**
 * INT-2 — Assistant Runtime Registry.
 */

import {
  ASSISTANT_INTELLIGENCE_VERSION,
  type AssistantIntelligenceRequest,
  type AssistantIntelligenceResponse,
  type AssistantRuntimeRegistryState,
} from "./assistantIntelligenceContract.ts";

function nowIso(): string {
  return new Date().toISOString();
}

let currentRequest: AssistantIntelligenceRequest | null = null;
let previousRequest: AssistantIntelligenceRequest | null = null;
let currentResponse: AssistantIntelligenceResponse | null = null;
let changeCounter = 0;

export function getAssistantRuntimeRegistryState(): AssistantRuntimeRegistryState {
  return Object.freeze({
    contractVersion: ASSISTANT_INTELLIGENCE_VERSION,
    currentRequest,
    previousRequest,
    currentResponse,
    changeCounter,
    updatedAt: nowIso(),
  });
}

export function getCurrentAssistantRequest(): AssistantIntelligenceRequest | null {
  return currentRequest;
}

export function getPreviousAssistantRequest(): AssistantIntelligenceRequest | null {
  return previousRequest;
}

export function getCurrentAssistantResponse(): AssistantIntelligenceResponse | null {
  return currentResponse;
}

export function registerAssistantRuntimeResult(input: {
  request: AssistantIntelligenceRequest;
  response: AssistantIntelligenceResponse;
}): void {
  if (currentRequest?.assistantRequestId !== input.request.assistantRequestId) {
    previousRequest = currentRequest;
    changeCounter += 1;
  }
  currentRequest = input.request;
  currentResponse = input.response;
}

export function getAssistantRuntimeChangeCounter(): number {
  return changeCounter;
}

export function resetAssistantRuntimeRegistryForTests(): void {
  currentRequest = null;
  previousRequest = null;
  currentResponse = null;
  changeCounter = 0;
}
