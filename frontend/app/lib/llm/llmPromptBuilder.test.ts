import assert from "node:assert/strict";
import test from "node:test";

import { LLM_PLATFORM_CONTRACT_VERSION } from "./llmPlatformContracts.ts";
import { resetLlmPlatformFoundationForTests } from "./llmPlatformExports.ts";
import { LLM_PROVIDER_CONTRACT_VERSION } from "./llmProviderContracts.ts";
import { resetLlmProviderAdapterLayerForTests } from "./llmProviderExports.ts";
import {
  LLM_PROMPT_CONTRACT_VERSION,
  LLM_PROMPT_PRINCIPLES,
  LLM_PROMPT_PUBLIC_API_REGISTRY,
  LLM_PROMPT_RUNTIME_DEPENDENCY,
  LLM_PROMPT_SECTION_KEYS,
  LLM_PROMPT_TEMPLATE_KEYS,
} from "./llmPromptContracts.ts";
import { assemblePromptSections, buildPromptPackage } from "./llmPromptAssembler.ts";
import {
  PromptBuilderPlatform,
  buildLlmPromptBuilderLayer,
  discoverPromptTemplates,
  getLlmPromptBuilderLayerState,
  getLlmPromptPlatformManifest,
  getPromptManifest,
  getPromptRegistry,
  resetLlmPromptBuilderLayerForTests,
  validatePromptPackage,
} from "./llmPromptExports.ts";
import { sortLlmPromptSections, validateLlmPromptSectionOrdering } from "./llmPromptSections.ts";
import { getAllLlmPromptTemplateKeys, resolveDefaultPromptTemplateKey } from "./llmPromptTemplates.ts";
import { validatePromptBuildInput, validatePromptRuntimeCompatibility } from "./llmPromptValidation.ts";
import { LLM_RUNTIME_CONTRACT_VERSION } from "./llmRuntimeContracts.ts";
import { buildLlmRuntimeRequestEnvelope } from "./llmRuntimeEnvelope.ts";
import { resetLlmRuntimeContractLayerForTests } from "./llmRuntimeExports.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function buildRuntimeRequest() {
  return buildLlmRuntimeRequestEnvelope(
    Object.freeze({
      requestId: "req-prompt-001",
      traceId: "trace-prompt-001",
      correlationId: "corr-prompt-001",
      userMessage: "Analyze the quarterly KPI trends.",
      systemInstructionRef: "system-instruction-ref-001",
      providerKey: "gpt",
      modelKey: "gpt-4o-mini",
      workspaceId: "ws-1",
      organizationId: "org-1",
      userId: "user-1",
    })
  );
}

test.beforeEach(() => {
  resetLlmPromptBuilderLayerForTests();
  resetLlmRuntimeContractLayerForTests();
  resetLlmProviderAdapterLayerForTests();
  resetLlmPlatformFoundationForTests();
});

test("exports LLM/4 prompt builder vocabulary", () => {
  assert.equal(LLM_PROMPT_CONTRACT_VERSION, "LLM/4");
  assert.equal(LLM_PROMPT_RUNTIME_DEPENDENCY, "LLM/3");
  assert.equal(LLM_PROMPT_SECTION_KEYS.length, 8);
  assert.equal(LLM_PROMPT_TEMPLATE_KEYS.length, 9);
  assert.equal(LLM_PROMPT_PUBLIC_API_REGISTRY.length, 7);
});

test("creates deterministic prompt package from runtime request", () => {
  buildLlmPromptBuilderLayer(FIXED_TIME);
  const result = buildPromptPackage(
    Object.freeze({ runtimeRequest: buildRuntimeRequest(), templateId: "kpi_analysis" }),
    FIXED_TIME
  );
  assert.equal(result.success, true);
  assert.ok(result.package);
  assert.equal(result.package?.promptId, "prompt-req-prompt-001");
  assert.equal(result.package?.promptVersion, "LLM/4");
  assert.equal(result.package?.runtimeVersion, "LLM/3");
  assert.equal(result.package?.templateId, "kpi_analysis");
  assert.ok(result.package?.sections.some((section) => section.sectionKey === "system"));
  assert.ok(result.package?.sections.some((section) => section.sectionKey === "user"));
});

test("preserves deterministic section ordering", () => {
  buildLlmPromptBuilderLayer(FIXED_TIME);
  const sections = assemblePromptSections(
    Object.freeze({
      runtimeRequest: buildRuntimeRequest(),
      templateId: "executive_analysis",
      developerContentRef: "developer-ref-001",
      contextContentRef: "context-ref-001",
    })
  );
  assert.equal(validateLlmPromptSectionOrdering(sections).length, 0);
  const sorted = sortLlmPromptSections(sections);
  for (let index = 1; index < sorted.length; index += 1) {
    assert.ok(sorted[index].order > sorted[index - 1].order);
  }
  assert.equal(sorted[0].sectionKey, "system");
});

test("registers and discovers prompt templates", () => {
  buildLlmPromptBuilderLayer(FIXED_TIME);
  const registry = getPromptRegistry();
  assert.equal(registry.templateCount, getAllLlmPromptTemplateKeys().length);
  const templates = discoverPromptTemplates();
  assert.ok(templates.some((template) => template.templateId === "scenario_analysis"));
  assert.ok(templates.some((template) => template.templateId === "executive_summary"));
});

test("removes empty optional sections during assembly", () => {
  buildLlmPromptBuilderLayer(FIXED_TIME);
  const sections = assemblePromptSections(
    Object.freeze({ runtimeRequest: buildRuntimeRequest(), templateId: "general_assistant" })
  );
  assert.equal(sections.some((section) => section.sectionKey === "developer"), false);
  assert.equal(sections.some((section) => section.sectionKey === "context_reference"), false);
});

test("validates required sections empty user message and runtime compatibility", () => {
  buildLlmPromptBuilderLayer(FIXED_TIME);
  const valid = buildPromptPackage(Object.freeze({ runtimeRequest: buildRuntimeRequest() }), FIXED_TIME);
  assert.equal(validatePromptPackage(valid.package!).valid, true);
  const emptyUser = buildLlmRuntimeRequestEnvelope(
    Object.freeze({
      requestId: "req-empty",
      traceId: "trace-empty",
      correlationId: "corr-empty",
      userMessage: "  ",
      systemInstructionRef: "system-ref",
      providerKey: "gpt",
      modelKey: "gpt-4o-mini",
      workspaceId: "ws-1",
      organizationId: "org-1",
      userId: "user-1",
    })
  );
  const invalid = buildPromptPackage(Object.freeze({ runtimeRequest: emptyUser }), FIXED_TIME);
  assert.equal(invalid.success, false);
  assert.equal(validatePromptRuntimeCompatibility("LLM/3").valid, true);
  assert.equal(validatePromptRuntimeCompatibility("LLM/99").valid, false);
});

test("generates immutable prompt manifest", () => {
  buildLlmPromptBuilderLayer(FIXED_TIME);
  const result = buildPromptPackage(
    Object.freeze({ runtimeRequest: buildRuntimeRequest(), templateId: "risk_analysis" }),
    FIXED_TIME
  );
  const manifest = getPromptManifest(result.package!);
  assert.equal(manifest.templateId, "risk_analysis");
  assert.equal(manifest.validationResult, "valid");
  assert.ok(manifest.sectionCount >= 2);
  assert.ok(manifest.compatibility.includes("LLM/4"));
});

test("exposes stable public exports and platform manifest", () => {
  buildLlmPromptBuilderLayer(FIXED_TIME);
  const manifest = getLlmPromptPlatformManifest();
  assert.equal(manifest.version, "LLM/4");
  assert.deepEqual(manifest.publicApis, LLM_PROMPT_PUBLIC_API_REGISTRY);
  assert.equal(typeof PromptBuilderPlatform.buildPromptPackage, "function");
  assert.equal(getLlmPromptBuilderLayerState(FIXED_TIME).initialized, true);
  assert.ok(LLM_PROMPT_PRINCIPLES.includes("no_business_reasoning"));
});

test("maintains LLM-1 LLM-2 LLM-3 compatibility", () => {
  const layer = buildLlmPromptBuilderLayer(FIXED_TIME);
  assert.equal(layer.success, true);
  assert.equal(LLM_PLATFORM_CONTRACT_VERSION, "LLM/1");
  assert.equal(LLM_PROVIDER_CONTRACT_VERSION, "LLM/2");
  assert.equal(LLM_RUNTIME_CONTRACT_VERSION, "LLM/3");
  const inputValidation = validatePromptBuildInput(
    Object.freeze({ runtimeRequest: buildRuntimeRequest(), templateId: resolveDefaultPromptTemplateKey() })
  );
  assert.equal(inputValidation.valid, true);
});

test("supports all required prompt templates", () => {
  buildLlmPromptBuilderLayer(FIXED_TIME);
  for (const templateId of LLM_PROMPT_TEMPLATE_KEYS) {
    const result = buildPromptPackage(
      Object.freeze({ runtimeRequest: buildRuntimeRequest(), templateId }),
      FIXED_TIME
    );
    assert.equal(result.success, true, templateId);
    assert.equal(result.package?.templateId, templateId);
  }
});

test("does not import or depend on enterprise cache prototype", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "llmPromptContracts.ts",
    "llmPromptTypes.ts",
    "llmPromptSections.ts",
    "llmPromptTemplates.ts",
    "llmPromptAssembler.ts",
    "llmPromptValidation.ts",
    "llmPromptManifest.ts",
    "llmPromptRegistry.ts",
    "llmPromptExports.ts",
  ];
  for (const file of files) {
    const source = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(source.includes("llmCache"), false, `${file} must not reference llmCache`);
  }
});
