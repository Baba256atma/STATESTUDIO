import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_WORKSPACE_COMPOSITION_INTENTS as compositionIntents,
  EXECUTIVE_WORKSPACE_DIAL_STATUSES as dialStatuses,
  EXECUTIVE_WORKSPACE_FOCUS_POLICIES as focusPolicies,
  EXECUTIVE_WORKSPACE_KINDS as workspaceKinds,
  EXECUTIVE_WORKSPACE_RAPID_INPUT_POLICY as rapidInputPolicy,
  EXECUTIVE_WORKSPACE_REACTION_KINDS as reactionKinds,
  EXECUTIVE_WORKSPACE_SELECTION_REASONS as selectionReasons,
  EXECUTIVE_WORKSPACE_TRANSITION_STATUSES as transitionStatuses,
  WORKSPACE_DIAL_EXPERIENCE_SWITCHING_BOUNDARY as boundary,
  WORKSPACE_DIAL_EXPERIENCE_SWITCHING_FORBIDDEN_RESPONSIBILITIES as forbiddenResponsibilities,
  WORKSPACE_DIAL_EXPERIENCE_SWITCHING_GUARANTEES as guarantees,
  cancelExecutiveWorkspaceTransition,
  completeExecutiveWorkspaceTransition,
  createExecutiveWorkspaceReference,
  createExecutiveWorkspaceSelectionIntent,
  getWorkspaceDialExperienceSwitchingIdentity,
  isExecutiveWorkspaceDialStatus,
  isExecutiveWorkspaceKind,
  isExecutiveWorkspaceReactionKind,
  isExecutiveWorkspaceSelectionReason,
  isExecutiveWorkspaceTransitionStatus,
  isSubjectCompatibleWithWorkspace,
  planExecutiveWorkspaceTransition,
  resolveExecutiveWorkspaceDialOptions,
  resolveExecutiveWorkspaceDialState,
  resolveExecutiveWorkspaceExperience,
  resolveExecutiveWorkspaceSelection,
  resolveExecutiveWorkspaceStageIntent,
  startExecutiveWorkspaceTransition,
  validateExecutiveWorkspaceExperience,
  verifyWorkspaceDialExperienceSwitching,
  workspaceDialExperienceSwitching as dialModule,
  workspaceDialExperienceSwitchingApiNames as apiNames,
  workspaceDialExperienceSwitchingCanonicalIdentity as canonicalIdentity,
} from "./workspaceDialExperienceSwitching.ts";

import {
  createExecutiveCockpitIntegrationSnapshot,
  resolveCockpitShellRuntimeBinding,
  type CockpitShellRuntimeSnapshot,
} from "./executiveStageIntegration.ts";

const source = readFileSync(
  new URL("./workspaceDialExperienceSwitching.ts", import.meta.url),
  "utf8",
);

function makeCockpit(input: {
  readonly activeWorkspace?: string;
  readonly focusedSubject?: { readonly id: string; readonly kind: "goal" | "object" | "problem" | "scenario" | "decision" | "execution" };
  readonly selectedSubject?: { readonly id: string; readonly kind: "goal" | "object" | "problem" | "scenario" | "decision" | "execution" };
  readonly status?: "idle" | "ready" | "active" | "transitioning" | "unavailable";
} = {}): CockpitShellRuntimeSnapshot {
  return resolveCockpitShellRuntimeBinding(
    createExecutiveCockpitIntegrationSnapshot({
      context: {
        workspaceId: "ws.demo",
        activeSurface: "workspace-dial",
        activeWorkspace: input.activeWorkspace ?? "overview",
        selectedSubjectId: input.selectedSubject?.id,
        focusedSubjectId: input.focusedSubject?.id,
        presentationState: "report",
      },
      state: {
        activeSurface: "workspace-dial",
        activeWorkspace: input.activeWorkspace ?? "overview",
        selectedSubject: input.selectedSubject,
        focusedSubject: input.focusedSubject,
        presentationState: "report",
        status: input.status ?? "ready",
      },
    }),
  );
}

test("1. identity metadata", () => {
  assert.equal(
    dialModule.identity,
    "NEX-CI:4/WorkspaceDialExperienceSwitching",
  );
  assert.equal(canonicalIdentity.identity, dialModule.identity);
  assert.deepEqual(
    getWorkspaceDialExperienceSwitchingIdentity(),
    canonicalIdentity,
  );
});

test("2. version / namespace / phase / architectural role", () => {
  assert.equal(dialModule.version, "1.4.0");
  assert.equal(
    dialModule.namespace,
    "nexora.executive.cockpit.integration.workspace-dial",
  );
  assert.equal(dialModule.phase, "WorkspaceDialExperienceSwitching");
  assert.equal(
    dialModule.architecturalRole,
    "WorkspaceDialExperienceSwitching",
  );
});

test("3. sole immediate dependency is NEX-CI:3", () => {
  assert.equal(
    dialModule.upstreamDependency,
    "NEX-CI:3/ExecutiveStageIntegration",
  );
  assert.equal(
    dialModule.dependencyPath,
    "@/app/lib/nex-ci/executiveStageIntegration",
  );
  assert.equal(boundary.consumesNexCi3Only, true);

  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.ok(imports.length >= 1);
  assert.ok(
    imports.every(
      (entry) => entry === "@/app/lib/nex-ci/executiveStageIntegration",
    ),
  );
});

test("4. forbidden direct dependency boundaries", () => {
  assert.doesNotMatch(source, /from\s+["']@\/app\/lib\/nol(?:\/[^"']*)?["']/);
  assert.doesNotMatch(source, /from\s+["']@\/app\/lib\/dri(?:\/[^"']*)?["']/);
  assert.doesNotMatch(source, /from\s+["']@\/app\/lib\/ex-dri(?:\/[^"']*)?["']/);
  assert.doesNotMatch(source, /from\s+["']@\/app\/lib\/rex(?:\/[^"']*)?["']/);
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/nex-ci\/(?:executiveCockpitIntegrationFoundation|cockpitShellRuntimeBinding)["']/,
  );
  assert.equal(boundary.bypassesIntoNexCi2, false);
  assert.equal(boundary.bypassesIntoNexCi1, false);
  assert.equal(boundary.implementsNexCi5, false);
});

test("5. workspace vocabulary aligned with REX kinds", () => {
  assert.deepEqual([...workspaceKinds], [
    "overview",
    "problem",
    "scenario",
    "decision",
    "execution",
  ]);
  assert.equal(isExecutiveWorkspaceKind("problem"), true);
  assert.equal(isExecutiveWorkspaceKind("goal"), false);
  assert.ok(
    dialModule.workspaceVocabularySource.includes("REX"),
  );
});

test("6. Dial / transition / selection / reaction vocabularies", () => {
  assert.deepEqual([...dialStatuses], [
    "idle",
    "ready",
    "selecting",
    "transitioning",
    "active",
    "unavailable",
  ]);
  assert.deepEqual([...transitionStatuses], [
    "planned",
    "starting",
    "transitioning",
    "completed",
    "cancelled",
    "rejected",
  ]);
  assert.deepEqual([...selectionReasons], [
    "accepted",
    "already-active",
    "unknown-workspace",
    "disabled",
    "unavailable",
    "transition-in-progress",
  ]);
  assert.deepEqual([...reactionKinds], [
    "workspace-selection-accepted",
    "workspace-selection-rejected",
    "workspace-transition-start",
    "workspace-context-update",
    "stage-recompose",
    "scene-theme-change",
    "workspace-transition-complete",
    "workspace-transition-cancel",
  ]);
  assert.equal(dialStatuses.length, 6);
  assert.equal(transitionStatuses.length, 6);
  assert.equal(selectionReasons.length, 6);
  assert.equal(reactionKinds.length, 8);
  assert.equal(compositionIntents.length, 5);
  assert.equal(focusPolicies.length, 3);
  assert.equal(isExecutiveWorkspaceDialStatus("transitioning"), true);
  assert.equal(isExecutiveWorkspaceTransitionStatus("completed"), true);
  assert.equal(isExecutiveWorkspaceSelectionReason("already-active"), true);
  assert.equal(isExecutiveWorkspaceReactionKind("scene-theme-change"), true);
});

test("7. Dial options uniqueness and deterministic order", () => {
  const options = resolveExecutiveWorkspaceDialOptions();
  assert.equal(options.length, 5);
  assert.deepEqual(
    options.map((option) => option.workspace.kind),
    [...workspaceKinds],
  );
  assert.deepEqual(
    options.map((option) => option.order),
    [0, 1, 2, 3, 4],
  );
  assert.equal(new Set(options.map((o) => o.workspace.id)).size, 5);
  assert.equal(Object.isFrozen(options), true);
  assert.throws(() => {
    (options as unknown as unknown[]).push({});
  });
});

test("8. initial Dial state", () => {
  const cockpit = makeCockpit({ activeWorkspace: "overview" });
  const dial = resolveExecutiveWorkspaceDialState({
    currentWorkspace: createExecutiveWorkspaceReference("overview"),
    cockpitStatus: cockpit.binding.integrationStatus,
  });
  assert.equal(dial.status, "active");
  assert.equal(dial.currentWorkspace?.kind, "overview");
  assert.equal(dial.targetWorkspace, undefined);
  assert.equal(dial.selectedOptionId, "workspace.overview");
  assert.equal(dial.options.length, 5);
  assert.equal("angle" in dial, false);
  assert.equal("rotation" in dial, false);
});

test("9. valid selection and current vs target separation", () => {
  const cockpit = makeCockpit({ activeWorkspace: "overview" });
  const experience = resolveExecutiveWorkspaceExperience({
    cockpit,
    intent: createExecutiveWorkspaceSelectionIntent("workspace.problem"),
  });
  assert.equal(experience.currentWorkspace?.kind, "overview");
  assert.equal(experience.targetWorkspace?.kind, "problem");
  assert.notEqual(
    experience.currentWorkspace?.id,
    experience.targetWorkspace?.id,
  );
  assert.equal(experience.dial.status, "transitioning");
  assert.equal(experience.transition?.status, "transitioning");
  assert.equal(experience.transition?.to.kind, "problem");
  assert.ok(
    experience.reactions.some(
      (reaction) => reaction.kind === "workspace-selection-accepted",
    ),
  );
  assert.ok(
    experience.reactions.some(
      (reaction) => reaction.kind === "workspace-transition-start",
    ),
  );
});

test("10. unknown / disabled / unavailable rejection", () => {
  const cockpit = makeCockpit();
  const dial = resolveExecutiveWorkspaceDialState({
    currentWorkspace: createExecutiveWorkspaceReference("overview"),
    optionAvailability: {
      scenario: { enabled: false },
      decision: { available: false },
    },
  });

  assert.equal(
    resolveExecutiveWorkspaceSelection(
      dial,
      createExecutiveWorkspaceSelectionIntent("workspace.unknown"),
    ).reason,
    "unknown-workspace",
  );
  assert.equal(
    resolveExecutiveWorkspaceSelection(
      dial,
      createExecutiveWorkspaceSelectionIntent("workspace.scenario"),
    ).reason,
    "disabled",
  );
  assert.equal(
    resolveExecutiveWorkspaceSelection(
      dial,
      createExecutiveWorkspaceSelectionIntent("workspace.decision"),
    ).reason,
    "unavailable",
  );

  const rejected = resolveExecutiveWorkspaceExperience({
    cockpit,
    intent: createExecutiveWorkspaceSelectionIntent("workspace.unknown"),
  });
  assert.equal(rejected.targetWorkspace, undefined);
  assert.equal(rejected.transition, undefined);
  assert.ok(
    rejected.reactions.some(
      (reaction) => reaction.kind === "workspace-selection-rejected",
    ),
  );
});

test("11. same-workspace selection", () => {
  const cockpit = makeCockpit({ activeWorkspace: "problem" });
  const experience = resolveExecutiveWorkspaceExperience({
    cockpit,
    currentWorkspace: createExecutiveWorkspaceReference("problem"),
    intent: createExecutiveWorkspaceSelectionIntent("workspace.problem"),
  });
  assert.equal(experience.targetWorkspace, undefined);
  assert.equal(experience.transition, undefined);
  assert.equal(experience.currentWorkspace?.kind, "problem");
  assert.equal(
    experience.reactions.some(
      (reaction) => reaction.kind === "workspace-transition-start",
    ),
    false,
  );
});

test("12. transition planning / start / complete / cancel", () => {
  const cockpit = makeCockpit({ activeWorkspace: "overview" });
  const dial = resolveExecutiveWorkspaceDialState({
    currentWorkspace: createExecutiveWorkspaceReference("overview"),
  });
  const selection = resolveExecutiveWorkspaceSelection(
    dial,
    createExecutiveWorkspaceSelectionIntent("execution"),
  );
  assert.equal(selection.accepted, true);

  const planned = planExecutiveWorkspaceTransition(
    createExecutiveWorkspaceReference("overview"),
    selection,
    cockpit,
  );
  assert.equal(planned.status, "planned");
  assert.equal(planned.from?.kind, "overview");
  assert.equal(planned.to.kind, "execution");
  assert.equal(planned.stageIntent.sceneTheme?.themeKey, "execution");
  assert.equal(planned.experienceIntent.emphasis, "operational");

  const started = startExecutiveWorkspaceTransition(planned);
  assert.equal(started.status, "transitioning");

  const completed = completeExecutiveWorkspaceTransition(started);
  assert.equal(completed.status, "completed");

  const cancellable = startExecutiveWorkspaceTransition(planned);
  const cancelled = cancelExecutiveWorkspaceTransition(cancellable);
  assert.equal(cancelled.status, "cancelled");
});

test("13. transition completion commits target as current", () => {
  const cockpit = makeCockpit({ activeWorkspace: "overview" });
  const transitioning = resolveExecutiveWorkspaceExperience({
    cockpit,
    intent: createExecutiveWorkspaceSelectionIntent("workspace.decision"),
  });
  assert.ok(transitioning.transition);

  const completed = resolveExecutiveWorkspaceExperience({
    cockpit,
    transition: transitioning.transition,
    action: "complete",
  });
  assert.equal(completed.currentWorkspace?.kind, "decision");
  assert.equal(completed.targetWorkspace, undefined);
  assert.equal(completed.transition?.status, "completed");
  assert.ok(
    completed.reactions.some(
      (reaction) => reaction.kind === "workspace-transition-complete",
    ),
  );
});

test("14. rapid-input policy rejects during transition", () => {
  assert.equal(rapidInputPolicy, "reject-until-transition-completes");
  const cockpit = makeCockpit({ activeWorkspace: "overview" });
  const first = resolveExecutiveWorkspaceExperience({
    cockpit,
    intent: createExecutiveWorkspaceSelectionIntent("workspace.problem"),
  });
  assert.ok(first.transition);

  const second = resolveExecutiveWorkspaceExperience({
    cockpit,
    transition: first.transition,
    intent: createExecutiveWorkspaceSelectionIntent("workspace.scenario"),
  });
  assert.equal(second.targetWorkspace?.kind, "problem");
  assert.ok(
    second.reactions.some(
      (reaction) => reaction.kind === "workspace-selection-rejected",
    ),
  );
});

test("15. Stage recomposition and semantic scene-theme intent", () => {
  const cockpit = makeCockpit({
    activeWorkspace: "overview",
    focusedSubject: { id: "object-1", kind: "object" },
  });
  const experience = resolveExecutiveWorkspaceExperience({
    cockpit,
    intent: createExecutiveWorkspaceSelectionIntent("workspace.scenario"),
  });
  assert.ok(experience.transition);
  assert.equal(
    experience.transition.stageIntent.sceneTheme?.themeKey,
    "scenario",
  );
  assert.equal(
    experience.transition.stageIntent.sceneTheme?.workspaceId,
    "workspace.scenario",
  );
  assert.doesNotMatch(
    experience.transition.stageIntent.sceneTheme.themeKey,
    /#|rgb|hsl/i,
  );
  assert.ok(
    experience.reactions.some(
      (reaction) => reaction.kind === "scene-theme-change",
    ),
  );
  assert.ok(
    experience.reactions.some(
      (reaction) => reaction.kind === "stage-recompose",
    ),
  );
  assert.equal(
    typeof experience.transition.stageIntent.compositionIntent,
    "string",
  );
  assert.equal("x" in experience.transition.stageIntent, false);
  assert.equal("y" in experience.transition.stageIntent, false);
});

test("16. focus / selection preservation and incompatible clearing", () => {
  const compatible = makeCockpit({
    activeWorkspace: "overview",
    focusedSubject: { id: "object-1", kind: "object" },
    selectedSubject: { id: "goal-1", kind: "goal" },
  });
  const compatibleIntent = resolveExecutiveWorkspaceStageIntent(
    createExecutiveWorkspaceReference("overview"),
    createExecutiveWorkspaceReference("problem"),
    compatible,
  );
  assert.equal(compatibleIntent.focusPolicy, "preserve-if-compatible");
  assert.equal(compatibleIntent.selectionPolicy, "preserve-if-compatible");
  assert.equal(
    isSubjectCompatibleWithWorkspace(
      { id: "object-1", kind: "object" },
      createExecutiveWorkspaceReference("problem"),
    ),
    true,
  );

  const incompatible = makeCockpit({
    activeWorkspace: "problem",
    focusedSubject: { id: "problem-1", kind: "problem" },
    selectedSubject: { id: "problem-1", kind: "problem" },
  });
  const clearIntent = resolveExecutiveWorkspaceStageIntent(
    createExecutiveWorkspaceReference("problem"),
    createExecutiveWorkspaceReference("execution"),
    incompatible,
  );
  assert.equal(clearIntent.focusPolicy, "clear");
  assert.equal(clearIntent.selectionPolicy, "clear");
  assert.equal(clearIntent.compositionIntent, "clear-context");
  assert.equal(
    isSubjectCompatibleWithWorkspace(
      { id: "problem-1", kind: "problem" },
      createExecutiveWorkspaceReference("execution"),
    ),
    false,
  );

  const overviewIntent = resolveExecutiveWorkspaceStageIntent(
    createExecutiveWorkspaceReference("problem"),
    createExecutiveWorkspaceReference("overview"),
    compatible,
  );
  assert.equal(overviewIntent.focusPolicy, "restore-overview");
  assert.equal(overviewIntent.compositionIntent, "restore-overview");
});

test("17. cockpit-wide workspace propagation", () => {
  const experience = resolveExecutiveWorkspaceExperience({
    cockpit: makeCockpit({ activeWorkspace: "overview" }),
    intent: createExecutiveWorkspaceSelectionIntent("workspace.decision"),
  });
  assert.equal(experience.surfacePropagation.length, 10);
  const stageProp = experience.surfacePropagation.find(
    (entry) => entry.surface === "stage",
  );
  const dialProp = experience.surfacePropagation.find(
    (entry) => entry.surface === "workspace-dial",
  );
  const statusProp = experience.surfacePropagation.find(
    (entry) => entry.surface === "status",
  );
  assert.equal(stageProp?.receivesWorkspace, true);
  assert.equal(dialProp?.receivesWorkspace, true);
  assert.equal(statusProp?.receivesWorkspace, false);
  assert.equal(stageProp?.workspaceId, "workspace.decision");
  assert.ok(
    experience.transition?.propagatingSurfaces.includes("advisor"),
  );
  assert.ok(
    experience.transition?.propagatingSurfaces.includes("insight"),
  );
});

test("18. deterministic resolution and input immutability", () => {
  const cockpit = makeCockpit({
    activeWorkspace: "overview",
    focusedSubject: { id: "object-1", kind: "object" },
  });
  const clone = JSON.stringify(cockpit);
  const intent = createExecutiveWorkspaceSelectionIntent("workspace.problem");
  const first = resolveExecutiveWorkspaceExperience({ cockpit, intent });
  const second = resolveExecutiveWorkspaceExperience({ cockpit, intent });
  assert.equal(JSON.stringify(cockpit), clone);
  assert.deepEqual(first, second);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(Object.isFrozen(first.reactions), true);
  assert.deepEqual(
    first.reactions.map((reaction) => reaction.priority),
    [...first.reactions.map((reaction) => reaction.priority)].sort(
      (a, b) => a - b,
    ),
  );
});

test("19. validation / invariants", () => {
  const experience = resolveExecutiveWorkspaceExperience({
    cockpit: makeCockpit({ activeWorkspace: "overview" }),
    intent: createExecutiveWorkspaceSelectionIntent("workspace.scenario"),
  });
  const validation = validateExecutiveWorkspaceExperience(experience);
  const verification = verifyWorkspaceDialExperienceSwitching();
  assert.equal(validation.ok, true);
  assert.equal(verification.ok, true);
  assert.equal(validation.version, "1.4.0");
  assert.equal(
    validation.dependencyIdentity,
    "NEX-CI:3/ExecutiveStageIntegration",
  );
  assert.equal(validation.workspaceKindCount, 5);
  assert.equal(validation.dialStatusCount, 6);
  assert.equal(validation.transitionStatusCount, 6);
  assert.equal(validation.selectionReasonCount, 6);
  assert.equal(validation.reactionKindCount, 8);
  assert.equal(validation.compositionIntentCount, 5);
  assert.equal(validation.focusPolicyCount, 3);
  assert.equal(validation.optionCount, 5);
  assert.equal(validation.guaranteeCount, 23);
  assert.equal(validation.invariantCount, 23);
  assert.equal(validation.themeSemanticOnly, true);
  assert.equal(validation.frameworkIndependent, true);
  assert.equal(guarantees.length, 23);
});

test("20. no React / Three.js / R3F / physical dial or color coupling", () => {
  assert.doesNotMatch(
    source,
    /from\s+["'](?:react|react-dom|next(?:\/[^"']*)?|three|zustand|redux|@reduxjs\/[^"']*|@react-three(?:\/[^"']*)?)["']/i,
  );
  assert.doesNotMatch(
    source,
    /import\s+.*\b(?:React|useThree|useFrame|Canvas)\b/,
  );
  assert.doesNotMatch(source, /\bTHREE\.(?:Scene|Mesh|Color|Euler|Vector3)\b/);
  assert.doesNotMatch(source, /\bDate\.now\(|Math\.random\(/);
  assert.doesNotMatch(source, /#[0-9a-fA-F]{3,8}\b/);
  assert.doesNotMatch(source, /\brgba?\s*\(/i);
  assert.equal(boundary.introducesReact, false);
  assert.equal(boundary.introducesThreeJs, false);
  assert.equal(boundary.introducesReactThreeFiber, false);
  assert.equal(boundary.ownsDialGeometry, false);
  assert.equal(boundary.ownsDialRotation, false);
  assert.equal(boundary.ownsSceneColorValues, false);
  assert.equal(boundary.ownsStageAnimation, false);
  assert.equal(boundary.ownsAdvisorContent, false);
  assert.equal(boundary.ownsInsightContent, false);
  assert.equal(boundary.implementsNexCi5, false);

  for (const required of [
    "dial geometry",
    "hex colors",
    "Advisor content generation",
    "Insight generation",
    "NEX-CI:5 Advisor & Insight Integration",
  ] as const) {
    assert.ok(
      (forbiddenResponsibilities as readonly string[]).includes(required),
    );
  }
  assert.equal(apiNames.length, 33);
});
