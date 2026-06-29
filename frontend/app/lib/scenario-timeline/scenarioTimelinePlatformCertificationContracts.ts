/**
 * APP-5:9 — Scenario Timeline Platform Certification contracts.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_TAGS,
  SCENARIO_TIMELINE_PLATFORM_VALIDATION_GATE_KEYS,
} from "./scenarioTimelinePlatformCertificationConstants.ts";
import { SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_SELF_MANIFEST } from "./scenarioTimelineDashboardContracts.ts";
import { SCENARIO_TIMELINE_MUST_NOT_OWN } from "./scenarioTimelinePlatformConstants.ts";

export const SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_FORBIDDEN_PATTERNS = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  "components/",
  ".tsx",
  "react",
  "React",
  "useState",
  "TimelineChart",
  "PlaybackEngine",
  "localStorage",
  "indexedDB",
  "fetch(",
  "openai",
  "llm",
  "PlatformFreeze",
  "freezePlatform",
] as const);

export const SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_SELF_MANIFEST = Object.freeze({
  stageId: "APP-5/9",
  title: "Scenario Timeline Platform Certification",
  goal: "Official read-only platform-wide certification for APP-5:1 through APP-5:8.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/scenario-timeline/scenarioTimelinePlatformCertificationConstants.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelinePlatformCertificationTypes.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelinePlatformEndToEndCertification.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelinePlatformCompatibilityCertification.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelinePlatformArchitectureCertification.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelinePlatformRegression.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelinePlatformCertificationRunner.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelinePlatformCertificationContracts.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelinePlatformCertification.ts",
    "frontend/app/lib/scenario-timeline/scenarioTimelinePlatformCertification.test.ts",
    "docs/app-5-9-scenario-timeline-platform-certification-report.md",
  ]),
  forbiddenPatterns: SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze([
    "APP-5/1",
    "APP-5/2",
    "APP-5/3",
    "APP-5/4",
    "APP-5/5",
    "APP-5/6",
    "APP-5/7",
    "APP-5/8",
  ]),
  runtimePath: "library-only" as const,
  tags: SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_TAGS,
} satisfies StageManifest);

export function getScenarioTimelinePlatformCertificationContract(): Readonly<{
  contractVersion: typeof SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  validationGateCount: number;
  readOnly: true;
}> {
  return Object.freeze({
    contractVersion: SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    validationGateCount: SCENARIO_TIMELINE_PLATFORM_VALIDATION_GATE_KEYS.length,
    readOnly: true as const,
  });
}

export const ScenarioTimelinePlatformCertificationContract = Object.freeze({
  getScenarioTimelinePlatformCertificationContract,
  version: SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
  tags: SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_TAGS,
  mustNotOwn: SCENARIO_TIMELINE_MUST_NOT_OWN,
});

export { SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_TAGS };
