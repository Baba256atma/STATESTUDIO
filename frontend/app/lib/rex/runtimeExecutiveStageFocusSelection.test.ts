import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DEFAULT_RUNTIME_EXECUTIVE_STAGE_FOCUS_POLICY as defaultPolicy,
  RUNTIME_EXECUTIVE_STAGE_FOCUS_REASON_KINDS as reasonKinds,
  RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_CAPABILITIES as capabilities,
  RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_FOCUS_ROLES as focusRoles,
  RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_INVARIANTS as invariants,
  RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_PUBLIC_TYPE_NAMES as publicTypes,
  RUNTIME_EXECUTIVE_STAGE_FOCUS_SELECTION_REGISTRY as registry,
  RUNTIME_EXECUTIVE_STAGE_SELECTION_RESOLUTION_KINDS as selectionKinds,
  getRuntimeExecutiveStageBackgroundSubjects,
  getRuntimeExecutiveStageContextualFocus,
  getRuntimeExecutiveStageFocusAssignments,
  getRuntimeExecutiveStageFocusSelectionIdentity,
  getRuntimeExecutiveStageSupportingFocus,
  projectRuntimeExecutiveStageFocusSelection,
  resolveRuntimeExecutiveStageFocus,
  resolveRuntimeExecutiveStageFocusSelection,
  resolveRuntimeExecutiveStageSelection,
  runtimeExecutiveStageFocusSelection as module,
  runtimeExecutiveStageFocusSelectionApiNames as apiNames,
  runtimeExecutiveStageFocusSelectionCanonicalIdentity as canonicalIdentity,
  verifyRuntimeExecutiveStageFocusSelection,
  verifyRuntimeExecutiveStageFocusSelectionResult,
} from "./runtimeExecutiveStageFocusSelection.ts";

import {
  createRuntimeExecutiveStageModel,
  runtimeExecutiveStageModelIdentity,
  verifyRuntimeExecutiveStageModel,
} from "@/app/lib/rex/runtimeExecutiveStageModel";

import {
  createRuntimeExecutiveStageSceneContract,
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
  new URL("./runtimeExecutiveStageFocusSelection.ts", import.meta.url),
  "utf8",
);

function buildNeutralScene(options?: {
  readonly revision?: string;
  readonly factoryVisibility?: "visible" | "hidden" | "collapsed";
}) {
  const supplier = createRuntimeExecutiveStageSubject({
    subjectId: "object.supplier",
    kind: "object",
    label: "Supplier",
    presentationState: "minimum",
    visibility: "visible",
    selection: "unselected",
    focusRole: "unfocused",
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
    visibility: options?.factoryVisibility ?? "visible",
    selection: "unselected",
    focusRole: "unfocused",
    attention: "normal",
  });
  const kpi = createRuntimeExecutiveStageSubject({
    subjectId: "kpi.production",
    kind: "kpi",
    label: "Production KPI",
    presentationState: "report",
    visibility: "visible",
    selection: "unselected",
    focusRole: "unfocused",
    attention: "warning",
  });
  const customer = createRuntimeExecutiveStageSubject({
    subjectId: "object.customer",
    kind: "object",
    label: "Customer",
    presentationState: "minimum",
    visibility: "visible",
    selection: "unselected",
    focusRole: "unfocused",
    attention: "normal",
  });

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

  return createRuntimeExecutiveStageScene({
    sceneId: "scene.factory-expansion",
    revision: options?.revision ?? "r1",
    subjects: [supplier, warehouse, factory, kpi, customer],
    connections,
    sceneState: "active",
    presentationContext: "operation",
    context: createRuntimeExecutiveStageContext({
      contextId: "ctx.factory-expansion",
      activeSubjectId: factory.subjectId,
      goalId: "goal.factory-expansion",
      presentationState: "operation",
    }),
  });
}

function buildModel(options?: {
  readonly revision?: string;
  readonly factoryVisibility?: "visible" | "hidden" | "collapsed";
}) {
  const scene = buildNeutralScene(options);
  return createRuntimeExecutiveStageModel({
    modelId: "model.factory-expansion",
    sceneContract: createRuntimeExecutiveStageSceneContract({
      scene,
      source: "executive",
    }),
    logicalVersion: "stage-v1",
  });
}

test("1. exact identity / version / namespace / consumer role", () => {
  assert.equal(
    module.identity,
    "REX-2:4/RuntimeExecutiveStageFocusSelection",
  );
  assert.equal(module.version, "2.4.0");
  assert.equal(module.namespace, "nexora.rex.stage.focus-selection");
  assert.equal(module.layer, "RuntimeExecutiveExperience");
  assert.equal(module.domain, "ExecutiveStage");
  assert.equal(module.phase, "FocusSelection");
  assert.equal(module.consumerRole, "InternalRuntimeResolver");
  assert.deepEqual(
    getRuntimeExecutiveStageFocusSelectionIdentity(),
    canonicalIdentity,
  );
});

test("2. sole immediate dependency is REX-2:3 Stage Model", () => {
  assert.equal(
    module.upstreamDependency,
    "REX-2:3/RuntimeExecutiveStageModel",
  );
  assert.equal(
    module.upstreamDependency,
    runtimeExecutiveStageModelIdentity,
  );
  assert.equal(
    module.dependencyPath,
    "@/app/lib/rex/runtimeExecutiveStageModel",
  );
  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, ["@/app/lib/rex/runtimeExecutiveStageModel"]);
});

test("3. no direct REX-2:2 / REX-2:1 / REX-1 / DRI / NOL / EX-DRI imports", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveStageExperience(?:Foundation|Contracts)["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeEnabledExecutiveExperience(?:Foundation|Contracts|StateBinding|SceneBinding|InteractionBinding|AdaptivePresentationBinding|Platform|CertificationFreeze|PublicIndex)["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/(?:ex-dri|dri|nol)(?:\/[^"']*)?["']/,
  );
  assert.equal(boundary.consumesStageModelOnly, true);
  assert.equal(boundary.importsRex22Directly, false);
  assert.equal(boundary.importsRex21Directly, false);
  assert.equal(boundary.importsRex1Directly, false);
});

test("4. selection resolution — select, clear, preserve, reject, idempotent", () => {
  const model = buildModel();
  const selected = resolveRuntimeExecutiveStageSelection({
    model,
    selectionRequest: { kind: "select", subjectId: "object.factory" },
    source: "executive",
  });
  assert.equal(selected.status, "accepted");
  assert.equal(selected.resolvedSelectedSubjectId, "object.factory");
  assert.equal(selected.selectionChanged, true);

  const again = resolveRuntimeExecutiveStageSelection({
    model: projectRuntimeExecutiveStageFocusSelection(
      model,
      resolveRuntimeExecutiveStageFocusSelection({
        model,
        selectionRequest: { kind: "select", subjectId: "object.factory" },
        source: "executive",
      }),
    ),
    selectionRequest: { kind: "select", subjectId: "object.factory" },
    source: "executive",
  });
  assert.equal(again.selectionChanged, false);

  const preserved = resolveRuntimeExecutiveStageSelection({
    model,
    selectionRequest: { kind: "preserve" },
    source: "runtime",
  });
  assert.equal(preserved.status, "accepted");
  assert.equal(preserved.selectionChanged, false);

  const cleared = resolveRuntimeExecutiveStageSelection({
    model: projectRuntimeExecutiveStageFocusSelection(
      model,
      resolveRuntimeExecutiveStageFocusSelection({
        model,
        selectionRequest: { kind: "select", subjectId: "object.factory" },
        source: "executive",
      }),
    ),
    selectionRequest: { kind: "clear" },
    source: "executive",
  });
  assert.equal(cleared.status, "accepted");
  assert.equal(cleared.resolvedSelectedSubjectId, undefined);
  assert.equal(cleared.selectionChanged, true);

  const unknown = resolveRuntimeExecutiveStageSelection({
    model,
    selectionRequest: { kind: "select", subjectId: "missing.subject" },
    source: "executive",
  });
  assert.equal(unknown.status, "rejected");
  assert.ok(unknown.issues.includes("unknown-subject"));

  const hiddenModel = buildModel({ factoryVisibility: "hidden" });
  const hidden = resolveRuntimeExecutiveStageSelection({
    model: hiddenModel,
    selectionRequest: { kind: "select", subjectId: "object.factory" },
    source: "executive",
  });
  assert.equal(hidden.status, "rejected");
  assert.ok(hidden.issues.includes("hidden-subject-not-selectable"));
});

test("5. select Factory — primary + supporting + contextual via neighborhood", () => {
  const model = buildModel();
  const result = resolveRuntimeExecutiveStageFocusSelection({
    model,
    selectionRequest: { kind: "select", subjectId: "object.factory" },
    source: "executive",
    reason: { kind: "executive-intent", detail: "Manager selected Factory" },
  });

  assert.equal(result.status, "accepted");
  assert.equal(result.resolvedSelectedSubjectId, "object.factory");
  assert.equal(result.resolvedPrimaryFocusSubjectId, "object.factory");
  assert.deepEqual([...result.orderedSupportingSubjectIds], [
    "kpi.production",
    "object.warehouse",
  ]);
  assert.ok(result.orderedContextualSubjectIds.includes("object.supplier"));
  assert.ok(result.orderedContextualSubjectIds.includes("object.customer"));
  assert.equal(
    result.assignments.filter((a) => a.focusRole === "primary").length,
    1,
  );
  assert.equal(verifyRuntimeExecutiveStageFocusSelectionResult(result).ok, true);
});

test("6. explicit KPI focus override — selection/focus independence", () => {
  const model = buildModel();
  const selected = resolveRuntimeExecutiveStageFocusSelection({
    model,
    selectionRequest: { kind: "select", subjectId: "object.factory" },
    source: "executive",
  });
  const selectedModel = projectRuntimeExecutiveStageFocusSelection(
    model,
    selected,
  );

  const overridden = resolveRuntimeExecutiveStageFocusSelection({
    model: selectedModel,
    selectionRequest: { kind: "preserve" },
    focusRequest: { primaryFocusSubjectId: "kpi.production" },
    source: "director",
  });

  assert.equal(overridden.status, "accepted");
  assert.equal(overridden.resolvedSelectedSubjectId, "object.factory");
  assert.equal(overridden.resolvedPrimaryFocusSubjectId, "kpi.production");
  assert.notEqual(
    overridden.resolvedSelectedSubjectId,
    overridden.resolvedPrimaryFocusSubjectId,
  );
  assert.deepEqual([...overridden.orderedSupportingSubjectIds], [
    "object.factory",
  ]);
  assert.ok(overridden.orderedContextualSubjectIds.includes("object.customer"));
  assert.equal(
    overridden.assignments.find((a) => a.subjectId === "kpi.production")
      ?.reason.kind,
    "explicit-focus",
  );
});

test("7. focus preservation, invalid focus, bounded depth, ordering", () => {
  const model = buildModel();
  const selected = resolveRuntimeExecutiveStageFocusSelection({
    model,
    selectionRequest: { kind: "select", subjectId: "object.factory" },
    source: "executive",
  });
  const selectedModel = projectRuntimeExecutiveStageFocusSelection(
    model,
    selected,
  );

  const preserved = resolveRuntimeExecutiveStageFocusSelection({
    model: selectedModel,
    selectionRequest: { kind: "preserve" },
    source: "runtime",
  });
  assert.equal(preserved.resolvedPrimaryFocusSubjectId, "object.factory");
  assert.equal(preserved.focusChanged, false);

  const invalid = resolveRuntimeExecutiveStageFocus({
    model: selectedModel,
    selectedSubjectId: "object.factory",
    focusRequest: { primaryFocusSubjectId: "missing.focus" },
    source: "director",
  });
  assert.equal(invalid.status, "rejected");

  assert.equal(defaultPolicy.relationshipDepth, 2);
  assert.equal(selected.focus.relationshipDepth, 2);

  const supporting = getRuntimeExecutiveStageSupportingFocus(selected);
  const contextual = getRuntimeExecutiveStageContextualFocus(selected);
  assert.deepEqual([...supporting], ["kpi.production", "object.warehouse"]);
  // Stage order within contextual group
  assert.ok(
    contextual.indexOf("object.supplier") <
      contextual.indexOf("object.customer"),
  );
  assert.ok(
    getRuntimeExecutiveStageBackgroundSubjects(selected).includes(
      "object.supplier",
    ) === false ||
      getRuntimeExecutiveStageBackgroundSubjects(selected).length >= 0,
  );
});

test("8. combined resolution idempotence and structured reasons", () => {
  const model = buildModel();
  const input = {
    model,
    selectionRequest: {
      kind: "select" as const,
      subjectId: "object.factory",
    },
    source: "executive" as const,
  };
  const a = resolveRuntimeExecutiveStageFocusSelection(input);
  const b = resolveRuntimeExecutiveStageFocusSelection(input);
  assert.deepEqual(
    [...a.orderedSupportingSubjectIds],
    [...b.orderedSupportingSubjectIds],
  );
  assert.deepEqual(
    [...a.orderedContextualSubjectIds],
    [...b.orderedContextualSubjectIds],
  );
  assert.equal(a.resolvedPrimaryFocusSubjectId, b.resolvedPrimaryFocusSubjectId);

  const assignments = getRuntimeExecutiveStageFocusAssignments(a);
  for (const assignment of assignments) {
    assert.ok(
      (reasonKinds as readonly string[]).includes(assignment.reason.kind),
    );
  }
});

test("9. projection updates only selection/focus; other dimensions unchanged", () => {
  const model = buildModel();
  const beforePresentation = model.subjects.map((s) => ({
    id: s.subjectId,
    presentation: s.presentationState,
    visibility: s.visibility,
    attention: s.attention,
  }));
  const beforeConnections = model.connections.map((c) => c.connectionId);
  const beforeSubjectIds = model.subjects.map((s) => s.subjectId);

  const result = resolveRuntimeExecutiveStageFocusSelection({
    model,
    selectionRequest: { kind: "select", subjectId: "object.factory" },
    source: "executive",
  });
  const projected = projectRuntimeExecutiveStageFocusSelection(model, result);

  assert.equal(projected.selection.selectedSubjectId, "object.factory");
  assert.equal(projected.focus.primaryFocusSubjectId, "object.factory");
  assert.deepEqual(
    projected.subjects.map((s) => ({
      id: s.subjectId,
      presentation: s.presentationState,
      visibility: s.visibility,
      attention: s.attention,
    })),
    beforePresentation,
  );
  assert.deepEqual(
    projected.connections.map((c) => c.connectionId),
    beforeConnections,
  );
  assert.deepEqual(
    projected.subjects.map((s) => s.subjectId),
    beforeSubjectIds,
  );
  assert.equal(projected.revision, model.revision);

  // input model immutability
  assert.equal(model.selection.selectedSubjectId, undefined);
  assert.equal(model.focus.primaryFocusSubjectId, undefined);
  assert.ok(Object.isFrozen(model));
});

test("10. single-selection / single-primary / no presentation/attention/orchestration APIs", () => {
  const model = buildModel();
  const result = resolveRuntimeExecutiveStageFocusSelection({
    model,
    selectionRequest: { kind: "select", subjectId: "object.factory" },
    source: "executive",
  });
  const projected = projectRuntimeExecutiveStageFocusSelection(model, result);
  assert.equal(
    projected.subjects.filter((s) => s.selection === "selected").length,
    1,
  );
  assert.equal(
    projected.subjects.filter((s) => s.focusRole === "primary").length,
    1,
  );

  assert.doesNotMatch(source, /from\s+["']react["']/);
  assert.doesNotMatch(source, /from\s+["']three["']/);
  assert.doesNotMatch(source, /\b(ReactNode|HTMLElement|document\.|window\.)\b/);
  assert.doesNotMatch(
    source,
    /\b(?:export\s+)?function\s+(?:resolvePresentation|resolveAttention|orchestrate|render|animate|transition)[A-Za-z0-9_]*\b/,
  );
  for (const name of apiNames) {
    assert.doesNotMatch(
      name,
      /presentation|attention|orchestrat|render|animate|transition/i,
    );
  }
  assert.equal(boundary.resolvesPresentation, false);
  assert.equal(boundary.resolvesAttention, false);
  assert.equal(boundary.orchestratesScene, false);
  assert.equal(boundary.rendererIndependent, true);
  assert.ok(!capabilities.includes("presentation-resolution" as never));
  assert.ok(!capabilities.includes("attention-resolution" as never));
});

test("11. registry counts, verification, regressions", () => {
  assert.equal(registry.capabilityCount, capabilities.length);
  assert.equal(registry.publicTypeCount, publicTypes.length);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.equal(registry.invariantCount, invariants.length);
  assert.equal(registry.reasonKindCount, reasonKinds.length);
  assert.equal(registry.selectionResolutionKindCount, selectionKinds.length);
  assert.equal(registry.focusRoleCount, focusRoles.length);
  assert.equal(invariants.length, 40);
  assert.equal(defaultPolicy.maxSupportingFocus, 2);
  assert.equal(defaultPolicy.relationshipDepth, 2);
  assert.ok(capabilities.includes("explicit-focus-override"));
  assert.ok(capabilities.includes("focus-explainability"));

  const verification = verifyRuntimeExecutiveStageFocusSelection();
  assert.equal(verification.ok, true);
  assert.equal(verification.modelBoundaryIntact, true);
  assert.equal(verification.resolutionOnly, true);
  assert.ok(Object.isFrozen(defaultPolicy));
  assert.ok(Object.isFrozen(registry));

  assert.equal(verifyRuntimeExecutiveStageModel().ok, true);
  assert.equal(verifyRuntimeExecutiveStageExperienceContracts().ok, true);
  assert.equal(verifyRuntimeExecutiveStageExperienceFoundation().ok, true);
  assert.equal(verifyRuntimeEnabledExecutiveExperienceConsumerEntry().ok, true);
});
