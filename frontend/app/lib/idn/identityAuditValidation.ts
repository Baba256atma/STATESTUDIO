import { getIdentity, hasIdentity, type IdentityRegistry } from "./identityRegistryIndex.ts";
import { isIdentityScopeLevel, type IdentityScopeGraph } from "./identityScopeIndex.ts";
import type { SessionMetadata } from "./identitySessionIndex.ts";
import { AUDIT_ACTIONS, AUDIT_LIFECYCLE_STATES } from "./identityAuditEnums.ts";
import type { AuditAction, AuditLifecycleState } from "./identityAuditEnums.ts";
import type { IdentityAuditValidationIssue, IdentityAuditValidationResult } from "./identityAuditContracts.ts";
import type { AuditEvent } from "./identityAuditTypes.ts";

type StringRecord = Readonly<Record<string, unknown>>;

export function auditIssue(
  code: IdentityAuditValidationIssue["code"],
  field: string,
  message: string
): IdentityAuditValidationIssue {
  return Object.freeze({ code, field, message, severity: "error" as const });
}

export function auditValidationResult(
  issues: readonly IdentityAuditValidationIssue[]
): IdentityAuditValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze([...issues]) });
}

export function isAuditAction(value: unknown): value is AuditAction {
  return typeof value === "string" && AUDIT_ACTIONS.includes(value as AuditAction);
}

export function isAuditLifecycleState(value: unknown): value is AuditLifecycleState {
  return typeof value === "string" && AUDIT_LIFECYCLE_STATES.includes(value as AuditLifecycleState);
}

function isValidTimestamp(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && Number.isFinite(Date.parse(value));
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function isRecord(value: unknown): value is StringRecord {
  return typeof value === "object" && value !== null;
}

function readString(record: StringRecord | null, key: string): string | null {
  const value = record?.[key];
  return typeof value === "string" ? value : null;
}

function hasScope(graph: IdentityScopeGraph, scopeIdentityId: string | "Global"): boolean {
  if (scopeIdentityId === "Global") return true;
  return graph.scopes.some((scope) => scope.identityId === scopeIdentityId);
}

function hasSessionReference(sessions: readonly SessionMetadata[], sessionId: string | null): boolean {
  if (!sessionId) return true;
  return sessions.some((session) => session.sessionId === sessionId);
}

export function validateAuditEvent(
  event: AuditEvent,
  registry: IdentityRegistry,
  graph: IdentityScopeGraph,
  sessions: readonly SessionMetadata[] = []
): IdentityAuditValidationResult {
  const issues: IdentityAuditValidationIssue[] = [];
  const eventRecord = isRecord(event) ? event : null;
  const actorRecord = isRecord(eventRecord?.actor) ? eventRecord.actor : null;
  const targetRecord = isRecord(eventRecord?.target) ? eventRecord.target : null;
  const scopeRecord = isRecord(eventRecord?.scope) ? eventRecord.scope : null;
  const sessionRecord = isRecord(eventRecord?.session) ? eventRecord.session : null;

  const auditEventId = readString(eventRecord, "auditEventId");
  const action = eventRecord?.action;
  const lifecycleState = eventRecord?.lifecycleState;
  const occurredAt = eventRecord?.occurredAt;
  const version = eventRecord?.version;
  const actorIdentityId = readString(actorRecord, "actorIdentityId");
  const actorIdentityType = readString(actorRecord, "actorIdentityType");
  const targetIdentityId = readString(targetRecord, "targetIdentityId");
  const targetIdentityType = readString(targetRecord, "targetIdentityType");
  const targetResourceType = readString(targetRecord, "resourceType");
  const scopeIdentityId = readString(scopeRecord, "scopeIdentityId");
  const scopeLevel = scopeRecord?.scopeLevel;
  const sessionId = readString(sessionRecord, "sessionId");
  const sessionIdentityId = readString(sessionRecord, "sessionIdentityId");
  const actor = actorIdentityId ? getIdentity(registry, actorIdentityId) : null;
  const target = targetIdentityId ? getIdentity(registry, targetIdentityId) : null;

  if (!auditEventId?.trim() || !isPositiveInteger(version)) {
    issues.push(auditIssue("invalid_audit_event", "auditEventId", "Audit event requires id and version."));
  }
  if (!isAuditAction(action)) {
    issues.push(auditIssue("invalid_audit_action", "action", "Audit action is not canonical."));
  }
  if (!isAuditLifecycleState(lifecycleState)) {
    issues.push(auditIssue("invalid_lifecycle", "lifecycleState", "Audit lifecycle is not canonical."));
  }
  if (!isValidTimestamp(occurredAt)) {
    issues.push(auditIssue("invalid_timestamp", "occurredAt", "Audit event timestamp is invalid."));
  }
  if (!actor || actor.type !== actorIdentityType) {
    issues.push(auditIssue("invalid_actor", "actor", "Audit actor is invalid."));
  }
  if (!target || target.type !== targetIdentityType || !targetResourceType?.trim()) {
    issues.push(auditIssue("invalid_target", "target", "Audit target is invalid."));
  }
  if (!isIdentityScopeLevel(scopeLevel) || !scopeIdentityId || !hasScope(graph, scopeIdentityId)) {
    issues.push(auditIssue("invalid_scope", "scope", "Audit scope is invalid."));
  }
  if (
    (sessionIdentityId && !hasIdentity(registry, sessionIdentityId)) ||
    !hasSessionReference(sessions, sessionId)
  ) {
    issues.push(auditIssue("invalid_session_reference", "session", "Audit session reference is invalid."));
  }

  return auditValidationResult(issues);
}

export function validateAuditEventCollection(
  events: readonly AuditEvent[],
  registry: IdentityRegistry,
  graph: IdentityScopeGraph,
  sessions: readonly SessionMetadata[] = []
): IdentityAuditValidationResult {
  const issues: IdentityAuditValidationIssue[] = [];
  const seen = new Set<string>();

  events.forEach((event, index) => {
    validateAuditEvent(event, registry, graph, sessions).issues.forEach((issue) => {
      issues.push(auditIssue(issue.code, `${index}.${issue.field}`, issue.message));
    });
    const eventRecord = isRecord(event) ? event : null;
    const auditEventId = readString(eventRecord, "auditEventId");
    if (auditEventId && seen.has(auditEventId)) {
      issues.push(auditIssue("duplicate_audit_event", `${index}.auditEventId`, "Audit event id is duplicated."));
    }
    if (auditEventId) {
      seen.add(auditEventId);
    }
  });

  return auditValidationResult(issues);
}
