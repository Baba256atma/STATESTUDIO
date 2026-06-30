import assert from "node:assert/strict";
import test from "node:test";

import { resetLlmAuditObservabilityLayerForTests } from "./llmAuditExports.ts";
import { LLM_AUDIT_CONTRACT_VERSION } from "./llmAuditContracts.ts";
import { resetLlmContextBuilderLayerForTests } from "./llmContextExports.ts";
import { LLM_CONTEXT_CONTRACT_VERSION } from "./llmContextContracts.ts";
import { resetLlmCostEstimatorLayerForTests } from "./llmCostExports.ts";
import { LLM_COST_CONTRACT_VERSION } from "./llmCostContracts.ts";
import { resetLlmModelRouterLayerForTests } from "./llmRouterExports.ts";
import { LLM_ROUTER_CONTRACT_VERSION } from "./llmRouterContracts.ts";
import { LLM_PLATFORM_CONTRACT_VERSION } from "./llmPlatformContracts.ts";
import { resetLlmPlatformFoundationForTests } from "./llmPlatformExports.ts";
import { runLlmPlatformCertification } from "./llmPlatformCertification.ts";
import { getLlmPlatformCompatibilityMatrix } from "./llmPlatformCompatibility.ts";
import {
  LlmPlatform,
  buildLlmPlatformFreezeManifest,
  getLlmCertifiedPhaseRegistrations,
  getLlmPlatformRegistry,
  isLlmPlatformFrozen,
  resetLlmPlatformFreezeForTests,
  runLlmPlatformFreeze,
  runLlmPlatformRegression,
  LLM_CERTIFIED_MVP_PHASE_KEYS,
  LLM_PLATFORM_FREEZE_CONTRACT_VERSION,
  LLM_PLATFORM_FREEZE_PRINCIPLES,
  LLM_PLATFORM_FREEZE_PUBLIC_API_REGISTRY,
  LLM_PLATFORM_FREEZE_VERSION,
  LLM_PLATFORM_RELEASE_VERSION,
} from "./llmPlatformFreeze.ts";
import { validateLlmPlatformFreezeManifest } from "./llmPlatformFreezeManifest.ts";
import { resetLlmPromptBuilderLayerForTests } from "./llmPromptExports.ts";
import { LLM_PROMPT_CONTRACT_VERSION } from "./llmPromptContracts.ts";
import { LLM_PROVIDER_CONTRACT_VERSION } from "./llmProviderContracts.ts";
import { resetLlmProviderAdapterLayerForTests } from "./llmProviderExports.ts";
import { resetLlmResilienceCoordinatorLayerForTests } from "./llmResilienceExports.ts";
import { LLM_RESILIENCE_CONTRACT_VERSION } from "./llmResilienceContracts.ts";
import { LLM_RUNTIME_CONTRACT_VERSION } from "./llmRuntimeContracts.ts";
import { resetLlmRuntimeContractLayerForTests } from "./llmRuntimeExports.ts";
import { resetLlmSecurityRedactionLayerForTests } from "./llmSecurityExports.ts";
import { LLM_SECURITY_CONTRACT_VERSION } from "./llmSecurityContracts.ts";
import { resetLlmTokenMeterLayerForTests } from "./llmTokenExports.ts";
import { LLM_TOKEN_CONTRACT_VERSION } from "./llmTokenContracts.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function resetAllLlmLayersForTests(): void {
  resetLlmPlatformFreezeForTests();
  resetLlmResilienceCoordinatorLayerForTests();
  resetLlmSecurityRedactionLayerForTests();
  resetLlmAuditObservabilityLayerForTests();
  resetLlmModelRouterLayerForTests();
  resetLlmCostEstimatorLayerForTests();
  resetLlmTokenMeterLayerForTests();
  resetLlmContextBuilderLayerForTests();
  resetLlmPromptBuilderLayerForTests();
  resetLlmRuntimeContractLayerForTests();
  resetLlmProviderAdapterLayerForTests();
  resetLlmPlatformFoundationForTests();
}

test.beforeEach(() => {
  resetAllLlmLayersForTests();
});

test("exports LLM/12 platform freeze vocabulary", () => {
  assert.equal(LLM_PLATFORM_FREEZE_CONTRACT_VERSION, "LLM/12");
  assert.equal(LLM_CERTIFIED_MVP_PHASE_KEYS.length, 11);
  assert.equal(LLM_PLATFORM_FREEZE_PUBLIC_API_REGISTRY.length, 6);
});

test("publishes immutable platform registry", () => {
  const registry = getLlmPlatformRegistry();
  assert.equal(registry.platformName, "LLM Platform");
  assert.equal(registry.phaseCount, 11);
  assert.equal(registry.releaseVersion, LLM_PLATFORM_RELEASE_VERSION);
  assert.equal(registry.freezeVersion, LLM_PLATFORM_FREEZE_VERSION);
  assert.ok(registry.publicApis.length > 50);
  assert.ok(registry.extensionPoints.some((entry) => entry.status === "certified"));
});

test("generates compatibility matrix across certified phases and architecture layers", () => {
  const matrix = getLlmPlatformCompatibilityMatrix();
  assert.equal(matrix.validationResult, "valid");
  assert.ok(matrix.entries.some((entry) => entry.sourceLayer === "APP" && entry.targetLayer === "LLM/1"));
  assert.ok(matrix.entries.some((entry) => entry.sourceLayer === "LLM/13" && entry.compatible === false));
  assert.ok(matrix.entries.some((entry) => entry.sourceLayer === "LLM/1" && entry.targetLayer === "LLM/2"));
});

test("runs read-only regression over LLM-1 through LLM-11", () => {
  const regression = runLlmPlatformRegression(FIXED_TIME);
  assert.equal(regression.success, true);
  assert.equal(regression.checksPassed, regression.checksTotal);
  assert.ok(regression.checks.some((check) => check.id === "phase_files_exist"));
  assert.ok(regression.checks.some((check) => check.id === "layer_LLM/11"));
});

test("certifies the complete LLM platform", () => {
  const certification = runLlmPlatformCertification(FIXED_TIME);
  assert.equal(certification.success, true);
  assert.equal(certification.certificationStatus, "certified");
  assert.equal(certification.regression.success, true);
  assert.ok(certification.summary.includes("certified, frozen, and released"));
});

test("generates immutable freeze manifest", () => {
  const manifest = buildLlmPlatformFreezeManifest(FIXED_TIME, "certified");
  assert.equal(manifest.platformName, "LLM Platform");
  assert.equal(manifest.certifiedPhases.length, 11);
  assert.equal(manifest.certificationStatus, "certified");
  assert.equal(validateLlmPlatformFreezeManifest(manifest), true);
  assert.ok(manifest.compatibility.includes("LLM/10"));
  assert.ok(manifest.compatibility.includes("LLM/12"));
});

test("freezes platform through certification runner", () => {
  assert.equal(isLlmPlatformFrozen(), false);
  const freeze = runLlmPlatformFreeze(FIXED_TIME);
  assert.equal(freeze.success, true);
  assert.equal(isLlmPlatformFrozen(), true);
  assert.ok(freeze.manifest);
  assert.equal(freeze.certification?.certificationStatus, "certified");
});

test("exposes stable public exports via LlmPlatform facade", () => {
  assert.equal(typeof LlmPlatform.runLlmPlatformCertification, "function");
  assert.equal(typeof LlmPlatform.getLlmPlatformCompatibilityMatrix, "function");
  assert.equal(LlmPlatform.version, "LLM/12");
  assert.ok(LLM_PLATFORM_FREEZE_PRINCIPLES.includes("metadata_only_no_runtime_behavior"));
  assert.deepEqual(getLlmCertifiedPhaseRegistrations().map((phase) => phase.phaseId), [...LLM_CERTIFIED_MVP_PHASE_KEYS]);
});

test("maintains LLM-1 through LLM-11 compatibility metadata", () => {
  const phases = getLlmCertifiedPhaseRegistrations();
  assert.equal(phases.find((phase) => phase.phaseId === "LLM/1")?.contractVersion, LLM_PLATFORM_CONTRACT_VERSION);
  assert.equal(phases.find((phase) => phase.phaseId === "LLM/2")?.contractVersion, LLM_PROVIDER_CONTRACT_VERSION);
  assert.equal(phases.find((phase) => phase.phaseId === "LLM/3")?.contractVersion, LLM_RUNTIME_CONTRACT_VERSION);
  assert.equal(phases.find((phase) => phase.phaseId === "LLM/4")?.contractVersion, LLM_PROMPT_CONTRACT_VERSION);
  assert.equal(phases.find((phase) => phase.phaseId === "LLM/5")?.contractVersion, LLM_CONTEXT_CONTRACT_VERSION);
  assert.equal(phases.find((phase) => phase.phaseId === "LLM/6")?.contractVersion, LLM_TOKEN_CONTRACT_VERSION);
  assert.equal(phases.find((phase) => phase.phaseId === "LLM/7")?.contractVersion, LLM_COST_CONTRACT_VERSION);
  assert.equal(phases.find((phase) => phase.phaseId === "LLM/8")?.contractVersion, LLM_ROUTER_CONTRACT_VERSION);
  assert.equal(phases.find((phase) => phase.phaseId === "LLM/9")?.contractVersion, LLM_AUDIT_CONTRACT_VERSION);
  assert.equal(phases.find((phase) => phase.phaseId === "LLM/10")?.contractVersion, LLM_SECURITY_CONTRACT_VERSION);
  assert.equal(phases.find((phase) => phase.phaseId === "LLM/11")?.contractVersion, LLM_RESILIENCE_CONTRACT_VERSION);
});

test("does not include LLM-13 in MVP certification path", async () => {
  const registry = getLlmPlatformRegistry();
  assert.equal(registry.certifiedPhases.some((phase) => phase.phaseId === "LLM/13"), false);
  const { readFile } = await import("node:fs/promises");
  const freezeFiles = [
    "llmPlatformFreeze.ts",
    "llmPlatformFreezeRegistry.ts",
    "llmPlatformCertification.ts",
    "llmPlatformRegression.ts",
  ];
  for (const file of freezeFiles) {
    const source = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(source.includes("llmCachePlatform"), false, `${file} must not depend on llmCache platform`);
  }
});
