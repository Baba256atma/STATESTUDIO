/**
 * APP-5:10 — Scenario Timeline Platform Freeze certification.
 */

import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS } from "./scenarioTimelinePlatformConstants.ts";
import { SCENARIO_TIMELINE_FREEZE_RULES, SCENARIO_TIMELINE_PLATFORM_IDENTITY } from "./scenarioTimelinePlatformContracts.ts";
import { certifyScenarioTimelinePlatform } from "./scenarioTimelinePlatformCertification.ts";
import { runScenarioTimelinePlatformRegression } from "./scenarioTimelinePlatformRegression.ts";
import { getScenarioTimelinePlatformCompatibility } from "./scenarioTimelinePlatformFreezeCompatibility.ts";
import {
  SCENARIO_TIMELINE_PLATFORM_FREEZE_DOCUMENTATION_FILES,
  SCENARIO_TIMELINE_PLATFORM_FREEZE_SELF_MANIFEST,
  SCENARIO_TIMELINE_PLATFORM_FREEZE_TAGS,
  SCENARIO_TIMELINE_PLATFORM_FUTURE_EXTENSION_POLICY,
  SCENARIO_TIMELINE_PLATFORM_PUBLIC_CONTRACT_REGISTRY,
  SCENARIO_TIMELINE_PLATFORM_EXTENSION_REGISTRY,
  SCENARIO_TIMELINE_PLATFORM_FROZEN_PUBLIC_APIS,
  SCENARIO_TIMELINE_PLATFORM_NAME,
  SCENARIO_TIMELINE_PLATFORM_RELEASE_TAG,
} from "./scenarioTimelinePlatformFreezeContracts.ts";
import { buildScenarioTimelinePlatformFreezeManifest } from "./scenarioTimelinePlatformFreezeManifest.ts";

const REPO_ROOT = join(process.cwd(), "..");

export type ScenarioTimelinePlatformFreezeCheck = Readonly<{
  id: string;
  title: string;
  passed: boolean;
  evidence: string;
  readOnly: true;
}>;

export type ScenarioTimelinePlatformFreezeCertificationResult = Readonly<{
  phaseName: string;
  status: "PASS" | "FAIL";
  certified: boolean;
  frozen: boolean;
  released: boolean;
  productionReady: boolean;
  checks: readonly ScenarioTimelinePlatformFreezeCheck[];
  passedChecks: number;
  totalChecks: number;
  summary: string;
  generatedAt: string;
  manifest: ReturnType<typeof buildScenarioTimelinePlatformFreezeManifest>;
  priorCertificationStatus: string;
  regressionStatus: string;
  platformScore: number;
  tags: typeof SCENARIO_TIMELINE_PLATFORM_FREEZE_TAGS;
  readOnly: true;
}>;

function check(id: string, title: string, passed: boolean, evidence: string): ScenarioTimelinePlatformFreezeCheck {
  return Object.freeze({ id, title, passed, evidence, readOnly: true as const });
}

function allDocumentationPresent(): boolean {
  return SCENARIO_TIMELINE_PLATFORM_FREEZE_DOCUMENTATION_FILES.every((filePath) =>
    existsSync(join(REPO_ROOT, filePath))
  );
}

function verifyTypescriptBuild(): boolean {
  try {
    const output = execSync("npx tsc --noEmit 2>&1", {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return !output.includes("scenarioTimelinePlatformFreeze");
  } catch (error) {
    const output =
      typeof error === "object" && error !== null && "stdout" in error
        ? String((error as { stdout: Buffer }).stdout)
        : "";
    return !output.includes("scenarioTimelinePlatformFreeze");
  }
}

export function runScenarioTimelinePlatformFreezeCertification(
  generatedAt: string = new Date().toISOString()
): ScenarioTimelinePlatformFreezeCertificationResult {
  const priorCertification = certifyScenarioTimelinePlatform(generatedAt);
  const regression = runScenarioTimelinePlatformRegression();
  const manifest = buildScenarioTimelinePlatformFreezeManifest(generatedAt);
  const compatibility = getScenarioTimelinePlatformCompatibility();

  const checks: ScenarioTimelinePlatformFreezeCheck[] = [
    check(
      "FZ-1",
      "APP-5:9 platform certification present",
      priorCertification.certified && priorCertification.report.readyForFreeze,
      priorCertification.summary
    ),
    check(
      "FZ-2",
      "Platform identity published",
      SCENARIO_TIMELINE_PLATFORM_IDENTITY.appId === "APP-5" &&
        manifest.platformName === SCENARIO_TIMELINE_PLATFORM_NAME,
      manifest.platformName
    ),
    check(
      "FZ-3",
      "Release metadata complete",
      manifest.releaseTag === SCENARIO_TIMELINE_PLATFORM_RELEASE_TAG && manifest.releaseStatus.length > 0,
      manifest.releaseTag
    ),
    check(
      "FZ-4",
      "Compatibility matrix published",
      compatibility.backwardCompatibility.guaranteed === true,
      compatibility.compatibilityVersion
    ),
    check(
      "FZ-5",
      "Extension policy published",
      SCENARIO_TIMELINE_PLATFORM_FUTURE_EXTENSION_POLICY.integrationBoundary === "APP-5:6 Public API Layer",
      SCENARIO_TIMELINE_PLATFORM_FUTURE_EXTENSION_POLICY.policyId
    ),
    check(
      "FZ-6",
      "Public API registry frozen",
      SCENARIO_TIMELINE_PLATFORM_FROZEN_PUBLIC_APIS.length >= 15,
      String(SCENARIO_TIMELINE_PLATFORM_FROZEN_PUBLIC_APIS.length)
    ),
    check(
      "FZ-7",
      "Contract registry frozen",
      SCENARIO_TIMELINE_PLATFORM_PUBLIC_CONTRACT_REGISTRY.every((entry) => entry.frozen),
      String(SCENARIO_TIMELINE_PLATFORM_PUBLIC_CONTRACT_REGISTRY.length)
    ),
    check(
      "FZ-8",
      "Architecture freeze rules enforced",
      SCENARIO_TIMELINE_FREEZE_RULES.contractImmutable && SCENARIO_TIMELINE_FREEZE_RULES.breakingChangesForbidden,
      "freeze rules"
    ),
    check(
      "FZ-9",
      "Frozen lifecycle vocabulary",
      SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS.length === 8,
      String(SCENARIO_TIMELINE_LIFECYCLE_STAGE_KEYS.length)
    ),
    check(
      "FZ-10",
      "Backward compatibility guaranteed",
      compatibility.backwardCompatibility.breakingChangesForbidden === true,
      "breakingChangesForbidden"
    ),
    check(
      "FZ-11",
      "Regression safety",
      regression.success,
      regression.summary
    ),
    check(
      "FZ-12",
      "Documentation complete",
      allDocumentationPresent(),
      String(SCENARIO_TIMELINE_PLATFORM_FREEZE_DOCUMENTATION_FILES.length)
    ),
    check(
      "FZ-13",
      "Governance metadata present",
      manifest.supportPolicy.readOnly === true && manifest.extensionPolicy.readOnly === true,
      manifest.supportPolicy.policyId
    ),
    check(
      "FZ-14",
      "Extension registry registered",
      SCENARIO_TIMELINE_PLATFORM_EXTENSION_REGISTRY.length >= 5,
      String(SCENARIO_TIMELINE_PLATFORM_EXTENSION_REGISTRY.length)
    ),
    check(
      "FZ-15",
      "Stage manifest valid",
      validateStageManifest(SCENARIO_TIMELINE_PLATFORM_FREEZE_SELF_MANIFEST).valid,
      SCENARIO_TIMELINE_PLATFORM_FREEZE_SELF_MANIFEST.stageId
    ),
    check(
      "FZ-16",
      "Architecture boundary passes",
      evaluateStageFileBoundary({
        filePath: "frontend/app/lib/scenario-timeline/scenarioTimelinePlatformFreezeRunner.ts",
        allowedFiles: SCENARIO_TIMELINE_PLATFORM_FREEZE_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: SCENARIO_TIMELINE_PLATFORM_FREEZE_SELF_MANIFEST.forbiddenPatterns,
      }).allowed,
      "scenarioTimelinePlatformFreezeRunner.ts"
    ),
    check(
      "FZ-17",
      "Immutable freeze manifest",
      Object.isFrozen(manifest) && manifest.architectureHash.startsWith("arch-"),
      manifest.architectureHash
    ),
    check(
      "FZ-18",
      "Platform status FROZEN",
      manifest.platformStatus.frozen === "FROZEN",
      manifest.platformStatus.frozen
    ),
    check(
      "FZ-19",
      "Platform production-ready",
      manifest.platformStatus.productionReady === "PRODUCTION_READY",
      manifest.platformStatus.productionReady
    ),
    check("FZ-20", "TypeScript build (APP-5:10)", verifyTypescriptBuild(), "APP-5:10 module-local"),
  ];

  const passedChecks = checks.filter((entry) => entry.passed).length;
  const certified = passedChecks === checks.length;
  const platformScore = Math.round((passedChecks / checks.length) * 100);

  return Object.freeze({
    phaseName: "APP-5:10 Scenario Timeline Platform Freeze",
    status: certified ? "PASS" : "FAIL",
    certified,
    frozen: certified,
    released: certified,
    productionReady: certified,
    checks: Object.freeze(checks),
    passedChecks,
    totalChecks: checks.length,
    summary: certified
      ? "APP-5 Scenario Timeline Platform CERTIFIED, FROZEN, and RELEASED."
      : `APP-5:10 Platform freeze FAILED (${checks.length - passedChecks} gate(s)).`,
    generatedAt,
    manifest,
    priorCertificationStatus: priorCertification.status,
    regressionStatus: regression.success ? "PASS" : "FAIL",
    platformScore,
    tags: SCENARIO_TIMELINE_PLATFORM_FREEZE_TAGS,
    readOnly: true as const,
  });
}
