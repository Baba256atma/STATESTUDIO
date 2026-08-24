import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_EXECUTIVE_WORKSPACE_DEFAULT_INTENT_BY_KIND as defaultIntents,
  RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_DEFAULT_WORKSPACE as defaultWorkspace,
  RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_GUARANTEES as guarantees,
  RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_INVARIANTS as invariants,
  RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_PRECEDENCE as precedence,
  RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_REASONS as reasons,
  RUNTIME_EXECUTIVE_WORKSPACE_RESOLUTION_STATUSES as statuses,
  RUNTIME_EXECUTIVE_WORKSPACE_SUBJECT_AFFINITY as subjectAffinities,
  createRuntimeExecutiveWorkspaceContextContract,
  createRuntimeExecutiveWorkspaceFocusContract,
  getRuntimeExecutiveWorkspaceContextModeResolutionGuarantees,
  getRuntimeExecutiveWorkspaceContextModeResolutionIdentity,
  getRuntimeExecutiveWorkspaceContextModeResolutionInvariants,
  getRuntimeExecutiveWorkspaceContextModeResolutionRegistry,
  hasRuntimeExecutiveWorkspaceChanged,
  hasRuntimeExecutiveWorkspaceContextChanged,
  resolveRuntimeExecutiveWorkspaceActivation,
  resolveRuntimeExecutiveWorkspaceContext,
  resolveRuntimeExecutiveWorkspaceFocus,
  resolveRuntimeExecutiveWorkspaceIntent,
  resolveRuntimeExecutiveWorkspaceMode,
  resolveRuntimeExecutiveWorkspacePresentation,
  resolveRuntimeExecutiveWorkspaceSubject,
  runtimeExecutiveWorkspaceContextModeResolution as resolution,
  runtimeExecutiveWorkspaceContextModeResolutionApiNames as apiNames,
  runtimeExecutiveWorkspaceContextModeResolutionCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveWorkspaceContextModeResolutionRegistry as registry,
  verifyRuntimeExecutiveWorkspaceContextModeResolution,
} from "./runtimeExecutiveWorkspaceContextModeResolution.ts";

import {
  runtimeExecutiveWorkspaceExperienceContractsIdentity,
  runtimeExecutiveWorkspaceExperienceContractsSupportedImportPath,
  verifyRuntimeExecutiveWorkspaceExperienceContracts,
} from "@/app/lib/rex/runtimeExecutiveWorkspaceExperienceContracts";

const source = readFileSync(
  new URL(
    "./runtimeExecutiveWorkspaceContextModeResolution.ts",
    import.meta.url,
  ),
  "utf8",
);

function context(
  kind: "overview" | "problem" | "scenario" | "decision" | "execution",
  overrides?: Partial<
    Parameters<typeof createRuntimeExecutiveWorkspaceContextContract>[0]
  >,
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

  return createRuntimeExecutiveWorkspaceContextContract({
    workspace: {
      workspaceId: `workspace.alpha.${kind}`,
      workspaceKind: kind,
    },
    subject,
    focus: createRuntimeExecutiveWorkspaceFocusContract({
      primarySubject: subject,
      relatedSubjects: [],
    }),
    intent: { intent: defaultIntents[kind] },
    activation: { state: "active" },
    presentation: {
      state:
        kind === "execution"
          ? "operation"
          : kind === "overview"
            ? "minimum"
            : "report",
    },
    ...overrides,
  });
}

test("1. exact identity / version / namespace / phase / role", () => {
  assert.equal(
    resolution.identity,
    "REX-6:3/RuntimeExecutiveWorkspaceContextModeResolution",
  );
  assert.equal(resolution.version, "6.3.0");
  assert.equal(
    resolution.namespace,
    "nexora.rex.workspace-experience.context-mode-resolution",
  );
  assert.equal(resolution.phase, "ContextModeResolution");
  assert.equal(
    resolution.architecturalRole,
    "RuntimeExecutiveWorkspaceContextModeResolution",
  );
  assert.deepEqual(
    getRuntimeExecutiveWorkspaceContextModeResolutionIdentity(),
    canonicalIdentity,
  );
});

test("2. sole immediate dependency is REX-6:2 contracts", () => {
  assert.equal(
    resolution.upstreamDependency,
    "REX-6:2/RuntimeExecutiveWorkspaceExperienceContracts",
  );
  assert.equal(
    resolution.upstreamDependency,
    runtimeExecutiveWorkspaceExperienceContractsIdentity,
  );
  assert.equal(
    resolution.dependencyPath,
    runtimeExecutiveWorkspaceExperienceContractsSupportedImportPath,
  );
  assert.equal(boundary.consumesContractsOnly, true);
  assert.equal(boundary.importsRex61Directly, false);
  assert.equal(boundary.importsRex5Directly, false);
  assert.equal(boundary.importsRex4Directly, false);
  assert.equal(boundary.importsRex1Directly, false);

  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveWorkspaceExperienceContracts",
  ]);

  assert.equal(
    verifyRuntimeExecutiveWorkspaceExperienceContracts().ok,
    true,
  );
});

test("3. explicit workspace resolution for every canonical kind", () => {
  for (const kind of [
    "overview",
    "problem",
    "scenario",
    "decision",
    "execution",
  ] as const) {
    const result = resolveRuntimeExecutiveWorkspaceContext({
      currentContext: context("overview"),
      requestedWorkspaceKind: kind,
      requestSource: "user",
      transitionReason: "user-request",
    });
    assert.equal(result.resolvedWorkspaceKind, kind);
    assert.equal(result.resolutionReason, "explicit-workspace");
    assert.equal(result.status !== "rejected", true);
  }
});

test("4. subject-derived workspace resolution", () => {
  const cases = [
    ["problem", "supply-risk"],
    ["scenario", "scenario-b"],
    ["decision", "increase-capacity"],
    ["execution", "capacity-expansion"],
  ] as const;

  for (const [kind, id] of cases) {
    const result = resolveRuntimeExecutiveWorkspaceContext({
      currentContext: context("overview"),
      requestedSubject: { kind, id },
    });
    assert.equal(result.resolvedWorkspaceKind, kind);
    assert.equal(result.resolvedSubject?.id, id);
    assert.equal(result.resolutionReason, "subject-derived");
    assert.equal(result.workspaceChanged, true);
  }

  assert.deepEqual(subjectAffinities, {
    problem: "problem",
    scenario: "scenario",
    decision: "decision",
    execution: "execution",
  });
});

test("5. intent-derived workspace resolution", () => {
  const cases = [
    ["observe", "overview"],
    ["investigate", "problem"],
    ["explore", "scenario"],
    ["decide", "decision"],
    ["execute", "execution"],
  ] as const;

  for (const [intent, kind] of cases) {
    const mode = resolveRuntimeExecutiveWorkspaceMode({
      currentContext: null,
      requestedIntent: intent,
    });
    assert.equal(mode.kind, kind);
    assert.equal(mode.reason, "intent-derived");
  }
});

test("6. precedence: explicit > subject > intent > current > overview", () => {
  assert.deepEqual([...precedence], [
    "explicit-workspace",
    "subject-derived",
    "intent-derived",
    "preserved-current",
    "fallback-overview",
  ]);

  // explicit beats subject
  const explicit = resolveRuntimeExecutiveWorkspaceContext({
    currentContext: context("overview"),
    requestedWorkspaceKind: "decision",
    requestedSubject: { kind: "problem" as const, id: "supply-risk" },
    requestedIntent: "investigate",
  });
  assert.equal(explicit.resolvedWorkspaceKind, "decision");
  assert.equal(explicit.resolutionReason, "explicit-workspace");
  assert.equal(explicit.resolvedSubject?.kind, "problem");

  // subject beats intent
  const subject = resolveRuntimeExecutiveWorkspaceContext({
    currentContext: context("overview"),
    requestedSubject: { kind: "scenario" as const, id: "scenario-b" },
    requestedIntent: "investigate",
  });
  assert.equal(subject.resolvedWorkspaceKind, "scenario");
  assert.equal(subject.resolutionReason, "subject-derived");

  // intent beats current
  const intent = resolveRuntimeExecutiveWorkspaceContext({
    currentContext: context("overview"),
    requestedIntent: "execute",
  });
  assert.equal(intent.resolvedWorkspaceKind, "execution");
  assert.equal(intent.resolutionReason, "intent-derived");

  // current preserved without stronger signal
  const preserved = resolveRuntimeExecutiveWorkspaceContext({
    currentContext: context("decision"),
  });
  assert.equal(preserved.resolvedWorkspaceKind, "decision");
  assert.equal(preserved.workspaceChanged, false);

  // overview fallback
  const fallback = resolveRuntimeExecutiveWorkspaceContext({});
  assert.equal(fallback.resolvedWorkspaceKind, "overview");
  assert.equal(fallback.resolvedIntent, "observe");
  assert.equal(fallback.resolutionReason, "fallback-overview");
  assert.equal(defaultWorkspace, "overview");
});

test("7. example A: overview + problem subject + investigate", () => {
  const result = resolveRuntimeExecutiveWorkspaceContext({
    currentContext: context("overview"),
    requestedSubject: { kind: "problem" as const, id: "supply-risk" },
    requestedIntent: "investigate",
  });
  assert.equal(result.resolvedWorkspaceKind, "problem");
  assert.equal(result.resolvedSubject?.kind, "problem");
  assert.equal(result.resolvedSubject?.id, "supply-risk");
  assert.equal(result.resolvedIntent, "investigate");
  assert.equal(result.workspaceChanged, true);
  assert.equal(result.resolvedActivation, "entering");
  assert.equal(result.resolvedPresentation, "minimum");
});

test("8. example B / non-linear movement", () => {
  const pairs = [
    ["decision", "scenario"],
    ["execution", "decision"],
    ["scenario", "problem"],
    ["problem", "overview"],
    ["overview", "decision"],
  ] as const;

  for (const [from, to] of pairs) {
    const result = resolveRuntimeExecutiveWorkspaceContext({
      currentContext: context(from),
      requestedWorkspaceKind: to,
      ...(to === "scenario"
        ? { requestedSubject: { kind: "scenario" as const, id: "scenario-b" } }
        : {}),
      requestSource: "user",
      transitionReason: "user-request",
    });
    assert.equal(result.resolvedWorkspaceKind, to);
    assert.equal(result.workspaceChanged, true);
    assert.equal(result.status, "changed");
  }

  assert.equal(boundary.imposesLinearWorkflow, false);
  assert.equal(resolution.nonLinearTransitionCapable, true);
});

test("9. example C: preserve execution with no stronger signal", () => {
  const result = resolveRuntimeExecutiveWorkspaceContext({
    currentContext: context("execution"),
  });
  assert.equal(result.resolvedWorkspaceKind, "execution");
  assert.equal(result.workspaceChanged, false);
  assert.equal(result.contextChanged, false);
  assert.equal(result.status, "unchanged");
  assert.equal(result.resolvedActivation, "active");
  assert.equal(result.resolutionReason, "same-context");
});

test("10. example D: empty input falls back to overview/observe", () => {
  const result = resolveRuntimeExecutiveWorkspaceContext({});
  assert.equal(result.resolvedWorkspaceKind, "overview");
  assert.equal(result.resolvedIntent, "observe");
  assert.equal(result.resolvedSubject, null);
  assert.equal(result.resolutionReason, "fallback-overview");
});

test("11. workspace vs context change: same mode, new subject", () => {
  const previous = context("scenario", {
    subject: { kind: "scenario", id: "scenario-a" },
    focus: {
      primarySubject: { kind: "scenario", id: "scenario-a" },
      relatedSubjects: [],
    },
  });
  const result = resolveRuntimeExecutiveWorkspaceContext({
    currentContext: previous,
    requestedSubject: { kind: "scenario" as const, id: "scenario-b" },
  });
  assert.equal(result.resolvedWorkspaceKind, "scenario");
  assert.equal(result.workspaceChanged, false);
  assert.equal(result.contextChanged, true);
  assert.equal(result.resolvedSubject?.id, "scenario-b");
  assert.equal(
    hasRuntimeExecutiveWorkspaceChanged({
      previous: "scenario",
      next: "scenario",
    }),
    false,
  );
  assert.equal(
    hasRuntimeExecutiveWorkspaceContextChanged({
      previous,
      next: result.resolvedContext,
    }),
    true,
  );
});

test("12. focus resolution and no input mutation", () => {
  const related = [{ kind: "problem" as const, id: "supply-risk" }];
  const currentFocus = createRuntimeExecutiveWorkspaceFocusContract({
    primarySubject: { kind: "goal", id: "growth-2027" },
    relatedSubjects: related,
  });
  const relatedBefore = [...related];

  const focused = resolveRuntimeExecutiveWorkspaceFocus({
    currentFocus,
    requestedSubject: { kind: "decision" as const, id: "increase-capacity" },
    resolvedSubject: { kind: "decision", id: "increase-capacity" },
    workspaceChanged: true,
  });
  assert.equal(focused.primarySubject?.id, "increase-capacity");
  assert.equal(related.length, 1);
  assert.deepEqual(related, relatedBefore);
  assert.equal(currentFocus.primarySubject?.id, "growth-2027");

  const preserved = resolveRuntimeExecutiveWorkspaceFocus({
    currentFocus,
    resolvedSubject: { kind: "goal", id: "growth-2027" },
    workspaceChanged: false,
  });
  assert.equal(preserved.primarySubject?.id, "growth-2027");

  const cleared = resolveRuntimeExecutiveWorkspaceFocus({
    currentFocus,
    requestedSubject: null,
    resolvedSubject: null,
    workspaceChanged: false,
  });
  assert.equal(cleared.primarySubject, null);
  assert.equal(cleared.relatedSubjects.length, 0);
});

test("13. activation and presentation independence", () => {
  assert.equal(
    resolveRuntimeExecutiveWorkspaceActivation({ workspaceChanged: true }),
    "entering",
  );
  assert.equal(
    resolveRuntimeExecutiveWorkspaceActivation({
      workspaceChanged: false,
      currentActivation: "active",
    }),
    "active",
  );

  const result = resolveRuntimeExecutiveWorkspaceContext({
    currentContext: context("overview", {
      presentation: { state: "minimum" },
    }),
    requestedWorkspaceKind: "decision",
  });
  assert.equal(result.resolvedWorkspaceKind, "decision");
  assert.equal(result.resolvedPresentation, "minimum");
  assert.equal(
    resolveRuntimeExecutiveWorkspacePresentation({
      currentPresentation: "operation",
    }),
    "operation",
  );
  assert.equal(
    resolveRuntimeExecutiveWorkspacePresentation({
      requestedPresentation: "report",
      currentPresentation: "minimum",
    }),
    "report",
  );
});

test("14. subject/intent resolvers and defaults", () => {
  assert.deepEqual(defaultIntents, {
    overview: "observe",
    problem: "investigate",
    scenario: "explore",
    decision: "decide",
    execution: "execute",
  });

  assert.equal(
    resolveRuntimeExecutiveWorkspaceIntent({
      resolvedWorkspaceKind: "problem",
    }),
    "investigate",
  );
  assert.equal(
    resolveRuntimeExecutiveWorkspaceIntent({
      requestedIntent: "explore",
      resolvedWorkspaceKind: "problem",
    }),
    "explore",
  );

  assert.deepEqual(
    resolveRuntimeExecutiveWorkspaceSubject({
      requestedSubject: { kind: "object" as const, id: "warehouse-01" },
    }),
    { kind: "object", id: "warehouse-01" },
  );
  assert.equal(
    resolveRuntimeExecutiveWorkspaceSubject({
      currentContext: context("decision"),
    })?.id,
    "increase-capacity",
  );
  assert.equal(
    resolveRuntimeExecutiveWorkspaceSubject({
      currentContext: context("decision"),
      requestedSubject: null,
    }),
    null,
  );
});

test("15. invalid request rejection is deterministic", () => {
  const result = resolveRuntimeExecutiveWorkspaceContext({
    currentContext: context("problem"),
    requestedWorkspaceKind: "cockpit" as "overview",
  });
  assert.equal(result.status, "rejected");
  assert.equal(result.resolutionReason, "invalid-request");
  assert.equal(result.resolvedWorkspaceKind, "problem");
  assert.equal(result.workspaceChanged, false);
  assert.ok(
    result.issues.some(
      (entry) => entry.code === "invalid-requested-workspace-kind",
    ),
  );

  const emptySubject = resolveRuntimeExecutiveWorkspaceContext({
    currentContext: context("overview"),
    requestedSubject: { kind: "problem", id: "" },
  });
  assert.equal(emptySubject.status, "rejected");
  assert.ok(
    emptySubject.issues.some(
      (entry) => entry.code === "empty-requested-subject-id",
    ),
  );
});

test("16. registry, mutation safety, determinism", () => {
  assert.deepEqual([...statuses], ["changed", "unchanged", "rejected"]);
  assert.deepEqual([...reasons], [
    "explicit-workspace",
    "subject-derived",
    "intent-derived",
    "preserved-current",
    "fallback-overview",
    "same-context",
    "invalid-request",
  ]);
  assert.equal(registry.resolutionStatusCount, statuses.length);
  assert.equal(registry.resolutionReasonCount, reasons.length);
  assert.equal(registry.precedenceStepCount, precedence.length);
  assert.equal(registry.invariantCount, 24);
  assert.equal(registry.sectionCount, registry.sections.length);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.equal(invariants.length, 24);
  assert.equal(
    getRuntimeExecutiveWorkspaceContextModeResolutionRegistry(),
    registry,
  );
  assert.equal(
    getRuntimeExecutiveWorkspaceContextModeResolutionGuarantees(),
    guarantees,
  );
  assert.equal(
    getRuntimeExecutiveWorkspaceContextModeResolutionInvariants(),
    invariants,
  );

  assert.equal(Object.isFrozen(statuses), true);
  assert.equal(Object.isFrozen(reasons), true);
  assert.equal(Object.isFrozen(precedence), true);
  assert.equal(Object.isFrozen(defaultIntents), true);
  assert.equal(Object.isFrozen(subjectAffinities), true);
  assert.equal(Object.isFrozen(resolution), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.throws(() => {
    (statuses as unknown as string[]).push("pending");
  });
  assert.throws(() => {
    (precedence as unknown as string[]).push("ui-hint");
  });

  const input = {
    currentContext: context("overview"),
    requestedSubject: {
      kind: "problem" as const,
      id: "supply-risk",
    },
    requestedIntent: "investigate" as const,
  };
  const first = resolveRuntimeExecutiveWorkspaceContext(input);
  const second = resolveRuntimeExecutiveWorkspaceContext(input);
  assert.deepEqual(first, second);
});

test("17. architectural boundary and verification", () => {
  assert.doesNotMatch(source, /from\s+["']react["']/);
  assert.doesNotMatch(source, /from\s+["']three["']/);
  assert.doesNotMatch(source, /from\s+["']@react-three\//);
  assert.doesNotMatch(source, /\bCadillac(?:Workspace|Dial)\b|\bPorsche(?:Workspace|Dial)\b/);
  assert.doesNotMatch(source, /\buseState\b|\buseEffect\b|\bcreateElement\b/);
  assert.doesNotMatch(source, /Date\.now\s*\(|Math\.random\s*\(/);
  assert.doesNotMatch(source, /localStorage|sessionStorage/);
  assert.doesNotMatch(source, /\bfetch\s*\(/);
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveWorkspaceExperienceFoundation["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutive(?:Action|Insight|Advisor|Stage)Experience[^"']*["']/,
  );

  assert.equal(resolution.rendererIndependent, true);
  assert.equal(resolution.dialIndependent, true);
  assert.equal(resolution.compositionFree, true);
  assert.equal(resolution.presentationStateIndependent, true);
  assert.equal(boundary.introducesSurfaceComposition, false);
  assert.equal(boundary.introducesUiBehavior, false);
  assert.equal(boundary.introducesRendering, false);

  const first = verifyRuntimeExecutiveWorkspaceContextModeResolution();
  const second = verifyRuntimeExecutiveWorkspaceContextModeResolution();
  assert.deepEqual(first, second);
  assert.equal(first.ok, true);
  assert.equal(first.upstreamContractsOk, true);
  assert.equal(first.frozen, true);
  assert.equal(first.nonLinearTransitionCapable, true);
  assert.equal(first.compositionFree, true);
  assert.equal(first.invariantCount, 24);
  assert.equal(first.resolutionStatusCount, 3);
  assert.equal(first.resolutionReasonCount, 7);
  assert.equal(
    resolution.architecturalStatus,
    "REX-6:3 Runtime Executive Workspace Context & Mode Resolution — ContextModeResolutionReady",
  );

  assert.doesNotMatch(
    source,
    /from\s+["'][^"']*WorkspaceSurfaceComposition[^"']*["']/,
  );
  assert.doesNotMatch(
    source,
    /export\s+(?:function|const)\s+.*composeRuntimeExecutiveWorkspace/,
  );
});
