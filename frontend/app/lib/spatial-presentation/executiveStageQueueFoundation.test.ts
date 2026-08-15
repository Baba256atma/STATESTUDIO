/**
 * STAGE-PROD:1 — Executive Queue Foundation & Collection Disclosure (A–Q).
 */

import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  openNexoraMVPExecutiveQueueCollection,
  resetNexoraMVPObjectInteractionOverview,
  resolveNexoraMVPExecutiveQueueSummary,
  resolveNexoraMVPPrimaryStageSubject,
  selectNexoraMVPInteractionSubject,
  stepBackNexoraMVPObjectInteraction,
  stepForwardNexoraMVPObjectInteraction,
  type NexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  NEXORA_MVP_CONTEXT_LINK_FIXTURES,
  NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES,
  type NexoraMVPContextSubjectFixture,
} from "../nex-mvp/nexoraMVPObjectInteractionFixtures.ts";
import {
  NEXORA_MVP_STAGE_OBJECT_FIXTURES,
  NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
} from "../nex-mvp/nexoraMVPStageFixtures.ts";
import {
  EXECUTIVE_STAGE_PRODUCTIVITY_REGIONS,
} from "./executiveStageProductivityContract.ts";
import {
  EXECUTIVE_QUEUE_ZERO_COUNT_POLICY,
  EXECUTIVE_STAGE_COLLECTION_BUDGET,
  buildExecutiveQueueFoundationObservability,
  encodeExecutiveQueueCollectionTrailId,
  getExecutiveStageQueueFoundationIdentity,
  isExecutiveQueueEligibleObject,
  rankExecutiveCollectionMembers,
  resolveExecutiveCollectionDisclosure,
  resolveExecutiveCollectionLayout,
  resolveExecutiveQueueEntries,
  verifyExecutiveStageQueueFoundation,
} from "./executiveStageQueueFoundation.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CAPTURE_DIR = join(
  __dirname,
  "../../../.certification/stage-prod-1-captures",
);

function defaultCatalog(): NexoraMVPObjectInteractionCatalog {
  return Object.freeze({
    objects: NEXORA_MVP_STAGE_OBJECT_FIXTURES,
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
    contextSubjects: NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES,
    contextLinks: NEXORA_MVP_CONTEXT_LINK_FIXTURES,
  });
}

function catalogWithSubjects(
  subjects: readonly NexoraMVPContextSubjectFixture[],
): NexoraMVPObjectInteractionCatalog {
  return Object.freeze({
    objects: NEXORA_MVP_STAGE_OBJECT_FIXTURES,
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
    contextSubjects: subjects,
    contextLinks: NEXORA_MVP_CONTEXT_LINK_FIXTURES,
  });
}

function subject(
  id: string,
  kind: NexoraMVPContextSubjectFixture["kind"],
  attention: NexoraMVPContextSubjectFixture["attention"] = "normal",
  status: NexoraMVPContextSubjectFixture["status"] = "stable",
): NexoraMVPContextSubjectFixture {
  return Object.freeze({ id, label: id, kind, attention, status });
}

/** Scenario A fixture: 3 / 5 / 2 / 4 */
function catalogA(): NexoraMVPObjectInteractionCatalog {
  return catalogWithSubjects([
    subject("p1", "problem", "critical", "risk"),
    subject("p2", "problem", "important", "watch"),
    subject("p3", "problem"),
    subject("s1", "scenario", "important"),
    subject("s2", "scenario"),
    subject("s3", "scenario"),
    subject("s4", "scenario"),
    subject("s5", "scenario"),
    subject("d1", "decision", "important"),
    subject("d2", "decision"),
    subject("e1", "execution"),
    subject("e2", "execution"),
    subject("e3", "execution"),
    subject("e4", "execution"),
  ]);
}

function writeCapture(name: string, html: string) {
  mkdirSync(CAPTURE_DIR, { recursive: true });
  writeFileSync(join(CAPTURE_DIR, `${name}.html`), html, "utf8");
}

function captureHtml(
  title: string,
  presentation: ReturnType<typeof deriveNexoraMVPStageInteractionPresentation>,
): string {
  const objects = presentation.scene.objects
    .filter((o) => o.disclosureState !== "hidden" && o.opacity > 0.05)
    .map(
      (o) =>
        `<div data-id="${o.id}" data-role="${o.role}" data-spatial="${o.spatialRole ?? ""}" style="left:${50 + o.targetPosition[0] * 12}%;top:${50 - o.targetPosition[1] * 14}%;">${o.label}</div>`,
    )
    .join("\n");
  const queue = (presentation.queueEntries ?? [])
    .map(
      (e) =>
        `<li data-category="${e.category}" data-active="${e.isActive}">${e.category} ${e.count}</li>`,
    )
    .join("");
  return `<!doctype html><html><head><meta charset="utf-8"/><title>${title}</title>
<style>
body{margin:0;background:#0a1018;color:#d7e0ea;font:14px/1.3 ui-sans-serif,system-ui}
.stage{position:relative;width:960px;height:540px;border:1px solid #243044;margin:24px auto;overflow:hidden}
.stage div[data-id]{position:absolute;transform:translate(-50%,-50%);padding:6px 10px;border:1px solid #3a516c;border-radius:4px;background:rgba(12,20,32,.85);font-size:12px;white-space:nowrap}
.queue{position:absolute;right:12px;top:50%;transform:translateY(-50%);width:140px;padding:10px;border-left:1px solid #3a516c;background:rgba(6,10,18,.7)}
.queue h2{margin:0 0 8px;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#8aa0b5}
.queue ul{list-style:none;margin:0;padding:0}
.queue li{display:flex;justify-content:space-between;padding:4px 0;font-size:12px}
.queue li[data-active="true"]{color:#7eb6e8}
.header{position:absolute;left:16px;top:12px;font-size:12px;color:#7eb6e8}
</style></head><body>
<h1 style="text-align:center;font-size:16px">${title}</h1>
<div class="stage" data-mode="${presentation.presentationMode}">
  <div class="header">${presentation.collectionHeader?.label ?? "Overview"}</div>
  ${objects}
  <aside class="queue"><h2>Executive Queue</h2><ul>${queue}</ul></aside>
</div>
</body></html>`;
}

test("STAGE-PROD:1 identity + boundary", () => {
  const identity = getExecutiveStageQueueFoundationIdentity();
  assert.equal(identity.id, "STAGE-PROD:1/ExecutiveStageQueueFoundation");
  assert.equal(identity.version, "1.0.0");
  const verified = verifyExecutiveStageQueueFoundation();
  assert.equal(verified.ok, true);
  assert.equal(EXECUTIVE_QUEUE_ZERO_COUNT_POLICY, "hide");
});

test("A — Queue Counts from catalog (3/5/2/4), not hard-coded UI", () => {
  const catalog = catalogA();
  const queue = resolveNexoraMVPExecutiveQueueSummary(catalog);
  assert.equal(queue.find((e) => e.category === "problem")?.count, 3);
  assert.equal(queue.find((e) => e.category === "scenario")?.count, 5);
  assert.equal(queue.find((e) => e.category === "decision")?.count, 2);
  assert.equal(queue.find((e) => e.category === "execution")?.count, 4);
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    createInitialNexoraMVPObjectInteractionState({
      workspace: "company",
      presentationState: "minimum",
      environmentIntent: "neutral",
    }),
    catalog,
  );
  for (const entry of presentation.queueEntries ?? []) {
    const resolved = queue.find((q) => q.category === entry.category);
    assert.equal(entry.count, resolved?.count);
  }
  writeCapture("01-overview-queue", captureHtml("Overview + Queue", presentation));
});

test("B — Queue is non-semantic", () => {
  const catalog = catalogA();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "company",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = openNexoraMVPExecutiveQueueCollection(state, "problem", catalog);
  assert.equal(state.collectionContext?.category, "problem");
  assert.equal(state.selectedSubject, null);
  assert.equal(state.focusedSubject, null);
  const primary = resolveNexoraMVPPrimaryStageSubject(state);
  assert.equal(primary.primaryStageSubjectId, null);
  assert.equal(primary.advisorSubjectId, null);
  assert.equal(primary.presentationMode, "collection");
  assert.notEqual(state.selectedSubject?.id, "nexora-collection:problem");
  assert.ok(
    !catalog.contextSubjects.some((s) => s.id === "obj-problems"),
  );
});

test("C — Problem Collection Disclosure", () => {
  const catalog = catalogA();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "company",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = openNexoraMVPExecutiveQueueCollection(state, "problem", catalog);
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    catalog,
  );
  assert.equal(presentation.presentationMode, "collection");
  assert.equal(presentation.collectionContext?.category, "problem");
  const visible = presentation.scene.objects.filter(
    (o) => o.spatialRole === "collection" && o.opacity > 0.05,
  );
  assert.equal(visible.length, 3);
  assert.ok(visible.every((o) => o.id.startsWith("p")));
  assert.ok((presentation.queueEntries ?? []).some((e) => e.isActive));
  writeCapture(
    "02-problems-collection",
    captureHtml("Problems Collection", presentation),
  );
});

test("D — Collection Layout: z=0, no overlap, no queue intrusion, no fake center", () => {
  const layout = resolveExecutiveCollectionLayout({
    objectIds: ["p1", "p2", "p3"],
  });
  const queue = EXECUTIVE_STAGE_PRODUCTIVITY_REGIONS.executiveQueue;
  const positions = Object.values(layout.positions);
  for (const pos of positions) {
    assert.equal(pos.z, 0);
    assert.ok(pos.x < queue.minX, "must stay outside queue region");
    assert.ok(!(Math.abs(pos.x) < 1e-4 && Math.abs(pos.y) < 1e-4));
  }
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const dx = positions[i]!.x - positions[j]!.x;
      const dy = positions[i]!.y - positions[j]!.y;
      assert.ok(Math.hypot(dx, dy) > 0.35, "no overlap");
    }
  }
});

test("E — Collection member click → CENTER + closes collection", () => {
  const catalog = catalogA();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "company",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = openNexoraMVPExecutiveQueueCollection(state, "problem", catalog);
  state = selectNexoraMVPInteractionSubject(state, "p2", catalog);
  assert.equal(state.collectionContext, null);
  assert.equal(state.selectedSubject?.id, "p2");
  assert.equal(state.focusedSubject?.id, "p2");
  const primary = resolveNexoraMVPPrimaryStageSubject(state);
  assert.equal(primary.primaryStageSubjectId, "p2");
  assert.equal(primary.advisorSubjectId, "p2");
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    catalog,
  );
  const center = presentation.scene.objects.find((o) => o.id === "p2");
  assert.ok(center);
  assert.equal(center!.focused, true);
  assert.equal(center!.targetPosition[0], 0);
  assert.equal(center!.targetPosition[1], 0);
  assert.equal(center!.targetPosition[2], 0);
  assert.equal(center!.spatialRole, "center");
  writeCapture(
    "06-problem-member-focused",
    captureHtml("Problem member focused", presentation),
  );
});

test("F — Scenario switch from Problems", () => {
  const catalog = catalogA();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "company",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = openNexoraMVPExecutiveQueueCollection(state, "problem", catalog);
  state = openNexoraMVPExecutiveQueueCollection(state, "scenario", catalog);
  assert.equal(state.collectionContext?.category, "scenario");
  assert.equal(state.collectionContext?.objectIds.length, 5);
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    catalog,
  );
  const visible = presentation.scene.objects.filter(
    (o) => o.spatialRole === "collection",
  );
  assert.ok(visible.every((o) => o.id.startsWith("s")));
  assert.ok(!visible.some((o) => o.id.startsWith("p")));
  assert.equal(
    presentation.queueEntries?.find((e) => e.category === "scenario")?.isActive,
    true,
  );
  writeCapture(
    "03-scenarios-collection",
    captureHtml("Scenarios Collection", presentation),
  );
});

test("G — Active row toggle restores prior / Overview", () => {
  const catalog = catalogA();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "company",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity", catalog);
  state = openNexoraMVPExecutiveQueueCollection(state, "problem", catalog);
  assert.equal(state.collectionContext?.category, "problem");
  state = openNexoraMVPExecutiveQueueCollection(state, "problem", catalog);
  assert.equal(state.collectionContext, null);
  assert.equal(state.focusedSubject?.id, "obj-capacity");

  state = openNexoraMVPExecutiveQueueCollection(state, "decision", catalog);
  state = openNexoraMVPExecutiveQueueCollection(state, "decision", catalog);
  // After toggle from capacity → decisions → toggle, restore capacity.
  assert.ok(
    state.mode === "overview" || state.focusedSubject?.id === "obj-capacity",
  );
});

test("H — Back navigation Overview → Collection → Focus", () => {
  const catalog = catalogA();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "company",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = openNexoraMVPExecutiveQueueCollection(state, "problem", catalog);
  state = selectNexoraMVPInteractionSubject(state, "p2", catalog);
  assert.equal(state.focusedSubject?.id, "p2");
  state = stepBackNexoraMVPObjectInteraction(state, catalog);
  assert.equal(state.collectionContext?.category, "problem");
  assert.equal(state.focusedSubject, null);
  state = stepBackNexoraMVPObjectInteraction(state, catalog);
  assert.equal(state.mode, "overview");
  assert.equal(state.collectionContext, null);
});

test("I — Forward restores Collection → Focus", () => {
  const catalog = catalogA();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "company",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = openNexoraMVPExecutiveQueueCollection(state, "problem", catalog);
  state = selectNexoraMVPInteractionSubject(state, "p2", catalog);
  state = stepBackNexoraMVPObjectInteraction(state, catalog);
  state = stepBackNexoraMVPObjectInteraction(state, catalog);
  state = stepForwardNexoraMVPObjectInteraction(state, catalog);
  assert.equal(state.collectionContext?.category, "problem");
  state = stepForwardNexoraMVPObjectInteraction(state, catalog);
  assert.equal(state.focusedSubject?.id, "p2");
  assert.equal(state.collectionContext, null);
});

test("J — Escape → Overview clears collection", () => {
  const catalog = catalogA();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "company",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = openNexoraMVPExecutiveQueueCollection(state, "problem", catalog);
  state = resetNexoraMVPObjectInteractionOverview(state);
  assert.equal(state.mode, "overview");
  assert.equal(state.collectionContext, null);
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    catalog,
  );
  assert.ok((presentation.queueEntries?.length ?? 0) > 0);
});

test("K — Advisor collection context (no fake semantic subject)", () => {
  const catalog = catalogA();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "company",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = openNexoraMVPExecutiveQueueCollection(state, "problem", catalog);
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    catalog,
  );
  const advisor = buildNexoraMVPAdvisorContextBridge(state, presentation);
  assert.equal(advisor.primaryStageSubjectId, null);
  assert.equal(advisor.advisorSubjectId, null);
  assert.equal(advisor.presentationMode, "collection");
  assert.equal(advisor.collectionCategory, "problem");
  assert.equal(advisor.collectionObjectCount, 3);
  assert.match(advisor.advisorPresentationContext ?? "", /Problems Collection · 3/);
});

test("L — Watch coexistence; collection wins duplicates", () => {
  const subjects = [
    Object.freeze({
      subjectId: "p1",
      workKind: "problem",
      family: "executive-work" as const,
      attention: "critical",
      status: "risk",
    }),
    Object.freeze({
      subjectId: "p2",
      workKind: "problem",
      family: "executive-work" as const,
      attention: "important",
    }),
    Object.freeze({
      subjectId: "obj-watch",
      objectKind: "object",
      family: "business-object" as const,
      attention: "critical",
      status: "unresolved",
    }),
  ];
  const disclosure = resolveExecutiveCollectionDisclosure({
    subjects,
    collection: { category: "problem", objectIds: ["p1", "p2"] },
  });
  assert.ok(disclosure.collectionObjectIds.includes("p1"));
  assert.ok(disclosure.watchObjectIds.includes("obj-watch"));
  assert.ok(!disclosure.watchObjectIds.includes("p1"));
  assert.equal(disclosure.byId.get("p1")?.spatialRole, "collection");
});

test("M — Large collection density budget", () => {
  const ids = Array.from({ length: 17 }, (_, i) => `prob-${String(i).padStart(2, "0")}`);
  const subjects = ids.map((id, index) =>
    Object.freeze({
      subjectId: id,
      workKind: "problem" as const,
      attention: index === 0 ? ("critical" as const) : ("normal" as const),
      status: index < 3 ? ("unresolved" as const) : ("stable" as const),
    }),
  );
  const ranked = rankExecutiveCollectionMembers({
    subjects,
    objectIds: ids,
  });
  assert.equal(ranked.totalCount, 17);
  assert.equal(
    ranked.visibleIds.length,
    EXECUTIVE_STAGE_COLLECTION_BUDGET.maxVisible,
  );
  assert.equal(ranked.hiddenIds.length, 17 - ranked.visibleIds.length);
  assert.equal(ranked.visibleIds[0], "prob-00");
  const queue = resolveExecutiveQueueEntries({ subjects });
  assert.equal(queue.find((e) => e.category === "problem")?.count, 17);

  const catalog = catalogWithSubjects(
    ids.map((id, index) =>
      subject(
        id,
        "problem",
        index === 0 ? "critical" : "normal",
        index < 3 ? "risk" : "stable",
      ),
    ),
  );
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "company",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = openNexoraMVPExecutiveQueueCollection(state, "problem", catalog);
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    catalog,
  );
  assert.equal(presentation.collectionHeader?.totalCount, 17);
  assert.ok(
    (presentation.collectionHeader?.visibleCount ?? 0) <=
      EXECUTIVE_STAGE_COLLECTION_BUDGET.maxVisible,
  );
  writeCapture(
    "07-large-collection",
    captureHtml("Large collection density", presentation),
  );
});

test("N — Empty category hidden; no synthetic object", () => {
  const queue = resolveExecutiveQueueEntries({
    subjects: [Object.freeze({ subjectId: "p1", workKind: "problem" })],
  });
  assert.ok(queue.some((e) => e.category === "problem"));
  assert.ok(!queue.some((e) => e.category === "scenario"));
  assert.ok(!queue.some((e) => e.objectIds.includes("synthetic")));
});

test("O — Reserved region pressure: collection layout outside queue", () => {
  const layout = resolveExecutiveCollectionLayout({
    objectIds: ["a", "b", "c", "d", "e", "f", "g", "h"],
  });
  const queue = EXECUTIVE_STAGE_PRODUCTIVITY_REGIONS.executiveQueue;
  for (const pos of Object.values(layout.positions)) {
    assert.ok(pos.x < queue.minX);
  }
});

test("P — Attention cannot steal focus after collection member click", () => {
  const catalog = catalogA();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "company",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = openNexoraMVPExecutiveQueueCollection(state, "problem", catalog);
  state = selectNexoraMVPInteractionSubject(state, "p2", catalog);
  const primary = resolveNexoraMVPPrimaryStageSubject(state);
  assert.equal(primary.primaryStageSubjectId, "p2");
  // Critical peer remains non-primary.
  assert.notEqual(primary.primaryStageSubjectId, "p1");
});

test("Q — topologyZ === 0 for collection members", () => {
  const catalog = catalogA();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "company",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = openNexoraMVPExecutiveQueueCollection(state, "problem", catalog);
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    catalog,
  );
  for (const object of presentation.scene.objects) {
    if (object.spatialRole !== "collection") continue;
    assert.equal(object.targetPosition[2], 0);
  }
});

test("Decision + Execution collections + Watch coexistence capture", () => {
  const catalog = catalogA();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "company",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = openNexoraMVPExecutiveQueueCollection(state, "decision", catalog);
  writeCapture(
    "04-decision-collection",
    captureHtml(
      "Decision Collection",
      deriveNexoraMVPStageInteractionPresentation(state, catalog),
    ),
  );
  state = openNexoraMVPExecutiveQueueCollection(state, "execution", catalog);
  writeCapture(
    "05-execution-collection",
    captureHtml(
      "Execution Collection",
      deriveNexoraMVPStageInteractionPresentation(state, catalog),
    ),
  );

  const watchCatalog = catalogWithSubjects([
    ...catalogA().contextSubjects,
    subject("watch-crit", "problem", "critical", "risk"),
  ]);
  // Force a BO-like watch via collection disclosure path using default objects.
  state = openNexoraMVPExecutiveQueueCollection(state, "problem", watchCatalog);
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    defaultCatalog(),
  );
  writeCapture(
    "08-watch-collection-queue",
    captureHtml("Watch + Collection + Queue", presentation),
  );
});

test("eligibility excludes archived; trail token encoding", () => {
  assert.equal(
    isExecutiveQueueEligibleObject({
      subjectId: "x",
      workKind: "problem",
      archived: true,
    }),
    false,
  );
  assert.equal(
    encodeExecutiveQueueCollectionTrailId("problem"),
    "nexora-collection:problem",
  );
  const obs = buildExecutiveQueueFoundationObservability({
    presentationMode: "collection",
    queue: resolveExecutiveQueueEntries({
      subjects: [Object.freeze({ subjectId: "p1", workKind: "problem" })],
    }),
    collection: { category: "problem", objectIds: ["p1"] },
    collectionVisibleObjectIds: ["p1"],
    collectionHiddenObjectIds: [],
    collectionTotalCount: 1,
    advisorPresentationContext: "Problems Collection · 1 objects",
  });
  assert.equal(obs.navigationContextKind, "collection");
  assert.equal(obs.queue.problem, 1);
});
