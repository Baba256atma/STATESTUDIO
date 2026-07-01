import { IDENTITY_AUTHORIZATION_CONTRACT_VERSION } from "./identityAuthorizationEnums.ts";
import type {
  AuthorizationDecision,
  AuthorizationExplanation,
  AuthorizationMetadata,
  CreateAuthorizationRequestInput,
  AuthorizationRequest,
} from "./identityAuthorizationTypes.ts";
import type { AuthorizationDecisionValue, AuthorizationReason } from "./identityAuthorizationEnums.ts";

function freezeMetadata(metadata: AuthorizationMetadata | undefined): AuthorizationMetadata {
  return Object.freeze({ ...(metadata ?? {}) });
}

export function createAuthorizationRequest(input: CreateAuthorizationRequestInput): AuthorizationRequest {
  return Object.freeze({
    contractVersion: IDENTITY_AUTHORIZATION_CONTRACT_VERSION,
    requestId: input.requestId,
    subjectIdentityId: input.subjectIdentityId,
    action: input.action,
    resource: input.resource,
    resourceIdentityId: input.resourceIdentityId ?? null,
    scopeIdentityId: input.scopeIdentityId,
    timestamp: input.timestamp,
    metadata: freezeMetadata(input.metadata),
  });
}

export function createAuthorizationDecision(input: {
  requestId: string;
  decision: AuthorizationDecisionValue;
  matchedRoleIds: readonly string[];
  matchedPermissionIds: readonly string[];
  evaluatedScope: string | "Global" | null;
  evaluatedIdentity: string | null;
  explanation: AuthorizationExplanation;
  denialReason: AuthorizationReason | null;
  metadata?: AuthorizationMetadata;
}): AuthorizationDecision {
  return Object.freeze({
    contractVersion: IDENTITY_AUTHORIZATION_CONTRACT_VERSION,
    decisionId: `authorization:${input.requestId}:${input.decision}`,
    requestId: input.requestId,
    decision: input.decision,
    matchedRoleIds: Object.freeze([...input.matchedRoleIds].sort((left, right) => left.localeCompare(right))),
    matchedPermissionIds: Object.freeze([...input.matchedPermissionIds].sort((left, right) => left.localeCompare(right))),
    evaluatedScope: input.evaluatedScope,
    evaluatedIdentity: input.evaluatedIdentity,
    explanation: input.explanation,
    denialReason: input.denialReason,
    metadata: freezeMetadata(input.metadata),
  });
}
