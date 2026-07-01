import { getIdentity, hasIdentity, type IdentityRegistry } from "./identityRegistryIndex.ts";
import { isPermissionAction, isPermissionResource, type PermissionAssignment } from "./identityPermissionIndex.ts";
import { AUTHORIZATION_DECISIONS, AUTHORIZATION_REASONS } from "./identityAuthorizationEnums.ts";
import type { AuthorizationDecisionValue, AuthorizationReason } from "./identityAuthorizationEnums.ts";
import type { IdentityScopeGraph } from "./identityScopeIndex.ts";
import type {
  IdentityAuthorizationValidationIssue,
  IdentityAuthorizationValidationResult,
} from "./identityAuthorizationContracts.ts";
import type { AuthorizationDecision, AuthorizationRequest } from "./identityAuthorizationTypes.ts";

export function authorizationIssue(
  code: IdentityAuthorizationValidationIssue["code"],
  field: string,
  message: string
): IdentityAuthorizationValidationIssue {
  return Object.freeze({ code, field, message, severity: "error" as const });
}

export function authorizationValidationResult(
  issues: readonly IdentityAuthorizationValidationIssue[]
): IdentityAuthorizationValidationResult {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze([...issues]) });
}

export function isAuthorizationDecision(value: unknown): value is AuthorizationDecisionValue {
  return typeof value === "string" && AUTHORIZATION_DECISIONS.includes(value as AuthorizationDecisionValue);
}

export function isAuthorizationReason(value: unknown): value is AuthorizationReason {
  return typeof value === "string" && AUTHORIZATION_REASONS.includes(value as AuthorizationReason);
}

function isValidTimestamp(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && Number.isFinite(Date.parse(value));
}

function hasScope(graph: IdentityScopeGraph, scopeIdentityId: string | "Global"): boolean {
  if (scopeIdentityId === "Global") return true;
  return graph.scopes.some((scope) => scope.identityId === scopeIdentityId);
}

export function validateAuthorizationRequest(
  request: AuthorizationRequest,
  registry: IdentityRegistry,
  graph: IdentityScopeGraph
): IdentityAuthorizationValidationResult {
  const issues: IdentityAuthorizationValidationIssue[] = [];

  if (!request.requestId.trim() || !isValidTimestamp(request.timestamp)) {
    issues.push(authorizationIssue("invalid_request", "request", "Authorization request requires id and timestamp."));
  }
  if (!request.subjectIdentityId.trim() || !hasIdentity(registry, request.subjectIdentityId) || !getIdentity(registry, request.subjectIdentityId)) {
    issues.push(authorizationIssue("missing_identity", "subjectIdentityId", "Authorization subject identity is missing."));
  }
  if (!isPermissionAction(request.action)) {
    issues.push(authorizationIssue("invalid_action", "action", "Authorization action is not canonical."));
  }
  if (!isPermissionResource(request.resource)) {
    issues.push(authorizationIssue("invalid_resource", "resource", "Authorization resource is not canonical."));
  }
  if (!hasScope(graph, request.scopeIdentityId)) {
    issues.push(authorizationIssue("missing_scope", "scopeIdentityId", "Authorization scope is missing."));
  }

  return authorizationValidationResult(issues);
}

export function validateAuthorizationDecision(decision: AuthorizationDecision): IdentityAuthorizationValidationResult {
  const issues: IdentityAuthorizationValidationIssue[] = [];

  if (!decision.decisionId.trim() || !decision.requestId.trim()) {
    issues.push(authorizationIssue("invalid_decision", "decision", "Authorization decision requires ids."));
  }
  if (!isAuthorizationDecision(decision.decision)) {
    issues.push(authorizationIssue("invalid_decision", "decision", "Authorization decision value is not canonical."));
  }
  if (decision.denialReason !== null && !isAuthorizationReason(decision.denialReason)) {
    issues.push(authorizationIssue("invalid_decision", "denialReason", "Authorization denial reason is not canonical."));
  }

  return authorizationValidationResult(issues);
}

export function validateAuthorizationPermissionSet(
  permissionAssignments: readonly PermissionAssignment[]
): IdentityAuthorizationValidationResult {
  const issues: IdentityAuthorizationValidationIssue[] = [];
  const seen = new Set<string>();

  permissionAssignments.forEach((permission, index) => {
    if (seen.has(permission.assignmentId)) {
      issues.push(authorizationIssue("duplicate_permission", `${index}.assignmentId`, "Permission assignment is duplicated."));
    }
    seen.add(permission.assignmentId);
    if (permission.lifecycleState !== "Active") {
      issues.push(authorizationIssue("inactive_permission", `${index}.lifecycleState`, "Permission assignment is inactive."));
    }
  });

  return authorizationValidationResult(issues);
}
