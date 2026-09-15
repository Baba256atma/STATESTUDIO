/**
 * NPA-T NPS:2 runtime adapter.
 * Gathers observed facts from existing MO / catalog / investigation / conversation
 * projections. Does not store Problem truth or run a second investigation engine.
 */

import { getNexoraMVPSubjectPresentationFixture } from "@/app/lib/nex-mvp/nexoraMVPPresentationFixtures.ts";
import { NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES } from "@/app/lib/nex-mvp/nexoraMVPObjectInteractionFixtures.ts";
import type { ManagerObjectTurn } from "@/app/lib/manager-object/managerObjectInteraction.ts";
import type { ExecutiveInvestigationThread } from "@/app/lib/manager-object/executiveInvestigationComposer.ts";
import type { EcaSubject } from "@/app/lib/nexora-conversation/ecaWorkingConversationContext.ts";
import {
  composeNpsProblemSolvingPath,
  type NpsCanonicalFacts,
  type NpsProblemSolvingPath,
} from "./npsProblemSolvingPath.ts";
import {
  composeNpsProblemUnderstanding,
  type NpsProblemUnderstanding,
  type NpsUnderstandingFacts,
} from "./npsProblemUnderstanding.ts";

function freeze<T>(value: T): T {
  return Object.freeze(value);
}

function problemRecord(id: string | null | undefined) {
  if (!id) return null;
  return NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES.find((item) => item.id === id && item.kind === "problem") ?? null;
}

function isProblemId(id: string | null | undefined): boolean {
  return problemRecord(id) != null;
}

function followUpPreservesProblem(utterance: string): boolean {
  const text = utterance.trim().toLowerCase();
  return (
    /^(?:why do we need that|why do you need that|why is that needed)\??$/.test(text) ||
    /^(?:investigate it|investigate this|look into it|continue)\.?$/.test(text) ||
    /^(?:what is still missing|what do we know|what remains unknown|what do we still need to know)\??$/.test(text) ||
    /what does the evidence (?:say|show|tell)/.test(text) ||
    /(?:causing it|the cause|definitely the cause)/.test(text) ||
    /what options|which one should we choose|which one do you recommend|tell me more about the .+ option/.test(text) ||
    /^(?:compare them|compare these|compare the options|how do they compare)\??\.?$/.test(text) ||
    /so that(?:'s| is) our decision|why that one|definitely the best|what about capacity expansion plan/.test(text) ||
    /\bi prefer\b|let'?s proceed|did we decide|start it|do it/.test(text) ||
    /did it work|is capacity gap solved|what should we do now|caused the improvement/.test(text) ||
    /^(?:yes|no)\.?$/.test(text) ||
    /are we ready(?: to execute)?|how is it going|is anything going wrong|fix it/.test(text)
  );
}

function explicitProblemFromUtterance(utterance: string): { id: string; label: string } | null {
  const text = utterance.toLowerCase();
  const named = NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES.filter((item) => item.kind === "problem").find((item) =>
    text.includes(item.label.toLowerCase()),
  );
  return named ? { id: named.id, label: named.label } : null;
}

export function resolveNpsRuntimeProblemAnchor(input: {
  readonly utterance: string;
  readonly previousProblemId?: string | null;
  readonly investigationSubjectId?: string | null;
  readonly activeObjectId?: string | null;
  readonly associatedProblemId?: string | null;
  readonly nluProblemId?: string | null;
  readonly stageFocusId?: string | null;
  readonly conversationSubjectId?: string | null;
}): NpsCanonicalFacts["problem"] {
  const explicit = explicitProblemFromUtterance(input.utterance);
  if (explicit) {
    return freeze({
      problemId: explicit.id,
      problemLabel: explicit.label,
      confidence: "HIGH",
      observedFrom: "manager utterance named Problem",
    });
  }
  if (followUpPreservesProblem(input.utterance) && isProblemId(input.previousProblemId)) {
    const previous = problemRecord(input.previousProblemId);
    return freeze({
      problemId: previous!.id,
      problemLabel: previous!.label,
      confidence: "HIGH",
      observedFrom: "NPS:1 preserved Problem ownership",
    });
  }
  const candidates = [
    input.investigationSubjectId,
    input.nluProblemId,
    input.activeObjectId,
    input.associatedProblemId,
  ].filter((id): id is string => isProblemId(id));
  const unique = [...new Set(candidates)];
  if (unique.length === 1) {
    const record = problemRecord(unique[0])!;
    return freeze({
      problemId: record.id,
      problemLabel: record.label,
      confidence: "HIGH",
      observedFrom: "canonical Problem identity",
    });
  }
  if (unique.length > 1) {
    return freeze({
      problemId: null,
      problemLabel: null,
      confidence: "LOW",
      observedFrom: "conflicting Problem candidates",
      candidateProblemIds: freeze(unique),
    });
  }
  if (isProblemId(input.previousProblemId) && followUpPreservesProblem(input.utterance)) {
    const previous = problemRecord(input.previousProblemId)!;
    return freeze({
      problemId: previous.id,
      problemLabel: previous.label,
      confidence: "HIGH",
      observedFrom: "NPS:1 preserved Problem ownership",
    });
  }
  return freeze({
    problemId: null,
    problemLabel: null,
    confidence: "UNKNOWN",
    observedFrom: "UNRESOLVED",
  });
}

function collectUnderstandingFacts(input: {
  readonly problemId: string | null;
  readonly investigationActive: boolean;
  readonly trustedEvidenceForced?: boolean;
  readonly managerKnowledgeForced?: boolean;
  readonly requiredEvidenceUnavailable?: boolean;
}): NpsUnderstandingFacts {
  const problemPresentation = input.problemId
    ? getNexoraMVPSubjectPresentationFixture(input.problemId)
    : null;
  const capacityPresentation = getNexoraMVPSubjectPresentationFixture("obj-capacity");
  const kpi = problemPresentation?.primaryKpi ?? capacityPresentation?.primaryKpi;
  const summary = problemPresentation?.summary ?? capacityPresentation?.summary ?? null;
  const knownFacts = kpi
    ? freeze([
        {
          text: `${kpi.label} is currently ${kpi.value}${kpi.target ? ` against ${kpi.target}` : ""}.`,
          epistemic: "FACT" as const,
          observedFrom: "catalog presentation KPI",
        },
      ])
    : freeze([]);
  const knownSymptoms = summary
    ? freeze([
        {
          text: summary,
          epistemic: "SYMPTOM" as const,
          observedFrom: "catalog presentation summary",
        },
      ])
    : freeze([]);
  const trusted = input.trustedEvidenceForced === true || Boolean(kpi);
  const requiredUnavailable = input.requiredEvidenceUnavailable === true;
  const managerNeed = input.managerKnowledgeForced === true || (!trusted && !requiredUnavailable);
  return freeze({
    knownFacts,
    knownSymptoms,
    knownConstraints: freeze([]),
    unknowns: freeze([
      {
        text: "Whether the gap is temporary or persistent.",
        epistemic: "UNKNOWN" as const,
        observedFrom: "duration not present in current evidence",
      },
    ]),
    assumptions: freeze([
      {
        text: "Current pressure will continue without further evidence.",
        epistemic: "ASSUMPTION" as const,
        observedFrom: "unverified continuation",
      },
    ]),
    unresolvedQuestions: freeze(["Has this been happening for several periods, or only recently?"]),
    availableEvidence: trusted
      ? freeze([
          {
            id: kpi?.id ?? null,
            label: kpi ? `${kpi.label} observation` : "Trusted operational evidence",
            trust: "TRUSTED" as const,
            observedFrom: "catalog / Data Reality observation",
          },
        ])
      : freeze([]),
    missingEvidence: freeze([
      {
        id: null,
        label: requiredUnavailable ? "Required operational evidence is unavailable" : "Duration of the capacity pressure",
        trust: requiredUnavailable ? "UNAVAILABLE" as const : "UNAVAILABLE" as const,
        observedFrom: "Data Reality",
      },
    ]),
    managerKnowledgeRequired: managerNeed && !trusted,
    requiredEvidenceUnavailable: requiredUnavailable,
    trustedEvidenceAvailable: trusted && !requiredUnavailable,
    investigationActive: input.investigationActive,
    investigationCompleted: false,
    usableEvidenceForReview: false,
    nextInvestigationNeed: trusted
      ? "Review recent capacity and demand history."
      : "Determine when the capacity pressure began.",
    usefulQuestion: "Has this been happening for several periods, or only recently?",
    causalObservations: freeze([
      {
        text: "Capacity pressure appears alongside delivery strain and should be investigated.",
        relation: "ASSOCIATION" as const,
        supportedByExistingCausalAuthority: false,
      },
    ]),
  });
}

export function composeNpsRuntimeProblemUnderstanding(input: {
  readonly utterance: string;
  readonly previousProblemId?: string | null;
  readonly turn: ManagerObjectTurn;
  readonly investigationThread?: ExecutiveInvestigationThread | null;
  readonly nluProblemId?: string | null;
  readonly stageFocus?: EcaSubject | null;
  readonly conversationSubject?: EcaSubject | null;
}): Readonly<{
  pathFacts: NpsCanonicalFacts;
  path: NpsProblemSolvingPath;
  understanding: NpsProblemUnderstanding;
}> {
  const associatedProblemId = input.turn.context.associatedProblem.value;
  const problem = resolveNpsRuntimeProblemAnchor({
    utterance: input.utterance,
    previousProblemId: input.previousProblemId ?? null,
    investigationSubjectId: input.investigationThread?.subjectId ?? input.turn.session.investigationSubjectId ?? null,
    activeObjectId: input.turn.activeObjectId,
    associatedProblemId,
    nluProblemId: input.nluProblemId ?? null,
    stageFocusId: input.stageFocus?.id ?? null,
    conversationSubjectId: input.conversationSubject?.id ?? null,
  });
  const investigationActive =
    Boolean(input.investigationThread?.subjectId) &&
    (problem.problemId == null || input.investigationThread?.subjectId === problem.problemId);
  const pathFacts: NpsCanonicalFacts = freeze({
    problem,
    investigationPresent: investigationActive,
    investigationId: investigationActive ? input.investigationThread?.subjectId ?? null : null,
    evidenceState: "NONE",
    causeHypothesesAvailable: false,
    scenarioIds: freeze([]),
    comparisonAvailable: false,
    recommendationReady: false,
    awaitingCommitment: false,
    approvedDecisionId: null,
    execution: freeze({ present: false, executionId: null, status: "NONE" }),
    outcome: freeze({ observed: false, problemResolved: null }),
    stageFocusId: input.stageFocus?.id ?? null,
    conversationSubjectId: input.conversationSubject?.id ?? null,
  });
  const path = composeNpsProblemSolvingPath(pathFacts);
  const understandingFacts = collectUnderstandingFacts({
    problemId: path.problemId,
    investigationActive,
  });
  return freeze({
    pathFacts,
    path,
    understanding: composeNpsProblemUnderstanding({
      path,
      pathFacts,
      understanding: understandingFacts,
    }),
  });
}

export function applyNpsUnderstandingToPresentedResponse(input: {
  readonly source: string;
  readonly utterance: string;
  readonly understanding: NpsProblemUnderstanding;
  readonly ecaAlreadyAsking: boolean;
  readonly locked?: boolean;
}): string {
  if (input.locked) return input.source;
  const text = input.understanding.managerProjection.text;
  if (!text) return input.source;
  if (input.source.toLowerCase().includes(text.slice(0, 28).toLowerCase())) return input.source;
  const utterance = input.utterance.trim();
  const investigate = /\binvestigat/i.test(utterance);
  const whyNeed = /^(?:why do we need that|why do you need that|why is that needed)\??$/i.test(utterance);
  const continueProbe = /^(?:investigate it|investigate this|look into it)\.?$/i.test(utterance);
  if (input.understanding.action === "CLARIFY_PROBLEM") {
    const namedProblem = /\b(capacity gap|margin pressure)\b/i.test(utterance);
    if (namedProblem) return `${input.source} ${text}`.trim();
    return input.source;
  }
  if (whyNeed) {
    const reason = input.understanding.nextInvestigationNeed
      ? `That step is needed because ${input.understanding.nextInvestigationNeed.replace(/\.$/, "").toLowerCase()} is still unresolved.`
      : "That step is needed to close an unresolved gap in the current Problem.";
    if (input.source.toLowerCase().includes(reason.slice(0, 24).toLowerCase())) return input.source;
    return `${input.source} ${reason}`.trim();
  }
  if (!investigate && !continueProbe) return input.source;
  if (input.understanding.problemOwnership !== "DETERMINED") return input.source;
  if (input.ecaAlreadyAsking && input.understanding.action === "ASK_MANAGER") return input.source;
  const facing = text.replace(/\n/g, " ");
  return `${input.source} ${facing}`.trim();
}
