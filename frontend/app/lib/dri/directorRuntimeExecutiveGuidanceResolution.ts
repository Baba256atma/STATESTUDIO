/**
 * DRI-7:3 — Director Runtime Executive Guidance Resolution.
 *
 * Deterministic rule-based disposition of guidance candidates into selected,
 * deferred, suppressed, rejected, or unresolved outcomes. May identify a
 * semantic primary candidate. Does not compose packages, deliver, or render.
 *
 * Principle: Foundation defines vocabulary. Contracts define transport.
 * Resolution decides candidate disposition. Composition decides hierarchy.
 */

import {
  createDirectorRuntimeExecutiveGuidanceItem,
  createDirectorRuntimeExecutiveGuidanceProvenance,
  createDirectorRuntimeExecutiveGuidanceTarget,
  directorRuntimeExecutiveGuidanceContractsIdentity,
  isDirectorRuntimeExecutiveGuidanceCandidate,
  isDirectorRuntimeExecutiveGuidanceEnvelope,
  isDirectorRuntimeExecutiveGuidanceProvenance,
  type DirectorRuntimeExecutiveGuidanceCandidate,
  type DirectorRuntimeExecutiveGuidanceConstraints,
  type DirectorRuntimeExecutiveGuidanceContextReference,
  type DirectorRuntimeExecutiveGuidanceDeliveryPolicy,
  type DirectorRuntimeExecutiveGuidanceEnvelope,
  type DirectorRuntimeExecutiveGuidanceItem,
  type DirectorRuntimeExecutiveGuidanceProvenance,
  type DirectorRuntimeExecutiveGuidanceTarget,
} from "@/app/lib/dri/directorRuntimeExecutiveGuidanceContracts";

export type {
  DirectorRuntimeExecutiveGuidanceCandidate,
  DirectorRuntimeExecutiveGuidanceConstraints,
  DirectorRuntimeExecutiveGuidanceContextReference,
  DirectorRuntimeExecutiveGuidanceDeliveryPolicy,
  DirectorRuntimeExecutiveGuidanceEnvelope,
  DirectorRuntimeExecutiveGuidanceItem,
  DirectorRuntimeExecutiveGuidanceProvenance,
  DirectorRuntimeExecutiveGuidanceTarget,
};

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeExecutiveGuidanceResolutionIdentity =
  "DRI-7:3/DirectorRuntimeExecutiveGuidanceResolution" as const;
export const directorRuntimeExecutiveGuidanceResolutionVersion =
  "7.3.0" as const;
export const directorRuntimeExecutiveGuidanceResolutionNamespace =
  "nexora.dri.executive-guidance.resolution" as const;
export const directorRuntimeExecutiveGuidanceResolutionUpstream =
  directorRuntimeExecutiveGuidanceContractsIdentity;

export const directorRuntimeExecutiveGuidanceResolutionCanonicalIdentity =
  Object.freeze({
    identity: directorRuntimeExecutiveGuidanceResolutionIdentity,
    version: directorRuntimeExecutiveGuidanceResolutionVersion,
    namespace: directorRuntimeExecutiveGuidanceResolutionNamespace,
    upstream: directorRuntimeExecutiveGuidanceResolutionUpstream,
  });

// ─── Principle / boundary ───────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_PRINCIPLE =
  "Foundation defines guidance vocabulary. Contracts define valid semantic transport. Resolution decides candidate disposition. Composition decides final guidance hierarchy." as const;

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_BOUNDARY =
  Object.freeze({
    contractsAuthority: "DRI-7:2" as const,
    resolutionAuthority: "DRI-7:3" as const,
    compositionAuthority: "DRI-7:4" as const,
    doesNotComposeGuidance: true as const,
    doesNotDeliverGuidance: true as const,
    doesNotScoreGuidance: true as const,
    doesNotRankByWeight: true as const,
    preservesCandidateOrder: true as const,
    preservesAllCandidates: true as const,
    consumesContractsOnly: true as const,
  });

// ─── Status vocabulary ──────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_STATUSES =
  Object.freeze([
    "selected",
    "deferred",
    "suppressed",
    "rejected",
    "unresolved",
  ] as const);
export type DirectorRuntimeExecutiveGuidanceResolutionStatus =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_STATUSES)[number];

// ─── Reason vocabulary ──────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_REASONS =
  Object.freeze([
    "eligible",
    "candidate-ineligible",
    "candidate-suppressed",
    "candidate-deferred",
    "context-mismatch",
    "focus-preservation",
    "interruption-not-allowed",
    "comparison-not-allowed",
    "path-explanation-not-allowed",
    "duplicate-guidance",
    "conflicting-guidance",
    "maximum-guidance-reached",
    "insufficient-context",
    "invalid-provenance",
    "constraint-conflict",
    "unresolved-conflict",
  ] as const);
export type DirectorRuntimeExecutiveGuidanceResolutionReason =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_REASONS)[number];

// ─── Rule registry ──────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_RULE_ORDER =
  Object.freeze([
    "contract-validity",
    "eligibility",
    "focus-preservation",
    "context-preservation",
    "interruption",
    "comparison",
    "path-explanation",
    "duplicate",
    "conflict",
    "maximum-guidance",
    "primary-candidate",
  ] as const);
export type DirectorRuntimeExecutiveGuidanceResolutionRuleName =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_RULE_ORDER)[number];

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_RULE_IDS =
  Object.freeze([
    "dri7.resolution.contract-validity",
    "dri7.resolution.eligibility",
    "dri7.resolution.focus-preservation",
    "dri7.resolution.context-preservation",
    "dri7.resolution.interruption",
    "dri7.resolution.comparison",
    "dri7.resolution.path-explanation",
    "dri7.resolution.duplicate",
    "dri7.resolution.conflict",
    "dri7.resolution.maximum-guidance",
    "dri7.resolution.primary-candidate",
  ] as const);
export type DirectorRuntimeExecutiveGuidanceResolutionRuleId =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_RULE_IDS)[number];

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface DirectorRuntimeExecutiveGuidanceResolutionContext {
  readonly activeContext: DirectorRuntimeExecutiveGuidanceContextReference | null;
  readonly activeFocus: DirectorRuntimeExecutiveGuidanceTarget | null;
  readonly deliveryPolicy: DirectorRuntimeExecutiveGuidanceDeliveryPolicy;
}

export interface DirectorRuntimeExecutiveGuidanceResolutionInput {
  readonly resolutionId: string;
  readonly envelope: DirectorRuntimeExecutiveGuidanceEnvelope;
  readonly context: DirectorRuntimeExecutiveGuidanceResolutionContext;
}

export interface DirectorRuntimeExecutiveGuidanceResolutionEntry {
  readonly candidateId: string;
  readonly status: DirectorRuntimeExecutiveGuidanceResolutionStatus;
  readonly reasons: readonly DirectorRuntimeExecutiveGuidanceResolutionReason[];
  readonly guidance: DirectorRuntimeExecutiveGuidanceItem | null;
  readonly provenance: DirectorRuntimeExecutiveGuidanceProvenance;
  readonly ordinal: number;
}

export interface DirectorRuntimeExecutiveGuidanceResolutionSummary {
  readonly totalCandidates: number;
  readonly selectedCount: number;
  readonly deferredCount: number;
  readonly suppressedCount: number;
  readonly rejectedCount: number;
  readonly unresolvedCount: number;
}

export interface DirectorRuntimeExecutiveGuidanceResolution {
  readonly resolutionId: string;
  readonly requestId: string;
  readonly entries: readonly DirectorRuntimeExecutiveGuidanceResolutionEntry[];
  readonly selectedCandidateIds: readonly string[];
  readonly primaryCandidateId: string | null;
  readonly summary: DirectorRuntimeExecutiveGuidanceResolutionSummary;
}

type MutableEntry = {
  candidateId: string;
  status: DirectorRuntimeExecutiveGuidanceResolutionStatus;
  reasons: DirectorRuntimeExecutiveGuidanceResolutionReason[];
  guidance: DirectorRuntimeExecutiveGuidanceItem | null;
  provenance: DirectorRuntimeExecutiveGuidanceProvenance;
  ordinal: number;
  duplicateKey: string | null;
};

// ─── Vocabulary helpers ─────────────────────────────────────────────────────

export function isDirectorRuntimeExecutiveGuidanceResolutionStatus(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidanceResolutionStatus {
  return (
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_STATUSES as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeExecutiveGuidanceResolutionReason(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidanceResolutionReason {
  return (
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_REASONS as readonly unknown[]
  ).includes(value);
}

// ─── Pure constructors ──────────────────────────────────────────────────────

export function createDirectorRuntimeExecutiveGuidanceResolutionContext(
  input: DirectorRuntimeExecutiveGuidanceResolutionContext,
): DirectorRuntimeExecutiveGuidanceResolutionContext {
  return Object.freeze({
    activeContext: input.activeContext === null
      ? null
      : Object.freeze({ ...input.activeContext }),
    activeFocus: input.activeFocus === null
      ? null
      : createDirectorRuntimeExecutiveGuidanceTarget(input.activeFocus),
    deliveryPolicy: Object.freeze({ ...input.deliveryPolicy }),
  });
}

export function createDirectorRuntimeExecutiveGuidanceResolutionInput(
  input: DirectorRuntimeExecutiveGuidanceResolutionInput,
): DirectorRuntimeExecutiveGuidanceResolutionInput {
  return Object.freeze({
    resolutionId: input.resolutionId,
    envelope: input.envelope,
    context: createDirectorRuntimeExecutiveGuidanceResolutionContext(
      input.context,
    ),
  });
}

export function createDirectorRuntimeExecutiveGuidanceResolutionEntry(
  input: DirectorRuntimeExecutiveGuidanceResolutionEntry,
): DirectorRuntimeExecutiveGuidanceResolutionEntry {
  return Object.freeze({
    candidateId: input.candidateId,
    status: input.status,
    reasons: Object.freeze([...input.reasons]),
    guidance:
      input.guidance === null
        ? null
        : createDirectorRuntimeExecutiveGuidanceItem(input.guidance),
    provenance: createDirectorRuntimeExecutiveGuidanceProvenance(
      input.provenance,
    ),
    ordinal: input.ordinal,
  });
}

export function createDirectorRuntimeExecutiveGuidanceResolutionSummary(
  input: DirectorRuntimeExecutiveGuidanceResolutionSummary,
): DirectorRuntimeExecutiveGuidanceResolutionSummary {
  return Object.freeze({ ...input });
}

export function createDirectorRuntimeExecutiveGuidanceResolution(
  input: DirectorRuntimeExecutiveGuidanceResolution,
): DirectorRuntimeExecutiveGuidanceResolution {
  return Object.freeze({
    resolutionId: input.resolutionId,
    requestId: input.requestId,
    entries: Object.freeze(
      input.entries.map((entry) =>
        createDirectorRuntimeExecutiveGuidanceResolutionEntry(entry)),
    ),
    selectedCandidateIds: Object.freeze([...input.selectedCandidateIds]),
    primaryCandidateId: input.primaryCandidateId,
    summary: createDirectorRuntimeExecutiveGuidanceResolutionSummary(
      input.summary,
    ),
  });
}

// ─── Internal helpers ───────────────────────────────────────────────────────

function targetsEqual(
  a: DirectorRuntimeExecutiveGuidanceTarget,
  b: DirectorRuntimeExecutiveGuidanceTarget,
): boolean {
  return a.targetKind === b.targetKind && a.targetId === b.targetId;
}

function mergeConstraints(
  request: DirectorRuntimeExecutiveGuidanceConstraints,
  candidate: DirectorRuntimeExecutiveGuidanceConstraints,
  policy: DirectorRuntimeExecutiveGuidanceDeliveryPolicy,
): Required<
  Pick<
    DirectorRuntimeExecutiveGuidanceConstraints,
    | "preserveCurrentFocus"
    | "preserveExecutiveContext"
    | "allowInterruption"
    | "allowComparison"
    | "allowPathExplanation"
  >
> & { maximumGuidanceItems?: number } {
  return {
    preserveCurrentFocus:
      candidate.preserveCurrentFocus ??
      request.preserveCurrentFocus ??
      policy.preserveFocus,
    preserveExecutiveContext:
      candidate.preserveExecutiveContext ??
      request.preserveExecutiveContext ??
      policy.preserveContext,
    allowInterruption:
      candidate.allowInterruption ?? request.allowInterruption ?? true,
    allowComparison:
      candidate.allowComparison ?? request.allowComparison ?? true,
    allowPathExplanation:
      candidate.allowPathExplanation ?? request.allowPathExplanation ?? true,
    maximumGuidanceItems:
      candidate.maximumGuidanceItems ?? request.maximumGuidanceItems,
  };
}

function duplicateKeyFor(
  candidate: DirectorRuntimeExecutiveGuidanceCandidate,
): string {
  const g = candidate.guidance;
  return [
    g.guidanceKind,
    g.target.targetKind,
    g.target.targetId,
    g.intent,
    g.source.sourceKind,
    g.source.sourceId,
  ].join("\u0000");
}

function emptyProvenance(): DirectorRuntimeExecutiveGuidanceProvenance {
  return createDirectorRuntimeExecutiveGuidanceProvenance({
    sourceReferences: [],
    derivedFromGuidanceIds: [],
  });
}

function freezeEntry(entry: MutableEntry): DirectorRuntimeExecutiveGuidanceResolutionEntry {
  return Object.freeze({
    candidateId: entry.candidateId,
    status: entry.status,
    reasons: Object.freeze([...entry.reasons]),
    guidance: entry.guidance,
    provenance: entry.provenance,
    ordinal: entry.ordinal,
  });
}

function contextCompatible(
  target: DirectorRuntimeExecutiveGuidanceTarget,
  activeContext: DirectorRuntimeExecutiveGuidanceContextReference | null,
): boolean {
  if (activeContext === null) return true;
  if (
    target.targetKind === activeContext.contextKind &&
    target.targetId === activeContext.contextId
  ) {
    return true;
  }
  if (
    target.targetKind === "context" &&
    target.targetId === activeContext.contextId
  ) {
    return true;
  }
  return false;
}

function requiresInterruptiveDelivery(
  candidate: DirectorRuntimeExecutiveGuidanceCandidate,
  policy: DirectorRuntimeExecutiveGuidanceDeliveryPolicy,
): boolean {
  if (policy.interruption === "interruptive") return true;
  return (
    candidate.guidance.importance === "critical" &&
    candidate.guidance.urgency === "immediate"
  );
}

function isComparisonGuidance(
  candidate: DirectorRuntimeExecutiveGuidanceCandidate,
): boolean {
  return (
    candidate.guidance.guidanceKind === "compare" ||
    candidate.guidance.intent === "compare"
  );
}

function isPathExplanationGuidance(
  candidate: DirectorRuntimeExecutiveGuidanceCandidate,
): boolean {
  return candidate.guidance.guidanceKind === "explain-path";
}

// ─── Public semantic helpers ────────────────────────────────────────────────

export function resolveDirectorExecutiveGuidanceEligibility(
  eligibility: DirectorRuntimeExecutiveGuidanceCandidate["eligibility"],
): {
  readonly status: DirectorRuntimeExecutiveGuidanceResolutionStatus | "continue";
  readonly reason: DirectorRuntimeExecutiveGuidanceResolutionReason | null;
} {
  switch (eligibility) {
    case "eligible":
      return Object.freeze({ status: "continue" as const, reason: null });
    case "deferred":
      return Object.freeze({
        status: "deferred" as const,
        reason: "candidate-deferred" as const,
      });
    case "suppressed":
      return Object.freeze({
        status: "suppressed" as const,
        reason: "candidate-suppressed" as const,
      });
    case "ineligible":
      return Object.freeze({
        status: "rejected" as const,
        reason: "candidate-ineligible" as const,
      });
    default:
      return Object.freeze({
        status: "rejected" as const,
        reason: "candidate-ineligible" as const,
      });
  }
}

export function detectDirectorExecutiveGuidanceDuplicate(
  left: DirectorRuntimeExecutiveGuidanceCandidate,
  right: DirectorRuntimeExecutiveGuidanceCandidate,
): boolean {
  return duplicateKeyFor(left) === duplicateKeyFor(right);
}

export function detectDirectorExecutiveGuidanceConflict(
  left: DirectorRuntimeExecutiveGuidanceCandidate,
  right: DirectorRuntimeExecutiveGuidanceCandidate,
): {
  readonly conflicts: boolean;
  readonly resolvable: boolean;
  readonly winnerCandidateId: string | null;
} {
  const lg = left.guidance;
  const rg = right.guidance;

  // maintain-focus vs direct-attention on incompatible targets
  const maintainVsDirect =
    (lg.guidanceKind === "maintain-focus" &&
      rg.guidanceKind === "direct-attention" &&
      !targetsEqual(lg.target, rg.target)) ||
    (rg.guidanceKind === "maintain-focus" &&
      lg.guidanceKind === "direct-attention" &&
      !targetsEqual(lg.target, rg.target));

  if (maintainVsDirect) {
    return Object.freeze({
      conflicts: true,
      resolvable: false,
      winnerCandidateId: null,
    });
  }

  // preserve-context vs de-emphasize same target
  const preserveVsDeemphasize =
    (lg.guidanceKind === "preserve-context" &&
      rg.guidanceKind === "de-emphasize" &&
      targetsEqual(lg.target, rg.target)) ||
    (rg.guidanceKind === "preserve-context" &&
      lg.guidanceKind === "de-emphasize" &&
      targetsEqual(lg.target, rg.target));

  if (preserveVsDeemphasize) {
    const winnerId =
      lg.guidanceKind === "preserve-context"
        ? left.candidateId
        : right.candidateId;
    return Object.freeze({
      conflicts: true,
      resolvable: true,
      winnerCandidateId: winnerId,
    });
  }

  return Object.freeze({
    conflicts: false,
    resolvable: true,
    winnerCandidateId: null,
  });
}

export function summarizeDirectorExecutiveGuidanceResolution(
  entries: readonly DirectorRuntimeExecutiveGuidanceResolutionEntry[],
): DirectorRuntimeExecutiveGuidanceResolutionSummary {
  let selectedCount = 0;
  let deferredCount = 0;
  let suppressedCount = 0;
  let rejectedCount = 0;
  let unresolvedCount = 0;
  for (const entry of entries) {
    switch (entry.status) {
      case "selected":
        selectedCount += 1;
        break;
      case "deferred":
        deferredCount += 1;
        break;
      case "suppressed":
        suppressedCount += 1;
        break;
      case "rejected":
        rejectedCount += 1;
        break;
      case "unresolved":
        unresolvedCount += 1;
        break;
    }
  }
  return Object.freeze({
    totalCandidates: entries.length,
    selectedCount,
    deferredCount,
    suppressedCount,
    rejectedCount,
    unresolvedCount,
  });
}

export function resolveDirectorExecutiveGuidancePrimaryCandidate(
  entries: readonly DirectorRuntimeExecutiveGuidanceResolutionEntry[],
): string | null {
  const selected = entries.filter((entry) => entry.status === "selected");
  if (selected.length === 0) return null;
  if (selected.length === 1) return selected[0]!.candidateId;

  const directAttention = selected.filter(
    (entry) => entry.guidance?.guidanceKind === "direct-attention",
  );
  if (directAttention.length === 1) {
    return directAttention[0]!.candidateId;
  }

  // Stable input order among selected (already ordinal-ordered)
  return selected[0]!.candidateId;
}

/**
 * Resolve a single candidate through early terminal rules (validity → path).
 * Duplicate/conflict/maximum/primary are applied at envelope scope.
 */
export function resolveDirectorExecutiveGuidanceCandidate(
  candidate: DirectorRuntimeExecutiveGuidanceCandidate,
  ordinal: number,
  envelope: DirectorRuntimeExecutiveGuidanceEnvelope,
  context: DirectorRuntimeExecutiveGuidanceResolutionContext,
): DirectorRuntimeExecutiveGuidanceResolutionEntry {
  const candidateValue: unknown = candidate;

  // Rule 1 — Contract validity
  if (!isDirectorRuntimeExecutiveGuidanceCandidate(candidateValue)) {
    const partial = (candidateValue ?? {}) as {
      readonly candidateId?: unknown;
      readonly provenance?: unknown;
      readonly constraints?: DirectorRuntimeExecutiveGuidanceConstraints;
    };
    const provenance = isDirectorRuntimeExecutiveGuidanceProvenance(
      partial.provenance,
    )
      ? createDirectorRuntimeExecutiveGuidanceProvenance(partial.provenance)
      : emptyProvenance();
    const reasons: DirectorRuntimeExecutiveGuidanceResolutionReason[] =
      isDirectorRuntimeExecutiveGuidanceProvenance(partial.provenance)
        ? ["candidate-ineligible"]
        : ["invalid-provenance"];
    return freezeEntry({
      candidateId:
        typeof partial.candidateId === "string" &&
        partial.candidateId.trim().length > 0
          ? partial.candidateId
          : `invalid-candidate-${ordinal}`,
      status: "rejected",
      reasons,
      guidance: null,
      provenance,
      ordinal,
      duplicateKey: null,
    });
  }

  const constraints = mergeConstraints(
    envelope.request.constraints,
    candidateValue.constraints,
    context.deliveryPolicy,
  );

  const provenance = createDirectorRuntimeExecutiveGuidanceProvenance(
    candidateValue.provenance,
  );

  const guidance = createDirectorRuntimeExecutiveGuidanceItem(
    candidateValue.guidance,
  );

  // Rule 2 — Eligibility
  const eligibility = resolveDirectorExecutiveGuidanceEligibility(
    candidateValue.eligibility,
  );
  if (eligibility.status !== "continue") {
    return freezeEntry({
      candidateId: candidateValue.candidateId,
      status: eligibility.status,
      reasons: [eligibility.reason!],
      guidance,
      provenance,
      ordinal,
      duplicateKey: null,
    });
  }

  // Rule 3 — Focus preservation
  if (constraints.preserveCurrentFocus && context.activeFocus !== null) {
    const focus = context.activeFocus;
    const redirects =
      guidance.guidanceKind === "direct-attention" &&
      !targetsEqual(guidance.target, focus);
    const deemphasizesFocus =
      guidance.guidanceKind === "de-emphasize" &&
      targetsEqual(guidance.target, focus);
    if (redirects) {
      return freezeEntry({
        candidateId: candidateValue.candidateId,
        status: "deferred",
        reasons: ["focus-preservation"],
        guidance,
        provenance,
        ordinal,
        duplicateKey: null,
      });
    }
    if (deemphasizesFocus) {
      return freezeEntry({
        candidateId: candidateValue.candidateId,
        status: "suppressed",
        reasons: ["focus-preservation"],
        guidance,
        provenance,
        ordinal,
        duplicateKey: null,
      });
    }
  }

  // Rule 4 — Context preservation
  if (constraints.preserveExecutiveContext) {
    if (context.activeContext === null) {
      return freezeEntry({
        candidateId: candidateValue.candidateId,
        status: "deferred",
        reasons: ["insufficient-context"],
        guidance,
        provenance,
        ordinal,
        duplicateKey: null,
      });
    }
    if (!contextCompatible(guidance.target, context.activeContext)) {
      return freezeEntry({
        candidateId: candidateValue.candidateId,
        status: "deferred",
        reasons: ["context-mismatch"],
        guidance,
        provenance,
        ordinal,
        duplicateKey: null,
      });
    }
  }

  // Rule 5 — Interruption
  if (
    constraints.allowInterruption === false &&
    requiresInterruptiveDelivery(candidateValue, context.deliveryPolicy)
  ) {
    return freezeEntry({
      candidateId: candidateValue.candidateId,
      status: "deferred",
      reasons: ["interruption-not-allowed"],
      guidance,
      provenance,
      ordinal,
      duplicateKey: null,
    });
  }

  // Rule 6 — Comparison
  if (
    constraints.allowComparison === false &&
    isComparisonGuidance(candidateValue)
  ) {
    return freezeEntry({
      candidateId: candidateValue.candidateId,
      status: "suppressed",
      reasons: ["comparison-not-allowed"],
      guidance,
      provenance,
      ordinal,
      duplicateKey: null,
    });
  }

  // Rule 7 — Path explanation
  if (
    constraints.allowPathExplanation === false &&
    isPathExplanationGuidance(candidateValue)
  ) {
    return freezeEntry({
      candidateId: candidateValue.candidateId,
      status: "suppressed",
      reasons: ["path-explanation-not-allowed"],
      guidance,
      provenance,
      ordinal,
      duplicateKey: null,
    });
  }

  // Provisionally selected — envelope-scope rules applied later
  return freezeEntry({
    candidateId: candidateValue.candidateId,
    status: "selected",
    reasons: ["eligible"],
    guidance,
    provenance,
    ordinal,
    duplicateKey: null,
  });
}

// ─── Core resolver ──────────────────────────────────────────────────────────

export function resolveDirectorExecutiveGuidance(
  input: DirectorRuntimeExecutiveGuidanceResolutionInput,
): DirectorRuntimeExecutiveGuidanceResolution {
  const envelope = input.envelope;
  const context = input.context;
  const candidates = envelope.candidates;

  const working: MutableEntry[] = candidates.map((candidate, ordinal) => {
    const resolved = resolveDirectorExecutiveGuidanceCandidate(
      candidate,
      ordinal,
      envelope,
      context,
    );
    return {
      candidateId: resolved.candidateId,
      status: resolved.status,
      reasons: [...resolved.reasons],
      guidance: resolved.guidance,
      provenance: resolved.provenance,
      ordinal: resolved.ordinal,
      duplicateKey: isDirectorRuntimeExecutiveGuidanceCandidate(candidate)
        ? duplicateKeyFor(candidate)
        : null,
    };
  });

  // Rule 8 — Duplicate guidance (preserve earliest; suppress later)
  const seenKeys = new Map<string, number>();
  for (const entry of working) {
    if (entry.status === "rejected") continue;
    if (entry.duplicateKey === null) continue;
    const prior = seenKeys.get(entry.duplicateKey);
    if (prior === undefined) {
      seenKeys.set(entry.duplicateKey, entry.ordinal);
      continue;
    }
    if (entry.status === "selected" || entry.status === "deferred") {
      entry.status = "suppressed";
      entry.reasons = ["duplicate-guidance"];
    } else if (entry.status === "suppressed") {
      if (!entry.reasons.includes("duplicate-guidance")) {
        entry.reasons = [...entry.reasons, "duplicate-guidance"];
      }
    }
  }

  // Rule 9 — Conflict detection among selected candidates
  const selectedIndices = working
    .map((entry, index) => ({ entry, index }))
    .filter(({ entry }) => entry.status === "selected");

  for (let i = 0; i < selectedIndices.length; i += 1) {
    for (let j = i + 1; j < selectedIndices.length; j += 1) {
      const left = candidates[selectedIndices[i]!.entry.ordinal]!;
      const right = candidates[selectedIndices[j]!.entry.ordinal]!;
      if (!isDirectorRuntimeExecutiveGuidanceCandidate(left)) continue;
      if (!isDirectorRuntimeExecutiveGuidanceCandidate(right)) continue;
      const conflict = detectDirectorExecutiveGuidanceConflict(left, right);
      if (!conflict.conflicts) continue;

      const leftEntry = selectedIndices[i]!.entry;
      const rightEntry = selectedIndices[j]!.entry;

      if (!conflict.resolvable || conflict.winnerCandidateId === null) {
        if (leftEntry.status === "selected") {
          leftEntry.status = "unresolved";
          leftEntry.reasons = ["conflicting-guidance", "unresolved-conflict"];
        }
        if (rightEntry.status === "selected") {
          rightEntry.status = "unresolved";
          rightEntry.reasons = ["conflicting-guidance", "unresolved-conflict"];
        }
        continue;
      }

      const loser =
        conflict.winnerCandidateId === leftEntry.candidateId
          ? rightEntry
          : leftEntry;
      if (loser.status === "selected") {
        loser.status = "suppressed";
        loser.reasons = ["conflicting-guidance"];
      }
    }
  }

  // Rule 10 — Maximum guidance (preserve order; defer overflow)
  const constraints = mergeConstraints(
    envelope.request.constraints,
    {},
    context.deliveryPolicy,
  );
  const max = constraints.maximumGuidanceItems;
  if (typeof max === "number" && Number.isFinite(max) && max >= 0) {
    let selectedSoFar = 0;
    for (const entry of working) {
      if (entry.status !== "selected") continue;
      if (selectedSoFar < max) {
        selectedSoFar += 1;
        continue;
      }
      entry.status = "deferred";
      entry.reasons = ["maximum-guidance-reached"];
    }
  }

  const entries = Object.freeze(working.map((entry) => freezeEntry(entry)));
  const selectedCandidateIds = Object.freeze(
    entries
      .filter((entry) => entry.status === "selected")
      .map((entry) => entry.candidateId),
  );
  const primaryCandidateId = resolveDirectorExecutiveGuidancePrimaryCandidate(
    entries,
  );
  const summary = summarizeDirectorExecutiveGuidanceResolution(entries);

  // Guard: primary must be selected
  const primaryOk =
    primaryCandidateId === null ||
    selectedCandidateIds.includes(primaryCandidateId);

  return Object.freeze({
    resolutionId: input.resolutionId,
    requestId: envelope.request.requestId,
    entries,
    selectedCandidateIds,
    primaryCandidateId: primaryOk ? primaryCandidateId : null,
    summary,
  });
}

// ─── Invariants ─────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_INVARIANTS =
  Object.freeze([
    Object.freeze({
      id: "contracts-not-resolution",
      statement:
        "Contracts define transport; resolution decides candidate disposition",
    }),
    Object.freeze({
      id: "resolution-not-composition",
      statement: "resolution does not construct guidance packages or hierarchies",
    }),
    Object.freeze({
      id: "no-candidate-loss",
      statement: "every input candidate appears exactly once in resolution entries",
    }),
    Object.freeze({
      id: "preserve-ordinal-order",
      statement: "entry ordinals reflect original candidate order without reordering",
    }),
    Object.freeze({
      id: "no-numeric-scoring",
      statement: "resolution uses rule-based disposition without numeric scores",
    }),
    Object.freeze({
      id: "primary-from-selected-only",
      statement: "primaryCandidateId is null or references a selected candidate",
    }),
    Object.freeze({
      id: "summary-consistency",
      statement: "status counts always sum to totalCandidates",
    }),
    Object.freeze({
      id: "eligibility-terminal",
      statement: "non-eligible candidates cannot become selected in the same run",
    }),
    Object.freeze({
      id: "sole-upstream-dri-7-2",
      statement: "DRI-7:3 depends only on DRI-7:2 Contracts",
    }),
  ] as const);

export type DirectorRuntimeExecutiveGuidanceResolutionInvariant =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_INVARIANTS)[number];

// ─── Registry ───────────────────────────────────────────────────────────────

export const directorRuntimeExecutiveGuidanceResolutionApiNames = Object.freeze([
  "isDirectorRuntimeExecutiveGuidanceResolutionStatus",
  "isDirectorRuntimeExecutiveGuidanceResolutionReason",
  "createDirectorRuntimeExecutiveGuidanceResolutionContext",
  "createDirectorRuntimeExecutiveGuidanceResolutionInput",
  "createDirectorRuntimeExecutiveGuidanceResolutionEntry",
  "createDirectorRuntimeExecutiveGuidanceResolutionSummary",
  "createDirectorRuntimeExecutiveGuidanceResolution",
  "resolveDirectorExecutiveGuidanceEligibility",
  "detectDirectorExecutiveGuidanceDuplicate",
  "detectDirectorExecutiveGuidanceConflict",
  "resolveDirectorExecutiveGuidanceCandidate",
  "resolveDirectorExecutiveGuidancePrimaryCandidate",
  "summarizeDirectorExecutiveGuidanceResolution",
  "resolveDirectorExecutiveGuidance",
  "verifyDirectorRuntimeExecutiveGuidanceResolution",
] as const);

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "DirectorRuntimeExecutiveGuidanceResolutionStatus",
    "DirectorRuntimeExecutiveGuidanceResolutionReason",
    "DirectorRuntimeExecutiveGuidanceResolutionRuleName",
    "DirectorRuntimeExecutiveGuidanceResolutionRuleId",
    "DirectorRuntimeExecutiveGuidanceResolutionContext",
    "DirectorRuntimeExecutiveGuidanceResolutionInput",
    "DirectorRuntimeExecutiveGuidanceResolutionEntry",
    "DirectorRuntimeExecutiveGuidanceResolutionSummary",
    "DirectorRuntimeExecutiveGuidanceResolution",
    "DirectorRuntimeExecutiveGuidanceResolutionInvariant",
    "DirectorRuntimeExecutiveGuidanceResolutionVerification",
  ] as const);

export const directorRuntimeExecutiveGuidanceResolutionRegistry = Object.freeze({
  identity: directorRuntimeExecutiveGuidanceResolutionIdentity,
  version: directorRuntimeExecutiveGuidanceResolutionVersion,
  namespace: directorRuntimeExecutiveGuidanceResolutionNamespace,
  dependency: directorRuntimeExecutiveGuidanceResolutionUpstream,
  principle: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_PRINCIPLE,
  boundary: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_BOUNDARY,
  statuses: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_STATUSES,
  statusCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_STATUSES.length,
  reasons: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_REASONS,
  reasonCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_REASONS.length,
  ruleOrder: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_RULE_ORDER,
  ruleIds: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_RULE_IDS,
  ruleCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_RULE_ORDER.length,
  invariants: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_INVARIANTS,
  invariantCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_INVARIANTS.length,
  publicTypes: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_PUBLIC_TYPE_NAMES,
  publicTypeCount:
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_PUBLIC_TYPE_NAMES.length,
  publicApis: directorRuntimeExecutiveGuidanceResolutionApiNames,
  publicApiCount: directorRuntimeExecutiveGuidanceResolutionApiNames.length,
  registrySectionCount: 3 as const,
});

export const directorRuntimeExecutiveGuidanceResolution = Object.freeze({
  phase: "DRI-7:3" as const,
  name: "DirectorRuntimeExecutiveGuidanceResolution" as const,
  identity: directorRuntimeExecutiveGuidanceResolutionIdentity,
  namespace: directorRuntimeExecutiveGuidanceResolutionNamespace,
  version: directorRuntimeExecutiveGuidanceResolutionVersion,
  layer: "Director Runtime Integration" as const,
  domain: "ExecutiveGuidanceAttentionDelivery" as const,
  role: "Resolution" as const,
  stage: "Resolution" as const,
  status: "ResolutionReady" as const,
  upstreamDependency: directorRuntimeExecutiveGuidanceResolutionUpstream,
  deterministic: true as const,
  resolution: true as const,
  rendererIndependent: true as const,
  advisorIndependent: true as const,
  actionIndependent: true as const,
  philosophy: "resolution-not-composition" as const,
  principle: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_PRINCIPLE,
  boundary: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_BOUNDARY,
  statuses: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_STATUSES,
  reasons: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_REASONS,
  ruleOrder: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_RULE_ORDER,
  ruleIds: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_RULE_IDS,
  invariants: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_INVARIANTS,
  publicApiSurface: directorRuntimeExecutiveGuidanceResolutionApiNames,
  publicTypes: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_PUBLIC_TYPE_NAMES,
  registry: directorRuntimeExecutiveGuidanceResolutionRegistry,
  contractsBoundary: "DRI-7:2-contracts-only" as const,
  architecturalStatus:
    "Resolution Complete · Deterministic · Traceable · Constraint-Aware · Immutable · Renderer-Independent · ReadyForComposition" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface DirectorRuntimeExecutiveGuidanceResolutionVerification {
  readonly ok: boolean;
  readonly identity: typeof directorRuntimeExecutiveGuidanceResolutionIdentity;
  readonly version: typeof directorRuntimeExecutiveGuidanceResolutionVersion;
  readonly namespace: typeof directorRuntimeExecutiveGuidanceResolutionNamespace;
  readonly dependency: typeof directorRuntimeExecutiveGuidanceResolutionUpstream;
  readonly statusCount: number;
  readonly reasonCount: number;
  readonly ruleCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly invariantCount: number;
  readonly frozen: boolean;
  readonly preservesCandidateOrder: boolean;
  readonly noCandidateLoss: boolean;
  readonly noNumericScoring: boolean;
  readonly contractsCompatible: boolean;
  readonly rendererIndependent: boolean;
  readonly advisorIndependent: boolean;
  readonly actionIndependent: boolean;
  readonly resolverDeterministic: boolean;
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

function buildVerificationFixture(): DirectorRuntimeExecutiveGuidanceResolutionInput {
  const target = createDirectorRuntimeExecutiveGuidanceTarget({
    targetKind: "object",
    targetId: "production",
  });
  const guidance = createDirectorRuntimeExecutiveGuidanceItem({
    guidanceId: "guidance.production",
    guidanceKind: "direct-attention",
    target,
    importance: "critical",
    urgency: "immediate",
    intent: "warn",
    source: {
      sourceKind: "attention-output",
      sourceId: "attention.production-risk",
    },
  });
  const candidate: DirectorRuntimeExecutiveGuidanceCandidate = {
    candidateId: "candidate.production",
    guidance,
    eligibility: "eligible",
    provenance: {
      sourceReferences: [{
        sourceKind: "attention-output",
        sourceId: "attention.production-risk",
      }],
      derivedFromGuidanceIds: [],
    },
    constraints: {},
  };
  const envelope: DirectorRuntimeExecutiveGuidanceEnvelope = {
    envelopeId: "envelope.verify",
    request: {
      requestId: "request.verify",
      subjects: [target],
      attentionReferences: [{
        sourceKind: "attention-output",
        sourceId: "attention.production-risk",
      }],
      constraints: {
        preserveCurrentFocus: false,
        preserveExecutiveContext: false,
        allowInterruption: true,
        allowComparison: true,
        allowPathExplanation: true,
        maximumGuidanceItems: 5,
      },
    },
    candidates: [candidate],
    relationships: [],
    paths: [],
    deliveryPolicy: {
      interruption: "non-interruptive",
      persistence: "transient",
      preserveFocus: false,
      preserveContext: false,
    },
  };
  return {
    resolutionId: "resolution.verify",
    envelope,
    context: {
      activeContext: null,
      activeFocus: null,
      deliveryPolicy: envelope.deliveryPolicy,
    },
  };
}

export function verifyDirectorRuntimeExecutiveGuidanceResolution():
  DirectorRuntimeExecutiveGuidanceResolutionVerification {
  const resolution = directorRuntimeExecutiveGuidanceResolution;
  const registry = directorRuntimeExecutiveGuidanceResolutionRegistry;

  const identityOk =
    resolution.identity ===
      "DRI-7:3/DirectorRuntimeExecutiveGuidanceResolution" &&
    resolution.version === "7.3.0" &&
    resolution.namespace === "nexora.dri.executive-guidance.resolution" &&
    resolution.upstreamDependency ===
      "DRI-7:2/DirectorRuntimeExecutiveGuidanceContracts" &&
    resolution.upstreamDependency ===
      directorRuntimeExecutiveGuidanceContractsIdentity &&
    registry.dependency === resolution.upstreamDependency &&
    resolution.contractsBoundary === "DRI-7:2-contracts-only";

  const vocabularyOk =
    exactOrder(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_STATUSES, [
      "selected",
      "deferred",
      "suppressed",
      "rejected",
      "unresolved",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_REASONS, [
      "eligible",
      "candidate-ineligible",
      "candidate-suppressed",
      "candidate-deferred",
      "context-mismatch",
      "focus-preservation",
      "interruption-not-allowed",
      "comparison-not-allowed",
      "path-explanation-not-allowed",
      "duplicate-guidance",
      "conflicting-guidance",
      "maximum-guidance-reached",
      "insufficient-context",
      "invalid-provenance",
      "constraint-conflict",
      "unresolved-conflict",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_RULE_ORDER, [
      "contract-validity",
      "eligibility",
      "focus-preservation",
      "context-preservation",
      "interruption",
      "comparison",
      "path-explanation",
      "duplicate",
      "conflict",
      "maximum-guidance",
      "primary-candidate",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_RULE_IDS, [
      "dri7.resolution.contract-validity",
      "dri7.resolution.eligibility",
      "dri7.resolution.focus-preservation",
      "dri7.resolution.context-preservation",
      "dri7.resolution.interruption",
      "dri7.resolution.comparison",
      "dri7.resolution.path-explanation",
      "dri7.resolution.duplicate",
      "dri7.resolution.conflict",
      "dri7.resolution.maximum-guidance",
      "dri7.resolution.primary-candidate",
    ]) &&
    unique([...DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_STATUSES]) &&
    unique([...DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_REASONS]) &&
    unique([...DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_RULE_ORDER]) &&
    unique([...DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_RULE_IDS]);

  const fixture = buildVerificationFixture();
  const first = resolveDirectorExecutiveGuidance(fixture);
  const second = resolveDirectorExecutiveGuidance(fixture);
  const summaryOk =
    first.summary.totalCandidates === first.entries.length &&
    first.summary.selectedCount +
      first.summary.deferredCount +
      first.summary.suppressedCount +
      first.summary.rejectedCount +
      first.summary.unresolvedCount ===
      first.summary.totalCandidates;
  const noLoss = first.entries.length === fixture.envelope.candidates.length;
  const primaryOk =
    first.primaryCandidateId === null ||
    first.selectedCandidateIds.includes(first.primaryCandidateId);
  const resolverDeterministic =
    JSON.stringify(first) === JSON.stringify(second) &&
    first.entries[0]?.status === "selected";

  const immutabilityOk =
    Object.isFrozen(resolution) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(directorRuntimeExecutiveGuidanceResolutionCanonicalIdentity) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_STATUSES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_REASONS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_RULE_ORDER) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_RULE_IDS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_BOUNDARY) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_INVARIANTS) &&
    Object.isFrozen(first) &&
    Object.isFrozen(first.entries) &&
    Object.isFrozen(first.summary);

  const noNumericScoring =
    resolution.boundary.doesNotScoreGuidance === true &&
    resolution.boundary.doesNotRankByWeight === true;

  const ok =
    identityOk &&
    vocabularyOk &&
    summaryOk &&
    noLoss &&
    primaryOk &&
    resolverDeterministic &&
    immutabilityOk &&
    noNumericScoring &&
    isDirectorRuntimeExecutiveGuidanceEnvelope(fixture.envelope) &&
    resolution.rendererIndependent === true &&
    resolution.advisorIndependent === true &&
    resolution.actionIndependent === true &&
    resolution.boundary.consumesContractsOnly === true;

  return Object.freeze({
    ok,
    identity: directorRuntimeExecutiveGuidanceResolutionIdentity,
    version: directorRuntimeExecutiveGuidanceResolutionVersion,
    namespace: directorRuntimeExecutiveGuidanceResolutionNamespace,
    dependency: directorRuntimeExecutiveGuidanceResolutionUpstream,
    statusCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_STATUSES.length,
    reasonCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_REASONS.length,
    ruleCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_RULE_ORDER.length,
    publicTypeCount:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_PUBLIC_TYPE_NAMES.length,
    publicApiCount: directorRuntimeExecutiveGuidanceResolutionApiNames.length,
    invariantCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_RESOLUTION_INVARIANTS.length,
    frozen: immutabilityOk,
    preservesCandidateOrder: resolution.boundary.preservesCandidateOrder,
    noCandidateLoss: noLoss && resolution.boundary.preservesAllCandidates,
    noNumericScoring,
    contractsCompatible:
      resolution.upstreamDependency ===
      "DRI-7:2/DirectorRuntimeExecutiveGuidanceContracts",
    rendererIndependent: resolution.rendererIndependent,
    advisorIndependent: resolution.advisorIndependent,
    actionIndependent: resolution.actionIndependent,
    resolverDeterministic,
  });
}
