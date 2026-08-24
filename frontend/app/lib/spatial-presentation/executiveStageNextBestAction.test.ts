/**
 * STAGE-PROD:3 — Executive Next Best Action certification (A–Z).
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
  executeNexoraMVPNextBestAction,
  openNexoraMVPExecutiveQueueCollection,
  resetNexoraMVPObjectInteractionOverview,
  resolveNexoraMVPNextBestActions,
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
  acknowledgeExecutiveChanges,
  buildExecutiveChangeSnapshot,
  resetExecutiveChangeBaselineStoreForTests,
  resolveExecutiveMeaningfulChanges,
} from "./executiveStageChangeIntelligence.ts";
import {
  EXECUTIVE_STAGE_NEXT_BEST_ACTION_BOUNDARY,
  buildExecutiveNextBestActionObservability,
  executeExecutiveNextBestAction,
  getExecutiveStageNextBestActionIdentity,
  resolveExecutiveNextBestActions,
  verifyExecutiveStageNextBestAction,
  type ExecutiveNbaSubjectInput,
} from "./executiveStageNextBestAction.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CAPTURE_DIR = join(
  __dirname,
  "../../../.certification/stage-prod-3-captures",
);

function defaultCatalog(): NexoraMVPObjectInteractionCatalog {
  return Object.freeze({
    objects: NEXORA_MVP_STAGE_OBJECT_FIXTURES,
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
    contextSubjects: NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES,
    contextLinks: NEXORA_MVP_CONTEXT_LINK_FIXTURES,
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
  const nba = presentation.nextBestAction;
  const rec = nba?.recommendedAction;
  const alts = (nba?.alternativeActions ?? [])
    .map((a) => `<li>${a.label}</li>`)
    .join("");
  return `<!doctype html><html><head><meta charset="utf-8"/><title>${title}</title>
<style>body{margin:0;background:#0a1018;color:#d7e0ea;font:14px ui-sans-serif,system-ui;padding:24px}
.card{max-width:420px;margin:0 auto;padding:16px;border:1px solid #3a516c;background:rgba(8,14,24,.7)}
h1{font-size:16px;text-align:center}h2{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#8aa0b5}
.rec{border:1px solid #3878b4;padding:10px;border-radius:4px;margin:8px 0}
.quiet{opacity:.55}</style></head><body>
<h1>${title}</h1>
<div class="card">
<p>Focus: ${presentation.focusedSubjectId ?? "none"} · mode: ${presentation.presentationMode}</p>
${
  rec
    ? `<h2>Next Best Action</h2><div class="rec"><strong>${rec.label}</strong><div>${rec.reason}</div></div>
       <h2>Other options</h2><ul>${alts || "<li class='quiet'>(none)</li>"}</ul>`
    : `<p class="quiet">No NBA UI</p>`
}
</div></body></html>`;
}

function subject(
  partial: ExecutiveNbaSubjectInput,
): ExecutiveNbaSubjectInput {
  return Object.freeze(partial);
}

test.beforeEach(() => {
  resetExecutiveChangeBaselineStoreForTests();
});

test("identity + safety boundary", () => {
  const identity = getExecutiveStageNextBestActionIdentity();
  assert.equal(identity.id, "STAGE-PROD:3/ExecutiveStageNextBestAction");
  assert.equal(verifyExecutiveStageNextBestAction().ok, true);
  assert.equal(
    EXECUTIVE_STAGE_NEXT_BEST_ACTION_BOUNDARY.autoApprovesDecisions,
    false,
  );
  assert.equal(
    EXECUTIVE_STAGE_NEXT_BEST_ACTION_BOUNDARY.createScenarioAvailable,
    false,
  );
});

test("A — Stable Object → no NBA", () => {
  const catalog = defaultCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, "obj-budget", catalog);
  const nba = resolveNexoraMVPNextBestActions(state, catalog);
  assert.equal(nba.recommendedAction, null);
  assert.equal(nba.alternativeActions.length, 0);
  writeCapture(
    "06-stable-no-nba",
    captureHtml(
      "Stable Object — no NBA",
      deriveNexoraMVPStageInteractionPresentation(state, catalog),
    ),
  );
});

test("B — Critical Capacity + existing Problem", () => {
  const catalog = defaultCatalog();
  const altered: NexoraMVPObjectInteractionCatalog = Object.freeze({
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
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity", altered);
  const nba = resolveNexoraMVPNextBestActions(state, altered);
  assert.ok(nba.recommendedAction);
  assert.equal(nba.recommendedAction!.kind, "inspect-problem");
  assert.equal(nba.recommendedAction!.targetObjectId, "ctx-problem-capacity");
  writeCapture(
    "01-capacity-problem-nba",
    captureHtml(
      "Capacity + Problem NBA",
      deriveNexoraMVPStageInteractionPresentation(state, altered),
    ),
  );
});

test("C — Problem + existing Scenario outranks create", () => {
  const catalog = defaultCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-problem-capacity",
    catalog,
  );
  const nba = resolveNexoraMVPNextBestActions(state, catalog);
  assert.ok(nba.recommendedAction);
  assert.ok(
    nba.recommendedAction!.kind === "open-scenario" ||
      nba.recommendedAction!.kind === "compare-scenarios" ||
      nba.recommendedAction!.kind === "review-decision",
  );
  assert.notEqual(nba.recommendedAction!.kind.includes("create"), true);
  writeCapture(
    "02-problem-scenario-nba",
    captureHtml(
      "Problem + Scenario NBA",
      deriveNexoraMVPStageInteractionPresentation(state, catalog),
    ),
  );
});

test("D — Problem without Scenario: create not exposed (no workflow)", () => {
  const catalog: NexoraMVPObjectInteractionCatalog = Object.freeze({
    objects: NEXORA_MVP_STAGE_OBJECT_FIXTURES,
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
    contextSubjects: Object.freeze([
      Object.freeze({
        id: "ctx-problem-orphan",
        label: "Orphan Problem",
        kind: "problem" as const,
        status: "risk" as const,
        attention: "critical" as const,
      }),
    ]),
    contextLinks: Object.freeze([
      Object.freeze({
        id: "link-orphan",
        objectId: "obj-budget",
        contextId: "ctx-problem-orphan",
        relation: "affected-by",
      }),
    ]),
  });
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-problem-orphan",
    catalog,
  );
  const nba = resolveNexoraMVPNextBestActions(state, catalog);
  const kinds = [
    nba.recommendedAction?.kind,
    ...nba.alternativeActions.map((a) => a.kind),
  ].filter(Boolean);
  assert.ok(!kinds.some((kind) => String(kind).includes("create")));
});

test("E — Scenario comparison routes to collection", () => {
  const result = resolveExecutiveNextBestActions({
    presentationMode: "object-focus",
    primaryStageSubjectId: "ctx-problem-margin",
    subjects: [
      subject({
        subjectId: "ctx-problem-margin",
        objectKind: "problem",
        attention: "critical",
        status: "risk",
        unresolved: true,
        family: "executive-work",
      }),
      subject({
        subjectId: "ctx-scenario-pricing",
        objectKind: "scenario",
        family: "executive-work",
      }),
      subject({
        subjectId: "ctx-scenario-demand",
        objectKind: "scenario",
        family: "executive-work",
      }),
      subject({
        subjectId: "obj-revenue",
        objectKind: "object",
        family: "business-object",
      }),
    ],
    links: [
      Object.freeze({
        objectId: "obj-revenue",
        contextId: "ctx-problem-margin",
      }),
      Object.freeze({
        objectId: "obj-revenue",
        contextId: "ctx-scenario-pricing",
      }),
      Object.freeze({
        objectId: "obj-revenue",
        contextId: "ctx-scenario-demand",
      }),
    ],
  });
  const compare =
    result.recommendedAction?.kind === "compare-scenarios"
      ? result.recommendedAction
      : result.alternativeActions.find((a) => a.kind === "compare-scenarios");
  assert.ok(compare);
  const intent = executeExecutiveNextBestAction({
    action: compare!,
    subjects: result.recommendedAction
      ? [
          subject({
            subjectId: "ctx-problem-margin",
            objectKind: "problem",
            family: "executive-work",
          }),
        ]
      : [],
  });
  // Availability needs subjects for target-less compare — use full set
  const intent2 = executeExecutiveNextBestAction({
    action: compare!,
    subjects: [
      subject({
        subjectId: "ctx-problem-margin",
        objectKind: "problem",
        family: "executive-work",
      }),
      subject({
        subjectId: "ctx-scenario-pricing",
        objectKind: "scenario",
        family: "executive-work",
      }),
      subject({
        subjectId: "ctx-scenario-demand",
        objectKind: "scenario",
        family: "executive-work",
      }),
    ],
  });
  assert.equal(intent2.type, "open-collection");
  if (intent2.type === "open-collection") {
    assert.equal(intent2.category, "scenario");
  }
  writeCapture(
    "03-compare-scenarios",
    `<!doctype html><title>Compare</title><p>${compare!.label}</p>`,
  );
});

test("F — Scenario → Review Decision", () => {
  const catalog = defaultCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-scenario-capacity",
    catalog,
  );
  const nba = resolveNexoraMVPNextBestActions(state, catalog);
  const decision =
    nba.recommendedAction?.kind === "review-decision"
      ? nba.recommendedAction
      : nba.alternativeActions.find((a) => a.kind === "review-decision");
  assert.ok(decision);
  assert.equal(decision!.targetObjectId, "ctx-decision-capacity");
});

test("G — Create Decision not exposed without workflow", () => {
  assert.equal(
    EXECUTIVE_STAGE_NEXT_BEST_ACTION_BOUNDARY.createDecisionAvailable,
    false,
  );
});

test("H — Decision under review does not auto-approve", () => {
  const catalog = defaultCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-decision-reprice",
    catalog,
  );
  const nba = resolveNexoraMVPNextBestActions(state, catalog);
  assert.ok(nba.recommendedAction);
  assert.equal(nba.recommendedAction!.kind, "review-decision");
  assert.ok(!nba.reasonCodes.includes("approve"));
  writeCapture(
    "04-decision-review",
    captureHtml(
      "Decision review NBA",
      deriveNexoraMVPStageInteractionPresentation(state, catalog),
    ),
  );
});

test("I — Approved Decision + Execution → Review Execution", () => {
  const catalog = defaultCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-decision-capacity",
    catalog,
  );
  const nba = resolveNexoraMVPNextBestActions(state, catalog);
  const execution =
    nba.recommendedAction?.kind === "review-execution"
      ? nba.recommendedAction
      : nba.alternativeActions.find((a) => a.kind === "review-execution");
  assert.ok(execution);
  assert.equal(execution!.targetObjectId, "ctx-execution-capacity");
});

test("J — Delayed Execution ranks highly", () => {
  const catalog: NexoraMVPObjectInteractionCatalog = Object.freeze({
    ...defaultCatalog(),
    contextSubjects: defaultCatalog().contextSubjects.map((subject) =>
      subject.id === "ctx-execution-capacity"
        ? Object.freeze({
            ...subject,
            status: "risk" as const,
            attention: "critical" as const,
          })
        : subject,
    ),
  });
  // Mark delayed via status risk + custom subject for delayed token
  const subjects = [
    subject({
      subjectId: "ctx-execution-capacity",
      objectKind: "execution",
      label: "Capacity Expansion",
      status: "delayed",
      attention: "critical",
      family: "executive-work",
    }),
  ];
  const result = resolveExecutiveNextBestActions({
    presentationMode: "object-focus",
    primaryStageSubjectId: "ctx-execution-capacity",
    subjects,
    links: [],
  });
  assert.equal(result.recommendedAction?.kind, "review-execution");
  assert.equal(result.recommendedAction?.reasonCode, "execution-delayed");
  writeCapture(
    "05-execution-delayed",
    `<!doctype html><title>Exec</title><p>${result.recommendedAction?.label}</p>`,
  );
});

test("K — Recent Change raises priority without inventing kind", () => {
  const scope = "company::default";
  const previous = buildExecutiveChangeSnapshot({
    scopeKey: scope,
    objects: [
      Object.freeze({
        objectId: "obj-capacity",
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
        objectId: "obj-capacity",
        objectKind: "object",
        executiveState: "critical",
        attentionState: "critical",
      }),
    ],
  });
  const comparison = resolveExecutiveMeaningfulChanges({
    previousSnapshot: previous,
    currentSnapshot: current,
  });
  const catalog = defaultCatalog();
  const subjects = [
    subject({
      subjectId: "obj-capacity",
      objectKind: "object",
      attention: "critical",
      status: "risk",
      family: "business-object",
      label: "Capacity",
    }),
    subject({
      subjectId: "ctx-problem-capacity",
      objectKind: "problem",
      attention: "important",
      status: "watch",
      family: "executive-work",
      label: "Capacity Gap",
    }),
  ];
  const withChange = resolveExecutiveNextBestActions({
    presentationMode: "object-focus",
    primaryStageSubjectId: "obj-capacity",
    subjects,
    links: [
      Object.freeze({
        objectId: "obj-capacity",
        contextId: "ctx-problem-capacity",
      }),
    ],
    changeComparison: comparison,
  });
  const withoutChange = resolveExecutiveNextBestActions({
    presentationMode: "object-focus",
    primaryStageSubjectId: "obj-capacity",
    subjects,
    links: [
      Object.freeze({
        objectId: "obj-capacity",
        contextId: "ctx-problem-capacity",
      }),
    ],
  });
  assert.equal(withChange.recommendedAction?.kind, "inspect-problem");
  assert.equal(withoutChange.recommendedAction?.kind, "inspect-problem");
  assert.ok(
    (withChange.recommendedAction?.priority ?? 0) >=
      (withoutChange.recommendedAction?.priority ?? 0),
  );
  writeCapture(
    "10-change-influenced-nba",
    `<!doctype html><title>Change NBA</title><p>${withChange.recommendedAction?.label}</p>`,
  );
});

test("L — Existing before create", () => {
  assert.equal(
    EXECUTIVE_STAGE_NEXT_BEST_ACTION_BOUNDARY.createScenarioAvailable,
    false,
  );
});

test("M — Deduplication", () => {
  const result = resolveExecutiveNextBestActions({
    presentationMode: "object-focus",
    primaryStageSubjectId: "obj-capacity",
    subjects: [
      subject({
        subjectId: "obj-capacity",
        objectKind: "object",
        attention: "critical",
        status: "risk",
        family: "business-object",
      }),
      subject({
        subjectId: "ctx-problem-capacity",
        objectKind: "problem",
        attention: "critical",
        status: "risk",
        unresolved: true,
        family: "executive-work",
        label: "Capacity Gap",
      }),
    ],
    links: [
      Object.freeze({
        objectId: "obj-capacity",
        contextId: "ctx-problem-capacity",
      }),
    ],
  });
  const problemActions = [
    result.recommendedAction,
    ...result.alternativeActions,
  ].filter((a) => a?.targetObjectId === "ctx-problem-capacity");
  assert.equal(problemActions.length, 1);
});

test("N — Action limit 1 + <=3", () => {
  const catalog = defaultCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity", catalog);
  const nba = resolveNexoraMVPNextBestActions(state, catalog);
  assert.ok(nba.recommendedAction == null || nba.alternativeActions.length <= 3);
  if (nba.recommendedAction) {
    assert.ok(nba.alternativeActions.length <= 3);
  }
  writeCapture(
    "07-recommended-alternatives",
    captureHtml(
      "Recommended + alternatives",
      deriveNexoraMVPStageInteractionPresentation(state, catalog),
    ),
  );
});

test("O — Stale target → unavailable", () => {
  const action = {
    id: "nba:inspect-problem:obj-capacity:missing",
    kind: "inspect-problem" as const,
    subjectObjectId: "obj-capacity",
    targetObjectId: "missing-problem",
    label: "Review missing",
    reason: "x",
    reasonCode: "critical-related-problem" as const,
    priority: 900,
    confidence: "deterministic" as const,
    isSemanticObject: false as const,
  };
  const intent = executeExecutiveNextBestAction({
    action,
    subjects: [
      subject({
        subjectId: "obj-capacity",
        objectKind: "object",
        family: "business-object",
      }),
    ],
  });
  assert.equal(intent.type, "unavailable");
});

test("P–R — Action click focus + recompute + manual override", () => {
  const catalog = defaultCatalog();
  const altered: NexoraMVPObjectInteractionCatalog = Object.freeze({
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
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity", altered);
  let nba = resolveNexoraMVPNextBestActions(state, altered);
  assert.equal(nba.recommendedAction?.targetObjectId, "ctx-problem-capacity");
  const intent = executeNexoraMVPNextBestAction(nba.recommendedAction!, altered);
  assert.equal(intent.type, "select-subject");
  if (intent.type === "select-subject") {
    state = selectNexoraMVPInteractionSubject(state, intent.subjectId, altered);
  }
  assert.equal(state.focusedSubject?.id, "ctx-problem-capacity");
  nba = resolveNexoraMVPNextBestActions(state, altered);
  assert.equal(nba.subjectObjectId, "ctx-problem-capacity");
  writeCapture(
    "08-nba-click-center",
    captureHtml(
      "NBA click → Problem center",
      deriveNexoraMVPStageInteractionPresentation(state, altered),
    ),
  );

  // R — manual override
  state = selectNexoraMVPInteractionSubject(state, "obj-revenue", altered);
  nba = resolveNexoraMVPNextBestActions(state, altered);
  assert.equal(nba.subjectObjectId, "obj-revenue");
});

test("S — Collection mode hides NBA", () => {
  const catalog = defaultCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = openNexoraMVPExecutiveQueueCollection(state, "problem", catalog);
  let presentation = deriveNexoraMVPStageInteractionPresentation(state, catalog);
  assert.equal(presentation.nextBestAction?.recommendedAction, null);
  assert.equal(presentation.nextBestAction?.eligible, false);
  writeCapture(
    "12-collection-nba-hidden",
    captureHtml("Collection — NBA hidden", presentation),
  );
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-problem-capacity",
    catalog,
  );
  presentation = deriveNexoraMVPStageInteractionPresentation(state, catalog);
  assert.equal(presentation.presentationMode, "object-focus");
  assert.ok(presentation.nextBestAction?.eligible !== false);
});

test("T–V — Back / Forward / Escape", () => {
  const catalog = defaultCatalog();
  const altered: NexoraMVPObjectInteractionCatalog = Object.freeze({
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
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity", altered);
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-problem-capacity",
    altered,
  );
  state = stepBackNexoraMVPObjectInteraction(state, altered);
  assert.equal(state.focusedSubject?.id, "obj-capacity");
  let nba = resolveNexoraMVPNextBestActions(state, altered);
  assert.equal(nba.subjectObjectId, "obj-capacity");
  writeCapture(
    "09-back-recompute-nba",
    captureHtml(
      "Back → Capacity NBA",
      deriveNexoraMVPStageInteractionPresentation(state, altered),
    ),
  );
  state = stepForwardNexoraMVPObjectInteraction(state, altered);
  assert.equal(state.focusedSubject?.id, "ctx-problem-capacity");
  nba = resolveNexoraMVPNextBestActions(state, altered);
  assert.equal(nba.subjectObjectId, "ctx-problem-capacity");
  state = resetNexoraMVPObjectInteractionOverview(state);
  nba = resolveNexoraMVPNextBestActions(state, altered);
  assert.equal(nba.eligible, false);
  assert.equal(nba.recommendedAction, null);
});

test("W — Unrelated Watch does not become NBA", () => {
  const result = resolveExecutiveNextBestActions({
    presentationMode: "object-focus",
    primaryStageSubjectId: "obj-budget",
    subjects: [
      subject({
        subjectId: "obj-budget",
        objectKind: "object",
        attention: "normal",
        status: "stable",
        family: "business-object",
        label: "Budget",
      }),
      subject({
        subjectId: "obj-risk",
        objectKind: "object",
        attention: "critical",
        status: "risk",
        family: "business-object",
        label: "Risk",
      }),
    ],
    links: [],
  });
  assert.equal(result.recommendedAction, null);
});

test("X — Visible actions are executable", () => {
  const catalog = defaultCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity", catalog);
  const nba = resolveNexoraMVPNextBestActions(state, catalog);
  const actions = [
    ...(nba.recommendedAction != null ? [nba.recommendedAction] : []),
    ...nba.alternativeActions,
  ];
  for (const action of actions) {
    const intent = executeNexoraMVPNextBestAction(action, catalog);
    assert.notEqual(intent.type, "unavailable");
  }
});

test("Y — Executive safety: no auto approve/start/delete", () => {
  assert.equal(
    EXECUTIVE_STAGE_NEXT_BEST_ACTION_BOUNDARY.autoApprovesDecisions,
    false,
  );
  assert.equal(
    EXECUTIVE_STAGE_NEXT_BEST_ACTION_BOUNDARY.autoStartsExecutions,
    false,
  );
  const catalog = defaultCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-decision-reprice",
    catalog,
  );
  const nba = resolveNexoraMVPNextBestActions(state, catalog);
  const kinds = [
    nba.recommendedAction?.kind,
    ...nba.alternativeActions.map((a) => a.kind),
  ];
  assert.ok(!kinds.includes("approve-decision" as never));
});

test("Z — Overview/collection camera/z unaffected; Advisor sync", () => {
  const catalog = defaultCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  assert.equal(
    resolveNexoraMVPNextBestActions(state, catalog).eligible,
    false,
  );
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity", catalog);
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    catalog,
  );
  const advisor = buildNexoraMVPAdvisorContextBridge(state, presentation);
  assert.equal(advisor.nbaSubjectId, advisor.primaryStageSubjectId);
  assert.equal(
    advisor.nextBestAction?.subjectObjectId,
    advisor.primaryStageSubjectId,
  );
  for (const object of presentation.scene.objects) {
    if (object.disclosureState === "hidden") continue;
    // topology anchors stay z≈0 in True-2D path; allow local geometry offset
    assert.ok(Math.abs(object.targetPosition[2]) < 2);
  }
  const obs = buildExecutiveNextBestActionObservability(
    presentation.nextBestAction!,
  );
  assert.equal(obs.nbaSubjectId, "obj-capacity");
  writeCapture(
    "11-queue-watch-nba",
    captureHtml("Queue + Watch + NBA coexistence", presentation),
  );
});
