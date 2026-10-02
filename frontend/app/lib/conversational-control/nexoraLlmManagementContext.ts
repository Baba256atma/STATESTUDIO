/**
 * LLM-MVP:2 — bounded, provider-neutral, read-only management context.
 *
 * Projects existing Nexora owners into the CC:5 LLM participant request.
 * Does not own conversation memory, referent, NMI, Data Reality, Advisor,
 * Scenario, Decision, Execution, Outcome, or Learning.
 *
 * NMI projection reused: composeNmiAdvisorContext (NMI:7).
 * Data Reality projection reused: catalog primaryValue stamped by the
 * existing Data Reality stage binding, plus projectAdvisorDataContext
 * (DATA-ADV:1) for CSV-derived field evidence. Raw CSV rows are not copied.
 */

import type { ConversationContinuitySnapshot } from "@/app/lib/manager-object/contextualManagerMeaning.ts";
import {
  projectAdvisorDataContext,
  type AdvisorDataContext,
  type AdvisorDataField,
} from "@/app/lib/manager-object/nexoraAdvisorDataContext.ts";
import { composeNmiAdvisorContext } from "@/app/lib/nmi/nmiAdvisorCompose.ts";
import type { NmiAdvisorBundle } from "@/app/lib/nmi/nmiAdvisorContract.ts";
import { nmiAdvisorIdentity } from "@/app/lib/nmi/nmiAdvisorIdentity.ts";

export const nexoraLlmManagementContextIdentity =
  "LLM-MVP:2/ManagementContextProjection" as const;

export const NEXORA_LLM_CONTEXT_OWNERS = Object.freeze({
  subject: "cc-resolved-subject",
  referent: "nca-conversation-reference",
  nmi: "composeNmiAdvisorContext",
  dataRealityCatalog: "NexoraMVPObjectInteractionCatalog.primaryValue",
  dataRealityCsv: "projectAdvisorDataContext",
  conversation: "NEX-MVP-FINAL:6.2/ConversationContextContinuity",
  provenance: "nmi-interpretation-provenance",
  epistemic:
    "nca-knowledge-evidence-state+nmi-relation-epistemic-status+nmi-node-knownStatus+advisor-data-field-confidence",
  scenario: "NexoraExecutiveScenarioSession.activeScenarioId",
  decision: "NexoraExecutiveDecisionSession",
});

export const NEXORA_LLM_CONTEXT_BOUNDARY = Object.freeze({
  identity: nexoraLlmManagementContextIdentity,
  ownsMemory: false as const,
  ownsReferent: false as const,
  ownsNmi: false as const,
  ownsDataReality: false as const,
  ownsAdvisor: false as const,
  ownsScenario: false as const,
  ownsDecision: false as const,
  ownsExecution: false as const,
  mutatesCanonicalState: false as const,
  providerNeutral: true as const,
  usesLiveProvider: false as const,
  dumpsFullState: false as const,
});

/** Deterministic payload bounds. Not provider token counts or cost limits. */
export const NEXORA_LLM_CONTEXT_BOUNDS = Object.freeze({
  managementRefs: 6,
  dataRealityRefs: 4,
  evidenceRefs: 4,
  conversationFrames: 3,
  scenarioRefs: 1,
  decisionRefs: 1,
  utteranceChars: 240,
  valueChars: 160,
  idChars: 128,
});

export type NexoraLlmContextRef = Readonly<{
  readonly id: string;
  readonly kind: string;
  readonly label: string | null;
  readonly value: string | null;
  readonly provenanceId: string | null;
  readonly epistemic: string | null;
}>;

export type NexoraLlmConversationFrameRef = Readonly<{
  readonly subjectId: string;
  readonly subjectKind: string;
  readonly operation: string;
  readonly turnIndex: number;
}>;

export type NexoraLlmManagementContext = Readonly<{
  readonly identity: typeof nexoraLlmManagementContextIdentity;
  readonly subject: Readonly<{
    readonly canonicalId: string | null;
    readonly label: string | null;
    readonly kind: string | null;
    /** NCA knowledgeState.evidenceState when the turn exposes one. Otherwise null. */
    readonly epistemic: string | null;
  }>;
  readonly referent: Readonly<{
    readonly canonicalId: string | null;
    readonly provenance: string | null;
  }>;
  readonly management: Readonly<{
    readonly projection: typeof nmiAdvisorIdentity | null;
    readonly refs: readonly NexoraLlmContextRef[];
  }>;
  readonly dataReality: Readonly<{
    readonly projections: readonly string[];
    readonly refs: readonly NexoraLlmContextRef[];
  }>;
  readonly conversation: Readonly<{
    readonly projection: typeof NEXORA_LLM_CONTEXT_OWNERS.conversation;
    readonly currentUtterance: string;
    readonly previousUtterance: string | null;
    readonly frames: readonly NexoraLlmConversationFrameRef[];
  }>;
  readonly evidence: Readonly<{
    readonly refs: readonly NexoraLlmContextRef[];
  }>;
  readonly scenario: Readonly<{
    readonly refs: readonly NexoraLlmContextRef[];
  }>;
  readonly decision: Readonly<{
    readonly refs: readonly NexoraLlmContextRef[];
  }>;
}>;

export type NexoraLlmCatalogContextSource = Readonly<{
  readonly objects: readonly Readonly<{
    readonly id: string;
    readonly label: string;
    readonly primaryValue?: string;
    readonly primaryMetricLabel?: string;
  }>[];
}>;

export type NexoraLlmScenarioContextSource = Readonly<{
  readonly scenarioId: string;
  readonly name: string;
  readonly status: string | null;
  readonly sourceSubjectId: string | null;
  readonly provenanceId: string | null;
}>;

export type NexoraLlmDecisionContextSource = Readonly<{
  readonly decisionId: string;
  readonly title: string | null;
  readonly status: string | null;
  readonly provenanceId: string | null;
}>;

export type NexoraLlmManagementContextInput = Readonly<{
  readonly resolvedSubjectId: string | null;
  readonly subjectLabel: string | null;
  readonly subjectKind: string | null;
  readonly subjectEpistemic: string | null;
  readonly referentId: string | null;
  readonly referentProvenance: string | null;
  readonly utterance: string;
  readonly previousUtterance?: string | null;
  readonly continuity?: ConversationContinuitySnapshot | null;
  readonly nmiBundle?: NmiAdvisorBundle | null;
  readonly catalog?: NexoraLlmCatalogContextSource | null;
  readonly comparisonCandidateIds?: readonly string[];
  readonly workspaceId?: string | null;
  readonly advisorData?: AdvisorDataContext | null;
  readonly advisorDataDialogue?: Readonly<{
    readonly sourceContextId: string | null;
    readonly fieldColumn: string | null;
  }> | null;
  readonly scenario?: NexoraLlmScenarioContextSource | null;
  readonly decision?: NexoraLlmDecisionContextSource | null;
}>;

type ScenarioReadSession = Readonly<{
  readonly activeScenarioId: string | null;
  readonly scenariosById: Readonly<
    Record<
      string,
      Readonly<{
        readonly scenarioId: string;
        readonly name: string;
        readonly status: string;
        readonly sourceSubjectId?: string | null;
        readonly subjectIds: readonly string[];
      }>
    >
  >;
}>;

type DecisionEvidenceRead = Readonly<{
  readonly sourceId: string;
  readonly subjectId?: string;
}>;

type DecisionReadSession = Readonly<{
  readonly pendingConfirmation: Readonly<{
    readonly candidateId: string;
    readonly status: string;
    readonly scenarioId?: string | null;
  }> | null;
  readonly lastReferencedDecisionId: string | null;
  readonly provenanceByDecisionId: Readonly<
    Record<
      string,
      Readonly<{
        readonly scenarioId?: string;
        readonly evidenceRefs: readonly DecisionEvidenceRead[];
      }>
    >
  >;
}>;

type CommittedDecisionRead = Readonly<{
  readonly decisionId: string;
  readonly title: string;
  readonly status: string;
  readonly scenarioId?: string;
  readonly subjectIds: readonly string[];
  readonly evidenceRefs: readonly DecisionEvidenceRead[];
}>;

function boundText(value: string | null | undefined, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const bounded = trimmed.length <= max ? trimmed : trimmed.slice(0, max);
  return redactCredential(bounded);
}

function boundId(value: string | null | undefined): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.length <= NEXORA_LLM_CONTEXT_BOUNDS.idChars
    ? trimmed
    : trimmed.slice(0, NEXORA_LLM_CONTEXT_BOUNDS.idChars);
}

function redactCredential(value: string): string | null {
  if (/(?:api[_-]?key|bearer)\s*[:=]\s*\S+|sk-[a-zA-Z0-9]{8,}/i.test(value)) {
    return null;
  }
  return value;
}

function take<T>(items: readonly T[], max: number): readonly T[] {
  return Object.freeze(items.slice(0, Math.max(0, max)));
}

function freezeRef(ref: NexoraLlmContextRef): NexoraLlmContextRef {
  return Object.freeze({
    id: ref.id,
    kind: ref.kind,
    label: ref.label,
    value: ref.value,
    provenanceId: ref.provenanceId,
    epistemic: ref.epistemic,
  });
}

function relevantIdsOf(input: NexoraLlmManagementContextInput): readonly string[] {
  const ids: string[] = [];
  const push = (value: string | null | undefined) => {
    const id = boundId(value);
    if (id && !ids.includes(id)) ids.push(id);
  };
  push(input.resolvedSubjectId);
  push(input.referentId);
  for (const candidateId of input.comparisonCandidateIds ?? []) push(candidateId);
  return Object.freeze(ids);
}

function projectManagement(
  input: NexoraLlmManagementContextInput,
): NexoraLlmManagementContext["management"] & {
  readonly evidence: readonly NexoraLlmContextRef[];
} {
  const bundle = input.nmiBundle ?? null;
  const subjectId = boundId(input.resolvedSubjectId);
  if (!bundle || !subjectId) {
    return Object.freeze({
      projection: null,
      refs: Object.freeze([]),
      evidence: Object.freeze([]),
    });
  }
  const context = composeNmiAdvisorContext({
    resolvedCanonicalId: subjectId,
    bundle,
  });
  const activeId = boundId(context.activeCanonicalId);
  if (!activeId) {
    return Object.freeze({
      projection: nmiAdvisorIdentity,
      refs: Object.freeze([]),
      evidence: Object.freeze([]),
    });
  }
  const node = bundle.map.nodes.find((item) => item.nodeId === activeId) ?? null;
  const refs: NexoraLlmContextRef[] = [
    freezeRef({
      id: activeId,
      kind: node?.kind ?? context.selectedNodeKind ?? "management-subject",
      label: boundText(node?.title ?? context.activeTitle, NEXORA_LLM_CONTEXT_BOUNDS.valueChars),
      value: null,
      provenanceId: boundId(node?.provenance[0] ?? null),
      epistemic: node?.knownStatus ?? null,
    }),
  ];
  const evidence: NexoraLlmContextRef[] = [];
  const seenEvidence = new Set<string>();
  for (const interpretation of context.interpretations) {
    if (interpretation.sourceId !== activeId && interpretation.targetId !== activeId) continue;
    const id = boundId(interpretation.relationshipId);
    if (!id) continue;
    refs.push(
      freezeRef({
        id,
        kind: interpretation.kind,
        label: boundText(interpretation.managementMeaning, NEXORA_LLM_CONTEXT_BOUNDS.valueChars),
        value: boundText(
          `${interpretation.sourceId} ${interpretation.kind} ${interpretation.targetId}`,
          NEXORA_LLM_CONTEXT_BOUNDS.valueChars,
        ),
        provenanceId: boundId(interpretation.provenance[0] ?? null),
        epistemic: interpretation.epistemicStatus,
      }),
    );
    const provenanceId = boundId(interpretation.provenance[0] ?? null);
    for (const evidenceId of interpretation.evidenceRefs) {
      const boundedEvidenceId = boundId(evidenceId);
      if (!boundedEvidenceId || seenEvidence.has(boundedEvidenceId)) continue;
      seenEvidence.add(boundedEvidenceId);
      evidence.push(
        freezeRef({
          id: boundedEvidenceId,
          kind: "evidence",
          label: null,
          value: null,
          provenanceId,
          epistemic: interpretation.epistemicStatus,
        }),
      );
    }
  }
  return Object.freeze({
    projection: nmiAdvisorIdentity,
    refs: take(refs, NEXORA_LLM_CONTEXT_BOUNDS.managementRefs),
    evidence: take(evidence, NEXORA_LLM_CONTEXT_BOUNDS.evidenceRefs),
  });
}

function catalogDataRefs(
  catalog: NexoraLlmCatalogContextSource | null | undefined,
  relevantIds: readonly string[],
): readonly NexoraLlmContextRef[] {
  if (!catalog) return Object.freeze([]);
  const refs: NexoraLlmContextRef[] = [];
  for (const id of relevantIds) {
    const object = catalog.objects.find((item) => item.id === id);
    const value = boundText(object?.primaryValue, NEXORA_LLM_CONTEXT_BOUNDS.valueChars);
    if (!object || !value) continue;
    refs.push(
      freezeRef({
        id: object.id,
        kind: "data-reality-kpi",
        label: boundText(object.primaryMetricLabel ?? object.label, NEXORA_LLM_CONTEXT_BOUNDS.valueChars),
        value,
        provenanceId: boundId(object.id),
        epistemic: null,
      }),
    );
  }
  return Object.freeze(refs);
}

function fieldMatchesDialogue(
  field: AdvisorDataField,
  dialogue: NexoraLlmManagementContextInput["advisorDataDialogue"],
  sourceMatchesDialogue: boolean,
  labelMatch: boolean,
): boolean {
  if (field.ignored) return false;
  if (labelMatch) return true;
  if (!sourceMatchesDialogue) return false;
  const column = dialogue?.fieldColumn?.trim();
  return !column || field.column === column;
}

function advisorDataRefs(
  data: AdvisorDataContext | null,
  labels: ReadonlySet<string>,
  dialogue: NexoraLlmManagementContextInput["advisorDataDialogue"],
): readonly NexoraLlmContextRef[] {
  if (!data) return Object.freeze([]);
  const refs: NexoraLlmContextRef[] = [];
  for (const source of data.sources) {
    const labelMatch = source.relatedObjectLabels.some((label) =>
      labels.has(label.trim().toLowerCase()),
    );
    const sourceMatchesDialogue =
      Boolean(dialogue?.sourceContextId) && dialogue?.sourceContextId === source.sourceContextId;
    if (!labelMatch && !sourceMatchesDialogue) continue;
    for (const field of source.fields) {
      if (!fieldMatchesDialogue(field, dialogue, sourceMatchesDialogue, labelMatch)) continue;
      const id = boundId(field.fieldId ?? `${source.sourceContextId}:${field.column}`);
      if (!id) continue;
      const meaning = field.confirmedMeaning ?? field.proposedMeaning;
      const average =
        field.observation.numeric &&
        field.observation.average != null &&
        Number.isFinite(field.observation.average)
          ? `average ${field.observation.average}`
          : null;
      refs.push(
        freezeRef({
          id,
          kind: "data-reality-field",
          label: boundText(field.column, NEXORA_LLM_CONTEXT_BOUNDS.valueChars),
          value: boundText([meaning, average].filter(Boolean).join("; "), NEXORA_LLM_CONTEXT_BOUNDS.valueChars),
          provenanceId: boundId(source.sourceContextId),
          epistemic: field.confidence,
        }),
      );
    }
  }
  return Object.freeze(refs);
}

function projectDataReality(
  input: NexoraLlmManagementContextInput,
  relevantIds: readonly string[],
): NexoraLlmManagementContext["dataReality"] {
  const catalogRefs = catalogDataRefs(input.catalog, relevantIds);
  const labels = new Set<string>();
  const subjectLabel = boundText(input.subjectLabel, NEXORA_LLM_CONTEXT_BOUNDS.valueChars);
  if (subjectLabel) labels.add(subjectLabel.toLowerCase());
  for (const id of relevantIds) {
    const object = input.catalog?.objects.find((item) => item.id === id);
    if (object?.label) labels.add(object.label.trim().toLowerCase());
  }
  let advisorData = input.advisorData !== undefined ? input.advisorData : null;
  if (input.advisorData === undefined && input.workspaceId) {
    try {
      advisorData = projectAdvisorDataContext(input.workspaceId);
    } catch {
      advisorData = null;
    }
  }
  const fieldRefs = advisorDataRefs(advisorData, labels, input.advisorDataDialogue ?? null);
  const projections: string[] = [];
  if (catalogRefs.length > 0) projections.push(NEXORA_LLM_CONTEXT_OWNERS.dataRealityCatalog);
  if (fieldRefs.length > 0) projections.push(NEXORA_LLM_CONTEXT_OWNERS.dataRealityCsv);
  return Object.freeze({
    projections: Object.freeze(projections),
    refs: take([...catalogRefs, ...fieldRefs], NEXORA_LLM_CONTEXT_BOUNDS.dataRealityRefs),
  });
}

function projectConversation(
  input: NexoraLlmManagementContextInput,
): NexoraLlmManagementContext["conversation"] {
  const frames = (input.continuity?.thread ?? [])
    .slice(-NEXORA_LLM_CONTEXT_BOUNDS.conversationFrames)
    .map((frame) =>
      Object.freeze({
        subjectId: boundId(frame.subjectId) ?? "",
        subjectKind: frame.subjectKind,
        operation: frame.operation,
        turnIndex: frame.turnIndex,
      }),
    )
    .filter((frame) => frame.subjectId.length > 0);
  return Object.freeze({
    projection: NEXORA_LLM_CONTEXT_OWNERS.conversation,
    currentUtterance:
      boundText(input.utterance, NEXORA_LLM_CONTEXT_BOUNDS.utteranceChars) ?? "",
    previousUtterance: boundText(
      input.previousUtterance,
      NEXORA_LLM_CONTEXT_BOUNDS.utteranceChars,
    ),
    frames: Object.freeze(frames),
  });
}

function projectScenario(
  scenario: NexoraLlmScenarioContextSource | null | undefined,
): NexoraLlmManagementContext["scenario"] {
  const id = boundId(scenario?.scenarioId);
  if (!scenario || !id) return Object.freeze({ refs: Object.freeze([]) });
  return Object.freeze({
    refs: take(
      [
        freezeRef({
          id,
          kind: "scenario",
          label: boundText(scenario.name, NEXORA_LLM_CONTEXT_BOUNDS.valueChars),
          value: scenario.status,
          provenanceId: boundId(scenario.provenanceId),
          epistemic: null,
        }),
      ],
      NEXORA_LLM_CONTEXT_BOUNDS.scenarioRefs,
    ),
  });
}

function projectDecision(
  decision: NexoraLlmDecisionContextSource | null | undefined,
): NexoraLlmManagementContext["decision"] {
  const id = boundId(decision?.decisionId);
  if (!decision || !id) return Object.freeze({ refs: Object.freeze([]) });
  return Object.freeze({
    refs: take(
      [
        freezeRef({
          id,
          kind: "decision",
          label: boundText(decision.title, NEXORA_LLM_CONTEXT_BOUNDS.valueChars),
          value: decision.status,
          provenanceId: boundId(decision.provenanceId),
          epistemic: null,
        }),
      ],
      NEXORA_LLM_CONTEXT_BOUNDS.decisionRefs,
    ),
  });
}

export function subjectFieldsForResolvedId(
  resolvedId: string | null,
  candidates: readonly (Readonly<{
    readonly id?: string | null;
    readonly label?: string | null;
    readonly kind?: string | null;
  }> | null | undefined)[],
): Readonly<{ readonly label: string | null; readonly kind: string | null }> {
  const id = boundId(resolvedId);
  if (!id) return Object.freeze({ label: null, kind: null });
  for (const candidate of candidates) {
    if (!candidate || boundId(candidate.id) !== id) continue;
    return Object.freeze({
      label: boundText(candidate.label, NEXORA_LLM_CONTEXT_BOUNDS.valueChars),
      kind: boundText(candidate.kind, NEXORA_LLM_CONTEXT_BOUNDS.valueChars),
    });
  }
  return Object.freeze({ label: null, kind: null });
}

export function emptyNexoraLlmManagementContext(
  utterance = "",
): NexoraLlmManagementContext {
  return projectNexoraLlmManagementContext({
    resolvedSubjectId: null,
    subjectLabel: null,
    subjectKind: null,
    subjectEpistemic: null,
    referentId: null,
    referentProvenance: null,
    utterance,
    advisorData: null,
  });
}

export function projectNexoraLlmManagementContext(
  input: NexoraLlmManagementContextInput,
): NexoraLlmManagementContext {
  const relevantIds = relevantIdsOf(input);
  const management = projectManagement(input);
  return Object.freeze({
    identity: nexoraLlmManagementContextIdentity,
    subject: Object.freeze({
      canonicalId: boundId(input.resolvedSubjectId),
      label: boundText(input.subjectLabel, NEXORA_LLM_CONTEXT_BOUNDS.valueChars),
      kind: boundText(input.subjectKind, NEXORA_LLM_CONTEXT_BOUNDS.valueChars),
      epistemic: boundText(input.subjectEpistemic, NEXORA_LLM_CONTEXT_BOUNDS.valueChars),
    }),
    referent: Object.freeze({
      canonicalId: boundId(input.referentId),
      provenance: boundId(input.referentProvenance),
    }),
    management: Object.freeze({
      projection: management.projection,
      refs: management.refs,
    }),
    dataReality: projectDataReality(input, relevantIds),
    conversation: projectConversation(input),
    evidence: Object.freeze({ refs: management.evidence }),
    scenario: projectScenario(input.scenario),
    decision: projectDecision(input.decision),
  });
}

/**
 * Read the active Scenario already on the CC session.
 * Does not define, evaluate, or select a Scenario.
 */
export function readActiveScenarioContext(
  session: ScenarioReadSession | null,
  subjectId: string | null,
): NexoraLlmScenarioContextSource | null {
  if (!session?.activeScenarioId) return null;
  const scenario = session.scenariosById[session.activeScenarioId] ?? null;
  if (!scenario) return null;
  if (
    subjectId &&
    scenario.sourceSubjectId !== subjectId &&
    !scenario.subjectIds.includes(subjectId)
  ) {
    return null;
  }
  return Object.freeze({
    scenarioId: scenario.scenarioId,
    name: scenario.name,
    status: scenario.status,
    sourceSubjectId: scenario.sourceSubjectId ?? null,
    provenanceId: scenario.sourceSubjectId ?? null,
  });
}

/**
 * Read the current Decision pointer already on the CC session.
 * Does not create, confirm, or commit a Decision.
 */
export function readDecisionContext(input: {
  readonly session: DecisionReadSession | null;
  readonly committed: CommittedDecisionRead | null;
  readonly subjectId: string | null;
}): NexoraLlmDecisionContextSource | null {
  const committed = input.committed;
  if (
    committed &&
    (!input.subjectId || committed.subjectIds.includes(input.subjectId))
  ) {
    return Object.freeze({
      decisionId: committed.decisionId,
      title: committed.title,
      status: committed.status,
      provenanceId: committed.evidenceRefs[0]?.sourceId ?? committed.scenarioId ?? null,
    });
  }
  const pending = input.session?.pendingConfirmation ?? null;
  if (pending?.status === "pending") {
    return Object.freeze({
      decisionId: pending.candidateId,
      title: null,
      status: pending.status,
      provenanceId: pending.scenarioId ?? null,
    });
  }
  const referencedId = input.session?.lastReferencedDecisionId ?? null;
  if (!referencedId || !input.session) return null;
  const provenance = input.session.provenanceByDecisionId[referencedId] ?? null;
  const evidenceSubject =
    provenance?.evidenceRefs.find((item) => item.subjectId)?.subjectId ?? null;
  if (input.subjectId && evidenceSubject && evidenceSubject !== input.subjectId) return null;
  if (input.subjectId && !evidenceSubject) return null;
  return Object.freeze({
    decisionId: referencedId,
    title: null,
    status: null,
    provenanceId: provenance?.scenarioId ?? provenance?.evidenceRefs[0]?.sourceId ?? null,
  });
}
