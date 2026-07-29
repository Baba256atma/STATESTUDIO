/**
 * EX-1:6 — Executive Stage Event Bus.
 *
 * Canonical Stage event model. Events are immutable.
 * Event transport implementation is introduced later.
 *
 * Ownership: owned exclusively by EX-1:6.
 */

/** Canonical Stage platform event name. */
export type ExecutiveStagePlatformEventName =
  | "StageCreated"
  | "StageInitialized"
  | "RuntimeAttached"
  | "RuntimeUpdated"
  | "FocusChanged"
  | "WorkspaceChanged"
  | "TimelineChanged"
  | "StageDisposed";

/** Platform event declaration. */
export interface ExecutiveStagePlatformEventDeclaration {
  readonly eventId: `EX-1:6/Event/${ExecutiveStagePlatformEventName}`;
  readonly eventName: ExecutiveStagePlatformEventName;
  readonly description: string;
  readonly order: number;
  readonly transportImplemented: false;
  readonly immutableEvent: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const event = (
  eventName: ExecutiveStagePlatformEventName,
  description: string,
  order: number,
): ExecutiveStagePlatformEventDeclaration =>
  Object.freeze({
    eventId: `EX-1:6/Event/${eventName}` as const,
    eventName,
    description,
    order,
    transportImplemented: false as const,
    immutableEvent: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly eight canonical Stage events. */
export const ExecutiveStagePlatformEvents = Object.freeze([
  event("StageCreated", "Executive Stage identity has been created.", 1),
  event(
    "StageInitialized",
    "Executive Stage platform services have been initialized.",
    2,
  ),
  event(
    "RuntimeAttached",
    "Executive Context Runtime has been attached to the Stage.",
    3,
  ),
  event(
    "RuntimeUpdated",
    "Runtime update has been received by the Stage.",
    4,
  ),
  event("FocusChanged", "Executive focus projection has changed.", 5),
  event("WorkspaceChanged", "Active workspace projection has changed.", 6),
  event("TimelineChanged", "Timeline projection has changed.", 7),
  event("StageDisposed", "Executive Stage has been disposed.", 8),
] as const);

export const ExecutiveStagePlatformEventNames = Object.freeze([
  "StageCreated",
  "StageInitialized",
  "RuntimeAttached",
  "RuntimeUpdated",
  "FocusChanged",
  "WorkspaceChanged",
  "TimelineChanged",
  "StageDisposed",
] as const satisfies readonly ExecutiveStagePlatformEventName[]);

/** Event bus catalogue. */
export const ExecutiveStageEventBus = Object.freeze({
  busId: "EX-1:6/EventBus",
  events: ExecutiveStagePlatformEvents,
  eventNames: ExecutiveStagePlatformEventNames,
  eventCount: ExecutiveStagePlatformEvents.length,
  transportImplemented: false as const,
  immutableEventFlow: true as const,
  stableEventIdentities: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
