import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_STATE_CONTEXT_BINDING_SCOPES as scopes,
  RUNTIME_STATE_CONTEXT_BINDING_STATUSES as statuses,
  createBoundRuntimeContext,
  createRuntimeStateContextBinding,
  directorRuntimeStateContextBindingFoundation as foundation,
  isRuntimeStateContextBindingBound,
  resolveRuntimeStateContextBindingStatus,
  runtimeStateContextBindingFoundationRegistry as registry,
  type RuntimeContextReference,
  type RuntimeStateReference,
} from "./directorRuntimeStateContextBindingFoundation.ts";

const state: RuntimeStateReference = Object.freeze({
  runtimeStateId: "state-1", runtimeStateVersion: "1", runtimeStateKind: "executive",
});
const hierarchy: RuntimeContextReference = Object.freeze({
  workspaceId: "workspace-1", goalId: "goal-1", objectId: "object-1", packId: "pack-1",
});
const bind = (scope: (typeof scopes)[number], context: RuntimeContextReference = hierarchy) =>
  createRuntimeStateContextBinding({ bindingId: `binding-${scope}`, runtimeState: state, context, scope });

test("publishes exact identity, metadata, and sole immediate DRI-1:9 dependency", () => {
  assert.equal(foundation.identity, "DRI-2:1/DirectorRuntimeStateContextBindingFoundation");
  assert.equal(foundation.version, "2.1.0");
  assert.equal(foundation.namespace, "nexora.dri.runtime.state-context-binding.foundation");
  assert.equal(foundation.upstreamDependency, "DRI-1:9/DirectorRuntimeIntegrationPublicIndex");
  assert.deepEqual({ layer: foundation.layer, capability: foundation.capability, stage: foundation.stage },
    { layer: "DRI", capability: "RuntimeStateContextBinding", stage: "Foundation" });
  const source = readFileSync(new URL("./directorRuntimeStateContextBindingFoundation.ts", import.meta.url), "utf8");
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual(imports, ["@/app/lib/dri/directorRuntimeIntegrationPublicIndex"]);
  assert.doesNotMatch(source, /directorRuntimeIntegration(?:Foundation|Contracts|Mapping|Binding|Validation|Certification|Platform|Freeze)/);
});

test("publishes stable unique scopes and lifecycle-neutral statuses", () => {
  assert.deepEqual(scopes, ["global", "workspace", "goal", "object", "pack"]);
  assert.deepEqual(statuses, ["unbound", "partial", "bound", "invalid"]);
  assert.equal(new Set(scopes).size, scopes.length);
  assert.equal(new Set(statuses).size, statuses.length);
});

test("resolves global, workspace, goal, object, and pack bindings", () => {
  for (const scope of scopes) assert.equal(bind(scope).status, "bound");
  assert.equal(bind("global", {}).status, "bound");
});

test("distinguishes progressive partial context from invalid contradiction", () => {
  assert.equal(bind("object", { workspaceId: "w", goalId: "g" }).status, "partial");
  assert.equal(bind("goal", { goalId: "g" }).status, "invalid");
  assert.equal(bind("object", { workspaceId: "w", goalId: "g", objectId: "" }).status, "invalid");
  assert.equal(resolveRuntimeStateContextBindingStatus(null, {}, "global"), "unbound");
});

test("bound predicate and normalized bound context reject unsuccessful bindings", () => {
  const bound = bind("object");
  assert.equal(isRuntimeStateContextBindingBound(bound), true);
  assert.deepEqual(createBoundRuntimeContext(bound), {
    identity: { bindingId: "binding-object" }, runtimeState: state,
    context: hierarchy, scope: "object", status: "bound",
  });
  const partial = bind("pack", { workspaceId: "w", goalId: "g", objectId: "o" });
  const invalid = bind("pack", { packId: "p" });
  assert.equal(isRuntimeStateContextBindingBound(partial), false);
  assert.equal(createBoundRuntimeContext(partial), null);
  assert.equal(createBoundRuntimeContext(invalid), null);
});

test("is deterministic, immutable, and plain-data serializable", () => {
  const input = { bindingId: "b", runtimeState: { ...state }, context: { ...hierarchy }, scope: "pack" as const };
  const before = JSON.stringify(input);
  const first = createRuntimeStateContextBinding(input);
  const second = createRuntimeStateContextBinding(input);
  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(input), before);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(Object.isFrozen(first.runtimeState), true);
  assert.equal(Object.isFrozen(first.context), true);
  assert.deepEqual(JSON.parse(JSON.stringify(first)), first);
});

test("registry counts and descriptor surfaces are derived and internally consistent", () => {
  assert.equal(registry.contractCount, registry.contracts.length);
  assert.equal(registry.scopeCount, registry.scopes.length);
  assert.equal(registry.statusCount, registry.statuses.length);
  assert.equal(registry.publicApiCount, registry.publicApis.length);
  assert.equal(new Set(registry.contracts).size, registry.contractCount);
  assert.equal(foundation.registry, registry);
  assert.equal(foundation.contracts, registry.contracts);
  assert.equal(foundation.publicApiSurface, registry.publicApis);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(foundation), true);
});

test("contains no runtime execution, side-effect, UI, or framework dependency", () => {
  const source = readFileSync(new URL("./directorRuntimeStateContextBindingFoundation.ts", import.meta.url), "utf8");
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|three|@react-three|next)/i);
  assert.doesNotMatch(source, /\b(?:Date\.now|new Date|Math\.random|fetch|localStorage|indexedDB)\s*\(/);
  assert.doesNotMatch(source, /\b(?:useState|useEffect|dispatch|subscribe|execute|render)\s*\(/);
});
