/**
 * RTC-2:1 — Executive Journal Runtime Events.
 *
 * Foundation-recognised processing lifecycle events only (§2.2).
 * Declarations only — no dispatch, queues, or messaging.
 * Business event families are declared in metadata; typed payloads arrive later.
 *
 * Ownership: owned exclusively by RTC-2:1.
 */

import type {
  ExecutiveJournalRuntimeEventDeclaration,
  ExecutiveJournalRuntimeEventName,
} from "./executiveJournalRuntimeTypes.ts";

const event = (
  eventName: ExecutiveJournalRuntimeEventName,
  description: string,
  order: number,
): ExecutiveJournalRuntimeEventDeclaration =>
  Object.freeze({
    eventId: `RTC-2:1/Event/${eventName}` as const,
    eventName,
    description,
    dispatches: false as const,
    businessEvent: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly eight foundation-recognised Executive Journal processing events.
 */
export const ExecutiveJournalRuntimeEvents:
  readonly ExecutiveJournalRuntimeEventDeclaration[] = Object.freeze([
    event(
      "Propose",
      "An actor or approved adapter submits a typed event with provenance.",
      1,
    ),
    event(
      "Evaluate",
      "Identity, authority, policy, schema, replay protection, and sensitivity are checked.",
      2,
    ),
    event(
      "Confirm",
      "Consequential or ambiguous events require explicit human attestation before authority.",
      3,
    ),
    event(
      "Commit",
      "The runtime assigns ordering and integrity metadata and appends the event atomically.",
      4,
    ),
    event(
      "Project",
      "Deterministic consumers update materialized views and search indexes from accepted events.",
      5,
    ),
    event(
      "Notify",
      "Subscribers receive policy-filtered change notices, never unrestricted payloads.",
      6,
    ),
    event(
      "Review",
      "Owners resolve disputes, expirations, overdue commitments, and policy exceptions.",
      7,
    ),
    event(
      "Dispose",
      "Retention policy applies a recorded tombstone or cryptographic erasure action with disposition proof.",
      8,
    ),
  ]);

export const ExecutiveJournalRuntimeEventNames = Object.freeze([
  "Propose",
  "Evaluate",
  "Confirm",
  "Commit",
  "Project",
  "Notify",
  "Review",
  "Dispose",
] as const satisfies readonly ExecutiveJournalRuntimeEventName[]);
