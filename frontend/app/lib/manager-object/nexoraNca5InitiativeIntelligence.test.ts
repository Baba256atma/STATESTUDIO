/**
 * NCA:5 — Proactive executive advisor and conversational-initiative tests A–Y.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { freezeConversationalSubjectRecord } from "../conversational-control/conversationalSubjectRegistry.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { createEmptyManagerObjectSession } from "./managerObjectActive.ts";
import { projectManagerObjectConversationalSubjects } from "./managerObjectCatalog.ts";
import {
  NEXORA_NCA5_BOUNDARY,
  applyNca5StrategyToResponse,
  attachInitiativeSnapshot,
  createProactiveExecutiveSignal,
  evaluateNca5InitiativeStrategy,
  getNexoraNca5Identity,
  verifyNexoraNca5,
} from "./nexoraNca5InitiativeIntelligence.ts";
import { createEmptyNcaConversationState } from "./nexoraNca2ConversationState.ts";
import type { NcaInitiativeSnapshot } from "./nexoraNca5InitiativeIntelligenceTypes.ts";
import type { ExecutiveQuestionStrategy } from "./nexoraNca3QuestionIntelligenceTypes.ts";
import type { ExecutiveAdvisoryStrategy } from "./nexoraNca4AdvisoryIntelligenceTypes.ts";

function catalog() {
  return getDefaultNexoraMVPObjectInteractionCatalog();
}

function subjects() {
  return Object.freeze([
    ...projectManagerObjectConversationalSubjects(catalog()),
    freezeConversationalSubjectRecord({
      subjectId: "obj-margin-nca5",
      subjectKind: "object",
      canonicalName: "Margin",
      aliases: Object.freeze(["Margin"]),
      businessKey: "obj-margin-nca5",
    }),
  ]);
}

function run(
  utterance: string,
  previous?: ReturnType<typeof executeNexoraConversationalExperience>,
  extra?: {
    readonly initiativeSignals?: Parameters<typeof executeNexoraConversationalExperience>[0]["initiativeSignals"];
    readonly conversationImportance?: Parameters<typeof executeNexoraConversationalExperience>[0]["conversationImportance"];
  },
) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: subjects(),
    runtimeState:
      previous?.nextRuntimeState ??
      createInitialNexoraMVPObjectInteractionState({
        workspace: "overview",
        presentationState: "minimum",
        environmentIntent: "neutral",
      }),
    catalog: catalog(),
    previousManagerObjectSession:
      previous?.managerObjectTurn.session ?? createEmptyManagerObjectSession(),
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    messageIdSeed: `nca5-${utterance}`,
    initiativeSignals: extra?.initiativeSignals,
    conversationImportance: extra?.conversationImportance,
  });
}

function deliveryDrop(from: number, to: number, extras?: { readonly critical?: boolean; readonly nextStep?: string }) {
  return createProactiveExecutiveSignal({
    id: `delivery:${from}:${to}`,
    family: "GOAL_DEVIATION",
    source: "caller",
    subjectId: "delivery",
    subjectLabel: "Delivery",
    observation: `Delivery moved from ${from} to ${to}.`,
    previousValue: from,
    currentValue: to,
    targetValue: 96,
    significance: Math.abs(from - to) >= 3 ? 0.88 : 0.12,
    relevance: 0.95,
    urgency: Math.abs(from - to) >= 3 ? 0.78 : 0.2,
    novelty: 1,
    actionability: Math.abs(from - to) >= 3 ? 0.8 : 0.15,
    confidence: 0.9,
    nextStep: extras?.nextStep ?? (Math.abs(from - to) >= 3 ? "Investigate whether capacity is still sufficient." : null),
    critical: extras?.critical ?? false,
  });
}

function evaluate(signals: readonly ReturnType<typeof createProactiveExecutiveSignal>[], extra?: {
  readonly utterance?: string;
  readonly conversation?: ReturnType<typeof createEmptyNcaConversationState> | null;
  readonly conversationImportance?: "LOW" | "NORMAL" | "HIGH" | "CRITICAL";
  readonly nca3?: ExecutiveQuestionStrategy | null;
  readonly nca4?: ExecutiveAdvisoryStrategy | null;
  readonly managerTurnPresent?: boolean;
}) {
  return evaluateNca5InitiativeStrategy({
    utterance: extra?.utterance ?? "",
    conversation: extra?.conversation ?? createEmptyNcaConversationState(),
    signals,
    conversationImportance: extra?.conversationImportance,
    nca3: extra?.nca3 ?? null,
    nca4: extra?.nca4 ?? null,
    managerTurnPresent: extra?.managerTurnPresent ?? false,
  });
}

function withSnapshot(
  snapshot: NcaInitiativeSnapshot,
  keys?: { readonly dismissed?: readonly string[]; readonly suppressed?: readonly string[] },
) {
  return Object.freeze({
    ...createEmptyNcaConversationState(),
    lastInitiativeSnapshot: snapshot,
    dismissedInitiativeKeys: Object.freeze([...(keys?.dismissed ?? [])]),
    suppressedInitiativeKeys: Object.freeze([...(keys?.suppressed ?? [])]),
  });
}

describe("NCA:5 Proactive Executive Advisor & Conversational Initiative", () => {
  it("identity does not create a second alert, monitor, or decision engine", () => {
    assert.equal(
      getNexoraNca5Identity().id,
      "NCA:5/ProactiveExecutiveAdvisorConversationalInitiativeIntelligence",
    );
    assert.equal(NEXORA_NCA5_BOUNDARY.createsSecondAlertQueue, false);
    assert.equal(NEXORA_NCA5_BOUNDARY.duplicatesMo6, false);
    assert.equal(NEXORA_NCA5_BOUNDARY.commitsDecision, false);
    assert.equal(NEXORA_NCA5_BOUNDARY.startsExecution, false);
    assert.equal(NEXORA_NCA5_BOUNDARY.usesLiveLlm, false);
    assert.equal(verifyNexoraNca5().ok, true);
  });

  it("A. Material goal deviation initiates", () => {
    const result = evaluate([deliveryDrop(95, 89)]);
    assert.equal(result.shouldInitiate, true);
    assert.match(result.response ?? "", /Delivery moved from 95 to 89/i);
  });

  it("B. Minor movement stays silent", () => {
    const result = evaluate([deliveryDrop(95.9, 95.8)]);
    assert.equal(result.shouldInitiate, false);
    assert.equal(result.decision.behavior, "SILENT");
  });

  it("C. Irrelevant non-critical change does not interrupt", () => {
    const result = evaluate(
      [
        createProactiveExecutiveSignal({
          id: "inventory-minor",
          family: "MATERIAL_CHANGE",
          subjectId: "inventory",
          subjectLabel: "Inventory",
          observation: "Inventory moved from 40 to 41.",
          previousValue: 40,
          currentValue: 41,
          significance: 0.2,
          relevance: 0.15,
          nextStep: "Monitor inventory.",
        }),
      ],
      { utterance: "Explain Margin.", managerTurnPresent: true, conversationImportance: "NORMAL" },
    );
    assert.equal(result.shouldInitiate, false);
  });

  it("D. Critical unrelated risk may override goal relevance", () => {
    const result = evaluate([
      createProactiveExecutiveSignal({
        id: "cash-critical",
        family: "RISK_ESCALATION",
        subjectId: "cash",
        subjectLabel: "Cash",
        observation: "Cash position deteriorated into a critical range.",
        significance: 0.95,
        relevance: 0.2,
        urgency: 0.95,
        actionability: 0.8,
        critical: true,
        nextStep: "Review liquidity before the next commitment.",
      }),
    ]);
    assert.equal(result.shouldInitiate, true);
    assert.equal(result.decision.priority, "CRITICAL");
  });

  it("E. Duplicate signal with no material change stays silent", () => {
    const first = evaluate([deliveryDrop(95, 89)]);
    const second = evaluate([deliveryDrop(95, 89)], {
      conversation: withSnapshot(first.snapshot!),
    });
    assert.equal(second.shouldInitiate, false);
  });

  it("F. Material worsening after a prior surface initiates again", () => {
    const first = evaluate([deliveryDrop(95, 91)]);
    const second = evaluate([deliveryDrop(91, 86)], {
      conversation: withSnapshot(first.snapshot!),
    });
    assert.equal(second.shouldInitiate, true);
    assert.match(second.response ?? "", /86/);
  });

  it("G. Multiple signals surface only the highest-value issue", () => {
    const result = evaluate([
      deliveryDrop(95.5, 95.4),
      deliveryDrop(95, 88),
      createProactiveExecutiveSignal({
        id: "margin-minor",
        family: "MATERIAL_CHANGE",
        subjectId: "margin",
        subjectLabel: "Margin",
        observation: "Margin ticked down slightly.",
        significance: 0.3,
        relevance: 0.4,
        nextStep: "Watch margin.",
      }),
    ]);
    assert.equal(result.shouldInitiate, true);
    assert.equal(result.decision.signal?.subjectId, "delivery");
    assert.equal(result.decision.competingCount >= 1, true);
  });

  it("H. Decision confirmation is not interrupted by a moderate unrelated signal", () => {
    const result = evaluate(
      [
        createProactiveExecutiveSignal({
          id: "inventory-mod",
          family: "MATERIAL_CHANGE",
          subjectId: "inventory",
          subjectLabel: "Inventory",
          observation: "Inventory is slightly tighter.",
          significance: 0.55,
          relevance: 0.3,
          urgency: 0.4,
          actionability: 0.5,
          nextStep: "Review inventory later.",
        }),
      ],
      {
        utterance: "Confirm the decision.",
        managerTurnPresent: true,
        conversationImportance: "HIGH",
      },
    );
    assert.equal(result.shouldInitiate, false);
  });

  it("I. Invalidated assumption during confirmation justifies interruption", () => {
    const result = evaluate(
      [
        createProactiveExecutiveSignal({
          id: "assumption",
          family: "ASSUMPTION_INVALIDATION",
          subjectId: "demand",
          subjectLabel: "Demand",
          observation: "Demand is normalizing, which undermines the expansion assumption.",
          significance: 0.9,
          relevance: 0.9,
          urgency: 0.9,
          actionability: 0.85,
          critical: true,
          nextStep: "Reassess before committing.",
        }),
      ],
      {
        utterance: "Confirm the decision.",
        managerTurnPresent: true,
        conversationImportance: "HIGH",
      },
    );
    assert.equal(result.shouldInitiate, true);
    assert.equal(result.decision.interruption.justified, true);
  });

  it("J. NCA:5 can initiate while NCA:3 supplies the question", () => {
    const result = evaluate([deliveryDrop(95, 89)], {
      nca3: {
        identity: "NCA:3/ClarificationInformationGapExecutiveQuestionIntelligence",
        mode: "ASK",
        shouldAsk: true,
        sufficiency: "INSUFFICIENT",
        gap: null,
        gaps: Object.freeze([]),
        question: "Is the demand increase expected to continue?",
        purpose: "CONFIRM_FACT",
        expectedInformation: "demand persistence",
        reason: "Persistence is still unknown.",
        fallbackIfUnknown: "Proceed with uncertainty.",
        recomputeAfterAnswer: true,
      },
    });
    assert.equal(result.shouldInitiate, true);
    assert.equal(result.decision.behavior, "ASK");
    assert.match(result.response ?? "", /expected to continue/i);
  });

  it("K. NCA:5 surfaces a revised NCA:4 recommendation", () => {
    const result = evaluateNca5InitiativeStrategy({
      conversation: createEmptyNcaConversationState(),
      managerTurnPresent: false,
      nca4: {
        identity: "NCA:4/ExecutiveAdvisoryReasoningRecommendationDialogueIntelligence",
        move: "NEW_EVIDENCE",
        shouldAdvise: true,
        position: {
          identity: "NCA:4/ExecutiveAdvisoryReasoningRecommendationDialogueIntelligence",
          subject: "Capacity",
          goal: "Protect delivery reliability",
          question: "What should we do?",
          status: "REVISED",
          recommendation: {
            optionId: "committed-change",
            optionLabel: "permanent expansion",
            strength: "RECOMMEND",
          },
          rationale: Object.freeze([]),
          evidence: Object.freeze([]),
          assumptions: Object.freeze([]),
          uncertainties: Object.freeze([]),
          constraints: Object.freeze([]),
          tradeoffs: Object.freeze([]),
          alternatives: Object.freeze([]),
          confidence: { level: "MODERATE", reasons: Object.freeze([]) },
          sensitivity: Object.freeze([]),
          counterargument: null,
          revisionNote: "Demand now looks persistent.",
          commitsDecision: false,
          startsExecution: false,
        },
        snapshot: null,
        response: "I now recommend permanent expansion.",
        reason: "Evidence changed.",
      },
    });
    assert.equal(result.shouldInitiate, true);
    assert.equal(result.decision.behavior, "RECOMMEND");
    assert.match(result.response ?? "", /revise my recommendation/i);
  });

  it("L. Stable advice is not claimed as a recommendation change", () => {
    const result = evaluate([deliveryDrop(95.2, 95.1)]);
    assert.doesNotMatch(result.response ?? "", /revise my recommendation/i);
  });

  it("M. Execution drift is an initiative candidate", () => {
    const result = evaluate([
      createProactiveExecutiveSignal({
        id: "exec-drift",
        family: "EXECUTION_DRIFT",
        subjectId: "backlog",
        subjectLabel: "Backlog",
        observation: "Backlog is still rising despite the current execution.",
        significance: 0.8,
        relevance: 0.86,
        urgency: 0.7,
        actionability: 0.75,
        nextStep: "Review the capacity assumption before continuing unchanged.",
      }),
    ]);
    assert.equal(result.shouldInitiate, true);
    assert.equal(result.decision.behavior, "REASSESS");
  });

  it("N. Positive outcome may be surfaced", () => {
    const result = evaluate([
      createProactiveExecutiveSignal({
        id: "outcome-up",
        family: "OUTCOME_CHANGE",
        subjectId: "delivery",
        subjectLabel: "Delivery",
        observation: "Delivery improved from 91 to 95.",
        previousValue: 91,
        currentValue: 95,
        significance: 0.8,
        relevance: 0.9,
        urgency: 0.4,
        actionability: 0.5,
        positive: true,
        nextStep: "Keep monitoring the temporary-capacity effect.",
      }),
    ]);
    assert.equal(result.shouldInitiate, true);
    assert.equal(result.decision.behavior, "INFORM");
  });

  it("O. Actionable opportunity may be recommended", () => {
    const result = evaluate([
      createProactiveExecutiveSignal({
        id: "opp",
        family: "OPPORTUNITY",
        subjectId: "external-capacity",
        subjectLabel: "External capacity",
        observation: "External capacity is now cheaper than at the last comparison.",
        significance: 0.76,
        relevance: 0.8,
        urgency: 0.6,
        actionability: 0.8,
        nextStep: "Reopen the scenario comparison.",
      }),
    ]);
    assert.equal(result.shouldInitiate, true);
    assert.equal(result.decision.behavior, "RECOMMEND");
  });

  it("P. Unfinished thread can become a follow-up", () => {
    const conversation = Object.freeze({
      ...createEmptyNcaConversationState(),
      threads: Object.freeze([
        Object.freeze({
          id: "thread-capacity",
          topic: Object.freeze({ id: "capacity", label: "Capacity Investigation" }),
          subject: Object.freeze({ id: "capacity", name: "Capacity", kind: "object" }),
          goal: "Protect delivery reliability",
          purpose: "Investigate capacity",
          state: "SUSPENDED" as const,
          pendingQuestion: null,
          lastAnswer: null,
          unresolvedNeed: "demand persistence",
          startedAtTurn: 1,
          lastActiveAtTurn: 2,
          pendingExpired: false,
        }),
      ]),
    });
    const result = evaluateNca5InitiativeStrategy({
      conversation,
      managerTurnPresent: false,
    });
    assert.equal(result.shouldInitiate, true);
    assert.equal(result.decision.behavior, "FOLLOW_UP");
  });

  it("Q. Manager dismissal suppresses immediate repeat", () => {
    const first = evaluate([deliveryDrop(95, 89)]);
    const dismissed = attachInitiativeSnapshot(
      withSnapshot(first.snapshot!),
      first,
      "Not now.",
    );
    const second = evaluate([deliveryDrop(95, 89)], { conversation: dismissed });
    assert.equal(second.shouldInitiate, false);
  });

  it("R. Critical worsening after dismissal may surface again", () => {
    const first = evaluate([deliveryDrop(95, 91)]);
    const dismissed = attachInitiativeSnapshot(
      withSnapshot(first.snapshot!),
      first,
      "Not now.",
    );
    const second = evaluate([deliveryDrop(91, 82, { critical: true })], {
      conversation: dismissed,
    });
    assert.equal(second.shouldInitiate, true);
    assert.match(second.reason, /worse|critical/i);
  });

  it("S. Manager's current request wins over moderate initiative", () => {
    const result = run("Explain Inventory.", undefined, {
      initiativeSignals: [deliveryDrop(95.2, 94.6)],
      conversationImportance: "NORMAL",
    });
    assert.equal(result.nca5Strategy?.decision.interruption.justified, false);
    assert.doesNotMatch(result.response.slice(0, 40), /Before we continue/i);
  });

  it("T. Non-actionable low-value change stays silent", () => {
    const result = evaluate([
      createProactiveExecutiveSignal({
        id: "noise",
        family: "MATERIAL_CHANGE",
        subjectId: "quality",
        subjectLabel: "Quality",
        observation: "Quality ticked by a tenth of a point.",
        significance: 0.22,
        relevance: 0.4,
        actionability: 0.1,
      }),
    ]);
    assert.equal(result.shouldInitiate, false);
  });

  it("U. Equivalent evaluation across objects", () => {
    const labels = ["Delivery", "Risk", "Margin", "Inventory", "Project", "Quality"] as const;
    for (const label of labels) {
      const result = evaluate([
        createProactiveExecutiveSignal({
          id: `${label}-drop`,
          family: "MATERIAL_CHANGE",
          subjectId: label.toLowerCase(),
          subjectLabel: label,
          observation: `${label} moved from 90 to 82.`,
          previousValue: 90,
          currentValue: 82,
          significance: 0.85,
          relevance: 0.8,
          urgency: 0.7,
          actionability: 0.75,
          nextStep: `Investigate ${label}.`,
        }),
      ]);
      assert.equal(result.shouldInitiate, true, label);
    }
  });

  it("V. Advice does not write Decision state", () => {
    const result = run("Delivery dropped from 95 to 89.", undefined, {
      initiativeSignals: [deliveryDrop(95, 89)],
    });
    assert.equal(result.nextDecisionSession, null);
    assert.equal(result.nca5Strategy?.commitsDecision, false);
  });

  it("W. Advice does not start Execution", () => {
    const result = run("Delivery dropped from 95 to 89.", undefined, {
      initiativeSignals: [deliveryDrop(95, 89)],
    });
    assert.equal(result.nca5Strategy?.startsExecution, false);
  });

  it("X. Presentation intent is semantic, not a card implementation", () => {
    const result = evaluate([deliveryDrop(95, 89)]);
    assert.equal(result.strategy.presentationIntent.kind, "information-card-ready");
    assert.ok(result.strategy.presentationIntent.subject);
    assert.doesNotMatch(JSON.stringify(result.strategy.presentationIntent), /geometry|card-layout/i);
  });

  it("Y. Timeline intent is semantic, not a Timeline implementation", () => {
    const result = evaluate([deliveryDrop(95, 89)]);
    assert.ok(result.strategy.timelineIntent);
    assert.equal(result.strategy.timelineIntent?.eventKind, "GOAL_DEVIATION");
    assert.doesNotMatch(JSON.stringify(result.strategy.timelineIntent), /gantt|timeline-ui/i);
  });

  it("callable evaluation works without a manager utterance", () => {
    const result = evaluateNca5InitiativeStrategy({
      signals: [deliveryDrop(95, 89)],
      managerTurnPresent: false,
    });
    assert.equal(result.shouldInitiate, true);
  });

  it("apply preserves source when silent", () => {
    const silent = evaluate([deliveryDrop(95.9, 95.8)]);
    assert.equal(
      applyNca5StrategyToResponse({
        source: "Inventory is currently stable.",
        strategy: silent,
        locked: false,
      }),
      "Inventory is currently stable.",
    );
  });
});
