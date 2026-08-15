/**
 * CC:6 — Workspace & Experience Control certification tests.
 */

import assert from "node:assert/strict";
import { test } from "node:test";

import {
  CONVERSATIONAL_EXPERIENCE_CONTROL_BOUNDARY,
  CONVERSATIONAL_EXPERIENCE_CONTROL_REASON,
  conversationalExperienceControlArchitecturalRole,
  conversationalExperienceControlIdentity,
  getConversationalExperienceControlIdentity,
} from "./conversationalExperienceContext.ts";
import {
  findRegisteredExperiencesForHint,
  getNexoraRegisteredExecutiveExperiences,
  NEXORA_REGISTERED_EXECUTIVE_EXPERIENCES,
  type NexoraRegisteredExecutiveExperience,
} from "./conversationalExperienceRegistry.ts";
import { executeNexoraConversationalExperience } from "./conversationalExperienceOrchestrator.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "./conversationalSubjectRegistry.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { applyNexoraMVPConversationalCommand } from "@/app/lib/nex-mvp/nexoraMVPConversationalRuntimeBridge.ts";
import { NEXORA_MVP_WORKSPACE_KINDS } from "@/app/lib/nex-mvp/nexoraMVPApplicationFoundation.ts";
import { CONVERSATIONAL_INTENT_BOUNDARY } from "./conversationalIntent.ts";
import { CONVERSATIONAL_CONTEXT_BOUNDARY } from "./conversationalContext.ts";
import { CONVERSATIONAL_COMMAND_BOUNDARY } from "./conversationalCommand.ts";
import { CONVERSATIONAL_RUNTIME_BRIDGE_BOUNDARY } from "./conversationalRuntimeBridge.ts";
import { CONVERSATIONAL_EXPERIENCE_BOUNDARY } from "./conversationalExperience.ts";

function initialState(
  workspace: "overview" | "problem" | "scenario" | "decision" | "execution" = "overview",
) {
  return createInitialNexoraMVPObjectInteractionState({
    workspace,
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function run(
  utterance: string,
  opts?: {
    readonly state?: ReturnType<typeof initialState>;
    readonly availableExperiences?: readonly NexoraRegisteredExecutiveExperience[];
    readonly lastAppliedCommandId?: string | null;
    readonly seed?: string;
  },
) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: Object.freeze({
      currentSubjectId: null,
      previousSubjectIds: Object.freeze([]),
      currentWorkspaceId: opts?.state?.workspace ?? "overview",
    }),
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState: opts?.state ?? initialState(),
    catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
    availableExperiences: opts?.availableExperiences,
    lastAppliedCommandId: opts?.lastAppliedCommandId ?? null,
    messageIdSeed: opts?.seed ?? `cc6-${utterance}`,
  });
}

test("CC:6 identity and architectural boundary", () => {
  const id = getConversationalExperienceControlIdentity();
  assert.equal(id.id, "CC:6/WorkspaceAndExperienceControl");
  assert.equal(id.version, "1.0.0");
  assert.equal(
    conversationalExperienceControlArchitecturalRole,
    "ConversationalExperienceContextResolverAuthority",
  );
  assert.equal(conversationalExperienceControlIdentity, id.id);
  assert.equal(CONVERSATIONAL_EXPERIENCE_CONTROL_BOUNDARY.inventsWorkspaceIds, false);
  assert.equal(CONVERSATIONAL_EXPERIENCE_CONTROL_BOUNDARY.writesStageCoordinates, false);
  assert.equal(CONVERSATIONAL_EXPERIENCE_CONTROL_BOUNDARY.movesCamera, false);
  assert.equal(
    CONVERSATIONAL_EXPERIENCE_CONTROL_BOUNDARY.createsSecondWorkspaceAuthority,
    false,
  );
  assert.equal(CONVERSATIONAL_EXPERIENCE_CONTROL_BOUNDARY.bypassesCc4, false);
  assert.equal(
    CONVERSATIONAL_EXPERIENCE_CONTROL_BOUNDARY.usesLlmOrExternalProvider,
    false,
  );
  assert.equal(CONVERSATIONAL_EXPERIENCE_CONTROL_BOUNDARY.calendarIntegration, false);
  assert.equal(CONVERSATIONAL_EXPERIENCE_CONTROL_BOUNDARY.durableMemory, false);
  assert.equal(CONVERSATIONAL_EXPERIENCE_CONTROL_BOUNDARY.autonomousPlanner, false);
});

test("16: registered experiences map only onto existing workspace kinds", () => {
  for (const experience of NEXORA_REGISTERED_EXECUTIVE_EXPERIENCES) {
    assert.ok(
      (NEXORA_MVP_WORKSPACE_KINDS as readonly string[]).includes(
        experience.workspaceId,
      ),
      experience.id,
    );
  }
});

test("1: explicit workspace resolution — Open the Project workspace", () => {
  const result = run("Open the Project workspace.", { seed: "ws1" });
  assert.equal(result.intentResult.intent.kind, "switch-workspace");
  assert.equal(result.experienceResult?.decision, "transition");
  assert.equal(
    result.experienceResult?.targetExperienceContext.workspaceId,
    "decision",
  );
  assert.equal(result.status, "applied");
  assert.equal(result.nextRuntimeState.workspace, "decision");
  assert.match(result.response, /Decision Review context is ready/i);
  assert.equal(
    result.commandResult?.command?.kind,
    "switch-workspace",
  );
  assert.equal(
    result.runtimeResult?.runtimeActionKind,
    "change-workspace",
  );
});

test("2: implicit registered meeting context", () => {
  const result = run(
    "I'm entering a project review meeting. Prepare Nexora.",
    { seed: "meet1" },
  );
  assert.equal(result.intentResult.intent.kind, "prepare-context");
  assert.equal(result.experienceResult?.decision, "transition");
  assert.equal(
    result.experienceResult?.targetExperienceContext.experienceId,
    "decision-review",
  );
  assert.equal(result.nextRuntimeState.workspace, "decision");
  assert.match(result.response, /Decision Review context is ready/i);
  assert.ok(
    result.experienceResult?.reasons.includes(
      CONVERSATIONAL_EXPERIENCE_CONTROL_REASON.IMPLICIT_SITUATION_MATCH,
    ),
  );
});

test("3: keep-current when already in project review", () => {
  const result = run("Prepare me for the project review.", {
    state: initialState("decision"),
    seed: "keep1",
  });
  assert.equal(result.experienceResult?.decision, "keep-current");
  assert.equal(result.status, "no-op");
  assert.equal(result.shouldCommitRuntime, false);
  assert.equal(result.nextRuntimeState.workspace, "decision");
  assert.match(result.response, /already in the Decision Review context/i);
});

test("4: ordinary focus does not switch workspace", () => {
  const result = run("Focus on Capacity", {
    state: initialState("overview"),
    seed: "focus1",
  });
  assert.equal(result.intentResult.intent.kind, "focus");
  assert.equal(result.experienceResult?.decision, "keep-current");
  assert.equal(result.experienceResult?.resolutionStatus, "not-required");
  assert.equal(result.nextRuntimeState.workspace, "overview");
  assert.equal(result.nextRuntimeState.focusedSubject?.id, "obj-capacity");
  assert.equal(result.response, "Focused on Capacity.");
});

test("5: explicit focus survives experience transition", () => {
  const result = run(
    "Prepare the project review and focus on Budget.",
    { seed: "focus2" },
  );
  assert.equal(result.status, "applied");
  assert.equal(result.nextRuntimeState.workspace, "decision");
  assert.equal(result.nextRuntimeState.focusedSubject?.id, "obj-budget");
  assert.match(result.response, /Decision Review context is ready/i);
  assert.match(result.response, /Focused on Budget/i);
});

test("6: Budget beats Capacity attention after prepare+focus", () => {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  let state = initialState("overview");
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity", catalog);
  // Capacity may remain visible/attention-marked; Budget must be focused/anchor.
  const result = run(
    "Prepare the project review and focus on Budget.",
    { state, seed: "attn1" },
  );
  assert.equal(result.nextRuntimeState.focusedSubject?.id, "obj-budget");
  assert.equal(result.nextRuntimeState.workspace, "decision");
  assert.notEqual(result.nextRuntimeState.focusedSubject?.id, "obj-capacity");
});

test("7: ambiguous experience — Prepare the review", () => {
  const ambiguousRegistry = Object.freeze([
    Object.freeze({
      id: "decision-review",
      label: "Project Review",
      aliases: Object.freeze(["project review", "review"]),
      workspaceId: "decision" as const,
      presentationState: null,
      defaultSubjectId: null,
    }),
    Object.freeze({
      id: "financial-review",
      label: "Financial Review",
      aliases: Object.freeze(["financial review", "review"]),
      workspaceId: "scenario" as const,
      presentationState: null,
      defaultSubjectId: null,
    }),
  ]);
  const before = initialState("overview");
  const result = run("Prepare the review.", {
    state: before,
    availableExperiences: ambiguousRegistry,
    seed: "amb1",
  });
  assert.equal(result.experienceResult?.decision, "clarification-required");
  assert.equal(result.status, "clarification-required");
  assert.equal(result.shouldCommitRuntime, false);
  assert.equal(result.nextRuntimeState.workspace, "overview");
  assert.equal(result.response, "Which review do you want to prepare?");
});

test("8–9: unknown / unavailable experience does not mutate", () => {
  const before = initialState("overview");
  const result = run("Open the Moon Operations workspace.", {
    state: before,
    seed: "unk1",
  });
  assert.equal(result.experienceResult?.decision, "unsupported");
  assert.equal(result.status, "not-found");
  assert.equal(result.shouldCommitRuntime, false);
  assert.equal(result.nextRuntimeState.workspace, before.workspace);
  assert.equal(
    result.response,
    "That executive context isn't available yet.",
  );
});

test("10–11: invalid workspace transition is atomic (rejected, no partial apply)", () => {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  const state = initialState("overview");
  const applied = applyNexoraMVPConversationalCommand({
    command: Object.freeze({
      commandId: "cc3:switch-workspace:decision:obj-does-not-exist",
      kind: "switch-workspace" as const,
      source: "conversation" as const,
      executionClass: "navigation" as const,
      primaryTargetId: "decision",
      secondaryTargetIds: Object.freeze(["obj-does-not-exist"]),
      requiresConfirmation: false,
      executable: true,
      reasons: Object.freeze([]),
    }),
    state,
    catalog,
  });
  assert.equal(applied.result.status, "rejected");
  assert.equal(applied.nextState.workspace, "overview");
  assert.equal(applied.nextState, state);
});

test("12: Stage/Advisor synchronization via conversation context workspace", () => {
  const result = run("Prepare me for the project review.", { seed: "sync1" });
  assert.equal(result.nextRuntimeState.workspace, "decision");
  assert.equal(result.nextConversationContext.currentWorkspaceId, "decision");
});

test("13: workspace-scoped navigation remains isolated across switches", () => {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  let state = initialState("overview");
  state = selectNexoraMVPInteractionSubject(state, "obj-revenue", catalog);
  state = selectNexoraMVPInteractionSubject(state, "obj-capacity", catalog);
  const trailA = state.stage2dNavigationTrail;

  const switchB = run("Open the Problem workspace.", { state, seed: "nav1" });
  assert.equal(switchB.nextRuntimeState.workspace, "problem");
  const trailB = switchB.nextRuntimeState.stage2dNavigationTrail;

  // Scope transition must not merge trails into a single unscoped history.
  assert.notDeepEqual(trailB, trailA);
  assert.equal(switchB.nextRuntimeState.workspace, "problem");

  const focusX = executeNexoraConversationalExperience({
    utterance: "Focus on Budget",
    conversationContext: switchB.nextConversationContext,
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState: switchB.nextRuntimeState,
    catalog,
    messageIdSeed: "nav2",
  });
  assert.equal(focusX.nextRuntimeState.focusedSubject?.id, "obj-budget");
  assert.equal(focusX.nextRuntimeState.workspace, "problem");
});

test("14–15: no Stage coordinate writes / no camera mutation reason codes", () => {
  const result = run("Open the Project workspace.", { seed: "cam1" });
  assert.ok(
    result.runtimeResult?.reasons.includes(
      "did-not-write-stage-coordinates",
    ),
  );
  assert.ok(result.runtimeResult?.reasons.includes("did-not-move-camera"));
});

test("16: deterministic mapping — same utterance yields same experience", () => {
  const a = run("Prepare me for the operations review.", { seed: "det-a" });
  const b = run("Prepare me for the operations review.", { seed: "det-b" });
  assert.equal(
    a.experienceResult?.targetExperienceContext.experienceId,
    b.experienceResult?.targetExperienceContext.experienceId,
  );
  assert.equal(a.nextRuntimeState.workspace, b.nextRuntimeState.workspace);
  assert.equal(a.experienceResult?.decision, b.experienceResult?.decision);
});

test("17: duplicate transition protection", () => {
  const first = run("Open the Project workspace.", { seed: "dup1" });
  assert.equal(first.status, "applied");
  const second = run("Open the Project workspace.", {
    state: first.nextRuntimeState,
    lastAppliedCommandId: first.commandResult?.command?.commandId ?? null,
    seed: "dup2",
  });
  // Already in decision → keep-current no-op (preferred over duplicate dispatch)
  assert.equal(second.experienceResult?.decision, "keep-current");
  assert.equal(second.status, "no-op");
  assert.equal(second.shouldCommitRuntime, false);
});

test("18: CC:1–5 boundary regression (still green)", () => {
  assert.equal(CONVERSATIONAL_INTENT_BOUNDARY.usesLlmOrExternalProvider, false);
  assert.equal(CONVERSATIONAL_CONTEXT_BOUNDARY.usesLlmOrExternalProvider, false);
  assert.equal(CONVERSATIONAL_COMMAND_BOUNDARY.usesLlmOrExternalProvider, false);
  assert.equal(
    CONVERSATIONAL_RUNTIME_BRIDGE_BOUNDARY.writesStageCoordinates,
    false,
  );
  assert.equal(CONVERSATIONAL_RUNTIME_BRIDGE_BOUNDARY.movesCamera, false);
  assert.equal(CONVERSATIONAL_EXPERIENCE_BOUNDARY.writesFocusDirectly, false);
  assert.equal(
    CONVERSATIONAL_EXPERIENCE_BOUNDARY.canonicalRuntimeEntry,
    "applyNexoraMVPConversationalCommand",
  );
});

test("19–20: click / navigation authorities unchanged (reuse select + scoped trail)", () => {
  const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
  const prepared = run("Prepare me for the project review.", { seed: "click1" });
  const afterClick = selectNexoraMVPInteractionSubject(
    prepared.nextRuntimeState,
    "obj-revenue",
    catalog,
  );
  assert.equal(afterClick.focusedSubject?.id, "obj-revenue");
  assert.equal(afterClick.workspace, "decision");
});

test("registry soft-match prefers exact alias over soft containment", () => {
  const matches = findRegisteredExperiencesForHint("project review");
  assert.equal(matches.length, 1);
  assert.equal(matches[0]?.id, "decision-review");
});

test("registry exposes certified experiences", () => {
  const all = getNexoraRegisteredExecutiveExperiences();
  assert.ok(all.some((e) => e.id === "decision-review"));
  assert.ok(all.some((e) => e.id === "problem-investigation"));
  assert.ok(all.some((e) => e.id === "executive-overview"));
});
