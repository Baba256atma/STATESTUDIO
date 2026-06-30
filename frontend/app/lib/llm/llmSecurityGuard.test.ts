import assert from "node:assert/strict";
import test from "node:test";

import { resetLlmAuditObservabilityLayerForTests } from "./llmAuditExports.ts";
import { LLM_AUDIT_CONTRACT_VERSION } from "./llmAuditContracts.ts";
import { resetLlmContextBuilderLayerForTests, buildContextPackage, buildLlmContextBuilderLayer } from "./llmContextExports.ts";
import { LLM_CONTEXT_CONTRACT_VERSION } from "./llmContextContracts.ts";
import type { LlmContextReference } from "./llmContextTypes.ts";
import { seedApprovedContextReferences } from "./llmContextResolver.ts";
import { resetLlmCostEstimatorLayerForTests } from "./llmCostExports.ts";
import { LLM_COST_CONTRACT_VERSION } from "./llmCostContracts.ts";
import { resetLlmModelRouterLayerForTests } from "./llmRouterExports.ts";
import { LLM_ROUTER_CONTRACT_VERSION } from "./llmRouterContracts.ts";
import { LLM_PLATFORM_CONTRACT_VERSION } from "./llmPlatformContracts.ts";
import { resetLlmPlatformFoundationForTests } from "./llmPlatformExports.ts";
import { buildPromptPackage, buildLlmPromptBuilderLayer, resetLlmPromptBuilderLayerForTests } from "./llmPromptExports.ts";
import { LLM_PROMPT_CONTRACT_VERSION } from "./llmPromptContracts.ts";
import { LLM_PROVIDER_CONTRACT_VERSION } from "./llmProviderContracts.ts";
import { resetLlmProviderAdapterLayerForTests } from "./llmProviderExports.ts";
import {
  LLM_SECURITY_CONTRACT_VERSION,
  LLM_SECURITY_POLICY_KEYS,
  LLM_SECURITY_PRINCIPLES,
  LLM_SECURITY_PUBLIC_API_REGISTRY,
  LLM_SECURITY_REDACTION_RULE_KEYS,
} from "./llmSecurityContracts.ts";
import {
  SecurityRedactionPlatform,
  buildLlmSecurityRedactionLayer,
  discoverSecurityPolicies,
  getLlmSecurityPlatformManifest,
  getLlmSecurityRedactionLayerState,
  getSecurityManifest,
  getSecurityRegistry,
  inspectPromptSecurity,
  redactPromptPackage,
  registerSecurityPolicy,
  resetLlmSecurityRedactionLayerForTests,
  validateSecurityDecision,
} from "./llmSecurityExports.ts";
import { LLM_RUNTIME_CONTRACT_VERSION } from "./llmRuntimeContracts.ts";
import { buildLlmRuntimeRequestEnvelope } from "./llmRuntimeEnvelope.ts";
import { resetLlmRuntimeContractLayerForTests } from "./llmRuntimeExports.ts";
import { resetLlmTokenMeterLayerForTests } from "./llmTokenExports.ts";
import { LLM_TOKEN_CONTRACT_VERSION } from "./llmTokenContracts.ts";

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

function buildRuntimeRequest(userMessage: string = "Analyze quarterly KPI trends.") {
  return buildLlmRuntimeRequestEnvelope(
    Object.freeze({
      requestId: "req-security-001",
      traceId: "trace-security-001",
      correlationId: "corr-security-001",
      userMessage,
      systemInstructionRef: "system-instruction-ref-001",
      providerKey: "gpt",
      modelKey: "gpt-4o-mini",
      workspaceId: "ws-1",
      organizationId: "org-1",
      userId: "user-1",
    })
  );
}

function buildTestPromptPackage(userMessage?: string) {
  buildLlmPromptBuilderLayer(FIXED_TIME);
  return buildPromptPackage(
    Object.freeze({ runtimeRequest: buildRuntimeRequest(userMessage), templateId: "kpi_analysis" }),
    FIXED_TIME
  ).package!;
}

function buildTestContextPackage() {
  buildLlmContextBuilderLayer(FIXED_TIME);
  seedApprovedContextReferences([
    buildReference("ref-kpi-1", "kpi_reference", "kpi-q1"),
    buildReference("ref-workspace-1", "workspace_reference", "ws-1"),
  ]);
  return buildContextPackage(
    Object.freeze({
      contextId: "ctx-security-001",
      references: Object.freeze([
        buildReference("ref-kpi-1", "kpi_reference", "kpi-q1"),
        buildReference("ref-workspace-1", "workspace_reference", "ws-1"),
      ]),
    }),
    FIXED_TIME
  ).package!;
}

function resetAllLlmLayersForTests(): void {
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

test("exports LLM/10 security redaction vocabulary", () => {
  assert.equal(LLM_SECURITY_CONTRACT_VERSION, "LLM/10");
  assert.equal(LLM_SECURITY_POLICY_KEYS.length, 5);
  assert.equal(LLM_SECURITY_REDACTION_RULE_KEYS.length, 6);
  assert.equal(LLM_SECURITY_PUBLIC_API_REGISTRY.length, 8);
});

test("registers and discovers security policies", () => {
  buildLlmSecurityRedactionLayer(FIXED_TIME);
  const registry = getSecurityRegistry();
  assert.equal(registry.policyCount, LLM_SECURITY_POLICY_KEYS.length);
  const policies = discoverSecurityPolicies();
  assert.ok(policies.some((policy) => policy.policyKey === "public"));
  assert.ok(policies.some((policy) => policy.policyKey === "enterprise_custom"));
});

test("inspects clean prompt package and allows public policy", () => {
  buildLlmSecurityRedactionLayer(FIXED_TIME);
  const promptPackage = buildTestPromptPackage();
  const result = inspectPromptSecurity(
    Object.freeze({ promptPackage, policyKey: "public" }),
    FIXED_TIME
  );
  assert.equal(result.success, true);
  assert.equal(result.decision?.decision, "allow");
  assert.equal(validateSecurityDecision(result.decision!).valid, true);
});

test("inspects context package alongside prompt package", () => {
  buildLlmSecurityRedactionLayer(FIXED_TIME);
  const promptPackage = buildTestPromptPackage();
  const contextPackage = buildTestContextPackage();
  const result = inspectPromptSecurity(
    Object.freeze({ promptPackage, contextPackage, policyKey: "internal" }),
    FIXED_TIME
  );
  assert.equal(result.success, true);
  assert.equal(result.decision?.decision, "allow");
  assert.ok(result.decision?.redactedContextPackage);
});

test("redacts sensitive prompt content without mutating source", () => {
  buildLlmSecurityRedactionLayer(FIXED_TIME);
  const source = buildTestPromptPackage("Contact ops@example.com with api_key=sk-test-value");
  const originalUserSection = source.sections.find((section) => section.sectionKey === "user")!;
  const redacted = redactPromptPackage(source, "public");
  assert.equal(redacted.success, true);
  assert.ok(redacted.summary && redacted.summary.totalRedactions > 0);
  const redactedUser = redacted.package!.sections.find((section) => section.sectionKey === "user")!;
  assert.notEqual(redactedUser.contentRef, originalUserSection.contentRef);
  assert.equal(originalUserSection.contentRef.includes("api_key="), true);
  assert.equal(redactedUser.contentRef.includes("[REDACTED_API_KEY]"), true);
});

test("returns allow decision after redaction", () => {
  buildLlmSecurityRedactionLayer(FIXED_TIME);
  const promptPackage = buildTestPromptPackage("Store secret=alpha-value safely.");
  const result = inspectPromptSecurity(
    Object.freeze({ promptPackage, policyKey: "public" }),
    FIXED_TIME
  );
  assert.equal(result.decision?.decision, "allow");
  assert.ok((result.decision?.redactionSummary.totalRedactions ?? 0) > 0);
});

test("returns deny decision for restricted deny marker", () => {
  buildLlmSecurityRedactionLayer(FIXED_TIME);
  const promptPackage = buildTestPromptPackage("Payload DENY_ALWAYS must not pass.");
  const result = inspectPromptSecurity(
    Object.freeze({ promptPackage, policyKey: "restricted" }),
    FIXED_TIME
  );
  assert.equal(result.decision?.decision, "deny");
  assert.equal(result.decision?.redactedPromptPackage, null);
});

test("returns deny decision for confidential unresolved context", () => {
  buildLlmSecurityRedactionLayer(FIXED_TIME);
  const promptPackage = buildTestPromptPackage();
  const contextPackage = Object.freeze({
    ...buildTestContextPackage(),
    unresolvedReferences: Object.freeze([
      buildReference("ref-unapproved", "risk_reference", "risk-unapproved", false),
    ]),
    readOnly: true as const,
  });
  const result = inspectPromptSecurity(
    Object.freeze({ promptPackage, contextPackage, policyKey: "confidential" }),
    FIXED_TIME
  );
  assert.equal(result.decision?.decision, "deny");
});

test("validates security decisions and generates manifest", () => {
  buildLlmSecurityRedactionLayer(FIXED_TIME);
  const promptPackage = buildTestPromptPackage();
  const decision = inspectPromptSecurity(Object.freeze({ promptPackage }), FIXED_TIME).decision!;
  assert.equal(validateSecurityDecision(decision).valid, true);
  const manifest = getSecurityManifest(getSecurityRegistry());
  assert.equal(manifest.securityVersion, "LLM/10");
  assert.equal(manifest.validationResult, "valid");
});

test("exposes stable public exports and registry behavior", () => {
  buildLlmSecurityRedactionLayer(FIXED_TIME);
  const platformManifest = getLlmSecurityPlatformManifest();
  assert.equal(platformManifest.version, "LLM/10");
  assert.deepEqual(platformManifest.publicApis, LLM_SECURITY_PUBLIC_API_REGISTRY);
  assert.equal(typeof SecurityRedactionPlatform.inspectPromptSecurity, "function");
  assert.equal(getLlmSecurityRedactionLayerState(FIXED_TIME).initialized, true);
  assert.ok(LLM_SECURITY_PRINCIPLES.includes("no_authentication_no_authorization"));
});

test("maintains LLM-1 through LLM-9 compatibility", () => {
  const layer = buildLlmSecurityRedactionLayer(FIXED_TIME);
  assert.equal(layer.success, true);
  assert.equal(LLM_PLATFORM_CONTRACT_VERSION, "LLM/1");
  assert.equal(LLM_PROVIDER_CONTRACT_VERSION, "LLM/2");
  assert.equal(LLM_RUNTIME_CONTRACT_VERSION, "LLM/3");
  assert.equal(LLM_PROMPT_CONTRACT_VERSION, "LLM/4");
  assert.equal(LLM_CONTEXT_CONTRACT_VERSION, "LLM/5");
  assert.equal(LLM_TOKEN_CONTRACT_VERSION, "LLM/6");
  assert.equal(LLM_COST_CONTRACT_VERSION, "LLM/7");
  assert.equal(LLM_ROUTER_CONTRACT_VERSION, "LLM/8");
  assert.equal(LLM_AUDIT_CONTRACT_VERSION, "LLM/9");
});

test("does not import or depend on enterprise cache prototype", async () => {
  const { readFile } = await import("node:fs/promises");
  const files = [
    "llmSecurityContracts.ts",
    "llmSecurityTypes.ts",
    "llmSecurityPolicies.ts",
    "llmSecurityInspector.ts",
    "llmSecurityRedaction.ts",
    "llmSecurityValidation.ts",
    "llmSecurityManifest.ts",
    "llmSecurityRegistry.ts",
    "llmSecurityExports.ts",
  ];
  for (const file of files) {
    const source = await readFile(new URL(`./${file}`, import.meta.url), "utf8");
    assert.equal(source.includes("llmCache"), false, `${file} must not reference llmCache`);
    assert.equal(source.includes("fetch("), false, `${file} must not call providers`);
  }
});

test("supports enterprise custom policy registration", () => {
  buildLlmSecurityRedactionLayer(FIXED_TIME);
  const custom = registerSecurityPolicy(
    Object.freeze({
      policyKey: "enterprise_custom",
      description: "Custom enterprise redaction profile.",
      denyMarkers: Object.freeze(["DENY_ALWAYS", "enterpriseBlock"]),
    }),
    FIXED_TIME
  );
  assert.equal(custom.policyKey, "enterprise_custom");
  assert.ok(discoverSecurityPolicies().some((policy) => policy.description.includes("Custom enterprise")));
});
