/**
 * APP-6:8 — Decision Replay cursor navigation.
 * Deterministic cursor movement over immutable event sequences.
 */

import type { DecisionEngineEvent } from "./decisionEventTypes.ts";
import type { DecisionReplayCursorAction } from "./decisionReplayTypes.ts";

export function clampCursorIndex(index: number, totalEvents: number): number {
  if (totalEvents <= 0) {
    return 0;
  }
  if (index < 0) {
    return 0;
  }
  if (index >= totalEvents) {
    return totalEvents - 1;
  }
  return index;
}

export function resolveCursorIndex(
  action: DecisionReplayCursorAction,
  currentIndex: number,
  totalEvents: number,
  targetIndex?: number,
  targetEventId?: string,
  events: readonly DecisionEngineEvent[] = []
): number | null {
  if (totalEvents === 0) {
    return 0;
  }

  switch (action) {
    case "next":
      return clampCursorIndex(currentIndex + 1, totalEvents);
    case "previous":
      return clampCursorIndex(currentIndex - 1, totalEvents);
    case "first":
      return 0;
    case "last":
      return totalEvents - 1;
    case "reset":
      return 0;
    case "jumpToIndex":
      if (targetIndex === undefined || !Number.isInteger(targetIndex)) {
        return null;
      }
      if (targetIndex < 0 || targetIndex >= totalEvents) {
        return null;
      }
      return targetIndex;
    case "jumpToEvent": {
      if (!targetEventId?.trim()) {
        return null;
      }
      const index = events.findIndex((event) => event.eventId === targetEventId);
      return index >= 0 ? index : null;
    }
    default:
      return null;
  }
}

export function resolveCurrentEvent(
  events: readonly DecisionEngineEvent[],
  cursorIndex: number
): DecisionEngineEvent | null {
  if (events.length === 0) {
    return null;
  }
  return events[cursorIndex] ?? null;
}

export function isFirstCursor(cursorIndex: number): boolean {
  return cursorIndex <= 0;
}

export function isLastCursor(cursorIndex: number, totalEvents: number): boolean {
  if (totalEvents <= 0) {
    return true;
  }
  return cursorIndex >= totalEvents - 1;
}

export const DecisionReplayCursor = Object.freeze({
  clampCursorIndex,
  resolveCursorIndex,
  resolveCurrentEvent,
  isFirstCursor,
  isLastCursor,
});
