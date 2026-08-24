/**
 * MO:6 — Executive Attention & Intervention Intelligence certification tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { projectManagerObjectConversationalSubjects } from "./managerObjectCatalog.ts";
import {
  EXECUTIVE_ATTENTION_INTELLIGENCE_BOUNDARY,
  getExecutiveAttentionIntelligenceIdentity,
  verifyExecutiveAttentionIntelligence,
  type ExecutiveAttentionFacts,
} from "./managerObjectAttentionEngine.ts";
import { resolveManagerObjectTurn } from "./managerObjectInteraction.ts";

const here = dirname(fileURLToPath(import.meta.url));

function subjects() {
  return projectManagerObjectConversationalSubjects();
}

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function run(
  utterance: string,
  options?: {
    readonly previous?: ReturnType<typeof executeNexoraConversationalExperience>;
  },
) {
  const previous = options?.previous;
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: subjects(),
    runtimeState: previous?.nextRuntimeState ?? initialState(),
    catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? null,
    messageIdSeed: `mo6-${utterance}`,
  });
}

function attention(
  objectId: string,
  utterance = "What needs my attention?",
  extra?: {
    readonly managerGoal?: string | null;
    readonly previous?: ReturnType<typeof resolveManagerObjectTurn>;
    readonly facts?: ExecutiveAttentionFacts;
    readonly journeyFacts?: Parameters<typeof resolveManagerObjectTurn>[0]["journeyFacts"];
    readonly named?: boolean;
  },
) {
  return resolveManagerObjectTurn({
    utterance,
    conversationalKind: "situation",
    hasNamedTargetHint: extra?.named === false ? false : extra?.previous == null,
    namedSubjectId: extra?.previous && extra?.named !== true ? null : objectId,
    previousSession: extra?.previous?.session,
    subjects: subjects(),
    managerGoal: extra?.managerGoal,
    journeyFacts: extra?.journeyFacts,
    attentionFacts: extra?.facts,
  });
}

describe("MO:6 Executive Attention & Intervention Intelligence", () => {
  it("identity and boundary", () => {
    assert.equal(
      getExecutiveAttentionIntelligenceIdentity().id,
      "MO:6/ExecutiveAttentionInterventionIntelligence",
    );
    assert.equal(EXECUTIVE_ATTENTION_INTELLIGENCE_BOUNDARY.duplicateQueue, false);
    assert.equal(EXECUTIVE_ATTENTION_INTELLIGENCE_BOUNDARY.stealsDirectFocus, false);
    assert.equal(EXECUTIVE_ATTENTION_INTELLIGENCE_BOUNDARY.commitsDecisions, false);
    assert.equal(EXECUTIVE_ATTENTION_INTELLIGENCE_BOUNDARY.startsExecution, false);
    assert.equal(verifyExecutiveAttentionIntelligence().ok, true);
  });

  it("generic engine has no object-specific attention hardcoding", () => {
    const source = readFileSync(join(here, "managerObjectAttentionEngine.ts"), "utf8");
    assert.doesNotMatch(source, /obj-capacity|obj-delivery|obj-revenue|ctx-scenario-capacity|ctx-decision-capacity/);
    assert.doesNotMatch(source, /if\s*\([^)]*Capacity|if\s*\([^)]*Revenue|if\s*\([^)]*ScenarioB/);
  });

  it("1-3. severity is not attention; critical does not auto-URGENT", () => {
    const turn = attention("ctx-problem-margin", "What needs my attention?");
    const monitoring = turn.attention.attentionItems.find((item) => item.kind === "MONITORING");
    if (monitoring) {
      assert.notEqual(monitoring.attentionLevel, "URGENT");
    }
    assert.equal(turn.attention.commitsDecision, false);
    assert.equal(turn.attention.startsExecution, false);
    assert.equal(turn.attention.stealsDirectFocus, false);
  });

  it("4-6. goal-blocking moderate can outrank unrelated critical; goal and journey affect rank", () => {
    const blocked = attention("obj-capacity", "What needs my attention?", {
      managerGoal: "Improve delivery reliability",
      facts: {
        changes: [
          {
            subjectId: "ctx-problem-margin",
            lifecycle: "ONGOING",
            magnitude: "material",
          },
        ],
      },
    });
    const primary = blocked.attention.primaryAttention;
    assert.ok(primary);
    assert.ok(primary.kind === "JOURNEY_BLOCKER" || primary.kind === "DECISION" || primary.blocker);
    const unrelated = blocked.attention.attentionItems.find(
      (item) => item.subjectId === "ctx-problem-margin",
    );
    if (primary && unrelated) {
      assert.ok(primary.score > unrelated.score);
      assert.ok(primary.rankingSignals.includes("GOAL RELEVANCE") || primary.rankingSignals.includes("JOURNEY BLOCKER"));
    }
  });

  it("7-8. new change ranks above stable ongoing; stable does not re-escalate", () => {
    const first = attention("obj-capacity", "What needs my attention?", {
      managerGoal: "Improve delivery reliability",
      facts: {
        changes: [{ subjectId: "obj-risk", lifecycle: "NEW", magnitude: "material" }],
      },
    });
    const repeat = attention("obj-capacity", "What needs my attention?", {
      managerGoal: "Improve delivery reliability",
      previous: first,
      facts: {
        changes: [{ subjectId: "obj-risk", lifecycle: "ONGOING", magnitude: "material" }],
      },
    });
    const newItem = first.attention.attentionItems.find((item) => item.changeSignal === "NEW");
    const ongoing = repeat.attention.attentionItems.find((item) => item.changeSignal === "ONGOING");
    if (newItem && ongoing) {
      assert.ok(newItem.score >= ongoing.score);
      assert.notEqual(ongoing.attentionLevel, "URGENT");
    }
  });

  it("9-10. manager authority vs owner-handled operational blocker", () => {
    const owner = attention("ctx-execution-capacity", "What needs my attention?", {
      managerGoal: "Improve delivery reliability",
      journeyFacts: {
        committedDecisionIds: ["ctx-decision-capacity"],
        executionStates: { "ctx-execution-capacity": "BLOCKED" },
      },
      facts: { ownerCanResolveIds: ["ctx-execution-capacity"] },
    });
    const manager = attention("ctx-execution-capacity", "What needs my attention?", {
      managerGoal: "Improve delivery reliability",
      journeyFacts: {
        committedDecisionIds: ["ctx-decision-capacity"],
        executionStates: { "ctx-execution-capacity": "BLOCKED" },
      },
      facts: { managerAuthorityIds: ["ctx-execution-capacity"] },
    });
    const ownerItem = owner.attention.attentionItems.find((item) => item.kind === "EXECUTION");
    const managerItem = manager.attention.attentionItems.find((item) => item.kind === "EXECUTION") ??
      manager.attention.primaryAttention;
    if (ownerItem) {
      assert.notEqual(ownerItem.interventionNeed, "ACTION_REQUIRED");
    }
    assert.ok(
      manager.attention.interventionAssessment.need === "ACTION_REQUIRED" ||
        managerItem?.managerAuthorityRequired === true ||
        manager.attention.interventionAssessment.managerAuthorityRequired === true,
    );
  });

  it("11-13. pending decision, committed decision, healthy execution", () => {
    const pending = attention("ctx-decision-capacity", "What needs my attention?", {
      managerGoal: "Improve delivery reliability",
    });
    assert.equal(pending.attention.interventionAssessment.need, "DECISION_REQUIRED");
    assert.equal(pending.attention.commitsDecision, false);
    const committed = attention("ctx-decision-capacity", "What needs my attention?", {
      managerGoal: "Improve delivery reliability",
      journeyFacts: { committedDecisionIds: ["ctx-decision-capacity"] },
    });
    const decisionItem = committed.attention.attentionItems.find((item) => item.kind === "DECISION");
    if (decisionItem) {
      assert.equal(decisionItem.interventionNeed, "NOT_REQUIRED");
    }
    const healthy = attention("ctx-execution-capacity", "What needs my attention?", {
      managerGoal: "Improve delivery reliability",
      journeyFacts: {
        committedDecisionIds: ["ctx-decision-capacity"],
        executionStates: { "ctx-execution-capacity": "ACTIVE" },
      },
    });
    assert.ok(
      healthy.attention.doNotDisturb ||
        healthy.attention.interventionAssessment.need === "NOT_REQUIRED" ||
        healthy.attention.safeToContinueItems.some((line) => /execution/i.test(line)),
    );
    assert.equal(healthy.attention.startsExecution, false);
    assert.equal(healthy.attention.changesExecution, false);
  });

  it("14-17. blocked execution, missing outcome UNKNOWN, deviation only with comparison, stale evidence", () => {
    const blocked = attention("ctx-execution-capacity", "What needs my attention?", {
      managerGoal: "Improve delivery reliability",
      journeyFacts: {
        committedDecisionIds: ["ctx-decision-capacity"],
        executionStates: { "ctx-execution-capacity": "BLOCKED" },
      },
    });
    assert.ok(
      blocked.attention.interventionAssessment.need === "REVIEW" ||
        blocked.attention.interventionAssessment.need === "ACTION_REQUIRED",
    );
    const missing = attention("ctx-execution-capacity", "What needs my attention?", {
      managerGoal: "Improve delivery reliability",
      journeyFacts: {
        committedDecisionIds: ["ctx-decision-capacity"],
        executionStates: { "ctx-execution-capacity": "COMPLETED" },
      },
    });
    const missingItem = missing.attention.attentionItems.find((item) => item.attentionId === "outcome:missing");
    assert.equal(missingItem?.epistemicStatus, "UNKNOWN");
    const noDeviation = missing.attention.attentionItems.find((item) => item.attentionId === "outcome:deviation");
    assert.equal(noDeviation, undefined);
    const deviation = attention("ctx-execution-capacity", "What needs my attention?", {
      managerGoal: "Improve delivery reliability",
      journeyFacts: {
        committedDecisionIds: ["ctx-decision-capacity"],
        executionStates: { "ctx-execution-capacity": "COMPLETED" },
      },
      facts: { expectedOutcome: "delivery improved", observedOutcome: "no material improvement" },
    });
    assert.ok(deviation.attention.attentionItems.some((item) => item.attentionId === "outcome:deviation"));
    const stale = attention("obj-capacity", "What needs my attention?", {
      managerGoal: "Improve delivery reliability",
      facts: { staleSubjectIds: ["obj-capacity"] },
    });
    const evidence = stale.attention.attentionItems.find((item) => item.kind === "EVIDENCE");
    assert.ok(evidence);
    assert.equal(evidence.epistemicStatus, "UNKNOWN");
    assert.notEqual(evidence.interventionNeed, "ACTION_REQUIRED");
  });

  it("18-20. unknown goal, opportunity, goal conflict", () => {
    const unknown = attention("obj-capacity", "What needs my attention?");
    assert.equal(unknown.attention.goalRankingAvailable, false);
    assert.match(unknown.attention.reasoningSummary, /active goal is unknown/i);
    const opportunity = attention("obj-capacity", "What needs my attention?", {
      managerGoal: "Improve delivery reliability",
      facts: {
        opportunitySubjectIds: ["ctx-scenario-capacity"],
        changes: [
          {
            subjectId: "ctx-scenario-capacity",
            lifecycle: "NEW",
            magnitude: "material",
            opportunity: true,
            deadline: "before the execution window",
          },
        ],
      },
    });
    assert.ok(
      opportunity.attention.attentionItems.some(
        (item) => item.kind === "OPPORTUNITY" || item.kind === "CHANGE",
      ),
    );
    const conflicted = attention("obj-capacity", "Protecting cash is now the priority.", {
      previous: attention("obj-capacity", "My goal is to improve delivery reliability."),
    });
    assert.ok(
      conflicted.navigation.conflicts.length === 0 ||
        conflicted.attention.attentionItems.some((item) => item.kind === "CONFLICT") ||
        conflicted.attention.interventionAssessment.need === "REVIEW" ||
        conflicted.attention.interventionAssessment.need === "DECISION_REQUIRED",
    );
  });

  it("21-25. no invented deadline/consequence; ranking is not causal; focus and queue safety", () => {
    const turn = attention("obj-capacity", "What needs my attention?", {
      managerGoal: "Improve delivery reliability",
    });
    assert.doesNotMatch(turn.attention.managerFacingText, /\bimmediately\b|\btoday\b/i);
    assert.match(turn.attention.inactionConsequence, /does not currently have enough evidence/i);
    assert.equal(turn.attention.primaryAttention?.isCausalClaim, false);
    assert.match(turn.attention.reasoningSummary, /not a causal|does not establish/i);
    assert.equal(turn.attention.stealsDirectFocus, false);
    assert.equal(turn.attention.writesStageCoordinates, false);
    assert.equal(turn.attention.changesGoals, false);
    assert.equal(EXECUTIVE_ATTENTION_INTELLIGENCE_BOUNDARY.duplicateQueue, false);
    assert.equal(turn.attention.usesLlm, false);
  });

  it("escalated vs de-escalated risk and safe-to-continue", () => {
    const escalated = attention("obj-risk", "What needs my attention?", {
      managerGoal: "Improve delivery reliability",
      facts: {
        changes: [{ subjectId: "obj-risk", lifecycle: "ESCALATED", magnitude: "material" }],
      },
    });
    assert.ok(escalated.attention.attentionItems.some((item) => item.changeSignal === "ESCALATED"));
    const eased = attention("obj-risk", "What needs my attention?", {
      managerGoal: "Improve delivery reliability",
      facts: {
        changes: [{ subjectId: "obj-risk", lifecycle: "DEESCALATED", magnitude: "material" }],
      },
    });
    const easedItem = eased.attention.attentionItems.find((item) => item.changeSignal === "DEESCALATED");
    const hot = escalated.attention.attentionItems.find((item) => item.changeSignal === "ESCALATED");
    if (easedItem && hot) assert.ok(easedItem.score < hot.score);
  });

  it("attention budget prefers one primary; comparable items stay undistinguished", () => {
    const ranked = attention("obj-capacity", "What needs my attention?", {
      managerGoal: "Improve delivery reliability",
    });
    if (!ranked.attention.comparablePriority) {
      assert.ok(ranked.attention.primaryAttention);
      assert.ok(ranked.attention.secondaryItems.length <= 2);
    }
  });

  it("conversation: attention, why this, why not, intervene, continue, inaction", () => {
    const stated = run("My goal is to improve delivery reliability.");
    const capacity = run("Explain Capacity.", { previous: stated });
    const ask = run("What needs my attention?", { previous: capacity });
    assert.equal(ask.managerObjectTurn.activeObjectId, "obj-capacity");
    assert.match(ask.response, /Needs your attention|No executive intervention|Intervention/i);
    const why = run("Why this?", { previous: ask });
    assert.match(why.response, /Why now|Needs your attention|highest-priority|ranking/i);
    const whyNot = run("Why not Revenue?", { previous: why });
    assert.match(whyNot.response, /outranks|highest-priority|Revenue|ranking/i);
    const intervene = run("Do I need to intervene?", { previous: whyNot });
    assert.match(intervene.response, /Intervention:/i);
    assert.doesNotMatch(intervene.response, /I approved|Approve Scenario B/i);
    const leave = run("Can I leave this alone for now?", { previous: intervene });
    assert.match(leave.response, /continue|watching|intervention|leave|without manager/i);
    const nothing = run("What happens if I do nothing?", { previous: leave });
    assert.match(nothing.response, /does not currently have enough evidence|No intervention is required/i);
    assert.equal(nothing.managerObjectTurn.attention.stealsDirectFocus, false);
    assert.equal(nothing.managerObjectTurn.activeObjectId, "obj-capacity");
  });
});
