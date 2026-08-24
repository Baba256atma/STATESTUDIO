/**
 * CC:1 — Conversational Intent Foundation certification tests.
 */

import assert from "node:assert/strict";
import { test } from "node:test";

import {
  CONVERSATIONAL_INTENT_BOUNDARY,
  CONVERSATIONAL_INTENT_REASON,
  conversationalIntentFoundationArchitecturalRole,
  conversationalIntentFoundationIdentity,
  conversationalIntentFoundationNamespace,
  conversationalIntentFoundationVersion,
  getConversationalIntentFoundationIdentity,
  NEXORA_CONVERSATIONAL_INTENT_KINDS,
  type NexoraConversationalIntent,
} from "./conversationalIntent.ts";
import {
  isAmbiguousConversationalReference,
  normalizeNexoraConversationalUtterance,
} from "./conversationalIntentNormalization.ts";
import {
  resolveNexoraConversationalIntent,
  resolveNexoraConversationalIntentOnly,
} from "./conversationalIntentResolver.ts";

function resolve(utterance: string) {
  return resolveNexoraConversationalIntent({ utterance });
}

function assertNoObjectIdClaim(intent: NexoraConversationalIntent) {
  for (const hint of intent.targetHints) {
    assert.doesNotMatch(hint.raw, /^obj-/i);
    assert.doesNotMatch(hint.raw, /^decision-/i);
    assert.doesNotMatch(hint.raw, /^scenario-/i);
  }
  assert.ok(
    intent.reasons.includes(CONVERSATIONAL_INTENT_REASON.NO_CANONICAL_OBJECT_ID) ||
      intent.kind === "overview" ||
      intent.kind === "navigate-back" ||
      intent.kind === "navigate-forward" ||
      intent.kind === "prepare-context" ||
      intent.kind === "switch-workspace" ||
      intent.kind.startsWith("show-") ||
      intent.kind === "unknown" ||
      intent.requiresContext === true,
  );
}

// ─── Identity / boundary ────────────────────────────────────────────────────

test("CC:1 identity and architectural boundary", () => {
  const id = getConversationalIntentFoundationIdentity();
  assert.equal(id.id, "CC:1/ConversationalIntentFoundation");
  assert.equal(id.version, "1.0.0");
  assert.equal(
    id.namespace,
    "nexora.conversational-control.conversational-intent.foundation",
  );
  assert.equal(
    conversationalIntentFoundationArchitecturalRole,
    "ConversationalIntentInterpreterAuthority",
  );
  assert.equal(conversationalIntentFoundationIdentity, id.id);
  assert.equal(conversationalIntentFoundationVersion, id.version);
  assert.equal(conversationalIntentFoundationNamespace, id.namespace);

  assert.equal(CONVERSATIONAL_INTENT_BOUNDARY.executesIntent, false);
  assert.equal(CONVERSATIONAL_INTENT_BOUNDARY.mutatesRuntime, false);
  assert.equal(CONVERSATIONAL_INTENT_BOUNDARY.mutatesStage, false);
  assert.equal(CONVERSATIONAL_INTENT_BOUNDARY.mutatesDirector, false);
  assert.equal(CONVERSATIONAL_INTENT_BOUNDARY.resolvesCanonicalObjectIds, false);
  assert.equal(CONVERSATIONAL_INTENT_BOUNDARY.usesLlmOrExternalProvider, false);
  assert.equal(CONVERSATIONAL_INTENT_BOUNDARY.writesFocusSelectionOrCamera, false);
  assert.equal(CONVERSATIONAL_INTENT_BOUNDARY.phaseStopsAtCanonicalIntent, true);

  assert.ok(NEXORA_CONVERSATIONAL_INTENT_KINDS.includes("focus"));
  assert.ok(NEXORA_CONVERSATIONAL_INTENT_KINDS.includes("unknown"));
  assert.ok(NEXORA_CONVERSATIONAL_INTENT_KINDS.includes("navigate-forward"));
});

// ─── Normalization ──────────────────────────────────────────────────────────

test("normalization: casing, whitespace, punctuation, prefixes", () => {
  assert.equal(
    normalizeNexoraConversationalUtterance("  SHOW   REVENUE!! "),
    "show revenue",
  );
  assert.equal(
    normalizeNexoraConversationalUtterance("Focus on revenue"),
    "focus on revenue",
  );
  assert.equal(
    normalizeNexoraConversationalUtterance("Please show me Revenue."),
    "show me revenue",
  );
  assert.equal(
    normalizeNexoraConversationalUtterance("Could you focus on Capacity?"),
    "focus on capacity",
  );
  assert.equal(
    normalizeNexoraConversationalUtterance("What happens if we do nothing?"),
    "what happens if we do nothing",
  );
  assert.equal(
    normalizeNexoraConversationalUtterance("what happend if increase inventory"),
    "what happened if increase inventory",
  );
});

test("normalization does not invent semantic content", () => {
  const a = normalizeNexoraConversationalUtterance("Focus on Capacity");
  const b = normalizeNexoraConversationalUtterance("FOCUS ON CAPACITY");
  assert.equal(a, b);
  assert.equal(a, "focus on capacity");
});

test("ambiguous reference helper", () => {
  assert.equal(isAmbiguousConversationalReference("this"), true);
  assert.equal(isAmbiguousConversationalReference("that"), true);
  assert.equal(isAmbiguousConversationalReference("it"), true);
  assert.equal(isAmbiguousConversationalReference("this object"), true);
  assert.equal(isAmbiguousConversationalReference("Capacity"), false);
  assert.equal(isAmbiguousConversationalReference("risk object"), false);
});

// ─── Certification utterances ───────────────────────────────────────────────

test('cert: "take me to risk" and "show me the risk object" extract focus hints', () => {
  const take = resolve("take me to risk").intent;
  assert.equal(take.kind, "focus");
  assert.equal(take.targetHints[0]?.raw, "risk");

  const showObject = resolve("show me the risk object").intent;
  assert.equal(showObject.kind, "focus");
  assert.equal(showObject.targetHints[0]?.raw, "risk object");

  const explainThisObject = resolve("explain this object").intent;
  assert.equal(explainThisObject.kind, "explain");
  assert.equal(explainThisObject.requiresContext, true);
  assert.equal(explainThisObject.targetHints.length, 0);
});

test('cert: "Focus on Capacity" → focus + target hint', () => {
  const { intent } = resolve("Focus on Capacity");
  assert.equal(intent.kind, "focus");
  assert.equal(intent.requiresTarget, true);
  assert.equal(intent.requiresContext, false);
  assert.equal(intent.executionClass, "navigation");
  assert.equal(intent.source, "conversation");
  assert.equal(intent.targetHints[0]?.raw, "capacity");
  assert.ok(intent.confidence >= 0.9);
  assertNoObjectIdClaim(intent);
});

test('cert: "Show Revenue" / "Open Budget" → focus with lexical hints', () => {
  const show = resolve("Show Revenue").intent;
  assert.equal(show.kind, "focus");
  assert.equal(show.requiresTarget, true);
  assert.equal(show.targetHints[0]?.raw, "revenue");
  assert.equal(show.executionClass, "navigation");

  const open = resolve("Open Budget").intent;
  assert.equal(open.kind, "focus");
  assert.equal(open.targetHints[0]?.raw, "budget");
  assertNoObjectIdClaim(open);
});

test('cert: collection / related shows', () => {
  assert.equal(resolve("Show related objects").intent.kind, "show-related");
  assert.equal(resolve("Show the problems").intent.kind, "show-problems");
  assert.equal(resolve("Show scenarios").intent.kind, "show-scenarios");
  assert.equal(resolve("Show decisions").intent.kind, "show-decisions");
  assert.equal(resolve("Show execution").intent.kind, "show-execution");
  assert.equal(resolve("Show executions").intent.kind, "show-execution");

  for (const u of [
    "Show related objects",
    "Show the problems",
    "Show scenarios",
    "Show decisions",
    "Show execution",
    "Show executions",
  ]) {
    const intent = resolve(u).intent;
    assert.equal(intent.requiresTarget, false);
    assert.equal(intent.executionClass, "exploration");
    assert.equal(intent.targetHints.length, 0);
  }
});

test('cert: "Show goals"', () => {
  const intent = resolve("Show goals").intent;
  assert.equal(intent.kind, "show-goals");
  assert.equal(intent.executionClass, "exploration");
});

test('cert: compare / analyze / simulate', () => {
  const compare = resolve("Compare Revenue and Capacity").intent;
  assert.equal(compare.kind, "compare");
  assert.equal(compare.executionClass, "analysis");
  assert.equal(compare.requiresTarget, true);
  assert.equal(compare.targetHints.length, 2);
  assert.equal(compare.targetHints[0]?.raw, "revenue");
  assert.equal(compare.targetHints[1]?.raw, "capacity");
  assertNoObjectIdClaim(compare);

  const analyze = resolve("Analyze Revenue").intent;
  assert.equal(analyze.kind, "analyze");
  assert.equal(analyze.executionClass, "analysis");
  assert.equal(analyze.targetHints[0]?.raw, "revenue");

  const doNothing = resolve("What happens if we do nothing?").intent;
  assert.equal(doNothing.kind, "explore-scenario");
  assert.equal(doNothing.executionClass, "simulation");
  assert.equal(doNothing.requiresContext, true);
  assert.equal(doNothing.scenarioPayload?.operation, "do-nothing");

  const sim = resolve("Simulate this scenario").intent;
  assert.equal(sim.kind, "simulate");
  assert.equal(sim.requiresContext, true);
  assert.equal(sim.targetHints.length, 0);
});

test('cert: navigation — back / forward / overview', () => {
  const back = resolve("Go back").intent;
  assert.equal(back.kind, "navigate-back");
  assert.equal(back.requiresTarget, false);
  assert.equal(back.executionClass, "navigation");

  const forward = resolve("Go forward").intent;
  assert.equal(forward.kind, "navigate-forward");
  assert.equal(forward.executionClass, "navigation");

  const overview = resolve("Return to overview").intent;
  assert.equal(overview.kind, "overview");
  assert.equal(overview.requiresTarget, false);
  assert.equal(overview.executionClass, "navigation");

  const overview2 = resolve("Go back to overview").intent;
  assert.equal(overview2.kind, "overview");

  const allObjects = resolve("Show all objects").intent;
  assert.equal(allObjects.kind, "overview");
  assert.equal(allObjects.requiresTarget, false);
});

// ─── Ambiguity / unknown ────────────────────────────────────────────────────

test("ambiguous references require context and do not invent targets", () => {
  for (const u of ["Show me this", "Open it", "What about that?"]) {
    const { intent } = resolve(u);
    assert.equal(intent.requiresContext, true);
    assert.equal(intent.requiresTarget, true);
    assert.equal(intent.targetHints.length, 0);
    assert.ok(
      intent.reasons.includes(CONVERSATIONAL_INTENT_REASON.AMBIGUOUS_REFERENCE),
    );
    assert.notEqual(intent.kind, "unknown");
  }
});

test("unknown intent fails safely", () => {
  const { intent, trace } = resolve("Do something interesting");
  assert.equal(intent.kind, "unknown");
  assert.equal(intent.executionClass, "unknown");
  assert.equal(intent.requiresTarget, false);
  assert.equal(intent.targetHints.length, 0);
  assert.ok(intent.confidence < 0.5);
  assert.ok(
    intent.reasons.includes(CONVERSATIONAL_INTENT_REASON.UNKNOWN_UTTERANCE),
  );
  assert.equal(trace.finalKind, "unknown");
});

test("empty utterance is unknown", () => {
  assert.equal(resolve("").intent.kind, "unknown");
  assert.equal(resolve("   ").intent.kind, "unknown");
});

// ─── Determinism / serialization / purity ───────────────────────────────────

test("invariant A: same utterance → same canonical intent", () => {
  const samples = [
    "Focus on Capacity",
    "Show Revenue",
    "Compare Revenue and Capacity",
    "Do something interesting",
    "Show me this",
  ];
  for (const u of samples) {
    const a = resolve(u);
    const b = resolve(u);
    assert.deepEqual(a.intent, b.intent);
    assert.deepEqual(a.trace.finalKind, b.trace.finalKind);
    assert.deepEqual(a.trace.confidence, b.trace.confidence);
  }
});

test("invariant B: normalization variants preserve intent kind", () => {
  const variants = [
    "Focus on Capacity",
    "focus on capacity",
    "FOCUS ON CAPACITY",
    "  Focus on Capacity. ",
    "Please focus on Capacity",
  ];
  const kinds = variants.map((u) => resolve(u).intent.kind);
  assert.ok(kinds.every((k) => k === "focus"));
  const hints = variants.map((u) => resolve(u).intent.targetHints[0]?.raw);
  assert.ok(hints.every((h) => h === "capacity"));
});

test("invariant F: does not resolve canonical object IDs", () => {
  const intent = resolve("Focus on Revenue").intent;
  assert.equal(intent.targetHints[0]?.raw, "revenue");
  assert.notEqual(intent.targetHints[0]?.raw, "obj-revenue");
  assert.ok(
    intent.reasons.includes(CONVERSATIONAL_INTENT_REASON.NO_CANONICAL_OBJECT_ID),
  );
});

test("invariant K: intent contracts are serializable", () => {
  const { intent, trace } = resolve("Compare Revenue and Capacity");
  const intentJson = JSON.stringify(intent);
  const traceJson = JSON.stringify(trace);
  assert.deepEqual(JSON.parse(intentJson), intent);
  assert.deepEqual(JSON.parse(traceJson), {
    ...trace,
    // JSON round-trip preserves structure
    utterance: trace.utterance,
    normalizedUtterance: trace.normalizedUtterance,
    candidateKinds: [...trace.candidateKinds],
    finalKind: trace.finalKind,
    confidence: trace.confidence,
    reasons: [...trace.reasons],
    targetHints: trace.targetHints.map((h) => ({ ...h })),
    requiresContext: trace.requiresContext,
    requiresTarget: trace.requiresTarget,
  });
});

test("invariant C/D/E: resolution is pure — no runtime mutation surface", () => {
  const runtimeProbe = {
    focusedObjectId: "obj-capacity",
    selectedObjectId: "obj-capacity",
    camera: { x: 0, y: 0, z: 10 },
  };
  const before = JSON.stringify(runtimeProbe);
  resolve("Focus on Revenue");
  resolve("Return to overview");
  resolve("Go back");
  assert.equal(JSON.stringify(runtimeProbe), before);
  assert.equal(runtimeProbe.focusedObjectId, "obj-capacity");
});

test("resolveNexoraConversationalIntentOnly returns intent", () => {
  const intent = resolveNexoraConversationalIntentOnly({
    utterance: "Show the problems",
  });
  assert.equal(intent.kind, "show-problems");
  assert.equal(intent.source, "conversation");
});

test("observability trace carries reason codes", () => {
  const { trace } = resolve("Focus on Capacity");
  assert.equal(trace.utterance, "Focus on Capacity");
  assert.equal(trace.normalizedUtterance, "focus on capacity");
  assert.equal(trace.finalKind, "focus");
  assert.ok(trace.reasons.includes(CONVERSATIONAL_INTENT_REASON.NORMALIZED));
  assert.ok(trace.reasons.includes(CONVERSATIONAL_INTENT_REASON.MATCHED_FOCUS));
  assert.ok(trace.candidateKinds.includes("focus"));
});

test("LLM / provider boundary: module graph stays local", async () => {
  // Static boundary flags — CC:1 must remain offline-testable.
  assert.equal(CONVERSATIONAL_INTENT_BOUNDARY.usesLlmOrExternalProvider, false);

  // Production sources must not import provider SDKs (exclude *.test.ts).
  const fs = await import("node:fs");
  const path = await import("node:path");
  const dir = path.join(process.cwd(), "app/lib/conversational-control");
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"));
  for (const file of files) {
    const src = fs.readFileSync(path.join(dir, file), "utf8");
    assert.doesNotMatch(src, /\bfrom\s+["']openai["']/i);
    assert.doesNotMatch(src, /\bfrom\s+["']@anthropic/i);
    assert.doesNotMatch(src, /\bfrom\s+["']@ai-sdk/i);
    assert.doesNotMatch(src, /\bfrom\s+["']langchain/i);
    assert.doesNotMatch(src, /\bfetch\s*\(/);
  }
});

test("MO:1 object-aware why extracts the subject without encoding an object id", () => {
  const result = resolve("Why is Capacity critical?");
  assert.equal(result.intent.kind, "explain");
  assert.equal(result.intent.targetHints[0]?.raw, "capacity");
  assertNoObjectIdClaim(result.intent);
});

test("MO:1 connected / next-action / do-nothing remain generic CC intents", () => {
  assert.equal(resolve("What is connected?").intent.kind, "show-related");
  assert.equal(resolve("What can I do about this?").intent.kind, "recommend");
  assert.equal(resolve("What happens if I do nothing?").intent.kind, "explore-scenario");
  assert.equal(resolve("What decision is required?").intent.kind, "decision-status");
});
