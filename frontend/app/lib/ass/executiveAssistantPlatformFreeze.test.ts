import assert from "node:assert/strict";
import test from "node:test";

import { resetExecutiveAssistantClarificationLayerForTests } from "./executiveAssistantClarificationExports.ts";
import { resetExecutiveAssistantConversationLayerForTests } from "./executiveAssistantConversationExports.ts";
import { resetExecutiveAssistantConversationStateLayerForTests } from "./executiveAssistantConversationStateExports.ts";
import { resetExecutiveAssistantCoordinationLayerForTests } from "./executiveAssistantCoordinationExports.ts";
import { resetExecutiveAssistantIntentLayerForTests } from "./executiveAssistantIntentExports.ts";
import { ASS_PLATFORM_CONTRACT_VERSION } from "./executiveAssistantPlatformContracts.ts";
import { resetExecutiveAssistantPlatformFoundationForTests } from "./executiveAssistantPlatformExports.ts";
import {
  ASS_CERTIFIED_MVP_PHASE_KEYS,
  ASS_EXTENSION_POLICY,
  ASS_PLATFORM_FREEZE_CONTRACT_VERSION,
  ASS_PLATFORM_FREEZE_PRINCIPLES,
  ASS_PLATFORM_FREEZE_PUBLIC_API_REGISTRY,
  ASS_PLATFORM_FREEZE_VERSION,
  ASS_PLATFORM_RELEASE_DECLARATION,
  ASS_PLATFORM_RELEASE_VERSION,
  ExecutiveAssistantPlatform,
  buildExecutiveAssistantPlatformManifest,
  getExecutiveAssistantCertifiedPhaseRegistrations,
  getExecutiveAssistantPlatformCompatibilityMatrix,
  getExecutiveAssistantPlatformRegistry,
  isExecutiveAssistantPlatformFrozen,
  resetExecutiveAssistantPlatformFreezeForTests,
  runExecutiveAssistantPlatformCertification,
  runExecutiveAssistantPlatformFreeze,
  runExecutiveAssistantPlatformRegression,
  validateExecutiveAssistantPlatformManifest,
} from "./executiveAssistantPlatformFreeze.ts";
import { ASS_CONVERSATION_CONTRACT_VERSION } from "./executiveAssistantConversationContracts.ts";
import { ASS_CONVERSATION_STATE_VERSION } from "./executiveAssistantConversationStateContracts.ts";
import { ASS_COORDINATION_VERSION } from "./executiveAssistantCoordinationContracts.ts";
import { ASS_INTENT_VERSION } from "./executiveAssistantIntentContracts.ts";
import { resetExecutiveAssistantResponseLayerForTests } from "./executiveAssistantResponseExports.ts";
import { ASS_RESPONSE_VERSION } from "./executiveAssistantResponseContracts.ts";
import { resetExecutiveAssistantRoutingLayerForTests } from "./executiveAssistantRoutingExports.ts";
import { ASS_ROUTING_VERSION } from "./executiveAssistantRoutingContracts.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function resetAllAssLayersForTests(): void {
  resetExecutiveAssistantPlatformFreezeForTests();
  resetExecutiveAssistantCoordinationLayerForTests();
  resetExecutiveAssistantClarificationLayerForTests();
  resetExecutiveAssistantResponseLayerForTests();
  resetExecutiveAssistantIntentLayerForTests();
  resetExecutiveAssistantRoutingLayerForTests();
  resetExecutiveAssistantConversationStateLayerForTests();
  resetExecutiveAssistantConversationLayerForTests();
  resetExecutiveAssistantPlatformFoundationForTests();
}

test.beforeEach(() => {
  resetAllAssLayersForTests();
});

test("exports ASS/9 platform freeze vocabulary", () => {
  assert.equal(ASS_PLATFORM_FREEZE_CONTRACT_VERSION, "ASS/9");
  assert.equal(ASS_CERTIFIED_MVP_PHASE_KEYS.length, 8);
  assert.equal(ASS_PLATFORM_FREEZE_PUBLIC_API_REGISTRY.length, 5);
  assert.equal(ASS_PLATFORM_RELEASE_DECLARATION, "The Executive Assistant Platform is Certified, Frozen, and Released.");
});

test("publishes immutable platform registry", () => {
  const registry = getExecutiveAssistantPlatformRegistry();
  assert.equal(registry.platformName, "Executive Assistant Platform");
  assert.equal(registry.phaseCount, 8);
  assert.equal(registry.releaseVersion, ASS_PLATFORM_RELEASE_VERSION);
  assert.equal(registry.freezeVersion, ASS_PLATFORM_FREEZE_VERSION);
  assert.ok(registry.publicApis.length > 20);
  assert.ok(registry.extensionPoints.some((entry) => entry.status === "certified"));
});

test("generates compatibility matrix across certified phases and architecture layers", () => {
  const matrix = getExecutiveAssistantPlatformCompatibilityMatrix();
  assert.equal(matrix.validationResult, "valid");
  assert.ok(matrix.entries.some((entry) => entry.sourceLayer === "APP" && entry.targetLayer === "ASS/1"));
  assert.ok(matrix.entries.some((entry) => entry.sourceLayer === "SMM" && entry.targetLayer === "ASS"));
  assert.ok(matrix.entries.some((entry) => entry.sourceLayer === "ASS" && entry.targetLayer === "IDN"));
  assert.ok(matrix.entries.some((entry) => entry.sourceLayer === "ASS/1" && entry.targetLayer === "ASS/2"));
  assert.ok(matrix.entries.some((entry) => entry.sourceLayer === "ASS/7" && entry.targetLayer === "ASS/8"));
});

test("runs read-only regression over ASS-1 through ASS-8", () => {
  const regression = runExecutiveAssistantPlatformRegression(FIXED_TIME);
  assert.equal(regression.success, true);
  assert.equal(regression.checksPassed, regression.checksTotal);
  assert.ok(regression.checks.some((check) => check.id === "phase_files_exist"));
  assert.ok(regression.checks.some((check) => check.id === "layer_ASS/8"));
});

test("certifies the complete ASS platform", () => {
  const certification = runExecutiveAssistantPlatformCertification(FIXED_TIME);
  assert.equal(certification.success, true);
  assert.equal(certification.certificationStatus, "certified");
  assert.equal(certification.regression.success, true);
  assert.ok(certification.summary.includes("Certified, Frozen, and Released"));
});

test("generates immutable platform manifest", () => {
  const manifest = buildExecutiveAssistantPlatformManifest(FIXED_TIME, "certified");
  assert.equal(manifest.platformName, "Executive Assistant Platform");
  assert.equal(manifest.certifiedPhases.length, 8);
  assert.equal(manifest.certificationStatus, "certified");
  assert.equal(validateExecutiveAssistantPlatformManifest(manifest), true);
  assert.ok(manifest.compatibility.includes("ASS/8"));
  assert.ok(manifest.compatibility.includes("ASS/9"));
  assert.ok(manifest.extensionPolicy.length > 0);
  assert.equal(manifest.officialPublication, ASS_PLATFORM_RELEASE_DECLARATION);
});

test("freezes platform through certification runner", () => {
  assert.equal(isExecutiveAssistantPlatformFrozen(), false);
  const freeze = runExecutiveAssistantPlatformFreeze(FIXED_TIME);
  assert.equal(freeze.success, true);
  assert.equal(isExecutiveAssistantPlatformFrozen(), true);
  assert.ok(freeze.manifest);
  assert.equal(freeze.certification?.certificationStatus, "certified");
  assert.equal(freeze.reason, ASS_PLATFORM_RELEASE_DECLARATION);
});

test("exposes stable public exports via ExecutiveAssistantPlatform release facade", () => {
  assert.equal(typeof ExecutiveAssistantPlatform.runExecutiveAssistantPlatformCertification, "function");
  assert.equal(typeof ExecutiveAssistantPlatform.getExecutiveAssistantPlatformCompatibilityMatrix, "function");
  assert.equal(ExecutiveAssistantPlatform.version, "ASS/9");
  assert.ok(ASS_PLATFORM_FREEZE_PRINCIPLES.includes("metadata_only_no_runtime_behavior"));
  assert.ok(ASS_EXTENSION_POLICY.includes("future_phases_extend_ass_9_additively"));
  assert.deepEqual(
    getExecutiveAssistantCertifiedPhaseRegistrations().map((phase) => phase.phaseId),
    [...ASS_CERTIFIED_MVP_PHASE_KEYS]
  );
});

test("maintains ASS-1 through ASS-8 compatibility metadata", () => {
  const phases = getExecutiveAssistantCertifiedPhaseRegistrations();
  assert.equal(phases.find((phase) => phase.phaseId === "ASS/1")?.contractVersion, ASS_PLATFORM_CONTRACT_VERSION);
  assert.equal(phases.find((phase) => phase.phaseId === "ASS/2")?.contractVersion, ASS_CONVERSATION_CONTRACT_VERSION);
  assert.equal(phases.find((phase) => phase.phaseId === "ASS/3")?.contractVersion, ASS_CONVERSATION_STATE_VERSION);
  assert.equal(phases.find((phase) => phase.phaseId === "ASS/4")?.contractVersion, ASS_ROUTING_VERSION);
  assert.equal(phases.find((phase) => phase.phaseId === "ASS/5")?.contractVersion, ASS_INTENT_VERSION);
  assert.equal(phases.find((phase) => phase.phaseId === "ASS/6")?.contractVersion, ASS_RESPONSE_VERSION);
  assert.equal(phases.find((phase) => phase.phaseId === "ASS/7")?.contractVersion, "ASS/7");
  assert.equal(phases.find((phase) => phase.phaseId === "ASS/8")?.contractVersion, ASS_COORDINATION_VERSION);
});

test("preserves ASS-1 through ASS-8 unchanged", async () => {
  const { readFile } = await import("node:fs/promises");
  const certifiedFiles = [
    "executiveAssistantPlatformContracts.ts",
    "executiveAssistantPlatformExports.ts",
    "executiveAssistantConversationContracts.ts",
    "executiveAssistantConversationExports.ts",
    "executiveAssistantConversationStateContracts.ts",
    "executiveAssistantConversationStateExports.ts",
    "executiveAssistantRoutingContracts.ts",
    "executiveAssistantRoutingExports.ts",
    "executiveAssistantIntentContracts.ts",
    "executiveAssistantIntentExports.ts",
    "executiveAssistantResponseContracts.ts",
    "executiveAssistantResponseExports.ts",
    "executiveAssistantClarificationContracts.ts",
    "executiveAssistantClarificationExports.ts",
    "executiveAssistantCoordinationContracts.ts",
    "executiveAssistantCoordinationExports.ts",
  ];
  for (const file of certifiedFiles) {
    const before = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    runExecutiveAssistantPlatformFreeze(FIXED_TIME);
    const after = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(before, after, `${file} must remain unchanged`);
  }
});

test("does not implement runtime coordination assistant execution or chat runtime", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "executiveAssistantPlatformFreezeRegistry.ts",
    "executiveAssistantPlatformRegression.ts",
    "executiveAssistantPlatformCertification.ts",
    "executiveAssistantPlatformFreezeRunner.ts",
    "executiveAssistantPlatformFreeze.ts",
  ];
  for (const file of files) {
    const source = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(source.includes("buildLlmPlatformFoundation"), false, `${file} must not import LLM foundation`);
    assert.equal(source.includes("buildSharedMentalModelPlatform"), false, `${file} must not import SMM freeze`);
    assert.equal(source.includes("openai"), false, `${file} must not implement LLM providers`);
    assert.equal(source.includes("runPrompt("), false, `${file} must not run prompts`);
    assert.equal(source.includes("executeAssistant("), false, `${file} must not execute assistant`);
  }
});
