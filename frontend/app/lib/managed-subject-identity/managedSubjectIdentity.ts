/**
 * NPA-T SUBJECT-IDENTITY:2 — Canonical Managed Subject Identity.
 *
 * Product-wide authority for declared cross-domain evidence membership.
 * Consumers resolve. This module declares. Timeline, Stage, Advisor, Data
 * Reality, and Historical Truth do not own the relationship.
 */

import { EXECUTIVE_OPERATIONS_RESOLVED_OBJECT_BINDINGS } from "../data-reality/demo/executiveOperationsObjectBindings.ts";

export const managedSubjectIdentityIdentity =
  "NPA-T SUBJECT-IDENTITY:2/CanonicalManagedSubjectIdentity" as const;

export const MANAGED_SUBJECT_IDENTITY_BOUNDARY = Object.freeze({
  architecturalRole: "CanonicalManagedSubjectIdentityAuthority" as const,
  ownsObservations: false as const,
  ownsKpis: false as const,
  ownsTimeline: false as const,
  ownsActivity: false as const,
  ownsHistoricalTruth: false as const,
  ownsStage: false as const,
  ownsAdvisor: false as const,
  ownsConversationAliases: false as const,
  ownsBcaConcepts: false as const,
  ownsNmiRelationships: false as const,
  ownsManagerObjectState: false as const,
  copiesBusinessState: false as const,
  createsHistory: false as const,
  inventsTimestamps: false as const,
  establishesCausation: false as const,
  promotesHierarchy: false as const,
  persistsRuntimeStore: false as const,
  usesSessionStorage: false as const,
  usesLocalStorage: false as const,
  admitsRmsGroundTruth: false as const,
  stringMatchingAuthority: false as const,
});

export const MANAGED_SUBJECT_IDENTITY_DOMAINS = Object.freeze([
  "canonical-management",
  "data-reality",
] as const);

export type ManagedSubjectIdentityDomain =
  (typeof MANAGED_SUBJECT_IDENTITY_DOMAINS)[number];

export const MANAGED_SUBJECT_BINDING_RELATIONSHIPS = Object.freeze([
  "EVIDENCE_FOR_MANAGED_SUBJECT",
] as const);

export type ManagedSubjectBindingRelationship =
  (typeof MANAGED_SUBJECT_BINDING_RELATIONSHIPS)[number];

export const MANAGED_SUBJECT_MATCH_KINDS = Object.freeze([
  "EXACT_CANONICAL_IDENTITY",
  "DECLARED_EVIDENCE_REFERENCE",
] as const);

export type ManagedSubjectMatchKind = (typeof MANAGED_SUBJECT_MATCH_KINDS)[number];

export type ManagedSubjectBindingProvenance = Readonly<{
  owner: typeof managedSubjectIdentityIdentity;
  declarationId: string;
  source: "internal-canonical-configuration";
}>;

export type CanonicalManagedSubjectBinding = Readonly<{
  declarationId: string;
  canonicalSubjectId: string;
  referenceDomain: ManagedSubjectIdentityDomain;
  referenceId: string;
  evidenceId: string | null;
  relationship: ManagedSubjectBindingRelationship;
  provenance: ManagedSubjectBindingProvenance;
}>;

export type CanonicalManagedSubjectCatalog = Readonly<{
  subjects: readonly string[];
  bindings: readonly CanonicalManagedSubjectBinding[];
}>;

export type ResolveCanonicalManagedSubjectInput = Readonly<{
  domain: ManagedSubjectIdentityDomain;
  referenceId: string;
  evidenceId?: string | null;
  catalog?: CanonicalManagedSubjectCatalog;
}>;

export type CanonicalManagedSubjectResolution =
  | Readonly<{
      status: "resolved";
      canonicalSubjectId: string;
      matchKind: ManagedSubjectMatchKind;
      relationship: ManagedSubjectBindingRelationship | "EXACT_CANONICAL_IDENTITY";
      provenance: ManagedSubjectBindingProvenance | null;
    }>
  | Readonly<{
      status: "unresolved";
      reason: "unknown-reference" | "missing-evidence-scope" | "unknown-domain";
    }>
  | Readonly<{
      status: "ambiguous";
      canonicalSubjectIds: readonly string[];
    }>;

export const MANAGED_SUBJECT_LEGACY_HELPERS = Object.freeze({
  NEXORA_DATA_REALITY_STAGE_IDENTITY_BINDINGS: "PRESENTATION_ONLY" as const,
  EXECUTIVE_OPERATIONS_OBJECT_IDENTITY_MAP: "PRESENTATION_ONLY" as const,
  publishedKpiSubjectsEquivalent: "DOMAIN_HELPER" as const,
  conversationAliases: "LANGUAGE_ONLY" as const,
  bcaAliases: "LANGUAGE_ONLY" as const,
  EXECUTIVE_OPERATIONS_RESOLVED_OBJECT_BINDINGS: "DATA_REALITY_NORMALIZATION" as const,
});

function binding(
  declarationId: string,
  canonicalSubjectId: string,
  referenceId: string,
  evidenceId: string,
): CanonicalManagedSubjectBinding {
  return Object.freeze({
    declarationId,
    canonicalSubjectId,
    referenceDomain: "data-reality" as const,
    referenceId,
    evidenceId,
    relationship: "EVIDENCE_FOR_MANAGED_SUBJECT" as const,
    provenance: Object.freeze({
      owner: managedSubjectIdentityIdentity,
      declarationId,
      source: "internal-canonical-configuration" as const,
    }),
  });
}

/**
 * Production Data Reality currently publishes usedCapacity, totalCapacity, and
 * kpi.production.capacity-utilization on nexora.executive-operations.object.production.
 * The object is Production, not Capacity. Subject-level binding would admit any
 * later Production KPI. Capacity is therefore evidence-scoped.
 */
export const CANONICAL_MANAGED_SUBJECT_BINDINGS = Object.freeze([
  binding(
    "cmsi:capacity:kpi.production.capacity-utilization",
    "obj-capacity",
    "nexora.executive-operations.object.production",
    "kpi.production.capacity-utilization",
  ),
]);

export const CANONICAL_MANAGED_SUBJECTS = Object.freeze(["obj-capacity"]);

export const CANONICAL_MANAGED_SUBJECT_CATALOG: CanonicalManagedSubjectCatalog =
  Object.freeze({
    subjects: CANONICAL_MANAGED_SUBJECTS,
    bindings: CANONICAL_MANAGED_SUBJECT_BINDINGS,
  });

function freezeIds(ids: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(ids)].sort((left, right) => left.localeCompare(right)));
}

function catalogOf(
  input?: CanonicalManagedSubjectCatalog,
): CanonicalManagedSubjectCatalog {
  return input ?? CANONICAL_MANAGED_SUBJECT_CATALOG;
}

function bindingKey(entry: CanonicalManagedSubjectBinding): string {
  return `${entry.referenceDomain}\0${entry.referenceId}\0${entry.evidenceId ?? ""}`;
}

export function validateCanonicalManagedSubjectCatalog(
  catalog: CanonicalManagedSubjectCatalog,
): Readonly<{
  ok: boolean;
  issues: readonly ("ambiguous-binding" | "unknown-subject")[];
}> {
  const subjects = new Set(catalog.subjects);
  const issues = new Set<"ambiguous-binding" | "unknown-subject">();
  const seen = new Map<string, string>();
  for (const entry of catalog.bindings) {
    if (!subjects.has(entry.canonicalSubjectId)) issues.add("unknown-subject");
    const key = bindingKey(entry);
    const prior = seen.get(key);
    if (prior != null && prior !== entry.canonicalSubjectId) issues.add("ambiguous-binding");
    else seen.set(key, entry.canonicalSubjectId);
  }
  return Object.freeze({
    ok: issues.size === 0,
    issues: Object.freeze([...issues]),
  });
}

export function resolveCanonicalManagedSubject(
  input: ResolveCanonicalManagedSubjectInput,
): CanonicalManagedSubjectResolution {
  if (!MANAGED_SUBJECT_IDENTITY_DOMAINS.includes(input.domain)) {
    return Object.freeze({ status: "unresolved", reason: "unknown-domain" });
  }
  const catalog = catalogOf(input.catalog);
  if (input.domain === "canonical-management") {
    if (catalog.subjects.includes(input.referenceId)) {
      return Object.freeze({
        status: "resolved",
        canonicalSubjectId: input.referenceId,
        matchKind: "EXACT_CANONICAL_IDENTITY",
        relationship: "EXACT_CANONICAL_IDENTITY",
        provenance: null,
      });
    }
    return Object.freeze({ status: "unresolved", reason: "unknown-reference" });
  }

  const matches = catalog.bindings.filter((entry) => {
    if (entry.referenceDomain !== input.domain) return false;
    if (entry.referenceId !== input.referenceId) return false;
    if (entry.evidenceId == null) return true;
    return entry.evidenceId === (input.evidenceId ?? null);
  });
  const uniqueSubjects = freezeIds(matches.map((entry) => entry.canonicalSubjectId));
  if (uniqueSubjects.length > 1) {
    return Object.freeze({ status: "ambiguous", canonicalSubjectIds: uniqueSubjects });
  }
  const exact = matches.find(
    (entry) => entry.evidenceId != null && entry.evidenceId === (input.evidenceId ?? null),
  );
  const subjectLevel = matches.find((entry) => entry.evidenceId == null);
  const chosen = exact ?? subjectLevel;
  if (chosen == null) {
    const scopedExists = catalog.bindings.some(
      (entry) =>
        entry.referenceDomain === input.domain &&
        entry.referenceId === input.referenceId &&
        entry.evidenceId != null,
    );
    return Object.freeze({
      status: "unresolved",
      reason: scopedExists && input.evidenceId == null ? "missing-evidence-scope" : "unknown-reference",
    });
  }
  return Object.freeze({
    status: "resolved",
    canonicalSubjectId: chosen.canonicalSubjectId,
    matchKind: "DECLARED_EVIDENCE_REFERENCE",
    relationship: chosen.relationship,
    provenance: chosen.provenance,
  });
}

export function isCanonicalSubjectEvidence(input: {
  readonly canonicalSubjectId: string;
  readonly domain: ManagedSubjectIdentityDomain;
  readonly referenceId: string;
  readonly evidenceId?: string | null;
  readonly catalog?: CanonicalManagedSubjectCatalog;
}): boolean {
  const resolved = resolveCanonicalManagedSubject({
    domain: input.domain,
    referenceId: input.referenceId,
    evidenceId: input.evidenceId,
    catalog: input.catalog,
  });
  return resolved.status === "resolved" && resolved.canonicalSubjectId === input.canonicalSubjectId;
}

export function normalizeDataRealitySubjectId(input: {
  readonly objectKey?: string | null;
  readonly nexoraObjectId?: string | null;
}): string | null {
  const objectKey = input.objectKey ?? null;
  const nexoraObjectId = input.nexoraObjectId ?? null;
  if (objectKey != null && objectKey.length > 0) {
    const bound = EXECUTIVE_OPERATIONS_RESOLVED_OBJECT_BINDINGS.find(
      (entry) => entry.objectKey === objectKey,
    );
    if (bound == null) return nexoraObjectId;
    if (nexoraObjectId != null && nexoraObjectId !== bound.nexoraObjectId) return null;
    return bound.nexoraObjectId;
  }
  return nexoraObjectId;
}

export function resolveDataRealityEvidenceForManagedSubject(input: {
  readonly objectKey?: string | null;
  readonly nexoraObjectId?: string | null;
  readonly evidenceId?: string | null;
  readonly catalog?: CanonicalManagedSubjectCatalog;
}): CanonicalManagedSubjectResolution {
  const referenceId = normalizeDataRealitySubjectId(input);
  if (referenceId == null) {
    return Object.freeze({ status: "unresolved", reason: "unknown-reference" });
  }
  return resolveCanonicalManagedSubject({
    domain: "data-reality",
    referenceId,
    evidenceId: input.evidenceId,
    catalog: input.catalog,
  });
}

export function createManagedSubjectCatalogForTests(
  catalog: CanonicalManagedSubjectCatalog,
): CanonicalManagedSubjectCatalog {
  return Object.freeze({
    subjects: Object.freeze([...catalog.subjects]),
    bindings: Object.freeze(catalog.bindings.map((entry) => Object.freeze({ ...entry }))),
  });
}
