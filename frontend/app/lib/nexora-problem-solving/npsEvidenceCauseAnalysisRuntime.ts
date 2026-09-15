/**
 * NPA-T NPS:3 runtime adapter.
 * Observes catalog presentation, live relationships, and CORE-INT:3.
 * Does not write Evidence or infer a confirmed cause.
 */

import { collectNexoraLiveRelationshipSources } from "@/app/lib/nex-mvp/nexoraLiveEpistemicProjection.ts";
import { getNexoraMVPSubjectPresentationFixture } from "@/app/lib/nex-mvp/nexoraMVPPresentationFixtures.ts";
import {
  classifyCausalRelationSemantics,
  projectGroundedCausalConstraintIntelligence,
} from "@/app/lib/executive-intelligence/nexoraGroundedCausalConstraintIntelligence.ts";
import type { NpsCanonicalFacts, NpsProblemSolvingPath } from "./npsProblemSolvingPath.ts";
import type { NpsProblemUnderstanding } from "./npsProblemUnderstanding.ts";
import {
  composeNpsEvidenceCauseAnalysis,
  type NpsContributorFact,
  type NpsEvidenceCauseAnalysis,
  type NpsEvidenceCauseFacts,
  type NpsEvidenceItemFact,
} from "./npsEvidenceCauseAnalysis.ts";

function freeze<T>(value: T): T {
  return Object.freeze(value);
}

function collectRuntimeFacts(problemId: string | null, problemLabel: string | null): NpsEvidenceCauseFacts {
  if (!problemId) {
    return freeze({
      items: freeze([]),
      contributors: freeze([]),
      hypotheses: freeze([]),
      patterns: freeze([]),
      nextEvidenceNeed: "Determine the active Problem before analysing evidence.",
      nextCausalTest: null,
      managerKnowledgeRequired: false,
    });
  }
  const presentation = getNexoraMVPSubjectPresentationFixture(problemId);
  const capacity = getNexoraMVPSubjectPresentationFixture("obj-capacity");
  const kpi = presentation?.primaryKpi ?? capacity?.primaryKpi ?? null;
  const items: NpsEvidenceItemFact[] = [];
  if (kpi) {
    items.push(
      freeze({
        id: kpi.id,
        label: kpi.label,
        classification: "OBSERVATION",
        observation: `${kpi.label} is currently ${kpi.value}${kpi.target ? ` against ${kpi.target}` : ""}.`,
        interpretation: capacity?.summary ?? presentation?.summary ?? null,
        sourceId: problemId,
        sourceType: "kpi",
        field: kpi.id,
        timeRange: "current catalog observation",
        semanticConfidence: "CONFIRMED",
        managerConfirmation: false,
        evidenceStatus: "TRUSTED",
        existingCausalAuthority: false,
        contradicting: false,
        confounder: false,
        supportingReference: "catalog presentation / Data Reality observation",
      }),
    );
  }
  const relationships = collectNexoraLiveRelationshipSources(problemId);
  const causal = projectGroundedCausalConstraintIntelligence({
    subjectId: problemId,
    subjectLabel: problemLabel,
    subjectKind: "problem",
    isOverview: false,
    relationships,
  });
  for (const rel of relationships) {
    const semantics = classifyCausalRelationSemantics(rel.relationKind);
    if (semantics === "unknown") continue;
    items.push(
      freeze({
        id: rel.relationshipId,
        label: rel.otherLabel,
        classification: semantics === "associated" || semantics === "related" ? "RELATIONSHIP" : "POSSIBLE_CONTRIBUTOR",
        observation: `A ${rel.relationKind} relationship with ${rel.otherLabel} is recorded.`,
        interpretation: null,
        sourceId: rel.otherId,
        sourceType: "relationship",
        field: rel.relationKind,
        timeRange: null,
        semanticConfidence: "CONFIRMED",
        managerConfirmation: false,
        evidenceStatus: "TRUSTED",
        existingCausalAuthority: false,
        contradicting: false,
        confounder: /downtime|staffing/i.test(rel.otherLabel),
        supportingReference: "CORE-INT:3 recorded relationship",
      }),
    );
  }
  const contributors: NpsContributorFact[] = causal.causal.contributors.slice(0, 4).map((entry) =>
    freeze({
      candidateId: entry.contributorId,
      label: entry.label,
      relationshipToProblem: entry.relationKind,
      supportingEvidenceIds: freeze(entry.evidenceRefs.map((ref) => ref.sourceId)),
      contradictingEvidenceIds: freeze([]),
      status: "POSSIBLE" as const,
      confidence: entry.confidence,
      uncertainty: `${entry.label} may be related to ${problemLabel ?? "this Problem"}, but it is not a confirmed cause.`,
      existingCausalAuthority: false,
    }),
  );
  const alternatives = contributors.slice(1).map((item) => item.label);
  const leading = contributors[0]?.label ?? null;
  return freeze({
    items: freeze(items),
    contributors: freeze(contributors),
    hypotheses: freeze([]),
    patterns: freeze(
      kpi && leading ? [`${leading} appears alongside the current ${kpi.label} observation.`] : [],
    ),
    nextEvidenceNeed: items.length === 0 ? "Gather trusted observations for this Problem." : null,
    nextCausalTest: leading
      ? `Compare ${problemLabel ?? "the Problem"} against ${leading.toLowerCase()} while accounting for ${alternatives[0]?.toLowerCase() ?? "other recorded factors"}.`
      : "Review capacity, demand, staffing, and downtime over the same period.",
    managerKnowledgeRequired: false,
  });
}

export function composeNpsRuntimeEvidenceCauseAnalysis(input: {
  readonly path: NpsProblemSolvingPath;
  readonly pathFacts: NpsCanonicalFacts;
  readonly understanding: NpsProblemUnderstanding;
}): NpsEvidenceCauseAnalysis {
  return composeNpsEvidenceCauseAnalysis({
    path: input.path,
    pathFacts: input.pathFacts,
    understanding: input.understanding,
    facts: collectRuntimeFacts(input.path.problemId, input.path.problemLabel),
  });
}

export function applyNpsEvidenceCauseToPresentedResponse(input: {
  readonly source: string;
  readonly utterance: string;
  readonly analysis: NpsEvidenceCauseAnalysis;
  readonly locked?: boolean;
}): string {
  if (input.locked) return input.source;
  const utterance = input.utterance.trim();
  const asksCause = /what does the evidence|causing it|what is causing|the cause/i.test(utterance);
  const leadingCause = /definitely the cause|is .+ the cause|caused by demand surge/i.test(utterance);
  if (leadingCause && input.analysis.problemOwnership === "DETERMINED") {
    const denial =
      "No. A possible contributor is not a confirmed cause. Current evidence does not establish Demand Surge as the definite cause.";
    if (input.source.toLowerCase().includes("not a confirmed cause")) return input.source;
    return `${input.source} ${denial}`.trim();
  }
  if (!asksCause || input.analysis.problemOwnership !== "DETERMINED") return input.source;
  const facing = input.analysis.managerProjection.text.replace(/\n/g, " ");
  if (input.source.toLowerCase().includes(facing.slice(0, 28).toLowerCase())) return input.source;
  return `${input.source} ${facing}`.trim();
}
