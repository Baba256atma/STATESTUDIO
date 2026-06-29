/**
 * APP-5:1 — Scenario Timeline Platform manifest builder.
 */

import { validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  SCENARIO_TIMELINE_CERTIFICATION_METADATA,
  SCENARIO_TIMELINE_COMPATIBILITY_REGISTRY,
  SCENARIO_TIMELINE_EXTENSION_REGISTRY,
  SCENARIO_TIMELINE_FUTURE_COMPATIBILITY,
  SCENARIO_TIMELINE_PLATFORM_ARCHITECTURE_VERSION,
  SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
  SCENARIO_TIMELINE_RELEASE_METADATA,
} from "./scenarioTimelinePlatformConstants.ts";
import { isScenarioTimelinePlatformInitialized } from "./scenarioTimelinePlatformFoundation.ts";
import { getTimelineRegistrySnapshot } from "./scenarioTimelinePlatformRegistry.ts";
import type { ScenarioTimelineValidationResult } from "./scenarioTimelinePlatformTypes.ts";

export type ScenarioTimelinePlatformManifest = Readonly<{
  manifestVersion: typeof SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION;
  architectureVersion: typeof SCENARIO_TIMELINE_PLATFORM_ARCHITECTURE_VERSION;
  stageManifest: StageManifest;
  releaseMetadata: typeof SCENARIO_TIMELINE_RELEASE_METADATA;
  certificationMetadata: typeof SCENARIO_TIMELINE_CERTIFICATION_METADATA;
  futureCompatibility: typeof SCENARIO_TIMELINE_FUTURE_COMPATIBILITY;
  extensionRegistry: typeof SCENARIO_TIMELINE_EXTENSION_REGISTRY;
  compatibilityRegistry: typeof SCENARIO_TIMELINE_COMPATIBILITY_REGISTRY;
  registrySnapshot: ReturnType<typeof getTimelineRegistrySnapshot>;
  platformInitialized: boolean;
  readOnly: true;
}>;

export function buildScenarioTimelineManifest(
  stageManifest: StageManifest,
  timestamp: string
): ScenarioTimelinePlatformManifest {
  void timestamp;
  return Object.freeze({
    manifestVersion: SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
    architectureVersion: SCENARIO_TIMELINE_PLATFORM_ARCHITECTURE_VERSION,
    stageManifest,
    releaseMetadata: SCENARIO_TIMELINE_RELEASE_METADATA,
    certificationMetadata: SCENARIO_TIMELINE_CERTIFICATION_METADATA,
    futureCompatibility: SCENARIO_TIMELINE_FUTURE_COMPATIBILITY,
    extensionRegistry: SCENARIO_TIMELINE_EXTENSION_REGISTRY,
    compatibilityRegistry: SCENARIO_TIMELINE_COMPATIBILITY_REGISTRY,
    registrySnapshot: getTimelineRegistrySnapshot(),
    platformInitialized: isScenarioTimelinePlatformInitialized(),
    readOnly: true as const,
  });
}

export function validateScenarioTimelineManifest(
  manifest: ScenarioTimelinePlatformManifest
): ScenarioTimelineValidationResult {
  const stageValidation = validateStageManifest(manifest.stageManifest);
  const issues = [...stageValidation.issues];
  if (manifest.manifestVersion !== SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION) {
    issues.push(
      Object.freeze({
        code: "invalid_manifest",
        message: "Manifest version mismatch.",
        field: "manifestVersion",
        readOnly: true as const,
      })
    );
  }
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    readOnly: true as const,
  });
}

export const ScenarioTimelinePlatformManifestBuilder = Object.freeze({
  buildScenarioTimelineManifest,
  validateScenarioTimelineManifest,
});
