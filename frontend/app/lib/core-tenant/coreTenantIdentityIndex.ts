export type {
  CoreTenantIdentityRegistry,
  CoreTenantIdentityValidation,
  TenantBoundary,
  TenantClassification,
  TenantCode,
  TenantId,
  TenantIdentity,
  TenantIdentityManifest,
  TenantMetadata,
  TenantName,
  TenantStatus,
  TenantVersion,
} from "./coreTenantIdentityTypes.ts";

export { buildCoreTenantIdentityManifest } from "./coreTenantIdentityManifest.ts";
export {
  CORE_TENANT_BOUNDARY,
  CORE_TENANT_CANONICAL_IDENTITY,
  CORE_TENANT_IDENTITY_REGISTRY,
} from "./coreTenantIdentityRegistry.ts";
export { validateCoreTenantIdentity } from "./coreTenantIdentityValidation.ts";

import { buildCoreTenantIdentityManifest } from "./coreTenantIdentityManifest.ts";
import {
  CORE_TENANT_BOUNDARY,
  CORE_TENANT_CANONICAL_IDENTITY,
  CORE_TENANT_IDENTITY_REGISTRY,
} from "./coreTenantIdentityRegistry.ts";
import { validateCoreTenantIdentity } from "./coreTenantIdentityValidation.ts";

export const CoreTenantIdentity = Object.freeze({
  registry: CORE_TENANT_IDENTITY_REGISTRY,
  identity: CORE_TENANT_CANONICAL_IDENTITY,
  boundary: CORE_TENANT_BOUNDARY,
  buildCoreTenantIdentityManifest,
  validateCoreTenantIdentity,
});

