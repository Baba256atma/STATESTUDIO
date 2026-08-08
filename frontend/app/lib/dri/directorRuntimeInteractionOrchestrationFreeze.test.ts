import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import * as platformSurface from "./directorRuntimeInteractionOrchestrationPlatform.ts";
import {
  DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_CERTIFICATION_DOMAINS as domains,
  DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_CERTIFICATION_STATUSES as certificationStatuses,
  DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_COMPATIBILITY_STATUSES as compatibilityStatuses,
  DIRECTOR_RUNTIME_INTERACTION_ORCHESTRATION_PLATFORM_PHASES as phases,
  certifyDirectorRuntimeInteractionOrchestrationPlatform,
  continueDirectorRuntimeInteractionOrchestrationAfterIntent,
  createDirectorRuntimeFocusSelectionState,
  createEmptyDirectorRuntimeFocusSelectionState,
  directorRuntimeInteractionOrchestrationFreeze as freeze,
  directorRuntimeInteractionOrchestrationFreezeCompatibility as compatibility,
  directorRuntimeInteractionOrchestrationFreezeManifest as manifest,
  directorRuntimeInteractionOrchestrationFreezeRegistry as registry,
  directorRuntimeInteractionOrchestrationFreezeVerification as freezeVerification,
  directorRuntimeInteractionOrchestrationFrozenExports as frozenExports,
  directorRuntimeInteractionOrchestrationFrozenFunctionalApiNames as functionalApis,
  directorRuntimeInteractionOrchestrationFrozenIdentityChain as identityChain,
  directorRuntimeInteractionOrchestrationFrozenPublicApiSurface as publicApiSurface,
  directorRuntimeInteractionOrchestrationLock as lock,
  directorRuntimeInteractionOrchestrationPlatform,
  directorRuntimeInteractionOrchestrationPlatformLock as platformLock,
  directorRuntimeInteractionOrchestrationPublicIndexReadiness as publicIndexReadiness,
  orchestrateDirectorRuntimeInteraction,
  verifyDirectorRuntimeInteractionOrchestrationFreeze,
  type AcceptedDirectorRuntimeInteractionContract,
} from "./directorRuntimeInteractionOrchestrationFreeze.ts";

const source = readFileSync(
  new URL("./directorRuntimeInteractionOrchestrationFreeze.ts", import.meta.url),
  "utf8",
);

const factory = Object.freeze({ kind: "object" as const, id: "factory-01" });
const warehouse = Object.freeze({ kind: "object" as const, id: "warehouse-01" });

function successInput() {
  return {
    requestId: "interaction-17",
    observation: {
      interactionId: "ix-17",
      kind: "select" as const,
      source: "object" as const,
      target: factory,
      sequence: 17,
      scope: "scene" as const,
    },
    context: { sceneId: "executive-main", workspaceId: "workspace-1" },
    currentState: createDirectorRuntimeFocusSelectionState({
      focusedTarget: warehouse,
      selectedTarget: null,
    }),
  };
}

test("1-4. exact DRI-4:8 identity, version, namespace, sole DRI-4:7 dependency", () => {
  assert.deepEqual({
    phase: freeze.phase,
    name: freeze.name,
    identity: freeze.identity,
    namespace: freeze.namespace,
    version: freeze.version,
    layer: freeze.layer,
    stage: freeze.stage,
    immediateDependency: freeze.immediateDependency,
  }, {
    phase: "DRI-4:8",
    name: "DirectorRuntimeInteractionOrchestrationFreeze",
    identity: "DRI-4:8/DirectorRuntimeInteractionOrchestrationFreeze",
    namespace: "nexora.dri.interaction.orchestration.freeze",
    version: "4.8.0",
    layer: "DirectorRuntimeInteractionOrchestration",
    stage: "CertificationAndFreeze",
    immediateDependency: "DRI-4:7/DirectorRuntimeInteractionOrchestrationPlatform",
  });
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual([...new Set(imports)], [
    "@/app/lib/dri/directorRuntimeInteractionOrchestrationPlatform",
  ]);
});

test("5-8. certification/compatibility vocabularies immutable; exact freeze lock present", () => {
  assert.deepEqual([...domains], [
    "identity", "dependency", "contracts", "pipeline", "determinism", "immutability",
    "trace", "termination", "execution", "compatibility", "architecture", "registry",
  ]);
  assert.deepEqual([...certificationStatuses], ["certified", "rejected"]);
  assert.deepEqual([...compatibilityStatuses], ["compatible", "incompatible"]);
  assert.equal(Object.isFrozen(domains), true);
  assert.equal(Object.isFrozen(certificationStatuses), true);
  assert.equal(Object.isFrozen(compatibilityStatuses), true);
  assert.equal(lock, "DRI-4-DIRECTOR-RUNTIME-INTERACTION-ORCHESTRATION-LOCKED");
  assert.deepEqual(platformLock, {
    lockId: "DRI-4-DIRECTOR-RUNTIME-INTERACTION-ORCHESTRATION-LOCKED",
    locked: true,
    phase: "DRI-4",
    stage: "CertificationAndFreeze",
  });
  assert.equal(freeze.status, "Frozen");
  assert.equal(freeze.certificationStatus, "Certified");
  assert.equal(freeze.readiness, "ReadyForPublicIndex");
  assert.equal(freeze.frozen, true);
});

test("9-15. platform identity/version/namespace/dependency and phase certifications", () => {
  const report = certifyDirectorRuntimeInteractionOrchestrationPlatform();
  const byId = Object.fromEntries(report.checks.map((entry) => [entry.checkId, entry]));
  assert.equal(byId["platform-identity"]?.passed, true);
  assert.equal(byId["platform-version"]?.passed, true);
  assert.equal(byId["platform-namespace"]?.passed, true);
  assert.equal(byId["platform-dependency"]?.passed, true);
  assert.equal(byId["runtime-phase-count"]?.passed, true);
  assert.equal(byId["runtime-phase-order"]?.passed, true);
  assert.equal(byId["runtime-phase-unique"]?.passed, true);
  assert.equal(phases.length, 6);
  assert.deepEqual([...phases], [
    "foundation", "contract", "intent-resolution", "focus-selection",
    "reaction-planning", "execution",
  ]);
  assert.equal(new Set(phases).size, phases.length);
});

test("16-22. success, rejection, unresolved certification paths", () => {
  const report = certifyDirectorRuntimeInteractionOrchestrationPlatform();
  const byId = Object.fromEntries(report.checks.map((entry) => [entry.checkId, entry]));
  assert.equal(byId["end-to-end-success"]?.passed, true);
  assert.equal(byId["contract-rejection-termination"]?.passed, true);
  assert.equal(byId["unresolved-intent-termination"]?.passed, true);

  const rejected = orchestrateDirectorRuntimeInteraction({
    requestId: "rej",
    observation: {
      interactionId: "ix-bad",
      kind: "select",
      source: "object",
      target: { kind: "object", id: "" },
      sequence: 1,
      scope: "scene",
    },
    context: { sceneId: "executive-main" },
    currentState: createEmptyDirectorRuntimeFocusSelectionState(),
  });
  assert.equal(rejected.intent, null);
  assert.equal(rejected.transition, null);
  assert.equal(rejected.reactionPlan, null);
  assert.equal(rejected.execution, null);

  const accepted = orchestrateDirectorRuntimeInteraction(successInput());
  const unresolved = continueDirectorRuntimeInteractionOrchestrationAfterIntent({
    requestId: "unresolved",
    observation: accepted.observation,
    context: accepted.context,
    currentState: accepted.initialState,
    contract: accepted.contract as AcceptedDirectorRuntimeInteractionContract,
    intent: Object.freeze({
      disposition: "unresolved" as const,
      reason: "unsupported-combination" as const,
      requestId: "unresolved",
      matchedRuleIds: Object.freeze([] as const),
    }),
  });
  assert.equal(unresolved.transition, null);
  assert.equal(unresolved.reactionPlan, null);
  assert.equal(unresolved.execution, null);
});

test("23-25. NoOp valid; unchanged focus idempotent; focus/selection distinct", () => {
  const report = certifyDirectorRuntimeInteractionOrchestrationPlatform();
  const byId = Object.fromEntries(report.checks.map((entry) => [entry.checkId, entry]));
  assert.equal(byId["noop-path"]?.passed, true);
  assert.equal(byId["preserve-transition"]?.passed, true);
  assert.equal(byId["focus-selection-separation"]?.passed, true);

  const success = orchestrateDirectorRuntimeInteraction(successInput());
  assert.equal(success.finalState.focus.focusedTarget?.id, "warehouse-01");
  assert.equal(success.finalState.selection.selectedTarget?.id, "factory-01");
  assert.notEqual(
    success.finalState.focus.focusedTarget?.id,
    success.finalState.selection.selectedTarget?.id,
  );
});

test("26-31. determinism, replay, and caller-input immutability", () => {
  const report = certifyDirectorRuntimeInteractionOrchestrationPlatform();
  const byId = Object.fromEntries(report.checks.map((entry) => [entry.checkId, entry]));
  assert.equal(byId["determinism-result"]?.passed, true);
  assert.equal(byId["determinism-trace"]?.passed, true);
  assert.equal(byId["immutability-observation"]?.passed, true);
  assert.equal(byId["immutability-context"]?.passed, true);
  assert.equal(byId["immutability-state"]?.passed, true);

  const a = orchestrateDirectorRuntimeInteraction(successInput());
  const b = orchestrateDirectorRuntimeInteraction(successInput());
  assert.deepEqual(a, b);
  assert.deepEqual(a.trace, b.trace);

  const observation = {
    interactionId: "ix-17",
    kind: "select" as const,
    source: "object" as const,
    target: { kind: "object" as const, id: "factory-01" },
    sequence: 17,
    scope: "scene" as const,
  };
  const context = { sceneId: "executive-main", workspaceId: "workspace-1" };
  const currentState = createDirectorRuntimeFocusSelectionState({
    focusedTarget: warehouse,
    selectedTarget: null,
  });
  const observationSnap = structuredClone(observation);
  const contextSnap = structuredClone(context);
  const stateSnap = structuredClone(currentState);
  orchestrateDirectorRuntimeInteraction({
    requestId: "interaction-17",
    observation,
    context,
    currentState,
  });
  assert.deepEqual(observation, observationSnap);
  assert.deepEqual(context, contextSnap);
  assert.deepEqual(currentState, stateSnap);
});

test("32-36. reaction/execution semantics and partial/unsupported visibility", () => {
  const report = certifyDirectorRuntimeInteractionOrchestrationPlatform();
  const byId = Object.fromEntries(report.checks.map((entry) => [entry.checkId, entry]));
  assert.equal(byId["reaction-semantic"]?.passed, true);
  assert.equal(byId["reaction-order-deterministic"]?.passed, true);
  assert.equal(byId["execution-order-deterministic"]?.passed, true);
  assert.equal(byId["partial-execution-visible"]?.passed, true);
  assert.equal(byId["rejected-execution-visible"]?.passed, true);
  assert.equal(byId["execution-count-derivation"]?.passed, true);
});

test("37-43. trace consistency, final-state authority, provenance", () => {
  const report = certifyDirectorRuntimeInteractionOrchestrationPlatform();
  const byId = Object.fromEntries(report.checks.map((entry) => [entry.checkId, entry]));
  assert.equal(byId["trace-success-order"]?.passed, true);
  assert.equal(byId["trace-rejection"]?.passed, true);
  assert.equal(byId["trace-unresolved"]?.passed, true);
  assert.equal(byId["trace-immutable"]?.passed, true);
  assert.equal(byId["trace-result-consistency"]?.passed, true);
  assert.equal(byId["final-state-authority"]?.passed, true);
  assert.equal(byId["identity-propagation"]?.passed, true);

  const success = orchestrateDirectorRuntimeInteraction(successInput());
  assert.equal(success.finalState, success.transition!.nextState);
  assert.deepEqual(success.trace.map((entry) => entry.phase), [...phases]);
});

test("44-56. architecture purity and ownership boundaries", () => {
  assert.doesNotMatch(source, /\b(?:Math\.random|randomUUID|Date\.now|new Date)\b/);
  assert.doesNotMatch(source, /\blet\s+\w+\s*=/);
  assert.doesNotMatch(source, /\b(?:publish|subscribe|emit|EventEmitter)\s*\(/);
  assert.doesNotMatch(
    source,
    /directorRuntimeSceneOrchestration(?!PublicIndex)|orchestrateDirectorRuntimeScene/,
  );
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|next|three|@react-three)/i);
  assert.doesNotMatch(
    source,
    /\b(?:React|ReactDOM|JSX|THREE|MouseEvent|PointerEvent|HTMLElement|Object3D|Mesh|Camera|Vector3)\b/,
  );
  assert.doesNotMatch(source, /\b(?:document|window)\b/);
  assert.doesNotMatch(source, /\b(?:localStorage|sessionStorage|indexedDB|fetch|XMLHttpRequest|WebSocket)\b/);
  assert.doesNotMatch(
    source,
    /\b(?:generateSummary|recommend|callLLM|calculateKpi|approveDecision|allocateBudget)\b/,
  );
  assert.doesNotMatch(source, /from\s+["']node:(?:fs|path)|readFile|writeFile/);
  assert.doesNotMatch(source, /DIRECTOR_RUNTIME_INTERACTION_INTENT_RESOLUTION_RULES\s*=/);
  assert.doesNotMatch(source, /DIRECTOR_RUNTIME_FOCUS_SELECTION_TRANSITION_RULES\s*=/);
  assert.doesNotMatch(source, /DIRECTOR_RUNTIME_INTERACTION_REACTION_PLANNING_RULES\s*=/);
  assert.doesNotMatch(source, /DIRECTOR_RUNTIME_INTERACTION_EXECUTION_CAPABILITIES\s*=/);
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri\/directorRuntime(?:Interaction(?:OrchestrationFoundation|Contracts|IntentResolution|ReactionPlanning|Execution)|FocusSelectionOrchestration)/,
  );
  const report = certifyDirectorRuntimeInteractionOrchestrationPlatform();
  assert.equal(
    report.checks.find((entry) => entry.checkId === "architecture-purity-platform")?.passed,
    true,
  );
});

test("57-60. certification report certified with derived counts", () => {
  const a = certifyDirectorRuntimeInteractionOrchestrationPlatform();
  const b = certifyDirectorRuntimeInteractionOrchestrationPlatform();
  assert.equal(a.status, "certified");
  assert.equal(a.certified, true);
  assert.equal(a.failedCount, 0);
  assert.equal(a.passedCount, a.checks.length);
  assert.equal(a.compatibility, "compatible");
  assert.deepEqual(a, b);
  assert.equal(compatibility.status, "compatible");
});

test("61-66. frozen public API/export surfaces and registry counts", () => {
  assert.equal(Object.isFrozen(publicApiSurface), true);
  assert.equal(Object.isFrozen(publicApiSurface[0]), true);
  assert.equal(Object.isFrozen(frozenExports), true);
  assert.equal(registry.publicApiCount, publicApiSurface.length);
  assert.equal(registry.frozenExportCount, frozenExports.length);
  assert.equal(registry.publicApiCount, registry.frozenExportCount);
  assert.equal(registry.certificationDomainCount, domains.length);
  assert.equal(registry.compatibilityStatusCount, compatibilityStatuses.length);
  assert.equal(registry.platformPhaseCount, phases.length);
  assert.equal(registry.immediateDependency,
    "DRI-4:7/DirectorRuntimeInteractionOrchestrationPlatform");
  assert.deepEqual(publicApiSurface.map(({ exportName }) => exportName), [...frozenExports]);
  assert.ok(functionalApis.includes("orchestrateDirectorRuntimeInteraction"));
  assert.ok(functionalApis.includes("certifyDirectorRuntimeInteractionOrchestrationPlatform"));
  assert.ok(functionalApis.includes("verifyDirectorRuntimeInteractionOrchestrationFreeze"));
  assert.deepEqual(manifest.publicApiSurface, frozenExports);
});

test("67-70. certification/verify deterministic; no new semantics; not Public Index", () => {
  assert.equal(verifyDirectorRuntimeInteractionOrchestrationFreeze(), true);
  assert.equal(freezeVerification, true);
  assert.equal(
    freeze.frozenApis.orchestrateDirectorRuntimeInteraction,
    platformSurface.orchestrateDirectorRuntimeInteraction,
  );
  assert.equal(
    freeze.frozenApis.verifyDirectorRuntimeInteractionOrchestrationPlatform,
    platformSurface.verifyDirectorRuntimeInteractionOrchestrationPlatform,
  );
  assert.equal(directorRuntimeInteractionOrchestrationPlatform,
    platformSurface.directorRuntimeInteractionOrchestrationPlatform);
  assert.doesNotMatch(source, /function\s+resolveDirectorRuntimeInteractionIntent\s*\(/);
  assert.doesNotMatch(source, /function\s+planDirectorRuntimeInteractionReaction\s*\(/);
  assert.doesNotMatch(source, /function\s+executeDirectorRuntimeInteraction\s*\(/);
  assert.equal(freeze.releaseInformation.publicIndex, false);
  assert.equal(freeze.releaseInformation.soleConsumerEntryPoint, false);
  assert.equal(freeze.releaseInformation.readyForConsumer, false);
  assert.equal(publicIndexReadiness.readyForPublicIndex, true);
  assert.equal(publicIndexReadiness.readyForConsumer, false);
  assert.equal(
    publicIndexReadiness.nextStageId,
    "DRI-4:9/DirectorRuntimeInteractionOrchestrationPublicIndex",
  );
  assert.deepEqual([...identityChain], [
    "DRI-4:1/DirectorRuntimeInteractionOrchestrationFoundation",
    "DRI-4:2/DirectorRuntimeInteractionContracts",
    "DRI-4:3/DirectorRuntimeInteractionIntentResolution",
    "DRI-4:4/DirectorRuntimeFocusSelectionOrchestration",
    "DRI-4:5/DirectorRuntimeInteractionReactionPlanning",
    "DRI-4:6/DirectorRuntimeInteractionExecution",
    "DRI-4:7/DirectorRuntimeInteractionOrchestrationPlatform",
    "DRI-4:8/DirectorRuntimeInteractionOrchestrationFreeze",
  ]);
});

