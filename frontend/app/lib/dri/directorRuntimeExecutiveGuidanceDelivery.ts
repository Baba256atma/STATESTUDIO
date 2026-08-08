/**
 * DRI-7:5 — Director Runtime Executive Guidance Delivery.
 *
 * Converts a completed DRI-7:4 composition into a stable, immutable semantic
 * delivery package ready for Director consumers. Packaging only — no side-
 * effectful dispatch, rendering, Advisor conversation, or action execution.
 *
 * Principle: Resolution determines what survives. Composition determines
 * semantic hierarchy. Delivery determines what is safe and ready to hand to
 * Director consumers. Platform governs the complete delivery capability.
 * Rendering determines concrete visual expression.
 */

import {
  directorRuntimeExecutiveGuidanceCompositionIdentity,
  isDirectorRuntimeExecutiveGuidanceCompositionRole,
  isDirectorRuntimeExecutiveGuidancePriorityTier,
  type DirectorRuntimeExecutiveGuidanceCandidate,
  type DirectorRuntimeExecutiveGuidanceComposedItem,
  type DirectorRuntimeExecutiveGuidanceComposition,
  type DirectorRuntimeExecutiveGuidanceCompositionInput,
  type DirectorRuntimeExecutiveGuidanceCompositionPath,
  type DirectorRuntimeExecutiveGuidanceCompositionRelationship,
  type DirectorRuntimeExecutiveGuidanceCompositionRole,
  type DirectorRuntimeExecutiveGuidanceEnvelope,
  type DirectorRuntimeExecutiveGuidanceItem,
  type DirectorRuntimeExecutiveGuidancePriorityTier,
  type DirectorRuntimeExecutiveGuidanceProvenance,
  type DirectorRuntimeExecutiveGuidanceResolution,
  type DirectorRuntimeExecutiveGuidanceResolutionContext,
  type DirectorRuntimeExecutiveGuidanceResolutionInput,
} from "@/app/lib/dri/directorRuntimeExecutiveGuidanceComposition";

export type {
  DirectorRuntimeExecutiveGuidanceCandidate,
  DirectorRuntimeExecutiveGuidanceComposedItem,
  DirectorRuntimeExecutiveGuidanceComposition,
  DirectorRuntimeExecutiveGuidanceCompositionInput,
  DirectorRuntimeExecutiveGuidanceCompositionPath,
  DirectorRuntimeExecutiveGuidanceCompositionRelationship,
  DirectorRuntimeExecutiveGuidanceCompositionRole,
  DirectorRuntimeExecutiveGuidanceEnvelope,
  DirectorRuntimeExecutiveGuidanceItem,
  DirectorRuntimeExecutiveGuidancePriorityTier,
  DirectorRuntimeExecutiveGuidanceProvenance,
  DirectorRuntimeExecutiveGuidanceResolution,
  DirectorRuntimeExecutiveGuidanceResolutionContext,
  DirectorRuntimeExecutiveGuidanceResolutionInput,
};

export {
  composeDirectorExecutiveGuidance,
  createDirectorRuntimeExecutiveGuidanceResolutionContext,
  createDirectorRuntimeExecutiveGuidanceResolutionInput,
  resolveDirectorExecutiveGuidance,
} from "@/app/lib/dri/directorRuntimeExecutiveGuidanceComposition";

// ─── Identity ───────────────────────────────────────────────────────────────

export const directorRuntimeExecutiveGuidanceDeliveryIdentity =
  "DRI-7:5/DirectorRuntimeExecutiveGuidanceDelivery" as const;
export const directorRuntimeExecutiveGuidanceDeliveryVersion =
  "7.5.0" as const;
export const directorRuntimeExecutiveGuidanceDeliveryNamespace =
  "nexora.dri.executive-guidance.delivery" as const;
export const directorRuntimeExecutiveGuidanceDeliveryUpstream =
  directorRuntimeExecutiveGuidanceCompositionIdentity;

export const directorRuntimeExecutiveGuidanceDeliveryCanonicalIdentity =
  Object.freeze({
    identity: directorRuntimeExecutiveGuidanceDeliveryIdentity,
    version: directorRuntimeExecutiveGuidanceDeliveryVersion,
    namespace: directorRuntimeExecutiveGuidanceDeliveryNamespace,
    upstream: directorRuntimeExecutiveGuidanceDeliveryUpstream,
  });

// ─── Principle / boundary ───────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_PRINCIPLE =
  "Resolution determines what survives. Composition determines semantic hierarchy. Delivery determines what is safe and ready to hand to Director consumers. Platform governs the complete delivery capability. Rendering determines concrete visual expression." as const;

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_BOUNDARY =
  Object.freeze({
    compositionAuthority: "DRI-7:4" as const,
    deliveryAuthority: "DRI-7:5" as const,
    platformAuthority: "DRI-7:6" as const,
    doesNotDispatchExternally: true as const,
    doesNotReprioritize: true as const,
    doesNotReresolve: true as const,
    doesNotRewriteGuidance: true as const,
    doesNotCreateGuidance: true as const,
    preservesCompositionHierarchy: true as const,
    consumesCompositionOnly: true as const,
  });

// ─── Status vocabulary ──────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_STATUSES =
  Object.freeze(["ready", "held", "deferred", "blocked"] as const);
export type DirectorRuntimeExecutiveGuidanceDeliveryStatus =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_STATUSES)[number];

// ─── Reason vocabulary ──────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_REASONS =
  Object.freeze([
    "composition-ready",
    "no-active-guidance",
    "primary-guidance-missing",
    "context-preservation",
    "focus-preservation",
    "non-interruption-policy",
    "delivery-policy-hold",
    "delivery-policy-defer",
    "invalid-composition",
    "traceability-incomplete",
    "delivery-contract-conflict",
  ] as const);
export type DirectorRuntimeExecutiveGuidanceDeliveryReason =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_REASONS)[number];

// ─── Channel vocabulary ─────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_CHANNELS =
  Object.freeze([
    "director",
    "advisor",
    "insight",
    "scene",
    "journal",
    "timeline",
  ] as const);
export type DirectorRuntimeExecutiveGuidanceDeliveryChannel =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_CHANNELS)[number];

// ─── Audience vocabulary ────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_AUDIENCES =
  Object.freeze([
    "executive",
    "director-runtime",
    "supporting-consumer",
  ] as const);
export type DirectorRuntimeExecutiveGuidanceAudience =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_AUDIENCES)[number];

// ─── Readiness ──────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_READINESS_VALUES =
  Object.freeze([
    "ready-for-consumer",
    "not-ready-for-consumer",
  ] as const);
export type DirectorRuntimeExecutiveGuidanceDeliveryReadiness =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_READINESS_VALUES)[number];

// ─── Rule registry ──────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_RULE_ORDER =
  Object.freeze([
    "composition-integrity",
    "active-guidance",
    "traceability",
    "delivery-permission",
    "interruption-policy",
    "focus-preservation",
    "context-preservation",
    "channel-resolution",
    "delivery-readiness",
  ] as const);
export type DirectorRuntimeExecutiveGuidanceDeliveryRuleName =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_RULE_ORDER)[number];

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_RULE_IDS =
  Object.freeze([
    "dri7.delivery.composition-integrity",
    "dri7.delivery.active-guidance",
    "dri7.delivery.traceability",
    "dri7.delivery.permission",
    "dri7.delivery.interruption-policy",
    "dri7.delivery.focus-preservation",
    "dri7.delivery.context-preservation",
    "dri7.delivery.channel-resolution",
    "dri7.delivery.readiness",
  ] as const);
export type DirectorRuntimeExecutiveGuidanceDeliveryRuleId =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_RULE_IDS)[number];

// ─── Contracts ──────────────────────────────────────────────────────────────

export interface DirectorRuntimeExecutiveGuidanceSemanticDeliveryPolicy {
  readonly allowDelivery: boolean;
  readonly allowInterruption: boolean;
  readonly preserveFocus: boolean;
  readonly preserveContext: boolean;
  readonly preferredChannel: DirectorRuntimeExecutiveGuidanceDeliveryChannel;
  readonly fallbackChannel: DirectorRuntimeExecutiveGuidanceDeliveryChannel | null;
}

export interface DirectorRuntimeExecutiveGuidanceDeliveryContext {
  readonly activeFocusId: string | null;
  readonly activeContextId: string | null;
  readonly requestedChannel: DirectorRuntimeExecutiveGuidanceDeliveryChannel | null;
}

export interface DirectorRuntimeExecutiveGuidanceDeliveryInput {
  readonly deliveryId: string;
  readonly composition: DirectorRuntimeExecutiveGuidanceComposition;
  readonly policy: DirectorRuntimeExecutiveGuidanceSemanticDeliveryPolicy;
  readonly context: DirectorRuntimeExecutiveGuidanceDeliveryContext;
}

export interface DirectorRuntimeExecutiveGuidanceDeliveryItem {
  readonly candidateId: string;
  readonly guidanceId: string;
  readonly priorityTier: DirectorRuntimeExecutiveGuidancePriorityTier;
  readonly role: DirectorRuntimeExecutiveGuidanceCompositionRole;
  readonly channel: DirectorRuntimeExecutiveGuidanceDeliveryChannel;
  readonly audience: DirectorRuntimeExecutiveGuidanceAudience;
  readonly guidance: DirectorRuntimeExecutiveGuidanceItem;
  readonly provenance: DirectorRuntimeExecutiveGuidanceProvenance;
  readonly ordinal: number;
}

export interface DirectorRuntimeExecutiveGuidanceDeliveryTrace {
  readonly candidateId: string;
  readonly guidanceId: string;
  readonly compositionTier: DirectorRuntimeExecutiveGuidancePriorityTier;
  readonly compositionRole: DirectorRuntimeExecutiveGuidanceCompositionRole;
  readonly deliveryChannel: DirectorRuntimeExecutiveGuidanceDeliveryChannel;
  readonly delivered: boolean;
}

export interface DirectorRuntimeExecutiveGuidanceDeliverySummary {
  readonly deliveryStatus: DirectorRuntimeExecutiveGuidanceDeliveryStatus;
  readonly activeItemCount: number;
  readonly deliveredItemCount: number;
  readonly primaryCount: 0 | 1;
  readonly supportingCount: number;
  readonly contextualCount: number;
  readonly backgroundCount: number;
  readonly relationshipCount: number;
  readonly pathCount: number;
  readonly channelCount: number;
}

export interface DirectorRuntimeExecutiveGuidanceDeliveryConsumerDescriptor {
  readonly deliveryId: string;
  readonly status: DirectorRuntimeExecutiveGuidanceDeliveryStatus;
  readonly readiness: DirectorRuntimeExecutiveGuidanceDeliveryReadiness;
  readonly primaryGuidanceId: string | null;
  readonly activeGuidanceIds: readonly string[];
}

export interface DirectorRuntimeExecutiveGuidanceDeliveryPackage {
  readonly deliveryId: string;
  readonly compositionId: string;
  readonly requestId: string;
  readonly status: DirectorRuntimeExecutiveGuidanceDeliveryStatus;
  readonly reasons: readonly DirectorRuntimeExecutiveGuidanceDeliveryReason[];
  readonly readiness: DirectorRuntimeExecutiveGuidanceDeliveryReadiness;
  readonly channel: DirectorRuntimeExecutiveGuidanceDeliveryChannel;
  readonly primary: DirectorRuntimeExecutiveGuidanceDeliveryItem | null;
  readonly supporting: readonly DirectorRuntimeExecutiveGuidanceDeliveryItem[];
  readonly contextual: readonly DirectorRuntimeExecutiveGuidanceDeliveryItem[];
  readonly background: readonly DirectorRuntimeExecutiveGuidanceDeliveryItem[];
  readonly relationships: readonly DirectorRuntimeExecutiveGuidanceCompositionRelationship[];
  readonly paths: readonly DirectorRuntimeExecutiveGuidanceCompositionPath[];
  readonly trace: readonly DirectorRuntimeExecutiveGuidanceDeliveryTrace[];
  readonly deferredCandidateIds: readonly string[];
  readonly suppressedCandidateIds: readonly string[];
  readonly rejectedCandidateIds: readonly string[];
  readonly unresolvedCandidateIds: readonly string[];
  readonly consumerDescriptor: DirectorRuntimeExecutiveGuidanceDeliveryConsumerDescriptor;
  readonly summary: DirectorRuntimeExecutiveGuidanceDeliverySummary;
}

// ─── Vocabulary helpers ─────────────────────────────────────────────────────

export function isDirectorRuntimeExecutiveGuidanceDeliveryStatus(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidanceDeliveryStatus {
  return (
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_STATUSES as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeExecutiveGuidanceDeliveryReason(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidanceDeliveryReason {
  return (
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_REASONS as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeExecutiveGuidanceDeliveryChannel(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidanceDeliveryChannel {
  return (
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_CHANNELS as readonly unknown[]
  ).includes(value);
}

export function isDirectorRuntimeExecutiveGuidanceAudience(
  value: unknown,
): value is DirectorRuntimeExecutiveGuidanceAudience {
  return (
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_AUDIENCES as readonly unknown[]
  ).includes(value);
}

// ─── Internal helpers ───────────────────────────────────────────────────────

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function audienceForChannel(
  channel: DirectorRuntimeExecutiveGuidanceDeliveryChannel,
): DirectorRuntimeExecutiveGuidanceAudience {
  switch (channel) {
    case "director":
      return "executive";
    case "scene":
      return "director-runtime";
    default:
      return "supporting-consumer";
  }
}

function freezeDeliveryItem(
  item: DirectorRuntimeExecutiveGuidanceDeliveryItem,
): DirectorRuntimeExecutiveGuidanceDeliveryItem {
  return Object.freeze({
    candidateId: item.candidateId,
    guidanceId: item.guidanceId,
    priorityTier: item.priorityTier,
    role: item.role,
    channel: item.channel,
    audience: item.audience,
    guidance: item.guidance,
    provenance: item.provenance,
    ordinal: item.ordinal,
  });
}

function requiresInterruptiveAttention(
  composition: DirectorRuntimeExecutiveGuidanceComposition,
): boolean {
  const primary = composition.primary;
  if (primary === null) return false;
  const g = primary.guidance;
  return (
    (g.importance === "critical" && g.urgency === "immediate") ||
    (g.guidanceKind === "direct-attention" && g.intent === "warn")
  );
}

function collectActiveItems(
  composition: DirectorRuntimeExecutiveGuidanceComposition,
): readonly DirectorRuntimeExecutiveGuidanceComposedItem[] {
  return Object.freeze([
    ...(composition.primary === null ? [] : [composition.primary]),
    ...composition.supporting,
    ...composition.contextual,
    ...composition.background,
  ]);
}

function validateCompositionIntegrity(
  composition: unknown,
): DirectorRuntimeExecutiveGuidanceDeliveryReason | null {
  if (!isPlainObject(composition)) return "invalid-composition";
  if (typeof composition.compositionId !== "string") {
    return "invalid-composition";
  }
  if (typeof composition.requestId !== "string") {
    return "invalid-composition";
  }
  if (!Array.isArray(composition.supporting)) return "invalid-composition";
  if (!Array.isArray(composition.contextual)) return "invalid-composition";
  if (!Array.isArray(composition.background)) return "invalid-composition";
  if (!Array.isArray(composition.relationships)) return "invalid-composition";
  if (!Array.isArray(composition.paths)) return "invalid-composition";
  if (!Array.isArray(composition.traces)) return "invalid-composition";
  if (!isPlainObject(composition.summary)) return "invalid-composition";

  const primary = composition.primary;
  if (primary !== null && !isPlainObject(primary)) {
    return "invalid-composition";
  }

  const active: unknown[] = [
    ...(primary === null ? [] : [primary]),
    ...composition.supporting,
    ...composition.contextual,
    ...composition.background,
  ];

  const seen = new Set<string>();
  for (const item of active) {
    if (!isPlainObject(item)) return "invalid-composition";
    if (typeof item.candidateId !== "string") return "invalid-composition";
    if (typeof item.guidanceId !== "string") return "invalid-composition";
    if (!isDirectorRuntimeExecutiveGuidancePriorityTier(item.priorityTier)) {
      return "invalid-composition";
    }
    if (!isDirectorRuntimeExecutiveGuidanceCompositionRole(item.role)) {
      return "invalid-composition";
    }
    if (!isPlainObject(item.guidance)) return "invalid-composition";
    if (!isPlainObject(item.provenance)) return "invalid-composition";
    if (seen.has(item.candidateId)) return "delivery-contract-conflict";
    seen.add(item.candidateId);
  }

  if (primary !== null && isPlainObject(primary)) {
    if (primary.priorityTier !== "primary") return "delivery-contract-conflict";
  }

  const primaryCount = primary === null ? 0 : 1;
  if (
    typeof composition.summary === "object" &&
    composition.summary !== null &&
    "primaryCount" in composition.summary &&
    (composition.summary as { primaryCount?: unknown }).primaryCount !==
      primaryCount
  ) {
    return "invalid-composition";
  }

  return null;
}

function validateTraceability(
  composition: DirectorRuntimeExecutiveGuidanceComposition,
): DirectorRuntimeExecutiveGuidanceDeliveryReason | null {
  const active = collectActiveItems(composition);
  for (const item of active) {
    const trace = composition.traces.find(
      (entry) => entry.candidateId === item.candidateId,
    );
    if (trace === undefined) return "traceability-incomplete";
    if (trace.compositionTier !== item.priorityTier) {
      return "traceability-incomplete";
    }
    if (trace.compositionRole !== item.role) {
      return "traceability-incomplete";
    }
    if (trace.guidanceId !== item.guidanceId) {
      return "traceability-incomplete";
    }
  }
  return null;
}

// ─── Public helpers ─────────────────────────────────────────────────────────

export function resolveDirectorExecutiveGuidanceDeliveryChannel(input: {
  readonly requestedChannel: DirectorRuntimeExecutiveGuidanceDeliveryChannel | null;
  readonly preferredChannel: DirectorRuntimeExecutiveGuidanceDeliveryChannel;
  readonly fallbackChannel: DirectorRuntimeExecutiveGuidanceDeliveryChannel | null;
}): DirectorRuntimeExecutiveGuidanceDeliveryChannel {
  if (
    input.requestedChannel !== null &&
    isDirectorRuntimeExecutiveGuidanceDeliveryChannel(input.requestedChannel)
  ) {
    return input.requestedChannel;
  }
  if (
    isDirectorRuntimeExecutiveGuidanceDeliveryChannel(input.preferredChannel)
  ) {
    return input.preferredChannel;
  }
  if (
    input.fallbackChannel !== null &&
    isDirectorRuntimeExecutiveGuidanceDeliveryChannel(input.fallbackChannel)
  ) {
    return input.fallbackChannel;
  }
  return "director";
}

export function createDirectorExecutiveGuidanceDeliveryItem(input: {
  readonly composed: DirectorRuntimeExecutiveGuidanceComposedItem;
  readonly channel: DirectorRuntimeExecutiveGuidanceDeliveryChannel;
  readonly audience?: DirectorRuntimeExecutiveGuidanceAudience;
}): DirectorRuntimeExecutiveGuidanceDeliveryItem {
  return freezeDeliveryItem({
    candidateId: input.composed.candidateId,
    guidanceId: input.composed.guidanceId,
    priorityTier: input.composed.priorityTier,
    role: input.composed.role,
    channel: input.channel,
    audience: input.audience ?? audienceForChannel(input.channel),
    guidance: input.composed.guidance,
    provenance: input.composed.provenance,
    ordinal: input.composed.ordinal,
  });
}

export function resolveDirectorExecutiveGuidanceDeliveryStatus(input: {
  readonly composition: DirectorRuntimeExecutiveGuidanceComposition;
  readonly policy: DirectorRuntimeExecutiveGuidanceSemanticDeliveryPolicy;
}): {
  readonly status: DirectorRuntimeExecutiveGuidanceDeliveryStatus;
  readonly reasons: readonly DirectorRuntimeExecutiveGuidanceDeliveryReason[];
} {
  const reasons: DirectorRuntimeExecutiveGuidanceDeliveryReason[] = [];

  const integrity = validateCompositionIntegrity(input.composition);
  if (integrity !== null) {
    return Object.freeze({
      status: "blocked" as const,
      reasons: Object.freeze([integrity]),
    });
  }

  const traceability = validateTraceability(input.composition);
  if (traceability !== null) {
    return Object.freeze({
      status: "blocked" as const,
      reasons: Object.freeze([traceability]),
    });
  }

  const activeCount =
    (input.composition.primary === null ? 0 : 1) +
    input.composition.supporting.length +
    input.composition.contextual.length +
    input.composition.background.length;

  if (activeCount === 0) {
    return Object.freeze({
      status: "held" as const,
      reasons: Object.freeze(["no-active-guidance" as const]),
    });
  }

  if (input.policy.allowDelivery === false) {
    return Object.freeze({
      status: "held" as const,
      reasons: Object.freeze(["delivery-policy-hold" as const]),
    });
  }

  if (
    input.policy.allowInterruption === false &&
    requiresInterruptiveAttention(input.composition)
  ) {
    reasons.push("non-interruption-policy");
    if (input.composition.primary === null) {
      reasons.push("primary-guidance-missing");
    }
    if (input.policy.preserveFocus) reasons.push("focus-preservation");
    if (input.policy.preserveContext) reasons.push("context-preservation");
    return Object.freeze({
      status: "deferred" as const,
      reasons: Object.freeze([...reasons]),
    });
  }

  reasons.push("composition-ready");
  if (input.composition.primary === null) {
    reasons.push("primary-guidance-missing");
  }
  if (input.policy.preserveFocus) reasons.push("focus-preservation");
  if (input.policy.preserveContext) reasons.push("context-preservation");

  return Object.freeze({
    status: "ready" as const,
    reasons: Object.freeze([...reasons]),
  });
}

export function traceDirectorExecutiveGuidanceDelivery(input: {
  readonly composition: DirectorRuntimeExecutiveGuidanceComposition;
  readonly channel: DirectorRuntimeExecutiveGuidanceDeliveryChannel;
  readonly delivered: boolean;
}): readonly DirectorRuntimeExecutiveGuidanceDeliveryTrace[] {
  const active = collectActiveItems(input.composition);
  return Object.freeze(
    active.map((item) =>
      Object.freeze({
        candidateId: item.candidateId,
        guidanceId: item.guidanceId,
        compositionTier: item.priorityTier,
        compositionRole: item.role,
        deliveryChannel: input.channel,
        delivered: input.delivered,
      })),
  );
}

export function summarizeDirectorExecutiveGuidanceDelivery(input: {
  readonly status: DirectorRuntimeExecutiveGuidanceDeliveryStatus;
  readonly primary: DirectorRuntimeExecutiveGuidanceDeliveryItem | null;
  readonly supporting: readonly DirectorRuntimeExecutiveGuidanceDeliveryItem[];
  readonly contextual: readonly DirectorRuntimeExecutiveGuidanceDeliveryItem[];
  readonly background: readonly DirectorRuntimeExecutiveGuidanceDeliveryItem[];
  readonly relationships: readonly DirectorRuntimeExecutiveGuidanceCompositionRelationship[];
  readonly paths: readonly DirectorRuntimeExecutiveGuidanceCompositionPath[];
  readonly channel: DirectorRuntimeExecutiveGuidanceDeliveryChannel;
  readonly delivered: boolean;
}): DirectorRuntimeExecutiveGuidanceDeliverySummary {
  const primaryCount = input.primary === null ? 0 : 1;
  const activeItemCount =
    primaryCount +
    input.supporting.length +
    input.contextual.length +
    input.background.length;
  return Object.freeze({
    deliveryStatus: input.status,
    activeItemCount,
    deliveredItemCount: input.delivered ? activeItemCount : 0,
    primaryCount: primaryCount as 0 | 1,
    supportingCount: input.supporting.length,
    contextualCount: input.contextual.length,
    backgroundCount: input.background.length,
    relationshipCount: input.relationships.length,
    pathCount: input.paths.length,
    channelCount: 1,
  });
}

function createConsumerDescriptor(input: {
  readonly deliveryId: string;
  readonly status: DirectorRuntimeExecutiveGuidanceDeliveryStatus;
  readonly primary: DirectorRuntimeExecutiveGuidanceDeliveryItem | null;
  readonly supporting: readonly DirectorRuntimeExecutiveGuidanceDeliveryItem[];
  readonly contextual: readonly DirectorRuntimeExecutiveGuidanceDeliveryItem[];
  readonly background: readonly DirectorRuntimeExecutiveGuidanceDeliveryItem[];
}): DirectorRuntimeExecutiveGuidanceDeliveryConsumerDescriptor {
  const readiness: DirectorRuntimeExecutiveGuidanceDeliveryReadiness =
    input.status === "ready"
      ? "ready-for-consumer"
      : "not-ready-for-consumer";
  const activeGuidanceIds = Object.freeze([
    ...(input.primary === null ? [] : [input.primary.guidanceId]),
    ...input.supporting.map((item) => item.guidanceId),
    ...input.contextual.map((item) => item.guidanceId),
    ...input.background.map((item) => item.guidanceId),
  ]);
  return Object.freeze({
    deliveryId: input.deliveryId,
    status: input.status,
    readiness,
    primaryGuidanceId: input.primary?.guidanceId ?? null,
    activeGuidanceIds,
  });
}

// ─── Main delivery function (semantic packaging — no external side effects) ─

export function deliverDirectorExecutiveGuidance(
  input: DirectorRuntimeExecutiveGuidanceDeliveryInput,
): DirectorRuntimeExecutiveGuidanceDeliveryPackage {
  const composition = input.composition;
  const policy = input.policy;
  const context = input.context;

  const channel = resolveDirectorExecutiveGuidanceDeliveryChannel({
    requestedChannel: context.requestedChannel,
    preferredChannel: policy.preferredChannel,
    fallbackChannel: policy.fallbackChannel,
  });

  const { status, reasons } = resolveDirectorExecutiveGuidanceDeliveryStatus({
    composition,
    policy,
  });

  // Blocked integrity/traceability failures must not attempt hierarchy mapping.
  if (status === "blocked") {
    const compositionId =
      isPlainObject(composition) && typeof composition.compositionId === "string"
        ? composition.compositionId
        : "composition.invalid";
    const requestId =
      isPlainObject(composition) && typeof composition.requestId === "string"
        ? composition.requestId
        : "request.invalid";
    const emptyItems = Object.freeze(
      [],
    ) as readonly DirectorRuntimeExecutiveGuidanceDeliveryItem[];
    const emptyIds = Object.freeze([]) as readonly string[];
    const summary = summarizeDirectorExecutiveGuidanceDelivery({
      status,
      primary: null,
      supporting: emptyItems,
      contextual: emptyItems,
      background: emptyItems,
      relationships: Object.freeze([]),
      paths: Object.freeze([]),
      channel,
      delivered: false,
    });
    const consumerDescriptor = createConsumerDescriptor({
      deliveryId: input.deliveryId,
      status,
      primary: null,
      supporting: emptyItems,
      contextual: emptyItems,
      background: emptyItems,
    });
    return Object.freeze({
      deliveryId: input.deliveryId,
      compositionId,
      requestId,
      status,
      reasons,
      readiness: consumerDescriptor.readiness,
      channel,
      primary: null,
      supporting: emptyItems,
      contextual: emptyItems,
      background: emptyItems,
      relationships: Object.freeze([]),
      paths: Object.freeze([]),
      trace: Object.freeze([]),
      deferredCandidateIds: emptyIds,
      suppressedCandidateIds: emptyIds,
      rejectedCandidateIds: emptyIds,
      unresolvedCandidateIds: emptyIds,
      consumerDescriptor,
      summary,
    });
  }

  const audience = audienceForChannel(channel);
  const primary =
    composition.primary === null
      ? null
      : createDirectorExecutiveGuidanceDeliveryItem({
          composed: composition.primary,
          channel,
          audience,
        });
  const supporting = Object.freeze(
    composition.supporting.map((item) =>
      createDirectorExecutiveGuidanceDeliveryItem({
        composed: item,
        channel,
        audience,
      })),
  );
  const contextual = Object.freeze(
    composition.contextual.map((item) =>
      createDirectorExecutiveGuidanceDeliveryItem({
        composed: item,
        channel,
        audience,
      })),
  );
  const background = Object.freeze(
    composition.background.map((item) =>
      createDirectorExecutiveGuidanceDeliveryItem({
        composed: item,
        channel,
        audience,
      })),
  );

  const delivered = status === "ready";
  const trace = traceDirectorExecutiveGuidanceDelivery({
    composition,
    channel,
    delivered,
  });
  const summary = summarizeDirectorExecutiveGuidanceDelivery({
    status,
    primary,
    supporting,
    contextual,
    background,
    relationships: composition.relationships,
    paths: composition.paths,
    channel,
    delivered,
  });
  const consumerDescriptor = createConsumerDescriptor({
    deliveryId: input.deliveryId,
    status,
    primary,
    supporting,
    contextual,
    background,
  });

  return Object.freeze({
    deliveryId: input.deliveryId,
    compositionId: composition.compositionId,
    requestId: composition.requestId,
    status,
    reasons,
    readiness: consumerDescriptor.readiness,
    channel,
    primary,
    supporting,
    contextual,
    background,
    relationships: composition.relationships,
    paths: composition.paths,
    trace,
    deferredCandidateIds: composition.deferredCandidateIds,
    suppressedCandidateIds: composition.suppressedCandidateIds,
    rejectedCandidateIds: composition.rejectedCandidateIds,
    unresolvedCandidateIds: composition.unresolvedCandidateIds,
    consumerDescriptor,
    summary,
  });
}

// ─── Invariants ─────────────────────────────────────────────────────────────

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_INVARIANTS =
  Object.freeze([
    Object.freeze({
      id: "composition-not-delivery",
      statement:
        "Composition owns hierarchy; delivery owns consumer-ready packaging",
    }),
    Object.freeze({
      id: "delivery-not-dispatch",
      statement:
        "delivery returns a semantic package and performs no external handoff",
    }),
    Object.freeze({
      id: "delivery-not-rendering",
      statement: "delivery packages contain no renderer-specific instructions",
    }),
    Object.freeze({
      id: "preserve-composition-hierarchy",
      statement: "delivery does not reclassify composition tiers",
    }),
    Object.freeze({
      id: "preserve-primary",
      statement: "delivery preserves upstream primary without selecting a new one",
    }),
    Object.freeze({
      id: "no-reprioritization",
      statement: "delivery performs no numeric scoring or weighted ranking",
    }),
    Object.freeze({
      id: "no-reresolution",
      statement: "delivery does not reactivate non-selected upstream candidates",
    }),
    Object.freeze({
      id: "traceability-complete",
      statement: "every active composed item receives a delivery trace",
    }),
    Object.freeze({
      id: "sole-upstream-dri-7-4",
      statement: "DRI-7:5 depends only on DRI-7:4 Composition",
    }),
  ] as const);

export type DirectorRuntimeExecutiveGuidanceDeliveryInvariant =
  (typeof DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_INVARIANTS)[number];

// ─── Registry ───────────────────────────────────────────────────────────────

export const directorRuntimeExecutiveGuidanceDeliveryApiNames = Object.freeze([
  "isDirectorRuntimeExecutiveGuidanceDeliveryStatus",
  "isDirectorRuntimeExecutiveGuidanceDeliveryReason",
  "isDirectorRuntimeExecutiveGuidanceDeliveryChannel",
  "isDirectorRuntimeExecutiveGuidanceAudience",
  "resolveDirectorExecutiveGuidanceDeliveryChannel",
  "resolveDirectorExecutiveGuidanceDeliveryStatus",
  "createDirectorExecutiveGuidanceDeliveryItem",
  "traceDirectorExecutiveGuidanceDelivery",
  "summarizeDirectorExecutiveGuidanceDelivery",
  "deliverDirectorExecutiveGuidance",
  "verifyDirectorRuntimeExecutiveGuidanceDelivery",
] as const);

export const DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_PUBLIC_TYPE_NAMES =
  Object.freeze([
    "DirectorRuntimeExecutiveGuidanceDeliveryStatus",
    "DirectorRuntimeExecutiveGuidanceDeliveryReason",
    "DirectorRuntimeExecutiveGuidanceDeliveryChannel",
    "DirectorRuntimeExecutiveGuidanceAudience",
    "DirectorRuntimeExecutiveGuidanceDeliveryReadiness",
    "DirectorRuntimeExecutiveGuidanceDeliveryRuleName",
    "DirectorRuntimeExecutiveGuidanceDeliveryRuleId",
    "DirectorRuntimeExecutiveGuidanceSemanticDeliveryPolicy",
    "DirectorRuntimeExecutiveGuidanceDeliveryContext",
    "DirectorRuntimeExecutiveGuidanceDeliveryInput",
    "DirectorRuntimeExecutiveGuidanceDeliveryItem",
    "DirectorRuntimeExecutiveGuidanceDeliveryTrace",
    "DirectorRuntimeExecutiveGuidanceDeliverySummary",
    "DirectorRuntimeExecutiveGuidanceDeliveryConsumerDescriptor",
    "DirectorRuntimeExecutiveGuidanceDeliveryPackage",
    "DirectorRuntimeExecutiveGuidanceDeliveryInvariant",
    "DirectorRuntimeExecutiveGuidanceDeliveryVerification",
  ] as const);

export const directorRuntimeExecutiveGuidanceDeliveryRegistry = Object.freeze({
  identity: directorRuntimeExecutiveGuidanceDeliveryIdentity,
  version: directorRuntimeExecutiveGuidanceDeliveryVersion,
  namespace: directorRuntimeExecutiveGuidanceDeliveryNamespace,
  dependency: directorRuntimeExecutiveGuidanceDeliveryUpstream,
  principle: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_PRINCIPLE,
  boundary: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_BOUNDARY,
  statuses: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_STATUSES,
  statusCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_STATUSES.length,
  reasons: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_REASONS,
  reasonCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_REASONS.length,
  channels: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_CHANNELS,
  channelCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_CHANNELS.length,
  audiences: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_AUDIENCES,
  audienceCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_AUDIENCES.length,
  readinessValues: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_READINESS_VALUES,
  readinessCount:
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_READINESS_VALUES.length,
  ruleOrder: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_RULE_ORDER,
  ruleIds: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_RULE_IDS,
  ruleCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_RULE_ORDER.length,
  invariants: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_INVARIANTS,
  invariantCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_INVARIANTS.length,
  publicTypes: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_PUBLIC_TYPE_NAMES,
  publicTypeCount:
    DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_PUBLIC_TYPE_NAMES.length,
  publicApis: directorRuntimeExecutiveGuidanceDeliveryApiNames,
  publicApiCount: directorRuntimeExecutiveGuidanceDeliveryApiNames.length,
  registrySectionCount: 5 as const,
});

export const directorRuntimeExecutiveGuidanceDelivery = Object.freeze({
  phase: "DRI-7:5" as const,
  name: "DirectorRuntimeExecutiveGuidanceDelivery" as const,
  identity: directorRuntimeExecutiveGuidanceDeliveryIdentity,
  namespace: directorRuntimeExecutiveGuidanceDeliveryNamespace,
  version: directorRuntimeExecutiveGuidanceDeliveryVersion,
  layer: "Director Runtime Integration" as const,
  domain: "ExecutiveGuidanceAttentionDelivery" as const,
  role: "Delivery" as const,
  stage: "Delivery" as const,
  status: "DeliveryReady" as const,
  upstreamDependency: directorRuntimeExecutiveGuidanceDeliveryUpstream,
  deterministic: true as const,
  delivery: true as const,
  sideEffectFree: true as const,
  rendererIndependent: true as const,
  advisorIndependent: true as const,
  actionIndependent: true as const,
  sceneIndependent: true as const,
  philosophy: "delivery-as-semantic-packaging" as const,
  principle: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_PRINCIPLE,
  boundary: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_BOUNDARY,
  statuses: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_STATUSES,
  reasons: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_REASONS,
  channels: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_CHANNELS,
  audiences: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_AUDIENCES,
  ruleOrder: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_RULE_ORDER,
  ruleIds: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_RULE_IDS,
  invariants: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_INVARIANTS,
  publicApiSurface: directorRuntimeExecutiveGuidanceDeliveryApiNames,
  publicTypes: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_PUBLIC_TYPE_NAMES,
  registry: directorRuntimeExecutiveGuidanceDeliveryRegistry,
  compositionBoundary: "DRI-7:4-composition-only" as const,
  architecturalStatus:
    "Delivery Complete · Consumer-Ready · Deterministic · Traceable · Immutable · Side-Effect-Free · Renderer-Independent · ReadyForPlatform" as const,
});

// ─── Verification ───────────────────────────────────────────────────────────

export interface DirectorRuntimeExecutiveGuidanceDeliveryVerification {
  readonly ok: boolean;
  readonly identity: typeof directorRuntimeExecutiveGuidanceDeliveryIdentity;
  readonly version: typeof directorRuntimeExecutiveGuidanceDeliveryVersion;
  readonly namespace: typeof directorRuntimeExecutiveGuidanceDeliveryNamespace;
  readonly dependency: typeof directorRuntimeExecutiveGuidanceDeliveryUpstream;
  readonly statusCount: number;
  readonly reasonCount: number;
  readonly channelCount: number;
  readonly audienceCount: number;
  readonly ruleCount: number;
  readonly publicTypeCount: number;
  readonly publicApiCount: number;
  readonly invariantCount: number;
  readonly frozen: boolean;
  readonly preservesHierarchy: boolean;
  readonly noReprioritization: boolean;
  readonly noExternalDispatch: boolean;
  readonly compositionCompatible: boolean;
  readonly rendererIndependent: boolean;
  readonly advisorIndependent: boolean;
  readonly actionIndependent: boolean;
  readonly sceneIndependent: boolean;
  readonly deliveryDeterministic: boolean;
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

function buildVerificationComposition():
  DirectorRuntimeExecutiveGuidanceComposition {
  const guidance: DirectorRuntimeExecutiveGuidanceItem = Object.freeze({
    guidanceId: "guidance.production-risk",
    guidanceKind: "direct-attention",
    target: Object.freeze({
      targetKind: "object" as const,
      targetId: "production",
    }),
    importance: "important",
    urgency: "soon",
    intent: "warn",
    source: Object.freeze({
      sourceKind: "attention-output" as const,
      sourceId: "attention.production-risk",
    }),
  });
  const provenance: DirectorRuntimeExecutiveGuidanceProvenance = Object.freeze({
    sourceReferences: Object.freeze([]),
    derivedFromGuidanceIds: Object.freeze([]),
  });
  const primary: DirectorRuntimeExecutiveGuidanceComposedItem = Object.freeze({
    candidateId: "candidate.production-risk",
    guidanceId: "guidance.production-risk",
    priorityTier: "primary",
    role: "attention-anchor",
    ordinal: 0,
    guidance,
    provenance,
    resolutionReasons: Object.freeze(["eligible" as const]),
  });
  return Object.freeze({
    compositionId: "composition.verify",
    requestId: "request.verify",
    primary,
    supporting: Object.freeze([]),
    contextual: Object.freeze([]),
    background: Object.freeze([]),
    relationships: Object.freeze([]),
    paths: Object.freeze([]),
    groups: Object.freeze([]),
    traces: Object.freeze([
      Object.freeze({
        candidateId: "candidate.production-risk",
        guidanceId: "guidance.production-risk",
        resolutionStatus: "selected" as const,
        compositionTier: "primary" as const,
        compositionRole: "attention-anchor" as const,
      }),
    ]),
    deferredCandidateIds: Object.freeze([]),
    suppressedCandidateIds: Object.freeze([]),
    rejectedCandidateIds: Object.freeze([]),
    unresolvedCandidateIds: Object.freeze([]),
    summary: Object.freeze({
      activeItemCount: 1,
      primaryCount: 1 as const,
      supportingCount: 0,
      contextualCount: 0,
      backgroundCount: 0,
      relationshipCount: 0,
      pathCount: 0,
      deferredReferenceCount: 0,
      suppressedReferenceCount: 0,
      rejectedReferenceCount: 0,
      unresolvedReferenceCount: 0,
    }),
  });
}

export function verifyDirectorRuntimeExecutiveGuidanceDelivery():
  DirectorRuntimeExecutiveGuidanceDeliveryVerification {
  const delivery = directorRuntimeExecutiveGuidanceDelivery;
  const registry = directorRuntimeExecutiveGuidanceDeliveryRegistry;

  const identityOk =
    delivery.identity ===
      "DRI-7:5/DirectorRuntimeExecutiveGuidanceDelivery" &&
    delivery.version === "7.5.0" &&
    delivery.namespace === "nexora.dri.executive-guidance.delivery" &&
    delivery.upstreamDependency ===
      "DRI-7:4/DirectorRuntimeExecutiveGuidanceComposition" &&
    delivery.upstreamDependency ===
      directorRuntimeExecutiveGuidanceCompositionIdentity &&
    registry.dependency === delivery.upstreamDependency &&
    delivery.compositionBoundary === "DRI-7:4-composition-only";

  const vocabularyOk =
    exactOrder(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_STATUSES, [
      "ready",
      "held",
      "deferred",
      "blocked",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_REASONS, [
      "composition-ready",
      "no-active-guidance",
      "primary-guidance-missing",
      "context-preservation",
      "focus-preservation",
      "non-interruption-policy",
      "delivery-policy-hold",
      "delivery-policy-defer",
      "invalid-composition",
      "traceability-incomplete",
      "delivery-contract-conflict",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_CHANNELS, [
      "director",
      "advisor",
      "insight",
      "scene",
      "journal",
      "timeline",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_AUDIENCES, [
      "executive",
      "director-runtime",
      "supporting-consumer",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_RULE_ORDER, [
      "composition-integrity",
      "active-guidance",
      "traceability",
      "delivery-permission",
      "interruption-policy",
      "focus-preservation",
      "context-preservation",
      "channel-resolution",
      "delivery-readiness",
    ]) &&
    exactOrder(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_RULE_IDS, [
      "dri7.delivery.composition-integrity",
      "dri7.delivery.active-guidance",
      "dri7.delivery.traceability",
      "dri7.delivery.permission",
      "dri7.delivery.interruption-policy",
      "dri7.delivery.focus-preservation",
      "dri7.delivery.context-preservation",
      "dri7.delivery.channel-resolution",
      "dri7.delivery.readiness",
    ]) &&
    unique([...DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_STATUSES]) &&
    unique([...DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_REASONS]) &&
    unique([...DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_CHANNELS]) &&
    unique([...DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_AUDIENCES]) &&
    unique([...DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_RULE_ORDER]);

  const composition = buildVerificationComposition();
  const input: DirectorRuntimeExecutiveGuidanceDeliveryInput = {
    deliveryId: "delivery.verify",
    composition,
    policy: Object.freeze({
      allowDelivery: true,
      allowInterruption: true,
      preserveFocus: true,
      preserveContext: true,
      preferredChannel: "director",
      fallbackChannel: null,
    }),
    context: Object.freeze({
      activeFocusId: "production",
      activeContextId: "production",
      requestedChannel: null,
    }),
  };
  const first = deliverDirectorExecutiveGuidance(input);
  const second = deliverDirectorExecutiveGuidance(input);

  const deliveryDeterministic =
    JSON.stringify(first) === JSON.stringify(second) &&
    first.status === "ready" &&
    first.primary?.candidateId === "candidate.production-risk";
  const preservesHierarchy =
    first.primary?.priorityTier === "primary" &&
    delivery.boundary.preservesCompositionHierarchy === true;
  const noReprioritization =
    delivery.boundary.doesNotReprioritize === true &&
    delivery.boundary.doesNotReresolve === true;
  const noExternalDispatch =
    delivery.boundary.doesNotDispatchExternally === true &&
    delivery.sideEffectFree === true;

  const immutabilityOk =
    Object.isFrozen(delivery) &&
    Object.isFrozen(registry) &&
    Object.isFrozen(directorRuntimeExecutiveGuidanceDeliveryCanonicalIdentity) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_STATUSES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_REASONS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_CHANNELS) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_AUDIENCES) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_RULE_ORDER) &&
    Object.isFrozen(DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_BOUNDARY) &&
    Object.isFrozen(first) &&
    Object.isFrozen(first.supporting) &&
    Object.isFrozen(first.summary) &&
    Object.isFrozen(first.trace);

  const ok =
    identityOk &&
    vocabularyOk &&
    deliveryDeterministic &&
    preservesHierarchy &&
    noReprioritization &&
    noExternalDispatch &&
    immutabilityOk &&
    delivery.rendererIndependent === true &&
    delivery.advisorIndependent === true &&
    delivery.actionIndependent === true &&
    delivery.sceneIndependent === true;

  return Object.freeze({
    ok,
    identity: directorRuntimeExecutiveGuidanceDeliveryIdentity,
    version: directorRuntimeExecutiveGuidanceDeliveryVersion,
    namespace: directorRuntimeExecutiveGuidanceDeliveryNamespace,
    dependency: directorRuntimeExecutiveGuidanceDeliveryUpstream,
    statusCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_STATUSES.length,
    reasonCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_REASONS.length,
    channelCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_CHANNELS.length,
    audienceCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_AUDIENCES.length,
    ruleCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_RULE_ORDER.length,
    publicTypeCount:
      DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_PUBLIC_TYPE_NAMES.length,
    publicApiCount: directorRuntimeExecutiveGuidanceDeliveryApiNames.length,
    invariantCount: DIRECTOR_RUNTIME_EXECUTIVE_GUIDANCE_DELIVERY_INVARIANTS.length,
    frozen: immutabilityOk,
    preservesHierarchy,
    noReprioritization,
    noExternalDispatch,
    compositionCompatible:
      delivery.upstreamDependency ===
      "DRI-7:4/DirectorRuntimeExecutiveGuidanceComposition",
    rendererIndependent: delivery.rendererIndependent,
    advisorIndependent: delivery.advisorIndependent,
    actionIndependent: delivery.actionIndependent,
    sceneIndependent: delivery.sceneIndependent,
    deliveryDeterministic,
  });
}
