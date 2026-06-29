/**
 * APP-5:1 — Scenario Timeline Platform.
 * Official foundation entry point — metadata only, no visualization or persistence.
 */

import {
  ScenarioTimelinePlatformFoundation,
  getScenarioTimelineFoundationVersionMetadata,
  getScenarioTimelinePlatformState,
  initializeScenarioTimelinePlatform,
  isScenarioTimelinePlatformInitialized,
  resetScenarioTimelineFoundationForTests,
} from "./scenarioTimelinePlatformFoundation.ts";
import {
  ScenarioTimelinePlatformRegistry,
  getTimelineRegistry,
  getTimelineType,
  listTimelineTypeIds,
  registerTimelineType,
  resetScenarioTimelineRegistryForTests,
} from "./scenarioTimelinePlatformRegistry.ts";
import {
  ScenarioTimelinePlatformContract,
  SCENARIO_TIMELINE_PLATFORM_IDENTITY,
  SCENARIO_TIMELINE_PLATFORM_SELF_MANIFEST,
  SCENARIO_TIMELINE_PUBLIC_API_RULES,
  SCENARIO_TIMELINE_PLATFORM_TAGS,
  validateScenarioTimelinePlatform,
} from "./scenarioTimelinePlatformContracts.ts";
import { buildScenarioTimelineManifest } from "./scenarioTimelinePlatformManifest.ts";

export {
  ScenarioTimelinePlatformContract,
  SCENARIO_TIMELINE_PLATFORM_IDENTITY,
  SCENARIO_TIMELINE_PUBLIC_API_RULES,
  SCENARIO_TIMELINE_PLATFORM_TAGS,
  registerTimelineType,
  getTimelineType,
  getTimelineRegistry,
  validateScenarioTimelinePlatform,
  initializeScenarioTimelinePlatform,
  getScenarioTimelinePlatformState,
  isScenarioTimelinePlatformInitialized,
  getScenarioTimelineFoundationVersionMetadata,
};

export { buildScenarioTimelineManifest };

export type {
  ScenarioTimelineEventContract,
  ScenarioTimelineLifecycleStage,
  ScenarioTimelineEventType,
  ScenarioTimelinePlatformState,
  ScenarioTimelinePlatformResult,
  ScenarioTimelineType,
  ScenarioTimelineTypeRegistration,
} from "./scenarioTimelinePlatformTypes.ts";

export function resetScenarioTimelinePlatformForTests(): void {
  resetScenarioTimelineRegistryForTests();
  resetScenarioTimelineFoundationForTests();
}

export const ScenarioTimelinePlatform = Object.freeze({
  initializeScenarioTimelinePlatform,
  getScenarioTimelinePlatformState,
  isScenarioTimelinePlatformInitialized,
  registerTimelineType,
  getTimelineType,
  getTimelineRegistry,
  listTimelineTypeIds,
  buildScenarioTimelineManifest: (timestamp: string) =>
    buildScenarioTimelineManifest(SCENARIO_TIMELINE_PLATFORM_SELF_MANIFEST, timestamp),
  validateScenarioTimelinePlatform,
  getScenarioTimelineFoundationVersionMetadata,
  resetScenarioTimelinePlatformForTests,
  contract: ScenarioTimelinePlatformContract,
  foundation: ScenarioTimelinePlatformFoundation,
  registry: ScenarioTimelinePlatformRegistry,
  identity: SCENARIO_TIMELINE_PLATFORM_IDENTITY,
  version: SCENARIO_TIMELINE_PLATFORM_IDENTITY.version,
  tags: SCENARIO_TIMELINE_PLATFORM_TAGS,
});
