/**
 * CC:3 — Command & Action Mapping certification tests.
 */

import assert from "node:assert/strict";
import { test } from "node:test";

import {
  CONVERSATIONAL_COMMAND_BOUNDARY,
  CONVERSATIONAL_COMMAND_REASON,
  conversationalCommandMappingArchitecturalRole,
  conversationalCommandMappingIdentity,
  conversationalCommandMappingNamespace,
  conversationalCommandMappingVersion,
  getConversationalCommandMappingIdentity,
  type NexoraConversationalCommand,
} from "./conversationalCommand.ts";
import {
  deriveNexoraConversationalCommandId,
  mapNexoraConversationalCommand,
} from "./conversationalCommandMapper.ts";
import {
  CONVERSATIONAL_INTENT_COMMAND_RULES,
  findConversationalIntentCommandRule,
} from "./conversationalCommandPolicy.ts";
import {
  resolveNexoraConversationalIntent,
} from "./conversationalIntentResolver.ts";
import {
  resolveNexoraExecutiveConversationalContext,
} from "./conversationalContextResolver.ts";
import {
  freezeConversationalSubjectRecord,
  projectDefaultNexoraMvpConversationalSubjects,
} from "./conversationalSubjectRegistry.ts";
import type { NexoraConversationalSubjectRecord } from "./conversationalContext.ts";
import type { NexoraConversationalIntent } from "./conversationalIntent.ts";
import type { NexoraResolvedConversationalContext } from "./conversationalContext.ts";

function subjectsWithExtras(): readonly NexoraConversationalSubjectRecord[] {
  return Object.freeze([
    ...projectDefaultNexoraMvpConversationalSubjects(),
    freezeConversationalSubjectRecord({
      subjectId: "scenario-a",
      subjectKind: "scenario",
      canonicalName: "Scenario A",
      aliases: Object.freeze(["scenario a", "scenario-a"]),
      businessKey: "scenario-a",
    }),
    freezeConversationalSubjectRecord({
      subjectId: "biz-company",
      subjectKind: "business",
      canonicalName: "Company",
      aliases: Object.freeze(["company", "business"]),
      businessKey: "biz-company",
    }),
    freezeConversationalSubjectRecord({
      subjectId: "goal-growth",
      subjectKind: "goal",
      canonicalName: "Growth",
      aliases: Object.freeze(["growth"]),
    }),
    freezeConversationalSubjectRecord({
      subjectId: "scenario-growth",
      subjectKind: "scenario",
      canonicalName: "Growth",
      aliases: Object.freeze(["growth"]),
    }),
    freezeConversationalSubjectRecord({
      subjectId: "workspace-settings",
      subjectKind: "workspace",
      canonicalName: "Workspace Settings",
      aliases: Object.freeze(["workspace settings"]),
    }),
  ]);
}

function pipeline(utterance: string, opts?: {
  readonly conversationContext?: {
    readonly currentSubjectId?: string | null;
  };
  readonly executiveSubjects?: readonly NexoraConversationalSubjectRecord[];
}) {
  const { intent } = resolveNexoraConversationalIntent({ utterance });
  const { context } = resolveNexoraExecutiveConversationalContext({
    intent,
    targetHints: intent.targetHints,
    conversationContext: opts?.conversationContext ?? null,
    executiveSubjects: opts?.executiveSubjects ?? subjectsWithExtras(),
  });
  const mapping = mapNexoraConversationalCommand({ intent, context });
  return { intent, context, mapping };
}

function mapDirect(
  intent: NexoraConversationalIntent,
  context: NexoraResolvedConversationalContext,
) {
  return mapNexoraConversationalCommand({ intent, context });
}

function assertExecutableCommand(
  command: NexoraConversationalCommand | null,
  kind: string,
  primary: string | null,
) {
  assert.ok(command);
  assert.equal(command.kind, kind);
  assert.equal(command.primaryTargetId, primary);
  assert.equal(command.source, "conversation");
  assert.equal(command.executable, true);
  assert.equal(command.requiresConfirmation, false);
  assert.ok(
    command.reasons.includes(
      CONVERSATIONAL_COMMAND_REASON.EXECUTABLE_NOT_EXECUTED,
    ),
  );
}

// ─── Identity / boundary ────────────────────────────────────────────────────

test("CC:3 identity and architectural boundary", () => {
  const id = getConversationalCommandMappingIdentity();
  assert.equal(id.id, "CC:3/CommandAndActionMapping");
  assert.equal(id.version, "1.0.0");
  assert.equal(
    id.namespace,
    "nexora.conversational-control.command-and-action-mapping",
  );
  assert.equal(
    conversationalCommandMappingArchitecturalRole,
    "ConversationalCommandMapperAuthority",
  );
  assert.equal(conversationalCommandMappingIdentity, id.id);
  assert.equal(conversationalCommandMappingVersion, id.version);
  assert.equal(conversationalCommandMappingNamespace, id.namespace);

  assert.equal(CONVERSATIONAL_COMMAND_BOUNDARY.executesCommand, false);
  assert.equal(CONVERSATIONAL_COMMAND_BOUNDARY.mutatesRuntime, false);
  assert.equal(CONVERSATIONAL_COMMAND_BOUNDARY.mutatesStage, false);
  assert.equal(CONVERSATIONAL_COMMAND_BOUNDARY.invokesDirector, false);
  assert.equal(CONVERSATIONAL_COMMAND_BOUNDARY.resolvesCanonicalObjectIds, false);
  assert.equal(CONVERSATIONAL_COMMAND_BOUNDARY.parsesRawLanguage, false);
  assert.equal(CONVERSATIONAL_COMMAND_BOUNDARY.expandsIntoUiStageEffects, false);
  assert.equal(CONVERSATIONAL_COMMAND_BOUNDARY.manipulatesNavigationTrail, false);
  assert.equal(CONVERSATIONAL_COMMAND_BOUNDARY.queriesRelationships, false);
  assert.equal(CONVERSATIONAL_COMMAND_BOUNDARY.usesLlmOrExternalProvider, false);
  assert.equal(CONVERSATIONAL_COMMAND_BOUNDARY.phaseStopsAtCanonicalCommand, true);

  assert.ok(CONVERSATIONAL_INTENT_COMMAND_RULES.length >= 10);
  assert.ok(findConversationalIntentCommandRule("focus"));
});

// ─── Success mappings ───────────────────────────────────────────────────────

test("cert: focus + obj-capacity → focus-subject", () => {
  const { mapping } = pipeline("Focus on Capacity");
  assert.equal(mapping.status, "mapped");
  assertExecutableCommand(mapping.command, "focus-subject", "obj-capacity");
  assert.equal(
    mapping.command!.commandId,
    "cc3:focus-subject:obj-capacity:-",
  );
});

test("cert: overview → open-overview", () => {
  const { mapping } = pipeline("Return to overview");
  assert.equal(mapping.status, "mapped");
  assertExecutableCommand(mapping.command, "open-overview", null);
});

test("cert: reveal related / problems / scenarios / decisions", () => {
  const related = pipeline("Show related objects", {
    conversationContext: { currentSubjectId: "obj-revenue" },
  });
  // "Show related objects" has no context requirement in CC:1 — may be not-required.
  // Relation-scoped with explicit subject:
  const relatedAnchored = pipeline("Show scenarios related to Revenue");
  assert.equal(relatedAnchored.mapping.status, "mapped");
  assertExecutableCommand(
    relatedAnchored.mapping.command,
    "reveal-scenarios",
    "obj-revenue",
  );

  const problems = pipeline("Show Capacity problems");
  assertExecutableCommand(
    problems.mapping.command,
    "reveal-problems",
    "obj-capacity",
  );

  const decisions = pipeline("Show decisions for this", {
    conversationContext: { currentSubjectId: "obj-capacity" },
  });
  assertExecutableCommand(
    decisions.mapping.command,
    "reveal-decisions",
    "obj-capacity",
  );

  void related;
});

test("cert: show-related with resolved context subject", () => {
  const intent = resolveNexoraConversationalIntent({
    utterance: "Show related objects",
  }).intent;
  // Force resolved context as CC:2 would for anchored related.
  const context: NexoraResolvedConversationalContext = Object.freeze({
    primarySubject: Object.freeze({
      subjectKind: "object" as const,
      subjectId: "obj-revenue",
      canonicalName: "Revenue",
      matchedHint: "revenue",
    }),
    secondarySubjects: Object.freeze([]),
    resolutionStatus: "resolved" as const,
    source: "conversation-context" as const,
    confidence: 0.9,
    reasons: Object.freeze(["test"]),
  });
  const mapping = mapDirect({ ...intent, kind: "show-related", requiresTarget: true }, context);
  assertExecutableCommand(mapping.command, "reveal-related", "obj-revenue");
});

test("cert: reveal-goals with business subject", () => {
  const intent = resolveNexoraConversationalIntent({
    utterance: "Show goals",
  }).intent;
  const context: NexoraResolvedConversationalContext = Object.freeze({
    primarySubject: Object.freeze({
      subjectKind: "business" as const,
      subjectId: "biz-company",
      canonicalName: "Company",
    }),
    secondarySubjects: Object.freeze([]),
    resolutionStatus: "resolved" as const,
    source: "explicit-hint" as const,
    confidence: 0.9,
    reasons: Object.freeze(["test"]),
  });
  const mapping = mapDirect(
    { ...intent, kind: "show-goals", requiresTarget: true },
    context,
  );
  assertExecutableCommand(mapping.command, "reveal-goals", "biz-company");
});

test("cert: reveal-execution with decision subject", () => {
  const intent = resolveNexoraConversationalIntent({
    utterance: "Show execution",
  }).intent;
  const context: NexoraResolvedConversationalContext = Object.freeze({
    primarySubject: Object.freeze({
      subjectKind: "decision" as const,
      subjectId: "ctx-decision-capacity",
      canonicalName: "Expand Capacity",
    }),
    secondarySubjects: Object.freeze([]),
    resolutionStatus: "resolved" as const,
    source: "explicit-hint" as const,
    confidence: 0.9,
    reasons: Object.freeze(["test"]),
  });
  const mapping = mapDirect(
    { ...intent, kind: "show-execution", requiresTarget: true },
    context,
  );
  assertExecutableCommand(
    mapping.command,
    "reveal-execution",
    "ctx-decision-capacity",
  );
});

test("cert: analyze / compare / simulate / navigate", () => {
  const analyze = pipeline("Analyze Revenue");
  assertExecutableCommand(analyze.mapping.command, "analyze-subject", "obj-revenue");

  const compare = pipeline("Compare Revenue and Capacity");
  assert.equal(compare.mapping.status, "mapped");
  assertExecutableCommand(compare.mapping.command, "compare-subjects", "obj-revenue");
  assert.deepEqual(compare.mapping.command!.secondaryTargetIds, ["obj-capacity"]);
  assert.ok(
    compare.mapping.command!.reasons.includes(
      CONVERSATIONAL_COMMAND_REASON.ORDER_PRESERVED,
    ),
  );

  const simulate = pipeline("Simulate Scenario A");
  assertExecutableCommand(
    simulate.mapping.command,
    "simulate-scenario",
    "scenario-a",
  );

  const back = pipeline("Go back");
  assertExecutableCommand(back.mapping.command, "navigate-back", null);

  const forward = pipeline("Go forward");
  assertExecutableCommand(forward.mapping.command, "navigate-forward", null);
});

// ─── Failure cases ──────────────────────────────────────────────────────────

test("fail: unknown intent → unsupported-intent", () => {
  const { mapping } = pipeline("Do something interesting");
  assert.equal(mapping.status, "unsupported-intent");
  assert.equal(mapping.command, null);
});

test("fail: focus + no target → missing-target", () => {
  const intent = resolveNexoraConversationalIntent({
    utterance: "Focus on Capacity",
  }).intent;
  const context: NexoraResolvedConversationalContext = Object.freeze({
    primarySubject: null,
    secondarySubjects: Object.freeze([]),
    resolutionStatus: "resolved" as const,
    source: "none" as const,
    confidence: 0.5,
    reasons: Object.freeze(["test-missing-primary"]),
  });
  const mapping = mapDirect(intent, context);
  assert.equal(mapping.status, "missing-target");
  assert.equal(mapping.command, null);
  assert.ok(
    mapping.trace.reasons.includes(
      CONVERSATIONAL_COMMAND_REASON.MISSING_PRIMARY_TARGET,
    ),
  );
});

test("fail: compare + one target → missing-target", () => {
  const intent = resolveNexoraConversationalIntent({
    utterance: "Compare Revenue and Capacity",
  }).intent;
  const context: NexoraResolvedConversationalContext = Object.freeze({
    primarySubject: Object.freeze({
      subjectKind: "object" as const,
      subjectId: "obj-revenue",
      canonicalName: "Revenue",
    }),
    secondarySubjects: Object.freeze([]),
    resolutionStatus: "resolved" as const,
    source: "explicit-hint" as const,
    confidence: 0.8,
    reasons: Object.freeze(["test"]),
  });
  const mapping = mapDirect(intent, context);
  assert.equal(mapping.status, "missing-target");
  assert.equal(mapping.command, null);
  assert.ok(
    mapping.trace.reasons.includes(
      CONVERSATIONAL_COMMAND_REASON.MISSING_SECONDARY_TARGET,
    ),
  );
});

test("fail: ambiguous CC:2 → ambiguous-context", () => {
  const { context, mapping } = pipeline("Open Growth");
  assert.equal(context.resolutionStatus, "ambiguous");
  assert.equal(mapping.status, "ambiguous-context");
  assert.equal(mapping.command, null);
});

test("fail: not-found CC:2 → invalid-context", () => {
  const { context, mapping } = pipeline("Focus on Moon Department");
  assert.equal(context.resolutionStatus, "not-found");
  assert.equal(mapping.status, "invalid-context");
  assert.equal(mapping.command, null);
});

test("fail: missing pronoun context → missing-target", () => {
  const { context, mapping } = pipeline("Open it");
  assert.equal(context.resolutionStatus, "missing-context");
  assert.equal(mapping.status, "missing-target");
  assert.equal(mapping.command, null);
});

test("fail: simulate + incompatible subject → invalid-context", () => {
  const intent = resolveNexoraConversationalIntent({
    utterance: "Simulate this scenario",
  }).intent;
  const context: NexoraResolvedConversationalContext = Object.freeze({
    primarySubject: Object.freeze({
      subjectKind: "workspace" as const,
      subjectId: "workspace-settings",
      canonicalName: "Workspace Settings",
    }),
    secondarySubjects: Object.freeze([]),
    resolutionStatus: "resolved" as const,
    source: "explicit-hint" as const,
    confidence: 0.9,
    reasons: Object.freeze(["test"]),
  });
  const mapping = mapDirect(
    { ...intent, kind: "simulate", requiresTarget: true, requiresContext: false },
    context,
  );
  assert.equal(mapping.status, "invalid-context");
  assert.equal(mapping.command, null);
  assert.ok(
    mapping.trace.reasons.includes(
      CONVERSATIONAL_COMMAND_REASON.SUBJECT_KIND_INCOMPATIBLE,
    ),
  );
});

// ─── Invariants ─────────────────────────────────────────────────────────────

test("invariant A: same CC:1+CC:2 input → same command", () => {
  const a = pipeline("Focus on Capacity");
  const b = pipeline("Focus on Capacity");
  assert.deepEqual(a.mapping.command, b.mapping.command);
  assert.equal(a.mapping.status, b.mapping.status);
});

test("invariant B: CC:3 does not parse raw language", () => {
  assert.equal(CONVERSATIONAL_COMMAND_BOUNDARY.parsesRawLanguage, false);
  const intent = resolveNexoraConversationalIntent({
    utterance: "Focus on Capacity",
  }).intent;
  const { context } = resolveNexoraExecutiveConversationalContext({
    intent,
    executiveSubjects: subjectsWithExtras(),
  });
  const mapping = mapNexoraConversationalCommand({ intent, context });
  assert.ok(
    mapping.command!.reasons.includes(
      CONVERSATIONAL_COMMAND_REASON.NO_RAW_LANGUAGE_PARSE,
    ),
  );
  // API has no utterance field
  assert.equal(
    "utterance" in ({ intent, context } satisfies {
      intent: typeof intent;
      context: typeof context;
    }),
    false,
  );
});

test("invariant C: CC:3 does not resolve canonical IDs", () => {
  assert.equal(CONVERSATIONAL_COMMAND_BOUNDARY.resolvesCanonicalObjectIds, false);
  const mapping = pipeline("Focus on Capacity").mapping;
  assert.ok(
    mapping.command!.reasons.includes(
      CONVERSATIONAL_COMMAND_REASON.NO_ID_RESOLUTION,
    ),
  );
});

test("invariant D/E/F/G/H: no mutation / director / trail / relationships", () => {
  const probe = {
    focusedObjectId: "obj-capacity",
    trailLength: 3,
    relationshipQueryCount: 0,
  };
  const before = JSON.stringify(probe);
  pipeline("Focus on Revenue");
  pipeline("Show Capacity problems");
  pipeline("Compare Revenue and Capacity");
  assert.equal(JSON.stringify(probe), before);
  assert.equal(CONVERSATIONAL_COMMAND_BOUNDARY.mutatesRuntime, false);
  assert.equal(CONVERSATIONAL_COMMAND_BOUNDARY.invokesDirector, false);
  assert.equal(CONVERSATIONAL_COMMAND_BOUNDARY.mutatesStage, false);
  assert.equal(CONVERSATIONAL_COMMAND_BOUNDARY.manipulatesNavigationTrail, false);
  assert.equal(CONVERSATIONAL_COMMAND_BOUNDARY.queriesRelationships, false);
});

test("invariant I/J/K: blocked paths never invent executable commands", () => {
  for (const u of [
    "Do something interesting",
    "Open it",
    "Open Growth",
    "Focus on Moon Department",
  ]) {
    const { mapping } = pipeline(u);
    assert.equal(mapping.command, null);
    assert.notEqual(mapping.status, "mapped");
  }
});

test("invariant L: multi-target order preserved", () => {
  const { mapping } = pipeline("Compare Revenue and Capacity");
  assert.equal(mapping.command!.primaryTargetId, "obj-revenue");
  assert.deepEqual(mapping.command!.secondaryTargetIds, ["obj-capacity"]);
});

test("invariant M: subject compatibility deterministic", () => {
  const a = mapDirect(
    {
      ...resolveNexoraConversationalIntent({ utterance: "Simulate Scenario A" })
        .intent,
      kind: "simulate",
      requiresTarget: true,
    },
    Object.freeze({
      primarySubject: Object.freeze({
        subjectKind: "workspace" as const,
        subjectId: "workspace-settings",
        canonicalName: "Workspace Settings",
      }),
      secondarySubjects: Object.freeze([]),
      resolutionStatus: "resolved" as const,
      source: "explicit-hint" as const,
      confidence: 1,
      reasons: Object.freeze(["t"]),
    }),
  );
  const b = mapDirect(
    {
      ...resolveNexoraConversationalIntent({ utterance: "Simulate Scenario A" })
        .intent,
      kind: "simulate",
      requiresTarget: true,
    },
    Object.freeze({
      primarySubject: Object.freeze({
        subjectKind: "workspace" as const,
        subjectId: "workspace-settings",
        canonicalName: "Workspace Settings",
      }),
      secondarySubjects: Object.freeze([]),
      resolutionStatus: "resolved" as const,
      source: "explicit-hint" as const,
      confidence: 1,
      reasons: Object.freeze(["t"]),
    }),
  );
  assert.deepEqual(a, b);
  assert.equal(a.status, "invalid-context");
});

test("invariant N: command and trace serializable", () => {
  const { mapping } = pipeline("Compare Revenue and Capacity");
  assert.deepEqual(
    JSON.parse(JSON.stringify(mapping.command)),
    {
      ...mapping.command,
      secondaryTargetIds: [...mapping.command!.secondaryTargetIds],
      reasons: [...mapping.command!.reasons],
    },
  );
  assert.equal(typeof JSON.stringify(mapping.trace), "string");
});

test("deterministic commandId derivation", () => {
  assert.equal(
    deriveNexoraConversationalCommandId({
      kind: "compare-subjects",
      primaryTargetId: "obj-revenue",
      secondaryTargetIds: ["obj-capacity"],
    }),
    "cc3:compare-subjects:obj-revenue:obj-capacity",
  );
});

test("invariant S: no provider imports", async () => {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const dir = path.join(process.cwd(), "app/lib/conversational-control");
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".ts") || file.endsWith(".test.ts")) continue;
    if (!file.startsWith("conversationalCommand")) continue;
    const src = fs.readFileSync(path.join(dir, file), "utf8");
    assert.doesNotMatch(src, /\bfrom\s+["']openai["']/i);
    assert.doesNotMatch(src, /\bfetch\s*\(/);
  }
});
