/**
 * NEX-EXP:4 — classify and project issue candidates. Reuses EI:3 claim and
 * causal vocabulary. Does not infer confirmed cause or recommend action.
 */

import {
  CAUSAL_RELATIONSHIP_KINDS,
  PROBLEM_RISK_OPPORTUNITY_BOUNDARY,
  createExecutiveClaim,
  createEvidenceBoundedRelationship,
  type CausalRelationshipKind,
} from "@/app/lib/executive-intelligence/problemRiskOpportunityIntelligence.ts";
import type { NexoraMVPObjectInteractionCatalog } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { NexoraIssueDiscoveryHandoff } from "./nexoraRealityDiscoveryTypes.ts";
import type {
  CausalStatus,
  ExecutiveIssueCandidate,
  ExecutiveIssueObject,
  IssueEvidenceSufficiency,
  IssueKind,
  IssueMateriality,
  IssueTimeClass,
  OpportunityWindow,
} from "./nexoraIssueDiscoveryTypes.ts";

export const ISSUE_STAGE_BUDGET = 4;

const RELATION_NOT_CAUSE: CausalRelationshipKind = "unknown-cause";

export function ei3IssueIntelligenceBoundary() {
  return PROBLEM_RISK_OPPORTUNITY_BOUNDARY;
}

export function mapCausalStatusToEi3Kind(
  status: CausalStatus,
): CausalRelationshipKind {
  if (status === "CONFIRMED") return "supported-causal";
  if (status === "SUPPORTED") return "observed-relationship";
  if (status === "HYPOTHESIZED") return "possible-contributor";
  if (status === "NONE") return RELATION_NOT_CAUSE;
  return "unknown-cause";
}

export function confirmedCauseAllowed(status: CausalStatus): boolean {
  return (
    status === "CONFIRMED" &&
    PROBLEM_RISK_OPPORTUNITY_BOUNDARY.infersCausality === false
  );
}

export function normalizeIssueKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function slugIssueId(kind: IssueKind, subject: string): string {
  const slug = normalizeIssueKey(subject).replace(/\s+/g, "-").slice(0, 48);
  return `issue-${kind.toLowerCase()}-${slug || "subject"}`;
}

export function tokensOverlap(left: string, right: string): boolean {
  const stop = new Set([
    "risk",
    "problem",
    "issue",
    "opportunity",
    "constraint",
    "gap",
    "the",
  ]);
  const a = new Set(
    normalizeIssueKey(left)
      .split(" ")
      .filter((t) => t.length > 2 && !stop.has(t)),
  );
  const b = new Set(
    normalizeIssueKey(right)
      .split(" ")
      .filter((t) => t.length > 2 && !stop.has(t)),
  );
  if (a.size === 0 || b.size === 0) return false;
  for (const token of a) {
    if (b.has(token)) return true;
  }
  return false;
}

export function isIssueClassificationUtterance(normalized: string): boolean {
  if (/ready to investigate/.test(normalized)) return false;
  return (
    /\bproblems?\b/.test(normalized) ||
    /\brisks?\b/.test(normalized) ||
    /\bopportunit(?:y|ies)\b/.test(normalized) ||
    /\bconstraints?\b/.test(normalized) ||
    /\bpreventing\b/.test(normalized) ||
    /\broot cause\b/.test(normalized) ||
    /\bbecause\b/.test(normalized) ||
    /\balready happening\b/.test(normalized) ||
    /\bnext month\b/.test(normalized) ||
    /\bworried\b/.test(normalized) ||
    /\brisky\b/.test(normalized) ||
    /\bcapped\b/.test(normalized) ||
    /\bwe may be able to\b/.test(normalized) ||
    /\bweekend\b/.test(normalized) ||
    /\bbudget is tight\b/.test(normalized) ||
    /\bthis may be\b/.test(normalized) ||
    /\brecommend/.test(normalized) ||
    /\bexplore scenarios\b/.test(normalized)
  );
}

export function isIssueDiscoveryUtterance(normalized: string): boolean {
  return (
    isIssueClassificationUtterance(normalized) ||
    isIssueMetaUtterance(normalized)
  );
}

export function isIssueMetaUtterance(normalized: string): boolean {
  return (
    /what may be preventing/.test(normalized) ||
    /do we have a problem/.test(normalized) ||
    /is this a problem or a risk/.test(normalized) ||
    /what risks/.test(normalized) ||
    /do we have any opportunities/.test(normalized) ||
    /what constraints/.test(normalized) ||
    /why do you think/.test(normalized) ||
    /is .+ the root cause/.test(normalized) ||
    /what evidence supports/.test(normalized) ||
    /what don'?t we know/.test(normalized) ||
    /is that an opportunity or a recommendation/.test(normalized) ||
    /ready to explore scenarios/.test(normalized)
  );
}

export function isRecommendationRequest(normalized: string): boolean {
  return (
    /\bshould we (?:hire|expand|buy|cut)\b/.test(normalized) ||
    /\brecommend(?:ation)?\b/.test(normalized) &&
      /opportunity or a recommendation/.test(normalized) === false
  );
}

export function classifyIssueKind(normalized: string): IssueKind | null {
  if (/root cause|because/.test(normalized) && /problem|risk/.test(normalized) === false) {
    return "PROBLEM";
  }
  if (
    /already happening|currently preventing|biggest problem|is our problem|is the problem|insufficient to meet|currently interfering/.test(
      normalized,
    )
  ) {
    return "PROBLEM";
  }
  if (
    /next month|worried they may|mainly a future|becoming risky|may happen|future (?:risk|concern)|might fail/.test(
      normalized,
    )
  ) {
    return "RISK";
  }
  if (
    /capped at|cannot exceed|hard (?:cap|limit)|spending limit|is the main constraint|is a constraint|budget is capped/.test(
      normalized,
    )
  ) {
    return "CONSTRAINT";
  }
  if (
    /opportunity|we may be able to|could use|weekend (?:shift|capacity)|available now/.test(
      normalized,
    )
  ) {
    return "OPPORTUNITY";
  }
  if (/\brisks?\b/.test(normalized) && /problem or a risk/.test(normalized) === false) {
    return "RISK";
  }
  if (/\bproblems?\b/.test(normalized)) return "PROBLEM";
  if (/\bconstraints?\b/.test(normalized)) return "CONSTRAINT";
  if (/\bopportunit/.test(normalized)) return "OPPORTUNITY";
  return null;
}

export function timeClassFromUtterance(normalized: string): IssueTimeClass {
  if (/already happening|currently|is preventing|now\b/.test(normalized)) {
    return "CURRENT";
  }
  if (/next month|may happen|future|worried they may|might/.test(normalized)) {
    return "FUTURE";
  }
  return "UNKNOWN";
}

function extractSubject(utterance: string, kind: IssueKind | null): string {
  const cleaned = utterance
    .replace(/[.!?]+$/g, "")
    .replace(
      /\b(?:capacity is bad|budget is tight|this may be|i'?m only worried|we may be able to use|we might have an opportunity to add)\b/gi,
      "",
    );
  const patterns = [
    /(?:biggest problem is|the problem is|problem is)\s+(.+)$/i,
    /(.+?)\s+is our biggest problem/i,
    /(.+?)\s+are becoming risky/i,
    /this may be (?:a |an )?(.+?)(?: issue)?$/i,
    /opportunity to (.+)$/i,
    /able to use (.+)$/i,
    /(.+?)\s+is capped at/i,
    /capped at (.+)$/i,
    /(?:main constraint is|constraint is)\s+(.+)$/i,
    /(.+?)\s+is the main constraint/i,
    /because (.+)$/i,
  ];
  for (const pattern of patterns) {
    const match = utterance.match(pattern);
    if (match?.[1]) return titleCase(cleanPhrase(match[1]));
  }
  const leftover = cleanPhrase(
    cleaned
      .replace(
        /\b(problem|risk|opportunity|constraint|preventing|the goal|currently|already happening)\b/gi,
        " ",
      )
      .trim(),
  );
  if (leftover.length >= 3) return titleCase(leftover.slice(0, 60));
  if (kind === "CONSTRAINT") return "Spending Limit";
  if (kind === "OPPORTUNITY") return "Favorable Option";
  if (kind === "RISK") return "Future Exposure";
  return "Unspecified Condition";
}

function cleanPhrase(value: string): string {
  return value
    .replace(/\b(a|an|the|our|my|this|that)\b/gi, " ")
    .replace(/[^A-Za-z0-9 $%-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleCase(value: string): string {
  return value.replace(/\b([a-z])/g, (m) => m.toUpperCase());
}

export function assessMateriality(input: {
  readonly kind: IssueKind | null;
  readonly subject: string;
  readonly managerStated: boolean;
  readonly goalTitle: string | null;
  readonly relatedReality: readonly string[];
  readonly weak: boolean;
}): IssueMateriality {
  if (input.weak || input.kind === "UNKNOWN" || input.kind == null) {
    return "TRIVIAL";
  }
  if (input.managerStated && input.subject !== "Unspecified Condition") {
    return "MATERIAL";
  }
  const related =
    (input.goalTitle && tokensOverlap(input.subject, input.goalTitle)) ||
    input.relatedReality.some((name) => tokensOverlap(input.subject, name));
  return related ? "MATERIAL" : "UNKNOWN";
}

export function evidenceSufficiency(input: {
  readonly managerStated: boolean;
  readonly validated: boolean;
  readonly stale: boolean;
  readonly conflicting: boolean;
  readonly kind: IssueKind | null;
}): IssueEvidenceSufficiency {
  if (input.conflicting || input.kind == null) return "WEAK";
  if (input.stale) return "PARTIAL";
  if (input.validated) return "SUFFICIENT";
  if (input.managerStated) return "PARTIAL";
  return "WEAK";
}

export function findCanonicalIssueId(
  catalog: NexoraMVPObjectInteractionCatalog,
  kind: IssueKind,
  subject: string,
): string | null {
  if (kind === "PROBLEM") {
    const hit = catalog.contextSubjects.find(
      (entry) =>
        entry.kind === "problem" && tokensOverlap(entry.label, subject),
    );
    if (hit) return hit.id;
  }
  if (kind === "RISK") {
    const hit = catalog.objects.find(
      (entry) =>
        entry.id === "obj-risk" &&
        (normalizeIssueKey(subject) === "risk" ||
          tokensOverlap(entry.label, subject)),
    );
    return hit?.id ?? null;
  }
  return null;
}

export function mergeIssueCandidate(
  existing: readonly ExecutiveIssueCandidate[],
  next: ExecutiveIssueCandidate,
): readonly ExecutiveIssueCandidate[] {
  const match = existing.find(
    (candidate) =>
      candidate.kind === next.kind &&
      (candidate.objectId && next.objectId && candidate.objectId === next.objectId
        ? true
        : tokensOverlap(candidate.subject, next.subject)),
  );
  if (!match) return Object.freeze([...existing, next]);
  return Object.freeze(
    existing.map((candidate) =>
      candidate.candidateId === match.candidateId
        ? Object.freeze({
            ...candidate,
            description: next.description ?? candidate.description,
            evidence: unique([...candidate.evidence, ...next.evidence]),
            managerStated: candidate.managerStated || next.managerStated,
            currentOrFuture:
              next.currentOrFuture !== "UNKNOWN"
                ? next.currentOrFuture
                : candidate.currentOrFuture,
            causalStatus:
              candidate.causalStatus === "CONFIRMED"
                ? "HYPOTHESIZED"
                : next.causalStatus !== "NONE"
                  ? next.causalStatus
                  : candidate.causalStatus,
            materiality:
              next.materiality === "MATERIAL"
                ? "MATERIAL"
                : candidate.materiality,
            sufficiency:
              next.sufficiency === "SUFFICIENT"
                ? "SUFFICIENT"
                : next.sufficiency === "PARTIAL" ||
                    candidate.sufficiency === "PARTIAL"
                  ? "PARTIAL"
                  : candidate.sufficiency,
            validated: candidate.validated || next.validated,
          })
        : candidate,
    ),
  );
}

export function seedCandidatesFromHandoff(
  handoff: NexoraIssueDiscoveryHandoff | null,
): readonly ExecutiveIssueCandidate[] {
  if (!handoff) return Object.freeze([]);
  const seeded: ExecutiveIssueCandidate[] = [];
  for (const signal of handoff.knownIssueSignals) {
    seeded.push(
      makeCandidate({
        kind: "UNKNOWN",
        subject: titleCase(cleanPhrase(signal)) || "Issue Signal",
        source: "REALITY_SIGNAL",
        managerStated: false,
        currentOrFuture: "UNKNOWN",
        materiality: "UNKNOWN",
        sufficiency: "WEAK",
        relatedGoalId: null,
        relatedRealityIds: [],
      }),
    );
  }
  for (const signal of handoff.knownRiskSignals) {
    seeded.push(
      makeCandidate({
        kind: "RISK",
        subject: titleCase(cleanPhrase(signal)) || "Risk Signal",
        source: "REALITY_SIGNAL",
        managerStated: false,
        currentOrFuture: "FUTURE",
        materiality: "UNKNOWN",
        sufficiency: "WEAK",
        relatedGoalId: null,
        relatedRealityIds: [],
      }),
    );
  }
  for (const signal of handoff.knownOpportunitySignals) {
    seeded.push(
      makeCandidate({
        kind: "OPPORTUNITY",
        subject: titleCase(cleanPhrase(signal)) || "Opportunity Signal",
        source: "REALITY_SIGNAL",
        managerStated: false,
        currentOrFuture: "UNKNOWN",
        materiality: "UNKNOWN",
        sufficiency: "WEAK",
        relatedGoalId: null,
        relatedRealityIds: [],
      }),
    );
  }
  for (const signal of handoff.constraints) {
    seeded.push(
      makeCandidate({
        kind: "CONSTRAINT",
        subject: titleCase(cleanPhrase(signal)) || "Constraint Signal",
        source: "REALITY_SIGNAL",
        managerStated: false,
        currentOrFuture: "CURRENT",
        materiality: "UNKNOWN",
        sufficiency: "WEAK",
        relatedGoalId: null,
        relatedRealityIds: [],
      }),
    );
  }
  return Object.freeze(seeded);
}

export function candidateFromUtterance(input: {
  readonly utterance: string;
  readonly catalog: NexoraMVPObjectInteractionCatalog;
  readonly goalId: string | null;
  readonly goalTitle: string | null;
  readonly realityNames: readonly string[];
  readonly realityIds: readonly string[];
  readonly stale: boolean;
}): ExecutiveIssueCandidate | null {
  const normalized = input.utterance.toLowerCase();
  if (/gap of|percentage points|below the target/.test(normalized) && !isIssueClassificationUtterance(normalized)) {
    return null;
  }
  if (/budget is tight/.test(normalized) && !/capped|cannot exceed|limit/.test(normalized)) {
    return makeCandidate({
      kind: "UNKNOWN",
      subject: "Budget Pressure",
      source: "MANAGER_STATED",
      managerStated: true,
      currentOrFuture: "CURRENT",
      materiality: "UNKNOWN",
      sufficiency: "WEAK",
      relatedGoalId: input.goalId,
      relatedRealityIds: input.realityIds,
      description: "Manager reported budget pressure; not yet a defined limit.",
      evidence: [input.utterance],
    });
  }
  const kind = classifyIssueKind(normalized);
  if (kind == null && !/because/.test(normalized)) return null;
  const resolvedKind = kind ?? "PROBLEM";
  const subject = extractSubject(input.utterance, resolvedKind);
  const speculativeOpportunity =
    resolvedKind === "OPPORTUNITY" &&
    /we may be able to|might have an opportunity|could use/.test(normalized) &&
    !/available now|actually available|validated/.test(normalized);
  const weak =
    speculativeOpportunity ||
    (/maybe|not sure|might be something/.test(normalized) &&
      subject === "Unspecified Condition");
  const canonical = findCanonicalIssueId(input.catalog, resolvedKind, subject);
  const time = timeClassFromUtterance(normalized);
  const causal: CausalStatus = /because|root cause/.test(normalized)
    ? "HYPOTHESIZED"
    : "NONE";
  const materiality = assessMateriality({
    kind: resolvedKind,
    subject,
    managerStated: true,
    goalTitle: input.goalTitle,
    relatedReality: input.realityNames,
    weak,
  });
  return makeCandidate({
    kind: resolvedKind,
    subject,
    source: canonical ? "CANONICAL" : "MANAGER_STATED",
    managerStated: true,
    currentOrFuture:
      time === "UNKNOWN" && resolvedKind === "RISK"
        ? "FUTURE"
        : time === "UNKNOWN" && resolvedKind === "PROBLEM"
          ? "CURRENT"
          : time,
    materiality: weak ? "TRIVIAL" : materiality,
    sufficiency: evidenceSufficiency({
      managerStated: true,
      validated: false,
      stale: input.stale,
      conflicting: false,
      kind: resolvedKind,
    }),
    relatedGoalId: input.goalId,
    relatedRealityIds: input.realityIds,
    description: input.utterance.trim(),
    evidence: [input.utterance.trim()],
    objectId: canonical,
    causalStatus: causal,
  });
}

export function convertRiskIfCurrent(
  candidates: readonly ExecutiveIssueCandidate[],
  utterance: string,
): readonly ExecutiveIssueCandidate[] {
  const normalized = utterance.toLowerCase();
  if (!/already happening/.test(normalized)) return candidates;
  const extra: ExecutiveIssueCandidate[] = [];
  const next = candidates.map((candidate) => {
    if (candidate.kind !== "RISK") return candidate;
    if (!tokensOverlap(candidate.subject, utterance) && !/supplier/.test(normalizeIssueKey(candidate.subject))) {
      return candidate;
    }
    extra.push(
      makeCandidate({
        kind: "PROBLEM",
        subject: candidate.subject,
        source: "MANAGER_STATED",
        managerStated: true,
        currentOrFuture: "CURRENT",
        materiality: "MATERIAL",
        sufficiency: "PARTIAL",
        relatedGoalId: candidate.relatedGoalId,
        relatedRealityIds: candidate.relatedRealityIds,
        description: "Previously a future risk; now reported as currently occurring.",
        evidence: [...candidate.evidence, utterance],
        causalStatus: "NONE",
      }),
    );
    return Object.freeze({
      ...candidate,
      currentOrFuture: "CURRENT" as const,
      description: candidate.description,
    });
  });
  return Object.freeze([...next, ...extra]);
}

export function applyConstraintChange(
  candidates: readonly ExecutiveIssueCandidate[],
  utterance: string,
): readonly ExecutiveIssueCandidate[] {
  if (!/cap was removed|limit was removed|no longer capped/.test(utterance.toLowerCase())) {
    return candidates;
  }
  return Object.freeze(
    candidates.map((candidate) =>
      candidate.kind === "CONSTRAINT"
        ? Object.freeze({
            ...candidate,
            epistemicStatus: "UNKNOWN" as const,
            description: "Manager reported the prior limit is no longer in force.",
            sufficiency: "WEAK" as const,
            materiality: "TRIVIAL" as const,
            objectId: null,
          })
        : candidate,
    ),
  );
}

export function opportunityWindowFromEvidence(
  evidence: readonly string[],
): OpportunityWindow {
  const joined = evidence.join(" ").toLowerCase();
  if (/expired|missed the window/.test(joined)) return "EXPIRED";
  if (/expir(?:e|ing)|this week only/.test(joined)) return "EXPIRING";
  if (/available now|currently available/.test(joined)) return "ACTIVE";
  return "UNKNOWN";
}

export function shouldBecomeStageObject(
  candidate: ExecutiveIssueCandidate,
): boolean {
  if (candidate.kind === "UNKNOWN") return false;
  if (candidate.materiality !== "MATERIAL") return false;
  if (candidate.sufficiency === "WEAK") return false;
  if (candidate.epistemicStatus === "UNKNOWN" && candidate.kind === "CONSTRAINT") {
    return false;
  }
  return true;
}

export function emergeIssueObjects(
  candidates: readonly ExecutiveIssueCandidate[],
  catalog: NexoraMVPObjectInteractionCatalog,
  goalId: string | null,
): readonly ExecutiveIssueObject[] {
  const staged: ExecutiveIssueObject[] = [];
  for (const candidate of candidates) {
    if (!shouldBecomeStageObject(candidate)) continue;
    if (staged.length >= ISSUE_STAGE_BUDGET) break;
    const id =
      candidate.objectId ??
      slugIssueId(candidate.kind as Exclude<IssueKind, "UNKNOWN">, candidate.subject);
    if (staged.some((entry) => entry.id === id)) continue;
    staged.push(
      Object.freeze({
        id,
        kind: candidate.kind as Exclude<IssueKind, "UNKNOWN">,
        displayName: canonicalLabel(catalog, id, candidate.subject),
        description: candidate.description,
        relatedGoalId: goalId,
        relatedRealityIds: candidate.relatedRealityIds,
        evidence: candidate.evidence,
        epistemicStatus: candidate.staleEvidence
          ? "INFERRED"
          : candidate.epistemicStatus,
        causalStatus:
          candidate.causalStatus === "CONFIRMED" ? "HYPOTHESIZED" : candidate.causalStatus,
        source: candidate.source,
        reusedExisting: Boolean(candidate.objectId),
      }),
    );
  }
  return Object.freeze(staged);
}

export function discoveryPrioritySubject(
  objects: readonly ExecutiveIssueObject[],
): string | null {
  const order: Exclude<IssueKind, "UNKNOWN">[] = [
    "PROBLEM",
    "RISK",
    "OPPORTUNITY",
    "CONSTRAINT",
  ];
  for (const kind of order) {
    const hit = objects.find((entry) => entry.kind === kind);
    if (hit) return hit.displayName;
  }
  return null;
}

export function comparablePriorities(
  objects: readonly ExecutiveIssueObject[],
): boolean {
  const material = objects.filter(
    (entry) => entry.kind === "PROBLEM" || entry.kind === "RISK",
  );
  return material.length >= 2;
}

export function relationshipIsNotCause(): CausalRelationshipKind {
  return RELATION_NOT_CAUSE;
}

export function ei3HypothesisClaim(statement: string, claimId: string) {
  return createExecutiveClaim({
    claimId,
    type: "ASSUMPTION",
    statement,
    provenanceRefs: ["manager-stated"],
  });
}

export function ei3UnknownCauseRelationship(input: {
  readonly relationshipId: string;
  readonly sourceEntityId: string;
  readonly targetEntityId: string;
}) {
  return createEvidenceBoundedRelationship({
    ...input,
    kind: "unknown-cause",
  });
}

export function neverSupportedCausalFromCorrelation(): boolean {
  return CAUSAL_RELATIONSHIP_KINDS.includes("supported-causal");
}

function canonicalLabel(
  catalog: NexoraMVPObjectInteractionCatalog,
  id: string,
  fallback: string,
): string {
  return (
    catalog.contextSubjects.find((entry) => entry.id === id)?.label ??
    catalog.objects.find((entry) => entry.id === id)?.label ??
    fallback
  );
}

function makeCandidate(input: {
  readonly kind: IssueKind;
  readonly subject: string;
  readonly source: ExecutiveIssueCandidate["source"];
  readonly managerStated: boolean;
  readonly currentOrFuture: IssueTimeClass;
  readonly materiality: IssueMateriality;
  readonly sufficiency: IssueEvidenceSufficiency;
  readonly relatedGoalId: string | null;
  readonly relatedRealityIds: readonly string[];
  readonly description?: string;
  readonly evidence?: readonly string[];
  readonly objectId?: string | null;
  readonly causalStatus?: CausalStatus;
}): ExecutiveIssueCandidate {
  const staleEvidence = input.evidence?.some((item) => /stale|old figure/i.test(item)) ?? false;
  return Object.freeze({
    candidateId: `${slugIssueId(input.kind, input.subject)}-cand`,
    kind: input.kind,
    subject: input.subject,
    description: input.description ?? null,
    relatedGoalId: input.relatedGoalId,
    relatedRealityIds: input.relatedRealityIds,
    evidence: Object.freeze([...(input.evidence ?? [])]),
    source: input.source,
    epistemicStatus: input.kind === "UNKNOWN" ? "UNKNOWN" : input.managerStated ? "INFERRED" : "UNKNOWN",
    confidence: null,
    materiality: input.materiality,
    currentOrFuture: input.currentOrFuture,
    managerStated: input.managerStated,
    validated: false,
    causalStatus: input.causalStatus === "CONFIRMED" ? "HYPOTHESIZED" : input.causalStatus ?? "NONE",
    sufficiency: staleEvidence ? "PARTIAL" : input.sufficiency,
    objectId: input.objectId ?? null,
    probability: null,
    valuePotential: null,
    opportunityWindow: opportunityWindowFromEvidence(input.evidence ?? []),
    staleEvidence,
  });
}

function unique(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values.filter(Boolean))]);
}
