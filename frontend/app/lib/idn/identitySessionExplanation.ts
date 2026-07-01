import { isSessionActive } from "./identitySessionValidation.ts";
import type { SessionMetadata, SessionStateExplanation } from "./identitySessionTypes.ts";

export function explainSessionState(metadata: SessionMetadata): SessionStateExplanation {
  const reasons = metadata.lifecycleState === "Active" ? ["SessionActive"] : [`Session${metadata.lifecycleState}`];
  return Object.freeze({
    sessionId: metadata.sessionId,
    subjectIdentityId: metadata.subjectIdentityId,
    lifecycleState: metadata.lifecycleState,
    active: isSessionActive(metadata),
    activeScopeIdentityId: metadata.scope.activeScopeIdentityId,
    activeScopeLevel: metadata.scope.activeScopeLevel,
    roleCount: metadata.roleSnapshots.length,
    permissionCount: metadata.permissionSnapshots.length,
    reasons: Object.freeze(reasons),
  });
}
