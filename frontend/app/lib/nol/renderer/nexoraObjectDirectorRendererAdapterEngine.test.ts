import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { adaptRuntimeObject, type NexoraDirectorRuntimeObjectState } from "./nexoraObjectDirectorRendererAdapterFoundation.ts";
import {
  createRendererAdapterInputContract,
  validateRendererAdapterOutputContract,
  type NexoraObjectDirectorRendererAdapterInputContract,
} from "./nexoraObjectDirectorRendererAdapterContracts.ts";
import {
  collectRendererAdapterEngineErrors,
  collectRendererAdapterEngineWarnings,
  createRendererAdapterEngineStatistics,
  createRendererAdapterEngineTrace,
  engineId,
  engineLock,
  engineNamespace,
  engineStatus,
  engineVersion,
  executeRendererAdapterCollectionEngine,
  executeRendererAdapterEngine,
  isRendererAdapterEngineResultAccepted,
  rendererAdapterEnginePipeline,
  rendererAdapterEnginePipelineStepCount,
  rendererAdapterEnginePolicy,
  rendererAdapterEnginePublicApiCount,
  rendererAdapterEnginePublicApiSurface,
  rendererAdapterEngineRegistry,
  rendererAdapterEngineRegistryCount,
  rendererAdapterEngineStageCount,
  rendererAdapterEngineStages,
  validateRendererAdapterEngineCollectionRequest,
  validateRendererAdapterEngineRequest,
  verifyRendererAdapterEngine,
  verifyRendererAdapterEngineDeterminism,
  type NexoraObjectDirectorRendererAdapterEngineCollectionRequest,
  type NexoraObjectDirectorRendererAdapterEngineRequest,
  type RendererAdapterEngineStage,
} from "./nexoraObjectDirectorRendererAdapterEngine.ts";

function freeze<T>(value: T, seen = new Set<object>()): T {
  if (value === null || typeof value !== "object" || seen.has(value as object)) return value;
  seen.add(value as object);
  Object.values(value as Record<string, unknown>).forEach((child) => freeze(child, seen));
  return Object.freeze(value);
}

function deeplyFrozen(value: unknown, seen = new Set<object>()): boolean {
  if (value === null || typeof value !== "object" || seen.has(value as object)) return true;
  if (!Object.isFrozen(value)) return false;
  seen.add(value as object);
  return Object.values(value as Record<string, unknown>).every((child) => deeplyFrozen(child, seen));
}

function runtime(id = "one", overrides: Readonly<Record<string, unknown>> = {}): NexoraDirectorRuntimeObjectState {
  return freeze({
    runtimeObjectId: `runtime-${id}`,
    objectId: id,
    sceneObjectId: `scene-${id}`,
    sourceCommandIds: [],
    generation: 1,
    lifecycle: "Active",
    visible: true,
    interactive: true,
    focused: false,
    operating: false,
    attentionLevel: "None",
    renderingLevel: "Normal",
    cameraIntent: "None",
    relationshipMode: "Direct",
    labelMode: "Full",
    indicatorMode: "Essential",
    animationPending: false,
    lastExecutionState: "Completed",
    updatedAt: "2035-01-01T00:00:00.000Z",
    ...overrides,
  } as NexoraDirectorRuntimeObjectState);
}

function request(id = "request-1", runtimeObject = runtime(), strict = true, includeWarnings = true): NexoraObjectDirectorRendererAdapterEngineRequest {
  return freeze({ requestId: id, input: createRendererAdapterInputContract(runtimeObject, runtimeObject.runtimeObjectId), strict, includeWarnings });
}

function collectionRequest(inputs: readonly NexoraObjectDirectorRendererAdapterInputContract[], strict: boolean): NexoraObjectDirectorRendererAdapterEngineCollectionRequest {
  return freeze({ requestId: "collection-1", inputs, strict, includeWarnings: true, preserveOrder: true });
}

const source = readFileSync(new URL("./nexoraObjectDirectorRendererAdapterEngine.ts", import.meta.url), "utf8");

describe("NOL-5:3 Director Renderer Adapter Engine", () => {
  it("1-8. exposes exact identity and a Contracts-only production dependency", () => {
    assert.equal(engineId, "NOL-5:3/NexoraObjectDirectorRendererAdapterEngine");
    assert.equal(engineVersion, "5.3.0");
    assert.equal(engineNamespace, "nexora.nol.renderer.adapter.engine");
    assert.equal(engineStatus, "Engine");
    assert.equal(engineLock, "NOL-5-3-DIRECTOR-RENDERER-ADAPTER-ENGINE-LOCKED");
    const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
    assert.deepEqual(imports, ["./nexoraObjectDirectorRendererAdapterContracts.ts"]);
    assert.doesNotMatch(imports.join(" "), /Foundation|nexoraObjectDirectorRuntime/i);
  });

  it("9-20. exposes exact, dynamically counted, deeply frozen stages and surfaces", () => {
    assert.deepEqual(rendererAdapterEngineStages, ["request-received", "input-validated", "runtime-adapted", "output-contracted", "output-validated", "result-frozen"]);
    assert.equal(rendererAdapterEngineStageCount, rendererAdapterEngineStages.length);
    assert.deepEqual(rendererAdapterEnginePipeline.map((entry) => entry.name), ["Validate Request", "Validate Input Contract", "Adapt Runtime Object", "Create Output Contract", "Validate Output Contract", "Freeze Result"]);
    assert.deepEqual(rendererAdapterEnginePipeline.map((entry) => entry.order), [1, 2, 3, 4, 5, 6]);
    assert.equal(rendererAdapterEnginePipelineStepCount, rendererAdapterEnginePipeline.length);
    assert.deepEqual(rendererAdapterEngineRegistry, ["Request Validation", "Single Adaptation", "Collection Adaptation", "Output Contracting", "Strict Validation", "Warning Aggregation", "Execution Trace", "Statistics", "Verification"]);
    assert.equal(rendererAdapterEngineRegistryCount, rendererAdapterEngineRegistry.length);
    assert.equal(rendererAdapterEnginePublicApiCount, rendererAdapterEnginePublicApiSurface.length);
    for (const surface of [rendererAdapterEnginePolicy, rendererAdapterEngineStages, rendererAdapterEnginePipeline, rendererAdapterEngineRegistry, rendererAdapterEnginePublicApiSurface]) assert.equal(deeplyFrozen(surface), true);
  });

  it("21-24. validates good requests and rejects invalid identity and runtime inputs", () => {
    assert.equal(validateRendererAdapterEngineRequest(request()).valid, true);
    assert.equal(validateRendererAdapterEngineRequest({ ...request(), requestId: "" }).requestIdValid, false);
    const missingRuntime = freeze({ runtimeObject: null, sourceRuntimeId: "runtime-one", preserveRuntimeMetadata: true }) as unknown as NexoraObjectDirectorRendererAdapterInputContract;
    assert.equal(validateRendererAdapterEngineRequest(freeze({ ...request(), input: missingRuntime })).runtimeObjectValid, false);
    const missingSource = freeze({ runtimeObject: runtime(), sourceRuntimeId: "", preserveRuntimeMetadata: true }) as NexoraObjectDirectorRendererAdapterInputContract;
    assert.equal(validateRendererAdapterEngineRequest(freeze({ ...request(), input: missingSource })).sourceRuntimeIdValid, false);
  });

  it("25-26. executes a valid object and rejects strict contract violations", () => {
    const accepted = executeRendererAdapterEngine(request());
    assert.equal(isRendererAdapterEngineResultAccepted(accepted), true);
    assert.equal(validateRendererAdapterOutputContract(accepted.output).valid, true);
    const invalidState = freeze({ ...request().input, requestedRendererState: "immersive" }) as unknown as NexoraObjectDirectorRendererAdapterInputContract;
    const rejected = executeRendererAdapterEngine(freeze({ ...request(), input: invalidState }));
    assert.equal(rejected.accepted, false);
    assert.equal(rejected.output, null);
  });

  it("27-29. recovers only non-fatal presentation fallback in non-strict mode and respects warning exclusion", () => {
    const fallbackRuntime = runtime("fallback", { lifecycle: "Unmapped" });
    const included = executeRendererAdapterEngine(request("fallback", fallbackRuntime, false, true));
    const excluded = executeRendererAdapterEngine(request("fallback", fallbackRuntime, false, false));
    assert.equal(included.accepted, true);
    assert.deepEqual(included.warnings, ["Unknown optional status resolved through Seed neutral fallback"]);
    assert.deepEqual(excluded.warnings, []);
    const missing = freeze({ runtimeObject: null, sourceRuntimeId: "runtime-x", preserveRuntimeMetadata: true }) as unknown as NexoraObjectDirectorRendererAdapterInputContract;
    assert.equal(executeRendererAdapterEngine(freeze({ requestId: "missing", input: missing, strict: false, includeWarnings: true })).accepted, false);
  });

  it("30-33. creates a valid frozen output without mutating runtime input", () => {
    const runtimeObject = runtime("immutable"), before = JSON.stringify(runtimeObject);
    const result = executeRendererAdapterEngine(request("immutable", runtimeObject));
    assert.ok(result.output);
    assert.equal(validateRendererAdapterOutputContract(result.output).valid, true);
    assert.equal(deeplyFrozen(result), true);
    assert.equal(deeplyFrozen(result.output.rendererObject), true);
    assert.equal(JSON.stringify(runtimeObject), before);
    assert.deepEqual(result.output.rendererObject, adaptRuntimeObject(runtimeObject));
  });

  it("34-35 and 56. proves repeated and cloned-request structural determinism", () => {
    const firstRequest = request("deterministic"), cloned = freeze({ ...firstRequest, input: freeze({ ...firstRequest.input }) });
    assert.deepEqual(executeRendererAdapterEngine(firstRequest), executeRendererAdapterEngine(firstRequest));
    const report = verifyRendererAdapterEngineDeterminism(firstRequest, cloned);
    assert.deepEqual(report, { deterministic: true, requestEquivalent: true, outputEquivalent: true, warningEquivalent: true, errorEquivalent: true, violations: [] });
    assert.equal(deeplyFrozen(report), true);
  });

  it("36-42. preserves collection and item order and derives counts", () => {
    const inputs = [createRendererAdapterInputContract(runtime("a"), "runtime-a"), createRendererAdapterInputContract(runtime("b"), "runtime-b")];
    assert.equal(validateRendererAdapterEngineCollectionRequest(collectionRequest(inputs, true)).valid, true);
    const result = executeRendererAdapterCollectionEngine(collectionRequest(inputs, true));
    assert.equal(result.accepted, true);
    assert.equal(result.orderPreserved, true);
    assert.equal(result.failedCount, 0);
    assert.equal(result.outputCount, 2);
    assert.deepEqual(result.collection?.rendererObjects.map((item) => item.id), ["runtime-a", "runtime-b"]);
    assert.deepEqual(result.itemResults.map((item) => item.requestId), ["collection-1:1", "collection-1:2"]);
    assert.equal(deeplyFrozen(result), true);
  });

  it("38-41. rejects strict mixed collections and supports ordered non-strict partial output", () => {
    const valid = createRendererAdapterInputContract(runtime("valid"), "runtime-valid");
    const invalid = freeze({ runtimeObject: null, sourceRuntimeId: "runtime-invalid", preserveRuntimeMetadata: true }) as unknown as NexoraObjectDirectorRendererAdapterInputContract;
    const strictResult = executeRendererAdapterCollectionEngine(collectionRequest([valid, invalid], true));
    const partial = executeRendererAdapterCollectionEngine(collectionRequest([invalid, valid], false));
    assert.equal(strictResult.accepted, false);
    assert.equal(strictResult.collection, null);
    assert.equal(partial.accepted, true);
    assert.equal(partial.failedCount, 1);
    assert.equal(partial.outputCount, 1);
    assert.equal(partial.itemResults[0].accepted, false);
    assert.equal(partial.itemResults[1].accepted, true);
    assert.deepEqual(partial.collection?.rendererObjects.map((item) => item.id), ["runtime-valid"]);
  });

  it("43-46. normalizes and de-duplicates warnings and errors in first-occurrence order", () => {
    assert.deepEqual(collectRendererAdapterEngineWarnings([" beta ", "", "alpha"], ["beta", "gamma"]), ["beta", "alpha", "gamma"]);
    assert.deepEqual(collectRendererAdapterEngineErrors([" second ", "first"], ["second", ""]), ["second", "first"]);
    assert.equal(deeplyFrozen(collectRendererAdapterEngineWarnings(["one"])), true);
  });

  it("47-49. creates ordered traces, derives completion, and rejects unknown stages", () => {
    const partial = createRendererAdapterEngineTrace("trace-1", rendererAdapterEngineStages.slice(0, 2));
    const complete = createRendererAdapterEngineTrace("trace-1", rendererAdapterEngineStages);
    assert.deepEqual(partial.stages, ["request-received", "input-validated"]);
    assert.equal(partial.completed, false);
    assert.equal(complete.completed, true);
    assert.equal(deeplyFrozen(complete), true);
    assert.throws(() => createRendererAdapterEngineTrace("trace-1", ["unknown" as RendererAdapterEngineStage]), /known, unique, and ordered/);
  });

  it("50-51. calculates current-request statistics and narrows accepted results", () => {
    const accepted = executeRendererAdapterEngine(request()), rejected = executeRendererAdapterEngine({ ...request(), requestId: "" });
    assert.deepEqual(createRendererAdapterEngineStatistics(accepted), { sourceCount: 1, acceptedCount: 1, rejectedCount: 0, outputCount: 1, warningCount: 0, errorCount: 0 });
    assert.equal(isRendererAdapterEngineResultAccepted(accepted), true);
    assert.equal(isRendererAdapterEngineResultAccepted(rejected), false);
    assert.equal(deeplyFrozen(createRendererAdapterEngineStatistics(rejected)), true);
  });

  it("52-55. verifies the engine, Contracts compatibility, and prohibited-capability absence", () => {
    const report = verifyRendererAdapterEngine();
    assert.deepEqual(report, { valid: true, identityValid: true, namespaceValid: true, versionValid: true, lockValid: true, dependencyValid: true, contractsCompatible: true, policyValid: true, pipelineValid: true, publicSurfacesFrozen: true, violations: [] });
    assert.equal(deeplyFrozen(report), true);
    assert.doesNotMatch(source, /from\s+["'][^"']*(?:Foundation|nexoraObjectDirectorRuntime|react|next|three|webgl|canvas|svg|dom)/i);
    assert.doesNotMatch(source, /\b(?:async|await|Promise|setTimeout|setInterval|fetch|localStorage|sessionStorage|window|document|globalThis|Math\.random|Date\b)\b|new\s+(?:Mesh|Scene|Camera|Renderer)|console\./);
  });
});
