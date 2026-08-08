import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DIRECTOR_RUNTIME_INTERACTION_CONTRACT_DISPOSITIONS as dispositions,
  DIRECTOR_RUNTIME_INTERACTION_CONTRACT_VERSION as contractVersion,
  DIRECTOR_RUNTIME_INTERACTION_REJECTION_REASONS as rejectionReasons,
  acceptDirectorRuntimeInteractionContract,
  createDirectorRuntimeInteractionContext,
  createDirectorRuntimeInteractionContractEnvelope,
  createDirectorRuntimeInteractionRequest,
  directorRuntimeInteractionContracts as contracts,
  directorRuntimeInteractionContractsRegistry as registry,
  evaluateDirectorRuntimeInteractionContract,
  isAcceptedDirectorRuntimeInteractionContract,
  isDirectorRuntimeInteractionRequest,
  isRejectedDirectorRuntimeInteractionContract,
  rejectDirectorRuntimeInteractionContract,
  verifyDirectorRuntimeInteractionContracts,
  type CreateDirectorRuntimeInteractionRequestInput,
} from "./directorRuntimeInteractionContracts.ts";
import {
  DIRECTOR_INTERACTION_KINDS,
  DIRECTOR_INTERACTION_SOURCES,
  DIRECTOR_INTERACTION_TARGET_KINDS,
  createDirectorInteractionObservation,
} from "./directorRuntimeInteractionOrchestrationFoundation.ts";

const source = readFileSync(
  new URL("./directorRuntimeInteractionContracts.ts", import.meta.url),
  "utf8",
);

const observation = {
  interactionId: "ix-17",
  kind: "select" as const,
  source: "object" as const,
  target: { kind: "object" as const, id: "factory-01" },
  sequence: 17,
  scope: "scene" as const,
};

const context = {
  sceneId: "executive-main",
  workspaceId: "goal",
  lensId: "objects",
  runtimeContextId: "runtime-ctx-1",
};

function validInput(
  overrides: Partial<CreateDirectorRuntimeInteractionRequestInput> = {},
): CreateDirectorRuntimeInteractionRequestInput {
  return {
    requestId: "interaction-17",
    observation,
    context,
    contractVersion,
    ...overrides,
  };
}

test("1-4. publishes exact DRI-4:2 identity, version, namespace, and DRI-4:1-only dependency", () => {
  assert.deepEqual({
    phase: contracts.phase,
    name: contracts.name,
    identity: contracts.identity,
    namespace: contracts.namespace,
    version: contracts.version,
    layer: contracts.layer,
    stage: contracts.stage,
    immediateDependency: contracts.immediateDependency,
  }, {
    phase: "DRI-4:2",
    name: "DirectorRuntimeInteractionContracts",
    identity: "DRI-4:2/DirectorRuntimeInteractionContracts",
    namespace: "nexora.dri.interaction.orchestration.contracts",
    version: "4.2.0",
    layer: "DirectorRuntimeInteractionOrchestration",
    stage: "Contracts",
    immediateDependency: "DRI-4:1/DirectorRuntimeInteractionOrchestrationFoundation",
  });
  assert.equal(contracts.contractVersion, "4.2.0");
  assert.equal(contracts.philosophy, "interaction-contract-is-not-director-intent");
  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]);
  assert.deepEqual([...new Set(imports)], [
    "@/app/lib/dri/directorRuntimeInteractionOrchestrationFoundation",
  ]);
  assert.doesNotMatch(source, /directorRuntimeSceneOrchestration|directorRuntimeStateContext|directorRuntimeIntegration(?!Orchestration)/);
  assert.doesNotMatch(source, /from\s+["'](?:react|three|next)/i);
});

test("5. reuses DRI-4:1 vocabulary rather than redefining it", () => {
  assert.doesNotMatch(source, /export const DIRECTOR_INTERACTION_KINDS/);
  assert.doesNotMatch(source, /export const DIRECTOR_INTERACTION_SOURCES/);
  assert.doesNotMatch(source, /export const DIRECTOR_INTERACTION_TARGET_KINDS/);
  assert.doesNotMatch(source, /export const DIRECTOR_INTERACTION_SCOPES/);
  assert.doesNotMatch(source, /export const DIRECTOR_INTERACTION_LIFECYCLE_VALUES/);
  assert.equal(DIRECTOR_INTERACTION_KINDS.includes("select"), true);
  assert.equal(DIRECTOR_INTERACTION_SOURCES.includes("object"), true);
  assert.equal(DIRECTOR_INTERACTION_TARGET_KINDS.includes("object"), true);
});

test("6-8. request, context, and evaluation construction are deterministic", () => {
  const input = validInput();
  const one = createDirectorRuntimeInteractionRequest(input);
  const two = createDirectorRuntimeInteractionRequest(input);
  assert.deepEqual(one, two);
  assert.deepEqual(createDirectorRuntimeInteractionContext(context),
    createDirectorRuntimeInteractionContext(context));
  assert.deepEqual(
    evaluateDirectorRuntimeInteractionContract(input),
    evaluateDirectorRuntimeInteractionContract(input),
  );
  assert.equal(Object.isFrozen(one), true);
  assert.equal(Object.isFrozen(one.observation), true);
  assert.equal(Object.isFrozen(one.context), true);
});

test("9. valid request produces accepted disposition", () => {
  const result = evaluateDirectorRuntimeInteractionContract(validInput());
  assert.equal(result.disposition, "accepted");
  assert.equal(isAcceptedDirectorRuntimeInteractionContract(result), true);
  if (result.disposition === "accepted") {
    assert.equal(result.request.requestId, "interaction-17");
    assert.equal(result.request.observation.kind, "select");
    assert.equal(result.request.observation.target.id, "factory-01");
    assert.deepEqual(result.request.context, context);
    assert.equal(result.contractVersion, "4.2.0");
  }
  const accepted = acceptDirectorRuntimeInteractionContract(
    createDirectorRuntimeInteractionRequest(validInput()),
  );
  assert.equal(accepted.disposition, "accepted");
});

test("10-16. invalid inputs produce deterministic machine-readable rejections", () => {
  assert.deepEqual([...dispositions], ["accepted", "rejected"]);
  assert.deepEqual([...rejectionReasons], [
    "invalid-request", "invalid-observation", "invalid-context", "invalid-target",
    "invalid-sequence", "unsupported-version", "contract-incompatible",
  ]);

  const invalidRequest = evaluateDirectorRuntimeInteractionContract({
    requestId: "",
    observation,
  } as CreateDirectorRuntimeInteractionRequestInput);
  assert.equal(invalidRequest.disposition, "rejected");
  if (invalidRequest.disposition === "rejected") {
    assert.equal(invalidRequest.reason, "invalid-request");
  }

  const invalidObservation = evaluateDirectorRuntimeInteractionContract(validInput({
    observation: { ...observation, kind: "click" as "select" },
  }));
  assert.equal(invalidObservation.disposition, "rejected");
  if (invalidObservation.disposition === "rejected") {
    assert.equal(invalidObservation.reason, "invalid-observation");
  }

  const invalidContext = evaluateDirectorRuntimeInteractionContract(validInput({
    context: { sceneId: "" },
  }));
  assert.equal(invalidContext.disposition, "rejected");
  if (invalidContext.disposition === "rejected") {
    assert.equal(invalidContext.reason, "invalid-context");
  }

  const invalidTarget = evaluateDirectorRuntimeInteractionContract(validInput({
    observation: { ...observation, target: { kind: "object", id: "" } },
  }));
  assert.equal(invalidTarget.disposition, "rejected");
  if (invalidTarget.disposition === "rejected") {
    assert.equal(invalidTarget.reason, "invalid-target");
  }

  const invalidSequence = evaluateDirectorRuntimeInteractionContract(validInput({
    observation: { ...observation, sequence: -1 },
  }));
  assert.equal(invalidSequence.disposition, "rejected");
  if (invalidSequence.disposition === "rejected") {
    assert.equal(invalidSequence.reason, "invalid-sequence");
  }

  const unsupported = evaluateDirectorRuntimeInteractionContract(validInput({
    contractVersion: "9.9.9",
  }));
  assert.equal(unsupported.disposition, "rejected");
  if (unsupported.disposition === "rejected") {
    assert.equal(unsupported.reason, "unsupported-version");
  }

  const explicit = rejectDirectorRuntimeInteractionContract({
    reason: "contract-incompatible",
    request: createDirectorRuntimeInteractionRequest(validInput()),
  });
  assert.equal(explicit.disposition, "rejected");
  assert.equal(explicit.reason, "contract-incompatible");
  assert.equal(explicit.request?.requestId, "interaction-17");
});

test("17-19. accepted/rejected results are distinguishable and guards work", () => {
  const accepted = evaluateDirectorRuntimeInteractionContract(validInput());
  const rejected = evaluateDirectorRuntimeInteractionContract(validInput({
    contractVersion: "0.0.0",
  }));
  assert.equal(isAcceptedDirectorRuntimeInteractionContract(accepted), true);
  assert.equal(isRejectedDirectorRuntimeInteractionContract(accepted), false);
  assert.equal(isRejectedDirectorRuntimeInteractionContract(rejected), true);
  assert.equal(isAcceptedDirectorRuntimeInteractionContract(rejected), false);
  assert.equal(isDirectorRuntimeInteractionRequest(
    createDirectorRuntimeInteractionRequest(validInput()),
  ), true);
  assert.equal(isDirectorRuntimeInteractionRequest({ requestId: "x" }), false);
  const envelope = createDirectorRuntimeInteractionContractEnvelope(accepted);
  assert.equal(envelope.contractIdentity, contracts.identity);
  assert.equal(envelope.result.disposition, "accepted");
  assert.equal(Object.isFrozen(envelope), true);
});

test("20-21. original observation and context are preserved without reinterpretation", () => {
  const request = createDirectorRuntimeInteractionRequest(validInput());
  assert.deepEqual(request.observation, createDirectorInteractionObservation(observation));
  assert.equal(request.observation.kind, "select");
  assert.equal(request.observation.target.id, "factory-01");
  assert.notEqual(request.observation.kind, "focus");
  assert.deepEqual(request.context, context);
  assert.equal("modeId" in request.context, false);
});

test("22-24. caller-provided observation, context, and request are never mutated", () => {
  const mutableObservation = { ...observation, target: { ...observation.target } };
  const mutableContext = { ...context };
  const input = {
    requestId: "interaction-17",
    observation: mutableObservation,
    context: mutableContext,
    contractVersion,
  };
  const before = JSON.stringify(input);
  createDirectorRuntimeInteractionRequest(input);
  evaluateDirectorRuntimeInteractionContract(input);
  const built = createDirectorRuntimeInteractionRequest(input);
  acceptDirectorRuntimeInteractionContract(built);
  assert.equal(JSON.stringify(input), before);
  assert.equal(Object.isFrozen(mutableObservation), false);
  assert.equal(Object.isFrozen(mutableContext), false);
});

test("25-26. registry counts match definitions and verification succeeds", () => {
  const pairs: readonly [number, readonly unknown[]][] = [
    [registry.dispositionCount, registry.dispositions],
    [registry.rejectionReasonCount, registry.rejectionReasons],
    [registry.supportedContractVersionCount, registry.supportedContractVersions],
    [registry.contractTypeCount, registry.contractTypes],
    [registry.publicApiCount, registry.publicApis],
  ];
  for (const [count, values] of pairs) {
    assert.equal(count, values.length);
    assert.equal(new Set(values).size, values.length);
  }
  assert.equal(registry.immediateDependency, contracts.immediateDependency);
  assert.equal(verifyDirectorRuntimeInteractionContracts(), true);
  assert.equal(verifyDirectorRuntimeInteractionContracts(), true);
});

test("27-28. no random identity generation or hidden mutable state", () => {
  assert.doesNotMatch(source, /\b(?:Math\.random|randomUUID|crypto\.random|Date\.now|new Date)\b/);
  assert.doesNotMatch(source, /\blet\s+\w+\s*=/);
  assert.doesNotMatch(source, /\b(?:globalThis|process\.env|localStorage|indexedDB)\b/);
});

test("29-36. architectural negatives: UI, runtime lookup, intent, focus, reaction, execution", () => {
  assert.doesNotMatch(source, /from\s+["'](?:react|react-dom|next|three|@react-three)/i);
  assert.doesNotMatch(
    source,
    /\b(?:React|ReactDOM|JSX|THREE|MouseEvent|PointerEvent|KeyboardEvent|HTMLElement|Object3D)\b/,
  );
  assert.doesNotMatch(source, /\b(?:getObjectById|scene\.get|lookupScene|querySelector|findObject)\b/);
  assert.doesNotMatch(
    source,
    /\b(?:resolveIntent|IntentResolver|IntentMap|DirectorIntent|ResolvedInteractionIntent|InteractionMeaning)\b/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:selectedObjectId|focusedObjectId|previousFocus|focusStack|selectionHistory|focusTransition)\b/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:reactionPlan|centerObject|dimNodes|highlightPath|updateAdvisor|changeLens|openExplorer)\b/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:mutateScene|executeScene|publishDirectorRuntimeScene|renderScene|dispatch)\b/,
  );
  assert.doesNotMatch(source, /from\s+["']node:(?:fs|path)|readFile|writeFile/);
});
