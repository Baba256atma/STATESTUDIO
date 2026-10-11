import assert from "node:assert/strict";
import test from "node:test";

import { readCanonicalHistoricalPresentation } from "../historical-truth/historicalTruthPresentation.ts";
import type { HistoricalObservationInput } from "../historical-truth/historicalTruthProjection.ts";
import { executiveAdvisoryPurposeOf } from "./conversationalIntentResolver.ts";
import {
  answerHistoricalConversation,
  HISTORICAL_CONVERSATION_QUERY_IDENTITY,
  type HistoricalConversationRead,
} from "./historicalConversationQuery.ts";

const NOW = "2026-10-11T12:00:00.000Z";
const OBSERVATIONS: readonly HistoricalObservationInput[] = Object.freeze([
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
  Object.freeze({
    observationId: "production-throughput",
    kpiId: "kpi.production.throughput",
    objectKey: "production",
    nexoraObjectId: "nexora.executive-operations.object.production",
    value: 12,
    unit: "u",
    observedAt: "2026-08-10T00:00:00.000Z",
  }),
]);

const read: HistoricalConversationRead = ({ subjectId, subjectLabel, range }) =>
  readCanonicalHistoricalPresentation({
    subjectId,
    subjectLabel,
    observations: OBSERVATIONS,
    decisions: [],
    executions: [],
    outcomeCaptures: [],
    learnings: [],
    range,
  });

function ask(
  utterance: string,
  subjectId: string | null = "obj-capacity",
  previousUtterance: string | null = null,
) {
  return answerHistoricalConversation({
    utterance,
    previousUtterance,
    subjectId,
    subjectLabel: subjectId === "obj-capacity" ? "Capacity" : "Revenue",
    anchorIso: NOW,
    read,
  });
}

test("TIMELINE-CONV:1 uses a distinct existing-router purpose", () => {
  assert.equal(
    HISTORICAL_CONVERSATION_QUERY_IDENTITY,
    "NPA-T TIMELINE-CONV:1/HistoricalConversationQuery",
  );
  assert.equal(executiveAdvisoryPurposeOf("what happened with capacity?"), "historical-query");
  assert.equal(executiveAdvisoryPurposeOf("show me capacity history"), "historical-query");
  assert.equal(executiveAdvisoryPurposeOf("revenue history please"), "historical-query");
  assert.equal(executiveAdvisoryPurposeOf("what was capacity in august?"), "historical-query");
  assert.equal(
    executiveAdvisoryPurposeOf("go back to the problem we discussed earlier"),
    "historical-review",
  );
  assert.equal(executiveAdvisoryPurposeOf("what is capacity now?"), null);
});

test("TIMELINE-CONV:1 historical matcher does not capture ordinary Decision, Execution, or clarification turns", () => {
  for (const utterance of [
    "This decision — is it still the active one?",
    "That option we compared earlier — remind me of the difference.",
    "Start it.",
    "Proceed.",
    "Yes, execute.",
  ]) {
    assert.equal(executiveAdvisoryPurposeOf(utterance), null, utterance);
  }
});

test("TIMELINE-CONV:1 direct Capacity membership equals canonical presentation", () => {
  const result = ask("What happened with Capacity?");
  const canonical = read({ subjectId: "obj-capacity", subjectLabel: "Capacity" });
  assert.equal(result.classification, "SUPPORTED_HISTORY");
  assert.deepEqual(
    result.facts.map((fact) => fact.projectionKey),
    canonical.timeline.map((fact) => fact.projectionKey),
  );
  assert.match(result.text, /87%/);
  assert.match(result.text, /25%/);
  assert.match(result.text, /2\.2222222222222223%/);
  assert.doesNotMatch(result.text, /Gap|Decision|Execution|throughput|12u/);
});

test("TIMELINE-CONV:1 August and last-month ranges use Executive Time semantics", () => {
  const august = ask("What happened with Capacity in August 2026?");
  assert.deepEqual(august.facts.map((fact) => fact.title), [
    "Capacity observed at 87%",
    "Capacity observed at 25%",
  ]);
  assert.deepEqual(
    ask("What was Capacity in August?").facts.map((fact) => fact.title),
    ["Capacity observed at 87%", "Capacity observed at 25%"],
  );
  const september = ask("What happened with Capacity last month?");
  assert.deepEqual(september.facts.map((fact) => fact.title), [
    "Capacity observed at 2.2222222222222223%",
  ]);
  assert.deepEqual(september.range, {
    from: "2026-09-01T00:00:00.000Z",
    to: "2026-09-30T23:59:59.999Z",
  });
});

test("TIMELINE-CONV:1 empty subject differs from outside-period", () => {
  const revenue = ask("What happened with Revenue?", "obj-revenue");
  assert.equal(revenue.classification, "NO_SUPPORTED_HISTORY");
  assert.equal(revenue.text, "No supported history yet.");
  const week = ask("What happened with Capacity this week?");
  assert.equal(week.classification, "NO_SUPPORTED_HISTORY_IN_PERIOD");
  assert.equal(week.text, "No supported history in this period.");
});

test("TIMELINE-CONV:1 first/latest/before/after use placeable canonical ordering", () => {
  assert.deepEqual(ask("What was the first Capacity observation?").facts.map((f) => f.title), [
    "Capacity observed at 87%",
  ]);
  assert.deepEqual(ask("What is the latest Capacity observation?").facts.map((f) => f.title), [
    "Capacity observed at 2.2222222222222223%",
  ]);
  assert.deepEqual(
    ask("What happened before the latest Capacity observation?").facts.map((f) => f.title),
    ["Capacity observed at 87%", "Capacity observed at 25%"],
  );
  assert.deepEqual(
    ask("What happened after the 87% observation?").facts.map((f) => f.title),
    ["Capacity observed at 25%", "Capacity observed at 2.2222222222222223%"],
  );
});

test("TIMELINE-CONV:1 ambiguity and unsupported chronology never fabricate boundaries", () => {
  assert.equal(ask("What happened with it?", null).classification, "AMBIGUOUS_SUBJECT");
  assert.equal(ask("What happened recently?").classification, "AMBIGUOUS_TIME");
  assert.equal(
    ask("What happened before that?", "obj-capacity", "What happened with Capacity?").classification,
    "AMBIGUOUS_TIME",
  );
  for (const utterance of [
    "When was Capacity first identified as a problem?",
    "When was this scenario reviewed?",
    "When was this outcome evaluated?",
    "When did Nexora learn this?",
  ]) {
    assert.equal(ask(utterance).classification, "UNSUPPORTED_HISTORICAL_TIME");
  }
});

test("TIMELINE-CONV:1 chronology does not establish causation", () => {
  for (const utterance of [
    "Why did Capacity fall?",
    "Did our Decision cause Capacity to drop?",
    "Did execution fix Capacity?",
    "Was the 25% reading caused by our action?",
  ]) {
    const result = ask(utterance);
    assert.equal(result.classification, "CAUSATION_NOT_ESTABLISHED");
    assert.match(result.text, /not.*caus|does not have certified causal/i);
    assert.equal(result.facts.length, 0);
  }
});

test("TIMELINE-CONV:1 skeptical follow-up exposes bounded provenance only", () => {
  const result = ask("How do you know?");
  assert.equal(result.classification, "SUPPORTED_HISTORY");
  assert.match(result.text, /Data Reality/);
  assert.match(result.text, /not inferred causation/);
  assert.doesNotMatch(result.text, /cmsi:/);
  assert.ok(result.provenance.every((entry) => !entry.includes("production-throughput")));
});
