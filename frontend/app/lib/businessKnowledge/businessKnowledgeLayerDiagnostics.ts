/**
 * PHASE-2 / DS1:3 — Business Knowledge Layer diagnostics.
 * Semantic lifecycle events only — no runtime or intelligence logic.
 */

import {
  BUSINESS_KNOWLEDGE_LAYER_SOURCE,
  NEXORA_BUSINESS_KNOWLEDGE_LAYER_LOG_PREFIX,
} from "./businessKnowledgeLayerContract.ts";
import type {
  BusinessKnowledgeDiagnosticEntry,
  BusinessKnowledgeEvent,
  BusinessKnowledgeEventType,
  BusinessKnowledgeWorkspaceId,
} from "./businessKnowledgeLayerTypes.ts";

const eventLog: BusinessKnowledgeEvent[] = [];
const diagnosticLog: BusinessKnowledgeDiagnosticEntry[] = [];

function nowIso(): string {
  return new Date().toISOString();
}

export function recordBusinessKnowledgeEvent(input: {
  type: BusinessKnowledgeEventType;
  knowledgeArtifactId?: string | null;
  workspaceId?: BusinessKnowledgeWorkspaceId | null;
}): BusinessKnowledgeEvent {
  const event = Object.freeze({
    type: input.type,
    knowledgeArtifactId: input.knowledgeArtifactId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    timestamp: nowIso(),
  });
  eventLog.push(event);
  return event;
}

export function recordBusinessKnowledgeDiagnostic(input: {
  type: BusinessKnowledgeEventType;
  knowledgeArtifactId?: string | null;
  workspaceId?: BusinessKnowledgeWorkspaceId | null;
  message: string;
}): BusinessKnowledgeDiagnosticEntry {
  const entry = Object.freeze({
    knowledgeArtifactId: input.knowledgeArtifactId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    event: input.type,
    message: input.message.trim(),
    generatedAt: nowIso(),
  });
  diagnosticLog.push(entry);
  if (process.env.NODE_ENV !== "production") {
    console.debug(NEXORA_BUSINESS_KNOWLEDGE_LAYER_LOG_PREFIX, {
      source: BUSINESS_KNOWLEDGE_LAYER_SOURCE,
      ...entry,
    });
  }
  return entry;
}

export function getBusinessKnowledgeEvents(): readonly BusinessKnowledgeEvent[] {
  return Object.freeze([...eventLog]);
}

export function getBusinessKnowledgeDiagnosticsLog(): readonly BusinessKnowledgeDiagnosticEntry[] {
  return Object.freeze([...diagnosticLog]);
}

export function resetBusinessKnowledgeDiagnosticsForTests(): void {
  eventLog.length = 0;
  diagnosticLog.length = 0;
}

export const BusinessKnowledgeLayerDiagnostics = Object.freeze({
  recordBusinessKnowledgeEvent,
  recordBusinessKnowledgeDiagnostic,
  getBusinessKnowledgeEvents,
  getBusinessKnowledgeDiagnosticsLog,
  resetBusinessKnowledgeDiagnosticsForTests,
});
