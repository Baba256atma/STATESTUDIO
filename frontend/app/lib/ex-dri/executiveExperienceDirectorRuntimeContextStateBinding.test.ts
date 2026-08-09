import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_CONTEXT_BINDING_PRESENTATION_STATES as presentationStates,
  EXECUTIVE_CONTEXT_BINDING_SURFACES as surfaces,
  EXECUTIVE_CONTEXT_CHANGE_KINDS as changeKinds,
  EXECUTIVE_CONTEXT_PRECEDENCE_RULES as precedenceRules,
  EXECUTIVE_CONTEXT_STATE_BINDING_GUARANTEES as guarantees,
  EXECUTIVE_CONTEXT_STATE_BINDING_ISSUE_CODES as issueCodes,
  EXECUTIVE_CONTEXT_STATE_BINDING_PUBLIC_TYPE_NAMES as publicTypeNames,
  EXECUTIVE_CONTEXT_STATE_BINDING_REGISTRY_SECTIONS as registrySections,
  EXECUTIVE_STATE_PROJECTION_KINDS as projectionKinds,
  EXECUTIVE_STATE_PROJECTION_STATUSES as projectionStatuses,
  areExecutiveDirectorRuntimeContextsEqual,
  bindExecutiveExperienceCompositeState,
  bindExecutiveExperienceStateToDirectorRuntimeContext,
  bindFocusedExecutiveSubject,
  bindSelectedExecutiveSubject,
  diffExecutiveDirectorRuntimeContext,
  executiveExperienceDirectorRuntimeContextStateBinding as binding,
  executiveExperienceDirectorRuntimeContextStateBindingApiNames as apiNames,
  executiveExperienceDirectorRuntimeContextStateBindingCanonicalIdentity as canonicalIdentity,
  executiveExperienceDirectorRuntimeContextStateBindingRegistry as registry,
  executiveExperienceDirectorRuntimeContextStateBindingValidatorNames as validators,
  getExecutiveExperienceDirectorRuntimeContextStateBindingIdentity,
  isExecutiveContextStateBindingResult,
  isExecutiveExperienceCompositeStateSnapshot,
  isExecutiveExperienceStateSnapshot,
  isExecutiveExperienceSurfaceState,
  normalizeExecutiveExperienceCompositeState,
  normalizeExecutiveExperienceState,
  projectDirectorRuntimeDirectionToExecutiveState,
  projectDirectorRuntimeDirectionsToExecutiveState,
  verifyExecutiveExperienceDirectorRuntimeContextStateBinding,
} from "./executiveExperienceDirectorRuntimeContextStateBinding.ts";

import {
  createExecutiveDirectorRuntimeContextContract,
  executiveExperienceDirectorRuntimeIntegrationContractsIdentity,
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
    "./executiveExperienceDirectorRuntimeContextStateBinding.ts",
    import.meta.url,
  ),
  "utf8",
);

const factory = Object.freeze({
  id: "factory-1",
  kind: "object" as const,
  label: "Factory",
});

const throughputKpi = Object.freeze({
  id: "kpi-throughput",
  kind: "kpi" as const,
  label: "Throughput KPI",
});

test("1. exact EX-DRI-3 identity", () => {
  assert.equal(
    binding.identity,
    "EX-DRI-3/ExecutiveExperienceDirectorRuntimeContextStateBinding",
  );
  assert.equal(canonicalIdentity.identity, binding.identity);
  assert.equal(binding.phase, "EX-DRI-3");
  assert.equal(
    binding.name,
    "ExecutiveExperienceDirectorRuntimeContextStateBinding",
  );
  assert.equal(
    binding.role,
    "ExecutiveExperienceDirectorRuntimeContextStateBinding",
  );
  assert.equal(binding.status, "ContextStateBindingReady");
  assert.deepEqual(
    getExecutiveExperienceDirectorRuntimeContextStateBindingIdentity(),
    canonicalIdentity,
  );
});

test("2. exact version 1.3.0", () => {
  assert.equal(binding.version, "1.3.0");
  assert.equal(canonicalIdentity.version, "1.3.0");
  assert.equal(registry.version, "1.3.0");
});

test("3. exact namespace", () => {
  assert.equal(
    binding.namespace,
    "nexora.ex.dri.integration.context-state-binding",
  );
  assert.equal(canonicalIdentity.namespace, binding.namespace);
});

test("4. architectural role", () => {
  assert.equal(
    binding.role,
    "ExecutiveExperienceDirectorRuntimeContextStateBinding",
  );
  assert.equal(canonicalIdentity.role, binding.role);
});

test("5. sole immediate dependency is EX-DRI-2 contracts", () => {
  assert.equal(
    binding.upstreamDependency,
    "EX-DRI-2/ExecutiveExperienceDirectorRuntimeIntegrationContracts",
  );
  assert.equal(
    binding.upstreamDependency,
    executiveExperienceDirectorRuntimeIntegrationContractsIdentity,
  );
  assert.equal(
    binding.dependencyPath,
    "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeIntegrationContracts",
  );
  assert.equal(binding.contractsBoundary, "EX-DRI-2-contracts-only");

  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(imports, [
    "@/app/lib/ex-dri/executiveExperienceDirectorRuntimeIntegrationContracts",
  ]);
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/(?:dri|ex-dri\/executiveExperienceDirectorRuntimeIntegrationFoundation)[^"']*["']/,
  );
});

test("6. state snapshots valid for all canonical surfaces", () => {
  assert.deepEqual([...surfaces], [
    "stage",
    "advisor",
    "insight",
    "live-lens",
    "timeline",
    "explorer",
  ]);
  for (const surface of surfaces) {
    const snapshot = normalizeExecutiveExperienceState({
      surface,
      selectedSubject: factory,
    });
    assert.equal(isExecutiveExperienceStateSnapshot(snapshot), true);
    assert.equal(Object.isFrozen(snapshot), true);
    assert.equal(snapshot.surface, surface);
  }
  assert.equal(
    isExecutiveExperienceStateSnapshot({ surface: "dashboard" }),
    false,
  );
  assert.equal(
    isExecutiveExperienceSurfaceState({
      surface: "stage",
      selectedSubject: factory,
    }),
    true,
  );
});

test("7. context binding is deterministic for stage scenario Factory", () => {
  const snapshot = {
    surface: "stage" as const,
    mode: "scenario" as const,
    selectedSubject: factory,
    activeGoalId: "G1",
    activePackId: "S-A",
    activeModelId: "M1",
    presentationState: "report" as const,
  };

  const first = bindExecutiveExperienceStateToDirectorRuntimeContext(snapshot);
  const second = bindExecutiveExperienceStateToDirectorRuntimeContext(snapshot);

  assert.equal(first.valid, true);
  assert.ok(first.context);
  assert.equal(first.context.surface, "stage");
  assert.equal(first.context.mode, "scenario");
  assert.equal(first.context.selectedSubject?.id, "factory-1");
  assert.equal(first.context.activeGoalId, "G1");
  assert.equal(first.context.activePackId, "S-A");
  assert.equal(first.context.activeModelId, "M1");
  assert.equal(first.context.presentationState, "report");
  assert.equal(
    areExecutiveDirectorRuntimeContextsEqual(first.context, second.context!),
    true,
  );
  assert.equal(isExecutiveContextStateBindingResult(first), true);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(Object.isFrozen(first.context), true);
});

test("8. multi-surface binding keeps surface contexts distinct with shared context", () => {
  const composite = {
    activeSurface: "stage" as const,
    mode: "scenario" as const,
    activeGoalId: "Increase Capacity",
    activePackId: "Scenario A",
    activeModelId: "M1",
    surfaces: [
      {
        surface: "insight" as const,
        focusedSubject: throughputKpi,
      },
      {
        surface: "stage" as const,
        selectedSubject: factory,
        presentationState: "minimum" as const,
      },
      {
        surface: "advisor" as const,
        focusedSubject: factory,
      },
      {
        surface: "timeline" as const,
        selectedSubject: {
          id: "pack-a",
          kind: "pack" as const,
          label: "Pack A",
        },
      },
    ],
  };

  const result = bindExecutiveExperienceCompositeState(composite);
  assert.equal(result.valid, true);
  assert.ok(result.activeContext);
  assert.equal(result.activeContext.surface, "stage");
  assert.equal(result.activeContext.selectedSubject?.id, "factory-1");
  assert.equal(result.activeContext.activeGoalId, "Increase Capacity");
  assert.equal(result.activeContext.activePackId, "Scenario A");
  assert.equal(result.surfaceContexts.length, 4);

  // Canonical surface ordering after normalization
  assert.deepEqual(
    result.surfaceContexts.map((context) => context.surface),
    ["stage", "advisor", "insight", "timeline"],
  );

  const stage = result.surfaceContexts.find((c) => c.surface === "stage")!;
  const advisor = result.surfaceContexts.find((c) => c.surface === "advisor")!;
  const insight = result.surfaceContexts.find((c) => c.surface === "insight")!;
  const timeline = result.surfaceContexts.find((c) => c.surface === "timeline")!;

  assert.equal(stage.selectedSubject?.id, "factory-1");
  assert.equal(advisor.focusedSubject?.id, "factory-1");
  assert.equal(insight.focusedSubject?.id, "kpi-throughput");
  assert.equal(timeline.selectedSubject?.id, "pack-a");

  for (const context of result.surfaceContexts) {
    assert.equal(context.mode, "scenario");
    assert.equal(context.activeGoalId, "Increase Capacity");
    assert.equal(context.activePackId, "Scenario A");
    assert.equal(context.activeModelId, "M1");
  }

  assert.equal(
    isExecutiveExperienceCompositeStateSnapshot(
      normalizeExecutiveExperienceCompositeState(composite),
    ),
    true,
  );
});

test("9. selection and focus remain separated", () => {
  const result = bindExecutiveExperienceStateToDirectorRuntimeContext({
    surface: "stage",
    selectedSubject: factory,
    focusedSubject: throughputKpi,
  });
  assert.equal(result.valid, true);
  assert.equal(result.context?.selectedSubject?.id, "factory-1");
  assert.equal(result.context?.focusedSubject?.id, "kpi-throughput");
  assert.notEqual(
    result.context?.selectedSubject?.id,
    result.context?.focusedSubject?.id,
  );

  const selected = bindSelectedExecutiveSubject(factory);
  const focused = bindFocusedExecutiveSubject(throughputKpi);
  assert.equal(selected?.id, "factory-1");
  assert.equal(focused?.id, "kpi-throughput");
});

test("10. exact presentation states only", () => {
  assert.deepEqual([...presentationStates], [
    "minimum",
    "report",
    "operation",
  ]);
  for (const state of presentationStates) {
    const result = bindExecutiveExperienceStateToDirectorRuntimeContext({
      surface: "stage",
      presentationState: state,
    });
    assert.equal(result.valid, true);
    assert.equal(result.context?.presentationState, state);
  }
  assert.equal(
    bindExecutiveExperienceStateToDirectorRuntimeContext({
      surface: "stage",
      presentationState: "expanded" as never,
    }).valid,
    false,
  );
});

test("11. context diff detects all change kinds with canonical ordering", () => {
  const previous = createExecutiveDirectorRuntimeContextContract({
    surface: "stage",
    mode: "problem",
    selectedSubject: factory,
    focusedSubject: factory,
    activeGoalId: "G1",
    activePackId: "P1",
    activeModelId: "M1",
    presentationState: "minimum",
  });
  const next = createExecutiveDirectorRuntimeContextContract({
    surface: "advisor",
    mode: "scenario",
    selectedSubject: throughputKpi,
    focusedSubject: throughputKpi,
    activeGoalId: "G2",
    activePackId: "P2",
    activeModelId: "M2",
    presentationState: "report",
  });

  const diff = diffExecutiveDirectorRuntimeContext(previous, next);
  assert.equal(diff.changed, true);
  assert.deepEqual([...diff.changes], [...changeKinds]);
  assert.equal(Object.isFrozen(diff), true);
  assert.equal(Object.isFrozen(diff.changes), true);

  const noop = diffExecutiveDirectorRuntimeContext(previous, previous);
  assert.equal(noop.changed, false);
  assert.deepEqual([...noop.changes], []);

  const partial = diffExecutiveDirectorRuntimeContext(previous, {
    ...previous,
    mode: "decision",
    activeGoalId: "G9",
  });
  assert.deepEqual([...partial.changes], ["mode", "goal"]);
});

test("12. semantic equality ignores object identity", () => {
  const left = createExecutiveDirectorRuntimeContextContract({
    surface: "stage",
    mode: "execution",
    selectedSubject: { id: "factory-1", kind: "object", label: "Factory" },
    activeGoalId: "G1",
  });
  const right = createExecutiveDirectorRuntimeContextContract({
    surface: "stage",
    mode: "execution",
    selectedSubject: { id: "factory-1", kind: "object", label: "Factory" },
    activeGoalId: "G1",
  });
  assert.notEqual(left, right);
  assert.equal(areExecutiveDirectorRuntimeContextsEqual(left, right), true);
  assert.equal(
    areExecutiveDirectorRuntimeContextsEqual(left, {
      ...right,
      activeGoalId: "G2",
    }),
    false,
  );
});

test("13. projections for focus / presentation / coordination", () => {
  const directions = [
    {
      kind: "focus" as const,
      surface: "stage" as const,
      subject: factory,
      role: "focused" as const,
    },
    {
      kind: "presentation" as const,
      surface: "stage" as const,
      subject: factory,
      state: "report" as const,
    },
    {
      kind: "coordination" as const,
      sourceSurface: "stage" as const,
      targetSurfaces: ["advisor" as const, "insight" as const],
      subject: factory,
    },
  ];

  const projected = projectDirectorRuntimeDirectionsToExecutiveState(directions);
  assert.equal(projected.projections.length, 3);
  assert.equal(projected.results.every((r) => r.status === "applied-to-projection"), true);

  const focus = projected.projections.find((p) => p.kind === "focus");
  const presentation = projected.projections.find((p) => p.kind === "presentation");
  const coordination = projected.projections.find(
    (p) => p.kind === "surface-coordination",
  );

  assert.equal(focus?.surface, "stage");
  assert.equal(focus && "subject" in focus ? focus.subject?.id : undefined, "factory-1");
  assert.equal(presentation && "state" in presentation ? presentation.state : undefined, "report");
  assert.deepEqual(
    coordination && "targetSurfaces" in coordination
      ? [...coordination.targetSurfaces]
      : [],
    ["advisor", "insight"],
  );

  assert.equal(Object.isFrozen(projected), true);
  assert.equal(Object.isFrozen(projected.projections), true);

  // Source direction objects remain caller-owned; projection did not mutate them.
  assert.equal(directions[0]!.subject?.id, "factory-1");
});

test("14. deferred directions are explicit", () => {
  for (const kind of ["scene", "attention", "guidance", "interaction"] as const) {
    const result = projectDirectorRuntimeDirectionToExecutiveState(
      kind === "scene"
        ? {
            kind: "scene",
            surface: "stage",
            relatedSubjects: [],
          }
        : kind === "attention"
          ? {
              kind: "attention",
              surface: "stage",
              subject: factory,
              level: "primary",
            }
          : kind === "guidance"
            ? {
                kind: "guidance",
                surface: "advisor",
                messageKey: "hint",
              }
            : {
                kind: "interaction",
                surface: "stage",
                interaction: "select",
              },
    );
    assert.equal(result.status, "deferred");
    assert.equal(result.directionKind, kind);
    assert.equal(result.projection, undefined);
  }
});

test("15. invalid binding returns issues without throwing", () => {
  const invalid = bindExecutiveExperienceStateToDirectorRuntimeContext({
    surface: "dashboard" as never,
  });
  assert.equal(invalid.valid, false);
  assert.equal(invalid.context, undefined);
  assert.ok(invalid.issues.some((entry) => entry.code === "INVALID_SURFACE"));

  const missingActive = bindExecutiveExperienceCompositeState({
    activeSurface: "stage",
    surfaces: [{ surface: "advisor" }],
  });
  assert.equal(missingActive.valid, false);
  assert.ok(
    missingActive.issues.some((entry) => entry.code === "MISSING_ACTIVE_SURFACE"),
  );

  const duplicate = bindExecutiveExperienceCompositeState({
    activeSurface: "stage",
    surfaces: [
      { surface: "stage" },
      { surface: "stage" },
    ],
  });
  assert.equal(duplicate.valid, false);
  assert.ok(duplicate.issues.some((entry) => entry.code === "DUPLICATE_SURFACE"));
});

test("16. immutability of registries and outputs", () => {
  assert.equal(Object.isFrozen(binding), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(canonicalIdentity), true);
  assert.equal(Object.isFrozen(surfaces), true);
  assert.equal(Object.isFrozen(changeKinds), true);
  assert.equal(Object.isFrozen(projectionKinds), true);
  assert.equal(Object.isFrozen(projectionStatuses), true);
  assert.equal(Object.isFrozen(guarantees), true);
  assert.equal(Object.isFrozen(precedenceRules), true);
  assert.throws(() => {
    (surfaces as unknown as string[]).push("dashboard");
  });
  assert.throws(() => {
    (binding as { version?: string }).version = "0.0.0";
  });

  const snapshot = { surface: "stage" as const, selectedSubject: factory };
  const snap = JSON.stringify(snapshot);
  normalizeExecutiveExperienceState(snapshot);
  bindExecutiveExperienceStateToDirectorRuntimeContext(snapshot);
  assert.equal(JSON.stringify(snapshot), snap);
});

test("17. framework / UI / DRI isolation", () => {
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
    /\b(?:window|document|HTMLElement|localStorage|sessionStorage|fetch)\b/,
  );
  assert.doesNotMatch(source, /\bDate\.now\(|Math\.random\(|setTimeout\(/);
});

test("18. catalogs and verification", () => {
  assert.equal(changeKinds.length, 8);
  assert.equal(projectionKinds.length, 4);
  assert.deepEqual([...projectionStatuses], [
    "applied-to-projection",
    "deferred",
    "unsupported",
  ]);
  assert.equal(issueCodes.length, 8);
  assert.equal(guarantees.length, 22);
  assert.equal(precedenceRules.length, 4);
  assert.equal(validators.length, 7);
  assert.deepEqual([...registrySections], [
    "Identity",
    "StateSnapshots",
    "SurfaceState",
    "Bindings",
    "Diffing",
    "Projection",
    "Validation",
    "Guarantees",
  ]);

  const first =
    verifyExecutiveExperienceDirectorRuntimeContextStateBinding();
  const second =
    verifyExecutiveExperienceDirectorRuntimeContextStateBinding();
  assert.equal(first.ok, true);
  assert.deepEqual(first, second);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(first.surfaceCount, 6);
  assert.equal(first.changeKindCount, 8);
  assert.equal(first.projectionKindCount, 4);
  assert.equal(first.guaranteeCount, 22);
  assert.equal(first.publicApiCount, apiNames.length);
  assert.equal(first.publicTypeCount, publicTypeNames.length);
  assert.equal(first.contractsBoundaryIntact, true);
  assert.equal(first.frameworkIndependent, true);
  assert.equal(first.precedenceExplicit, true);
  assert.equal(
    binding.architecturalStatus,
    "ContextStateBinding Complete · Deterministic · Stateless · Immutable · Framework-Independent · ReadyForExDriInteractionBinding",
  );
});

test("19. example end-to-end semantic binding cycle", () => {
  const exState = {
    surface: "stage" as const,
    mode: "scenario" as const,
    selectedSubject: factory,
    activeGoalId: "Increase Capacity",
    activePackId: "Scenario A",
  };
  const bound = bindExecutiveExperienceStateToDirectorRuntimeContext(exState);
  assert.equal(bound.valid, true);
  assert.equal(bound.context?.surface, "stage");
  assert.equal(bound.context?.mode, "scenario");
  assert.equal(bound.context?.selectedSubject?.label, "Factory");
  assert.equal(bound.context?.activeGoalId, "Increase Capacity");
  assert.equal(bound.context?.activePackId, "Scenario A");

  const reverse = projectDirectorRuntimeDirectionsToExecutiveState([
    {
      kind: "focus",
      surface: "stage",
      subject: factory,
      role: "focused",
    },
    {
      kind: "presentation",
      surface: "stage",
      subject: factory,
      state: "report",
    },
    {
      kind: "coordination",
      sourceSurface: "stage",
      targetSurfaces: ["advisor", "insight"],
      subject: factory,
    },
  ]);
  assert.equal(reverse.projections.length, 3);
  assert.equal(exState.surface, "stage");
  assert.equal(exState.selectedSubject.id, "factory-1");
});

test("20. EX-DRI-1 and EX-DRI-2 regressions remain green", () => {
  const foundation =
    verifyExecutiveExperienceDirectorRuntimeIntegrationFoundation();
  assert.equal(foundation.ok, true);
  const contracts =
    verifyExecutiveExperienceDirectorRuntimeIntegrationContracts();
  assert.equal(contracts.ok, true);
  assert.equal(
    executiveExperienceDirectorRuntimeIntegrationContractsIdentity,
    "EX-DRI-2/ExecutiveExperienceDirectorRuntimeIntegrationContracts",
  );
});

test("21. DRI consumer integration public index remains intact", () => {
  const publicIndex = verifyDirectorRuntimeConsumerIntegrationPublicIndex();
  assert.equal(publicIndex.ok, true);
  assert.equal(
    directorRuntimeConsumerIntegrationPublicIndexIdentity,
    "DRI-8:9/DirectorRuntimeConsumerIntegrationPublicIndex",
  );
});

test("22. metadata policies are deterministic / stateless / immutable", () => {
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
