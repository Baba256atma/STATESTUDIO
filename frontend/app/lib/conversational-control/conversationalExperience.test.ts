/**
 * CC:5 — Conversational Experience Integration certification tests.
 */

import assert from "node:assert/strict";
import { test } from "node:test";

import {
  CONVERSATIONAL_EXPERIENCE_BOUNDARY,
  conversationalExperienceArchitecturalRole,
  conversationalExperienceIdentity,
  conversationalExperienceNamespace,
  conversationalExperienceVersion,
  getConversationalExperienceIdentity,
} from "./conversationalExperience.ts";
import { executeNexoraConversationalExperience } from "./conversationalExperienceOrchestrator.ts";
import {
  freezeConversationalSubjectRecord,
  projectDefaultNexoraMvpConversationalSubjects,
} from "./conversationalSubjectRegistry.ts";
import type { NexoraConversationalSubjectRecord } from "./conversationalContext.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function subjectsWithGrowth(): readonly NexoraConversationalSubjectRecord[] {
  return Object.freeze([
    ...projectDefaultNexoraMvpConversationalSubjects(),
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
  ]);
}

function run(
  utterance: string,
  opts?: {
    readonly state?: ReturnType<typeof initialState>;
    readonly conversationContext?: {
      readonly currentSubjectId?: string | null;
      readonly previousSubjectIds?: readonly string[];
    };
    readonly subjects?: readonly NexoraConversationalSubjectRecord[];
    readonly lastAppliedCommandId?: string | null;
    readonly seed?: string;
  },
) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: Object.freeze({
      currentSubjectId: opts?.conversationContext?.currentSubjectId ?? null,
      previousSubjectIds: Object.freeze(
        opts?.conversationContext?.previousSubjectIds ?? [],
      ),
    }),
    executiveSubjects: opts?.subjects ?? projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState: opts?.state ?? initialState(),
    catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
    lastAppliedCommandId: opts?.lastAppliedCommandId ?? null,
    messageIdSeed: opts?.seed ?? `test-${utterance}`,
  });
}

test("CC:5 identity and boundary", () => {
  const id = getConversationalExperienceIdentity();
  assert.equal(id.id, "CC:5/ConversationalExperienceIntegration");
  assert.equal(id.version, "1.0.0");
  assert.equal(
    id.namespace,
    "nexora.conversational-control.conversational-experience-integration",
  );
  assert.equal(
    conversationalExperienceArchitecturalRole,
    "ConversationalExperienceIntegrationAuthority",
  );
  assert.equal(conversationalExperienceIdentity, id.id);
  assert.equal(conversationalExperienceVersion, id.version);
  assert.equal(conversationalExperienceNamespace, id.namespace);
  assert.equal(CONVERSATIONAL_EXPERIENCE_BOUNDARY.alwaysUsesCc1ThroughCc4, true);
  assert.equal(CONVERSATIONAL_EXPERIENCE_BOUNDARY.writesFocusDirectly, false);
  assert.equal(CONVERSATIONAL_EXPERIENCE_BOUNDARY.usesLlmOrExternalProvider, false);
  assert.equal(
    CONVERSATIONAL_EXPERIENCE_BOUNDARY.canonicalRuntimeEntry,
    "applyNexoraMVPConversationalCommand",
  );
});

test("1–2: Focus Capacity end-to-end success feedback", () => {
  const result = run("Focus on Capacity", { seed: "cap" });
  assert.equal(result.status, "applied");
  assert.equal(result.shouldCommitRuntime, true);
  assert.equal(result.nextRuntimeState.focusedSubject?.id, "obj-capacity");
  assert.equal(result.response, "Focused on Capacity.");
  assert.equal(result.intentResult.intent.kind, "focus");
  assert.equal(result.contextResult.context.primarySubject?.subjectId, "obj-capacity");
  assert.equal(result.commandResult?.command?.kind, "focus-subject");
  assert.equal(result.runtimeResult?.status, "applied");
  assert.equal(result.nextConversationContext.currentSubjectId, "obj-capacity");
  assert.equal(result.managerMessage.role, "manager");
  assert.equal(result.nexoraMessage.text, "Focused on Capacity.");
});

test("3: Budget precedence under Capacity attention", () => {
  const capacity = getDefaultNexoraMVPObjectInteractionCatalog().objects.find(
    (o) => o.id === "obj-capacity",
  );
  assert.ok(capacity);
  assert.ok(
    capacity!.attention === "important" || capacity!.attention === "critical",
  );
  const result = run("Focus on Budget");
  assert.equal(result.status, "applied");
  assert.equal(result.nextRuntimeState.focusedSubject?.id, "obj-budget");
  assert.notEqual(result.nextRuntimeState.focusedSubject?.id, "obj-capacity");
  assert.equal(result.response, "Focused on Budget.");
});

test("4–6: Overview + Back + Forward", () => {
  let state = initialState();
  let context = Object.freeze({
    currentSubjectId: null as string | null,
    previousSubjectIds: Object.freeze([] as string[]),
  });

  const revenue = run("Focus on Revenue", { state, conversationContext: context, seed: "r1" });
  state = revenue.nextRuntimeState;
  context = revenue.nextConversationContext as typeof context;
  assert.equal(state.focusedSubject?.id, "obj-revenue");

  const capacity = run("Focus on Capacity", {
    state,
    conversationContext: context,
    seed: "c1",
  });
  state = capacity.nextRuntimeState;
  context = capacity.nextConversationContext as typeof context;
  assert.equal(state.focusedSubject?.id, "obj-capacity");

  const back = run("Go back", { state, conversationContext: context, seed: "b1" });
  assert.equal(back.status, "applied");
  assert.equal(back.nextRuntimeState.focusedSubject?.id, "obj-revenue");
  assert.equal(back.response, "Returned to the previous view.");

  const forward = run("Go forward", {
    state: back.nextRuntimeState,
    conversationContext: back.nextConversationContext,
    seed: "f1",
  });
  assert.equal(forward.nextRuntimeState.focusedSubject?.id, "obj-capacity");
  assert.equal(forward.response, "Moved forward.");

  const overview = run("Return to overview", {
    state: forward.nextRuntimeState,
    conversationContext: forward.nextConversationContext,
    seed: "o1",
  });
  assert.equal(overview.nextRuntimeState.mode, "overview");
  assert.equal(overview.nextRuntimeState.focusedSubject, null);
  assert.equal(overview.response, "Returned to overview.");
});

test("7: multi-turn Revenue → Show its problems", () => {
  const first = run("Focus on Revenue", { seed: "mt1" });
  assert.equal(first.nextConversationContext.currentSubjectId, "obj-revenue");

  const second = run("Show its problems", {
    state: first.nextRuntimeState,
    conversationContext: first.nextConversationContext,
    seed: "mt2",
  });
  assert.equal(second.status, "applied");
  assert.equal(
    second.contextResult.context.primarySubject?.subjectId,
    "obj-revenue",
  );
  assert.equal(second.intentResult.intent.kind, "show-problems");
  assert.equal(second.nextRuntimeState.focusedSubject, null);
  assert.deepEqual(second.nextRuntimeState.collectionContext?.objectIds, [
    "ctx-problem-capacity",
    "ctx-problem-margin",
  ]);
});

test("8: missing-context Open it", () => {
  const result = run("Open it", { seed: "miss" });
  assert.equal(result.status, "clarification-required");
  assert.equal(result.shouldCommitRuntime, false);
  assert.equal(result.nextRuntimeState.focusedSubject, null);
  assert.equal(result.response, "Which item do you mean?");
  assert.equal(result.nextConversationContext.currentSubjectId, null);
});

test("9: ambiguous Growth", () => {
  const result = run("Open Growth", {
    subjects: subjectsWithGrowth(),
    seed: "amb",
  });
  assert.equal(result.status, "clarification-required");
  assert.equal(result.shouldCommitRuntime, false);
  assert.match(result.response, /more than one/i);
  assert.equal(result.nextRuntimeState.focusedSubject, null);
});

test("10: unknown intent", () => {
  const result = run("Do something interesting", { seed: "unk" });
  assert.equal(result.status, "unsupported");
  assert.equal(result.shouldCommitRuntime, false);
  assert.match(
    result.response,
    /not sure how that relates|which business outcome/i,
  );
  assert.doesNotMatch(result.response, /map.*command|unsupported intent/i);
});

test("11: not-found subject", () => {
  const result = run("Focus on Moon Department", { seed: "nf" });
  assert.equal(result.status, "not-found");
  assert.equal(result.shouldCommitRuntime, false);
  assert.match(result.response, /couldn't find/i);
  assert.equal(result.nextConversationContext.currentSubjectId, null);
});

test("12: unsupported compare", () => {
  const result = run("Compare Revenue and Capacity", { seed: "cmp" });
  assert.equal(result.status, "unsupported");
  assert.equal(result.shouldCommitRuntime, false);
  assert.equal(
    result.response,
    "Both Capacity and Revenue are current candidates, but I don’t have enough comparable evidence to rank one over the other on financial impact.",
  );
  assert.equal(result.nextRuntimeState.focusedSubject, null);
});

test("13: simulation messaging accuracy", () => {
  const result = executeNexoraConversationalExperience({
    utterance: "Simulate Pricing Response",
    conversationContext: Object.freeze({}),
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState: initialState(),
    catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
    messageIdSeed: "sim",
  });
  // May resolve to scenario via alias/label or unsupported path —
  // never claim simulation complete.
  assert.doesNotMatch(result.response, /simulation complete/i);
  if (result.status === "applied") {
    assert.match(result.response, /not available yet/i);
  }
});

test("14: duplicate submission protection", () => {
  const first = run("Focus on Revenue", { seed: "dup1" });
  assert.equal(first.status, "applied");
  const second = run("Focus on Revenue", {
    state: first.nextRuntimeState,
    conversationContext: first.nextConversationContext,
    lastAppliedCommandId: first.commandResult?.command?.commandId,
    seed: "dup2",
  });
  assert.equal(second.status, "no-op");
  assert.equal(second.shouldCommitRuntime, false);
  assert.equal(
    second.nextRuntimeState.focusedSubject?.id,
    first.nextRuntimeState.focusedSubject?.id,
  );
});

test("15–17: failed leaves Runtime+context unchanged; success updates context", () => {
  const seeded = run("Focus on Capacity", { seed: "seed" });
  const failed = run("Focus on Moon Department", {
    state: seeded.nextRuntimeState,
    conversationContext: seeded.nextConversationContext,
    seed: "fail",
  });
  assert.equal(failed.shouldCommitRuntime, false);
  assert.equal(
    failed.nextRuntimeState.focusedSubject?.id,
    "obj-capacity",
  );
  assert.equal(
    failed.nextConversationContext.currentSubjectId,
    "obj-capacity",
  );
});

test("18: response text matches status", () => {
  assert.equal(run("Return to overview").response, "Returned to overview.");
  assert.equal(run("Open it").response, "Which item do you mean?");
  assert.equal(
    run("Compare Revenue and Capacity").response,
    "Both Capacity and Revenue are current candidates, but I don’t have enough comparable evidence to rank one over the other on financial impact.",
  );
});

test("Analyze feedback does not claim dedicated engine", () => {
  const result = run("Analyze Revenue");
  assert.equal(result.status, "applied");
  assert.equal(result.response, "Focused on Revenue for analysis.");
});

test("Stage presentation after experience focus", () => {
  const result = run("Focus on Capacity");
  const presentation = deriveNexoraMVPStageInteractionPresentation(
    result.nextRuntimeState,
  );
  assert.equal(presentation.focusedSubjectId, "obj-capacity");
  assert.equal(presentation.scene.focusedObjectId, "obj-capacity");
});

test("invariant Y: no provider imports in CC:5 sources", async () => {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const dir = path.join(process.cwd(), "app/lib/conversational-control");
  for (const file of fs.readdirSync(dir)) {
    if (!file.includes("Experience") && !file.includes("experience")) continue;
    if (!file.endsWith(".ts") || file.endsWith(".test.ts")) continue;
    const src = fs.readFileSync(path.join(dir, file), "utf8");
    assert.doesNotMatch(src, /\bfrom\s+["']openai["']/i);
    assert.doesNotMatch(src, /\bfetch\s*\(/);
  }
});
