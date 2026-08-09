import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACTS_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_FAMILIES as families,
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_GUARANTEES as guarantees,
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_INVARIANTS as invariants,
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_INTENTS as intents,
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_ACTIVATION_STATES as activationStates,
  RUNTIME_EXECUTIVE_WORKSPACE_CONTRACT_SURFACE_ROLES as surfaceRoles,
  RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_OUTCOME_STATUSES as outcomeStatuses,
  createRuntimeExecutiveWorkspaceActivationContract,
  createRuntimeExecutiveWorkspaceCompositionRequest,
  createRuntimeExecutiveWorkspaceContextContract,
  createRuntimeExecutiveWorkspaceExperienceSnapshot,
  createRuntimeExecutiveWorkspaceFocusContract,
  createRuntimeExecutiveWorkspaceIdentityContract,
  createRuntimeExecutiveWorkspaceIntentContract,
  createRuntimeExecutiveWorkspacePresentationContract,
  createRuntimeExecutiveWorkspaceSubjectContract,
  createRuntimeExecutiveWorkspaceSurfaceParticipationContract,
  createRuntimeExecutiveWorkspaceSurfaceSetContract,
  createRuntimeExecutiveWorkspaceTransitionContract,
  createRuntimeExecutiveWorkspaceTransitionOutcome,
  createRuntimeExecutiveWorkspaceTransitionRequest,
  evaluateRuntimeExecutiveWorkspaceFocusContract,
  evaluateRuntimeExecutiveWorkspaceIdentityContract,
  evaluateRuntimeExecutiveWorkspaceSurfaceSetContract,
  getRuntimeExecutiveWorkspaceExperienceContractsGuarantees,
  getRuntimeExecutiveWorkspaceExperienceContractsIdentity,
  getRuntimeExecutiveWorkspaceExperienceContractsInvariants,
  getRuntimeExecutiveWorkspaceExperienceContractsRegistry,
  isRuntimeExecutiveWorkspaceIdentityContract,
  isRuntimeExecutiveWorkspaceSubjectContract,
  isRuntimeExecutiveWorkspaceTransitionContract,
  isRuntimeExecutiveWorkspaceTransitionOutcome,
  isRuntimeExecutiveWorkspaceTransitionRequest,
  runtimeExecutiveWorkspaceExperienceContracts as contracts,
  runtimeExecutiveWorkspaceExperienceContractsApiNames as apiNames,
  runtimeExecutiveWorkspaceExperienceContractsCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveWorkspaceExperienceContractsRegistry as registry,
  verifyRuntimeExecutiveWorkspaceExperienceContracts,
} from "./runtimeExecutiveWorkspaceExperienceContracts.ts";

import {
  runtimeExecutiveWorkspaceExperienceFoundationIdentity,
  runtimeExecutiveWorkspaceExperienceFoundationSupportedImportPath,
  verifyRuntimeExecutiveWorkspaceExperienceFoundation,
} from "@/app/lib/rex/runtimeExecutiveWorkspaceExperienceFoundation";

const source = readFileSync(
  new URL(
    "./runtimeExecutiveWorkspaceExperienceContracts.ts",
    import.meta.url,
  ),
  "utf8",
);

function emptyFocus() {
  return createRuntimeExecutiveWorkspaceFocusContract({
    primarySubject: null,
    relatedSubjects: [],
  });
}

function contextFor(
  kind: "overview" | "problem" | "scenario" | "decision" | "execution",
  overrides?: Partial<
    Parameters<typeof createRuntimeExecutiveWorkspaceContextContract>[0]
  >,
) {
  const subjectByKind = {
    overview: { kind: "workspace" as const, id: "workspace.alpha" },
    problem: { kind: "problem" as const, id: "supply-risk" },
    scenario: { kind: "scenario" as const, id: "scenario-b" },
    decision: { kind: "decision" as const, id: "increase-capacity" },
    execution: { kind: "execution" as const, id: "capacity-expansion" },
  } as const;

  const intentByKind = {
    overview: "observe" as const,
    problem: "investigate" as const,
    scenario: "explore" as const,
    decision: "evaluate" as const,
    execution: "execute" as const,
  } as const;

  const presentationByKind = {
    overview: "minimum" as const,
    problem: "report" as const,
    scenario: "report" as const,
    decision: "report" as const,
    execution: "operation" as const,
  } as const;

  const subject = createRuntimeExecutiveWorkspaceSubjectContract(
    subjectByKind[kind],
  );

  return createRuntimeExecutiveWorkspaceContextContract({
    workspace: createRuntimeExecutiveWorkspaceIdentityContract({
      workspaceId: `workspace.alpha.${kind}`,
      workspaceKind: kind,
    }),
    subject,
    focus: createRuntimeExecutiveWorkspaceFocusContract({
      primarySubject: subject,
      relatedSubjects: [],
    }),
    intent: createRuntimeExecutiveWorkspaceIntentContract({
      intent: intentByKind[kind],
    }),
    activation: createRuntimeExecutiveWorkspaceActivationContract({
      state: "active",
    }),
    presentation: createRuntimeExecutiveWorkspacePresentationContract({
      state: presentationByKind[kind],
    }),
    ...overrides,
  });
}

test("1. exact identity / version / namespace / phase / role", () => {
  assert.equal(
    contracts.identity,
    "REX-6:2/RuntimeExecutiveWorkspaceExperienceContracts",
  );
  assert.equal(contracts.version, "6.2.0");
  assert.equal(
    contracts.namespace,
    "nexora.rex.workspace-experience.contracts",
  );
  assert.equal(contracts.phase, "Contracts");
  assert.equal(
    contracts.architecturalRole,
    "RuntimeExecutiveWorkspaceExperienceContracts",
  );
  assert.deepEqual(
    getRuntimeExecutiveWorkspaceExperienceContractsIdentity(),
    canonicalIdentity,
  );
});

test("2. sole immediate dependency is REX-6:1 foundation", () => {
  assert.equal(
    contracts.upstreamDependency,
    "REX-6:1/RuntimeExecutiveWorkspaceExperienceFoundation",
  );
  assert.equal(
    contracts.upstreamDependency,
    runtimeExecutiveWorkspaceExperienceFoundationIdentity,
  );
  assert.equal(
    contracts.dependencyPath,
    runtimeExecutiveWorkspaceExperienceFoundationSupportedImportPath,
  );
  assert.equal(boundary.consumesFoundationOnly, true);
  assert.equal(boundary.importsRex5Directly, false);
  assert.equal(boundary.importsRex4Directly, false);
  assert.equal(boundary.importsRex3Directly, false);
  assert.equal(boundary.importsRex2Directly, false);
  assert.equal(boundary.importsRex1Directly, false);

  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveWorkspaceExperienceFoundation",
  ]);

  assert.equal(
    verifyRuntimeExecutiveWorkspaceExperienceFoundation().ok,
    true,
  );
});

test("3. canonical contract families", () => {
  assert.deepEqual([...families], [
    "identity",
    "subject",
    "focus",
    "intent",
    "activation",
    "presentation",
    "surface-participation",
    "context",
    "transition",
    "composition",
    "snapshot",
  ]);
  assert.equal(registry.contractFamilyCount, 11);
  assert.equal(registry.contractFamilyCount, families.length);
});

test("4. workspace identity contracts", () => {
  const identity = createRuntimeExecutiveWorkspaceIdentityContract({
    workspaceId: "  workspace.alpha  ",
    workspaceKind: "decision",
  });
  assert.equal(identity.workspaceId, "workspace.alpha");
  assert.equal(identity.workspaceKind, "decision");
  assert.equal(isRuntimeExecutiveWorkspaceIdentityContract(identity), true);
  assert.equal(Object.isFrozen(identity), true);

  const empty = evaluateRuntimeExecutiveWorkspaceIdentityContract({
    workspaceId: "   ",
    workspaceKind: "decision",
  });
  assert.equal(empty.valid, false);
  assert.ok(empty.issues.some((entry) => entry.code === "empty-workspace-id"));

  const invalidKind = evaluateRuntimeExecutiveWorkspaceIdentityContract({
    workspaceId: "workspace.alpha",
    workspaceKind: "cockpit",
  });
  assert.equal(invalidKind.valid, false);
  assert.ok(
    invalidKind.issues.some((entry) => entry.code === "invalid-workspace-kind"),
  );

  assert.throws(
    () =>
      createRuntimeExecutiveWorkspaceIdentityContract({
        workspaceId: "",
        workspaceKind: "overview",
      }),
    /non-empty/,
  );
});

test("5. subject contracts remain reference-only", () => {
  const subject = createRuntimeExecutiveWorkspaceSubjectContract({
    kind: "object",
    id: "warehouse-01",
  });
  assert.deepEqual(subject, { kind: "object", id: "warehouse-01" });
  assert.equal(isRuntimeExecutiveWorkspaceSubjectContract(subject), true);
  assert.equal("label" in subject, false);
  assert.equal("geometry" in subject, false);
  assert.equal(Object.keys(subject).sort().join(","), "id,kind");
  assert.equal(isRuntimeExecutiveWorkspaceSubjectContract({
    kind: "kor",
    id: "x",
  }), false);
  assert.equal(isRuntimeExecutiveWorkspaceSubjectContract({
    kind: "object",
    id: "",
  }), false);
});

test("6. focus: no primary, one primary, related, duplicate rejection", () => {
  const none = createRuntimeExecutiveWorkspaceFocusContract({
    primarySubject: null,
    relatedSubjects: [],
  });
  assert.equal(none.primarySubject, null);
  assert.deepEqual([...none.relatedSubjects], []);

  const one = createRuntimeExecutiveWorkspaceFocusContract({
    primarySubject: { kind: "decision", id: "increase-capacity" },
    relatedSubjects: [
      { kind: "scenario", id: "scenario-b" },
      { kind: "problem", id: "supply-risk" },
    ],
  });
  assert.equal(one.primarySubject?.id, "increase-capacity");
  assert.deepEqual(
    one.relatedSubjects.map((entry) => entry.id),
    ["supply-risk", "scenario-b"],
  );

  assert.throws(
    () =>
      createRuntimeExecutiveWorkspaceFocusContract({
        primarySubject: null,
        relatedSubjects: [
          { kind: "problem", id: "supply-risk" },
          { kind: "problem", id: "supply-risk" },
        ],
      }),
    /duplicate/,
  );

  const evaluated = evaluateRuntimeExecutiveWorkspaceFocusContract({
    primarySubject: null,
    relatedSubjects: [
      { kind: "goal", id: "growth-2027" },
      { kind: "goal", id: "growth-2027" },
    ],
  });
  assert.equal(evaluated.valid, false);
  assert.ok(
    evaluated.issues.some((entry) => entry.code === "duplicate-related-subject"),
  );
});

test("7. intent and activation use canonical vocabularies", () => {
  assert.deepEqual([...intents], [
    "observe",
    "investigate",
    "explore",
    "evaluate",
    "decide",
    "execute",
  ]);
  assert.deepEqual([...activationStates], [
    "inactive",
    "entering",
    "active",
    "leaving",
  ]);

  const intent = createRuntimeExecutiveWorkspaceIntentContract({
    intent: "investigate",
  });
  assert.equal(intent.intent, "investigate");
  assert.throws(
    () =>
      createRuntimeExecutiveWorkspaceIntentContract({
        intent: "dispatch" as "observe",
      }),
    /known workspace intent/,
  );

  const activation = createRuntimeExecutiveWorkspaceActivationContract({
    state: "entering",
  });
  assert.equal(activation.state, "entering");
  assert.throws(
    () =>
      createRuntimeExecutiveWorkspaceActivationContract({
        state: "animating" as "active",
      }),
    /activation state/,
  );
});

test("8. surface participation for stage/advisor/insight/action", () => {
  assert.deepEqual([...surfaceRoles], [
    "stage",
    "advisor",
    "insight",
    "action",
  ]);

  const set = createRuntimeExecutiveWorkspaceSurfaceSetContract({
    entries: [
      { surface: "action", participation: "contextual" },
      { surface: "stage", participation: "primary" },
      { surface: "insight", participation: "supporting" },
      { surface: "advisor", participation: "supporting" },
    ],
  });
  assert.deepEqual(
    set.entries.map((entry) => entry.surface),
    ["stage", "advisor", "insight", "action"],
  );
  assert.deepEqual(
    set.entries.map((entry) => entry.participation),
    ["primary", "supporting", "supporting", "contextual"],
  );

  assert.throws(
    () =>
      createRuntimeExecutiveWorkspaceSurfaceSetContract({
        entries: [
          { surface: "stage", participation: "primary" },
          { surface: "stage", participation: "supporting" },
        ],
      }),
    /duplicate surface roles/,
  );

  const evaluated = evaluateRuntimeExecutiveWorkspaceSurfaceSetContract({
    entries: [
      { surface: "advisor", participation: "supporting" },
      { surface: "advisor", participation: "primary" },
    ],
  });
  assert.equal(evaluated.valid, false);
  assert.ok(
    evaluated.issues.some((entry) => entry.code === "duplicate-surface-role"),
  );

  const participation =
    createRuntimeExecutiveWorkspaceSurfaceParticipationContract({
      surface: "stage",
      participation: "primary",
    });
  assert.equal("width" in participation, false);
  assert.equal("opacity" in participation, false);
  assert.equal("color" in participation, false);
});

test("9. representative contexts for all workspace kinds", () => {
  for (const kind of [
    "overview",
    "problem",
    "scenario",
    "decision",
    "execution",
  ] as const) {
    const context = contextFor(kind);
    assert.equal(context.workspace.workspaceKind, kind);
    assert.equal(context.activation.state, "active");
    assert.ok(context.subject === null || context.subject.id.length > 0);
    assert.equal(Object.isFrozen(context), true);
  }

  const decisionReport = contextFor("decision");
  assert.equal(decisionReport.workspace.workspaceKind, "decision");
  assert.equal(decisionReport.presentation.state, "report");

  const executionOperation = contextFor("execution");
  assert.equal(executionOperation.workspace.workspaceKind, "execution");
  assert.equal(executionOperation.presentation.state, "operation");
});

test("10. transitions are non-linear and representable both directions", () => {
  const pairs = [
    ["problem", "scenario"],
    ["scenario", "decision"],
    ["decision", "execution"],
    ["decision", "scenario"],
    ["execution", "decision"],
    ["problem", "overview"],
  ] as const;

  for (const [from, to] of pairs) {
    const transition = createRuntimeExecutiveWorkspaceTransitionContract({
      from,
      to,
      reason: "user-request",
    });
    assert.equal(transition.from, from);
    assert.equal(transition.to, to);
    assert.equal(isRuntimeExecutiveWorkspaceTransitionContract(transition), true);
  }

  assert.equal(boundary.imposesLinearWorkflow, false);
  assert.equal(contracts.nonLinearTransitionCapable, true);
});

test("11. transition request and outcome remain separate", () => {
  const request = createRuntimeExecutiveWorkspaceTransitionRequest({
    currentWorkspace: {
      workspaceId: "workspace.alpha.problem",
      workspaceKind: "problem",
    },
    requestedWorkspaceKind: "scenario",
    reason: "runtime-guidance",
    source: "advisor",
    requestedSubject: { kind: "scenario", id: "scenario-b" },
    requestedIntent: "explore",
    requestedPresentation: "report",
  });
  assert.equal(request.currentWorkspace.workspaceKind, "problem");
  assert.equal(request.requestedWorkspaceKind, "scenario");
  assert.equal(request.source, "advisor");
  assert.equal(isRuntimeExecutiveWorkspaceTransitionRequest(request), true);
  assert.equal("status" in request, false);

  for (const status of ["accepted", "rejected", "unchanged"] as const) {
    const outcome = createRuntimeExecutiveWorkspaceTransitionOutcome({
      status,
      from: "problem",
      to: "scenario",
      reason: "runtime-guidance",
    });
    assert.equal(outcome.status, status);
    assert.equal(isRuntimeExecutiveWorkspaceTransitionOutcome(outcome), true);
    assert.equal("source" in outcome, false);
  }

  assert.deepEqual([...outcomeStatuses], [
    "accepted",
    "rejected",
    "unchanged",
  ]);

  assert.throws(
    () =>
      createRuntimeExecutiveWorkspaceTransitionRequest({
        currentWorkspace: {
          workspaceId: "workspace.alpha",
          workspaceKind: "overview",
        },
        requestedWorkspaceKind: "problem",
        reason: "user-request",
        source: "rotary-dial" as "user",
      }),
    /transition request source/,
  );
});

test("12. composition request and experience snapshot", () => {
  const context = contextFor("decision");
  const surfaces = createRuntimeExecutiveWorkspaceSurfaceSetContract({
    entries: [
      { surface: "stage", participation: "primary" },
      { surface: "advisor", participation: "supporting" },
      { surface: "insight", participation: "supporting" },
      { surface: "action", participation: "contextual" },
    ],
  });

  const composition = createRuntimeExecutiveWorkspaceCompositionRequest({
    context,
    surfaces,
  });
  assert.equal(composition.context.workspace.workspaceKind, "decision");
  assert.equal(composition.surfaces?.entries.length, 4);

  const snapshot = createRuntimeExecutiveWorkspaceExperienceSnapshot({
    workspace: context.workspace,
    subject: context.subject,
    focus: context.focus,
    intent: context.intent,
    activation: context.activation,
    presentation: context.presentation,
    surfaces,
  });
  assert.equal(snapshot.workspace.workspaceKind, "decision");
  assert.equal(snapshot.subject?.id, "increase-capacity");
  assert.equal(snapshot.surfaces.entries[0]?.surface, "stage");
  assert.equal(Object.isFrozen(snapshot), true);
  assert.equal("createdAt" in snapshot, false);
  assert.equal("updatedAt" in snapshot, false);
  assert.doesNotMatch(JSON.stringify(snapshot), /Date|Promise|function/);
});

test("13. mutation safety of canonical registries", () => {
  assert.equal(Object.isFrozen(families), true);
  assert.equal(Object.isFrozen(guarantees), true);
  assert.equal(Object.isFrozen(invariants), true);
  assert.equal(Object.isFrozen(outcomeStatuses), true);
  assert.equal(Object.isFrozen(contracts), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(canonicalIdentity), true);

  assert.throws(() => {
    (families as unknown as string[]).push("dial");
  });
  assert.throws(() => {
    (guarantees as unknown as string[]).push("ui-bound");
  });

  assert.equal(
    getRuntimeExecutiveWorkspaceExperienceContractsRegistry(),
    registry,
  );
  assert.equal(
    getRuntimeExecutiveWorkspaceExperienceContractsGuarantees(),
    guarantees,
  );
  assert.equal(
    getRuntimeExecutiveWorkspaceExperienceContractsInvariants(),
    invariants,
  );
  assert.equal(registry.sectionCount, registry.sections.length);
  assert.equal(registry.invariantCount, 24);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.equal(invariants.length, 24);
});

test("14. architectural boundary: no UI / Three / automotive / dial", () => {
  assert.doesNotMatch(source, /from\s+["']react["']/);
  assert.doesNotMatch(source, /from\s+["']react-dom["']/);
  assert.doesNotMatch(source, /from\s+["']three["']/);
  assert.doesNotMatch(source, /from\s+["']@react-three\//);
  assert.doesNotMatch(source, /\bCadillac\b|\bPorsche\b/);
  assert.doesNotMatch(source, /\bCadillacDial\b|\bPorscheDial\b/);
  assert.doesNotMatch(source, /\buseState\b|\buseEffect\b|\bcreateElement\b/);
  assert.doesNotMatch(source, /Date\.now\s*\(|Math\.random\s*\(/);
  assert.doesNotMatch(source, /localStorage|sessionStorage|indexedDB/);
  assert.doesNotMatch(source, /\bfetch\s*\(/);
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutive(?:Action|Insight|Advisor|Stage)Experience[^"']*["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeEnabledExecutiveExperience[^"']*["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/(?:ex-dri|dri|nol)(?:\/[^"']*)?["']/,
  );

  assert.equal(contracts.rendererIndependent, true);
  assert.equal(contracts.dialIndependent, true);
  assert.equal(contracts.automotiveStylingIndependent, true);
  assert.equal(contracts.themeIndependent, true);
  assert.equal(contracts.stageCoordinateIndependent, true);
  assert.equal(boundary.introducesResolution, false);
  assert.equal(boundary.introducesComposition, false);
  assert.equal(boundary.introducesOrchestration, false);
  assert.equal(boundary.introducesUiBehavior, false);
  assert.equal(boundary.introducesRendering, false);
});

test("15. verification readiness; REX-6:3 not implemented", () => {
  const first = verifyRuntimeExecutiveWorkspaceExperienceContracts();
  const second = verifyRuntimeExecutiveWorkspaceExperienceContracts();
  assert.deepEqual(first, second);
  assert.equal(first.ok, true);
  assert.equal(first.upstreamFoundationOk, true);
  assert.equal(first.frozen, true);
  assert.equal(first.nonLinearTransitionCapable, true);
  assert.equal(first.presentationStateIndependent, true);
  assert.equal(first.dialIndependent, true);
  assert.equal(first.automotiveStylingIndependent, true);
  assert.equal(first.resolutionFree, true);
  assert.equal(first.orchestrationFree, true);
  assert.equal(first.contractFamilyCount, 11);
  assert.equal(first.invariantCount, 24);
  assert.equal(first.sectionCount, 16);
  assert.equal(first.transitionOutcomeStatusCount, 3);
  assert.equal(
    contracts.architecturalStatus,
    "REX-6:2 Runtime Executive Workspace Experience Contracts — ContractsReady",
  );

  // Future-phase mentions in comments are fine; implementations/imports are not.
  assert.doesNotMatch(
    source,
    /from\s+["'][^"']*RuntimeExecutiveWorkspace(?:Context|Mode)Resolution[^"']*["']/,
  );
  assert.doesNotMatch(
    source,
    /export\s+(?:function|const|class)\s+.*(?:resolveRuntimeExecutiveWorkspace|WorkspaceModeResolution)/,
  );
  assert.equal(boundary.introducesResolution, false);

  // empty focus remains valid
  const focus = emptyFocus();
  assert.equal(focus.primarySubject, null);
  assert.equal(focus.relatedSubjects.length, 0);
});
