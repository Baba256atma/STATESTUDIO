/** NCA-POST:4 — collection-aware candidate precedence and advisory isolation. */

import type { ManagerReference } from "./nexoraNcaPost3SemanticScopeMultiEntityCanonicalCollectionWorkspaceIntelligence.ts";

export const nexoraNcaPost4Identity =
  "NCA-POST:4/CollectionAwareComparisonFollowUpPrecedenceAdvisoryIsolation" as const;
export const nexoraNcaPost4Version = "1.0.0" as const;
export const nexoraNcaPost4Namespace =
  "nexora.nca.post.collection-aware-comparison-precedence-advisory-isolation" as const;

export type ExecutiveComparisonMode =
  | "COMPARE" | "PRIORITIZE" | "RANK" | "CHOOSE" | "DIFFERENCE" | "IMPACT";
export type ExecutiveComparisonCriterion =
  | "OVERALL_SIGNIFICANCE" | "SEVERITY" | "URGENCY" | "COST"
  | "FINANCIAL_IMPACT" | "EVIDENCE_STRENGTH" | "RISK" | "REVERSIBILITY"
  | "INVESTIGATION_PRIORITY" | "GOAL_IMPACT" | "DELIVERY_IMPACT" | "UNSPECIFIED";
export type ExecutiveComparisonReference = Readonly<{ id: string; label: string; kind: string | null }>;

export type ExecutiveComparisonCandidateSet = Readonly<{
  source: "EXPLICIT_REFERENCES" | "ACTIVE_COLLECTION" | "ACTIVE_COMPARISON" | "CONVERSATION_CONTEXT" | "UNRESOLVED";
  collectionKind: string | null;
  candidateIds: readonly string[];
  candidates: readonly ExecutiveComparisonReference[];
  requestedRelation: ExecutiveComparisonMode;
  criterion: ExecutiveComparisonCriterion;
  confidence: "HIGH" | "MODERATE" | "LOW";
  resolvedFromTurn: number | null;
}>;

export type ExecutiveCollectionComparisonResult = Readonly<{
  candidateSet: ExecutiveComparisonCandidateSet;
  mode: ExecutiveComparisonMode;
  criterion: ExecutiveComparisonCriterion;
  evidenceState: "SUFFICIENT" | "PARTIAL" | "INSUFFICIENT";
  preferredCandidateId: string | null;
  ordering: readonly string[];
  reasons: readonly string[];
  uncertainty: readonly string[];
  advisoryCompatible: boolean;
  advisoryEligible: boolean;
  primaryOwner: "COLLECTION_COMPARISON" | "UNRESOLVED";
  commitsDecision: false;
  startsExecution: false;
  businessMutations: readonly string[];
  response: string | null;
}>;

export type ActiveComparisonContext = Readonly<{
  candidateIds: readonly string[];
  candidateKind: string | null;
  mode: ExecutiveComparisonMode;
  criterion: ExecutiveComparisonCriterion;
  establishedAtTurn: number;
  sourceCollectionTurn: number | null;
}>;

export type ExecutiveComparisonMeaning = Readonly<{
  active: boolean;
  mode: ExecutiveComparisonMode;
  criterion: ExecutiveComparisonCriterion;
  criterionAmbiguous: boolean;
  ambiguityReason: "MATERIAL_IMPORTANCE_AMBIGUITY" | null;
}>;

function normalized(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9%]+/g, " ").trim();
}

/** Criterion-token answers complete pending comparison; they are not object navigation. */
export function isExecutiveComparisonCriterionAnswer(utterance: string): boolean {
  return /^(?:risk(?: exposure)?|urgency|urgent|financial(?: impact)?|evidence(?: strength)?|capacity(?: impact)?|severity|cost|overall(?: significance)?|investigation(?: priority)?)$/.test(
    normalized(utterance),
  );
}

/** Semantic lexical classification: category tokens, never exact-sentence handlers. */
export function interpretExecutiveComparisonMeaning(input: {
  utterance: string;
  intentKind: string;
  activeComparison?: ActiveComparisonContext | null;
  activeCollectionPresent?: boolean;
}): ExecutiveComparisonMeaning {
  const text = normalized(input.utterance);
  let active =
    input.intentKind === "compare" || input.intentKind === "compare-scenarios" ||
    input.intentKind === "prioritize" ||
    /\b(compare|difference|rank|which)\b/.test(text);
  let mode: ExecutiveComparisonMode = "COMPARE";
  if (/\bdifference\b/.test(text)) mode = "DIFFERENCE";
  else if (/\brank\b/.test(text)) mode = "RANK";
  else if (/\b(choose|select|prefer)\b/.test(text)) mode = "CHOOSE";
  else if (/\b(affect|affects|impact)\b/.test(text)) mode = "IMPACT";
  else if (/\b(which|worse|better|bigger|priority|more serious|more important|most serious|most important)\b|\bmatters? most\b/.test(text)) mode = "PRIORITIZE";
  let criterion: ExecutiveComparisonCriterion = "UNSPECIFIED";
  if (/\bevidence\b/.test(text)) criterion = "EVIDENCE_STRENGTH";
  else if (/\b(financ|margin|revenue|profit)/.test(text)) criterion = "FINANCIAL_IMPACT";
  else if (/\b(cost|expensive|cheaper)\b/.test(text)) criterion = "COST";
  else if (/\burgent|urgency|immediate\b/.test(text)) criterion = "URGENCY";
  else if (/\brisk|riskier|safer\b/.test(text)) criterion = "RISK";
  else if (/\breversib/.test(text)) criterion = "REVERSIBILITY";
  else if (/\binvestigat|focus first\b/.test(text)) criterion = "INVESTIGATION_PRIORITY";
  if (/\bdelivery\b/.test(text)) criterion = "DELIVERY_IMPACT";
  else if (input.activeComparison && /\bcapacity\b/.test(text)) criterion = "DELIVERY_IMPACT";
  else if (/\bgoal|objective\b/.test(text)) criterion = "GOAL_IMPACT";
  else if (/\bserious|severity\b/.test(text)) criterion = "SEVERITY";
  else if (/\b(overall|broad significance)\b/.test(text)) criterion = "OVERALL_SIGNIFICANCE";
  else if (/\bcompany\b/.test(text) && !/\b(?:important|importance|matters)\b/.test(text)) criterion = "OVERALL_SIGNIFICANCE";
  else if (/\bbusiness\b/.test(text) && !/\b(?:important|importance|matters)\b/.test(text)) criterion = "OVERALL_SIGNIFICANCE";
  const ambiguousImportance =
    /\b(?:important|importance|higher priority|top priority)\b|\bmatters? most\b/.test(text) &&
    criterion === "UNSPECIFIED";
  let criterionAmbiguous = ambiguousImportance;
  let ambiguityReason: ExecutiveComparisonMeaning["ambiguityReason"] = ambiguousImportance
    ? "MATERIAL_IMPORTANCE_AMBIGUITY"
    : null;
  if (input.activeComparison && (/\bwhy\b|\bwhat would change\b|\brecommendation\b/.test(text) || criterion !== "UNSPECIFIED")) {
    active = true;
    if (mode === "COMPARE") mode = input.activeComparison.mode;
    if (criterion === "UNSPECIFIED") criterion = input.activeComparison.criterion;
  }
  if (
    criterionAmbiguous &&
    input.activeComparison?.criterion &&
    input.activeComparison.criterion !== "UNSPECIFIED"
  ) {
    criterion = input.activeComparison.criterion;
    criterionAmbiguous = false;
    ambiguityReason = null;
  }
  const criterionAnswer = Boolean(
    input.activeComparison && isExecutiveComparisonCriterionAnswer(input.utterance),
  );
  const comparisonFollowUp = Boolean(
    criterionAnswer ||
    ((input.activeComparison || input.activeCollectionPresent) &&
    /\b(?:which|compare|rank|important|matters?|urgent|riskier|safer|investigat\w*|attention|why|bigger|recommendation)\b|\bwhat would change\b/.test(text)),
  );
  if (criterionAnswer) {
    active = true;
    if (mode === "COMPARE") mode = input.activeComparison!.mode;
  }
  if (
    (input.intentKind.startsWith("show-") || input.intentKind === "focus" || input.intentKind === "explain") &&
    !comparisonFollowUp
  ) {
    active = false;
  }
  return Object.freeze({ active, mode, criterion, criterionAmbiguous, ambiguityReason });
}

function ref(value: ManagerReference): ExecutiveComparisonReference {
  return Object.freeze({ id: value.id, label: value.name, kind: value.kind });
}

export function resolveExecutiveComparisonCandidateSet(input: {
  meaning: ReturnType<typeof interpretExecutiveComparisonMeaning>;
  explicitReferences: readonly ManagerReference[];
  activeCollection: Readonly<{ kind: string; members: readonly ManagerReference[]; establishedAtTurn: number }> | null;
  activeComparison: ActiveComparisonContext | null;
  catalogReferences: readonly ManagerReference[];
  turn: number;
}): ExecutiveComparisonCandidateSet {
  const explicit = input.explicitReferences.filter((item, index, all) =>
    all.findIndex((candidate) => candidate.id === item.id) === index,
  );
  let source: ExecutiveComparisonCandidateSet["source"] = "UNRESOLVED";
  let candidates: readonly ManagerReference[] = Object.freeze([]);
  let kind: string | null = null;
  let resolvedFromTurn: number | null = null;
  if (explicit.length >= 2) {
    source = "EXPLICIT_REFERENCES";
    candidates = explicit;
  } else if (input.activeCollection) {
    source = "ACTIVE_COLLECTION";
    candidates = input.activeCollection.members;
    kind = input.activeCollection.kind;
    resolvedFromTurn = input.activeCollection.establishedAtTurn;
  } else if (input.activeComparison && input.activeComparison.candidateIds.length > 0) {
    source = "ACTIVE_COMPARISON";
    candidates = input.activeComparison.candidateIds
      .map((id) => input.catalogReferences.find((item) => item.id === id) ?? null)
      .filter((item): item is ManagerReference => item != null);
    kind = input.activeComparison.candidateKind;
    resolvedFromTurn = input.activeComparison.establishedAtTurn;
  }
  return Object.freeze({
    source,
    collectionKind: kind,
    candidateIds: Object.freeze(candidates.map((item) => item.id)),
    candidates: Object.freeze(candidates.map(ref)),
    requestedRelation: input.meaning.mode,
    criterion: input.meaning.criterion,
    confidence: source === "EXPLICIT_REFERENCES" || source === "ACTIVE_COLLECTION" ? "HIGH" : source === "ACTIVE_COMPARISON" ? "MODERATE" : "LOW",
    resolvedFromTurn,
  });
}

export function resolveCollectionComparison(input: {
  candidateSet: ExecutiveComparisonCandidateSet;
  historicalAdvisorySubject: string | null;
}): ExecutiveCollectionComparisonResult {
  const set = input.candidateSet;
  const enoughCandidates = set.candidates.length >= 2;
  const advisoryCompatible = Boolean(
    input.historicalAdvisorySubject &&
    set.candidates.some((item) => item.id === input.historicalAdvisorySubject || item.label === input.historicalAdvisorySubject),
  );
  if (!enoughCandidates) {
    const response = set.candidates.length === 1
      ? `${set.candidates[0]!.label} is the only current ${set.collectionKind ?? "collection"} member, so there is nothing else in that set to compare it with.`
      : "I don’t have a current candidate set to compare. Show a collection or name at least two items first.";
    return Object.freeze({ candidateSet: set, mode: set.requestedRelation, criterion: set.criterion,
      evidenceState: "INSUFFICIENT", preferredCandidateId: null, ordering: Object.freeze([]),
      reasons: Object.freeze(["fewer-than-two-compatible-candidates"]), uncertainty: Object.freeze(["comparison candidate set is incomplete"]),
      advisoryCompatible: false, advisoryEligible: false, primaryOwner: set.source === "UNRESOLVED" ? "UNRESOLVED" : "COLLECTION_COMPARISON",
      commitsDecision: false, startsExecution: false, businessMutations: Object.freeze([]), response });
  }
  const names = set.candidates.map((item) => item.label);
  const criterionText = set.criterion === "UNSPECIFIED" ? "the requested criterion" : set.criterion.toLowerCase().replaceAll("_", " ");
  const response = set.requestedRelation === "DIFFERENCE"
    ? `${names.join(" and ")} are the current comparison candidates. I don’t have enough comparable evidence in this context to state a meaningful difference without inventing one.`
    : names.length === 2
      ? `Both ${names.join(" and ")} are current ${set.collectionKind ? `${set.collectionKind.toLowerCase()} items` : "candidates"}, but I don’t have enough comparable evidence to rank one over the other on ${criterionText}.`
      : `The current ${set.collectionKind ? `${set.collectionKind.toLowerCase()} candidates` : "candidates"} are ${names.join(", ")}. I don’t have enough comparable evidence to rank them on ${criterionText}.`;
  return Object.freeze({ candidateSet: set, mode: set.requestedRelation, criterion: set.criterion,
    evidenceState: "INSUFFICIENT", preferredCandidateId: null, ordering: Object.freeze([]),
    reasons: Object.freeze(["canonical-candidates-resolved", "no-authoritative-comparable-measure"]),
    uncertainty: Object.freeze([`No authoritative ${criterionText} comparison is available.`]),
    advisoryCompatible, advisoryEligible: false, primaryOwner: "COLLECTION_COMPARISON",
    commitsDecision: false, startsExecution: false, businessMutations: Object.freeze([]), response });
}
