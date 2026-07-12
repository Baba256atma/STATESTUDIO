import { buildExecutiveDependencyPlatformCertificationManifest } from "./executiveDependencyPlatformCertificationManifest.ts";
import { runExecutiveDependencyPlatformCertification } from "./executiveDependencyPlatformCertificationRunner.ts";
import type { ExecutiveDependencyCertificationSummary } from "./executiveDependencyPlatformCertificationTypes.ts";

export const certifyExecutiveDependencyPlatform = () =>
  runExecutiveDependencyPlatformCertification().status;

export const getExecutiveDependencyPlatformCertification = () =>
  Object.freeze({
    manifest: buildExecutiveDependencyPlatformCertificationManifest(),
    result: runExecutiveDependencyPlatformCertification(),
    status: runExecutiveDependencyPlatformCertification().status,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);

export const getExecutiveDependencyCertificationSummary = () =>
  Object.freeze({
    certificationStatus: runExecutiveDependencyPlatformCertification().status,
    totalChecks: runExecutiveDependencyPlatformCertification().totalChecks,
    passedChecks: runExecutiveDependencyPlatformCertification().passedChecks,
    failedChecks: runExecutiveDependencyPlatformCertification().failedChecks,
    releaseReadiness:
      buildExecutiveDependencyPlatformCertificationManifest().releaseReadiness.status,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const satisfies ExecutiveDependencyCertificationSummary);
