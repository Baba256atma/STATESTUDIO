import type { DebugEvent } from "./debugEventTypes";

const MAX_EVENTS = 200;

let events: DebugEvent[] = [];

export function appendDebugEvent(event: DebugEvent): void {
  events = events.length >= MAX_EVENTS ? [...events.slice(-(MAX_EVENTS - 1)), event] : [...events, event];
}

export function getRecentDebugEvents(): DebugEvent[] {
  return events.slice();
}

export function clearDebugEvents(): void {
  events = [];
}

export function getDebugEventCount(): number {
  return events.length;
}
