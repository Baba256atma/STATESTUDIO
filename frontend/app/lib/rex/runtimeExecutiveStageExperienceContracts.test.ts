import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_EXECUTIVE_STAGE_CONTRACTS_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_STAGE_CONTRACTS_INVARIANTS as invariants,
  RUNTIME_EXECUTIVE_STAGE_CONTRACTS_PUBLIC_TYPE_NAMES as publicTypes,
  RUNTIME_EXECUTIVE_STAGE_CONTRACT_FAMILIES as families,
  RUNTIME_EXECUTIVE_STAGE_CONTRACT_KINDS as contractKinds,
  RUNTIME_EXECUTIVE_STAGE_CONTRACT_RESULT_STATUSES as resultStatuses,
  RUNTIME_EXECUTIVE_STAGE_CONTRACT_SOURCES as sources,
  RUNTIME_EXECUTIVE_STAGE_EXPERIENCE_CONTRACTS_REGISTRY as registry,
  RUNTIME_EXECUTIVE_STAGE_SCENE_CHANGE_KINDS as sceneChangeKinds,
  createRuntimeExecutiveStageAttentionContract,
  createRuntimeExecutiveStageConnectionContract,
  createRuntimeExecutiveStageContextContract,
  createRuntimeExecutiveStageFocusContract,
  createRuntimeExecutiveStageInspectionContract,
  createRuntimeExecutiveStagePresentationContract,
  createRuntimeExecutiveStageSceneChangeContract,
  createRuntimeExecutiveStageSceneChangeSet,
  createRuntimeExecutiveStageSceneContract,
  createRuntimeExecutiveStageSelectionContract,
  createRuntimeExecutiveStageSnapshotContract,
  createRuntimeExecutiveStageSubjectContract,
  createRuntimeExecutiveStageVisibilityContract,
  getRuntimeExecutiveStageContractKind,
  getRuntimeExecutiveStageContractSource,
  getRuntimeExecutiveStageExperienceContractsIdentity,
  getRuntimeExecutiveStageSceneChangeSetOrderedChanges,
  runtimeExecutiveStageContractTargetsSubject,
  runtimeExecutiveStageExperienceContracts as contracts,
  runtimeExecutiveStageExperienceContractsCanonicalIdentity as canonicalIdentity,
  verifyRuntimeExecutiveStageContractStructure,
  verifyRuntimeExecutiveStageExperienceContracts,
} from "./runtimeExecutiveStageExperienceContracts.ts";

import {
  RUNTIME_EXECUTIVE_STAGE_CONNECTION_KINDS,
  RUNTIME_EXECUTIVE_STAGE_FOCUS_ROLES,
  RUNTIME_EXECUTIVE_STAGE_PRESENTATION_STATES,
  createRuntimeExecutiveStageConnection,
  createRuntimeExecutiveStageContext,
  createRuntimeExecutiveStageScene,
  createRuntimeExecutiveStageSnapshot,
  createRuntimeExecutiveStageSubject,
  runtimeExecutiveStageExperienceFoundationIdentity,
  verifyRuntimeExecutiveStageExperienceFoundation,
} from "@/app/lib/rex/runtimeExecutiveStageExperienceFoundation";

import { verifyRuntimeEnabledExecutiveExperienceConsumerEntry } from "@/app/lib/rex/runtimeEnabledExecutiveExperiencePublicIndex";

const source = readFileSync(
  new URL(
    "./runtimeExecutiveStageExperienceContracts.ts",
    import.meta.url,
  ),
  "utf8",
);

function buildScene() {
  const factory = createRuntimeExecutiveStageSubject({
    subjectId: "object.factory",
    kind: "object",
    selection: "selected",
    focusRole: "primary",
    presentationState: "operation",
    visibility: "visible",
    attention: "elevated",
  });
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
  });
  const context = createRuntimeExecutiveStageContext({
    contextId: "ctx.1",
    activeSubjectId: factory.subjectId,
    presentationState: "report",
  });
  return createRuntimeExecutiveStageScene({
    sceneId: "scene.1",
    revision: "r1",
    subjects: [factory, supplier, kpi],
    connections: [connection],
    selectedSubjectId: factory.subjectId,
    primaryFocusSubjectId: factory.subjectId,
    sceneState: "active",
    context,
  });
}

test("1. exact identity / version / namespace", () => {
  assert.equal(
    contracts.identity,
    "REX-2:2/RuntimeExecutiveStageExperienceContracts",
  );
  assert.equal(contracts.version, "2.2.0");
  assert.equal(contracts.namespace, "nexora.rex.stage.contracts");
  assert.equal(contracts.layer, "RuntimeExecutiveExperience");
  assert.equal(contracts.domain, "ExecutiveStage");
  assert.equal(contracts.phase, "Contracts");
  assert.deepEqual(
    getRuntimeExecutiveStageExperienceContractsIdentity(),
    canonicalIdentity,
  );
});

test("2. sole immediate dependency is REX-2:1 foundation", () => {
  assert.equal(
    contracts.upstreamDependency,
    "REX-2:1/RuntimeExecutiveStageExperienceFoundation",
  );
  assert.equal(
    contracts.upstreamDependency,
    runtimeExecutiveStageExperienceFoundationIdentity,
  );
  assert.equal(
    contracts.dependencyPath,
    "@/app/lib/rex/runtimeExecutiveStageExperienceFoundation",
  );
  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveStageExperienceFoundation",
  ]);
});

test("3. no direct REX-1 / DRI / NOL / EX-DRI imports", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeEnabledExecutiveExperience/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/(?:ex-dri|dri|nol)(?:\/[^"']*)?["']/,
  );
  assert.equal(boundary.consumesFoundationOnly, true);
  assert.equal(boundary.importsRex1Directly, false);
  assert.equal(boundary.importsExDriDirectly, false);
  assert.equal(boundary.importsDriDirectly, false);
  assert.equal(boundary.importsNolDirectly, false);
});

test("4. Foundation vocabulary reuse and contract families", () => {
  assert.equal(
    contracts.registry.contractFamilies,
    families,
  );
  assert.deepEqual([...families], [
    "StageSubject",
    "StageScene",
    "Selection",
    "Focus",
    "Presentation",
    "Visibility",
    "Attention",
    "Connection",
    "SceneChange",
    "StageContext",
    "StageSnapshot",
    "StageInspection",
  ]);
  assert.equal(registry.contractFamilyCount, 12);
  assert.deepEqual([...RUNTIME_EXECUTIVE_STAGE_PRESENTATION_STATES], [
    "minimum",
    "report",
    "operation",
  ]);
  assert.ok(RUNTIME_EXECUTIVE_STAGE_CONNECTION_KINDS.includes("dependency"));
  assert.ok(RUNTIME_EXECUTIVE_STAGE_FOCUS_ROLES.includes("primary"));
  assert.equal(
    verifyRuntimeExecutiveStageExperienceContracts().reusesFoundationVocabularies,
    true,
  );
});

test("5. selection / focus / presentation / visibility / attention contracts", () => {
  const selection = createRuntimeExecutiveStageSelectionContract({
    subjectId: "object.factory",
    selection: "selected",
    source: "executive",
    sceneId: "scene.1",
    sceneRevision: "r1",
    reason: { kind: "executive-intent", detail: "Manager selected Factory" },
  });
  const focus = createRuntimeExecutiveStageFocusContract({
    subjectId: "object.factory",
    focusRole: "primary",
    source: "director",
    sceneRevision: "r1",
  });
  const supporting = createRuntimeExecutiveStageFocusContract({
    subjectId: "object.supplier",
    focusRole: "secondary",
    relatedPrimaryFocusSubjectId: "object.factory",
    source: "director",
  });
  const presentation = createRuntimeExecutiveStagePresentationContract({
    subjectId: "object.factory",
    presentationState: "operation",
    source: "runtime",
  });
  const visibility = createRuntimeExecutiveStageVisibilityContract({
    subjectId: "object.other",
    visibility: "collapsed",
    source: "system",
  });
  const attention = createRuntimeExecutiveStageAttentionContract({
    subjectId: "kpi.throughput",
    attention: "warning",
    source: "director",
  });

  assert.equal(selection.contractKind, "selection");
  assert.equal(focus.contractKind, "focus");
  assert.equal(supporting.focusRole, "secondary");
  assert.equal(presentation.presentationState, "operation");
  assert.equal(visibility.visibility, "collapsed");
  assert.equal(attention.attention, "warning");
  // selection ≠ focus
  assert.notEqual(selection.contractKind, focus.contractKind);
  // visibility independent from presentation (minimum + collapsed is legal)
  const minCollapsed = createRuntimeExecutiveStageVisibilityContract({
    subjectId: "x",
    visibility: "collapsed",
    source: "system",
  });
  const minPresentation = createRuntimeExecutiveStagePresentationContract({
    subjectId: "x",
    presentationState: "minimum",
    source: "system",
  });
  assert.equal(minCollapsed.visibility, "collapsed");
  assert.equal(minPresentation.presentationState, "minimum");
});

test("6. connection / scene / context / snapshot / inspection contracts", () => {
  const scene = buildScene();
  const connection = createRuntimeExecutiveStageConnectionContract({
    connection: scene.connections[0]!,
    source: "runtime",
    knownSubjectIds: scene.subjects.map((subject) => subject.subjectId),
    sceneId: scene.sceneId,
    sceneRevision: scene.revision,
  });
  const sceneContract = createRuntimeExecutiveStageSceneContract({
    scene,
    source: "runtime",
  });
  const contextContract = createRuntimeExecutiveStageContextContract({
    context: scene.context,
    source: "runtime",
    sceneId: scene.sceneId,
    sceneRevision: scene.revision,
  });
  const snapshot = createRuntimeExecutiveStageSnapshot({
    snapshotId: "snap.1",
    scene,
  });
  const snapshotContract = createRuntimeExecutiveStageSnapshotContract({
    snapshot,
    source: "system",
  });
  const inspection = createRuntimeExecutiveStageInspectionContract({
    inspectionKind: "inspect-primary-focus",
    source: "advisor",
    sceneId: scene.sceneId,
  });
  const subjectContract = createRuntimeExecutiveStageSubjectContract({
    subject: scene.subjects[0]!,
    source: "runtime",
    sceneId: scene.sceneId,
    sceneRevision: scene.revision,
  });

  assert.equal(connection.contractKind, "connection");
  assert.equal(sceneContract.scene.revision, "r1");
  assert.equal(contextContract.contractKind, "context");
  assert.equal(snapshotContract.snapshot.subjectCount, 3);
  assert.equal(inspection.inspectionKind, "inspect-primary-focus");
  assert.equal(subjectContract.subject.subjectId, "object.factory");
  assert.equal(
    verifyRuntimeExecutiveStageContractStructure(connection).status,
    "accepted",
  );
  assert.throws(() =>
    createRuntimeExecutiveStageConnectionContract({
      connection: createRuntimeExecutiveStageConnection({
        connectionId: "bad",
        sourceSubjectId: "a",
        targetSubjectId: "missing",
        kind: "flow",
      }),
      source: "runtime",
      knownSubjectIds: ["a"],
    }),
  );
});

test("7. scene-change kinds, ordered change set, deterministic ordering", () => {
  assert.equal(sceneChangeKinds.length, 13);
  assert.ok(sceneChangeKinds.includes("selection-changed"));
  assert.ok(sceneChangeKinds.includes("focus-changed"));
  assert.ok(sceneChangeKinds.includes("scene-replaced"));

  const changes = Object.freeze([
    createRuntimeExecutiveStageSceneChangeContract({
      changeId: "c1",
      changeKind: "selection-changed",
      subjectId: "object.factory",
      source: "executive",
      sceneRevision: "r1",
    }),
    createRuntimeExecutiveStageSceneChangeContract({
      changeId: "c2",
      changeKind: "focus-changed",
      subjectId: "object.factory",
      source: "director",
      sceneRevision: "r1",
    }),
    createRuntimeExecutiveStageSceneChangeContract({
      changeId: "c3",
      changeKind: "presentation-changed",
      subjectId: "object.factory",
      source: "runtime",
      sceneRevision: "r1",
    }),
    createRuntimeExecutiveStageSceneChangeContract({
      changeId: "c4",
      changeKind: "visibility-changed",
      subjectId: "object.other",
      source: "system",
      sceneRevision: "r1",
    }),
  ]);
  const frozenInput = Object.freeze({
    changeSetId: "cs.1",
    sourceSceneRevision: "r1",
    targetSceneRevision: "r2",
    changes,
    source: "runtime" as const,
  });
  const before = JSON.stringify(frozenInput);
  const setA = createRuntimeExecutiveStageSceneChangeSet(frozenInput);
  const setB = createRuntimeExecutiveStageSceneChangeSet(frozenInput);
  assert.equal(JSON.stringify(frozenInput), before);
  assert.deepEqual(
    getRuntimeExecutiveStageSceneChangeSetOrderedChanges(setA).map(
      (change) => change.changeId,
    ),
    ["c1", "c2", "c3", "c4"],
  );
  assert.deepEqual(
    getRuntimeExecutiveStageSceneChangeSetOrderedChanges(setA).map(
      (change) => change.changeId,
    ),
    getRuntimeExecutiveStageSceneChangeSetOrderedChanges(setB).map(
      (change) => change.changeId,
    ),
  );
  assert.equal(
    runtimeExecutiveStageContractTargetsSubject(setA, "object.factory"),
    true,
  );
});

test("8. sources / results / helpers / independence / immutability", () => {
  assert.deepEqual([...sources], [
    "executive",
    "director",
    "advisor",
    "runtime",
    "system",
  ]);
  assert.deepEqual([...resultStatuses], ["accepted", "rejected", "invalid"]);
  assert.equal(publicTypes.length, registry.publicTypeCount);
  assert.equal(contractKinds.length, registry.contractKindCount);
  assert.equal(invariants.length, 28);
  assert.equal(registry.invariantCount, 28);

  const focus = createRuntimeExecutiveStageFocusContract({
    subjectId: "object.factory",
    focusRole: "primary",
    source: "director",
  });
  assert.equal(getRuntimeExecutiveStageContractKind(focus), "focus");
  assert.equal(getRuntimeExecutiveStageContractSource(focus), "director");
  assert.equal(
    runtimeExecutiveStageContractTargetsSubject(focus, "object.factory"),
    true,
  );

  assert.equal(Object.isFrozen(contracts), true);
  assert.equal(Object.isFrozen(registry), true);
  assert.equal(Object.isFrozen(canonicalIdentity), true);
  assert.equal(Object.isFrozen(families), true);
  assert.equal(Object.isFrozen(invariants), true);
  assert.equal(Object.isFrozen(focus), true);

  // attention/style independence & connection/rendering independence flags
  assert.equal(boundary.calculatesAttention, false);
  assert.equal(boundary.resolvesPresentation, false);
  assert.equal(boundary.executesSceneChanges, false);
  assert.equal(boundary.mutatesStageState, false);
});

test("9. renderer neutrality and no execution/orchestration APIs", () => {
  assert.equal(boundary.frameworkIndependent, true);
  assert.equal(boundary.rendererIndependent, true);
  assert.doesNotMatch(source, /\bfrom\s+["']react["']/);
  assert.doesNotMatch(source, /\bfrom\s+["']three["']/);
  assert.doesNotMatch(source, /@react-three/i);
  assert.doesNotMatch(source, /\bfrom\s+["'][^"']*dom[^"']*["']/i);
  assert.doesNotMatch(
    source,
    /export\s+function\s+(execute|apply|resolve|orchestrate|transition|render|animate)/i,
  );
  assert.ok(contracts.forbiddenResponsibilities.includes("execute"));
  assert.ok(contracts.forbiddenResponsibilities.includes("React"));
  assert.ok(contracts.forbiddenResponsibilities.includes("Three.js"));
});

test("10. verification and regressions", () => {
  const verification = verifyRuntimeExecutiveStageExperienceContracts();
  assert.equal(verification.ok, true);
  assert.equal(verification.contractFamilyCount, 12);
  assert.equal(verification.invariantCount, 28);
  assert.equal(verification.foundationBoundaryIntact, true);
  assert.equal(verification.declarativeOnly, true);
  assert.equal(verification.rendererIndependent, true);
  assert.deepEqual(
    verification,
    verifyRuntimeExecutiveStageExperienceContracts(),
  );

  assert.equal(verifyRuntimeExecutiveStageExperienceFoundation().ok, true);
  assert.equal(verifyRuntimeEnabledExecutiveExperienceConsumerEntry().ok, true);
});
