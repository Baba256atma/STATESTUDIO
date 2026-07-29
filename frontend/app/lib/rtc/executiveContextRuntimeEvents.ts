/**
 * RTC-1:1 — Executive Context Runtime Events.
 *
 * Foundation-recognised runtime events only.
 * Declarations only — no dispatch, queues, or messaging.
 * Business events are introduced in later phases.
 *
 * Ownership: owned exclusively by RTC-1:1.
 */

import type {
  ExecutiveContextRuntimeEventDeclaration,
  ExecutiveContextRuntimeEventName,
} from "./executiveContextRuntimeTypes.ts";

const event = (
  eventName: ExecutiveContextRuntimeEventName,
  description: string,
  order: number,
): ExecutiveContextRuntimeEventDeclaration =>
  Object.freeze({
    eventId: `RTC-1:1/Event/${eventName}` as const,
    eventName,
    description,
    dispatches: false as const,
    businessEvent: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly six foundation-recognised Executive Context runtime events.
 */
export const ExecutiveContextRuntimeEvents:
  readonly ExecutiveContextRuntimeEventDeclaration[] = Object.freeze([
    event(
      "ContextCreated",
      "A new Executive Context identity has been created.",
      1,
    ),
    event(
      "ContextActivated",
      "An Executive Context has become the single active context.",
      2,
    ),
    event(
      "ContextUpdated",
      "A new immutable Executive Context snapshot replaced prior state.",
      3,
    ),
    event(
      "ContextSnapshotCreated",
      "A reproducible Executive Context snapshot was registered.",
      4,
    ),
    event(
      "ContextArchived",
      "An Executive Context left the active path and was archived.",
      5,
    ),
    event(
      "ContextRestored",
      "A prior Executive Context snapshot was restored into history replay.",
      6,
    ),
  ]);

export const ExecutiveContextRuntimeEventNames = Object.freeze([
  "ContextCreated",
  "ContextActivated",
  "ContextUpdated",
  "ContextSnapshotCreated",
  "ContextArchived",
  "ContextRestored",
] as const satisfies readonly ExecutiveContextRuntimeEventName[]);
