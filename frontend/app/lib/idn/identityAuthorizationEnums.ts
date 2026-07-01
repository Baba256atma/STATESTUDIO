import type { PermissionAction, PermissionResource } from "./identityPermissionIndex.ts";

export const IDENTITY_AUTHORIZATION_CONTRACT_VERSION = "IDN-6" as const;

export const AUTHORIZATION_DECISIONS = Object.freeze(["Allow", "Deny", "Indeterminate"] as const);

export type AuthorizationDecisionValue = (typeof AUTHORIZATION_DECISIONS)[number];

export const AUTHORIZATION_REASONS = Object.freeze([
  "PermissionGranted",
  "RoleGranted",
  "PermissionMissing",
  "RoleMissing",
  "InvalidScope",
  "InvalidIdentity",
  "InvalidRequest",
  "PermissionInactive",
  "RoleInactive",
  "ResourceMismatch",
  "ScopeMismatch",
] as const);

export type AuthorizationReason = (typeof AUTHORIZATION_REASONS)[number];

export type AuthorizationAction = PermissionAction;

export type AuthorizationResource = PermissionResource;
