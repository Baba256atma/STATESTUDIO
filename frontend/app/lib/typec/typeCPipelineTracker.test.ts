import assert from "node:assert/strict";
import test from "node:test";
import { createTypeCPipelineEvent } from "./typeCPipelineTracker.ts";

test("createTypeCPipelineEvent creates event with step", () => {
  const event = createTypeCPipelineEvent({ step: "intent_detected" });
  assert.equal(event.step, "intent_detected");
});

test("createTypeCPipelineEvent includes timestamp", () => {
  const event = createTypeCPipelineEvent({ step: "object_added" });
  assert.equal(typeof event.timestamp, "string");
  assert.equal(Number.isNaN(Date.parse(event.timestamp)), false);
});

test("createTypeCPipelineEvent includes input if provided", () => {
  const event = createTypeCPipelineEvent({ step: "intent_detected", input: "add supplier" });
  assert.equal(event.input, "add supplier");
});

test("createTypeCPipelineEvent includes intentType if provided", () => {
  const event = createTypeCPipelineEvent({ step: "intent_detected", intentType: "add_object" });
  assert.equal(event.intentType, "add_object");
});

test("createTypeCPipelineEvent does not throw on empty input", () => {
  assert.doesNotThrow(() => createTypeCPipelineEvent());
  assert.equal(createTypeCPipelineEvent().step, "skipped");
});

test("createTypeCPipelineEvent creates unique-ish ids for multiple events", () => {
  const first = createTypeCPipelineEvent({ step: "skipped" });
  const second = createTypeCPipelineEvent({ step: "skipped" });
  assert.notEqual(first.id, second.id);
});
