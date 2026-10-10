/**
 * NPA-T STAGE-DISCLOSURE-BUDGET-ALIGNMENT:1 — single Watch budget authority.
 */

import assert from "node:assert/strict";
import test from "node:test";

import {
  EXECUTIVE_STAGE_WATCH_BUDGET,
  rankExecutiveWatchCandidates,
  resolveExecutiveStageDisclosure,
  resolveExecutiveStageWatchBudget,
  type ExecutiveStageProductivitySubjectInput,
} from "@/app/lib/spatial-presentation/executiveStageProductivityContract.ts";
import { resolveNexoraMVPStageScenePresentation } from "@/app/lib/nex-mvp/nexora3DExecutiveStage.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  resetNexoraMVPObjectInteractionOverview,
  selectNexoraMVPInteractionSubject,
  type NexoraMVPObjectInteractionCatalog,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  formatNexoraMvpStagePopulationBadge,
  resolveNexoraMvpStagePopulationSnapshot,
} from "@/app/lib/nex-mvp/nexoraMvpComposedPopulation.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();

function overviewState(environmentIntent: "neutral" | "investigate" = "neutral") {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent,
  });
}

function subjects(nextCatalog: NexoraMVPObjectInteractionCatalog = catalog) {
  return nextCatalog.objects.map((object) =>
    Object.freeze({
      subjectId: object.id,
      label: object.label,
      objectKind: object.kind,
      family: "business-object" as const,
      attention: object.attention,
      status: object.status,
    }),
  );
}

function disclosure(input?: {
  readonly nextSubjects?: readonly ExecutiveStageProductivitySubjectInput[];
  readonly presentationDepth?: "minimum" | "report" | "operation";
  readonly watchBudgetMax?: number;
}) {
  return resolveExecutiveStageDisclosure({
    subjects: input?.nextSubjects ?? subjects(),
    relationships: catalog.relationships,
    presentationMode: "overview",
    presentationDepth: input?.presentationDepth ?? "minimum",
    ...(input?.watchBudgetMax !== undefined
      ? { watchBudgetMax: input.watchBudgetMax }
      : {}),
  });
}

function composedPrimaryIds(
  presentation: ReturnType<typeof deriveNexoraMVPStageInteractionPresentation>,
) {
  return presentation.scene.objects
    .filter(
      (object) =>
        object.stageRepresentationRole === "primary-body" &&
        object.spatialRole !== "hidden" &&
        object.disclosureState !== "hidden",
    )
    .map((object) => object.id)
    .sort();
}

test("canonical depth mapping and omitted-budget default have one authority", () => {
  assert.deepEqual(EXECUTIVE_STAGE_WATCH_BUDGET.byPresentationDepth, {
    minimum: 2,
    report: 3,
    operation: 3,
  });
  assert.equal(resolveExecutiveStageWatchBudget({}), 2);
  assert.equal(
    resolveExecutiveStageWatchBudget({ presentationDepth: "minimum" }),
    2,
  );
  assert.equal(
    resolveExecutiveStageWatchBudget({ presentationDepth: "report" }),
    3,
  );
  assert.equal(
    resolveExecutiveStageWatchBudget({ presentationDepth: "operation" }),
    3,
  );
  assert.equal(disclosure().resolvedWatchBudget, 2);
});

test("explicit caps are bounded; zero and invalid budgets fail closed", () => {
  assert.equal(
    resolveExecutiveStageWatchBudget({
      presentationDepth: "minimum",
      watchBudgetMax: 1,
    }),
    1,
  );
  assert.equal(
    resolveExecutiveStageWatchBudget({
      presentationDepth: "minimum",
      watchBudgetMax: 99,
    }),
    3,
  );
  for (const invalid of [0, -1, Number.NaN, 1.5]) {
    assert.throws(
      () => resolveExecutiveStageWatchBudget({ watchBudgetMax: invalid }),
      RangeError,
    );
  }
});

test("six eligible candidates are ranked before the minimum-depth slice", () => {
  const six = ["obj-f", "obj-c", "obj-a", "obj-e", "obj-b", "obj-d"].map(
    (id) =>
      Object.freeze({
        subjectId: id,
        objectKind: id === "obj-f" ? "risk" : "object",
        family: "business-object" as const,
        attention: "critical",
        status: "watch",
      }),
  );
  const first = disclosure({ nextSubjects: six });
  const reversed = disclosure({
    nextSubjects: Object.freeze([...six].reverse()),
  });
  assert.equal(first.resolvedWatchBudget, 2);
  assert.deepEqual(first.rankedWatchObjectIds, [
    "obj-a",
    "obj-b",
    "obj-c",
    "obj-d",
    "obj-e",
    "obj-f",
  ]);
  assert.deepEqual(first.watchObjectIds, ["obj-a", "obj-b"]);
  assert.deepEqual(reversed.watchObjectIds, first.watchObjectIds);
  assert.equal(
    first.byId.get("obj-c")?.disclosureReason,
    "hidden-watch-overflow",
  );
  assert.equal(first.watchObjectIds.includes("obj-f"), false);
});

test("ranking helper remains deterministic and unchanged", () => {
  const forward = rankExecutiveWatchCandidates({
    candidates: subjects(),
    maxVisible: 2,
  });
  const reversed = rankExecutiveWatchCandidates({
    candidates: Object.freeze([...subjects()].reverse()),
    maxVisible: 2,
  });
  assert.deepEqual(forward.rankedIds, reversed.rankedIds);
  assert.deepEqual(forward.visibleIds, ["obj-risk", "obj-capacity"]);
});

test("fewer candidates and large budgets do not synthesize or duplicate bodies", () => {
  const one = Object.freeze([
    Object.freeze({
      subjectId: "obj-only",
      objectKind: "object",
      family: "business-object" as const,
      attention: "critical",
      status: "watch",
    }),
  ]);
  const result = disclosure({ nextSubjects: one, watchBudgetMax: 99 });
  assert.equal(result.resolvedWatchBudget, 3);
  assert.deepEqual(result.watchObjectIds, ["obj-only"]);
});

test("orientation fallback consumes the same canonical minimum-depth budget", () => {
  const stable = Object.freeze(
    ["obj-z", "obj-a", "obj-m"].map((id) =>
      Object.freeze({
        subjectId: id,
        objectKind: "object",
        family: "business-object" as const,
        attention: "normal",
        status: "stable",
      }),
    ),
  );
  const result = disclosure({ nextSubjects: stable });
  assert.equal(result.resolvedWatchBudget, 2);
  assert.deepEqual(result.watchObjectIds, ["obj-a", "obj-m"]);
  assert.ok(
    result.watchObjectIds.every(
      (id) => result.byId.get(id)?.disclosureReason === "orientation-fallback",
    ),
  );
});

test("derive, scene, and direct disclosure agree for the same Overview context", () => {
  const state = overviewState();
  const derived = deriveNexoraMVPStageInteractionPresentation(state, catalog, {
    consultExecutiveChangeSessionStore: false,
  });
  const scene = resolveNexoraMVPStageScenePresentation({
    objects: catalog.objects,
    relationships: catalog.relationships,
    selectedObjectId: null,
    focusedObjectId: null,
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const direct = disclosure();
  const sceneWatchIds = scene.objects
    .filter((object) => object.spatialRole === "watch")
    .map((object) => object.id)
    .sort();
  assert.equal(direct.resolvedWatchBudget, 2);
  assert.deepEqual(sceneWatchIds, [...direct.watchObjectIds].sort());
  assert.deepEqual(composedPrimaryIds(derived), sceneWatchIds);
});

test("management-state changes can change candidates without changing budget", () => {
  const changedCatalog = Object.freeze({
    ...catalog,
    objects: Object.freeze(
      catalog.objects.map((object) =>
        object.id === "obj-customer"
          ? Object.freeze({ ...object, attention: "critical" as const, status: "watch" })
          : object.id === "obj-risk"
            ? Object.freeze({ ...object, attention: "normal" as const, status: "stable" })
            : object,
      ),
    ),
  });
  const before = disclosure();
  const after = disclosure({ nextSubjects: subjects(changedCatalog) });
  assert.equal(before.resolvedWatchBudget, after.resolvedWatchBudget);
  assert.notDeepEqual(before.watchObjectIds, after.watchObjectIds);
});

test("theme and OVS identity do not influence the Watch budget", () => {
  const day = deriveNexoraMVPStageInteractionPresentation(
    overviewState("neutral"),
    catalog,
    { consultExecutiveChangeSessionStore: false },
  );
  const night = deriveNexoraMVPStageInteractionPresentation(
    overviewState("investigate"),
    catalog,
    { consultExecutiveChangeSessionStore: false },
  );
  assert.deepEqual(composedPrimaryIds(day), composedPrimaryIds(night));
  assert.equal(
    resolveExecutiveStageWatchBudget({ presentationDepth: "minimum" }),
    2,
  );
});

test("focus and executive-work CENTER lifecycles do not leak into Overview budget", () => {
  const initial = overviewState();
  const initialPresentation = deriveNexoraMVPStageInteractionPresentation(
    initial,
    catalog,
    { consultExecutiveChangeSessionStore: false },
  );
  for (const id of [
    "obj-capacity",
    "ctx-problem-capacity",
    "ctx-scenario-capacity",
  ]) {
    const focused = selectNexoraMVPInteractionSubject(initial, id, catalog);
    const focusedPresentation = deriveNexoraMVPStageInteractionPresentation(
      focused,
      catalog,
      { consultExecutiveChangeSessionStore: false },
    );
    assert.equal(focusedPresentation.presentationMode, "object-focus");
    const restored = resetNexoraMVPObjectInteractionOverview(focused);
    const restoredPresentation = deriveNexoraMVPStageInteractionPresentation(
      restored,
      catalog,
      { consultExecutiveChangeSessionStore: false },
    );
    assert.deepEqual(
      composedPrimaryIds(restoredPresentation),
      composedPrimaryIds(initialPresentation),
    );
  }
});

test("catalog, composed, rendered, and On Stage count semantics remain separate", () => {
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    overviewState(),
    catalog,
    { consultExecutiveChangeSessionStore: false },
  );
  const snapshot = resolveNexoraMvpStagePopulationSnapshot({
    catalog,
    composedObjects: presentation.scene.objects,
  });
  assert.equal(snapshot.catalogPrimaryCount, 8);
  assert.equal(snapshot.composedPrimaryCount, 2);
  assert.equal(
    formatNexoraMvpStagePopulationBadge(snapshot.composedPrimaryCount),
    "On Stage · 2",
  );
});
