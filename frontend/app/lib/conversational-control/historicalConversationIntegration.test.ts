import assert from "node:assert/strict";
import test from "node:test";

import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { readCanonicalHistoricalPresentation } from "../historical-truth/historicalTruthPresentation.ts";
import type { HistoricalObservationInput } from "../historical-truth/historicalTruthProjection.ts";
import { executeNexoraConversationalExperience } from "./conversationalExperienceOrchestrator.ts";
import { executiveAdvisoryPurposeOf } from "./conversationalIntentResolver.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "./conversationalSubjectRegistry.ts";
import type { HistoricalConversationRead } from "./historicalConversationQuery.ts";

const NOW = "2026-10-11T12:00:00.000Z";
const observations: readonly HistoricalObservationInput[] = Object.freeze([
  Object.freeze({
    observationId: "capacity-87",
    kpiId: "kpi.production.capacity-utilization",
    objectKey: "production",
    nexoraObjectId: "nexora.executive-operations.object.production",
    value: 87,
    unit: "%",
    observedAt: "2026-08-10T00:00:00.000Z",
  }),
  Object.freeze({
    observationId: "capacity-25",
    kpiId: "kpi.production.capacity-utilization",
    objectKey: "production",
    nexoraObjectId: "nexora.executive-operations.object.production",
    value: 25,
    unit: "%",
    observedAt: "2026-08-21T11:29:00.000Z",
  }),
  Object.freeze({
    observationId: "capacity-222",
    kpiId: "kpi.production.capacity-utilization",
    objectKey: "production",
    nexoraObjectId: "nexora.executive-operations.object.production",
    value: 2.2222222222222223,
    unit: "%",
    observedAt: "2026-09-01T21:34:00.000Z",
  }),
]);

const historicalRead: HistoricalConversationRead = ({ subjectId, subjectLabel, range }) =>
  readCanonicalHistoricalPresentation({
    subjectId,
    subjectLabel,
    observations,
    decisions: [],
    executions: [],
    outcomeCaptures: [],
    learnings: [],
    range,
  });

type Turn = ReturnType<typeof executeNexoraConversationalExperience>;

function run(
  utterance: string,
  previous?: Turn,
  participant?: { calls: number },
  reader: HistoricalConversationRead | null = historicalRead,
) {
  const runtimeState = previous?.nextRuntimeState ??
    createInitialNexoraMVPObjectInteractionState({
      workspace: "overview",
      presentationState: "minimum",
      environmentIntent: "neutral",
    });
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext ?? Object.freeze({
      currentSubjectId: null,
      previousSubjectIds: Object.freeze([] as string[]),
    }),
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState,
    catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    previousUtterance: previous?.managerMessage.text ?? null,
    historicalAnchorIso: reader ? NOW : undefined,
    historicalRead: reader,
    llmParticipant: participant
      ? Object.freeze({
          contribute() {
            participant.calls += 1;
            return Object.freeze({ contribution: "Unsupported provider wording." });
          },
        })
      : null,
    messageIdSeed: `timeline-conv-${utterance}`,
  });
}

test("TIMELINE-CONV:1 live CC path resolves Capacity and preserves canonical membership", () => {
  const before = JSON.stringify(observations);
  const result = run("What happened with Capacity?");
  assert.equal(executiveAdvisoryPurposeOf("what happened with capacity?"), "historical-query");
  assert.equal(result.intentResult.intent.kind, "execution-status");
  assert.equal(result.managerObjectTurn.session.conversationContinuity?.activeSubjectId, "obj-capacity");
  assert.match(result.response, /87%/);
  assert.match(result.response, /25%/);
  assert.match(result.response, /2\.2222222222222223%/);
  assert.doesNotMatch(result.response, /Gap|Decision|Execution/);
  assert.equal(result.shouldCommitRuntime, false);
  assert.equal(JSON.stringify(observations), before);
});

test("TIMELINE-CONV:1 follow-up retains subject and resolves last month", () => {
  const first = run("What happened with Capacity?");
  const second = run("What about last month?", first);
  assert.equal(second.managerObjectTurn.session.conversationContinuity?.activeSubjectId, "obj-capacity");
  assert.match(second.response, /2\.2222222222222223%/);
  assert.doesNotMatch(second.response, /87%|25%/);
});

test("TIMELINE-CONV:1 ambiguous referent does not select the richest history", () => {
  const result = run("What happened with it?");
  assert.match(result.response, /Which subject do you mean\?/);
  assert.doesNotMatch(result.response, /87%/);
});

test("TIMELINE-CONV:1 subject switch has no fact leakage", () => {
  const capacity = run("What happened with Capacity?");
  const revenue = run("What about Revenue?", capacity);
  assert.equal(revenue.response, "No supported history yet.");
  assert.doesNotMatch(revenue.response, /87%|25%|2\.222/);
  const back = run("Back to Capacity.", revenue);
  assert.match(back.response, /87%/);
});

test("TIMELINE-CONV:1 historical follow-up does not hijack an ordinary subject switch", () => {
  const current = run("Focus on Capacity");
  const switchSubject = run("What about Revenue?", current);
  assert.notEqual(switchSubject.response, "No supported history yet.");
});

test("TIMELINE-CONV:1 historical truth is deterministic and provider independent", () => {
  const participant = { calls: 0 };
  const result = run("What happened with Capacity?", undefined, participant);
  assert.equal(participant.calls, 0);
  assert.equal(result.llmParticipantTurn?.status, "not-configured");
  assert.match(result.response, /87%/);
  assert.doesNotMatch(result.response, /Unsupported provider wording/);
});

test("TIMELINE-CONV:1 skeptical follow-up stays on the same bounded result", () => {
  const first = run("What happened with Capacity?");
  const skeptical = run("How do you know?", first);
  assert.match(skeptical.response, /Data Reality/);
  assert.match(skeptical.response, /not inferred causation/);
  assert.doesNotMatch(skeptical.response, /cmsi:/);
});

test("TIMELINE-CONV:1 reader presence is inert for the same ordinary Decision and Execution journey", () => {
  const journey = [
    "Focus on Capacity",
    "Show me the alternatives.",
    "Compare them.",
    "Let's go with option B.",
    "Start it.",
  ] as const;
  const execute = (reader: HistoricalConversationRead | null) => {
    let previous: Turn | undefined;
    return journey.map((utterance) => {
      previous = run(utterance, previous, undefined, reader);
      return Object.freeze({
        intent: previous.intentResult.intent.kind,
        clarification: previous.clarificationTurn.action,
        subject: previous.managerObjectTurn.session.conversationContinuity?.activeSubjectId ?? null,
        decisions: previous.decisionRuntime?.listDecisions().length ?? 0,
        executions: previous.executionRuntime?.listExecutions().length ?? 0,
      });
    });
  };
  assert.deepEqual(execute(null), execute(historicalRead));
});

test("TIMELINE-CONV:1 reader-off historical ask cannot expose fixture chronology or mutate lifecycle state", () => {
  const result = run("What happened with Capacity?", undefined, undefined, null);
  assert.doesNotMatch(result.response, /tl-capacity-gap|Capacity Gap identified|87%|25%|2\.222/);
  assert.equal(result.decisionRuntime?.listDecisions().length ?? 0, 0);
  assert.equal(result.executionRuntime?.listExecutions().length ?? 0, 0);
  assert.equal(result.shouldCommitRuntime, false);
});
