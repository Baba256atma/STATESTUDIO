/**
 * EXI:2 — Grounded cause, constraint, and trade-off composition.
 *
 * Read-only enrichment of the EXI:1 experience contract.
 * Does not invent causation, constraints, numeric trade-offs, or recommendations.
 */

import type {
  CausalAssessment,
  ConstraintAssessment,
} from "../executive-intelligence/nexoraGroundedCausalConstraintIntelligence.ts";
import type { SharedEpistemicClaim } from "../executive-intelligence/nexoraSharedEpistemicFoundation.ts";
import {
  applyCoreEpistemicToField,
  mapSemanticConfidenceToPresentation,
} from "../executive-intelligence/nexoraSharedEpistemicFoundation.ts";
import type { ExecutiveTradeoffAssessment } from "../executive-intelligence/nexoraExecutiveTradeoffIntelligence.ts";
import {
  presentCoreOptionAsExi,
  presentTradeoffAssumptions,
  presentTradeoffAssessment,
  presentTradeoffConstraintComparison,
  presentTradeoffCostComparison,
  presentTradeoffGains,
  presentTradeoffMissingDimensions,
  presentTradeoffRiskComparison,
  presentTradeoffSacrifices,
  presentTradeoffTimeComparison,
} from "../executive-intelligence/nexoraExecutiveTradeoffIntelligence.ts";
import type { NexoraProfessionalAdvisorNarrative } from "./nexoraMVPProfessionalAdvisorPresentation.ts";
import {
  NEXORA_MVP_CONTEXT_LINK_FIXTURES,
  NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES,
} from "./nexoraMVPObjectInteractionFixtures.ts";
import {
  getNexoraMVPSubjectPresentationFixture,
} from "./nexoraMVPPresentationFixtures.ts";
import {
  NEXORA_MVP_STAGE_OBJECT_FIXTURES,
  NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
} from "./nexoraMVPStageFixtures.ts";
type NexoraExiEpistemicKind =
  | "fact"
  | "relationship"
  | "assumption"
  | "prediction"
  | "unknown";

type NexoraExiFieldAuthority =
  | "professional-advisor"
  | "next-best-action"
  | "decision-brief"
  | "data-reality"
  | "stage-subject"
  | "recorded-relationship"
  | "scenario-fixture"
  | "execution-presentation"
  | "missing";

type NexoraExiComposedField = Readonly<{
  readonly statement: string | null;
  readonly authority: NexoraExiFieldAuthority;
  readonly epistemic: NexoraExiEpistemicKind;
  readonly confidence: "strong" | "limited" | "incomplete" | "stale" | "none";
}>;

export const nexoraExi2EnrichmentIdentity =
  "EXI:2/GroundedCauseConstraintTradeoff" as const;

export const nexoraExi3EnrichmentIdentity =
  "EXI:3/LiveTradeoffOptionComparison" as const;

export const NEXORA_EXI3_ENRICHMENT_BOUNDARY = Object.freeze({
  ei4LiveOnExecutive: false as const,
  ownsTradeoffTruth: false as const,
  readsCoreInt5: true as const,
  inventsEconomics: false as const,
  inventsScores: false as const,
  inventsPriority: false as const,
  inventsRecommendations: false as const,
  commitsDecisions: false as const,
  mutatesExecution: false as const,
  startsOutcomeLearning: false as const,
  changesStageTopology: false as const,
  usesLlm: false as const,
});

export const NEXORA_EXI2_ENRICHMENT_BOUNDARY = Object.freeze({
  inventsCausation: false as const,
  inventsConstraints: false as const,
  inventsTradeoffNumbers: false as const,
  inventsRecommendations: false as const,
  ranksWithoutEvidence: false as const,
  mutatesRuntime: false as const,
  writesMemory: false as const,
  commitsDecisions: false as const,
  changesStageTopology: false as const,
  usesLlm: false as const,
});

const CONSTRAINT_RELATIONS = new Set(["constrained-by", "blocks"]);
const CONTRIBUTOR_RELATIONS = new Set([
  "constrained-by",
  "affected-by",
  "depends-on",
  "affects",
  "blocks",
]);
const GENERIC_RELATIONS = new Set([
  "associated-with",
  "related",
  "related-to",
  "influences",
]);

export type NexoraExiRelationKind =
  | "constrained-by"
  | "blocks"
  | "affected-by"
  | "depends-on"
  | "affects"
  | "explored-by"
  | "acts-on"
  | "implements"
  | "sources"
  | "associated-with"
  | "related"
  | "influences"
  | "unknown";

export type NexoraExiContributor = Readonly<{
  readonly subjectId: string | null;
  readonly statement: string;
  readonly relationKind: NexoraExiRelationKind;
  readonly evidence: string;
  readonly epistemic: NexoraExiEpistemicKind;
  readonly confidence: NexoraExiComposedField["confidence"];
}>;

export type NexoraExiCauseAssessment = Readonly<{
  readonly contributors: readonly NexoraExiContributor[];
  readonly primaryContributor: NexoraExiContributor | null;
  readonly rootCause: NexoraExiContributor | null;
  readonly causalConfidence: NexoraExiComposedField["confidence"];
  readonly missingEvidence: string | null;
  readonly chain: string | null;
  readonly summary: NexoraExiComposedField;
}>;

export type NexoraExiConstraintRecord = Readonly<{
  readonly subjectId: string | null;
  readonly statement: string;
  readonly constraintType: "recorded-limit" | "recorded-blocker";
  readonly affectedSubject: string | null;
  readonly evidence: string;
  readonly confidence: NexoraExiComposedField["confidence"];
}>;

export type NexoraExiConstraintAssessment = Readonly<{
  readonly constraints: readonly NexoraExiConstraintRecord[];
  readonly bindingConstraint: NexoraExiConstraintRecord | null;
  readonly unresolvedConstraints: readonly NexoraExiConstraintRecord[];
  readonly summary: NexoraExiComposedField;
}>;

export type NexoraExiTradeoffOption = Readonly<{
  readonly optionId: string | null;
  readonly label: string;
  readonly benefits: string | null;
  readonly costs: string | null;
  readonly risks: string | null;
  readonly constraints: string | null;
  readonly assumptions: string | null;
  readonly predictedEffects: string | null;
  readonly uncertainty: string;
  readonly evidence: string;
  readonly missingDimensions: readonly string[];
}>;

export type NexoraExiOptionComparison = Readonly<{
  readonly subjectId: string | null;
  readonly options: readonly NexoraExiTradeoffOption[];
  readonly comparisonSummary: string;
  readonly preferredOptionId: string | null;
  readonly preferenceAuthority: "decision-brief" | "next-best-action" | "professional-advisor" | "none";
  readonly missingEvidence: readonly string[];
  readonly comparable: boolean;
}>;

export type NexoraExiTradeoffAssessment = Readonly<{
  readonly options: readonly NexoraExiTradeoffOption[];
  readonly comparisonSummary: string;
  readonly recommendationAlignment: string | null;
  readonly optionComparison: NexoraExiOptionComparison;
  readonly summary: NexoraExiComposedField;
}>;

type RecordedEdge = Readonly<{
  readonly otherId: string | null;
  readonly otherLabel: string;
  readonly relation: NexoraExiRelationKind;
  readonly source: "context-link" | "presentation" | "stage-link";
}>;

function field(
  statement: string | null,
  authority: NexoraExiFieldAuthority,
  epistemic: NexoraExiEpistemicKind,
  confidence: NexoraExiComposedField["confidence"],
): NexoraExiComposedField {
  return Object.freeze({ statement, authority, epistemic, confidence });
}

function missing(statement: string): NexoraExiComposedField {
  return field(statement, "missing", "unknown", "none");
}

export function phraseNexoraExiRelation(relation: string): string {
  switch (normalizeRelation(relation)) {
    case "constrained-by":
      return "constrained by";
    case "explored-by":
      return "evaluated through";
    case "affects":
      return "affects";
    case "depends-on":
      return "depends on";
    case "blocks":
      return "is recorded as blocking";
    case "affected-by":
      return "is affected by";
    case "acts-on":
      return "is addressed by";
    case "implements":
      return "is carried through";
    case "sources":
      return "is sourced from";
    case "associated-with":
      return "is associated with";
    case "influences":
      return "is associated with";
    default:
      return "is related to";
  }
}

function normalizeRelation(relation: string): NexoraExiRelationKind {
  switch (relation) {
    case "constrained-by":
    case "blocks":
    case "affected-by":
    case "depends-on":
    case "affects":
    case "explored-by":
    case "acts-on":
    case "implements":
    case "sources":
    case "associated-with":
    case "influences":
      return relation;
    case "related-to":
    case "related":
      return "related";
    default:
      return "unknown";
  }
}

function labelFor(id: string): string {
  return (
    NEXORA_MVP_STAGE_OBJECT_FIXTURES.find((entry) => entry.id === id)?.label ??
    NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES.find((entry) => entry.id === id)?.label ??
    id
  );
}

function idForLabel(label: string): string | null {
  const object = NEXORA_MVP_STAGE_OBJECT_FIXTURES.find((entry) => entry.label === label);
  if (object) return object.id;
  const context = NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES.find((entry) => entry.label === label);
  return context?.id ?? null;
}

function collectEdges(subjectId: string | null): readonly RecordedEdge[] {
  if (subjectId == null) return Object.freeze([]);
  const edges: RecordedEdge[] = [];
  for (const link of NEXORA_MVP_CONTEXT_LINK_FIXTURES) {
    if (link.objectId !== subjectId && link.contextId !== subjectId) continue;
    const otherId = link.objectId === subjectId ? link.contextId : link.objectId;
    edges.push(
      Object.freeze({
        otherId,
        otherLabel: labelFor(otherId),
        relation: normalizeRelation(link.relation),
        source: "context-link",
      }),
    );
  }
  const presentation = getNexoraMVPSubjectPresentationFixture(subjectId);
  for (const relation of presentation?.relationships ?? []) {
    edges.push(
      Object.freeze({
        otherId: idForLabel(relation.label),
        otherLabel: relation.label,
        relation: normalizeRelation(relation.relation),
        source: "presentation",
      }),
    );
  }
  for (const rel of NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES) {
    if (rel.sourceId !== subjectId && rel.targetId !== subjectId) continue;
    const otherId = rel.sourceId === subjectId ? rel.targetId : rel.sourceId;
    if (edges.some((edge) => edge.otherId === otherId)) continue;
    edges.push(
      Object.freeze({
        otherId,
        otherLabel: labelFor(otherId),
        relation: "related",
        source: "stage-link",
      }),
    );
  }
  const seen = new Set<string>();
  return Object.freeze(
    edges.filter((edge) => {
      const key = `${edge.otherLabel}:${edge.relation}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }),
  );
}

function contributorStatement(
  edge: RecordedEdge,
  core?: SharedEpistemicClaim | null,
): NexoraExiContributor {
  const relationKind = edge.relation;
  const phrase = phraseNexoraExiRelation(relationKind);
  if (CONTRIBUTOR_RELATIONS.has(relationKind) && relationKind !== "unknown") {
    const statement =
      relationKind === "blocks"
        ? `${edge.otherLabel} is recorded as blocked by the current subject. That is a recorded blocker relationship, not proven causation.`
        : relationKind === "constrained-by"
          ? `${edge.otherLabel} is a recorded constraint and may be contributing. Current evidence does not establish causation.`
          : `This subject ${phrase} ${edge.otherLabel}. That is a possible contributor, not a proven cause.`;
    const mapped = core
      ? applyCoreEpistemicToField({
          claim: core,
          statement,
          authority: "recorded-relationship",
          requestedConfidence: "limited",
        })
      : { epistemic: "assumption" as const, confidence: "limited" as const };
    return Object.freeze({
      subjectId: edge.otherId,
      statement,
      relationKind,
      evidence: `Recorded ${phrase} link to ${edge.otherLabel}.`,
      epistemic: mapped.epistemic,
      confidence: mapped.confidence,
    });
  }
  const mapped = core
    ? applyCoreEpistemicToField({
        claim: core,
        statement: `${edge.otherLabel} ${phrase === "is related to" ? "is related to" : phrase} this subject. That is a recorded relationship, not proven causation.`,
        authority: "recorded-relationship",
        requestedConfidence: "limited",
      })
    : { epistemic: "unknown" as const, confidence: "limited" as const };
  return Object.freeze({
    subjectId: edge.otherId,
    statement: `${edge.otherLabel} ${phrase === "is related to" ? "is related to" : phrase} this subject. That is a recorded relationship, not proven causation.`,
    relationKind,
    evidence: `Recorded ${phrase} association with ${edge.otherLabel}.`,
    epistemic: mapped.epistemic === "fact" ? "relationship" : mapped.epistemic,
    confidence: mapped.confidence,
  });
}

function isConsequenceEdge(edge: RecordedEdge): boolean {
  return edge.relation === "blocks" || edge.relation === "affects";
}

function isInboundContributor(edge: RecordedEdge): boolean {
  return (
    edge.relation === "constrained-by" ||
    edge.relation === "affected-by" ||
    edge.relation === "depends-on"
  );
}

function presentCoreContributor(
  contributor: CausalAssessment["contributors"][number],
): NexoraExiContributor {
  const epistemic =
    contributor.interpretationClaim.type === "FACT"
      ? ("relationship" as const)
      : contributor.interpretationClaim.type === "ASSUMPTION"
        ? ("assumption" as const)
        : contributor.interpretationClaim.type === "PREDICTION"
          ? ("prediction" as const)
          : ("unknown" as const);
  return Object.freeze({
    subjectId: contributor.subjectId,
    statement: contributor.interpretationClaim.statement,
    relationKind: normalizeRelation(contributor.relationKind),
    evidence: `Recorded ${phraseNexoraExiRelation(contributor.relationKind)} link to ${contributor.label}.`,
    epistemic,
    confidence: mapSemanticConfidenceToPresentation(
      contributor.confidence,
      "current",
      contributor.evidenceStatus,
    ),
  });
}

export function composeNexoraExiCauseAssessment(
  narrative: NexoraProfessionalAdvisorNarrative,
  options?: {
    readonly treatAsOverview?: boolean;
    readonly epistemic?: SharedEpistemicClaim | null;
    readonly core?: CausalAssessment | null;
  },
): NexoraExiCauseAssessment {
  const isOverview = options?.treatAsOverview === true || narrative.isOverview;
  if (isOverview) {
    const summary = missing(
      "No specific cause is identified until a subject is in focus.",
    );
    return Object.freeze({
      contributors: Object.freeze([]),
      primaryContributor: null,
      rootCause: null,
      causalConfidence: "none",
      missingEvidence: summary.statement,
      chain: null,
      summary,
    });
  }

  const coreAssessment = options?.core ?? null;
  if (coreAssessment) {
    const displayed =
      coreAssessment.contributors.length > 0
        ? coreAssessment.contributors
        : coreAssessment.relatedFactors;
    const contributors = displayed.map(presentCoreContributor);
    const primary =
      coreAssessment.primaryContributor != null
        ? presentCoreContributor(coreAssessment.primaryContributor)
        : null;
    const rootCause =
      coreAssessment.rootCause != null
        ? presentCoreContributor(coreAssessment.rootCause)
        : null;
    const chain =
      coreAssessment.chain.length >= 2
        ? `${coreAssessment.chain.map((edge) => edge.fromLabel).join(" → ")} → ${coreAssessment.chain[coreAssessment.chain.length - 1]!.toLabel} (recorded links, not proven causation)`
        : null;
    const summaryStatement = presentCausalFromCore(coreAssessment, chain);
    const epistemic = options?.epistemic ?? null;
    const mapped = epistemic
      ? applyCoreEpistemicToField({
          claim: epistemic,
          statement: summaryStatement,
          authority: "recorded-relationship",
          requestedConfidence: mapSemanticConfidenceToPresentation(
            coreAssessment.causalConfidence,
            "current",
            coreAssessment.evidenceStatus,
          ),
        })
      : {
          epistemic:
            coreAssessment.contributors.length > 0
              ? ("assumption" as const)
              : ("relationship" as const),
          confidence: mapSemanticConfidenceToPresentation(
            coreAssessment.causalConfidence,
            "current",
            coreAssessment.evidenceStatus,
          ),
        };
    const empty = contributors.length === 0;
    const summary = empty
      ? missing(summaryStatement)
      : field(
          summaryStatement,
          "recorded-relationship",
          mapped.epistemic,
          mapped.confidence,
        );
    return Object.freeze({
      contributors: Object.freeze(contributors),
      primaryContributor: primary,
      rootCause,
      causalConfidence: empty ? "none" : mapped.confidence,
      missingEvidence: coreAssessment.missingEvidence,
      chain,
      summary,
    });
  }

  const edges = collectEdges(narrative.currentSubjectId);
  const inbound = edges.filter(isInboundContributor);
  const relatedOnly = edges.filter(
    (edge) =>
      GENERIC_RELATIONS.has(edge.relation) ||
      edge.relation === "related" ||
      edge.relation === "unknown",
  );
  const core = options?.epistemic ?? null;
  const supported = inbound.map((edge) => contributorStatement(edge, core));
  const relationshipContributors = relatedOnly.map((edge) =>
    contributorStatement(edge, core),
  );

  if (supported.length === 0 && relationshipContributors.length === 0) {
    const summary = missing(
      "Nexora does not currently have enough evidence to identify a cause.",
    );
    return Object.freeze({
      contributors: Object.freeze([]),
      primaryContributor: null,
      rootCause: null,
      causalConfidence: "none",
      missingEvidence: summary.statement,
      chain: null,
      summary,
    });
  }

  if (supported.length === 0) {
    const names = relationshipContributors.map((entry) =>
      entry.subjectId ? labelFor(entry.subjectId) : "a related factor",
    );
    const summary = field(
      `Nexora can show related factors (${names.join(" and ")}), but current evidence does not establish a cause.`,
      "recorded-relationship",
      "relationship",
      "limited",
    );
    return Object.freeze({
      contributors: Object.freeze(relationshipContributors),
      primaryContributor: null,
      rootCause: null,
      causalConfidence: "limited",
      missingEvidence: "Current evidence does not establish causation.",
      chain: null,
      summary,
    });
  }

  const chain = composeRecordedChain(narrative.currentSubjectId, inbound, edges);
  const summaryStatement =
    "Nexora has identified possible contributors, but current evidence is not strong enough to rank them or establish a root cause.";
  const coreMapped = core
    ? applyCoreEpistemicToField({
        claim: core,
        statement: summaryStatement,
        authority: "recorded-relationship",
        requestedConfidence: "limited",
      })
    : { epistemic: "assumption" as const, confidence: "limited" as const };
  const summary = field(
    chain ? `${summaryStatement} Recorded chain: ${chain}.` : summaryStatement,
    "recorded-relationship",
    coreMapped.epistemic,
    coreMapped.confidence,
  );
  return Object.freeze({
    contributors: Object.freeze(supported),
    primaryContributor: null,
    rootCause: null,
    causalConfidence: "limited",
    missingEvidence: "Evidence is not strong enough to prove causation.",
    chain,
    summary,
  });
}

function presentCausalFromCore(
  core: CausalAssessment,
  chain: string | null,
): string {
  if (core.contributors.length === 0 && core.relatedFactors.length === 0) {
    return core.missingEvidence ?? "Nexora does not currently have enough evidence to identify a cause.";
  }
  if (core.contributors.length === 0) {
    const names = core.relatedFactors.map((entry) => entry.label);
    return `Nexora can show related factors (${names.join(" and ")}), but current evidence does not establish a cause.`;
  }
  const lines = core.contributors.map((entry) => entry.interpretationClaim.statement);
  const root =
    core.rootCause == null
      ? "A possible contributor is known, but a root cause has not been established."
      : "";
  const base = `${lines.join(" ")} ${root}`.trim();
  return chain ? `${base} Recorded chain: ${chain}.` : base;
}

function composeRecordedChain(
  subjectId: string | null,
  inbound: readonly RecordedEdge[],
  edges: readonly RecordedEdge[],
): string | null {
  if (subjectId == null || inbound.length === 0) return null;
  const first = inbound[0]!;
  const consequence = edges.find(
    (edge) => isConsequenceEdge(edge) && edge.otherLabel !== first.otherLabel,
  );
  const nodes = [first.otherLabel, labelFor(subjectId)];
  if (consequence) nodes.push(consequence.otherLabel);
  if (nodes.length < 2) return null;
  return `${nodes.join(" → ")} (recorded links, not proven causation)`;
}

function presentCoreConstraint(
  constraint: ConstraintAssessment["constraints"][number],
): NexoraExiConstraintRecord {
  return Object.freeze({
    subjectId: constraint.subjectId,
    statement: constraint.interpretationClaim.statement,
    constraintType: constraint.qualification,
    affectedSubject: constraint.subjectId,
    evidence: `Recorded ${phraseNexoraExiRelation(constraint.relationKind)} relationship.`,
    confidence: mapSemanticConfidenceToPresentation(
      constraint.confidence,
      "current",
      constraint.evidenceStatus,
    ),
  });
}

export function composeNexoraExiConstraintAssessment(
  narrative: NexoraProfessionalAdvisorNarrative,
  options?: {
    readonly treatAsOverview?: boolean;
    readonly core?: ConstraintAssessment | null;
  },
): NexoraExiConstraintAssessment {
  const subjectId =
    options?.treatAsOverview === true ? null : narrative.currentSubjectId;
  const coreAssessment = options?.core ?? null;
  if (coreAssessment) {
    const constraints = coreAssessment.constraints.map(presentCoreConstraint);
    if (subjectId == null || constraints.length === 0) {
      const summary = missing(
        coreAssessment.missingEvidence ?? "No validated constraint is currently recorded.",
      );
      return Object.freeze({
        constraints: Object.freeze([]),
        bindingConstraint: null,
        unresolvedConstraints: Object.freeze([]),
        summary,
      });
    }
    const binding =
      coreAssessment.bindingConstraint != null
        ? presentCoreConstraint(coreAssessment.bindingConstraint)
        : null;
    const recorded = constraints.map((entry) => entry.statement).join(" ");
    const summaryStatement =
      binding == null
        ? `${recorded} Nexora has identified the recorded constraints, but does not yet have enough evidence to determine which one is binding.`
        : recorded;
    return Object.freeze({
      constraints: Object.freeze(constraints),
      bindingConstraint: binding,
      unresolvedConstraints: Object.freeze(
        coreAssessment.unresolvedConstraints.map(presentCoreConstraint),
      ),
      summary: field(summaryStatement, "recorded-relationship", "relationship", "limited"),
    });
  }

  const edges = collectEdges(subjectId).filter((edge) =>
    edge.relation === "constrained-by",
  );
  if (subjectId == null || edges.length === 0) {
    const summary = missing(
      "No validated constraint is currently recorded.",
    );
    return Object.freeze({
      constraints: Object.freeze([]),
      bindingConstraint: null,
      unresolvedConstraints: Object.freeze([]),
      summary,
    });
  }

  const constraints = edges.map((edge) =>
    Object.freeze({
      subjectId: edge.otherId,
      statement: `${edge.otherLabel} is a recorded constraint on ${labelFor(subjectId)}.`,
      constraintType: "recorded-limit" as const,
      affectedSubject: subjectId,
      evidence: `Recorded ${phraseNexoraExiRelation(edge.relation)} relationship.`,
      confidence: "limited" as const,
    }),
  );

  return Object.freeze({
    constraints: Object.freeze(constraints),
    bindingConstraint: null,
    unresolvedConstraints: Object.freeze(constraints),
    summary: field(
      `${constraints.map((entry) => entry.statement).join(" ")} Nexora has identified the recorded constraints, but does not yet have enough evidence to determine which one is binding.`,
      "recorded-relationship",
      "relationship",
      "limited",
    ),
  });
}

function presentCoreOption(option: ReturnType<typeof presentCoreOptionAsExi>): NexoraExiTradeoffOption {
  return Object.freeze({
    optionId: option.optionId,
    label: option.label,
    benefits: option.benefits,
    costs: option.costs,
    risks: option.risks,
    constraints: option.constraints,
    assumptions: option.assumptions,
    predictedEffects: option.predictedEffects,
    uncertainty: option.uncertainty,
    evidence: option.evidence,
    missingDimensions: Object.freeze([...option.missingDimensions]),
  });
}

function emptyComparison(
  subjectId: string | null,
  summary: NexoraExiComposedField,
): NexoraExiOptionComparison {
  return Object.freeze({
    subjectId,
    options: Object.freeze([]),
    comparisonSummary: summary.statement ?? "",
    preferredOptionId: null,
    preferenceAuthority: "none",
    missingEvidence: Object.freeze(["No evaluated comparable options are in context."]),
    comparable: false,
  });
}

export function composeNexoraExiTradeoffAssessment(
  narrative: NexoraProfessionalAdvisorNarrative,
  options?: {
    readonly treatAsOverview?: boolean;
    readonly epistemic?: SharedEpistemicClaim | null;
    readonly core?: ExecutiveTradeoffAssessment | null;
  },
): NexoraExiTradeoffAssessment {
  const core = options?.core ?? null;
  if (core) {
    const collected = core.options.map((option) =>
      presentCoreOption(presentCoreOptionAsExi(option)),
    );
    const summaryStatement = presentTradeoffAssessment(core);
    const empty = core.comparisonStatus === "no-options";
    const authority: NexoraExiFieldAuthority = empty
      ? "missing"
      : narrative.recommendationAuthority === "decision-brief"
        ? "decision-brief"
        : "scenario-fixture";
    const epistemic = options?.epistemic
      ? applyCoreEpistemicToField({
          claim: options.epistemic,
          statement: summaryStatement,
          authority,
          requestedConfidence: "limited",
        })
      : { epistemic: "prediction" as const, confidence: "limited" as const };
    const summary = empty
      ? missing(summaryStatement)
      : field(summaryStatement, authority, epistemic.epistemic, epistemic.confidence);
    return Object.freeze({
      options: Object.freeze(collected),
      comparisonSummary: summaryStatement,
      recommendationAlignment: core.recommendationAlignment,
      optionComparison: Object.freeze({
        subjectId: core.subjectId,
        options: Object.freeze(collected),
        comparisonSummary: summaryStatement,
        preferredOptionId: core.preferredOptionId,
        preferenceAuthority: core.preferenceAuthority,
        missingEvidence: core.missingDimensions,
        comparable: core.comparable,
      }),
      summary,
    });
  }

  const isOverview = options?.treatAsOverview === true || narrative.isOverview;
  const summary = missing(
    isOverview
      ? "No evaluated option is in focus. Open Scenarios when you want to inspect alternatives."
      : "No evaluated option is currently available for this issue.",
  );
  return Object.freeze({
    options: Object.freeze([]),
    comparisonSummary: summary.statement ?? "",
    recommendationAlignment: null,
    optionComparison: emptyComparison(isOverview ? null : narrative.currentSubjectId, summary),
    summary,
  });
}

export function composeNexoraExiComparisonFollowups(
  tradeoff: NexoraExiTradeoffAssessment,
  core?: ExecutiveTradeoffAssessment | null,
): Readonly<{
  readonly gain: string;
  readonly sacrifice: string;
  readonly safer: string;
  readonly cheaper: string;
  readonly faster: string;
  readonly assumptions: string;
  readonly missingDimension: string;
  readonly constraintComparison: string;
}> {
  if (core) {
    return Object.freeze({
      gain: presentTradeoffGains(core),
      sacrifice: presentTradeoffSacrifices(core),
      safer: presentTradeoffRiskComparison(core),
      cheaper: presentTradeoffCostComparison(core),
      faster: presentTradeoffTimeComparison(core),
      assumptions: presentTradeoffAssumptions(core),
      missingDimension: presentTradeoffMissingDimensions(core),
      constraintComparison: presentTradeoffConstraintComparison(core),
    });
  }
  const empty = "No evaluated options are currently available.";
  return Object.freeze({
    gain: empty,
    sacrifice: empty,
    safer: empty,
    cheaper: empty,
    faster: empty,
    assumptions: empty,
    missingDimension: empty,
    constraintComparison: empty,
  });
}

export function composeNexoraExiEvidenceFollowup(
  cause: NexoraExiCauseAssessment,
  constraint: NexoraExiConstraintAssessment,
  tradeoff: NexoraExiTradeoffAssessment,
  evidenceSummary: string | null,
): string {
  const parts = [
    cause.contributors[0]?.evidence,
    constraint.constraints[0]?.evidence,
    tradeoff.options[0]?.evidence,
    evidenceSummary,
  ].filter((value): value is string => Boolean(value));
  if (parts.length === 0) {
    return "Nexora does not have additional validated evidence for that assessment.";
  }
  return `${parts[0]} ${evidenceSummary ?? "Evidence limited."}`.replace(/\s+/g, " ").trim();
}

export function composeNexoraExiConfidenceFollowup(
  cause: NexoraExiCauseAssessment,
  constraint: NexoraExiConstraintAssessment,
  tradeoff: NexoraExiTradeoffAssessment,
): string {
  if (cause.contributors.length > 0) {
    return "Evidence limited. These are possible contributors from recorded relationships, not proven causes.";
  }
  if (constraint.constraints.length > 0) {
    return "Evidence limited. Constraints shown are recorded limits or blockers, not ranked binding constraints.";
  }
  if (tradeoff.options.length > 0) {
    return "Evidence limited. Option impacts are projected, not observed facts.";
  }
  return "Not enough evidence to rank contributors, constraints, or trade-offs.";
}
