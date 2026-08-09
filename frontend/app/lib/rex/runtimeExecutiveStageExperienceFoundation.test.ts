import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_EXECUTIVE_STAGE_ATTENTION_LEVELS as attentionLevels,
  RUNTIME_EXECUTIVE_STAGE_CONNECTION_DIRECTIONS as connectionDirections,
  RUNTIME_EXECUTIVE_STAGE_CONNECTION_KINDS as connectionKinds,
  RUNTIME_EXECUTIVE_STAGE_FOCUS_ROLES as focusRoles,
  RUNTIME_EXECUTIVE_STAGE_FOUNDATION_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_STAGE_FOUNDATION_INVARIANTS as invariants,
  RUNTIME_EXECUTIVE_STAGE_PRESENTATION_STATES as presentationStates,
  RUNTIME_EXECUTIVE_STAGE_SCENE_STATES as sceneStates,
  RUNTIME_EXECUTIVE_STAGE_SELECTION_STATES as selectionStates,
  RUNTIME_EXECUTIVE_STAGE_SUBJECT_KINDS as subjectKinds,
  RUNTIME_EXECUTIVE_STAGE_VISIBILITY_STATES as visibilityStates,
  createRuntimeExecutiveStageConnection,
  createRuntimeExecutiveStageContext,
  createRuntimeExecutiveStageScene,
  createRuntimeExecutiveStageSnapshot,
  createRuntimeExecutiveStageSubject,
  getRuntimeExecutiveStageConnectionsForSubject,
  getRuntimeExecutiveStageExperienceFoundationIdentity,
  getRuntimeExecutiveStagePrimaryFocusSubject,
  getRuntimeExecutiveStageSelectedSubject,
  getRuntimeExecutiveStageSubjectById,
  isRuntimeExecutiveStageSubjectFocused,
  isRuntimeExecutiveStageSubjectSelected,
  isRuntimeExecutiveStageSubjectVisible,
  runtimeExecutiveStageExperienceFoundation as foundation,
  runtimeExecutiveStageExperienceFoundationCanonicalIdentity as canonicalIdentity,
  runtimeExecutiveStageExperienceFoundationRegistry as registry,
  validateRuntimeExecutiveStageScene,
  verifyRuntimeExecutiveStageExperienceFoundation,
} from "./runtimeExecutiveStageExperienceFoundation.ts";

import {
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_PRESENTATION_STATES,
  RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_SUBJECT_KINDS,
  runtimeEnabledExecutiveExperiencePublicIndexIdentity,
  runtimeEnabledExecutiveExperiencePublicIndexSupportedImportPath,
  verifyRuntimeEnabledExecutiveExperienceConsumerEntry,
} from "@/app/lib/rex/runtimeEnabledExecutiveExperiencePublicIndex";

const source = readFileSync(
  new URL(
    "./runtimeExecutiveStageExperienceFoundation.ts",
    import.meta.url,
  ),
  "utf8",
);

function factorySubject(
  overrides?: Partial<Parameters<typeof createRuntimeExecutiveStageSubject>[0]>,
) {
  return createRuntimeExecutiveStageSubject({
    subjectId: "object.factory",
    kind: "object",
    label: "Factory",
    presentationState: "minimum",
    visibility: "visible",
    selection: "selected",
    focusRole: "primary",
    attention: "elevated",
    ...overrides,
  });
}

test("1. exact REX-2:1 identity / version / namespace / layer / domain / phase", () => {
  assert.equal(
    foundation.identity,
    "REX-2:1/RuntimeExecutiveStageExperienceFoundation",
  );
  assert.equal(foundation.version, "2.1.0");
  assert.equal(foundation.namespace, "nexora.rex.stage.foundation");
  assert.equal(foundation.layer, "RuntimeExecutiveExperience");
  assert.equal(foundation.domain, "ExecutiveStage");
  assert.equal(foundation.phase, "Foundation");
  assert.deepEqual(
    getRuntimeExecutiveStageExperienceFoundationIdentity(),
    canonicalIdentity,
  );
});

test("2. sole immediate dependency is REX-1:9 public index", () => {
  assert.equal(
    foundation.upstreamDependency,
    "REX-1:9/RuntimeEnabledExecutiveExperiencePublicIndex",
  );
  assert.equal(
    foundation.upstreamDependency,
    runtimeEnabledExecutiveExperiencePublicIndexIdentity,
  );
  assert.equal(
    foundation.dependencyPath,
    runtimeEnabledExecutiveExperiencePublicIndexSupportedImportPath,
  );
  assert.equal(
    foundation.dependencyPath,
    "@/app/lib/rex/runtimeEnabledExecutiveExperiencePublicIndex",
  );
  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeEnabledExecutiveExperiencePublicIndex",
  ]);
});

test("3. no direct earlier REX-1 / DRI / NOL / EX-DRI imports", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeEnabledExecutiveExperience(?:Foundation|Contracts|StateBinding|SceneBinding|InteractionBinding|AdaptivePresentationBinding|Platform|CertificationFreeze)["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/(?:ex-dri|dri|nol)(?:\/[^"']*)?["']/,
  );
  assert.equal(boundary.consumesPublicIndexOnly, true);
  assert.equal(boundary.importsRex1InternalDirectly, false);
  assert.equal(boundary.importsExDriDirectly, false);
  assert.equal(boundary.importsDriDirectly, false);
  assert.equal(boundary.importsNolDirectly, false);
});

test("4. canonical presentation states preserved from REX-1:9", () => {
  assert.deepEqual([...presentationStates], ["minimum", "report", "operation"]);
  assert.equal(
    presentationStates,
    RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_PRESENTATION_STATES,
  );
});

test("5. Stage subject kinds are deterministic and reuse upstream kinds", () => {
  for (const kind of RUNTIME_ENABLED_EXECUTIVE_EXPERIENCE_FROZEN_SUBJECT_KINDS) {
    assert.ok(subjectKinds.includes(kind), `missing upstream kind ${kind}`);
  }
  assert.ok(subjectKinds.includes("object"));
  assert.ok(subjectKinds.includes("goal"));
  assert.ok(subjectKinds.includes("task"));
  assert.ok(subjectKinds.includes("insight"));
  assert.ok(subjectKinds.includes("advisor-subject"));
  assert.ok(![...subjectKinds].includes("kor" as never));
  assert.equal(registry.subjectKindCount, subjectKinds.length);
});

test("6. visibility / selection / focus / attention semantics", () => {
  assert.deepEqual([...visibilityStates], ["visible", "hidden", "collapsed"]);
  assert.deepEqual([...selectionStates], ["unselected", "selected"]);
  assert.deepEqual([...focusRoles], [
    "primary",
    "secondary",
    "contextual",
    "background",
    "unfocused",
  ]);
  assert.deepEqual([...attentionLevels], [
    "normal",
    "informational",
    "elevated",
    "warning",
    "critical",
  ]);

  const selectedFocused = factorySubject();
  const unselectedSupporting = createRuntimeExecutiveStageSubject({
    subjectId: "object.supplier",
    kind: "object",
    selection: "unselected",
    focusRole: "secondary",
    presentationState: "report",
    visibility: "visible",
    attention: "informational",
  });
  const hiddenMinimum = createRuntimeExecutiveStageSubject({
    subjectId: "kpi.throughput",
    kind: "kpi",
    selection: "unselected",
    focusRole: "unfocused",
    presentationState: "minimum",
    visibility: "hidden",
    attention: "normal",
  });

  assert.equal(isRuntimeExecutiveStageSubjectSelected(selectedFocused), true);
  assert.equal(isRuntimeExecutiveStageSubjectFocused(selectedFocused), true);
  assert.equal(isRuntimeExecutiveStageSubjectVisible(selectedFocused), true);
  assert.equal(isRuntimeExecutiveStageSubjectSelected(unselectedSupporting), false);
  assert.equal(isRuntimeExecutiveStageSubjectFocused(unselectedSupporting), true);
  assert.equal(isRuntimeExecutiveStageSubjectVisible(hiddenMinimum), false);
  // Selection and focus remain separate.
  assert.notEqual(
    unselectedSupporting.selection === "selected",
    unselectedSupporting.focusRole !== "unfocused",
  );
});

test("7. connection kinds / directions and scene creation invariants", () => {
  assert.ok(connectionKinds.includes("dependency"));
  assert.ok(connectionKinds.includes("kpi-relationship"));
  assert.ok(connectionKinds.includes("koi-relationship"));
  assert.deepEqual([...connectionDirections], [
    "directed",
    "bidirectional",
    "undirected",
  ]);
  assert.deepEqual([...sceneStates], ["idle", "active", "transitioning"]);

  const factory = factorySubject();
  const supplier = createRuntimeExecutiveStageSubject({
    subjectId: "object.supplier",
    kind: "object",
    focusRole: "secondary",
    presentationState: "report",
  });
  const kpi = createRuntimeExecutiveStageSubject({
    subjectId: "kpi.throughput",
    kind: "kpi",
    focusRole: "contextual",
    presentationState: "report",
    attention: "warning",
  });
  const connection = createRuntimeExecutiveStageConnection({
    connectionId: "conn.factory-supplier",
    sourceSubjectId: factory.subjectId,
    targetSubjectId: supplier.subjectId,
    kind: "dependency",
    direction: "directed",
    state: "active",
    attention: "elevated",
  });
  const context = createRuntimeExecutiveStageContext({
    contextId: "ctx.stage.1",
    experienceId: "rex.exp.1",
    activeSubjectId: factory.subjectId,
    goalId: "goal.1",
    presentationState: "report",
  });
  const scene = createRuntimeExecutiveStageScene({
    sceneId: "scene.stage.1",
    revision: "r1",
    subjects: [factory, supplier, kpi],
    connections: [connection],
    selectedSubjectId: factory.subjectId,
    primaryFocusSubjectId: factory.subjectId,
    presentationContext: "report",
    sceneState: "active",
    context,
  });

  assert.equal(validateRuntimeExecutiveStageScene(scene), true);
  assert.equal(getRuntimeExecutiveStageSelectedSubject(scene)?.subjectId, "object.factory");
  assert.equal(
    getRuntimeExecutiveStagePrimaryFocusSubject(scene)?.subjectId,
    "object.factory",
  );
  assert.equal(
    getRuntimeExecutiveStageSubjectById(scene, "kpi.throughput")?.kind,
    "kpi",
  );
  assert.equal(
    getRuntimeExecutiveStageConnectionsForSubject(scene, "object.factory").length,
    1,
  );
  assert.deepEqual(
    scene.subjects.map((subject) => subject.subjectId),
    ["object.factory", "object.supplier", "kpi.throughput"],
  );
});

test("8. unique subjects / connection integrity / selected & primary focus invariants", () => {
  const a = factorySubject({ subjectId: "a", selection: "selected", focusRole: "primary" });
  const b = createRuntimeExecutiveStageSubject({
    subjectId: "b",
    kind: "object",
  });
  const context = createRuntimeExecutiveStageContext({ contextId: "ctx" });

  assert.throws(() =>
    createRuntimeExecutiveStageScene({
      sceneId: "s",
      revision: "1",
      subjects: [a, factorySubject({ subjectId: "a" })],
      context,
    }),
  );

  assert.throws(() =>
    createRuntimeExecutiveStageScene({
      sceneId: "s",
      revision: "1",
      subjects: [a, b],
      connections: [
        createRuntimeExecutiveStageConnection({
          connectionId: "bad",
          sourceSubjectId: "a",
          targetSubjectId: "missing",
          kind: "flow",
        }),
      ],
      context,
    }),
  );

  assert.throws(() =>
    createRuntimeExecutiveStageScene({
      sceneId: "s",
      revision: "1",
      subjects: [
        a,
        createRuntimeExecutiveStageSubject({
          subjectId: "c",
          kind: "object",
          selection: "selected",
        }),
      ],
      context,
    }),
  );

  assert.throws(() =>
    createRuntimeExecutiveStageScene({
      sceneId: "s",
      revision: "1",
      subjects: [
        a,
        createRuntimeExecutiveStageSubject({
          subjectId: "d",
          kind: "object",
          focusRole: "primary",
        }),
      ],
      context,
    }),
  );
});

test("9. snapshot creation, deterministic ordering, input immutability", () => {
  const subjects = Object.freeze([
    factorySubject(),
    createRuntimeExecutiveStageSubject({
      subjectId: "object.supplier",
      kind: "object",
      focusRole: "secondary",
    }),
  ]);
  const connections = Object.freeze([
    createRuntimeExecutiveStageConnection({
      connectionId: "c1",
      sourceSubjectId: "object.factory",
      targetSubjectId: "object.supplier",
      kind: "dependency",
    }),
  ]);
  const context = createRuntimeExecutiveStageContext({ contextId: "ctx" });
  const input = Object.freeze({
    sceneId: "scene.1",
    revision: "r1",
    subjects,
    connections,
    selectedSubjectId: "object.factory",
    primaryFocusSubjectId: "object.factory",
    sceneState: "active" as const,
    context,
  });
  const before = JSON.stringify(input);
  const sceneA = createRuntimeExecutiveStageScene(input);
  const sceneB = createRuntimeExecutiveStageScene(input);
  assert.equal(JSON.stringify(input), before);
  assert.deepEqual(
    sceneA.subjects.map((subject) => subject.subjectId),
    sceneB.subjects.map((subject) => subject.subjectId),
  );

  const snapA = createRuntimeExecutiveStageSnapshot({
    snapshotId: "snap.1",
    scene: sceneA,
    timestampIso: "2026-01-01T00:00:00.000Z",
  });
  const snapB = createRuntimeExecutiveStageSnapshot({
    snapshotId: "snap.1",
    scene: sceneA,
    timestampIso: "2026-01-01T00:00:00.000Z",
  });
  assert.equal(snapA.subjectCount, 2);
  assert.equal(snapA.connectionCount, 1);
  assert.deepEqual(snapA, snapB);
});

test("10. renderer neutrality and no React/Three.js/browser dependencies", () => {
  assert.equal(boundary.frameworkIndependent, true);
  assert.equal(boundary.rendererIndependent, true);
  assert.equal(boundary.introducesRendering, false);
  assert.equal(boundary.encodesRendererStyling, false);
  assert.equal(foundation.rendererIndependent, true);
  assert.doesNotMatch(source, /\bfrom\s+["']react["']/);
  assert.doesNotMatch(source, /\bfrom\s+["']three["']/);
  assert.doesNotMatch(source, /@react-three|ReactThreeFiber/i);
  assert.doesNotMatch(source, /document\.|window\.|localStorage|fetch\s*\(/);
  assert.doesNotMatch(source, /Mesh|Vector3|PerspectiveCamera|CSSProperties/);
  assert.ok(foundation.forbiddenResponsibilities.includes("Three.js"));
  assert.ok(foundation.forbiddenResponsibilities.includes("React components"));
  assert.ok(foundation.forbiddenResponsibilities.includes("colors"));
});

test("11. invariants / registry / verification / REX-1:9 regression", () => {
  assert.equal(invariants.length, 15);
  assert.equal(registry.invariantCount, 15);
  assert.equal(Object.isFrozen(foundation), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(canonicalIdentity), true);
  assert.equal(Object.isFrozen(invariants), true);

  const verification = verifyRuntimeExecutiveStageExperienceFoundation();
  assert.equal(verification.ok, true);
  assert.equal(verification.identity, foundation.identity);
  assert.equal(verification.version, "2.1.0");
  assert.equal(verification.publicIndexBoundaryIntact, true);
  assert.equal(verification.reusesUpstreamPresentationStates, true);
  assert.equal(verification.reusesUpstreamSubjectKinds, true);
  assert.equal(verification.upstreamConsumerEntryOk, true);
  assert.equal(verification.rendererIndependent, true);

  assert.equal(verifyRuntimeEnabledExecutiveExperienceConsumerEntry().ok, true);
});
