import { createIdentity, validateIdentity } from "./identityIndex.ts";
import { createIdentityRegistry, registerIdentity } from "./identityRegistryIndex.ts";
import { createIdentityScope, createOwnershipRecord, validateOwnershipGraph } from "./identityScopeIndex.ts";
import { createRoleAssignment, createRoleDefinition, listCanonicalRoles } from "./identityRoleIndex.ts";
import {
  createPermissionAssignment,
  createPermissionDefinition,
  listCanonicalPermissionActions,
} from "./identityPermissionIndex.ts";
import {
  createAuthorizationDecision,
  createAuthorizationRequest,
  evaluateAuthorization,
} from "./identityAuthorizationIndex.ts";
import { createSessionContext, createSessionMetadata, explainSessionState } from "./identitySessionIndex.ts";
import { createAuditEvent, listCanonicalAuditActions, validateAuditEvent } from "./identityAuditIndex.ts";
import {
  createTenantBoundary,
  resolveIdentityTenant,
  validateTenantBoundary,
} from "./identityTenantIsolationIndex.ts";
import type {
  IdentityPlatformPhaseRegistryEntry,
  IdentityPlatformPublicApiEntry,
} from "./identityPlatformFreezeTypes.ts";

const PUBLIC_API_AVAILABILITY = Object.freeze({
  createIdentity,
  validateIdentity,
  createIdentityRegistry,
  registerIdentity,
  createIdentityScope,
  createOwnershipRecord,
  validateOwnershipGraph,
  createRoleDefinition,
  createRoleAssignment,
  listCanonicalRoles,
  createPermissionDefinition,
  createPermissionAssignment,
  listCanonicalPermissionActions,
  createAuthorizationRequest,
  createAuthorizationDecision,
  evaluateAuthorization,
  createSessionMetadata,
  createSessionContext,
  explainSessionState,
  createAuditEvent,
  validateAuditEvent,
  listCanonicalAuditActions,
  createTenantBoundary,
  validateTenantBoundary,
  resolveIdentityTenant,
});

const PHASES: readonly IdentityPlatformPhaseRegistryEntry[] = Object.freeze([
  Object.freeze({
    phaseId: "IDN-1",
    name: "Identity Foundation",
    contractVersion: "IDN-1",
    certified: true,
    frozen: true,
    consumes: Object.freeze([]),
    publicApiCount: 2,
  }),
  Object.freeze({
    phaseId: "IDN-2",
    name: "Identity Registry Platform",
    contractVersion: "IDN-2",
    certified: true,
    frozen: true,
    consumes: Object.freeze(["IDN-1"] as const),
    publicApiCount: 9,
  }),
  Object.freeze({
    phaseId: "IDN-3",
    name: "Identity Scope & Ownership Platform",
    contractVersion: "IDN-3",
    certified: true,
    frozen: true,
    consumes: Object.freeze(["IDN-1", "IDN-2"] as const),
    publicApiCount: 9,
  }),
  Object.freeze({
    phaseId: "IDN-4",
    name: "Identity Role Model Foundation",
    contractVersion: "IDN-4",
    certified: true,
    frozen: true,
    consumes: Object.freeze(["IDN-1", "IDN-2", "IDN-3"] as const),
    publicApiCount: 10,
  }),
  Object.freeze({
    phaseId: "IDN-5",
    name: "Identity Permission Contract Foundation",
    contractVersion: "IDN-5",
    certified: true,
    frozen: true,
    consumes: Object.freeze(["IDN-1", "IDN-2", "IDN-3", "IDN-4"] as const),
    publicApiCount: 10,
  }),
  Object.freeze({
    phaseId: "IDN-6",
    name: "Identity Authorization Evaluation Foundation",
    contractVersion: "IDN-6",
    certified: true,
    frozen: true,
    consumes: Object.freeze(["IDN-1", "IDN-2", "IDN-3", "IDN-4", "IDN-5"] as const),
    publicApiCount: 10,
  }),
  Object.freeze({
    phaseId: "IDN-7",
    name: "Identity Session Metadata Foundation",
    contractVersion: "IDN-7",
    certified: true,
    frozen: true,
    consumes: Object.freeze(["IDN-1", "IDN-2", "IDN-3", "IDN-4", "IDN-5", "IDN-6"] as const),
    publicApiCount: 8,
  }),
  Object.freeze({
    phaseId: "IDN-8",
    name: "Identity Audit Metadata Foundation",
    contractVersion: "IDN-8",
    certified: true,
    frozen: true,
    consumes: Object.freeze(["IDN-1", "IDN-2", "IDN-3", "IDN-7"] as const),
    publicApiCount: 9,
  }),
  Object.freeze({
    phaseId: "IDN-9",
    name: "Identity Tenant Isolation Foundation",
    contractVersion: "IDN-9",
    certified: true,
    frozen: true,
    consumes: Object.freeze(["IDN-1", "IDN-2", "IDN-3", "IDN-4", "IDN-5", "IDN-7", "IDN-8"] as const),
    publicApiCount: 11,
  }),
]);

const PUBLIC_APIS: readonly IdentityPlatformPublicApiEntry[] = Object.freeze([
  Object.freeze({ phaseId: "IDN-1", apiName: "createIdentity", available: typeof PUBLIC_API_AVAILABILITY.createIdentity === "function" }),
  Object.freeze({ phaseId: "IDN-1", apiName: "validateIdentity", available: typeof PUBLIC_API_AVAILABILITY.validateIdentity === "function" }),
  Object.freeze({ phaseId: "IDN-2", apiName: "createIdentityRegistry", available: typeof PUBLIC_API_AVAILABILITY.createIdentityRegistry === "function" }),
  Object.freeze({ phaseId: "IDN-2", apiName: "registerIdentity", available: typeof PUBLIC_API_AVAILABILITY.registerIdentity === "function" }),
  Object.freeze({ phaseId: "IDN-3", apiName: "createIdentityScope", available: typeof PUBLIC_API_AVAILABILITY.createIdentityScope === "function" }),
  Object.freeze({ phaseId: "IDN-3", apiName: "createOwnershipRecord", available: typeof PUBLIC_API_AVAILABILITY.createOwnershipRecord === "function" }),
  Object.freeze({ phaseId: "IDN-3", apiName: "validateOwnershipGraph", available: typeof PUBLIC_API_AVAILABILITY.validateOwnershipGraph === "function" }),
  Object.freeze({ phaseId: "IDN-4", apiName: "createRoleDefinition", available: typeof PUBLIC_API_AVAILABILITY.createRoleDefinition === "function" }),
  Object.freeze({ phaseId: "IDN-4", apiName: "createRoleAssignment", available: typeof PUBLIC_API_AVAILABILITY.createRoleAssignment === "function" }),
  Object.freeze({ phaseId: "IDN-4", apiName: "listCanonicalRoles", available: typeof PUBLIC_API_AVAILABILITY.listCanonicalRoles === "function" }),
  Object.freeze({ phaseId: "IDN-5", apiName: "createPermissionDefinition", available: typeof PUBLIC_API_AVAILABILITY.createPermissionDefinition === "function" }),
  Object.freeze({ phaseId: "IDN-5", apiName: "createPermissionAssignment", available: typeof PUBLIC_API_AVAILABILITY.createPermissionAssignment === "function" }),
  Object.freeze({ phaseId: "IDN-5", apiName: "listCanonicalPermissionActions", available: typeof PUBLIC_API_AVAILABILITY.listCanonicalPermissionActions === "function" }),
  Object.freeze({ phaseId: "IDN-6", apiName: "createAuthorizationRequest", available: typeof PUBLIC_API_AVAILABILITY.createAuthorizationRequest === "function" }),
  Object.freeze({ phaseId: "IDN-6", apiName: "createAuthorizationDecision", available: typeof PUBLIC_API_AVAILABILITY.createAuthorizationDecision === "function" }),
  Object.freeze({ phaseId: "IDN-6", apiName: "evaluateAuthorization", available: typeof PUBLIC_API_AVAILABILITY.evaluateAuthorization === "function" }),
  Object.freeze({ phaseId: "IDN-7", apiName: "createSessionMetadata", available: typeof PUBLIC_API_AVAILABILITY.createSessionMetadata === "function" }),
  Object.freeze({ phaseId: "IDN-7", apiName: "createSessionContext", available: typeof PUBLIC_API_AVAILABILITY.createSessionContext === "function" }),
  Object.freeze({ phaseId: "IDN-7", apiName: "explainSessionState", available: typeof PUBLIC_API_AVAILABILITY.explainSessionState === "function" }),
  Object.freeze({ phaseId: "IDN-8", apiName: "createAuditEvent", available: typeof PUBLIC_API_AVAILABILITY.createAuditEvent === "function" }),
  Object.freeze({ phaseId: "IDN-8", apiName: "validateAuditEvent", available: typeof PUBLIC_API_AVAILABILITY.validateAuditEvent === "function" }),
  Object.freeze({ phaseId: "IDN-8", apiName: "listCanonicalAuditActions", available: typeof PUBLIC_API_AVAILABILITY.listCanonicalAuditActions === "function" }),
  Object.freeze({ phaseId: "IDN-9", apiName: "createTenantBoundary", available: typeof PUBLIC_API_AVAILABILITY.createTenantBoundary === "function" }),
  Object.freeze({ phaseId: "IDN-9", apiName: "validateTenantBoundary", available: typeof PUBLIC_API_AVAILABILITY.validateTenantBoundary === "function" }),
  Object.freeze({ phaseId: "IDN-9", apiName: "resolveIdentityTenant", available: typeof PUBLIC_API_AVAILABILITY.resolveIdentityTenant === "function" }),
]);

export function listIdentityPlatformPhases(): readonly IdentityPlatformPhaseRegistryEntry[] {
  return PHASES;
}

export function listIdentityPlatformPublicApis(): readonly IdentityPlatformPublicApiEntry[] {
  return PUBLIC_APIS;
}
