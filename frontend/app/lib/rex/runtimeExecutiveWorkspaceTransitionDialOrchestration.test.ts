import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_EXECUTIVE_WORKSPACE_DIAL_OPTIONS as dialOptions,
  RUNTIME_EXECUTIVE_WORKSPACE_PARTICIPATION_RANK as ranks,
  RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_TRANSITION_KINDS as surfaceKinds,
  RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_GUARANTEES as guarantees,
  RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_ORCHESTRATION_INVARIANTS as invariants,
  RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_PHASES as phases,
  RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_SOURCES as sources,
  RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_STATUSES as statuses,
  canTransitionRuntimeExecutiveWorkspace,
  getRuntimeExecutiveWorkspaceTransitionDialOrchestrationGuarantees,
  getRuntimeExecutiveWorkspaceTransitionDialOrchestrationIdentity,
  getRuntimeExecutiveWorkspaceTransitionDialOrchestrationInvariants,
  getRuntimeExecutiveWorkspaceTransitionDialOrchestrationRegistry,
  normalizeRuntimeExecutiveWorkspaceDialRequest,
  orchestrateRuntimeExecutiveWorkspaceTransition,
  planRuntimeExecutiveWorkspaceTransition,
  resolveRuntimeExecutiveWorkspaceDialOptions,
  resolveRuntimeExecutiveWorkspaceDialSelection,
  resolveRuntimeExecutiveWorkspaceSurfaceTransition,
  runtimeExecutiveWorkspaceTransitionDialOrchestration as orchestration,
  runtimeExecutiveWorkspaceTransitionDialOrchestrationApiNames as apiNames,
  runtimeExecutiveWorkspaceTransitionDialOrchestrationCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveWorkspaceTransitionDialOrchestrationRegistry as registry,
  verifyRuntimeExecutiveWorkspaceTransitionDialOrchestration,
} from "./runtimeExecutiveWorkspaceTransitionDialOrchestration.ts";

import {
  composeRuntimeExecutiveWorkspaceSurfacesFromResolution,
  createRuntimeExecutiveWorkspaceContextContract,
  resolveRuntimeExecutiveWorkspaceContext,
  runtimeExecutiveWorkspaceSurfaceCompositionIdentity,
  runtimeExecutiveWorkspaceSurfaceCompositionSupportedImportPath,
  verifyRuntimeExecutiveWorkspaceSurfaceComposition,
} from "@/app/lib/rex/runtimeExecutiveWorkspaceSurfaceComposition";

const source = readFileSync(
  new URL(
    "./runtimeExecutiveWorkspaceTransitionDialOrchestration.ts",
    import.meta.url,
  ),
  "utf8",
);

function contextFor(
  kind: "overview" | "problem" | "scenario" | "decision" | "execution",
  subjectId?: string,
  presentation: "minimum" | "report" | "operation" = "report",
) {
  const subject =
    kind === "overview"
      ? null
      : {
          kind,
          id:
            subjectId ??
            (kind === "problem"
              ? "supply-risk"
              : kind === "scenario"
                ? "scenario-a"
                : kind === "decision"
                  ? "increase-capacity"
                  : "capacity-expansion"),
        };

  const intent =
    kind === "overview"
      ? ("observe" as const)
      : kind === "problem"
        ? ("investigate" as const)
        : kind === "scenario"
          ? ("explore" as const)
          : kind === "decision"
            ? ("decide" as const)
            : ("execute" as const);

  return createRuntimeExecutiveWorkspaceContextContract({
    workspace: {
      workspaceId: `workspace.alpha.${kind}`,
      workspaceKind: kind,
    },
    subject,
    focus: {
      primarySubject: subject,
      relatedSubjects: [],
    },
    intent: { intent },
    activation: { state: "active" },
    presentation: { state: presentation },
  });
}

function compositionFor(
  kind: "overview" | "problem" | "scenario" | "decision" | "execution",
  subjectId?: string,
  presentation: "minimum" | "report" | "operation" = "report",
) {
  const current = contextFor(kind, subjectId, presentation);
  const resolution = resolveRuntimeExecutiveWorkspaceContext({
    currentContext: current,
    requestedWorkspaceKind: kind,
    requestedSubject: current.subject,
    requestedIntent: current.intent.intent,
    requestedPresentation: presentation,
  });
  return {
    context: resolution.resolvedContext,
    composition: composeRuntimeExecutiveWorkspaceSurfacesFromResolution(
      resolution,
    ),
  };
}

function planTransition(
  from: "overview" | "problem" | "scenario" | "decision" | "execution",
  to: "overview" | "problem" | "scenario" | "decision" | "execution",
  options?: {
    readonly fromSubjectId?: string;
    readonly toSubjectId?: string;
    readonly source?:
      | "user"
      | "dial"
      | "advisor"
      | "action"
      | "runtime"
      | "system";
    readonly fromPresentation?: "minimum" | "report" | "operation";
    readonly toPresentation?: "minimum" | "report" | "operation";
  },
) {
  const current = compositionFor(
    from,
    options?.fromSubjectId,
    options?.fromPresentation,
  );
  const target = compositionFor(
    to,
    options?.toSubjectId,
    options?.toPresentation ?? options?.fromPresentation,
  );
  return planRuntimeExecutiveWorkspaceTransition({
    currentContext: current.context,
    targetContext: target.context,
    currentComposition: current.composition,
    targetComposition: target.composition,
    reason: "user-request",
    source: options?.source ?? "user",
  });
}

function surfaceKind(
  result: ReturnType<typeof planRuntimeExecutiveWorkspaceTransition>,
  surface: "stage" | "advisor" | "insight" | "action",
) {
  return result.surfaces.find((entry) => entry.surface === surface)?.kind;
}

test("1. exact identity / version / namespace / phase / role", () => {
  assert.equal(
    orchestration.identity,
    "REX-6:5/RuntimeExecutiveWorkspaceTransitionDialOrchestration",
  );
  assert.equal(orchestration.version, "6.5.0");
  assert.equal(
    orchestration.namespace,
    "nexora.rex.workspace-experience.transition-dial-orchestration",
  );
  assert.equal(orchestration.phase, "TransitionDialOrchestration");
  assert.equal(
    orchestration.architecturalRole,
    "RuntimeExecutiveWorkspaceTransitionDialOrchestration",
  );
  assert.deepEqual(
    getRuntimeExecutiveWorkspaceTransitionDialOrchestrationIdentity(),
    canonicalIdentity,
  );
});

test("2. sole immediate dependency is REX-6:4 composition", () => {
  assert.equal(
    orchestration.upstreamDependency,
    "REX-6:4/RuntimeExecutiveWorkspaceSurfaceComposition",
  );
  assert.equal(
    orchestration.upstreamDependency,
    runtimeExecutiveWorkspaceSurfaceCompositionIdentity,
  );
  assert.equal(
    orchestration.dependencyPath,
    runtimeExecutiveWorkspaceSurfaceCompositionSupportedImportPath,
  );
  assert.equal(boundary.consumesCompositionOnly, true);
  assert.equal(boundary.importsRex63Directly, false);
  assert.equal(boundary.importsRex62Directly, false);
  assert.equal(boundary.importsRex61Directly, false);

  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveWorkspaceSurfaceComposition",
  ]);

  assert.equal(verifyRuntimeExecutiveWorkspaceSurfaceComposition().ok, true);
});

test("3. transition phases, statuses, and sources", () => {
  assert.deepEqual([...phases], ["prepare", "leave", "enter", "settle"]);
  assert.deepEqual([...statuses], ["planned", "unchanged", "rejected"]);
  assert.deepEqual([...sources], [
    "user",
    "dial",
    "advisor",
    "action",
    "runtime",
    "system",
  ]);
  assert.deepEqual([...surfaceKinds], [
    "preserve",
    "activate",
    "deactivate",
    "promote",
    "demote",
  ]);
  assert.deepEqual(ranks, {
    inactive: 0,
    contextual: 1,
    supporting: 2,
    primary: 3,
  });
});

test("4. surface transition rules", () => {
  assert.equal(
    resolveRuntimeExecutiveWorkspaceSurfaceTransition({
      from: "supporting",
      to: "supporting",
    }),
    "preserve",
  );
  assert.equal(
    resolveRuntimeExecutiveWorkspaceSurfaceTransition({
      from: "inactive",
      to: "contextual",
    }),
    "activate",
  );
  assert.equal(
    resolveRuntimeExecutiveWorkspaceSurfaceTransition({
      from: "inactive",
      to: "supporting",
    }),
    "activate",
  );
  assert.equal(
    resolveRuntimeExecutiveWorkspaceSurfaceTransition({
      from: "supporting",
      to: "inactive",
    }),
    "deactivate",
  );
  assert.equal(
    resolveRuntimeExecutiveWorkspaceSurfaceTransition({
      from: "contextual",
      to: "supporting",
    }),
    "promote",
  );
  assert.equal(
    resolveRuntimeExecutiveWorkspaceSurfaceTransition({
      from: "supporting",
      to: "contextual",
    }),
    "demote",
  );
});

test("5. example A: dial problem → scenario preserves surfaces, workspace changes", () => {
  const result = planTransition("problem", "scenario", { source: "dial" });
  assert.equal(result.status, "planned");
  assert.equal(result.workspaceChanged, true);
  assert.equal(result.source, "dial");
  assert.equal(result.reason, "user-request");
  assert.deepEqual([...result.phases], ["prepare", "leave", "enter", "settle"]);
  assert.equal(surfaceKind(result, "stage"), "preserve");
  assert.equal(surfaceKind(result, "advisor"), "preserve");
  assert.equal(surfaceKind(result, "insight"), "preserve");
  assert.equal(surfaceKind(result, "action"), "preserve");
  assert.ok(result.plan);
});

test("6. example B: scenario → decision promotes Action", () => {
  const result = planTransition("scenario", "decision");
  assert.equal(result.status, "planned");
  assert.equal(surfaceKind(result, "stage"), "preserve");
  assert.equal(surfaceKind(result, "advisor"), "preserve");
  assert.equal(surfaceKind(result, "insight"), "preserve");
  assert.equal(surfaceKind(result, "action"), "promote");
});

test("7. example C: decision → execution demotes Advisor", () => {
  const result = planTransition("decision", "execution");
  assert.equal(surfaceKind(result, "stage"), "preserve");
  assert.equal(surfaceKind(result, "advisor"), "demote");
  assert.equal(surfaceKind(result, "insight"), "preserve");
  assert.equal(surfaceKind(result, "action"), "preserve");
});

test("8. example D: execution → overview promote/demote/deactivate", () => {
  const result = planTransition("execution", "overview");
  assert.equal(surfaceKind(result, "stage"), "preserve");
  assert.equal(surfaceKind(result, "advisor"), "promote");
  assert.equal(surfaceKind(result, "insight"), "demote");
  assert.equal(surfaceKind(result, "action"), "deactivate");
});

test("9. non-linear backward transitions", () => {
  for (const [from, to] of [
    ["decision", "scenario"],
    ["execution", "decision"],
    ["scenario", "problem"],
  ] as const) {
    const result = planTransition(from, to);
    assert.equal(result.status, "planned");
    assert.equal(result.workspaceChanged, true);
    assert.equal(result.sourceWorkspace, from);
    assert.equal(result.targetWorkspace, to);
  }
});

test("10. same-workspace context transition scenario:A → scenario:B", () => {
  const result = planTransition("scenario", "scenario", {
    fromSubjectId: "scenario-a",
    toSubjectId: "scenario-b",
  });
  assert.equal(result.status, "planned");
  assert.equal(result.workspaceChanged, false);
  assert.equal(result.contextChanged, true);
  assert.equal(result.subject.kind, "replace");
  assert.equal(result.subject.from?.id, "scenario-a");
  assert.equal(result.subject.to?.id, "scenario-b");
  assert.ok(result.plan);
  assert.deepEqual([...result.phases], ["prepare", "leave", "enter", "settle"]);
});

test("11. identical context is unchanged", () => {
  const current = compositionFor("decision");
  const result = planRuntimeExecutiveWorkspaceTransition({
    currentContext: current.context,
    targetContext: current.context,
    currentComposition: current.composition,
    targetComposition: current.composition,
    reason: "user-request",
    source: "user",
  });
  assert.equal(result.status, "unchanged");
  assert.equal(result.workspaceChanged, false);
  assert.equal(result.contextChanged, false);
  assert.equal(result.plan, null);
  assert.equal(result.phases.length, 0);
});

test("12. dial normalization and independence", () => {
  const normalized = normalizeRuntimeExecutiveWorkspaceDialRequest({
    requestedWorkspace: "decision",
    requestedSubject: { kind: "decision" as const, id: "increase-capacity" },
    requestedIntent: "decide",
  });
  assert.deepEqual(normalized, {
    requestedWorkspaceKind: "decision",
    source: "dial",
    reason: "user-request",
    requestedSubject: { kind: "decision" as const, id: "increase-capacity" },
    requestedIntent: "decide",
  });
  assert.equal("angle" in normalized, false);
  assert.equal("degrees" in normalized, false);
  assert.equal("radius" in normalized, false);
  assert.equal("rotation" in normalized, false);

  assert.equal(
    resolveRuntimeExecutiveWorkspaceDialSelection({
      currentWorkspace: "decision",
    }),
    "decision",
  );
  const options = resolveRuntimeExecutiveWorkspaceDialOptions({
    currentWorkspace: "decision",
  });
  assert.deepEqual(
    options.map((entry) => entry.workspace),
    [...dialOptions],
  );
  assert.equal(
    options.find((entry) => entry.workspace === "decision")?.availability,
    "current",
  );
  assert.equal(
    options.find((entry) => entry.workspace === "scenario")?.availability,
    "available",
  );

  assert.doesNotMatch(JSON.stringify(normalized), /angle|radius|degrees|mesh/);
});

test("13. device equivalence preserves source metadata", () => {
  const dial = planTransition("overview", "decision", { source: "dial" });
  const user = planTransition("overview", "decision", { source: "user" });
  const advisor = planTransition("overview", "decision", { source: "advisor" });

  assert.equal(dial.targetWorkspace, "decision");
  assert.equal(user.targetWorkspace, "decision");
  assert.equal(advisor.targetWorkspace, "decision");
  assert.equal(dial.source, "dial");
  assert.equal(user.source, "user");
  assert.equal(advisor.source, "advisor");
  assert.deepEqual(
    dial.surfaces.map((entry) => entry.kind),
    user.surfaces.map((entry) => entry.kind),
  );
  assert.deepEqual(
    user.surfaces.map((entry) => entry.kind),
    advisor.surfaces.map((entry) => entry.kind),
  );
});

test("14. transition matrix and presentation independence", () => {
  for (const from of [
    "overview",
    "problem",
    "scenario",
    "decision",
    "execution",
  ] as const) {
    for (const to of [
      "overview",
      "problem",
      "scenario",
      "decision",
      "execution",
    ] as const) {
      assert.equal(
        canTransitionRuntimeExecutiveWorkspace({ from, to }),
        true,
      );
    }
  }

  const preserved = planTransition("scenario", "decision", {
    fromPresentation: "report",
    toPresentation: "report",
  });
  assert.equal(preserved.presentation.kind, "preserve");
  assert.equal(preserved.presentation.from, "report");
  assert.equal(preserved.presentation.to, "report");

  const replaced = planTransition("scenario", "decision", {
    fromPresentation: "report",
    toPresentation: "operation",
  });
  assert.equal(replaced.presentation.kind, "replace");
  assert.equal(replaced.targetWorkspace, "decision");
});

test("15. determinism, mutation safety, registry", () => {
  const input = {
    ...(() => {
      const current = compositionFor("problem");
      const target = compositionFor("scenario");
      return {
        currentContext: current.context,
        targetContext: target.context,
        currentComposition: current.composition,
        targetComposition: target.composition,
        reason: "user-request" as const,
        source: "dial" as const,
      };
    })(),
  };
  const first = planRuntimeExecutiveWorkspaceTransition(input);
  const second = orchestrateRuntimeExecutiveWorkspaceTransition(input);
  assert.deepEqual(first, second);

  assert.equal(registry.statusCount, statuses.length);
  assert.equal(registry.phaseCount, phases.length);
  assert.equal(registry.sourceCount, sources.length);
  assert.equal(registry.dialOptionCount, dialOptions.length);
  assert.equal(registry.invariantCount, 32);
  assert.equal(registry.sectionCount, registry.sections.length);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.equal(invariants.length, 32);
  assert.equal(
    getRuntimeExecutiveWorkspaceTransitionDialOrchestrationRegistry(),
    registry,
  );
  assert.equal(
    getRuntimeExecutiveWorkspaceTransitionDialOrchestrationGuarantees(),
    guarantees,
  );
  assert.equal(
    getRuntimeExecutiveWorkspaceTransitionDialOrchestrationInvariants(),
    invariants,
  );

  assert.equal(Object.isFrozen(phases), true);
  assert.equal(Object.isFrozen(sources), true);
  assert.equal(Object.isFrozen(ranks), true);
  assert.equal(Object.isFrozen(dialOptions), true);
  assert.equal(Object.isFrozen(orchestration), true);
  assert.throws(() => {
    (phases as unknown as string[]).push("animating");
  });
  assert.throws(() => {
    (dialOptions as unknown as string[]).push("dial");
  });
});

test("16. architectural boundary and verification", () => {
  assert.doesNotMatch(source, /from\s+["']react["']/);
  assert.doesNotMatch(source, /from\s+["']three["']/);
  assert.doesNotMatch(source, /from\s+["']@react-three\//);
  assert.doesNotMatch(
    source,
    /\bCadillac(?:Workspace|Dial)\b|\bPorsche(?:Workspace|Dial)\b/,
  );
  // Geometry terms may appear only as forbidden-responsibility labels, never as APIs.
  assert.doesNotMatch(
    source,
    /\b(?:angle|degrees|radius|rotation|detent)\s*[:=]/,
  );
  assert.doesNotMatch(
    source,
    /export\s+(?:const|type|function)\s+\w*(?:QuarterCircle|DialGeometry|DialAngle|DialRadius)\w*/,
  );
  assert.match(source, /"quarter-circle-dial"/);
  assert.doesNotMatch(source, /\buseState\b|\buseEffect\b|\bcreateElement\b/);
  assert.doesNotMatch(source, /Date\.now\s*\(|Math\.random\s*\(|setTimeout\s*\(/);
  assert.doesNotMatch(source, /localStorage|sessionStorage/);
  assert.doesNotMatch(source, /\bfetch\s*\(/);
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveWorkspace(?:ExperienceFoundation|ExperienceContracts|ContextModeResolution)["']/,
  );

  assert.equal(orchestration.dialIsControlSource, true);
  assert.equal(orchestration.dialIsNotWorkspace, true);
  assert.equal(orchestration.dialIsNotSurface, true);
  assert.equal(orchestration.dialGeometryIndependent, true);
  assert.equal(orchestration.animationTimingIndependent, true);
  assert.equal(boundary.introducesUi, false);
  assert.equal(boundary.introducesDialGeometry, false);
  assert.equal(boundary.introducesTimers, false);
  assert.equal(boundary.imposesLinearWorkflow, false);

  const first = verifyRuntimeExecutiveWorkspaceTransitionDialOrchestration();
  const second = verifyRuntimeExecutiveWorkspaceTransitionDialOrchestration();
  assert.deepEqual(first, second);
  assert.equal(first.ok, true);
  assert.equal(first.upstreamCompositionOk, true);
  assert.equal(first.phaseOrderExact, true);
  assert.equal(first.allWorkspacePairsRepresentable, true);
  assert.equal(first.dialIsNotSurface, true);
  assert.equal(first.dialIsNotWorkspace, true);
  assert.equal(first.nonLinearTransitionCapable, true);
  assert.equal(first.invariantCount, 32);
  assert.equal(
    orchestration.architecturalStatus,
    "REX-6:5 Runtime Executive Workspace Transition & Dial Orchestration — TransitionDialOrchestrationReady",
  );

  assert.doesNotMatch(
    source,
    /from\s+["'][^"']*WorkspaceExperienceOrchestration[^"']*["']/,
  );
  assert.doesNotMatch(
    source,
    /export\s+(?:function|const)\s+.*orchestrateRuntimeExecutiveWorkspaceExperience\b/,
  );
});
