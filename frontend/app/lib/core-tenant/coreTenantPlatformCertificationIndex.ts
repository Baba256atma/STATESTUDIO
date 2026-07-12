export type {
  TenantCertificationGate,
  TenantCertificationManifest,
  TenantCertificationMetadata,
  TenantCertificationResult,
  TenantCertificationSnapshot,
  TenantCertificationSummary,
  TenantReleaseMetadata,
} from "./coreTenantPlatformCertificationTypes.ts";

export { buildExecutiveTenantPlatformCertificationManifest } from "./coreTenantPlatformCertificationManifest.ts";
export {
  CORE_TENANT_CERTIFICATION_METADATA,
  CORE_TENANT_RELEASE_METADATA,
  runExecutiveTenantPlatformCertification,
} from "./coreTenantPlatformCertification.ts";

import { buildExecutiveTenantPlatformCertificationManifest } from "./coreTenantPlatformCertificationManifest.ts";
import {
  CORE_TENANT_CERTIFICATION_METADATA,
  CORE_TENANT_RELEASE_METADATA,
  runExecutiveTenantPlatformCertification,
} from "./coreTenantPlatformCertification.ts";

export const ExecutiveTenantPlatformCertification = Object.freeze({
  metadata: CORE_TENANT_CERTIFICATION_METADATA,
  release: CORE_TENANT_RELEASE_METADATA,
  buildExecutiveTenantPlatformCertificationManifest,
  runExecutiveTenantPlatformCertification,
});

