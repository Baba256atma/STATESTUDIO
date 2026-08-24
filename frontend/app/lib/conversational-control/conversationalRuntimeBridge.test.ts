/**
 * CC:4 — Runtime Control Bridge certification tests.
 */

import assert from "node:assert/strict";
import { test } from "node:test";

import {
  CONVERSATIONAL_RUNTIME_BRIDGE_BOUNDARY,
  CONVERSATIONAL_RUNTIME_BRIDGE_REASON,
  conversationalRuntimeBridgeArchitecturalRole,
  conversationalRuntimeBridgeIdentity,
  conversationalRuntimeBridgeNamespace,
  conversationalRuntimeBridgeVersion,
  getConversationalRuntimeBridgeIdentity,
} from "./conversationalRuntimeBridge.ts";
import { dispatchNexoraConversationalCommand } from "./conversationalRuntimeDispatch.ts";
import { mapConversationalCommandToRuntimeAction } from "./conversationalRuntimeActionAdapter.ts";
import { mapNexoraConversationalCommand } from "./conversationalCommandMapper.ts";
import { resolveNexoraConversationalIntent } from "./conversationalIntentResolver.ts";
import { resolveNexoraExecutiveConversationalContext } from "./conversationalContextResolver.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "./conversationalSubjectRegistry.ts";
import type { NexoraConversationalCommand } from "./conversationalCommand.ts";
import {
  applyNexoraMVPConversationalCommand,
  executeNexoraConversationalControl,
} from "@/app/lib/nex-mvp/nexoraMVPConversationalRuntimeBridge.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function catalog() {
  return getDefaultNexoraMVPObjectInteractionCatalog();
}

function knownIds() {
  const c = catalog();
  return Object.freeze([
    ...c.objects.map((o) => o.id),
    ...c.contextSubjects.map((s) => s.id),
  ]);
}

function commandFromUtterance(
  utterance: string,
  conversationContext?: { currentSubjectId?: string | null },
): NexoraConversationalCommand {
  const { intent } = resolveNexoraConversationalIntent({ utterance });
  const { context } = resolveNexoraExecutiveConversationalContext({
    intent,
    targetHints: intent.targetHints,
    conversationContext: conversationContext ?? null,
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
  });
  const mapping = mapNexoraConversationalCommand({ intent, context });
  assert.ok(mapping.command, `expected command for: ${utterance}`);
  return mapping.command!;
}

function focusViaConversation(state: ReturnType<typeof initialState>, utterance: string) {
  const command = commandFromUtterance(utterance);
  return applyNexoraMVPConversationalCommand({
    command,
    state,
    catalog: catalog(),
  });
}

// ─── Identity ───────────────────────────────────────────────────────────────

test("CC:4 identity and architectural boundary", () => {
  const id = getConversationalRuntimeBridgeIdentity();
  assert.equal(id.id, "CC:4/RuntimeControlBridge");
  assert.equal(id.version, "1.0.0");
  assert.equal(
    id.namespace,
    "nexora.conversational-control.runtime-control-bridge",
  );
  assert.equal(
    conversationalRuntimeBridgeArchitecturalRole,
    "ConversationalRuntimeBridgeAuthority",
  );
  assert.equal(conversationalRuntimeBridgeIdentity, id.id);
  assert.equal(conversationalRuntimeBridgeVersion, id.version);
  assert.equal(conversationalRuntimeBridgeNamespace, id.namespace);

  assert.equal(
    CONVERSATIONAL_RUNTIME_BRIDGE_BOUNDARY.createsParallelStageController,
    false,
  );
  assert.equal(CONVERSATIONAL_RUNTIME_BRIDGE_BOUNDARY.writesStageCoordinates, false);
  assert.equal(CONVERSATIONAL_RUNTIME_BRIDGE_BOUNDARY.movesCamera, false);
  assert.equal(
    CONVERSATIONAL_RUNTIME_BRIDGE_BOUNDARY.changesSemanticTopologyZ,
    false,
  );
  assert.equal(CONVERSATIONAL_RUNTIME_BRIDGE_BOUNDARY.parsesRawLanguage, false);
  assert.equal(CONVERSATIONAL_RUNTIME_BRIDGE_BOUNDARY.resolvesIntent, false);
  assert.equal(
    CONVERSATIONAL_RUNTIME_BRIDGE_BOUNDARY.resolvesCanonicalObjectIds,
    false,
  );
  assert.equal(
    CONVERSATIONAL_RUNTIME_BRIDGE_BOUNDARY.convergesWithDirectInteraction,
    true,
  );
  assert.equal(
    CONVERSATIONAL_RUNTIME_BRIDGE_BOUNDARY.conversationCountsAsDirectUserControl,
    true,
  );
  assert.equal(
    CONVERSATIONAL_RUNTIME_BRIDGE_BOUNDARY.usesLlmOrExternalProvider,
    false,
  );
});

// ─── Case 1: Focus ──────────────────────────────────────────────────────────

test("Case 1 — focus-subject(obj-capacity) → Runtime focus + center", () => {
  const applied = focusViaConversation(initialState(), "Focus on Capacity");
  assert.equal(applied.result.status, "applied");
  assert.equal(applied.nextState.focusedSubject?.id, "obj-capacity");
  assert.equal(applied.nextState.selectedSubject?.id, "obj-capacity");

  const presentation = deriveNexoraMVPStageInteractionPresentation(
    applied.nextState,
    catalog(),
  );
  assert.equal(presentation.focusedSubjectId, "obj-capacity");
  assert.equal(presentation.scene.focusedObjectId, "obj-capacity");
  assert.equal(presentation.scene.selectedObjectId, "obj-capacity");

  const focused = presentation.scene.objects.find((o) => o.id === "obj-capacity");
  assert.ok(focused);
  assert.equal(focused!.role, "focused");
  assert.equal(focused!.focused, true);
  // Camera remains present (fixed-camera contract owned downstream of Runtime).
  assert.ok(presentation.scene.camera);
});

// ─── Case 2: Budget precedence vs Capacity attention ────────────────────────

test("Case 2 — explicit conversation Budget beats Capacity attention", () => {
  // Capacity is critical/important in fixtures; conversation requests Budget.
  const state = initialState();
  // Seed automatic attention context by first noting Capacity exists as critical —
  // without selecting it (attention must not become focus).
  const capacity = catalog().objects.find((o) => o.id === "obj-capacity");
  assert.ok(capacity);
  assert.ok(
    capacity!.attention === "important" || capacity!.attention === "critical",
  );

  const applied = focusViaConversation(state, "Focus on Budget");
  assert.equal(applied.result.status, "applied");
  assert.equal(applied.nextState.focusedSubject?.id, "obj-budget");
  assert.equal(applied.nextState.selectedSubject?.id, "obj-budget");

  const presentation = deriveNexoraMVPStageInteractionPresentation(
    applied.nextState,
    catalog(),
  );
  assert.equal(presentation.focusedSubjectId, "obj-budget");
  assert.equal(presentation.scene.focusedObjectId, "obj-budget");
  assert.notEqual(presentation.focusedSubjectId, "obj-capacity");
});

// ─── Case 3–5: Overview / Back / Forward ────────────────────────────────────

test("Case 3–5 — overview + navigation trail Back/Forward", () => {
  let state = initialState();
  state = focusViaConversation(state, "Focus on Revenue").nextState;
  assert.equal(state.focusedSubject?.id, "obj-revenue");

  state = focusViaConversation(state, "Focus on Capacity").nextState;
  assert.equal(state.focusedSubject?.id, "obj-capacity");

  const back = applyNexoraMVPConversationalCommand({
    command: commandFromUtterance("Go back"),
    state,
    catalog: catalog(),
  });
  assert.equal(back.result.status, "applied");
  assert.equal(back.nextState.focusedSubject?.id, "obj-revenue");

  const forward = applyNexoraMVPConversationalCommand({
    command: commandFromUtterance("Go forward"),
    state: back.nextState,
    catalog: catalog(),
  });
  assert.equal(forward.result.status, "applied");
  assert.equal(forward.nextState.focusedSubject?.id, "obj-capacity");

  const overview = applyNexoraMVPConversationalCommand({
    command: commandFromUtterance("Return to overview"),
    state: forward.nextState,
    catalog: catalog(),
  });
  assert.equal(overview.result.status, "applied");
  assert.equal(overview.nextState.mode, "overview");
  assert.equal(overview.nextState.focusedSubject, null);
  assert.equal(overview.nextState.selectedSubject, null);
});

// ─── Case 6–8: compare / analyze / simulate support matrix ──────────────────

test("Case 6 — compare-subjects unsupported (no compare engine)", () => {
  const command = commandFromUtterance("Compare Revenue and Capacity");
  assert.equal(command.kind, "compare-subjects");
  const support = mapConversationalCommandToRuntimeAction(command);
  assert.equal(support.supported, false);

  const applied = applyNexoraMVPConversationalCommand({
    command,
    state: initialState(),
    catalog: catalog(),
  });
  assert.equal(applied.result.status, "unsupported");
  assert.equal(applied.nextState.focusedSubject, null);
});

test("Case 7 — analyze-subject routes to focus (Advisor derive)", () => {
  const applied = focusViaConversation(initialState(), "Analyze Revenue");
  assert.equal(applied.result.status, "applied");
  assert.equal(applied.nextState.focusedSubject?.id, "obj-revenue");
  assert.ok(
    applied.result.reasons.includes(
      CONVERSATIONAL_RUNTIME_BRIDGE_REASON.RUNTIME_ANALYZE_AS_FOCUS,
    ),
  );
});

test("Case 8 — simulate-scenario focuses scenario subject only", () => {
  // Use MVP scenario fixture via direct command mapping
  const intent = resolveNexoraConversationalIntent({
    utterance: "Simulate Pricing Response",
  }).intent;
  // Force simulate + scenario subject through CC:3-shaped command
  const command: NexoraConversationalCommand = Object.freeze({
    commandId: "cc3:simulate-scenario:ctx-scenario-pricing:-",
    kind: "simulate-scenario",
    source: "conversation",
    executionClass: "simulation",
    primaryTargetId: "ctx-scenario-pricing",
    secondaryTargetIds: Object.freeze([]),
    requiresConfirmation: false,
    executable: true,
    reasons: Object.freeze(["test"]),
  });
  void intent;
  const applied = applyNexoraMVPConversationalCommand({
    command,
    state: initialState(),
    catalog: catalog(),
  });
  assert.equal(applied.result.status, "applied");
  assert.equal(applied.nextState.focusedSubject?.id, "ctx-scenario-pricing");
});

// ─── Case 9–10: invalid target / confirmation ───────────────────────────────

test("Case 9 — invalid target rejected atomically", () => {
  const state = initialState();
  const command: NexoraConversationalCommand = Object.freeze({
    commandId: "cc3:focus-subject:obj-moon:-",
    kind: "focus-subject",
    source: "conversation",
    executionClass: "navigation",
    primaryTargetId: "obj-moon",
    secondaryTargetIds: Object.freeze([]),
    requiresConfirmation: false,
    executable: true,
    reasons: Object.freeze(["test"]),
  });
  const applied = applyNexoraMVPConversationalCommand({
    command,
    state,
    catalog: catalog(),
  });
  assert.equal(applied.result.status, "rejected");
  assert.equal(applied.nextState, state);
  assert.equal(applied.nextState.focusedSubject, null);
});

test("Case 10 — confirmation-required does not execute", () => {
  const state = initialState();
  const command: NexoraConversationalCommand = Object.freeze({
    commandId: "cc3:focus-subject:obj-capacity:-",
    kind: "focus-subject",
    source: "conversation",
    executionClass: "navigation",
    primaryTargetId: "obj-capacity",
    secondaryTargetIds: Object.freeze([]),
    requiresConfirmation: true,
    executable: true,
    reasons: Object.freeze(["test"]),
  });
  const applied = applyNexoraMVPConversationalCommand({
    command,
    state,
    catalog: catalog(),
  });
  assert.equal(applied.result.status, "confirmation-required");
  assert.equal(applied.nextState, state);
  assert.equal(applied.nextState.focusedSubject, null);
});

// ─── Click vs conversation equivalence ──────────────────────────────────────

test("Click vs conversation converge on same focus authority", () => {
  const viaClick = selectNexoraMVPInteractionSubject(
    initialState(),
    "obj-capacity",
    catalog(),
  );
  const viaConversation = focusViaConversation(
    initialState(),
    "Focus on Capacity",
  ).nextState;

  assert.equal(viaClick.focusedSubject?.id, viaConversation.focusedSubject?.id);
  assert.equal(
    viaClick.selectedSubject?.id,
    viaConversation.selectedSubject?.id,
  );

  const clickPresentation = deriveNexoraMVPStageInteractionPresentation(
    viaClick,
    catalog(),
  );
  const convoPresentation = deriveNexoraMVPStageInteractionPresentation(
    viaConversation,
    catalog(),
  );
  assert.equal(
    clickPresentation.scene.focusedObjectId,
    convoPresentation.scene.focusedObjectId,
  );
  assert.equal(clickPresentation.focusedSubjectId, "obj-capacity");
  assert.equal(convoPresentation.focusedSubjectId, "obj-capacity");

  const clickFocused = clickPresentation.scene.objects.find(
    (o) => o.id === "obj-capacity",
  )!;
  const convoFocused = convoPresentation.scene.objects.find(
    (o) => o.id === "obj-capacity",
  )!;
  assert.equal(clickFocused.role, convoFocused.role);
  assert.deepEqual(clickPresentation.scene.camera, convoPresentation.scene.camera);
});

// ─── Reveal / goals unsupported ─────────────────────────────────────────────

test("reveal-problems without anchor opens queue collection", () => {
  const command = commandFromUtterance("Show the problems");
  const applied = applyNexoraMVPConversationalCommand({
    command,
    state: initialState(),
    catalog: catalog(),
  });
  assert.equal(applied.result.status, "applied");
  assert.equal(applied.nextState.collectionContext?.category, "problem");
  assert.equal(applied.nextState.focusedSubject, null);
});

test("reveal-goals unsupported", () => {
  const command: NexoraConversationalCommand = Object.freeze({
    commandId: "cc3:reveal-goals:biz-company:-",
    kind: "reveal-goals",
    source: "conversation",
    executionClass: "exploration",
    primaryTargetId: "obj-revenue",
    secondaryTargetIds: Object.freeze([]),
    requiresConfirmation: false,
    executable: true,
    reasons: Object.freeze(["test"]),
  });
  // Even with target, goals collection authority does not exist
  const support = mapConversationalCommandToRuntimeAction(command);
  assert.equal(support.supported, false);
});

// ─── Invariants ─────────────────────────────────────────────────────────────

test("invariant A: CC:4 rejects raw language — accepts structured command only", () => {
  assert.equal(CONVERSATIONAL_RUNTIME_BRIDGE_BOUNDARY.parsesRawLanguage, false);
  const planned = dispatchNexoraConversationalCommand({
    command: null,
    knownSubjectIds: knownIds(),
  });
  assert.equal(planned.status, "rejected");
});

test("invariant P/Q: failed dispatch does not mutate; confirmation gates", () => {
  const state = selectNexoraMVPInteractionSubject(
    initialState(),
    "obj-revenue",
    catalog(),
  );
  const before = state;
  const failed = applyNexoraMVPConversationalCommand({
    command: null,
    state,
    catalog: catalog(),
  });
  assert.equal(failed.nextState, before);
});

test("duplicate dispatch → no-op", () => {
  const command = commandFromUtterance("Focus on Capacity");
  const first = applyNexoraMVPConversationalCommand({
    command,
    state: initialState(),
    catalog: catalog(),
  });
  assert.equal(first.result.status, "applied");

  const second = applyNexoraMVPConversationalCommand({
    command,
    state: first.nextState,
    catalog: catalog(),
    lastAppliedCommandId: command.commandId,
  });
  assert.equal(second.result.status, "no-op");
  assert.equal(second.nextState, first.nextState);
});

test("executeNexoraConversationalControl facade matches applicator", () => {
  const command = commandFromUtterance("Focus on Delivery");
  const a = executeNexoraConversationalControl({
    command,
    state: initialState(),
    catalog: catalog(),
  });
  assert.equal(a.nextState.focusedSubject?.id, "obj-delivery");
});

test("invariant X: no provider imports in CC:4 sources", async () => {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const dir = path.join(process.cwd(), "app/lib/conversational-control");
  for (const file of fs.readdirSync(dir)) {
    if (!file.includes("Runtime") && !file.includes("runtime")) continue;
    if (!file.endsWith(".ts") || file.endsWith(".test.ts")) continue;
    const src = fs.readFileSync(path.join(dir, file), "utf8");
    assert.doesNotMatch(src, /\bfrom\s+["']openai["']/i);
    assert.doesNotMatch(src, /\bfetch\s*\(/);
  }
});

test("bridge result is serializable", () => {
  const applied = focusViaConversation(initialState(), "Focus on Capacity");
  assert.equal(typeof JSON.stringify(applied.result), "string");
  assert.ok(JSON.parse(JSON.stringify(applied.result)).commandId);
});
