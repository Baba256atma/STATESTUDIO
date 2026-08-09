import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  EXECUTIVE_STAGE_EMPHASIS_STATES as emphasisStates,
  EXECUTIVE_STAGE_INTEGRATION_BOUNDARY as boundary,
  EXECUTIVE_STAGE_INTEGRATION_FORBIDDEN_RESPONSIBILITIES as forbiddenResponsibilities,
  EXECUTIVE_STAGE_INTEGRATION_GUARANTEES as guarantees,
  EXECUTIVE_STAGE_INTERACTION_KINDS as interactionKinds,
  EXECUTIVE_STAGE_PLACEMENT_INTENTS as placementIntents,
  EXECUTIVE_STAGE_REACTION_KINDS as reactionKinds,
  EXECUTIVE_STAGE_SUBJECT_ROLES as subjectRoles,
  EXECUTIVE_STAGE_VISIBILITY_STATES as visibilityStates,
  createExecutiveStageInteractionIntent,
  executiveStageIntegration as stageModule,
  executiveStageIntegrationApiNames as apiNames,
  executiveStageIntegrationCanonicalIdentity as canonicalIdentity,
  getExecutiveStageEmphasisStates,
  getExecutiveStageIntegrationIdentity,
  getExecutiveStageInteractionKinds,
  getExecutiveStagePlacementIntents,
  getExecutiveStageReactionKinds,
  getExecutiveStageSubjectRoles,
  getExecutiveStageVisibilityStates,
  isExecutiveStageEmphasis,
  isExecutiveStageInteractionKind,
  isExecutiveStagePlacementIntent,
  isExecutiveStageReactionKind,
  isExecutiveStageSubjectRole,
  isExecutiveStageVisibility,
  resolveExecutiveStagePrimarySubject,
  resolveExecutiveStageReactions,
  resolveExecutiveStageScene,
  validateExecutiveStageScene,
  verifyExecutiveStageIntegration,
} from "./executiveStageIntegration.ts";

import {
  createExecutiveCockpitIntegrationSnapshot,
  resolveCockpitShellRuntimeBinding,
  type CockpitShellRuntimeSnapshot,
} from "./cockpitShellRuntimeBinding.ts";

const source = readFileSync(
  new URL("./executiveStageIntegration.ts", import.meta.url),
  "utf8",
);

function makeCockpitSnapshot(input: {
  readonly focusedSubject?: { readonly id: string; readonly kind: "goal" | "object" | "pack" | "problem" };
  readonly selectedSubject?: { readonly id: string; readonly kind: "goal" | "object" | "pack" | "problem" };
  readonly attentionSubjectId?: string;
  readonly presentationState?: "minimum" | "report" | "operation";
  readonly status?: "idle" | "ready" | "active" | "transitioning" | "unavailable";
  readonly activeWorkspace?: string;
}): CockpitShellRuntimeSnapshot {
  const activeSurface = "stage" as const;
  const selected = input.selectedSubject;
  const focused = input.focusedSubject;
  return resolveCockpitShellRuntimeBinding(
    createExecutiveCockpitIntegrationSnapshot({
      context: {
        workspaceId: "ws.demo",
        modelId: "model.demo",
        activeSurface,
        activeWorkspace: input.activeWorkspace ?? "operations",
        selectedSubjectId: selected?.id,
        focusedSubjectId: focused?.id,
        presentationState: input.presentationState ?? "report",
        attentionSubjectId: input.attentionSubjectId,
      },
      state: {
        activeSurface,
        activeWorkspace: input.activeWorkspace ?? "operations",
        selectedSubject: selected,
        focusedSubject: focused,
        presentationState: input.presentationState ?? "report",
        attentionSubjectId: input.attentionSubjectId,
        status: input.status ?? "ready",
      },
    }),
  );
}

const relatedGraph = {
  relatedSubjects: [
    { id: "object-1", kind: "object" as const },
    { id: "goal-1", kind: "goal" as const },
    { id: "pack-1", kind: "pack" as const },
    { id: "problem-1", kind: "problem" as const },
  ],
  relationships: [
    {
      id: "rel.goal-object",
      sourceSubjectId: "goal-1",
      targetSubjectId: "object-1",
      kind: "related" as const,
    },
    {
      id: "rel.object-pack",
      sourceSubjectId: "object-1",
      targetSubjectId: "pack-1",
      kind: "contains" as const,
    },
    {
      id: "rel.object-problem",
      sourceSubjectId: "object-1",
      targetSubjectId: "problem-1",
      kind: "informs" as const,
    },
  ],
};

test("1. identity metadata", () => {
  assert.equal(
    stageModule.identity,
    "NEX-CI:3/ExecutiveStageIntegration",
  );
  assert.equal(canonicalIdentity.identity, stageModule.identity);
  assert.equal(stageModule.phase, "ExecutiveStageIntegration");
  assert.equal(stageModule.name, "ExecutiveStageIntegration");
  assert.deepEqual(
    getExecutiveStageIntegrationIdentity(),
    canonicalIdentity,
  );
});

test("2. version / namespace / phase / architectural role", () => {
  assert.equal(stageModule.version, "1.3.0");
  assert.equal(
    stageModule.namespace,
    "nexora.executive.cockpit.integration.stage",
  );
  assert.equal(stageModule.phase, "ExecutiveStageIntegration");
  assert.equal(
    stageModule.architecturalRole,
    "ExecutiveStageIntegration",
  );
  assert.equal(
    boundary.architecturalRole,
    "ExecutiveStageIntegration",
  );
});

test("3. sole immediate dependency is NEX-CI:2", () => {
  assert.equal(
    stageModule.upstreamDependency,
    "NEX-CI:2/CockpitShellRuntimeBinding",
  );
  assert.equal(
    stageModule.dependencyPath,
    "@/app/lib/nex-ci/cockpitShellRuntimeBinding",
  );
  assert.equal(
    boundary.soleImmediateDependency,
    "NEX-CI:2/CockpitShellRuntimeBinding",
  );
  assert.equal(boundary.consumesNexCi2Only, true);

  const imports = [...source.matchAll(/from\s+["']([^"']+)["']/g)].map(
    (match) => match[1],
  );
  assert.ok(imports.length >= 1);
  assert.ok(
    imports.every(
      (entry) => entry === "@/app/lib/nex-ci/cockpitShellRuntimeBinding",
    ),
  );
});

test("4. forbidden direct dependency boundaries", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/nol(?:\/[^"']*)?["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/dri(?:\/[^"']*)?["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/ex-dri(?:\/[^"']*)?["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex(?:\/[^"']*)?["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/nex-ci\/executiveCockpitIntegrationFoundation["']/,
  );
  assert.equal(boundary.bypassesIntoNexCi1, false);
  assert.equal(boundary.bypassesIntoRex, false);
  assert.equal(boundary.implementsNexCi4, false);
});

test("5. subject roles / visibility / emphasis vocabularies", () => {
  assert.deepEqual([...subjectRoles], [
    "primary",
    "related",
    "context",
    "supporting",
  ]);
  assert.deepEqual([...visibilityStates], ["visible", "dimmed", "hidden"]);
  assert.deepEqual([...emphasisStates], [
    "normal",
    "selected",
    "focused",
    "attention",
    "deemphasized",
  ]);
  assert.deepEqual([...getExecutiveStageSubjectRoles()], [...subjectRoles]);
  assert.deepEqual(
    [...getExecutiveStageVisibilityStates()],
    [...visibilityStates],
  );
  assert.deepEqual([...getExecutiveStageEmphasisStates()], [...emphasisStates]);
  assert.equal(isExecutiveStageSubjectRole("primary"), true);
  assert.equal(isExecutiveStageSubjectRole("hero"), false);
  assert.equal(isExecutiveStageVisibility("dimmed"), true);
  assert.equal(isExecutiveStageEmphasis("focused"), true);
});

test("6. reaction / placement / interaction vocabularies", () => {
  assert.deepEqual([...reactionKinds], [
    "focus-subject",
    "select-subject",
    "reveal-related",
    "hide-unrelated",
    "dim-unrelated",
    "emphasize-relationship",
    "change-presentation",
    "clear-focus",
    "restore-scene",
  ]);
  assert.deepEqual([...placementIntents], [
    "center",
    "around-primary",
    "context",
    "background",
  ]);
  assert.deepEqual([...interactionKinds], [
    "select",
    "focus",
    "clear-selection",
    "clear-focus",
    "open",
    "dismiss",
    "context-open",
  ]);
  assert.equal(reactionKinds.length, 9);
  assert.equal(placementIntents.length, 4);
  assert.equal(interactionKinds.length, 7);
  assert.equal(isExecutiveStageReactionKind("focus-subject"), true);
  assert.equal(isExecutiveStagePlacementIntent("center"), true);
  assert.equal(isExecutiveStageInteractionKind("context-open"), true);
  assert.deepEqual([...getExecutiveStageReactionKinds()], [...reactionKinds]);
  assert.deepEqual(
    [...getExecutiveStagePlacementIntents()],
    [...placementIntents],
  );
  assert.deepEqual(
    [...getExecutiveStageInteractionKinds()],
    [...interactionKinds],
  );
});

test("7. primary-subject resolution and focus precedence", () => {
  const none = makeCockpitSnapshot({});
  assert.equal(resolveExecutiveStagePrimarySubject(none), undefined);

  const selectedOnly = makeCockpitSnapshot({
    selectedSubject: { id: "object-1", kind: "object" },
  });
  assert.deepEqual(resolveExecutiveStagePrimarySubject(selectedOnly), {
    id: "object-1",
    kind: "object",
  });

  const both = makeCockpitSnapshot({
    selectedSubject: { id: "object-1", kind: "object" },
    focusedSubject: { id: "goal-1", kind: "goal" },
  });
  assert.deepEqual(resolveExecutiveStagePrimarySubject(both), {
    id: "goal-1",
    kind: "goal",
  });
});

test("8. selection without focus", () => {
  const snapshot = makeCockpitSnapshot({
    selectedSubject: { id: "object-1", kind: "object" },
    presentationState: "minimum",
  });
  const scene = resolveExecutiveStageScene(snapshot);
  assert.equal(scene.compositionPolicy, "selection-without-focus");
  assert.equal(scene.primarySubject?.id, "object-1");
  assert.equal(scene.primarySubject?.selected, true);
  assert.equal(scene.primarySubject?.focused, false);
  assert.equal(scene.primarySubject?.emphasis, "selected");
  assert.equal(scene.cameraIntent, "overview");
  assert.equal(scene.focusDirective, undefined);
});

test("9. focus/selection distinction and focus-centered composition", () => {
  const snapshot = makeCockpitSnapshot({
    selectedSubject: { id: "object-1", kind: "object" },
    focusedSubject: { id: "goal-1", kind: "goal" },
    attentionSubjectId: "goal-1",
    presentationState: "report",
  });
  const scene = resolveExecutiveStageScene(snapshot, relatedGraph);

  assert.equal(scene.compositionPolicy, "focus-centered");
  assert.equal(scene.primarySubject?.id, "goal-1");
  assert.equal(scene.primarySubject?.focused, true);
  assert.equal(scene.primarySubject?.selected, false);
  assert.equal(scene.primarySubject?.emphasis, "focused");
  assert.equal(scene.focusDirective?.placementIntent, "center");
  assert.equal(scene.focusDirective?.subjectId, "goal-1");
  assert.equal(scene.cameraIntent, "focus-primary");

  const selected = scene.subjects.find((subject) => subject.id === "object-1");
  assert.ok(selected);
  assert.equal(selected.selected, true);
  assert.equal(selected.focused, false);
  assert.notEqual(selected.role, "primary");
});

test("10. related-subject expansion and relationship integrity", () => {
  const snapshot = makeCockpitSnapshot({
    focusedSubject: { id: "object-1", kind: "object" },
    selectedSubject: { id: "object-1", kind: "object" },
  });
  const scene = resolveExecutiveStageScene(snapshot, relatedGraph);

  const related = scene.subjects.filter((subject) => subject.role === "related");
  assert.ok(related.length >= 2);
  assert.ok(related.some((subject) => subject.id === "goal-1"));
  assert.ok(related.some((subject) => subject.id === "pack-1"));

  for (const relationship of scene.relationships) {
    assert.ok(
      scene.subjects.some((subject) => subject.id === relationship.sourceSubjectId),
    );
    assert.ok(
      scene.subjects.some((subject) => subject.id === relationship.targetSubjectId),
    );
    assert.equal(Object.isFrozen(relationship), true);
  }

  const primaryRel = scene.relationships.find(
    (relationship) => relationship.id === "rel.object-pack",
  );
  assert.ok(primaryRel);
  assert.equal(primaryRel.visible, true);
  assert.equal(primaryRel.emphasis, "primary");
});

test("11. attention propagation", () => {
  const snapshot = makeCockpitSnapshot({
    focusedSubject: { id: "object-1", kind: "object" },
    selectedSubject: { id: "goal-1", kind: "goal" },
    attentionSubjectId: "pack-1",
  });
  const scene = resolveExecutiveStageScene(snapshot, relatedGraph);
  assert.ok(
    scene.attention.some(
      (directive) =>
        directive.subjectId === "object-1" &&
        directive.level === "primary" &&
        directive.reason === "focus",
    ),
  );
  assert.ok(
    scene.attention.some(
      (directive) =>
        directive.subjectId === "goal-1" &&
        directive.reason === "selection",
    ),
  );
  assert.ok(
    scene.attention.some(
      (directive) =>
        directive.subjectId === "pack-1" &&
        directive.reason === "runtime-attention",
    ),
  );
});

test("12. Minimum / Report / Operation presentation compatibility", () => {
  for (const presentationState of ["minimum", "report", "operation"] as const) {
    const snapshot = makeCockpitSnapshot({
      focusedSubject: { id: "object-1", kind: "object" },
      presentationState,
    });
    const scene = resolveExecutiveStageScene(snapshot);
    assert.equal(scene.primarySubject?.presentationState, presentationState);
    for (const subject of scene.subjects) {
      assert.equal(subject.presentationState, presentationState);
    }
  }
});

test("13. center and around-primary placement intents", () => {
  const snapshot = makeCockpitSnapshot({
    focusedSubject: { id: "object-1", kind: "object" },
  });
  const scene = resolveExecutiveStageScene(snapshot, relatedGraph);

  const center = scene.placements.find(
    (placement) => placement.subjectId === "object-1",
  );
  assert.equal(center?.intent, "center");
  assert.equal(center?.order, 0);

  const around = scene.placements.filter(
    (placement) => placement.intent === "around-primary",
  );
  assert.ok(around.length >= 1);
  for (const placement of scene.placements) {
    assert.ok(
      scene.subjects.some((subject) => subject.id === placement.subjectId),
    );
  }
});

test("14. focus / selection / reveal-related / dim-unrelated reactions", () => {
  const overview = resolveExecutiveStageScene(makeCockpitSnapshot({}));
  const focused = resolveExecutiveStageScene(
    makeCockpitSnapshot({
      focusedSubject: { id: "object-1", kind: "object" },
      selectedSubject: { id: "object-1", kind: "object" },
    }),
    { ...relatedGraph, previousScene: overview },
  );

  assert.ok(
    focused.reactions.some((reaction) => reaction.kind === "focus-subject"),
  );
  assert.ok(
    focused.reactions.some((reaction) => reaction.kind === "select-subject"),
  );
  assert.ok(
    focused.reactions.some((reaction) => reaction.kind === "reveal-related"),
  );
  assert.ok(
    focused.reactions.some((reaction) => reaction.kind === "dim-unrelated") ||
      focused.subjects.every((subject) => subject.visibility !== "dimmed"),
  );
  assert.ok(
    focused.reactions.some(
      (reaction) => reaction.kind === "emphasize-relationship",
    ),
  );
});

test("15. clear-focus and restore-scene reactions", () => {
  const focused = resolveExecutiveStageScene(
    makeCockpitSnapshot({
      focusedSubject: { id: "object-1", kind: "object" },
    }),
    relatedGraph,
  );
  const cleared = resolveExecutiveStageScene(
    makeCockpitSnapshot({
      selectedSubject: { id: "object-1", kind: "object" },
    }),
    { previousScene: focused },
  );

  assert.equal(cleared.compositionPolicy, "restored");
  assert.equal(cleared.cameraIntent, "restore");
  assert.ok(
    cleared.reactions.some((reaction) => reaction.kind === "clear-focus"),
  );
  assert.ok(
    cleared.reactions.some((reaction) => reaction.kind === "restore-scene"),
  );

  const direct = resolveExecutiveStageReactions(focused, cleared);
  assert.deepEqual(direct, cleared.reactions);
});

test("16. change-presentation reaction", () => {
  const minimum = resolveExecutiveStageScene(
    makeCockpitSnapshot({
      focusedSubject: { id: "object-1", kind: "object" },
      presentationState: "minimum",
    }),
  );
  const operation = resolveExecutiveStageScene(
    makeCockpitSnapshot({
      focusedSubject: { id: "object-1", kind: "object" },
      presentationState: "operation",
    }),
    { previousScene: minimum },
  );
  assert.ok(
    operation.reactions.some(
      (reaction) =>
        reaction.kind === "change-presentation" &&
        reaction.presentationState === "operation",
    ),
  );
});

test("17. interaction intent creation and click/context boundaries", () => {
  const select = createExecutiveStageInteractionIntent("select", "object-1");
  assert.deepEqual(select, {
    kind: "select",
    subjectId: "object-1",
    source: "stage",
  });
  const focus = createExecutiveStageInteractionIntent("focus", "object-1");
  assert.equal(focus.kind, "focus");
  const contextOpen = createExecutiveStageInteractionIntent(
    "context-open",
    "object-1",
  );
  assert.equal(contextOpen.kind, "context-open");
  const clearFocus = createExecutiveStageInteractionIntent("clear-focus");
  assert.equal(clearFocus.kind, "clear-focus");
  assert.equal(Object.isFrozen(select), true);
  assert.throws(() =>
    createExecutiveStageInteractionIntent("select"),
  );
  assert.throws(() =>
    createExecutiveStageInteractionIntent("zoom" as never, "object-1"),
  );
});

test("18. deterministic scene resolution and input immutability", () => {
  const snapshot = makeCockpitSnapshot({
    focusedSubject: { id: "object-1", kind: "object" },
    selectedSubject: { id: "goal-1", kind: "goal" },
    attentionSubjectId: "object-1",
    presentationState: "report",
  });
  const inputClone = JSON.stringify(snapshot);
  const first = resolveExecutiveStageScene(snapshot, relatedGraph);
  const second = resolveExecutiveStageScene(snapshot, relatedGraph);

  assert.equal(JSON.stringify(snapshot), inputClone);
  assert.deepEqual(first, second);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(Object.isFrozen(first.subjects), true);
  assert.equal(Object.isFrozen(first.relationships), true);
  assert.equal(Object.isFrozen(first.placements), true);
  assert.equal(Object.isFrozen(first.reactions), true);
  assert.equal(first.stageSurface, "stage");
  assert.equal(first.workspace, "operations");
  assert.equal(
    first.subjects.filter((subject) => subject.role === "primary").length,
    1,
  );

  assert.throws(() => {
    (subjectRoles as unknown as string[]).push("hero");
  });
  assert.throws(() => {
    (stageModule as { version?: string }).version = "0.0.0";
  });
});

test("19. validation / invariants", () => {
  const scene = resolveExecutiveStageScene(
    makeCockpitSnapshot({
      focusedSubject: { id: "object-1", kind: "object" },
    }),
    relatedGraph,
  );
  const validation = validateExecutiveStageScene(scene);
  const verification = verifyExecutiveStageIntegration();

  assert.equal(validation.ok, true);
  assert.equal(verification.ok, true);
  assert.equal(validation.identity, stageModule.identity);
  assert.equal(validation.version, "1.3.0");
  assert.equal(
    validation.dependencyIdentity,
    "NEX-CI:2/CockpitShellRuntimeBinding",
  );
  assert.equal(validation.subjectRoleCount, 4);
  assert.equal(validation.visibilityCount, 3);
  assert.equal(validation.emphasisCount, 5);
  assert.equal(validation.reactionKindCount, 9);
  assert.equal(validation.placementIntentCount, 4);
  assert.equal(validation.interactionKindCount, 7);
  assert.equal(validation.guaranteeCount, 21);
  assert.equal(validation.invariantCount, 21);
  assert.equal(validation.shellBindingOk, true);
  assert.equal(validation.primaryUnique, true);
  assert.equal(validation.presentationCompatible, true);
  assert.equal(validation.rendererNeutral, true);
  assert.equal(validation.frameworkIndependent, true);
  assert.equal(guarantees.length, 21);
});

test("20. no React / Three.js / R3F / camera / dial coupling", () => {
  assert.doesNotMatch(
    source,
    /from\s+["'](?:react|react-dom|next(?:\/[^"']*)?|three|zustand|redux|@reduxjs\/[^"']*|@react-three(?:\/[^"']*)?)["']/i,
  );
  assert.doesNotMatch(
    source,
    /import\s+.*\b(?:React|ReactDOM|JSX|useState|useEffect|useThree|useFrame)\b/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:THREE\.(?:Scene|Mesh|Object3D|Vector3)|WebGLRenderer)\b/,
  );
  assert.doesNotMatch(source, /\bcamera\.(?:position|lookAt)\s*=/);
  assert.doesNotMatch(source, /\.lookAt\s*\(/);
  assert.doesNotMatch(source, /\bDate\.now\(|Math\.random\(|setTimeout\(/);
  assert.doesNotMatch(
    source,
    /\b(?:window|document|HTMLElement|localStorage|fetch)\b/,
  );
  assert.equal(boundary.introducesReact, false);
  assert.equal(boundary.introducesThreeJs, false);
  assert.equal(boundary.introducesReactThreeFiber, false);
  assert.equal(boundary.ownsCameraMutation, false);
  assert.equal(boundary.ownsObjectAnimation, false);
  assert.equal(boundary.ownsWorkspaceSwitching, false);
  assert.equal(boundary.ownsSceneColorSwitching, false);
  assert.equal(boundary.implementsNexCi4, false);

  for (const required of [
    "React Three Fiber Canvas",
    "camera.position mutation",
    "Workspace Dial",
    "workspace switching",
    "scene color switching",
    "NEX-CI:4 Workspace Dial & Experience Switching",
  ] as const) {
    assert.ok(
      (forbiddenResponsibilities as readonly string[]).includes(required),
    );
  }

  assert.equal(apiNames.length, 27);
});
