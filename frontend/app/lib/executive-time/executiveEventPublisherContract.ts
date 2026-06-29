/**
 * APP-1:6.5 — Executive Event Publisher Contract.
 * Publishers generate requests only — never store, modify, or replay events.
 */

import type {
  ExecutiveEventPublishRequest,
  ExecutiveEventPublishResult,
} from "./executiveEventAuthorityTypes.ts";
import { EXECUTIVE_EVENT_PUBLISHER_OWNER } from "./executiveEventAuthorityTypes.ts";

export type ExecutiveEventPublisherContract = Readonly<{
  publisherOwner: typeof EXECUTIVE_EVENT_PUBLISHER_OWNER;
  publishExecutiveEvent: (request: ExecutiveEventPublishRequest) => ExecutiveEventPublishResult;
  mayStoreEvent: false;
  mayModifyEvent: false;
  mayReplayEvent: false;
  mayChangeEventId: false;
}>;

export type ExecutiveEventPublisherValidationResult = Readonly<{
  valid: boolean;
  messages: readonly string[];
}>;

export function validateExecutiveEventPublisherRequest(
  request: ExecutiveEventPublishRequest
): ExecutiveEventPublisherValidationResult {
  const messages: string[] = [];
  if (!request.workspaceId.trim()) messages.push("workspaceId is required.");
  if (!request.entityId.trim()) messages.push("entityId is required.");
  if (!request.sourceModule.trim()) messages.push("sourceModule is required.");
  if (!request.sourceComponent.trim()) messages.push("sourceComponent is required.");
  if (!request.timestamp.trim()) messages.push("timestamp is required.");
  if (!request.actor.trim()) messages.push("actor is required.");
  if (!request.reason.trim()) messages.push("reason is required.");
  return Object.freeze({
    valid: messages.length === 0,
    messages: Object.freeze(messages),
  });
}

export const EXECUTIVE_EVENT_PUBLISHER_RULES = Object.freeze({
  mayCreateRequest: true,
  mayStoreEvent: false,
  mayModifyEvent: false,
  mayReplayEvent: false,
  mayChangeEventId: false,
});

export const ExecutiveEventPublisherContractDeclaration: ExecutiveEventPublisherContract = Object.freeze({
  publisherOwner: EXECUTIVE_EVENT_PUBLISHER_OWNER,
  publishExecutiveEvent: () => {
    throw new Error("Publisher contract only — use Executive Event Authority publish path.");
  },
  mayStoreEvent: false,
  mayModifyEvent: false,
  mayReplayEvent: false,
  mayChangeEventId: false,
});
