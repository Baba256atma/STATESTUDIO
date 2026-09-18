/**
 * NPA-T NMI:7 — compose Advisor-facing NMI context and overlay existing CC:5 responses.
 * Does not own conversation, referent, Decision, or Execution.
 */

import { conversationalExperienceIdentity } from "@/app/lib/conversational-control/conversationalExperience.ts";
import { resolveNmiExplicitSelection } from "./nmiStageProjectionCompose.ts";
import { extractNmiManagementBranch } from "./nmiManagementMapBranch.ts";
import { interpretNmiRelationships } from "./nmiRelationshipIntelligenceInterpret.ts";
import { composeNmiRelationshipGapReport } from "./nmiRelationshipIntelligenceQuery.ts";
import {
  explainAttentionReason,
  findNmiAttentionItem,
  getRelatedManagementContext,
  identifyManagementGaps,
  locateSubjectInManagementMap,
  summarizeDecisionRoadmap,
} from "./nmiAdvisorQuery.ts";
import type { NmiAdvisorBundle, NmiAdvisorContext, NmiAdvisorIntent } from "./nmiAdvisorContract.ts";
import { nmiAdvisorIdentity } from "./nmiAdvisorIdentity.ts";

export type NmiAdvisorComposition = {
  readonly identity: typeof nmiAdvisorIdentity;
  readonly apply: boolean;
  readonly intent: NmiAdvisorIntent;
  readonly response: string | null;
  readonly activeCanonicalId: string | null;
  readonly conversationalAuthority: typeof conversationalExperienceIdentity;
  readonly secondAdvisor: false;
  readonly secondReferentResolver: false;
  readonly requiredAction: false;
  readonly writesDecision: false;
  readonly writesExecution: false;
  readonly writesOutcome: false;
  readonly writesDataReality: false;
  readonly bypassesGate: false;
  readonly causalUpgrade: false;
  readonly readsSealedRmsGroundTruth: false;
};

export function detectNmiAdvisorIntent(utterance: string): NmiAdvisorIntent {
  const text = utterance.trim().toLowerCase();
  if (!text) return "NONE";
  if (/\bwhy is this (?:in attention|here|on the queue)\b/.test(text) || /\bin attention\b/.test(text)) {
    return "ATTENTION";
  }
  if (/\bcause|\bcausing\b|\bcauses\b/.test(text)) return "CAUSAL";
  if (/\bwhy do you think\b|\bwhat evidence\b|\bevidence supports\b/.test(text)) return "EVIDENCE";
  if (/\bwhat is missing\b|\bwhat(?:'s| is) missing\b/.test(text)) return "GAPS";
  if (/\bwhat happens next\b/.test(text)) return "NEXT";
  if (
    /\bwhere are we\b|\bdecision path\b|\bdecision roadmap\b|\bwhat stage\b|\bafter the decision\b|\bshow me its decision\b|\bhas a decision been made\b|\bis this being executed\b/.test(
      text,
    )
  ) {
    return "ROADMAP";
  }
  if (/\bwhat do we know\b/.test(text)) return "KNOW";
  if (
    /\brelated to\b|\bhow is this connected\b|\bconnected to\b|\bwhat problem does this address\b/.test(
      text,
    )
  ) {
    return "RELATED";
  }
  if (
    /\bwhere is\b|\bin my business\b|\bin the company\b|\bmanagement map\b|\bthis part of the (?:management )?map\b/.test(
      text,
    )
  ) {
    return "LOCATION";
  }
  return "NONE";
}

export function composeNmiAdvisorContext(input: {
  readonly resolvedCanonicalId: string | null;
  readonly bundle: NmiAdvisorBundle;
}): NmiAdvisorContext {
  const requestedId = input.resolvedCanonicalId
    ? resolveNmiExplicitSelection({
        explicitCanonicalId: input.resolvedCanonicalId,
        staleQueueSelectedId: input.bundle.staleAttentionId,
        staleStageFocusedId: input.bundle.staleStageBranchId,
        staleAdvisorSubjectId: input.bundle.staleMapSelectionId,
        staleComparisonId: input.bundle.staleComparisonId,
      })
    : null;
  const map = input.bundle.map;
  const node =
    (requestedId ? map.nodes.find((item) => item.nodeId === requestedId) : null) ??
    (requestedId
      ? map.nodes.find((item) => item.title != null && item.title.toLowerCase() === requestedId.toLowerCase()) ?? null
      : null);
  const activeCanonicalId = node?.nodeId ?? requestedId;
  const branch = activeCanonicalId
    ? extractNmiManagementBranch(map, { originNodeId: activeCanonicalId, maxDepth: 4 })
    : null;
  const interpretations = activeCanonicalId
    ? interpretNmiRelationships(map).filter((item) => item.sourceId === activeCanonicalId || item.targetId === activeCanonicalId)
    : Object.freeze([]);
  const gaps = activeCanonicalId ? composeNmiRelationshipGapReport(map, activeCanonicalId).gaps : Object.freeze([]);
  const roadmap = activeCanonicalId ? summarizeDecisionRoadmap(map, activeCanonicalId) : null;
  const attentionItem = activeCanonicalId
    ? findNmiAttentionItem(input.bundle.queueEntries ?? [], input.bundle.subjects, map, activeCanonicalId)
    : null;
  return Object.freeze({
    identity: nmiAdvisorIdentity,
    conversationalAuthority: conversationalExperienceIdentity,
    activeCanonicalId,
    activeTitle: node?.title ?? activeCanonicalId,
    selectedNodeKind: node?.kind ?? null,
    managementContext: map.contextKind,
    branch,
    interpretations,
    relationshipGaps: gaps,
    attentionItem,
    roadmapId: roadmap?.roadmapId ?? null,
    roadmapPosition: roadmap?.position ?? null,
    roadmapStageStatuses: roadmap?.stageStatuses ?? Object.freeze({}),
    possibleNextStages: roadmap?.possibleNextStages ?? Object.freeze([]),
    gapNotes: activeCanonicalId ? identifyManagementGaps(map, activeCanonicalId) : Object.freeze([]),
    evidenceRefs: Object.freeze([...new Set(interpretations.flatMap((item) => [...item.evidenceRefs]))]),
    provenanceRefs: Object.freeze([...new Set(interpretations.flatMap((item) => [...item.provenance]))]),
    unresolvedRelationshipIds: Object.freeze([
      ...new Set([
        ...map.unresolvedRelationshipIds,
        ...interpretations.filter((item) => item.unresolvedReason != null).map((item) => item.relationshipId),
      ]),
    ]),
    stageProjectionAnchorId: input.bundle.stageProjectionAnchorId ?? activeCanonicalId,
    collectionOwnsReferent: false,
    secondAdvisor: false,
    secondReferentResolver: false,
    requiredAction: false,
    writesDecision: false,
    writesExecution: false,
    writesOutcome: false,
    writesDataReality: false,
    bypassesGate: false,
    readsSealedRmsGroundTruth: false,
    startsNmi8: false,
  });
}

function titleOf(mapTitle: string | null | undefined, id: string): string {
  return mapTitle?.trim() || id;
}

function relatedLineFromMap(bundle: NmiAdvisorBundle, context: NmiAdvisorContext): string {
  if (!context.activeCanonicalId) return "No canonical subject is selected.";
  const related = getRelatedManagementContext(bundle.map, context.activeCanonicalId);
  const labels = related.interpretations.map((item) => {
    const other = item.sourceId === context.activeCanonicalId ? item.targetId : item.sourceId;
    const node = bundle.map.nodes.find((entry) => entry.nodeId === other);
    return `${titleOf(node?.title, other)} (${item.kind})`;
  });
  if (labels.length === 0) {
    return `${context.activeTitle} has no canonical management relationships represented.`;
  }
  return `${context.activeTitle} is related to ${labels.join("; ")}.`;
}

function composeText(intent: NmiAdvisorIntent, context: NmiAdvisorContext, bundle: NmiAdvisorBundle): string {
  const title = context.activeTitle ?? "This subject";
  if (!context.activeCanonicalId) {
    return "Which management subject should I use?";
  }
  if (intent === "LOCATION") {
    const located = locateSubjectInManagementMap(bundle.map, context.activeCanonicalId);
    const kind = context.selectedNodeKind?.toLowerCase() ?? "item";
    const related = getRelatedManagementContext(bundle.map, context.activeCanonicalId).relatedIds;
    const relatedTitles = related.map((id) => bundle.map.nodes.find((node) => node.nodeId === id)?.title ?? id);
    const connected =
      relatedTitles.length > 0 ? ` It is connected to ${relatedTitles.join(", ")}.` : " No canonical relationships are represented.";
    return `${title} is a ${kind} in the ${located.contextKind.toLowerCase()} management map.${connected}`;
  }
  if (intent === "RELATED") {
    return relatedLineFromMap(bundle, context);
  }
  if (intent === "CAUSAL") {
    const related = getRelatedManagementContext(bundle.map, context.activeCanonicalId);
    const influence = related.interpretations.find((item) => item.kind === "affects") ?? related.interpretations[0];
    if (!influence || influence.causalCommunication !== "CONFIRMED_CAUSAL_RELATIONSHIP") {
      return `${title} is currently represented as an analytical influence or association. Nexora does not have sufficient evidence to call it a confirmed cause.`;
    }
    return `${title} has a confirmed causal relationship in canonical evidence.`;
  }
  if (intent === "ATTENTION") {
    const explained = explainAttentionReason(
      bundle.queueEntries ?? [],
      bundle.subjects,
      bundle.map,
      context.activeCanonicalId,
    );
    if (!explained) {
      return `${title} is not represented as an Attention item from the existing Queue.`;
    }
    return `${explained.explanation} Attention visibility is not an executive priority ranking.`;
  }
  if (intent === "ROADMAP" || intent === "NEXT") {
    const roadmap = summarizeDecisionRoadmap(bundle.map, context.activeCanonicalId);
    const position = roadmap.position
      ? `${roadmap.position.primary}${roadmap.position.secondary ? ` / ${roadmap.position.secondary}` : ""}`
      : "unknown";
    const next = roadmap.possibleNextStages.map((item) => item.stage).join(", ") || "none represented";
    const prefix = intent === "NEXT" ? "Possible next management stage" : "Current roadmap position";
    const statuses = roadmap.stageStatuses as Readonly<Record<string, string | undefined>>;
    const decisionStatus = statuses.DECISION ?? "MISSING";
    const executionStatus = statuses.EXECUTION ?? "NOT_REACHED";
    const outcomeStatus = statuses.OUTCOME ?? "NOT_REACHED";
    return `${prefix}: ${intent === "NEXT" ? next : position}. Decision is ${decisionStatus}. Execution is ${executionStatus}. Outcome is ${outcomeStatus}. Known related stages follow the current management branch. This is descriptive, not a required action.`;
  }
  if (intent === "GAPS") {
    const notes = identifyManagementGaps(bundle.map, context.activeCanonicalId);
    if (notes.length === 0) return `${title} has no recorded management gaps.`;
    const lines = notes.map((note) => `${note.label} (${note.status})`);
    return `For ${title}: ${lines.join("; ")}. Missing, unresolved, not reached, and not applicable remain distinct.`;
  }
  if (intent === "EVIDENCE") {
    if (context.unresolvedRelationshipIds.length > 0) {
      return `Evidence for ${title} is unresolved. Provenance remains ${context.provenanceRefs.join(", ") || "canonical management relationships"}.`;
    }
    if (context.evidenceRefs.length === 0) {
      return `No additional evidence refs are represented for ${title} beyond declared management relationships.`;
    }
    return `Evidence refs for ${title}: ${context.evidenceRefs.join(", ")}.`;
  }
  const related = getRelatedManagementContext(bundle.map, context.activeCanonicalId);
  const unresolved = context.unresolvedRelationshipIds.length > 0 ? " Some related evidence remains unresolved." : "";
  return `Known for ${title}: ${related.relatedIds.length} canonical related items.${unresolved}`;
}

function empty(intent: NmiAdvisorIntent, activeCanonicalId: string | null): NmiAdvisorComposition {
  return Object.freeze({
    identity: nmiAdvisorIdentity,
    apply: false,
    intent,
    response: null,
    activeCanonicalId,
    conversationalAuthority: conversationalExperienceIdentity,
    secondAdvisor: false,
    secondReferentResolver: false,
    requiredAction: false,
    writesDecision: false,
    writesExecution: false,
    writesOutcome: false,
    writesDataReality: false,
    bypassesGate: false,
    causalUpgrade: false,
    readsSealedRmsGroundTruth: false,
  });
}

export function composeNmiAdvisorAnalysis(input: {
  readonly utterance: string;
  readonly resolvedCanonicalId: string | null;
  readonly bundle: NmiAdvisorBundle | null;
  readonly vaiCausalOwnsResponse?: boolean;
}): NmiAdvisorComposition {
  const intent = detectNmiAdvisorIntent(input.utterance);
  if (intent === "NONE" || !input.bundle) {
    return empty(intent, input.resolvedCanonicalId);
  }
  if (intent === "CAUSAL" && input.vaiCausalOwnsResponse === true) {
    return empty(intent, input.resolvedCanonicalId);
  }
  const context = composeNmiAdvisorContext({
    resolvedCanonicalId: input.resolvedCanonicalId,
    bundle: input.bundle,
  });
  return Object.freeze({
    identity: nmiAdvisorIdentity,
    apply: true,
    intent,
    response: composeText(intent, context, input.bundle),
    activeCanonicalId: context.activeCanonicalId,
    conversationalAuthority: conversationalExperienceIdentity,
    secondAdvisor: false,
    secondReferentResolver: false,
    requiredAction: false,
    writesDecision: false,
    writesExecution: false,
    writesOutcome: false,
    writesDataReality: false,
    bypassesGate: false,
    causalUpgrade: false,
    readsSealedRmsGroundTruth: false,
  });
}

export function applyNmiAdvisorToPresentedResponse(input: {
  readonly source: string;
  readonly utterance: string;
  readonly resolvedCanonicalId: string | null;
  readonly bundle: NmiAdvisorBundle | null;
  readonly vaiCausalOwnsResponse?: boolean;
  readonly locked?: boolean;
}): { readonly source: string; readonly composition: NmiAdvisorComposition } {
  const composition = composeNmiAdvisorAnalysis({
    utterance: input.utterance,
    resolvedCanonicalId: input.resolvedCanonicalId,
    bundle: input.bundle,
    vaiCausalOwnsResponse: input.vaiCausalOwnsResponse,
  });
  if (input.locked || !composition.apply || !composition.response) {
    return { source: input.source, composition };
  }
  return { source: composition.response, composition };
}

export function rejectSealedRmsAdvisorFact(factId: string): {
  readonly factId: string;
  readonly known: false;
  readonly spoken: false;
  readonly readsSealedRmsGroundTruth: false;
} {
  return Object.freeze({
    factId,
    known: false as const,
    spoken: false as const,
    readsSealedRmsGroundTruth: false as const,
  });
}
