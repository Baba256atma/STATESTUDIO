/**
 * INT-3 — Executive Summary Registry.
 */

import {
  EXECUTIVE_SUMMARY_INTELLIGENCE_VERSION,
  type ExecutiveSummaryIntelligenceRequest,
  type ExecutiveSummaryIntelligenceResponse,
  type ExecutiveSummaryRegistryState,
} from "./executiveSummaryIntelligenceContract.ts";

function nowIso(): string {
  return new Date().toISOString();
}

let currentRequest: ExecutiveSummaryIntelligenceRequest | null = null;
let previousRequest: ExecutiveSummaryIntelligenceRequest | null = null;
let currentResponse: ExecutiveSummaryIntelligenceResponse | null = null;
let changeCounter = 0;

export function getExecutiveSummaryRegistryState(): ExecutiveSummaryRegistryState {
  return Object.freeze({
    contractVersion: EXECUTIVE_SUMMARY_INTELLIGENCE_VERSION,
    currentRequest,
    previousRequest,
    currentResponse,
    changeCounter,
    updatedAt: nowIso(),
  });
}

export function getCurrentExecutiveSummaryRequest(): ExecutiveSummaryIntelligenceRequest | null {
  return currentRequest;
}

export function getPreviousExecutiveSummaryRequest(): ExecutiveSummaryIntelligenceRequest | null {
  return previousRequest;
}

export function getCurrentExecutiveSummaryResponse(): ExecutiveSummaryIntelligenceResponse | null {
  return currentResponse;
}

export function registerExecutiveSummaryResult(input: {
  request: ExecutiveSummaryIntelligenceRequest;
  response: ExecutiveSummaryIntelligenceResponse;
}): void {
  if (currentRequest?.summaryRequestId !== input.request.summaryRequestId) {
    previousRequest = currentRequest;
    changeCounter += 1;
  }
  currentRequest = input.request;
  currentResponse = input.response;
}

export function getExecutiveSummaryChangeCounter(): number {
  return changeCounter;
}

export function resetExecutiveSummaryRegistryForTests(): void {
  currentRequest = null;
  previousRequest = null;
  currentResponse = null;
  changeCounter = 0;
}
