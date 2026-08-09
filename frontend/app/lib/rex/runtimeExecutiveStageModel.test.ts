import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  RUNTIME_EXECUTIVE_STAGE_MODEL_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_STAGE_MODEL_CAPABILITIES as capabilities,
  RUNTIME_EXECUTIVE_STAGE_MODEL_CONSISTENCY_CHECKS as consistencyChecks,
  RUNTIME_EXECUTIVE_STAGE_MODEL_DOMAINS as domains,
  RUNTIME_EXECUTIVE_STAGE_MODEL_INVARIANTS as invariants,
  RUNTIME_EXECUTIVE_STAGE_MODEL_PRESENTATION_STATES as presentationStates,
  RUNTIME_EXECUTIVE_STAGE_MODEL_PUBLIC_TYPE_NAMES as publicTypes,
  RUNTIME_EXECUTIVE_STAGE_MODEL_REGISTRY as registry,
  areRuntimeExecutiveStageSubjectsConnected,
  compareRuntimeExecutiveStageModels,
  createRuntimeExecutiveStageModel,
  getRuntimeExecutiveStageConnectionById,
  getRuntimeExecutiveStageConnectionsByKind,
  getRuntimeExecutiveStageConnectionsForSubject,
  getRuntimeExecutiveStageFocusedSubjects,
  getRuntimeExecutiveStageIncomingConnections,
  getRuntimeExecutiveStageModelIdentity,
  getRuntimeExecutiveStageNeighborhood,
  getRuntimeExecutiveStageOutgoingConnections,
  getRuntimeExecutiveStagePrimaryFocus,
  getRuntimeExecutiveStageRelatedSubjects,
  getRuntimeExecutiveStageRelationshipGraph,
  getRuntimeExecutiveStageSelectedSubject,
  getRuntimeExecutiveStageSubjectById,
  getRuntimeExecutiveStageSubjectIndex,
  getRuntimeExecutiveStageSubjectsByAttention,
  getRuntimeExecutiveStageSubjectsByKind,
  getRuntimeExecutiveStageSubjectsByPresentationState,
  getRuntimeExecutiveStageSubjectsByVisibility,
  getRuntimeExecutiveStageVisibleSubjects,
  projectRuntimeExecutiveStageModelToSnapshot,
  runtimeExecutiveStageModel as modelModule,
  runtimeExecutiveStageModelApiNames as apiNames,
  runtimeExecutiveStageModelCanonicalIdentity as canonicalIdentity,
  verifyRuntimeExecutiveStageModel,
  verifyRuntimeExecutiveStageModelConsistency,
} from "./runtimeExecutiveStageModel.ts";

import {
  createRuntimeExecutiveStageSceneContract,
  createRuntimeExecutiveStageSelectionContract,
  createRuntimeExecutiveStageFocusContract,
  runtimeExecutiveStageExperienceContractsIdentity,
  verifyRuntimeExecutiveStageExperienceContracts,
} from "@/app/lib/rex/runtimeExecutiveStageExperienceContracts";

import {
  createRuntimeExecutiveStageConnection,
  createRuntimeExecutiveStageContext,
  createRuntimeExecutiveStageScene,
  createRuntimeExecutiveStageSubject,
  verifyRuntimeExecutiveStageExperienceFoundation,
} from "@/app/lib/rex/runtimeExecutiveStageExperienceFoundation";

import { verifyRuntimeEnabledExecutiveExperienceConsumerEntry } from "@/app/lib/rex/runtimeEnabledExecutiveExperiencePublicIndex";

const source = readFileSync(
  new URL("./runtimeExecutiveStageModel.ts", import.meta.url),
  "utf8",
);

function buildFactoryExpansionScene(options?: {
  readonly selectedSubjectId?: string;
  readonly primaryFocusSubjectId?: string;
  readonly revision?: string;
}) {
  const supplier = createRuntimeExecutiveStageSubject({
    subjectId: "object.supplier",
    kind: "object",
    label: "Supplier",
    presentationState: "minimum",
    visibility: "visible",
    selection: "unselected",
    focusRole: "secondary",
    attention: "elevated",
  });
  const warehouse = createRuntimeExecutiveStageSubject({
    subjectId: "object.warehouse",
    kind: "object",
    label: "Warehouse",
    presentationState: "minimum",
    visibility: "visible",
    selection: "unselected",
    focusRole: "unfocused",
    attention: "normal",
  });
  const factory = createRuntimeExecutiveStageSubject({
    subjectId: "object.factory",
    kind: "object",
    label: "Factory",
    presentationState: "operation",
    visibility: "visible",
    selection: "selected",
    focusRole: "primary",
    attention: "normal",
  });
  const kpi = createRuntimeExecutiveStageSubject({
    subjectId: "kpi.production",
    kind: "kpi",
    label: "Production KPI",
    presentationState: "report",
    visibility: "visible",
    selection: "unselected",
    focusRole: "contextual",
    attention: "warning",
  });
  const customer = createRuntimeExecutiveStageSubject({
    subjectId: "object.customer",
    kind: "object",
    label: "Customer",
    presentationState: "minimum",
    visibility: "visible",
    selection: "unselected",
    focusRole: "contextual",
    attention: "normal",
  });

  const selectedSubjectId = options?.selectedSubjectId ?? factory.subjectId;
  const primaryFocusSubjectId =
    options?.primaryFocusSubjectId ?? factory.subjectId;

  // Support independence case: selected Factory, primary focus KPI
  const subjects =
    selectedSubjectId === factory.subjectId &&
    primaryFocusSubjectId === kpi.subjectId
      ? [
          supplier,
          warehouse,
          createRuntimeExecutiveStageSubject({
            ...factory,
            selection: "selected",
            focusRole: "unfocused",
          }),
          createRuntimeExecutiveStageSubject({
            ...kpi,
            selection: "unselected",
            focusRole: "primary",
          }),
          customer,
        ]
      : [supplier, warehouse, factory, kpi, customer];

  const connections = [
    createRuntimeExecutiveStageConnection({
      connectionId: "conn.supplier-warehouse",
      sourceSubjectId: supplier.subjectId,
      targetSubjectId: warehouse.subjectId,
      kind: "flow",
      direction: "directed",
      state: "active",
    }),
    createRuntimeExecutiveStageConnection({
      connectionId: "conn.warehouse-factory",
      sourceSubjectId: warehouse.subjectId,
      targetSubjectId: factory.subjectId,
      kind: "dependency",
      direction: "directed",
      state: "active",
    }),
    createRuntimeExecutiveStageConnection({
      connectionId: "conn.factory-kpi",
      sourceSubjectId: factory.subjectId,
      targetSubjectId: kpi.subjectId,
      kind: "kpi-relationship",
      direction: "directed",
      state: "emphasized",
    }),
    createRuntimeExecutiveStageConnection({
      connectionId: "conn.kpi-customer",
      sourceSubjectId: kpi.subjectId,
      targetSubjectId: customer.subjectId,
      kind: "impact",
      direction: "directed",
      state: "active",
    }),
  ];

  const context = createRuntimeExecutiveStageContext({
    contextId: "ctx.factory-expansion",
    activeSubjectId: factory.subjectId,
    goalId: "goal.factory-expansion",
    intentionId: "intent.expand-capacity",
    presentationState: "operation",
    mode: "executive",
    lens: "operations",
  });

  return createRuntimeExecutiveStageScene({
    sceneId: "scene.factory-expansion",
    revision: options?.revision ?? "r1",
    subjects,
    connections,
    selectedSubjectId,
    primaryFocusSubjectId,
    sceneState: "active",
    presentationContext: "operation",
    context,
  });
}

function buildModel(options?: {
  readonly selectedSubjectId?: string;
  readonly primaryFocusSubjectId?: string;
  readonly revision?: string;
  readonly modelId?: string;
}) {
  const scene = buildFactoryExpansionScene(options);
  const sceneContract = createRuntimeExecutiveStageSceneContract({
    scene,
    source: "executive",
    reason: {
      kind: "executive-intent",
      detail: "Factory Expansion stage",
    },
  });
  return createRuntimeExecutiveStageModel({
    modelId: options?.modelId ?? "model.factory-expansion",
    sceneContract,
    logicalVersion: "stage-v1",
  });
}

test("1. exact identity / version / namespace / consumer role", () => {
  assert.equal(modelModule.identity, "REX-2:3/RuntimeExecutiveStageModel");
  assert.equal(modelModule.version, "2.3.0");
  assert.equal(modelModule.namespace, "nexora.rex.stage.model");
  assert.equal(modelModule.layer, "RuntimeExecutiveExperience");
  assert.equal(modelModule.domain, "ExecutiveStage");
  assert.equal(modelModule.phase, "Model");
  assert.equal(modelModule.consumerRole, "InternalRuntimeModel");
  assert.deepEqual(getRuntimeExecutiveStageModelIdentity(), canonicalIdentity);
});

test("2. sole immediate dependency is REX-2:2 contracts", () => {
  assert.equal(
    modelModule.upstreamDependency,
    "REX-2:2/RuntimeExecutiveStageExperienceContracts",
  );
  assert.equal(
    modelModule.upstreamDependency,
    runtimeExecutiveStageExperienceContractsIdentity,
  );
  assert.equal(
    modelModule.dependencyPath,
    "@/app/lib/rex/runtimeExecutiveStageExperienceContracts",
  );
  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveStageExperienceContracts",
  ]);
});

test("3. no direct REX-2:1 / REX-1 / DRI / NOL / EX-DRI imports", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveStageExperienceFoundation["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeEnabledExecutiveExperience(?:Foundation|Contracts|StateBinding|SceneBinding|InteractionBinding|AdaptivePresentationBinding|Platform|CertificationFreeze|PublicIndex)["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/(?:ex-dri|dri|nol)(?:\/[^"']*)?["']/,
  );
  assert.equal(boundary.consumesContractsOnly, true);
  assert.equal(boundary.importsRex21Directly, false);
  assert.equal(boundary.importsRex1Directly, false);
  assert.equal(boundary.importsExDriDirectly, false);
  assert.equal(boundary.importsDriDirectly, false);
  assert.equal(boundary.importsNolDirectly, false);
});

test("4. Stage Model creation, identity, revision, determinism", () => {
  const a = buildModel();
  const b = buildModel();
  assert.equal(a.identity.modelId, "model.factory-expansion");
  assert.equal(a.identity.sceneId, "scene.factory-expansion");
  assert.equal(a.identity.revision, "r1");
  assert.equal(a.identity.logicalVersion, "stage-v1");
  assert.equal(a.revision, "r1");
  assert.equal(a.lifecycleState, "active");
  assert.equal(a.context.contextId, "ctx.factory-expansion");
  assert.deepEqual(
    a.subjects.map((subject) => subject.subjectId),
    b.subjects.map((subject) => subject.subjectId),
  );
  assert.deepEqual(
    a.connections.map((connection) => connection.connectionId),
    b.connections.map((connection) => connection.connectionId),
  );
  const comparison = compareRuntimeExecutiveStageModels(a, b);
  assert.equal(comparison.identical, true);
  assert.equal(comparison.revisionDiffers, false);
});

test("5. subject model, unique IDs, canonical ordering, accessors", () => {
  const model = buildModel();
  assert.equal(model.subjects.length, 5);
  assert.deepEqual(
    model.subjects.map((subject) => subject.subjectId),
    [
      "object.supplier",
      "object.warehouse",
      "object.factory",
      "kpi.production",
      "object.customer",
    ],
  );
  assert.ok(uniqueIds(model.subjects.map((subject) => subject.subjectId)));
  assert.equal(model.subjects[0]!.orderIndex, 0);
  assert.equal(model.subjects[4]!.orderIndex, 4);

  const factory = getRuntimeExecutiveStageSubjectById(model, "object.factory");
  assert.equal(factory?.presentationState, "operation");
  assert.equal(factory?.kind, "object");
  assert.equal(getRuntimeExecutiveStageSubjectIndex(model, "object.factory"), 2);
  assert.equal(getRuntimeExecutiveStageSubjectsByKind(model, "kpi").length, 1);
  assert.equal(getRuntimeExecutiveStageVisibleSubjects(model).length, 5);
});

test("6. selection model — at most one selected; independent from focus", () => {
  const model = buildModel();
  assert.equal(model.selection.selectedSubjectId, "object.factory");
  assert.equal(model.selection.selection, "selected");
  assert.equal(
    getRuntimeExecutiveStageSelectedSubject(model)?.subjectId,
    "object.factory",
  );
  assert.equal(
    model.subjects.filter((subject) => subject.selection === "selected").length,
    1,
  );

  const independent = buildModel({
    selectedSubjectId: "object.factory",
    primaryFocusSubjectId: "kpi.production",
  });
  assert.equal(independent.selection.selectedSubjectId, "object.factory");
  assert.equal(independent.focus.primaryFocusSubjectId, "kpi.production");
  assert.notEqual(
    independent.selection.selectedSubjectId,
    independent.focus.primaryFocusSubjectId,
  );
  assert.equal(
    getRuntimeExecutiveStageSelectedSubject(independent)?.focusRole,
    "unfocused",
  );
  assert.equal(
    getRuntimeExecutiveStagePrimaryFocus(independent)?.selection,
    "unselected",
  );
});

test("7. focus model — at most one primary; deterministic focused order", () => {
  const model = buildModel();
  assert.equal(model.focus.primaryFocusSubjectId, "object.factory");
  assert.deepEqual(model.focus.secondaryFocusSubjectIds, ["object.supplier"]);
  assert.deepEqual(model.focus.contextualFocusSubjectIds, [
    "kpi.production",
    "object.customer",
  ]);
  assert.equal(
    model.subjects.filter((subject) => subject.focusRole === "primary").length,
    1,
  );
  const focused = getRuntimeExecutiveStageFocusedSubjects(model);
  assert.deepEqual(
    focused.map((subject) => subject.subjectId),
    model.focus.orderedFocusedSubjectIds,
  );
  assert.ok(!focused.some((subject) => subject.focusRole === "unfocused"));
});

test("8. presentation / visibility independence and inspection", () => {
  const model = buildModel();
  assert.deepEqual([...presentationStates], ["minimum", "report", "operation"]);
  assert.equal(
    getRuntimeExecutiveStageSubjectsByPresentationState(model, "operation")[0]
      ?.subjectId,
    "object.factory",
  );
  assert.equal(
    getRuntimeExecutiveStageSubjectsByPresentationState(model, "report")[0]
      ?.subjectId,
    "kpi.production",
  );
  assert.equal(
    getRuntimeExecutiveStageSubjectsByVisibility(model, "visible").length,
    5,
  );

  // Legal independence: operation + visible and minimum + visible coexist
  const factory = getRuntimeExecutiveStageSubjectById(model, "object.factory")!;
  const supplier = getRuntimeExecutiveStageSubjectById(
    model,
    "object.supplier",
  )!;
  assert.equal(factory.presentationState, "operation");
  assert.equal(factory.visibility, "visible");
  assert.equal(supplier.presentationState, "minimum");
  assert.equal(supplier.visibility, "visible");
  assert.notEqual(factory.presentationState, factory.visibility);
});

test("9. attention model — semantic only, no style coupling", () => {
  const model = buildModel();
  assert.equal(
    getRuntimeExecutiveStageSubjectsByAttention(model, "warning")[0]?.subjectId,
    "kpi.production",
  );
  assert.equal(
    getRuntimeExecutiveStageSubjectsByAttention(model, "elevated")[0]
      ?.subjectId,
    "object.supplier",
  );
  assert.doesNotMatch(source, /\b(pulse|glow|opacity|ReactNode|Vector3)\b/);
  assert.equal(model.attention.bySubjectId["kpi.production"], "warning");
  // attention is not a visual channel
  assert.ok(!("color" in model.attention));
  assert.ok(!("style" in model.attention));
});

test("10. connection model, graph, neighborhood, directions", () => {
  const model = buildModel();
  assert.equal(model.connections.length, 4);
  assert.ok(
    uniqueIds(model.connections.map((connection) => connection.connectionId)),
  );
  assert.deepEqual(
    model.connections.map((connection) => connection.connectionId),
    [
      "conn.supplier-warehouse",
      "conn.warehouse-factory",
      "conn.factory-kpi",
      "conn.kpi-customer",
    ],
  );

  const factoryConn = getRuntimeExecutiveStageConnectionById(
    model,
    "conn.factory-kpi",
  );
  assert.equal(factoryConn?.direction, "directed");
  assert.equal(factoryConn?.kind, "kpi-relationship");

  assert.equal(
    getRuntimeExecutiveStageOutgoingConnections(model, "object.factory").length,
    1,
  );
  assert.equal(
    getRuntimeExecutiveStageIncomingConnections(model, "object.factory").length,
    1,
  );
  assert.equal(
    getRuntimeExecutiveStageConnectionsForSubject(model, "object.factory")
      .length,
    2,
  );
  assert.equal(
    getRuntimeExecutiveStageConnectionsByKind(model, "flow").length,
    1,
  );
  assert.equal(
    areRuntimeExecutiveStageSubjectsConnected(
      model,
      "object.factory",
      "kpi.production",
    ),
    true,
  );
  assert.equal(
    areRuntimeExecutiveStageSubjectsConnected(
      model,
      "object.supplier",
      "object.customer",
    ),
    false,
  );

  const graph = getRuntimeExecutiveStageRelationshipGraph(model);
  assert.equal(graph.nodes.length, 5);
  assert.equal(graph.edges.length, 4);
  assert.deepEqual(graph.outbound["object.factory"], ["kpi.production"]);
  assert.deepEqual(graph.inbound["object.factory"], ["object.warehouse"]);

  const neighborhood = getRuntimeExecutiveStageNeighborhood(
    model,
    "object.factory",
  );
  assert.equal(neighborhood.centerSubjectId, "object.factory");
  assert.ok(neighborhood.connectedSubjectIds.includes("object.warehouse"));
  assert.ok(neighborhood.connectedSubjectIds.includes("kpi.production"));
  assert.ok(neighborhood.relationshipKinds.includes("dependency"));
  assert.ok(neighborhood.relationshipKinds.includes("kpi-relationship"));
  assert.equal(
    getRuntimeExecutiveStageRelatedSubjects(model, "object.factory").length,
    2,
  );

  // no renderer geometry
  assert.ok(!("position" in (factoryConn ?? {})));
  assert.ok(!("path" in (graph as object)));
  assert.ok(!("mesh" in (neighborhood as object)));
});

test("11. scene model, context preservation, snapshot projection", () => {
  const model = buildModel();
  assert.equal(model.scene.sceneId, "scene.factory-expansion");
  assert.equal(model.scene.revision, "r1");
  assert.equal(model.scene.sceneState, "active");
  assert.equal(model.scene.context.goalId, "goal.factory-expansion");
  assert.equal(model.context.intentionId, "intent.expand-capacity");

  const snapshotContract = projectRuntimeExecutiveStageModelToSnapshot(model, {
    snapshotId: "snap.factory-expansion.r1",
    source: "system",
  });
  assert.equal(snapshotContract.contractKind, "snapshot");
  assert.equal(snapshotContract.snapshot.snapshotId, "snap.factory-expansion.r1");
  assert.equal(snapshotContract.snapshot.observedRevision, "r1");
  assert.equal(snapshotContract.snapshot.selectedSubjectId, "object.factory");
  assert.equal(
    snapshotContract.snapshot.primaryFocusSubjectId,
    "object.factory",
  );
  assert.equal(snapshotContract.snapshot.subjectCount, 5);
  assert.equal(snapshotContract.snapshot.connectionCount, 4);
  assert.deepEqual(
    snapshotContract.snapshot.scene.subjects.map((s) => s.subjectId),
    model.subjects.map((s) => s.subjectId),
  );
});

test("12. structural consistency, comparison, immutability", () => {
  const model = buildModel();
  const consistency = verifyRuntimeExecutiveStageModelConsistency(model);
  assert.equal(consistency.ok, true);
  assert.equal(consistency.checks.length, consistencyChecks.length);
  assert.equal(consistency.issues.length, 0);

  const left = buildModel({ revision: "r1" });
  const rightScene = buildFactoryExpansionScene({ revision: "r2" });
  // alter attention on KPI for comparison
  const alteredSubjects = rightScene.subjects.map((subject) =>
    subject.subjectId === "kpi.production"
      ? createRuntimeExecutiveStageSubject({
          ...subject,
          attention: "critical",
        })
      : subject,
  );
  const right = createRuntimeExecutiveStageModel({
    modelId: "model.factory-expansion",
    sceneContract: createRuntimeExecutiveStageSceneContract({
      scene: createRuntimeExecutiveStageScene({
        sceneId: rightScene.sceneId,
        revision: "r2",
        subjects: alteredSubjects,
        connections: [...rightScene.connections],
        selectedSubjectId: rightScene.selectedSubjectId,
        primaryFocusSubjectId: rightScene.primaryFocusSubjectId,
        sceneState: rightScene.sceneState,
        presentationContext: rightScene.presentationContext,
        context: rightScene.context,
      }),
      source: "runtime",
    }),
  });
  const comparison = compareRuntimeExecutiveStageModels(left, right);
  assert.equal(comparison.identical, false);
  assert.equal(comparison.revisionDiffers, true);
  assert.equal(comparison.attentionDiffers, true);

  const subjectsRef = model.subjects;
  const connectionsRef = model.connections;
  getRuntimeExecutiveStageNeighborhood(model, "object.factory");
  projectRuntimeExecutiveStageModelToSnapshot(model, {
    snapshotId: "snap.immutability",
  });
  assert.equal(model.subjects, subjectsRef);
  assert.equal(model.connections, connectionsRef);
  assert.ok(Object.isFrozen(model));
  assert.ok(Object.isFrozen(model.subjects));
  assert.ok(Object.isFrozen(model.connections));
  assert.ok(Object.isFrozen(model.selection));
  assert.ok(Object.isFrozen(model.focus));
  assert.ok(Object.isFrozen(registry));
});

test("13. renderer neutrality and no orchestration/resolution APIs", () => {
  assert.doesNotMatch(source, /from\s+["']react["']/);
  assert.doesNotMatch(source, /from\s+["']three["']/);
  assert.doesNotMatch(source, /from\s+["']@react-three\/fiber["']/);
  assert.doesNotMatch(source, /\b(ReactNode|JSX\.Element|HTMLElement|document\.|window\.)\b/);
  // Dependency/API leakage only — documentation may mention forbidden words.
  assert.doesNotMatch(
    source,
    /\b(?:export\s+)?function\s+(?:execute|apply|resolve|orchestrate|transition|render|animate)[A-Za-z0-9_]*\b/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:position|x|y|z|Vector3|mesh|material|camera|opacity|CSS|pixel|viewport)\s*[:=]/,
  );
  for (const name of apiNames) {
    assert.doesNotMatch(
      name,
      /^(execute|apply|resolve|orchestrate|transition|render|animate)/,
    );
  }
  assert.equal(boundary.resolvesFocus, false);
  assert.equal(boundary.resolvesPresentation, false);
  assert.equal(boundary.calculatesAttention, false);
  assert.equal(boundary.executesSceneTransitions, false);
  assert.equal(boundary.introducesOrchestration, false);
  assert.equal(boundary.rendererIndependent, true);
});

test("14. registry counts, verification, regressions", () => {
  assert.equal(registry.modelDomainCount, domains.length);
  assert.equal(registry.capabilityCount, capabilities.length);
  assert.equal(registry.publicTypeCount, publicTypes.length);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.equal(registry.invariantCount, invariants.length);
  assert.equal(registry.consistencyCheckCount, consistencyChecks.length);
  assert.equal(registry.presentationStateCount, presentationStates.length);
  assert.equal(invariants.length, 38);
  assert.ok(capabilities.includes("neighborhood-inspection"));
  assert.ok(capabilities.includes("snapshot-projection"));
  assert.ok(!capabilities.includes("orchestration" as never));

  const verification = verifyRuntimeExecutiveStageModel();
  assert.equal(verification.ok, true);
  assert.equal(verification.contractsBoundaryIntact, true);
  assert.equal(verification.declarativeOnly, true);

  // selection/focus contracts remain available upstream without model coupling
  const selection = createRuntimeExecutiveStageSelectionContract({
    subjectId: "object.factory",
    selection: "selected",
    source: "executive",
  });
  const focus = createRuntimeExecutiveStageFocusContract({
    subjectId: "kpi.production",
    focusRole: "primary",
    source: "director",
  });
  assert.notEqual(selection.subjectId, focus.subjectId);

  assert.equal(verifyRuntimeExecutiveStageExperienceContracts().ok, true);
  assert.equal(verifyRuntimeExecutiveStageExperienceFoundation().ok, true);
  assert.equal(verifyRuntimeEnabledExecutiveExperienceConsumerEntry().ok, true);
});

function uniqueIds(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}
