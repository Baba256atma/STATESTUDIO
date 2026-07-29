/**
 * RTC-3:1 — Executive Decision Register Events.
 *
 * Canonical decision-event descriptors only.
 * No dispatch, persistence, queues, or messaging.
 *
 * Ownership: owned exclusively by RTC-3:1.
 */

import type {
  ExecutiveDecisionRegisterEventDeclaration,
  ExecutiveDecisionRegisterEventName,
} from "./executiveDecisionRegisterTypes.ts";

const event = (
  eventName: ExecutiveDecisionRegisterEventName,
  description: string,
  order: number,
): ExecutiveDecisionRegisterEventDeclaration =>
  Object.freeze({
    eventId: `RTC-3:1/Event/${eventName}` as const,
    eventName,
    description,
    dispatches: false as const,
    persists: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly ten canonical Executive Decision Register event descriptors.
 */
export const ExecutiveDecisionRegisterEvents:
  readonly ExecutiveDecisionRegisterEventDeclaration[] = Object.freeze([
    event(
      "DecisionProposed",
      "A decision claim is proposed with actor, purpose, and evidence references. Non-authoritative.",
      1,
    ),
    event(
      "DecisionConfirmed",
      "An authorized human confirms the exact proposal, claim, authority, evidence, and intended effect.",
      2,
    ),
    event(
      "DecisionBecameEffective",
      "The confirmed decision becomes the currently operative decision for its scope.",
      3,
    ),
    event(
      "DecisionCorrected",
      "A correction appends a new event; the original claim remains in history.",
      4,
    ),
    event(
      "DecisionDisputed",
      "A dispute is recorded against a decision while preserving the challenged record.",
      5,
    ),
    event(
      "DecisionDisputeResolved",
      "Dispute resolution appends a new event; it does not erase the dispute or original decision.",
      6,
    ),
    event(
      "DecisionSuperseded",
      "A successor replaces the operative decision; predecessor and replacement refs are preserved.",
      7,
    ),
    event(
      "DecisionClosed",
      "Closure evidence is appended; history remains available for provenance.",
      8,
    ),
    event(
      "DecisionOutcomeReferenced",
      "An outcome reference is attached without inventing outcome facts in the register.",
      9,
    ),
    event(
      "DecisionDisposed",
      "Disposition governance evidence is appended; history is not erased.",
      10,
    ),
  ]);

export const ExecutiveDecisionRegisterEventNames = Object.freeze([
  "DecisionProposed",
  "DecisionConfirmed",
  "DecisionBecameEffective",
  "DecisionCorrected",
  "DecisionDisputed",
  "DecisionDisputeResolved",
  "DecisionSuperseded",
  "DecisionClosed",
  "DecisionOutcomeReferenced",
  "DecisionDisposed",
] as const);

export function isCanonicalDecisionRegisterEventName(
  value: unknown,
): value is ExecutiveDecisionRegisterEventName {
  return typeof value === "string"
    && (ExecutiveDecisionRegisterEventNames as readonly string[]).includes(
      value,
    );
}
