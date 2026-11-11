/**
 * NPA-T NEXOCAUSE-HYPOTHESIS-REVIEW:1
 *
 * Manager review of one hypothesis. Status changes and review history are
 * committed together by the canonical investigation authority. Readiness is
 * derived from the current evidence report and is not a causal probability.
 */

import type { VaiRelationshipLadder } from "../vai/vaiCausalContract.ts";
import { isProtectedDemoWorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import {
  canonicalCausalInvestigationAuthorityStatus,
  commitCausalHypothesisReview,
  getCausalHypothesis,
  getCausalInvestigation,
  listCausalHypothesisReviews,
  refreshCausalInvestigationsFromStorage,
  type CausalHypothesis,
  type CausalHypothesisReadiness,
  type CausalHypothesisReviewAction,
  type CausalHypothesisReviewEvent,
  type CausalHypothesisStatus,
  type CausalInvestigationFailure,
  type CausalInvestigationStatus,
} from "./canonicalCausalInvestigationDomain.ts";
import { canonicalObjectAuthorityStatus } from "./canonicalObjectRegistry.ts";
import {
  resolveCausalInvestigationEvidence,
  type CausalEvidenceItem,
  type CausalEvidenceReport,
} from "./causalInvestigationEvidenceResolver.ts";

function authorityFailure(): CausalHypothesisReviewFailure | null {
  const investigation = canonicalCausalInvestigationAuthorityStatus();
  if (investigation === "corrupt" || investigation === "unsupported-version") return investigation;
  const objects = canonicalObjectAuthorityStatus();
  if (objects === "corrupt" || objects === "unsupported-version") return objects;
  return null;
}

export const causalHypothesisReviewIdentity =
  "NPA-T NEXOCAUSE-HYPOTHESIS-REVIEW:1/CausalHypothesisReview" as const;

export const CAUSAL_REVIEW_ACCEPTANCE_MEANING =
  "Accepted for scenario evaluation. Causation is not established." as const;

export type CausalHypothesisReviewFailure =
  | CausalInvestigationFailure
  | "stale-evidence"
  | "acknowledgment-required"
  | "blocked-evidence"
  | "unchanged-evidence";

export type CausalHypothesisReadinessAssessment = Readonly<{
  investigationId: string;
  hypothesisId: string;
  hypothesisStatus: CausalHypothesisStatus;
  classification: CausalHypothesisReadiness;
  supportingEvidenceCount: number;
  conflictingEvidenceCount: number;
  neutralEvidenceCount: number;
  missingEvidenceCount: number;
  staleEvidenceCount: number;
  unauthorizedEvidenceCount: number;
  corruptEvidenceCount: number;
  managerReportedCount: number;
  warnings: readonly string[];
  evidenceFingerprint: string;
  truncated: boolean;
  causalLadder: VaiRelationshipLadder | null;
  evidenceSupportedCausal: false;
  items: readonly CausalEvidenceItem[];
}>;

export type CausalHypothesisReviewReceipt = Readonly<{
  hypothesis: CausalHypothesis;
  review: CausalHypothesisReviewEvent;
  readiness: CausalHypothesisReadinessAssessment;
  investigationStatus: CausalInvestigationStatus;
  replayed: boolean;
  evidenceSupportedCausal: false;
  acceptanceMeaning: typeof CAUSAL_REVIEW_ACCEPTANCE_MEANING;
}>;

export type CausalHypothesisReviewResult<T> =
  | Readonly<{ ok: true; value: T }>
  | Readonly<{ ok: false; reason: CausalHypothesisReviewFailure }>;

function digest(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `evidence:${(hash >>> 0).toString(16)}`;
}

/** Latest acceptance or reassessment. Earlier review events stay unchanged. */
export function latestEvidenceAuthorization(
  workspaceId: string,
  hypothesisId: string,
): CausalHypothesisReviewEvent | null {
  return [...listCausalHypothesisReviews(workspaceId, hypothesisId)]
    .reverse()
    .find((entry) => (
      entry.action === "ACCEPT_FOR_SCENARIO" || entry.action === "REASSESS_EVIDENCE"
    ) && entry.newStatus === "ACCEPTED_FOR_SCENARIO") ?? null;
}

export function causalEvidenceFingerprint(
  workspaceId: string,
  deckId: string,
  investigationId: string,
  hypothesisId: string,
  items: readonly CausalEvidenceItem[],
): string {
  const ordered = [...items].sort((left, right) => left.observationId < right.observationId ? -1 : left.observationId > right.observationId ? 1 : 0);
  const body = JSON.stringify({
    workspaceId,
    deckId,
    investigationId,
    hypothesisId,
    items: ordered.map((item) => ({
      observationId: item.observationId,
      availability: item.availability,
      managerRole: item.managerRole,
      objectState: item.objectState,
      canonicalObjectId: item.canonicalObjectId,
      datasetId: item.datasetId,
      storedImportId: item.storedImportId,
      currentImportId: item.currentImportId,
      sourceKey: item.sourceKey,
      fieldName: item.fieldName,
      measurementId: item.measurementId,
      unit: item.unit,
      periodLabel: item.periodLabel,
      resolvedValue: item.resolvedValue,
      comparisonStatus: item.comparisonStatus,
    })),
  });
  return digest(body);
}

function warningsFor(report: CausalEvidenceReport): string[] {
  const warnings: string[] = [];
  if (report.truncated) warnings.push("Evidence reading is truncated and does not cover every observation.");
  if (report.items.some((item) => item.availability === "STALE_IMPORT")) warnings.push("A stale import is not current supporting evidence.");
  if (report.items.some((item) => item.availability === "MISSING" || item.availability === "MISSING_SOURCE" || item.availability === "MISSING_FIELD" || item.availability === "DELETED")) {
    warnings.push("Required evidence is missing or no longer current.");
  }
  if (report.items.some((item) => item.availability === "CONFLICTING")) warnings.push("Conflicting measurements are unresolved.");
  if (report.items.some((item) => item.availability === "MANAGER_REPORTED")) warnings.push("A manager statement is not a verified Dataset measurement.");
  if (report.items.some((item) => item.availability === "DETACHED" || item.availability === "UNAUTHORIZED")) warnings.push("Unauthorized evidence values are withheld.");
  if (report.items.some((item) => item.availability === "ARCHIVED")) warnings.push("An archived observation is not current evidence.");
  if (report.items.some((item) => item.comparisonStatus === "INSUFFICIENT_COMPARABILITY")) warnings.push("Some measurements are not comparable.");
  return warnings;
}

function classify(report: CausalEvidenceReport, counts: {
  supporting: number;
  conflicting: number;
  missing: number;
  stale: number;
  unauthorized: number;
  corrupt: number;
  managerReported: number;
}): CausalHypothesisReadiness {
  if (counts.corrupt > 0) return "BLOCKED";
  const current = report.items.some((item) => item.availability === "CURRENT" || item.availability === "CONFLICTING");
  const limited = counts.missing > 0 || counts.stale > 0 || counts.unauthorized > 0 || counts.conflicting > 0
    || counts.managerReported > 0 || report.truncated
    || report.items.some((item) => item.availability === "ARCHIVED" || item.comparisonStatus === "INSUFFICIENT_COMPARABILITY");
  if (!current) return "NEEDS_EVIDENCE";
  if (limited) return "REVIEW_WITH_LIMITATIONS";
  return "READY_FOR_MANAGER_REVIEW";
}

function assessmentFrom(report: CausalEvidenceReport): CausalHypothesisReadinessAssessment {
  const counts = {
    supporting: 0,
    conflicting: 0,
    neutral: 0,
    missing: 0,
    stale: 0,
    unauthorized: 0,
    corrupt: 0,
    managerReported: 0,
  };
  for (const item of report.items) {
    if (item.availability === "CORRUPT" || item.availability === "UNSUPPORTED_VERSION") counts.corrupt += 1;
    if (item.availability === "STALE_IMPORT") counts.stale += 1;
    if (item.availability === "UNAUTHORIZED" || item.availability === "DETACHED") counts.unauthorized += 1;
    if (item.availability === "MISSING" || item.availability === "MISSING_SOURCE" || item.availability === "MISSING_FIELD" || item.availability === "DELETED") counts.missing += 1;
    if (item.availability === "MANAGER_REPORTED") counts.managerReported += 1;
    if (item.availability === "CURRENT" && item.managerRole === "SUPPORTING") counts.supporting += 1;
    if (item.availability === "CONFLICTING" || (item.managerRole === "CONFLICTING" && item.availability === "CURRENT")) counts.conflicting += 1;
    if (item.managerRole === "NEUTRAL" && (item.availability === "CURRENT" || item.availability === "MANAGER_REPORTED")) counts.neutral += 1;
  }
  return Object.freeze({
    investigationId: report.investigationId,
    hypothesisId: report.hypothesisId,
    hypothesisStatus: report.hypothesisStatus as CausalHypothesisStatus,
    classification: classify(report, counts),
    supportingEvidenceCount: counts.supporting,
    conflictingEvidenceCount: counts.conflicting,
    neutralEvidenceCount: counts.neutral,
    missingEvidenceCount: counts.missing,
    staleEvidenceCount: counts.stale,
    unauthorizedEvidenceCount: counts.unauthorized,
    corruptEvidenceCount: counts.corrupt,
    managerReportedCount: counts.managerReported,
    warnings: Object.freeze(warningsFor(report)),
    evidenceFingerprint: causalEvidenceFingerprint(report.workspaceId, report.deckId, report.investigationId, report.hypothesisId, report.items),
    truncated: report.truncated,
    causalLadder: report.causalLadder,
    evidenceSupportedCausal: false,
    items: report.items,
  });
}

export function assessCausalHypothesisReadiness(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly investigationId: string;
  readonly hypothesisId: string;
}): CausalHypothesisReviewResult<CausalHypothesisReadinessAssessment> {
  const blockedAuthority = authorityFailure();
  if (blockedAuthority) return { ok: false, reason: blockedAuthority };
  const workspaceId = input.workspaceId.trim();
  if (isProtectedDemoWorkspaceId(workspaceId)) return { ok: false, reason: "protected-workspace" };
  const resolution = resolveCausalInvestigationEvidence({
    workspaceId,
    deckId: input.deckId,
    investigationId: input.investigationId,
    hypothesisId: input.hypothesisId,
  });
  if (resolution.status === "blocked") return { ok: false, reason: resolution.reason };
  return { ok: true, value: assessmentFrom(resolution.report) };
}

function sameSubmission(event: CausalHypothesisReviewEvent, input: {
  readonly action: CausalHypothesisReviewAction;
  readonly managerNote: string;
  readonly acknowledgeLimitations: boolean;
  readonly evidenceFingerprint?: string;
}): boolean {
  return event.action === input.action
    && event.managerNote === input.managerNote.trim()
    && event.limitationsAcknowledged === input.acknowledgeLimitations
    && (input.evidenceFingerprint == null || event.evidenceFingerprint === input.evidenceFingerprint);
}

export function reviewCausalHypothesis(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly investigationId: string;
  readonly hypothesisId: string;
  readonly action: CausalHypothesisReviewAction;
  readonly managerNote: string;
  readonly operationId: string;
  readonly acknowledgeLimitations?: boolean;
  readonly evidenceFingerprint?: string;
  readonly hypothesisStatement?: string;
  readonly now?: string;
}): CausalHypothesisReviewResult<CausalHypothesisReviewReceipt> {
  const blockedAuthority = authorityFailure();
  if (blockedAuthority) return { ok: false, reason: blockedAuthority };
  refreshCausalInvestigationsFromStorage();
  const workspaceId = input.workspaceId.trim();
  if (isProtectedDemoWorkspaceId(workspaceId)) return { ok: false, reason: "protected-workspace" };
  const investigation = getCausalInvestigation(workspaceId, input.investigationId);
  if (!investigation || investigation.workspaceId !== workspaceId) return { ok: false, reason: "missing" };
  if (investigation.deckId !== input.deckId.trim()) return { ok: false, reason: "wrong-deck" };
  const hypothesis = getCausalHypothesis(workspaceId, input.hypothesisId);
  if (!hypothesis || hypothesis.investigationId !== investigation.investigationId) return { ok: false, reason: "missing" };
  const acknowledgeLimitations = input.acknowledgeLimitations === true;
  const existing = listCausalHypothesisReviews(workspaceId, hypothesis.hypothesisId)
    .find((entry) => entry.operationId === input.operationId.trim());
  if (existing) {
    if (!sameSubmission(existing, { ...input, acknowledgeLimitations })) return { ok: false, reason: "duplicate" };
    const readiness = assessCausalHypothesisReadiness(input);
    if (!readiness.ok && (readiness.reason === "corrupt" || readiness.reason === "unsupported-version")) return readiness;
    const current = getCausalHypothesis(workspaceId, hypothesis.hypothesisId);
    if (!current || readiness.ok === false) {
      return {
        ok: true,
        value: Object.freeze({
          hypothesis: current ?? hypothesis,
          review: existing,
          readiness: Object.freeze({
            investigationId: existing.investigationId,
            hypothesisId: existing.hypothesisId,
            hypothesisStatus: current?.status ?? existing.newStatus,
            classification: existing.readiness,
            supportingEvidenceCount: 0,
            conflictingEvidenceCount: 0,
            neutralEvidenceCount: 0,
            missingEvidenceCount: 0,
            staleEvidenceCount: 0,
            unauthorizedEvidenceCount: 0,
            corruptEvidenceCount: 0,
            managerReportedCount: 0,
            warnings: existing.warnings,
            evidenceFingerprint: existing.evidenceFingerprint,
            truncated: false,
            causalLadder: null,
            evidenceSupportedCausal: false,
            items: Object.freeze([]),
          }),
          investigationStatus: investigation.lifecycleStatus,
          replayed: true,
          evidenceSupportedCausal: false,
          acceptanceMeaning: CAUSAL_REVIEW_ACCEPTANCE_MEANING,
        }),
      };
    }
    return {
      ok: true,
      value: Object.freeze({
        hypothesis: current,
        review: existing,
        readiness: readiness.value,
        investigationStatus: investigation.lifecycleStatus,
        replayed: true,
        evidenceSupportedCausal: false,
        acceptanceMeaning: CAUSAL_REVIEW_ACCEPTANCE_MEANING,
      }),
    };
  }
  const first = assessCausalHypothesisReadiness(input);
  if (!first.ok) return first;
  const second = assessCausalHypothesisReadiness(input);
  if (!second.ok) return second;
  if (first.value.evidenceFingerprint !== second.value.evidenceFingerprint) return { ok: false, reason: "stale-evidence" };
  if (input.evidenceFingerprint != null && input.evidenceFingerprint !== first.value.evidenceFingerprint) {
    return { ok: false, reason: "stale-evidence" };
  }
  if (
    input.hypothesisStatement != null
    && input.hypothesisStatement.trim().replace(/\s+/g, " ") !== hypothesis.statement.trim().replace(/\s+/g, " ")
  ) {
    return { ok: false, reason: "stale-evidence" };
  }
  if (input.action === "ACCEPT_FOR_SCENARIO" || input.action === "REASSESS_EVIDENCE") {
    if (!acknowledgeLimitations) return { ok: false, reason: "acknowledgment-required" };
    if (input.evidenceFingerprint == null) return { ok: false, reason: "acknowledgment-required" };
    if (first.value.classification === "BLOCKED") return { ok: false, reason: "blocked-evidence" };
  }
  if (input.action === "REASSESS_EVIDENCE") {
    const authorization = latestEvidenceAuthorization(workspaceId, hypothesis.hypothesisId);
    if (!authorization) return { ok: false, reason: "missing" };
    if (authorization.evidenceFingerprint === first.value.evidenceFingerprint) {
      return { ok: false, reason: "unchanged-evidence" };
    }
  }
  const committed = commitCausalHypothesisReview({
    workspaceId,
    deckId: input.deckId,
    hypothesisId: input.hypothesisId,
    operationId: input.operationId,
    action: input.action,
    managerNote: input.managerNote,
    readiness: first.value.classification,
    evidenceFingerprint: first.value.evidenceFingerprint,
    limitationsAcknowledged: acknowledgeLimitations,
    warnings: first.value.warnings,
    now: input.now,
  });
  if (!committed.ok) return committed;
  const parent = getCausalInvestigation(workspaceId, input.investigationId);
  return {
    ok: true,
    value: Object.freeze({
      hypothesis: committed.value.hypothesis,
      review: committed.value.review,
      readiness: Object.freeze({ ...first.value, hypothesisStatus: committed.value.hypothesis.status }),
      investigationStatus: parent?.lifecycleStatus ?? investigation.lifecycleStatus,
      replayed: false,
      evidenceSupportedCausal: false,
      acceptanceMeaning: CAUSAL_REVIEW_ACCEPTANCE_MEANING,
    }),
  };
}
