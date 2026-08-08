import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_STATE_CONTEXT_BINDING_SCOPES as foundationScopes,
  RUNTIME_STATE_CONTEXT_BINDING_STATUSES as foundationStatuses,
  createRuntimeStateContextBinding,
} from "./directorRuntimeStateContextBindingFoundation.ts";
import {
  RUNTIME_STATE_CONTEXT_BINDING_COMPATIBILITY_REASON_IDS as reasonIds,
  RUNTIME_STATE_CONTEXT_BINDING_COMPATIBILITY_STATES as compatibilityStates,
  createRuntimeStateContextBindingRequest,
  createRuntimeStateContextBindingResult,
  directorRuntimeStateContextBindingContracts as contracts,
  inspectRuntimeStateContextBinding,
  isBoundRuntimeStateContextBindingResult,
  resolveRuntimeStateContextBindingCompatibility,
  resolveRuntimeStateContextBindingRequirements,
  runtimeStateContextBindingConstraints,
  runtimeStateContextBindingContractFamilies,
  runtimeStateContextBindingContractsPublicApiSurface,
  runtimeStateContextBindingContractsRegistry as registry,
  runtimeStateContextBindingRequirements,
  type RuntimeContextReference,
  type RuntimeStateContextBindingRequest,
} from "./directorRuntimeStateContextBindingContracts.ts";

const state = Object.freeze({
  runtimeStateId: "state-1", runtimeStateVersion: "1", runtimeStateKind: "executive",
});
const context = Object.freeze({
  workspaceId: "workspace-1", goalId: "goal-1", objectId: "object-1", packId: "pack-1",
  modeId: "mode-1", lensId: "lens-1", timelinePosition: 4,
});
const request = (overrides: Partial<RuntimeStateContextBindingRequest> = {}) =>
  createRuntimeStateContextBindingRequest({
    bindingId: "binding-1", runtimeState: state, context, scope: "pack", ...overrides,
  });

test("publishes exact identity, version, namespace, stage, and linear dependency", () => {
  assert.equal(contracts.identity, "DRI-2:2/DirectorRuntimeStateContextBindingContracts");
  assert.equal(contracts.version, "2.2.0");
  assert.equal(contracts.namespace, "nexora.dri.runtime.state-context-binding.contracts");
  assert.equal(contracts.stage, "Contracts");
  assert.equal(contracts.immediateDependency,
    "DRI-2:1/DirectorRuntimeStateContextBindingFoundation");
  const source = readFileSync(new URL("./directorRuntimeStateContextBindingContracts.ts", import.meta.url), "utf8");
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual([...new Set(imports)],
    ["@/app/lib/dri/directorRuntimeStateContextBindingFoundation"]);
  assert.doesNotMatch(source, /directorRuntimeIntegration|directorRuntimeStateContextBinding(?:Validation|Certification|Platform|Adapter|Freeze|PublicIndex)/);
});

test("reuses Foundation vocabularies and canonical types", () => {
  assert.equal(contracts.bindingScopes, foundationScopes);
  assert.equal(contracts.bindingStatuses, foundationStatuses);
  const typedContext: RuntimeContextReference = context;
  assert.equal(typedContext.workspaceId, "workspace-1");
});

test("creates an immutable request and preserves caller-owned identity", () => {
  const source = { bindingId: "caller-id", runtimeState: { ...state }, context: { ...context },
    scope: "object" as const };
  const before = JSON.stringify(source);
  const created = createRuntimeStateContextBindingRequest(source);
  assert.equal(created.bindingId, "caller-id");
  assert.equal(JSON.stringify(source), before);
  assert.equal(Object.isFrozen(created), true);
  assert.equal(Object.isFrozen(created.runtimeState), true);
  assert.equal(Object.isFrozen(created.context), true);
});

test("formalizes Foundation hierarchy requirements for every scope", () => {
  assert.deepEqual(resolveRuntimeStateContextBindingRequirements("global"), []);
  assert.deepEqual(resolveRuntimeStateContextBindingRequirements("workspace").map((r) => r.dimension),
    ["workspace"]);
  assert.deepEqual(resolveRuntimeStateContextBindingRequirements("goal").map((r) => r.dimension),
    ["workspace", "goal"]);
  assert.deepEqual(resolveRuntimeStateContextBindingRequirements("object").map((r) => r.dimension),
    ["workspace", "goal", "object"]);
  assert.deepEqual(resolveRuntimeStateContextBindingRequirements("pack").map((r) => r.dimension),
    ["workspace", "goal", "object", "pack"]);
});

test("inspects available and missing context without mutation", () => {
  const partialContext = Object.freeze({ workspaceId: "w", goalId: "g" });
  const binding = createRuntimeStateContextBinding({
    bindingId: "b", runtimeState: state, context: partialContext, scope: "object",
  });
  assert.deepEqual(inspectRuntimeStateContextBinding(binding), {
    bindingId: "b", runtimeStateId: "state-1", scope: "object", status: "partial",
    availableContextDimensions: ["workspace", "goal"], missingRequiredDimensions: ["object"],
    constraintState: "unknown",
  });
  assert.deepEqual(partialContext, { workspaceId: "w", goalId: "g" });
});

test("keeps compatibility separate as compatible, incomplete, or incompatible", () => {
  const bound = createRuntimeStateContextBindingResult(request());
  assert.deepEqual(bound.compatibility, { state: "compatible", reasons: [] });
  const partial = createRuntimeStateContextBindingResult(request({
    scope: "object", context: { workspaceId: "w", goalId: "g" },
  }));
  assert.deepEqual(partial.compatibility.reasons.map(({ id }) => id),
    ["missing-required-context"]);
  assert.equal(partial.compatibility.state, "incomplete");
  const contradictory = createRuntimeStateContextBinding({
    bindingId: "b", runtimeState: state, context: { goalId: "g" }, scope: "goal",
  });
  assert.deepEqual(resolveRuntimeStateContextBindingCompatibility(contradictory).reasons.map(({ id }) => id),
    ["context-hierarchy-conflict"]);
  assert.equal(resolveRuntimeStateContextBindingCompatibility(contradictory).state, "incompatible");
  assert.deepEqual(compatibilityStates, ["compatible", "incomplete", "incompatible"]);
  assert.deepEqual(reasonIds, [
    "missing-required-context", "scope-context-mismatch", "invalid-runtime-state-reference",
    "invalid-binding-identity", "context-hierarchy-conflict",
  ]);
});

test("constructs all discriminated result states with bound-context iff bound", () => {
  const bound = createRuntimeStateContextBindingResult(request());
  const partial = createRuntimeStateContextBindingResult(request({ context: { workspaceId: "w" }, scope: "goal" }));
  const unbound = createRuntimeStateContextBindingResult(createRuntimeStateContextBinding({
    bindingId: "b", runtimeState: null, context: {}, scope: "global",
  }));
  const invalid = createRuntimeStateContextBindingResult(request({ bindingId: "" }));
  assert.deepEqual([bound.status, partial.status, unbound.status, invalid.status],
    ["bound", "partial", "unbound", "invalid"]);
  assert.equal("boundContext" in bound, true);
  for (const unsuccessful of [partial, unbound, invalid])
    assert.equal("boundContext" in unsuccessful, false);
  assert.equal(isBoundRuntimeStateContextBindingResult(bound), true);
  assert.equal(isBoundRuntimeStateContextBindingResult(partial), false);
  if (isBoundRuntimeStateContextBindingResult(bound)) assert.equal(bound.boundContext.status, "bound");
});

test("publishes ordered immutable constraint metadata", () => {
  assert.deepEqual(runtimeStateContextBindingConstraints.map(({ id }) => id), [
    "binding-identity-valid", "scope-context-compatible", "runtime-state-reference-valid",
    "context-hierarchy-consistent", "bound-result-integrity",
  ]);
  assert.equal(new Set(runtimeStateContextBindingConstraints.map(({ id }) => id)).size,
    runtimeStateContextBindingConstraints.length);
  assert.equal(Object.isFrozen(runtimeStateContextBindingConstraints), true);
});

test("is deterministic and JSON/plain-data compatible", () => {
  const one = createRuntimeStateContextBindingResult(request());
  const two = createRuntimeStateContextBindingResult(request());
  assert.deepEqual(one, two);
  assert.deepEqual(JSON.parse(JSON.stringify(one)), one);
  assert.equal(Object.isFrozen(one), true);
  assert.equal(Object.isFrozen(one.resolution), true);
});

test("registry, families, counts, APIs, and descriptor remain internally consistent", () => {
  assert.equal(registry.contractFamilyCount, registry.contractFamilies.length);
  assert.equal(registry.contractTypeCount, registry.contractTypes.length);
  assert.equal(registry.publicApiCount, registry.publicApis.length);
  assert.equal(runtimeStateContextBindingRequirements.length,
    contracts.requirements.length);
  assert.equal(runtimeStateContextBindingConstraints.length, contracts.constraints.length);
  assert.equal(runtimeStateContextBindingContractFamilies.length, registry.contractFamilyCount);
  assert.equal(runtimeStateContextBindingContractsPublicApiSurface.length, registry.publicApiCount);
  assert.equal(contracts.registry, registry);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(contracts), true);
});

test("contains no store, mutation, event, UI, framework, persistence, or network behavior", () => {
  const source = readFileSync(new URL("./directorRuntimeStateContextBindingContracts.ts", import.meta.url), "utf8");
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|three|@react-three|next)/i);
  assert.doesNotMatch(source, /\b(?:setRuntimeState|updateRuntimeState|setContext|changeWorkspace|selectObject|selectPack|dispatchBinding|applyBinding|commitBinding)\b/);
  assert.doesNotMatch(source, /\b(?:EventEmitter|subscribe|publish|listener|observer|WebSocket|useState|useEffect)\b/);
  assert.doesNotMatch(source, /\b(?:Date\.now|new Date|Math\.random|randomUUID|fetch|localStorage|indexedDB)\s*\(/);
  assert.doesNotMatch(source, /\b(?:camera|animation|coordinates|rendering|runtime store)\b/i);
});
