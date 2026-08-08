import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createRuntimeStateContextBinding } from
  "./directorRuntimeStateContextBindingFoundation.ts";
import {
  createRuntimeStateContextBindingRequest,
  type RuntimeStateContextBindingRequest,
} from "./directorRuntimeStateContextBindingContracts.ts";
import {
  RUNTIME_STATE_CONTEXT_BINDING_ENGINE_EVALUATION_PHASES as evaluationPhases,
  RUNTIME_STATE_CONTEXT_BINDING_ENGINE_TRACE_PHASES as tracePhases,
  directorRuntimeStateContextBindingEngine as engine,
  executeRuntimeStateContextBindingEngine,
  isRuntimeStateContextBindingEngineOutputBound,
  normalizeRuntimeStateContextBindingEngineInput,
  runtimeStateContextBindingEngineApiNames,
  runtimeStateContextBindingEnginePredicateNames,
  runtimeStateContextBindingEnginePublicApiSurface,
  runtimeStateContextBindingEngineRegistry as registry,
} from "./directorRuntimeStateContextBindingEngine.ts";

const state = Object.freeze({
  runtimeStateId: "state-1", runtimeStateVersion: "1", runtimeStateKind: "executive",
});
const fullContext = Object.freeze({
  workspaceId: "workspace-1", goalId: "goal-1", objectId: "object-1", packId: "pack-1",
  modeId: "mode-1", lensId: "lens-1", timelinePosition: 3,
});
function request(overrides: Partial<RuntimeStateContextBindingRequest> = {}) {
  return createRuntimeStateContextBindingRequest({
    bindingId: "binding-1", runtimeState: state, context: fullContext, scope: "pack", ...overrides,
  });
}

test("publishes exact engine metadata and sole Contracts dependency", () => {
  assert.equal(engine.identity, "DRI-2:3/DirectorRuntimeStateContextBindingEngine");
  assert.equal(engine.version, "2.3.0");
  assert.equal(engine.namespace, "nexora.dri.runtime.state-context-binding.engine");
  assert.equal(engine.stage, "Engine");
  assert.equal(engine.immediateDependency, "DRI-2:2/DirectorRuntimeStateContextBindingContracts");
  const source = readFileSync(new URL("./directorRuntimeStateContextBindingEngine.ts", import.meta.url), "utf8");
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual([...new Set(imports)],
    ["@/app/lib/dri/directorRuntimeStateContextBindingContracts"]);
  assert.doesNotMatch(source, /directorRuntimeStateContextBindingFoundation|directorRuntimeIntegration/);
});

test("executes one request and preserves all caller-owned identities", () => {
  const output = executeRuntimeStateContextBindingEngine(request());
  assert.equal(output.request.bindingId, "binding-1");
  assert.equal(output.request.runtimeState?.runtimeStateId, "state-1");
  assert.equal(output.result.binding.bindingId, "binding-1");
  assert.equal(output.inspection.bindingId, "binding-1");
  assert.equal(output.result.status, "bound");
});

test("executes global, workspace, goal, object, and pack scopes as bound", () => {
  const inputs = [
    request({ scope: "global", context: {} }),
    request({ scope: "workspace", context: { workspaceId: "w" } }),
    request({ scope: "goal", context: { workspaceId: "w", goalId: "g" } }),
    request({ scope: "object", context: { workspaceId: "w", goalId: "g", objectId: "o" } }),
    request({ scope: "pack", context: fullContext }),
  ];
  assert.deepEqual(inputs.map((input) => executeRuntimeStateContextBindingEngine(input).result.status),
    ["bound", "bound", "bound", "bound", "bound"]);
});

test("represents partial, invalid, and unbound outcomes without throwing", () => {
  const partial = executeRuntimeStateContextBindingEngine(request({
    scope: "object", context: { workspaceId: "w", goalId: "g" },
  }));
  const invalid = executeRuntimeStateContextBindingEngine(request({
    scope: "goal", context: { goalId: "g" },
  }));
  const unboundBinding = createRuntimeStateContextBinding({
    bindingId: "unbound-1", runtimeState: null, context: {}, scope: "global",
  });
  const unbound = executeRuntimeStateContextBindingEngine(unboundBinding);
  assert.deepEqual([partial.result.status, invalid.result.status, unbound.result.status],
    ["partial", "invalid", "unbound"]);
  assert.deepEqual([partial.compatibility.state, invalid.compatibility.state, unbound.compatibility.state],
    ["incomplete", "incompatible", "incompatible"]);
  assert.deepEqual(partial.compatibility.reasons.map(({ id }) => id), ["missing-required-context"]);
  assert.deepEqual(invalid.compatibility.reasons.map(({ id }) => id), ["context-hierarchy-conflict"]);
});

test("includes delegated requirements and ordered context inspection", () => {
  const output = executeRuntimeStateContextBindingEngine(request({
    scope: "object", context: { workspaceId: "w", goalId: "g", lensId: "lens" },
  }));
  assert.deepEqual(output.requirements.map(({ dimension }) => dimension),
    ["workspace", "goal", "object"]);
  assert.deepEqual(output.inspection.availableContextDimensions, ["workspace", "goal", "lens"]);
  assert.deepEqual(output.inspection.missingRequiredDimensions, ["object"]);
});

test("exposes BoundRuntimeContext iff result is bound", () => {
  const bound = executeRuntimeStateContextBindingEngine(request());
  const partial = executeRuntimeStateContextBindingEngine(request({ scope: "pack", context: {} }));
  const invalid = executeRuntimeStateContextBindingEngine(request({ bindingId: "" }));
  const unbound = executeRuntimeStateContextBindingEngine(createRuntimeStateContextBinding({
    bindingId: "b", runtimeState: null, context: {}, scope: "global",
  }));
  assert.equal(isRuntimeStateContextBindingEngineOutputBound(bound), true);
  if (isRuntimeStateContextBindingEngineOutputBound(bound))
    assert.equal(bound.result.boundContext.status, "bound");
  for (const output of [partial, invalid, unbound]) {
    assert.equal(isRuntimeStateContextBindingEngineOutputBound(output), false);
    assert.equal("boundContext" in output.result, false);
  }
});

test("normalizes immutable copies without mutating nested caller input", () => {
  const source = Object.freeze({
    bindingId: "caller-binding", runtimeState: Object.freeze({ ...state }),
    context: Object.freeze({ ...fullContext }), scope: "pack" as const,
  });
  const before = JSON.stringify(source);
  const normalized = normalizeRuntimeStateContextBindingEngineInput(Object.freeze({ request: source }));
  const output = executeRuntimeStateContextBindingEngine(normalized);
  assert.equal(JSON.stringify(source), before);
  assert.notEqual(normalized.request, source);
  assert.equal(Object.isFrozen(normalized), true);
  assert.equal(Object.isFrozen(normalized.request), true);
  assert.equal(Object.isFrozen(normalized.request.context), true);
  assert.equal(Object.isFrozen(output), true);
  assert.equal(Object.isFrozen(output.trace), true);
});

test("is deterministic, stateless across calls, and plain-data serializable", () => {
  const one = executeRuntimeStateContextBindingEngine(request());
  executeRuntimeStateContextBindingEngine(request({ bindingId: "unrelated", scope: "global", context: {} }));
  const two = executeRuntimeStateContextBindingEngine(request());
  assert.deepEqual(one, two);
  assert.deepEqual(JSON.parse(JSON.stringify(one)), one);
});

test("publishes stable deterministic evaluation and trace phase order", () => {
  assert.deepEqual(evaluationPhases, [
    "normalize-input", "resolve-requirements", "evaluate-compatibility",
    "resolve-binding-result", "create-inspection", "create-output",
  ]);
  assert.deepEqual(tracePhases, [
    "requirements-resolved", "context-inspected", "compatibility-resolved",
    "binding-resolved", "result-created", "inspection-created",
  ]);
  assert.deepEqual(executeRuntimeStateContextBindingEngine(request()).trace.map(({ phase }) => phase),
    tracePhases);
});

test("registry counts, API ownership, and descriptor are internally consistent", () => {
  assert.equal(registry.inputContractCount, registry.inputContracts.length);
  assert.equal(registry.outputContractCount, registry.outputContracts.length);
  assert.equal(registry.engineApiCount, registry.engineApis.length);
  assert.equal(registry.predicateCount, registry.predicates.length);
  assert.equal(registry.evaluationPhaseCount, registry.evaluationPhases.length);
  assert.equal(registry.tracePhaseCount, registry.tracePhases.length);
  assert.equal(registry.publicApiCount, registry.publicApiSurface.length);
  assert.deepEqual(runtimeStateContextBindingEnginePublicApiSurface, [
    ...runtimeStateContextBindingEngineApiNames, ...runtimeStateContextBindingEnginePredicateNames,
  ]);
  assert.equal(engine.registry, registry);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(engine), true);
});

test("contains no identity generation, state, events, async, external I/O, UI, or Director execution", () => {
  const source = readFileSync(new URL("./directorRuntimeStateContextBindingEngine.ts", import.meta.url), "utf8");
  assert.doesNotMatch(source, /\b(?:Date\.now|new Date|Math\.random|randomUUID|counter|cache|history)\b/);
  assert.doesNotMatch(source, /\b(?:EventEmitter|publish|subscribe|listener|observer|callback|WebSocket|MessageChannel)\b/);
  assert.doesNotMatch(source, /\b(?:async|Promise|setTimeout|setInterval|requestAnimationFrame|fetch|localStorage|indexedDB)\b/);
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|three|@react-three|next)/i);
  assert.doesNotMatch(source, /\b(?:applyBinding|commitBinding|activateBinding|setActiveContext|updateRuntimeState|changeWorkspace|selectGoal|selectObject|selectPack|dispatchBinding)\b/);
  assert.doesNotMatch(source, /\b(?:camera|coordinates|animations|rendering|runtime store|event bus)\b/i);
  assert.doesNotMatch(source, /\b(?:executeDirector|changeDirectorFocus|updateScene|bindRenderer|sceneVisibility)\b/);
});
