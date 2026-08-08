import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createRuntimeStateContextBinding } from
  "./directorRuntimeStateContextBindingFoundation.ts";
import { createRuntimeStateContextBindingRequest, type RuntimeStateContextBindingRequest } from
  "./directorRuntimeStateContextBindingContracts.ts";
import { type RuntimeStateContextBindingEngineInput } from
  "./directorRuntimeStateContextBindingEngine.ts";
import {
  RUNTIME_STATE_CONTEXT_BINDING_CONSUMER_ROLES as roles,
  RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_DIRECTIONS as directions,
  RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_PHASES as phases,
  RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_REJECTION_REASON_IDS as rejectionIds,
  RUNTIME_STATE_CONTEXT_BINDING_INTEGRATION_STATUSES as statuses,
  createRuntimeStateContextBindingIntegrationRequest,
  directorRuntimeStateContextBindingIntegration as integration,
  inspectRuntimeStateContextBindingIntegrationOutcome,
  integrateRuntimeStateContextBinding,
  isCompletedRuntimeStateContextBindingIntegration,
  isRejectedRuntimeStateContextBindingIntegration,
  runtimeStateContextBindingIntegrationApiNames,
  runtimeStateContextBindingIntegrationPredicateNames,
  runtimeStateContextBindingIntegrationPublicApiSurface,
  runtimeStateContextBindingIntegrationRegistry as registry,
  type RuntimeStateContextBindingConsumerRole,
  type RuntimeStateContextBindingIntegrationDirection,
  type RuntimeStateContextBindingIntegrationRequest,
} from "./directorRuntimeStateContextBindingIntegration.ts";

const state = Object.freeze({
  runtimeStateId: "state-1", runtimeStateVersion: "1", runtimeStateKind: "executive",
});
const context = Object.freeze({
  workspaceId: "workspace-1", goalId: "goal-1", objectId: "object-1", packId: "pack-1",
});
function engineInput(
  overrides: Partial<RuntimeStateContextBindingRequest> = {},
): RuntimeStateContextBindingEngineInput {
  return Object.freeze({ request: createRuntimeStateContextBindingRequest({
    bindingId: "binding-1", runtimeState: state, context, scope: "pack", ...overrides,
  }) });
}
function request(
  consumerRole: RuntimeStateContextBindingConsumerRole = "runtime",
  direction: RuntimeStateContextBindingIntegrationDirection = "runtime-to-director",
  input: RuntimeStateContextBindingEngineInput = engineInput(),
) {
  return createRuntimeStateContextBindingIntegrationRequest({
    consumerRole, direction, engineInput: input,
  });
}

test("publishes exact integration metadata and sole Engine dependency", () => {
  assert.equal(integration.identity, "DRI-2:4/DirectorRuntimeStateContextBindingIntegration");
  assert.equal(integration.version, "2.4.0");
  assert.equal(integration.namespace, "nexora.dri.runtime.state-context-binding.integration");
  assert.equal(integration.stage, "Integration");
  assert.equal(integration.immediateDependency, "DRI-2:3/DirectorRuntimeStateContextBindingEngine");
  const source = readFileSync(new URL("./directorRuntimeStateContextBindingIntegration.ts", import.meta.url), "utf8");
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual([...new Set(imports)],
    ["@/app/lib/dri/directorRuntimeStateContextBindingEngine"]);
  assert.doesNotMatch(source, /directorRuntimeStateContextBinding(?:Contracts|Foundation)|directorRuntimeIntegration/);
});

test("publishes stable unique integration vocabularies", () => {
  assert.deepEqual(roles, ["runtime", "director", "inspection"]);
  assert.deepEqual(directions, ["runtime-to-director", "director-to-runtime", "inspection-only"]);
  assert.deepEqual(statuses, ["accepted", "completed", "rejected"]);
  assert.deepEqual(rejectionIds, [
    "invalid-consumer-role", "invalid-integration-direction", "role-direction-mismatch",
    "missing-engine-input", "invalid-integration-request",
  ]);
  assert.deepEqual(phases,
    ["request-accepted", "envelope-validated", "engine-delegated", "outcome-created"]);
  for (const vocabulary of [roles, directions, statuses, rejectionIds, phases])
    assert.equal(new Set(vocabulary).size, vocabulary.length);
});

test("completes every permitted role and direction pairing", () => {
  const pairs = [
    ["runtime", "runtime-to-director"], ["runtime", "inspection-only"],
    ["director", "director-to-runtime"], ["director", "inspection-only"],
    ["inspection", "inspection-only"],
  ] as const;
  for (const [role, direction] of pairs) {
    const outcome = integrateRuntimeStateContextBinding(request(role, direction));
    assert.equal(outcome.status, "completed");
  }
});

test("rejects incompatible role-direction envelopes without engine output", () => {
  const pairs = [
    ["runtime", "director-to-runtime"], ["director", "runtime-to-director"],
    ["inspection", "runtime-to-director"], ["inspection", "director-to-runtime"],
  ] as const;
  for (const [role, direction] of pairs) {
    const outcome = integrateRuntimeStateContextBinding(request(role, direction));
    assert.equal(outcome.status, "rejected");
    assert.deepEqual(outcome.rejectionReasons.map(({ id }) => id), ["role-direction-mismatch"]);
    assert.equal("engineOutput" in outcome, false);
  }
});

test("rejects missing or malformed envelope fields deterministically", () => {
  const missing = integrateRuntimeStateContextBinding({
    consumerRole: "runtime", direction: "runtime-to-director",
  } as RuntimeStateContextBindingIntegrationRequest);
  assert.deepEqual(missing.rejectionReasons.map(({ id }) => id), ["missing-engine-input"]);
  const malformed = integrateRuntimeStateContextBinding({
    consumerRole: "unknown", direction: "sideways", engineInput: engineInput(),
  } as unknown as RuntimeStateContextBindingIntegrationRequest);
  assert.deepEqual(malformed.rejectionReasons.map(({ id }) => id),
    ["invalid-consumer-role", "invalid-integration-direction"]);
  assert.deepEqual(integrateRuntimeStateContextBinding(null).rejectionReasons.map(({ id }) => id),
    ["invalid-integration-request"]);
});

test("delegates valid requests and preserves authoritative bound output references", () => {
  const outcome = integrateRuntimeStateContextBinding(request());
  assert.equal(isCompletedRuntimeStateContextBindingIntegration(outcome), true);
  if (!isCompletedRuntimeStateContextBindingIntegration(outcome)) return;
  assert.equal(outcome.bindingResult, outcome.engineOutput.result);
  assert.equal(outcome.inspection, outcome.engineOutput.inspection);
  assert.equal(outcome.bindingResult.status, "bound");
  assert.equal(outcome.bindingResult.binding.bindingId, "binding-1");
  assert.equal(outcome.bindingResult.binding.runtimeState?.runtimeStateId, "state-1");
  assert.deepEqual(outcome.bindingResult.binding.context, context);
});

test("preserves partial, invalid, and unbound as completed engine outcomes", () => {
  const partial = integrateRuntimeStateContextBinding(request("runtime", "runtime-to-director",
    engineInput({ scope: "object", context: { workspaceId: "w", goalId: "g" } })));
  const invalid = integrateRuntimeStateContextBinding(request("director", "inspection-only",
    engineInput({ bindingId: "" })));
  const unboundInput = Object.freeze({ request: createRuntimeStateContextBinding({
    bindingId: "unbound-1", runtimeState: null, context: {}, scope: "global",
  }) });
  const unbound = integrateRuntimeStateContextBinding(request("inspection", "inspection-only", unboundInput));
  for (const outcome of [partial, invalid, unbound]) assert.equal(outcome.status, "completed");
  assert.deepEqual([partial, invalid, unbound].map((outcome) =>
    isCompletedRuntimeStateContextBindingIntegration(outcome) ? outcome.bindingResult.status : null),
  ["partial", "invalid", "unbound"]);
});

test("completed and rejected predicates narrow correctly", () => {
  const completed = integrateRuntimeStateContextBinding(request());
  const rejected = integrateRuntimeStateContextBinding(request("runtime", "director-to-runtime"));
  assert.equal(isCompletedRuntimeStateContextBindingIntegration(completed), true);
  assert.equal(isRejectedRuntimeStateContextBindingIntegration(completed), false);
  assert.equal(isCompletedRuntimeStateContextBindingIntegration(rejected), false);
  assert.equal(isRejectedRuntimeStateContextBindingIntegration(rejected), true);
});

test("projects consumer-safe inspection for completed and rejected outcomes", () => {
  const completed = inspectRuntimeStateContextBindingIntegrationOutcome(
    integrateRuntimeStateContextBinding(request()));
  assert.deepEqual(completed, {
    consumerRole: "runtime", direction: "runtime-to-director", integrationStatus: "completed",
    bindingStatus: "bound", compatibilityState: "compatible", bindingId: "binding-1",
    availableContextDimensions: ["workspace", "goal", "object", "pack"],
    missingRequiredDimensions: [],
  });
  const rejected = inspectRuntimeStateContextBindingIntegrationOutcome(
    integrateRuntimeStateContextBinding(request("inspection", "runtime-to-director")));
  assert.equal(rejected.integrationStatus, "rejected");
  assert.equal(rejected.bindingStatus, null);
  assert.equal(rejected.bindingId, null);
});

test("consumer metadata cannot alter canonical engine semantics", () => {
  const runtime = integrateRuntimeStateContextBinding(request("runtime", "inspection-only"));
  const director = integrateRuntimeStateContextBinding(request("director", "inspection-only"));
  const inspection = integrateRuntimeStateContextBinding(request("inspection", "inspection-only"));
  if (isCompletedRuntimeStateContextBindingIntegration(runtime) &&
      isCompletedRuntimeStateContextBindingIntegration(director) &&
      isCompletedRuntimeStateContextBindingIntegration(inspection)) {
    assert.deepEqual(runtime.engineOutput, director.engineOutput);
    assert.deepEqual(director.engineOutput, inspection.engineOutput);
  } else assert.fail("valid integration unexpectedly rejected");
});

test("is deterministic, stateless, immutable, and JSON-compatible", () => {
  const source = Object.freeze({
    consumerRole: "runtime" as const, direction: "runtime-to-director" as const,
    engineInput: engineInput(),
  });
  const before = JSON.stringify(source);
  const one = integrateRuntimeStateContextBinding(source);
  integrateRuntimeStateContextBinding(request("inspection", "inspection-only"));
  const two = integrateRuntimeStateContextBinding(source);
  assert.deepEqual(one, two);
  assert.equal(JSON.stringify(source), before);
  assert.equal(Object.isFrozen(one), true);
  if (isCompletedRuntimeStateContextBindingIntegration(one)) {
    assert.equal(Object.isFrozen(one.engineOutput), true);
    assert.equal(Object.isFrozen(one.bindingResult.binding.context), true);
  }
  assert.deepEqual(JSON.parse(JSON.stringify(one)), one);
});

test("registry dynamic counts, API ownership, and descriptor are consistent", () => {
  assert.equal(registry.contractTypeCount, registry.contractTypes.length);
  assert.equal(registry.consumerRoleCount, registry.consumerRoles.length);
  assert.equal(registry.directionCount, registry.directions.length);
  assert.equal(registry.statusCount, registry.statuses.length);
  assert.equal(registry.rejectionReasonCount, registry.rejectionReasons.length);
  assert.equal(registry.integrationPhaseCount, registry.integrationPhases.length);
  assert.equal(registry.functionalApiCount, registry.functionalApis.length);
  assert.equal(registry.predicateCount, registry.predicates.length);
  assert.equal(registry.publicApiCount, registry.publicApiSurface.length);
  assert.deepEqual(runtimeStateContextBindingIntegrationPublicApiSurface,
    [...runtimeStateContextBindingIntegrationApiNames,
      ...runtimeStateContextBindingIntegrationPredicateNames]);
  assert.equal(integration.registry, registry);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(integration), true);
});

test("contains no generation, storage, synchronization, events, adapters, async, UI, or execution", () => {
  const source = readFileSync(new URL("./directorRuntimeStateContextBindingIntegration.ts", import.meta.url), "utf8");
  assert.doesNotMatch(source, /\b(?:Date\.now|new Date|Math\.random|randomUUID|counter|cache|singleton|history)\b/);
  assert.doesNotMatch(source, /\b(?:synchronizeRuntimeState|syncContext|pushStateToDirector|pullStateFromRuntime|applyContext|activateBinding|commitBinding|updateDirectorState)\b/);
  assert.doesNotMatch(source, /\b(?:EventEmitter|publish|subscribe|listener|observer|callback|hook|event bus)\b/i);
  assert.doesNotMatch(source, /\b(?:async|Promise|setTimeout|setInterval|requestAnimationFrame|WebSocket|fetch|localStorage|indexedDB)\b/);
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|three|@react-three|next)/i);
  assert.doesNotMatch(source, /\b(?:adapter|camera|coordinates|animations|render cycles|scene rendering|runtime store)\b/i);
  assert.doesNotMatch(source, /\b(?:changeDirectorFocus|bindScene|changeObjectVisibility|updateScene|executeRuntimeCommand|activateLiveLens)\b/);
  assert.match(source, /executeRuntimeStateContextBindingEngine\(normalized\.engineInput\)/);
});
