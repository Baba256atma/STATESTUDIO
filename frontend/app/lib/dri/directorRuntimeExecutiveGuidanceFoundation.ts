/**
 * DRI-7:1 — Director Runtime Executive Guidance Foundation.
 *
 * Establishes immutable vocabulary and plain-data contracts for executive
 * guidance delivery. Translates DRI-6 attention/focus semantics into a
 * renderer-independent guidance model — not presentation, rendering, or action.
 *
 * Principle: Attention describes what currently matters. Guidance describes
 * what the Director should communicate about what matters.
 */

import { directorRuntimeAttentionFocusPublicIndexIdentity } from
  "@/app/lib/dri/directorRuntimeAttentionFocusPublicIndex";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeExecutiveGuidanceFoundationIdentity =
  "DRI-7:1/DirectorRuntimeExecutiveGuidanceFoundation" as const;
export const directorRuntimeExecutiveGuidanceFoundationVersion =
  "7.1.0" as const;
export const directorRuntimeExecutiveGuidanceFoundationNamespace =
  "nexora.dri.executive-guidance.foundation" as const;
export const directorRuntimeExecutiveGuidanceFoundationUpstream =
  directorRuntimeAttentionFocusPublicIndexIdentity;

export const directorRuntimeExecutiveGuidanceFoundationCanonicalIdentity =
  Object.freeze({
    identity: directorRuntimeExecutiveGuidanceFoundationIdentity,
    version: directorRuntimeExecutiveGuidanceFoundationVersion,
    namespace: directorRuntimeExecutiveGuidanceFoundationNamespace,
    upstream: directorRuntimeExecutiveGuidanceFoundationUpstream,
  });

// ─── Executive guidance principle ───────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PRINCIPLE =
  "Attention describes what currently matters. Guidance describes what the Director should communicate about what matters." as const;

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_BOUNDARY = Object.freeze({
  attentionAuthority: "DRI-6" as const,
  guidanceAuthority: "DRI-7" as const,
  presentationAuthority: "downstream-renderer" as const,
  doesNotRecalculateAttention: true as const,
  doesNotReplaceFocus: true as const,
  doesNotScoreAttention: true as const,
  consumesPublicIndexOnly: true as const,
});

// ─── Guidance kinds ─────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_KINDS = Object.freeze([
  "direct-attention",
  "maintain-focus",
  "surface-context",
  "surface-evidence",
  "surface-risk",
  "surface-opportunity",
  "explain-relationship",
  "explain-path",
  "compare",
  "de-emphasize",
  "preserve-context",
  "request-awareness",
] as const);
export type DirectorRuntimeExecutiveGuidanceKind =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_KINDS)[number];

// ─── Target kinds ───────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_TARGET_KINDS = Object.freeze([
  "goal",
  "object",
  "kpi",
  "koi",
  "problem",
  "scenario",
  "decision",
  "execution",
  "pack",
  "relationship",
  "path",
  "context",
] as const);
export type DirectorRuntimeExecutiveGuidanceTargetKind =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_TARGET_KINDS)[number];

// ─── Importance (independent from urgency / appearance) ─────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IMPORTANCE_VALUES =
  Object.freeze([
    "background",
    "supporting",
    "important",
    "critical",
  ] as const);
export type DirectorRuntimeExecutiveGuidanceImportance =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IMPORTANCE_VALUES)[number];

// ─── Urgency (independent from importance) ──────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_URGENCY_VALUES = Object.freeze([
  "none",
  "monitor",
  "soon",
  "immediate",
] as const);
export type DirectorRuntimeExecutiveGuidanceUrgency =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_URGENCY_VALUES)[number];

// ─── Intent ─────────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_INTENT_VALUES = Object.freeze([
  "inform",
  "orient",
  "warn",
  "explain",
  "compare",
  "prepare-decision",
  "support-decision",
  "support-execution",
] as const);
export type DirectorRuntimeExecutiveGuidanceIntent =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_INTENT_VALUES)[number];

// ─── Source kinds (references only — no upstream duplication) ───────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_SOURCE_KINDS = Object.freeze([
  "attention-output",
  "focus-subject",
  "attention-candidate",
  "executive-context",
  "runtime-state",
  "relationship-evidence",
  "path-evidence",
] as const);
export type DirectorRuntimeExecutiveGuidanceSourceKind =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_SOURCE_KINDS)[number];

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface DirectorRuntimeExecutiveGuidanceTarget {
  readonly targetKind: DirectorRuntimeExecutiveGuidanceTargetKind;
  readonly targetId: string;
  /** Optional semantic label — never a UI ownership or render directive. */
  readonly label?: string;
}

export interface DirectorRuntimeExecutiveGuidanceSource {
  readonly sourceKind: DirectorRuntimeExecutiveGuidanceSourceKind;
  readonly sourceId: string;
}

export interface DirectorRuntimeExecutiveGuidanceItem {
  readonly guidanceId: string;
  readonly guidanceKind: DirectorRuntimeExecutiveGuidanceKind;
  readonly target: DirectorRuntimeExecutiveGuidanceTarget;
  readonly importance: DirectorRuntimeExecutiveGuidanceImportance;
  readonly urgency: DirectorRuntimeExecutiveGuidanceUrgency;
  readonly intent: DirectorRuntimeExecutiveGuidanceIntent;
  readonly source: DirectorRuntimeExecutiveGuidanceSource;
  readonly rationale?: string;
}

export interface DirectorRuntimeExecutiveGuidanceRelationship {
  readonly relationshipId: string;
  readonly source: DirectorRuntimeExecutiveGuidanceTarget;
  readonly target: DirectorRuntimeExecutiveGuidanceTarget;
  readonly meaning?: string;
}

export interface DirectorRuntimeExecutiveGuidancePath {
  readonly pathId: string;
  readonly targets: readonly DirectorRuntimeExecutiveGuidanceTarget[];
  readonly meaning?: string;
  readonly relationshipIds?: readonly string[];
}

export interface DirectorRuntimeExecutiveGuidancePackage {
  readonly packageId: string;
  readonly primaryGuidance: DirectorRuntimeExecutiveGuidanceItem | null;
  readonly guidanceItems: readonly DirectorRuntimeExecutiveGuidanceItem[];
  readonly paths: readonly DirectorRuntimeExecutiveGuidancePath[];
  readonly relationships?: readonly DirectorRuntimeExecutiveGuidanceRelationship[];
}

export const DIRECTOR_RUNTIME_EMPTY_EXECUTIVE_GUIDANCE_PACKAGE = Object.freeze({
  packageId: "guidance.empty",
  primaryGuidance: null,
  guidanceItems: Object.freeze(
    [],
  ) as readonly DirectorRuntimeExecutiveGuidanceItem[],
  paths: Object.freeze([]) as readonly DirectorRuntimeExecutiveGuidancePath[],
  relationships: Object.freeze(
    [],
  ) as readonly DirectorRuntimeExecutiveGuidanceRelationship[],
}) satisfies DirectorRuntimeExecutiveGuidancePackage;

// ─── Vocabulary membership ──────────────────────────────────────────────────

export function isDirectorRuntimeExecutiveGuidanceKind(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidanceKind {
  return (DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_KINDS as readonly unknown[]).includes(
    value,
  );
}

export function isDirectorRuntimeExecutiveGuidanceTargetKind(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidanceTargetKind {
  return (
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_TARGET_KINDS as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeExecutiveGuidanceImportance(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidanceImportance {
  return (
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IMPORTANCE_VALUES as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeExecutiveGuidanceUrgency(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidanceUrgency {
  return (
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_URGENCY_VALUES as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeExecutiveGuidanceIntent(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidanceIntent {
  return (
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_INTENT_VALUES as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeExecutiveGuidanceSourceKind(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidanceSourceKind {
  return (
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_SOURCE_KINDS as readonly unknown[]
  ).includes(value);
}

// ─── Immutable constructors (caller-supplied IDs; no mutation) ──────────────

export function createDirectorRuntimeExecutiveGuidanceTarget(
  input: DirectorRuntimeExecutiveGuidanceTarget,
): DirectorRuntimeExecutiveGuidanceTarget {
  const target: DirectorRuntimeExecutiveGuidanceTarget = {
    targetKind: input.targetKind,
    targetId: input.targetId,
  };
  if (input.label !== undefined) {
    return Object.freeze({ ...target, label: input.label });
  }
  return Object.freeze(target);
}

export function createDirectorRuntimeExecutiveGuidanceSource(
  input: DirectorRuntimeExecutiveGuidanceSource,
): DirectorRuntimeExecutiveGuidanceSource {
  return Object.freeze({
    sourceKind: input.sourceKind,
    sourceId: input.sourceId,
  });
}

export function createDirectorRuntimeExecutiveGuidanceItem(
  input: DirectorRuntimeExecutiveGuidanceItem,
): DirectorRuntimeExecutiveGuidanceItem {
  const item: DirectorRuntimeExecutiveGuidanceItem = {
    guidanceId: input.guidanceId,
    guidanceKind: input.guidanceKind,
    target: createDirectorRuntimeExecutiveGuidanceTarget(input.target),
    importance: input.importance,
    urgency: input.urgency,
    intent: input.intent,
    source: createDirectorRuntimeExecutiveGuidanceSource(input.source),
  };
  if (input.rationale !== undefined) {
    return Object.freeze({ ...item, rationale: input.rationale });
  }
  return Object.freeze(item);
}

export function createDirectorRuntimeExecutiveGuidanceRelationship(
  input: DirectorRuntimeExecutiveGuidanceRelationship,
): DirectorRuntimeExecutiveGuidanceRelationship {
  const relationship: DirectorRuntimeExecutiveGuidanceRelationship = {
    relationshipId: input.relationshipId,
    source: createDirectorRuntimeExecutiveGuidanceTarget(input.source),
    target: createDirectorRuntimeExecutiveGuidanceTarget(input.target),
  };
  if (input.meaning !== undefined) {
    return Object.freeze({ ...relationship, meaning: input.meaning });
  }
  return Object.freeze(relationship);
}

export function createDirectorRuntimeExecutiveGuidancePath(
  input: DirectorRuntimeExecutiveGuidancePath,
): DirectorRuntimeExecutiveGuidancePath {
  const path: DirectorRuntimeExecutiveGuidancePath = {
    pathId: input.pathId,
    targets: Object.freeze(
      input.targets.map((entry) =>
        createDirectorRuntimeExecutiveGuidanceTarget(entry)),
    ),
  };
  const withMeaning =
    input.meaning !== undefined
      ? { ...path, meaning: input.meaning }
      : path;
  if (input.relationshipIds !== undefined) {
    return Object.freeze({
      ...withMeaning,
      relationshipIds: Object.freeze([...input.relationshipIds]),
    });
  }
  return Object.freeze(withMeaning);
}

export function createDirectorRuntimeExecutiveGuidancePackage(
  input: DirectorRuntimeExecutiveGuidancePackage,
): DirectorRuntimeExecutiveGuidancePackage {
  const pkg: DirectorRuntimeExecutiveGuidancePackage = {
    packageId: input.packageId,
    primaryGuidance:
      input.primaryGuidance === null
        ? null
        : createDirectorRuntimeExecutiveGuidanceItem(input.primaryGuidance),
    guidanceItems: Object.freeze(
      input.guidanceItems.map((entry) =>
        createDirectorRuntimeExecutiveGuidanceItem(entry)),
    ),
    paths: Object.freeze(
      input.paths.map((entry) =>
        createDirectorRuntimeExecutiveGuidancePath(entry)),
    ),
  };
  if (input.relationships !== undefined) {
    return Object.freeze({
      ...pkg,
      relationships: Object.freeze(
        input.relationships.map((entry) =>
          createDirectorRuntimeExecutiveGuidanceRelationship(entry)),
      ),
    });
  }
  return Object.freeze(pkg);
}

// ─── Invariants ─────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FOUNDATION_INVARIANTS =
  Object.freeze([
    Object.freeze({
      id: "attention-not-guidance",
      statement:
        "Attention describes what currently matters; guidance describes what to communicate about what matters",
    }),
    Object.freeze({
      id: "guidance-not-presentation",
      statement: "guidance contracts contain no presentation-specific fields",
    }),
    Object.freeze({
      id: "guidance-not-rendering",
      statement: "foundation performs no rendering or visual realization",
    }),
    Object.freeze({
      id: "guidance-not-action",
      statement: "guidance does not encode approve/reject/execute/navigation actions",
    }),
    Object.freeze({
      id: "guidance-not-advisor-conversation",
      statement: "foundation does not generate advisor conversation or LLM prompts",
    }),
    Object.freeze({
      id: "importance-urgency-separation",
      statement: "importance and urgency remain independent semantic dimensions",
    }),
    Object.freeze({
      id: "vocabulary-uniqueness",
      statement: "every canonical registry contains unique values",
    }),
    Object.freeze({
      id: "source-traceability",
      statement: "every guidance item references a semantic source by kind and id",
    }),
    Object.freeze({
      id: "path-semantics-only",
      statement: "paths are ordered semantic target sequences without geometry",
    }),
    Object.freeze({
      id: "no-attention-recalculation",
      statement: "DRI-7:1 does not recalculate, replace, or re-score DRI-6 attention",
    }),
    Object.freeze({
      id: "sole-upstream-dri-6-9",
      statement: "DRI-7:1 depends only on DRI-6:9 Public Index",
    }),
    Object.freeze({
      id: "no-runtime-mutation",
      statement: "constructors and registry access must not mutate caller-provided values",
    }),
  ] as const);

export type DirectorRuntimeExecutiveGuidanceFoundationInvariant =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FOUNDATION_INVARIANTS)[number];

// ─── Registry ───────────────────────────────────────────────────────────────

export const directorRuntimeExecutiveGuidanceFoundationApiNames = Object.freeze([
  "isDirectorRuntimeExecutiveGuidanceKind",
  "isDirectorRuntimeExecutiveGuidanceTargetKind",
  "isDirectorRuntimeExecutiveGuidanceImportance",
  "isDirectorRuntimeExecutiveGuidanceUrgency",
  "isDirectorRuntimeExecutiveGuidanceIntent",
  "isDirectorRuntimeExecutiveGuidanceSourceKind",
  "createDirectorRuntimeExecutiveGuidanceTarget",
  "createDirectorRuntimeExecutiveGuidanceSource",
  "createDirectorRuntimeExecutiveGuidanceItem",
  "createDirectorRuntimeExecutiveGuidanceRelationship",
  "createDirectorRuntimeExecutiveGuidancePath",
  "createDirectorRuntimeExecutiveGuidancePackage",
  "verifyDirectorRuntimeExecutiveGuidanceFoundation",
] as const);

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "DirectorRuntimeExecutiveGuidanceKind",
    "DirectorRuntimeExecutiveGuidanceTargetKind",
    "DirectorRuntimeExecutiveGuidanceImportance",
    "DirectorRuntimeExecutiveGuidanceUrgency",
    "DirectorRuntimeExecutiveGuidanceIntent",
    "DirectorRuntimeExecutiveGuidanceSourceKind",
    "DirectorRuntimeExecutiveGuidanceTarget",
    "DirectorRuntimeExecutiveGuidanceSource",
    "DirectorRuntimeExecutiveGuidanceItem",
    "DirectorRuntimeExecutiveGuidanceRelationship",
    "DirectorRuntimeExecutiveGuidancePath",
    "DirectorRuntimeExecutiveGuidancePackage",
    "DirectorRuntimeExecutiveGuidanceFoundationInvariant",
    "DirectorRuntimeExecutiveGuidanceFoundationVerification",
  ] as const);

export const directorRuntimeExecutiveGuidanceFoundationRegistry = Object.freeze({
  identity: directorRuntimeExecutiveGuidanceFoundationIdentity,
  version: directorRuntimeExecutiveGuidanceFoundationVersion,
  namespace: directorRuntimeExecutiveGuidanceFoundationNamespace,
  dependency: directorRuntimeExecutiveGuidanceFoundationUpstream,
  principle: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PRINCIPLE,
  boundary: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_BOUNDARY,
  guidanceKinds: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_KINDS,
  guidanceKindCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_KINDS.length,
  targetKinds: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_TARGET_KINDS,
  targetKindCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_TARGET_KINDS.length,
  importanceValues: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IMPORTANCE_VALUES,
  importanceCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IMPORTANCE_VALUES.length,
  urgencyValues: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_URGENCY_VALUES,
  urgencyCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_URGENCY_VALUES.length,
  intentValues: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_INTENT_VALUES,
  intentCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_INTENT_VALUES.length,
  sourceKinds: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_SOURCE_KINDS,
  sourceKindCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_SOURCE_KINDS.length,
  emptyGuidancePackage: DIRECTOR_RUNTIME_EMPTY_EXECUTIVE_GUIDANCE_PACKAGE,
  invariants: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FOUNDATION_INVARIANTS,
  invariantCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FOUNDATION_INVARIANTS.length,
  publicTypes: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_TYPE_NAMES,
  publicTypeCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_TYPE_NAMES.length,
  publicApis: directorRuntimeExecutiveGuidanceFoundationApiNames,
  publicApiCount: directorRuntimeExecutiveGuidanceFoundationApiNames.length,
  vocabularySectionCount: 6 as const,
  vocabularyValueCount:
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_KINDS.length +
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_TARGET_KINDS.length +
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IMPORTANCE_VALUES.length +
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_URGENCY_VALUES.length +
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_INTENT_VALUES.length +
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_SOURCE_KINDS.length,
});

export const directorRuntimeExecutiveGuidanceFoundation = Object.freeze({
  phase: "DRI-7:1" as const,
  name: "DirectorRuntimeExecutiveGuidanceFoundation" as const,
  identity: directorRuntimeExecutiveGuidanceFoundationIdentity,
  namespace: directorRuntimeExecutiveGuidanceFoundationNamespace,
  version: directorRuntimeExecutiveGuidanceFoundationVersion,
  layer: "Director Runtime Integration" as const,
  domain: "ExecutiveGuidanceAttentionDelivery" as const,
  role: "Foundation" as const,
  stage: "Foundation" as const,
  status: "FoundationReady" as const,
  upstreamDependency: directorRuntimeExecutiveGuidanceFoundationUpstream,
  deterministic: true as const,
  foundation: true as const,
  rendererIndependent: true as const,
  philosophy: "attention-not-guidance-not-presentation" as const,
  principle: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PRINCIPLE,
  boundary: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_BOUNDARY,
  guidanceKinds: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_KINDS,
  targetKinds: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_TARGET_KINDS,
  importanceValues: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IMPORTANCE_VALUES,
  urgencyValues: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_URGENCY_VALUES,
  intentValues: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_INTENT_VALUES,
  sourceKinds: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_SOURCE_KINDS,
  emptyGuidancePackage: DIRECTOR_RUNTIME_EMPTY_EXECUTIVE_GUIDANCE_PACKAGE,
  invariants: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FOUNDATION_INVARIANTS,
  publicApiSurface: directorRuntimeExecutiveGuidanceFoundationApiNames,
  publicTypes: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_TYPE_NAMES,
  registry: directorRuntimeExecutiveGuidanceFoundationRegistry,
  attentionFocusBoundary: "DRI-6:9-public-index-only" as const,
  architecturalStatus:
    "Foundation Complete · Deterministic · Immutable · Renderer-Independent · ReadyForContracts" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface DirectorRuntimeExecutiveGuidanceFoundationVerification {
  readonly ok: boolean;
  readonly identity: typeof directorRuntimeExecutiveGuidanceFoundationIdentity;
  readonly version: typeof directorRuntimeExecutiveGuidanceFoundationVersion;
  readonly namespace: typeof directorRuntimeExecutiveGuidanceFoundationNamespace;
  readonly dependency: typeof directorRuntimeExecutiveGuidanceFoundationUpstream;
  readonly guidanceKindCount: number;
  readonly targetKindCount: number;
  readonly importanceCount: number;
  readonly urgencyCount: number;
  readonly intentCount: number;
  readonly sourceKindCount: number;
  readonly vocabularySectionCount: number;
  readonly vocabularyValueCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly invariantCount: number;
  readonly frozen: boolean;
  readonly importanceUrgencyIndependent: boolean;
  readonly dri6BoundaryIntact: boolean;
  readonly rendererIndependent: boolean;
}

function exactOrder<T extends string>(
  actual: readonly T[],
  expected: readonly T[],
): boolean {
  return (
    actual.length === expected.length &&
    actual.every((value, index) => value === expected[index])
  );
}

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

export function verifyDirectorRuntimeExecutiveGuidanceFoundation():
  DirectorRuntimeExecutiveGuidanceFoundationVerification {
  const foundation = directorRuntimeExecutiveGuidanceFoundation;
  const registry = directorRuntimeExecutiveGuidanceFoundationRegistry;

  const identityOk =
    foundation.identity ===
      "DRI-7:1/DirectorRuntimeExecutiveGuidanceFoundation" &&
    foundation.version === "7.1.0" &&
    foundation.namespace === "nexora.dri.executive-guidance.foundation" &&
    foundation.layer === "Director Runtime Integration" &&
    foundation.domain === "ExecutiveGuidanceAttentionDelivery" &&
    foundation.role === "Foundation" &&
    foundation.status === "FoundationReady" &&
    foundation.upstreamDependency ===
      "DRI-6:9/DirectorRuntimeAttentionFocusPublicIndex" &&
    foundation.upstreamDependency ===
      directorRuntimeAttentionFocusPublicIndexIdentity &&
    registry.dependency === foundation.upstreamDependency &&
    foundation.attentionFocusBoundary === "DRI-6:9-public-index-only";

  const vocabularyOk =
    exactOrder(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_KINDS, [
      "direct-attention",
      "maintain-focus",
      "surface-context",
      "surface-evidence",
      "surface-risk",
      "surface-opportunity",
      "explain-relationship",
      "explain-path",
      "compare",
      "de-emphasize",
      "preserve-context",
      "request-awareness",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_TARGET_KINDS, [
      "goal",
      "object",
      "kpi",
      "koi",
      "problem",
      "scenario",
      "decision",
      "execution",
      "pack",
      "relationship",
      "path",
      "context",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IMPORTANCE_VALUES, [
      "background",
      "supporting",
      "important",
      "critical",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_URGENCY_VALUES, [
      "none",
      "monitor",
      "soon",
      "immediate",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_INTENT_VALUES, [
      "inform",
      "orient",
      "warn",
      "explain",
      "compare",
      "prepare-decision",
      "support-decision",
      "support-execution",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_SOURCE_KINDS, [
      "attention-output",
      "focus-subject",
      "attention-candidate",
      "executive-context",
      "runtime-state",
      "relationship-evidence",
      "path-evidence",
    ]) &&
    unique([...DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_KINDS]) &&
    unique([...DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_TARGET_KINDS]) &&
    unique([...DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IMPORTANCE_VALUES]) &&
    unique([...DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_URGENCY_VALUES]) &&
    unique([...DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_INTENT_VALUES]) &&
    unique([...DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_SOURCE_KINDS]);

  const importanceUrgencyIndependent =
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IMPORTANCE_VALUES !==
      (DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_URGENCY_VALUES as unknown) &&
    !DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IMPORTANCE_VALUES.includes(
      "immediate" as never,
    ) &&
    !DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_URGENCY_VALUES.includes(
      "critical" as never,
    ) &&
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_BOUNDARY.doesNotRecalculateAttention &&
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_BOUNDARY.doesNotReplaceFocus &&
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_BOUNDARY.doesNotScoreAttention;

  const registryIntegrityOk =
    registry.guidanceKindCount ===
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_KINDS.length &&
    registry.targetKindCount ===
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_TARGET_KINDS.length &&
    registry.importanceCount ===
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IMPORTANCE_VALUES.length &&
    registry.urgencyCount ===
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_URGENCY_VALUES.length &&
    registry.intentCount ===
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_INTENT_VALUES.length &&
    registry.sourceKindCount ===
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_SOURCE_KINDS.length &&
    registry.vocabularySectionCount === 6 &&
    registry.vocabularyValueCount ===
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_KINDS.length +
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_TARGET_KINDS.length +
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IMPORTANCE_VALUES.length +
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_URGENCY_VALUES.length +
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_INTENT_VALUES.length +
        DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_SOURCE_KINDS.length &&
    registry.publicTypeCount ===
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_TYPE_NAMES.length &&
    registry.publicApiCount ===
      directorRuntimeExecutiveGuidanceFoundationApiNames.length &&
    registry.invariantCount ===
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FOUNDATION_INVARIANTS.length;

  const immutabilityOk =
    Object.isFrozen(foundation) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(directorRuntimeExecutiveGuidanceFoundationCanonicalIdentity) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_KINDS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_TARGET_KINDS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IMPORTANCE_VALUES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_URGENCY_VALUES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_INTENT_VALUES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_SOURCE_KINDS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EMPTY_EXECUTIVE_GUIDANCE_PACKAGE) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FOUNDATION_INVARIANTS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_BOUNDARY);

  const dri6BoundaryIntact =
    foundation.upstreamDependency ===
      "DRI-6:9/DirectorRuntimeAttentionFocusPublicIndex" &&
    foundation.boundary.attentionAuthority === "DRI-6" &&
    foundation.boundary.guidanceAuthority === "DRI-7" &&
    foundation.boundary.consumesPublicIndexOnly === true;

  const rendererIndependent =
    foundation.rendererIndependent === true &&
    foundation.boundary.presentationAuthority === "downstream-renderer";

  const ok =
    identityOk &&
    vocabularyOk &&
    importanceUrgencyIndependent &&
    registryIntegrityOk &&
    immutabilityOk &&
    dri6BoundaryIntact &&
    rendererIndependent &&
    foundation.principle === DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PRINCIPLE;

  return Object.freeze({
    ok,
    identity: directorRuntimeExecutiveGuidanceFoundationIdentity,
    version: directorRuntimeExecutiveGuidanceFoundationVersion,
    namespace: directorRuntimeExecutiveGuidanceFoundationNamespace,
    dependency: directorRuntimeExecutiveGuidanceFoundationUpstream,
    guidanceKindCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_KINDS.length,
    targetKindCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_TARGET_KINDS.length,
    importanceCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_IMPORTANCE_VALUES.length,
    urgencyCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_URGENCY_VALUES.length,
    intentCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_INTENT_VALUES.length,
    sourceKindCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_SOURCE_KINDS.length,
    vocabularySectionCount: 6,
    vocabularyValueCount: registry.vocabularyValueCount,
    publicTypeCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PUBLIC_TYPE_NAMES.length,
    publicApiCount: directorRuntimeExecutiveGuidanceFoundationApiNames.length,
    invariantCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_FOUNDATION_INVARIANTS.length,
    frozen: immutabilityOk,
    importanceUrgencyIndependent,
    dri6BoundaryIntact,
    rendererIndependent,
  });
}
