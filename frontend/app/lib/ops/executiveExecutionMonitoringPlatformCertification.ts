import { buildExecutiveExecutionMonitoringPlatformCertificationManifest } from "./executiveExecutionMonitoringPlatformCertificationManifest.ts";
import { runExecutiveExecutionMonitoringPlatformCertification } from "./executiveExecutionMonitoringPlatformCertificationRunner.ts";
import type { ExecutiveExecutionMonitoringCertificationSummary } from "./executiveExecutionMonitoringPlatformCertificationTypes.ts";

export const certifyExecutiveExecutionMonitoringPlatform = () => runExecutiveExecutionMonitoringPlatformCertification().status;

export const getExecutiveExecutionMonitoringPlatformCertification = () => {
  const result = runExecutiveExecutionMonitoringPlatformCertification();
  return Object.freeze({ manifest: buildExecutiveExecutionMonitoringPlatformCertificationManifest(), result,
    status: result.status, metadataOnly: true, immutable: true, deterministic: true,
  } as const);
};

export const getExecutiveExecutionMonitoringCertificationSummary = () => {
  const result = runExecutiveExecutionMonitoringPlatformCertification();
  return Object.freeze({ certificationStatus: result.status, totalChecks: result.totalChecks,
    passedChecks: result.passedChecks, failedChecks: result.failedChecks,
    releaseReadiness: buildExecutiveExecutionMonitoringPlatformCertificationManifest().releaseReadiness.status,
    metadataOnly: true, immutable: true, deterministic: true,
  } as const satisfies ExecutiveExecutionMonitoringCertificationSummary);
};
