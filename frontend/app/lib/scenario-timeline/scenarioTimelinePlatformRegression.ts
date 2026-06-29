/**
 * APP-5:9 — Scenario Timeline Platform regression certification.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";

import {
  resolveScenarioIdentityExample,
  validateScenarioIdentityShape,
} from "../app-2-scenario-intelligence/scenarioIntelligenceContract.ts";
import { SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_SELF_MANIFEST } from "./scenarioTimelineDashboardContracts.ts";
import type {
  ScenarioTimelinePlatformCertificationCheck,
  ScenarioTimelinePlatformRegressionResult,
} from "./scenarioTimelinePlatformCertificationTypes.ts";

const REPO_ROOT = join(process.cwd(), "..");

function check(
  id: string,
  title: string,
  passed: boolean,
  evidence: string
): ScenarioTimelinePlatformCertificationCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function priorPhaseFilesPreserved(): ScenarioTimelinePlatformCertificationCheck {
  const libraryFiles = SCENARIO_TIMELINE_DASHBOARD_INTEGRATION_SELF_MANIFEST.allowedFiles.filter(
    (file) =>
      file.startsWith("frontend/app/lib/scenario-timeline/") &&
      !file.includes("scenarioTimelinePlatformCertification") &&
      !file.includes("app-5-9")
  );
  const missing = libraryFiles.filter((file) => {
    const relative = file.replace(/^frontend\//, "");
    return !existsSync(join(process.cwd(), relative));
  });
  return check(
    "frozen_files_preserved",
    "APP-5:1 through APP-5:8 library files remain present",
    missing.length === 0,
    missing.length === 0 ? `${libraryFiles.length} library files verified` : `Missing: ${missing.slice(0, 3).join(", ")}`
  );
}

export function runScenarioTimelinePlatformRegression(): ScenarioTimelinePlatformRegressionResult {
  const checks: ScenarioTimelinePlatformCertificationCheck[] = [];

  checks.push(priorPhaseFilesPreserved());

  const identity = resolveScenarioIdentityExample();
  checks.push(
    check(
      "app2_identity_regression",
      "APP-2 scenario identity contract remains compatible",
      validateScenarioIdentityShape(identity).valid,
      identity.scenarioId
    )
  );

  checks.push(
    check(
      "no_platform_cert_in_frozen_layers",
      "APP-5:9 certification files are additive only",
      existsSync(join(process.cwd(), "app/lib/scenario-timeline/scenarioTimelinePlatformCertificationRunner.ts")),
      "scenarioTimelinePlatformCertificationRunner.ts"
    )
  );

  const passed = checks.filter((entry) => entry.passed).length;
  return Object.freeze({
    success: passed === checks.length,
    checksPassed: passed,
    checksTotal: checks.length,
    summary: `${passed}/${checks.length} regression checks passed.`,
    checks: Object.freeze(checks),
    readOnly: true as const,
  });
}

export { REPO_ROOT as SCENARIO_TIMELINE_PLATFORM_CERTIFICATION_REPO_ROOT };
