/**
 * MRP:7:4 — Conversation continuity runtime merge logic.
 *
 * Preserves conversation session across tab, workspace, route, and object changes.
 * Updates awareness copies only — never dashboard authority.
 */

import type { ExecutiveConversationContinuity } from "./conversationContinuityContract.ts";
import {
  buildConversationContinuityFromSyncSummary,
  createInitialConversationContinuity,
  warnConversationContinuityBrake,
  type ConversationContinuityUpdateResult,
} from "./conversationContinuityContract.ts";

let sessionCounter = 0;

export function createConversationSessionId(): string {
  sessionCounter += 1;
  return `exec-conv-${Date.now()}-${sessionCounter}`;
}

export function resetConversationContinuityRuntimeForTests(): void {
  sessionCounter = 0;
}

export function initializeConversationContinuity(
  sessionId?: string
): ExecutiveConversationContinuity {
  return createInitialConversationContinuity(sessionId ?? createConversationSessionId());
}

export function mergeConversationContinuityFromSync(
  prev: ExecutiveConversationContinuity,
  syncValue: unknown,
  options: { expectedSessionId?: string } = {}
): ConversationContinuityUpdateResult {
  if (options.expectedSessionId && options.expectedSessionId !== prev.sessionId) {
    warnConversationContinuityBrake("Conversation reset detected.", {
      expected: options.expectedSessionId,
      actual: prev.sessionId,
    });
    return Object.freeze({
      accepted: false,
      continuity: prev,
      reason: "conversation_reset_detected",
      resetDetected: true,
    });
  }

  const result = buildConversationContinuityFromSyncSummary(prev, syncValue);
  if (!result.accepted) {
    return Object.freeze({
      ...result,
      continuity: prev,
      resetDetected: false,
    });
  }

  if (process.env.NODE_ENV !== "production") {
    globalThis.console?.debug?.("[ConversationContinuity][Merge]", {
      sessionId: result.continuity?.sessionId,
      signature: result.continuity?.continuitySignature,
      awarenessLevel: result.continuity?.awareness.awarenessLevel,
    });
  }

  return result;
}

export function assertAssistantCannotMutateDashboard(
  mutationKind: string
): void {
  warnConversationContinuityBrake("Unauthorized dashboard mutation.", { mutationKind });
}
