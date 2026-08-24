/**
 * NPA-T — Executive Queue hydration: deterministic initial derive.
 *
 * Root cause covered: process-global change-baseline session store pollution
 * must not append `changes-since-visit` during SSR-equivalent derive.
 */

import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  openNexoraMVPExecutiveQueueCollection,
  buildNexoraMVPExecutiveChangeSnapshot,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";
import { applyNexoraMVPWorkspaceChangeToInteraction } from "@/app/lib/nex-mvp/nexoraMVPWorkspacePresentation";
import { resolveNexoraMVPDataRealityAwareStageExperience } from "@/app/lib/nex-mvp/nexoraMVPDataRealityAwareStageExperience";
import {
  ensureExecutiveChangeBaseline,
  resetExecutiveChangeBaselineStoreForTests,
  shouldConsultExecutiveChangeSessionStoreForPresentation,
  EXECUTIVE_CHANGE_PRODUCTIVITY_CATEGORY,
} from "@/app/lib/spatial-presentation/executiveStageChangeIntelligence";
import { EXECUTIVE_QUEUE_CATEGORY_LABELS } from "@/app/lib/spatial-presentation/executiveStageQueueFoundation";
import { createEmptyNexoraExecutiveContextSnapshot } from "@/app/lib/conversational-control/executiveContextSnapshot";

function initialState(workspace: "overview" | "decision" = "overview") {
  return createInitialNexoraMVPObjectInteractionState({
    workspace,
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function queueFingerprint(
  presentation: ReturnType<typeof deriveNexoraMVPStageInteractionPresentation>,
) {
  return (presentation.queueEntries ?? []).map((entry) =>
    Object.freeze({
      category: entry.category,
      count: entry.count,
      objectIds: [...entry.objectIds],
      isActive: entry.isActive,
      collectionKind: entry.collectionKind ?? "object-kind",
      label: entry.label ?? null,
      collectionHeaderLabel: presentation.collectionHeader?.label ?? null,
    }),
  );
}

test("SSR gate: session store consult is false in Node (hydration-safe default)", () => {
  assert.equal(shouldConsultExecutiveChangeSessionStoreForPresentation(), false);
});

test("1–4 — deterministic Queue derivation + identical snapshots + stable order/counts", () => {
  resetExecutiveChangeBaselineStoreForTests();
  const experience = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "baseline",
    currentWorkspace: "overview",
    presentationState: "minimum",
  });
  const state = initialState();
  const a = deriveNexoraMVPStageInteractionPresentation(
    state,
    experience.catalog,
  );
  const b = deriveNexoraMVPStageInteractionPresentation(
    state,
    experience.catalog,
  );
  assert.deepEqual(queueFingerprint(a), queueFingerprint(b));
  const categories = (a.queueEntries ?? []).map((e) => e.category);
  assert.deepEqual(categories, [...categories].sort((left, right) => {
    const order = ["problem", "scenario", "decision", "execution", "changes-since-visit"];
    return order.indexOf(left) - order.indexOf(right);
  }));
  for (const entry of a.queueEntries ?? []) {
    assert.ok(entry.count > 0);
    assert.equal(entry.objectIds.length, entry.count);
  }
});

test("5 — empty Queue when catalog has no context subjects", () => {
  resetExecutiveChangeBaselineStoreForTests();
  const experience = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "baseline",
    currentWorkspace: "overview",
    presentationState: "minimum",
  });
  const emptyCatalog = Object.freeze({
    ...experience.catalog,
    contextSubjects: Object.freeze([] as typeof experience.catalog.contextSubjects),
  });
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    initialState(),
    emptyCatalog,
  );
  assert.equal((presentation.queueEntries ?? []).length, 0);
});

test("6–7 — active Queue category + collection header", () => {
  resetExecutiveChangeBaselineStoreForTests();
  const experience = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "baseline",
    currentWorkspace: "overview",
    presentationState: "minimum",
  });
  const state = openNexoraMVPExecutiveQueueCollection(
    initialState(),
    "problem",
    experience.catalog,
  );
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    experience.catalog,
  );
  const active = presentation.queueEntries?.find((e) => e.isActive);
  assert.equal(active?.category, "problem");
  assert.ok(presentation.collectionHeader?.label);
  assert.match(
    presentation.collectionHeader!.label,
    /Problem/i,
  );
  assert.equal(
    active?.label,
    EXECUTIVE_QUEUE_CATEGORY_LABELS.problem,
  );
});

test("8 — workspace transition keeps deterministic Queue categories", () => {
  resetExecutiveChangeBaselineStoreForTests();
  const experience = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "baseline",
    currentWorkspace: "overview",
    presentationState: "minimum",
  });
  let state = initialState();
  const before = queueFingerprint(
    deriveNexoraMVPStageInteractionPresentation(state, experience.catalog),
  );
  state = applyNexoraMVPWorkspaceChangeToInteraction(state, "decision");
  const after = queueFingerprint(
    deriveNexoraMVPStageInteractionPresentation(state, experience.catalog),
  );
  assert.deepEqual(
    before.map((e) => e.category),
    after.map((e) => e.category),
  );
  assert.deepEqual(
    before.map((e) => e.count),
    after.map((e) => e.count),
  );
});

test("9 — interaction transition (collection open/close) preserves non-active counts", () => {
  resetExecutiveChangeBaselineStoreForTests();
  const experience = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "baseline",
    currentWorkspace: "overview",
    presentationState: "minimum",
  });
  const overview = deriveNexoraMVPStageInteractionPresentation(
    initialState(),
    experience.catalog,
  );
  const opened = deriveNexoraMVPStageInteractionPresentation(
    openNexoraMVPExecutiveQueueCollection(
      initialState(),
      "scenario",
      experience.catalog,
    ),
    experience.catalog,
  );
  for (const entry of overview.queueEntries ?? []) {
    const match = opened.queueEntries?.find((e) => e.category === entry.category);
    assert.ok(match);
    assert.equal(match!.count, entry.count);
    assert.deepEqual([...match!.objectIds], [...entry.objectIds]);
  }
  assert.equal(
    opened.queueEntries?.find((e) => e.category === "scenario")?.isActive,
    true,
  );
});

test("10 — resolveExecutiveQueueEntries path does not mutate catalog subject arrays", () => {
  resetExecutiveChangeBaselineStoreForTests();
  const experience = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "baseline",
    currentWorkspace: "overview",
    presentationState: "minimum",
  });
  const before = experience.catalog.contextSubjects.map((s) => s.id);
  deriveNexoraMVPStageInteractionPresentation(
    initialState(),
    experience.catalog,
  );
  assert.deepEqual(
    experience.catalog.contextSubjects.map((s) => s.id),
    before,
  );
});

test("11 — CC session empty initial context does not alter Queue", () => {
  resetExecutiveChangeBaselineStoreForTests();
  const experience = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "baseline",
    currentWorkspace: "overview",
    presentationState: "minimum",
  });
  const emptyCc = createEmptyNexoraExecutiveContextSnapshot({
    currentWorkspaceId: "overview",
  });
  assert.equal(emptyCc.lastRecommendationId, null);
  assert.equal(emptyCc.presentedSet, null);
  assert.equal(emptyCc.currentScenario, null);
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    initialState(),
    experience.catalog,
  );
  // Queue derives from catalog/interaction only — empty CC snapshot is unused.
  assert.ok((presentation.queueEntries?.length ?? 0) >= 1);
  void emptyCc;
});

test("12 — SSR-equivalent ignore: polluted session store must not add changes-since-visit", () => {
  resetExecutiveChangeBaselineStoreForTests();
  const baseline = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "baseline",
    currentWorkspace: "overview",
    presentationState: "minimum",
  });
  const pressure = resolveNexoraMVPDataRealityAwareStageExperience({
    datasetScenario: "operational-pressure",
    currentWorkspace: "overview",
    presentationState: "minimum",
  });
  const pressureSnap = buildNexoraMVPExecutiveChangeSnapshot(pressure.catalog, {
    workspace: "overview",
  });
  ensureExecutiveChangeBaseline({ currentSnapshot: pressureSnap });

  const ssrLike = deriveNexoraMVPStageInteractionPresentation(
    initialState(),
    baseline.catalog,
    { consultExecutiveChangeSessionStore: false },
  );
  const clientLikeFirstPaint = deriveNexoraMVPStageInteractionPresentation(
    initialState(),
    baseline.catalog,
    { consultExecutiveChangeSessionStore: false },
  );
  assert.deepEqual(queueFingerprint(ssrLike), queueFingerprint(clientLikeFirstPaint));
  assert.equal(
    ssrLike.queueEntries?.some(
      (e) => e.category === EXECUTIVE_CHANGE_PRODUCTIVITY_CATEGORY,
    ),
    false,
  );

  // Contrasting regressor: consulting polluted store would add the extra <li>.
  const pollutedConsult = deriveNexoraMVPStageInteractionPresentation(
    initialState(),
    baseline.catalog,
    { consultExecutiveChangeSessionStore: true },
  );
  assert.ok(
    pollutedConsult.queueEntries?.some(
      (e) => e.category === EXECUTIVE_CHANGE_PRODUCTIVITY_CATEGORY,
    ),
  );
});

test("identical initial snapshots: baseline + operational-pressure first paints have no change entry", () => {
  for (const datasetScenario of ["baseline", "operational-pressure"] as const) {
    resetExecutiveChangeBaselineStoreForTests();
    const experience = resolveNexoraMVPDataRealityAwareStageExperience({
      datasetScenario,
      currentWorkspace: "overview",
      presentationState: "minimum",
    });
    const first = deriveNexoraMVPStageInteractionPresentation(
      initialState(),
      experience.catalog,
      { consultExecutiveChangeSessionStore: false },
    );
    const second = deriveNexoraMVPStageInteractionPresentation(
      initialState(),
      experience.catalog,
      { consultExecutiveChangeSessionStore: false },
    );
    assert.deepEqual(queueFingerprint(first), queueFingerprint(second));
    assert.equal(
      first.queueEntries?.some(
        (e) => e.category === EXECUTIVE_CHANGE_PRODUCTIVITY_CATEGORY,
      ),
      false,
    );
  }
});
