import { IDENTITY_AUDIT_CONTRACT_VERSION } from "./identityAuditEnums.ts";
import type { AuditEvent, AuditMetadata, CreateAuditEventInput } from "./identityAuditTypes.ts";

function freezeMetadata(metadata: AuditMetadata | undefined): AuditMetadata {
  return Object.freeze({ ...(metadata ?? {}) });
}

export function createAuditEvent(input: CreateAuditEventInput): AuditEvent {
  return Object.freeze({
    contractVersion: IDENTITY_AUDIT_CONTRACT_VERSION,
    auditEventId:
      input.auditEventId ??
      `audit:${input.action}:${input.actor.actorIdentityId}:${input.target.targetIdentityId}:${input.occurredAt}`,
    action: input.action,
    actor: Object.freeze({ ...input.actor }),
    target: Object.freeze({ ...input.target }),
    scope: Object.freeze({ ...input.scope }),
    session: Object.freeze({
      sessionId: input.session?.sessionId ?? null,
      sessionIdentityId: input.session?.sessionIdentityId ?? null,
    }),
    occurredAt: input.occurredAt,
    lifecycleState: input.lifecycleState ?? "Recorded",
    metadata: freezeMetadata(input.metadata),
    version: input.version ?? 1,
  });
}
