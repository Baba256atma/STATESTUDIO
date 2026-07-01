import { getIdentity, hasIdentity, type IdentityRegistry } from "./identityRegistryIndex.ts";
import { isIdentityScopeLevel, type IdentityScopeGraph } from "./identityScopeIndex.ts";
import { isPermissionAction, isPermissionLifecycleState, isPermissionResource } from "./identityPermissionIndex.ts";
import { isRoleLifecycleState } from "./identityRoleIndex.ts";
import { SESSION_LIFECYCLE_STATES } from "./identitySessionEnums.ts";
import type { SessionLifecycleState } from "./identitySessionEnums.ts";
import type {
  IdentitySessionValidationIssue,
  IdentitySessionValidationResult,
} from "./identitySessionContracts.ts";
import type { SessionContext, SessionMetadata, SessionPermissionSnapshot, SessionRoleSnapshot } from "./identitySessionTypes.ts";

export function sessionIssue(
  code: IdentitySessionValidationIssue["code"],
  field: string,
  message: string
): IdentitySessionValidationIssue {
  return Object.freeze({ code, field, message, severity: "error" as const });
}

export function sessionValidationResult(
  issues: readonly IdentitySessionValidationIssue[]
): IdentitySessionValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze([...issues]) });
}

export function isSessionLifecycleState(value: unknown): value is SessionLifecycleState {
  return typeof value === "string" && SESSION_LIFECYCLE_STATES.includes(value as SessionLifecycleState);
}

export function isSessionActive(metadata: Pick<SessionMetadata, "lifecycleState">): boolean {
  return metadata.lifecycleState === "Active";
}

function isValidTimestamp(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && Number.isFinite(Date.parse(value));
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function hasScope(graph: IdentityScopeGraph, scopeIdentityId: string | "Global"): boolean {
  if (scopeIdentityId === "Global") return true;
  return graph.scopes.some((scope) => scope.identityId === scopeIdentityId);
}

function validateRoleSnapshot(snapshot: SessionRoleSnapshot, index: number): readonly IdentitySessionValidationIssue[] {
  const issues: IdentitySessionValidationIssue[] = [];
  if (!snapshot.roleId.trim() || !snapshot.sourceAssignmentId.trim()) {
    issues.push(sessionIssue("invalid_snapshot", `roleSnapshots.${index}`, "Role snapshot requires ids."));
  }
  if (!isIdentityScopeLevel(snapshot.scopeLevel)) {
    issues.push(sessionIssue("invalid_scope", `roleSnapshots.${index}.scopeLevel`, "Role snapshot scope is invalid."));
  }
  if (!isRoleLifecycleState(snapshot.lifecycleState)) {
    issues.push(sessionIssue("invalid_snapshot", `roleSnapshots.${index}.lifecycleState`, "Role snapshot lifecycle is invalid."));
  }
  return issues;
}

function validatePermissionSnapshot(
  snapshot: SessionPermissionSnapshot,
  index: number
): readonly IdentitySessionValidationIssue[] {
  const issues: IdentitySessionValidationIssue[] = [];
  if (!snapshot.permissionId.trim() || !snapshot.sourceAssignmentId.trim()) {
    issues.push(sessionIssue("invalid_snapshot", `permissionSnapshots.${index}`, "Permission snapshot requires ids."));
  }
  if (!isPermissionAction(snapshot.action)) {
    issues.push(sessionIssue("invalid_snapshot", `permissionSnapshots.${index}.action`, "Permission snapshot action is invalid."));
  }
  if (!isPermissionResource(snapshot.resource)) {
    issues.push(sessionIssue("invalid_snapshot", `permissionSnapshots.${index}.resource`, "Permission snapshot resource is invalid."));
  }
  if (!isIdentityScopeLevel(snapshot.scopeLevel)) {
    issues.push(sessionIssue("invalid_scope", `permissionSnapshots.${index}.scopeLevel`, "Permission snapshot scope is invalid."));
  }
  if (!isPermissionLifecycleState(snapshot.lifecycleState)) {
    issues.push(sessionIssue("invalid_snapshot", `permissionSnapshots.${index}.lifecycleState`, "Permission snapshot lifecycle is invalid."));
  }
  return issues;
}

export function validateSessionMetadata(
  metadata: SessionMetadata,
  registry: IdentityRegistry,
  graph: IdentityScopeGraph
): IdentitySessionValidationResult {
  const issues: IdentitySessionValidationIssue[] = [];
  const subject = getIdentity(registry, metadata.subjectIdentityId);

  if (!metadata.sessionId.trim() || !isPositiveInteger(metadata.version)) {
    issues.push(sessionIssue("invalid_session_metadata", "session", "Session metadata requires id and version."));
  }
  if (!hasIdentity(registry, metadata.sessionIdentityId)) {
    issues.push(sessionIssue("invalid_session_identity", "sessionIdentityId", "Session identity is missing."));
  }
  if (!subject || subject.type !== metadata.subjectIdentityType) {
    issues.push(sessionIssue("invalid_subject_identity", "subjectIdentityId", "Session subject identity is invalid."));
  }
  if (!isSessionLifecycleState(metadata.lifecycleState)) {
    issues.push(sessionIssue("invalid_lifecycle", "lifecycleState", "Session lifecycle is not canonical."));
  }
  if (!isValidTimestamp(metadata.createdAt) || !isValidTimestamp(metadata.updatedAt)) {
    issues.push(sessionIssue("invalid_timestamp", "timestamps", "Session timestamps are invalid."));
  }
  if (!isIdentityScopeLevel(metadata.scope.activeScopeLevel) || !hasScope(graph, metadata.scope.activeScopeIdentityId)) {
    issues.push(sessionIssue("invalid_scope", "scope", "Session active scope is invalid."));
  }
  metadata.roleSnapshots.forEach((snapshot, index) => issues.push(...validateRoleSnapshot(snapshot, index)));
  metadata.permissionSnapshots.forEach((snapshot, index) => issues.push(...validatePermissionSnapshot(snapshot, index)));

  return sessionValidationResult(issues);
}

export function validateSessionContext(
  context: SessionContext,
  metadata: SessionMetadata,
  graph: IdentityScopeGraph
): IdentitySessionValidationResult {
  const issues: IdentitySessionValidationIssue[] = [];

  if (!context.contextId.trim() || context.sessionId !== metadata.sessionId) {
    issues.push(sessionIssue("invalid_session_context", "context", "Session context requires ids that match metadata."));
  }
  if (context.subjectIdentityId !== metadata.subjectIdentityId) {
    issues.push(sessionIssue("invalid_session_context", "subjectIdentityId", "Session context subject does not match metadata."));
  }
  if (!isSessionLifecycleState(context.lifecycleState)) {
    issues.push(sessionIssue("invalid_lifecycle", "lifecycleState", "Session context lifecycle is not canonical."));
  }
  if (!isIdentityScopeLevel(context.activeScopeLevel) || !hasScope(graph, context.activeScopeIdentityId)) {
    issues.push(sessionIssue("invalid_scope", "activeScopeIdentityId", "Session context active scope is invalid."));
  }
  if (!isPositiveInteger(context.version)) {
    issues.push(sessionIssue("invalid_session_context", "version", "Session context version must be positive."));
  }

  return sessionValidationResult(issues);
}
