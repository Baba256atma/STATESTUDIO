/**
 * B.27 — Runbook step resolution (priority ordering).
 */

import test from "node:test";
import assert from "node:assert/strict";

import { resolveRunbookStep, type NexoraRunbookResolveInput } from "./nexoraRunbook.ts";

function r(partial: Partial<NexoraRunbookResolveInput>): NexoraRunbookResolveInput {
  return {
    pipelineStatus: "idle",
    centerCompareOpen: false,
    rightPanelCompareOpen: false,
    hasB7Decision: false,
    hasRecordedOutcome: false,
    ...partial,
  };
}

test("resolveRunbookStep: fresh user → input", () => {
  assert.equal(resolveRunbookStep(r({ pipelineStatus: "idle" })), "input");
});

test("resolveRunbookStep: after analysis (ready, no compare/decision/outcome) → analysis", () => {
  assert.equal(resolveRunbookStep(r({ pipelineStatus: "ready" })), "analysis");
});

test("resolveRunbookStep: compare panel open beats analysis", () => {
  assert.equal(
    resolveRunbookStep(
      r({
        pipelineStatus: "ready",
        centerCompareOpen: true,
      })
    ),
    "compare"
  );
});

test("resolveRunbookStep: B.7 present but compare open → compare", () => {
  assert.equal(
    resolveRunbookStep(
      r({
        pipelineStatus: "ready",
        centerCompareOpen: true,
        hasB7Decision: true,
      })
    ),
    "compare"
  );
});

test("resolveRunbookStep: decision when ready + B.7, no compare", () => {
  assert.equal(
    resolveRunbookStep(
      r({
        pipelineStatus: "ready",
        hasB7Decision: true,
      })
    ),
    "decision"
  );
});

test("resolveRunbookStep: recorded outcome → learn", () => {
  assert.equal(
    resolveRunbookStep(
      r({
        pipelineStatus: "ready",
        centerCompareOpen: true,
        hasB7Decision: true,
        hasRecordedOutcome: true,
      })
    ),
    "learn"
  );
});
