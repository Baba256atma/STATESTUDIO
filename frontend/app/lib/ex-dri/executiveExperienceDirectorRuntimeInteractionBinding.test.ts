import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_INTERACTION_BINDING_GUARANTEES as guarantees,
  EXECUTIVE_INTERACTION_BINDING_ISSUE_CODES as issueCodes,
  EXECUTIVE_INTERACTION_BINDING_KINDS as interactionKinds,
  EXECUTIVE_INTERACTION_BINDING_PUBLIC_TYPE_NAMES as publicTypeNames,
  EXECUTIVE_INTERACTION_BINDING_REGISTRY_SECTIONS as registrySections,
  EXECUTIVE_INTERACTION_BINDING_REQUEST_DIRECTION as requestDirection,
  EXECUTIVE_INTERACTION_BINDING_REQUEST_KIND as requestKind,
  EXECUTIVE_INTERACTION_BINDING_STATUSES as statuses,
  EXECUTIVE_INTERACTION_POLICIES as policies,
  areExecutiveInteractionsEqual,
  bindExecutiveInteractionToDirectorRuntimeRequest,
  bindExecutiveInteractionsToDirectorRuntimeRequests,
  canBindExecutiveInteraction,
  executiveExperienceDirectorRuntimeInteractionBinding as binding,
  executiveExperienceDirectorRuntimeInteractionBindingApiNames as apiNames,
  executiveExperienceDirectorRuntimeInteractionBindingCanonicalIdentity as canonicalIdentity,
  executiveExperienceDirectorRuntimeInteractionBindingRegistry as registry,
  executiveExperienceDirectorRuntimeInteractionBindingValidatorNames as validators,
  getExecutiveExperienceDirectorRuntimeInteractionBindingIdentity,
  getExecutiveInteractionPolicy,
  isExecutiveInteractionBindingInput,
  isExecutiveInteractionBindingResult,
  normalizeExecutiveInteractionBindingInput,
  verifyExecutiveExperienceDirectorRuntimeInteractionBinding,
  type ExecutiveInteractionBindingInput,
} from "./executiveExperienceDirectorRuntimeInteractionBinding.ts";

import {
  bindExecutiveExperienceStateToDirectorRuntimeContext,
  createExecutiveDirectorRuntimeContextContract,
  executiveExperienceDirectorRuntimeContextStateBindingIdentity,
  verifyExecutiveExperienceDirectorRuntimeContextStateBinding,
} from "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeContextStateBinding";

import {
  verifyExecutiveExperienceDirectorRuntimeIntegrationContracts,
} from "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeIntegrationContracts";

import {
  verifyExecutiveExperienceDirectorRuntimeIntegrationFoundation,
} from "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeIntegrationFoundation";

import {
  directorRuntimeConsumerIntegrationPublicIndexIdentity,
  verifyDirectorRuntimeConsumerIntegrationPublicIndex,
} from "@/app/lib/dri/directorRuntimeConsumerIntegrationPublicIndex";

const source = readFileSync(
  new URL(
    "./executiveExperienceDirectorRuntimeInteractionBinding.ts",
    import.meta.url,
  ),
  "utf8",
);

const factory = Object.freeze({
  id: "factory-1",
  kind: "object" as const,
  label: "Factory",
});

const scenarioA = Object.freeze({
  id: "scenario-a",
  kind: "scenario" as const,
  label: "Scenario A",
});

const throughputKpi = Object.freeze({
  id: "kpi-throughput",
  kind: "kpi" as const,
  label: "Throughput KPI",
});

const stageContext = createExecutiveDirectorRuntimeContextContract({
  surface: "stage",
  mode: "scenario",
  selectedSubject: factory,
  activeGoalId: "G1",
  activePackId: "Scenario-A",
});

function baseInput(
  overrides: Partial<ExecutiveInteractionBindingInput> = {},
): ExecutiveInteractionBindingInput {
  return {
    interactionId: "ix.select.factory",
    kind: "select",
    surface: "stage",
    subject: factory,
    context: stageContext,
    correlation: {
      correlationId: "C-1",
      sequence: 1,
    },
    ...overrides,
  };
}

test("1. exact EX-DRI-4 identity", () => {
  assert.equal(
    binding.identity,
    "EX-DRI-4/ExecutiveExperienceDirectorRuntimeInteractionBinding",
  );
  assert.equal(canonicalIdentity.identity, binding.identity);
  assert.equal(binding.phase, "EX-DRI-4");
  assert.equal(
    binding.name,
    "ExecutiveExperienceDirectorRuntimeInteractionBinding",
  );
  assert.equal(
    binding.role,
    "ExecutiveExperienceDirectorRuntimeInteractionBinding",
  );
  assert.equal(binding.status, "InteractionBindingReady");
  assert.deepEqual(
    getExecutiveExperienceDirectorRuntimeInteractionBindingIdentity(),
    canonicalIdentity,
  );
});

test("2. exact version 1.4.0", () => {
  assert.equal(binding.version, "1.4.0");
  assert.equal(canonicalIdentity.version, "1.4.0");
  assert.equal(registry.version, "1.4.0");
});

test("3. exact namespace", () => {
  assert.equal(
    binding.namespace,
    "nexora.ex.dri.integration.interaction-binding",
  );
  assert.equal(canonicalIdentity.namespace, binding.namespace);
});

test("4. architectural role", () => {
  assert.equal(
    binding.role,
    "ExecutiveExperienceDirectorRuntimeInteractionBinding",
  );
  assert.equal(canonicalIdentity.role, binding.role);
});

test("5. sole immediate dependency is EX-DRI-3", () => {
  assert.equal(
    binding.upstreamDependency,
    "EX-DRI-3/ExecutiveExperienceDirectorRuntimeContextStateBinding",
  );
  assert.equal(
    binding.upstreamDependency,
    executiveExperienceDirectorRuntimeContextStateBindingIdentity,
  );
  assert.equal(
    binding.dependencyPath,
    "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeContextStateBinding",
  );
  assert.equal(
    binding.contextStateBindingBoundary,
    "EX-DRI-3-context-state-binding-only",
  );

  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(imports, [
    "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeContextStateBinding",
  ]);
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/(?:dri|ex-dri\/executiveExperienceDirectorRuntimeIntegration(?:Foundation|Contracts))[^"']*["']/,
  );
});

test("6. select Factory binds to canonical EX → DRI request", () => {
  const input = baseInput({
    interactionId: "ix.select.factory",
    kind: "select",
    surface: "stage",
    subject: factory,
    correlation: { correlationId: "C-1", sequence: 1 },
  });

  const first = bindExecutiveInteractionToDirectorRuntimeRequest(input);
  const second = bindExecutiveInteractionToDirectorRuntimeRequest(input);

  assert.equal(first.status, "bound");
  assert.ok(first.request);
  assert.equal(first.request.direction, "ex-to-dri");
  assert.equal(first.request.kind, "context-interaction");
  assert.equal(first.request.context.surface, "stage");
  assert.equal(first.request.context.mode, "scenario");
  assert.equal(first.request.context.activeGoalId, "G1");
  assert.equal(first.request.interaction?.kind, "select");
  assert.equal(first.request.interaction?.subject?.id, "factory-1");
  assert.equal(first.request.correlation.correlationId, "C-1");
  assert.equal(first.request.correlation.sequence, 1);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(Object.isFrozen(first.request), true);
  assert.equal(isExecutiveInteractionBindingResult(first), true);
  assert.deepEqual(first.status, second.status);
  assert.equal(first.request.interaction?.kind, second.request?.interaction?.kind);
  assert.doesNotMatch(
    JSON.stringify(first.request),
    /centerFactory|dimOthers|setPresentation|openAdvisor|animate|camera/,
  );
});

test("7. focus remains distinct from select", () => {
  const result = bindExecutiveInteractionToDirectorRuntimeRequest(
    baseInput({
      interactionId: "ix.focus.kpi",
      kind: "focus",
      subject: throughputKpi,
      context: createExecutiveDirectorRuntimeContextContract({
        surface: "stage",
        mode: "execution",
        focusedSubject: throughputKpi,
      }),
    }),
  );
  assert.equal(result.status, "bound");
  assert.equal(result.request?.interaction?.kind, "focus");
  assert.notEqual(result.request?.interaction?.kind, "select");
  assert.equal(result.request?.interaction?.subject?.id, "kpi-throughput");
});

test("8. activate Scenario A binds without executing scenario logic", () => {
  const result = bindExecutiveInteractionToDirectorRuntimeRequest(
    baseInput({
      interactionId: "ix.activate.scenario",
      kind: "activate",
      subject: scenarioA,
    }),
  );
  assert.equal(result.status, "bound");
  assert.equal(result.request?.interaction?.kind, "activate");
  assert.equal(result.request?.interaction?.subject?.id, "scenario-a");
  assert.doesNotMatch(JSON.stringify(result.request), /switchScenario|runSimulation/);
});

test("9. open and close bind as semantic interactions", () => {
  const open = bindExecutiveInteractionToDirectorRuntimeRequest(
    baseInput({
      interactionId: "ix.open.pack",
      kind: "open",
      subject: { id: "pack-a", kind: "pack", label: "Scenario Pack" },
    }),
  );
  const close = bindExecutiveInteractionToDirectorRuntimeRequest(
    baseInput({
      interactionId: "ix.close.insight",
      kind: "close",
      subject: undefined,
      context: createExecutiveDirectorRuntimeContextContract({
        surface: "stage",
      }),
    }),
  );
  assert.equal(open.status, "bound");
  assert.equal(open.request?.interaction?.kind, "open");
  assert.equal(close.status, "bound");
  assert.equal(close.request?.interaction?.kind, "close");
});

test("10. expand and collapse remain distinct", () => {
  const expand = bindExecutiveInteractionToDirectorRuntimeRequest(
    baseInput({
      interactionId: "ix.expand.factory",
      kind: "expand",
      subject: factory,
    }),
  );
  const collapse = bindExecutiveInteractionToDirectorRuntimeRequest(
    baseInput({
      interactionId: "ix.collapse.decision",
      kind: "collapse",
      subject: { id: "decision-1", kind: "decision", label: "Decision Pack" },
    }),
  );
  assert.equal(expand.status, "bound");
  assert.equal(collapse.status, "bound");
  assert.equal(expand.request?.interaction?.kind, "expand");
  assert.equal(collapse.request?.interaction?.kind, "collapse");
  assert.doesNotMatch(
    JSON.stringify(expand.request),
    /geometry|scale|CSS|panelLayout/,
  );
});

test("11. dismiss binds without deleting source information", () => {
  const guidance = Object.freeze({
    id: "G-12",
    kind: "intent" as const,
    label: "Guidance G-12",
  });
  const result = bindExecutiveInteractionToDirectorRuntimeRequest(
    baseInput({
      interactionId: "ix.dismiss.guidance",
      kind: "dismiss",
      subject: guidance,
      context: createExecutiveDirectorRuntimeContextContract({
        surface: "advisor",
        mode: "execution",
      }),
      surface: "advisor",
    }),
  );
  assert.equal(result.status, "bound");
  assert.equal(result.request?.interaction?.kind, "dismiss");
  assert.equal(result.request?.interaction?.subject?.id, "G-12");
  assert.equal(guidance.id, "G-12");
});

test("12. missing required subject rejects", () => {
  for (const kind of [
    "select",
    "focus",
    "activate",
    "expand",
    "collapse",
  ] as const) {
    const result = bindExecutiveInteractionToDirectorRuntimeRequest(
      baseInput({
        interactionId: `ix.${kind}.missing`,
        kind,
        subject: undefined,
      }),
    );
    assert.equal(result.status, "rejected", kind);
    assert.ok(
      result.issues.some((entry) => entry.code === "SUBJECT_REQUIRED"),
      kind,
    );
    assert.equal(result.request, undefined);
  }
});

test("13. context surface mismatch rejects", () => {
  const result = bindExecutiveInteractionToDirectorRuntimeRequest(
    baseInput({
      surface: "stage",
      context: createExecutiveDirectorRuntimeContextContract({
        surface: "advisor",
        mode: "scenario",
      }),
    }),
  );
  assert.equal(result.status, "rejected");
  assert.ok(
    result.issues.some((entry) => entry.code === "CONTEXT_SURFACE_MISMATCH"),
  );
});

test("14. correlation is preserved; invalid correlation rejected; no IDs generated", () => {
  const result = bindExecutiveInteractionToDirectorRuntimeRequest(
    baseInput({
      correlation: {
        correlationId: "C100",
        sequence: 3,
        parentCorrelationId: "C99",
      },
    }),
  );
  assert.equal(result.status, "bound");
  assert.equal(result.request?.correlation.correlationId, "C100");
  assert.equal(result.request?.correlation.sequence, 3);
  assert.equal(result.request?.correlation.parentCorrelationId, "C99");

  const invalid = bindExecutiveInteractionToDirectorRuntimeRequest(
    baseInput({
      correlation: {
        correlationId: "same",
        parentCorrelationId: "same",
      },
    }),
  );
  assert.equal(invalid.status, "rejected");
  assert.ok(
    invalid.issues.some((entry) => entry.code === "INVALID_CORRELATION"),
  );

  assert.doesNotMatch(source, /\b(?:crypto\.randomUUID|uuidv4|Date\.now|Math\.random)\b/);
});

test("15. batch binding preserves order and detects duplicate IDs", () => {
  const batch = bindExecutiveInteractionsToDirectorRuntimeRequests([
    baseInput({
      interactionId: "ix.1",
      kind: "select",
      subject: factory,
    }),
    baseInput({
      interactionId: "ix.2",
      kind: "focus",
      subject: throughputKpi,
    }),
    baseInput({
      interactionId: "ix.3",
      kind: "open",
      subject: scenarioA,
    }),
  ]);

  assert.equal(batch.boundCount, 3);
  assert.equal(batch.rejectedCount, 0);
  assert.equal(batch.noopCount, 0);
  assert.deepEqual(
    batch.results.map((entry) => entry.request?.interaction?.kind),
    ["select", "focus", "open"],
  );
  assert.deepEqual(
    batch.results.map((entry) => entry.request?.interaction?.interactionId),
    ["ix.1", "ix.2", "ix.3"],
  );

  const duplicates = bindExecutiveInteractionsToDirectorRuntimeRequests([
    baseInput({ interactionId: "dup" }),
    baseInput({ interactionId: "dup", kind: "focus", subject: throughputKpi }),
  ]);
  assert.equal(duplicates.results[0]!.status, "bound");
  assert.equal(duplicates.results[1]!.status, "rejected");
  assert.ok(
    duplicates.results[1]!.issues.some(
      (entry) => entry.code === "DUPLICATE_INTERACTION_ID",
    ),
  );
  assert.equal(duplicates.rejectedCount, 1);
  assert.equal(duplicates.boundCount, 1);
});

test("16. immutability of inputs and outputs", () => {
  const input = baseInput();
  const snap = JSON.stringify(input);
  const normalized = normalizeExecutiveInteractionBindingInput(input);
  const result = bindExecutiveInteractionToDirectorRuntimeRequest(input);
  assert.equal(JSON.stringify(input), snap);
  assert.equal(Object.isFrozen(normalized), true);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(binding), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(policies), true);
  assert.throws(() => {
    (interactionKinds as unknown as string[]).push("click");
  });
  assert.throws(() => {
    (binding as { version?: string }).version = "0.0.0";
  });
});

test("17. deterministic repeated binding", () => {
  const input = baseInput();
  const a = bindExecutiveInteractionToDirectorRuntimeRequest(input);
  const b = bindExecutiveInteractionToDirectorRuntimeRequest(input);
  assert.equal(a.status, b.status);
  assert.equal(a.request?.direction, b.request?.direction);
  assert.equal(a.request?.kind, b.request?.kind);
  assert.equal(
    a.request?.interaction?.interactionId,
    b.request?.interaction?.interactionId,
  );
  assert.equal(
    a.request?.correlation.correlationId,
    b.request?.correlation.correlationId,
  );
  assert.ok(
    a.request?.interaction &&
      b.request?.interaction &&
      areExecutiveInteractionsEqual(
        a.request.interaction,
        b.request.interaction,
      ),
  );
});

test("18. framework / UI / DRI isolation", () => {
  assert.doesNotMatch(
    source,
    /from\s+["'](?:react|react-dom|next(?:\/[^"']*)?|three|zustand|redux|@reduxjs\/[^"']*)["']/i,
  );
  assert.doesNotMatch(source, /from\s+["']@\/app\/lib\/dri\/[^"']+["']/);
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/(?:components|executive|screens)(?:\/[^"']*)?["']/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:window|document|HTMLElement|MouseEvent|PointerEvent|React\.MouseEvent|localStorage|fetch)\b/,
  );
});

test("19. policies, catalogs, and verification", () => {
  assert.deepEqual([...interactionKinds], [
    "select",
    "focus",
    "activate",
    "open",
    "close",
    "expand",
    "collapse",
    "dismiss",
    "hover",
    "navigate",
    "inspect",
  ]);
  assert.equal(policies.length, interactionKinds.length);
  assert.equal(getExecutiveInteractionPolicy("select")?.requiresSubject, true);
  assert.equal(getExecutiveInteractionPolicy("dismiss")?.requiresSubject, false);
  assert.deepEqual([...statuses], ["bound", "rejected", "noop"]);
  assert.equal(issueCodes.length, 11);
  assert.equal(guarantees.length, 22);
  assert.equal(requestDirection, "ex-to-dri");
  assert.equal(requestKind, "context-interaction");
  assert.deepEqual([...registrySections], [
    "Identity",
    "InteractionKinds",
    "InteractionPolicies",
    "Binding",
    "BatchBinding",
    "Validation",
    "IssueCodes",
    "Guarantees",
    "Compatibility",
  ]);

  assert.equal(canBindExecutiveInteraction(baseInput()), true);
  assert.equal(isExecutiveInteractionBindingInput(baseInput()), true);
  assert.equal(
    isExecutiveInteractionBindingInput({
      ...baseInput(),
      kind: "click",
    }),
    false,
  );

  const first =
    verifyExecutiveExperienceDirectorRuntimeInteractionBinding();
  const second =
    verifyExecutiveExperienceDirectorRuntimeInteractionBinding();
  assert.equal(first.ok, true);
  assert.deepEqual(first, second);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(first.interactionKindCount, 11);
  assert.equal(first.policyCount, 11);
  assert.equal(first.guaranteeCount, 22);
  assert.equal(first.publicApiCount, apiNames.length);
  assert.equal(first.publicTypeCount, publicTypeNames.length);
  assert.equal(first.validatorCount, validators.length);
  assert.equal(first.requestDirectionValid, true);
  assert.equal(first.subjectRequirementConsistent, true);
  assert.equal(first.surfaceCompatibilityConsistent, true);
  assert.equal(
    binding.architecturalStatus,
    "InteractionBinding Complete · Deterministic · Stateless · Immutable · Framework-Independent · ReadyForExDriScenePresentationBinding",
  );
});

test("20. EX-DRI-3 context flows into EX-DRI-4 request", () => {
  const boundContext = bindExecutiveExperienceStateToDirectorRuntimeContext({
    surface: "stage",
    mode: "scenario",
    selectedSubject: factory,
    activeGoalId: "Increase Capacity",
    activePackId: "Scenario A",
  });
  assert.equal(boundContext.valid, true);

  const requestResult = bindExecutiveInteractionToDirectorRuntimeRequest({
    interactionId: "ix.select.factory.flow",
    kind: "select",
    surface: "stage",
    subject: factory,
    context: boundContext.context!,
    correlation: { correlationId: "C100" },
  });

  assert.equal(requestResult.status, "bound");
  assert.equal(requestResult.request?.direction, "ex-to-dri");
  assert.equal(requestResult.request?.context.activeGoalId, "Increase Capacity");
  assert.equal(requestResult.request?.interaction?.kind, "select");
  assert.equal(requestResult.request?.correlation.correlationId, "C100");
});

test("21. EX-DRI-1 / EX-DRI-2 / EX-DRI-3 regressions remain green", () => {
  assert.equal(
    verifyExecutiveExperienceDirectorRuntimeIntegrationFoundation().ok,
    true,
  );
  assert.equal(
    verifyExecutiveExperienceDirectorRuntimeIntegrationContracts().ok,
    true,
  );
  assert.equal(
    verifyExecutiveExperienceDirectorRuntimeContextStateBinding().ok,
    true,
  );
});

test("22. DRI consumer integration public index remains intact", () => {
  const publicIndex = verifyDirectorRuntimeConsumerIntegrationPublicIndex();
  assert.equal(publicIndex.ok, true);
  assert.equal(
    directorRuntimeConsumerIntegrationPublicIndexIdentity,
    "DRI-8:9/DirectorRuntimeConsumerIntegrationPublicIndex",
  );
});

test("23. metadata policies are deterministic / stateless / immutable", () => {
  assert.equal(canonicalIdentity.deterministicStatus, true);
  assert.equal(canonicalIdentity.statelessStatus, true);
  assert.equal(canonicalIdentity.mutationPolicy, "immutable");
  assert.equal(canonicalIdentity.sideEffectPolicy, "side-effect-free");
  assert.equal(binding.deterministic, true);
  assert.equal(binding.stateless, true);
  assert.equal(binding.immutable, true);
  assert.equal(binding.sideEffectFree, true);
  assert.equal(binding.frameworkIndependent, true);
});
