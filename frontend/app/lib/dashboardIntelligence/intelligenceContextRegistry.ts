/**
 * INT-1.2 — Intelligence Context registry.
 * Tracks current, previous, active consumer, version, and change counter.
 */

import type { IntelligenceConsumerId } from "./singleIntelligenceSourceContract.ts";
import {
  INTELLIGENCE_CONTEXT_VERSION,
  type IntelligenceContextRegistryState,
  type UnifiedIntelligenceContext,
} from "./intelligenceContextContract.ts";

function nowIso(): string {
  return new Date().toISOString();
}

let currentContext: UnifiedIntelligenceContext | null = null;
let previousContext: UnifiedIntelligenceContext | null = null;
let activeConsumer: IntelligenceConsumerId | null = null;
let changeCounter = 0;

export function getIntelligenceContextRegistryState(): IntelligenceContextRegistryState {
  return Object.freeze({
    contractVersion: INTELLIGENCE_CONTEXT_VERSION,
    currentContext,
    previousContext,
    activeConsumer,
    contextVersion: INTELLIGENCE_CONTEXT_VERSION,
    changeCounter,
    updatedAt: nowIso(),
  });
}

export function getCurrentIntelligenceContext(): UnifiedIntelligenceContext | null {
  return currentContext;
}

export function getPreviousIntelligenceContext(): UnifiedIntelligenceContext | null {
  return previousContext;
}

export function registerIntelligenceContext(context: UnifiedIntelligenceContext): void {
  if (currentContext?.contextId !== context.contextId) {
    previousContext = currentContext;
    changeCounter += 1;
  }
  currentContext = context;
  activeConsumer = context.consumer;
}

export function restoreIntelligenceContext(context: UnifiedIntelligenceContext): void {
  previousContext = currentContext;
  currentContext = context;
  activeConsumer = context.consumer;
  changeCounter += 1;
}

export function getIntelligenceContextChangeCounter(): number {
  return changeCounter;
}

export function resetIntelligenceContextRegistryForTests(): void {
  currentContext = null;
  previousContext = null;
  activeConsumer = null;
  changeCounter = 0;
}
