import assert from "node:assert/strict";
import test from "node:test";

import { resolveSemanticCandidates } from "./semanticCandidateIntelligence.ts";

test("DATA-ADV:2 separates authoritative, manager-confirmed, candidate, ambiguous, and unknown meaning", () => {
  const authoritative = resolveSemanticCandidates({ term: "currentRevenue", sourceLabel: "finance.csv", confirmedMeaning: "Current Revenue", confirmationSource: "authoritative-mapping" });
  assert.equal(authoritative.state, "AUTHORITATIVE");
  assert.equal(authoritative.requiresConfirmation, false);
  const manager = resolveSemanticCandidates({ term: "CAP_AV", sourceLabel: "plant.csv", confirmedMeaning: "Capacity Availability", confirmationSource: "manager" });
  assert.equal(manager.state, "MANAGER_CONFIRMED");
  const likely = resolveSemanticCandidates({ term: "ORD_QTY", sourceLabel: "orders.csv" });
  assert.equal(likely.state, "LIKELY");
  assert.equal(likely.candidates[0]?.meaning, "Order Quantity");
  const ambiguous = resolveSemanticCandidates({ term: "CAP_AV", sourceLabel: "production.csv", neighboringConfirmedMeanings: ["Used Capacity"] });
  assert.equal(ambiguous.state, "AMBIGUOUS");
  assert.deepEqual(ambiguous.candidates.map((candidate) => candidate.meaning), ["Available Capacity", "Capacity Availability"]);
  assert.equal(ambiguous.candidates.some((candidate) => candidate.meaning === "Actual Value"), false);
  const unknown = resolveSemanticCandidates({ term: "X7_R", sourceLabel: "opaque.csv" });
  assert.equal(unknown.state, "UNKNOWN");
  assert.equal(unknown.candidates.length, 0);
});

test("DATA-ADV:2 context changes AV reasoning and supports general business/project terms", () => {
  const finance = resolveSemanticCandidates({ term: "AV", sourceLabel: "finance_budget.csv", domain: "finance", neighboringConfirmedMeanings: ["Budget"] });
  assert.equal(finance.state, "LIKELY");
  assert.equal(finance.candidates[0]?.meaning, "Actual Value");
  assert.equal(resolveSemanticCandidates({ term: "grossMarginPct", sourceLabel: "business.csv" }).candidates[0]?.meaning, "Gross Margin Percent");
  assert.equal(resolveSemanticCandidates({ term: "SCH_VAR", sourceLabel: "project.csv" }).candidates[0]?.meaning, "Schedule Variance");
  assert.equal(resolveSemanticCandidates({ term: "availcapacity", sourceLabel: "operations.csv" }).state, "AMBIGUOUS");
  assert.equal(resolveSemanticCandidates({ term: "capacityAvail", sourceLabel: "operations.csv" }).state, "AMBIGUOUS");
  assert.equal(resolveSemanticCandidates({ term: "A1B2", sourceLabel: "project.csv" }).state, "UNKNOWN");
});

test("DATA-ADV:2 resolver is read-only and its explanation names only returned evidence", () => {
  const input = Object.freeze({ term: "REV_VAR", sourceLabel: "finance.csv", domain: "finance", neighboringConfirmedMeanings: Object.freeze(["Current Revenue"]) });
  const before = JSON.stringify(input);
  const result = resolveSemanticCandidates(input);
  assert.equal(JSON.stringify(input), before);
  assert.equal(result.state, "LIKELY");
  assert.match(result.explanation, /term structure/i);
  assert.match(result.explanation, /context|neighbor/i);
  assert.equal(Object.isFrozen(result), true);
});
