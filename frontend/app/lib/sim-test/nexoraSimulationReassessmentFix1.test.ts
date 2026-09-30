import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import path from "node:path";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { projectManagerObjectConversationalSubjects } from "../manager-object/managerObjectCatalog.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { speakRmsManagerThroughCc5, type RmsCc5Turn } from "../rms/rmsManagerCc5Adapter.ts";
import { SIM_TEST_8_JOURNEYS } from "./nexoraSimulationAdaptiveJourneys.ts";
import { runNexoraSimulationTestJourney } from "./nexoraSimulationTestHarness.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectManagerObjectConversationalSubjects(catalog);

type ExperienceTurn = ReturnType<typeof executeNexoraConversationalExperience>;

function run(utterance: string, previous?: ExperienceTurn): ExperienceTurn {
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
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    messageIdSeed: `st8-fix1-${utterance}`,
  });
}

function canonical(turn: ExperienceTurn | RmsCc5Turn): string | null {
  return turn.nextExecutiveContext?.currentSubject?.subjectId ?? null;
}

function inventedReassessmentName(text: string): boolean {
  return /is this still a/i.test(text);
}

test("T1 — Capacity remains the subject for “Is this still a problem?”", () => {
  const focused = run("Show the Capacity problem.");
  assert.equal(canonical(focused), "obj-capacity");
  const turn = run("Is this still a problem?", focused);
  assert.equal(canonical(turn), "obj-capacity");
  assert.equal(turn.intentResult.intent.kind, "explain");
  assert.equal(turn.intentResult.intent.targetHints.length, 0);
  assert.equal(inventedReassessmentName(turn.response), false);
  assert.equal(inventedReassessmentName(turn.nxaAdvisorContract?.referentName ?? ""), false);
  assert.match(turn.response, /Capacity/i);
});

test("T2 — action reassessment preserves Capacity", () => {
  const turn = run("Do I still need to act?", run("Show the Capacity problem."));
  assert.equal(canonical(turn), "obj-capacity");
  assert.equal(inventedReassessmentName(turn.response), false);
});

test("T3/T11 — decision reassessment preserves D1", () => {
  const turns = ["Status.", "Capacity. Details.", "Options.", "Go with B.", "Does this decision still make sense?"].reduce<
    RmsCc5Turn[]
  >((acc, utterance, index) => {
    acc.push(
      speakRmsManagerThroughCc5({
        utterance,
        previous: acc.at(-1) ?? null,
        messageIdSeed: `st8-fix1-d1-${index}`,
      }),
    );
    return acc;
  }, []);
  const committed = turns[3]!;
  const reassess = turns[4]!;
  const d1 = committed.decisionRuntime?.listDecisions() ?? [];
  const later = reassess.decisionRuntime?.listDecisions() ?? [];
  assert.equal(d1.length, 1);
  assert.equal(later.length, 1);
  assert.equal(later[0]?.decisionId, d1[0]?.decisionId);
  assert.equal(canonical(reassess), d1[0]?.decisionId);
  assert.equal(inventedReassessmentName(reassess.response), false);
});

test("T4 — risk reassessment keeps the same Risk identity", () => {
  const focused = run("Show Risk.");
  assert.equal(canonical(focused), "obj-risk");
  const turn = run("Is this risk still relevant?", focused);
  assert.equal(canonical(turn), "obj-risk");
  assert.equal(inventedReassessmentName(turn.response), false);
});

test("T5 — general reassessment keeps Capacity", () => {
  const turn = run("Has this changed?", run("Show the Capacity problem."));
  assert.equal(canonical(turn), "obj-capacity");
});

test("T6 — no current subject does not invent a name", () => {
  const turn = run("Is this still a problem?");
  assert.equal(canonical(turn), null);
  assert.equal(inventedReassessmentName(turn.response), false);
  assert.equal(turn.intentResult.intent.targetHints.length, 0);
  assert.ok(
    turn.managerObjectTurn.clarificationRequired === true ||
      /not sure|which|no current|don't have|do not have|unclear/i.test(turn.response),
  );
});

test("T7 — explicit named subject is not forced onto Capacity", () => {
  const focused = run("Show the Capacity problem.");
  assert.equal(canonical(focused), "obj-capacity");
  const turn = run("Is Delivery Risk still relevant?", focused);
  assert.equal(
    turn.intentResult.intent.kind === "situation" && turn.intentResult.intent.targetHints.length === 0,
    false,
  );
  assert.equal(inventedReassessmentName(turn.response), false);
  assert.match(turn.response, /Delivery/i);
});

test("T8 — named missing Problem is not rebound to Capacity", () => {
  const focused = run("Show the Capacity problem.");
  const shown = run("Show the Schedule problem.", focused);
  assert.ok(shown.intentResult.intent.kind === "focus" || shown.intentResult.intent.kind === "show-problems");
  assert.equal(inventedReassessmentName(shown.response), false);
  const named = run("The Schedule problem.", focused);
  assert.equal(named.intentResult.intent.kind, "focus");
  assert.equal(named.intentResult.intent.targetHints[0]?.raw, "schedule");
  assert.match(named.response, /Schedule/i);
  assert.match(named.response, /couldn't find|no clear match|not sure which/i);
});

test("T12 — certified short deictics stay deictic or clarifying", () => {
  const focused = run("Show the Capacity problem.");
  const why = run("Why?", focused);
  assert.equal(canonical(why), "obj-capacity");
  const showMe = run("Show me.", focused);
  assert.ok(showMe.managerObjectTurn.clarificationRequired || canonical(showMe) === "obj-capacity");
  const about = run("What about this?", focused);
  assert.equal(canonical(about), "obj-capacity");
});

test("T9 — hidden Ground Truth is not leaked on unpublished change", () => {
  const journey = SIM_TEST_8_JOURNEYS.find(
    (item) =>
      item.adaptiveFamily === "HIDDEN_CHANGE" &&
      item.scenarioId === "manufacturing-capacity-pressure" &&
      item.conversationLength === "short",
  )!;
  const report = runNexoraSimulationTestJourney({ journey, runId: "st8-fix1-t9" });
  assert.equal(
    report.journeyFindings.some((item) => item.classification.includes("GROUND_TRUTH_LEAK")),
    false,
  );
});

test("T10 — published recovery keeps Capacity identity", () => {
  const journey = SIM_TEST_8_JOURNEYS.find(
    (item) =>
      item.adaptiveFamily === "RECOVERY" &&
      item.scenarioId === "manufacturing-capacity-pressure" &&
      item.conversationLength === "short",
  )!;
  const report = runNexoraSimulationTestJourney({ journey, runId: "st8-fix1-t10" });
  const reassess = report.journeyObservations.find((row) => row.utterance === "Is this still a problem?")!;
  assert.equal(reassess.canonicalSubjectId, "obj-capacity");
  assert.equal(inventedReassessmentName(reassess.response), false);
  assert.equal(inventedReassessmentName(reassess.advisorReferentName ?? ""), false);
});

test("ST8-S2-REASSESS — original six Advisor rows no longer invent a named subject", () => {
  const artifact = JSON.parse(
    readFileSync(
      path.join(process.cwd(), "artifacts/sim-test/SIM-TEST-8/population-run.json"),
      "utf8",
    ),
  ) as {
    readonly records: readonly {
      readonly journeyId: string;
      readonly findings: readonly {
        readonly classification: string;
        readonly utterance: string;
        readonly response: string;
      }[];
    }[];
  };
  const originalIds = artifact.records
    .filter((record) =>
      record.findings.some(
        (finding) =>
          finding.utterance === "Is this still a problem?" &&
          inventedReassessmentName(finding.response),
      ),
    )
    .map((record) => record.journeyId);
  assert.equal(originalIds.length, 6);
  const journeys = SIM_TEST_8_JOURNEYS.filter((item) => originalIds.includes(item.journeyId));
  assert.equal(journeys.length, 6);
  let repaired = 0;
  for (const journey of journeys) {
    const report = runNexoraSimulationTestJourney({
      journey,
      runId: `st8-fix1-replay-${journey.journeyId}`,
    });
    const rows = report.journeyObservations.filter((row) => row.utterance === "Is this still a problem?");
    assert.ok(rows.length >= 1, journey.journeyId);
    for (const row of rows) {
      assert.equal(inventedReassessmentName(row.response), false, `${journey.journeyId} t${row.turn}`);
      assert.equal(inventedReassessmentName(row.advisorReferentName ?? ""), false, `${journey.journeyId} t${row.turn}`);
      if (row.canonicalSubjectId) {
        assert.equal(row.canonicalSubjectId, "obj-capacity", `${journey.journeyId} t${row.turn}`);
        assert.match(row.response, /Capacity/i, `${journey.journeyId} t${row.turn}`);
      }
      repaired += 1;
    }
  }
  assert.equal(journeys.length, 6);
  assert.ok(repaired >= 6, `repaired ${repaired}`);
});
