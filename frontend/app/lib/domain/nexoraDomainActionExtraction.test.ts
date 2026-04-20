/**
 * B.44 — Domain action extraction + ticket formatting.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  extractDomainActionItems,
  formatDomainActionsAsTickets,
  summarizeTopDomainActions,
  type NexoraDomainActionItem,
} from "./nexoraDomainActionExtraction.ts";
import type { NexoraDomainAdoptionReview } from "./nexoraDomainAdoptionReview.ts";

function rev(
  domainId: string,
  status: NexoraDomainAdoptionReview["status"],
  issues: string[],
  recommendations: string[],
): NexoraDomainAdoptionReview {
  return {
    domainId,
    status,
    summary: "",
    issues,
    recommendations,
  };
}

test("unstable → critical priority", () => {
  const actions = extractDomainActionItems([
    rev("x", "unstable", ["QA coverage incomplete"], ["Fix domain QA coverage"]),
  ]);
  assert.equal(actions.length, 1);
  assert.equal(actions[0]?.priority, "critical");
});

test("fallback_heavy → high priority", () => {
  const actions = extractDomainActionItems([
    rev("retail", "fallback_heavy", [], ["Improve domain mapping"]),
  ]);
  assert.equal(actions[0]?.priority, "high");
  assert.ok(actions[0]?.title.includes("mapping") || actions[0]?.title.includes("Improve"));
});

test("underused → medium priority", () => {
  const actions = extractDomainActionItems([
    rev("finance", "underused", ["Low usage"], ["Increase domain visibility"]),
  ]);
  assert.equal(actions[0]?.priority, "medium");
});

test("experimental → low priority", () => {
  const actions = extractDomainActionItems([
    rev("z", "experimental", [], ["Keep in dev testing"]),
  ]);
  assert.equal(actions[0]?.priority, "low");
});

test("healthy domains are ignored", () => {
  const actions = extractDomainActionItems([
    rev("a", "healthy", [], ["No immediate action"]),
    rev("b", "healthy", [], ["No immediate action"]),
  ]);
  assert.equal(actions.length, 0);
});

test("max 3 actions enforced", () => {
  const reviews: NexoraDomainAdoptionReview[] = [
    rev("a", "experimental", [], ["r1"]),
    rev("b", "experimental", [], ["r2"]),
    rev("c", "experimental", [], ["r3"]),
    rev("d", "experimental", [], ["r4"]),
    rev("e", "experimental", [], ["r5"]),
  ];
  const actions = extractDomainActionItems(reviews);
  assert.equal(actions.length, 3);
});

test("deterministic order: severity first, then domainId", () => {
  const actions = extractDomainActionItems([
    rev("m", "experimental", [], ["e"]),
    rev("a", "experimental", [], ["e"]),
    rev("z", "experimental", [], ["e"]),
  ]);
  assert.deepEqual(
    actions.map((x) => x.domainId),
    ["a", "m", "z"],
  );
  const actions2 = extractDomainActionItems([
    rev("z", "unstable", [], ["u"]),
    rev("a", "unstable", [], ["u"]),
  ]);
  assert.deepEqual(
    actions2.map((x) => x.domainId),
    ["a", "z"],
  );
});

test("unstable sorts before experimental", () => {
  const actions = extractDomainActionItems([
    rev("a", "experimental", [], ["e"]),
    rev("b", "unstable", [], ["Fix domain QA coverage"]),
  ]);
  assert.deepEqual(
    actions.map((x) => x.domainId),
    ["b", "a"],
  );
});

test("summarizeTopDomainActions handles empty and critical", () => {
  assert.ok(summarizeTopDomainActions([]).includes("healthy"));
  const actions = extractDomainActionItems([
    rev("a", "unstable", [], ["Fix"]),
    rev("b", "unstable", [], ["Fix"]),
  ]);
  assert.ok(summarizeTopDomainActions(actions).includes("Critical"));
});

test("formatting includes priority tag and Reason line", () => {
  const actions: NexoraDomainActionItem[] = [
    {
      domainId: "retail",
      title: "Improve domain mapping",
      description: "High fallback rate detected.",
      priority: "high",
    },
  ];
  const text = formatDomainActionsAsTickets(actions);
  assert.ok(text.includes("Nexora Action Items"));
  assert.ok(text.includes("[HIGH] retail — Improve domain mapping"));
  assert.ok(text.includes("Reason: High fallback rate detected."));
});
