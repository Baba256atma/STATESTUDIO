import type { IDENTITY_CONTRACT_VERSION, IdentityLifecycleState, IdentityType } from "./identityEnums.ts";
import type { IdentityCreationMetadata, IdentityId, IdentityMetadataInput } from "./identityMetadata.ts";

export type IdentityBase = Readonly<{
  contractVersion: typeof IDENTITY_CONTRACT_VERSION;
  id: IdentityId;
  type: IdentityType;
  displayName: string;
  created: IdentityCreationMetadata;
  lifecycle: IdentityLifecycleState;
  version: number;
  tags: readonly string[];
  metadata: Readonly<Record<string, string | number | boolean | null>>;
}>;

export type UserIdentity = IdentityBase & Readonly<{ type: "User" }>;
export type OrganizationIdentity = IdentityBase & Readonly<{ type: "Organization" }>;
export type WorkspaceIdentity = IdentityBase & Readonly<{ type: "Workspace" }>;
export type ProjectIdentity = IdentityBase & Readonly<{ type: "Project" }>;
export type ObjectIdentity = IdentityBase & Readonly<{ type: "Object" }>;
export type AgentIdentity = IdentityBase & Readonly<{ type: "Agent" }>;
export type ServiceIdentity = IdentityBase & Readonly<{ type: "Service" }>;
export type APIIdentity = IdentityBase & Readonly<{ type: "API" }>;
export type SessionIdentity = IdentityBase & Readonly<{ type: "Session" }>;
export type TenantIdentity = IdentityBase & Readonly<{ type: "Tenant" }>;

export type NexoraIdentity =
  | UserIdentity
  | OrganizationIdentity
  | WorkspaceIdentity
  | ProjectIdentity
  | ObjectIdentity
  | AgentIdentity
  | ServiceIdentity
  | APIIdentity
  | SessionIdentity
  | TenantIdentity;

export type CreateIdentityInput = Readonly<{
  id: IdentityId;
  type: IdentityType;
  displayName: string;
  created: IdentityMetadataInput;
  lifecycle?: IdentityLifecycleState;
  version?: number;
  tags?: readonly string[];
  metadata?: Readonly<Record<string, string | number | boolean | null>>;
}>;

export type IdentityValidationCode =
  | "required_field"
  | "invalid_identity_type"
  | "invalid_lifecycle"
  | "invalid_metadata"
  | "invalid_version"
  | "invalid_tag"
  | "duplicate_id";

export type IdentityValidationIssue = Readonly<{
  code: IdentityValidationCode;
  field: string;
  message: string;
  severity: "error" | "warning";
}>;

export type IdentityValidationResult = Readonly<{
  valid: boolean;
  issues: readonly IdentityValidationIssue[];
}>;
