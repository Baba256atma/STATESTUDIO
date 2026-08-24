/**
 * CORE-INT:2 — live source collector for the shared epistemic contract.
 *
 * Collects existing /executive truth. Does not classify from prose.
 * Claim construction stays in the Core epistemic module.
 */

import type { DataRealityAwareAdvisorBindingResult } from "../data-reality/dataRealityAwareAdvisorExperienceBinding.ts";
import type { NexoraProfessionalAdvisorNarrative } from "./nexoraMVPProfessionalAdvisorPresentation.ts";
import {
  NEXORA_MVP_CONTEXT_LINK_FIXTURES,
  NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES,
} from "./nexoraMVPObjectInteractionFixtures.ts";
import { getNexoraMVPSubjectPresentationFixture } from "./nexoraMVPPresentationFixtures.ts";
import {
  NEXORA_MVP_STAGE_OBJECT_FIXTURES,
  NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
} from "./nexoraMVPStageFixtures.ts";
import {
  projectSharedEpistemicFoundation,
  type NexoraSharedEpistemicProjection,
  type SharedEpistemicObservationSource,
  type SharedEpistemicRelationshipDirection,
  type SharedEpistemicRelationshipSource,
  type SharedEpistemicScenarioSource,
} from "../executive-intelligence/nexoraSharedEpistemicFoundation.ts";
import {
  projectGroundedCausalConstraintIntelligence,
  type GroundedCausalConstraintIntelligence,
} from "../executive-intelligence/nexoraGroundedCausalConstraintIntelligence.ts";
import {
  projectExecutivePriorityIntelligence,
  resolvePriorityEligibleKind,
  type ExecutivePriorityAssessment,
  type ExecutivePriorityCandidateSource,
  type PriorityScopeKind,
} from "../executive-intelligence/nexoraExecutivePriorityIntelligence.ts";
import {
  projectExecutiveTradeoffIntelligence,
  type ExecutiveTradeoffAssessment,
  type ExecutiveTradeoffOptionSource,
} from "../executive-intelligence/nexoraExecutiveTradeoffIntelligence.ts";
import {
  projectLiveOutcomeIntelligence,
  type ExecutiveOutcomeAssessment,
  type ExecutiveOutcomeExpectation,
} from "../executive-intelligence/nexoraLiveOutcomeIntelligence.ts";
import { projectOutcomeObservationCapture } from "../executive-intelligence/nexoraLiveOutcomeObservationCapture.ts";

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
  return (
    NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES.find((entry) => entry.label === label)?.id ??
    null
  );
}

function directionForKind(relationKind: string): SharedEpistemicRelationshipDirection {
  if (
    relationKind === "constrained-by" ||
    relationKind === "affected-by"
  ) {
    return "inbound";
  }
  if (
    relationKind === "blocks" ||
    relationKind === "affects" ||
    relationKind === "depends-on"
  ) {
    return "outbound";
  }
  return "undirected";
}

export function collectNexoraLiveRelationshipSources(
  subjectId: string | null,
): readonly SharedEpistemicRelationshipSource[] {
  if (subjectId == null) return Object.freeze([]);
  const subjectLabel = labelFor(subjectId);
  const edges: SharedEpistemicRelationshipSource[] = [];
  for (const link of NEXORA_MVP_CONTEXT_LINK_FIXTURES) {
    if (link.objectId !== subjectId && link.contextId !== subjectId) continue;
    const otherId = link.objectId === subjectId ? link.contextId : link.objectId;
    edges.push({
      relationshipId: `context:${subjectId}:${otherId}:${link.relation}`,
      otherId,
      otherLabel: labelFor(otherId),
      relationKind: link.relation,
      direction: directionForKind(link.relation),
    });
  }
  const presentation = getNexoraMVPSubjectPresentationFixture(subjectId);
  for (const relation of presentation?.relationships ?? []) {
    edges.push({
      relationshipId: relation.id,
      otherId: idForLabel(relation.label),
      otherLabel: relation.label,
      relationKind: relation.relation,
      direction: directionForKind(relation.relation),
    });
  }
  const otherSubjects = [
    ...NEXORA_MVP_STAGE_OBJECT_FIXTURES,
    ...NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES,
  ];
  for (const fixture of otherSubjects) {
    if (fixture.id === subjectId) continue;
    const otherPresentation = getNexoraMVPSubjectPresentationFixture(fixture.id);
    for (const relation of otherPresentation?.relationships ?? []) {
      if (relation.relation !== "blocks") continue;
      if (relation.label !== subjectLabel && idForLabel(relation.label) !== subjectId) {
        continue;
      }
      edges.push({
        relationshipId: `inbound-block:${fixture.id}:${subjectId}:${relation.id}`,
        otherId: fixture.id,
        otherLabel: fixture.label,
        relationKind: "blocks",
        direction: "inbound",
      });
    }
  }
  for (const rel of NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES) {
    if (rel.sourceId !== subjectId && rel.targetId !== subjectId) continue;
    const otherId = rel.sourceId === subjectId ? rel.targetId : rel.sourceId;
    if (edges.some((edge) => edge.otherId === otherId)) continue;
    edges.push({
      relationshipId: rel.id,
      otherId,
      otherLabel: labelFor(otherId),
      relationKind: "related",
      direction: "undirected",
    });
  }
  return Object.freeze(edges);
}

function collectObservation(input: {
  readonly subjectId: string;
  readonly subjectLabel: string;
  readonly evidenceState: NexoraProfessionalAdvisorNarrative["evidenceState"];
  readonly validatedDataSource?: boolean;
  readonly advisorBinding?: DataRealityAwareAdvisorBindingResult | null;
}): SharedEpistemicObservationSource | null {
  const fixture = getNexoraMVPSubjectPresentationFixture(input.subjectId);
  const kpi = fixture?.primaryKpi;
  if (kpi == null) return null;

  const bindingSubject =
    input.advisorBinding?.focusedSubject?.objectId === input.subjectId
      ? input.advisorBinding.focusedSubject
      : input.advisorBinding?.selectedSubject?.objectId === input.subjectId
        ? input.advisorBinding.selectedSubject
        : input.advisorBinding?.primarySubject?.objectId === input.subjectId
          ? input.advisorBinding.primarySubject
          : undefined;

  const hasLiveKpi =
    input.validatedDataSource === true && bindingSubject?.hasKPI === true;
  const stale =
    input.evidenceState === "stale" ||
    /\bstale\b/i.test(bindingSubject?.advisorMeaning ?? "");

  const statement = `${kpi.label} is ${kpi.value}${kpi.target ? ` against a ${kpi.target} target` : ""}.`;
  const provenance = hasLiveKpi
    ? uniqueProvenance([
        `data-reality:${input.advisorBinding?.provenance.datasetId ?? "dataset"}:${kpi.id}`,
        ...(bindingSubject?.evidenceIds ?? []),
      ])
    : [`mvp-presentation-fixture:${input.subjectId}:${kpi.id}`];

  return Object.freeze({
    statement,
    kpiId: kpi.id,
    value: kpi.value,
    sourceKind: hasLiveKpi ? "data-reality" : "mvp-presentation-fixture",
    sourceId: hasLiveKpi
      ? (input.advisorBinding?.provenance.datasetId ?? kpi.id)
      : `fixture:${input.subjectId}`,
    validated: hasLiveKpi,
    freshness: stale ? "stale" : "current",
    confidenceState: hasLiveKpi ? "verified" : "unverified",
    observedAt: null,
    provenanceRefs: provenance,
    evidenceRefs: Object.freeze([
      {
        sourceKind: hasLiveKpi ? ("data-reality" as const) : ("kpi" as const),
        sourceId: hasLiveKpi
          ? (input.advisorBinding?.provenance.datasetId ?? kpi.id)
          : kpi.id,
        subjectId: input.subjectId,
        factKey: kpi.id,
      },
    ]),
  });
}

function uniqueProvenance(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values.filter(Boolean))]);
}

function collectScenario(
  narrative: NexoraProfessionalAdvisorNarrative,
  subjectId: string | null,
): SharedEpistemicScenarioSource | null {
  const scenarioId =
    narrative.grammarKind === "scenario"
      ? narrative.currentSubjectId
      : subjectId != null &&
          NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES.some(
            (entry) => entry.id === subjectId && entry.kind === "scenario",
          )
        ? subjectId
        : null;
  if (scenarioId == null) return null;
  const fixture = getNexoraMVPSubjectPresentationFixture(scenarioId);
  const label = narrative.currentSubjectLabel ?? labelFor(scenarioId);
  return Object.freeze({
    scenarioId,
    label,
    statement:
      fixture?.summary ??
      `${label} is a projected alternative, not observed reality.`,
  });
}

export function projectNexoraLiveSharedEpistemicFoundation(input: {
  readonly narrative: NexoraProfessionalAdvisorNarrative;
  readonly presentationMode?: string | null;
  readonly validatedDataSource?: boolean;
  readonly advisorBinding?: DataRealityAwareAdvisorBindingResult | null;
}): NexoraSharedEpistemicProjection {
  const isCollection = input.presentationMode === "collection";
  const subjectId = isCollection ? null : input.narrative.currentSubjectId;
  const isOverview =
    isCollection || input.narrative.isOverview || subjectId == null;
  const observation =
    !isOverview && subjectId != null && input.narrative.currentSubjectLabel
      ? collectObservation({
          subjectId,
          subjectLabel: input.narrative.currentSubjectLabel,
          evidenceState: input.narrative.evidenceState,
          validatedDataSource: input.validatedDataSource,
          advisorBinding: input.advisorBinding,
        })
      : null;
  return projectSharedEpistemicFoundation({
    subjectId,
    subjectLabel: isOverview ? null : input.narrative.currentSubjectLabel,
    subjectKind: isOverview ? null : input.narrative.currentSubjectKind,
    isOverview,
    observation,
    relationships: isOverview ? [] : collectNexoraLiveRelationshipSources(subjectId),
    scenario: collectScenario(input.narrative, subjectId),
  });
}

export function projectNexoraLiveCausalConstraintIntelligence(input: {
  readonly narrative: NexoraProfessionalAdvisorNarrative;
  readonly presentationMode?: string | null;
}): GroundedCausalConstraintIntelligence {
  const isCollection = input.presentationMode === "collection";
  const subjectId = isCollection ? null : input.narrative.currentSubjectId;
  const isOverview =
    isCollection || input.narrative.isOverview || subjectId == null;
  return projectGroundedCausalConstraintIntelligence({
    subjectId,
    subjectLabel: isOverview ? null : input.narrative.currentSubjectLabel,
    subjectKind: isOverview ? null : input.narrative.currentSubjectKind,
    isOverview,
    relationships: isOverview ? [] : collectNexoraLiveRelationshipSources(subjectId),
  });
}

function countConstraintRelations(
  subjectId: string,
): number {
  return collectNexoraLiveRelationshipSources(subjectId).filter(
    (rel) =>
      rel.relationKind === "constrained-by" ||
      (rel.relationKind === "blocks" && rel.direction === "inbound"),
  ).length;
}

function countDownstreamRelations(subjectId: string, label: string): number {
  const others = [
    ...NEXORA_MVP_STAGE_OBJECT_FIXTURES,
    ...NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES,
  ];
  let count = 0;
  for (const other of others) {
    if (other.id === subjectId) continue;
    const rels = collectNexoraLiveRelationshipSources(other.id);
    if (
      rels.some(
        (rel) =>
          (rel.otherId === subjectId || rel.otherLabel === label) &&
          (rel.relationKind === "constrained-by" ||
            rel.relationKind === "affected-by" ||
            rel.relationKind === "blocks"),
      )
    ) {
      count += 1;
    }
  }
  return count;
}

function hasLinkedDecision(subjectId: string): boolean {
  const rels = collectNexoraLiveRelationshipSources(subjectId);
  return rels.some((rel) =>
    NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES.some(
      (entry) =>
        entry.kind === "decision" &&
        (entry.id === rel.otherId || entry.label === rel.otherLabel),
    ),
  );
}

function resolveLivePriorityScope(input: {
  readonly isOverview: boolean;
  readonly presentationMode?: string | null;
  readonly subjectKind: string | null;
  readonly collectionCategory?: string | null;
}): PriorityScopeKind {
  const category = input.collectionCategory ?? null;
  if (input.presentationMode === "collection") {
    if (category === "problem") return "problems";
    if (category === "decision") return "decisions";
  }
  if (input.subjectKind === "problem") return "problems";
  if (input.subjectKind === "decision") return "decisions";
  if (input.subjectKind === "risk") return "risks";
  return "workspace";
}

export function collectNexoraLivePrioritySources(): readonly ExecutivePriorityCandidateSource[] {
  const catalog = [
    ...NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES,
    ...NEXORA_MVP_STAGE_OBJECT_FIXTURES,
  ];
  const sources: ExecutivePriorityCandidateSource[] = [];
  for (const entry of catalog) {
    const eligible = resolvePriorityEligibleKind(entry.kind, entry.label, entry.id);
    if (eligible == null) continue;
    if (eligible === "opportunity") continue;
    sources.push({
      subjectId: entry.id,
      subjectLabel: entry.label,
      subjectKind: entry.kind,
      eligibleKind: eligible,
      attention: entry.attention,
      status: entry.status,
      recordedConstraintCount: countConstraintRelations(entry.id),
      downstreamCount: countDownstreamRelations(entry.id, entry.label),
      linkedDecision: eligible === "decision" || hasLinkedDecision(entry.id),
      evidenceConfidence: "medium",
      evidenceRefs: Object.freeze([
        {
          sourceKind: "relationship" as const,
          sourceId: `priority-candidate:${entry.id}`,
          subjectId: entry.id,
          factKey: eligible,
        },
      ]),
      provenanceRefs: Object.freeze([
        `mvp-priority-candidate:${entry.id}:${eligible}`,
      ]),
    });
  }
  return Object.freeze(sources);
}

export function projectNexoraLiveExecutivePriorityIntelligence(input: {
  readonly narrative: NexoraProfessionalAdvisorNarrative;
  readonly presentationMode?: string | null;
  readonly collectionCategory?: string | null;
}): ExecutivePriorityAssessment {
  const isCollection = input.presentationMode === "collection";
  const subjectId = isCollection ? null : input.narrative.currentSubjectId;
  const isOverview =
    isCollection || input.narrative.isOverview || subjectId == null;
  const scopeId = resolveLivePriorityScope({
    isOverview,
    presentationMode: input.presentationMode,
    subjectKind: isOverview ? null : input.narrative.currentSubjectKind,
    collectionCategory: input.collectionCategory,
  });
  const sources = collectNexoraLivePrioritySources().filter((source) => {
    if (scopeId === "problems") return source.eligibleKind === "problem";
    if (scopeId === "decisions") return source.eligibleKind === "decision";
    if (scopeId === "risks") {
      return source.eligibleKind === "risk" || source.eligibleKind === "problem";
    }
    return true;
  });
  return projectExecutivePriorityIntelligence({
    scopeId,
    sources,
    attentionSubjectId: input.narrative.attentionSubjectId,
  });
}

export function livePriorityOrderedIdsForCollection(
  category: string | null | undefined,
): readonly string[] | null {
  if (category !== "problem" && category !== "decision") return null;
  const scopeId = category === "problem" ? "problems" : "decisions";
  const sources = collectNexoraLivePrioritySources().filter((source) =>
    scopeId === "problems"
      ? source.eligibleKind === "problem"
      : source.eligibleKind === "decision",
  );
  const assessment = projectExecutivePriorityIntelligence({
    scopeId,
    sources,
    attentionSubjectId: null,
  });
  if (assessment.topPriority == null) return null;
  return Object.freeze(
    assessment.orderedCandidates
      .filter((entry) => entry.status === "ranked")
      .map((entry) => entry.subjectId),
  );
}

function isScenarioSubject(id: string | null): boolean {
  if (id == null) return false;
  return NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES.some(
    (entry) => entry.id === id && entry.kind === "scenario",
  );
}

function scenarioIdsLinkedTo(subjectId: string): readonly string[] {
  const ids = new Set<string>();
  const subjectIsDecision = NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES.some(
    (entry) => entry.id === subjectId && entry.kind === "decision",
  );
  for (const link of NEXORA_MVP_CONTEXT_LINK_FIXTURES) {
    if (link.objectId !== subjectId && link.contextId !== subjectId) continue;
    if (link.relation !== "explored-by") continue;
    if (link.objectId === subjectId && isScenarioSubject(link.contextId)) {
      ids.add(link.contextId);
    }
    if (link.contextId === subjectId && isScenarioSubject(link.objectId)) {
      ids.add(link.objectId);
    }
  }
  const fixture = getNexoraMVPSubjectPresentationFixture(subjectId);
  for (const relation of fixture?.relationships ?? []) {
    const allowSources = subjectIsDecision && relation.relation === "sources";
    if (relation.relation !== "explored-by" && !allowSources) continue;
    const otherId = idForLabel(relation.label);
    if (isScenarioSubject(otherId) && otherId) ids.add(otherId);
  }
  for (const action of fixture?.actions ?? []) {
    if (isScenarioSubject(action.targetSubjectId ?? null) && action.targetSubjectId) {
      ids.add(action.targetSubjectId);
    }
  }
  if (isScenarioSubject(subjectId)) ids.add(subjectId);
  return Object.freeze([...ids]);
}

function explorationAnchors(subjectId: string): readonly string[] {
  if (!isScenarioSubject(subjectId)) {
    return Object.freeze([subjectId]);
  }
  const anchors = new Set<string>();
  for (const link of NEXORA_MVP_CONTEXT_LINK_FIXTURES) {
    if (link.relation !== "explored-by") continue;
    if (link.contextId === subjectId) anchors.add(link.objectId);
    if (link.objectId === subjectId && !isScenarioSubject(link.contextId)) {
      anchors.add(link.contextId);
    }
  }
  const fixture = getNexoraMVPSubjectPresentationFixture(subjectId);
  for (const relation of fixture?.relationships ?? []) {
    if (relation.relation !== "explored-by") continue;
    const otherId = idForLabel(relation.label);
    if (otherId && !isScenarioSubject(otherId)) anchors.add(otherId);
  }
  const problem = NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES.find(
    (entry) =>
      entry.kind === "problem" &&
      (getNexoraMVPSubjectPresentationFixture(entry.id)?.relationships ?? []).some(
        (relation) =>
          relation.relation === "explored-by" &&
          idForLabel(relation.label) === subjectId,
      ),
  );
  if (problem) anchors.add(problem.id);
  return Object.freeze([...anchors]);
}

export function collectNexoraLiveComparableScenarioIds(
  subjectId: string | null,
): readonly string[] {
  if (subjectId == null) return Object.freeze([]);
  const anchors = explorationAnchors(subjectId);
  const comparable = new Set<string>();
  for (const anchor of anchors) {
    for (const scenarioId of scenarioIdsLinkedTo(anchor)) comparable.add(scenarioId);
  }
  for (const scenarioId of scenarioIdsLinkedTo(subjectId)) comparable.add(scenarioId);
  return Object.freeze([...comparable]);
}

function resolveSharedTradeoffScope(
  scenarioIds: readonly string[],
  subjectId: string | null,
): string {
  const problem = NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES.find((entry) => {
    if (entry.kind !== "problem") return false;
    const fixture = getNexoraMVPSubjectPresentationFixture(entry.id);
    const related = (fixture?.relationships ?? []).some(
      (relation) =>
        relation.relation === "explored-by" &&
        scenarioIds.includes(idForLabel(relation.label) ?? ""),
    );
    const acted = (fixture?.actions ?? []).some(
      (action) =>
        action.targetSubjectId != null &&
        scenarioIds.includes(action.targetSubjectId),
    );
    return related || acted;
  });
  if (problem) return problem.id;
  if (subjectId && !isScenarioSubject(subjectId)) return subjectId;
  const anchors = scenarioIds.flatMap((id) => [...explorationAnchors(id)]);
  return anchors[0] ?? subjectId ?? scenarioIds[0] ?? "unscoped";
}

export function collectNexoraLiveTradeoffSources(
  subjectId: string | null,
): readonly ExecutiveTradeoffOptionSource[] {
  const optionIds = collectNexoraLiveComparableScenarioIds(subjectId);
  const scopeId = resolveSharedTradeoffScope(optionIds, subjectId);
  return Object.freeze(
    optionIds.map((optionId) => {
      const fixture = getNexoraMVPSubjectPresentationFixture(optionId);
      return Object.freeze({
        optionId,
        title: labelFor(optionId),
        scopeId,
        sourceSummary: fixture?.summary ?? `Recorded evaluated option: ${labelFor(optionId)}.`,
        kind: "scenario" as const,
      });
    }),
  );
}

export function projectNexoraLiveExecutiveTradeoffIntelligence(input: {
  readonly narrative: NexoraProfessionalAdvisorNarrative;
  readonly presentationMode?: string | null;
}): ExecutiveTradeoffAssessment {
  const isCollection = input.presentationMode === "collection";
  const overview = isCollection || input.narrative.isOverview;
  const subjectId = overview ? null : input.narrative.currentSubjectId;
  return projectExecutiveTradeoffIntelligence({
    subjectId,
    sources: collectNexoraLiveTradeoffSources(subjectId),
    overview,
    alignedOptionId: null,
    preferenceAuthority: "none",
    recommendationAlignment: input.narrative.recommendationRationale,
  });
}

function kindFor(id: string | null): string | null {
  if (id == null) return null;
  return (
    NEXORA_MVP_CONTEXT_SUBJECT_FIXTURES.find((entry) => entry.id === id)?.kind ??
    NEXORA_MVP_STAGE_OBJECT_FIXTURES.find((entry) => entry.id === id)?.kind ??
    null
  );
}

function linkedSubjectOfKind(subjectId: string, kind: string): string | null {
  if (kindFor(subjectId) === kind) return subjectId;
  const fixture = getNexoraMVPSubjectPresentationFixture(subjectId);
  for (const relation of fixture?.relationships ?? []) {
    const otherId = idForLabel(relation.label);
    if (otherId && kindFor(otherId) === kind) return otherId;
  }
  for (const action of fixture?.actions ?? []) {
    if (action.targetSubjectId && kindFor(action.targetSubjectId) === kind) {
      return action.targetSubjectId;
    }
  }
  for (const link of NEXORA_MVP_CONTEXT_LINK_FIXTURES) {
    const other =
      link.objectId === subjectId
        ? link.contextId
        : link.contextId === subjectId
          ? link.objectId
          : null;
    if (other && kindFor(other) === kind) return other;
  }
  return null;
}

export function collectNexoraLiveExpectedOutcome(
  subjectId: string,
  subjectKind: string | null,
): ExecutiveOutcomeExpectation | null {
  return liveExpectedForSubject(subjectId, subjectKind);
}

export function resolveNexoraLiveLinkedSubjectOfKind(
  subjectId: string,
  kind: string,
): string | null {
  return linkedSubjectOfKind(subjectId, kind);
}

function liveExpectedForSubject(
  subjectId: string,
  subjectKind: string | null,
): ExecutiveOutcomeExpectation | null {
  const scenarioId =
    subjectKind === "scenario"
      ? subjectId
      : (scenarioIdsLinkedTo(subjectId)[0] ??
        linkedSubjectOfKind(subjectId, "scenario"));
  if (scenarioId == null) return null;
  const fixture = getNexoraMVPSubjectPresentationFixture(scenarioId);
  if (!fixture?.summary) return null;
  const dimension = scenarioId.includes("capacity")
    ? "capacity-gap"
    : scenarioId.includes("demand")
      ? "volume"
      : "margin";
  const source: ExecutiveOutcomeExpectation["source"] =
    subjectKind === "decision"
      ? "decision"
      : subjectKind === "execution"
        ? "execution-target"
        : "scenario";
  return Object.freeze({
    expectationId: `expected:${scenarioId}`,
    statement: fixture.summary,
    claimKind: "PREDICTION",
    dimension,
    source,
    numericTarget: null,
    comparator: null,
    unit: null,
    expectedDirection: null,
    capturedAt: null,
    evidenceRefs: Object.freeze([
      {
        sourceKind: "scenario" as const,
        sourceId: scenarioId,
        subjectId,
        factKey: "expected-effect",
      },
    ]),
    provenanceRefs: Object.freeze([`mvp-scenario-expected:${scenarioId}`]),
  });
}

export function projectNexoraLiveOutcomeIntelligence(input: {
  readonly narrative: NexoraProfessionalAdvisorNarrative;
  readonly presentationMode?: string | null;
  readonly currentKpi?: {
    readonly statement: string;
    readonly dimension: string | null;
    readonly numericValue: number | null;
  } | null;
}): ExecutiveOutcomeAssessment {
  const isCollection = input.presentationMode === "collection";
  const subjectId = isCollection ? null : input.narrative.currentSubjectId;
  const subjectKind = isCollection ? null : input.narrative.currentSubjectKind;
  const expected =
    subjectId != null ? liveExpectedForSubject(subjectId, subjectKind) : null;
  const capture = projectOutcomeObservationCapture({
    subjectId,
    expected,
    currentKpi: input.currentKpi ?? null,
  });
  return projectLiveOutcomeIntelligence({
    subjectId,
    decisionId: subjectId ? linkedSubjectOfKind(subjectId, "decision") : null,
    executionId: subjectId ? linkedSubjectOfKind(subjectId, "execution") : null,
    expected,
    capture,
    actuals: [],
    baseline: capture.baseline,
    window: capture.evaluatorWindow,
    currentReality: input.currentKpi
      ? {
          statement: input.currentKpi.statement,
          dimension: input.currentKpi.dimension,
          numericValue: input.currentKpi.numericValue,
        }
      : null,
    executionProgressOnly: subjectKind === "execution",
    recommendationPresent: input.narrative.recommendation != null,
    decisionCommitted: false,
    recentChangePresent: input.narrative.recentChange != null,
  });
}
