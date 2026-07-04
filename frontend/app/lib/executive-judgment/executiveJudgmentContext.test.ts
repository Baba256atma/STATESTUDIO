import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  ExecutiveJudgmentContextEngine,
  buildExecutiveJudgmentSnapshot,
  createExecutiveJudgmentContext,
  getExecutiveJudgmentContextRegistry,
  normalizeExecutiveJudgmentContext,
  validateExecutiveJudgmentContext,
  type ExecutiveJudgmentContextItem,
} from "./executiveJudgmentContextEngine.ts";

function item(id: string, label: string, references: readonly string[] = Object.freeze([])): ExecutiveJudgmentContextItem {
  return Object.freeze({
    id,
    label,
    description: `${label} metadata.`,
    source: "test",
    references: Object.freeze([...references]),
    metadataOnly: true,
  });
}

test("creates executive judgment context", () => {
  const context = createExecutiveJudgmentContext();
  assert.equal(context.baseContext.contextId, "executive-judgment-context");
  assert.equal(context.identity.length, 1);
  assert.equal(context.intent.length, 1);
  assert.equal(context.reasoningMetadata.length, 1);
  assert.equal(context.metadataOnly, true);
});

test("normalizes context structures", () => {
  const context = normalizeExecutiveJudgmentContext({
    contextId: " context-a ",
    workspaceId: " workspace-a ",
    scopeTags: Object.freeze(["z", "a"]),
    objects: Object.freeze([item(" object.b ", " Object B "), item("object.a", "Object A")]),
  });
  assert.equal(context.baseContext.contextId, "context-a");
  assert.deepEqual(context.baseContext.scopeTags, ["a", "z"]);
  assert.deepEqual(context.objects.map((entry) => entry.id), ["object.a", "object.b"]);
});

test("validates complete context", () => {
  const validation = validateExecutiveJudgmentContext(createExecutiveJudgmentContext());
  assert.equal(validation.valid, true);
  assert.equal(validation.issues.length, 0);
});

test("removes duplicate identifiers", () => {
  const context = createExecutiveJudgmentContext({
    availableEvidence: Object.freeze([
      item("evidence.1", "Evidence 1", Object.freeze(["b", "a", "a"])),
      item("evidence.1", "Evidence 1 Duplicate"),
      item("evidence.2", "Evidence 2"),
    ]),
  });
  assert.deepEqual(context.availableEvidence.map((entry) => entry.id), ["evidence.1", "evidence.2"]);
  assert.deepEqual(context.availableEvidence[0]?.references, ["a", "b"]);
});

test("builds immutable snapshot", () => {
  const context = createExecutiveJudgmentContext({ risks: Object.freeze([item("risk.1", "Risk")]) });
  const snapshot = buildExecutiveJudgmentSnapshot(context);
  assert.equal(snapshot.contextId, "executive-judgment-context");
  assert.equal(snapshot.sectionCount, 18);
  assert.equal(snapshot.validation.valid, true);
  assert.equal(Object.isFrozen(snapshot), true);
});

test("exports public APIs through engine facade", () => {
  assert.equal(typeof ExecutiveJudgmentContextEngine.createExecutiveJudgmentContext, "function");
  assert.equal(typeof ExecutiveJudgmentContextEngine.validateExecutiveJudgmentContext, "function");
  assert.equal(typeof ExecutiveJudgmentContextEngine.normalizeExecutiveJudgmentContext, "function");
  assert.equal(typeof ExecutiveJudgmentContextEngine.buildExecutiveJudgmentSnapshot, "function");
  assert.equal(typeof ExecutiveJudgmentContextEngine.getExecutiveJudgmentContextRegistry, "function");
});

test("publishes registry integrity", () => {
  const registry = getExecutiveJudgmentContextRegistry();
  assert.equal(registry.registryId, "executive-judgment-context-registry");
  assert.equal(registry.sections.length, 18);
  assert.equal(registry.sections.filter((entry) => entry.required).length, 5);
  assert.equal(registry.compatiblePlatforms.includes("Reasoning Platform"), true);
});

test("produces deterministic output", () => {
  const left = buildExecutiveJudgmentSnapshot(createExecutiveJudgmentContext({ objects: Object.freeze([item("object.1", "Object")]) }));
  const right = buildExecutiveJudgmentSnapshot(createExecutiveJudgmentContext({ objects: Object.freeze([item("object.1", "Object")]) }));
  assert.equal(left.fingerprint, right.fingerprint);
});

test("contains no forbidden runtime behavior in source", () => {
  const sources = [
    readFileSync("app/lib/executive-judgment/executiveJudgmentContextEngine.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentContextBuilder.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentContextNormalizer.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentContextValidation.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentContextSnapshot.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentContextRegistry.ts", "utf8"),
  ].join(" ");

  assert.equal(sources.includes(" any"), false);
  assert.equal(sources.includes("Math.random"), false);
  assert.equal(sources.includes("Date."), false);
  assert.equal(sources.includes("calculate"), false);
  assert.equal(sources.includes("score"), false);
  assert.equal(sources.includes("rank"), false);
  assert.equal(sources.includes("call LLM"), false);
});
