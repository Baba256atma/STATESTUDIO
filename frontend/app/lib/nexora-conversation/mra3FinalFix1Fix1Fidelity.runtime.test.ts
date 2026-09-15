/**
 * MRA:3-FINAL-FIX1-FIX1 — resolved subject must survive into final composition.
 */
import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { toNexoraConversationContextSnapshot } from "../conversational-control/executiveContextProjection.ts";
import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { activateManagerObjectFromClick } from "../manager-object/managerObjectActive.ts";
import { syncNexoraExecutiveContextFromRuntimeState } from "../nex-mvp/nexoraMVPExecutiveContextAwareness.ts";
import {
  csvImportCandidateId,
  resetCsvRealDataImportStoreForTests,
  saveCsvImportCandidate,
} from "../data-reality/csvRealDataImportStore.ts";
import {
  parseCsvDeterministically,
  suggestCsvColumnMappings,
} from "../data-reality/csvRealDataVerticalSlice.ts";
import { interpretCsvSemantics } from "../data-reality/csvSemanticUnderstanding.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);
const T0 = "2026-09-10T22:30:00.000Z";
const ambiguous = "DT,ORD_QTY,OTD,CAP_AV,BKL\n2026-01-01,1000,94.0,850,120";

type Turn = ReturnType<typeof executeNexoraConversationalExperience>;

function overview() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function run(
  utterance: string,
  previous?: Turn,
  overlay?: {
    readonly executiveContext?: Turn["nextExecutiveContext"];
    readonly runtimeState?: Turn["nextRuntimeState"];
    readonly previousManagerObjectSession?: Turn["managerObjectTurn"]["session"];
    readonly previousUtterance?: string | null;
    readonly lastAppliedCommandId?: string | null;
  },
): Turn {
  const executiveContext = overlay?.executiveContext ?? previous?.nextExecutiveContext;
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: executiveContext
      ? toNexoraConversationContextSnapshot(executiveContext)
      : previous?.nextConversationContext,
    executiveContext,
    executiveSubjects: subjects,
    runtimeState: overlay?.runtimeState ?? previous?.nextRuntimeState ?? overview(),
    catalog,
    previousManagerObjectSession:
      overlay?.previousManagerObjectSession ?? previous?.managerObjectTurn.session ?? null,
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    allowActiveStageContext: false,
    previousUtterance: overlay?.previousUtterance,
    lastAppliedCommandId: overlay?.lastAppliedCommandId,
    messageIdSeed: `mra-3-final-fix1-fix1-${utterance}`,
  });
}

function seedUniqueCsv(fileName: string) {
  const input = Object.freeze({
    workspaceId: "overview" as const,
    fileName,
    fileSize: ambiguous.length,
    csvText: ambiguous,
    importId: `mra-3-final-fix1-fix1:${fileName}`,
    importedAt: T0,
  });
  const parse = parseCsvDeterministically(ambiguous);
  saveCsvImportCandidate(Object.freeze({
    workspaceId: "overview",
    candidateId: csvImportCandidateId("overview", fileName),
    fileName,
    status: "preview",
    input,
    parse,
    mapping: interpretCsvSemantics({
      input,
      parse,
      structural: suggestCsvColumnMappings(parse.columns, input.importId),
    }),
    prepared: null,
    error: null,
    replacementSourceContextId: null,
  }));
}

afterEach(() => {
  resetCsvRealDataImportStoreForTests();
});

describe("MRA:3-FINAL-FIX1-FIX1 composition fidelity", () => {
  it("mandatory Stage click → Capacity Gap → explain it composes the Problem", () => {
    seedUniqueCsv("data-ux3-ambiguous.csv");
    const named = run("Capacity Gap", run("is there any CSV files?", run("show me scenarios")));
    const clickedState = selectNexoraMVPInteractionSubject(
      named.nextRuntimeState,
      "obj-revenue",
      catalog,
    );
    const synced = syncNexoraExecutiveContextFromRuntimeState({
      previousContext: named.nextExecutiveContext,
      nextState: clickedState,
      syncSource: "runtime",
      executiveSubjects: subjects,
      catalog,
    });
    const clickedSession = activateManagerObjectFromClick(
      named.managerObjectTurn.session,
      clickedState.focusedSubject?.id ?? "obj-revenue",
    );
    const restored = run("look at Capacity Gap", named, {
      executiveContext: synced.nextContext,
      runtimeState: clickedState,
      previousManagerObjectSession: clickedSession,
      previousUtterance: "Capacity Gap",
      lastAppliedCommandId: named.commandResult?.command?.commandId ?? null,
    });
    const explained = run("explain it.", restored);
    assert.equal(explained.intentResult.intent.kind, "explain");
    assert.match(explained.response, /Capacity Gap/i);
    assert.doesNotMatch(explained.response, /Capacity Expansion Plan explores/i);
    assert.equal(explained.trace.compositionSelectedSubjectKind, "problem");
  });

  it("Test A: Scenario → Capacity Gap → explain it is Capacity Gap", () => {
    const explained = run("explain it.", run("Capacity Gap", run("show me scenarios")));
    assert.match(explained.response, /Capacity Gap/i);
    assert.doesNotMatch(explained.response, /Capacity Expansion Plan explores/i);
  });

  it("Test B: CSV → Capacity Gap → explain it is Capacity Gap", () => {
    seedUniqueCsv("data-ux3-ambiguous.csv");
    const explained = run(
      "explain it.",
      run("Capacity Gap", run("is there any CSV files?")),
    );
    assert.match(explained.response, /Capacity Gap/i);
    assert.doesNotMatch(explained.response, /data-ux3-ambiguous\.csv is under review/i);
  });

  it("Test C: Capacity Gap → Demand Surge → explain it is Demand Surge", () => {
    const explained = run("explain it.", run("Demand Surge", run("Capacity Gap")));
    assert.match(explained.response, /Demand Surge/i);
    assert.doesNotMatch(explained.response, /^Capacity Gap/i);
  });

  it("Test D: Scenario → Capacity KPI → explain it is Capacity", () => {
    const explained = run(
      "explain it.",
      run("look at Capacity", run("show me scenarios")),
    );
    assert.match(explained.response, /Capacity/i);
    assert.doesNotMatch(explained.response, /Capacity Expansion Plan explores/i);
  });

  it("Test E: Problem → Risk → explain it is Risk", () => {
    const explained = run("explain it.", run("Risk", run("Capacity Gap")));
    assert.match(explained.response, /Risk/i);
    assert.doesNotMatch(explained.response, /^Capacity Gap/i);
  });

  it("Test F: Scenario → Approve Repricing → explain it is the Decision", () => {
    const explained = run(
      "explain it.",
      run("Approve Repricing", run("show me scenarios")),
    );
    assert.match(explained.response, /Approve Repricing/i);
    assert.doesNotMatch(explained.response, /Capacity Expansion Plan explores/i);
  });

  it("Test G: Decision → Pricing Rollout → explain it is the Execution", () => {
    const explained = run(
      "explain it.",
      run("Pricing Rollout", run("Approve Repricing")),
    );
    assert.match(explained.response, /Pricing Rollout/i);
  });

  it("FIX2-FIX1: Scenario → CSV inventory → explain it is the CSV", () => {
    seedUniqueCsv("data-ux3-ambiguous.csv");
    const explained = run("explain it.", run("is there any CSV files?", run("show me scenarios")));
    assert.match(explained.response, /data-ux3-ambiguous\.csv/i);
    assert.doesNotMatch(explained.response, /Capacity Expansion Plan explores/i);
  });

  it("legitimate Demand Surge explain remains Scenario explanation", () => {
    const explained = run("explain it.", run("Demand Surge"));
    assert.match(explained.response, /Demand Surge/i);
  });

  it("look at Capacity Gap is navigation, not merged into explain", () => {
    const looked = run("look at Capacity Gap");
    assert.notEqual(looked.intentResult.intent.kind, "explain");
    const explained = run("explain it.", looked);
    assert.equal(explained.intentResult.intent.kind, "explain");
    assert.match(explained.response, /Capacity Gap/i);
  });
});
