import { AUDIT_ACTIONS } from "./identityAuditEnums.ts";
import type { AuditAction } from "./identityAuditEnums.ts";
import type { AuditEvent } from "./identityAuditTypes.ts";

function sortEvents(events: readonly AuditEvent[]): readonly AuditEvent[] {
  return Object.freeze([...events].sort((left, right) => left.auditEventId.localeCompare(right.auditEventId)));
}

export function listCanonicalAuditActions(): readonly AuditAction[] {
  return AUDIT_ACTIONS;
}

export function getAuditEventsForActor(events: readonly AuditEvent[], actorIdentityId: string): readonly AuditEvent[] {
  return sortEvents(events.filter((event) => event.actor.actorIdentityId === actorIdentityId));
}

export function getAuditEventsForTarget(events: readonly AuditEvent[], targetIdentityId: string): readonly AuditEvent[] {
  return sortEvents(events.filter((event) => event.target.targetIdentityId === targetIdentityId));
}

export function getAuditEventsForSession(events: readonly AuditEvent[], sessionId: string): readonly AuditEvent[] {
  return sortEvents(events.filter((event) => event.session.sessionId === sessionId));
}

export function getAuditEventsForScope(events: readonly AuditEvent[], scopeIdentityId: string | "Global"): readonly AuditEvent[] {
  return sortEvents(events.filter((event) => event.scope.scopeIdentityId === scopeIdentityId));
}
