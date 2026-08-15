/**
 * CC:2 — Executive Context Resolution certification tests.
 */

import assert from "node:assert/strict";
import { test } from "node:test";

import {
  CONVERSATIONAL_CONTEXT_BOUNDARY,
  CONVERSATIONAL_CONTEXT_REASON,
  conversationalContextResolutionArchitecturalRole,
  conversationalContextResolutionIdentity,
  conversationalContextResolutionNamespace,
  conversationalContextResolutionVersion,
  getConversationalContextResolutionIdentity,
  type NexoraConversationalSubjectRecord,
} from "./conversationalContext.ts";
import { resolveNexoraExecutiveConversationalContext } from "./conversationalContextResolver.ts";
import {
  freezeConversationalSubjectRecord,
  projectDefaultNexoraMvpConversationalSubjects,
} from "./conversationalSubjectRegistry.ts";
import { resolveNexoraConversationalIntent } from "./conversationalIntentResolver.ts";
import { CONVERSATIONAL_INTENT_BOUNDARY } from "./conversationalIntent.ts";

function subjectsWithGrowthAmbiguity(): readonly NexoraConversationalSubjectRecord[] {
  return Object.freeze([
    ...projectDefaultNexoraMvpConversationalSubjects(),
    freezeConversationalSubjectRecord({
      subjectId: "goal-growth",
      subjectKind: "goal",
      canonicalName: "Growth",
      aliases: Object.freeze(["growth"]),
      businessKey: "goal-growth",
    }),
    freezeConversationalSubjectRecord({
      subjectId: "scenario-growth",
      subjectKind: "scenario",
      canonicalName: "Growth",
      aliases: Object.freeze(["growth"]),
      businessKey: "scenario-growth",
    }),
  ]);
}

function resolveUtterance(
  utterance: string,
  opts?: {
    readonly conversationContext?: {
      readonly currentSubjectId?: string | null;
      readonly previousSubjectIds?: readonly string[];
    };
    readonly activeStageContext?: {
      readonly focusedSubjectId?: string | null;
      readonly selectedSubjectId?: string | null;
    };
    readonly allowActiveStageContext?: boolean;
    readonly executiveSubjects?: readonly NexoraConversationalSubjectRecord[];
  },
) {
  const { intent } = resolveNexoraConversationalIntent({ utterance });
  return {
    intent,
    ...resolveNexoraExecutiveConversationalContext({
      intent,
      targetHints: intent.targetHints,
      conversationContext: opts?.conversationContext ?? null,
      activeStageContext: opts?.activeStageContext ?? null,
      allowActiveStageContext: opts?.allowActiveStageContext === true,
      executiveSubjects:
        opts?.executiveSubjects ?? projectDefaultNexoraMvpConversationalSubjects(),
    }),
  };
}

// ─── Identity / boundary ────────────────────────────────────────────────────

test("CC:2 identity and architectural boundary", () => {
  const id = getConversationalContextResolutionIdentity();
  assert.equal(id.id, "CC:2/ExecutiveContextResolution");
  assert.equal(id.version, "1.0.0");
  assert.equal(
    id.namespace,
    "nexora.conversational-control.executive-context-resolution",
  );
  assert.equal(
    conversationalContextResolutionArchitecturalRole,
    "ConversationalContextResolverAuthority",
  );
  assert.equal(conversationalContextResolutionIdentity, id.id);
  assert.equal(conversationalContextResolutionVersion, id.version);
  assert.equal(conversationalContextResolutionNamespace, id.namespace);

  assert.equal(CONVERSATIONAL_CONTEXT_BOUNDARY.executesIntent, false);
  assert.equal(CONVERSATIONAL_CONTEXT_BOUNDARY.mutatesRuntime, false);
  assert.equal(CONVERSATIONAL_CONTEXT_BOUNDARY.mutatesStage, false);
  assert.equal(CONVERSATIONAL_CONTEXT_BOUNDARY.mutatesDirector, false);
  assert.equal(CONVERSATIONAL_CONTEXT_BOUNDARY.resolvesCanonicalObjectIds, true);
  assert.equal(CONVERSATIONAL_CONTEXT_BOUNDARY.synthesizesObjectIdsFromHints, false);
  assert.equal(CONVERSATIONAL_CONTEXT_BOUNDARY.usesLlmOrExternalProvider, false);
  assert.equal(CONVERSATIONAL_CONTEXT_BOUNDARY.ownsDurableConversationMemory, false);
  assert.equal(CONVERSATIONAL_CONTEXT_BOUNDARY.phaseStopsAtResolvedContext, true);

  // CC:1 still does not resolve IDs.
  assert.equal(CONVERSATIONAL_INTENT_BOUNDARY.resolvesCanonicalObjectIds, false);
});

// ─── Certification cases ────────────────────────────────────────────────────

test('cert: "Focus on Capacity" → obj-capacity', () => {
  const { intent, context } = resolveUtterance("Focus on Capacity");
  assert.equal(intent.kind, "focus");
  assert.equal(intent.targetHints[0]?.raw, "capacity");
  assert.equal(context.resolutionStatus, "resolved");
  assert.equal(context.primarySubject?.subjectId, "obj-capacity");
  assert.equal(context.primarySubject?.subjectKind, "object");
  assert.equal(context.primarySubject?.canonicalName, "Capacity");
  assert.equal(context.source, "explicit-hint");
  assert.ok(
    context.reasons.includes(CONVERSATIONAL_CONTEXT_REASON.EXPLICIT_TARGET_MATCH),
  );
  assert.ok(
    context.reasons.includes(CONVERSATIONAL_CONTEXT_REASON.NO_SYNTHESIZED_ID),
  );
});

test('cert: Show Revenue / Open Budget / Analyze Revenue', () => {
  assert.equal(
    resolveUtterance("Show Revenue").context.primarySubject?.subjectId,
    "obj-revenue",
  );
  assert.equal(
    resolveUtterance("Open Budget").context.primarySubject?.subjectId,
    "obj-budget",
  );
  assert.equal(
    resolveUtterance("Analyze Revenue").context.primarySubject?.subjectId,
    "obj-revenue",
  );
});

test('cert: Compare Revenue and Capacity preserves order', () => {
  const { context, trace } = resolveUtterance("Compare Revenue and Capacity");
  assert.equal(context.resolutionStatus, "resolved");
  assert.equal(context.primarySubject?.subjectId, "obj-revenue");
  assert.equal(context.secondarySubjects.length, 1);
  assert.equal(context.secondarySubjects[0]?.subjectId, "obj-capacity");
  assert.deepEqual(trace.finalSecondarySubjectIds, ["obj-capacity"]);
  assert.ok(
    context.reasons.includes(CONVERSATIONAL_CONTEXT_REASON.SUBJECT_ORDER_PRESERVED),
  );
});

test('cert: with active context obj-capacity — "Show its problems"', () => {
  const { intent, context } = resolveUtterance("Show its problems", {
    conversationContext: { currentSubjectId: "obj-capacity" },
  });
  assert.equal(intent.kind, "show-problems");
  assert.equal(intent.requiresContext, true);
  assert.equal(context.resolutionStatus, "resolved");
  assert.equal(context.primarySubject?.subjectId, "obj-capacity");
  assert.equal(context.source, "conversation-context");
  assert.ok(
    context.reasons.includes(
      CONVERSATIONAL_CONTEXT_REASON.RELATION_SCOPED_ANCHOR_ONLY,
    ),
  );
});

test('cert: with active context obj-budget — "What about this?"', () => {
  const { context } = resolveUtterance("What about this?", {
    conversationContext: { currentSubjectId: "obj-budget" },
  });
  assert.equal(context.resolutionStatus, "resolved");
  assert.equal(context.primarySubject?.subjectId, "obj-budget");
  assert.equal(context.source, "conversation-context");
});

test('cert: without context — "Open it" → missing-context', () => {
  const { context } = resolveUtterance("Open it");
  assert.equal(context.resolutionStatus, "missing-context");
  assert.equal(context.primarySubject, null);
  assert.ok(
    context.reasons.includes(
      CONVERSATIONAL_CONTEXT_REASON.MISSING_CONVERSATION_CONTEXT,
    ),
  );
});

test('cert: ambiguous "Open Growth"', () => {
  const { context, trace } = resolveUtterance("Open Growth", {
    executiveSubjects: subjectsWithGrowthAmbiguity(),
  });
  assert.equal(context.resolutionStatus, "ambiguous");
  assert.equal(context.primarySubject, null);
  assert.ok(trace.canonicalCandidates.includes("goal-growth"));
  assert.ok(trace.canonicalCandidates.includes("scenario-growth"));
  assert.ok(
    context.reasons.includes(
      CONVERSATIONAL_CONTEXT_REASON.MULTIPLE_CANONICAL_MATCHES,
    ),
  );
});

test('cert: unknown "Focus on Moon Department" → not-found', () => {
  const { context } = resolveUtterance("Focus on Moon Department");
  assert.equal(context.resolutionStatus, "not-found");
  assert.equal(context.primarySubject, null);
  assert.ok(
    context.reasons.includes(
      CONVERSATIONAL_CONTEXT_REASON.CANONICAL_SUBJECT_NOT_FOUND,
    ),
  );
});

test("relation-scoped explicit anchor: Show Capacity problems / scenarios related to Revenue", () => {
  const problems = resolveUtterance("Show Capacity problems");
  assert.equal(problems.intent.kind, "show-problems");
  assert.equal(problems.context.primarySubject?.subjectId, "obj-capacity");
  assert.ok(
    problems.context.reasons.includes(
      CONVERSATIONAL_CONTEXT_REASON.RELATION_SCOPED_ANCHOR_ONLY,
    ),
  );

  const scenarios = resolveUtterance("Show scenarios related to Revenue");
  assert.equal(scenarios.intent.kind, "show-scenarios");
  assert.equal(scenarios.context.primarySubject?.subjectId, "obj-revenue");
});

test("compare it with Revenue uses conversation context for primary", () => {
  const { intent, context } = resolveUtterance("Compare it with Revenue", {
    conversationContext: { currentSubjectId: "obj-capacity" },
  });
  assert.equal(intent.kind, "compare");
  assert.equal(intent.requiresContext, true);
  assert.equal(context.resolutionStatus, "resolved");
  assert.equal(context.primarySubject?.subjectId, "obj-capacity");
  assert.equal(context.secondarySubjects[0]?.subjectId, "obj-revenue");
});

test("explicit hint beats critical Stage attention / focus", () => {
  const { context } = resolveUtterance("Focus on Budget", {
    conversationContext: { currentSubjectId: "obj-capacity" },
    activeStageContext: {
      focusedSubjectId: "obj-capacity",
      selectedSubjectId: "obj-capacity",
    },
    allowActiveStageContext: true,
  });
  assert.equal(context.primarySubject?.subjectId, "obj-budget");
  assert.equal(context.source, "explicit-hint");
  assert.ok(
    context.reasons.includes(
      CONVERSATIONAL_CONTEXT_REASON.EXPLICIT_TARGET_PRECEDENCE,
    ),
  );
});

test("active Stage context only when permitted and conversation missing", () => {
  const denied = resolveUtterance("Open it", {
    activeStageContext: { focusedSubjectId: "obj-revenue" },
    allowActiveStageContext: false,
  });
  assert.equal(denied.context.resolutionStatus, "missing-context");

  const allowed = resolveUtterance("Open it", {
    activeStageContext: { focusedSubjectId: "obj-revenue" },
    allowActiveStageContext: true,
  });
  assert.equal(allowed.context.resolutionStatus, "resolved");
  assert.equal(allowed.context.primarySubject?.subjectId, "obj-revenue");
  assert.equal(allowed.context.source, "active-stage-context");
});

test("overview / navigate intents → not-required", () => {
  assert.equal(
    resolveUtterance("Return to overview").context.resolutionStatus,
    "not-required",
  );
  assert.equal(
    resolveUtterance("Go back").context.resolutionStatus,
    "not-required",
  );
  assert.equal(
    resolveUtterance("Show the problems").context.resolutionStatus,
    "not-required",
  );
});

test("alias match: sales revenue → obj-revenue", () => {
  const { context } = resolveUtterance("Focus on sales revenue");
  assert.equal(context.primarySubject?.subjectId, "obj-revenue");
});

test("never synthesizes obj- + hint", () => {
  const { context } = resolveUtterance("Focus on Moon Department");
  assert.equal(context.primarySubject, null);
  assert.notEqual(
    // Would be the illegal synthesis pattern:
    "obj-moon department",
    context.primarySubject?.subjectId,
  );
});

// ─── Invariants ─────────────────────────────────────────────────────────────

test("invariant A: same inputs → same resolved context", () => {
  const a = resolveUtterance("Focus on Capacity", {
    conversationContext: { currentSubjectId: "obj-budget" },
  });
  const b = resolveUtterance("Focus on Capacity", {
    conversationContext: { currentSubjectId: "obj-budget" },
  });
  assert.deepEqual(a.context, b.context);
  assert.deepEqual(a.trace.finalPrimarySubjectId, b.trace.finalPrimarySubjectId);
});

test("invariant B/C/D/E: pure — no runtime mutation surface", () => {
  const probe = {
    focusedObjectId: "obj-capacity",
    selectedObjectId: "obj-capacity",
    directorCalls: 0,
  };
  const before = JSON.stringify(probe);
  resolveUtterance("Focus on Revenue");
  resolveUtterance("Open it", {
    conversationContext: { currentSubjectId: "obj-budget" },
  });
  assert.equal(JSON.stringify(probe), before);
});

test("invariant F: IDs only from registry", () => {
  const subjects = projectDefaultNexoraMvpConversationalSubjects();
  const ids = new Set(subjects.map((s) => s.subjectId));
  const { context } = resolveUtterance("Focus on Capacity");
  assert.ok(ids.has(context.primarySubject!.subjectId));
});

test("invariant K: resolution trace is serializable", () => {
  const { context, trace } = resolveUtterance("Compare Revenue and Capacity");
  assert.deepEqual(JSON.parse(JSON.stringify(context)), {
    ...context,
    secondarySubjects: context.secondarySubjects.map((s) => ({ ...s })),
    reasons: [...context.reasons],
    primarySubject: context.primarySubject
      ? { ...context.primarySubject }
      : null,
  });
  assert.equal(typeof JSON.stringify(trace), "string");
  assert.ok(JSON.parse(JSON.stringify(trace)).finalPrimarySubjectId);
});

test("invariant N: no provider imports in CC production sources", async () => {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const dir = path.join(process.cwd(), "app/lib/conversational-control");
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".ts") || file.endsWith(".test.ts")) continue;
    const src = fs.readFileSync(path.join(dir, file), "utf8");
    assert.doesNotMatch(src, /\bfrom\s+["']openai["']/i);
    assert.doesNotMatch(src, /\bfrom\s+["']@anthropic/i);
    assert.doesNotMatch(src, /\bfetch\s*\(/);
  }
});
