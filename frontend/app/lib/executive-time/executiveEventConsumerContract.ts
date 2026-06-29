/**
 * APP-1:6.5 — Executive Event Consumer Contract.
 * Read-only event consumption — consumers never mutate canonical events.
 */

import type { ExecutiveEvent } from "./executiveEventAuthorityTypes.ts";
import { EXECUTIVE_EVENT_CONSUMER_OWNER } from "./executiveEventAuthorityTypes.ts";

export type ExecutiveEventConsumerContract = Readonly<{
  consumerOwner: typeof EXECUTIVE_EVENT_CONSUMER_OWNER;
  receiveExecutiveEvent: (event: ExecutiveEvent) => Readonly<{ received: true; mutated: false }>;
  mayMutateEvent: false;
  mayCreateEvent: false;
  mayReplayEvent: false;
}>;

export type ExecutiveEventConsumerValidationResult = Readonly<{
  valid: boolean;
  messages: readonly string[];
}>;

export function validateExecutiveEventConsumerInput(
  event: ExecutiveEvent | null | undefined
): ExecutiveEventConsumerValidationResult {
  if (!event) {
    return Object.freeze({ valid: false, messages: Object.freeze(["ExecutiveEvent is required."]) });
  }
  const messages: string[] = [];
  if (!event.id.trim()) messages.push("event.id is required.");
  if (!event.workspaceId.trim()) messages.push("event.workspaceId is required.");
  if (!event.timestamp.trim()) messages.push("event.timestamp is required.");
  return Object.freeze({
    valid: messages.length === 0,
    messages: Object.freeze(messages),
  });
}

export function receiveExecutiveEvent(event: ExecutiveEvent): Readonly<{ received: true; mutated: false }> {
  const validation = validateExecutiveEventConsumerInput(event);
  if (!validation.valid) {
    throw new Error(validation.messages[0] ?? "Invalid executive event for consumption.");
  }
  return Object.freeze({ received: true, mutated: false });
}

export const EXECUTIVE_EVENT_CONSUMER_RULES = Object.freeze({
  readOnly: true,
  mayMutateEvent: false,
  mayCreateEvent: false,
  mayReplayEvent: false,
});

export const ExecutiveEventConsumerContractDeclaration: ExecutiveEventConsumerContract = Object.freeze({
  consumerOwner: EXECUTIVE_EVENT_CONSUMER_OWNER,
  receiveExecutiveEvent,
  mayMutateEvent: false,
  mayCreateEvent: false,
  mayReplayEvent: false,
});
