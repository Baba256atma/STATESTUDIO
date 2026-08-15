/**
 * STAGE-PROD:5 — Executive Decision Memory & Outcome Trace certification (A–AH).
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
  evaluateNexoraMVPDecisionMemoryOutcome,
  recordNexoraMVPDecisionMemory,
  resetNexoraMVPObjectInteractionOverview,
  resolveNexoraMVPDecisionMemoryView,
  resolveNexoraMVPExecutiveQueueSummary,
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
import type { ExecutiveDecisionBriefResult } from "./executiveStageDecisionBrief.ts";
import {
  EXECUTIVE_STAGE_DECISION_MEMORY_BOUNDARY,
  appendExecutiveDecisionOutcomeEvaluation,
  buildExecutiveDecisionMemoryObservability,
  buildExecutiveDecisionMemoryRecord,
  buildExecutiveDecisionMemoryScopeKey,
  evaluateExecutiveDecisionOutcome,
  executiveDecisionMemoryRepository,
  getExecutiveDecisionMemoryStoreSnapshot,
  getExecutiveStageDecisionMemoryIdentity,
  recordExecutiveDecisionMemory,
  resetExecutiveDecisionMemoryStoreForTests,
  resolveExecutiveDecisionMemoryView,
  verifyExecutiveStageDecisionMemory,
  type ExecutiveDecisionMemorySubjectInput,
  type ExecutiveExpectedOutcome,
} from "./executiveStageDecisionMemory.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CAPTURE_DIR = join(
  __dirname,
  "../../../.certification/stage-prod-5-captures",
);

function defaultCatalog(): NexoraMVPObjectInteractionCatalog {
  return Object.freeze({
    objects: NEXORA_MVP_STAGE_OBJECT_FIXTURES,
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
    contextSubjects: NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES,
    contextLinks: NEXORA_MVP_CONTEXT_LINK_FIXTURES,
  });
}

function subjectsFromCatalog(
  catalog: NexoraMVPObjectInteractionCatalog = defaultCatalog(),
): readonly ExecutiveDecisionMemorySubjectInput[] {
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
        status: subject.status,
        family: "executive-work" as const,
      }),
    ),
  ]);
}

function criticalCapacityCatalog(): NexoraMVPObjectInteractionCatalog {
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
  const view = presentation.decisionMemory;
  const memory = view?.memory;
  const historical = (view?.historicalStates ?? [])
    .map(
      (state) =>
        `<li>${state.label ?? state.objectId}: ${state.executiveState ?? "—"}</li>`,
    )
    .join("");
  const current = (view?.currentStates ?? [])
    .map(
      (state) =>
        `<li>${state.label ?? state.objectId}: ${
          state.available ? (state.executiveState ?? "—") : "unavailable"
        }</li>`,
    )
    .join("");
  const options = (memory?.consideredOptions ?? [])
    .map(
      (option) =>
        `<li>${option.label}${option.wasSelected ? " ★" : ""} <code>${option.objectId ?? ""}</code></li>`,
    )
    .join("");
  const comparisons = (view?.outcomeTrace?.comparisons ?? [])
    .map(
      (entry) =>
        `<li>${entry.expectedOutcomeId}: ${entry.status} (exp ${String(entry.expected)} / act ${String(entry.actual)})</li>`,
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
 · memory: ${String(view?.available ?? false)}</p>
${
  memory
    ? `<h2>Decision</h2><div class="sec">${memory.decisionStatus} · ${memory.decisionObjectId}
         <div class="quiet">${memory.memoryId}</div></div>
       <h2>At decision</h2><ul>${historical || "<li class='quiet'>(none)</li>"}</ul>
       <h2>Current</h2><ul>${current || "<li class='quiet'>(none)</li>"}</ul>
       <h2>Options</h2><ul>${options || "<li class='quiet'>(none)</li>"}</ul>
       <h2>Rationale</h2><div class="sec">${memory.rationale?.text ?? "<span class='quiet'>null</span>"}</div>
       <h2>Outcome</h2><div class="sec">${view?.outcomeTrace?.status ?? "none"}</div>
       <ul>${comparisons || "<li class='quiet'>(none)</li>"}</ul>`
    : `<p class="quiet">No Decision Memory UI</p>`
}
</div></body></html>`;
}

function capacityExpected(
  id = "exp-capacity-lt-90",
): ExecutiveExpectedOutcome {
  return Object.freeze({
    id,
    targetObjectId: "obj-capacity",
    metricKey: "utilization",
    expectationKind: "target-value" as const,
    targetValue: 90,
    comparator: "lt" as const,
    worseWhen: "higher" as const,
    sourceKind: "decision" as const,
  });
}

function mockBriefWithOptions(
  options: readonly { readonly objectId: string; readonly label: string }[],
  evidenceText = "Capacity critical at decision",
): ExecutiveDecisionBriefResult {
  return Object.freeze({
    subjectObjectId: "ctx-decision-capacity",
    eligible: true,
    available: true,
    brief: Object.freeze({
      subjectObjectId: "ctx-decision-capacity",
      situation: Object.freeze({
        label: "Situation",
        text: "Capacity gap requires a decision",
        sourceObjectIds: Object.freeze(["obj-capacity"]),
      }),
      evidence: Object.freeze([
        Object.freeze({
          id: "ev-brief-capacity",
          text: evidenceText,
          sourceObjectIds: Object.freeze(["obj-capacity"]),
          sourceKind: "problem",
          importance: 1,
        }),
      ]),
      impact: null,
      options: Object.freeze(
        options.map((option, index) =>
          Object.freeze({
            id: `opt-${index}`,
            label: option.label,
            objectId: option.objectId,
            optionKind: "scenario" as const,
            sourceObjectIds: Object.freeze([option.objectId]),
          }),
        ),
      ),
      recommendation: null,
      decisionRequired: Object.freeze({
        label: "Decision required",
        text: "Choose a capacity path",
        sourceObjectIds: Object.freeze(["ctx-decision-capacity"]),
      }),
      completeness: "sufficient" as const,
      reasonCodes: Object.freeze(["sufficient-brief" as const]),
      isSemanticObject: false as const,
    }),
    completeness: "sufficient" as const,
    reasonCodes: Object.freeze(["sufficient-brief" as const]),
    suppressedReason: null,
  });
}

const THREE_SCENARIO_OPTIONS = Object.freeze([
  Object.freeze({
    objectId: "ctx-scenario-capacity",
    label: "Capacity Expansion Plan",
  }),
  Object.freeze({
    objectId: "ctx-scenario-pricing",
    label: "Pricing Response",
  }),
  Object.freeze({
    objectId: "ctx-scenario-demand",
    label: "Demand Surge",
  }),
]);

test.beforeEach(() => {
  resetExecutiveDecisionMemoryStoreForTests();
});

test("identity + safety boundary + session persistence", () => {
  const identity = getExecutiveStageDecisionMemoryIdentity();
  assert.equal(identity.id, "STAGE-PROD:5/ExecutiveStageDecisionMemory");
  assert.equal(identity.version, "1.0.0");
  assert.equal(verifyExecutiveStageDecisionMemory().ok, true);
  assert.equal(
    EXECUTIVE_STAGE_DECISION_MEMORY_BOUNDARY.memoryIsSemanticObject,
    false,
  );
  assert.equal(
    EXECUTIVE_STAGE_DECISION_MEMORY_BOUNDARY.inventsCausalClaims,
    false,
  );
  assert.equal(
    EXECUTIVE_STAGE_DECISION_MEMORY_BOUNDARY.rewritesHistoryOnOutcome,
    false,
  );
  assert.equal(
    EXECUTIVE_STAGE_DECISION_MEMORY_BOUNDARY.persistenceLevel,
    "session",
  );
  assert.equal(
    EXECUTIVE_STAGE_DECISION_MEMORY_BOUNDARY.movesCamera,
    false,
  );
  assert.equal(
    EXECUTIVE_STAGE_DECISION_MEMORY_BOUNDARY.changesSemanticZ,
    false,
  );

  const scopeKey = buildExecutiveDecisionMemoryScopeKey({
    workspace: "company",
  });
  const recorded = recordExecutiveDecisionMemory({
    decisionObjectId: "ctx-decision-capacity",
    decisionStatus: "approved",
    decisionVersion: "v-session-1",
    scopeKey,
    subjects: subjectsFromCatalog(),
    links: NEXORA_MVP_CONTEXT_LINK_FIXTURES,
    decisionBrief: null,
    nextBestAction: null,
  });
  assert.equal(recorded.recorded, true);
  assert.ok(recorded.memory);
  const snapshot = getExecutiveDecisionMemoryStoreSnapshot();
  assert.ok(snapshot.byId[recorded.memory!.memoryId]);
  assert.equal(
    executiveDecisionMemoryRepository.getByMemoryId(recorded.memory!.memoryId)
      ?.memoryId,
    recorded.memory!.memoryId,
  );
});

test("A — Finalized Decision Memory Capture", () => {
  const catalog = criticalCapacityCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "company",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-decision-capacity",
    catalog,
  );
  const result = recordNexoraMVPDecisionMemory(
    state,
    {
      decisionObjectId: "ctx-decision-capacity",
      decisionStatus: "approved",
      decisionVersion: "v-a-1",
      recordedAt: "2026-08-14T12:00:00.000Z",
    },
    catalog,
  );
  assert.equal(result.recorded, true);
  assert.equal(result.reason, "recorded");
  assert.ok(result.memory);
  assert.equal(result.memory!.decisionStatus, "approved");
  assert.equal(
    Object.keys(getExecutiveDecisionMemoryStoreSnapshot().byId).length,
    1,
  );
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    catalog,
  );
  assert.equal(presentation.decisionMemory?.available, true);
  writeCapture(
    "01-approved-decision-memory",
    captureHtml("Approved Decision + Memory", presentation),
  );
});

test("B — Duplicate finalization no duplicate", () => {
  const catalog = defaultCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "company",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-decision-capacity",
    catalog,
  );
  const input = {
    decisionObjectId: "ctx-decision-capacity",
    decisionStatus: "finalized" as const,
    decisionVersion: "v-b-1",
    recordedAt: "2026-08-14T12:00:00.000Z",
  };
  const first = recordNexoraMVPDecisionMemory(state, input, catalog);
  const second = recordNexoraMVPDecisionMemory(state, input, catalog);
  assert.equal(first.recorded, true);
  assert.equal(second.recorded, false);
  assert.equal(second.reason, "duplicate");
  assert.equal(second.memory?.memoryId, first.memory?.memoryId);
  assert.equal(
    Object.keys(getExecutiveDecisionMemoryStoreSnapshot().byId).length,
    1,
  );
});

test("C — Draft skipped", () => {
  const catalog = defaultCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "company",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-decision-capacity",
    catalog,
  );
  const result = recordNexoraMVPDecisionMemory(
    state,
    {
      decisionObjectId: "ctx-decision-capacity",
      decisionStatus: "draft",
      decisionVersion: "v-c-1",
    },
    catalog,
  );
  assert.equal(result.recorded, false);
  assert.equal(result.reason, "draft-skipped");
  assert.equal(result.memory, null);
  assert.equal(
    Object.keys(getExecutiveDecisionMemoryStoreSnapshot().byId).length,
    0,
  );
});

test("D — Historical Capacity critical freeze", () => {
  const critical = criticalCapacityCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "company",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-decision-capacity",
    critical,
  );
  const recorded = recordNexoraMVPDecisionMemory(
    state,
    {
      decisionObjectId: "ctx-decision-capacity",
      decisionStatus: "approved",
      decisionVersion: "v-d-1",
      recordedAt: "2026-08-14T12:00:00.000Z",
    },
    critical,
  );
  assert.ok(recorded.memory);
  const capacityAtDecision =
    recorded.memory!.contextSnapshot.executiveStates.find(
      (entry) => entry.objectId === "obj-capacity",
    );
  assert.equal(capacityAtDecision?.executiveState, "critical");

  const laterNormal = defaultCatalog();
  const view = resolveExecutiveDecisionMemoryView({
    presentationMode: "object-focus",
    primaryStageSubjectId: "ctx-decision-capacity",
    primarySubjectKind: "decision",
    scopeKey: buildExecutiveDecisionMemoryScopeKey({ workspace: "company" }),
    subjects: subjectsFromCatalog(laterNormal),
  });
  assert.equal(view.available, true);
  assert.equal(
    view.historicalStates.find((entry) => entry.objectId === "obj-capacity")
      ?.executiveState,
    "critical",
  );
  assert.equal(
    view.currentStates.find((entry) => entry.objectId === "obj-capacity")
      ?.executiveState,
    "attention",
  );
  assert.equal(view.historicalVsCurrentDifferent, true);
  writeCapture(
    "02-historical-vs-current",
    captureHtml(
      "Historical vs Current",
      deriveNexoraMVPStageInteractionPresentation(state, laterNormal),
    ),
  );
});

test("E — Evidence freeze", () => {
  const catalog = criticalCapacityCatalog();
  const brief = mockBriefWithOptions(
    THREE_SCENARIO_OPTIONS,
    "Capacity critical evidence freeze",
  );
  const scopeKey = buildExecutiveDecisionMemoryScopeKey({
    workspace: "company",
  });
  const recorded = recordExecutiveDecisionMemory({
    decisionObjectId: "ctx-decision-capacity",
    decisionStatus: "committed",
    decisionVersion: "v-e-1",
    scopeKey,
    subjects: subjectsFromCatalog(catalog),
    links: catalog.contextLinks,
    decisionBrief: brief,
    nextBestAction: null,
    recordedAt: "2026-08-14T12:00:00.000Z",
  });
  assert.ok(recorded.memory);
  const frozenEvidence = recorded.memory!.contextSnapshot.evidence.map(
    (item) => item.text,
  );
  assert.ok(
    frozenEvidence.some((text) => text.includes("Capacity critical evidence freeze")),
  );

  const laterBrief = mockBriefWithOptions(
    THREE_SCENARIO_OPTIONS,
    "Capacity later rewritten evidence",
  );
  const reRead = executiveDecisionMemoryRepository.getByMemoryId(
    recorded.memory!.memoryId,
  );
  assert.deepEqual(
    reRead!.contextSnapshot.evidence.map((item) => item.text),
    frozenEvidence,
  );
  assert.ok(
    !JSON.stringify(reRead!.contextSnapshot.evidence).includes(
      "later rewritten",
    ),
  );
  assert.ok(laterBrief.brief?.evidence[0]?.text.includes("rewritten"));
});

test("F — Options freeze (later 4th scenario not in memory)", () => {
  const catalog = criticalCapacityCatalog();
  const brief = mockBriefWithOptions(THREE_SCENARIO_OPTIONS);
  const scopeKey = buildExecutiveDecisionMemoryScopeKey({
    workspace: "company",
  });
  const recorded = recordExecutiveDecisionMemory({
    decisionObjectId: "ctx-decision-capacity",
    decisionStatus: "approved",
    decisionVersion: "v-f-1",
    scopeKey,
    subjects: subjectsFromCatalog(catalog),
    links: catalog.contextLinks,
    decisionBrief: brief,
    nextBestAction: null,
    recordedAt: "2026-08-14T12:00:00.000Z",
  });
  assert.ok(recorded.memory);
  assert.equal(recorded.memory!.consideredOptions.length, 3);
  const optionIds = recorded.memory!.consideredOptions.map(
    (option) => option.objectId,
  );
  assert.ok(!optionIds.includes("ctx-scenario-later-fourth"));

  const laterCatalog: NexoraMVPObjectInteractionCatalog = Object.freeze({
    ...catalog,
    contextSubjects: Object.freeze([
      ...catalog.contextSubjects,
      Object.freeze({
        id: "ctx-scenario-later-fourth",
        label: "Later Fourth Scenario",
        kind: "scenario" as const,
        status: "watch" as const,
        attention: "elevated" as const,
      }),
    ]),
  });
  const view = resolveExecutiveDecisionMemoryView({
    presentationMode: "object-focus",
    primaryStageSubjectId: "ctx-decision-capacity",
    primarySubjectKind: "decision",
    scopeKey,
    subjects: subjectsFromCatalog(laterCatalog),
  });
  assert.equal(view.memory?.consideredOptions.length, 3);
  assert.ok(
    !view.memory?.consideredOptions.some(
      (option) => option.objectId === "ctx-scenario-later-fourth",
    ),
  );
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "company",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-decision-capacity",
    laterCatalog,
  );
  writeCapture(
    "03-three-scenarios-options",
    captureHtml(
      "Decision with 3 considered Scenarios",
      deriveNexoraMVPStageInteractionPresentation(state, laterCatalog),
    ),
  );
});

test("G — Selected option", () => {
  const catalog = criticalCapacityCatalog();
  const brief = mockBriefWithOptions(THREE_SCENARIO_OPTIONS);
  const scopeKey = buildExecutiveDecisionMemoryScopeKey({
    workspace: "company",
  });
  const recorded = recordExecutiveDecisionMemory({
    decisionObjectId: "ctx-decision-capacity",
    decisionStatus: "approved",
    decisionVersion: "v-g-1",
    scopeKey,
    subjects: subjectsFromCatalog(catalog),
    links: catalog.contextLinks,
    selectedOptionId: "ctx-scenario-capacity",
    decisionBrief: brief,
    nextBestAction: null,
  });
  assert.equal(recorded.memory?.selectedOptionId, "ctx-scenario-capacity");
  assert.ok(
    recorded.memory?.consideredOptions.some(
      (option) =>
        option.objectId === "ctx-scenario-capacity" && option.wasSelected,
    ),
  );
});

test("H — No selected option null", () => {
  const catalog = defaultCatalog();
  const built = buildExecutiveDecisionMemoryRecord({
    decisionObjectId: "ctx-decision-capacity",
    decisionStatus: "approved",
    decisionVersion: "v-h-1",
    scopeKey: buildExecutiveDecisionMemoryScopeKey({ workspace: "company" }),
    subjects: subjectsFromCatalog(catalog),
    links: catalog.contextLinks,
    decisionBrief: null,
    nextBestAction: null,
  });
  assert.ok(built);
  assert.equal(built!.selectedOptionId, null);
  const recorded = recordExecutiveDecisionMemory({
    decisionObjectId: "ctx-decision-capacity",
    decisionStatus: "approved",
    decisionVersion: "v-h-1",
    scopeKey: buildExecutiveDecisionMemoryScopeKey({ workspace: "company" }),
    subjects: subjectsFromCatalog(catalog),
    links: catalog.contextLinks,
    decisionBrief: null,
    nextBestAction: null,
  });
  assert.equal(recorded.memory?.selectedOptionId, null);
});

test("I — Explicit rationale", () => {
  const catalog = criticalCapacityCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "company",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-decision-capacity",
    catalog,
  );
  const recorded = recordNexoraMVPDecisionMemory(
    state,
    {
      decisionObjectId: "ctx-decision-capacity",
      decisionStatus: "approved",
      decisionVersion: "v-i-1",
      explicitRationale: {
        text: "Expand capacity to protect delivery SLAs",
        reasonCodes: ["explicit-rationale"],
      },
    },
    catalog,
  );
  assert.ok(recorded.memory?.rationale);
  assert.equal(
    recorded.memory!.rationale!.text,
    "Expand capacity to protect delivery SLAs",
  );
  assert.equal(recorded.memory!.rationale!.sourceKind, "explicit");
  writeCapture(
    "04-explicit-rationale",
    captureHtml(
      "Decision with explicit rationale",
      deriveNexoraMVPStageInteractionPresentation(state, catalog),
    ),
  );
});

test("J — Missing rationale null", () => {
  const catalog = defaultCatalog();
  const built = buildExecutiveDecisionMemoryRecord({
    decisionObjectId: "ctx-decision-capacity",
    decisionStatus: "approved",
    decisionVersion: "v-j-1",
    scopeKey: buildExecutiveDecisionMemoryScopeKey({ workspace: "company" }),
    subjects: subjectsFromCatalog(catalog),
    links: catalog.contextLinks,
    decisionBrief: null,
    nextBestAction: null,
  });
  assert.ok(built);
  assert.equal(built!.rationale, null);

  const recorded = recordExecutiveDecisionMemory({
    decisionObjectId: "ctx-decision-capacity",
    decisionStatus: "approved",
    decisionVersion: "v-j-1",
    scopeKey: buildExecutiveDecisionMemoryScopeKey({ workspace: "company" }),
    subjects: subjectsFromCatalog(catalog),
    links: catalog.contextLinks,
    decisionBrief: null,
    nextBestAction: null,
  });
  assert.equal(recorded.memory?.rationale, null);

  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "company",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-decision-capacity",
    catalog,
  );
  writeCapture(
    "05-missing-rationale",
    captureHtml(
      "Decision with missing rationale",
      deriveNexoraMVPStageInteractionPresentation(state, catalog),
    ),
  );
});

test("K — Numeric met Capacity < 90 actual 88", () => {
  const catalog = criticalCapacityCatalog();
  const scopeKey = buildExecutiveDecisionMemoryScopeKey({
    workspace: "company",
  });
  const recorded = recordExecutiveDecisionMemory({
    decisionObjectId: "ctx-decision-capacity",
    decisionStatus: "approved",
    decisionVersion: "v-k-1",
    scopeKey,
    subjects: subjectsFromCatalog(catalog),
    links: catalog.contextLinks,
    expectedOutcomes: [capacityExpected()],
    decisionBrief: null,
    nextBestAction: null,
  });
  assert.ok(recorded.memory);
  const updated = appendExecutiveDecisionOutcomeEvaluation({
    memoryId: recorded.memory!.memoryId,
    evaluationBoundaryReached: true,
    actualOutcomes: [
      Object.freeze({
        expectedOutcomeId: "exp-capacity-lt-90",
        observedAt: "2026-08-20T12:00:00.000Z",
        objectId: "obj-capacity",
        metricKey: "utilization",
        actualValue: 88,
        sourceKind: "data-reality",
      }),
    ],
  });
  assert.equal(updated?.outcomeTrace?.status, "achieved");
  assert.equal(updated?.outcomeTrace?.comparisons[0]?.status, "met");
  assert.equal(updated?.outcomeTrace?.comparisons[0]?.variance, -2);

  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "company",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-decision-capacity",
    catalog,
  );
  writeCapture(
    "06-outcome-met",
    captureHtml(
      "Expected vs Actual outcome met",
      deriveNexoraMVPStageInteractionPresentation(state, catalog),
    ),
  );
});

test("L — Numeric missed actual 94", () => {
  const catalog = criticalCapacityCatalog();
  const scopeKey = buildExecutiveDecisionMemoryScopeKey({
    workspace: "company",
  });
  const recorded = recordExecutiveDecisionMemory({
    decisionObjectId: "ctx-decision-capacity",
    decisionStatus: "approved",
    decisionVersion: "v-l-1",
    scopeKey,
    subjects: subjectsFromCatalog(catalog),
    links: catalog.contextLinks,
    expectedOutcomes: [capacityExpected()],
    decisionBrief: null,
    nextBestAction: null,
  });
  const updated = evaluateNexoraMVPDecisionMemoryOutcome({
    memoryId: recorded.memory!.memoryId,
    evaluationBoundaryReached: true,
    actualOutcomes: [
      Object.freeze({
        expectedOutcomeId: "exp-capacity-lt-90",
        observedAt: "2026-08-20T12:00:00.000Z",
        objectId: "obj-capacity",
        metricKey: "utilization",
        actualValue: 94,
        sourceKind: "data-reality",
      }),
    ],
  });
  assert.equal(updated?.outcomeTrace?.status, "not-achieved");
  assert.equal(updated?.outcomeTrace?.comparisons[0]?.status, "not-met");

  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "company",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-decision-capacity",
    catalog,
  );
  writeCapture(
    "07-outcome-missed",
    captureHtml(
      "Expected vs Actual outcome missed",
      deriveNexoraMVPStageInteractionPresentation(state, catalog),
    ),
  );
});

test("M — Mixed 2 met 1 not", () => {
  const catalog = criticalCapacityCatalog();
  const scopeKey = buildExecutiveDecisionMemoryScopeKey({
    workspace: "company",
  });
  const expected: readonly ExecutiveExpectedOutcome[] = Object.freeze([
    capacityExpected("exp-a"),
    Object.freeze({
      id: "exp-b",
      targetObjectId: "obj-delivery",
      metricKey: "otif",
      expectationKind: "target-value" as const,
      targetValue: 95,
      comparator: "gte" as const,
      sourceKind: "decision" as const,
    }),
    Object.freeze({
      id: "exp-c",
      targetObjectId: "obj-revenue",
      metricKey: "growth",
      expectationKind: "target-value" as const,
      targetValue: 10,
      comparator: "gte" as const,
      sourceKind: "decision" as const,
    }),
  ]);
  const recorded = recordExecutiveDecisionMemory({
    decisionObjectId: "ctx-decision-capacity",
    decisionStatus: "approved",
    decisionVersion: "v-m-1",
    scopeKey,
    subjects: subjectsFromCatalog(catalog),
    links: catalog.contextLinks,
    expectedOutcomes: expected,
    decisionBrief: null,
    nextBestAction: null,
  });
  const updated = appendExecutiveDecisionOutcomeEvaluation({
    memoryId: recorded.memory!.memoryId,
    evaluationBoundaryReached: true,
    actualOutcomes: [
      Object.freeze({
        expectedOutcomeId: "exp-a",
        observedAt: "2026-08-21T00:00:00.000Z",
        objectId: "obj-capacity",
        metricKey: "utilization",
        actualValue: 88,
        sourceKind: "data-reality",
      }),
      Object.freeze({
        expectedOutcomeId: "exp-b",
        observedAt: "2026-08-21T00:00:00.000Z",
        objectId: "obj-delivery",
        metricKey: "otif",
        actualValue: 96,
        sourceKind: "data-reality",
      }),
      Object.freeze({
        expectedOutcomeId: "exp-c",
        observedAt: "2026-08-21T00:00:00.000Z",
        objectId: "obj-revenue",
        metricKey: "growth",
        actualValue: 4,
        sourceKind: "data-reality",
      }),
    ],
  });
  assert.equal(updated?.outcomeTrace?.status, "mixed");
  const statuses = updated?.outcomeTrace?.comparisons.map(
    (entry) => entry.status,
  );
  assert.deepEqual(statuses?.sort(), ["met", "met", "not-met"].sort());

  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "company",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-decision-capacity",
    catalog,
  );
  writeCapture(
    "08-outcome-mixed",
    captureHtml(
      "Mixed outcome",
      deriveNexoraMVPStageInteractionPresentation(state, catalog),
    ),
  );
});

test("N — Qualitative unknown", () => {
  const catalog = defaultCatalog();
  const scopeKey = buildExecutiveDecisionMemoryScopeKey({
    workspace: "company",
  });
  const recorded = recordExecutiveDecisionMemory({
    decisionObjectId: "ctx-decision-capacity",
    decisionStatus: "approved",
    decisionVersion: "v-n-1",
    scopeKey,
    subjects: subjectsFromCatalog(catalog),
    links: catalog.contextLinks,
    expectedOutcomes: [
      Object.freeze({
        id: "exp-qual",
        targetObjectId: "obj-capacity",
        expectationKind: "qualitative" as const,
        targetState: "healthier posture",
        sourceKind: "explicit" as const,
      }),
    ],
    decisionBrief: null,
    nextBestAction: null,
  });
  const trace = evaluateExecutiveDecisionOutcome({
    memory: recorded.memory!,
    evaluationBoundaryReached: true,
    actualOutcomes: [
      Object.freeze({
        expectedOutcomeId: "exp-qual",
        observedAt: "2026-08-21T00:00:00.000Z",
        objectId: "obj-capacity",
        actualState: "somewhat better",
        sourceKind: "observer",
      }),
    ],
  });
  assert.equal(trace.comparisons[0]?.status, "unknown");
  assert.notEqual(trace.status, "achieved");
});

test("O — No expected → insufficient-data", () => {
  const catalog = defaultCatalog();
  const scopeKey = buildExecutiveDecisionMemoryScopeKey({
    workspace: "company",
  });
  const recorded = recordExecutiveDecisionMemory({
    decisionObjectId: "ctx-decision-capacity",
    decisionStatus: "approved",
    decisionVersion: "v-o-1",
    scopeKey,
    subjects: subjectsFromCatalog(catalog),
    links: catalog.contextLinks,
    expectedOutcomes: [],
    decisionBrief: null,
    nextBestAction: null,
  });
  const updated = appendExecutiveDecisionOutcomeEvaluation({
    memoryId: recorded.memory!.memoryId,
    evaluationBoundaryReached: true,
    actualOutcomes: [
      Object.freeze({
        observedAt: "2026-08-21T00:00:00.000Z",
        objectId: "obj-capacity",
        actualValue: 88,
        sourceKind: "data-reality",
      }),
    ],
  });
  assert.equal(updated?.outcomeTrace?.status, "insufficient-data");
});

test("P — Execution link", () => {
  const catalog = defaultCatalog();
  const scopeKey = buildExecutiveDecisionMemoryScopeKey({
    workspace: "company",
  });
  const recorded = recordExecutiveDecisionMemory({
    decisionObjectId: "ctx-decision-capacity",
    decisionStatus: "approved",
    decisionVersion: "v-p-1",
    scopeKey,
    subjects: subjectsFromCatalog(catalog),
    links: catalog.contextLinks,
    executionLinks: [
      Object.freeze({
        executionObjectId: "ctx-execution-capacity",
        relationKind: "implements",
        linkedAt: "2026-08-14T13:00:00.000Z",
        executionStatusAtLink: "stable",
      }),
    ],
    decisionBrief: null,
    nextBestAction: null,
  });
  assert.equal(recorded.memory?.executionLinks.length, 1);
  assert.equal(
    recorded.memory?.executionLinks[0]?.executionObjectId,
    "ctx-execution-capacity",
  );
});

test("Q — Multiple executions no dup", () => {
  const catalog = defaultCatalog();
  const scopeKey = buildExecutiveDecisionMemoryScopeKey({
    workspace: "company",
  });
  const links = Object.freeze([
    Object.freeze({
      executionObjectId: "ctx-execution-capacity",
      relationKind: "implements",
      linkedAt: "2026-08-14T13:00:00.000Z",
    }),
    Object.freeze({
      executionObjectId: "ctx-execution-rollout",
      relationKind: "implements",
      linkedAt: "2026-08-14T13:05:00.000Z",
    }),
    Object.freeze({
      executionObjectId: "ctx-execution-extra",
      relationKind: "follows",
      linkedAt: "2026-08-14T13:10:00.000Z",
    }),
  ]);
  const recorded = recordExecutiveDecisionMemory({
    decisionObjectId: "ctx-decision-capacity",
    decisionStatus: "approved",
    decisionVersion: "v-q-1",
    scopeKey,
    subjects: subjectsFromCatalog(catalog),
    links: catalog.contextLinks,
    executionLinks: links,
    decisionBrief: null,
    nextBestAction: null,
  });
  assert.equal(recorded.memory?.executionLinks.length, 3);
  const appended = executiveDecisionMemoryRepository.appendOutcome({
    memoryId: recorded.memory!.memoryId,
    executionLinks: links,
  });
  assert.equal(appended?.executionLinks.length, 3);

  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "company",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-decision-capacity",
    catalog,
  );
  writeCapture(
    "09-multiple-executions",
    captureHtml(
      "Multiple Executions",
      deriveNexoraMVPStageInteractionPresentation(state, catalog),
    ),
  );
});

test("R — Execution completed + outcome not-achieved", () => {
  const catalog = Object.freeze({
    ...defaultCatalog(),
    contextSubjects: defaultCatalog().contextSubjects.map((subject) =>
      subject.id === "ctx-execution-capacity"
        ? Object.freeze({
            ...subject,
            status: "stable" as const,
            attention: "normal" as const,
          })
        : subject,
    ),
  });
  const scopeKey = buildExecutiveDecisionMemoryScopeKey({
    workspace: "company",
  });
  const recorded = recordExecutiveDecisionMemory({
    decisionObjectId: "ctx-decision-capacity",
    decisionStatus: "approved",
    decisionVersion: "v-r-1",
    scopeKey,
    subjects: subjectsFromCatalog(catalog),
    links: catalog.contextLinks,
    expectedOutcomes: [capacityExpected()],
    executionLinks: [
      Object.freeze({
        executionObjectId: "ctx-execution-capacity",
        relationKind: "implements",
        linkedAt: "2026-08-14T13:00:00.000Z",
        executionStatusAtLink: "completed",
      }),
    ],
    decisionBrief: null,
    nextBestAction: null,
  });
  const updated = appendExecutiveDecisionOutcomeEvaluation({
    memoryId: recorded.memory!.memoryId,
    evaluationBoundaryReached: true,
    actualOutcomes: [
      Object.freeze({
        expectedOutcomeId: "exp-capacity-lt-90",
        observedAt: "2026-08-22T00:00:00.000Z",
        objectId: "obj-capacity",
        metricKey: "utilization",
        actualValue: 94,
        sourceKind: "data-reality",
      }),
    ],
  });
  assert.equal(updated?.outcomeTrace?.status, "not-achieved");
  assert.equal(
    updated?.executionLinks[0]?.executionStatusAtLink,
    "completed",
  );
  const view = resolveExecutiveDecisionMemoryView({
    presentationMode: "object-focus",
    primaryStageSubjectId: "ctx-decision-capacity",
    primarySubjectKind: "decision",
    scopeKey,
    subjects: subjectsFromCatalog(catalog),
  });
  assert.equal(view.executionSummaries[0]?.executionObjectId, "ctx-execution-capacity");
  assert.equal(view.outcomeTrace?.status, "not-achieved");

  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "company",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-decision-capacity",
    catalog,
  );
  writeCapture(
    "10-execution-completed-outcome-missed",
    captureHtml(
      "Execution completed + outcome missed",
      deriveNexoraMVPStageInteractionPresentation(state, catalog),
    ),
  );
});

test("S — Source unavailable; historical preserved", () => {
  const catalog = criticalCapacityCatalog();
  const scopeKey = buildExecutiveDecisionMemoryScopeKey({
    workspace: "company",
  });
  const recorded = recordExecutiveDecisionMemory({
    decisionObjectId: "ctx-decision-capacity",
    decisionStatus: "approved",
    decisionVersion: "v-s-1",
    scopeKey,
    subjects: subjectsFromCatalog(catalog),
    links: catalog.contextLinks,
    decisionBrief: mockBriefWithOptions(THREE_SCENARIO_OPTIONS),
    nextBestAction: null,
  });
  assert.ok(recorded.memory);
  const historicalEvidence = recorded.memory!.contextSnapshot.evidence;
  assert.ok(historicalEvidence.length > 0);

  const subjectsWithoutCapacity = subjectsFromCatalog(catalog).filter(
    (subject) => subject.subjectId !== "obj-capacity",
  );
  const view = resolveExecutiveDecisionMemoryView({
    presentationMode: "object-focus",
    primaryStageSubjectId: "ctx-decision-capacity",
    primarySubjectKind: "decision",
    scopeKey,
    subjects: subjectsWithoutCapacity,
  });
  assert.equal(view.available, true);
  assert.ok(view.memory?.contextSnapshot.evidence.length);
  assert.deepEqual(view.memory?.contextSnapshot.evidence, historicalEvidence);
  const capacityCurrent = view.currentStates.find(
    (entry) => entry.objectId === "obj-capacity",
  );
  assert.equal(capacityCurrent?.available, false);
  assert.equal(view.historicalVsCurrentDifferent, true);
});

test("T–V — Scope isolation / rejected / archived", () => {
  const catalog = defaultCatalog();
  const queueBefore = resolveNexoraMVPExecutiveQueueSummary(catalog);

  const scopeA = buildExecutiveDecisionMemoryScopeKey({
    workspace: "company",
  });
  const scopeB = buildExecutiveDecisionMemoryScopeKey({
    workspace: "personal",
  });
  const inA = recordExecutiveDecisionMemory({
    decisionObjectId: "ctx-decision-capacity",
    decisionStatus: "approved",
    decisionVersion: "v-t-a",
    scopeKey: scopeA,
    subjects: subjectsFromCatalog(catalog),
    links: catalog.contextLinks,
    decisionBrief: null,
    nextBestAction: null,
  });
  assert.ok(inA.memory);

  const viewB = resolveExecutiveDecisionMemoryView({
    presentationMode: "object-focus",
    primaryStageSubjectId: "ctx-decision-capacity",
    primarySubjectKind: "decision",
    scopeKey: scopeB,
    subjects: subjectsFromCatalog(catalog),
  });
  assert.equal(viewB.available, false);
  assert.equal(viewB.memory, null);

  const rejected = recordExecutiveDecisionMemory({
    decisionObjectId: "ctx-decision-reprice",
    decisionStatus: "rejected",
    decisionVersion: "v-u-1",
    scopeKey: scopeA,
    subjects: subjectsFromCatalog(catalog),
    links: catalog.contextLinks,
    explicitRationale: {
      text: "Pricing path rejected pending more evidence",
    },
    decisionBrief: null,
    nextBestAction: null,
  });
  assert.equal(rejected.recorded, true);
  assert.equal(rejected.memory?.decisionStatus, "rejected");
  assert.equal(rejected.memory?.executionLinks.length, 0);
  assert.ok(rejected.memory?.rationale);

  const archived = recordExecutiveDecisionMemory({
    decisionObjectId: "ctx-decision-reprice",
    decisionStatus: "finalized",
    decisionVersion: "v-v-archived",
    scopeKey: scopeA,
    subjects: subjectsFromCatalog(catalog),
    links: catalog.contextLinks,
    decisionBrief: null,
    nextBestAction: null,
  });
  assert.ok(archived.memory);
  const retrieved = executiveDecisionMemoryRepository.getByMemoryId(
    archived.memory!.memoryId,
  );
  assert.ok(retrieved);
  const queueAfter = resolveNexoraMVPExecutiveQueueSummary(catalog);
  assert.deepEqual(queueAfter, queueBefore);

  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "company",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-decision-reprice",
    catalog,
  );
  writeCapture(
    "11-rejected-decision-memory",
    captureHtml(
      "Rejected Decision memory",
      deriveNexoraMVPStageInteractionPresentation(state, catalog),
    ),
  );
  writeCapture(
    "12-archived-decision-retrieval",
    captureHtml(
      "Archived Decision retrieval",
      deriveNexoraMVPStageInteractionPresentation(state, catalog),
    ),
  );
});

test("W — Revision separate memoryId", () => {
  const catalog = defaultCatalog();
  const scopeKey = buildExecutiveDecisionMemoryScopeKey({
    workspace: "company",
  });
  const v1 = recordExecutiveDecisionMemory({
    decisionObjectId: "ctx-decision-capacity",
    decisionStatus: "approved",
    decisionVersion: "rev-1",
    scopeKey,
    subjects: subjectsFromCatalog(catalog),
    links: catalog.contextLinks,
    decisionBrief: null,
    nextBestAction: null,
  });
  const v2 = recordExecutiveDecisionMemory({
    decisionObjectId: "ctx-decision-capacity",
    decisionStatus: "approved",
    decisionVersion: "rev-2",
    scopeKey,
    subjects: subjectsFromCatalog(catalog),
    links: catalog.contextLinks,
    decisionBrief: null,
    nextBestAction: null,
  });
  assert.ok(v1.memory && v2.memory);
  assert.notEqual(v1.memory!.memoryId, v2.memory!.memoryId);
  assert.equal(
    Object.keys(getExecutiveDecisionMemoryStoreSnapshot().byId).length,
    2,
  );
});

test("X — Decision focus UI subject sync", () => {
  const catalog = criticalCapacityCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "company",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-decision-capacity",
    catalog,
  );
  recordNexoraMVPDecisionMemory(
    state,
    {
      decisionObjectId: "ctx-decision-capacity",
      decisionStatus: "approved",
      decisionVersion: "v-x-1",
    },
    catalog,
  );
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    catalog,
  );
  const bridge = buildNexoraMVPAdvisorContextBridge(state, presentation);
  assert.equal(presentation.focusedSubjectId, "ctx-decision-capacity");
  assert.equal(bridge.primaryStageSubjectId, "ctx-decision-capacity");
  assert.equal(bridge.advisorSubjectId, "ctx-decision-capacity");
  assert.equal(
    presentation.decisionMemory?.memory?.decisionObjectId,
    "ctx-decision-capacity",
  );
  assert.equal(bridge.decisionMemorySubjectId, "ctx-decision-capacity");
});

test("Y — Focus change D1→D2", () => {
  const catalog = defaultCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "company",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-decision-capacity",
    catalog,
  );
  recordNexoraMVPDecisionMemory(
    state,
    {
      decisionObjectId: "ctx-decision-capacity",
      decisionStatus: "approved",
      decisionVersion: "v-y-d1",
    },
    catalog,
  );
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-decision-reprice",
    catalog,
  );
  recordNexoraMVPDecisionMemory(
    state,
    {
      decisionObjectId: "ctx-decision-reprice",
      decisionStatus: "approved",
      decisionVersion: "v-y-d2",
    },
    catalog,
  );

  let view = resolveNexoraMVPDecisionMemoryView(state, catalog);
  assert.equal(view.memory?.decisionObjectId, "ctx-decision-reprice");

  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-decision-capacity",
    catalog,
  );
  view = resolveNexoraMVPDecisionMemoryView(state, catalog);
  assert.equal(view.memory?.decisionObjectId, "ctx-decision-capacity");
});

test("Z — Non-decision focus memory hidden", () => {
  const catalog = criticalCapacityCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "company",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-decision-capacity",
    catalog,
  );
  recordNexoraMVPDecisionMemory(
    state,
    {
      decisionObjectId: "ctx-decision-capacity",
      decisionStatus: "approved",
      decisionVersion: "v-z-1",
    },
    catalog,
  );
  state = selectNexoraMVPInteractionSubject(state, "obj-budget", catalog);
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    catalog,
  );
  assert.equal(presentation.decisionMemory?.available, false);
  assert.equal(presentation.decisionMemory?.memory, null);
  assert.equal(
    presentation.decisionMemory?.suppressedReason,
    "non-decision-focus",
  );
  writeCapture(
    "14-non-decision-memory-hidden",
    captureHtml("Stable non-Decision focus — Memory hidden", presentation),
  );
});

test("AA–AC — Back / Forward / Escape", () => {
  const catalog = defaultCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "company",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-decision-capacity",
    catalog,
  );
  recordNexoraMVPDecisionMemory(
    state,
    {
      decisionObjectId: "ctx-decision-capacity",
      decisionStatus: "approved",
      decisionVersion: "v-aa-1",
      executionLinks: [
        Object.freeze({
          executionObjectId: "ctx-execution-capacity",
          relationKind: "implements",
          linkedAt: "2026-08-14T13:00:00.000Z",
        }),
      ],
    },
    catalog,
  );
  assert.equal(
    resolveNexoraMVPDecisionMemoryView(state, catalog).available,
    true,
  );

  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-execution-capacity",
    catalog,
  );
  assert.equal(
    resolveNexoraMVPDecisionMemoryView(state, catalog).available,
    false,
  );

  state = stepBackNexoraMVPObjectInteraction(state, catalog);
  assert.equal(state.focusedSubject?.id, "ctx-decision-capacity");
  assert.equal(
    resolveNexoraMVPDecisionMemoryView(state, catalog).available,
    true,
  );
  writeCapture(
    "13-decision-execution-back",
    captureHtml(
      "Decision → Execution → Back",
      deriveNexoraMVPStageInteractionPresentation(state, catalog),
    ),
  );

  state = stepForwardNexoraMVPObjectInteraction(state, catalog);
  assert.equal(state.focusedSubject?.id, "ctx-execution-capacity");
  assert.equal(
    resolveNexoraMVPDecisionMemoryView(state, catalog).available,
    false,
  );

  state = resetNexoraMVPObjectInteractionOverview(state);
  const overview = deriveNexoraMVPStageInteractionPresentation(state, catalog);
  assert.equal(overview.presentationMode, "overview");
  assert.equal(overview.decisionMemory?.available, false);
});

test("AD — Historical vs current separation in view", () => {
  const critical = criticalCapacityCatalog();
  const scopeKey = buildExecutiveDecisionMemoryScopeKey({
    workspace: "company",
  });
  recordExecutiveDecisionMemory({
    decisionObjectId: "ctx-decision-capacity",
    decisionStatus: "approved",
    decisionVersion: "v-ad-1",
    scopeKey,
    subjects: subjectsFromCatalog(critical),
    links: critical.contextLinks,
    decisionBrief: null,
    nextBestAction: null,
  });
  const view = resolveExecutiveDecisionMemoryView({
    presentationMode: "object-focus",
    primaryStageSubjectId: "ctx-decision-capacity",
    primarySubjectKind: "decision",
    scopeKey,
    subjects: subjectsFromCatalog(defaultCatalog()),
  });
  assert.ok(view.historicalStates.length > 0);
  assert.ok(view.currentStates.length > 0);
  assert.equal(view.historicalVsCurrentDifferent, true);
  const hist = view.historicalStates.find(
    (entry) => entry.objectId === "obj-capacity",
  );
  const curr = view.currentStates.find(
    (entry) => entry.objectId === "obj-capacity",
  );
  assert.notEqual(hist?.executiveState, curr?.executiveState);
});

test("AE — Rationale unchanged after missed outcome", () => {
  const catalog = defaultCatalog();
  const scopeKey = buildExecutiveDecisionMemoryScopeKey({
    workspace: "company",
  });
  const recorded = recordExecutiveDecisionMemory({
    decisionObjectId: "ctx-decision-capacity",
    decisionStatus: "approved",
    decisionVersion: "v-ae-1",
    scopeKey,
    subjects: subjectsFromCatalog(catalog),
    links: catalog.contextLinks,
    explicitRationale: {
      text: "Original rationale must survive miss",
      reasonCodes: ["explicit-rationale"],
    },
    expectedOutcomes: [capacityExpected()],
    decisionBrief: null,
    nextBestAction: null,
  });
  const rationaleBefore = JSON.stringify(recorded.memory!.rationale);
  const updated = appendExecutiveDecisionOutcomeEvaluation({
    memoryId: recorded.memory!.memoryId,
    evaluationBoundaryReached: true,
    actualOutcomes: [
      Object.freeze({
        expectedOutcomeId: "exp-capacity-lt-90",
        observedAt: "2026-08-22T00:00:00.000Z",
        objectId: "obj-capacity",
        metricKey: "utilization",
        actualValue: 99,
        sourceKind: "data-reality",
      }),
    ],
  });
  assert.equal(updated?.outcomeTrace?.status, "not-achieved");
  assert.equal(JSON.stringify(updated?.rationale), rationaleBefore);
});

test("AF — No causal claim language in memory JSON", () => {
  const catalog = defaultCatalog();
  const scopeKey = buildExecutiveDecisionMemoryScopeKey({
    workspace: "company",
  });
  const recorded = recordExecutiveDecisionMemory({
    decisionObjectId: "ctx-decision-capacity",
    decisionStatus: "approved",
    decisionVersion: "v-af-1",
    scopeKey,
    subjects: subjectsFromCatalog(catalog),
    links: catalog.contextLinks,
    explicitRationale: { text: "Approved expansion path" },
    expectedOutcomes: [capacityExpected()],
    decisionBrief: null,
    nextBestAction: null,
  });
  const updated = appendExecutiveDecisionOutcomeEvaluation({
    memoryId: recorded.memory!.memoryId,
    evaluationBoundaryReached: true,
    actualOutcomes: [
      Object.freeze({
        expectedOutcomeId: "exp-capacity-lt-90",
        observedAt: "2026-08-22T00:00:00.000Z",
        objectId: "obj-capacity",
        metricKey: "utilization",
        actualValue: 80,
        sourceKind: "data-reality",
      }),
    ],
  });
  const blob = JSON.stringify(updated).toLowerCase();
  assert.ok(!blob.includes("caused success"));
  assert.ok(!blob.includes("decision caused"));
  assert.ok(!/\bgood decision\b/.test(blob));
  assert.ok(!/\bbad decision\b/.test(blob));
  assert.ok(!blob.includes("proves the decision"));
});

test("AG — Not-yet-evaluable before boundary; achieved after", () => {
  const catalog = defaultCatalog();
  const scopeKey = buildExecutiveDecisionMemoryScopeKey({
    workspace: "company",
  });
  const recorded = recordExecutiveDecisionMemory({
    decisionObjectId: "ctx-decision-capacity",
    decisionStatus: "approved",
    decisionVersion: "v-ag-1",
    scopeKey,
    subjects: subjectsFromCatalog(catalog),
    links: catalog.contextLinks,
    expectedOutcomes: [capacityExpected()],
    decisionBrief: null,
    nextBestAction: null,
  });
  const before = evaluateExecutiveDecisionOutcome({
    memory: recorded.memory!,
    evaluationBoundaryReached: false,
    actualOutcomes: [
      Object.freeze({
        expectedOutcomeId: "exp-capacity-lt-90",
        observedAt: "2026-08-22T00:00:00.000Z",
        objectId: "obj-capacity",
        metricKey: "utilization",
        actualValue: 88,
        sourceKind: "data-reality",
      }),
    ],
  });
  assert.equal(before.status, "not-yet-evaluable");

  const after = appendExecutiveDecisionOutcomeEvaluation({
    memoryId: recorded.memory!.memoryId,
    evaluationBoundaryReached: true,
    actualOutcomes: [
      Object.freeze({
        expectedOutcomeId: "exp-capacity-lt-90",
        observedAt: "2026-08-22T00:00:00.000Z",
        objectId: "obj-capacity",
        metricKey: "utilization",
        actualValue: 88,
        sourceKind: "data-reality",
      }),
    ],
  });
  assert.equal(after?.outcomeTrace?.status, "achieved");
});

test("AH — Topology z=0 / camera unaffected", () => {
  const catalog = criticalCapacityCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "company",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-decision-capacity",
    catalog,
  );
  recordNexoraMVPDecisionMemory(
    state,
    {
      decisionObjectId: "ctx-decision-capacity",
      decisionStatus: "approved",
      decisionVersion: "v-ah-1",
    },
    catalog,
  );
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    catalog,
  );
  for (const object of presentation.scene.objects) {
    if (object.disclosureState === "hidden") continue;
    assert.ok(Math.abs(object.targetPosition[2]) < 2);
  }
  assert.equal(EXECUTIVE_STAGE_DECISION_MEMORY_BOUNDARY.movesCamera, false);
  assert.equal(
    EXECUTIVE_STAGE_DECISION_MEMORY_BOUNDARY.changesSemanticZ,
    false,
  );

  const obs = buildExecutiveDecisionMemoryObservability(
    presentation.decisionMemory!,
  );
  assert.equal(obs.decisionMemoryAvailable, true);
  assert.equal(obs.memoryIsSemanticObject, false);
  assert.equal(obs.memoryPersistenceLevel, "session");

  writeCapture(
    "15-queue-watch-memory",
    captureHtml("Queue + Watch + Decision Memory coexistence", presentation),
  );
  writeCapture(
    "16-brief-nba-memory",
    captureHtml(
      "Decision Brief + NBA + Decision Memory coexistence",
      presentation,
    ),
  );
});
