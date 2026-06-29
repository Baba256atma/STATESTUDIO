/**
 * APP-5:10 — Scenario Timeline Platform Freeze manifest and release metadata.
 */

import { SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION } from "./scenarioTimelinePlatformCertificationConstants.ts";
import {
  SCENARIO_TIMELINE_PLATFORM_ARCHITECTURE_VERSION,
  SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
} from "./scenarioTimelinePlatformConstants.ts";
import { SCENARIO_TIMELINE_FREEZE_RULES } from "./scenarioTimelinePlatformContracts.ts";
import {
  SCENARIO_TIMELINE_PLATFORM_EXTENSION_REGISTRY,
  SCENARIO_TIMELINE_PLATFORM_FREEZE_ARCHITECTURE_VERSION,
  SCENARIO_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION,
  SCENARIO_TIMELINE_PLATFORM_FREEZE_TAGS,
  SCENARIO_TIMELINE_PLATFORM_FROZEN_PHASES,
  SCENARIO_TIMELINE_PLATFORM_FROZEN_PUBLIC_APIS,
  SCENARIO_TIMELINE_PLATFORM_FUTURE_EXTENSION_POLICY,
  SCENARIO_TIMELINE_PLATFORM_NAME,
  SCENARIO_TIMELINE_PLATFORM_PUBLIC_CONTRACT_REGISTRY,
  SCENARIO_TIMELINE_PLATFORM_PUBLIC_GUARANTEES,
  SCENARIO_TIMELINE_PLATFORM_RELEASE_STAGE,
  SCENARIO_TIMELINE_PLATFORM_RELEASE_TAG,
  SCENARIO_TIMELINE_PLATFORM_STATUS_CERTIFIED,
  SCENARIO_TIMELINE_PLATFORM_STATUS_FROZEN,
  SCENARIO_TIMELINE_PLATFORM_STATUS_PRODUCTION_READY,
  SCENARIO_TIMELINE_PLATFORM_STATUS_RELEASED,
  SCENARIO_TIMELINE_PLATFORM_SUPPORT_POLICY,
  SCENARIO_TIMELINE_PLATFORM_VERSION,
  SCENARIO_TIMELINE_PLATFORM_COMPATIBILITY_VERSION,
} from "./scenarioTimelinePlatformFreezeContracts.ts";
import { SCENARIO_TIMELINE_PLATFORM_COMPATIBILITY_MATRIX } from "./scenarioTimelinePlatformFreezeCompatibility.ts";

export type ScenarioTimelinePlatformFreezeManifest = Readonly<{
  platformName: typeof SCENARIO_TIMELINE_PLATFORM_NAME;
  platformVersion: typeof SCENARIO_TIMELINE_PLATFORM_VERSION;
  releaseTag: typeof SCENARIO_TIMELINE_PLATFORM_RELEASE_TAG;
  certificationVersion: typeof SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  freezeVersion: typeof SCENARIO_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION;
  freezeTimestamp: string;
  platformStatus: Readonly<{
    certified: typeof SCENARIO_TIMELINE_PLATFORM_STATUS_CERTIFIED;
    frozen: typeof SCENARIO_TIMELINE_PLATFORM_STATUS_FROZEN;
    released: typeof SCENARIO_TIMELINE_PLATFORM_STATUS_RELEASED;
    productionReady: typeof SCENARIO_TIMELINE_PLATFORM_STATUS_PRODUCTION_READY;
    readOnly: true;
  }>;
  releaseStatus: typeof SCENARIO_TIMELINE_PLATFORM_RELEASE_STAGE;
  platformScope: readonly string[];
  compatibilityVersion: typeof SCENARIO_TIMELINE_PLATFORM_COMPATIBILITY_VERSION;
  extensionPolicy: typeof SCENARIO_TIMELINE_PLATFORM_FUTURE_EXTENSION_POLICY;
  supportPolicy: typeof SCENARIO_TIMELINE_PLATFORM_SUPPORT_POLICY;
  architectureVersion: typeof SCENARIO_TIMELINE_PLATFORM_FREEZE_ARCHITECTURE_VERSION;
  foundationContractVersion: typeof SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION;
  foundationArchitectureVersion: typeof SCENARIO_TIMELINE_PLATFORM_ARCHITECTURE_VERSION;
  certifiedPhases: typeof SCENARIO_TIMELINE_PLATFORM_FROZEN_PHASES;
  publicApiRegistry: typeof SCENARIO_TIMELINE_PLATFORM_FROZEN_PUBLIC_APIS;
  contractRegistry: typeof SCENARIO_TIMELINE_PLATFORM_PUBLIC_CONTRACT_REGISTRY;
  extensionRegistry: typeof SCENARIO_TIMELINE_PLATFORM_EXTENSION_REGISTRY;
  compatibilityMatrix: typeof SCENARIO_TIMELINE_PLATFORM_COMPATIBILITY_MATRIX;
  publicGuarantees: typeof SCENARIO_TIMELINE_PLATFORM_PUBLIC_GUARANTEES;
  freezeRules: typeof SCENARIO_TIMELINE_FREEZE_RULES;
  releaseTags: typeof SCENARIO_TIMELINE_PLATFORM_FREEZE_TAGS;
  architectureHash: string;
  metadataOnly: true;
  readOnly: true;
}>;

export type ScenarioTimelinePlatformRelease = Readonly<{
  releaseTag: typeof SCENARIO_TIMELINE_PLATFORM_RELEASE_TAG;
  releaseStage: typeof SCENARIO_TIMELINE_PLATFORM_RELEASE_STAGE;
  releaseDate: string;
  platformVersion: typeof SCENARIO_TIMELINE_PLATFORM_VERSION;
  freezeVersion: typeof SCENARIO_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION;
  productionReady: true;
  readOnly: true;
}>;

function buildArchitectureHash(): string {
  const payload = SCENARIO_TIMELINE_PLATFORM_FROZEN_PHASES.map(
    (phase) => `${phase.phaseId}:${phase.contractVersion}`
  ).join("|");
  let hash = 0;
  for (let index = 0; index < payload.length; index += 1) {
    hash = (Math.imul(31, hash) + payload.charCodeAt(index)) >>> 0;
  }
  return `arch-${hash.toString(16).padStart(8, "0")}`;
}

export function buildScenarioTimelinePlatformFreezeManifest(
  freezeTimestamp: string = new Date().toISOString()
): ScenarioTimelinePlatformFreezeManifest {
  return Object.freeze({
    platformName: SCENARIO_TIMELINE_PLATFORM_NAME,
    platformVersion: SCENARIO_TIMELINE_PLATFORM_VERSION,
    releaseTag: SCENARIO_TIMELINE_PLATFORM_RELEASE_TAG,
    certificationVersion: SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    freezeVersion: SCENARIO_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION,
    freezeTimestamp,
    platformStatus: Object.freeze({
      certified: SCENARIO_TIMELINE_PLATFORM_STATUS_CERTIFIED,
      frozen: SCENARIO_TIMELINE_PLATFORM_STATUS_FROZEN,
      released: SCENARIO_TIMELINE_PLATFORM_STATUS_RELEASED,
      productionReady: SCENARIO_TIMELINE_PLATFORM_STATUS_PRODUCTION_READY,
      readOnly: true as const,
    }),
    releaseStatus: SCENARIO_TIMELINE_PLATFORM_RELEASE_STAGE,
    platformScope: Object.freeze([
      "APP-5:1 Platform Foundation",
      "APP-5:2 Event Engine",
      "APP-5:3 Lifecycle Engine",
      "APP-5:4 History Engine",
      "APP-5:5 Query Engine",
      "APP-5:6 Public API Layer",
      "APP-5:7 Assistant Integration",
      "APP-5:8 Dashboard Integration",
      "APP-5:9 Platform Certification",
      "APP-5:10 Platform Freeze",
    ]),
    compatibilityVersion: SCENARIO_TIMELINE_PLATFORM_COMPATIBILITY_VERSION,
    extensionPolicy: SCENARIO_TIMELINE_PLATFORM_FUTURE_EXTENSION_POLICY,
    supportPolicy: SCENARIO_TIMELINE_PLATFORM_SUPPORT_POLICY,
    architectureVersion: SCENARIO_TIMELINE_PLATFORM_FREEZE_ARCHITECTURE_VERSION,
    foundationContractVersion: SCENARIO_TIMELINE_PLATFORM_CONTRACT_VERSION,
    foundationArchitectureVersion: SCENARIO_TIMELINE_PLATFORM_ARCHITECTURE_VERSION,
    certifiedPhases: SCENARIO_TIMELINE_PLATFORM_FROZEN_PHASES,
    publicApiRegistry: SCENARIO_TIMELINE_PLATFORM_FROZEN_PUBLIC_APIS,
    contractRegistry: SCENARIO_TIMELINE_PLATFORM_PUBLIC_CONTRACT_REGISTRY,
    extensionRegistry: SCENARIO_TIMELINE_PLATFORM_EXTENSION_REGISTRY,
    compatibilityMatrix: SCENARIO_TIMELINE_PLATFORM_COMPATIBILITY_MATRIX,
    publicGuarantees: SCENARIO_TIMELINE_PLATFORM_PUBLIC_GUARANTEES,
    freezeRules: SCENARIO_TIMELINE_FREEZE_RULES,
    releaseTags: SCENARIO_TIMELINE_PLATFORM_FREEZE_TAGS,
    architectureHash: buildArchitectureHash(),
    metadataOnly: true as const,
    readOnly: true as const,
  });
}

export function buildScenarioTimelinePlatformRelease(
  releaseDate: string = new Date().toISOString()
): ScenarioTimelinePlatformRelease {
  return Object.freeze({
    releaseTag: SCENARIO_TIMELINE_PLATFORM_RELEASE_TAG,
    releaseStage: SCENARIO_TIMELINE_PLATFORM_RELEASE_STAGE,
    releaseDate,
    platformVersion: SCENARIO_TIMELINE_PLATFORM_VERSION,
    freezeVersion: SCENARIO_TIMELINE_PLATFORM_FREEZE_CONTRACT_VERSION,
    productionReady: true as const,
    readOnly: true as const,
  });
}

export function getScenarioTimelinePlatformFreezeManifest(
  freezeTimestamp: string = new Date().toISOString()
): ScenarioTimelinePlatformFreezeManifest {
  return buildScenarioTimelinePlatformFreezeManifest(freezeTimestamp);
}

export function getScenarioTimelinePlatformRelease(
  releaseDate: string = new Date().toISOString()
): ScenarioTimelinePlatformRelease {
  return buildScenarioTimelinePlatformRelease(releaseDate);
}

export function getScenarioTimelinePlatformExtensionPolicy(): typeof SCENARIO_TIMELINE_PLATFORM_FUTURE_EXTENSION_POLICY {
  return SCENARIO_TIMELINE_PLATFORM_FUTURE_EXTENSION_POLICY;
}

export const ScenarioTimelinePlatformFreezeManifestBuilder = Object.freeze({
  buildScenarioTimelinePlatformFreezeManifest,
  buildScenarioTimelinePlatformRelease,
  getScenarioTimelinePlatformFreezeManifest,
  getScenarioTimelinePlatformRelease,
  getScenarioTimelinePlatformExtensionPolicy,
});
