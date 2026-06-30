import assert from "node:assert/strict";
import test from "node:test";

import {
  LLM_CONTEXT_CONTRACT_VERSION,
  LLM_CONTEXT_PRINCIPLES,
  LLM_CONTEXT_PUBLIC_API_REGISTRY,
  LLM_CONTEXT_PROMPT_DEPENDENCY,
  LLM_CONTEXT_SOURCE_KEYS,
} from "./llmContextContracts.ts";
import {
  ContextBuilderPlatform,
  buildContextPackage,
  buildLlmContextBuilderLayer,
  discoverContextSources,
  getContextManifest,
  getContextRegistry,
  getLlmContextBuilderLayerState,
  getLlmContextPlatformManifest,
  resetLlmContextBuilderLayerForTests,
  validateContextPackage,
} from "./llmContextExports.ts";
import { buildContextContentRefFromPackage } from "./llmContextPackage.ts";
import {
  registerApprovedContextReference,
  resetLlmContextApprovedReferencesForTests,
  resolveContextReference,
  seedApprovedContextReferences,
} from "./llmContextResolver.ts";
import { getLlmContextSourceOrder } from "./llmContextSources.ts";
import {
  validateContextPromptCompatibility,
  validateContextReferenceUniqueness,
  validateContextRuntimeCompatibility,
  validateContextSectionOrdering,
} from "./llmContextValidation.ts";
import { LLM_PLATFORM_CONTRACT_VERSION } from "./llmPlatformContracts.ts";
import { resetLlmPlatformFoundationForTests } from "./llmPlatformExports.ts";
import { LLM_PROMPT_CONTRACT_VERSION } from "./llmPromptContracts.ts";
import { buildPromptPackage } from "./llmPromptExports.ts";
import { resetLlmPromptBuilderLayerForTests } from "./llmPromptExports.ts";
import { LLM_PROVIDER_CONTRACT_VERSION } from "./llmProviderContracts.ts";
import { resetLlmProviderAdapterLayerForTests } from "./llmProviderExports.ts";
import type { LlmContextReference } from "./llmContextTypes.ts";
import { LLM_RUNTIME_CONTRACT_VERSION } from "./llmRuntimeContracts.ts";
import { buildLlmRuntimeRequestEnvelope } from "./llmRuntimeEnvelope.ts";
import { resetLlmRuntimeContractLayerForTests } from "./llmRuntimeExports.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";

function buildReference(
  referenceId: string,
  sourceKey: LlmContextReference["sourceKey"],
  refId: string,
  approved: boolean = true
): LlmContextReference {
  return Object.freeze({
    referenceId,
    sourceKey,
    refId,
    label: `${sourceKey}-${refId}`,
    approved,
    readOnly: true as const,
  });
}

function seedTestApprovedReferences(): void {
  seedApprovedContextReferences([
    buildReference("ref-knowledge-1", "knowledge_reference", "knl-doc-001"),
    buildReference("ref-workspace-1", "workspace_reference", "ws-1"),
    buildReference("ref-kpi-1", "kpi_reference", "kpi-q1"),
  ]);
}

test.beforeEach(() => {
  resetLlmContextBuilderLayerForTests();
  resetLlmContextApprovedReferencesForTests();
  resetLlmPromptBuilderLayerForTests();
  resetLlmRuntimeContractLayerForTests();
  resetLlmProviderAdapterLayerForTests();
  resetLlmPlatformFoundationForTests();
});

test("exports LLM/5 context builder vocabulary", () => {
  assert.equal(LLM_CONTEXT_CONTRACT_VERSION, "LLM/5");
  assert.equal(LLM_CONTEXT_PROMPT_DEPENDENCY, "LLM/4");
  assert.equal(LLM_CONTEXT_SOURCE_KEYS.length, 10);
  assert.equal(LLM_CONTEXT_PUBLIC_API_REGISTRY.length, 7);
});

test("creates deterministic context package from approved references", () => {
  buildLlmContextBuilderLayer(FIXED_TIME);
  seedTestApprovedReferences();
  const result = buildContextPackage(
    Object.freeze({
      contextId: "ctx-001",
      references: Object.freeze([
        buildReference("ref-kpi-1", "kpi_reference", "kpi-q1"),
        buildReference("ref-knowledge-1", "knowledge_reference", "knl-doc-001"),
        buildReference("ref-workspace-1", "workspace_reference", "ws-1"),
      ]),
    }),
    FIXED_TIME
  );
  assert.equal(result.success, true);
  assert.equal(result.package?.contextId, "ctx-001");
  assert.equal(result.package?.version, "LLM/5");
  assert.equal(result.package?.sections.length, 3);
  assert.equal(result.package?.sections[0].sourceKey, "knowledge_reference");
  assert.equal(result.manifest?.validationResult, "valid");
});

test("registers and discovers context sources", () => {
  buildLlmContextBuilderLayer(FIXED_TIME);
  const registry = getContextRegistry();
  assert.equal(registry.sourceCount, LLM_CONTEXT_SOURCE_KEYS.length);
  const sources = discoverContextSources();
  assert.ok(sources.some((source) => source.sourceKey === "scenario_reference"));
  assert.ok(sources.some((source) => source.sourceKey === "memory_reference" && source.placeholder));
});

test("preserves deterministic context section ordering", () => {
  buildLlmContextBuilderLayer(FIXED_TIME);
  seedTestApprovedReferences();
  const result = buildContextPackage(
    Object.freeze({
      contextId: "ctx-order",
      references: Object.freeze([
        buildReference("ref-kpi-1", "kpi_reference", "kpi-q1"),
        buildReference("ref-knowledge-1", "knowledge_reference", "knl-doc-001"),
      ]),
    }),
    FIXED_TIME
  );
  const sections = result.package!.sections;
  assert.equal(validateContextSectionOrdering(sections).valid, true);
  assert.ok(sections[0].order < sections[1].order);
  assert.equal(sections[0].sourceKey, "knowledge_reference");
});

test("detects duplicate references", () => {
  buildLlmContextBuilderLayer(FIXED_TIME);
  const duplicates = validateContextReferenceUniqueness([
    buildReference("ref-a", "object_reference", "obj-1"),
    buildReference("ref-a", "relationship_reference", "rel-1"),
  ]);
  assert.equal(duplicates.valid, false);
});

test("reports missing and unapproved references without ignoring them", () => {
  buildLlmContextBuilderLayer(FIXED_TIME);
  registerApprovedContextReference(buildReference("ref-knowledge-1", "knowledge_reference", "knl-doc-001"));
  const missingCatalog = buildContextPackage(
    Object.freeze({
      contextId: "ctx-missing",
      references: Object.freeze([buildReference("ref-unknown", "object_reference", "obj-999")]),
    }),
    FIXED_TIME
  );
  assert.equal(missingCatalog.success, false);
  assert.equal(missingCatalog.package?.unresolvedReferences.length, 1);
  assert.ok(missingCatalog.reason.includes("Unresolved references"));
  const unapproved = resolveContextReference(buildReference("ref-x", "risk_reference", "risk-1", false));
  assert.equal(unapproved.resolved, false);
});

test("validates context package runtime and prompt compatibility", () => {
  buildLlmContextBuilderLayer(FIXED_TIME);
  assert.equal(validateContextRuntimeCompatibility().valid, true);
  assert.equal(validateContextPromptCompatibility().valid, true);
  seedTestApprovedReferences();
  const result = buildContextPackage(
    Object.freeze({ contextId: "ctx-valid", references: Object.freeze([buildReference("ref-kpi-1", "kpi_reference", "kpi-q1")]) }),
    FIXED_TIME
  );
  assert.equal(validateContextPackage(result.package!).valid, true);
});

test("generates immutable context manifest", () => {
  buildLlmContextBuilderLayer(FIXED_TIME);
  seedTestApprovedReferences();
  const result = buildContextPackage(
    Object.freeze({ contextId: "ctx-manifest", references: Object.freeze([buildReference("ref-workspace-1", "workspace_reference", "ws-1")]) }),
    FIXED_TIME
  );
  const manifest = getContextManifest(result.package!);
  assert.equal(manifest.contextId, "ctx-manifest");
  assert.equal(manifest.sourceCount, 1);
  assert.ok(manifest.compatibility.includes("LLM/4"));
});

test("exposes stable public exports and platform manifest", () => {
  buildLlmContextBuilderLayer(FIXED_TIME);
  const manifest = getLlmContextPlatformManifest();
  assert.equal(manifest.version, "LLM/5");
  assert.deepEqual(manifest.publicApis, LLM_CONTEXT_PUBLIC_API_REGISTRY);
  assert.equal(typeof ContextBuilderPlatform.buildContextPackage, "function");
  assert.equal(getLlmContextBuilderLayerState(FIXED_TIME).initialized, true);
  assert.ok(LLM_CONTEXT_PRINCIPLES.includes("no_direct_app_or_knl_access"));
});

test("maintains LLM-1 through LLM-4 compatibility and feeds prompt builder", () => {
  buildLlmContextBuilderLayer(FIXED_TIME);
  assert.equal(LLM_PLATFORM_CONTRACT_VERSION, "LLM/1");
  assert.equal(LLM_PROVIDER_CONTRACT_VERSION, "LLM/2");
  assert.equal(LLM_RUNTIME_CONTRACT_VERSION, "LLM/3");
  assert.equal(LLM_PROMPT_CONTRACT_VERSION, "LLM/4");
  seedTestApprovedReferences();
  const contextResult = buildContextPackage(
    Object.freeze({
      contextId: "ctx-prompt-bridge",
      references: Object.freeze([buildReference("ref-knowledge-1", "knowledge_reference", "knl-doc-001")]),
    }),
    FIXED_TIME
  );
  const runtimeRequest = buildLlmRuntimeRequestEnvelope(
    Object.freeze({
      requestId: "req-ctx-001",
      traceId: "trace-ctx-001",
      correlationId: "corr-ctx-001",
      userMessage: "Summarize approved context.",
      systemInstructionRef: "system-ref-001",
      providerKey: "gpt",
      modelKey: "gpt-4o-mini",
      workspaceId: "ws-1",
      organizationId: "org-1",
      userId: "user-1",
    })
  );
  const promptResult = buildPromptPackage(
    Object.freeze({
      runtimeRequest,
      templateId: "executive_summary",
      contextContentRef: buildContextContentRefFromPackage(contextResult.package!),
    }),
    FIXED_TIME
  );
  assert.equal(promptResult.success, true);
  assert.ok(promptResult.package?.sections.some((section) => section.sectionKey === "context_reference"));
});

test("does not import or depend on enterprise cache prototype", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "llmContextContracts.ts",
    "llmContextTypes.ts",
    "llmContextSources.ts",
    "llmContextResolver.ts",
    "llmContextPackage.ts",
    "llmContextValidation.ts",
    "llmContextManifest.ts",
    "llmContextRegistry.ts",
    "llmContextExports.ts",
  ];
  for (const file of files) {
    const source = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(source.includes("llmCache"), false, `${file} must not reference llmCache`);
  }
});

test("assigns deterministic order per context source key", () => {
  assert.equal(getLlmContextSourceOrder("knowledge_reference"), 0);
  assert.ok(getLlmContextSourceOrder("memory_reference") > getLlmContextSourceOrder("scenario_reference"));
});
