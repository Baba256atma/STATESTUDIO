import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  DEFAULT_RUNTIME_EXECUTIVE_STAGE_ATTENTION_POLICY as attentionPolicy,
  DEFAULT_RUNTIME_EXECUTIVE_STAGE_PRESENTATION_POLICY as presentationPolicy,
  RUNTIME_EXECUTIVE_STAGE_ATTENTION_LEVELS as attentionLevels,
  RUNTIME_EXECUTIVE_STAGE_ATTENTION_REASON_KINDS as attentionReasons,
  RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_BOUNDARY as boundary,
  RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_CAPABILITIES as capabilities,
  RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_INVARIANTS as invariants,
  RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_PUBLIC_TYPE_NAMES as publicTypes,
  RUNTIME_EXECUTIVE_STAGE_PRESENTATION_ATTENTION_REGISTRY as registry,
  RUNTIME_EXECUTIVE_STAGE_PRESENTATION_REASON_KINDS as presentationReasons,
  RUNTIME_EXECUTIVE_STAGE_PRESENTATION_STATES as presentationStates,
  canRuntimeExecutiveStageSubjectUsePresentationState,
  getRuntimeExecutiveStageAttentionAssignments,
  getRuntimeExecutiveStagePresentationAssignments,
  getRuntimeExecutiveStagePresentationAttentionIdentity,
  getRuntimeExecutiveStagePresentationEligibility,
  projectRuntimeExecutiveStagePresentationAttention,
  resolveRuntimeExecutiveStagePresentationAttention,
  resolveRuntimeExecutiveStagePresentationAttentionFromSelection,
  runtimeExecutiveStagePresentationAttention as module,
  runtimeExecutiveStagePresentationAttentionApiNames as apiNames,
  runtimeExecutiveStagePresentationAttentionCanonicalIdentity as canonicalIdentity,
  verifyRuntimeExecutiveStagePresentationAttention,
  verifyRuntimeExecutiveStagePresentationAttentionResult,
} from "./runtimeExecutiveStagePresentationAttention.ts";

import {
  createRuntimeExecutiveStageModel,
  projectRuntimeExecutiveStageFocusSelection,
  resolveRuntimeExecutiveStageFocusSelection,
  runtimeExecutiveStageFocusSelectionIdentity,
  verifyRuntimeExecutiveStageFocusSelection,
} from "@/app/lib/rex/runtimeExecutiveStageFocusSelection";

import { verifyRuntimeExecutiveStageModel } from "@/app/lib/rex/runtimeExecutiveStageModel";

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
  new URL("./runtimeExecutiveStagePresentationAttention.ts", import.meta.url),
  "utf8",
);

function buildNeutralModel(options?: {
  readonly supplierAttention?: "normal" | "elevated" | "warning" | "critical";
}) {
  const supplier = createRuntimeExecutiveStageSubject({
    subjectId: "object.supplier",
    kind: "object",
    label: "Supplier",
    presentationState: "minimum",
    visibility: "visible",
    selection: "unselected",
    focusRole: "unfocused",
    attention: options?.supplierAttention ?? "elevated",
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
    presentationState: "minimum",
    visibility: "visible",
    selection: "unselected",
    focusRole: "unfocused",
    attention: "normal",
  });
  const kpi = createRuntimeExecutiveStageSubject({
    subjectId: "kpi.production",
    kind: "kpi",
    label: "Production KPI",
    presentationState: "minimum",
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

  const scene = createRuntimeExecutiveStageScene({
    sceneId: "scene.factory-expansion",
    revision: "r1",
    subjects: [supplier, warehouse, factory, kpi, customer],
    connections: [
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
    ],
    sceneState: "active",
    context: createRuntimeExecutiveStageContext({
      contextId: "ctx.factory-expansion",
      activeSubjectId: factory.subjectId,
      presentationState: "operation",
    }),
  });

  return createRuntimeExecutiveStageModel({
    modelId: "model.factory-expansion",
    sceneContract: createRuntimeExecutiveStageSceneContract({
      scene,
      source: "executive",
    }),
  });
}

function selectFactory() {
  const model = buildNeutralModel();
  const focusSelection = resolveRuntimeExecutiveStageFocusSelection({
    model,
    selectionRequest: { kind: "select", subjectId: "object.factory" },
    source: "executive",
  });
  const focusedModel = projectRuntimeExecutiveStageFocusSelection(
    model,
    focusSelection,
  );
  return { model, focusSelection, focusedModel };
}

test("1. exact identity / version / namespace / consumer role", () => {
  assert.equal(
    module.identity,
    "REX-2:5/RuntimeExecutiveStagePresentationAttention",
  );
  assert.equal(module.version, "2.5.0");
  assert.equal(module.namespace, "nexora.rex.stage.presentation-attention");
  assert.equal(module.phase, "PresentationAttention");
  assert.equal(module.consumerRole, "InternalRuntimeResolver");
  assert.deepEqual(
    getRuntimeExecutiveStagePresentationAttentionIdentity(),
    canonicalIdentity,
  );
});

test("2. sole immediate dependency is REX-2:4 Focus & Selection", () => {
  assert.equal(
    module.upstreamDependency,
    "REX-2:4/RuntimeExecutiveStageFocusSelection",
  );
  assert.equal(
    module.upstreamDependency,
    runtimeExecutiveStageFocusSelectionIdentity,
  );
  assert.equal(
    module.dependencyPath,
    "@/app/lib/rex/runtimeExecutiveStageFocusSelection",
  );
  const imports = [
    ...new Set(
      [...source.matchAll(/from\s+["']([^"']+)["']/g)].map((match) => match[1]),
    ),
  ];
  assert.deepEqual(imports, [
    "@/app/lib/rex/runtimeExecutiveStageFocusSelection",
  ]);
});

test("3. no direct earlier REX / DRI / NOL / EX-DRI imports", () => {
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeExecutiveStage(?:Model|ExperienceFoundation|ExperienceContracts)["']/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/rex\/runtimeEnabledExecutiveExperience/,
  );
  assert.doesNotMatch(
    source,
    /from\s+["']@\/app\/lib\/(?:ex-dri|dri|nol)(?:\/[^"']*)?["']/,
  );
  assert.equal(boundary.consumesFocusSelectionOnly, true);
  assert.equal(boundary.importsRex23Directly, false);
  assert.equal(boundary.importsRex22Directly, false);
  assert.equal(boundary.importsRex21Directly, false);
});

test("4. canonical presentation states and attention levels; policies", () => {
  assert.deepEqual([...presentationStates], ["minimum", "report", "operation"]);
  assert.ok(attentionLevels.includes("normal"));
  assert.ok(attentionLevels.includes("warning"));
  assert.ok(attentionLevels.includes("critical"));
  assert.equal(presentationPolicy.primaryFocusMinimumState, "report");
  assert.equal(presentationPolicy.selectedPrimaryPrefersOperation, true);
  assert.equal(attentionPolicy.preserveExistingWarningOrCritical, true);
  assert.equal(attentionPolicy.maxElevatedSubjects, 3);
});

test("5. Factory selection — presentation/attention resolution", () => {
  const { focusedModel, focusSelection } = selectFactory();
  const result = resolveRuntimeExecutiveStagePresentationAttention({
    model: focusedModel,
    focusSelection,
    source: "executive",
  });

  assert.equal(result.status, "accepted");
  const byPresentation = Object.fromEntries(
    result.presentationAssignments.map((a) => [
      a.subjectId,
      a.presentationState,
    ]),
  );
  const byAttention = Object.fromEntries(
    result.attentionAssignments.map((a) => [a.subjectId, a.attention]),
  );

  assert.equal(byPresentation["object.factory"], "operation");
  assert.equal(byPresentation["kpi.production"], "report");
  assert.equal(byPresentation["object.warehouse"], "report");
  assert.equal(byPresentation["object.supplier"], "minimum");
  assert.equal(byPresentation["object.customer"], "minimum");

  assert.equal(byAttention["kpi.production"], "warning");
  assert.equal(byAttention["object.factory"], "elevated");

  assert.equal(
    result.focusSelection.resolvedSelectedSubjectId,
    "object.factory",
  );
  assert.equal(
    result.focusSelection.resolvedPrimaryFocusSubjectId,
    "object.factory",
  );
  assert.equal(verifyRuntimeExecutiveStagePresentationAttentionResult(result).ok, true);
});

test("6. operation eligibility — KPI cannot operate; falls back to report", () => {
  const model = buildNeutralModel();
  const focusSelection = resolveRuntimeExecutiveStageFocusSelection({
    model,
    selectionRequest: { kind: "select", subjectId: "kpi.production" },
    focusRequest: { primaryFocusSubjectId: "kpi.production" },
    source: "executive",
  });
  const focusedModel = projectRuntimeExecutiveStageFocusSelection(
    model,
    focusSelection,
  );
  const eligibility = getRuntimeExecutiveStagePresentationEligibility("kpi");
  assert.equal(eligibility.supportsOperation, false);
  assert.equal(
    canRuntimeExecutiveStageSubjectUsePresentationState(
      focusedModel.subjects.find((s) => s.subjectId === "kpi.production")!,
      "operation",
    ),
    false,
  );

  const result = resolveRuntimeExecutiveStagePresentationAttention({
    model: focusedModel,
    focusSelection,
    presentationRequests: [
      {
        subjectId: "kpi.production",
        presentationState: "operation",
      },
    ],
    source: "director",
  });

  const kpi = result.presentationAssignments.find(
    (a) => a.subjectId === "kpi.production",
  )!;
  assert.equal(kpi.presentationState, "report");
  assert.equal(kpi.reason.kind, "subject-ineligible-for-operation");
});

test("7. critical supplier promotion; attention/focus/presentation independence", () => {
  const model = buildNeutralModel({ supplierAttention: "critical" });
  const focusSelection = resolveRuntimeExecutiveStageFocusSelection({
    model,
    selectionRequest: { kind: "select", subjectId: "object.factory" },
    source: "executive",
  });
  const focusedModel = projectRuntimeExecutiveStageFocusSelection(
    model,
    focusSelection,
  );
  const result = resolveRuntimeExecutiveStagePresentationAttention({
    model: focusedModel,
    focusSelection,
    source: "runtime",
  });

  const supplierPresentation = result.presentationAssignments.find(
    (a) => a.subjectId === "object.supplier",
  )!;
  const supplierAttention = result.attentionAssignments.find(
    (a) => a.subjectId === "object.supplier",
  )!;
  assert.equal(supplierAttention.attention, "critical");
  assert.equal(supplierPresentation.presentationState, "report");
  assert.equal(supplierPresentation.reason.kind, "critical-promotion");
  assert.equal(supplierPresentation.focusRole, "contextual");

  // focus != attention
  assert.notEqual(supplierPresentation.focusRole, "primary");
  assert.equal(supplierAttention.attention, "critical");

  // Factory primary + elevated attention, operation presentation — independent dimensions
  const factory = result.presentationAssignments.find(
    (a) => a.subjectId === "object.factory",
  )!;
  const factoryAtt = result.attentionAssignments.find(
    (a) => a.subjectId === "object.factory",
  )!;
  assert.equal(factory.focusRole, "primary");
  assert.equal(factory.presentationState, "operation");
  assert.equal(factoryAtt.attention, "elevated");
  assert.notEqual(factory.presentationState, factoryAtt.attention);
});

test("8. explicit overrides, preservation, idempotence", () => {
  const { focusedModel, focusSelection } = selectFactory();
  const first = resolveRuntimeExecutiveStagePresentationAttention({
    model: focusedModel,
    focusSelection,
    source: "executive",
  });
  const projected = projectRuntimeExecutiveStagePresentationAttention(
    focusedModel,
    first,
  );
  const second = resolveRuntimeExecutiveStagePresentationAttention({
    model: projected,
    focusSelection,
    source: "executive",
  });
  assert.equal(second.presentationChanged, false);
  assert.equal(second.attentionChanged, false);

  const overridden = resolveRuntimeExecutiveStagePresentationAttention({
    model: focusedModel,
    focusSelection,
    presentationRequests: [
      { subjectId: "object.customer", presentationState: "report" },
    ],
    attentionRequests: [
      { subjectId: "object.warehouse", attention: "informational" },
    ],
    source: "advisor",
  });
  assert.equal(
    overridden.presentationAssignments.find(
      (a) => a.subjectId === "object.customer",
    )?.presentationState,
    "report",
  );
  assert.equal(
    overridden.attentionAssignments.find(
      (a) => a.subjectId === "object.warehouse",
    )?.attention,
    "informational",
  );
});

test("9. projection preserves selection/focus/visibility/membership/order", () => {
  const { focusedModel, focusSelection } = selectFactory();
  const before = {
    subjects: focusedModel.subjects.map((s) => s.subjectId),
    connections: focusedModel.connections.map((c) => c.connectionId),
    visibility: focusedModel.subjects.map((s) => ({
      id: s.subjectId,
      v: s.visibility,
    })),
    selection: focusedModel.selection.selectedSubjectId,
    primary: focusedModel.focus.primaryFocusSubjectId,
    supporting: [...focusedModel.focus.secondaryFocusSubjectIds],
  };

  const result = resolveRuntimeExecutiveStagePresentationAttention({
    model: focusedModel,
    focusSelection,
    source: "executive",
  });
  const projected = projectRuntimeExecutiveStagePresentationAttention(
    focusedModel,
    result,
  );

  assert.deepEqual(
    projected.subjects.map((s) => s.subjectId),
    before.subjects,
  );
  assert.deepEqual(
    projected.connections.map((c) => c.connectionId),
    before.connections,
  );
  assert.deepEqual(
    projected.subjects.map((s) => ({ id: s.subjectId, v: s.visibility })),
    before.visibility,
  );
  assert.equal(projected.selection.selectedSubjectId, before.selection);
  assert.equal(projected.focus.primaryFocusSubjectId, before.primary);
  assert.deepEqual(
    [...projected.focus.secondaryFocusSubjectIds].sort(),
    [...before.supporting].sort(),
  );
  assert.equal(projected.revision, focusedModel.revision);

  // input immutability
  assert.equal(
    focusedModel.subjects.find((s) => s.subjectId === "object.factory")
      ?.presentationState,
    "minimum",
  );
  assert.ok(Object.isFrozen(focusedModel));
});

test("10. no renderer / orchestration / focus-selection re-resolution APIs", () => {
  assert.doesNotMatch(source, /from\s+["']react["']/);
  assert.doesNotMatch(source, /from\s+["']three["']/);
  assert.doesNotMatch(source, /\b(ReactNode|HTMLElement|document\.|window\.)\b/);
  assert.doesNotMatch(
    source,
    /\b(?:export\s+)?function\s+(?:resolveRuntimeExecutiveStageSelection|resolveRuntimeExecutiveStageFocus)\b/,
  );
  assert.doesNotMatch(
    source,
    /\b(?:export\s+)?function\s+(?:orchestrate|render|animate|transition|layout)[A-Za-z0-9_]*\b/,
  );
  assert.doesNotMatch(source, /\b(should-be-red|pulse-object|flash-warning)\b/);
  for (const name of apiNames) {
    assert.doesNotMatch(name, /orchestrat|render|animate|visibility|layout|color/i);
  }
  assert.equal(boundary.resolvesSelection, false);
  assert.equal(boundary.resolvesFocus, false);
  assert.equal(boundary.resolvesVisibility, false);
  assert.equal(boundary.orchestratesScene, false);
  assert.equal(boundary.mapsColors, false);
  assert.equal(boundary.definesAnimation, false);
  assert.ok(!capabilities.includes("scene-orchestration" as never));
});

test("11. registry, structured reasons, regressions", () => {
  assert.equal(registry.capabilityCount, capabilities.length);
  assert.equal(registry.publicTypeCount, publicTypes.length);
  assert.equal(registry.publicApiCount, apiNames.length);
  assert.equal(registry.invariantCount, invariants.length);
  assert.equal(registry.presentationReasonKindCount, presentationReasons.length);
  assert.equal(registry.attentionReasonKindCount, attentionReasons.length);
  assert.equal(invariants.length, 45);
  assert.ok(capabilities.includes("attention-aware-presentation-promotion"));
  assert.ok(capabilities.includes("operation-presentation"));

  const fromSelection =
    resolveRuntimeExecutiveStagePresentationAttentionFromSelection({
      model: buildNeutralModel(),
      selectionSubjectId: "object.factory",
      source: "executive",
    });
  assert.equal(fromSelection.status, "accepted");
  assert.ok(
    getRuntimeExecutiveStagePresentationAssignments(fromSelection).length > 0,
  );
  assert.ok(
    getRuntimeExecutiveStageAttentionAssignments(fromSelection).length > 0,
  );

  const verification = verifyRuntimeExecutiveStagePresentationAttention();
  assert.equal(verification.ok, true);
  assert.equal(verification.focusSelectionBoundaryIntact, true);
  assert.equal(verification.resolutionOnly, true);

  assert.equal(verifyRuntimeExecutiveStageFocusSelection().ok, true);
  assert.equal(verifyRuntimeExecutiveStageModel().ok, true);
  assert.equal(verifyRuntimeExecutiveStageExperienceContracts().ok, true);
  assert.equal(verifyRuntimeExecutiveStageExperienceFoundation().ok, true);
  assert.equal(verifyRuntimeEnabledExecutiveExperienceConsumerEntry().ok, true);
});
