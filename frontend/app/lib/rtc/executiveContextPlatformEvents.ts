/**
 * RTC-1:6 — Executive Context Platform Events.
 *
 * Runtime event channel identities and publishing rules.
 * Event transport implementation is introduced later.
 *
 * Ownership: owned exclusively by RTC-1:6.
 */

/** Canonical platform event name. */
export type ExecutiveContextPlatformEventName =
  | "ContextInitialized"
  | "ContextActivated"
  | "ContextUpdated"
  | "ContextSnapshotCreated"
  | "ContextArchived"
  | "ContextRestored";

/** Platform event declaration. */
export interface ExecutiveContextPlatformEventDeclaration {
  readonly eventId: `RTC-1:6/Event/${ExecutiveContextPlatformEventName}`;
  readonly eventName: ExecutiveContextPlatformEventName;
  readonly description: string;
  readonly order: number;
  readonly transportImplemented: false;
  readonly publishingRule: string;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const event = (
  eventName: ExecutiveContextPlatformEventName,
  description: string,
  publishingRule: string,
  order: number,
): ExecutiveContextPlatformEventDeclaration =>
  Object.freeze({
    eventId: `RTC-1:6/Event/${eventName}` as const,
    eventName,
    description,
    order,
    transportImplemented: false as const,
    publishingRule,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly six canonical Runtime events. */
export const ExecutiveContextPlatformEvents = Object.freeze([
  event(
    "ContextInitialized",
    "Executive Context has been initialized.",
    "Publish after successful Initialize lifecycle operation.",
    1,
  ),
  event(
    "ContextActivated",
    "Executive Context has become the single active context.",
    "Publish after successful Activate lifecycle operation.",
    2,
  ),
  event(
    "ContextUpdated",
    "Executive Context was replaced by an updated immutable snapshot.",
    "Publish after successful Update lifecycle operation.",
    3,
  ),
  event(
    "ContextSnapshotCreated",
    "A reproducible Executive Context snapshot was registered.",
    "Publish after Snapshot Service registration succeeds.",
    4,
  ),
  event(
    "ContextArchived",
    "Executive Context left the active path and was archived.",
    "Publish after successful Archive lifecycle operation.",
    5,
  ),
  event(
    "ContextRestored",
    "A prior Executive Context snapshot was restored.",
    "Publish after successful Restore lifecycle operation.",
    6,
  ),
] as const);

export const ExecutiveContextPlatformEventNames = Object.freeze([
  "ContextInitialized",
  "ContextActivated",
  "ContextUpdated",
  "ContextSnapshotCreated",
  "ContextArchived",
  "ContextRestored",
] as const satisfies readonly ExecutiveContextPlatformEventName[]);

/** Event platform catalogue. */
export const ExecutiveContextPlatformEventChannel = Object.freeze({
  channelId: "RTC-1:6/EventChannel",
  events: ExecutiveContextPlatformEvents,
  eventCount: ExecutiveContextPlatformEvents.length,
  transportImplemented: false as const,
  stableEventIdentities: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
