/**
 * BCA:8 — certification orchestration over existing DATA-ADV and BCA:1–7.
 * Not a context engine, Advisor, Director, or Decision authority.
 */
import {
  applyCsvSemanticClarification,
  interpretCsvSemantics,
  nextCsvSemanticClarification,
  type CsvMappingReview,
} from "../data-reality/csvSemanticUnderstanding.ts";
import { parseCsvDeterministically, suggestCsvColumnMappings, type CsvVerticalSliceInput } from "../data-reality/csvRealDataVerticalSlice.ts";
import { findBusinessProjectConceptDefinition } from "./businessProjectConceptRegistry.ts";
import type { EstablishedSemanticMeaning } from "./businessProjectConceptContract.ts";
import type { ManagerRoleFamily } from "./managerDecisionContextContract.ts";
import { resolveBusinessProjectConcept } from "./resolveBusinessProjectConcept.ts";
import { resolveBusinessProjectContext } from "./resolveBusinessProjectContext.ts";
import { resolveBusinessProjectContextClarification } from "./resolveBusinessProjectContextClarification.ts";
import { resolveBusinessProjectPresentationContext } from "./resolveBusinessProjectPresentationContext.ts";
import { resolveBusinessProjectProcessContext } from "./resolveBusinessProjectProcessContext.ts";
import { resolveBusinessProjectRelationships } from "./resolveBusinessProjectRelationship.ts";
import { resolveManagerDecisionContext } from "./resolveManagerDecisionContext.ts";
import type { BusinessProjectContext, BusinessProjectKnownConcept, BusinessProjectSourceRef } from "./businessProjectContextContract.ts";
import type { BusinessProjectConcept } from "./businessProjectConceptContract.ts";
import type { BusinessProjectPresentationContext } from "./businessProjectPresentationContract.ts";
import type { ContextClarificationNeed } from "./businessProjectContextClarificationContract.ts";
import type { ManagerDecisionContext } from "./managerDecisionContextContract.ts";

export const realManagerRealDataCertificationIdentity = "BCA:8/RealManagerRealDataCertification" as const;

export const BCA8_CERTIFICATION_BOUNDARY = Object.freeze({
  ownsContextResolver: false as const,
  ownsAdvisor: false as const,
  ownsDirector: false as const,
  ownsTheatre: false as const,
  ownsDecision: false as const,
  ownsExecution: false as const,
  ownsOutcome: false as const,
  ownsLearning: false as const,
  recommendationWriter: "none" as const,
  confirmationWriter: "applyCsvSemanticClarification" as const,
  objectsCreatedByBca: 0 as const,
});

export type CertificationJourneyStep = Readonly<{
  managerTurn: string;
  authority: string;
  status: "supported" | "handoff" | "not-owned-by-bca";
}>;

export type TruthLedgerRow = Readonly<{
  statement: string;
  authority: string;
  status: "confirmed" | "contextual" | "qualified" | "presentation-only" | "canonical" | "NOT ESTABLISHED";
}>;

export type RealManagerCertificationProjection = Readonly<{
  identity: typeof realManagerRealDataCertificationIdentity;
  review: CsvMappingReview;
  sourceContextId: string;
  context: BusinessProjectContext;
  concepts: readonly BusinessProjectConcept[];
  manager: ManagerDecisionContext;
  clarification: ContextClarificationNeed;
  presentation: BusinessProjectPresentationContext;
  objectsCreated: readonly string[];
  stageObjectsAdded: readonly string[];
  focusMutatedTo: null;
  recommendationWriter: "none";
  decisionCommitted: false;
  executionStarted: false;
  outcomeCausalClaim: false;
  learningWritten: false;
  journey: readonly CertificationJourneyStep[];
  truthLedger: readonly TruthLedgerRow[];
  negativeInferences: readonly string[];
}>;

function deepFreeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nested of Object.values(value as Record<string, unknown>)) deepFreeze(nested);
  }
  return value;
}

export function interpretCertificationCsv(fileName: string, csvText: string, previous?: CsvMappingReview | null, importId = `bca8:${fileName}`): CsvMappingReview {
  const parse = parseCsvDeterministically(csvText);
  const input: CsvVerticalSliceInput = Object.freeze({
    workspaceId: "overview",
    fileName,
    fileSize: csvText.length,
    csvText,
    importId,
    importedAt: "2026-09-02T12:00:00.000Z",
    observedAt: "2026-09-02T12:00:00.000Z",
  });
  return interpretCsvSemantics({
    input,
    parse,
    structural: suggestCsvColumnMappings(parse.columns, input.importId),
    previousMapping: previous,
  });
}

function sourceRef(fileName: string, column: string, sourceContextId: string): BusinessProjectSourceRef {
  return Object.freeze({ authorityId: "RDI:2/CSV+DATA-ADV:2", sourceId: `${fileName}:${column}`, sourceContextId });
}

export function establishedFromReview(review: CsvMappingReview): readonly EstablishedSemanticMeaning[] {
  return review.mappings.flatMap((mapping) => {
    const semantic = mapping.semantic;
    if (!semantic) return [];
    const meaning = semantic.confirmedMeaning
      ?? (semantic.state === "UNDERSTOOD" || semantic.state === "LIKELY" ? semantic.proposedMeaning : null);
    if (!meaning) return [];
    if (semantic.state === "AMBIGUOUS" && semantic.confirmationSource === "none") return [];
    if (semantic.state === "LIKELY" && !findBusinessProjectConceptDefinition(meaning)) return [];
    return [Object.freeze({
      semanticId: semantic.fieldId,
      meaning,
      state: semantic.confirmationSource === "manager" ? "MANAGER_CONFIRMED" as const : "AUTHORITATIVE" as const,
      sourceRefs: Object.freeze([sourceRef(review.mappingId, mapping.sourceColumn, semantic.sourceContextId)]),
    })];
  });
}

function knownConcepts(semantics: readonly EstablishedSemanticMeaning[]): readonly BusinessProjectKnownConcept[] {
  return semantics.filter((item) => item.meaning).map((item) => Object.freeze({
    conceptId: item.semanticId,
    label: item.meaning!,
    confirmationState: item.state === "MANAGER_CONFIRMED" ? "MANAGER_CONFIRMED" as const : "AUTHORITATIVE" as const,
    sourceRef: item.sourceRefs[0]!,
  }));
}

export function certifyRealManagerRealData(input: Readonly<{
  fileName: string;
  csvText: string;
  review?: CsvMappingReview;
  organizationLabel?: string | null;
  projectId?: string | null;
  projectLabel?: string | null;
  roleTitle?: string | null;
  managerConfirmedRoles?: readonly Readonly<{ family: ManagerRoleFamily; rawTitle: string; sourceRef: BusinessProjectSourceRef }>[];
  currentRequest: string;
  selectedConceptMeaning?: string | null;
  temporalStatus?: "FORECAST" | "CURRENT" | "HISTORICAL" | "GENERAL" | null;
  existingConfirmations?: Parameters<typeof resolveBusinessProjectContextClarification>[0]["existingConfirmations"];
}>): RealManagerCertificationProjection {
  const review = input.review ?? interpretCertificationCsv(input.fileName, input.csvText);
  const sourceContextId = review.mappings[0]?.semantic?.sourceContextId ?? `csv:overview:${input.fileName}`;
  const semantics = establishedFromReview(review);
  const org = input.organizationLabel
    ? { context: { label: input.organizationLabel }, evidence: Object.freeze({ evidenceId: "org", kind: "ORGANIZATION" as const, label: input.organizationLabel, confirmationState: "AUTHORITATIVE" as const, sourceRef: Object.freeze({ authorityId: "BCA8Fixture", sourceId: "org" }) }) }
    : undefined;
  const project = input.projectId
    ? { context: { projectId: input.projectId, label: input.projectLabel ?? input.projectId }, evidence: Object.freeze({ evidenceId: input.projectId, kind: "PROJECT" as const, label: input.projectLabel ?? input.projectId, confirmationState: "AUTHORITATIVE" as const, sourceRef: Object.freeze({ authorityId: "BCA8Fixture", sourceId: input.projectId }) }) }
    : undefined;
  const context = resolveBusinessProjectContext({
    workspaceId: "overview",
    organization: org,
    project,
    managerContext: input.roleTitle
      ? { roleLabel: input.roleTitle, sourceRef: Object.freeze({ authorityId: "ManagerConversation", sourceId: input.roleTitle }), confirmationState: "MANAGER_CONFIRMED", permissions: null, decisionAuthority: null }
      : null,
    confirmedSemanticConcepts: knownConcepts(semantics),
  });
  const concepts = semantics.map((semantic) => resolveBusinessProjectConcept({ semantic, context }));
  const relationships = resolveBusinessProjectRelationships({ context, concepts });
  const process = resolveBusinessProjectProcessContext({ context, concepts, relationships: relationships.relationships });
  const manager = resolveManagerDecisionContext({
    context,
    concepts,
    relationships: relationships.relationships,
    processPlacements: process.placements,
    managerId: "mgr-alex",
    managerName: "Alex",
    managerConfirmedRoles: input.managerConfirmedRoles,
    goalLabels: ["Improve on-time delivery from 91% to 96%"],
    rawTitles: input.roleTitle ? [input.roleTitle] : undefined,
  });
  const clarification = resolveBusinessProjectContextClarification({
    context,
    concepts,
    relationships: relationships.relationships,
    processPlacements: process.placements,
    managerDecisionContext: manager,
    currentRequest: input.currentRequest,
    existingConfirmations: input.existingConfirmations,
  });
  const presentation = resolveBusinessProjectPresentationContext({
    context,
    concepts,
    relationships: relationships.relationships,
    processPlacements: process.placements,
    managerDecisionContext: manager,
    clarificationNeed: clarification,
    currentRequest: input.currentRequest,
    selectedConceptMeaning: input.selectedConceptMeaning,
    temporalStatus: input.temporalStatus ?? null,
  });
  return deepFreeze({
    identity: realManagerRealDataCertificationIdentity,
    review,
    sourceContextId,
    context,
    concepts,
    manager,
    clarification,
    presentation,
    objectsCreated: [],
    stageObjectsAdded: presentation.stageContext.objectsAdded,
    focusMutatedTo: null,
    recommendationWriter: "none",
    decisionCommitted: false,
    executionStarted: false,
    outcomeCausalClaim: false,
    learningWritten: false,
    journey: [
      { managerTurn: "CSV intake", authority: "DATA-ADV / interpretCsvSemantics", status: "supported" },
      { managerTurn: "semantic clarification", authority: "applyCsvSemanticClarification + NCA", status: "handoff" },
      { managerTurn: input.currentRequest, authority: "BCA:1–7 → Advisor handoff", status: "supported" },
      { managerTurn: "Show me the scenarios.", authority: "existing Scenario authority", status: "not-owned-by-bca" },
      { managerTurn: "Compare them.", authority: "DTH:7", status: "not-owned-by-bca" },
      { managerTurn: "Which do you recommend?", authority: "existing Advisor recommendation", status: "not-owned-by-bca" },
      { managerTurn: "Approve temporary capacity.", authority: "CC:10 / CC:10R", status: "not-owned-by-bca" },
      { managerTurn: "Start execution.", authority: "CC:11", status: "not-owned-by-bca" },
      { managerTurn: "Delivery improved to 94%.", authority: "Outcome / DTH:11", status: "not-owned-by-bca" },
      { managerTurn: "What did we learn?", authority: "DTH:12 Learning", status: "not-owned-by-bca" },
    ],
    truthLedger: [
      { statement: "CSV columns have field meanings", authority: "DATA-ADV", status: "contextual" },
      { statement: `${context.contextKind} context`, authority: "BCA:1", status: "contextual" },
      { statement: "Concepts classified without becoming Objects", authority: "BCA:2", status: "contextual" },
      { statement: "Relationships remain non-causal", authority: "BCA:3", status: "qualified" },
      { statement: "Process participation is not a process instance", authority: "BCA:4", status: "contextual" },
      { statement: `Role ${manager.roleFamily} is relevance only`, authority: "BCA:5", status: "contextual" },
      { statement: clarification.clarificationNeeded ? "Material clarification selected" : "No material clarification", authority: "BCA:6", status: "qualified" },
      { statement: "Advisor emphasis is presentation only", authority: "BCA:7 → Advisor", status: "presentation-only" },
      { statement: "Temporary Capacity Scenario", authority: "existing Scenario authority", status: "canonical" },
      { statement: "Approved Decision", authority: "CC:10R", status: "canonical" },
      { statement: "Started Execution", authority: "CC:11", status: "canonical" },
      { statement: "OTD 94% observed", authority: "Outcome", status: "canonical" },
      { statement: "Action caused improvement", authority: "none", status: "NOT ESTABLISHED" },
    ],
    negativeInferences: [
      "Capacity caused backlog = NOT ESTABLISHED",
      "Backlog caused delivery decline = NOT ESTABLISHED",
      "Margin pressure caused by backlog = NOT ESTABLISHED",
      "Operations Manager has approval authority = NOT ESTABLISHED",
      "Project Manager may start any Execution = NOT ESTABLISHED",
      "Temporary Capacity is best = NOT ESTABLISHED",
      "Observed improvement was caused by Decision = NOT ESTABLISHED",
      "CSV value is an executive Problem = NOT ESTABLISHED",
    ],
  });
}

export function nextCertificationClarification(review: CsvMappingReview) {
  return nextCsvSemanticClarification(review);
}

export function confirmCertificationField(review: CsvMappingReview, answer: string) {
  const need = nextCsvSemanticClarification(review);
  if (!need) return Object.freeze({ review, resolved: false, deferred: false, acknowledgement: "No pending clarification." });
  return applyCsvSemanticClarification(review, need.fieldId, answer);
}

export function confirmCertificationColumn(review: CsvMappingReview, sourceColumn: string, answer: string) {
  const field = review.mappings.find((entry) => entry.sourceColumn === sourceColumn);
  if (!field?.semantic) return Object.freeze({ review, resolved: false, deferred: false, acknowledgement: "Column not found." });
  return applyCsvSemanticClarification(review, field.semantic.fieldId, answer);
}
