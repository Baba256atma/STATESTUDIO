/**
 * NPA-T ECA:3 — Proactive Executive Guidance & Advisor Initiative.
 * Read-only judgment: should Nexora speak without being asked.
 * Consumes ECA:1 context, ECA:2 plan, and existing NCA:5 / NXA:4 / situation
 * candidates. Does not re-plan conversation, write business state, or create
 * a second initiative engine.
 */
import type { EcaConversationActionPlan, EcaExecutiveIntent } from "./ecaExecutiveIntentActionPlan.ts";
import type { EcaSubject, EcaWorkingConversationContext } from "./ecaWorkingConversationContext.ts";
import type { ExecutiveInitiativeStrategy } from "../manager-object/nexoraNca5InitiativeIntelligenceTypes.ts";
import type { Nxa4ProactiveAdvisoryEvaluation } from "../manager-object/nexoraNxa4ProactiveAdvisory.ts";
import type { ExecutiveSituation } from "../manager-object/nexoraNxa3ExecutiveSituation.ts";

export const ECA_EXECUTIVE_INITIATIVE_IDENTITY =
  "NPA-T ECA:3/ProactiveExecutiveGuidanceAdvisorInitiative" as const;

export const ECA_INITIATIVE_REASONS = Object.freeze([
  "MATERIAL_CHANGE",
  "GOAL_AT_RISK",
  "RISK_ESCALATION",
  "NEW_EVIDENCE",
  "CONTRADICTORY_EVIDENCE",
  "MISSING_CRITICAL_INFORMATION",
  "DECISION_ASSUMPTION_WEAKENED",
  "DECISION_REVIEW_NEEDED",
  "EXECUTION_BLOCKED",
  "EXECUTION_OFF_TRACK",
  "OUTCOME_DEVIATION",
  "REASSESSMENT_OPPORTUNITY",
  "HIGH_VALUE_NEXT_STEP",
  "MANAGER_OVERSIGHT_RISK",
  "NO_JUSTIFIED_INITIATIVE",
] as const);
export type EcaInitiativeReason = (typeof ECA_INITIATIVE_REASONS)[number];

export const ECA_INITIATIVE_SIGNIFICANCE = Object.freeze([
  "LOW",
  "MODERATE",
  "HIGH",
  "CRITICAL",
  "UNKNOWN",
] as const);
export type EcaInitiativeSignificance = (typeof ECA_INITIATIVE_SIGNIFICANCE)[number];

export const ECA_INITIATIVE_URGENCY = Object.freeze(["LOW", "MODERATE", "HIGH", "UNKNOWN"] as const);
export type EcaInitiativeUrgency = (typeof ECA_INITIATIVE_URGENCY)[number];

export const ECA_INITIATIVE_CONFIDENCE = Object.freeze([
  "CONFIRMED",
  "SUPPORTED",
  "TENTATIVE",
  "UNKNOWN",
] as const);
export type EcaInitiativeConfidence = (typeof ECA_INITIATIVE_CONFIDENCE)[number];

export const ECA_INITIATIVE_STRENGTH = Object.freeze(["NOTICE", "SUGGEST", "RECOMMEND", "WARN"] as const);
export type EcaInitiativeStrength = (typeof ECA_INITIATIVE_STRENGTH)[number];

export const ECA_INITIATIVE_SUPPRESSION = Object.freeze([
  "LOW_SIGNIFICANCE",
  "INSUFFICIENT_EVIDENCE",
  "UNRELATED_TO_CURRENT_CONTEXT",
  "ALREADY_SURFACED",
  "ALREADY_ACKNOWLEDGED",
  "ACTIVE_MANAGER_TASK_MORE_IMPORTANT",
  "DUPLICATE_GUIDANCE",
  "STALE_EVIDENCE",
  "UNCONFIRMED_SEMANTICS",
  "NO_ACTIONABLE_NEXT_STEP",
  "RECENTLY_DISMISSED",
  "NO_JUSTIFIED_INITIATIVE",
] as const);
export type EcaInitiativeSuppressionReason = (typeof ECA_INITIATIVE_SUPPRESSION)[number];

export type EcaInitiativeTiming = "BEFORE_RESPONSE" | "AS_PART_OF_RESPONSE" | "AFTER_ANSWER";

export type EcaInitiativeCandidate = Readonly<{
  id: string;
  reason: EcaInitiativeReason;
  subject: EcaSubject | null;
  significance: EcaInitiativeSignificance;
  urgency: EcaInitiativeUrgency;
  confidence: EcaInitiativeConfidence;
  evidence: readonly string[];
  relatedToCurrentContext: boolean;
  alreadyOnStage: boolean;
  materialChange: boolean;
  fingerprint: string;
  observation: string;
  nextStep: string | null;
  source: string;
}>;

export type EcaInitiativeSession = Readonly<{
  lastFingerprint: string | null;
  lastReason: EcaInitiativeReason | null;
  lastGuidance: string | null;
  lastWhy: string | null;
  dismissedFingerprints: readonly string[];
  acknowledgedFingerprints: readonly string[];
}>;

export type EcaConversationActionPlanReference = Readonly<{
  identity: EcaConversationActionPlan["identity"];
  intent: EcaConversationActionPlan["intent"];
  nextAction: EcaConversationActionPlan["nextAction"];
}>;

export type EcaExecutiveInitiativeJudgment = Readonly<{
  identity: typeof ECA_EXECUTIVE_INITIATIVE_IDENTITY;
  shouldIntervene: boolean;
  reason: EcaInitiativeReason;
  significance: EcaInitiativeSignificance;
  urgency: EcaInitiativeUrgency;
  confidence: EcaInitiativeConfidence;
  strength: EcaInitiativeStrength | null;
  subject: EcaSubject | null;
  evidence: readonly string[];
  recommendedActionPlan: EcaConversationActionPlanReference | null;
  suppressionReason: EcaInitiativeSuppressionReason | null;
  timing: EcaInitiativeTiming | null;
  guidance: string | null;
  whyExplanation: string | null;
  fingerprint: string | null;
  competingCount: number;
  provenance: Readonly<{
    sources: readonly string[];
    rationale: string;
    reusedNca5: boolean;
    reusedEca2: boolean;
  }>;
  boundaries: Readonly<{
    mutatesBusinessState: false;
    writesStage: false;
    commitsDecision: false;
    startsExecution: false;
    writesOutcome: false;
    writesLearning: false;
    writesRisk: false;
    createsSecondInitiativeEngine: false;
    createsNotificationSystem: false;
  }>;
}>;

export type EcaExecutiveInitiativeInput = Readonly<{
  utterance: string;
  workingContext: EcaWorkingConversationContext;
  actionPlan: EcaConversationActionPlan;
  candidates?: readonly EcaInitiativeCandidate[];
  session?: EcaInitiativeSession | null;
  nca5?: ExecutiveInitiativeStrategy | null;
  nxa4?: Nxa4ProactiveAdvisoryEvaluation | null;
  situation?: ExecutiveSituation | null;
}>;

const BOUNDARIES = Object.freeze({
  mutatesBusinessState: false as const,
  writesStage: false as const,
  commitsDecision: false as const,
  startsExecution: false as const,
  writesOutcome: false as const,
  writesLearning: false as const,
  writesRisk: false as const,
  createsSecondInitiativeEngine: false as const,
  createsNotificationSystem: false as const,
});

const EXPLICIT_REQUEST_INTENTS: readonly EcaExecutiveIntent[] = Object.freeze([
  "EXPLAIN",
  "SHOW",
  "COUNT",
  "LOCATE",
  "INSPECT_EVIDENCE",
  "REVIEW_EXECUTION",
  "INVESTIGATE",
]);

const SIGNIFICANCE_RANK: Record<EcaInitiativeSignificance, number> = {
  UNKNOWN: 0,
  LOW: 1,
  MODERATE: 2,
  HIGH: 3,
  CRITICAL: 4,
};

const URGENCY_RANK: Record<EcaInitiativeUrgency, number> = {
  UNKNOWN: 0,
  LOW: 1,
  MODERATE: 2,
  HIGH: 3,
};

const CONFIDENCE_RANK: Record<EcaInitiativeConfidence, number> = {
  UNKNOWN: 0,
  TENTATIVE: 1,
  SUPPORTED: 2,
  CONFIRMED: 3,
};

function freeze<T>(value: T): T {
  return Object.freeze(value);
}

function normalized(utterance: string): string {
  return utterance.trim().toLowerCase().replace(/[.!?]+$/g, "");
}

export function emptyEcaInitiativeSession(): EcaInitiativeSession {
  return freeze({
    lastFingerprint: null,
    lastReason: null,
    lastGuidance: null,
    lastWhy: null,
    dismissedFingerprints: Object.freeze([]),
    acknowledgedFingerprints: Object.freeze([]),
  });
}

export function isEcaInitiativeDismissal(utterance: string): boolean {
  return /^(?:not now|ignore that|we'll deal with it later|later)[.!?]?$/i.test(utterance.trim())
    || /\bnot now\b/i.test(utterance);
}

export function isEcaInitiativeAcknowledgement(utterance: string): boolean {
  const text = normalized(utterance);
  return /^(?:i know|yes,? i know|i already know(?: about (?:that|it))?|got it)$/.test(text)
    || /^i know about\b/.test(text)
    || /^(?:ok(?:ay)?[,.]?\s+)?(?:i understand(?: now)?|understood|thanks)[.!?]?$/.test(text);
}

export function isEcaInitiativeWhyFollowUp(utterance: string): boolean {
  return /^(?:why(?:\??)|why(?: is that| that| do you (?:say|recommend) that)?)\??$/i.test(
    utterance.trim(),
  );
}

function familyToReason(family: string): EcaInitiativeReason {
  switch (family) {
    case "GOAL_DEVIATION":
      return "GOAL_AT_RISK";
    case "RISK_ESCALATION":
      return "RISK_ESCALATION";
    case "NEW_EVIDENCE":
      return "NEW_EVIDENCE";
    case "ASSUMPTION_INVALIDATION":
      return "DECISION_ASSUMPTION_WEAKENED";
    case "EXECUTION_DRIFT":
      return "EXECUTION_OFF_TRACK";
    case "OUTCOME_CHANGE":
      return "OUTCOME_DEVIATION";
    case "LEARNING_SIGNAL":
      return "REASSESSMENT_OPPORTUNITY";
    case "DECISION_RISK":
      return "DECISION_REVIEW_NEEDED";
    case "UNRESOLVED_THREAD":
      return "MISSING_CRITICAL_INFORMATION";
    case "MANAGER_FOLLOW_UP":
      return "HIGH_VALUE_NEXT_STEP";
    case "MATERIAL_CHANGE":
      return "MATERIAL_CHANGE";
    default:
      return "MATERIAL_CHANGE";
  }
}

function bucketSignificance(value: number): EcaInitiativeSignificance {
  if (value >= 0.85) return "CRITICAL";
  if (value >= 0.55) return "HIGH";
  if (value >= 0.3) return "MODERATE";
  if (value > 0) return "LOW";
  return "UNKNOWN";
}

function bucketUrgency(value: number): EcaInitiativeUrgency {
  if (value >= 0.7) return "HIGH";
  if (value >= 0.4) return "MODERATE";
  if (value > 0) return "LOW";
  return "UNKNOWN";
}

function bucketConfidence(value: number, unconfirmed: boolean): EcaInitiativeConfidence {
  if (unconfirmed) return "TENTATIVE";
  if (value >= 0.85) return "CONFIRMED";
  if (value >= 0.55) return "SUPPORTED";
  if (value > 0) return "TENTATIVE";
  return "UNKNOWN";
}

function subjectVisible(context: EcaWorkingConversationContext, subject: EcaSubject | null): boolean {
  if (!subject) return false;
  return context.stageContext.visible.some((item) => item.id === subject.id || item.label === subject.label);
}

function relatedToWorking(
  context: EcaWorkingConversationContext,
  plan: EcaConversationActionPlan,
  subject: EcaSubject | null,
  observation: string,
): boolean {
  const ids = new Set(
    [
      context.activeSubject?.id,
      ...context.references.map((item) => item.subject.id),
      ...plan.subjects.map((item) => item.id),
    ].filter((item): item is string => Boolean(item)),
  );
  const labels = [
    context.activeSubject?.label,
    ...context.references.map((item) => item.subject.label),
    ...plan.subjects.map((item) => item.label),
  ]
    .filter((item): item is string => Boolean(item))
    .map((item) => item.toLowerCase());
  if (!subject) {
    return labels.some((label) => observation.toLowerCase().includes(label.toLowerCase()));
  }
  if (ids.has(subject.id)) return true;
  if (labels.some((label) => subject.label.toLowerCase().includes(label) || label.includes(subject.label.toLowerCase()))) {
    return true;
  }
  return observation.toLowerCase().includes(context.activeSubject?.label.toLowerCase() ?? "\0");
}

function candidateFingerprint(input: {
  reason: EcaInitiativeReason;
  subjectId: string | null;
  evidenceKey: string;
}): string {
  return `${input.reason}:${input.subjectId ?? "none"}:${input.evidenceKey}`;
}

export function mapNca5SignalToCandidate(
  nca5: ExecutiveInitiativeStrategy,
  workingContext: EcaWorkingConversationContext,
  actionPlan: EcaConversationActionPlan,
): EcaInitiativeCandidate | null {
  const signal = nca5.decision.signal;
  if (!signal) return null;
  const subject: EcaSubject | null = signal.subjectId
    ? freeze({ id: signal.subjectId, label: signal.subjectLabel, kind: null })
    : null;
  const unconfirmed = signal.uncertainties.length > 0 || signal.confidence < 0.55;
  const evidenceKey = `${signal.currentValue ?? signal.observation}:${signal.previousValue ?? ""}`;
  const reason = familyToReason(signal.family);
  return freeze({
    id: signal.id,
    reason,
    subject,
    significance: signal.critical ? "CRITICAL" : bucketSignificance(signal.significance),
    urgency: bucketUrgency(signal.urgency),
    confidence: bucketConfidence(signal.confidence, unconfirmed),
    evidence: signal.evidence,
    relatedToCurrentContext: relatedToWorking(workingContext, actionPlan, subject, signal.observation),
    alreadyOnStage: subjectVisible(workingContext, subject),
    materialChange: Math.abs((signal.currentValue ?? 0) - (signal.previousValue ?? 0)) >= 3,
    fingerprint: candidateFingerprint({
      reason,
      subjectId: signal.subjectId,
      evidenceKey,
    }),
    observation: signal.observation,
    nextStep: signal.nextStep ?? nca5.question,
    source: "NCA:5",
  });
}

function parsePercent(text: string | null | undefined): number | null {
  if (!text) return null;
  const match = text.match(/(\d+(?:\.\d+)?)\s*%/);
  return match ? Number(match[1]) : null;
}

export function composeEcaInitiativeCandidates(input: EcaExecutiveInitiativeInput): readonly EcaInitiativeCandidate[] {
  const collected: EcaInitiativeCandidate[] = [...(input.candidates ?? [])];
  const seen = new Set(collected.map((item) => item.fingerprint));
  const push = (candidate: EcaInitiativeCandidate | null) => {
    if (!candidate || seen.has(candidate.fingerprint)) return;
    seen.add(candidate.fingerprint);
    collected.push(candidate);
  };

  if (input.nca5) {
    push(mapNca5SignalToCandidate(input.nca5, input.workingContext, input.actionPlan));
  }

  const data = input.workingContext.activeDataSource;
  if (data && data.semanticStatus !== "CONFIRMED") {
    const subject: EcaSubject = freeze({
      id: data.fieldId,
      label: data.fieldLabel ?? data.fieldId,
      kind: "data-field",
    });
    push(
      freeze({
        id: `data-semantics:${data.fieldId}`,
        reason: "MISSING_CRITICAL_INFORMATION",
        subject,
        significance: "MODERATE",
        urgency: "LOW",
        confidence: "TENTATIVE",
        evidence: data.evidenceRefs,
        relatedToCurrentContext: relatedToWorking(
          input.workingContext,
          input.actionPlan,
          subject,
          data.fieldId,
        ),
        alreadyOnStage: false,
        materialChange: false,
        fingerprint: candidateFingerprint({
          reason: "MISSING_CRITICAL_INFORMATION",
          subjectId: data.fieldId,
          evidenceKey: data.semanticStatus,
        }),
        observation: `${data.fieldId} meaning is ${data.semanticStatus.toLowerCase()}, not confirmed.`,
        nextStep: "Clarify the field meaning before treating it as a capacity warning.",
        source: "ECA:1/DATA-ADV",
      }),
    );
  }

  const situation = input.situation;
  const discussingPerformance = /\d+\s*%/.test(input.utterance) &&
    /how are we doing|goal|on-time|delivery/i.test(input.utterance);
  const utterancePercents = [...input.utterance.matchAll(/(\d+(?:\.\d+)?)\s*%/g)].map((item) => Number(item[1]));
  const utteranceTarget = utterancePercents.length >= 2 ? Math.max(...utterancePercents) : parsePercent(situation?.goal?.target);
  const utteranceCurrent = utterancePercents.length >= 2 ? Math.min(...utterancePercents) : parsePercent(situation?.goal?.currentReality);
  if (discussingPerformance && utteranceCurrent != null && utteranceTarget != null) {
    const current = utteranceCurrent;
    const target = utteranceTarget;
    const gap = target - current;
    const atRisk = gap >= 3;
    if (atRisk) {
      const subject: EcaSubject = freeze({
        id: "goal:delivery",
        label: situation?.goal?.title ?? "On-time delivery",
        kind: "goal",
      });
      push(
        freeze({
          id: `goal-at-risk:${current}:${target}`,
          reason: "GOAL_AT_RISK",
          subject,
          significance: gap >= 5 ? "HIGH" : "MODERATE",
          urgency: "MODERATE",
          confidence: "CONFIRMED",
          evidence: [
            `current:${current}%`,
            `target:${target}%`,
            situation?.goal?.gap ?? `gap:${gap}`,
          ],
          relatedToCurrentContext: /deliver|goal|how are we doing|on-time/i.test(input.utterance),
          alreadyOnStage: false,
          materialChange: true,
          fingerprint: candidateFingerprint({
            reason: "GOAL_AT_RISK",
            subjectId: "goal:delivery",
            evidenceKey: `${current}:${target}`,
          }),
          observation: `${subject.label} is ${current}% against a ${target}% target.`,
          nextStep: "Review the related issues supported by current context.",
          source: situation?.goal ? "NXA:3" : "ECA:1/manager-observation",
        }),
      );
    }
  }

  if (/supplier delay/i.test(input.utterance) && /more relevant|blocking execution|new (?:confirmed )?evidence/i.test(input.utterance)) {
    const evidenceKey = /blocking execution|new (?:confirmed )?evidence/i.test(input.utterance)
      ? "material-block"
      : "relevance";
    const subject: EcaSubject = freeze({ id: "supplier-delay", label: "Supplier Delay", kind: "risk" });
    push(
      freeze({
        id: `supplier-delay:${evidenceKey}`,
        reason: "RISK_ESCALATION",
        subject,
        significance: evidenceKey === "material-block" ? "HIGH" : "MODERATE",
        urgency: evidenceKey === "material-block" ? "HIGH" : "MODERATE",
        confidence: "SUPPORTED",
        evidence: [evidenceKey],
        relatedToCurrentContext: /how are we doing|supplier delay/i.test(input.utterance),
        alreadyOnStage: subjectVisible(input.workingContext, subject),
        materialChange: true,
        fingerprint: candidateFingerprint({
          reason: "RISK_ESCALATION",
          subjectId: "supplier-delay",
          evidenceKey,
        }),
        observation:
          evidenceKey === "material-block"
            ? "Supplier Delay now has new material evidence."
            : "Supplier Delay has become more relevant to the delivery goal.",
        nextStep: "Review its evidence.",
        source: "ECA:1/manager-observation",
      }),
    );
  }

  if (situation?.execution.blocker) {
    const subject: EcaSubject = freeze({
      id: situation.execution.subjectId ?? "execution",
      label: "Execution",
      kind: "execution",
    });
    push(
      freeze({
        id: `execution-blocker:${situation.execution.blocker}`,
        reason: "EXECUTION_BLOCKED",
        subject,
        significance: "HIGH",
        urgency: "HIGH",
        confidence: "CONFIRMED",
        evidence: [situation.execution.blocker],
        relatedToCurrentContext:
          input.actionPlan.intent === "REVIEW_EXECUTION" ||
          /execution|blocker/i.test(input.utterance) ||
          relatedToWorking(input.workingContext, input.actionPlan, subject, situation.execution.blocker),
        alreadyOnStage: false,
        materialChange: true,
        fingerprint: candidateFingerprint({
          reason: "EXECUTION_BLOCKED",
          subjectId: subject.id,
          evidenceKey: situation.execution.blocker,
        }),
        observation: `The execution is blocked by ${situation.execution.blocker}.`,
        nextStep: "Review the blocker.",
        source: "NXA:3",
      }),
    );
  }

  if (situation?.outcome.observed && situation.outcome.state && /observed|available|complete/i.test(situation.outcome.state)) {
    const subject: EcaSubject = freeze({
      id: "outcome",
      label: "Outcome",
      kind: "outcome",
    });
    push(
      freeze({
        id: `outcome:${situation.outcome.observed}`,
        reason: "OUTCOME_DEVIATION",
        subject,
        significance: "HIGH",
        urgency: "MODERATE",
        confidence: "CONFIRMED",
        evidence: [situation.outcome.observed, situation.outcome.baseline ?? "no-baseline"],
        relatedToCurrentContext: /outcome|result|how are we doing|delivery/i.test(input.utterance),
        alreadyOnStage: false,
        materialChange: true,
        fingerprint: candidateFingerprint({
          reason: "OUTCOME_DEVIATION",
          subjectId: "outcome",
          evidenceKey: situation.outcome.observed,
        }),
        observation: `The latest result is now available: ${situation.outcome.observed}${situation.goal?.target ? ` versus the ${situation.goal.target} goal` : ""}.`,
        nextStep: "Review the outcome.",
        source: "NXA:3",
      }),
    );
  }

  if (
    input.actionPlan.nextAction === "ASK_FOR_MISSING_INFORMATION" &&
    (input.actionPlan.intent === "COMPARE" ||
      input.actionPlan.intent === "COMMIT_DECISION" ||
      input.actionPlan.intent === "EVALUATE")
  ) {
    push(
      freeze({
        id: "missing-critical-from-eca-2",
        reason: "MISSING_CRITICAL_INFORMATION",
        subject: input.actionPlan.subjects[0] ?? input.workingContext.activeSubject,
        significance: "HIGH",
        urgency: "MODERATE",
        confidence: "SUPPORTED",
        evidence: input.actionPlan.requiredContext.map((item) => `${item.kind}:${item.availability}`),
        relatedToCurrentContext: true,
        alreadyOnStage: false,
        materialChange: false,
        fingerprint: candidateFingerprint({
          reason: "MISSING_CRITICAL_INFORMATION",
          subjectId: input.actionPlan.subjects[0]?.id ?? "compare",
          evidenceKey: input.actionPlan.requiredContext.map((item) => item.kind).join(","),
        }),
        observation: "Important information is missing for the current comparison or Decision.",
        nextStep: "Add the missing information before continuing.",
        source: "ECA:2",
      }),
    );
  }

  const idleNext =
    /^(?:what(?:'s| is) next|what should we do next|what now)\??$/i.test(input.utterance.trim());
  const scenarios = [
    ...input.workingContext.stageContext.visible,
    ...(input.workingContext.decisionContext.comparisonSubjects ?? []),
  ].filter((item) => /scenario/i.test(item.kind ?? "") || /^scenario /i.test(item.label));
  const uniqueScenarios = [...new Map(scenarios.map((item) => [item.id, item])).values()];
  if (
    idleNext &&
    uniqueScenarios.length >= 2 &&
    input.actionPlan.intent !== "COMPARE" &&
    input.actionPlan.nextAction !== "COMPARE"
  ) {
    push(
      freeze({
        id: "high-value-compare",
        reason: "HIGH_VALUE_NEXT_STEP",
        subject: uniqueScenarios[0] ?? null,
        significance: "MODERATE",
        urgency: "LOW",
        confidence: "SUPPORTED",
        evidence: uniqueScenarios.map((item) => item.id),
        relatedToCurrentContext: true,
        alreadyOnStage: uniqueScenarios.every((item) => subjectVisible(input.workingContext, item)),
        materialChange: false,
        fingerprint: candidateFingerprint({
          reason: "HIGH_VALUE_NEXT_STEP",
          subjectId: "compare-scenarios",
          evidenceKey: uniqueScenarios.map((item) => item.id).join("+"),
        }),
        observation: `You now have enough information to compare the ${uniqueScenarios.length} scenarios.`,
        nextStep: "Compare the scenarios.",
        source: "ECA:1/stage",
      }),
    );
  }

  if (input.actionPlan.intent === "COMMIT_DECISION" || /approve scenario|commit (?:the )?decision|make the decision/i.test(input.utterance)) {
    const unresolved = situation?.strongestUnresolvedIssue;
    if (unresolved && /risk/i.test(unresolved)) {
      push(
        freeze({
          id: `oversight:${unresolved}`,
          reason: "MANAGER_OVERSIGHT_RISK",
          subject: freeze({ id: "unresolved-risk", label: unresolved, kind: "risk" }),
          significance: "HIGH",
          urgency: "HIGH",
          confidence: "SUPPORTED",
          evidence: [unresolved],
          relatedToCurrentContext: true,
          alreadyOnStage: false,
          materialChange: false,
          fingerprint: candidateFingerprint({
            reason: "MANAGER_OVERSIGHT_RISK",
            subjectId: "unresolved-risk",
            evidenceKey: unresolved,
          }),
          observation: `Before committing, there is an unresolved Risk: ${unresolved}.`,
          nextStep: "Review the Risk first.",
          source: "NXA:3",
        }),
      );
    }
  }

  void input.nxa4;
  return freeze(collected);
}

function chooseStrength(candidate: EcaInitiativeCandidate): EcaInitiativeStrength {
  if (candidate.confidence === "TENTATIVE" || candidate.confidence === "UNKNOWN") {
    return "SUGGEST";
  }
  if (
    candidate.confidence === "CONFIRMED" &&
    (candidate.significance === "CRITICAL" || candidate.significance === "HIGH") &&
    (candidate.reason === "GOAL_AT_RISK" ||
      candidate.reason === "RISK_ESCALATION" ||
      candidate.reason === "EXECUTION_BLOCKED" ||
      candidate.reason === "MANAGER_OVERSIGHT_RISK")
  ) {
    return candidate.significance === "CRITICAL" ? "WARN" : "RECOMMEND";
  }
  if (candidate.significance === "HIGH" && candidate.confidence === "CONFIRMED") return "RECOMMEND";
  if (candidate.reason === "NEW_EVIDENCE" || candidate.reason === "OUTCOME_DEVIATION") return "NOTICE";
  return "SUGGEST";
}

function composeGuidance(candidate: EcaInitiativeCandidate, strength: EcaInitiativeStrength): string {
  const next = candidate.nextStep ? ` ${candidate.nextStep.endsWith("?") ? candidate.nextStep : `Do you want to ${candidate.nextStep.replace(/^\w/, (ch) => ch.toLowerCase()).replace(/\.$/, "")}?`}` : "";
  if (candidate.reason === "HIGH_VALUE_NEXT_STEP") {
    return `${candidate.observation} Would you like to compare them?`;
  }
  if (candidate.reason === "MISSING_CRITICAL_INFORMATION" && candidate.confidence === "TENTATIVE") {
    return `${candidate.observation} Do you want to clarify it before treating it as confirmed?`;
  }
  if (candidate.reason === "CONTRADICTORY_EVIDENCE") {
    return `${candidate.observation} It may be worth reassessing it.`;
  }
  if (candidate.reason === "DECISION_ASSUMPTION_WEAKENED") {
    return `${candidate.observation} It may be worth reviewing the Decision before continuing.`;
  }
  if (strength === "NOTICE") return candidate.observation;
  return `${candidate.observation}${next}`.trim();
}

function composeWhy(candidate: EcaInitiativeCandidate): string {
  const evidence = candidate.evidence.length > 0 ? ` Evidence: ${candidate.evidence.join("; ")}.` : "";
  return `${candidate.observation}${evidence} This uses canonical context and evidence, not an internal ranking.`;
}

function suppressCandidate(
  candidate: EcaInitiativeCandidate,
  input: EcaExecutiveInitiativeInput,
  session: EcaInitiativeSession,
): EcaInitiativeSuppressionReason | null {
  const why = isEcaInitiativeWhyFollowUp(input.utterance);
  if (why) return "ACTIVE_MANAGER_TASK_MORE_IMPORTANT";

  if (candidate.confidence === "UNKNOWN" && candidate.significance === "UNKNOWN") {
    return "INSUFFICIENT_EVIDENCE";
  }
  if (candidate.significance === "LOW" && !candidate.relatedToCurrentContext) {
    return "LOW_SIGNIFICANCE";
  }
  if (candidate.alreadyOnStage && !candidate.materialChange && candidate.reason !== "HIGH_VALUE_NEXT_STEP") {
    return "ALREADY_SURFACED";
  }
  if (session.dismissedFingerprints.includes(candidate.fingerprint) && !candidate.materialChange) {
    return "RECENTLY_DISMISSED";
  }
  if (session.acknowledgedFingerprints.includes(candidate.fingerprint) && !candidate.materialChange) {
    return "ALREADY_ACKNOWLEDGED";
  }
  if (session.lastFingerprint === candidate.fingerprint && !candidate.materialChange) {
    return "DUPLICATE_GUIDANCE";
  }
  if (
    candidate.confidence === "TENTATIVE" &&
    (candidate.reason === "GOAL_AT_RISK" || candidate.reason === "RISK_ESCALATION") &&
    /capacity|cap_av/i.test(`${candidate.subject?.id ?? ""} ${candidate.observation}`)
  ) {
    return "UNCONFIRMED_SEMANTICS";
  }

  const explicit = EXPLICIT_REQUEST_INTENTS.includes(input.actionPlan.intent);
  const hardExplicit =
    input.actionPlan.intent === "EXPLAIN" ||
    input.actionPlan.intent === "SHOW" ||
    input.actionPlan.intent === "COUNT" ||
    input.actionPlan.intent === "LOCATE" ||
    input.actionPlan.intent === "INSPECT_EVIDENCE";
  if (hardExplicit && candidate.reason !== "MANAGER_OVERSIGHT_RISK") {
    return "ACTIVE_MANAGER_TASK_MORE_IMPORTANT";
  }
  if (
    explicit &&
    !candidate.relatedToCurrentContext &&
    candidate.significance !== "CRITICAL"
  ) {
    return "ACTIVE_MANAGER_TASK_MORE_IMPORTANT";
  }
  if (explicit && candidate.reason === "HIGH_VALUE_NEXT_STEP" && input.actionPlan.intent !== "SEEK_RECOMMENDATION") {
    return "ACTIVE_MANAGER_TASK_MORE_IMPORTANT";
  }
  if (candidate.significance === "LOW") return "LOW_SIGNIFICANCE";
  return null;
}

function rankCandidate(candidate: EcaInitiativeCandidate): number {
  return (
    (candidate.relatedToCurrentContext ? 20 : 0) +
    SIGNIFICANCE_RANK[candidate.significance] * 4 +
    URGENCY_RANK[candidate.urgency] * 2 +
    CONFIDENCE_RANK[candidate.confidence]
  );
}

function silence(
  input: EcaExecutiveInitiativeInput,
  reason: EcaInitiativeSuppressionReason,
  extras?: {
    competingCount?: number;
    sources?: readonly string[];
    rationale?: string;
  },
): EcaExecutiveInitiativeJudgment {
  return freeze({
    identity: ECA_EXECUTIVE_INITIATIVE_IDENTITY,
    shouldIntervene: false,
    reason: "NO_JUSTIFIED_INITIATIVE",
    significance: "UNKNOWN",
    urgency: "UNKNOWN",
    confidence: "UNKNOWN",
    strength: null,
    subject: null,
    evidence: Object.freeze([]),
    recommendedActionPlan: freeze({
      identity: input.actionPlan.identity,
      intent: input.actionPlan.intent,
      nextAction: input.actionPlan.nextAction,
    }),
    suppressionReason: reason,
    timing: null,
    guidance: null,
    whyExplanation: null,
    fingerprint: null,
    competingCount: extras?.competingCount ?? 0,
    provenance: freeze({
      sources: freeze([...(extras?.sources ?? ["ECA:1", "ECA:2", "ECA:3"])]),
      rationale: extras?.rationale ?? "Silence is the valid executive decision.",
      reusedNca5: Boolean(input.nca5),
      reusedEca2: true,
    }),
    boundaries: BOUNDARIES,
  });
}

export function judgeEcaExecutiveInitiative(
  input: EcaExecutiveInitiativeInput,
): EcaExecutiveInitiativeJudgment {
  const session = input.session ?? emptyEcaInitiativeSession();
  const candidates = composeEcaInitiativeCandidates(input);

  if (isEcaInitiativeWhyFollowUp(input.utterance) && session.lastWhy) {
    return freeze({
      identity: ECA_EXECUTIVE_INITIATIVE_IDENTITY,
      shouldIntervene: false,
      reason: session.lastReason ?? "NO_JUSTIFIED_INITIATIVE",
      significance: "UNKNOWN",
      urgency: "UNKNOWN",
      confidence: "UNKNOWN",
      strength: null,
      subject: null,
      evidence: Object.freeze([]),
      recommendedActionPlan: freeze({
        identity: input.actionPlan.identity,
        intent: input.actionPlan.intent,
        nextAction: input.actionPlan.nextAction,
      }),
      suppressionReason: "ACTIVE_MANAGER_TASK_MORE_IMPORTANT",
      timing: "AS_PART_OF_RESPONSE",
      guidance: null,
      whyExplanation: session.lastWhy,
      fingerprint: session.lastFingerprint,
      competingCount: candidates.length,
      provenance: freeze({
        sources: freeze(["ECA:3", "ECA:1", "ECA:2"]),
        rationale: "Manager asked why; explain canonical evidence without a new interruption.",
        reusedNca5: Boolean(input.nca5),
        reusedEca2: true,
      }),
      boundaries: BOUNDARIES,
    });
  }

  if (isEcaInitiativeAcknowledgement(input.utterance) || isEcaInitiativeDismissal(input.utterance)) {
    return silence(input, isEcaInitiativeDismissal(input.utterance) ? "RECENTLY_DISMISSED" : "ALREADY_ACKNOWLEDGED", {
      competingCount: candidates.length,
      rationale: "Manager closed or acknowledged the turn; preserve silence.",
    });
  }

  const evaluated = candidates.map((candidate) => ({
    candidate,
    suppression: suppressCandidate(candidate, input, session),
  }));
  const eligible = evaluated.filter((item) => item.suppression == null).map((item) => item.candidate);

  if (eligible.length === 0) {
    const first = evaluated[0];
    return silence(input, first?.suppression ?? "NO_JUSTIFIED_INITIATIVE", {
      competingCount: candidates.length,
      rationale: `All ${candidates.length} candidate(s) were suppressed.`,
    });
  }

  const winner = [...eligible].sort((left, right) => rankCandidate(right) - rankCandidate(left))[0];
  const strength = chooseStrength(winner);
  const explicit = EXPLICIT_REQUEST_INTENTS.includes(input.actionPlan.intent);
  const timing: EcaInitiativeTiming =
    winner.reason === "MANAGER_OVERSIGHT_RISK" || winner.reason === "MISSING_CRITICAL_INFORMATION"
      ? explicit
        ? "AS_PART_OF_RESPONSE"
        : "BEFORE_RESPONSE"
      : explicit
        ? "AFTER_ANSWER"
        : "AS_PART_OF_RESPONSE";

  return freeze({
    identity: ECA_EXECUTIVE_INITIATIVE_IDENTITY,
    shouldIntervene: true,
    reason: winner.reason,
    significance: winner.significance,
    urgency: winner.urgency,
    confidence: winner.confidence,
    strength,
    subject: winner.subject,
    evidence: freeze([...winner.evidence]),
    recommendedActionPlan: freeze({
      identity: input.actionPlan.identity,
      intent: input.actionPlan.intent,
      nextAction: input.actionPlan.nextAction,
    }),
    suppressionReason: null,
    timing,
    guidance: composeGuidance(winner, strength),
    whyExplanation: composeWhy(winner),
    fingerprint: winner.fingerprint,
    competingCount: candidates.length,
    provenance: freeze({
      sources: freeze(["ECA:1", "ECA:2", "ECA:3", winner.source]),
      rationale: `Selected one ${winner.reason} candidate; competingCount=${candidates.length}.`,
      reusedNca5: winner.source === "NCA:5" || Boolean(input.nca5),
      reusedEca2: true,
    }),
    boundaries: BOUNDARIES,
  });
}

export function nextEcaInitiativeSession(
  previous: EcaInitiativeSession | null | undefined,
  utterance: string,
  judgment: EcaExecutiveInitiativeJudgment,
): EcaInitiativeSession {
  const base = previous ?? emptyEcaInitiativeSession();
  const last = judgment.fingerprint ?? base.lastFingerprint;
  let dismissed = [...base.dismissedFingerprints];
  let acknowledged = [...base.acknowledgedFingerprints];
  if (last && isEcaInitiativeDismissal(utterance)) {
    if (!dismissed.includes(last)) dismissed = [...dismissed, last];
  }
  if (last && isEcaInitiativeAcknowledgement(utterance)) {
    if (!acknowledged.includes(last)) acknowledged = [...acknowledged, last];
  }
  return freeze({
    lastFingerprint: judgment.shouldIntervene ? judgment.fingerprint : base.lastFingerprint,
    lastReason: judgment.shouldIntervene ? judgment.reason : base.lastReason,
    lastGuidance: judgment.shouldIntervene ? judgment.guidance : base.lastGuidance,
    lastWhy: judgment.shouldIntervene ? judgment.whyExplanation : base.lastWhy ?? judgment.whyExplanation,
    dismissedFingerprints: freeze(dismissed.slice(-12)),
    acknowledgedFingerprints: freeze(acknowledged.slice(-12)),
  });
}

export function applyEcaInitiativeToPresentedResponse(input: {
  readonly source: string;
  readonly utterance: string;
  readonly judgment: EcaExecutiveInitiativeJudgment;
  readonly nca5AlreadySpoke: boolean;
  readonly locked: boolean;
}): string {
  if (input.locked) return input.source;
  if (
    isEcaInitiativeWhyFollowUp(input.utterance) &&
    input.judgment.whyExplanation &&
    !isAlreadyPresent(input.source, input.judgment.whyExplanation)
  ) {
    return `${input.source} ${input.judgment.whyExplanation}`.trim();
  }
  if (!input.judgment.shouldIntervene || !input.judgment.guidance) return input.source;
  if (input.nca5AlreadySpoke) return input.source;
  if (isAlreadyPresent(input.source, input.judgment.guidance)) return input.source;
  if (input.judgment.timing === "BEFORE_RESPONSE") {
    return `${input.judgment.guidance} ${input.source}`.trim();
  }
  return `${input.source} ${input.judgment.guidance}`.trim();
}

function isAlreadyPresent(source: string, fragment: string): boolean {
  const hay = source.toLowerCase();
  return fragment
    .toLowerCase()
    .split(/\s+/)
    .slice(0, 6)
    .every((token) => hay.includes(token));
}
