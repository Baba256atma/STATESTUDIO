/**
 * NPA-T NEXOCAUSE-DOMAIN-FOUNDATION:1
 *
 * Workspace-owned, deck-scoped investigations, observation references,
 * and manager-authored hypotheses. This store does not own organizational
 * objects, organizational relationships, decisions, or Dataset rows.
 * ACCEPTED_FOR_SCENARIO permits later scenario evaluation. It does not
 * establish causation. Manager review events are stored in this same
 * snapshot and do not form a second status authority.
 */

import { resolveManagerDeckDataset } from "../deck/nexoraDeckDatasetReferenceAuthority.ts";
import { getCsvRealDataImport } from "../data-reality/csvRealDataImportStore.ts";
import { evaluateWorkspaceAuthority, requireWorkspaceMutationCoordination, retainAuthorizedWorkspaceBuckets } from "../workspace/workspaceAuthorityFence.ts";
import { isProtectedDemoWorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import { workspaceMutationsBlocked } from "../workspace/workspaceDeletionGuard.ts";
import { readCommittedDatasetSnapshot } from "./canonicalDatasetEntityPipeline.ts";
import { getCanonicalObject, listDeckCanonicalObjects } from "./canonicalObjectRegistry.ts";

export const canonicalCausalInvestigationIdentity =
  "NPA-T NEXOCAUSE-DOMAIN-FOUNDATION:1/CanonicalCausalInvestigationDomain" as const;

export const CANONICAL_CAUSAL_INVESTIGATION_STORAGE_KEY = "nexora.causal-investigation.v1" as const;
export const CANONICAL_CAUSAL_INVESTIGATION_SCHEMA_VERSION = 1 as const;

export const CAUSAL_ACCEPTANCE_MEANING =
  "Manager acceptance permits scenario evaluation. It does not establish causation." as const;

export const CAUSAL_INVESTIGATION_BOUNDARY = Object.freeze({
  identity: canonicalCausalInvestigationIdentity,
  ownsOrganizationalObjects: false as const,
  ownsOrganizationalRelationships: false as const,
  ownsDecisionRecords: false as const,
  ownsDatasetRows: false as const,
  evidenceSupportedCausal: false as const,
  acceptanceMeaning: CAUSAL_ACCEPTANCE_MEANING,
});

export const CAUSAL_EVIDENCE_ROLES = Object.freeze(["SUPPORTING", "CONFLICTING", "NEUTRAL"] as const);
export type CausalEvidenceRole = (typeof CAUSAL_EVIDENCE_ROLES)[number];

export type CausalInvestigationStatus =
  | "DRAFT"
  | "UNDER_REVIEW"
  | "ACCEPTED_FOR_SCENARIO"
  | "ARCHIVED"
  | "DELETED";

export type CausalObservationStatus = "ACTIVE" | "ARCHIVED" | "DELETED";

export type CausalHypothesisStatus =
  | "PROPOSED"
  | "NEEDS_EVIDENCE"
  | "UNDER_REVIEW"
  | "ACCEPTED_FOR_SCENARIO"
  | "REJECTED"
  | "ARCHIVED";

export const CAUSAL_HYPOTHESIS_REVIEW_ACTIONS = Object.freeze([
  "REQUEST_EVIDENCE",
  "START_REVIEW",
  "ACCEPT_FOR_SCENARIO",
  "REASSESS_EVIDENCE",
  "REJECT",
  "RETURN_TO_INVESTIGATION",
] as const);
export type CausalHypothesisReviewAction = (typeof CAUSAL_HYPOTHESIS_REVIEW_ACTIONS)[number];

export const CAUSAL_HYPOTHESIS_READINESS = Object.freeze([
  "READY_FOR_MANAGER_REVIEW",
  "REVIEW_WITH_LIMITATIONS",
  "NEEDS_EVIDENCE",
  "BLOCKED",
] as const);
export type CausalHypothesisReadiness = (typeof CAUSAL_HYPOTHESIS_READINESS)[number];

const REVIEW_ACTION_STATUS: Readonly<Record<CausalHypothesisReviewAction, CausalHypothesisStatus>> = Object.freeze({
  REQUEST_EVIDENCE: "NEEDS_EVIDENCE",
  START_REVIEW: "UNDER_REVIEW",
  ACCEPT_FOR_SCENARIO: "ACCEPTED_FOR_SCENARIO",
  REASSESS_EVIDENCE: "ACCEPTED_FOR_SCENARIO",
  REJECT: "REJECTED",
  RETURN_TO_INVESTIGATION: "NEEDS_EVIDENCE",
});

export type CausalDatasetReference = Readonly<{
  datasetId: string;
  importId: string | null;
  sourceKey: string | null;
  fieldName: string | null;
}>;

export type CausalInvestigation = Readonly<{
  investigationId: string;
  workspaceId: string;
  deckId: string;
  title: string;
  problemStatement: string;
  lifecycleStatus: CausalInvestigationStatus;
  provenance: "MANAGER_DECLARED";
  createdAt: string;
  updatedAt: string;
}>;

export type CausalObservation = Readonly<{
  observationId: string;
  investigationId: string;
  workspaceId: string;
  deckId: string;
  statement: string;
  canonicalObjectId: string | null;
  datasetReference: CausalDatasetReference | null;
  periodLabel: string | null;
  measureName: string | null;
  unit: string | null;
  lifecycleStatus: CausalObservationStatus;
  provenance: "MANAGER_DECLARED";
  createdAt: string;
  updatedAt: string;
}>;

export type CausalEvidenceAssociation = Readonly<{
  observationId: string;
  role: CausalEvidenceRole;
}>;

export type CausalHypothesis = Readonly<{
  hypothesisId: string;
  investigationId: string;
  workspaceId: string;
  deckId: string;
  statement: string;
  observationIds: readonly string[];
  canonicalObjectIds: readonly string[];
  assumptions: readonly string[];
  limitations: readonly string[];
  evidenceRoles: readonly CausalEvidenceAssociation[];
  status: CausalHypothesisStatus;
  provenance: "MANAGER_DECLARED";
  evidenceSupportedCausal: false;
  createdAt: string;
  updatedAt: string;
}>;

export type CausalHypothesisReviewEvent = Readonly<{
  reviewId: string;
  operationId: string;
  investigationId: string;
  hypothesisId: string;
  workspaceId: string;
  deckId: string;
  action: CausalHypothesisReviewAction;
  previousStatus: CausalHypothesisStatus;
  newStatus: CausalHypothesisStatus;
  managerNote: string;
  readiness: CausalHypothesisReadiness;
  evidenceFingerprint: string;
  hypothesisStatement?: string;
  limitationsAcknowledged: boolean;
  warnings: readonly string[];
  createdAt: string;
}>;

export type CausalObjectReferenceState =
  | "active"
  | "archived"
  | "deleted"
  | "missing"
  | "unauthorized";

export type CausalInvestigationFailure =
  | "storage-unavailable"
  | "storage-failed"
  | "corrupt"
  | "unsupported-version"
  | "invalid-workspace"
  | "revision-conflict"
  | "protected-workspace"
  | "invalid-name"
  | "invalid-deck"
  | "missing"
  | "wrong-deck"
  | "invalid-status"
  | "invalid-reference"
  | "cross-workspace"
  | "unauthorized"
  | "archived"
  | "deleted"
  | "deletion-in-progress"
  | "duplicate";

export type CausalInvestigationResult<T> =
  | Readonly<{ ok: true; value: T }>
  | Readonly<{ ok: false; reason: CausalInvestigationFailure }>;

const INVESTIGATION_TRANSITIONS: Readonly<Record<CausalInvestigationStatus, readonly CausalInvestigationStatus[]>> = Object.freeze({
  DRAFT: Object.freeze(["UNDER_REVIEW", "ARCHIVED", "DELETED"] as const),
  UNDER_REVIEW: Object.freeze(["ACCEPTED_FOR_SCENARIO", "DRAFT", "ARCHIVED", "DELETED"] as const),
  ACCEPTED_FOR_SCENARIO: Object.freeze(["ARCHIVED", "DELETED"] as const),
  ARCHIVED: Object.freeze(["DELETED"] as const),
  DELETED: Object.freeze([] as const),
});

const HYPOTHESIS_TRANSITIONS: Readonly<Record<CausalHypothesisStatus, readonly CausalHypothesisStatus[]>> = Object.freeze({
  PROPOSED: Object.freeze(["NEEDS_EVIDENCE", "UNDER_REVIEW", "ARCHIVED"] as const),
  NEEDS_EVIDENCE: Object.freeze(["UNDER_REVIEW", "ARCHIVED"] as const),
  UNDER_REVIEW: Object.freeze(["ACCEPTED_FOR_SCENARIO", "REJECTED", "NEEDS_EVIDENCE", "ARCHIVED"] as const),
  REJECTED: Object.freeze(["NEEDS_EVIDENCE", "ARCHIVED"] as const),
  ACCEPTED_FOR_SCENARIO: Object.freeze(["NEEDS_EVIDENCE", "ARCHIVED"] as const),
  ARCHIVED: Object.freeze([] as const),
});

const OBSERVATION_TRANSITIONS: Readonly<Record<CausalObservationStatus, readonly CausalObservationStatus[]>> = Object.freeze({
  ACTIVE: Object.freeze(["ARCHIVED", "DELETED"] as const),
  ARCHIVED: Object.freeze(["DELETED"] as const),
  DELETED: Object.freeze([] as const),
});

type Bucket = Readonly<{
  nextInvestigation: number;
  nextObservation: number;
  nextHypothesis: number;
  nextReview: number;
  investigations: readonly CausalInvestigation[];
  observations: readonly CausalObservation[];
  hypotheses: readonly CausalHypothesis[];
  reviews: readonly CausalHypothesisReviewEvent[];
}>;

type Snapshot = Readonly<{
  identity: typeof canonicalCausalInvestigationIdentity;
  schemaVersion: typeof CANONICAL_CAUSAL_INVESTIGATION_SCHEMA_VERSION;
  workspaces: Readonly<Record<string, Bucket>>;
}>;

type AuthorityState =
  | Readonly<{ status: "ready" | "empty"; snapshot: Snapshot }>
  | Readonly<{ status: "corrupt" | "unsupported-version" }>;

const listeners = new Set<() => void>();
let revision = 0;
let storageOverride: Storage | null | undefined;
let authority: AuthorityState = { status: "empty", snapshot: emptySnapshot() };
let hydrated = false;
let baseRaw: string | null = null;

function emptyBucket(): Bucket {
  return Object.freeze({
    nextInvestigation: 1,
    nextObservation: 1,
    nextHypothesis: 1,
    nextReview: 1,
    investigations: Object.freeze([]),
    observations: Object.freeze([]),
    hypotheses: Object.freeze([]),
    reviews: Object.freeze([]),
  });
}

function emptySnapshot(): Snapshot {
  return Object.freeze({
    identity: canonicalCausalInvestigationIdentity,
    schemaVersion: CANONICAL_CAUSAL_INVESTIGATION_SCHEMA_VERSION,
    workspaces: Object.freeze({}),
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function nowIso(value?: string): string {
  return value ?? new Date().toISOString();
}

function storage(): Storage | null {
  if (storageOverride !== undefined) return storageOverride;
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function emit(): void {
  revision += 1;
  for (const listener of listeners) listener();
}

export function causalInvestigationRevision(): number {
  hydrate();
  return revision;
}

export function subscribeCausalInvestigations(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function canonicalCausalInvestigationAuthorityStatus(): "ready" | "empty" | "corrupt" | "unsupported-version" {
  hydrate();
  return authority.status;
}

function idFor(prefix: string, workspaceId: string, number: number): string {
  return `${prefix}:${encodeURIComponent(workspaceId)}:${number}`;
}

function workspaceAllowed(workspaceId: string): CausalInvestigationFailure | null {
  if (workspaceId.length === 0) return "invalid-workspace";
  if (isProtectedDemoWorkspaceId(workspaceId)) return "protected-workspace";
  if (!evaluateWorkspaceAuthority(workspaceId).ok) return "invalid-workspace";
  return null;
}

function validName(value: string): boolean {
  const name = value.trim();
  return name.length > 0 && name.length <= 160;
}

function validStatement(value: string): boolean {
  const text = value.trim();
  return text.length > 0 && text.length <= 500;
}

function textList(values: readonly string[] | undefined, limit = 12): readonly string[] | null {
  const source = values ?? [];
  if (source.length > limit) return null;
  const next: string[] = [];
  for (const value of source) {
    const text = value.trim();
    if (text.length === 0 || text.length > 240) return null;
    if (!next.includes(text)) next.push(text);
  }
  return Object.freeze(next);
}

function optionalLabel(value: string | null | undefined): string | null | undefined {
  if (value == null) return null;
  const text = value.trim();
  if (text.length === 0 || text.length > 80) return undefined;
  return text;
}

function sequence(id: string, prefix: string, workspaceId: string): number | null {
  const expected = `${prefix}:${encodeURIComponent(workspaceId)}:`;
  if (!id.startsWith(expected)) return null;
  const number = Number(id.slice(expected.length));
  if (!Number.isInteger(number) || number < 1 || String(number) !== id.slice(expected.length)) return null;
  return number;
}

function parseDatasetReference(value: unknown): CausalDatasetReference | null {
  if (value == null) return null;
  if (!isRecord(value) || typeof value.datasetId !== "string" || value.datasetId.trim().length === 0) return null;
  if (value.importId != null && typeof value.importId !== "string") return null;
  if (value.sourceKey != null && typeof value.sourceKey !== "string") return null;
  if (value.fieldName != null && typeof value.fieldName !== "string") return null;
  return Object.freeze({
    datasetId: value.datasetId,
    importId: typeof value.importId === "string" && value.importId.length > 0 ? value.importId : null,
    sourceKey: typeof value.sourceKey === "string" && value.sourceKey.length > 0 ? value.sourceKey : null,
    fieldName: typeof value.fieldName === "string" && value.fieldName.length > 0 ? value.fieldName : null,
  });
}

function parseInvestigation(value: unknown, workspaceId: string): CausalInvestigation | null {
  if (!isRecord(value) || value.workspaceId !== workspaceId) return null;
  if (typeof value.investigationId !== "string" || sequence(value.investigationId, "cause", workspaceId) == null) return null;
  if (typeof value.deckId !== "string" || value.deckId.trim().length === 0) return null;
  if (typeof value.title !== "string" || typeof value.problemStatement !== "string") return null;
  if (!Object.hasOwn(INVESTIGATION_TRANSITIONS, String(value.lifecycleStatus))) return null;
  if (value.provenance !== "MANAGER_DECLARED") return null;
  if (typeof value.createdAt !== "string" || typeof value.updatedAt !== "string") return null;
  return Object.freeze({
    investigationId: value.investigationId,
    workspaceId,
    deckId: value.deckId,
    title: value.title,
    problemStatement: value.problemStatement,
    lifecycleStatus: value.lifecycleStatus as CausalInvestigationStatus,
    provenance: "MANAGER_DECLARED",
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  });
}

function parseObservation(value: unknown, workspaceId: string): CausalObservation | null {
  if (!isRecord(value) || value.workspaceId !== workspaceId) return null;
  if (typeof value.observationId !== "string" || sequence(value.observationId, "observation", workspaceId) == null) return null;
  if (typeof value.investigationId !== "string" || sequence(value.investigationId, "cause", workspaceId) == null) return null;
  if (typeof value.deckId !== "string" || typeof value.statement !== "string") return null;
  if (value.canonicalObjectId != null && typeof value.canonicalObjectId !== "string") return null;
  if (typeof value.canonicalObjectId === "string" && !value.canonicalObjectId.startsWith(`org:${encodeURIComponent(workspaceId)}:`)) return null;
  const datasetReference = value.datasetReference == null ? null : parseDatasetReference(value.datasetReference);
  if (value.datasetReference != null && !datasetReference) return null;
  if (!Object.hasOwn(OBSERVATION_TRANSITIONS, String(value.lifecycleStatus))) return null;
  if (value.provenance !== "MANAGER_DECLARED") return null;
  if (typeof value.createdAt !== "string" || typeof value.updatedAt !== "string") return null;
  return Object.freeze({
    observationId: value.observationId,
    investigationId: value.investigationId,
    workspaceId,
    deckId: value.deckId,
    statement: value.statement,
    canonicalObjectId: typeof value.canonicalObjectId === "string" ? value.canonicalObjectId : null,
    datasetReference,
    periodLabel: typeof value.periodLabel === "string" ? value.periodLabel : null,
    measureName: typeof value.measureName === "string" ? value.measureName : null,
    unit: typeof value.unit === "string" ? value.unit : null,
    lifecycleStatus: value.lifecycleStatus as CausalObservationStatus,
    provenance: "MANAGER_DECLARED",
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  });
}

function parseHypothesis(value: unknown, workspaceId: string): CausalHypothesis | null {
  if (!isRecord(value) || value.workspaceId !== workspaceId) return null;
  if (typeof value.hypothesisId !== "string" || sequence(value.hypothesisId, "hypothesis", workspaceId) == null) return null;
  if (typeof value.investigationId !== "string" || sequence(value.investigationId, "cause", workspaceId) == null) return null;
  if (typeof value.deckId !== "string" || typeof value.statement !== "string") return null;
  if (!Array.isArray(value.observationIds) || !Array.isArray(value.canonicalObjectIds)) return null;
  if (!Array.isArray(value.assumptions) || !Array.isArray(value.limitations)) return null;
  if (value.evidenceRoles != null && !Array.isArray(value.evidenceRoles)) return null;
  if (!Object.hasOwn(HYPOTHESIS_TRANSITIONS, String(value.status))) return null;
  if (value.provenance !== "MANAGER_DECLARED") return null;
  if (value.evidenceSupportedCausal !== false) return null;
  if (typeof value.createdAt !== "string" || typeof value.updatedAt !== "string") return null;
  const observationIds = value.observationIds.filter((entry): entry is string => typeof entry === "string");
  const canonicalObjectIds = value.canonicalObjectIds.filter((entry): entry is string => typeof entry === "string");
  const assumptions = value.assumptions.filter((entry): entry is string => typeof entry === "string");
  const limitations = value.limitations.filter((entry): entry is string => typeof entry === "string");
  if (
    observationIds.length !== value.observationIds.length
    || canonicalObjectIds.length !== value.canonicalObjectIds.length
    || assumptions.length !== value.assumptions.length
    || limitations.length !== value.limitations.length
  ) return null;
  if (canonicalObjectIds.some((id) => !id.startsWith(`org:${encodeURIComponent(workspaceId)}:`))) return null;
  const evidenceRoles: CausalEvidenceAssociation[] = [];
  for (const role of value.evidenceRoles ?? []) {
    if (!isRecord(role) || typeof role.observationId !== "string" || !CAUSAL_EVIDENCE_ROLES.includes(role.role as CausalEvidenceRole)) return null;
    if (!observationIds.includes(role.observationId)) return null;
    evidenceRoles.push(Object.freeze({ observationId: role.observationId, role: role.role as CausalEvidenceRole }));
  }
  return Object.freeze({
    hypothesisId: value.hypothesisId,
    investigationId: value.investigationId,
    workspaceId,
    deckId: value.deckId,
    statement: value.statement,
    observationIds: Object.freeze(observationIds),
    canonicalObjectIds: Object.freeze(canonicalObjectIds),
    assumptions: Object.freeze(assumptions),
    limitations: Object.freeze(limitations),
    evidenceRoles: Object.freeze(evidenceRoles),
    status: value.status as CausalHypothesisStatus,
    provenance: "MANAGER_DECLARED",
    evidenceSupportedCausal: false,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  });
}

function parseReview(value: unknown, workspaceId: string): CausalHypothesisReviewEvent | null {
  if (!isRecord(value) || value.workspaceId !== workspaceId) return null;
  if (typeof value.reviewId !== "string" || sequence(value.reviewId, "review", workspaceId) == null) return null;
  if (typeof value.operationId !== "string" || value.operationId.trim().length === 0 || value.operationId.length > 80) return null;
  if (typeof value.investigationId !== "string" || sequence(value.investigationId, "cause", workspaceId) == null) return null;
  if (typeof value.hypothesisId !== "string" || sequence(value.hypothesisId, "hypothesis", workspaceId) == null) return null;
  if (typeof value.deckId !== "string" || typeof value.managerNote !== "string") return null;
  if (!CAUSAL_HYPOTHESIS_REVIEW_ACTIONS.includes(value.action as CausalHypothesisReviewAction)) return null;
  if (!Object.hasOwn(HYPOTHESIS_TRANSITIONS, String(value.previousStatus))) return null;
  if (!Object.hasOwn(HYPOTHESIS_TRANSITIONS, String(value.newStatus))) return null;
  if (REVIEW_ACTION_STATUS[value.action as CausalHypothesisReviewAction] !== value.newStatus) return null;
  if (!CAUSAL_HYPOTHESIS_READINESS.includes(value.readiness as CausalHypothesisReadiness)) return null;
  if (typeof value.evidenceFingerprint !== "string" || value.evidenceFingerprint.length === 0 || value.evidenceFingerprint.length > 80) return null;
  if (value.hypothesisStatement != null && (typeof value.hypothesisStatement !== "string" || value.hypothesisStatement.trim().length === 0 || value.hypothesisStatement.length > 500)) return null;
  if (typeof value.limitationsAcknowledged !== "boolean" || typeof value.createdAt !== "string") return null;
  if (!Array.isArray(value.warnings) || value.warnings.some((entry) => typeof entry !== "string")) return null;
  return Object.freeze({
    reviewId: value.reviewId,
    operationId: value.operationId,
    investigationId: value.investigationId,
    hypothesisId: value.hypothesisId,
    workspaceId,
    deckId: value.deckId,
    action: value.action as CausalHypothesisReviewAction,
    previousStatus: value.previousStatus as CausalHypothesisStatus,
    newStatus: value.newStatus as CausalHypothesisStatus,
    managerNote: value.managerNote,
    readiness: value.readiness as CausalHypothesisReadiness,
    evidenceFingerprint: value.evidenceFingerprint,
    ...(typeof value.hypothesisStatement === "string" ? { hypothesisStatement: value.hypothesisStatement } : {}),
    limitationsAcknowledged: value.limitationsAcknowledged,
    warnings: Object.freeze(value.warnings.filter((entry): entry is string => typeof entry === "string")),
    createdAt: value.createdAt,
  });
}

function counterCovers(counter: number, ids: readonly string[], prefix: string, workspaceId: string): boolean {
  return ids.every((id) => {
    const number = sequence(id, prefix, workspaceId);
    return number != null && number < counter;
  });
}

function parseBucket(value: unknown, workspaceId: string): Bucket | null {
  if (!isRecord(value)) return null;
  for (const counter of ["nextInvestigation", "nextObservation", "nextHypothesis"] as const) {
    if (typeof value[counter] !== "number" || !Number.isInteger(value[counter]) || value[counter] < 1) return null;
  }
  if (!Array.isArray(value.investigations) || !Array.isArray(value.observations) || !Array.isArray(value.hypotheses)) return null;
  if (value.reviews != null && !Array.isArray(value.reviews)) return null;
  const investigations = value.investigations.map((entry) => parseInvestigation(entry, workspaceId));
  const observations = value.observations.map((entry) => parseObservation(entry, workspaceId));
  const hypotheses = value.hypotheses.map((entry) => parseHypothesis(entry, workspaceId));
  const reviews = (Array.isArray(value.reviews) ? value.reviews : []).map((entry) => parseReview(entry, workspaceId));
  if (investigations.includes(null) || observations.includes(null) || hypotheses.includes(null) || reviews.includes(null)) return null;
  const investigationRecords = investigations as CausalInvestigation[];
  const observationRecords = observations as CausalObservation[];
  const hypothesisRecords = hypotheses as CausalHypothesis[];
  const reviewRecords = reviews as CausalHypothesisReviewEvent[];
  const highestReview = reviewRecords.reduce((max, entry) => Math.max(max, sequence(entry.reviewId, "review", workspaceId) ?? 0), 0);
  const nextReview = value.nextReview == null ? Math.max(1, highestReview + 1) : value.nextReview;
  if (typeof nextReview !== "number" || !Number.isInteger(nextReview) || nextReview < 1) return null;
  const investigationIds = new Set(investigationRecords.map((entry) => entry.investigationId));
  const observationIds = new Set(observationRecords.map((entry) => entry.observationId));
  if (investigationIds.size !== investigationRecords.length || observationIds.size !== observationRecords.length) return null;
  if (new Set(hypothesisRecords.map((entry) => entry.hypothesisId)).size !== hypothesisRecords.length) return null;
  if (!counterCovers(value.nextInvestigation as number, [...investigationIds], "cause", workspaceId)) return null;
  if (!counterCovers(value.nextObservation as number, [...observationIds], "observation", workspaceId)) return null;
  if (!counterCovers(value.nextHypothesis as number, hypothesisRecords.map((entry) => entry.hypothesisId), "hypothesis", workspaceId)) return null;
  if (!counterCovers(nextReview, reviewRecords.map((entry) => entry.reviewId), "review", workspaceId)) return null;
  if (new Set(reviewRecords.map((entry) => entry.reviewId)).size !== reviewRecords.length) return null;
  if (new Set(reviewRecords.map((entry) => entry.operationId)).size !== reviewRecords.length) return null;
  for (const observation of observationRecords) {
    if (!investigationIds.has(observation.investigationId)) return null;
    const investigation = investigationRecords.find((entry) => entry.investigationId === observation.investigationId);
    if (!investigation || investigation.deckId !== observation.deckId) return null;
  }
  for (const hypothesis of hypothesisRecords) {
    if (!investigationIds.has(hypothesis.investigationId)) return null;
    const investigation = investigationRecords.find((entry) => entry.investigationId === hypothesis.investigationId);
    if (!investigation || investigation.deckId !== hypothesis.deckId) return null;
    if (hypothesis.observationIds.some((id) => {
      const observation = observationRecords.find((entry) => entry.observationId === id);
      return !observation || observation.investigationId !== hypothesis.investigationId;
    })) return null;
  }
  for (const review of reviewRecords) {
    const hypothesis = hypothesisRecords.find((entry) => entry.hypothesisId === review.hypothesisId);
    if (!hypothesis || hypothesis.investigationId !== review.investigationId || hypothesis.deckId !== review.deckId) return null;
    if (review.investigationId && !investigationIds.has(review.investigationId)) return null;
  }
  return Object.freeze({
    nextInvestigation: value.nextInvestigation as number,
    nextObservation: value.nextObservation as number,
    nextHypothesis: value.nextHypothesis as number,
    nextReview,
    investigations: Object.freeze(investigationRecords),
    observations: Object.freeze(observationRecords),
    hypotheses: Object.freeze(hypothesisRecords),
    reviews: Object.freeze(reviewRecords),
  });
}

function parseSnapshot(raw: string): AuthorityState {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { status: "corrupt" };
  }
  if (!isRecord(parsed) || parsed.identity !== canonicalCausalInvestigationIdentity) return { status: "corrupt" };
  if (parsed.schemaVersion !== CANONICAL_CAUSAL_INVESTIGATION_SCHEMA_VERSION) return { status: "unsupported-version" };
  if (!isRecord(parsed.workspaces)) return { status: "corrupt" };
  const workspaces: Record<string, Bucket> = {};
  const seen = new Set<string>();
  for (const [workspaceId, value] of Object.entries(parsed.workspaces)) {
    const bucketValue = parseBucket(value, workspaceId);
    if (!bucketValue) return { status: "corrupt" };
    for (const id of [
      ...bucketValue.investigations.map((entry) => entry.investigationId),
      ...bucketValue.observations.map((entry) => entry.observationId),
      ...bucketValue.hypotheses.map((entry) => entry.hypothesisId),
      ...bucketValue.reviews.map((entry) => entry.reviewId),
    ]) {
      if (seen.has(id)) return { status: "corrupt" };
      seen.add(id);
    }
    workspaces[workspaceId] = bucketValue;
  }
  return {
    status: Object.keys(workspaces).length === 0 ? "empty" : "ready",
    snapshot: Object.freeze({
      identity: canonicalCausalInvestigationIdentity,
      schemaVersion: CANONICAL_CAUSAL_INVESTIGATION_SCHEMA_VERSION,
      workspaces: Object.freeze(workspaces),
    }),
  };
}

export function refreshCausalInvestigationsFromStorage(): void {
  hydrate();
  const current = storage();
  if (!current) return;
  let raw: string | null = null;
  try {
    raw = current.getItem(CANONICAL_CAUSAL_INVESTIGATION_STORAGE_KEY);
  } catch {
    return;
  }
  if (raw !== baseRaw) {
    hydrated = false;
    hydrate();
  }
}

function hydrate(): void {
  if (hydrated) return;
  hydrated = true;
  const current = storage();
  if (!current) return;
  let raw: string | null = null;
  try {
    raw = current.getItem(CANONICAL_CAUSAL_INVESTIGATION_STORAGE_KEY);
  } catch {
    authority = { status: "corrupt" };
    return;
  }
  baseRaw = raw;
  if (raw == null) {
    authority = { status: "empty", snapshot: emptySnapshot() };
    return;
  }
  authority = parseSnapshot(raw);
}

function persist(next: Snapshot): CausalInvestigationFailure | null {
  const current = storage();
  if (!current) return "storage-unavailable";
  const encoded = JSON.stringify(next);
  try {
    current.setItem(CANONICAL_CAUSAL_INVESTIGATION_STORAGE_KEY, encoded);
    if (current.getItem(CANONICAL_CAUSAL_INVESTIGATION_STORAGE_KEY) !== encoded) return "storage-failed";
  } catch {
    return "storage-failed";
  }
  return null;
}

function storedWorkspaceBuckets(): Readonly<Record<string, Bucket>> {
  const current = storage();
  if (!current) return authority.status === "ready" || authority.status === "empty" ? authority.snapshot.workspaces : {};
  let raw: string | null = null;
  try {
    raw = current.getItem(CANONICAL_CAUSAL_INVESTIGATION_STORAGE_KEY);
  } catch {
    return {};
  }
  if (raw == null) return {};
  const parsed = parseSnapshot(raw);
  return parsed.status === "ready" || parsed.status === "empty" ? parsed.snapshot.workspaces : {};
}

function commit(next: Snapshot): CausalInvestigationFailure | null {
  if (requireWorkspaceMutationCoordination()) return "invalid-workspace";
  hydrate();
  if (authority.status === "corrupt" || authority.status === "unsupported-version") {
    return authority.status === "corrupt" ? "corrupt" : "unsupported-version";
  }
  const fenced = retainAuthorizedWorkspaceBuckets(storedWorkspaceBuckets(), next.workspaces);
  if (!fenced.ok) return "invalid-workspace";
  const current = storage();
  let raw: string | null = null;
  try {
    raw = current?.getItem(CANONICAL_CAUSAL_INVESTIGATION_STORAGE_KEY) ?? null;
  } catch {
    return "storage-failed";
  }
  if (current && raw !== baseRaw) {
    hydrated = false;
    hydrate();
    return "revision-conflict";
  }
  const failure = persist(Object.freeze({ ...next, workspaces: Object.freeze(fenced.workspaces) }));
  if (failure) return failure;
  const fencedSnapshot = Object.freeze({ ...next, workspaces: Object.freeze(fenced.workspaces) });
  authority = {
    status: Object.keys(fencedSnapshot.workspaces).length === 0 ? "empty" : "ready",
    snapshot: fencedSnapshot,
  };
  baseRaw = JSON.stringify(fencedSnapshot);
  emit();
  return null;
}

function snapshot(): Snapshot {
  hydrate();
  return authority.status === "ready" || authority.status === "empty" ? authority.snapshot : emptySnapshot();
}

function blocked(): CausalInvestigationFailure | null {
  hydrate();
  if (authority.status === "corrupt") return "corrupt";
  if (authority.status === "unsupported-version") return "unsupported-version";
  return null;
}

function bucket(workspaceId: string): Bucket {
  return snapshot().workspaces[workspaceId] ?? emptyBucket();
}

function writeBucket(workspaceId: string, next: Bucket): CausalInvestigationFailure | null {
  if (!evaluateWorkspaceAuthority(workspaceId).ok) return "invalid-workspace";
  const current = snapshot();
  return commit(Object.freeze({
    ...current,
    workspaces: Object.freeze({ ...current.workspaces, [workspaceId]: next }),
  }));
}

function objectReferenceFailure(workspaceId: string, deckId: string, canonicalObjectId: string): CausalInvestigationFailure | null {
  if (!canonicalObjectId.startsWith(`org:${encodeURIComponent(workspaceId)}:`)) return "cross-workspace";
  const object = getCanonicalObject(workspaceId, canonicalObjectId);
  if (!object || object.workspaceId !== workspaceId) return "missing";
  if (object.lifecycleStatus === "DELETED") return "deleted";
  if (object.lifecycleStatus === "ARCHIVED") return "archived";
  if (!listDeckCanonicalObjects(workspaceId, deckId).some((entry) => entry.canonicalObjectId === canonicalObjectId)) {
    return "unauthorized";
  }
  return null;
}

function datasetReferenceFailure(
  workspaceId: string,
  deckId: string,
  reference: CausalDatasetReference,
): CausalInvestigationFailure | null {
  const assigned = resolveManagerDeckDataset({ workspaceId, deckId, datasetId: reference.datasetId });
  if (!assigned) {
    const owned = getCsvRealDataImport(workspaceId, reference.datasetId);
    if (owned && owned.workspaceId === workspaceId) return "unauthorized";
    const foreignPrefix = "csv:";
    if (reference.datasetId.startsWith(foreignPrefix) && !reference.datasetId.startsWith(`csv:${encodeURIComponent(workspaceId)}:`)) {
      return "cross-workspace";
    }
    return "missing";
  }
  if (assigned.workspaceId !== workspaceId || assigned.sourceContextId !== reference.datasetId) return "cross-workspace";
  if (reference.importId && assigned.importId !== reference.importId) return "invalid-reference";
  if (!reference.sourceKey && !reference.fieldName) return null;
  const committed = readCommittedDatasetSnapshot(workspaceId, reference.datasetId);
  if (!committed.ok) return "invalid-reference";
  if (reference.fieldName && !committed.value.columns.includes(reference.fieldName)) return "invalid-reference";
  if (reference.sourceKey && !committed.value.rows.some((row) => Object.values(row).includes(reference.sourceKey as string))) {
    return "invalid-reference";
  }
  return null;
}

function activeInvestigation(workspaceId: string, deckId: string, investigationId: string): CausalInvestigation | CausalInvestigationFailure {
  const investigation = bucket(workspaceId).investigations.find((entry) => entry.investigationId === investigationId);
  if (!investigation) return "missing";
  if (investigation.deckId !== deckId) return "wrong-deck";
  if (investigation.lifecycleStatus === "DELETED") return "deleted";
  if (investigation.lifecycleStatus === "ARCHIVED") return "archived";
  return investigation;
}

export function countWorkspaceCausalInvestigationRecords(workspaceId: string): Readonly<{
  investigations: number;
  observations: number;
  hypotheses: number;
  reviews: number;
}> {
  const current = bucket(workspaceId);
  return Object.freeze({
    investigations: current.investigations.length,
    observations: current.observations.length,
    hypotheses: current.hypotheses.length,
    reviews: current.reviews.length,
  });
}

export function listCausalInvestigations(workspaceId: string, deckId: string): readonly CausalInvestigation[] {
  return bucket(workspaceId).investigations.filter((entry) => entry.deckId === deckId);
}

export function getCausalInvestigation(workspaceId: string, investigationId: string): CausalInvestigation | null {
  return bucket(workspaceId).investigations.find((entry) => entry.investigationId === investigationId) ?? null;
}

export function listCausalObservations(workspaceId: string, investigationId: string): readonly CausalObservation[] {
  return bucket(workspaceId).observations.filter((entry) => entry.investigationId === investigationId);
}

export function getCausalObservation(workspaceId: string, observationId: string): CausalObservation | null {
  return bucket(workspaceId).observations.find((entry) => entry.observationId === observationId) ?? null;
}

export function listCausalHypotheses(workspaceId: string, investigationId: string): readonly CausalHypothesis[] {
  return bucket(workspaceId).hypotheses.filter((entry) => entry.investigationId === investigationId);
}

export function getCausalHypothesis(workspaceId: string, hypothesisId: string): CausalHypothesis | null {
  return bucket(workspaceId).hypotheses.find((entry) => entry.hypothesisId === hypothesisId) ?? null;
}

export function resolveCausalObjectReference(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly canonicalObjectId: string | null;
}): Readonly<{ state: CausalObjectReferenceState; displayName: string | null }> {
  if (!input.canonicalObjectId) return Object.freeze({ state: "missing", displayName: null });
  if (!input.canonicalObjectId.startsWith(`org:${encodeURIComponent(input.workspaceId)}:`)) {
    return Object.freeze({ state: "unauthorized", displayName: null });
  }
  const object = getCanonicalObject(input.workspaceId, input.canonicalObjectId);
  if (!object) return Object.freeze({ state: "missing", displayName: null });
  if (object.lifecycleStatus === "DELETED") return Object.freeze({ state: "deleted", displayName: null });
  if (object.lifecycleStatus === "ARCHIVED") {
    return Object.freeze({ state: "archived", displayName: object.displayName });
  }
  if (!object.deckIds.includes(input.deckId)) return Object.freeze({ state: "unauthorized", displayName: null });
  return Object.freeze({ state: "active", displayName: object.displayName });
}

export function createCausalInvestigation(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly title: string;
  readonly problemStatement: string;
  readonly now?: string;
}): CausalInvestigationResult<CausalInvestigation> {
  const failure = blocked();
  if (failure) return { ok: false, reason: failure };
  const workspaceId = input.workspaceId.trim();
  const rejected = workspaceAllowed(workspaceId);
  if (rejected) return { ok: false, reason: rejected };
  if (workspaceMutationsBlocked(workspaceId)) return { ok: false, reason: "deletion-in-progress" };
  const deckId = input.deckId.trim();
  if (deckId.length === 0) return { ok: false, reason: "invalid-deck" };
  if (!validName(input.title) || !validStatement(input.problemStatement)) return { ok: false, reason: "invalid-name" };
  const current = bucket(workspaceId);
  const stamp = nowIso(input.now);
  const investigation: CausalInvestigation = Object.freeze({
    investigationId: idFor("cause", workspaceId, current.nextInvestigation),
    workspaceId,
    deckId,
    title: input.title.trim(),
    problemStatement: input.problemStatement.trim(),
    lifecycleStatus: "DRAFT",
    provenance: "MANAGER_DECLARED",
    createdAt: stamp,
    updatedAt: stamp,
  });
  const write = writeBucket(workspaceId, Object.freeze({
    ...current,
    nextInvestigation: current.nextInvestigation + 1,
    investigations: Object.freeze([...current.investigations, investigation]),
  }));
  if (write) return { ok: false, reason: write };
  return { ok: true, value: investigation };
}

export function updateCausalInvestigation(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly investigationId: string;
  readonly title?: string;
  readonly problemStatement?: string;
  readonly now?: string;
}): CausalInvestigationResult<CausalInvestigation> {
  const failure = blocked();
  if (failure) return { ok: false, reason: failure };
  const workspaceId = input.workspaceId.trim();
  const rejected = workspaceAllowed(workspaceId);
  if (rejected) return { ok: false, reason: rejected };
  const current = bucket(workspaceId);
  const investigation = current.investigations.find((entry) => entry.investigationId === input.investigationId);
  if (!investigation) return { ok: false, reason: "missing" };
  if (investigation.deckId !== input.deckId.trim()) return { ok: false, reason: "wrong-deck" };
  if (investigation.lifecycleStatus === "ARCHIVED") return { ok: false, reason: "archived" };
  if (investigation.lifecycleStatus === "DELETED") return { ok: false, reason: "deleted" };
  const title = input.title == null ? investigation.title : input.title;
  const problemStatement = input.problemStatement == null ? investigation.problemStatement : input.problemStatement;
  if (!validName(title) || !validStatement(problemStatement)) return { ok: false, reason: "invalid-name" };
  const next = Object.freeze({
    ...investigation,
    title: title.trim(),
    problemStatement: problemStatement.trim(),
    updatedAt: nowIso(input.now),
  });
  const write = writeBucket(workspaceId, Object.freeze({
    ...current,
    investigations: Object.freeze(current.investigations.map((entry) => entry.investigationId === next.investigationId ? next : entry)),
  }));
  if (write) return { ok: false, reason: write };
  return { ok: true, value: next };
}

export function transitionCausalInvestigation(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly investigationId: string;
  readonly lifecycleStatus: CausalInvestigationStatus;
  readonly now?: string;
}): CausalInvestigationResult<CausalInvestigation> {
  const failure = blocked();
  if (failure) return { ok: false, reason: failure };
  const workspaceId = input.workspaceId.trim();
  const rejected = workspaceAllowed(workspaceId);
  if (rejected) return { ok: false, reason: rejected };
  const current = bucket(workspaceId);
  const investigation = current.investigations.find((entry) => entry.investigationId === input.investigationId);
  if (!investigation) return { ok: false, reason: "missing" };
  if (investigation.deckId !== input.deckId.trim()) return { ok: false, reason: "wrong-deck" };
  if (!INVESTIGATION_TRANSITIONS[investigation.lifecycleStatus].includes(input.lifecycleStatus)) {
    return { ok: false, reason: "invalid-status" };
  }
  const next = Object.freeze({ ...investigation, lifecycleStatus: input.lifecycleStatus, updatedAt: nowIso(input.now) });
  const write = writeBucket(workspaceId, Object.freeze({
    ...current,
    investigations: Object.freeze(current.investigations.map((entry) => entry.investigationId === next.investigationId ? next : entry)),
  }));
  if (write) return { ok: false, reason: write };
  return { ok: true, value: next };
}

export function createCausalObservation(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly investigationId: string;
  readonly statement: string;
  readonly canonicalObjectId?: string | null;
  readonly datasetReference?: {
    readonly datasetId: string;
    readonly importId?: string | null;
    readonly sourceKey?: string | null;
    readonly fieldName?: string | null;
  } | null;
  readonly periodLabel?: string | null;
  readonly measureName?: string | null;
  readonly unit?: string | null;
  readonly now?: string;
}): CausalInvestigationResult<CausalObservation> {
  const failure = blocked();
  if (failure) return { ok: false, reason: failure };
  const workspaceId = input.workspaceId.trim();
  const rejected = workspaceAllowed(workspaceId);
  if (rejected) return { ok: false, reason: rejected };
  if (workspaceMutationsBlocked(workspaceId)) return { ok: false, reason: "deletion-in-progress" };
  const deckId = input.deckId.trim();
  const parent = activeInvestigation(workspaceId, deckId, input.investigationId);
  if (typeof parent === "string") return { ok: false, reason: parent };
  if (!validStatement(input.statement)) return { ok: false, reason: "invalid-name" };
  const canonicalObjectId = input.canonicalObjectId ?? null;
  if (canonicalObjectId) {
    const objectFailure = objectReferenceFailure(workspaceId, deckId, canonicalObjectId);
    if (objectFailure) return { ok: false, reason: objectFailure };
  }
  const periodLabel = optionalLabel(input.periodLabel);
  const measureName = optionalLabel(input.measureName);
  const unit = optionalLabel(input.unit);
  if (periodLabel === undefined || measureName === undefined || unit === undefined) return { ok: false, reason: "invalid-name" };
  let datasetReference: CausalDatasetReference | null = null;
  if (input.datasetReference) {
    datasetReference = Object.freeze({
      datasetId: input.datasetReference.datasetId.trim(),
      importId: input.datasetReference.importId?.trim() || null,
      sourceKey: input.datasetReference.sourceKey?.trim() || null,
      fieldName: input.datasetReference.fieldName?.trim() || null,
    });
    if (datasetReference.datasetId.length === 0) return { ok: false, reason: "invalid-reference" };
    const datasetFailure = datasetReferenceFailure(workspaceId, deckId, datasetReference);
    if (datasetFailure) return { ok: false, reason: datasetFailure };
  }
  const current = bucket(workspaceId);
  const stamp = nowIso(input.now);
  const observation: CausalObservation = Object.freeze({
    observationId: idFor("observation", workspaceId, current.nextObservation),
    investigationId: parent.investigationId,
    workspaceId,
    deckId,
    statement: input.statement.trim(),
    canonicalObjectId,
    datasetReference,
    periodLabel,
    measureName,
    unit,
    lifecycleStatus: "ACTIVE",
    provenance: "MANAGER_DECLARED",
    createdAt: stamp,
    updatedAt: stamp,
  });
  const write = writeBucket(workspaceId, Object.freeze({
    ...current,
    nextObservation: current.nextObservation + 1,
    observations: Object.freeze([...current.observations, observation]),
  }));
  if (write) return { ok: false, reason: write };
  return { ok: true, value: observation };
}

export function updateCausalObservation(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly observationId: string;
  readonly statement: string;
  readonly now?: string;
}): CausalInvestigationResult<CausalObservation> {
  const failure = blocked();
  if (failure) return { ok: false, reason: failure };
  const workspaceId = input.workspaceId.trim();
  const rejected = workspaceAllowed(workspaceId);
  if (rejected) return { ok: false, reason: rejected };
  const current = bucket(workspaceId);
  const observation = current.observations.find((entry) => entry.observationId === input.observationId);
  if (!observation) return { ok: false, reason: "missing" };
  if (observation.deckId !== input.deckId.trim()) return { ok: false, reason: "wrong-deck" };
  if (observation.lifecycleStatus !== "ACTIVE") return { ok: false, reason: observation.lifecycleStatus === "ARCHIVED" ? "archived" : "deleted" };
  const parent = activeInvestigation(workspaceId, observation.deckId, observation.investigationId);
  if (typeof parent === "string") return { ok: false, reason: parent };
  if (!validStatement(input.statement)) return { ok: false, reason: "invalid-name" };
  const next = Object.freeze({ ...observation, statement: input.statement.trim(), updatedAt: nowIso(input.now) });
  const write = writeBucket(workspaceId, Object.freeze({
    ...current,
    observations: Object.freeze(current.observations.map((entry) => entry.observationId === next.observationId ? next : entry)),
  }));
  if (write) return { ok: false, reason: write };
  return { ok: true, value: next };
}

export function transitionCausalObservation(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly observationId: string;
  readonly lifecycleStatus: CausalObservationStatus;
  readonly now?: string;
}): CausalInvestigationResult<CausalObservation> {
  const failure = blocked();
  if (failure) return { ok: false, reason: failure };
  const workspaceId = input.workspaceId.trim();
  const rejected = workspaceAllowed(workspaceId);
  if (rejected) return { ok: false, reason: rejected };
  const current = bucket(workspaceId);
  const observation = current.observations.find((entry) => entry.observationId === input.observationId);
  if (!observation) return { ok: false, reason: "missing" };
  if (observation.deckId !== input.deckId.trim()) return { ok: false, reason: "wrong-deck" };
  if (!OBSERVATION_TRANSITIONS[observation.lifecycleStatus].includes(input.lifecycleStatus)) {
    return { ok: false, reason: "invalid-status" };
  }
  const next = Object.freeze({ ...observation, lifecycleStatus: input.lifecycleStatus, updatedAt: nowIso(input.now) });
  const write = writeBucket(workspaceId, Object.freeze({
    ...current,
    observations: Object.freeze(current.observations.map((entry) => entry.observationId === next.observationId ? next : entry)),
  }));
  if (write) return { ok: false, reason: write };
  return { ok: true, value: next };
}

function validateHypothesisLinks(
  workspaceId: string,
  deckId: string,
  investigationId: string,
  observationIds: readonly string[],
  canonicalObjectIds: readonly string[],
): CausalInvestigationFailure | null {
  const current = bucket(workspaceId);
  for (const observationId of observationIds) {
    const observation = current.observations.find((entry) => entry.observationId === observationId);
    if (!observation || observation.investigationId !== investigationId) return "invalid-reference";
    if (observation.deckId !== deckId) return "wrong-deck";
    if (observation.lifecycleStatus !== "ACTIVE") return observation.lifecycleStatus === "ARCHIVED" ? "archived" : "deleted";
  }
  for (const canonicalObjectId of canonicalObjectIds) {
    const objectFailure = objectReferenceFailure(workspaceId, deckId, canonicalObjectId);
    if (objectFailure) return objectFailure;
  }
  return null;
}

export function createCausalHypothesis(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly investigationId: string;
  readonly statement: string;
  readonly observationIds?: readonly string[];
  readonly canonicalObjectIds?: readonly string[];
  readonly assumptions?: readonly string[];
  readonly limitations?: readonly string[];
  readonly evidenceRoles?: readonly CausalEvidenceAssociation[];
  readonly now?: string;
}): CausalInvestigationResult<CausalHypothesis> {
  const failure = blocked();
  if (failure) return { ok: false, reason: failure };
  const workspaceId = input.workspaceId.trim();
  const rejected = workspaceAllowed(workspaceId);
  if (rejected) return { ok: false, reason: rejected };
  if (workspaceMutationsBlocked(workspaceId)) return { ok: false, reason: "deletion-in-progress" };
  const deckId = input.deckId.trim();
  const parent = activeInvestigation(workspaceId, deckId, input.investigationId);
  if (typeof parent === "string") return { ok: false, reason: parent };
  if (!validStatement(input.statement)) return { ok: false, reason: "invalid-name" };
  const observationIds = Object.freeze([...(input.observationIds ?? [])]);
  const canonicalObjectIds = Object.freeze([...(input.canonicalObjectIds ?? [])]);
  const assumptions = textList(input.assumptions);
  const limitations = textList(input.limitations);
  if (!assumptions || !limitations) return { ok: false, reason: "invalid-name" };
  if (new Set(observationIds).size !== observationIds.length || new Set(canonicalObjectIds).size !== canonicalObjectIds.length) {
    return { ok: false, reason: "duplicate" };
  }
  const linkFailure = validateHypothesisLinks(workspaceId, deckId, parent.investigationId, observationIds, canonicalObjectIds);
  if (linkFailure) return { ok: false, reason: linkFailure };
  const evidenceRoles: CausalEvidenceAssociation[] = [];
  for (const role of input.evidenceRoles ?? []) {
    if (!CAUSAL_EVIDENCE_ROLES.includes(role.role) || !observationIds.includes(role.observationId)) {
      return { ok: false, reason: "invalid-reference" };
    }
    evidenceRoles.push(Object.freeze({ observationId: role.observationId, role: role.role }));
  }
  const current = bucket(workspaceId);
  const stamp = nowIso(input.now);
  const hypothesis: CausalHypothesis = Object.freeze({
    hypothesisId: idFor("hypothesis", workspaceId, current.nextHypothesis),
    investigationId: parent.investigationId,
    workspaceId,
    deckId,
    statement: input.statement.trim(),
    observationIds,
    canonicalObjectIds,
    assumptions,
    limitations,
    evidenceRoles: Object.freeze(evidenceRoles),
    status: "PROPOSED",
    provenance: "MANAGER_DECLARED",
    evidenceSupportedCausal: false,
    createdAt: stamp,
    updatedAt: stamp,
  });
  const write = writeBucket(workspaceId, Object.freeze({
    ...current,
    nextHypothesis: current.nextHypothesis + 1,
    hypotheses: Object.freeze([...current.hypotheses, hypothesis]),
  }));
  if (write) return { ok: false, reason: write };
  return { ok: true, value: hypothesis };
}

export function updateCausalHypothesis(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly hypothesisId: string;
  readonly statement?: string;
  readonly observationIds?: readonly string[];
  readonly canonicalObjectIds?: readonly string[];
  readonly assumptions?: readonly string[];
  readonly limitations?: readonly string[];
  readonly evidenceRoles?: readonly CausalEvidenceAssociation[];
  readonly now?: string;
}): CausalInvestigationResult<CausalHypothesis> {
  const failure = blocked();
  if (failure) return { ok: false, reason: failure };
  const workspaceId = input.workspaceId.trim();
  const rejected = workspaceAllowed(workspaceId);
  if (rejected) return { ok: false, reason: rejected };
  const current = bucket(workspaceId);
  const hypothesis = current.hypotheses.find((entry) => entry.hypothesisId === input.hypothesisId);
  if (!hypothesis) return { ok: false, reason: "missing" };
  if (hypothesis.deckId !== input.deckId.trim()) return { ok: false, reason: "wrong-deck" };
  if (hypothesis.status === "ARCHIVED") return { ok: false, reason: "archived" };
  const parent = activeInvestigation(workspaceId, hypothesis.deckId, hypothesis.investigationId);
  if (typeof parent === "string") return { ok: false, reason: parent };
  const statement = input.statement ?? hypothesis.statement;
  if (!validStatement(statement)) return { ok: false, reason: "invalid-name" };
  const observationIds = Object.freeze([...(input.observationIds ?? hypothesis.observationIds)]);
  const canonicalObjectIds = Object.freeze([...(input.canonicalObjectIds ?? hypothesis.canonicalObjectIds)]);
  const assumptions = textList(input.assumptions ?? hypothesis.assumptions);
  const limitations = textList(input.limitations ?? hypothesis.limitations);
  if (!assumptions || !limitations) return { ok: false, reason: "invalid-name" };
  if (new Set(observationIds).size !== observationIds.length || new Set(canonicalObjectIds).size !== canonicalObjectIds.length) {
    return { ok: false, reason: "duplicate" };
  }
  const linkFailure = validateHypothesisLinks(workspaceId, hypothesis.deckId, hypothesis.investigationId, observationIds, canonicalObjectIds);
  if (linkFailure) return { ok: false, reason: linkFailure };
  const requestedRoles = input.evidenceRoles ?? hypothesis.evidenceRoles.filter((role) => observationIds.includes(role.observationId));
  const evidenceRoles: CausalEvidenceAssociation[] = [];
  for (const role of requestedRoles) {
    if (!CAUSAL_EVIDENCE_ROLES.includes(role.role) || !observationIds.includes(role.observationId)) {
      return { ok: false, reason: "invalid-reference" };
    }
    evidenceRoles.push(Object.freeze({ observationId: role.observationId, role: role.role }));
  }
  const next: CausalHypothesis = Object.freeze({
    ...hypothesis,
    statement: statement.trim(),
    observationIds,
    canonicalObjectIds,
    assumptions,
    limitations,
    evidenceRoles: Object.freeze(evidenceRoles),
    evidenceSupportedCausal: false,
    updatedAt: nowIso(input.now),
  });
  const write = writeBucket(workspaceId, Object.freeze({
    ...current,
    hypotheses: Object.freeze(current.hypotheses.map((entry) => entry.hypothesisId === next.hypothesisId ? next : entry)),
  }));
  if (write) return { ok: false, reason: write };
  return { ok: true, value: next };
}

export function transitionCausalHypothesis(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly hypothesisId: string;
  readonly status: CausalHypothesisStatus;
  readonly now?: string;
}): CausalInvestigationResult<CausalHypothesis> {
  const failure = blocked();
  if (failure) return { ok: false, reason: failure };
  const workspaceId = input.workspaceId.trim();
  const rejected = workspaceAllowed(workspaceId);
  if (rejected) return { ok: false, reason: rejected };
  const current = bucket(workspaceId);
  const hypothesis = current.hypotheses.find((entry) => entry.hypothesisId === input.hypothesisId);
  if (!hypothesis) return { ok: false, reason: "missing" };
  if (hypothesis.deckId !== input.deckId.trim()) return { ok: false, reason: "wrong-deck" };
  if (!HYPOTHESIS_TRANSITIONS[hypothesis.status].includes(input.status)) return { ok: false, reason: "invalid-status" };
  const next: CausalHypothesis = Object.freeze({
    ...hypothesis,
    status: input.status,
    evidenceSupportedCausal: false,
    updatedAt: nowIso(input.now),
  });
  const write = writeBucket(workspaceId, Object.freeze({
    ...current,
    hypotheses: Object.freeze(current.hypotheses.map((entry) => entry.hypothesisId === next.hypothesisId ? next : entry)),
  }));
  if (write) return { ok: false, reason: write };
  return { ok: true, value: next };
}

export function listCausalHypothesisReviews(workspaceId: string, hypothesisId: string): readonly CausalHypothesisReviewEvent[] {
  return bucket(workspaceId).reviews.filter((entry) => entry.hypothesisId === hypothesisId);
}

export function commitCausalHypothesisReview(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly hypothesisId: string;
  readonly operationId: string;
  readonly action: CausalHypothesisReviewAction;
  readonly managerNote: string;
  readonly readiness: CausalHypothesisReadiness;
  readonly evidenceFingerprint: string;
  readonly limitationsAcknowledged: boolean;
  readonly warnings: readonly string[];
  readonly now?: string;
}): CausalInvestigationResult<Readonly<{ hypothesis: CausalHypothesis; review: CausalHypothesisReviewEvent }>> {
  const failure = blocked();
  if (failure) return { ok: false, reason: failure };
  const workspaceId = input.workspaceId.trim();
  const rejected = workspaceAllowed(workspaceId);
  if (rejected) return { ok: false, reason: rejected };
  const operationId = input.operationId.trim();
  if (!/^[A-Za-z0-9:._-]{1,80}$/.test(operationId)) return { ok: false, reason: "invalid-reference" };
  if (!validStatement(input.managerNote)) return { ok: false, reason: "invalid-name" };
  if (!CAUSAL_HYPOTHESIS_REVIEW_ACTIONS.includes(input.action)) return { ok: false, reason: "invalid-status" };
  if (!CAUSAL_HYPOTHESIS_READINESS.includes(input.readiness)) return { ok: false, reason: "invalid-reference" };
  if (input.evidenceFingerprint.trim().length === 0 || input.evidenceFingerprint.length > 80) return { ok: false, reason: "invalid-reference" };
  if (input.warnings.length > 20 || input.warnings.some((warning) => warning.trim().length === 0 || warning.length > 160)) {
    return { ok: false, reason: "invalid-reference" };
  }
  const current = bucket(workspaceId);
  if (current.reviews.some((entry) => entry.operationId === operationId)) return { ok: false, reason: "duplicate" };
  const hypothesis = current.hypotheses.find((entry) => entry.hypothesisId === input.hypothesisId);
  if (!hypothesis || hypothesis.workspaceId !== workspaceId) return { ok: false, reason: "missing" };
  const deckId = input.deckId.trim();
  if (hypothesis.deckId !== deckId) return { ok: false, reason: "wrong-deck" };
  const investigation = activeInvestigation(workspaceId, deckId, hypothesis.investigationId);
  if (typeof investigation === "string") return { ok: false, reason: investigation };
  const status = REVIEW_ACTION_STATUS[input.action];
  if (input.action === "REASSESS_EVIDENCE") {
    if (hypothesis.status !== "ACCEPTED_FOR_SCENARIO" || status !== "ACCEPTED_FOR_SCENARIO") {
      return { ok: false, reason: "invalid-status" };
    }
  } else if (!HYPOTHESIS_TRANSITIONS[hypothesis.status].includes(status)) {
    return { ok: false, reason: "invalid-status" };
  }
  const stamp = nowIso(input.now);
  const review: CausalHypothesisReviewEvent = Object.freeze({
    reviewId: idFor("review", workspaceId, current.nextReview),
    operationId,
    investigationId: hypothesis.investigationId,
    hypothesisId: hypothesis.hypothesisId,
    workspaceId,
    deckId,
    action: input.action,
    previousStatus: hypothesis.status,
    newStatus: status,
    managerNote: input.managerNote.trim(),
    readiness: input.readiness,
    evidenceFingerprint: input.evidenceFingerprint,
    hypothesisStatement: hypothesis.statement,
    limitationsAcknowledged: input.limitationsAcknowledged,
    warnings: Object.freeze(input.warnings.map((warning) => warning.trim())),
    createdAt: stamp,
  });
  const nextHypothesis: CausalHypothesis = Object.freeze({
    ...hypothesis,
    status,
    evidenceSupportedCausal: false,
    updatedAt: stamp,
  });
  const write = writeBucket(workspaceId, Object.freeze({
    ...current,
    nextReview: current.nextReview + 1,
    hypotheses: Object.freeze(current.hypotheses.map((entry) => entry.hypothesisId === nextHypothesis.hypothesisId ? nextHypothesis : entry)),
    reviews: Object.freeze([...current.reviews, review]),
  }));
  if (write) return { ok: false, reason: write };
  return { ok: true, value: Object.freeze({ hypothesis: nextHypothesis, review }) };
}

export function forgetWorkspaceCausalInvestigations(workspaceId: string): CausalInvestigationResult<null> {
  const failure = blocked();
  if (failure) return { ok: false, reason: failure };
  const current = snapshot();
  if (!current.workspaces[workspaceId]) return { ok: true, value: null };
  const workspaces = { ...current.workspaces };
  delete workspaces[workspaceId];
  const write = commit(Object.freeze({ ...current, workspaces: Object.freeze(workspaces) }));
  if (write) return { ok: false, reason: write };
  return { ok: true, value: null };
}

export function resetCausalInvestigationDomainForTests(nextStorage?: Storage | null): void {
  storageOverride = nextStorage === undefined ? undefined : nextStorage;
  authority = { status: "empty", snapshot: emptySnapshot() };
  hydrated = false;
  baseRaw = null;
  revision = 0;
}
