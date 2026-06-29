/**
 * APP-4:14 — Executive Memory Platform Freeze runner.
 */

import {
  EXECUTIVE_MEMORY_PLATFORM_FREEZE_CONTRACT_VERSION,
  EXECUTIVE_MEMORY_PLATFORM_FREEZE_TAGS,
} from "./executiveMemoryPlatformFreezeConstants.ts";
import {
  runExecutiveMemoryPlatformFreezeCertification,
} from "./executiveMemoryPlatformFreezeCertification.ts";
import {
  buildExecutiveMemoryPlatformFreezeManifest,
} from "./executiveMemoryPlatformFreezeManifest.ts";
import type { ExecutiveMemoryPlatformFreezeRunResult } from "./executiveMemoryPlatformFreezeTypes.ts";

let initialized = false;

export function initializeExecutiveMemoryPlatformFreezeEngine(
  timestamp: string
): Readonly<{ success: boolean; reason: string }> {
  initialized = true;
  return Object.freeze({
    success: true,
    reason: `Executive Memory Platform freeze engine initialized at ${timestamp}.`,
  });
}

export function isExecutiveMemoryPlatformFreezeEngineInitialized(): boolean {
  return initialized;
}

export function resetExecutiveMemoryPlatformFreezeEngineForTests(): void {
  initialized = false;
}

export function runExecutiveMemoryPlatformFreezeSuite(): ExecutiveMemoryPlatformFreezeRunResult {
  const certification = runExecutiveMemoryPlatformFreezeCertification();
  return Object.freeze({
    freezeVersion: EXECUTIVE_MEMORY_PLATFORM_FREEZE_CONTRACT_VERSION,
    certified: certification.certified,
    frozen: certification.frozen,
    released: certification.released,
    status: certification.status,
    summary: certification.summary,
    manifest: certification.manifest,
    certification,
    readOnly: true as const,
  });
}

export function getExecutiveMemoryPlatformFreezeManifest(releaseDate: string = new Date().toISOString()) {
  return buildExecutiveMemoryPlatformFreezeManifest(releaseDate);
}

export const ExecutiveMemoryPlatformFreezeRunner = Object.freeze({
  initializeExecutiveMemoryPlatformFreezeEngine,
  isExecutiveMemoryPlatformFreezeEngineInitialized,
  resetExecutiveMemoryPlatformFreezeEngineForTests,
  runExecutiveMemoryPlatformFreezeSuite,
  runExecutiveMemoryPlatformFreezeCertification,
  getExecutiveMemoryPlatformFreezeManifest,
  buildExecutiveMemoryPlatformFreezeManifest,
});

export {
  runExecutiveMemoryPlatformFreezeCertification,
  buildExecutiveMemoryPlatformFreezeManifest,
};
