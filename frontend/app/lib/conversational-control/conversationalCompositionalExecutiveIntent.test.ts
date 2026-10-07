/**
 * NPA-T CEI:1 — compositional executive intent.
 * Reuses CC:1/CC:2, 6.2 referent, DATA-ADV:1, and visual guidance.
 * Does not add a parallel interpreter.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "./conversationalExperienceOrchestrator.ts";
import { resolveNexoraConversationalIntent } from "./conversationalIntentResolver.ts";
import {
  stripConversationalCompositionModifiers,
} from "./conversationalIntentNormalization.ts";
import { createEmptyManagerObjectSession } from "../manager-object/managerObjectActive.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import { resolveNexoraVisualGuidanceIntent } from "../manager-object/nexoraVisualGuidanceIntent.ts";
import {
  csvImportCandidateId,
  getCsvImportCandidate,
  resetCsvRealDataImportStoreForTests,
  saveCsvImportCandidate,
} from "../data-reality/csvRealDataImportStore.ts";
import {
  parseCsvDeterministically,
  suggestCsvColumnMappings,
} from "../data-reality/csvRealDataVerticalSlice.ts";
import { interpretCsvSemantics } from "../data-reality/csvSemanticUnderstanding.ts";
import { projectAdvisorDataContext } from "../manager-object/nexoraAdvisorDataContext.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);
const ambiguous = "DT,ORD_QTY,OTD,CAP_AV,BKL\n2026-01-01,1000,94.0,850,120";

function run(
  utterance: string,
  previous?: ReturnType<typeof executeNexoraConversationalExperience>,
) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: subjects,
    runtimeState:
      previous?.nextRuntimeState ??
      createInitialNexoraMVPObjectInteractionState({
        workspace: "overview",
        presentationState: "minimum",
        environmentIntent: "neutral",
      }),
    catalog,
    previousManagerObjectSession:
      previous?.managerObjectTurn.session ?? createEmptyManagerObjectSession(),
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    messageIdSeed: `cei1-${utterance}`,
  });
}

function subjectId(turn: ReturnType<typeof executeNexoraConversationalExperience>): string | null {
  return (
    turn.nextExecutiveContext.currentSubject?.subjectId ??
    turn.contextResult.context.primarySubject?.subjectId ??
    turn.nextRuntimeState.focusedSubject?.id ??
    null
  );
}

function seedPendingAmbiguousCsv() {
  resetCsvRealDataImportStoreForTests();
  const fileName = "data-ux3-ambiguous.csv";
  const input = Object.freeze({
    workspaceId: "overview" as const,
    fileName,
    fileSize: ambiguous.length,
    csvText: ambiguous,
    importId: `cei1:${fileName}`,
    importedAt: "2026-09-02T20:00:00.000Z",
  });
  const parse = parseCsvDeterministically(ambiguous);
  const mapping = interpretCsvSemantics({
    input,
    parse,
    structural: suggestCsvColumnMappings(parse.columns, input.importId),
  });
  saveCsvImportCandidate(
    Object.freeze({
      workspaceId: "overview",
      candidateId: csvImportCandidateId("overview", fileName),
      fileName,
      status: "preview",
      input,
      parse,
      mapping,
      prepared: null,
      error: null,
      replacementSourceContextId: null,
    }),
  );
}

test("CEI:1 H — composition modifiers are not concatenated into an entity lookup", () => {
  assert.equal(
    stripConversationalCompositionModifiers(
      "the current Inventory situation using the available evidence",
    ).toLowerCase(),
    "inventory",
  );
  const intent = resolveNexoraConversationalIntent({
    utterance: "Explain the current Inventory situation using the available evidence.",
  }).intent;
  assert.equal(intent.kind, "explain");
  assert.equal(intent.targetHints[0]?.raw.toLowerCase(), "inventory");
  assert.doesNotMatch(
    intent.targetHints[0]?.raw ?? "",
    /situation|available evidence|current inventory situation/i,
  );
});

test("CEI:1 A — explicit explain + Inventory + evidence constraint", () => {
  const focused = run("Show me Inventory.");
  assert.equal(subjectId(focused), "obj-inventory");
  const explained = run(
    "Explain the current Inventory situation using the available evidence.",
    focused,
  );
  assert.equal(explained.intentResult.intent.kind, "explain");
  assert.equal(
    explained.intentResult.intent.targetHints[0]?.raw.toLowerCase(),
    "inventory",
  );
  assert.equal(subjectId(explained), "obj-inventory");
  assert.doesNotMatch(
    explained.response,
    /couldn't find a clear match for “current inventory situation using the available evidence”/i,
  );
  assert.match(explained.response, /Inventory/i);
});

test("CEI:1 B — Show me its evidence keeps Inventory", () => {
  const inventory = run("Show me Inventory.");
  const evidence = run("Show me its evidence.", inventory);
  assert.equal(evidence.intentResult.intent.kind, "evidence");
  assert.equal(subjectId(evidence), "obj-inventory");
  assert.doesNotMatch(evidence.response, /I'm not sure how that relates/i);
  assert.doesNotMatch(evidence.response, /couldn't find a clear match/i);
});

test("CEI:1 C — chart refinements are visualization language, not entities", () => {
  const inventory = run("Show me Inventory.");
  const chart = resolveNexoraVisualGuidanceIntent({ utterance: "Show me a chart." });
  const bar = resolveNexoraVisualGuidanceIntent({ utterance: "Bar chart." });
  assert.equal(chart.kind, "RESOLVE");
  assert.equal(bar.kind, "RESOLVE");
  const chartTurn = run("Show me a chart.", inventory);
  assert.equal(subjectId(chartTurn), "obj-inventory");
  assert.doesNotMatch(chartTurn.response, /couldn't find a clear match for “(?:a )?chart”/i);
  const barTurn = run("Bar chart.", chartTurn);
  assert.equal(subjectId(barTurn), "obj-inventory");
  assert.equal(resolveNexoraVisualGuidanceIntent({ utterance: "Bar chart." }).requestedRepresentation, "COMPARISON_BARS");
});

test("CEI:1 D — pending CSV stays pending and is not related to Inventory", () => {
  seedPendingAmbiguousCsv();
  const candidate = getCsvImportCandidate(
    "overview",
    csvImportCandidateId("overview", "data-ux3-ambiguous.csv"),
  );
  assert.equal(candidate?.status, "preview");
  const context = projectAdvisorDataContext("overview");
  const pending = context.sources.find((source) => source.label === "data-ux3-ambiguous.csv");
  assert.equal(pending?.lifecycle, "pending");
  assert.equal(pending?.acceptedEvidence, false);
  const relatedToInventory = pending?.relatedObjectLabels.some((label) =>
    /inventory/i.test(label),
  );
  assert.equal(relatedToInventory, false);
  const inventory = run("Show me Inventory.");
  const listed = run(
    "For the currently selected Inventory subject, list the supported observations you currently have. Do not create a chart yet.",
    inventory,
  );
  assert.equal(subjectId(listed), "obj-inventory");
  assert.doesNotMatch(listed.response, /I'm not sure how that relates/i);
  assert.doesNotMatch(listed.response, /couldn't find a clear match/i);
  assert.match(listed.response, /data-ux3-ambiguous\.csv/i);
  assert.match(listed.response, /under review|no confirmed evidence relationship/i);
  const after = getCsvImportCandidate(
    "overview",
    csvImportCandidateId("overview", "data-ux3-ambiguous.csv"),
  );
  assert.equal(after?.status, "preview");
  resetCsvRealDataImportStoreForTests();
});

test("CEI:1 E — contextual why? stays on the current subject", () => {
  const inventory = run("Show me Inventory.");
  const why = run("Why?", inventory);
  assert.equal(why.intentResult.intent.kind, "explain");
  assert.equal(subjectId(why), "obj-inventory");
});

test("CEI:1 F — Explain it follows What about Capacity?", () => {
  const inventory = run("Show me Inventory.");
  const capacity = run("What about Capacity?", inventory);
  assert.equal(subjectId(capacity), "obj-capacity");
  const explained = run("Explain it.", capacity);
  assert.equal(subjectId(explained), "obj-capacity");
  assert.notEqual(subjectId(explained), "obj-inventory");
});

test("CEI:1 G — named historical return remains Capacity", () => {
  const returned = run(
    "What were we saying about capacity?",
    run("What about inventory?", run("Show Delivery.")),
  );
  assert.equal(subjectId(returned), "obj-capacity");
  assert.equal(returned.nextRuntimeState.focusedSubject?.id, "obj-capacity");
});
