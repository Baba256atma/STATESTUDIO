/**
 * NPA-T NEXOCAUSE-EVIDENCE-REFERENCES:1
 *
 * Read-only resolution of committed Dataset evidence for one hypothesis.
 * Derived values are not written back to investigations, objects, or snapshots.
 * A manager evidence role is not an analytical conclusion, and no reading
 * establishes causation.
 */

import { resolveManagerDeckDataset } from "../deck/nexoraDeckDatasetReferenceAuthority.ts";
import { getCsvRealDataImport, getCsvRemovedSourceReference } from "../data-reality/csvRealDataImportStore.ts";
import { resolveVaiCausalSafety } from "../vai/vaiCausalResolver.ts";
import { vaiFoundationIdentity } from "../vai/vaiIdentity.ts";
import type { VaiRelationshipLadder, VaiSafeStatementClass } from "../vai/vaiCausalContract.ts";
import { isProtectedDemoWorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import {
  canonicalCausalInvestigationAuthorityStatus,
  getCausalHypothesis,
  getCausalInvestigation,
  getCausalObservation,
  type CausalEvidenceRole,
  type CausalHypothesis,
  type CausalObservation,
} from "./canonicalCausalInvestigationDomain.ts";
import { readCommittedDatasetSnapshot } from "./canonicalDatasetEntityPipeline.ts";
import {
  canonicalObjectAuthorityStatus,
  getCanonicalObject,
} from "./canonicalObjectRegistry.ts";

export const causalInvestigationEvidenceIdentity =
  "NPA-T NEXOCAUSE-EVIDENCE-REFERENCES:1/CausalInvestigationEvidenceResolver" as const;

export const CAUSAL_EVIDENCE_OBSERVATION_LIMIT = 100 as const;
export const CAUSAL_EVIDENCE_ITEM_LIMIT = 100 as const;

/** Approved identity only. Similar column names are not treated as the same measurement. */
export const CAUSAL_APPROVED_MEASUREMENT_ALIASES: Readonly<Record<string, string>> = Object.freeze({
  capacity: "capacityPerHour",
});

export const CAUSAL_DATASET_SCHEMA_VERSION = "rdi2.csv.v1" as const;

export type CausalEvidenceAvailability =
  | "CURRENT"
  | "CONFLICTING"
  | "MISSING"
  | "DELETED"
  | "DETACHED"
  | "STALE_IMPORT"
  | "UNAUTHORIZED"
  | "MISSING_SOURCE"
  | "MISSING_FIELD"
  | "MANAGER_REPORTED"
  | "ARCHIVED"
  | "CORRUPT"
  | "UNSUPPORTED_VERSION";

export type CausalComparisonStatus =
  | "NOT_COMPARED"
  | "MATCHES_CANONICAL"
  | "DIFFERS_FROM_CANONICAL"
  | "CONFLICTING"
  | "INSUFFICIENT_COMPARABILITY";

export type CausalEvidenceItem = Readonly<{
  observationId: string;
  statement: string;
  managerRole: CausalEvidenceRole | "UNSPECIFIED";
  availability: CausalEvidenceAvailability;
  objectState: "none" | "active" | "archived" | "deleted" | "missing" | "unauthorized";
  objectName: string | null;
  canonicalObjectId: string | null;
  datasetId: string | null;
  storedImportId: string | null;
  currentImportId: string | null;
  sourceKey: string | null;
  fieldName: string | null;
  measurementId: string | null;
  resolvedValue: string | null;
  unit: string | null;
  periodLabel: string | null;
  canonicalAttribute: string | null;
  canonicalValue: string | null;
  comparisonStatus: CausalComparisonStatus;
}>;

export type CausalEvidenceReport = Readonly<{
  identity: typeof causalInvestigationEvidenceIdentity;
  workspaceId: string;
  deckId: string;
  investigationId: string;
  hypothesisId: string;
  hypothesisStatus: string;
  items: readonly CausalEvidenceItem[];
  truncated: boolean;
  omittedObservations: number;
  duplicateReferences: number;
  causalLadder: VaiRelationshipLadder;
  causalStatementClass: VaiSafeStatementClass;
  causalStatement: string;
  evidenceSupportedCausal: false;
}>;

export type CausalEvidenceResolution =
  | Readonly<{ status: "ready"; report: CausalEvidenceReport }>
  | Readonly<{
    status: "blocked";
    reason: "corrupt" | "unsupported-version" | "protected-workspace" | "missing" | "wrong-deck" | "unauthorized";
  }>;

function measurementId(fieldName: string | null): string | null {
  if (!fieldName) return null;
  return CAUSAL_APPROVED_MEASUREMENT_ALIASES[fieldName] ?? fieldName;
}

function roleFor(hypothesis: CausalHypothesis, observationId: string): CausalEvidenceRole | "UNSPECIFIED" {
  return hypothesis.evidenceRoles.find((role) => role.observationId === observationId)?.role ?? "UNSPECIFIED";
}

function blankItem(observation: CausalObservation, hypothesis: CausalHypothesis, availability: CausalEvidenceAvailability): CausalEvidenceItem {
  return Object.freeze({
    observationId: observation.observationId,
    statement: observation.statement,
    managerRole: roleFor(hypothesis, observation.observationId),
    availability,
    objectState: observation.canonicalObjectId ? "missing" : "none",
    objectName: null,
    canonicalObjectId: observation.canonicalObjectId,
    datasetId: observation.datasetReference?.datasetId ?? null,
    storedImportId: observation.datasetReference?.importId ?? null,
    currentImportId: null,
    sourceKey: observation.datasetReference?.sourceKey ?? null,
    fieldName: observation.datasetReference?.fieldName ?? null,
    measurementId: measurementId(observation.datasetReference?.fieldName ?? null),
    resolvedValue: null,
    unit: observation.unit,
    periodLabel: observation.periodLabel,
    canonicalAttribute: null,
    canonicalValue: null,
    comparisonStatus: "NOT_COMPARED",
  });
}

function objectView(workspaceId: string, deckId: string, canonicalObjectId: string | null): Pick<CausalEvidenceItem, "objectState" | "objectName" | "canonicalAttribute" | "canonicalValue"> {
  if (!canonicalObjectId) return { objectState: "none", objectName: null, canonicalAttribute: null, canonicalValue: null };
  if (!canonicalObjectId.startsWith(`org:${encodeURIComponent(workspaceId)}:`)) {
    return { objectState: "unauthorized", objectName: null, canonicalAttribute: null, canonicalValue: null };
  }
  const object = getCanonicalObject(workspaceId, canonicalObjectId);
  if (!object) return { objectState: "missing", objectName: null, canonicalAttribute: null, canonicalValue: null };
  if (object.lifecycleStatus === "DELETED") return { objectState: "deleted", objectName: null, canonicalAttribute: null, canonicalValue: null };
  if (!object.deckIds.includes(deckId)) return { objectState: "unauthorized", objectName: null, canonicalAttribute: null, canonicalValue: null };
  if (object.lifecycleStatus === "ARCHIVED") {
    return { objectState: "archived", objectName: object.displayName, canonicalAttribute: null, canonicalValue: null };
  }
  return { objectState: "active", objectName: object.displayName, canonicalAttribute: null, canonicalValue: null };
}

function resolveItem(workspaceId: string, deckId: string, hypothesis: CausalHypothesis, observation: CausalObservation): CausalEvidenceItem {
  const base = blankItem(observation, hypothesis, "MISSING");
  const object = objectView(workspaceId, deckId, observation.canonicalObjectId);
  if (observation.lifecycleStatus === "ARCHIVED") return Object.freeze({ ...base, ...object, availability: "ARCHIVED" });
  if (observation.lifecycleStatus === "DELETED") return Object.freeze({ ...base, ...object, availability: "DELETED", objectName: null, canonicalValue: null });
  if (!observation.datasetReference) return Object.freeze({ ...base, ...object, availability: "MANAGER_REPORTED" });
  const reference = observation.datasetReference;
  if (getCsvRemovedSourceReference(workspaceId, reference.datasetId)) {
    return Object.freeze({ ...base, ...object, availability: "DELETED" });
  }
  const assigned = resolveManagerDeckDataset({ workspaceId, deckId, datasetId: reference.datasetId });
  if (!assigned) {
    const owned = getCsvRealDataImport(workspaceId, reference.datasetId);
    return Object.freeze({
      ...base,
      ...object,
      availability: owned && owned.workspaceId === workspaceId ? "DETACHED" : "MISSING",
    });
  }
  if (assigned.workspaceId !== workspaceId) return Object.freeze({ ...base, ...object, availability: "UNAUTHORIZED" });
  const schemaVersion = assigned.prepared.snapshot?.source.identity.schemaVersion;
  if (schemaVersion && schemaVersion !== CAUSAL_DATASET_SCHEMA_VERSION) {
    return Object.freeze({ ...base, ...object, availability: "UNSUPPORTED_VERSION", currentImportId: assigned.importId });
  }
  if (reference.importId && assigned.importId !== reference.importId) {
    return Object.freeze({
      ...base,
      ...object,
      availability: "STALE_IMPORT",
      currentImportId: assigned.importId,
    });
  }
  const snapshot = readCommittedDatasetSnapshot(workspaceId, reference.datasetId);
  if (!snapshot.ok) {
    const availability = snapshot.reason === "dataset-deleted" ? "DELETED" : snapshot.reason === "malformed-dataset" ? "CORRUPT" : "MISSING";
    return Object.freeze({ ...base, ...object, availability, currentImportId: assigned.importId });
  }
  const row = reference.sourceKey ? snapshot.value.rows.find((candidate) => Object.values(candidate).includes(reference.sourceKey as string)) ?? null : snapshot.value.rows[0] ?? null;
  if (reference.sourceKey && !row) return Object.freeze({ ...base, ...object, availability: "MISSING_SOURCE", currentImportId: snapshot.value.importId });
  if (reference.fieldName && !snapshot.value.columns.includes(reference.fieldName)) {
    return Object.freeze({ ...base, ...object, availability: "MISSING_FIELD", currentImportId: snapshot.value.importId });
  }
  const fieldName = reference.fieldName;
  const resolvedValue = fieldName && row ? row[fieldName] ?? null : null;
  if (fieldName && (resolvedValue == null || resolvedValue.length === 0)) {
    return Object.freeze({ ...base, ...object, availability: "MISSING_FIELD", currentImportId: snapshot.value.importId });
  }
  const attribute = measurementId(fieldName);
  let canonicalAttribute: string | null = null;
  let canonicalValue: string | null = null;
  let comparisonStatus: CausalComparisonStatus = "NOT_COMPARED";
  if (object.objectState === "active" && attribute && observation.canonicalObjectId) {
    const canonical = getCanonicalObject(workspaceId, observation.canonicalObjectId);
    const stored = canonical?.attributes[attribute];
    if (stored !== undefined) {
      canonicalAttribute = attribute;
      canonicalValue = String(stored);
      comparisonStatus = canonicalValue === resolvedValue ? "MATCHES_CANONICAL" : "DIFFERS_FROM_CANONICAL";
    }
  }
  return Object.freeze({
    ...base,
    ...object,
    availability: "CURRENT",
    currentImportId: snapshot.value.importId,
    fieldName,
    measurementId: attribute,
    resolvedValue,
    canonicalAttribute,
    canonicalValue,
    comparisonStatus,
  });
}

function comparable(left: CausalEvidenceItem, right: CausalEvidenceItem): "compare" | "insufficient" | "skip" {
  if (left.availability !== "CURRENT" || right.availability !== "CURRENT") return "skip";
  if (!left.measurementId || left.measurementId !== right.measurementId) return "skip";
  if (!left.canonicalObjectId || left.canonicalObjectId !== right.canonicalObjectId) return "insufficient";
  if ((left.unit ?? "") !== (right.unit ?? "") || (left.periodLabel ?? "") !== (right.periodLabel ?? "")) return "insufficient";
  return "compare";
}

function applyComparisons(items: CausalEvidenceItem[]): CausalEvidenceItem[] {
  const next = items.map((item) => item);
  for (let index = 0; index < next.length; index += 1) {
    for (let other = index + 1; other < next.length; other += 1) {
      if (comparable(next[index]!, next[other]!) !== "compare") continue;
      if (next[index]!.resolvedValue === next[other]!.resolvedValue) continue;
      next[index] = Object.freeze({ ...next[index]!, availability: "CONFLICTING", comparisonStatus: "CONFLICTING" });
      next[other] = Object.freeze({ ...next[other]!, availability: "CONFLICTING", comparisonStatus: "CONFLICTING" });
    }
  }
  for (let index = 0; index < next.length; index += 1) {
    for (let other = index + 1; other < next.length; other += 1) {
      if (comparable(items[index]!, items[other]!) !== "insufficient") continue;
      for (const target of [index, other]) {
        if (next[target]!.availability !== "CURRENT" || next[target]!.comparisonStatus === "CONFLICTING") continue;
        next[target] = Object.freeze({ ...next[target]!, comparisonStatus: "INSUFFICIENT_COMPARABILITY" });
      }
    }
  }
  return next;
}

function causalReading(hypothesis: CausalHypothesis, items: readonly CausalEvidenceItem[]) {
  const current = items.filter((item) => item.availability === "CURRENT" || item.availability === "CONFLICTING");
  const reading = resolveVaiCausalSafety({
    relationshipId: hypothesis.hypothesisId,
    analysisContextId: hypothesis.investigationId,
    source: {
      identity: vaiFoundationIdentity,
      variableId: hypothesis.hypothesisId,
      displayName: hypothesis.statement,
      analysisContextId: hypothesis.investigationId,
      role: "OUTCOME",
      roleIsContextual: true,
      roleIsPermanentClassification: false,
      isExecutiveObject: false,
      objectKind: null,
      value: { kind: "UNKNOWN" },
      unit: { kind: "UNKNOWN" },
      direction: "UNKNOWN",
      confidence: "UNKNOWN",
      semanticStatus: "BOUNDED",
      semanticMeaning: null,
      provenance: { sourceKind: "EVIDENCE", authority: causalInvestigationEvidenceIdentity, sourceRef: hypothesis.hypothesisId },
      relatedObjectIds: hypothesis.canonicalObjectIds,
      causalAssertion: false,
      causalClaim: null,
      canonicalMutation: false,
    },
    target: { kind: "OBJECT", id: hypothesis.canonicalObjectIds[0] ?? hypothesis.investigationId },
    evidence: current.map((item) => Object.freeze({
      evidenceRef: `${item.datasetId ?? "manager"}:${item.observationId}`,
      kind: item.availability === "CONFLICTING" ? "CONTRADICTION" as const : "CO_OBSERVATION" as const,
      polarity: item.availability === "CONFLICTING" ? "CONFLICTING" as const : "NEUTRAL" as const,
      authority: "CC:8" as const,
    })),
    scope: { objectScope: hypothesis.workspaceId },
    causalHypothesis: true,
    coreInt3: { relationKind: "recorded-association", causeEstablished: false },
  });
  const ladder = reading.relationship.evidenceSupportedCausal || reading.relationship.relationshipStatus === "EVIDENCE_SUPPORTED_CAUSAL"
    ? "CAUSAL_HYPOTHESIS"
    : reading.relationship.relationshipStatus;
  return Object.freeze({
    ladder,
    statementClass: reading.relationship.safeStatementClass,
    statement: reading.relationship.safeStatement,
    evidenceSupportedCausal: false as const,
  });
}

export function resolveCausalInvestigationEvidence(input: {
  readonly workspaceId: string;
  readonly deckId: string;
  readonly investigationId: string;
  readonly hypothesisId: string;
}): CausalEvidenceResolution {
  const investigationAuthority = canonicalCausalInvestigationAuthorityStatus();
  if (investigationAuthority === "corrupt") return { status: "blocked", reason: "corrupt" };
  if (investigationAuthority === "unsupported-version") return { status: "blocked", reason: "unsupported-version" };
  const objectAuthority = canonicalObjectAuthorityStatus();
  if (objectAuthority === "corrupt") return { status: "blocked", reason: "corrupt" };
  if (objectAuthority === "unsupported-version") return { status: "blocked", reason: "unsupported-version" };
  const workspaceId = input.workspaceId.trim();
  if (isProtectedDemoWorkspaceId(workspaceId)) return { status: "blocked", reason: "protected-workspace" };
  const investigation = getCausalInvestigation(workspaceId, input.investigationId);
  if (!investigation || investigation.workspaceId !== workspaceId) return { status: "blocked", reason: "missing" };
  if (investigation.deckId !== input.deckId.trim()) return { status: "blocked", reason: "wrong-deck" };
  const hypothesis = getCausalHypothesis(workspaceId, input.hypothesisId);
  if (!hypothesis || hypothesis.investigationId !== investigation.investigationId || hypothesis.workspaceId !== workspaceId) {
    return { status: "blocked", reason: "missing" };
  }
  if (hypothesis.deckId !== investigation.deckId) return { status: "blocked", reason: "unauthorized" };
  const seen = new Set<string>();
  let duplicateReferences = 0;
  const uniqueIds: string[] = [];
  for (const observationId of hypothesis.observationIds) {
    if (seen.has(observationId)) {
      duplicateReferences += 1;
      continue;
    }
    seen.add(observationId);
    uniqueIds.push(observationId);
  }
  const omittedObservations = Math.max(0, uniqueIds.length - CAUSAL_EVIDENCE_OBSERVATION_LIMIT);
  const selected = uniqueIds.slice(0, CAUSAL_EVIDENCE_OBSERVATION_LIMIT);
  const resolved: CausalEvidenceItem[] = [];
  for (const observationId of selected) {
    if (resolved.length >= CAUSAL_EVIDENCE_ITEM_LIMIT) break;
    const observation = getCausalObservation(workspaceId, observationId);
    if (!observation || observation.workspaceId !== workspaceId || observation.investigationId !== investigation.investigationId) {
      resolved.push(Object.freeze({
        ...blankItem({
          observationId,
          investigationId: investigation.investigationId,
          workspaceId,
          deckId: investigation.deckId,
          statement: "",
          canonicalObjectId: null,
          datasetReference: null,
          periodLabel: null,
          measureName: null,
          unit: null,
          lifecycleStatus: "ACTIVE",
          provenance: "MANAGER_DECLARED",
          createdAt: "",
          updatedAt: "",
        }, hypothesis, "MISSING"),
        statement: "",
      }));
      continue;
    }
    if (observation.deckId !== investigation.deckId) {
      resolved.push(Object.freeze({ ...blankItem(observation, hypothesis, "UNAUTHORIZED"), objectName: null, resolvedValue: null, canonicalValue: null }));
      continue;
    }
    resolved.push(resolveItem(workspaceId, investigation.deckId, hypothesis, observation));
  }
  const items = Object.freeze(applyComparisons(resolved));
  const causal = causalReading(hypothesis, items);
  return {
    status: "ready",
    report: Object.freeze({
      identity: causalInvestigationEvidenceIdentity,
      workspaceId,
      deckId: investigation.deckId,
      investigationId: investigation.investigationId,
      hypothesisId: hypothesis.hypothesisId,
      hypothesisStatus: hypothesis.status,
      items,
      truncated: omittedObservations > 0 || uniqueIds.length > CAUSAL_EVIDENCE_ITEM_LIMIT,
      omittedObservations: omittedObservations + Math.max(0, selected.length - CAUSAL_EVIDENCE_ITEM_LIMIT),
      duplicateReferences,
      causalLadder: causal.ladder,
      causalStatementClass: causal.statementClass,
      causalStatement: causal.statement,
      evidenceSupportedCausal: false,
    }),
  };
}
