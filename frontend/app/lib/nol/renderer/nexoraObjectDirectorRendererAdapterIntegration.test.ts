import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { type NexoraDirectorRuntimeObjectState } from "./nexoraObjectDirectorRendererAdapterFoundation.ts";
import { createRendererAdapterInputContract, type NexoraObjectDirectorRendererAdapterInputContract } from "./nexoraObjectDirectorRendererAdapterContracts.ts";
import { executeRendererAdapterEngine, type NexoraObjectDirectorRendererAdapterEngineCollectionRequest, type NexoraObjectDirectorRendererAdapterEngineRequest } from "./nexoraObjectDirectorRendererAdapterEngine.ts";
import {
  assessRendererAdapterIntegrationReadiness,
  createRendererAdapterIntegrationSummary,
  createRendererAdapterIntegrationTrace,
  integrateRendererAdapterCollection,
  integrateRendererAdapterObject,
  integrationId,
  integrationLock,
  integrationNamespace,
  integrationStatus,
  integrationVersion,
  isRendererAdapterCollectionIntegrationAccepted,
  isRendererAdapterIntegrationAccepted,
  normalizeRendererAdapterEngineResult,
  rendererAdapterIntegrationCompatibility,
  rendererAdapterIntegrationModeCount,
  rendererAdapterIntegrationModes,
  rendererAdapterIntegrationPipeline,
  rendererAdapterIntegrationPipelineStepCount,
  rendererAdapterIntegrationPolicy,
  rendererAdapterIntegrationPublicApiCount,
  rendererAdapterIntegrationPublicApiSurface,
  rendererAdapterIntegrationRegistry,
  rendererAdapterIntegrationRegistryCount,
  rendererAdapterIntegrationStageCount,
  rendererAdapterIntegrationStages,
  resolveRendererAdapterIntegrationMode,
  validateRendererAdapterCollectionIntegrationRequest,
  validateRendererAdapterIntegrationRequest,
  verifyRendererAdapterIntegration,
  verifyRendererAdapterIntegrationDeterminism,
  type NexoraObjectDirectorRendererAdapterCollectionIntegrationRequest,
  type NexoraObjectDirectorRendererAdapterIntegrationRequest,
  type RendererAdapterIntegrationMode,
  type RendererAdapterIntegrationStage,
} from "./nexoraObjectDirectorRendererAdapterIntegration.ts";

function freeze<T>(value: T, seen = new Set<object>()): T { if (value === null || typeof value !== "object" || seen.has(value as object)) return value; seen.add(value as object); Object.values(value as Record<string, unknown>).forEach((child) => freeze(child, seen)); return Object.freeze(value); }
function deeplyFrozen(value: unknown, seen = new Set<object>()): boolean { if (value === null || typeof value !== "object" || seen.has(value as object)) return true; if (!Object.isFrozen(value)) return false; seen.add(value as object); return Object.values(value as Record<string, unknown>).every((child) => deeplyFrozen(child, seen)); }

function runtime(id = "one", overrides: Readonly<Record<string, unknown>> = {}): NexoraDirectorRuntimeObjectState {
  return freeze({ runtimeObjectId: `runtime-${id}`, objectId: id, sceneObjectId: `scene-${id}`, sourceCommandIds: [], generation: 1, lifecycle: "Active", visible: true, interactive: true, focused: false, operating: false, attentionLevel: "None", renderingLevel: "Normal", cameraIntent: "None", relationshipMode: "Direct", labelMode: "Full", indicatorMode: "Essential", animationPending: false, lastExecutionState: "Completed", updatedAt: "2035-01-01T00:00:00.000Z", ...overrides } as NexoraDirectorRuntimeObjectState);
}

function engineRequest(runtimeObject = runtime(), strict = true): NexoraObjectDirectorRendererAdapterEngineRequest {
  return freeze({ requestId: `engine-${runtimeObject.runtimeObjectId}`, input: createRendererAdapterInputContract(runtimeObject, runtimeObject.runtimeObjectId), strict, includeWarnings: true });
}

function integrationRequest(mode: RendererAdapterIntegrationMode = "strict", overrides: Partial<NexoraObjectDirectorRendererAdapterIntegrationRequest> = {}): NexoraObjectDirectorRendererAdapterIntegrationRequest {
  return freeze({ integrationId: "integration-1", consumerId: "consumer-1", mode, includeTrace: true, includeSummary: true, engineRequest: engineRequest(runtime(), mode === "strict"), ...overrides });
}

function collectionEngineRequest(inputs: readonly NexoraObjectDirectorRendererAdapterInputContract[], strict: boolean): NexoraObjectDirectorRendererAdapterEngineCollectionRequest {
  return freeze({ requestId: "engine-collection", inputs, strict, includeWarnings: true, preserveOrder: true });
}

function collectionRequest(inputs: readonly NexoraObjectDirectorRendererAdapterInputContract[], mode: RendererAdapterIntegrationMode): NexoraObjectDirectorRendererAdapterCollectionIntegrationRequest {
  return freeze({ integrationId: "integration-collection", consumerId: "consumer-1", mode, includeTrace: true, includeSummary: true, engineRequest: collectionEngineRequest(inputs, mode === "strict"), preserveOrder: true });
}

const source = readFileSync(new URL("./nexoraObjectDirectorRendererAdapterIntegration.ts", import.meta.url), "utf8");

describe("NOL-5:4 Director Renderer Adapter Integration", () => {
  it("1-9. exposes exact identity and an Engine-only production dependency", () => {
    assert.equal(integrationId, "NOL-5:4/NexoraObjectDirectorRendererAdapterIntegration");
    assert.equal(integrationVersion, "5.4.0");
    assert.equal(integrationNamespace, "nexora.nol.renderer.adapter.integration");
    assert.equal(integrationStatus, "Integration");
    assert.equal(integrationLock, "NOL-5-4-DIRECTOR-RENDERER-ADAPTER-INTEGRATION-LOCKED");
    const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
    assert.deepEqual(imports, ["./nexoraObjectDirectorRendererAdapterEngine.ts"]);
    assert.doesNotMatch(imports.join(" "), /Contracts|Foundation|nexoraObjectDirectorRuntime/i);
  });

  it("10-25. exposes exact dynamically counted and deeply frozen public surfaces", () => {
    assert.deepEqual(rendererAdapterIntegrationModes, ["strict", "compatible"]);
    assert.equal(rendererAdapterIntegrationModeCount, rendererAdapterIntegrationModes.length);
    assert.deepEqual(rendererAdapterIntegrationStages, ["integration-request-received", "integration-request-validated", "engine-executed", "engine-result-normalized", "integration-summary-created", "integration-result-frozen"]);
    assert.equal(rendererAdapterIntegrationStageCount, rendererAdapterIntegrationStages.length);
    assert.deepEqual(rendererAdapterIntegrationPipeline.map((entry) => entry.name), ["Validate Integration Request", "Resolve Integration Mode", "Execute Adapter Engine", "Normalize Engine Result", "Create Integration Summary", "Freeze Integration Result"]);
    assert.deepEqual(rendererAdapterIntegrationPipeline.map((entry) => entry.order), [1, 2, 3, 4, 5, 6]);
    assert.equal(rendererAdapterIntegrationPipelineStepCount, rendererAdapterIntegrationPipeline.length);
    assert.deepEqual(rendererAdapterIntegrationRegistry, ["Request Validation", "Mode Resolution", "Single Integration", "Collection Integration", "Result Normalization", "Summary Creation", "Trace Creation", "Readiness", "Compatibility", "Verification"]);
    assert.equal(rendererAdapterIntegrationRegistryCount, rendererAdapterIntegrationRegistry.length);
    assert.equal(rendererAdapterIntegrationPublicApiCount, rendererAdapterIntegrationPublicApiSurface.length);
    for (const value of [rendererAdapterIntegrationPolicy, rendererAdapterIntegrationCompatibility, rendererAdapterIntegrationModes, rendererAdapterIntegrationStages, rendererAdapterIntegrationPipeline, rendererAdapterIntegrationRegistry, rendererAdapterIntegrationPublicApiSurface]) assert.equal(deeplyFrozen(value), true);
  });

  it("26-31. validates integration identity and resolves only strict and compatible modes", () => {
    assert.equal(validateRendererAdapterIntegrationRequest(integrationRequest()).valid, true);
    assert.equal(validateRendererAdapterIntegrationRequest(integrationRequest("strict", { integrationId: "" })).integrationIdValid, false);
    assert.equal(validateRendererAdapterIntegrationRequest(integrationRequest("strict", { consumerId: "" })).consumerIdValid, false);
    assert.equal(validateRendererAdapterIntegrationRequest(integrationRequest("unsupported" as RendererAdapterIntegrationMode)).modeValid, false);
    assert.deepEqual(resolveRendererAdapterIntegrationMode("strict"), { mode: "strict", engineStrict: true, supported: true });
    assert.deepEqual(resolveRendererAdapterIntegrationMode("compatible"), { mode: "compatible", engineStrict: false, supported: true });
  });

  it("32-37. integrates strict and compatible requests while preserving Engine warnings and errors", () => {
    const strict = integrateRendererAdapterObject(integrationRequest("strict"));
    const compatible = integrateRendererAdapterObject(integrationRequest("compatible"));
    assert.equal(strict.accepted, true);
    assert.equal(compatible.accepted, true);
    const fallback = integrateRendererAdapterObject(integrationRequest("compatible", { engineRequest: engineRequest(runtime("fallback", { lifecycle: "Unmapped" }), false) }));
    assert.equal(fallback.accepted, true);
    assert.deepEqual(fallback.warnings, ["Unknown optional status resolved through Seed neutral fallback"]);
    const strictFallback = integrateRendererAdapterObject(integrationRequest("strict", { engineRequest: engineRequest(runtime("strict-fallback", { lifecycle: "Unmapped" }), false) }));
    assert.equal(strictFallback.accepted, false);
    assert.equal(strictFallback.rendererObject, null);
    assert.ok(strictFallback.errors.length > 0);
  });

  it("38-42. includes or omits summaries and traces and never exposes a rejected object", () => {
    const included = integrateRendererAdapterObject(integrationRequest());
    const omitted = integrateRendererAdapterObject(integrationRequest("strict", { includeSummary: false, includeTrace: false }));
    assert.equal(included.summary?.status, "accepted");
    assert.equal(included.trace?.completed, true);
    assert.equal(omitted.summary, null);
    assert.equal(omitted.trace, null);
    const invalid = integrateRendererAdapterObject(integrationRequest("strict", { integrationId: "" }));
    assert.equal(invalid.accepted, false);
    assert.equal(invalid.rendererObject, null);
  });

  it("43-45 and 49-52. preserves exact collection output and source-aligned item order", () => {
    const inputs = [createRendererAdapterInputContract(runtime("a"), "runtime-a"), createRendererAdapterInputContract(runtime("b"), "runtime-b")];
    const request = collectionRequest(inputs, "strict");
    assert.equal(validateRendererAdapterCollectionIntegrationRequest(request).valid, true);
    const result = integrateRendererAdapterCollection(request);
    assert.equal(result.accepted, true);
    assert.deepEqual(result.rendererObjects.map((object) => object.id), ["runtime-a", "runtime-b"]);
    assert.deepEqual(result.itemResults.map((item) => [item.index, item.sourceRuntimeId]), [[0, "runtime-a"], [1, "runtime-b"]]);
    assert.equal(result.sourceCount, 2);
    assert.equal(result.outputCount, 2);
    assert.equal(result.failedCount, 0);
    assert.equal(result.orderPreserved, true);
  });

  it("46-49 and 54-55. rejects mixed strict collections and preserves compatible partial items", () => {
    const valid = createRendererAdapterInputContract(runtime("valid"), "runtime-valid");
    const invalid = freeze({ runtimeObject: null, sourceRuntimeId: "runtime-invalid", preserveRuntimeMetadata: true }) as unknown as NexoraObjectDirectorRendererAdapterInputContract;
    const strict = integrateRendererAdapterCollection(collectionRequest([valid, invalid], "strict"));
    const partial = integrateRendererAdapterCollection(collectionRequest([invalid, valid], "compatible"));
    const rejected = integrateRendererAdapterCollection(collectionRequest([invalid], "compatible"));
    assert.equal(strict.accepted, false);
    assert.deepEqual(strict.rendererObjects, []);
    assert.equal(partial.accepted, true);
    assert.deepEqual(partial.rendererObjects.map((object) => object.id), ["runtime-valid"]);
    assert.equal(partial.itemResults[0].accepted, false);
    assert.equal(partial.itemResults[1].accepted, true);
    assert.equal(partial.summary?.status, "partially-accepted");
    assert.equal(rejected.summary?.status, "rejected");
  });

  it("53. dynamically creates accepted, partial, and rejected summaries", () => {
    const accepted = integrateRendererAdapterObject(integrationRequest());
    assert.equal(createRendererAdapterIntegrationSummary(accepted).status, "accepted");
    assert.equal(createRendererAdapterIntegrationSummary({ ...accepted, accepted: false, rendererObject: null }).status, "rejected");
  });

  it("56-58. creates immutable ordered traces and rejects unknown stages", () => {
    const partial = createRendererAdapterIntegrationTrace("trace", rendererAdapterIntegrationStages.slice(0, 2));
    const complete = createRendererAdapterIntegrationTrace("trace", rendererAdapterIntegrationStages);
    assert.deepEqual(partial.stages, ["integration-request-received", "integration-request-validated"]);
    assert.equal(partial.completed, false);
    assert.equal(complete.completed, true);
    assert.equal(deeplyFrozen(complete), true);
    assert.throws(() => createRendererAdapterIntegrationTrace("trace", ["unknown" as RendererAdapterIntegrationStage]), /known, unique, and ordered/);
  });

  it("59-62. exposes type-safe predicates, readiness, and exact Engine compatibility", () => {
    const single = integrateRendererAdapterObject(integrationRequest());
    const collection = integrateRendererAdapterCollection(collectionRequest([createRendererAdapterInputContract(runtime("a"), "runtime-a")], "strict"));
    assert.equal(isRendererAdapterIntegrationAccepted(single), true);
    assert.equal(isRendererAdapterCollectionIntegrationAccepted(collection), true);
    assert.deepEqual(rendererAdapterIntegrationCompatibility, { integrationIdentity: integrationId, engineIdentity: "NOL-5:3/NexoraObjectDirectorRendererAdapterEngine", compatibleEngineVersion: "5.3.0", engineOnlyDependency: true, strictModeCompatible: true, compatibleModeCompatible: true, collectionModeCompatible: true, rendererFrameworkAgnostic: true });
    assert.deepEqual(assessRendererAdapterIntegrationReadiness(), { ready: true, identityReady: true, engineReady: true, policyReady: true, compatibilityReady: true, pipelineReady: true, publicSurfacesFrozen: true, violations: [] });
  });

  it("63-65. proves repeated single and collection structural determinism", () => {
    const single = integrationRequest(), collection = collectionRequest([createRendererAdapterInputContract(runtime("a"), "runtime-a")], "compatible");
    assert.deepEqual(integrateRendererAdapterObject(single), integrateRendererAdapterObject(single));
    assert.deepEqual(integrateRendererAdapterCollection(collection), integrateRendererAdapterCollection(collection));
    const report = verifyRendererAdapterIntegrationDeterminism(single, freeze({ ...single, engineRequest: freeze({ ...single.engineRequest, input: freeze({ ...single.engineRequest.input }) }) }));
    assert.equal(report.deterministic, true);
    assert.equal(deeplyFrozen(report), true);
  });

  it("66-68. never mutates runtime or Engine results and freezes every nested surface", () => {
    const runtimeObject = runtime("immutable"), before = JSON.stringify(runtimeObject), request = integrationRequest("strict", { engineRequest: engineRequest(runtimeObject) });
    const engineResult = executeRendererAdapterEngine(request.engineRequest), engineBefore = JSON.stringify(engineResult);
    const normalized = normalizeRendererAdapterEngineResult(request, engineResult);
    assert.equal(JSON.stringify(runtimeObject), before);
    assert.equal(JSON.stringify(engineResult), engineBefore);
    assert.equal(deeplyFrozen(normalized), true);
  });

  it("69-70. verifies the complete Integration and excludes prohibited capabilities", () => {
    const report = verifyRendererAdapterIntegration();
    assert.deepEqual(report, { valid: true, identityValid: true, namespaceValid: true, versionValid: true, lockValid: true, dependencyValid: true, engineCompatible: true, policyValid: true, registryValid: true, pipelineValid: true, readinessValid: true, publicSurfacesFrozen: true, deterministicExecutionValid: true, violations: [] });
    assert.equal(deeplyFrozen(report), true);
    assert.doesNotMatch(source, /from\s+["'][^"']*(?:Contracts|Foundation|nexoraObjectDirectorRuntime|react|next|three|webgl|canvas|svg|dom)/i);
    assert.doesNotMatch(source, /\b(?:async|await|Promise|setTimeout|setInterval|fetch|localStorage|sessionStorage|window|document|globalThis|Math\.random|Date\b|Worker)\b|new\s+(?:Mesh|Scene|Camera|Renderer)|console\./);
  });
});
