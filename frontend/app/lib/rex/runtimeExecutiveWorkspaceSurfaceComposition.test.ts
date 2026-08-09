import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_GUARANTEES as guarantees,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_INVARIANTS as invariants,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_MATRIX as matrix,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PARTICIPATIONS as participations,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_PRIMARY_SURFACE as primarySurface,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_REASONS as reasons,
  RUNTIME_EXECUTIVE_WORKSPACE_COMPOSITION_SURFACES as surfaces,
  composeRuntimeExecutiveWorkspaceSurfacesFromResolution,
  createRuntimeExecutiveWorkspaceSurfaceCompositionSnapshot,
  getRuntimeExecutiveWorkspaceCompositionMatrix,
  getRuntimeExecutiveWorkspaceSurfaceCompositionGuarantees,
  getRuntimeExecutiveWorkspaceSurfaceCompositionIdentity,
  getRuntimeExecutiveWorkspaceSurfaceCompositionInvariants,
  getRuntimeExecutiveWorkspaceSurfaceCompositionRegistry,
  isRuntimeExecutiveWorkspaceSurfaceCompositionComplete,
  isRuntimeExecutiveWorkspaceSurfaceCompositionResult,
  resolveRuntimeExecutiveWorkspaceSurfaceComposition,
  resolveRuntimeExecutiveWorkspaceSurfaceParticipation,
  runtimeExecutiveWorkspaceSurfaceComposition as composition,
  runtimeExecutiveWorkspaceSurfaceCompositionApiNames as apiNames,
  runtimeExecutiveWorkspaceSurfaceCompositionCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveWorkspaceSurfaceCompositionRegistry as registry,
  verifyRuntimeExecutiveWorkspaceSurfaceComposition,
} from "./runtimeExecutiveWorkspaceSurfaceComposition.ts";

import {
  createRuntimeExecutiveWorkspaceContextContract,
  resolveRuntimeExecutiveWorkspaceContext,
  runtimeExecutiveWorkspaceContextModeResolutionIdentity,
  runtimeExecutiveWorkspaceContextModeResolutionSupportedImportPath,
  verifyRuntimeExecutiveWorkspaceContextModeResolution,
} from "@/app/lib/rex/runtimeExecutiveWorkspaceContextModeResolution";

const source = readFileSync(
  new URL(
    "./runtimeExecutiveWorkspaceSurfaceComposition.ts",
    import.meta.url,
  ),
  "utf8",
);

function participationMap(
  result: ReturnType<typeof resolveRuntimeExecutiveWorkspaceSurfaceComposition>,
) {
  return Object.fromEntries(
    result.surfaces.map((entry) => [entry.surface, entry.participation]),
  );
}

function composeFor(
  kind: "overview" | "problem" | "scenario" | "decision" | "execution",
  presentation:
    | "minimum"
    | "report"
    | "operation" = kind === "execution" ? "operation" : "report",
) {
  const subject =
    kind === "overview"
      ? null
      : {
          kind,
          id:
            kind === "problem"
              ? "supply-risk"
              : kind === "scenario"
                ? "scenario-b"
                : kind === "decision"
                  ? "increase-capacity"
                  : "capacity-expansion",
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

  const resolution = resolveRuntimeExecutiveWorkspaceContext({
    requestedWorkspaceKind: kind,
    ...(subject ? { requestedSubject: subject } : {}),
    requestedIntent: intent,
    requestedPresentation: presentation,
  });

  return composeRuntimeExecutiveWorkspaceSurfacesFromResolution(resolution);
}

test("1. exact identity / version / namespace / phase / role", () => {
  assert.equal(
    composition.identity,
    "REX-6:4/RuntimeExecutiveWorkspaceSurfaceComposition",
  );
  assert.equal(composition.version, "6.4.0");
  assert.equal(
    composition.namespace,
    "nexora.rex.workspace-experience.surface-composition",
  );
  assert.equal(composition.phase, "SurfaceComposition");
  assert.equal(
    composition.architecturalRole,
    "RuntimeExecutiveWorkspaceSurfaceComposition",
  );
  assert.deepEqual(
    getRuntimeExecutiveWorkspaceSurfaceCompositionIdentity(),
    canonicalIdentity,
  );
});

test("2. sole immediate dependency is REX-6:3 resolution", () => {
  assert.equal(
    composition.upstreamDependency,
    "REX-6:3/RuntimeExecutiveWorkspaceContextModeResolution",
  );
  assert.equal(
    composition.upstreamDependency,
    runtimeExecutiveWorkspaceContextModeResolutionIdentity,
  );
  assert.equal(
    composition.dependencyPath,
    runtimeExecutiveWorkspaceContextModeResolutionSupportedImportPath,
  );
  assert.equal(boundary.consumesResolutionOnly, true);
  assert.equal(boundary.importsRex62Directly, false);
  assert.equal(boundary.importsRex61Directly, false);
  assert.equal(boundary.importsRex5Directly, false);
  assert.equal(boundary.importsRex1Directly, false);

  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveWorkspaceContextModeResolution",
  ]);

  assert.equal(
    verifyRuntimeExecutiveWorkspaceContextModeResolution().ok,
    true,
  );
});

test("3. canonical surfaces and participation vocabulary", () => {
  assert.deepEqual([...surfaces], [
    "stage",
    "advisor",
    "insight",
    "action",
  ]);
  assert.deepEqual([...participations], [
    "primary",
    "supporting",
    "contextual",
    "inactive",
  ]);
  assert.equal(primarySurface, "stage");
  assert.equal(surfaces.includes("dial" as never), false);
  assert.equal(surfaces.includes("timeline" as never), false);
  assert.equal(registry.surfaceCount, 4);
  assert.equal(registry.participationCount, 4);
});

test("4. overview composition", () => {
  const result = composeFor("overview", "minimum");
  assert.deepEqual(participationMap(result), {
    stage: "primary",
    advisor: "supporting",
    insight: "contextual",
    action: "inactive",
  });
  assert.equal(result.primarySurface, "stage");
  assert.equal(result.workspace, "overview");
  assert.equal(result.intent, "observe");
});

test("5. problem composition", () => {
  const result = composeFor("problem");
  assert.deepEqual(participationMap(result), {
    stage: "primary",
    advisor: "supporting",
    insight: "supporting",
    action: "contextual",
  });
  assert.equal(result.subject?.id, "supply-risk");
  assert.equal(result.intent, "investigate");
});

test("6. scenario composition", () => {
  const result = composeFor("scenario");
  assert.deepEqual(participationMap(result), {
    stage: "primary",
    advisor: "supporting",
    insight: "supporting",
    action: "contextual",
  });
  assert.equal(result.subject?.id, "scenario-b");
  assert.equal(result.intent, "explore");
});

test("7. decision composition", () => {
  const result = composeFor("decision");
  assert.deepEqual(participationMap(result), {
    stage: "primary",
    advisor: "supporting",
    insight: "supporting",
    action: "supporting",
  });
  assert.equal(result.subject?.id, "increase-capacity");
  assert.equal(result.intent, "decide");
});

test("8. execution composition", () => {
  const result = composeFor("execution");
  assert.deepEqual(participationMap(result), {
    stage: "primary",
    advisor: "contextual",
    insight: "supporting",
    action: "supporting",
  });
  assert.equal(result.subject?.id, "capacity-expansion");
  assert.equal(result.intent, "execute");
});

test("9. completeness, uniqueness, and stage primary for all workspaces", () => {
  for (const kind of [
    "overview",
    "problem",
    "scenario",
    "decision",
    "execution",
  ] as const) {
    const result = composeFor(kind);
    assert.equal(
      isRuntimeExecutiveWorkspaceSurfaceCompositionComplete(result.surfaces),
      true,
    );
    assert.equal(result.surfaces.length, 4);
    assert.equal(
      new Set(result.surfaces.map((entry) => entry.surface)).size,
      4,
    );
    assert.equal(
      result.surfaces.filter((entry) => entry.participation === "primary")
        .length,
      1,
    );
    assert.equal(result.primarySurface, "stage");
    assert.equal(
      result.surfaces.find((entry) => entry.surface === "stage")
        ?.participation,
      "primary",
    );
    assert.equal(
      resolveRuntimeExecutiveWorkspaceSurfaceParticipation({
        workspace: kind,
        surface: "stage",
      }),
      "primary",
    );
  }
});

test("10. presentation independence for decision workspace", () => {
  for (const presentation of ["minimum", "report", "operation"] as const) {
    const result = composeFor("decision", presentation);
    assert.equal(result.workspace, "decision");
    assert.equal(result.presentation, presentation);
    assert.deepEqual(participationMap(result), {
      stage: "primary",
      advisor: "supporting",
      insight: "supporting",
      action: "supporting",
    });
    assert.equal(isRuntimeExecutiveWorkspaceSurfaceCompositionResult(result), true);
  }
});

test("11. composition matrix and per-surface resolver", () => {
  assert.equal(getRuntimeExecutiveWorkspaceCompositionMatrix(), matrix);
  assert.deepEqual(matrix.overview, {
    stage: "primary",
    advisor: "supporting",
    insight: "contextual",
    action: "inactive",
  });
  assert.deepEqual(matrix.decision, {
    stage: "primary",
    advisor: "supporting",
    insight: "supporting",
    action: "supporting",
  });
  assert.deepEqual(matrix.execution, {
    stage: "primary",
    advisor: "contextual",
    insight: "supporting",
    action: "supporting",
  });
  assert.equal(
    resolveRuntimeExecutiveWorkspaceSurfaceParticipation({
      workspace: "overview",
      surface: "action",
    }),
    "inactive",
  );
  assert.equal(
    resolveRuntimeExecutiveWorkspaceSurfaceParticipation({
      workspace: "execution",
      surface: "advisor",
    }),
    "contextual",
  );
});

test("12. snapshot, determinism, and no input mutation", () => {
  const context = createRuntimeExecutiveWorkspaceContextContract({
    workspace: {
      workspaceId: "workspace.alpha.decision",
      workspaceKind: "decision",
    },
    subject: { kind: "decision", id: "increase-capacity" },
    focus: {
      primarySubject: { kind: "decision", id: "increase-capacity" },
      relatedSubjects: [],
    },
    intent: { intent: "decide" },
    activation: { state: "active" },
    presentation: { state: "report" },
  });

  const input = {
    resolvedContext: context,
    resolvedWorkspaceKind: "decision" as const,
    resolvedSubject: context.subject,
    resolvedIntent: "decide" as const,
    resolvedPresentation: "report" as const,
    resolutionStatus: "changed" as const,
    resolutionReason: "explicit-workspace" as const,
  };

  const first = resolveRuntimeExecutiveWorkspaceSurfaceComposition(input);
  const second = resolveRuntimeExecutiveWorkspaceSurfaceComposition(input);
  assert.deepEqual(first, second);
  assert.equal(context.workspace.workspaceKind, "decision");
  assert.equal(context.subject?.id, "increase-capacity");

  const snapshot = createRuntimeExecutiveWorkspaceSurfaceCompositionSnapshot(
    first,
  );
  assert.equal(snapshot.workspace, "decision");
  assert.equal(snapshot.primarySurface, "stage");
  assert.equal("resolutionStatus" in snapshot, false);
  assert.equal("createdAt" in snapshot, false);
  assert.doesNotMatch(JSON.stringify(snapshot), /Promise|function/);
});

test("13. registry, mutation safety, and reasons", () => {
  assert.deepEqual([...reasons], [
    "workspace-policy",
    "context-preserved",
    "subject-context",
    "intent-context",
    "fallback-overview",
  ]);
  assert.equal(registry.compositionReasonCount, reasons.length);
  assert.equal(registry.compositionCount, 5);
  assert.equal(registry.invariantCount, 30);
  assert.equal(registry.sectionCount, registry.sections.length);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.equal(invariants.length, 30);
  assert.equal(
    getRuntimeExecutiveWorkspaceSurfaceCompositionRegistry(),
    registry,
  );
  assert.equal(
    getRuntimeExecutiveWorkspaceSurfaceCompositionGuarantees(),
    guarantees,
  );
  assert.equal(
    getRuntimeExecutiveWorkspaceSurfaceCompositionInvariants(),
    invariants,
  );

  assert.equal(Object.isFrozen(surfaces), true);
  assert.equal(Object.isFrozen(participations), true);
  assert.equal(Object.isFrozen(matrix), true);
  assert.equal(Object.isFrozen(matrix.overview), true);
  assert.equal(Object.isFrozen(matrix.decision), true);
  assert.equal(Object.isFrozen(composition), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.throws(() => {
    (surfaces as unknown as string[]).push("dial");
  });
  assert.throws(() => {
    (matrix.overview as unknown as { action: string }).action = "primary";
  });
});

test("14. architectural boundary and verification", () => {
  assert.doesNotMatch(source, /from\s+["']react["']/);
  assert.doesNotMatch(source, /from\s+["']three["']/);
  assert.doesNotMatch(source, /from\s+["']@react-three\//);
  assert.doesNotMatch(
    source,
    /\bCadillac(?:Workspace|Dial)\b|\bPorsche(?:Workspace|Dial)\b/,
  );
  assert.doesNotMatch(source, /\buseState\b|\buseEffect\b|\bcreateElement\b/);
  assert.doesNotMatch(source, /Date\.now\s*\(|Math\.random\s*\(/);
  assert.doesNotMatch(source, /localStorage|sessionStorage/);
  assert.doesNotMatch(source, /\bfetch\s*\(/);
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveWorkspaceExperience(?:Foundation|Contracts)["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutive(?:Action|Insight|Advisor|Stage)Experience[^"']*["']/,
  );

  assert.equal(composition.rendererIndependent, true);
  assert.equal(composition.uiLayoutIndependent, true);
  assert.equal(composition.dialIndependent, true);
  assert.equal(composition.cockpitControlIndependent, true);
  assert.equal(composition.stageCenteredPrimary, true);
  assert.equal(composition.presentationStateIndependent, true);
  assert.equal(boundary.introducesUiLayout, false);
  assert.equal(boundary.introducesWorkspaceDial, false);
  assert.equal(boundary.introducesRendering, false);
  assert.equal(boundary.physicalPlacementIndependent, true);

  const first = verifyRuntimeExecutiveWorkspaceSurfaceComposition();
  const second = verifyRuntimeExecutiveWorkspaceSurfaceComposition();
  assert.deepEqual(first, second);
  assert.equal(first.ok, true);
  assert.equal(first.upstreamResolutionOk, true);
  assert.equal(first.frozen, true);
  assert.equal(first.everyWorkspaceHasExactlyOnePrimary, true);
  assert.equal(first.stageIsCanonicalPrimary, true);
  assert.equal(first.presentationStateIndependent, true);
  assert.equal(first.dialIndependent, true);
  assert.equal(first.cockpitControlIndependent, true);
  assert.equal(first.invariantCount, 30);
  assert.equal(first.surfaceCount, 4);
  assert.equal(first.compositionCount, 5);
  assert.equal(
    composition.architecturalStatus,
    "REX-6:4 Runtime Executive Workspace Surface Composition — SurfaceCompositionReady",
  );

  assert.doesNotMatch(
    source,
    /from\s+["'][^"']*WorkspaceTransition[^"']*["']/,
  );
  assert.doesNotMatch(
    source,
    /export\s+(?:function|const)\s+.*orchestrateRuntimeExecutiveWorkspace/,
  );
});
