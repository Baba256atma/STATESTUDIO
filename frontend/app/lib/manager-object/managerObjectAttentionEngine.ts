/**
 * MO:6 — Executive Attention & Intervention Intelligence.
 * Interprets MO:1–MO:5 + existing change/runtime signals. Does not steal focus.
 */

import { collectManagerObjectContext } from "./managerObjectContext.ts";
import type { ManagerObjectContext } from "./managerObjectContext.ts";
import type { ExecutiveObjectExplanation } from "./managerObjectExplainTypes.ts";
import type { ExecutiveObjectExploration } from "./managerObjectExplorationTypes.ts";
import type { ExecutiveGoalNavigation } from "./managerObjectGoalTypes.ts";
import type { ExecutiveJourneyIntelligence } from "./managerObjectJourneyTypes.ts";
import {
  EXECUTIVE_ATTENTION_INTELLIGENCE_BOUNDARY,
  executiveAttentionIntelligenceIdentity,
  type AttentionItemKind,
  type AttentionLevel,
  type AttentionLifecycle,
  type ExecutiveAttentionIntelligence,
  type ExecutiveAttentionItem,
  type ExecutiveAttentionSignal,
  type ExecutiveInterventionAssessment,
  type InterventionNeed,
} from "./managerObjectAttentionTypes.ts";

export {
  EXECUTIVE_ATTENTION_INTELLIGENCE_BOUNDARY,
  executiveAttentionIntelligenceIdentity,
} from "./managerObjectAttentionTypes.ts";
export type {
  ExecutiveAttentionIntelligence,
  ExecutiveAttentionSignal,
} from "./managerObjectAttentionTypes.ts";

export function getExecutiveAttentionIntelligenceIdentity(): {
  readonly id: typeof executiveAttentionIntelligenceIdentity;
  readonly version: "1.0.0";
  readonly namespace: "nexora.manager-object.executive-attention-intelligence";
} {
  return Object.freeze({
    id: executiveAttentionIntelligenceIdentity,
    version: "1.0.0" as const,
    namespace: "nexora.manager-object.executive-attention-intelligence" as const,
  });
}

export type ExecutiveAttentionFacts = {
  readonly changes?: readonly ExecutiveAttentionSignal[];
  readonly staleSubjectIds?: readonly string[];
  readonly ownerCanResolveIds?: readonly string[];
  readonly managerAuthorityIds?: readonly string[];
  readonly opportunitySubjectIds?: readonly string[];
  readonly expectedOutcome?: string | null;
  readonly observedOutcome?: string | null;
};

export function composeExecutiveAttentionIntelligence(input: {
  readonly context: ManagerObjectContext;
  readonly explanation: ExecutiveObjectExplanation;
  readonly exploration: ExecutiveObjectExploration;
  readonly navigation: ExecutiveGoalNavigation;
  readonly journey: ExecutiveJourneyIntelligence;
  readonly previousPrimaryId?: string | null;
  readonly previousLevel?: AttentionLevel | null;
  readonly facts?: ExecutiveAttentionFacts;
}): ExecutiveAttentionIntelligence {
  const facts = input.facts ?? {};
  const goalKnown = input.navigation.goal.source !== "unknown";
  const ranked = collectCandidates(input, facts).sort(
    (left, right) => right.score - left.score || left.label.localeCompare(right.label),
  );
  const visible = ranked.filter((item) => item.attentionLevel !== "NONE");
  const comparable =
    visible.length >= 2 &&
    Math.abs((visible[0]?.score ?? 0) - (visible[1]?.score ?? 0)) < 8;
  const primary = comparable ? null : visible[0] ?? null;
  const secondary = Object.freeze(visible.slice(primary ? 1 : 0, primary ? 3 : 2));
  const attentionState = resolveOverallLevel(visible, primary);
  const intervention = resolveOverallIntervention(primary, visible, input.journey);
  const safe = collectSafeToContinue(input, facts, visible);
  const doNotDisturb =
    attentionState === "NONE" ||
    (attentionState === "WATCH" && intervention.need === "NOT_REQUIRED");

  return Object.freeze({
    engineId: executiveAttentionIntelligenceIdentity,
    attentionState,
    attentionItems: Object.freeze(visible),
    primaryAttention: primary,
    secondaryItems: secondary,
    comparablePriority: comparable,
    interventionAssessment: intervention,
    safeToContinueItems: safe,
    doNotDisturb,
    goalRankingAvailable: goalKnown,
    stealsDirectFocus: false,
    inactionConsequence: composeInaction(input.journey, primary),
    unknowns: collectUnknowns(input, facts),
    reasoningSummary: composeReasoning(primary, visible, comparable, goalKnown),
    managerFacingText: composeFacing({
      attentionState,
      primary,
      secondary,
      comparable,
      intervention,
      safe,
      doNotDisturb,
      goalKnown,
    }),
    usesLlm: false,
    commitsDecision: false,
    startsExecution: false,
    changesExecution: false,
    changesGoals: false,
    writesStageCoordinates: false,
  });
}

export function isExecutiveAttentionUtterance(utterance: string): boolean {
  const normalized = utterance.toLowerCase().replace(/[?!.,]/g, " ").replace(/\s+/g, " ").trim();
  return /what needs my attention|what should i pay attention to|what is most important right now|why this(?:\s+instead)?$|why not |do i need to intervene|do i need to do anything|should i intervene|what can continue without me|can this continue without me|can i leave this alone|what became worse|what became better|is anything getting worse|is anything getting better|should i review this|what happens if i (?:do nothing|don.?t)|what should i look at first|do we have any urgent opportunities|is the evidence current|is execution okay|does this need my decision/.test(
    normalized,
  );
}

export function verifyExecutiveAttentionIntelligence(): { readonly ok: true } {
  if (
    getExecutiveAttentionIntelligenceIdentity().id !==
    "MO:6/ExecutiveAttentionInterventionIntelligence"
  ) {
    throw new Error("MO:6 identity mismatch");
  }
  if (EXECUTIVE_ATTENTION_INTELLIGENCE_BOUNDARY.stealsDirectFocus) {
    throw new Error("MO:6 must not steal direct focus");
  }
  if (EXECUTIVE_ATTENTION_INTELLIGENCE_BOUNDARY.duplicateQueue) {
    throw new Error("MO:6 must not create a duplicate queue");
  }
  if (EXECUTIVE_ATTENTION_INTELLIGENCE_BOUNDARY.commitsDecisions) {
    throw new Error("MO:6 must not commit decisions");
  }
  if (EXECUTIVE_ATTENTION_INTELLIGENCE_BOUNDARY.startsExecution) {
    throw new Error("MO:6 must not start execution");
  }
  return Object.freeze({ ok: true as const });
}

type ScoreInput = {
  readonly attentionId: string;
  readonly subjectId: string | null;
  readonly label: string;
  readonly kind: AttentionItemKind;
  readonly reason: string;
  readonly impact: string;
  readonly evidence: readonly string[];
  readonly epistemicStatus: ExecutiveAttentionItem["epistemicStatus"];
  readonly recommendedPath: string | null;
  readonly journey: ExecutiveJourneyIntelligence;
  readonly navigation: ExecutiveGoalNavigation;
  readonly facts: ExecutiveAttentionFacts;
  readonly change: ExecutiveAttentionSignal | null | undefined;
  readonly blocker: boolean;
  readonly previousPrimaryId?: string | null;
  readonly suppress?: boolean;
};

function collectCandidates(
  input: {
    readonly context: ManagerObjectContext;
    readonly explanation: ExecutiveObjectExplanation;
    readonly exploration: ExecutiveObjectExploration;
    readonly navigation: ExecutiveGoalNavigation;
    readonly journey: ExecutiveJourneyIntelligence;
    readonly previousPrimaryId?: string | null;
  },
  facts: ExecutiveAttentionFacts,
): ExecutiveAttentionItem[] {
  const items: ExecutiveAttentionItem[] = [];
  const add = (item: ExecutiveAttentionItem | null) => {
    if (!item) return;
    if (items.some((existing) => existing.attentionId === item.attentionId)) return;
    items.push(item);
  };
  const { journey, navigation, context } = input;
  const changeById = new Map((facts.changes ?? []).map((signal) => [signal.subjectId, signal]));
  const base = {
    journey,
    navigation,
    facts,
    previousPrimaryId: input.previousPrimaryId,
  };

  if (journey.blocker) {
    add(
      scoreItem({
        ...base,
        attentionId: `blocker:${journey.blocker.kind}`,
        subjectId: journey.blocker.subjectId,
        label: labelFor(journey.blocker.subjectId) ?? journey.blocker.kind,
        kind: kindFromBlocker(journey.blocker.kind),
        reason: journey.blocker.reason,
        impact: "The executive journey cannot advance until this blocker is resolved.",
        evidence: journey.blocker.evidence,
        epistemicStatus: journey.blocker.epistemicStatus,
        recommendedPath: journey.blocker.recommendedResolutionPath,
        change: changeById.get(journey.blocker.subjectId ?? ""),
        blocker: true,
      }),
    );
  }

  if (navigation.progressState === "AT_RISK" || navigation.progressState === "OFF_TRACK") {
    add(
      scoreItem({
        ...base,
        attentionId: `goal:${navigation.progressState}`,
        subjectId: navigation.goal.goalId,
        label: navigation.goal.title,
        kind: "GOAL",
        reason: `Active goal progress is ${navigation.progressState}.`,
        impact: "Goal movement may need manager review.",
        evidence: navigation.progressSignals,
        epistemicStatus: navigation.goal.epistemicStatus,
        recommendedPath: navigation.recommendedPath?.path.label ?? null,
        change: null,
        blocker: false,
      }),
    );
  }

  for (const conflict of navigation.conflicts) {
    add(
      scoreItem({
        ...base,
        attentionId: `conflict:${conflict.slice(0, 40)}`,
        subjectId: navigation.recommendedPath?.path.targetObjectId ?? context.objectId,
        label: "Goal conflict",
        kind: "CONFLICT",
        reason: conflict,
        impact: "Manager judgment is required; MO:6 does not resolve the trade-off.",
        evidence: ["MO:4 conflict exposure"],
        epistemicStatus: "INFERRED",
        recommendedPath: navigation.recommendedPath?.path.label ?? null,
        change: null,
        blocker: false,
      }),
    );
  }

  if (journey.decisionState === "committed") {
    add(
      scoreItem({
        ...base,
        attentionId: "decision:committed",
        subjectId: null,
        label: "Committed decision",
        kind: "DECISION",
        reason: "A decision is already committed, so duplicate commitment intervention is not required.",
        impact: "Journey may continue into execution without a new manager commitment.",
        evidence: ["Decision Runtime committed"],
        epistemicStatus: "KNOWN",
        recommendedPath: null,
        change: { subjectId: "decision", lifecycle: "RESOLVED" },
        blocker: false,
        suppress: true,
      }),
    );
  }

  if (journey.executionState === "ACTIVE") {
    add(
      scoreItem({
        ...base,
        attentionId: "execution:active",
        subjectId: context.execution.value ?? context.objectId,
        label: labelFor(context.execution.value) ?? "Execution",
        kind: "EXECUTION",
        reason: "Execution is active. Viewing execution is not starting execution.",
        impact: "No new manager execution action is implied.",
        evidence: ["Execution Runtime ACTIVE"],
        epistemicStatus: "KNOWN",
        recommendedPath: null,
        change: null,
        blocker: false,
        suppress: journey.blocker?.kind !== "EXECUTION_BLOCKED",
      }),
    );
  }

  if (
    journey.executionState === "COMPLETED" &&
    (journey.outcomeState === "NOT_OBSERVED" || journey.outcomeState === "UNKNOWN")
  ) {
    add(
      scoreItem({
        ...base,
        attentionId: "outcome:missing",
        subjectId: context.objectId,
        label: "Outcome observation",
        kind: "OUTCOME",
        reason: "Execution is complete, but no outcome is recorded.",
        impact: "Outcome remains UNKNOWN. This is not a proven deviation.",
        evidence: ["MO:5 OUTCOME_REQUIRED"],
        epistemicStatus: "UNKNOWN",
        recommendedPath: "Observe outcome against the active goal.",
        change: null,
        blocker: true,
      }),
    );
  }

  if (facts.expectedOutcome && facts.observedOutcome && facts.expectedOutcome !== facts.observedOutcome) {
    add(
      scoreItem({
        ...base,
        attentionId: "outcome:deviation",
        subjectId: context.objectId,
        label: "Outcome deviation",
        kind: "OUTCOME",
        reason: "Observed outcome does not match the expected goal movement.",
        impact: "The journey may need reassessment. This is not a causal proof.",
        evidence: [`expected=${facts.expectedOutcome}`, `observed=${facts.observedOutcome}`],
        epistemicStatus: "KNOWN",
        recommendedPath: "Reassess decision assumptions / scenario.",
        change: { subjectId: context.objectId ?? "outcome", lifecycle: "ESCALATED" },
        blocker: false,
      }),
    );
  }

  const stale = Boolean(context.objectId && facts.staleSubjectIds?.includes(context.objectId));
  const evidenceUnknown = context.kpi.support === "UNKNOWN" && input.explanation.evidence.length === 0;
  if (stale || evidenceUnknown) {
    add(
      scoreItem({
        ...base,
        attentionId: stale ? "evidence:stale" : "evidence:unknown",
        subjectId: context.objectId,
        label: stale ? "Stale evidence" : "Unknown evidence",
        kind: "EVIDENCE",
        reason: stale
          ? "Latest evidence is stale. Refreshing underlying data is the safer next step."
          : "Authoritative evidence is UNKNOWN. Uncertainty is not automatically a risk severity.",
        impact: "Confidence is limited. Strong intervention is withheld.",
        evidence: stale ? ["Data Reality stale"] : ["MO:2 evidence UNKNOWN"],
        epistemicStatus: "UNKNOWN",
        recommendedPath: "Review evidence.",
        change: null,
        blocker: false,
      }),
    );
  }

  for (const path of input.exploration.availablePaths) {
    if (path.kind !== "RISK" && path.kind !== "OPPORTUNITY") continue;
    const opportunity =
      path.kind === "OPPORTUNITY" ||
      Boolean(path.targetObjectId && facts.opportunitySubjectIds?.includes(path.targetObjectId));
    add(
      scoreItem({
        ...base,
        attentionId: `${path.kind.toLowerCase()}:${path.targetObjectId ?? path.pathId}`,
        subjectId: path.targetObjectId,
        label: path.label,
        kind: opportunity ? "OPPORTUNITY" : "RISK",
        reason: path.reason,
        impact: opportunity
          ? "An opportunity may deserve review if it supports the active goal."
          : "Risk existence alone does not require manager intervention.",
        evidence: path.evidence ? [path.evidence] : ["MO:3 path"],
        epistemicStatus: path.epistemicStatus,
        recommendedPath: path.label,
        change: changeById.get(path.targetObjectId ?? ""),
        blocker: false,
      }),
    );
  }

  for (const signal of facts.changes ?? []) {
    add(
      scoreItem({
        ...base,
        attentionId: `change:${signal.subjectId}:${signal.lifecycle}`,
        subjectId: signal.subjectId,
        label: labelFor(signal.subjectId) ?? "Change",
        kind: "CHANGE",
        reason: `Authoritative change signal: ${signal.lifecycle.toLowerCase()}.`,
        impact:
          signal.magnitude === "material"
            ? "A material change may deserve attention."
            : "Change is recorded without inventing magnitude.",
        evidence: ["STAGE-PROD:2 / monitoring signal"],
        epistemicStatus: signal.magnitude === "unknown" ? "UNKNOWN" : "KNOWN",
        recommendedPath: null,
        change: signal,
        blocker: false,
      }),
    );
  }

  const severity = (context.currentState.value ?? "").toLowerCase();
  if (severity.includes("risk") || severity.includes("critical") || severity.includes("watch")) {
    add(
      scoreItem({
        ...base,
        attentionId: `severity:${context.objectId ?? "object"}`,
        subjectId: context.objectId,
        label: context.identity.value ?? "Current object",
        kind: "MONITORING",
        reason: `Business state is ${context.currentState.value}. Severity is not the same as manager attention.`,
        impact: "Operational severity is noted without automatic escalation.",
        evidence: ["MO:1 current state"],
        epistemicStatus: "KNOWN",
        recommendedPath: null,
        change: changeById.get(context.objectId ?? ""),
        blocker: false,
      }),
    );
  }

  return items;
}

function kindFromBlocker(kind: string): AttentionItemKind {
  if (kind.includes("DECISION")) return "DECISION";
  if (kind.includes("EXECUTION")) return "EXECUTION";
  if (kind.includes("OUTCOME")) return "OUTCOME";
  return "JOURNEY_BLOCKER";
}

function scoreItem(input: ScoreInput): ExecutiveAttentionItem {
  const signals: string[] = [];
  let score = 0;
  const goalKnown = input.navigation.goal.source !== "unknown";
  const related =
    input.subjectId != null &&
    (input.navigation.goal.relatedObjects.includes(input.subjectId) ||
      input.navigation.recommendedPath?.path.targetObjectId === input.subjectId ||
      input.journey.activeProblems.includes(input.subjectId) ||
      input.journey.availableScenarios.includes(input.subjectId));
  const goalRelevance: ExecutiveAttentionItem["goalRelevance"] = !goalKnown
    ? "UNAVAILABLE"
    : related ||
        input.kind === "JOURNEY_BLOCKER" ||
        input.kind === "DECISION" ||
        input.kind === "GOAL"
      ? "DIRECT"
      : input.kind === "RISK" || input.kind === "MONITORING"
        ? "LOW"
        : "RELATED";
  if (goalRelevance === "DIRECT") {
    score += 30;
    signals.push("GOAL RELEVANCE");
  } else if (goalRelevance === "RELATED") {
    score += 12;
    signals.push("RELATED GOAL CONTEXT");
  }
  const journeyRelevance: ExecutiveAttentionItem["journeyRelevance"] = input.blocker
    ? "BLOCKER"
    : related
      ? "ON_PATH"
      : "LOW";
  if (journeyRelevance === "BLOCKER") {
    score += 40;
    signals.push("JOURNEY BLOCKER");
  }
  const change: AttentionLifecycle | null = input.change?.lifecycle ?? null;
  if (change === "ESCALATED" || (change === "NEW" && input.change?.magnitude === "material")) {
    score += 20;
    signals.push("CHANGE MAGNITUDE");
  } else if (change === "NEW") {
    score += 12;
    signals.push("NEW CHANGE");
  } else if (change === "DEESCALATED" || change === "RESOLVED") {
    score -= 12;
    signals.push("DEESCALATED / RESOLVED");
  } else if (change === "ONGOING" || input.previousPrimaryId === input.attentionId) {
    score -= 4;
    signals.push("STABLE / ONGOING");
  }
  const ownerCanResolve =
    (input.subjectId != null && input.facts.ownerCanResolveIds?.includes(input.subjectId)) === true ||
    input.change?.ownerCanResolve === true;
  const managerAuthority =
    input.kind === "DECISION" ||
    input.kind === "CONFLICT" ||
    input.kind === "GOAL" ||
    input.journey.blocker?.kind === "DECISION_REQUIRED" ||
    (input.subjectId != null && input.facts.managerAuthorityIds?.includes(input.subjectId)) ||
    input.change?.managerAuthority === true;
  if (managerAuthority) {
    score += 18;
    signals.push("MANAGER AUTHORITY REQUIREMENT");
  }
  if (ownerCanResolve && !managerAuthority) {
    score -= 16;
    signals.push("OWNER CAN RESOLVE");
  }
  if (input.kind === "DECISION" && input.journey.decisionState !== "committed") {
    score += 25;
    signals.push("DECISION REQUIREMENT");
  }
  if (input.kind === "EXECUTION" && input.journey.executionState === "BLOCKED") {
    score += managerAuthority ? 22 : 8;
    signals.push("EXECUTION BLOCKAGE");
  }
  if (input.kind === "OUTCOME" && input.attentionId.includes("deviation")) {
    score += 22;
    signals.push("OUTCOME DEVIATION");
  }
  if (input.kind === "OPPORTUNITY") {
    score += 15;
    signals.push("OPPORTUNITY");
  }
  if (input.kind === "EVIDENCE") {
    score += 6;
    signals.push("EVIDENCE CONFIDENCE");
  }
  if (input.kind === "MONITORING") {
    score += 8;
    signals.push("BUSINESS IMPACT / SEVERITY (capped)");
  }
  if (input.kind === "RISK" && (change === "ESCALATED" || change === "NEW")) {
    score += 10;
    signals.push("RISK CHANGE");
  }
  if (input.suppress) score = Math.min(score, 12);

  const deadline = input.change?.deadline ?? null;
  const urgency: ExecutiveAttentionItem["urgency"] = deadline
    ? "time-sensitive"
    : input.blocker && managerAuthority
      ? "routine"
      : "none";
  if (urgency === "time-sensitive") {
    score += 10;
    signals.push("TIME SENSITIVITY");
  }

  let interventionNeed: InterventionNeed = "MONITOR";
  if (input.kind === "DECISION" && input.journey.decisionState !== "committed") {
    interventionNeed = "DECISION_REQUIRED";
  } else if (input.kind === "CONFLICT") {
    interventionNeed = "REVIEW";
  } else if (input.kind === "EXECUTION" && input.journey.executionState === "BLOCKED") {
    interventionNeed = managerAuthority ? "ACTION_REQUIRED" : "REVIEW";
  } else if (input.kind === "OUTCOME" && input.attentionId.includes("deviation")) {
    interventionNeed = "REVIEW";
  } else if (input.kind === "EVIDENCE" || input.kind === "OPPORTUNITY") {
    interventionNeed = "REVIEW";
  } else if (input.suppress || ownerCanResolve) {
    interventionNeed = "MONITOR";
  } else if (input.blocker) {
    interventionNeed = "REVIEW";
  }

  let attentionLevel: AttentionLevel = "NONE";
  if (score >= 46 && (interventionNeed === "DECISION_REQUIRED" || interventionNeed === "ACTION_REQUIRED")) {
    attentionLevel = "URGENT";
  } else if (score >= 22) {
    attentionLevel = "ATTENTION";
  } else if (score >= 1) {
    attentionLevel = "WATCH";
  }
  if (input.kind === "MONITORING" && attentionLevel === "URGENT") attentionLevel = "WATCH";
  if (input.kind === "EXECUTION" && input.journey.executionState === "ACTIVE" && input.suppress) {
    attentionLevel = "WATCH";
    interventionNeed = "NOT_REQUIRED";
  }
  if (change === "RESOLVED" || (input.kind === "DECISION" && input.journey.decisionState === "committed")) {
    attentionLevel = "WATCH";
    interventionNeed = "NOT_REQUIRED";
  }

  return Object.freeze({
    attentionId: input.attentionId,
    subjectId: input.subjectId,
    label: input.label,
    kind: input.kind,
    reason: input.reason,
    attentionLevel,
    goalRelevance,
    journeyRelevance,
    urgency,
    impact: input.impact,
    changeSignal: change,
    blocker: input.blocker,
    evidence: Object.freeze([...input.evidence]),
    epistemicStatus: input.epistemicStatus,
    interventionNeed,
    recommendedPath: input.recommendedPath,
    rankingSignals: Object.freeze(signals),
    score,
    managerAuthorityRequired: managerAuthority,
    isCausalClaim: false,
  });
}

function labelFor(objectId: string | null | undefined): string | null {
  if (objectId == null) return null;
  return collectManagerObjectContext(objectId).identity.value;
}

function resolveOverallLevel(
  items: readonly ExecutiveAttentionItem[],
  primary: ExecutiveAttentionItem | null,
): AttentionLevel {
  if (primary) return primary.attentionLevel;
  if (items.some((item) => item.attentionLevel === "URGENT")) return "URGENT";
  if (items.some((item) => item.attentionLevel === "ATTENTION")) return "ATTENTION";
  if (items.some((item) => item.attentionLevel === "WATCH")) return "WATCH";
  return "NONE";
}

function resolveOverallIntervention(
  primary: ExecutiveAttentionItem | null,
  items: readonly ExecutiveAttentionItem[],
  journey: ExecutiveJourneyIntelligence,
): ExecutiveInterventionAssessment {
  const lead = primary ?? items[0] ?? null;
  if (lead == null) {
    return Object.freeze({
      need: "NOT_REQUIRED",
      trigger: null,
      reason: "No executive intervention is required right now.",
      managerAuthorityRequired: false,
    });
  }
  const trigger =
    lead.interventionNeed === "DECISION_REQUIRED"
      ? "MANAGER_DECISION_REQUIRED"
      : lead.kind === "CONFLICT"
        ? "STRATEGIC_TRADEOFF_REQUIRED"
        : lead.kind === "GOAL"
          ? "GOAL_AT_RISK"
          : lead.kind === "RISK" && lead.changeSignal === "ESCALATED"
            ? "MATERIAL_NEW_RISK"
            : lead.kind === "EXECUTION" && journey.executionState === "BLOCKED"
              ? "EXECUTION_ESCALATION"
              : lead.kind === "OUTCOME" && lead.attentionId.includes("deviation")
                ? "OUTCOME_DEVIATION"
                : lead.kind === "EVIDENCE"
                  ? "CRITICAL_UNCERTAINTY"
                  : lead.kind === "OPPORTUNITY"
                    ? "TIME_SENSITIVE_OPPORTUNITY"
                    : null;
  return Object.freeze({
    need: lead.interventionNeed,
    trigger,
    reason: lead.reason,
    managerAuthorityRequired: lead.managerAuthorityRequired,
  });
}

function collectSafeToContinue(
  input: { readonly journey: ExecutiveJourneyIntelligence },
  facts: ExecutiveAttentionFacts,
  items: readonly ExecutiveAttentionItem[],
): readonly string[] {
  const lines: string[] = [];
  if (input.journey.executionState === "ACTIVE" && input.journey.blocker?.kind !== "EXECUTION_BLOCKED") {
    lines.push("Execution can continue without manager intervention for now.");
  }
  if (input.journey.decisionState === "committed") {
    lines.push("The committed decision does not require a duplicate manager commitment.");
  }
  for (const item of items) {
    if (item.subjectId && facts.ownerCanResolveIds?.includes(item.subjectId) && !item.managerAuthorityRequired) {
      lines.push(`${item.label} can remain with its operational owner.`);
    }
    if (item.attentionLevel === "WATCH" && item.interventionNeed === "MONITOR") {
      lines.push(`${item.label} is being watched and does not currently require intervention.`);
    }
  }
  return Object.freeze([...new Set(lines)].slice(0, 4));
}

function composeInaction(
  journey: ExecutiveJourneyIntelligence,
  primary: ExecutiveAttentionItem | null,
): string {
  if (primary?.interventionNeed === "DECISION_REQUIRED" || journey.blocker?.kind === "DECISION_REQUIRED") {
    return "Nexora can confirm that the pending decision is blocking journey progress, but it does not currently have enough evidence to quantify what will happen if no action is taken.";
  }
  if (primary == null) {
    return "No intervention is required right now, so no consequence of inaction is claimed.";
  }
  return "Nexora does not currently have enough evidence to quantify what will happen if no action is taken.";
}

function collectUnknowns(
  input: {
    readonly navigation: ExecutiveGoalNavigation;
    readonly explanation: ExecutiveObjectExplanation;
    readonly journey: ExecutiveJourneyIntelligence;
  },
  facts: ExecutiveAttentionFacts,
): readonly string[] {
  const unknowns: string[] = [];
  if (input.navigation.goal.source === "unknown") {
    unknowns.push("Active goal is unknown, so strategic ranking is unavailable.");
  }
  if (input.journey.outcomeState === "NOT_OBSERVED" || input.journey.outcomeState === "UNKNOWN") {
    unknowns.push("Outcome is UNKNOWN.");
  }
  if ((facts.staleSubjectIds?.length ?? 0) > 0) unknowns.push("Some evidence is stale.");
  return Object.freeze(unknowns);
}

function composeReasoning(
  primary: ExecutiveAttentionItem | null,
  items: readonly ExecutiveAttentionItem[],
  comparable: boolean,
  goalKnown: boolean,
): string {
  if (!goalKnown) {
    return "Operational attention may still be surfaced, but Nexora cannot rank strategic importance because the active goal is unknown.";
  }
  if (comparable && items[0] && items[1]) {
    return `${items[0].label} and ${items[1].label} currently have comparable executive priority. Attention ranking is inferred and is not a causal claim.`;
  }
  if (primary == null) return "No executive intervention is required right now.";
  return `${primary.label} is the highest-priority attention candidate because ${primary.rankingSignals.join(", ") || "available executive signals"}. This does not establish a confirmed business cause.`;
}

function composeFacing(input: {
  readonly attentionState: AttentionLevel;
  readonly primary: ExecutiveAttentionItem | null;
  readonly secondary: readonly ExecutiveAttentionItem[];
  readonly comparable: boolean;
  readonly intervention: ExecutiveInterventionAssessment;
  readonly safe: readonly string[];
  readonly doNotDisturb: boolean;
  readonly goalKnown: boolean;
}): string {
  if (input.doNotDisturb && input.primary == null) {
    return "No executive intervention is required right now. Existing work can continue without manager interruption.";
  }
  const lines: string[] = [];
  if (!input.goalKnown) {
    lines.push("Goal-directed ranking is unavailable because the active goal is unknown.");
  }
  if (input.comparable && input.secondary.length > 0) {
    lines.push(
      `Needs your attention: ${input.secondary.map((item) => item.label).join(" and ")} currently have comparable executive priority.`,
    );
  } else if (input.primary) {
    lines.push(`Needs your attention: ${input.primary.label}.`);
    lines.push(`Why now: ${input.primary.reason}`);
    lines.push(`Intervention: ${input.intervention.need}.`);
    if (input.primary.recommendedPath) {
      lines.push(`Next: ${input.primary.recommendedPath}. Nexora is not performing the intervention.`);
    }
  }
  const watch = input.secondary.filter((item) => item.attentionLevel === "WATCH");
  if (watch.length > 0) lines.push(`Also watching: ${watch.map((item) => item.label).join("; ")}.`);
  if (input.safe[0]) lines.push(input.safe[0]);
  if (
    input.primary?.kind === "EVIDENCE" ||
    input.primary?.epistemicStatus === "UNKNOWN" ||
    input.secondary.some((item) => item.kind === "EVIDENCE")
  ) {
    lines.push("Don't have enough evidence to invent additional attention facts.");
  }
  return lines.join(" ") || "No executive intervention is required right now.";
}
