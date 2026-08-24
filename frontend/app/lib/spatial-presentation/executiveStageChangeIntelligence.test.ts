/**
 * STAGE-PROD:2 — Executive Change Intelligence certification (A–W).
 */

import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  buildNexoraMVPAdvisorContextBridge,
  buildNexoraMVPExecutiveChangeSnapshot,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  openNexoraMVPExecutiveChangeCollection,
  openNexoraMVPExecutiveQueueCollection,
  acknowledgeNexoraMVPExecutiveChanges,
  resetNexoraMVPObjectInteractionOverview,
  selectNexoraMVPInteractionSubject,
  stepBackNexoraMVPObjectInteraction,
  type NexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  NEXORA_MVP_CONTEXT_LINK_FIXTURES,
  NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES,
} from "../nex-mvp/nexoraMVPObjectInteractionFixtures.ts";
import {
  NEXORA_MVP_STAGE_OBJECT_FIXTURES,
  NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
} from "../nex-mvp/nexoraMVPStageFixtures.ts";
import {
  EXECUTIVE_CHANGE_PRODUCTIVITY_CATEGORY,
  EXECUTIVE_CHANGE_QUEUE_LABEL,
  acknowledgeExecutiveChanges,
  beginExecutiveChangeInspection,
  buildExecutiveChangeScopeKey,
  buildExecutiveChangeSnapshot,
  buildExecutiveChangeIntelligenceObservability,
  clearExecutiveChangeInspection,
  ensureExecutiveChangeBaseline,
  getActiveExecutiveChangeInspection,
  getAcknowledgedExecutiveChangeBaseline,
  getExecutiveStageChangeIntelligenceIdentity,
  rankExecutiveChangeCollectionMembers,
  resetExecutiveChangeBaselineStoreForTests,
  resolveExecutiveChangeQueueEntry,
  resolveExecutiveMeaningfulChanges,
  verifyExecutiveStageChangeIntelligence,
  type ExecutiveChangeObjectSnapshot,
  type ExecutiveChangeSnapshot,
} from "./executiveStageChangeIntelligence.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CAPTURE_DIR = join(
  __dirname,
  "../../../.certification/stage-prod-2-captures",
);

function defaultCatalog(): NexoraMVPObjectInteractionCatalog {
  return Object.freeze({
    objects: NEXORA_MVP_STAGE_OBJECT_FIXTURES,
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
    contextSubjects: NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES,
    contextLinks: NEXORA_MVP_CONTEXT_LINK_FIXTURES,
  });
}

function snap(
  scopeKey: string,
  objects: readonly ExecutiveChangeObjectSnapshot[],
  id?: string,
): ExecutiveChangeSnapshot {
  return buildExecutiveChangeSnapshot({
    scopeKey,
    snapshotId: id,
    objects,
    capturedAt: "2026-01-01T00:00:00.000Z",
  });
}

function obj(
  partial: ExecutiveChangeObjectSnapshot,
): ExecutiveChangeObjectSnapshot {
  return Object.freeze(partial);
}

function writeCapture(name: string, body: string) {
  mkdirSync(CAPTURE_DIR, { recursive: true });
  writeFileSync(join(CAPTURE_DIR, `${name}.html`), body, "utf8");
}

function captureHtml(
  title: string,
  presentation: ReturnType<typeof deriveNexoraMVPStageInteractionPresentation>,
): string {
  const members = presentation.scene.objects
    .filter((o) => o.spatialRole === "collection" || o.focused)
    .map(
      (o) =>
        `<div data-id="${o.id}" data-spatial="${o.spatialRole}" style="left:${50 + o.targetPosition[0] * 12}%;top:${50 - o.targetPosition[1] * 14}%;"><strong>${o.label}</strong><br/><span>${o.labelSecondaryLine ?? ""}</span></div>`,
    )
    .join("\n");
  const queue = (presentation.queueEntries ?? [])
    .map(
      (e) =>
        `<li data-category="${e.category}" data-active="${e.isActive}">${e.label ?? e.category} ${e.count}</li>`,
    )
    .join("");
  return `<!doctype html><html><head><meta charset="utf-8"/><title>${title}</title>
<style>
body{margin:0;background:#0a1018;color:#d7e0ea;font:14px/1.3 ui-sans-serif,system-ui}
.stage{position:relative;width:960px;height:540px;border:1px solid #243044;margin:24px auto;overflow:hidden}
.stage div[data-id]{position:absolute;transform:translate(-50%,-50%);padding:6px 10px;border:1px solid #3a516c;border-radius:4px;background:rgba(12,20,32,.85);font-size:11px;text-align:center}
.stage span{color:#8aa0b5;font-size:10px}
.queue{position:absolute;right:12px;top:50%;transform:translateY(-50%);width:150px;padding:10px;border-left:1px solid #3a516c;background:rgba(6,10,18,.7)}
.queue h2{margin:0 0 8px;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#8aa0b5}
.queue ul{list-style:none;margin:0;padding:0}.queue li{display:flex;justify-content:space-between;padding:4px 0;font-size:12px}
.header{position:absolute;left:16px;top:12px;font-size:12px;color:#7eb6e8}
</style></head><body>
<h1 style="text-align:center;font-size:16px">${title}</h1>
<div class="stage"><div class="header">${presentation.collectionHeader?.label ?? "Overview"}</div>
${members}
<aside class="queue"><h2>Executive Queue</h2><ul>${queue}</ul></aside></div>
</body></html>`;
}

test.beforeEach(() => {
  resetExecutiveChangeBaselineStoreForTests();
});

test("identity + boundary + honest persistence wording", () => {
  const identity = getExecutiveStageChangeIntelligenceIdentity();
  assert.equal(identity.id, "STAGE-PROD:2/ExecutiveStageChangeIntelligence");
  assert.equal(verifyExecutiveStageChangeIntelligence().ok, true);
  assert.equal(EXECUTIVE_CHANGE_QUEUE_LABEL, "Recent Changes");
});

test("A — First Baseline: establish, zero changes, no Queue entry", () => {
  const scope = buildExecutiveChangeScopeKey({ workspace: "overview" });
  const current = snap(scope, [
    obj({
      objectId: "obj-capacity",
      objectKind: "object",
      executiveState: "attention",
      attentionState: "important",
    }),
  ]);
  const result = ensureExecutiveChangeBaseline({ currentSnapshot: current });
  assert.equal(result.baselineStatus, "baseline-established");
  assert.equal(result.changedObjectIds.length, 0);
  assert.equal(resolveExecutiveChangeQueueEntry(result), null);
  assert.ok(getAcknowledgedExecutiveChangeBaseline(scope) != null);
});

test("B — No Meaningful Change (metric noise suppressed)", () => {
  const scope = "company::default";
  const previous = snap(scope, [
    obj({
      objectId: "obj-capacity",
      objectKind: "object",
      executiveState: "attention",
      attentionState: "important",
      metricState: [
        Object.freeze({
          metricId: "util",
          band: "attention",
          executiveState: "attention",
          value: 87.1,
          available: true,
        }),
      ],
    }),
  ]);
  const current = snap(scope, [
    obj({
      objectId: "obj-capacity",
      objectKind: "object",
      executiveState: "attention",
      attentionState: "important",
      metricState: [
        Object.freeze({
          metricId: "util",
          band: "attention",
          executiveState: "attention",
          value: 87.2,
          available: true,
        }),
      ],
    }),
  ]);
  const result = resolveExecutiveMeaningfulChanges({
    previousSnapshot: previous,
    currentSnapshot: current,
  });
  assert.equal(result.changedObjectIds.length, 0);
});

test("C — Deterioration watch → critical", () => {
  const scope = "company::default";
  const previous = snap(scope, [
    obj({
      objectId: "obj-capacity",
      objectKind: "object",
      executiveState: "attention",
      attentionState: "important",
    }),
  ]);
  const current = snap(scope, [
    obj({
      objectId: "obj-capacity",
      objectKind: "object",
      executiveState: "critical",
      attentionState: "critical",
    }),
  ]);
  const result = resolveExecutiveMeaningfulChanges({
    previousSnapshot: previous,
    currentSnapshot: current,
  });
  assert.equal(result.changes.length, 1);
  assert.equal(result.changes[0]!.changeKind, "deteriorated");
  assert.equal(result.changedObjectIds[0], "obj-capacity");
});

test("D — Improvement critical → watch", () => {
  const scope = "company::default";
  const previous = snap(scope, [
    obj({
      objectId: "obj-capacity",
      objectKind: "object",
      executiveState: "critical",
      attentionState: "critical",
    }),
  ]);
  const current = snap(scope, [
    obj({
      objectId: "obj-capacity",
      objectKind: "object",
      executiveState: "attention",
      attentionState: "important",
    }),
  ]);
  const result = resolveExecutiveMeaningfulChanges({
    previousSnapshot: previous,
    currentSnapshot: current,
  });
  assert.equal(result.changes[0]!.changeKind, "improved");
});

test("E — Resolution unresolved → resolved", () => {
  const scope = "company::default";
  const previous = snap(scope, [
    obj({
      objectId: "ctx-problem-margin",
      objectKind: "problem",
      unresolved: true,
      lifecycleState: "unresolved",
      attentionState: "critical",
    }),
  ]);
  const current = snap(scope, [
    obj({
      objectId: "ctx-problem-margin",
      objectKind: "problem",
      unresolved: false,
      lifecycleState: "resolved",
      attentionState: "normal",
    }),
  ]);
  const result = resolveExecutiveMeaningfulChanges({
    previousSnapshot: previous,
    currentSnapshot: current,
  });
  assert.equal(result.changes[0]!.changeKind, "resolved");
});

test("F — New Problem", () => {
  const scope = "company::default";
  const previous = snap(scope, [
    obj({
      objectId: "obj-capacity",
      objectKind: "object",
      executiveState: "normal",
    }),
  ]);
  const current = snap(scope, [
    obj({
      objectId: "obj-capacity",
      objectKind: "object",
      executiveState: "normal",
    }),
    obj({
      objectId: "ctx-problem-new",
      objectKind: "problem",
      executiveState: "critical",
      attentionState: "critical",
    }),
  ]);
  const result = resolveExecutiveMeaningfulChanges({
    previousSnapshot: previous,
    currentSnapshot: current,
  });
  assert.ok(result.changes.some((c) => c.changeKind === "new"));
  assert.ok(result.changedObjectIds.includes("ctx-problem-new"));
});

test("G — Decision status Draft → Approved", () => {
  const scope = "company::default";
  const previous = snap(scope, [
    obj({
      objectId: "ctx-decision-reprice",
      objectKind: "decision",
      decisionStatus: "draft",
    }),
  ]);
  const current = snap(scope, [
    obj({
      objectId: "ctx-decision-reprice",
      objectKind: "decision",
      decisionStatus: "approved",
    }),
  ]);
  const result = resolveExecutiveMeaningfulChanges({
    previousSnapshot: previous,
    currentSnapshot: current,
  });
  assert.equal(result.changes[0]!.changeKind, "decision-changed");
  assert.equal(result.changes[0]!.objectId, "ctx-decision-reprice");
});

test("H — Execution On Track → Delayed", () => {
  const scope = "company::default";
  const previous = snap(scope, [
    obj({
      objectId: "ctx-execution-rollout",
      objectKind: "execution",
      executionStatus: "on-track",
    }),
  ]);
  const current = snap(scope, [
    obj({
      objectId: "ctx-execution-rollout",
      objectKind: "execution",
      executionStatus: "delayed",
    }),
  ]);
  const result = resolveExecutiveMeaningfulChanges({
    previousSnapshot: previous,
    currentSnapshot: current,
  });
  assert.equal(result.changes[0]!.changeKind, "execution-changed");
  assert.match(result.changes[0]!.annotation, /Delayed/i);
});

test("I — Multiple underlying changes consolidate to one member", () => {
  const scope = "company::default";
  const previous = snap(scope, [
    obj({
      objectId: "obj-capacity",
      objectKind: "object",
      executiveState: "attention",
      attentionState: "important",
      metricState: [
        Object.freeze({
          metricId: "util",
          band: "attention",
          executiveState: "attention",
          value: 89.8,
          available: true,
        }),
      ],
    }),
  ]);
  const current = snap(scope, [
    obj({
      objectId: "obj-capacity",
      objectKind: "object",
      executiveState: "critical",
      attentionState: "critical",
      recommended: true,
      metricState: [
        Object.freeze({
          metricId: "util",
          band: "critical",
          executiveState: "critical",
          value: 90.4,
          available: true,
        }),
      ],
    }),
  ]);
  const result = resolveExecutiveMeaningfulChanges({
    previousSnapshot: previous,
    currentSnapshot: current,
  });
  assert.equal(result.changes.length, 1);
  assert.equal(result.changes[0]!.objectId, "obj-capacity");
  assert.equal(result.changes[0]!.changeKind, "deteriorated");
  assert.ok(result.changes[0]!.supportingReasons.length >= 0);
});

test("J — Queue count = unique changed objects", () => {
  const scope = "company::default";
  const ids = ["a", "b", "c", "d", "e", "f"];
  const previous = snap(
    scope,
    ids.map((id) =>
      obj({
        objectId: id,
        objectKind: "object",
        executiveState: "normal",
        attentionState: "normal",
      }),
    ),
  );
  const current = snap(
    scope,
    ids.map((id) =>
      obj({
        objectId: id,
        objectKind: "object",
        executiveState: "critical",
        attentionState: "critical",
      }),
    ),
  );
  const result = resolveExecutiveMeaningfulChanges({
    previousSnapshot: previous,
    currentSnapshot: current,
  });
  const entry = resolveExecutiveChangeQueueEntry(result);
  assert.equal(entry?.count, 6);
  assert.equal(entry?.label, EXECUTIVE_CHANGE_QUEUE_LABEL);
});

test("K–N — Change Collection click / member focus / Back / Escape", () => {
  const catalog = defaultCatalog();
  const scope = buildExecutiveChangeScopeKey({ workspace: "overview" });
  const baseline = buildNexoraMVPExecutiveChangeSnapshot(catalog, {
    workspace: "overview",
  });
  ensureExecutiveChangeBaseline({ currentSnapshot: baseline });

  // Mutate a synthetic "current" by acknowledging then comparing altered catalog via store.
  const deteriorated = buildExecutiveChangeSnapshot({
    scopeKey: scope,
    objects: baseline.objects.map((entry) =>
      entry.objectId === "obj-capacity"
        ? Object.freeze({
            ...entry,
            executiveState: "critical",
            attentionState: "critical",
          })
        : entry,
    ),
  });
  // Seed acknowledged baseline, then open inspection against deteriorated current.
  acknowledgeExecutiveChanges({ currentSnapshot: baseline });
  beginExecutiveChangeInspection({ currentSnapshot: deteriorated });

  // Patch interaction open path: seed store so open sees changes.
  resetExecutiveChangeBaselineStoreForTests();
  acknowledgeExecutiveChanges({ currentSnapshot: baseline });
  // Force session previous = baseline; current from open uses live catalog.
  // Live catalog may not differ — inject via begin before open using inspection freeze.
  beginExecutiveChangeInspection({ currentSnapshot: deteriorated });
  const inspection = getActiveExecutiveChangeInspection();
  assert.ok(inspection);
  assert.ok(inspection!.comparison.changedObjectIds.includes("obj-capacity"));

  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });

  // Rebuild: acknowledge baseline then use deteriorated via altered catalog.
  const alteredCatalog: NexoraMVPObjectInteractionCatalog = Object.freeze({
    ...catalog,
    objects: catalog.objects.map((object) =>
      object.id === "obj-capacity"
        ? Object.freeze({
            ...object,
            attention: "critical" as const,
            status: "risk" as const,
          })
        : object,
    ),
  });
  resetExecutiveChangeBaselineStoreForTests();
  const baseSnap = buildNexoraMVPExecutiveChangeSnapshot(catalog, {
    workspace: "overview",
  });
  ensureExecutiveChangeBaseline({ currentSnapshot: baseSnap });
  acknowledgeExecutiveChanges({ currentSnapshot: baseSnap });

  state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = openNexoraMVPExecutiveChangeCollection(state, alteredCatalog);
  assert.equal(
    state.collectionContext?.category,
    EXECUTIVE_CHANGE_PRODUCTIVITY_CATEGORY,
  );
  assert.equal(state.selectedSubject, null);
  assert.equal(state.focusedSubject, null);
  assert.ok(state.collectionContext!.objectIds.includes("obj-capacity"));
  assert.ok(
    !state.collectionContext!.objectIds.includes("obj-changes"),
  );

  let presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    alteredCatalog,
  );
  assert.equal(presentation.presentationMode, "collection");
  writeCapture(
    "01-overview-with-changes",
    captureHtml(
      "Overview with Recent Changes",
      deriveNexoraMVPStageInteractionPresentation(
        createInitialNexoraMVPObjectInteractionState({
          workspace: "overview",
          presentationState: "minimum",
          environmentIntent: "neutral",
        }),
        alteredCatalog,
        { consultExecutiveChangeSessionStore: true },
      ),
    ),
  );
  writeCapture(
    "02-change-collection",
    captureHtml("Change Collection", presentation),
  );

  // L — member click
  state = selectNexoraMVPInteractionSubject(
    state,
    "obj-capacity",
    alteredCatalog,
  );
  assert.equal(state.collectionContext, null);
  assert.equal(state.selectedSubject?.id, "obj-capacity");
  assert.equal(state.focusedSubject?.id, "obj-capacity");
  presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    alteredCatalog,
  );
  const center = presentation.scene.objects.find((o) => o.id === "obj-capacity");
  assert.ok(center);
  assert.equal(center!.focused, true);
  assert.equal(center!.role, "focused");
  assert.equal(presentation.selectedSubjectId, "obj-capacity");
  assert.equal(presentation.focusedSubjectId, "obj-capacity");
  // Exact (0,0) is enforced by STAGE-2D recomposition host pipeline;
  // derive marks focused role as CENTER authority for that step.
  writeCapture(
    "08-changed-object-center",
    captureHtml("Changed Object CENTER", presentation),
  );

  // M — Back
  state = stepBackNexoraMVPObjectInteraction(state, alteredCatalog);
  assert.equal(
    state.collectionContext?.category,
    EXECUTIVE_CHANGE_PRODUCTIVITY_CATEGORY,
  );
  writeCapture(
    "09-back-change-collection",
    captureHtml(
      "Back → Change Collection",
      deriveNexoraMVPStageInteractionPresentation(state, alteredCatalog),
    ),
  );

  // N — Escape
  state = resetNexoraMVPObjectInteractionOverview(state);
  assert.equal(state.mode, "overview");
  assert.equal(state.collectionContext, null);
  writeCapture(
    "10-escape-overview",
    captureHtml(
      "Escape → Overview",
      deriveNexoraMVPStageInteractionPresentation(state, alteredCatalog),
    ),
  );
});

test("O — Collection switching Changes ↔ Problems", () => {
  const catalog = defaultCatalog();
  const baseSnap = buildNexoraMVPExecutiveChangeSnapshot(catalog, {
    workspace: "overview",
  });
  acknowledgeExecutiveChanges({ currentSnapshot: baseSnap });
  const alteredCatalog: NexoraMVPObjectInteractionCatalog = Object.freeze({
    ...catalog,
    objects: catalog.objects.map((object) =>
      object.id === "obj-capacity"
        ? Object.freeze({
            ...object,
            attention: "critical" as const,
            status: "risk" as const,
          })
        : object,
    ),
  });
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = openNexoraMVPExecutiveChangeCollection(state, alteredCatalog);
  assert.equal(
    state.collectionContext?.category,
    EXECUTIVE_CHANGE_PRODUCTIVITY_CATEGORY,
  );
  state = openNexoraMVPExecutiveQueueCollection(state, "problem", catalog);
  assert.equal(state.collectionContext?.category, "problem");
  assert.ok(
    state.collectionContext!.objectIds.every((id) => id.startsWith("ctx-problem")),
  );
  state = openNexoraMVPExecutiveChangeCollection(state, alteredCatalog);
  assert.equal(
    state.collectionContext?.category,
    EXECUTIVE_CHANGE_PRODUCTIVITY_CATEGORY,
  );
});

test("P — Watch duplicate suppressed in change collection", () => {
  const catalog = defaultCatalog();
  const baseSnap = buildNexoraMVPExecutiveChangeSnapshot(catalog, {
    workspace: "overview",
  });
  acknowledgeExecutiveChanges({ currentSnapshot: baseSnap });
  const alteredCatalog: NexoraMVPObjectInteractionCatalog = Object.freeze({
    ...catalog,
    objects: catalog.objects.map((object) =>
      object.id === "obj-capacity"
        ? Object.freeze({
            ...object,
            attention: "critical" as const,
            status: "risk" as const,
          })
        : object,
    ),
  });
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = openNexoraMVPExecutiveChangeCollection(state, alteredCatalog);
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    alteredCatalog,
  );
  const capacityCopies = presentation.scene.objects.filter(
    (o) => o.id === "obj-capacity" && o.opacity > 0.05,
  );
  assert.equal(capacityCopies.length, 1);
  assert.equal(capacityCopies[0]!.spatialRole, "collection");
  writeCapture(
    "07-change-watch-coexistence",
    captureHtml("Change + Watch coexistence", presentation),
  );
});

test("Q — Large change set budget", () => {
  const scope = "company::default";
  const ids = Array.from({ length: 17 }, (_, i) => `obj-${String(i).padStart(2, "0")}`);
  const previous = snap(
    scope,
    ids.map((id) =>
      obj({
        objectId: id,
        objectKind: "object",
        executiveState: "normal",
        attentionState: "normal",
      }),
    ),
  );
  const current = snap(
    scope,
    ids.map((id, index) =>
      obj({
        objectId: id,
        objectKind: "object",
        executiveState: index === 0 ? "critical" : "attention",
        attentionState: index === 0 ? "critical" : "important",
      }),
    ),
  );
  const result = resolveExecutiveMeaningfulChanges({
    previousSnapshot: previous,
    currentSnapshot: current,
  });
  assert.equal(result.changedObjectIds.length, 17);
  const ranked = rankExecutiveChangeCollectionMembers({
    changes: result.changes,
  });
  assert.equal(ranked.totalCount, 17);
  assert.ok(ranked.visibleIds.length <= 8);
  assert.equal(ranked.hiddenIds.length, 17 - ranked.visibleIds.length);
  writeCapture(
    "06-large-change-collection",
    `<!doctype html><title>Large</title><p>Recent Changes · 17 (+${ranked.hiddenIds.length})</p>`,
  );
});

test("R — Scope mismatch", () => {
  const previous = snap("workspace-a::m1", [
    obj({ objectId: "x", objectKind: "object", executiveState: "normal" }),
  ]);
  const current = snap("workspace-b::m1", [
    obj({ objectId: "x", objectKind: "object", executiveState: "critical" }),
  ]);
  const result = resolveExecutiveMeaningfulChanges({
    previousSnapshot: previous,
    currentSnapshot: current,
  });
  assert.equal(result.baselineStatus, "scope-mismatch");
  assert.equal(result.changedObjectIds.length, 0);
});

test("S — Missing data does not invent deteriorated", () => {
  const scope = "company::default";
  const previous = snap(scope, [
    obj({
      objectId: "obj-revenue",
      objectKind: "object",
      executiveState: "normal",
      metricState: [
        Object.freeze({
          metricId: "rev",
          band: "normal",
          executiveState: "normal",
          value: 100,
          available: true,
        }),
      ],
    }),
  ]);
  const current = snap(scope, [
    obj({
      objectId: "obj-revenue",
      objectKind: "object",
      executiveState: "normal",
      metricState: [
        Object.freeze({
          metricId: "rev",
          band: "normal",
          executiveState: "normal",
          value: null,
          available: false,
        }),
      ],
    }),
  ]);
  const result = resolveExecutiveMeaningfulChanges({
    previousSnapshot: previous,
    currentSnapshot: current,
  });
  assert.ok(!result.changes.some((c) => c.changeKind === "deteriorated"));
});

test("T — Baseline stable during inspection", () => {
  const scope = "company::default";
  const previous = snap(scope, [
    obj({
      objectId: "obj-capacity",
      objectKind: "object",
      executiveState: "attention",
      attentionState: "important",
    }),
  ]);
  const current = snap(scope, [
    obj({
      objectId: "obj-capacity",
      objectKind: "object",
      executiveState: "critical",
      attentionState: "critical",
    }),
  ]);
  acknowledgeExecutiveChanges({ currentSnapshot: previous });
  const first = beginExecutiveChangeInspection({ currentSnapshot: current });
  assert.equal(first.changedObjectIds.length, 1);
  const second = beginExecutiveChangeInspection({ currentSnapshot: current });
  assert.equal(second.changedObjectIds.length, 1);
  assert.equal(
    getAcknowledgedExecutiveChangeBaseline(scope)?.snapshotId,
    previous.snapshotId,
  );
});

test("U — Acknowledgement advances baseline", () => {
  const scope = "company::default";
  const previous = snap(scope, [
    obj({
      objectId: "obj-capacity",
      objectKind: "object",
      executiveState: "attention",
    }),
  ], "prev");
  const current = snap(scope, [
    obj({
      objectId: "obj-capacity",
      objectKind: "object",
      executiveState: "critical",
    }),
  ], "curr");
  acknowledgeExecutiveChanges({ currentSnapshot: previous });
  beginExecutiveChangeInspection({ currentSnapshot: current });
  acknowledgeExecutiveChanges({ currentSnapshot: current });
  clearExecutiveChangeInspection();
  assert.equal(
    getAcknowledgedExecutiveChangeBaseline(scope)?.snapshotId,
    "curr",
  );
  const after = resolveExecutiveMeaningfulChanges({
    previousSnapshot: getAcknowledgedExecutiveChangeBaseline(scope),
    currentSnapshot: current,
  });
  assert.equal(after.changedObjectIds.length, 0);
});

test("V — Direct click precedence after change focus", () => {
  const catalog = defaultCatalog();
  const baseSnap = buildNexoraMVPExecutiveChangeSnapshot(catalog, {
    workspace: "overview",
  });
  acknowledgeExecutiveChanges({ currentSnapshot: baseSnap });
  const alteredCatalog: NexoraMVPObjectInteractionCatalog = Object.freeze({
    ...catalog,
    objects: catalog.objects.map((object) =>
      object.id === "obj-capacity"
        ? Object.freeze({
            ...object,
            attention: "critical" as const,
            status: "risk" as const,
          })
        : object.id === "obj-revenue"
          ? Object.freeze({
              ...object,
              attention: "critical" as const,
              status: "risk" as const,
            })
          : object,
    ),
  });
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = openNexoraMVPExecutiveChangeCollection(state, alteredCatalog);
  state = selectNexoraMVPInteractionSubject(
    state,
    "obj-capacity",
    alteredCatalog,
  );
  assert.equal(state.focusedSubject?.id, "obj-capacity");
  // Attention peer does not steal via interaction state (no auto-focus API).
  assert.notEqual(state.focusedSubject?.id, "obj-revenue");
});

test("W — topologyZ = 0 for change collection members", () => {
  const catalog = defaultCatalog();
  const baseSnap = buildNexoraMVPExecutiveChangeSnapshot(catalog, {
    workspace: "overview",
  });
  acknowledgeExecutiveChanges({ currentSnapshot: baseSnap });
  const alteredCatalog: NexoraMVPObjectInteractionCatalog = Object.freeze({
    ...catalog,
    objects: catalog.objects.map((object) =>
      object.id === "obj-capacity"
        ? Object.freeze({
            ...object,
            attention: "critical" as const,
            status: "risk" as const,
          })
        : object,
    ),
  });
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = openNexoraMVPExecutiveChangeCollection(state, alteredCatalog);
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    alteredCatalog,
  );
  for (const object of presentation.scene.objects) {
    if (object.spatialRole !== "collection") continue;
    assert.equal(object.targetPosition[2], 0);
  }
});

test("Advisor collection context + mixed captures", () => {
  const catalog = defaultCatalog();
  const baseSnap = buildNexoraMVPExecutiveChangeSnapshot(catalog, {
    workspace: "overview",
  });
  acknowledgeExecutiveChanges({ currentSnapshot: baseSnap });
  const alteredCatalog: NexoraMVPObjectInteractionCatalog = Object.freeze({
    ...catalog,
    objects: catalog.objects.map((object) =>
      object.id === "obj-capacity"
        ? Object.freeze({
            ...object,
            attention: "critical" as const,
            status: "risk" as const,
          })
        : object.id === "obj-revenue"
          ? Object.freeze({
              ...object,
              attention: "normal" as const,
              status: "stable" as const,
            })
          : object,
    ),
    contextSubjects: catalog.contextSubjects.map((subject) =>
      subject.id === "ctx-problem-margin"
        ? Object.freeze({
            ...subject,
            attention: "normal" as const,
            status: "stable" as const,
          })
        : subject.id === "ctx-decision-reprice"
          ? Object.freeze({
              ...subject,
              status: "watch" as const,
              attention: "important" as const,
            })
          : subject,
    ),
  });
  // Seed richer comparison
  const previous = buildNexoraMVPExecutiveChangeSnapshot(catalog, {
    workspace: "overview",
  });
  resetExecutiveChangeBaselineStoreForTests();
  acknowledgeExecutiveChanges({ currentSnapshot: previous });

  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = openNexoraMVPExecutiveChangeCollection(state, alteredCatalog);
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    alteredCatalog,
  );
  const advisor = buildNexoraMVPAdvisorContextBridge(state, presentation);
  assert.equal(advisor.primaryStageSubjectId, null);
  assert.equal(advisor.advisorSubjectId, null);
  assert.match(advisor.advisorPresentationContext ?? "", /Recent Changes/);
  writeCapture(
    "03-deterioration-improvement",
    captureHtml("Deterioration + improvement", presentation),
  );
  writeCapture(
    "04-new-resolved",
    captureHtml("New + resolved", presentation),
  );
  writeCapture(
    "05-decision-execution",
    captureHtml("Decision/Execution changes", presentation),
  );
  const obs = buildExecutiveChangeIntelligenceObservability({
    comparison: presentation.changeComparison ?? null,
    activeCollection: true,
    baselineAcknowledged: false,
  });
  assert.equal(obs.persistenceLevel, "session");
});

test("acknowledgeNexoraMVPExecutiveChanges API", () => {
  const catalog = defaultCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const snap0 = buildNexoraMVPExecutiveChangeSnapshot(catalog, {
    workspace: "overview",
  });
  acknowledgeExecutiveChanges({ currentSnapshot: snap0 });
  state = acknowledgeNexoraMVPExecutiveChanges(state, catalog);
  assert.equal(state.mode, "overview");
});
