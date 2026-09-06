/**
 * NEX-ENT:6 — Data & Evidence education over real DATA-UX / DATA-ADV / DIR:GA.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import {
  applyCsvSemanticClarification,
  interpretCsvSemantics,
} from "../data-reality/csvSemanticUnderstanding.ts";
import {
  parseCsvDeterministically,
  suggestCsvColumnMappings,
  type CsvVerticalSliceInput,
} from "../data-reality/csvRealDataVerticalSlice.ts";
import {
  listCsvRealDataImports,
  resetCsvRealDataImportStoreForTests,
} from "../data-reality/csvRealDataImportStore.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import {
  applyEntranceCenterSubject,
  createNexoraEntranceSession,
  isNexoraEntranceRestrained,
  projectNexoraEntranceCatalog,
} from "./nexoraEntranceExperience.ts";
import {
  shouldNexoraGuidedEntranceOwnUtterance,
  withActiveNexoraGuidedEntrance,
} from "./nexoraGuidedEntranceExperience.ts";
import { attentionEducationOf } from "./nexoraAttentionEducationExperience.ts";
import {
  NEXORA_DATA_EDUCATION_BOUNDARY,
  dataEducationOf,
  shouldNexoraDataEducationOwnUtterance,
  verifyNexoraDataEducation,
} from "./nexoraDataEducationExperience.ts";
import { NEXORA_GUIDED_ATTENTION_RESERVED } from "./nexoraGuidedEntranceTypes.ts";

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function guidedSession() {
  return withActiveNexoraGuidedEntrance(
    createNexoraEntranceSession({ workspaceResolution: "first-time" }),
  );
}

function run(
  utterance: string,
  previous?: ReturnType<typeof executeNexoraConversationalExperience>,
) {
  const session = previous?.nextEntranceSession ?? guidedSession();
  const catalog = isNexoraEntranceRestrained(session)
    ? projectNexoraEntranceCatalog(session)
    : getDefaultNexoraMVPObjectInteractionCatalog();
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: projectManagerObjectConversationalSubjects(catalog),
    runtimeState:
      previous?.nextRuntimeState ?? applyEntranceCenterSubject(initialState(), session),
    catalog,
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    previousEntranceSession: session,
    previousGuidedAttention: previous?.guidedAttention ?? null,
    mountedGuidedAttentionTargets: Object.freeze(["DATA_ENTRY", "STAGE"]),
    attentionNowMs: previous ? 2_000 : 0,
    messageIdSeed: `nex-ent6-${utterance}`,
  });
}

function afterStage() {
  return run("Show me how focus works", run("Show me"));
}

function atGoal() {
  return run("Show me the next one", afterStage());
}

function advance(steps: number, from = atGoal()) {
  let current = from;
  for (let index = 0; index < steps; index += 1) {
    current = run("Show me the next one", current);
  }
  return current;
}

function atConversationAsk() {
  return run("Show me the next one", advance(7));
}

function atAttentionIntro() {
  return run("Show me the next one", advance(5, atConversationAsk()));
}

let sourceSeed: ReturnType<typeof executeNexoraConversationalExperience> | undefined;
let exampleSeed: ReturnType<typeof executeNexoraConversationalExperience> | undefined;

function atDataSource() {
  sourceSeed ??= run("Show me the next one", advance(3, atAttentionIntro()));
  return sourceSeed;
}

function atExample() {
  exampleSeed ??= run("Show me an example", atDataSource());
  return exampleSeed;
}

function assertNoBusinessTruth(
  result: ReturnType<typeof executeNexoraConversationalExperience>,
) {
  const session = result.nextEntranceSession;
  assert.equal(session?.goalDiscovery, null);
  assert.equal(session?.issueDiscovery, null);
  assert.equal(session?.decisionExperience, null);
  assert.equal(session?.executionPlanning, null);
  assert.equal(session?.outcomeMonitoring, null);
  assert.equal(session?.learningReassessment, null);
  assert.equal(session?.identity.sufficiency, "INSUFFICIENT");
}

function educationSource(): string {
  return readFileSync(new URL("./nexoraDataEducationExperience.ts", import.meta.url), "utf8");
}

describe("NEX-ENT:6 Data & Evidence education", () => {
  it("teaches Data without owning Data architecture", () => {
    assert.equal(verifyNexoraDataEducation().ok, true);
    assert.equal(NEXORA_DATA_EDUCATION_BOUNDARY.ownsIngestion, false);
    assert.equal(NEXORA_DATA_EDUCATION_BOUNDARY.ownsDataReality, false);
    assert.equal(NEXORA_DATA_EDUCATION_BOUNDARY.ownsGuidedAttention, false);
    assert.equal(NEXORA_DATA_EDUCATION_BOUNDARY.autoOpensData, false);
    assert.equal(NEXORA_DATA_EDUCATION_BOUNDARY.semanticWriter, "applyCsvSemanticClarification");
    assert.equal(NEXORA_GUIDED_ATTENTION_RESERVED.implemented, false);
    assert.doesNotMatch(educationSource(), /applyCsvSemanticClarification\(|saveCsvImportCandidate\(/);
  });

  it("Proof A — ENT:5 review continues into Data education", () => {
    const source = atDataSource();
    assert.equal(attentionEducationOf(source.nextEntranceSession).state, "COMPLETED");
    assert.equal(dataEducationOf(source.nextEntranceSession).state, "SOURCE");
    assert.match(source.nexoraMessage.text, /evidence about the real situation|where my understanding/i);
    assert.equal(
      source.nexoraMessage.suggestedActions?.some((action) => action.kind === "answer"),
      true,
    );
    assertNoBusinessTruth(source);
  });

  it("Proof B — Guided Attention to Data does not auto-open", () => {
    const located = run("Where is Data?", atDataSource());
    assert.equal(located.guidedAttention?.presentation?.target, "DATA_ENTRY");
    assert.equal(located.shouldCommitRuntime, false);
    assert.match(located.nexoraMessage.text, /use data/i);
  });

  it("Proof C/E — Use my CSV narrates the real flow without a chooser", () => {
    const own = run("Use my CSV", atDataSource());
    assert.match(own.nexoraMessage.text, /won.t open the file chooser/i);
    assert.match(own.nexoraMessage.text, /pending|accepted evidence/i);
    assert.equal(own.guidedAttention?.pendingOfferTarget, "DATA_ENTRY");
  });

  it("Proof D/example isolation — example is marked and not stored", () => {
    resetCsvRealDataImportStoreForTests();
    const example = atExample();
    assert.equal(dataEducationOf(example.nextEntranceSession).examplePath, true);
    assert.match(example.nexoraMessage.text, /example data/i);
    assert.match(example.nexoraMessage.text, /not your business library|accepted evidence/i);
    assert.equal(listCsvRealDataImports("overview").length, 0);
  });

  it("Proof F — UNKNOWN value field is not invented", () => {
    const unknown = run("What does value mean?", atExample());
    assert.match(unknown.nexoraMessage.text, /don.t have enough information/i);
    assert.doesNotMatch(unknown.nexoraMessage.text, /\blikely represents backlog\b/i);
  });

  it("Proof G — likely/ambiguous fields stay provisional", () => {
    const otd = run("What does OTD mean?", atExample());
    assert.match(otd.nexoraMessage.text, /likely|candidate|plausible|not confirmed/i);
    const cap = run("What does CAP_AV mean?", atExample());
    assert.match(cap.nexoraMessage.text, /likely|candidate|plausible|not confirmed/i);
  });

  it("Proof H — confirmation writer remains applyCsvSemanticClarification", () => {
    const csv = "DT,ORD_QTY,OTD,CAP_AV,BKL\n2026-05-01,1310,89.8,805,280";
    const parse = parseCsvDeterministically(csv);
    const input: CsvVerticalSliceInput = Object.freeze({
      workspaceId: "overview",
      fileName: "data-ux3-update.csv",
      fileSize: csv.length,
      csvText: csv,
      importId: "proof-h",
      importedAt: "2026-05-01T00:00:00.000Z",
    });
    const review = interpretCsvSemantics({
      input,
      parse,
      structural: suggestCsvColumnMappings(parse.columns, input.importId),
    });
    const field = review.mappings.find((entry) => entry.sourceColumn === "OTD")!;
    const written = applyCsvSemanticClarification(review, field.semantic!.fieldId, "Yes.");
    assert.equal(written.review.mappings.find((entry) => entry.sourceColumn === "OTD")?.semantic?.confirmationSource, "manager");
    assert.doesNotMatch(educationSource(), /applyCsvSemanticClarification\(/);
  });

  it("Proof I — correction is described as source-local, not ENT-owned", () => {
    const result = run("No, it means capacity already used", atExample());
    assert.match(result.nexoraMessage.text, /correct|existing Data conversation/i);
    assert.equal(listCsvRealDataImports("overview").length, 0);
  });

  it("Proof J — I don't know stays unresolved", () => {
    const result = run("I don't know", atExample());
    assert.match(result.nexoraMessage.text, /unresolved rather than guessing/i);
  });

  it("Proof K — Why are you asking?", () => {
    const result = run("Why are you asking?", atExample());
    assert.match(result.nexoraMessage.text, /rather confirm|than guess/i);
  });

  it("Proof L — Evidence is not cause", () => {
    const result = run(
      "If delivery is late and capacity is low, does that prove capacity caused the delay?",
      atExample(),
    );
    assert.match(result.nexoraMessage.text, /does not establish cause/i);
  });

  it("Proof M — Data is not Decision", () => {
    const result = run("If the data looks bad, will Nexora make the Decision?", atExample());
    assert.match(result.nexoraMessage.text, /commits to a Decision|remain the one/i);
    assert.equal(result.nextEntranceSession?.decisionExperience, null);
  });

  it("Proof N — Data Object is not an executive Object", () => {
    const result = run("What is a Data Object?", atExample());
    assert.match(result.nexoraMessage.text, /not a Goal, Problem, Scenario, or Decision/i);
  });

  it("Proof O — source isolation remains on the canonical mapper", () => {
    const csv = "date,CAP_AV\n2026-08-01,820";
    const parse = parseCsvDeterministically(csv);
    const firstInput: CsvVerticalSliceInput = Object.freeze({
      workspaceId: "overview",
      fileName: "capacity.csv",
      fileSize: csv.length,
      csvText: csv,
      importId: "source-a",
      importedAt: "2026-08-01T00:00:00.000Z",
    });
    let first = interpretCsvSemantics({
      input: firstInput,
      parse,
      structural: suggestCsvColumnMappings(parse.columns, firstInput.importId),
    });
    const fieldId = first.mappings.find((entry) => entry.sourceColumn === "CAP_AV")!.semantic!.fieldId;
    first = applyCsvSemanticClarification(first, fieldId, "Yes.").review;
    const other = interpretCsvSemantics({
      input: { ...firstInput, fileName: "financial_capacity.csv", importId: "source-b" },
      parse,
      structural: suggestCsvColumnMappings(parse.columns, "source-b"),
      previousMapping: first,
    });
    assert.notEqual(
      other.mappings.find((entry) => entry.sourceColumn === "CAP_AV")?.semantic?.confirmationSource,
      "manager",
    );
  });

  it("Proof P — remove question does not remove", () => {
    const result = run("Can I remove this later?", atExample());
    assert.match(result.nexoraMessage.text, /ask before removal/i);
    assert.equal(listCsvRealDataImports("overview").length, 0);
  });

  it("Proof Q — unrelated conversation is not hijacked", () => {
    const source = atDataSource();
    assert.equal(
      shouldNexoraDataEducationOwnUtterance(source.nextEntranceSession, "What is a Problem?"),
      false,
    );
    const result = run("What is a Problem?", source);
    assert.match(result.nexoraMessage.text, /problem/i);
    assert.doesNotMatch(result.nexoraMessage.text, /example data from a certified/i);
  });

  it("Proof R — skip education does not write Data Reality", () => {
    resetCsvRealDataImportStoreForTests();
    const skipped = run("Skip for now", atDataSource());
    assert.equal(dataEducationOf(skipped.nextEntranceSession).state, "SKIPPED");
    assert.equal(listCsvRealDataImports("overview").length, 0);
    assertNoBusinessTruth(skipped);
  });

  it("Locate phrases stay on DIR:GA, not ENT", () => {
    const source = atDataSource();
    assert.equal(
      shouldNexoraGuidedEntranceOwnUtterance(source.nextEntranceSession, "How do I add my data?"),
      false,
    );
  });
});
