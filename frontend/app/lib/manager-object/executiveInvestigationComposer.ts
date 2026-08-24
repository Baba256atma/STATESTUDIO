/**
 * FINAL:5 — compose multi-object investigation answers from existing
 * CORE-INT:3 / live relationships / catalog evidence. Not a new engine.
 */

import { projectGroundedCausalConstraintIntelligence } from "@/app/lib/executive-intelligence/nexoraGroundedCausalConstraintIntelligence.ts";
import { collectNexoraLiveRelationshipSources } from "@/app/lib/nex-mvp/nexoraLiveEpistemicProjection.ts";
import { getNexoraMVPSubjectPresentationFixture } from "@/app/lib/nex-mvp/nexoraMVPPresentationFixtures.ts";
import { NEXORA_MVP_STAGE_OBJECT_FIXTURES } from "@/app/lib/nex-mvp/nexoraMVPStageFixtures.ts";
import { NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES as CONTEXT_SUBJECTS } from "@/app/lib/nex-mvp/nexoraMVPObjectInteractionFixtures.ts";
import type { NexoraMVPObjectInteractionCatalog } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  classifyExecutiveInvestigationAsk,
  normalizeNexoraConversationalUtterance,
  type ExecutiveInvestigationAsk,
} from "@/app/lib/conversational-control/conversationalIntentNormalization.ts";
import type { ManagerObjectSession } from "./managerObjectActive.ts";
import type { NexoraExecutiveScenarioConversationResult } from "@/app/lib/conversational-control/executiveScenarioResolver.ts";
import type { NexoraDecisionCommitmentResult } from "@/app/lib/conversational-control/executiveDecisionCommitmentResolver.ts";

const WORKFLOW = new Set(["explored-by", "implements", "acts-on", "sources"]);

export type ManagerReportedObservation = {
  readonly text: string;
  readonly provenance: "manager-reported";
  readonly matchedLabel: string | null;
};

export type ExecutiveInvestigationThread = {
  readonly question: string;
  readonly subjectId: string;
  readonly subjectLabel: string;
  readonly candidateIds: readonly string[];
  readonly observations: readonly ManagerReportedObservation[];
};

export type InvestigationCandidate = {
  readonly id: string;
  readonly label: string;
  readonly relationKind: string;
  readonly directed: boolean;
  readonly strength: "some" | "weak" | "none";
  readonly support: string;
  readonly missing: string;
};

function looksLikeInternalSubjectId(value: string): boolean {
  return (
    /^(goal-|obj-|ctx-|kpi-|scen-|dec-|exec-)/i.test(value) ||
    /executive-discovered/.test(value)
  );
}

function labelFor(id: string): string {
  const found =
    NEXORA_MVP_STAGE_OBJECT_FIXTURES.find((item) => item.id === id)?.label ??
    CONTEXT_SUBJECTS.find((item) => item.id === id)?.label ??
    null;
  if (found && !looksLikeInternalSubjectId(found)) return found;
  if (looksLikeInternalSubjectId(id)) {
    if (id.startsWith("goal-")) return "the Goal";
    if (id.startsWith("obj-")) {
      return id.replace(/^obj-/, "").replace(/-synth$/, "").replace(/-/g, " ");
    }
    if (id.startsWith("ctx-")) return "this issue";
    return "this subject";
  }
  return found ?? id;
}

function attentionFor(id: string): string {
  return (
    NEXORA_MVP_STAGE_OBJECT_FIXTURES.find((item) => item.id === id)?.attention ??
    CONTEXT_SUBJECTS.find((item) => item.id === id)?.attention ??
    "normal"
  );
}

function statusFor(id: string): string {
  return (
    NEXORA_MVP_STAGE_OBJECT_FIXTURES.find((item) => item.id === id)?.status ??
    CONTEXT_SUBJECTS.find((item) => item.id === id)?.status ??
    "stable"
  );
}

function isProblem(id: string): boolean {
  return CONTEXT_SUBJECTS.some((item) => item.id === id && item.kind === "problem");
}

export function collectInvestigationCandidates(
  subjectId: string,
): readonly InvestigationCandidate[] {
  const edges = collectNexoraLiveRelationshipSources(subjectId);
  const causal = projectGroundedCausalConstraintIntelligence({
    subjectId,
    subjectLabel: labelFor(subjectId),
    subjectKind: "object",
    isOverview: false,
    relationships: edges,
  });
  const rankedIds = new Set<string>();
  const candidates: InvestigationCandidate[] = [];

  const consider = (
    id: string | null | undefined,
    relationKind: string,
    directed: boolean,
  ) => {
    if (!id || id === subjectId || rankedIds.has(id)) return;
    if (WORKFLOW.has(relationKind)) return;
    const attention = attentionFor(id);
    const status = statusFor(id);
    const problem = isProblem(id);
    const explanatory =
      relationKind === "depends-on" ||
      relationKind === "affected-by" ||
      relationKind === "constrained-by" ||
      relationKind === "blocks" ||
      relationKind === "affects";
    const noteworthy =
      problem ||
      explanatory ||
      attention === "important" ||
      attention === "critical" ||
      status === "watch" ||
      status === "risk";
    if (!noteworthy) return;
    rankedIds.add(id);
    const presentation = getNexoraMVPSubjectPresentationFixture(id);
    const kpi = presentation?.primaryKpi;
    const supportParts = [
      `${labelFor(id)} is ${directed ? "recorded in a directional relationship with" : "associated with"} ${labelFor(subjectId)}.`,
      kpi
        ? `${labelFor(id)} currently shows ${kpi.label} at ${kpi.value}${kpi.target ? ` against ${kpi.target}` : ""}.`
        : `${labelFor(id)} is in ${status} condition.`,
    ];
    const strength: InvestigationCandidate["strength"] =
      explanatory || problem || attention === "critical" ? "some" : "weak";
    candidates.push({
      id,
      label: labelFor(id),
      relationKind,
      directed,
      strength,
      support: supportParts.join(" "),
      missing:
        "There is not enough evidence to treat this as a confirmed cause.",
    });
  };

  for (const item of causal.causal.contributors) {
    consider(item.subjectId, item.relationKind, true);
  }
  for (const edge of edges) {
    consider(
      edge.otherId,
      edge.relationKind,
      edge.direction === "inbound" || edge.direction === "outbound",
    );
  }
  return Object.freeze(candidates.slice(0, 4));
}

function knownCondition(subjectId: string): string | null {
  const presentation = getNexoraMVPSubjectPresentationFixture(subjectId);
  const kpi = presentation?.primaryKpi;
  if (!kpi) return null;
  if (kpi.target) {
    return `${labelFor(subjectId)} is currently ${kpi.value} against a ${kpi.target} target${kpi.delta ? ` (${kpi.delta})` : ""}.`;
  }
  return `${labelFor(subjectId)} currently shows ${kpi.label} at ${kpi.value}.`;
}

function theSubject(label: string): string {
  return /^(the|this|a)\b/i.test(label.trim()) ? label.trim() : `the ${label.trim()}`;
}

function names(candidates: readonly InvestigationCandidate[]): string {
  if (candidates.length === 0) return "no registered related factors";
  if (candidates.length === 1) return candidates[0]!.label;
  return `${candidates
    .slice(0, -1)
    .map((item) => item.label)
    .join(", ")} and ${candidates[candidates.length - 1]!.label}`;
}

function findMentionedCandidate(
  normalized: string,
  candidates: readonly InvestigationCandidate[],
): InvestigationCandidate | null {
  const hit = candidates.find((item) =>
    normalized.includes(item.label.toLowerCase()),
  );
  if (hit) return hit;
  if (/capacity/.test(normalized)) {
    return candidates.find((item) => /capacity/i.test(item.label)) ?? null;
  }
  if (/other/.test(normalized)) {
    return candidates[1] ?? candidates[0] ?? null;
  }
  return candidates[0] ?? null;
}

function applyObservations(
  candidates: readonly InvestigationCandidate[],
  observations: readonly ManagerReportedObservation[],
): readonly InvestigationCandidate[] {
  if (observations.length === 0) return candidates;
  return Object.freeze(
    candidates.map((item) => {
      const matched = observations.some(
        (observation) =>
          observation.matchedLabel != null &&
          observation.matchedLabel.toLowerCase() === item.label.toLowerCase(),
      );
      if (!matched) return item;
      return {
        ...item,
        strength: "some" as const,
        support: `${item.support} A manager-reported observation also points at ${item.label}; that is not validated system evidence.`,
      };
    }),
  );
}

function strongerPair(candidates: readonly InvestigationCandidate[]): {
  readonly winner: InvestigationCandidate | null;
  readonly tied: boolean;
} {
  if (candidates.length < 2) return { winner: candidates[0] ?? null, tied: false };
  const score = (item: InvestigationCandidate) =>
    (item.strength === "some" ? 2 : item.strength === "weak" ? 1 : 0) +
    (item.directed ? 1 : 0) +
    (isProblem(item.id) ? 1 : 0);
  const sorted = [...candidates].sort((a, b) => score(b) - score(a));
  const first = sorted[0]!;
  const second = sorted[1]!;
  if (score(first) === score(second)) return { winner: null, tied: true };
  return { winner: first, tied: false };
}

export function composeExecutiveInvestigationAnswer(input: {
  readonly utterance: string;
  readonly ask: ExecutiveInvestigationAsk;
  readonly focusId: string | null;
  readonly thread: ExecutiveInvestigationThread | null;
  readonly catalog?: NexoraMVPObjectInteractionCatalog;
  readonly scenarioResult?: NexoraExecutiveScenarioConversationResult | null;
  readonly decisionResult?: NexoraDecisionCommitmentResult | null;
}): {
  readonly answer: string;
  readonly thread: ExecutiveInvestigationThread | null;
} {
  const normalized = normalizeNexoraConversationalUtterance(input.utterance);
  const subjectId =
    input.ask === "open-why"
      ? (input.focusId ?? input.thread?.subjectId ?? null)
      : (input.thread?.subjectId ?? input.focusId);
  if (subjectId == null && input.ask !== "manager-observation") {
    return { answer: "", thread: input.thread };
  }

  const reopen =
    input.ask === "open-why" &&
    subjectId != null &&
    (!input.thread || input.thread.subjectId !== subjectId);

  const nextThread: ExecutiveInvestigationThread = reopen && subjectId
    ? {
        question: input.utterance.trim(),
        subjectId,
        subjectLabel: labelFor(subjectId),
        candidateIds: collectInvestigationCandidates(subjectId).map(
          (item) => item.id,
        ),
        observations: Object.freeze([]),
      }
    : input.thread
      ? {
          ...input.thread,
          question:
            input.ask === "open-why"
              ? input.utterance.trim()
              : input.thread.question,
        }
      : subjectId
        ? {
            question: input.utterance.trim(),
            subjectId,
            subjectLabel: labelFor(subjectId),
            candidateIds: collectInvestigationCandidates(subjectId).map(
              (item) => item.id,
            ),
            observations: Object.freeze([]),
          }
        : {
            question: input.utterance.trim(),
            subjectId: input.focusId ?? "",
            subjectLabel: labelFor(input.focusId ?? ""),
            candidateIds: Object.freeze([]),
            observations: Object.freeze([]),
          };

  let observations = nextThread.observations;
  if (input.ask === "manager-observation") {
    const matched =
      collectInvestigationCandidates(nextThread.subjectId).find((item) =>
        normalized.includes(item.label.toLowerCase().split(" ")[0] ?? ""),
      ) ?? null;
    const observation: ManagerReportedObservation = {
      text: input.utterance.trim(),
      provenance: "manager-reported",
      matchedLabel: matched?.label ?? null,
    };
    observations = Object.freeze([...observations, observation]);
  }

  const candidates = applyObservations(
    collectInvestigationCandidates(nextThread.subjectId),
    observations,
  );
  const thread: ExecutiveInvestigationThread = {
    ...nextThread,
    candidateIds: Object.freeze(candidates.map((item) => item.id)),
    observations,
  };

  const known = knownCondition(thread.subjectId);
  const subject = thread.subjectLabel;

  if (input.ask === "open-why") {
    const answer = [
      known,
      candidates.length > 0
        ? `${names(candidates)} ${candidates.length === 1 ? "is a" : "are"} plausible explanation${candidates.length === 1 ? "" : "s"} worth investigating for ${subject}.`
        : `There is not currently a registered related factor that can be treated as an explanation for ${subject}.`,
      "None of these is a confirmed cause.",
      "I can inspect the evidence for each, or we can look at what remains unknown.",
    ]
      .filter(Boolean)
      .join(" ");
    return { answer, thread };
  }

  if (input.ask === "list-explanations") {
    return {
      answer: [
        `The larger investigation is still ${subject}.`,
        candidates.length > 0
          ? `Plausible explanations remain ${names(candidates)}.`
          : "No additional registered explanations are available.",
        "Related is not the same as caused. Current evidence does not confirm a root cause.",
      ].join(" "),
      thread,
    };
  }

  if (input.ask === "evidence-for") {
    const target = findMentionedCandidate(normalized, candidates);
    if (!target) {
      return {
        answer: `I do not have a registered explanation in this investigation that matches that request.`,
        thread,
      };
    }
    return {
      answer: [
        `${target.label} is a candidate explanation for ${subject}, not a confirmed cause.`,
        `Supporting evidence: ${target.support}`,
        `Missing: ${target.missing}`,
      ].join(" "),
      thread,
    };
  }

  if (input.ask === "are-you-sure" || input.ask === "fact-or-assumption") {
    return {
      answer:
        "That is not a confirmed cause. The recorded relationships and current conditions are known; treating any of them as the reason is still an assumption until stronger evidence arrives.",
      thread,
    };
  }

  if (input.ask === "stronger") {
    const comparison = strongerPair(candidates);
    if (comparison.tied || comparison.winner == null) {
      return {
        answer: `Both remain plausible. Current evidence does not justify ranking one explanation above the other for ${subject}.`,
        thread,
      };
    }
    return {
      answer: `${comparison.winner.label} currently has stronger supporting evidence than the other candidates, but it is still not a confirmed cause.`,
      thread,
    };
  }

  if (input.ask === "unknowns") {
    return {
      answer: [
        `We know the current condition of ${subject}${known ? `: ${known.replace(`${subject} is currently `, "")}` : "."}`,
        `We do not have validated causal proof among ${names(candidates)}.`,
        `To distinguish the leading explanations we would need contemporaneous observations for the same period as ${theSubject(subject)} result — without inventing measurements we do not have.`,
      ].join(" "),
      thread,
    };
  }

  if (input.ask === "what-can-we-do") {
    const first = candidates[0]?.label;
    const second = candidates[1]?.label;
    return {
      answer: [
        `Because the cause of ${subject} is unconfirmed, the useful branches are: do nothing, investigate or act on ${first ?? "the current subject"}${second ? `, or address ${second}` : ""}.`,
        "A scenario built on a candidate explanation remains an assumption, not proof of the cause.",
      ].join(" "),
      thread,
    };
  }

  if (input.ask === "address-other") {
    const other =
      candidates.find(
        (item) =>
          item.id !== input.focusId &&
          item.id !== thread.subjectId,
      ) ??
      candidates[1] ??
      candidates[0];
    return {
      answer: other
        ? `Addressing ${other.label} is a scenario branch of the ${subject} investigation. It assumes ${other.label} is worth acting on; it does not confirm that ${other.label} caused the issue.`
        : `There is not a second registered explanation to branch from.`,
      thread,
    };
  }

  if (input.ask === "manager-observation") {
    const last = observations[observations.length - 1];
    return {
      answer: last?.matchedLabel
        ? `I am treating that as a manager-reported observation about ${last.matchedLabel}, not validated system evidence. ${last.matchedLabel} becomes more worth investigating, but correlation is not causation.`
        : "I am treating that as a manager-reported observation. It is not validated Data Reality evidence, and I will not invent a registered object to hold it.",
      thread,
    };
  }

  if (input.ask === "recommend-under-uncertainty") {
    const comparison = strongerPair(candidates);
    const lead = comparison.winner ?? candidates[0];
    return {
      answer: lead
        ? `I would not treat an expensive response as proven. ${lead.label} is the most useful next investigation for ${subject}, but the evidence does not yet establish it as the cause. Reducing that uncertainty first is safer than acting as if the root cause were known.`
        : `Reduce uncertainty first. There is not enough evidence to recommend a committed course of action for ${subject}.`,
      thread,
    };
  }

  if (input.ask === "why-chose") {
    const decision = input.decisionResult?.decision;
    const preferred = input.scenarioResult?.comparison?.preferredScenarioId;
    return {
      answer: [
        thread.question
          ? `We were investigating ${thread.question.replace(/\?$/, "")}.`
          : `We were investigating ${subject}.`,
        `Candidate explanations considered: ${names(candidates)}.`,
        decision
          ? `The committed path is ${decision.title}.`
          : preferred
            ? `The preferred scenario under current evidence was retained as preference, not as a reconstructed story.`
            : "No committed Decision is on record yet.",
        "I will not invent a rationale that was not part of this investigation.",
      ].join(" "),
      thread,
    };
  }

  if (input.ask === "rejected") {
    const namesList = candidates.slice(1).map((item) => item.label);
    return {
      answer:
        namesList.length > 0
          ? `${namesList.join(" and ")} remain available but were not preferred because the cause is unconfirmed and a larger commitment would rest on an assumption.`
          : "No compared alternative is on record to reject.",
      thread,
    };
  }

  if (input.ask === "reconsider") {
    return {
      answer: `If new validated evidence shows the current preferred explanation is not driving ${subject} while the condition remains, the other candidates would become more important to investigate. That is a condition for reconsideration, not a prediction.`,
      thread,
    };
  }

  return { answer: "", thread };
}

export function withInvestigationThread(
  session: ManagerObjectSession,
  thread: ExecutiveInvestigationThread | null,
): ManagerObjectSession {
  return Object.freeze({
    ...session,
    investigationQuestion: thread?.question ?? session.investigationQuestion ?? null,
    investigationSubjectId: thread?.subjectId ?? session.investigationSubjectId ?? null,
    investigationCandidateIds:
      thread?.candidateIds ?? session.investigationCandidateIds ?? Object.freeze([]),
    managerObservations:
      thread?.observations ?? session.managerObservations ?? Object.freeze([]),
  });
}

export function threadFromSession(
  session: ManagerObjectSession | null | undefined,
): ExecutiveInvestigationThread | null {
  if (!session?.investigationSubjectId) return null;
  return {
    question: session.investigationQuestion ?? "",
    subjectId: session.investigationSubjectId,
    subjectLabel: labelFor(session.investigationSubjectId),
    candidateIds: session.investigationCandidateIds ?? Object.freeze([]),
    observations: session.managerObservations ?? Object.freeze([]),
  };
}

export { classifyExecutiveInvestigationAsk };
