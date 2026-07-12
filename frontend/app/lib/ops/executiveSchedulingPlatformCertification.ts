import { buildExecutiveSchedulingPlatformCertificationManifest } from "./executiveSchedulingPlatformCertificationManifest.ts";
import { runExecutiveSchedulingPlatformCertification } from "./executiveSchedulingPlatformCertificationRunner.ts";

export const certifyExecutiveSchedulingPlatform = () =>
  runExecutiveSchedulingPlatformCertification().status;

export const getExecutiveSchedulingPlatformCertification = () =>
  Object.freeze({
    manifest: buildExecutiveSchedulingPlatformCertificationManifest(),
    result: runExecutiveSchedulingPlatformCertification(),
    status: runExecutiveSchedulingPlatformCertification().status,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);

export const getExecutiveSchedulingCertificationSummary = () =>
  Object.freeze({
    certificationStatus: runExecutiveSchedulingPlatformCertification().status,
    totalChecks: runExecutiveSchedulingPlatformCertification().totalChecks,
    passedChecks: runExecutiveSchedulingPlatformCertification().passedChecks,
    failedChecks: runExecutiveSchedulingPlatformCertification().failedChecks,
    releaseReadiness:
      buildExecutiveSchedulingPlatformCertificationManifest().releaseReadiness.status,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
