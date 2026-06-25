/**
 * INT-1.3 — Executive Time Context registry.
 */

import {
  EXECUTIVE_TIME_CONTEXT_VERSION,
  type ExecutiveTimeContext,
  type ExecutiveTimeContextRegistryState,
} from "./executiveTimeContextContract.ts";

function nowIso(): string {
  return new Date().toISOString();
}

let currentTimeContext: ExecutiveTimeContext | null = null;
let previousTimeContext: ExecutiveTimeContext | null = null;
let changeCounter = 0;

export function getExecutiveTimeContextRegistryState(): ExecutiveTimeContextRegistryState {
  return Object.freeze({
    contractVersion: EXECUTIVE_TIME_CONTEXT_VERSION,
    currentTimeContext,
    previousTimeContext,
    activeVersion: EXECUTIVE_TIME_CONTEXT_VERSION,
    changeCounter,
    updatedAt: nowIso(),
  });
}

export function getCurrentExecutiveTimeContext(): ExecutiveTimeContext | null {
  return currentTimeContext;
}

export function getPreviousExecutiveTimeContext(): ExecutiveTimeContext | null {
  return previousTimeContext;
}

export function registerExecutiveTimeContext(timeContext: ExecutiveTimeContext): void {
  if (currentTimeContext?.timeContextId !== timeContext.timeContextId) {
    previousTimeContext = currentTimeContext;
    changeCounter += 1;
  }
  currentTimeContext = timeContext;
}

export function getExecutiveTimeContextChangeCounter(): number {
  return changeCounter;
}

export function resetExecutiveTimeContextRegistryForTests(): void {
  currentTimeContext = null;
  previousTimeContext = null;
  changeCounter = 0;
}
