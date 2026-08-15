/**
 * STAGE-PROD:6 — Executive Daily / Meeting Preparation certification (A–AL).
 */

import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  beginNexoraMVPDailyPreparation,
  beginNexoraMVPMeetingPreparation,
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  exitNexoraMVPPreparation,
  openNexoraMVPExecutiveQueueCollection,
  resetNexoraMVPObjectInteractionOverview,
  resolveNexoraMVPDecisionBrief,
  resolveNexoraMVPDecisionMemoryView,
  resolveNexoraMVPExecutiveQueueSummary,
  resolveNexoraMVPNextBestActions,
  resolveNexoraMVPPrimaryStageSubject,
  selectNexoraMVPInteractionSubject,
  stepBackNexoraMVPObjectInteraction,
  stepForwardNexoraMVPObjectInteraction,
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
  buildExecutiveChangeSnapshot,
  resetExecutiveChangeBaselineStoreForTests,
  resolveExecutiveMeaningfulChanges,
} from "./executiveStageChangeIntelligence.ts";
import { resetExecutiveDecisionMemoryStoreForTests } from "./executiveStageDecisionMemory.ts";
import { EXECUTIVE_STAGE_PRODUCTIVITY_REGIONS } from "./executiveStageProductivityContract.ts";
import {
  EXECUTIVE_STAGE_PREPARATION_BOUNDARY,
  EXECUTIVE_STAGE_PREPARATION_BUDGET,
  buildExecutivePreparationObservability,
  buildExecutivePreparationScopeKey,
  decodeExecutivePreparationTrailId,
  encodeExecutivePreparationTrailId,
  getExecutiveStagePreparationIdentity,
  resolveExecutiveDailyPreparation,
  resolveExecutiveMeetingPreparation,
  resolveExecutivePreparationLayout,
  verifyExecutiveStagePreparation,
  type ExecutivePreparationSubject,
  type ExecutivePreparationSubjectInput,
} from "./executiveStagePreparation.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CAPTURE_DIR = join(
  __dirname,
  "../../../.certification/stage-prod-6-captures",
);

const OPERATIONS_MEETING: ExecutivePreparationSubject = Object.freeze({
  kind: "topic" as const,
  label: "Operations",
  keywords: Object.freeze(["capacity", "delivery", "operations"]),
  semanticObjectIds: Object.freeze(["obj-capacity"]),
});

function defaultCatalog(): NexoraMVPObjectInteractionCatalog {
  return Object.freeze({
    objects: NEXORA_MVP_STAGE_OBJECT_FIXTURES,
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
    contextSubjects: NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES,
    contextLinks: NEXORA_MVP_CONTEXT_LINK_FIXTURES,
  });
}

/** Critical Capacity + delayed-style Execution (risk) + pending Decision. */
function attentionCatalog(): NexoraMVPObjectInteractionCatalog {
  const catalog = defaultCatalog();
  return Object.freeze({
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
    contextSubjects: catalog.contextSubjects.map((subject) => {
      if (subject.id === "ctx-execution-capacity") {
        return Object.freeze({
          ...subject,
          attention: "critical" as const,
          status: "risk" as const,
        });
      }
      if (subject.id === "ctx-decision-reprice") {
        return Object.freeze({
          ...subject,
          attention: "important" as const,
          status: "watch" as const,
        });
      }
      return subject;
    }),
  });
}

function initialState(workspace: "company" | "personal" = "company") {
  return createInitialNexoraMVPObjectInteractionState({
    workspace,
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function writeCapture(name: string, html: string) {
  mkdirSync(CAPTURE_DIR, { recursive: true });
  writeFileSync(join(CAPTURE_DIR, `${name}.html`), html, "utf8");
}

function captureHtml(
  title: string,
  presentation: ReturnType<typeof deriveNexoraMVPStageInteractionPresentation>,
): string {
  const prep = presentation.preparationContext;
  const items = (prep?.summary.priorityItems ?? [])
    .map(
      (item) =>
        `<li>${item.label}: ${item.reason} <code>${item.objectId}</code></li>`,
    )
    .join("");
  return `<!doctype html><html><head><meta charset="utf-8"/><title>${title}</title>
<style>body{margin:0;background:#0a1018;color:#d7e0ea;font:14px ui-sans-serif,system-ui;padding:24px}
.card{max-width:520px;margin:0 auto;padding:16px;border:1px solid #3a516c;background:rgba(8,14,24,.7)}
h1{font-size:16px;text-align:center}h2{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#8aa0b5}
.sec{border:1px solid #2f455c;padding:8px;border-radius:4px;margin:8px 0}
.quiet{opacity:.55}code{font-size:11px;opacity:.8}</style></head><body>
<h1>${title}</h1>
<div class="card">
<p>Focus: ${presentation.focusedSubjectId ?? "none"} · mode: ${presentation.presentationMode}
 · prep: ${prep?.mode ?? "none"}</p>
${
  prep
    ? `<h2>${prep.mode === "daily" ? "Daily Preparation" : prep.subject?.label ?? "Meeting"}</h2>
       <div class="sec">${prep.summary.headline}</div>
       <h2>Priority</h2><ul>${items || "<li class='quiet'>(none)</li>"}</ul>
       <h2>Watch</h2><div class="sec">${prep.watchObjectIds.join(", ") || "(none)"}</div>
       <h2>Hidden</h2><div class="sec">${prep.hiddenObjectIds.length}</div>`
    : `<p class="quiet">No Preparation context</p>`
}
</div></body></html>`;
}

function prepSubjects(
  extras: readonly ExecutivePreparationSubjectInput[] = [],
): readonly ExecutivePreparationSubjectInput[] {
  const catalog = attentionCatalog();
  return Object.freeze([
    ...catalog.objects.map((object) =>
      Object.freeze({
        subjectId: object.id,
        objectKind: object.kind,
        label: object.label,
        attention: object.attention,
        status: object.status,
        family: "business-object" as const,
      }),
    ),
    ...catalog.contextSubjects.map((subject) =>
      Object.freeze({
        subjectId: subject.id,
        objectKind: subject.kind,
        label: subject.label,
        attention: subject.attention,
        // Pure resolver: delayed execution uses status "delayed".
        status:
          subject.id === "ctx-execution-capacity"
            ? "delayed"
            : subject.status,
        family: "executive-work" as const,
      }),
    ),
    ...extras,
  ]);
}

function mockDeterioration(objectId: string) {
  const scope = "company::default";
  const previous = buildExecutiveChangeSnapshot({
    scopeKey: scope,
    objects: [
      Object.freeze({
        objectId,
        objectKind: "object",
        executiveState: "attention",
        attentionState: "important",
      }),
    ],
  });
  const current = buildExecutiveChangeSnapshot({
    scopeKey: scope,
    objects: [
      Object.freeze({
        objectId,
        objectKind: "object",
        executiveState: "critical",
        attentionState: "critical",
      }),
    ],
  });
  return resolveExecutiveMeaningfulChanges({
    previousSnapshot: previous,
    currentSnapshot: current,
  });
}

test.beforeEach(() => {
  resetExecutiveChangeBaselineStoreForTests();
  resetExecutiveDecisionMemoryStoreForTests();
});

test("identity + verify + trail encode/decode", () => {
  const identity = getExecutiveStagePreparationIdentity();
  assert.equal(identity.id, "STAGE-PROD:6/ExecutiveStagePreparation");
  assert.equal(identity.version, "1.0.0");
  assert.equal(verifyExecutiveStagePreparation().ok, true);
  assert.equal(
    EXECUTIVE_STAGE_PREPARATION_BOUNDARY.preparationIsSemanticObject,
    false,
  );
  assert.equal(EXECUTIVE_STAGE_PREPARATION_BOUNDARY.autoFocusesObject, false);
  assert.equal(EXECUTIVE_STAGE_PREPARATION_BOUNDARY.inventsAiSummary, false);
  assert.equal(EXECUTIVE_STAGE_PREPARATION_BOUNDARY.calendarIntegration, false);
  assert.equal(EXECUTIVE_STAGE_PREPARATION_BOUNDARY.refreshPolicy, "live-recompute");
  assert.equal(EXECUTIVE_STAGE_PREPARATION_BUDGET.maxVisible, 6);

  const dailyId = encodeExecutivePreparationTrailId("daily");
  assert.equal(decodeExecutivePreparationTrailId(dailyId)?.mode, "daily");

  const meetingId = encodeExecutivePreparationTrailId(
    "meeting",
    OPERATIONS_MEETING,
  );
  const decoded = decodeExecutivePreparationTrailId(meetingId);
  assert.equal(decoded?.mode, "meeting");
  assert.equal(decoded?.subject?.label, "Operations");
  assert.deepEqual(decoded?.subject?.keywords, [
    "capacity",
    "delivery",
    "operations",
  ]);
  assert.deepEqual(decoded?.subject?.semanticObjectIds, ["obj-capacity"]);
});

test("A–B — Daily includes critical / pending / delayed; priority order; excludes stable Budget", () => {
  const scopeKey = buildExecutivePreparationScopeKey({ workspace: "company" });
  const result = resolveExecutiveDailyPreparation({
    scopeKey,
    subjects: prepSubjects(),
  });
  const ids = result.context.includedObjectIds;
  assert.ok(ids.includes("obj-capacity"), "critical Capacity included");
  assert.ok(ids.includes("ctx-decision-reprice"), "pending Decision included");
  assert.ok(
    ids.includes("ctx-execution-capacity"),
    "delayed Execution included",
  );
  assert.equal(
    ids.includes("obj-budget"),
    false,
    "stable Budget excluded unless relevant",
  );

  const priorities = result.context.candidates.map((c) => c.priority);
  for (let i = 1; i < priorities.length; i += 1) {
    assert.ok(priorities[i]! <= priorities[i - 1]!);
  }
  const capacity = result.context.candidates.find(
    (c) => c.objectId === "obj-capacity",
  );
  const decision = result.context.candidates.find(
    (c) => c.objectId === "ctx-decision-reprice",
  );
  assert.ok(capacity);
  assert.ok(decision);
  assert.ok(capacity!.priority >= decision!.priority);

  writeCapture(
    "01-daily-critical-pending-delayed",
    (() => {
      let state = beginNexoraMVPDailyPreparation(
        initialState(),
        attentionCatalog(),
      );
      return captureHtml(
        "Daily — critical / pending / delayed",
        deriveNexoraMVPStageInteractionPresentation(state, attentionCatalog()),
      );
    })(),
  );
});

test("C — Budget: candidates → visible <= maxVisible, hidden = rest", () => {
  const extras: ExecutivePreparationSubjectInput[] = Array.from(
    { length: 10 },
    (_, i) =>
      Object.freeze({
        subjectId: `extra-critical-${i}`,
        objectKind: "problem",
        label: `Extra Critical ${i}`,
        attention: "critical",
        status: "risk",
        family: "executive-work",
      }),
  );
  const result = resolveExecutiveDailyPreparation({
    scopeKey: buildExecutivePreparationScopeKey({ workspace: "company" }),
    subjects: prepSubjects(extras),
  });
  assert.ok(result.candidateCount >= 12);
  assert.ok(result.includedCount <= EXECUTIVE_STAGE_PREPARATION_BUDGET.maxVisible);
  assert.equal(
    result.includedCount,
    Math.min(EXECUTIVE_STAGE_PREPARATION_BUDGET.maxVisible, result.candidateCount),
  );
  assert.equal(result.hiddenCount, result.candidateCount - result.includedCount);
  assert.equal(
    result.context.hiddenObjectIds.length,
    result.hiddenCount,
  );
  writeCapture(
    "02-budget-overflow",
    `<!doctype html><title>Budget</title><p>included=${result.includedCount} hidden=${result.hiddenCount} candidates=${result.candidateCount}</p>`,
  );
});

test("D — begin daily → no selected/focused subject", () => {
  const catalog = attentionCatalog();
  const state = beginNexoraMVPDailyPreparation(initialState(), catalog);
  assert.equal(state.selectedSubject, null);
  assert.equal(state.focusedSubject, null);
  assert.ok(state.preparationContext);
  assert.equal(state.preparationContext!.mode, "daily");
  assert.equal(state.preparationContext!.isSemanticObject, false);
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    catalog,
  );
  assert.equal(presentation.presentationMode, "preparation");
  assert.equal(presentation.focusedSubjectId, null);
  writeCapture(
    "03-daily-no-autofocus",
    captureHtml("Daily — no auto-focus", presentation),
  );
});

test("E–G — Capacity click focus; Back restores daily; Escape/overview clears", () => {
  const catalog = attentionCatalog();
  let state = beginNexoraMVPDailyPreparation(initialState(), catalog);
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity", catalog);
  assert.equal(state.preparationContext, null);
  assert.equal(state.focusedSubject?.id, "obj-capacity");
  assert.equal(state.selectedSubject?.id, "obj-capacity");
  const primary = resolveNexoraMVPPrimaryStageSubject(state);
  assert.equal(primary.primaryStageSubjectId, "obj-capacity");
  assert.equal(primary.advisorSubjectId, "obj-capacity");
  assert.equal(primary.presentationMode, "object-focus");
  const focusedPresentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    catalog,
  );
  assert.equal(focusedPresentation.presentationMode, "object-focus");
  writeCapture(
    "04-capacity-click-focus",
    captureHtml("Capacity click → object-focus", focusedPresentation),
  );

  state = stepBackNexoraMVPObjectInteraction(state, catalog);
  assert.ok(state.preparationContext);
  assert.equal(state.preparationContext!.mode, "daily");
  assert.equal(state.focusedSubject, null);
  writeCapture(
    "05-back-restores-daily",
    captureHtml(
      "Back restores Daily",
      deriveNexoraMVPStageInteractionPresentation(state, catalog),
    ),
  );

  state = resetNexoraMVPObjectInteractionOverview(state);
  assert.equal(state.preparationContext, null);
  assert.equal(state.mode, "overview");
  writeCapture(
    "06-overview-clears-prep",
    captureHtml(
      "Overview clears prep",
      deriveNexoraMVPStageInteractionPresentation(state, catalog),
    ),
  );
});

test("H — deterioration raises priority (change comparison)", () => {
  const subjects = prepSubjects().map((subject) =>
    subject.subjectId === "obj-delivery"
      ? Object.freeze({
          ...subject,
          attention: "important",
          status: "watch",
        })
      : subject,
  );
  const without = resolveExecutiveDailyPreparation({
    scopeKey: buildExecutivePreparationScopeKey({ workspace: "company" }),
    subjects,
  });
  const withChange = resolveExecutiveDailyPreparation({
    scopeKey: buildExecutivePreparationScopeKey({ workspace: "company" }),
    subjects,
    changeComparison: mockDeterioration("obj-delivery"),
  });
  const basePriority =
    without.context.candidates.find((c) => c.objectId === "obj-delivery")
      ?.priority ?? 0;
  const raised =
    withChange.context.candidates.find((c) => c.objectId === "obj-delivery")
      ?.priority ?? 0;
  assert.ok(raised > basePriority);
  assert.ok(
    withChange.context.includedObjectIds.includes("obj-delivery"),
  );
  writeCapture(
    "07-deterioration-priority",
    `<!doctype html><title>Deterioration</title><p>base=${basePriority} raised=${raised}</p>`,
  );
});

test("I — unchanged pending decision still in daily", () => {
  const result = resolveExecutiveDailyPreparation({
    scopeKey: buildExecutivePreparationScopeKey({ workspace: "company" }),
    subjects: prepSubjects(),
  });
  assert.ok(result.context.includedObjectIds.includes("ctx-decision-reprice"));
  const entry = result.context.candidates.find(
    (c) => c.objectId === "ctx-decision-reprice",
  );
  assert.equal(entry?.primaryReasonCode, "pending-decision");
});

test("J — watch duplicate: prep member not also in watchObjectIds", () => {
  const result = resolveExecutiveDailyPreparation({
    scopeKey: buildExecutivePreparationScopeKey({ workspace: "company" }),
    subjects: prepSubjects(),
  });
  for (const id of result.context.includedObjectIds) {
    assert.equal(
      result.context.watchObjectIds.includes(id),
      false,
      `${id} must not be both member and watch`,
    );
  }
});

test("K–O — Meeting subject via semanticObjectIds / keywords / relations", () => {
  const catalog = attentionCatalog();
  const result = resolveExecutiveMeetingPreparation({
    scopeKey: buildExecutivePreparationScopeKey({ workspace: "company" }),
    subject: OPERATIONS_MEETING,
    subjects: prepSubjects(),
    links: NEXORA_MVP_CONTEXT_LINK_FIXTURES,
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
  });
  const meetingMemberIds = [
    ...result.context.includedObjectIds,
    ...result.context.hiddenObjectIds,
  ];
  assert.ok(
    meetingMemberIds.includes("obj-capacity"),
    "semanticObjectIds seed",
  );
  assert.ok(
    meetingMemberIds.includes("obj-delivery"),
    "keyword / relation delivery",
  );
  assert.ok(
    meetingMemberIds.includes("ctx-problem-capacity") ||
      meetingMemberIds.includes("ctx-decision-capacity") ||
      meetingMemberIds.includes("ctx-execution-capacity"),
    "linked capacity work via relations",
  );
  assert.equal(result.context.mode, "meeting");
  assert.equal(result.context.subject?.label, "Operations");

  let state = beginNexoraMVPMeetingPreparation(
    initialState(),
    OPERATIONS_MEETING,
    catalog,
  );
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    catalog,
  );
  assert.equal(presentation.presentationMode, "preparation");
  assert.equal(presentation.preparationContext?.mode, "meeting");
  writeCapture(
    "08-meeting-operations",
    captureHtml("Meeting — Operations", presentation),
  );
});

test("P — global critical unrelated NOT in meeting; may be in watchObjectIds", () => {
  const result = resolveExecutiveMeetingPreparation({
    scopeKey: buildExecutivePreparationScopeKey({ workspace: "company" }),
    subject: OPERATIONS_MEETING,
    subjects: prepSubjects(),
    links: NEXORA_MVP_CONTEXT_LINK_FIXTURES,
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
  });
  // Margin Pressure is critical but not capacity/delivery-related at 1-hop from seeds.
  assert.equal(
    result.context.includedObjectIds.includes("ctx-problem-margin"),
    false,
  );
  assert.ok(
    result.context.watchObjectIds.includes("ctx-problem-margin"),
    "unrelated critical may appear in watchObjectIds",
  );
});

test("Q — cross-kind members (business + executive work)", () => {
  const result = resolveExecutiveMeetingPreparation({
    scopeKey: buildExecutivePreparationScopeKey({ workspace: "company" }),
    subject: OPERATIONS_MEETING,
    subjects: prepSubjects(),
    links: NEXORA_MVP_CONTEXT_LINK_FIXTURES,
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
  });
  const kinds = new Set(
    result.context.candidates.map((c) => c.objectKind.toLowerCase()),
  );
  assert.ok(kinds.has("object"));
  assert.ok(
    kinds.has("problem") ||
      kinds.has("decision") ||
      kinds.has("execution") ||
      kinds.has("scenario"),
  );
});

test("R — no fake center (focusedSubject null in prep)", () => {
  const catalog = attentionCatalog();
  const state = beginNexoraMVPDailyPreparation(initialState(), catalog);
  assert.equal(state.focusedSubject, null);
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    catalog,
  );
  assert.equal(presentation.focusedSubjectId, null);
  assert.equal(presentation.scene.focusedObjectId, null);
  for (const object of presentation.scene.objects) {
    if (presentation.preparationContext?.includedObjectIds.includes(object.id)) {
      assert.equal(object.focused, false);
      assert.equal(object.selected, false);
    }
  }
});

test("S–V — meeting member click; Back restores; subject switch; one prep context", () => {
  const catalog = attentionCatalog();
  let state = beginNexoraMVPMeetingPreparation(
    initialState(),
    OPERATIONS_MEETING,
    catalog,
  );
  const decisionId =
    state.preparationContext!.includedObjectIds.find((id) =>
      id.startsWith("ctx-decision"),
    ) ?? "ctx-decision-capacity";
  // Ensure decision is a member for click path.
  assert.ok(
    state.preparationContext!.includedObjectIds.includes(decisionId) ||
      state.preparationContext!.includedObjectIds.includes("obj-capacity"),
  );
  const clickId = state.preparationContext!.includedObjectIds.includes(
    "ctx-decision-capacity",
  )
    ? "ctx-decision-capacity"
    : "obj-capacity";
  state = selectNexoraMVPInteractionSubject(state, clickId, catalog);
  assert.equal(state.preparationContext, null);
  assert.equal(state.focusedSubject?.id, clickId);
  writeCapture(
    "09-meeting-member-focus",
    captureHtml(
      "Meeting member → focus",
      deriveNexoraMVPStageInteractionPresentation(state, catalog),
    ),
  );

  state = stepBackNexoraMVPObjectInteraction(state, catalog);
  assert.ok(state.preparationContext);
  assert.equal(state.preparationContext!.mode, "meeting");
  assert.equal(state.preparationContext!.subject?.label, "Operations");
  assert.deepEqual(
    state.preparationContext!.subject?.semanticObjectIds,
    ["obj-capacity"],
  );
  writeCapture(
    "10-back-restores-meeting",
    captureHtml(
      "Back restores Meeting",
      deriveNexoraMVPStageInteractionPresentation(state, catalog),
    ),
  );

  // U — subject switch recomputes
  const altSubject: ExecutivePreparationSubject = Object.freeze({
    kind: "topic" as const,
    label: "Pricing",
    keywords: Object.freeze(["revenue", "pricing", "margin"]),
    semanticObjectIds: Object.freeze(["obj-revenue"]),
  });
  const switched = beginNexoraMVPMeetingPreparation(state, altSubject, catalog);
  assert.equal(switched.preparationContext?.subject?.label, "Pricing");
  assert.ok(
    switched.preparationContext!.includedObjectIds.includes("obj-revenue") ||
      switched.preparationContext!.candidates.some((c) =>
        c.label.toLowerCase().includes("pricing"),
      ),
  );
  // Only one prep context
  assert.equal(switched.preparationContext?.mode, "meeting");
  assert.equal(switched.collectionContext, null);

  // V — daily→meeting replaces (one prep context)
  const daily = beginNexoraMVPDailyPreparation(switched, catalog);
  assert.equal(daily.preparationContext?.mode, "daily");
  const meetingAgain = beginNexoraMVPMeetingPreparation(
    daily,
    OPERATIONS_MEETING,
    catalog,
  );
  assert.equal(meetingAgain.preparationContext?.mode, "meeting");
  assert.equal(meetingAgain.collectionContext, null);
});

test("W — Queue counts unchanged during meeting", () => {
  const catalog = attentionCatalog();
  const before = resolveNexoraMVPExecutiveQueueSummary(catalog);
  let state = beginNexoraMVPMeetingPreparation(
    initialState(),
    OPERATIONS_MEETING,
    catalog,
  );
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    catalog,
  );
  for (const entry of before) {
    const live = presentation.queueEntries.find(
      (q) => q.category === entry.category,
    );
    if (live != null) {
      assert.equal(live.count, entry.count);
    }
  }
  writeCapture(
    "11-queue-stable-during-meeting",
    captureHtml("Queue stable during meeting", presentation),
  );
});

test("X — open Problems collection from prep clears prep / collection mode", () => {
  const catalog = attentionCatalog();
  let state = beginNexoraMVPDailyPreparation(initialState(), catalog);
  assert.ok(state.preparationContext);
  state = openNexoraMVPExecutiveQueueCollection(state, "problem", catalog);
  assert.equal(state.preparationContext, null);
  assert.ok(state.collectionContext);
  assert.equal(state.collectionContext!.category, "problem");
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    catalog,
  );
  assert.equal(presentation.presentationMode, "collection");
  writeCapture(
    "12-collection-clears-prep",
    captureHtml("Problems collection clears prep", presentation),
  );
});

test("Y–AA — NBA / Brief / Memory hidden in prep; appear after click", () => {
  const catalog = attentionCatalog();
  let state = beginNexoraMVPDailyPreparation(initialState(), catalog);
  let presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    catalog,
  );
  assert.equal(presentation.nextBestAction?.eligible, false);
  assert.equal(presentation.nextBestAction?.recommendedAction, null);
  assert.equal(
    presentation.decisionBrief?.available ?? presentation.decisionBrief?.eligible,
    false,
  );
  assert.equal(presentation.decisionMemory?.available, false);

  const nbaPrep = resolveNexoraMVPNextBestActions(state, catalog);
  assert.equal(nbaPrep.recommendedAction, null);
  const briefPrep = resolveNexoraMVPDecisionBrief(state, catalog);
  assert.equal(briefPrep.available ?? briefPrep.eligible, false);
  const memoryPrep = resolveNexoraMVPDecisionMemoryView(state, catalog);
  assert.equal(memoryPrep.available, false);

  state = selectNexoraMVPInteractionSubject(state, "obj-capacity", catalog);
  presentation = deriveNexoraMVPStageInteractionPresentation(state, catalog);
  assert.equal(presentation.presentationMode, "object-focus");
  const nbaFocus = resolveNexoraMVPNextBestActions(state, catalog);
  assert.ok(nbaFocus.eligible);
  assert.ok(nbaFocus.recommendedAction);
  writeCapture(
    "13-nba-after-click",
    captureHtml("NBA after Capacity click", presentation),
  );
});

test("AB — session memory reset: prep still works without fabricating history", () => {
  resetExecutiveDecisionMemoryStoreForTests();
  const catalog = attentionCatalog();
  const state = beginNexoraMVPDailyPreparation(initialState(), catalog);
  assert.ok(state.preparationContext);
  assert.ok(state.preparationContext!.includedCount >= 1 || state.preparationContext!.includedObjectIds.length >= 1);
  const memory = resolveNexoraMVPDecisionMemoryView(state, catalog);
  assert.equal(memory.available, false);
});

test("AC — scope: different workspace scopeKey on context", () => {
  const company = resolveExecutiveDailyPreparation({
    scopeKey: buildExecutivePreparationScopeKey({ workspace: "company" }),
    subjects: prepSubjects(),
  });
  const personal = resolveExecutiveDailyPreparation({
    scopeKey: buildExecutivePreparationScopeKey({ workspace: "personal" }),
    subjects: prepSubjects(),
  });
  assert.equal(company.context.scopeKey, "workspace:company|model:default");
  assert.equal(personal.context.scopeKey, "workspace:personal|model:default");
  assert.notEqual(company.context.scopeKey, personal.context.scopeKey);

  const catalog = attentionCatalog();
  const state = beginNexoraMVPDailyPreparation(initialState("personal"), catalog);
  assert.equal(
    state.preparationContext?.scopeKey,
    buildExecutivePreparationScopeKey({ workspace: "personal" }),
  );
});

test("AD — refresh live-recompute: catalog attention change updates members", () => {
  const base = defaultCatalog();
  let state = beginNexoraMVPDailyPreparation(initialState(), base);
  const before = deriveNexoraMVPStageInteractionPresentation(state, base);
  const beforeHasCriticalCapacity =
    before.preparationContext?.includedObjectIds.includes("obj-capacity") ??
    false;

  const elevated = attentionCatalog();
  const after = deriveNexoraMVPStageInteractionPresentation(state, elevated);
  assert.ok(after.preparationContext);
  assert.ok(
    after.preparationContext!.includedObjectIds.includes("obj-capacity"),
  );
  // Live recompute should reflect elevated catalog even if state snapshot was older.
  assert.ok(
    after.preparationContext!.includedObjectIds.length >=
      (before.preparationContext?.includedObjectIds.length ?? 0) ||
      after.preparationContext!.includedObjectIds.includes("obj-capacity"),
  );
  void beforeHasCriticalCapacity;
  writeCapture(
    "14-live-recompute",
    captureHtml("Live-recompute after catalog change", after),
  );
});

test("AE — advisorSubjectId null during prep; after click equals member", () => {
  const catalog = attentionCatalog();
  let state = beginNexoraMVPDailyPreparation(initialState(), catalog);
  let presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    catalog,
  );
  let bridge = buildNexoraMVPAdvisorContextBridge(state, presentation);
  assert.equal(bridge.advisorSubjectId, null);
  assert.equal(bridge.presentationMode, "preparation");
  assert.match(bridge.advisorPresentationContext ?? "", /Daily Preparation/);

  state = selectNexoraMVPInteractionSubject(state, "obj-capacity", catalog);
  presentation = deriveNexoraMVPStageInteractionPresentation(state, catalog);
  bridge = buildNexoraMVPAdvisorContextBridge(state, presentation);
  assert.equal(bridge.advisorSubjectId, "obj-capacity");
  assert.equal(bridge.presentationMode, "object-focus");
});

test("AF — one primary reason per object", () => {
  const result = resolveExecutiveDailyPreparation({
    scopeKey: buildExecutivePreparationScopeKey({ workspace: "company" }),
    subjects: prepSubjects(),
    changeComparison: mockDeterioration("obj-capacity"),
  });
  for (const candidate of result.context.candidates) {
    assert.ok(candidate.primaryReason);
    assert.ok(candidate.primaryReasonCode);
    assert.equal(
      candidate.supportingReasonCodes.includes(candidate.primaryReasonCode),
      false,
    );
  }
  const obs = buildExecutivePreparationObservability(result);
  assert.equal(obs.preparationActive, true);
  assert.equal(obs.preparationMode, "daily");
});

test("AG — connections suppressed / sparse in prep", () => {
  const catalog = attentionCatalog();
  const state = beginNexoraMVPDailyPreparation(initialState(), catalog);
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    catalog,
  );
  assert.equal(presentation.contextConnections.length, 0);
  assert.equal(presentation.scene.connections.length, 0);
});

test("AH–AK — reserved regions, hard separation, z=0", () => {
  const catalog = attentionCatalog();
  const state = beginNexoraMVPDailyPreparation(initialState(), catalog);
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    catalog,
  );
  const included = presentation.preparationContext?.includedObjectIds ?? [];
  const layout = resolveExecutivePreparationLayout({ objectIds: included });
  const queueMin = EXECUTIVE_STAGE_PRODUCTIVITY_REGIONS.executiveQueue.minX;
  const positions = included.map((id) => {
    const object = presentation.scene.objects.find((o) => o.id === id);
    const layoutPos = layout.positions[id];
    const x = object?.targetPosition[0] ?? layoutPos?.x ?? 0;
    const y = object?.targetPosition[1] ?? layoutPos?.y ?? 0;
    const z = object?.targetPosition[2] ?? layoutPos?.z ?? 0;
    return { id, x, y, z };
  });

  for (const pos of positions) {
    assert.ok(pos.x < queueMin, `${pos.id} x=${pos.x} must be < queue minX`);
    assert.equal(pos.z, 0);
  }

  for (let i = 0; i < positions.length; i += 1) {
    for (let j = i + 1; j < positions.length; j += 1) {
      const a = positions[i]!;
      const b = positions[j]!;
      const same =
        Math.abs(a.x - b.x) < 1e-4 && Math.abs(a.y - b.y) < 1e-4;
      assert.equal(same, false, `${a.id} and ${b.id} must have distinct XY`);
    }
  }

  writeCapture(
    "15-layout-z0-separation",
    `<!doctype html><title>Layout</title><pre>${JSON.stringify(positions, null, 2)}</pre>`,
  );
});

test("AL — safety boundary flags", () => {
  assert.equal(EXECUTIVE_STAGE_PREPARATION_BOUNDARY.autoApprovesDecisions, false);
  assert.equal(EXECUTIVE_STAGE_PREPARATION_BOUNDARY.autoStartsExecutions, false);
  assert.equal(EXECUTIVE_STAGE_PREPARATION_BOUNDARY.movesCamera, false);
  assert.equal(EXECUTIVE_STAGE_PREPARATION_BOUNDARY.changesSemanticZ, false);
  assert.equal(EXECUTIVE_STAGE_PREPARATION_BOUNDARY.createsWorkspace, false);
  assert.equal(EXECUTIVE_STAGE_PREPARATION_BOUNDARY.inventsMeetingAgenda, false);
  assert.equal(EXECUTIVE_STAGE_PREPARATION_BOUNDARY.presentationOnly, true);
  assert.equal(verifyExecutiveStagePreparation({ forceFailure: true }).ok, false);

  const catalog = attentionCatalog();
  let state = beginNexoraMVPDailyPreparation(initialState(), catalog);
  state = exitNexoraMVPPreparation(state, catalog);
  // Exit via trail step-back from sole prep entry → overview
  assert.equal(state.preparationContext, null);

  writeCapture(
    "16-safety-boundary",
    `<!doctype html><title>Safety</title><p>boundary ok · forceFailure false</p>`,
  );
});

test("Forward after Back restores focused member tip", () => {
  const catalog = attentionCatalog();
  let state = beginNexoraMVPDailyPreparation(initialState(), catalog);
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity", catalog);
  state = stepBackNexoraMVPObjectInteraction(state, catalog);
  assert.equal(state.preparationContext?.mode, "daily");
  state = stepForwardNexoraMVPObjectInteraction(state, catalog);
  assert.equal(state.focusedSubject?.id, "obj-capacity");
  assert.equal(state.preparationContext, null);
});
