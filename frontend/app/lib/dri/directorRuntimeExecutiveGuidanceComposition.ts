/**
 * DRI-7:4 — Director Runtime Executive Guidance Composition & Prioritization.
 *
 * Organizes DRI-7:3 selected guidance into deterministic semantic tiers and
 * roles for later delivery. Does not deliver, render, score numerically, or
 * reactivate non-selected candidates.
 *
 * Principle: Resolution determines which guidance survives. Composition
 * determines how surviving guidance is semantically organized. Delivery
 * determines how the composed guidance is handed to consumers. Rendering
 * determines how it appears.
 */

import {
  directorRuntimeExecutiveGuidanceResolutionIdentity,
  type DirectorRuntimeExecutiveGuidanceCandidate,
  type DirectorRuntimeExecutiveGuidanceEnvelope,
  type DirectorRuntimeExecutiveGuidanceItem,
  type DirectorRuntimeExecutiveGuidanceProvenance,
  type DirectorRuntimeExecutiveGuidanceResolution,
  type DirectorRuntimeExecutiveGuidanceResolutionContext,
  type DirectorRuntimeExecutiveGuidanceResolutionEntry,
  type DirectorRuntimeExecutiveGuidanceResolutionInput,
  type DirectorRuntimeExecutiveGuidanceResolutionReason,
  type DirectorRuntimeExecutiveGuidanceResolutionStatus,
  type DirectorRuntimeExecutiveGuidanceTarget,
} from "@/app/lib/dri/directorRuntimeExecutiveGuidanceResolution";

export type {
  DirectorRuntimeExecutiveGuidanceCandidate,
  DirectorRuntimeExecutiveGuidanceEnvelope,
  DirectorRuntimeExecutiveGuidanceItem,
  DirectorRuntimeExecutiveGuidanceProvenance,
  DirectorRuntimeExecutiveGuidanceResolution,
  DirectorRuntimeExecutiveGuidanceResolutionContext,
  DirectorRuntimeExecutiveGuidanceResolutionEntry,
  DirectorRuntimeExecutiveGuidanceResolutionInput,
  DirectorRuntimeExecutiveGuidanceResolutionReason,
  DirectorRuntimeExecutiveGuidanceResolutionStatus,
  DirectorRuntimeExecutiveGuidanceTarget,
};

export {
  createDirectorRuntimeExecutiveGuidanceResolutionContext,
  createDirectorRuntimeExecutiveGuidanceResolutionInput,
  resolveDirectorExecutiveGuidance,
} from "@/app/lib/dri/directorRuntimeExecutiveGuidanceResolution";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeExecutiveGuidanceCompositionIdentity =
  "DRI-7:4/DirectorRuntimeExecutiveGuidanceComposition" as const;
export const directorRuntimeExecutiveGuidanceCompositionVersion =
  "7.4.0" as const;
export const directorRuntimeExecutiveGuidanceCompositionNamespace =
  "nexora.dri.executive-guidance.composition" as const;
export const directorRuntimeExecutiveGuidanceCompositionUpstream =
  directorRuntimeExecutiveGuidanceResolutionIdentity;

export const directorRuntimeExecutiveGuidanceCompositionCanonicalIdentity =
  Object.freeze({
    identity: directorRuntimeExecutiveGuidanceCompositionIdentity,
    version: directorRuntimeExecutiveGuidanceCompositionVersion,
    namespace: directorRuntimeExecutiveGuidanceCompositionNamespace,
    upstream: directorRuntimeExecutiveGuidanceCompositionUpstream,
  });

// ─── Principle / boundary ───────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_PRINCIPLE =
  "Resolution determines which guidance survives. Composition determines how surviving guidance is semantically organized. Delivery determines how the composed guidance is handed to consumers. Rendering determines how it appears." as const;

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_BOUNDARY =
  Object.freeze({
    resolutionAuthority: "DRI-7:3" as const,
    compositionAuthority: "DRI-7:4" as const,
    deliveryAuthority: "DRI-7:5" as const,
    doesNotDeliverGuidance: true as const,
    doesNotScoreGuidance: true as const,
    doesNotRankByWeight: true as const,
    doesNotReactivateNonSelected: true as const,
    preservesSelectedOrder: true as const,
    atMostOnePrimary: true as const,
    consumesResolutionOnly: true as const,
  });

// ─── Priority tiers ─────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PRIORITY_TIERS = Object.freeze([
  "primary",
  "supporting",
  "contextual",
  "background",
] as const);
export type DirectorRuntimeExecutiveGuidancePriorityTier =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PRIORITY_TIERS)[number];

// ─── Composition roles ──────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_ROLES =
  Object.freeze([
    "attention-anchor",
    "supporting-evidence",
    "risk-context",
    "opportunity-context",
    "relationship-explanation",
    "path-explanation",
    "comparison-context",
    "preserved-context",
    "background-context",
  ] as const);
export type DirectorRuntimeExecutiveGuidanceCompositionRole =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_ROLES)[number];

// ─── Rule registry ──────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_RULE_ORDER =
  Object.freeze([
    "upstream-primary",
    "direct-support",
    "explicit-relationship",
    "explicit-path",
    "preserved-context",
    "contextual-relevance",
    "background-fallback",
  ] as const);
export type DirectorRuntimeExecutiveGuidanceCompositionRuleName =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_RULE_ORDER)[number];

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_RULE_IDS =
  Object.freeze([
    "dri7.composition.upstream-primary",
    "dri7.composition.direct-support",
    "dri7.composition.explicit-relationship",
    "dri7.composition.explicit-path",
    "dri7.composition.preserved-context",
    "dri7.composition.contextual-relevance",
    "dri7.composition.background-fallback",
  ] as const);
export type DirectorRuntimeExecutiveGuidanceCompositionRuleId =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_RULE_IDS)[number];

// ─── Composition-facing relationship / path contracts ───────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_RELATIONSHIP_KINDS =
  Object.freeze([
    "supports",
    "explains",
    "causes",
    "depends-on",
    "conflicts-with",
    "compares-with",
    "impacts",
    "derived-from",
  ] as const);
export type DirectorRuntimeExecutiveGuidanceCompositionRelationshipKind =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_RELATIONSHIP_KINDS)[number];

export interface DirectorRuntimeExecutiveGuidanceCompositionRelationship {
  readonly relationshipId: string;
  readonly relationshipKind: DirectorRuntimeExecutiveGuidanceCompositionRelationshipKind;
  readonly sourceTarget: DirectorRuntimeExecutiveGuidanceTarget;
  readonly targetTarget: DirectorRuntimeExecutiveGuidanceTarget;
  readonly rationale?: string;
}

export interface DirectorRuntimeExecutiveGuidanceCompositionPath {
  readonly pathId: string;
  readonly targets: readonly DirectorRuntimeExecutiveGuidanceTarget[];
  readonly meaning?: string;
  readonly relationshipIds?: readonly string[];
}

// ─── Composition contracts ──────────────────────────────────────────────────

export interface DirectorRuntimeExecutiveGuidanceComposedItem {
  readonly candidateId: string;
  readonly guidanceId: string;
  readonly priorityTier: DirectorRuntimeExecutiveGuidancePriorityTier;
  readonly role: DirectorRuntimeExecutiveGuidanceCompositionRole;
  readonly ordinal: number;
  readonly guidance: DirectorRuntimeExecutiveGuidanceItem;
  readonly provenance: DirectorRuntimeExecutiveGuidanceProvenance;
  readonly resolutionReasons: readonly DirectorRuntimeExecutiveGuidanceResolutionReason[];
}

export interface DirectorRuntimeExecutiveGuidanceCompositionGroup {
  readonly groupId: string;
  readonly role: DirectorRuntimeExecutiveGuidanceCompositionRole;
  readonly itemIds: readonly string[];
}

export interface DirectorRuntimeExecutiveGuidanceCompositionTrace {
  readonly candidateId: string;
  readonly guidanceId: string | null;
  readonly resolutionStatus: DirectorRuntimeExecutiveGuidanceResolutionStatus;
  readonly compositionTier: DirectorRuntimeExecutiveGuidancePriorityTier | null;
  readonly compositionRole: DirectorRuntimeExecutiveGuidanceCompositionRole | null;
}

export interface DirectorRuntimeExecutiveGuidanceCompositionSummary {
  readonly activeItemCount: number;
  readonly primaryCount: 0 | 1;
  readonly supportingCount: number;
  readonly contextualCount: number;
  readonly backgroundCount: number;
  readonly relationshipCount: number;
  readonly pathCount: number;
  readonly deferredReferenceCount: number;
  readonly suppressedReferenceCount: number;
  readonly rejectedReferenceCount: number;
  readonly unresolvedReferenceCount: number;
}

export interface DirectorRuntimeExecutiveGuidanceCompositionInput {
  readonly compositionId: string;
  readonly resolution: DirectorRuntimeExecutiveGuidanceResolution;
  readonly relationships: readonly DirectorRuntimeExecutiveGuidanceCompositionRelationship[];
  readonly paths: readonly DirectorRuntimeExecutiveGuidanceCompositionPath[];
}

export interface DirectorRuntimeExecutiveGuidanceComposition {
  readonly compositionId: string;
  readonly requestId: string;
  readonly primary: DirectorRuntimeExecutiveGuidanceComposedItem | null;
  readonly supporting: readonly DirectorRuntimeExecutiveGuidanceComposedItem[];
  readonly contextual: readonly DirectorRuntimeExecutiveGuidanceComposedItem[];
  readonly background: readonly DirectorRuntimeExecutiveGuidanceComposedItem[];
  readonly relationships: readonly DirectorRuntimeExecutiveGuidanceCompositionRelationship[];
  readonly paths: readonly DirectorRuntimeExecutiveGuidanceCompositionPath[];
  readonly groups: readonly DirectorRuntimeExecutiveGuidanceCompositionGroup[];
  readonly traces: readonly DirectorRuntimeExecutiveGuidanceCompositionTrace[];
  readonly deferredCandidateIds: readonly string[];
  readonly suppressedCandidateIds: readonly string[];
  readonly rejectedCandidateIds: readonly string[];
  readonly unresolvedCandidateIds: readonly string[];
  readonly summary: DirectorRuntimeExecutiveGuidanceCompositionSummary;
}

// ─── Vocabulary helpers ─────────────────────────────────────────────────────

export function isDirectorRuntimeExecutiveGuidancePriorityTier(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidancePriorityTier {
  return (
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PRIORITY_TIERS as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeExecutiveGuidanceCompositionRole(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidanceCompositionRole {
  return (
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_ROLES as readonly unknown[]
  ).includes(value);
}

// ─── Internal helpers ───────────────────────────────────────────────────────

function targetsEqual(
  a: DirectorRuntimeExecutiveGuidanceTarget,
  b: DirectorRuntimeExecutiveGuidanceTarget,
): boolean {
  return a.targetKind === b.targetKind && a.targetId === b.targetId;
}

function freezeTarget(
  target: DirectorRuntimeExecutiveGuidanceTarget,
): DirectorRuntimeExecutiveGuidanceTarget {
  return Object.freeze({
    targetKind: target.targetKind,
    targetId: target.targetId,
    ...(target.label !== undefined ? { label: target.label } : {}),
  });
}

function freezeRelationship(
  relationship: DirectorRuntimeExecutiveGuidanceCompositionRelationship,
): DirectorRuntimeExecutiveGuidanceCompositionRelationship {
  return Object.freeze({
    relationshipId: relationship.relationshipId,
    relationshipKind: relationship.relationshipKind,
    sourceTarget: freezeTarget(relationship.sourceTarget),
    targetTarget: freezeTarget(relationship.targetTarget),
    ...(relationship.rationale !== undefined
      ? { rationale: relationship.rationale }
      : {}),
  });
}

function freezePath(
  path: DirectorRuntimeExecutiveGuidanceCompositionPath,
): DirectorRuntimeExecutiveGuidanceCompositionPath {
  return Object.freeze({
    pathId: path.pathId,
    targets: Object.freeze(path.targets.map((entry) => freezeTarget(entry))),
    ...(path.meaning !== undefined ? { meaning: path.meaning } : {}),
    ...(path.relationshipIds !== undefined
      ? { relationshipIds: Object.freeze([...path.relationshipIds]) }
      : {}),
  });
}

function freezeComposedItem(
  item: DirectorRuntimeExecutiveGuidanceComposedItem,
): DirectorRuntimeExecutiveGuidanceComposedItem {
  return Object.freeze({
    candidateId: item.candidateId,
    guidanceId: item.guidanceId,
    priorityTier: item.priorityTier,
    role: item.role,
    ordinal: item.ordinal,
    guidance: item.guidance,
    provenance: item.provenance,
    resolutionReasons: Object.freeze([...item.resolutionReasons]),
  });
}

const SUPPORTIVE_RELATIONSHIP_KINDS = Object.freeze([
  "supports",
  "explains",
  "derived-from",
  "impacts",
  "depends-on",
  "causes",
] as const);

function relatedByRelationship(
  candidateTarget: DirectorRuntimeExecutiveGuidanceTarget,
  primaryTarget: DirectorRuntimeExecutiveGuidanceTarget,
  relationships: readonly DirectorRuntimeExecutiveGuidanceCompositionRelationship[],
): boolean {
  for (const relationship of relationships) {
    if (
      !(SUPPORTIVE_RELATIONSHIP_KINDS as readonly string[]).includes(
        relationship.relationshipKind,
      )
    ) {
      continue;
    }
    const links =
      (targetsEqual(relationship.sourceTarget, candidateTarget) &&
        targetsEqual(relationship.targetTarget, primaryTarget)) ||
      (targetsEqual(relationship.sourceTarget, primaryTarget) &&
        targetsEqual(relationship.targetTarget, candidateTarget));
    if (links) return true;
  }
  return false;
}

function relatedByPath(
  candidateTarget: DirectorRuntimeExecutiveGuidanceTarget,
  primaryTarget: DirectorRuntimeExecutiveGuidanceTarget,
  paths: readonly DirectorRuntimeExecutiveGuidanceCompositionPath[],
): boolean {
  for (const path of paths) {
    const hasCandidate = path.targets.some((entry) =>
      targetsEqual(entry, candidateTarget));
    const hasPrimary = path.targets.some((entry) =>
      targetsEqual(entry, primaryTarget));
    if (hasCandidate && hasPrimary) return true;
  }
  return false;
}

// ─── Public semantic helpers ────────────────────────────────────────────────

export function resolveDirectorExecutiveGuidanceCompositionRole(
  guidance: DirectorRuntimeExecutiveGuidanceItem,
): DirectorRuntimeExecutiveGuidanceCompositionRole {
  switch (guidance.guidanceKind) {
    case "direct-attention":
    case "maintain-focus":
      return "attention-anchor";
    case "surface-evidence":
      return "supporting-evidence";
    case "surface-risk":
      return "risk-context";
    case "surface-opportunity":
      return "opportunity-context";
    case "explain-relationship":
      return "relationship-explanation";
    case "explain-path":
      return "path-explanation";
    case "compare":
      return "comparison-context";
    case "preserve-context":
      return "preserved-context";
    case "de-emphasize":
      return "background-context";
    case "surface-context":
    case "request-awareness":
      if (guidance.intent === "warn") return "risk-context";
      if (guidance.intent === "compare") return "comparison-context";
      if (
        guidance.intent === "explain" ||
        guidance.intent === "support-decision" ||
        guidance.intent === "support-execution"
      ) {
        return "supporting-evidence";
      }
      return "background-context";
    default:
      return "background-context";
  }
}

export function resolveDirectorExecutiveGuidancePriorityTier(input: {
  readonly entry: DirectorRuntimeExecutiveGuidanceResolutionEntry;
  readonly role: DirectorRuntimeExecutiveGuidanceCompositionRole;
  readonly primaryTarget: DirectorRuntimeExecutiveGuidanceTarget | null;
  readonly relationships: readonly DirectorRuntimeExecutiveGuidanceCompositionRelationship[];
  readonly paths: readonly DirectorRuntimeExecutiveGuidanceCompositionPath[];
  readonly isPrimary: boolean;
}): {
  readonly tier: DirectorRuntimeExecutiveGuidancePriorityTier;
  readonly rule: DirectorRuntimeExecutiveGuidanceCompositionRuleName;
} {
  if (input.isPrimary) {
    return Object.freeze({
      tier: "primary" as const,
      rule: "upstream-primary" as const,
    });
  }

  const guidance = input.entry.guidance;
  if (guidance === null) {
    return Object.freeze({
      tier: "background" as const,
      rule: "background-fallback" as const,
    });
  }

  const sameTarget =
    input.primaryTarget !== null &&
    targetsEqual(guidance.target, input.primaryTarget);
  const linkedByRelationship =
    input.primaryTarget !== null &&
    relatedByRelationship(
      guidance.target,
      input.primaryTarget,
      input.relationships,
    );
  const linkedByPath =
    input.primaryTarget !== null &&
    relatedByPath(guidance.target, input.primaryTarget, input.paths);

  // Rule: direct-support
  if (
    sameTarget &&
    (guidance.guidanceKind === "surface-evidence" ||
      guidance.guidanceKind === "surface-risk" ||
      guidance.intent === "explain" ||
      guidance.intent === "warn" ||
      input.role === "supporting-evidence" ||
      input.role === "risk-context")
  ) {
    return Object.freeze({
      tier: "supporting" as const,
      rule: "direct-support" as const,
    });
  }

  if (
    linkedByRelationship &&
    (input.role === "supporting-evidence" ||
      input.role === "risk-context" ||
      input.role === "relationship-explanation" ||
      guidance.guidanceKind === "surface-evidence" ||
      guidance.guidanceKind === "explain-relationship")
  ) {
    return Object.freeze({
      tier: "supporting" as const,
      rule: "direct-support" as const,
    });
  }

  // Rule: explicit-relationship
  if (
    guidance.guidanceKind === "explain-relationship" ||
    input.role === "relationship-explanation" ||
    linkedByRelationship
  ) {
    if (
      guidance.guidanceKind === "explain-relationship" ||
      input.role === "relationship-explanation"
    ) {
      return Object.freeze({
        tier: "supporting" as const,
        rule: "explicit-relationship" as const,
      });
    }
    return Object.freeze({
      tier: "contextual" as const,
      rule: "explicit-relationship" as const,
    });
  }

  // Rule: explicit-path
  if (
    guidance.guidanceKind === "explain-path" ||
    input.role === "path-explanation" ||
    linkedByPath
  ) {
    return Object.freeze({
      tier: "contextual" as const,
      rule: "explicit-path" as const,
    });
  }

  // Rule: preserved-context
  if (
    guidance.guidanceKind === "preserve-context" ||
    input.role === "preserved-context"
  ) {
    return Object.freeze({
      tier: "contextual" as const,
      rule: "preserved-context" as const,
    });
  }

  // Rule: background for explicit de-emphasize / background-context roles
  if (
    guidance.guidanceKind === "de-emphasize" ||
    input.role === "background-context"
  ) {
    return Object.freeze({
      tier: "background" as const,
      rule: "background-fallback" as const,
    });
  }

  // Rule: contextual-relevance
  if (
    input.role === "comparison-context" ||
    input.role === "opportunity-context" ||
    input.role === "risk-context" ||
    guidance.guidanceKind === "compare" ||
    guidance.guidanceKind === "surface-opportunity" ||
    guidance.guidanceKind === "surface-context" ||
    guidance.guidanceKind === "request-awareness" ||
    guidance.intent === "compare" ||
    guidance.intent === "orient" ||
    guidance.intent === "prepare-decision"
  ) {
    return Object.freeze({
      tier: "contextual" as const,
      rule: "contextual-relevance" as const,
    });
  }

  // Rule: background-fallback
  return Object.freeze({
    tier: "background" as const,
    rule: "background-fallback" as const,
  });
}

export function composeDirectorExecutiveGuidanceItem(input: {
  readonly entry: DirectorRuntimeExecutiveGuidanceResolutionEntry;
  readonly priorityTier: DirectorRuntimeExecutiveGuidancePriorityTier;
  readonly role: DirectorRuntimeExecutiveGuidanceCompositionRole;
}): DirectorRuntimeExecutiveGuidanceComposedItem | null {
  if (input.entry.guidance === null) return null;
  return freezeComposedItem({
    candidateId: input.entry.candidateId,
    guidanceId: input.entry.guidance.guidanceId,
    priorityTier: input.priorityTier,
    role: input.role,
    ordinal: input.entry.ordinal,
    guidance: input.entry.guidance,
    provenance: input.entry.provenance,
    resolutionReasons: input.entry.reasons,
  });
}

export function summarizeDirectorExecutiveGuidanceComposition(input: {
  readonly primary: DirectorRuntimeExecutiveGuidanceComposedItem | null;
  readonly supporting: readonly DirectorRuntimeExecutiveGuidanceComposedItem[];
  readonly contextual: readonly DirectorRuntimeExecutiveGuidanceComposedItem[];
  readonly background: readonly DirectorRuntimeExecutiveGuidanceComposedItem[];
  readonly relationships: readonly DirectorRuntimeExecutiveGuidanceCompositionRelationship[];
  readonly paths: readonly DirectorRuntimeExecutiveGuidanceCompositionPath[];
  readonly deferredReferenceCount: number;
  readonly suppressedReferenceCount: number;
  readonly rejectedReferenceCount: number;
  readonly unresolvedReferenceCount: number;
}): DirectorRuntimeExecutiveGuidanceCompositionSummary {
  const primaryCount = input.primary === null ? 0 : 1;
  return Object.freeze({
    activeItemCount:
      primaryCount +
      input.supporting.length +
      input.contextual.length +
      input.background.length,
    primaryCount: primaryCount as 0 | 1,
    supportingCount: input.supporting.length,
    contextualCount: input.contextual.length,
    backgroundCount: input.background.length,
    relationshipCount: input.relationships.length,
    pathCount: input.paths.length,
    deferredReferenceCount: input.deferredReferenceCount,
    suppressedReferenceCount: input.suppressedReferenceCount,
    rejectedReferenceCount: input.rejectedReferenceCount,
    unresolvedReferenceCount: input.unresolvedReferenceCount,
  });
}

export function traceDirectorExecutiveGuidanceComposition(input: {
  readonly resolution: DirectorRuntimeExecutiveGuidanceResolution;
  readonly activeByCandidateId: ReadonlyMap<
    string,
    {
      readonly tier: DirectorRuntimeExecutiveGuidancePriorityTier;
      readonly role: DirectorRuntimeExecutiveGuidanceCompositionRole;
    }
  >;
}): readonly DirectorRuntimeExecutiveGuidanceCompositionTrace[] {
  return Object.freeze(
    input.resolution.entries.map((entry) => {
      const active = input.activeByCandidateId.get(entry.candidateId);
      return Object.freeze({
        candidateId: entry.candidateId,
        guidanceId: entry.guidance?.guidanceId ?? null,
        resolutionStatus: entry.status,
        compositionTier: active?.tier ?? null,
        compositionRole: active?.role ?? null,
      });
    }),
  );
}

function buildGroups(
  primary: DirectorRuntimeExecutiveGuidanceComposedItem | null,
  supporting: readonly DirectorRuntimeExecutiveGuidanceComposedItem[],
  contextual: readonly DirectorRuntimeExecutiveGuidanceComposedItem[],
  background: readonly DirectorRuntimeExecutiveGuidanceComposedItem[],
): readonly DirectorRuntimeExecutiveGuidanceCompositionGroup[] {
  const byRole = new Map<
    DirectorRuntimeExecutiveGuidanceCompositionRole,
    string[]
  >();
  const all = [
    ...(primary === null ? [] : [primary]),
    ...supporting,
    ...contextual,
    ...background,
  ];
  for (const item of all) {
    const existing = byRole.get(item.role) ?? [];
    byRole.set(item.role, [...existing, item.candidateId]);
  }
  const groups = DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_ROLES.flatMap(
    (role) => {
      const itemIds = byRole.get(role);
      if (itemIds === undefined || itemIds.length === 0) {
        return [];
      }
      return [
        Object.freeze({
          groupId: `group.${role}`,
          role,
          itemIds: Object.freeze([...itemIds]),
        }),
      ];
    },
  );
  return Object.freeze(groups);
}

// ─── Core composer ──────────────────────────────────────────────────────────

export function composeDirectorExecutiveGuidance(
  input: DirectorRuntimeExecutiveGuidanceCompositionInput,
): DirectorRuntimeExecutiveGuidanceComposition {
  const resolution = input.resolution;
  const relationships = Object.freeze(
    input.relationships.map((entry) => freezeRelationship(entry)),
  );
  const paths = Object.freeze(input.paths.map((entry) => freezePath(entry)));

  const selected = resolution.entries.filter(
    (entry) => entry.status === "selected" && entry.guidance !== null,
  );

  const deferredCandidateIds = Object.freeze(
    resolution.entries
      .filter((entry) => entry.status === "deferred")
      .map((entry) => entry.candidateId),
  );
  const suppressedCandidateIds = Object.freeze(
    resolution.entries
      .filter((entry) => entry.status === "suppressed")
      .map((entry) => entry.candidateId),
  );
  const rejectedCandidateIds = Object.freeze(
    resolution.entries
      .filter((entry) => entry.status === "rejected")
      .map((entry) => entry.candidateId),
  );
  const unresolvedCandidateIds = Object.freeze(
    resolution.entries
      .filter((entry) => entry.status === "unresolved")
      .map((entry) => entry.candidateId),
  );

  // Rule 1 — upstream primary
  let primary: DirectorRuntimeExecutiveGuidanceComposedItem | null = null;
  const primaryId = resolution.primaryCandidateId;
  if (primaryId !== null) {
    const primaryEntry = selected.find(
      (entry) => entry.candidateId === primaryId,
    );
    if (primaryEntry !== undefined && primaryEntry.guidance !== null) {
      const role = resolveDirectorExecutiveGuidanceCompositionRole(
        primaryEntry.guidance,
      );
      primary = composeDirectorExecutiveGuidanceItem({
        entry: primaryEntry,
        priorityTier: "primary",
        role: role === "background-context" ? "attention-anchor" : role,
      });
    }
  }

  const primaryTarget = primary?.guidance.target ?? null;
  const supporting: DirectorRuntimeExecutiveGuidanceComposedItem[] = [];
  const contextual: DirectorRuntimeExecutiveGuidanceComposedItem[] = [];
  const background: DirectorRuntimeExecutiveGuidanceComposedItem[] = [];
  const activeByCandidateId = new Map<
    string,
    {
      readonly tier: DirectorRuntimeExecutiveGuidancePriorityTier;
      readonly role: DirectorRuntimeExecutiveGuidanceCompositionRole;
    }
  >();

  if (primary !== null) {
    activeByCandidateId.set(primary.candidateId, {
      tier: "primary",
      role: primary.role,
    });
  }

  // Preserve upstream selected order for non-primary active items
  for (const entry of selected) {
    if (primary !== null && entry.candidateId === primary.candidateId) {
      continue;
    }
    if (entry.guidance === null) continue;

    const role = resolveDirectorExecutiveGuidanceCompositionRole(entry.guidance);
    const { tier } = resolveDirectorExecutiveGuidancePriorityTier({
      entry,
      role,
      primaryTarget,
      relationships,
      paths,
      isPrimary: false,
    });

    const item = composeDirectorExecutiveGuidanceItem({
      entry,
      priorityTier: tier,
      role,
    });
    if (item === null) continue;

    activeByCandidateId.set(item.candidateId, {
      tier: item.priorityTier,
      role: item.role,
    });

    if (tier === "supporting") {
      supporting.push(item);
    } else if (tier === "contextual") {
      contextual.push(item);
    } else {
      background.push(item);
    }
  }

  const frozenSupporting = Object.freeze(supporting);
  const frozenContextual = Object.freeze(contextual);
  const frozenBackground = Object.freeze(background);
  const groups = buildGroups(
    primary,
    frozenSupporting,
    frozenContextual,
    frozenBackground,
  );
  const traces = traceDirectorExecutiveGuidanceComposition({
    resolution,
    activeByCandidateId,
  });
  const summary = summarizeDirectorExecutiveGuidanceComposition({
    primary,
    supporting: frozenSupporting,
    contextual: frozenContextual,
    background: frozenBackground,
    relationships,
    paths,
    deferredReferenceCount: deferredCandidateIds.length,
    suppressedReferenceCount: suppressedCandidateIds.length,
    rejectedReferenceCount: rejectedCandidateIds.length,
    unresolvedReferenceCount: unresolvedCandidateIds.length,
  });

  return Object.freeze({
    compositionId: input.compositionId,
    requestId: resolution.requestId,
    primary,
    supporting: frozenSupporting,
    contextual: frozenContextual,
    background: frozenBackground,
    relationships,
    paths,
    groups,
    traces,
    deferredCandidateIds,
    suppressedCandidateIds,
    rejectedCandidateIds,
    unresolvedCandidateIds,
    summary,
  });
}

// ─── Invariants ─────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_INVARIANTS =
  Object.freeze([
    Object.freeze({
      id: "resolution-not-composition",
      statement:
        "Resolution owns candidate survival; composition owns semantic hierarchy",
    }),
    Object.freeze({
      id: "composition-not-delivery",
      statement: "composition does not hand off or transport guidance to consumers",
    }),
    Object.freeze({
      id: "at-most-one-primary",
      statement: "composition contains at most one primary item",
    }),
    Object.freeze({
      id: "selected-only-activation",
      statement: "only selected resolution entries become active composed items",
    }),
    Object.freeze({
      id: "no-multi-tier-membership",
      statement: "no active candidate appears in more than one composition tier",
    }),
    Object.freeze({
      id: "preserve-selected-order",
      statement: "within tiers, upstream selected order is preserved",
    }),
    Object.freeze({
      id: "no-numeric-scoring",
      statement: "composition uses explicit rules without numeric scores",
    }),
    Object.freeze({
      id: "traceability-complete",
      statement: "every upstream candidate remains auditable in composition traces",
    }),
    Object.freeze({
      id: "sole-upstream-dri-7-3",
      statement: "DRI-7:4 depends only on DRI-7:3 Resolution",
    }),
  ] as const);

export type DirectorRuntimeExecutiveGuidanceCompositionInvariant =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_INVARIANTS)[number];

// ─── Registry ───────────────────────────────────────────────────────────────

export const directorRuntimeExecutiveGuidanceCompositionApiNames = Object.freeze([
  "isDirectorRuntimeExecutiveGuidancePriorityTier",
  "isDirectorRuntimeExecutiveGuidanceCompositionRole",
  "resolveDirectorExecutiveGuidanceCompositionRole",
  "resolveDirectorExecutiveGuidancePriorityTier",
  "composeDirectorExecutiveGuidanceItem",
  "summarizeDirectorExecutiveGuidanceComposition",
  "traceDirectorExecutiveGuidanceComposition",
  "composeDirectorExecutiveGuidance",
  "verifyDirectorRuntimeExecutiveGuidanceComposition",
] as const);

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "DirectorRuntimeExecutiveGuidancePriorityTier",
    "DirectorRuntimeExecutiveGuidanceCompositionRole",
    "DirectorRuntimeExecutiveGuidanceCompositionRuleName",
    "DirectorRuntimeExecutiveGuidanceCompositionRuleId",
    "DirectorRuntimeExecutiveGuidanceCompositionRelationshipKind",
    "DirectorRuntimeExecutiveGuidanceCompositionRelationship",
    "DirectorRuntimeExecutiveGuidanceCompositionPath",
    "DirectorRuntimeExecutiveGuidanceComposedItem",
    "DirectorRuntimeExecutiveGuidanceCompositionGroup",
    "DirectorRuntimeExecutiveGuidanceCompositionTrace",
    "DirectorRuntimeExecutiveGuidanceCompositionSummary",
    "DirectorRuntimeExecutiveGuidanceCompositionInput",
    "DirectorRuntimeExecutiveGuidanceComposition",
    "DirectorRuntimeExecutiveGuidanceCompositionInvariant",
    "DirectorRuntimeExecutiveGuidanceCompositionVerification",
  ] as const);

export const directorRuntimeExecutiveGuidanceCompositionRegistry = Object.freeze({
  identity: directorRuntimeExecutiveGuidanceCompositionIdentity,
  version: directorRuntimeExecutiveGuidanceCompositionVersion,
  namespace: directorRuntimeExecutiveGuidanceCompositionNamespace,
  dependency: directorRuntimeExecutiveGuidanceCompositionUpstream,
  principle: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_PRINCIPLE,
  boundary: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_BOUNDARY,
  priorityTiers: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PRIORITY_TIERS,
  priorityTierCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PRIORITY_TIERS.length,
  compositionRoles: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_ROLES,
  compositionRoleCount:
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_ROLES.length,
  ruleOrder: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_RULE_ORDER,
  ruleIds: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_RULE_IDS,
  ruleCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_RULE_ORDER.length,
  relationshipKinds:
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_RELATIONSHIP_KINDS,
  relationshipKindCount:
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_RELATIONSHIP_KINDS.length,
  invariants: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_INVARIANTS,
  invariantCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_INVARIANTS.length,
  publicTypes: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_PUBLIC_TYPE_NAMES,
  publicTypeCount:
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_PUBLIC_TYPE_NAMES.length,
  publicApis: directorRuntimeExecutiveGuidanceCompositionApiNames,
  publicApiCount: directorRuntimeExecutiveGuidanceCompositionApiNames.length,
  registrySectionCount: 4 as const,
});

export const directorRuntimeExecutiveGuidanceComposition = Object.freeze({
  phase: "DRI-7:4" as const,
  name: "DirectorRuntimeExecutiveGuidanceComposition" as const,
  identity: directorRuntimeExecutiveGuidanceCompositionIdentity,
  namespace: directorRuntimeExecutiveGuidanceCompositionNamespace,
  version: directorRuntimeExecutiveGuidanceCompositionVersion,
  layer: "Director Runtime Integration" as const,
  domain: "ExecutiveGuidanceAttentionDelivery" as const,
  role: "Composition" as const,
  stage: "Composition" as const,
  status: "CompositionReady" as const,
  upstreamDependency: directorRuntimeExecutiveGuidanceCompositionUpstream,
  deterministic: true as const,
  composition: true as const,
  rendererIndependent: true as const,
  advisorIndependent: true as const,
  actionIndependent: true as const,
  deliveryIndependent: true as const,
  philosophy: "composition-not-delivery" as const,
  principle: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_PRINCIPLE,
  boundary: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_BOUNDARY,
  priorityTiers: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PRIORITY_TIERS,
  compositionRoles: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_ROLES,
  ruleOrder: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_RULE_ORDER,
  ruleIds: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_RULE_IDS,
  invariants: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_INVARIANTS,
  publicApiSurface: directorRuntimeExecutiveGuidanceCompositionApiNames,
  publicTypes: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_PUBLIC_TYPE_NAMES,
  registry: directorRuntimeExecutiveGuidanceCompositionRegistry,
  resolutionBoundary: "DRI-7:3-resolution-only" as const,
  architecturalStatus:
    "Composition Complete · Prioritized · Deterministic · Traceable · Immutable · Renderer-Independent · ReadyForDelivery" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface DirectorRuntimeExecutiveGuidanceCompositionVerification {
  readonly ok: boolean;
  readonly identity: typeof directorRuntimeExecutiveGuidanceCompositionIdentity;
  readonly version: typeof directorRuntimeExecutiveGuidanceCompositionVersion;
  readonly namespace: typeof directorRuntimeExecutiveGuidanceCompositionNamespace;
  readonly dependency: typeof directorRuntimeExecutiveGuidanceCompositionUpstream;
  readonly priorityTierCount: number;
  readonly compositionRoleCount: number;
  readonly ruleCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly invariantCount: number;
  readonly frozen: boolean;
  readonly atMostOnePrimary: boolean;
  readonly selectedOnlyActivation: boolean;
  readonly noNumericScoring: boolean;
  readonly resolutionCompatible: boolean;
  readonly deliveryIndependent: boolean;
  readonly rendererIndependent: boolean;
  readonly advisorIndependent: boolean;
  readonly actionIndependent: boolean;
  readonly composerDeterministic: boolean;
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

function buildVerificationFixture(): DirectorRuntimeExecutiveGuidanceCompositionInput {
  const productionGuidance: DirectorRuntimeExecutiveGuidanceItem = Object.freeze({
    guidanceId: "guidance.production-risk",
    guidanceKind: "direct-attention",
    target: Object.freeze({
      targetKind: "object" as const,
      targetId: "production",
    }),
    importance: "critical",
    urgency: "immediate",
    intent: "warn",
    source: Object.freeze({
      sourceKind: "attention-output" as const,
      sourceId: "attention.production-risk",
    }),
  });
  const kpiGuidance: DirectorRuntimeExecutiveGuidanceItem = Object.freeze({
    guidanceId: "guidance.delivery-kpi",
    guidanceKind: "surface-evidence",
    target: Object.freeze({
      targetKind: "object" as const,
      targetId: "production",
    }),
    importance: "important",
    urgency: "soon",
    intent: "explain",
    source: Object.freeze({
      sourceKind: "attention-candidate" as const,
      sourceId: "candidate.delivery-kpi",
    }),
  });
  const emptyProvenance: DirectorRuntimeExecutiveGuidanceProvenance =
    Object.freeze({
      sourceReferences: Object.freeze([]),
      derivedFromGuidanceIds: Object.freeze([]),
    });

  const resolution: DirectorRuntimeExecutiveGuidanceResolution = Object.freeze({
    resolutionId: "resolution.verify",
    requestId: "request.verify",
    entries: Object.freeze([
      Object.freeze({
        candidateId: "candidate.production-risk",
        status: "selected" as const,
        reasons: Object.freeze(["eligible" as const]),
        guidance: productionGuidance,
        provenance: emptyProvenance,
        ordinal: 0,
      }),
      Object.freeze({
        candidateId: "candidate.delivery-kpi",
        status: "selected" as const,
        reasons: Object.freeze(["eligible" as const]),
        guidance: kpiGuidance,
        provenance: emptyProvenance,
        ordinal: 1,
      }),
      Object.freeze({
        candidateId: "candidate.deferred",
        status: "deferred" as const,
        reasons: Object.freeze(["candidate-deferred" as const]),
        guidance: null,
        provenance: emptyProvenance,
        ordinal: 2,
      }),
    ]),
    selectedCandidateIds: Object.freeze([
      "candidate.production-risk",
      "candidate.delivery-kpi",
    ]),
    primaryCandidateId: "candidate.production-risk",
    summary: Object.freeze({
      totalCandidates: 3,
      selectedCount: 2,
      deferredCount: 1,
      suppressedCount: 0,
      rejectedCount: 0,
      unresolvedCount: 0,
    }),
  });

  return {
    compositionId: "composition.verify",
    resolution,
    relationships: Object.freeze([]),
    paths: Object.freeze([]),
  };
}

export function verifyDirectorRuntimeExecutiveGuidanceComposition():
  DirectorRuntimeExecutiveGuidanceCompositionVerification {
  const composition = directorRuntimeExecutiveGuidanceComposition;
  const registry = directorRuntimeExecutiveGuidanceCompositionRegistry;

  const identityOk =
    composition.identity ===
      "DRI-7:4/DirectorRuntimeExecutiveGuidanceComposition" &&
    composition.version === "7.4.0" &&
    composition.namespace === "nexora.dri.executive-guidance.composition" &&
    composition.upstreamDependency ===
      "DRI-7:3/DirectorRuntimeExecutiveGuidanceResolution" &&
    composition.upstreamDependency ===
      directorRuntimeExecutiveGuidanceResolutionIdentity &&
    registry.dependency === composition.upstreamDependency &&
    composition.resolutionBoundary === "DRI-7:3-resolution-only";

  const vocabularyOk =
    exactOrder(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PRIORITY_TIERS, [
      "primary",
      "supporting",
      "contextual",
      "background",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_ROLES, [
      "attention-anchor",
      "supporting-evidence",
      "risk-context",
      "opportunity-context",
      "relationship-explanation",
      "path-explanation",
      "comparison-context",
      "preserved-context",
      "background-context",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_RULE_ORDER, [
      "upstream-primary",
      "direct-support",
      "explicit-relationship",
      "explicit-path",
      "preserved-context",
      "contextual-relevance",
      "background-fallback",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_RULE_IDS, [
      "dri7.composition.upstream-primary",
      "dri7.composition.direct-support",
      "dri7.composition.explicit-relationship",
      "dri7.composition.explicit-path",
      "dri7.composition.preserved-context",
      "dri7.composition.contextual-relevance",
      "dri7.composition.background-fallback",
    ]) &&
    unique([...DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PRIORITY_TIERS]) &&
    unique([...DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_ROLES]) &&
    unique([...DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_RULE_ORDER]) &&
    unique([...DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_RULE_IDS]);

  const fixture = buildVerificationFixture();
  const first = composeDirectorExecutiveGuidance(fixture);
  const second = composeDirectorExecutiveGuidance(fixture);

  const atMostOnePrimary = first.summary.primaryCount <= 1;
  const selectedOnlyActivation =
    first.primary?.candidateId === "candidate.production-risk" &&
    first.supporting.every((item) =>
      fixture.resolution.selectedCandidateIds.includes(item.candidateId)) &&
    first.deferredCandidateIds.includes("candidate.deferred") &&
    first.traces.length === fixture.resolution.entries.length;
  const summaryOk =
    first.summary.activeItemCount ===
      first.summary.primaryCount +
        first.summary.supportingCount +
        first.summary.contextualCount +
        first.summary.backgroundCount &&
    first.summary.deferredReferenceCount ===
      fixture.resolution.summary.deferredCount;
  const composerDeterministic = JSON.stringify(first) === JSON.stringify(second);
  const noNumericScoring =
    composition.boundary.doesNotScoreGuidance === true &&
    composition.boundary.doesNotRankByWeight === true;

  const immutabilityOk =
    Object.isFrozen(composition) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(directorRuntimeExecutiveGuidanceCompositionCanonicalIdentity) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PRIORITY_TIERS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_ROLES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_RULE_ORDER) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_RULE_IDS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_BOUNDARY) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_INVARIANTS) &&
    Object.isFrozen(first) &&
    Object.isFrozen(first.supporting) &&
    Object.isFrozen(first.summary) &&
    Object.isFrozen(first.traces);

  const ok =
    identityOk &&
    vocabularyOk &&
    atMostOnePrimary &&
    selectedOnlyActivation &&
    summaryOk &&
    composerDeterministic &&
    noNumericScoring &&
    immutabilityOk &&
    composition.deliveryIndependent === true &&
    composition.rendererIndependent === true &&
    composition.advisorIndependent === true &&
    composition.actionIndependent === true;

  return Object.freeze({
    ok,
    identity: directorRuntimeExecutiveGuidanceCompositionIdentity,
    version: directorRuntimeExecutiveGuidanceCompositionVersion,
    namespace: directorRuntimeExecutiveGuidanceCompositionNamespace,
    dependency: directorRuntimeExecutiveGuidanceCompositionUpstream,
    priorityTierCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_PRIORITY_TIERS.length,
    compositionRoleCount:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_ROLES.length,
    ruleCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_RULE_ORDER.length,
    publicTypeCount:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_PUBLIC_TYPE_NAMES.length,
    publicApiCount: directorRuntimeExecutiveGuidanceCompositionApiNames.length,
    invariantCount:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_COMPOSITION_INVARIANTS.length,
    frozen: immutabilityOk,
    atMostOnePrimary,
    selectedOnlyActivation,
    noNumericScoring,
    resolutionCompatible:
      composition.upstreamDependency ===
      "DRI-7:3/DirectorRuntimeExecutiveGuidanceResolution",
    deliveryIndependent: composition.deliveryIndependent,
    rendererIndependent: composition.rendererIndependent,
    advisorIndependent: composition.advisorIndependent,
    actionIndependent: composition.actionIndependent,
    composerDeterministic,
  });
}
