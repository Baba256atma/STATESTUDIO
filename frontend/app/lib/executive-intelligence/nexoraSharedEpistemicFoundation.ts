/**
 * CORE-INT:2 — Shared Epistemic & Uncertainty Foundation.
 *
 * Live EI:3-compatible contract. Not a second epistemic engine.
 * Classification comes from authoritative source semantics, never from prose.
 * EXI / Advisor / Conversation are readers only.
 */

import type { NexoraExecutiveEvidenceReference } from "../conversational-control/executiveRecommendation.ts";
import type { ExecutiveRealityReference } from "./executiveIntelligenceIntegration.ts";
import {
  createExecutiveClaim,
  type ExecutiveClaim,
  type ExecutiveClaimType,
  type SemanticConfidence,
} from "./problemRiskOpportunityIntelligence.ts";

export const nexoraSharedEpistemicFoundationIdentity =
  "CORE-INT:2/SharedEpistemicUncertaintyFoundation" as const;
export const nexoraSharedEpistemicFoundationVersion = "1.0.0" as const;
export const nexoraSharedEpistemicFoundationNamespace =
  "nexora.core.shared-epistemic-uncertainty" as const;

export const SHARED_EPISTEMIC_BOUNDARY = Object.freeze({
  role: "ei3-compatible-live-epistemic-projection" as const,
  claimAuthority: "EI:3/createExecutiveClaim" as const,
  confidenceAuthority: "EI:3/SemanticConfidence" as const,
  classifiesFromProse: false as const,
  isExiWriter: false as const,
  isAdvisorWriter: false as const,
  isConversationWriter: false as const,
  inventsCausalRanking: false as const,
  inventsBindingConstraint: false as const,
  inventsPriority: false as const,
  wiresEi4: false as const,
  startsExi4: false as const,
  usesLlm: false as const,
  writesMemory: false as const,
  mutatesStage: false as const,
  mutatesDecision: false as const,
  inventsProbability: false as const,
});

export const CONTRIBUTOR_RELATION_KINDS = Object.freeze([
  "constrained-by",
  "affected-by",
  "depends-on",
  "affects",
  "blocks",
] as const);

export const GENERIC_RELATION_KINDS = Object.freeze([
  "associated-with",
  "related",
  "related-to",
  "influences",
  "unknown",
] as const);

export type SharedEpistemicFreshness = "current" | "stale" | "unknown";
export type SharedEpistemicEvidenceStatus =
  | "present"
  | "missing"
  | "stale"
  | "conflicting";
export type SharedEpistemicClaimRole =
  | "observation"
  | "interpretation"
  | "relationship-existence"
  | "prediction"
  | "unknown";
export type SharedEpistemicWriter =
  | "data-reality-projection"
  | "modeled-observation-projection"
  | "recorded-relationship-projection"
  | "scenario-projection"
  | "insufficient";
export type SharedEpistemicPresentationConfidence =
  | "strong"
  | "limited"
  | "incomplete"
  | "stale"
  | "none";

export type SharedEpistemicObservationSource = Readonly<{
  readonly statement: string;
  readonly kpiId: string;
  readonly value: string;
  readonly sourceKind: "data-reality" | "mvp-presentation-fixture";
  readonly sourceId: string;
  readonly validated: boolean;
  readonly freshness: SharedEpistemicFreshness;
  readonly confidenceState?: "verified" | "uncertain" | "unverified" | null;
  readonly observedAt?: string | null;
  readonly provenanceRefs: readonly string[];
  readonly evidenceRefs: readonly NexoraExecutiveEvidenceReference[];
  readonly realityEvidence?: ExecutiveRealityReference["evidenceRefs"];
}>;

export type SharedEpistemicRelationshipDirection =
  | "inbound"
  | "outbound"
  | "undirected";

export type SharedEpistemicRelationshipSource = Readonly<{
  readonly relationshipId: string;
  readonly otherId: string | null;
  readonly otherLabel: string;
  readonly relationKind: string;
  readonly direction?: SharedEpistemicRelationshipDirection;
}>;

export type SharedEpistemicScenarioSource = Readonly<{
  readonly scenarioId: string;
  readonly label: string;
  readonly statement: string;
}>;

export type SharedEpistemicSourceInput = Readonly<{
  readonly subjectId: string | null;
  readonly subjectLabel: string | null;
  readonly subjectKind: string | null;
  readonly isOverview: boolean;
  readonly observation: SharedEpistemicObservationSource | null;
  readonly relationships: readonly SharedEpistemicRelationshipSource[];
  readonly scenario: SharedEpistemicScenarioSource | null;
}>;

export type SharedEpistemicClaim = Readonly<{
  readonly claim: ExecutiveClaim;
  readonly role: SharedEpistemicClaimRole;
  readonly freshness: SharedEpistemicFreshness;
  readonly evidenceStatus: SharedEpistemicEvidenceStatus;
  readonly writer: SharedEpistemicWriter;
  readonly subjectId: string | null;
  readonly relatedSubjectId: string | null;
  readonly presentationConfidence: SharedEpistemicPresentationConfidence;
  readonly managerStatement: string;
}>;

export type NexoraSharedEpistemicProjection = Readonly<{
  readonly identity: typeof nexoraSharedEpistemicFoundationIdentity;
  readonly subjectId: string | null;
  readonly subjectLabel: string | null;
  readonly claims: readonly SharedEpistemicClaim[];
  readonly observation: SharedEpistemicClaim | null;
  readonly interpretation: SharedEpistemicClaim | null;
  readonly prediction: SharedEpistemicClaim | null;
  readonly unknown: SharedEpistemicClaim | null;
  readonly focusedClaimId: string;
  readonly writesMemory: false;
  readonly mutatesStage: false;
  readonly mutatesDecision: false;
}>;

const PRESENTATION_RANK: Readonly<
  Record<SharedEpistemicPresentationConfidence, number>
> = Object.freeze({
  none: 0,
  stale: 1,
  incomplete: 2,
  limited: 3,
  strong: 4,
});

function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    for (const child of Object.values(value as Record<string, unknown>)) {
      deepFreeze(child);
    }
    Object.freeze(value);
  }
  return value;
}

function unique(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values.filter(Boolean))]);
}

export function isContributorRelationKind(kind: string): boolean {
  return (CONTRIBUTOR_RELATION_KINDS as readonly string[]).includes(kind);
}

export function isGenericRelationKind(kind: string): boolean {
  return (GENERIC_RELATION_KINDS as readonly string[]).includes(kind);
}

/**
 * Source-semantic classifier for recorded relations.
 * Does not infer from prose. Existence may be FACT; cause is not.
 */
export function classifyRecordedRelationInterpretation(
  relationKind: string,
): ExecutiveClaimType {
  if (isContributorRelationKind(relationKind)) return "ASSUMPTION";
  return "UNKNOWN";
}

export function mapSemanticConfidenceToPresentation(
  confidence: SemanticConfidence,
  freshness: SharedEpistemicFreshness,
  evidenceStatus: SharedEpistemicEvidenceStatus,
): SharedEpistemicPresentationConfidence {
  if (evidenceStatus === "missing") return "none";
  if (freshness === "stale" || evidenceStatus === "stale") return "stale";
  if (confidence === "high") return "strong";
  if (confidence === "medium") return "limited";
  if (confidence === "low") return "incomplete";
  return "none";
}

/**
 * Downstream may preserve or reduce confidence. It may not increase it.
 */
export function bindDownstreamPresentationConfidence(
  upstream: SharedEpistemicPresentationConfidence,
  requested: SharedEpistemicPresentationConfidence,
): SharedEpistemicPresentationConfidence {
  return PRESENTATION_RANK[requested] <= PRESENTATION_RANK[upstream]
    ? requested
    : upstream;
}

export function presentExecutiveClaimKind(kind: ExecutiveClaimType): string {
  switch (kind) {
    case "FACT":
      return "Current data confirms this.";
    case "ASSUMPTION":
      return "One possible explanation is being used, not observed truth.";
    case "PREDICTION":
      return "This is a projected possibility, not observed reality.";
    default:
      return "Nexora does not yet have enough evidence to determine this.";
  }
}

export function presentExecutiveConfidence(
  claim: SharedEpistemicClaim,
): string {
  if (claim.freshness === "stale" || claim.evidenceStatus === "stale") {
    return "This is based on information that may no longer be current.";
  }
  if (claim.evidenceStatus === "missing" || claim.claim.type === "UNKNOWN") {
    return "Nexora does not currently have validated evidence for that claim.";
  }
  if (claim.evidenceStatus === "conflicting") {
    return "Evidence is limited because available sources do not agree.";
  }
  if (claim.claim.confidence === "high") {
    return "Nexora is working from validated evidence for this claim.";
  }
  if (claim.claim.confidence === "medium") {
    return "Evidence limited. This claim is supported, but it is not stronger than the current evidence.";
  }
  if (claim.claim.confidence === "low") {
    return "Evidence limited. Validated evidence is still incomplete for this claim.";
  }
  return "Nexora does not currently have validated evidence for that claim.";
}

export function presentExecutiveEvidence(claim: SharedEpistemicClaim): string {
  if (claim.evidenceStatus === "missing" || claim.claim.evidenceRefs.length === 0) {
    return "Nexora does not currently have validated evidence for that claim.";
  }
  const source = claim.claim.evidenceRefs[0];
  const sourceLabel =
    source?.sourceKind === "data-reality"
      ? "validated operational data"
      : source?.sourceKind === "relationship"
        ? "a recorded relationship"
        : source?.sourceKind === "scenario"
          ? "a recorded scenario projection"
          : "the current subject model";
  return `This claim is supported by ${sourceLabel}.`;
}

function managerStatementFor(
  type: ExecutiveClaimType,
  statement: string,
  freshness: SharedEpistemicFreshness,
): string {
  if (type === "FACT" && freshness === "stale") {
    return `Earlier data showed ${statement} That observation is no longer current.`;
  }
  if (type === "FACT") return `Current data confirms ${statement}`;
  if (type === "ASSUMPTION") return `One possible explanation is ${statement}`;
  if (type === "PREDICTION") return `This scenario projects ${statement}`;
  return "Nexora does not yet have enough evidence to determine this.";
}

function wrapClaim(input: {
  readonly claim: ExecutiveClaim;
  readonly role: SharedEpistemicClaimRole;
  readonly freshness: SharedEpistemicFreshness;
  readonly evidenceStatus: SharedEpistemicEvidenceStatus;
  readonly writer: SharedEpistemicWriter;
  readonly subjectId: string | null;
  readonly relatedSubjectId?: string | null;
}): SharedEpistemicClaim {
  const evidenceStatus =
    input.freshness === "stale" && input.evidenceStatus === "present"
      ? "stale"
      : input.evidenceStatus;
  return deepFreeze({
    claim: input.claim,
    role: input.role,
    freshness: input.freshness,
    evidenceStatus,
    writer: input.writer,
    subjectId: input.subjectId,
    relatedSubjectId: input.relatedSubjectId ?? null,
    presentationConfidence: mapSemanticConfidenceToPresentation(
      input.claim.confidence,
      input.freshness,
      evidenceStatus,
    ),
    managerStatement: managerStatementFor(
      input.claim.type,
      input.claim.statement,
      input.freshness,
    ),
  });
}

function safeClaim(input: {
  readonly claimId: string;
  readonly type: ExecutiveClaimType;
  readonly statement: string;
  readonly evidenceRefs?: readonly NexoraExecutiveEvidenceReference[];
  readonly provenanceRefs?: readonly string[];
  readonly observedAt?: string | null;
  readonly realityEvidence?: ExecutiveRealityReference["evidenceRefs"];
}): ExecutiveClaim {
  try {
    return createExecutiveClaim(input);
  } catch {
    return createExecutiveClaim({
      claimId: `${input.claimId}:unknown`,
      type: "UNKNOWN",
      statement: input.statement,
    });
  }
}

function unknownClaim(
  subjectId: string | null,
  statement = "The evidence is insufficient to classify this safely.",
): SharedEpistemicClaim {
  return wrapClaim({
    claim: createExecutiveClaim({
      claimId: `core-int2:unknown:${subjectId ?? "none"}`,
      type: "UNKNOWN",
      statement,
    }),
    role: "unknown",
    freshness: "unknown",
    evidenceStatus: "missing",
    writer: "insufficient",
    subjectId,
  });
}

/**
 * Canonical live writer. Callers supply source semantics, not claim kind
 * for interpretations. FACT is only created when evidence+provenance exist.
 */
export function projectSharedEpistemicFoundation(
  input: SharedEpistemicSourceInput,
): NexoraSharedEpistemicProjection {
  const claims: SharedEpistemicClaim[] = [];
  const subjectId = input.isOverview ? null : input.subjectId;

  if (input.isOverview || subjectId == null) {
    const unknown = unknownClaim(null, "No subject is in focus.");
    return deepFreeze({
      identity: nexoraSharedEpistemicFoundationIdentity,
      subjectId: null,
      subjectLabel: null,
      claims: Object.freeze([unknown]),
      observation: null,
      interpretation: null,
      prediction: null,
      unknown,
      focusedClaimId: unknown.claim.claimId,
      writesMemory: false,
      mutatesStage: false,
      mutatesDecision: false,
    });
  }

  let observation: SharedEpistemicClaim | null = null;
  if (input.observation) {
    const source = input.observation;
    const canBeFact =
      source.evidenceRefs.length > 0 && source.provenanceRefs.length > 0;
    const requestedType: ExecutiveClaimType = canBeFact ? "FACT" : "UNKNOWN";
    const writer: SharedEpistemicWriter =
      source.sourceKind === "data-reality" && source.validated
        ? "data-reality-projection"
        : source.sourceKind === "mvp-presentation-fixture" && canBeFact
          ? "modeled-observation-projection"
          : "insufficient";
    const claim = safeClaim({
      claimId: `core-int2:observation:${subjectId}:${source.kpiId}`,
      type: requestedType,
      statement: source.statement.endsWith(".")
        ? source.statement
        : `${source.statement}.`,
      evidenceRefs: source.evidenceRefs,
      provenanceRefs: source.provenanceRefs,
      observedAt: source.observedAt ?? null,
      realityEvidence: source.realityEvidence,
    });
    observation = wrapClaim({
      claim,
      role: "observation",
      freshness: source.freshness,
      evidenceStatus: canBeFact
        ? source.freshness === "stale"
          ? "stale"
          : "present"
        : "missing",
      writer: claim.type === "FACT" ? writer : "insufficient",
      subjectId,
    });
    claims.push(observation);
  }

  const contributor = input.relationships.find((rel) =>
    isContributorRelationKind(rel.relationKind),
  );
  const generic = input.relationships.find((rel) =>
    isGenericRelationKind(rel.relationKind),
  );
  const firstRelation = contributor ?? generic ?? input.relationships[0] ?? null;

  if (firstRelation) {
    const existenceEvidence: NexoraExecutiveEvidenceReference[] = [
      {
        sourceKind: "relationship",
        sourceId: firstRelation.relationshipId,
        subjectId,
        factKey: firstRelation.relationKind,
      },
    ];
    const existence = wrapClaim({
      claim: safeClaim({
        claimId: `core-int2:rel-exists:${subjectId}:${firstRelation.relationshipId}`,
        type: "FACT",
        statement: `A ${firstRelation.relationKind} relationship with ${firstRelation.otherLabel} is recorded.`,
        evidenceRefs: existenceEvidence,
        provenanceRefs: [
          `recorded-relationship:${firstRelation.relationshipId}:${firstRelation.relationKind}`,
        ],
      }),
      role: "relationship-existence",
      freshness: "current",
      evidenceStatus: "present",
      writer: "recorded-relationship-projection",
      subjectId,
      relatedSubjectId: firstRelation.otherId,
    });
    claims.push(existence);

    const interpretationType = classifyRecordedRelationInterpretation(
      firstRelation.relationKind,
    );
    const interpretationStatement =
      interpretationType === "ASSUMPTION"
        ? `${input.subjectLabel ?? "This subject"} ${firstRelation.relationKind.replace(/-/g, " ")} ${firstRelation.otherLabel}. That is a recorded hypothesis, not proven causation.`
        : `A relationship with ${firstRelation.otherLabel} is recorded, but current evidence does not establish a cause.`;
    const interpretation = wrapClaim({
      claim: safeClaim({
        claimId: `core-int2:interpretation:${subjectId}:${firstRelation.relationshipId}`,
        type: interpretationType,
        statement: interpretationStatement,
        evidenceRefs:
          interpretationType === "UNKNOWN" ? [] : existenceEvidence,
        provenanceRefs:
          interpretationType === "UNKNOWN"
            ? []
            : [
                `recorded-relationship:${firstRelation.relationshipId}:${firstRelation.relationKind}`,
              ],
      }),
      role: "interpretation",
      freshness: "unknown",
      evidenceStatus: interpretationType === "UNKNOWN" ? "missing" : "present",
      writer:
        interpretationType === "UNKNOWN"
          ? "insufficient"
          : "recorded-relationship-projection",
      subjectId,
      relatedSubjectId: firstRelation.otherId,
    });
    claims.push(interpretation);
  }

  let prediction: SharedEpistemicClaim | null = null;
  if (input.scenario) {
    const evidenceRefs: NexoraExecutiveEvidenceReference[] = [
      {
        sourceKind: "scenario",
        sourceId: input.scenario.scenarioId,
        subjectId: input.scenario.scenarioId,
        factKey: "projected-effect",
      },
    ];
    prediction = wrapClaim({
      claim: safeClaim({
        claimId: `core-int2:prediction:${input.scenario.scenarioId}`,
        type: "PREDICTION",
        statement: input.scenario.statement.endsWith(".")
          ? input.scenario.statement
          : `${input.scenario.statement}.`,
        evidenceRefs,
        provenanceRefs: [`scenario-projection:${input.scenario.scenarioId}`],
      }),
      role: "prediction",
      freshness: "unknown",
      evidenceStatus: "present",
      writer: "scenario-projection",
      subjectId: input.scenario.scenarioId,
    });
    claims.push(prediction);
  }

  const interpretation =
    claims.find((entry) => entry.role === "interpretation") ?? null;
  const unknown =
    claims.find((entry) => entry.claim.type === "UNKNOWN") ??
    (claims.length === 0 ? unknownClaim(subjectId) : null);
  if (unknown && !claims.includes(unknown)) claims.push(unknown);

  const focused =
    (input.subjectKind === "scenario" ? prediction : null) ??
    interpretation ??
    observation ??
    unknown ??
    unknownClaim(subjectId);

  return deepFreeze({
    identity: nexoraSharedEpistemicFoundationIdentity,
    subjectId,
    subjectLabel: input.subjectLabel,
    claims: Object.freeze(claims),
    observation,
    interpretation,
    prediction,
    unknown,
    focusedClaimId: focused.claim.claimId,
    writesMemory: false,
    mutatesStage: false,
    mutatesDecision: false,
  });
}

export function claimById(
  pack: NexoraSharedEpistemicProjection,
  claimId: string | null | undefined,
): SharedEpistemicClaim | null {
  if (!claimId) return null;
  return pack.claims.find((entry) => entry.claim.claimId === claimId) ?? null;
}

export function focusedSharedEpistemicClaim(
  pack: NexoraSharedEpistemicProjection,
): SharedEpistemicClaim {
  return (
    claimById(pack, pack.focusedClaimId) ??
    pack.unknown ??
    unknownClaim(pack.subjectId)
  );
}

export function claimForExperienceRole(
  pack: NexoraSharedEpistemicProjection,
  role:
    | "observation"
    | "interpretation"
    | "prediction"
    | "unknown"
    | "focused",
): SharedEpistemicClaim {
  if (role === "observation") {
    return pack.observation ?? pack.unknown ?? unknownClaim(pack.subjectId);
  }
  if (role === "interpretation") {
    return pack.interpretation ?? pack.unknown ?? unknownClaim(pack.subjectId);
  }
  if (role === "prediction") {
    return pack.prediction ?? pack.unknown ?? unknownClaim(pack.subjectId);
  }
  if (role === "unknown") {
    return pack.unknown ?? unknownClaim(pack.subjectId);
  }
  return focusedSharedEpistemicClaim(pack);
}

export function exiEpistemicFromClaim(
  claim: SharedEpistemicClaim,
): "fact" | "assumption" | "prediction" | "unknown" {
  if (claim.claim.type === "FACT") return "fact";
  if (claim.claim.type === "ASSUMPTION") return "assumption";
  if (claim.claim.type === "PREDICTION") return "prediction";
  return "unknown";
}

export function applyCoreEpistemicToField(input: {
  readonly claim: SharedEpistemicClaim | null;
  readonly statement: string | null;
  readonly authority: string;
  readonly requestedConfidence?: SharedEpistemicPresentationConfidence;
}): {
  readonly epistemic: "fact" | "assumption" | "prediction" | "unknown";
  readonly confidence: SharedEpistemicPresentationConfidence;
} {
  if (input.claim == null) {
    return {
      epistemic: "unknown",
      confidence: "none",
    };
  }
  const confidence = bindDownstreamPresentationConfidence(
    input.claim.presentationConfidence,
    input.requestedConfidence ?? input.claim.presentationConfidence,
  );
  return {
    epistemic: exiEpistemicFromClaim(input.claim),
    confidence,
  };
}
