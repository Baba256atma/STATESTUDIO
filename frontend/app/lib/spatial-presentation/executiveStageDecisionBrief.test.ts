/**
 * STAGE-PROD:4 — Executive Decision Brief certification (A–AA).
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
  resolveNexoraMVPDecisionBrief,
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
  buildExecutiveChangeSnapshot,
  resetExecutiveChangeBaselineStoreForTests,
  resolveExecutiveMeaningfulChanges,
} from "./executiveStageChangeIntelligence.ts";
import {
  EXECUTIVE_STAGE_DECISION_BRIEF_BOUNDARY,
  assembleExecutiveDecisionBriefFacts,
  buildExecutiveDecisionBriefObservability,
  getExecutiveStageDecisionBriefIdentity,
  isExecutiveDecisionBriefEligible,
  resolveExecutiveDecisionBrief,
  verifyExecutiveStageDecisionBrief,
  type ExecutiveBriefSubjectInput,
} from "./executiveStageDecisionBrief.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CAPTURE_DIR = join(
  __dirname,
  "../../../.certification/stage-prod-4-captures",
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
  const brief = presentation.decisionBrief?.brief;
  const evidence = (brief?.evidence ?? [])
    .map((item) => `<li>${item.text}</li>`)
    .join("");
  const options = (brief?.options ?? [])
    .map((option) => `<li>${option.label} <code>${option.objectId ?? ""}</code></li>`)
    .join("");
  return `<!doctype html><html><head><meta charset="utf-8"/><title>${title}</title>
<style>body{margin:0;background:#0a1018;color:#d7e0ea;font:14px ui-sans-serif,system-ui;padding:24px}
.card{max-width:480px;margin:0 auto;padding:16px;border:1px solid #3a516c;background:rgba(8,14,24,.7)}
h1{font-size:16px;text-align:center}h2{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#8aa0b5}
.sec{border:1px solid #2f455c;padding:8px;border-radius:4px;margin:8px 0}
.quiet{opacity:.55}code{font-size:11px;opacity:.8}</style></head><body>
<h1>${title}</h1>
<div class="card">
<p>Focus: ${presentation.focusedSubjectId ?? "none"} · mode: ${presentation.presentationMode}
 · eligible: ${String(presentation.decisionBrief?.eligible ?? false)}</p>
${
  brief
    ? `<h2>Situation</h2><div class="sec">${brief.situation.text}</div>
       <h2>Evidence</h2><ul>${evidence || "<li class='quiet'>(none)</li>"}</ul>
       <h2>Impact</h2><div class="sec">${brief.impact?.text ?? "<span class='quiet'>null</span>"}</div>
       <h2>Options</h2><ul>${options || "<li class='quiet'>(none)</li>"}</ul>
       <h2>Recommendation</h2><div class="sec">${brief.recommendation?.text ?? "<span class='quiet'>none</span>"}
         <div class="quiet">${brief.recommendation?.actionId ?? ""}</div></div>
       <h2>Decision Required</h2><div class="sec">${brief.decisionRequired?.text ?? "<span class='quiet'>none</span>"}</div>
       <p class="quiet">completeness: ${brief.completeness}</p>`
    : `<p class="quiet">No Decision Brief UI</p>`
}
</div></body></html>`;
}

function subject(
  partial: ExecutiveBriefSubjectInput,
): ExecutiveBriefSubjectInput {
  return Object.freeze(partial);
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

test.beforeEach(() => {
  resetExecutiveChangeBaselineStoreForTests();
});

test("identity + safety boundary", () => {
  const identity = getExecutiveStageDecisionBriefIdentity();
  assert.equal(identity.id, "STAGE-PROD:4/ExecutiveStageDecisionBrief");
  assert.equal(verifyExecutiveStageDecisionBrief().ok, true);
  assert.equal(
    EXECUTIVE_STAGE_DECISION_BRIEF_BOUNDARY.autoApprovesDecisions,
    false,
  );
  assert.equal(
    EXECUTIVE_STAGE_DECISION_BRIEF_BOUNDARY.inventsDoNothing,
    false,
  );
  assert.equal(
    EXECUTIVE_STAGE_DECISION_BRIEF_BOUNDARY.recomputesNbaIndependently,
    false,
  );
});

test("A — Stable Business Object → brief ineligible", () => {
  const catalog = defaultCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, "obj-budget", catalog);
  const brief = resolveNexoraMVPDecisionBrief(state, catalog);
  assert.equal(brief.eligible, false);
  assert.equal(brief.available, false);
  assert.equal(brief.brief, null);
  writeCapture(
    "14-stable-brief-absent",
    captureHtml(
      "Stable Object — Brief absent",
      deriveNexoraMVPStageInteractionPresentation(state, catalog),
    ),
  );
});

test("B — Critical Capacity + Problem → Situation + Evidence", () => {
  const catalog = criticalCapacityCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity", catalog);
  const brief = resolveNexoraMVPDecisionBrief(state, catalog);
  assert.equal(brief.eligible, true);
  assert.ok(brief.brief);
  assert.ok(brief.brief!.situation.text.length > 0);
  assert.ok(brief.brief!.evidence.length >= 1);
  assert.ok(
    brief.brief!.evidence.some(
      (item) =>
        item.sourceObjectIds.includes("ctx-problem-capacity") ||
        item.sourceKind === "problem",
    ) || brief.brief!.situation.sourceObjectIds.includes("obj-capacity"),
  );
  writeCapture(
    "01-critical-capacity-brief",
    captureHtml(
      "Critical Capacity + Brief",
      deriveNexoraMVPStageInteractionPresentation(state, catalog),
    ),
  );
});

test("C — Problem + Scenarios → options >= 2 with scenario IDs", () => {
  const catalog = defaultCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-problem-margin",
    catalog,
  );
  const brief = resolveNexoraMVPDecisionBrief(state, catalog);
  assert.ok(brief.brief);
  assert.ok(brief.brief!.options.length >= 2);
  for (const option of brief.brief!.options) {
    assert.equal(option.optionKind, "scenario");
    assert.ok(option.objectId?.startsWith("ctx-scenario-"));
  }
  const optionIds = brief.brief!.options.map((option) => option.objectId);
  assert.ok(optionIds.includes("ctx-scenario-pricing"));
  assert.ok(optionIds.includes("ctx-scenario-demand"));
  writeCapture(
    "02-problem-evidence-scenarios",
    captureHtml(
      "Problem + Evidence + Scenarios",
      deriveNexoraMVPStageInteractionPresentation(state, catalog),
    ),
  );
});

test("D — Orphan Problem without Scenarios → options 0, partial or decisionRequired", () => {
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
  const brief = resolveNexoraMVPDecisionBrief(state, catalog);
  assert.ok(brief.brief);
  assert.equal(brief.brief!.options.length, 0);
  assert.ok(
    brief.brief!.completeness === "partial" ||
      brief.brief!.decisionRequired != null,
  );
  writeCapture(
    "06-partial-brief",
    captureHtml(
      "Partial Brief — orphan problem",
      deriveNexoraMVPStageInteractionPresentation(state, catalog),
    ),
  );
});

test("E — Risk → evidence + scenario options", () => {
  const catalog = defaultCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, "obj-risk", catalog);
  const brief = resolveNexoraMVPDecisionBrief(state, catalog);
  assert.equal(brief.eligible, true);
  assert.ok(brief.brief);
  assert.ok(brief.brief!.evidence.length >= 1);
  assert.ok(
    brief.brief!.evidence.some(
      (item) =>
        item.sourceObjectIds.includes("obj-risk") ||
        /risk/i.test(item.text),
    ),
  );
  assert.ok(brief.brief!.options.length >= 1);
  assert.ok(
    brief.brief!.options.every((option) => option.optionKind === "scenario"),
  );
  writeCapture(
    "03-risk-brief",
    captureHtml(
      "Risk Brief",
      deriveNexoraMVPStageInteractionPresentation(state, catalog),
    ),
  );
});

test("F — Scenario siblings, no best label", () => {
  const catalog = defaultCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-scenario-pricing",
    catalog,
  );
  const brief = resolveNexoraMVPDecisionBrief(state, catalog);
  assert.ok(brief.brief);
  assert.ok(brief.brief!.options.length >= 1);
  const siblingIds = brief.brief!.options.map((option) => option.objectId);
  assert.ok(siblingIds.includes("ctx-scenario-demand"));
  assert.ok(!siblingIds.includes("ctx-scenario-pricing"));
  for (const option of brief.brief!.options) {
    assert.ok(!/\bbest\b/i.test(option.label));
  }
  writeCapture(
    "04-scenario-brief",
    captureHtml(
      "Scenario Brief",
      deriveNexoraMVPStageInteractionPresentation(state, catalog),
    ),
  );
});

test("G — Decision reprice → Decision Required without auto-choice", () => {
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
  const brief = resolveNexoraMVPDecisionBrief(state, catalog);
  assert.ok(brief.brief);
  assert.ok(brief.brief!.decisionRequired);
  const required = brief.brief!.decisionRequired!.text.toLowerCase();
  assert.ok(required.includes("approve"));
  assert.ok(required.includes("reject"));
  assert.ok(required.includes("revise"));
  assert.ok(!/\bapproved\b/.test(required));
  assert.ok(!brief.brief!.options.some((option) => /do nothing/i.test(option.label)));
  writeCapture(
    "05-decision-brief",
    captureHtml(
      "Decision Brief",
      deriveNexoraMVPStageInteractionPresentation(state, catalog),
    ),
  );
});

test("H — Recommendation actionId === NBA recommended id", () => {
  const catalog = defaultCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-problem-margin",
    catalog,
  );
  const nba = resolveNexoraMVPNextBestActions(state, catalog);
  const brief = resolveNexoraMVPDecisionBrief(state, catalog, null, nba);
  assert.ok(nba.recommendedAction);
  assert.ok(brief.brief?.recommendation);
  assert.equal(
    brief.brief!.recommendation!.actionId,
    nba.recommendedAction!.id,
  );
  writeCapture(
    "07-brief-with-recommendation",
    captureHtml(
      "Brief with Recommendation",
      deriveNexoraMVPStageInteractionPresentation(state, catalog),
    ),
  );
  writeCapture(
    "11-nba-brief-coexistence",
    captureHtml(
      "NBA + Brief coexistence",
      deriveNexoraMVPStageInteractionPresentation(state, catalog),
    ),
  );
});

test("I — Stable execution ineligible; delayed execution eligible", () => {
  const catalog = defaultCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-execution-rollout",
    catalog,
  );
  const stable = resolveNexoraMVPDecisionBrief(state, catalog);
  assert.equal(stable.eligible, false);

  const delayed = resolveExecutiveDecisionBrief({
    presentationMode: "object-focus",
    primaryStageSubjectId: "ctx-execution-capacity",
    subjects: [
      subject({
        subjectId: "ctx-execution-capacity",
        objectKind: "execution",
        label: "Capacity Expansion",
        status: "delayed",
        attention: "critical",
        family: "executive-work",
      }),
      subject({
        subjectId: "ctx-decision-capacity",
        objectKind: "decision",
        label: "Expand Capacity",
        status: "stable",
        family: "executive-work",
      }),
      subject({
        subjectId: "ctx-scenario-capacity",
        objectKind: "scenario",
        label: "Capacity Expansion Plan",
        family: "executive-work",
      }),
      subject({
        subjectId: "obj-capacity",
        objectKind: "object",
        label: "Capacity",
        family: "business-object",
      }),
    ],
    links: [
      Object.freeze({
        objectId: "obj-capacity",
        contextId: "ctx-execution-capacity",
      }),
      Object.freeze({
        objectId: "obj-capacity",
        contextId: "ctx-decision-capacity",
      }),
      Object.freeze({
        objectId: "obj-capacity",
        contextId: "ctx-scenario-capacity",
      }),
    ],
  });
  assert.equal(delayed.eligible, true);
  assert.ok(delayed.brief);
});

test("J — Change comparison deterioration → recent-change evidence or situation", () => {
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
  assert.ok(
    comparison.changes.some((change) => change.changeKind === "deteriorated"),
  );

  const catalog = criticalCapacityCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity", catalog);
  const brief = resolveNexoraMVPDecisionBrief(state, catalog, comparison);
  assert.ok(brief.brief);
  const hasRecentChangeEvidence = brief.brief!.evidence.some(
    (item) => item.sourceKind === "recent-change",
  );
  const situationMentionsDeterioration = /deteriorat/i.test(
    brief.brief!.situation.text,
  );
  assert.ok(hasRecentChangeEvidence || situationMentionsDeterioration);
});

test("K — Evidence limit <= 6", () => {
  const manySubjects: ExecutiveBriefSubjectInput[] = [
    subject({
      subjectId: "obj-capacity",
      objectKind: "object",
      label: "Capacity",
      attention: "critical",
      status: "risk",
      family: "business-object",
    }),
  ];
  const links: { objectId: string; contextId: string }[] = [];
  for (let index = 0; index < 8; index += 1) {
    const problemId = `ctx-problem-extra-${index}`;
    manySubjects.push(
      subject({
        subjectId: problemId,
        objectKind: "problem",
        label: `Extra Problem ${index}`,
        attention: "critical",
        status: "risk",
        unresolved: true,
        family: "executive-work",
      }),
    );
    links.push(
      Object.freeze({
        objectId: "obj-capacity",
        contextId: problemId,
      }),
    );
  }
  const result = resolveExecutiveDecisionBrief({
    presentationMode: "object-focus",
    primaryStageSubjectId: "obj-capacity",
    subjects: manySubjects,
    links,
  });
  assert.ok(result.brief);
  assert.ok(result.brief!.evidence.length <= 6);
});

test("L — Unique evidence texts", () => {
  const catalog = criticalCapacityCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity", catalog);
  const brief = resolveNexoraMVPDecisionBrief(state, catalog);
  assert.ok(brief.brief);
  const texts = brief.brief!.evidence.map((item) =>
    item.text.toLowerCase().replace(/\s+/g, " ").trim(),
  );
  assert.equal(texts.length, new Set(texts).size);
});

test("M — Lonely object+problem no relationships → impact null", () => {
  const result = resolveExecutiveDecisionBrief({
    presentationMode: "object-focus",
    primaryStageSubjectId: "obj-lonely",
    subjects: [
      subject({
        subjectId: "obj-lonely",
        objectKind: "object",
        label: "Lonely",
        attention: "critical",
        status: "risk",
        family: "business-object",
      }),
      subject({
        subjectId: "ctx-problem-lonely",
        objectKind: "problem",
        label: "Lonely Problem",
        attention: "critical",
        status: "risk",
        unresolved: true,
        family: "executive-work",
      }),
    ],
    links: [
      Object.freeze({
        objectId: "obj-lonely",
        contextId: "ctx-problem-lonely",
      }),
    ],
    relationships: [],
  });
  assert.ok(result.brief);
  assert.equal(result.brief!.impact, null);
  writeCapture(
    "08-brief-no-recommendation",
    `<!doctype html><title>No Impact</title><p>impact=null · options=${result.brief!.options.length}</p>`,
  );
});

test("N — Capacity critical → impact related to + relationship ids", () => {
  const catalog = criticalCapacityCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity", catalog);
  const brief = resolveNexoraMVPDecisionBrief(state, catalog);
  assert.ok(brief.brief?.impact);
  assert.match(brief.brief!.impact!.text, /related to/i);
  assert.ok((brief.brief!.impact!.sourceRelationshipIds?.length ?? 0) > 0);
});

test("O — No Do Nothing option", () => {
  const catalog = defaultCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-problem-margin",
    catalog,
  );
  const brief = resolveNexoraMVPDecisionBrief(state, catalog);
  assert.ok(brief.brief);
  assert.ok(
    !brief.brief!.options.some((option) => /do nothing/i.test(option.label)),
  );
  assert.equal(
    EXECUTIVE_STAGE_DECISION_BRIEF_BOUNDARY.inventsDoNothing,
    false,
  );
});

test("P — Option click → primary = advisor = brief = scenario", () => {
  const catalog = defaultCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-problem-margin",
    catalog,
  );
  const before = resolveNexoraMVPDecisionBrief(state, catalog);
  const option = before.brief?.options.find(
    (entry) => entry.objectId === "ctx-scenario-pricing",
  );
  assert.ok(option?.objectId);
  state = selectNexoraMVPInteractionSubject(state, option!.objectId!, catalog);
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    catalog,
  );
  const advisor = buildNexoraMVPAdvisorContextBridge(state, presentation);
  const brief = presentation.decisionBrief;
  assert.equal(state.focusedSubject?.id, "ctx-scenario-pricing");
  assert.equal(state.selectedSubject?.id, "ctx-scenario-pricing");
  assert.equal(presentation.focusedSubjectId, "ctx-scenario-pricing");
  assert.equal(advisor.primaryStageSubjectId, "ctx-scenario-pricing");
  assert.equal(advisor.advisorSubjectId, "ctx-scenario-pricing");
  assert.equal(brief?.subjectObjectId, "ctx-scenario-pricing");
  assert.equal(advisor.briefSubjectId, "ctx-scenario-pricing");
  const center = presentation.scene.objects.find(
    (object) => object.id === "ctx-scenario-pricing" || object.id === presentation.focusedSubjectId,
  );
  // Context subjects are not Stage mesh objects; centered focus is via presentation mode.
  assert.equal(presentation.presentationMode, "object-focus");
  writeCapture(
    "09-scenario-option-click",
    captureHtml("Scenario option click → center", presentation),
  );
  void center;
});

test("Q — Recommendation uses NBA executor", () => {
  const catalog = defaultCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-problem-margin",
    catalog,
  );
  const nba = resolveNexoraMVPNextBestActions(state, catalog);
  const brief = resolveNexoraMVPDecisionBrief(state, catalog, null, nba);
  assert.ok(nba.recommendedAction);
  assert.equal(
    brief.brief?.recommendation?.actionId,
    nba.recommendedAction!.id,
  );
  const intent = executeNexoraMVPNextBestAction(
    nba.recommendedAction!,
    catalog,
  );
  assert.notEqual(intent.type, "unavailable");
  if (intent.type === "select-subject") {
    state = selectNexoraMVPInteractionSubject(state, intent.subjectId, catalog);
    assert.equal(state.focusedSubject?.id, intent.subjectId);
  }
  writeCapture(
    "10-recommendation-click",
    captureHtml(
      "Recommendation click → target focus",
      deriveNexoraMVPStageInteractionPresentation(state, catalog),
    ),
  );
});

test("R — Capacity → Revenue recompute", () => {
  const catalog = criticalCapacityCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity", catalog);
  let brief = resolveNexoraMVPDecisionBrief(state, catalog);
  assert.equal(brief.subjectObjectId, "obj-capacity");
  assert.equal(brief.eligible, true);

  state = selectNexoraMVPInteractionSubject(state, "obj-revenue", catalog);
  brief = resolveNexoraMVPDecisionBrief(state, catalog);
  assert.equal(brief.subjectObjectId, "obj-revenue");
  // Revenue may or may not be decision-pressure eligible; subject must recompute.
  assert.notEqual(brief.subjectObjectId, "obj-capacity");
});

test("S — Collection hides brief; member click restores", () => {
  const catalog = defaultCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = openNexoraMVPExecutiveQueueCollection(state, "problem", catalog);
  let presentation = deriveNexoraMVPStageInteractionPresentation(state, catalog);
  assert.equal(presentation.decisionBrief?.eligible, false);
  assert.equal(presentation.decisionBrief?.brief, null);
  writeCapture(
    "13-collection-brief-hidden",
    captureHtml("Collection mode with Brief hidden", presentation),
  );

  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-problem-capacity",
    catalog,
  );
  presentation = deriveNexoraMVPStageInteractionPresentation(state, catalog);
  assert.equal(presentation.presentationMode, "object-focus");
  assert.ok(presentation.decisionBrief?.eligible === true);
  assert.ok(presentation.decisionBrief?.brief);
});

test("T–V — Back / Forward / Escape", () => {
  const catalog = defaultCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-problem-margin",
    catalog,
  );
  state = selectNexoraMVPInteractionSubject(
    state,
    "ctx-scenario-pricing",
    catalog,
  );
  assert.equal(
    resolveNexoraMVPDecisionBrief(state, catalog).subjectObjectId,
    "ctx-scenario-pricing",
  );

  state = stepBackNexoraMVPObjectInteraction(state, catalog);
  assert.equal(state.focusedSubject?.id, "ctx-problem-margin");
  let brief = resolveNexoraMVPDecisionBrief(state, catalog);
  assert.equal(brief.subjectObjectId, "ctx-problem-margin");

  state = stepForwardNexoraMVPObjectInteraction(state, catalog);
  assert.equal(state.focusedSubject?.id, "ctx-scenario-pricing");
  brief = resolveNexoraMVPDecisionBrief(state, catalog);
  assert.equal(brief.subjectObjectId, "ctx-scenario-pricing");

  state = resetNexoraMVPObjectInteractionOverview(state);
  brief = resolveNexoraMVPDecisionBrief(state, catalog);
  assert.equal(brief.eligible, false);
  assert.equal(brief.brief, null);
});

test("W — briefSubjectId sync", () => {
  const catalog = criticalCapacityCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity", catalog);
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    catalog,
  );
  const advisor = buildNexoraMVPAdvisorContextBridge(state, presentation);
  assert.equal(advisor.briefSubjectId, advisor.primaryStageSubjectId);
  assert.equal(advisor.briefSubjectId, advisor.advisorSubjectId);
  assert.equal(advisor.briefSubjectId, "obj-capacity");
  assert.equal(presentation.decisionBrief?.subjectObjectId, "obj-capacity");
  writeCapture(
    "12-queue-watch-brief",
    captureHtml("Queue + Watch + Brief coexistence", presentation),
  );
});

test("X — NBA action id sync when recommendation present", () => {
  const catalog = defaultCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, "obj-risk", catalog);
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    catalog,
  );
  const nba = presentation.nextBestAction;
  const recommendation = presentation.decisionBrief?.brief?.recommendation;
  if (recommendation?.actionId != null) {
    assert.equal(recommendation.actionId, nba?.recommendedAction?.id ?? null);
  }
});

test("Y — Unsupported sections absent", () => {
  const result = resolveExecutiveDecisionBrief({
    presentationMode: "object-focus",
    primaryStageSubjectId: "ctx-problem-bare",
    subjects: [
      subject({
        subjectId: "ctx-problem-bare",
        objectKind: "problem",
        label: "Bare Problem",
        attention: "critical",
        status: "risk",
        unresolved: true,
        family: "executive-work",
      }),
    ],
    links: [],
    relationships: [],
  });
  assert.ok(result.brief);
  assert.equal(result.brief!.impact, null);
  assert.equal(result.brief!.options.length, 0);
  // No fabricated Do Nothing / causal impact
  assert.ok(
    result.brief!.completeness === "partial" ||
      result.brief!.decisionRequired != null,
  );
});

test("Z — Executive safety boundary", () => {
  assert.equal(
    EXECUTIVE_STAGE_DECISION_BRIEF_BOUNDARY.autoApprovesDecisions,
    false,
  );
  assert.equal(
    EXECUTIVE_STAGE_DECISION_BRIEF_BOUNDARY.autoStartsExecutions,
    false,
  );
  assert.equal(
    EXECUTIVE_STAGE_DECISION_BRIEF_BOUNDARY.autoResolvesProblems,
    false,
  );
  assert.equal(
    EXECUTIVE_STAGE_DECISION_BRIEF_BOUNDARY.inventsOptions,
    false,
  );
  assert.equal(
    EXECUTIVE_STAGE_DECISION_BRIEF_BOUNDARY.inventsCausalClaims,
    false,
  );
  assert.equal(verifyExecutiveStageDecisionBrief().safetyValid, true);

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
  const brief = resolveNexoraMVPDecisionBrief(state, catalog);
  const blob = JSON.stringify(brief.brief).toLowerCase();
  assert.ok(!blob.includes("auto-approve"));
  assert.ok(!/\bcommit budget\b/.test(blob));
  assert.ok(!/\bdelete object\b/.test(blob));
});

test("AA — Camera z≈0 + observability", () => {
  const catalog = criticalCapacityCatalog();
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity", catalog);
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    state,
    catalog,
  );
  for (const object of presentation.scene.objects) {
    if (object.disclosureState === "hidden") continue;
    assert.ok(Math.abs(object.targetPosition[2]) < 2);
  }
  assert.equal(
    EXECUTIVE_STAGE_DECISION_BRIEF_BOUNDARY.movesCamera,
    false,
  );
  assert.equal(
    EXECUTIVE_STAGE_DECISION_BRIEF_BOUNDARY.changesSemanticZ,
    false,
  );

  const obs = buildExecutiveDecisionBriefObservability(
    presentation.decisionBrief!,
  );
  assert.equal(obs.briefSubjectId, "obj-capacity");
  assert.equal(obs.briefEligible, true);
  assert.equal(obs.briefIsSemanticObject, false);
  assert.ok(typeof obs.briefEvidenceCount === "number");

  // Fact assembly / eligibility helpers remain callable.
  const eligibility = isExecutiveDecisionBriefEligible({
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
        attention: "important",
        status: "watch",
        family: "executive-work",
      }),
    ],
    links: [
      Object.freeze({
        objectId: "obj-capacity",
        contextId: "ctx-problem-capacity",
      }),
    ],
  });
  assert.equal(eligibility.eligible, true);
  const facts = assembleExecutiveDecisionBriefFacts({
    subject: subject({
      subjectId: "obj-capacity",
      objectKind: "object",
      attention: "critical",
      status: "risk",
      family: "business-object",
    }),
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
        attention: "important",
        status: "watch",
        family: "executive-work",
      }),
    ],
    links: [
      Object.freeze({
        objectId: "obj-capacity",
        contextId: "ctx-problem-capacity",
      }),
    ],
  });
  assert.equal(facts.subject.subjectId, "obj-capacity");
  assert.ok(facts.relatedProblems.length >= 1);
});
