export type {
  TenantContext,
  TenantContextBinding,
  TenantContextId,
  TenantContextManifest,
  TenantContextMetadata,
  TenantContextMode,
  TenantContextScope,
  TenantContextSnapshot,
  TenantContextSource,
  TenantContextStatus,
  TenantContextValidationResult,
} from "./coreTenantContextTypes.ts";

export { buildExecutiveTenantContextManifest } from "./coreTenantContextManifest.ts";
export {
  CORE_TENANT_CONTEXT,
  CORE_TENANT_CONTEXT_BINDING,
  CORE_TENANT_CONTEXT_METADATA,
  CORE_TENANT_CONTEXT_SNAPSHOT,
} from "./coreTenantContext.ts";
export { validateExecutiveTenantContext } from "./coreTenantContextValidation.ts";

import { buildExecutiveTenantContextManifest } from "./coreTenantContextManifest.ts";
import {
  CORE_TENANT_CONTEXT,
  CORE_TENANT_CONTEXT_BINDING,
  CORE_TENANT_CONTEXT_METADATA,
  CORE_TENANT_CONTEXT_SNAPSHOT,
} from "./coreTenantContext.ts";
import { validateExecutiveTenantContext } from "./coreTenantContextValidation.ts";

export const ExecutiveTenantContext = Object.freeze({
  context: CORE_TENANT_CONTEXT,
  binding: CORE_TENANT_CONTEXT_BINDING,
  metadata: CORE_TENANT_CONTEXT_METADATA,
  snapshot: CORE_TENANT_CONTEXT_SNAPSHOT,
  buildExecutiveTenantContextManifest,
  validateExecutiveTenantContext,
});

