/**
 * INT-4 — Object Panel Registry.
 * Tracks requests and object selection changes — no local object cache.
 */

import {
  OBJECT_PANEL_INTELLIGENCE_VERSION,
  type ObjectPanelIntelligenceRequest,
  type ObjectPanelIntelligenceResponse,
  type ObjectPanelRegistryState,
} from "./objectPanelIntelligenceContract.ts";

function nowIso(): string {
  return new Date().toISOString();
}

let currentRequest: ObjectPanelIntelligenceRequest | null = null;
let previousRequest: ObjectPanelIntelligenceRequest | null = null;
let currentResponse: ObjectPanelIntelligenceResponse | null = null;
let currentSelectedObjectId: string | null = null;
let previousSelectedObjectId: string | null = null;
let changeCounter = 0;
let selectionChangeCounter = 0;

export function getObjectPanelRegistryState(): ObjectPanelRegistryState {
  return Object.freeze({
    contractVersion: OBJECT_PANEL_INTELLIGENCE_VERSION,
    currentRequest,
    previousRequest,
    currentResponse,
    currentSelectedObjectId,
    previousSelectedObjectId,
    changeCounter,
    selectionChangeCounter,
    updatedAt: nowIso(),
  });
}

export function getCurrentObjectPanelRequest(): ObjectPanelIntelligenceRequest | null {
  return currentRequest;
}

export function getPreviousObjectPanelRequest(): ObjectPanelIntelligenceRequest | null {
  return previousRequest;
}

export function getCurrentObjectPanelResponse(): ObjectPanelIntelligenceResponse | null {
  return currentResponse;
}

export function getObjectPanelChangeCounter(): number {
  return changeCounter;
}

export function getObjectPanelSelectionChangeCounter(): number {
  return selectionChangeCounter;
}

export function registerObjectPanelResult(input: {
  request: ObjectPanelIntelligenceRequest;
  response: ObjectPanelIntelligenceResponse;
}): boolean {
  const selectionChanged =
    currentSelectedObjectId !== null &&
    input.request.selectedObjectId !== null &&
    currentSelectedObjectId !== input.request.selectedObjectId;

  if (selectionChanged) {
    previousSelectedObjectId = currentSelectedObjectId;
    selectionChangeCounter += 1;
  }

  if (currentSelectedObjectId !== input.request.selectedObjectId) {
    currentSelectedObjectId = input.request.selectedObjectId;
  }

  if (currentRequest?.objectPanelRequestId !== input.request.objectPanelRequestId) {
    previousRequest = currentRequest;
    changeCounter += 1;
  }

  currentRequest = input.request;
  currentResponse = input.response;
  return selectionChanged;
}

export function resetObjectPanelRegistryForTests(): void {
  currentRequest = null;
  previousRequest = null;
  currentResponse = null;
  currentSelectedObjectId = null;
  previousSelectedObjectId = null;
  changeCounter = 0;
  selectionChangeCounter = 0;
}
