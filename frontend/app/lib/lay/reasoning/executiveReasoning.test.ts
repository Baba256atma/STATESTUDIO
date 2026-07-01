import assert from "node:assert/strict";
import test from "node:test";

import {
  EXECUTIVE_REASONING_CAPABILITY_REGISTRY,
  ExecutiveReasoningEngine,
  analyzeExecutiveReasoning,
  buildExecutiveReasoningChain,
  buildExecutiveReasoningExplanation,
  listExecutiveReasoningCapabilities,
  normalizeExecutiveReasoningContext,
  validateExecutiveReasoning,
} from "./executiveReasoningEngine.ts";
import type { ExecutiveReasoningInput, ExecutiveReasoningResult } from "./executiveReasoningEngine.ts";

function reasoningInput(): ExecutiveReasoningInput {
  return Object.freeze({
    sessionId: "reasoning:session:a",
    situation: "A neutral operating situation has cause, dependency, constraint, assumption, and trade-off signals.",
    objects: Object.freeze([
      Object.freeze({ id: "capacity", label: "Capacity", description: "Available execution capacity.", attributes: Object.freeze({}) }),
      Object.freeze({ id: "delivery", label: "Delivery", description: "Delivery throughput.", attributes: Object.freeze({}) }),
      Object.freeze({ id: "quality", label: "Quality", description: "Quality posture.", attributes: Object.freeze({}) }),
      Object.freeze({ id: "scope", label: "Scope", description: "Scope boundary.", attributes: Object.freeze({}) }),
    ]),
    relationships: Object.freeze([
      Object.freeze({ id: "rel:cause", fromId: "capacity", toId: "delivery", kind: "causes", evidence: "Capacity influences delivery throughput." }),
      Object.freeze({ id: "rel:dependency", fromId: "delivery", toId: "quality", kind: "dependsOn", evidence: "Quality depends on delivery stability." }),
      Object.freeze({ id: "rel:tradeoff", fromId: "scope", toId: "quality", kind: "tradesOffWith", evidence: "Scope breadth creates tension with quality depth." }),
      Object.freeze({ id: "rel:constraint", fromId: "capacity", toId: "scope", kind: "constrains", evidence: "Capacity constrains scope expansion." }),
    ]),
    assumptions: Object.freeze([
      Object.freeze({ id: "assumption:capacity", statement: "Capacity remains fixed.", appliesTo: Object.freeze(["capacity"]), impact: "Fixed capacity shapes downstream reasoning." }),
    ]),
    constraints: Object.freeze([
      Object.freeze({ id: "constraint:scope", statement: "Scope cannot expand without capacity.", appliesTo: Object.freeze(["scope", "capacity"]), consequence: "Scope reasoning must account for capacity limits." }),
    ]),
  });
}

function result(): ExecutiveReasoningResult {
  return analyzeExecutiveReasoning(reasoningInput());
}

test("performs causal reasoning", () => {
  const analysis = result();

  assert.equal(analysis.components.causalLinks.length, 1);
  assert.equal(analysis.components.causalLinks[0].fromId, "capacity");
  assert.equal(analysis.components.causalLinks[0].toId, "delivery");
});

test("performs dependency reasoning", () => {
  const analysis = result();

  assert.equal(analysis.components.dependencies.length, 1);
  assert.deepEqual(analysis.components.dependencies[0].path, ["delivery", "quality"]);
});

test("performs constraint reasoning", () => {
  const analysis = result();

  assert.equal(analysis.components.constraints.length, 1);
  assert.equal(analysis.components.constraints[0].id, "constraint:scope");
  assert.equal(analysis.chain.nodes.some((node) => node.id === "node:constraint:constraint:scope"), true);
});

test("performs assumption reasoning", () => {
  const analysis = result();

  assert.equal(analysis.components.assumptions.length, 1);
  assert.equal(analysis.components.assumptions[0].impact.includes("Fixed capacity"), true);
  assert.equal(analysis.chain.nodes.some((node) => node.id === "node:assumption:assumption:capacity"), true);
});

test("performs trade-off reasoning without ranking", () => {
  const analysis = result();

  assert.equal(analysis.components.tradeoffs.length, 1);
  assert.equal(analysis.components.tradeoffs[0].left, "scope");
  assert.equal(analysis.components.tradeoffs[0].right, "quality");
});

test("generates alternative reasoning paths without recommendations", () => {
  const analysis = result();

  assert.equal(analysis.components.alternatives.length, 2);
  assert.equal(analysis.components.alternatives.every((alternative) => alternative.explanation.includes("Alternative reasoning path")), true);
  assert.equal(analysis.explanation.narrative.includes("recommend"), false);
});

test("builds deterministic reasoning chains", () => {
  const session = normalizeExecutiveReasoningContext(reasoningInput());
  const analysis = result();
  const rebuilt = buildExecutiveReasoningChain(session, analysis.components);

  assert.equal(rebuilt.chainId, "chain:reasoning:session:a");
  assert.deepEqual(rebuilt.nodes.map((node) => node.id), analysis.chain.nodes.map((node) => node.id));
});

test("builds transparent explanations", () => {
  const analysis = result();
  const explanation = buildExecutiveReasoningExplanation(analysis.session, analysis.chain);

  assert.equal(explanation.why[0].startsWith("Why:"), true);
  assert.equal(explanation.because.every((entry) => entry.startsWith("Because:")), true);
  assert.equal(explanation.therefore[0].startsWith("Therefore:"), true);
});

test("validates reasoning result integrity", () => {
  const analysis = result();
  const validation = validateExecutiveReasoning(analysis);

  assert.equal(validation.valid, true);
  assert.deepEqual(validation.issues, []);
  assert.equal(analysis.validation.valid, true);
});

test("detects invalid references", () => {
  const invalid = analyzeExecutiveReasoning({
    ...reasoningInput(),
    relationships: Object.freeze([
      Object.freeze({ id: "rel:invalid", fromId: "missing", toId: "quality", kind: "causes", evidence: "Missing source." }),
    ]),
  });

  assert.equal(invalid.validation.valid, false);
  assert.equal(invalid.validation.issues.some((issue) => issue.code === "invalid_relationship_reference"), true);
});

test("publishes registry integrity", () => {
  const capabilities = listExecutiveReasoningCapabilities();

  assert.equal(capabilities.length, 7);
  assert.deepEqual(capabilities.map((capability) => capability.id), EXECUTIVE_REASONING_CAPABILITY_REGISTRY.map((capability) => capability.id));
  assert.equal(new Set(capabilities.map((capability) => capability.id)).size, capabilities.length);
});

test("exports public APIs", () => {
  assert.equal(typeof ExecutiveReasoningEngine.analyzeExecutiveReasoning, "function");
  assert.equal(typeof ExecutiveReasoningEngine.buildExecutiveReasoningChain, "function");
  assert.equal(typeof ExecutiveReasoningEngine.buildExecutiveReasoningExplanation, "function");
  assert.equal(typeof ExecutiveReasoningEngine.validateExecutiveReasoning, "function");
  assert.equal(Object.isFrozen(ExecutiveReasoningEngine), true);
});

test("keeps context immutable and deterministically ordered", () => {
  const session = normalizeExecutiveReasoningContext({
    ...reasoningInput(),
    objects: Object.freeze([...reasoningInput().objects].reverse()),
  });

  assert.deepEqual(session.input.objects.map((object) => object.id), ["capacity", "delivery", "quality", "scope"]);
  assert.equal(Object.isFrozen(session), true);
  assert.equal(Object.isFrozen(session.input.objects), true);
});
