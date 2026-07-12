export type {
  TenantValidationCheck,
  TenantValidationDependency,
  TenantValidationGate,
  TenantValidationManifest,
  TenantValidationMetadata,
  TenantValidationResult,
  TenantValidationSnapshot,
  TenantValidationSummary,
} from "./coreTenantPlatformValidationTypes.ts";

export { buildExecutiveTenantValidationManifest } from "./coreTenantPlatformValidationManifest.ts";
export {
  CORE_TENANT_VALIDATION_METADATA,
  runExecutiveTenantPlatformValidation,
} from "./coreTenantPlatformValidation.ts";

import { buildExecutiveTenantValidationManifest } from "./coreTenantPlatformValidationManifest.ts";
import {
  CORE_TENANT_VALIDATION_METADATA,
  runExecutiveTenantPlatformValidation,
} from "./coreTenantPlatformValidation.ts";

export const ExecutiveTenantValidationPlatform = Object.freeze({
  metadata: CORE_TENANT_VALIDATION_METADATA,
  buildExecutiveTenantValidationManifest,
  runExecutiveTenantPlatformValidation,
});

