import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_EXECUTIVE_WORKSPACE_ACTIVATION_STATES as activationStates,
  RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_GUARANTEES as guarantees,
  RUNTIME_EXECUTIVE_WORKSPACE_FOUNDATION_INVARIANTS as invariants,
  RUNTIME_EXECUTIVE_WORKSPACE_INTENTS as intents,
  RUNTIME_EXECUTIVE_WORKSPACE_KINDS as workspaceKinds,
  RUNTIME_EXECUTIVE_WORKSPACE_PRESENTATION_STATES as presentationStates,
  RUNTIME_EXECUTIVE_WORKSPACE_PRESENTATION_STATE_SEPARATION as presentationSeparation,
  RUNTIME_EXECUTIVE_WORKSPACE_SUBJECT_KINDS as subjectKinds,
  RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_PARTICIPATIONS as surfaceParticipations,
  RUNTIME_EXECUTIVE_WORKSPACE_SURFACE_ROLES as surfaceRoles,
  RUNTIME_EXECUTIVE_WORKSPACE_TRANSITION_REASONS as transitionReasons,
  createRuntimeExecutiveWorkspace,
  createRuntimeExecutiveWorkspaceContext,
  createRuntimeExecutiveWorkspaceFocusReference,
  createRuntimeExecutiveWorkspaceId,
  createRuntimeExecutiveWorkspaceSubject,
  createRuntimeExecutiveWorkspaceSurfaceParticipationEntry,
  createRuntimeExecutiveWorkspaceTransition,
  getRuntimeExecutiveWorkspaceExperienceFoundationGuarantees,
  getRuntimeExecutiveWorkspaceExperienceFoundationIdentity,
  getRuntimeExecutiveWorkspaceExperienceFoundationInvariants,
  getRuntimeExecutiveWorkspaceExperienceFoundationRegistry,
  isRuntimeExecutiveWorkspaceActivationState,
  isRuntimeExecutiveWorkspaceFoundationIdentity,
  isRuntimeExecutiveWorkspaceIntent,
  isRuntimeExecutiveWorkspaceKind,
  isRuntimeExecutiveWorkspacePresentationState,
  isRuntimeExecutiveWorkspaceSubjectKind,
  isRuntimeExecutiveWorkspaceSurfaceParticipation,
  isRuntimeExecutiveWorkspaceSurfaceRole,
  isRuntimeExecutiveWorkspaceTransitionReason,
  normalizeRuntimeExecutiveWorkspace,
  runtimeExecutiveWorkspaceExperienceFoundation as foundation,
  runtimeExecutiveWorkspaceExperienceFoundationApiNames as apiNames,
  runtimeExecutiveWorkspaceExperienceFoundationCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveWorkspaceExperienceFoundationRegistry as registry,
  validateRuntimeExecutiveWorkspaceContext,
  verifyRuntimeExecutiveWorkspaceExperienceFoundation,
} from "./runtimeExecutiveWorkspaceExperienceFoundation.ts";

import {
  RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES,
  runtimeExecutiveActionExperiencePublicIndexIdentity,
  runtimeExecutiveActionExperiencePublicIndexSupportedImportPath,
  verifyRuntimeExecutiveActionExperiencePublicIndex,
} from "@/app/lib/rex/runtimeExecutiveActionExperiencePublicIndex";

const source = readFileSync(
  new URL(
    "./runtimeExecutiveWorkspaceExperienceFoundation.ts",
    import.meta.url,
  ),
  "utf8",
);

function decisionWorkspaceContext(
  overrides?: Partial<
    Parameters<typeof createRuntimeExecutiveWorkspaceContext>[0]
  >,
) {
  return createRuntimeExecutiveWorkspaceContext({
    kind: "decision",
    subject: createRuntimeExecutiveWorkspaceSubject({
      kind: "decision",
      id: "decision.increase-capacity",
      label: "Increase Capacity",
    }),
    intent: "evaluate",
    focus: createRuntimeExecutiveWorkspaceFocusReference({
      id: "object.project-alpha",
      kind: "object",
    }),
    presentationState: "report",
    activationState: "active",
    ...overrides,
  });
}

test("1. exact identity / version / namespace / phase / role", () => {
  assert.equal(
    foundation.identity,
    "REX-6:1/RuntimeExecutiveWorkspaceExperienceFoundation",
  );
  assert.equal(foundation.version, "6.1.0");
  assert.equal(
    foundation.namespace,
    "nexora.rex.workspace-experience.foundation",
  );
  assert.equal(foundation.phase, "Foundation");
  assert.equal(
    foundation.architecturalRole,
    "RuntimeExecutiveWorkspaceExperienceFoundation",
  );
  assert.equal(
    isRuntimeExecutiveWorkspaceFoundationIdentity(foundation.identity),
    true,
  );
  assert.equal(
    isRuntimeExecutiveWorkspaceFoundationIdentity("REX-5:1/other"),
    false,
  );
  assert.deepEqual(
    getRuntimeExecutiveWorkspaceExperienceFoundationIdentity(),
    canonicalIdentity,
  );
});

test("2. sole immediate dependency is REX-5:9 public index", () => {
  assert.equal(
    foundation.upstreamDependency,
    "REX-5:9/RuntimeExecutiveActionExperiencePublicIndex",
  );
  assert.equal(
    foundation.upstreamDependency,
    runtimeExecutiveActionExperiencePublicIndexIdentity,
  );
  assert.equal(
    foundation.dependencyPath,
    runtimeExecutiveActionExperiencePublicIndexSupportedImportPath,
  );
  assert.equal(boundary.consumesPublicIndexOnly, true);
  assert.equal(boundary.importsRex5InternalDirectly, false);
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
    "@/app/lib/rex/runtimeExecutiveActionExperiencePublicIndex",
  ]);

  const upstream = verifyRuntimeExecutiveActionExperiencePublicIndex();
  assert.equal(upstream.valid, true);
  assert.equal(upstream.readyForConsumer, true);
});

test("3. canonical workspace-kind vocabulary and ordering", () => {
  assert.deepEqual([...workspaceKinds], [
    "overview",
    "problem",
    "scenario",
    "decision",
    "execution",
  ]);
  assert.equal(new Set(workspaceKinds).size, workspaceKinds.length);
  assert.equal(workspaceKinds.length > 0, true);
  assert.equal(isRuntimeExecutiveWorkspaceKind("decision"), true);
  assert.equal(isRuntimeExecutiveWorkspaceKind("cockpit"), false);
  assert.equal(isRuntimeExecutiveWorkspaceKind("cadillac"), false);
  assert.equal(registry.workspaceKindCount, 5);
  assert.equal(registry.workspaceKindCount, workspaceKinds.length);
});

test("4. canonical surface roles and uniqueness", () => {
  assert.deepEqual([...surfaceRoles], [
    "stage",
    "advisor",
    "insight",
    "action",
  ]);
  assert.equal(new Set(surfaceRoles).size, surfaceRoles.length);
  assert.equal(isRuntimeExecutiveWorkspaceSurfaceRole("stage"), true);
  assert.equal(isRuntimeExecutiveWorkspaceSurfaceRole("dial"), false);
  assert.equal(registry.surfaceRoleCount, 4);
  assert.equal(registry.surfaceRoleCount, surfaceRoles.length);
});

test("5. activation states vocabulary and uniqueness", () => {
  assert.deepEqual([...activationStates], [
    "inactive",
    "entering",
    "active",
    "leaving",
  ]);
  assert.equal(new Set(activationStates).size, activationStates.length);
  assert.equal(isRuntimeExecutiveWorkspaceActivationState("active"), true);
  assert.equal(isRuntimeExecutiveWorkspaceActivationState("animating"), false);
  assert.equal(registry.activationStateCount, 4);
});

test("6. executive intents vocabulary and uniqueness", () => {
  assert.deepEqual([...intents], [
    "observe",
    "investigate",
    "explore",
    "evaluate",
    "decide",
    "execute",
  ]);
  assert.equal(new Set(intents).size, intents.length);
  assert.equal(isRuntimeExecutiveWorkspaceIntent("investigate"), true);
  assert.equal(isRuntimeExecutiveWorkspaceIntent("dispatch"), false);
  assert.equal(registry.intentCount, 6);
});

test("7. transition reasons vocabulary and uniqueness", () => {
  assert.deepEqual([...transitionReasons], [
    "user-request",
    "runtime-guidance",
    "subject-selection",
    "action-result",
    "context-change",
    "restore",
  ]);
  assert.equal(new Set(transitionReasons).size, transitionReasons.length);
  assert.equal(
    isRuntimeExecutiveWorkspaceTransitionReason("user-request"),
    true,
  );
  assert.equal(
    isRuntimeExecutiveWorkspaceTransitionReason("auto-pilot"),
    false,
  );
  assert.equal(registry.transitionReasonCount, 6);
});

test("8. subject kinds are reference-oriented", () => {
  assert.deepEqual([...subjectKinds], [
    "workspace",
    "goal",
    "object",
    "problem",
    "scenario",
    "decision",
    "execution",
  ]);
  assert.equal(new Set(subjectKinds).size, subjectKinds.length);
  assert.equal(isRuntimeExecutiveWorkspaceSubjectKind("object"), true);
  assert.equal(isRuntimeExecutiveWorkspaceSubjectKind("kor"), false);

  const subject = createRuntimeExecutiveWorkspaceSubject({
    kind: "problem",
    id: "problem.capacity-risk",
    label: "Capacity Risk",
    referenceId: "nexora.problem.capacity-risk",
  });
  assert.equal(subject.kind, "problem");
  assert.equal(subject.id, "problem.capacity-risk");
  assert.equal(Object.isFrozen(subject), true);
  assert.equal(registry.subjectKindCount, 7);
});

test("9. workspace and presentation state remain independent dimensions", () => {
  assert.deepEqual([...presentationStates], ["minimum", "report", "operation"]);
  assert.equal(
    presentationStates,
    RUNTIME_EXECUTIVE_ACTION_PRESENTATION_STATES,
  );
  assert.equal(presentationSeparation.dimensionsIndependent, true);
  assert.equal(presentationSeparation.redefinesPresentationSemantics, false);
  assert.equal(isRuntimeExecutiveWorkspacePresentationState("report"), true);
  assert.equal(isRuntimeExecutiveWorkspacePresentationState("decision"), false);

  const decisionReport = createRuntimeExecutiveWorkspace({
    workspaceId: createRuntimeExecutiveWorkspaceId({ key: "alpha.decision" }),
    kind: "decision",
    subject: createRuntimeExecutiveWorkspaceSubject({
      kind: "decision",
      id: "decision.increase-capacity",
    }),
    intent: "evaluate",
    focus: createRuntimeExecutiveWorkspaceFocusReference({
      id: "object.project-alpha",
      kind: "object",
    }),
    presentationState: "report",
    activationState: "active",
  });
  assert.equal(decisionReport.kind, "decision");
  assert.equal(decisionReport.presentationState, "report");

  const executionOperation = createRuntimeExecutiveWorkspace({
    workspaceId: createRuntimeExecutiveWorkspaceId({ key: "alpha.execution" }),
    kind: "execution",
    subject: createRuntimeExecutiveWorkspaceSubject({
      kind: "execution",
      id: "execution.capacity-plan",
    }),
    intent: "execute",
    focus: createRuntimeExecutiveWorkspaceFocusReference({
      id: "execution.capacity-plan",
      kind: "execution",
    }),
    presentationState: "operation",
    activationState: "active",
  });
  assert.equal(executionOperation.kind, "execution");
  assert.equal(executionOperation.presentationState, "operation");
});

test("10. surface participation vocabulary (resolution deferred)", () => {
  assert.deepEqual([...surfaceParticipations], [
    "primary",
    "supporting",
    "contextual",
    "inactive",
  ]);
  assert.equal(
    isRuntimeExecutiveWorkspaceSurfaceParticipation("primary"),
    true,
  );
  assert.equal(
    isRuntimeExecutiveWorkspaceSurfaceParticipation("hero"),
    false,
  );

  const stage = createRuntimeExecutiveWorkspaceSurfaceParticipationEntry({
    role: "stage",
    participation: "primary",
  });
  const advisor = createRuntimeExecutiveWorkspaceSurfaceParticipationEntry({
    role: "advisor",
    participation: "supporting",
  });
  const insight = createRuntimeExecutiveWorkspaceSurfaceParticipationEntry({
    role: "insight",
    participation: "supporting",
  });
  const action = createRuntimeExecutiveWorkspaceSurfaceParticipationEntry({
    role: "action",
    participation: "contextual",
  });
  assert.deepEqual(
    [stage, advisor, insight, action].map((entry) => entry.participation),
    ["primary", "supporting", "supporting", "contextual"],
  );
  assert.equal(boundary.duplicatesStageBehavior, false);
  assert.equal(boundary.duplicatesAdvisorBehavior, false);
  assert.equal(boundary.duplicatesInsightBehavior, false);
  assert.equal(boundary.duplicatesActionBehavior, false);
});

test("11. transitions are non-linear and foundational only", () => {
  const problem = decisionWorkspaceContext({
    kind: "problem",
    intent: "investigate",
    subject: createRuntimeExecutiveWorkspaceSubject({
      kind: "problem",
      id: "problem.capacity-risk",
    }),
  });
  const scenario = decisionWorkspaceContext({
    kind: "scenario",
    intent: "explore",
    subject: createRuntimeExecutiveWorkspaceSubject({
      kind: "scenario",
      id: "scenario.capacity-options",
    }),
  });
  const decision = decisionWorkspaceContext();
  const execution = decisionWorkspaceContext({
    kind: "execution",
    intent: "execute",
    presentationState: "operation",
    subject: createRuntimeExecutiveWorkspaceSubject({
      kind: "execution",
      id: "execution.capacity-plan",
    }),
  });
  const overview = decisionWorkspaceContext({
    kind: "overview",
    intent: "observe",
    subject: createRuntimeExecutiveWorkspaceSubject({
      kind: "workspace",
      id: "workspace.alpha",
    }),
  });

  const linear = createRuntimeExecutiveWorkspaceTransition({
    from: problem,
    to: scenario,
    reason: "runtime-guidance",
  });
  const decisionToScenario = createRuntimeExecutiveWorkspaceTransition({
    from: decision,
    to: scenario,
    reason: "user-request",
  });
  const executionToDecision = createRuntimeExecutiveWorkspaceTransition({
    from: execution,
    to: decision,
    reason: "context-change",
  });
  const scenarioToProblem = createRuntimeExecutiveWorkspaceTransition({
    from: scenario,
    to: problem,
    reason: "subject-selection",
  });
  const problemToOverview = createRuntimeExecutiveWorkspaceTransition({
    from: problem,
    to: overview,
    reason: "restore",
  });

  assert.equal(linear.from.kind, "problem");
  assert.equal(linear.to.kind, "scenario");
  assert.equal(decisionToScenario.from.kind, "decision");
  assert.equal(decisionToScenario.to.kind, "scenario");
  assert.equal(executionToDecision.from.kind, "execution");
  assert.equal(executionToDecision.to.kind, "decision");
  assert.equal(scenarioToProblem.from.kind, "scenario");
  assert.equal(scenarioToProblem.to.kind, "problem");
  assert.equal(problemToOverview.from.kind, "problem");
  assert.equal(problemToOverview.to.kind, "overview");
  assert.equal(Object.isFrozen(linear), true);
});

test("12. validation helpers accept valid and reject invalid values", () => {
  assert.equal(isRuntimeExecutiveWorkspaceKind("overview"), true);
  assert.equal(isRuntimeExecutiveWorkspaceKind(1 as unknown as string), false);
  assert.equal(isRuntimeExecutiveWorkspaceSurfaceRole("action"), true);
  assert.equal(isRuntimeExecutiveWorkspaceSurfaceRole("render"), false);
  assert.equal(isRuntimeExecutiveWorkspaceActivationState("leaving"), true);
  assert.equal(isRuntimeExecutiveWorkspaceActivationState("done"), false);
  assert.equal(isRuntimeExecutiveWorkspaceIntent("decide"), true);
  assert.equal(isRuntimeExecutiveWorkspaceIntent("commit"), false);
  assert.equal(
    isRuntimeExecutiveWorkspaceTransitionReason("action-result"),
    true,
  );
  assert.equal(
    isRuntimeExecutiveWorkspaceTransitionReason("magic"),
    false,
  );

  const valid = validateRuntimeExecutiveWorkspaceContext(
    decisionWorkspaceContext(),
  );
  assert.equal(valid.ok, true);
  assert.equal(valid.issues.length, 0);

  const invalid = validateRuntimeExecutiveWorkspaceContext({
    kind: "cockpit",
    intent: "dispatch",
    presentationState: "decision",
    activationState: "animating",
    subject: { kind: "kor", id: "" },
    focus: { id: "" },
  });
  assert.equal(invalid.ok, false);
  assert.ok(
    invalid.issues.some((entry) => entry.code === "invalid-workspace-kind"),
  );
  assert.ok(invalid.issues.some((entry) => entry.code === "invalid-intent"));
  assert.ok(
    invalid.issues.some((entry) => entry.code === "invalid-presentation-state"),
  );
  assert.ok(
    invalid.issues.some((entry) => entry.code === "invalid-activation-state"),
  );
  assert.ok(
    invalid.issues.some((entry) => entry.code === "invalid-subject-kind"),
  );
});

test("13. mutation safety of canonical collections", () => {
  assert.equal(Object.isFrozen(workspaceKinds), true);
  assert.equal(Object.isFrozen(surfaceRoles), true);
  assert.equal(Object.isFrozen(activationStates), true);
  assert.equal(Object.isFrozen(intents), true);
  assert.equal(Object.isFrozen(transitionReasons), true);
  assert.equal(Object.isFrozen(subjectKinds), true);
  assert.equal(Object.isFrozen(surfaceParticipations), true);
  assert.equal(Object.isFrozen(presentationStates), true);
  assert.equal(Object.isFrozen(guarantees), true);
  assert.equal(Object.isFrozen(invariants), true);
  assert.equal(Object.isFrozen(foundation), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(canonicalIdentity), true);

  assert.throws(() => {
    (workspaceKinds as unknown as string[]).push("cockpit");
  });
  assert.throws(() => {
    (surfaceRoles as unknown as string[]).push("dial");
  });
  assert.throws(() => {
    (intents as unknown as string[]).push("dispatch");
  });

  const workspace = createRuntimeExecutiveWorkspace({
    workspaceId: createRuntimeExecutiveWorkspaceId({ key: "alpha" }),
    kind: "overview",
    subject: createRuntimeExecutiveWorkspaceSubject({
      kind: "workspace",
      id: "workspace.alpha",
    }),
    intent: "observe",
    focus: createRuntimeExecutiveWorkspaceFocusReference({
      id: "workspace.alpha",
      kind: "workspace",
    }),
    presentationState: "minimum",
  });
  assert.equal(Object.isFrozen(workspace), true);
  assert.equal(Object.isFrozen(workspace.subject), true);
  assert.equal(workspace.activationState, "inactive");
});

test("14. registry counts derive from canonical definitions", () => {
  const viaGetter = getRuntimeExecutiveWorkspaceExperienceFoundationRegistry();
  assert.equal(viaGetter, registry);
  assert.equal(
    getRuntimeExecutiveWorkspaceExperienceFoundationGuarantees(),
    guarantees,
  );
  assert.equal(
    getRuntimeExecutiveWorkspaceExperienceFoundationInvariants(),
    invariants,
  );

  assert.equal(registry.workspaceKindCount, workspaceKinds.length);
  assert.equal(registry.subjectKindCount, subjectKinds.length);
  assert.equal(registry.activationStateCount, activationStates.length);
  assert.equal(registry.surfaceRoleCount, surfaceRoles.length);
  assert.equal(
    registry.surfaceParticipationCount,
    surfaceParticipations.length,
  );
  assert.equal(registry.intentCount, intents.length);
  assert.equal(registry.transitionReasonCount, transitionReasons.length);
  assert.equal(registry.presentationStateCount, presentationStates.length);
  assert.equal(registry.guaranteeCount, guarantees.length);
  assert.equal(registry.invariantCount, invariants.length);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.equal(registry.sectionCount, registry.sections.length);
  assert.deepEqual([...registry.sections], [
    "Identity",
    "WorkspaceKinds",
    "SubjectKinds",
    "ActivationStates",
    "SurfaceRoles",
    "SurfaceParticipations",
    "Intents",
    "TransitionReasons",
    "PresentationStates",
    "Invariants",
    "PublicAPIs",
    "Guarantees",
  ]);
  assert.equal(registry.sectionCount, 12);
  assert.equal(registry.invariantCount, 18);
});

test("15. architectural boundary: no UI / Three / automotive freeze", () => {
  assert.doesNotMatch(source, /from\s+["']react["']/);
  assert.doesNotMatch(source, /from\s+["']react-dom["']/);
  assert.doesNotMatch(source, /from\s+["']three["']/);
  assert.doesNotMatch(source, /from\s+["']@react-three\//);
  assert.doesNotMatch(source, /\bCadillacWorkspace\b|\bPorscheWorkspace\b/);
  assert.doesNotMatch(source, /\bCadillacDial\b|\bPorscheDial\b/);
  assert.doesNotMatch(source, /\buseState\b|\buseEffect\b|\bcreateElement\b/);
  assert.doesNotMatch(source, /Date\.now\s*\(|Math\.random\s*\(/);
  assert.doesNotMatch(source, /localStorage|sessionStorage|indexedDB/);
  assert.doesNotMatch(source, /\bfetch\s*\(/);
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveActionExperience(?!PublicIndex)[^"']*["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutive(?:Insight|Advisor|Stage)Experience[^"']*["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeEnabledExecutiveExperience[^"']*["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/(?:ex-dri|dri|nol)(?:\/[^"']*)?["']/,
  );

  assert.equal(foundation.rendererIndependent, true);
  assert.equal(foundation.selectorUiIndependent, true);
  assert.equal(foundation.automotiveStylingIndependent, true);
  assert.equal(foundation.themeIndependent, true);
  assert.equal(boundary.introducesRendering, false);
  assert.equal(boundary.introducesUiBehavior, false);
  assert.equal(boundary.introducesWorkspaceDial, false);
  assert.equal(boundary.introducesOrchestration, false);
  assert.equal(boundary.automotiveStylingIndependent, true);
});

test("16. invariants manifest covers required guarantees", () => {
  assert.equal(invariants.length, 18);
  assert.deepEqual(
    invariants.map((entry) => entry.id),
    [
      "workspace-kinds-unique",
      "workspace-ordering-deterministic",
      "workspace-kinds-non-empty",
      "surface-roles-unique",
      "surface-roles-deterministic",
      "executive-intents-unique",
      "activation-states-unique",
      "transition-reasons-unique",
      "workspace-presentation-state-separated",
      "workspace-subjects-are-references",
      "workspace-selection-ui-independent",
      "no-automotive-styling-dependency",
      "does-not-duplicate-stage",
      "does-not-duplicate-advisor",
      "does-not-duplicate-insight",
      "does-not-duplicate-action",
      "foundation-deterministic",
      "canonical-definitions-mutation-safe",
    ],
  );
  assert.ok(
    invariants.every((entry, index) => entry.order === index + 1),
  );
});

test("17. normalization and verification readiness for later REX-6 phases", () => {
  const first = verifyRuntimeExecutiveWorkspaceExperienceFoundation();
  const second = verifyRuntimeExecutiveWorkspaceExperienceFoundation();
  assert.deepEqual(first, second);
  assert.equal(first.ok, true);
  assert.equal(first.upstreamConsumerEntryOk, true);
  assert.equal(first.frozen, true);
  assert.equal(first.presentationStateSeparated, true);
  assert.equal(first.doesNotDuplicateSurfaces, true);
  assert.equal(first.selectorUiIndependent, true);
  assert.equal(first.automotiveStylingIndependent, true);
  assert.equal(first.workspaceKindCount, 5);
  assert.equal(first.subjectKindCount, 7);
  assert.equal(first.activationStateCount, 4);
  assert.equal(first.surfaceRoleCount, 4);
  assert.equal(first.surfaceParticipationCount, 4);
  assert.equal(first.intentCount, 6);
  assert.equal(first.transitionReasonCount, 6);
  assert.equal(first.presentationStateCount, 3);
  assert.equal(first.guaranteeCount, 10);
  assert.equal(first.sectionCount, 12);
  assert.equal(first.invariantCount, 18);
  assert.equal(
    foundation.architecturalStatus,
    "REX-6:1 Runtime Executive Workspace Experience Foundation — FoundationReady",
  );

  const normalized = normalizeRuntimeExecutiveWorkspace(
    createRuntimeExecutiveWorkspace({
      workspaceId: "  workspace.alpha  ",
      kind: "overview",
      subject: createRuntimeExecutiveWorkspaceSubject({
        kind: "workspace",
        id: "  workspace.alpha  ",
        label: "  Alpha  ",
      }),
      intent: "observe",
      focus: createRuntimeExecutiveWorkspaceFocusReference({
        id: "  workspace.alpha  ",
        kind: "workspace",
      }),
      presentationState: "minimum",
      activationState: "entering",
    }),
  );
  assert.equal(normalized.workspaceId, "workspace.alpha");
  assert.equal(normalized.subject.id, "workspace.alpha");
  assert.equal(normalized.subject.label, "Alpha");
  assert.equal(normalized.focus.id, "workspace.alpha");
  assert.equal(
    normalized.foundationIdentity,
    "REX-6:1/RuntimeExecutiveWorkspaceExperienceFoundation",
  );
  assert.equal(normalized.foundationVersion, "6.1.0");

  // REX-6:2 contracts were not implemented in this foundation module.
  assert.doesNotMatch(source, /REX-6:2/);
  assert.doesNotMatch(
    source,
    /RuntimeExecutiveWorkspaceExperienceContracts/,
  );
});
