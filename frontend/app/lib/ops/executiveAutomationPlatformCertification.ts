import { buildExecutiveAutomationPlatformCertificationManifest } from "./executiveAutomationPlatformCertificationManifest.ts";
import { runExecutiveAutomationPlatformCertification } from "./executiveAutomationPlatformCertificationRunner.ts";
import type { ExecutiveAutomationCertificationSummary } from "./executiveAutomationPlatformCertificationTypes.ts";

export const certifyExecutiveAutomationPlatform = () =>
  runExecutiveAutomationPlatformCertification().status;

export const getExecutiveAutomationPlatformCertification = () =>
  Object.freeze({
    manifest: buildExecutiveAutomationPlatformCertificationManifest(),
    result: runExecutiveAutomationPlatformCertification(),
    status: runExecutiveAutomationPlatformCertification().status,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);

export const getExecutiveAutomationCertificationSummary = () =>
  Object.freeze({
    certificationStatus: runExecutiveAutomationPlatformCertification().status,
    totalChecks: runExecutiveAutomationPlatformCertification().totalChecks,
    passedChecks: runExecutiveAutomationPlatformCertification().passedChecks,
    failedChecks: runExecutiveAutomationPlatformCertification().failedChecks,
    releaseReadiness:
      buildExecutiveAutomationPlatformCertificationManifest().releaseReadiness.status,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const satisfies ExecutiveAutomationCertificationSummary);
