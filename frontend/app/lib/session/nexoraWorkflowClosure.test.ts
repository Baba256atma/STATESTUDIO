/**
 * @import assert from "node:assert/strict";
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  evaluateWorkflowClosure,
  formatWorkflowClosure,
  type NexoraWorkflowClosure,
  type NexoraWorkflowClosureInput,
} from "./nexoraWorkflowClosure.ts";

describe("nexoraWorkflowClosure (B.49)", () => {
  it("full completion → completed", () => {
    const c = evaluateWorkflowClosure({
      hasAnalysis: true,
      hasDecision: true,
      hasOutcome: true,
      hasNextAction: true,
      hasFeedback: true,
    });
    assert.equal(c.status, "completed");
    assert.ok(c.summary.includes("Workflow completed"));
    assert.deepEqual(c.missingSteps, []);
  });

  it("no analysis → incomplete", () => {
    const c = evaluateWorkflowClosure({
      hasAnalysis: false,
      hasDecision: false,
      hasOutcome: false,
      hasNextAction: false,
    });
    assert.equal(c.status, "incomplete");
    assert.ok(c.summary.includes("Analysis has not been completed"));
    assert.deepEqual(c.missingSteps.sort(), ["analysis", "decision"].sort());
  });

  it("analysis without decision → incomplete", () => {
    const c = evaluateWorkflowClosure({
      hasAnalysis: true,
      hasDecision: false,
      hasOutcome: false,
      hasNextAction: true,
    });
    assert.equal(c.status, "incomplete");
    assert.ok(c.summary.includes("decision"));
    assert.deepEqual(c.missingSteps, ["decision"]);
  });

  it("analysis + decision but no outcome → needs_follow_up", () => {
    const c = evaluateWorkflowClosure({
      hasAnalysis: true,
      hasDecision: true,
      hasOutcome: false,
      hasNextAction: true,
    });
    assert.equal(c.status, "needs_follow_up");
    assert.ok(c.summary.includes("Outcome has not been recorded"));
    assert.deepEqual(c.missingSteps, ["outcome"]);
  });

  it("analysis + decision + outcome but no next action → needs_follow_up", () => {
    const c = evaluateWorkflowClosure({
      hasAnalysis: true,
      hasDecision: true,
      hasOutcome: true,
      hasNextAction: false,
    });
    assert.equal(c.status, "needs_follow_up");
    assert.ok(c.summary.includes("Next action"));
    assert.deepEqual(c.missingSteps, ["next_action"]);
  });

  it("deterministic output", () => {
    const input: NexoraWorkflowClosureInput = {
      hasAnalysis: true,
      hasDecision: true,
      hasOutcome: false,
      hasNextAction: false,
    };
    const a = evaluateWorkflowClosure(input);
    const b = evaluateWorkflowClosure(input);
    assert.deepEqual(a, b);
    assert.equal(formatWorkflowClosure(a), formatWorkflowClosure(b));
  });

  it("missing steps populated correctly for combined follow-up", () => {
    const c = evaluateWorkflowClosure({
      hasAnalysis: true,
      hasDecision: true,
      hasOutcome: false,
      hasNextAction: false,
    });
    assert.deepEqual(c.missingSteps.sort(), ["next_action", "outcome"].sort());
  });

  it("completed with explicit no feedback adds soft missing hint", () => {
    const c = evaluateWorkflowClosure({
      hasAnalysis: true,
      hasDecision: true,
      hasOutcome: true,
      hasNextAction: true,
      hasFeedback: false,
    });
    assert.equal(c.status, "completed");
    assert.deepEqual(c.missingSteps, ["feedback"]);
  });

  it("completed omits feedback hint when hasFeedback omitted", () => {
    const c = evaluateWorkflowClosure({
      hasAnalysis: true,
      hasDecision: true,
      hasOutcome: true,
      hasNextAction: true,
    });
    assert.deepEqual(c.missingSteps, []);
  });

  it("formatWorkflowClosure includes missing line when present", () => {
    const c: NexoraWorkflowClosure = {
      status: "needs_follow_up",
      summary: "Session needs follow-up. Outcome has not been recorded yet.",
      missingSteps: ["outcome"],
    };
    const t = formatWorkflowClosure(c);
    assert.ok(t.includes("Needs follow-up"));
    assert.ok(t.includes("Missing: outcome"));
  });
});
