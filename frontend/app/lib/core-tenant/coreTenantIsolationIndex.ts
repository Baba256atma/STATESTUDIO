export type {
  TenantIsolationBoundary,
  TenantIsolationContract,
  TenantIsolationDomain,
  TenantIsolationGuarantee,
  TenantIsolationManifest,
  TenantIsolationMetadata,
  TenantIsolationRisk,
  TenantIsolationRule,
  TenantIsolationScope,
  TenantIsolationSnapshot,
  TenantIsolationValidationResult,
} from "./coreTenantIsolationTypes.ts";

export { buildExecutiveTenantIsolationManifest } from "./coreTenantIsolationManifest.ts";
export {
  CORE_TENANT_ISOLATION,
  CORE_TENANT_ISOLATION_BOUNDARY,
  CORE_TENANT_ISOLATION_DOMAINS,
  CORE_TENANT_ISOLATION_GUARANTEES,
  CORE_TENANT_ISOLATION_METADATA,
  CORE_TENANT_ISOLATION_RISKS,
  CORE_TENANT_ISOLATION_RULES,
  CORE_TENANT_ISOLATION_SNAPSHOT,
} from "./coreTenantIsolation.ts";
export { validateExecutiveTenantIsolation } from "./coreTenantIsolationValidation.ts";

import { buildExecutiveTenantIsolationManifest } from "./coreTenantIsolationManifest.ts";
import {
  CORE_TENANT_ISOLATION,
  CORE_TENANT_ISOLATION_BOUNDARY,
  CORE_TENANT_ISOLATION_DOMAINS,
  CORE_TENANT_ISOLATION_GUARANTEES,
  CORE_TENANT_ISOLATION_METADATA,
  CORE_TENANT_ISOLATION_RISKS,
  CORE_TENANT_ISOLATION_RULES,
  CORE_TENANT_ISOLATION_SNAPSHOT,
} from "./coreTenantIsolation.ts";
import { validateExecutiveTenantIsolation } from "./coreTenantIsolationValidation.ts";

export const ExecutiveTenantIsolation = Object.freeze({
  isolation: CORE_TENANT_ISOLATION,
  boundary: CORE_TENANT_ISOLATION_BOUNDARY,
  domains: CORE_TENANT_ISOLATION_DOMAINS,
  rules: CORE_TENANT_ISOLATION_RULES,
  guarantees: CORE_TENANT_ISOLATION_GUARANTEES,
  risks: CORE_TENANT_ISOLATION_RISKS,
  metadata: CORE_TENANT_ISOLATION_METADATA,
  snapshot: CORE_TENANT_ISOLATION_SNAPSHOT,
  buildExecutiveTenantIsolationManifest,
  validateExecutiveTenantIsolation,
});

