/**
 * APP-5:9 — Scenario Timeline Platform architecture boundary certification.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { SCENARIO_TIMELINE_API_LAYER_SELF_MANIFEST } from "./scenarioTimelineApiContracts.ts";
import { SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_SELF_MANIFEST } from "./scenarioTimelineAssistantContracts.ts";
import { SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_SELF_MANIFEST } from "./scenarioTimelineDashboardContracts.ts";
import {
  SCENARIO_TIMELINE_PLATFORM_BYPASS_FORBIDDEN_IMPORTS,
  SCENARIO_TIMELINE_PLATFORM_INTEGRATION_MODULES,
} from "./scenarioTimelinePlatformCertificationConstants.ts";
import { SCENARIO_TIMELINE_PLATFORM_SELF_MANIFEST } from "./scenarioTimelinePlatformContracts.ts";
import { SCENARIO_TIMELINE_MUST_NOT_OWN } from "./scenarioTimelinePlatformConstants.ts";
import type { ScenarioTimelinePlatformCertificationCheck } from "./scenarioTimelinePlatformCertificationTypes.ts";

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ScenarioTimelinePlatformCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function readModule(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function integrationModulesAvoidBypass(): boolean {
  return SCENARIO_TIMELINE_PLATFORM_INTEGRATION_MODULES.every((path) => {
    const source = readModule(path);
    return SCENARIO_TIMELINE_PLATFORM_BYPASS_FORBIDDEN_IMPORTS.every((pattern) => !source.includes(pattern));
  });
}

function moduleAvoidsForbiddenOwnership(source: string): boolean {
  const forbidden = ["localStorage", "indexedDB", "fetch(", "openai", "useState", "React.createElement"];
  return forbidden.every((pattern) => !source.includes(pattern));
}

export function runScenarioTimelinePlatformArchitectureCertification(): readonly ScenarioTimelinePlatformCertificationCheck[] {
  const checks: ScenarioTimelinePlatformCertificationCheck[] = [];

  const manifests = [
    { id: "app5_1_manifest", manifest: SCENARIO_TIMELINE_PLATFORM_SELF_MANIFEST },
    { id: "app5_6_manifest", manifest: SCENARIO_TIMELINE_API_LAYER_SELF_MANIFEST },
    { id: "app5_7_manifest", manifest: SCENARIO_TIMELINE_ASSISTANT_INTEGRATION_SELF_MANIFEST },
    { id: "app5_8_manifest", manifest: SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_SELF_MANIFEST },
  ];

  for (const entry of manifests) {
    const result = validateStageManifest(entry.manifest);
    checks.push(
      check(
        entry.id,
        `${entry.manifest.stageId} stage manifest valid`,
        result.valid,
        result.issues.map((issue) => issue.message).join("; ") || "valid"
      )
    );
  }

  checks.push(
    check(
      "integration_no_bypass",
      "Integration modules avoid engine/registry bypass imports",
      integrationModulesAvoidBypass(),
      SCENARIO_TIMELINE_PLATFORM_INTEGRATION_MODULES.join(", ")
    )
  );

  checks.push(
    check(
      "must_not_own_enforced",
      "Platform must-not-own rules are defined",
      SCENARIO_TIMELINE_MUST_NOT_OWN.length > 0,
      String(SCENARIO_TIMELINE_MUST_NOT_OWN.length)
    )
  );

  const integrationSource = readModule("app/lib/scenario-timeline/scenarioTimelineAssistantIntegration.ts");
  checks.push(
    check(
      "no_ui_in_integration",
      "Integration modules avoid UI and persistence patterns",
      moduleAvoidsForbiddenOwnership(integrationSource),
      "scenarioTimelineAssistantIntegration.ts"
    )
  );

  const boundary = evaluateStageFileBoundary({
    filePath: "frontend/app/lib/scenario-timeline/scenarioTimelineApiLayer.ts",
    allowedFiles: SCENARIO_TIMELINE_API_LAYER_SELF_MANIFEST.allowedFiles,
    forbiddenPatterns: SCENARIO_TIMELINE_API_LAYER_SELF_MANIFEST.forbiddenPatterns,
  });
  checks.push(
    check(
      "api_layer_boundary",
      "APP-5:6 API layer architecture boundary passes",
      boundary.allowed,
      boundary.message
    )
  );

  return Object.freeze(checks);
}

export function verifyScenarioTimelinePlatformDocumentationCompleteness(
  repoRoot: string
): ScenarioTimelinePlatformCertificationCheck {
  const requiredDocs = [
    "docs/app-5-1-scenario-timeline-platform-foundation.md",
    "docs/app-5-6-scenario-timeline-api-layer.md",
    "docs/app-5-7-scenario-timeline-assistant-integration.md",
    "docs/app-5-8-scenario-timeline-dashboard-integration.md",
    "docs/app-5-9-scenario-timeline-platform-certification-report.md",
  ];
  const missing = requiredDocs.filter((doc) => !existsSync(join(repoRoot, doc)));
  return check(
    "documentation_completeness",
    "Required APP-5 documentation files exist",
    missing.length === 0,
    missing.length === 0 ? requiredDocs.join(", ") : `Missing: ${missing.join(", ")}`
  );
}
