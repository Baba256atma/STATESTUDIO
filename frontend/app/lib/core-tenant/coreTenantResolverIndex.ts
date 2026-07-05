export type {
  TenantResolverCompatibility,
  TenantResolverContract,
  TenantResolverDomain,
  TenantResolverGuarantee,
  TenantResolverInputReference,
  TenantResolverManifest,
  TenantResolverMetadata,
  TenantResolverOutputReference,
  TenantResolverRule,
  TenantResolverScope,
  TenantResolverSnapshot,
  TenantResolverValidationResult,
} from "./coreTenantResolverTypes.ts";

export { buildExecutiveTenantResolverManifest } from "./coreTenantResolverManifest.ts";
export {
  CORE_TENANT_RESOLVER,
  CORE_TENANT_RESOLVER_COMPATIBILITY,
  CORE_TENANT_RESOLVER_DOMAINS,
  CORE_TENANT_RESOLVER_GUARANTEES,
  CORE_TENANT_RESOLVER_INPUTS,
  CORE_TENANT_RESOLVER_METADATA,
  CORE_TENANT_RESOLVER_OUTPUTS,
  CORE_TENANT_RESOLVER_RULES,
  CORE_TENANT_RESOLVER_SNAPSHOT,
} from "./coreTenantResolver.ts";
export { validateExecutiveTenantResolver } from "./coreTenantResolverValidation.ts";

import { buildExecutiveTenantResolverManifest } from "./coreTenantResolverManifest.ts";
import {
  CORE_TENANT_RESOLVER,
  CORE_TENANT_RESOLVER_COMPATIBILITY,
  CORE_TENANT_RESOLVER_DOMAINS,
  CORE_TENANT_RESOLVER_GUARANTEES,
  CORE_TENANT_RESOLVER_INPUTS,
  CORE_TENANT_RESOLVER_METADATA,
  CORE_TENANT_RESOLVER_OUTPUTS,
  CORE_TENANT_RESOLVER_RULES,
  CORE_TENANT_RESOLVER_SNAPSHOT,
} from "./coreTenantResolver.ts";
import { validateExecutiveTenantResolver } from "./coreTenantResolverValidation.ts";

export const ExecutiveTenantResolver = Object.freeze({
  resolver: CORE_TENANT_RESOLVER,
  domains: CORE_TENANT_RESOLVER_DOMAINS,
  inputs: CORE_TENANT_RESOLVER_INPUTS,
  outputs: CORE_TENANT_RESOLVER_OUTPUTS,
  rules: CORE_TENANT_RESOLVER_RULES,
  guarantees: CORE_TENANT_RESOLVER_GUARANTEES,
  compatibility: CORE_TENANT_RESOLVER_COMPATIBILITY,
  metadata: CORE_TENANT_RESOLVER_METADATA,
  snapshot: CORE_TENANT_RESOLVER_SNAPSHOT,
  buildExecutiveTenantResolverManifest,
  validateExecutiveTenantResolver,
});

