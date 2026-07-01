import type { IdentityId, IdentityType } from "./identityIndex.ts";
import type { IdentityScopeLevel } from "./identityScopeIndex.ts";
import type { AuditAction, AuditLifecycleState } from "./identityAuditEnums.ts";

export type AuditMetadataValue = string | number | boolean | null;

export type AuditMetadata = Readonly<Record<string, AuditMetadataValue>>;

export type AuditActor = Readonly<{
  actorIdentityId: IdentityId;
  actorIdentityType: IdentityType;
}>;

export type AuditTarget = Readonly<{
  targetIdentityId: IdentityId;
  targetIdentityType: IdentityType;
  resourceType: string;
}>;

export type AuditScope = Readonly<{
  scopeIdentityId: IdentityId | "Global";
  scopeLevel: IdentityScopeLevel;
}>;

export type AuditSessionReference = Readonly<{
  sessionId: IdentityId | null;
  sessionIdentityId: IdentityId | null;
}>;

export type AuditEvent = Readonly<{
  contractVersion: "IDN-8";
  auditEventId: string;
  action: AuditAction;
  actor: AuditActor;
  target: AuditTarget;
  scope: AuditScope;
  session: AuditSessionReference;
  occurredAt: string;
  lifecycleState: AuditLifecycleState;
  metadata: AuditMetadata;
  version: number;
}>;

export type CreateAuditEventInput = Readonly<{
  auditEventId?: string;
  action: AuditAction;
  actor: AuditActor;
  target: AuditTarget;
  scope: AuditScope;
  session?: AuditSessionReference;
  occurredAt: string;
  lifecycleState?: AuditLifecycleState;
  metadata?: AuditMetadata;
  version?: number;
}>;
