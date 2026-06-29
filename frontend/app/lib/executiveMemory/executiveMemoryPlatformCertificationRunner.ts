/**
 * APP-4:13 — Executive Memory Platform Certification Runner.
 */

import {
  EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_TAGS,
} from "./executiveMemoryPlatformCertificationConstants.ts";
import {
  buildExecutiveMemoryPlatformCertificationManifest,
} from "./executiveMemoryPlatformCertificationManifest.ts";
import {
  runExecutiveMemoryPlatformCertification,
} from "./executiveMemoryPlatformCertification.ts";
import { runExecutiveMemoryPlatformRegression } from "./executiveMemoryPlatformRegression.ts";
import type { ExecutiveMemoryPlatformCertificationRunResult } from "./executiveMemoryPlatformCertificationTypes.ts";

let initialized = false;

export function initializeExecutiveMemoryPlatformCertificationEngine(
  timestamp: string
): Readonly<{ success: boolean; reason: string }> {
  initialized = true;
  return Object.freeze({
    success: true,
    reason: `Executive Memory Platform certification engine initialized at ${timestamp}.`,
  });
}

export function isExecutiveMemoryPlatformCertificationEngineInitialized(): boolean {
  return initialized;
}

export function resetExecutiveMemoryPlatformCertificationEngineForTests(): void {
  initialized = false;
}

export function runExecutiveMemoryPlatformCertificationSuite(): ExecutiveMemoryPlatformCertificationRunResult {
  const certification = runExecutiveMemoryPlatformCertification();
  return Object.freeze({
    certificationVersion: EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    certified: certification.certified,
    releaseReady: certification.releaseReady,
    status: certification.status,
    regressionStatus: certification.regression.status,
    summary: certification.summary,
    tags: EXECUTIVE_MEMORY_PLATFORM_CERTIFICATION_TAGS,
    manifest: certification.manifest,
    certification,
    readOnly: true as const,
  });
}

export function runExecutiveMemoryPlatformRegressionOnly() {
  return runExecutiveMemoryPlatformRegression();
}

export const ExecutiveMemoryPlatformCertificationRunner = Object.freeze({
  initializeExecutiveMemoryPlatformCertificationEngine,
  isExecutiveMemoryPlatformCertificationEngineInitialized,
  resetExecutiveMemoryPlatformCertificationEngineForTests,
  runExecutiveMemoryPlatformCertificationSuite,
  runExecutiveMemoryPlatformCertification,
  runExecutiveMemoryPlatformRegressionOnly,
  buildExecutiveMemoryPlatformCertificationManifest,
});

export {
  runExecutiveMemoryPlatformCertification,
  runExecutiveMemoryPlatformRegression,
  buildExecutiveMemoryPlatformCertificationManifest,
};
