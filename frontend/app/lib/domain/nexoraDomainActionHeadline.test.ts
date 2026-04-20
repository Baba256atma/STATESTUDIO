/**
 * B.45 — Action headline from B.44 items.
 */

import test from "node:test";
import assert from "node:assert/strict";

import { buildDomainActionHeadline } from "./nexoraDomainActionHeadline.ts";
import type { NexoraDomainActionItem } from "./nexoraDomainActionExtraction.ts";

const item = (partial: Partial<NexoraDomainActionItem> & Pick<NexoraDomainActionItem, "domainId" | "priority">): NexoraDomainActionItem => ({
  title: partial.title ?? "Do something",
  description: partial.description ?? "Reason.",
  ...partial,
});

test("no actions", () => {
  const h = buildDomainActionHeadline([]);
  assert.equal(h.headline, "No immediate action required.");
  assert.equal(h.hint, undefined);
});

test("single action", () => {
  const h = buildDomainActionHeadline([
    item({ domainId: "retail", priority: "high", title: "Improve domain mapping" }),
  ]);
  assert.equal(h.headline, "Focus: Improve domain mapping in retail.");
  assert.ok(h.hint?.includes("mapping") || h.hint?.includes("vocabulary"));
});

test("critical priority (multiple)", () => {
  const h = buildDomainActionHeadline([
    item({ domainId: "supply_chain", priority: "critical", title: "Fix QA" }),
    item({ domainId: "retail", priority: "high", title: "Map" }),
  ]);
  assert.equal(h.headline, "Critical: fix supply_chain domain issues.");
  assert.equal(h.hint, "Complete QA coverage.");
});

test("high priority (multiple)", () => {
  const h = buildDomainActionHeadline([
    item({ domainId: "retail", priority: "high", title: "Improve domain mapping" }),
    item({ domainId: "finance", priority: "medium", title: "Visibility" }),
  ]);
  assert.equal(h.headline, "Focus: reduce fallback in retail.");
  assert.ok(h.hint?.includes("mapping"));
});

test("medium priority (multiple)", () => {
  const h = buildDomainActionHeadline([
    item({ domainId: "finance", priority: "medium", title: "Increase domain visibility" }),
    item({ domainId: "z", priority: "low", title: "Dev" }),
  ]);
  assert.equal(h.headline, "Improve usage of finance domain.");
  assert.ok(h.hint?.includes("prompts"));
});

test("low priority (multiple)", () => {
  const h = buildDomainActionHeadline([
    item({ domainId: "alpha", priority: "low", title: "Keep in dev testing" }),
    item({ domainId: "beta", priority: "low", title: "x" }),
  ]);
  assert.equal(h.headline, "Continue improving alpha domain.");
  assert.ok(h.hint?.includes("dev") || h.hint?.includes("pilot"));
});

test("deterministic output", () => {
  const actions = [
    item({ domainId: "retail", priority: "high", title: "Improve domain mapping" }),
    item({ domainId: "finance", priority: "medium", title: "Increase domain visibility" }),
  ];
  assert.deepEqual(buildDomainActionHeadline(actions), buildDomainActionHeadline(actions));
});
