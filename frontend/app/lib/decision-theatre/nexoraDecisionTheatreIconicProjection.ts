/**
 * DTH:2 — Director projection of Iconic Objects.
 * Presentation-only. Does not write registry, Queue, navigation, or topology.
 */

import {
  formatNexoraDecisionTheatreIconicAccessibilityLabel,
  getNexoraDecisionTheatreIconicRoleDefinition,
  NEXORA_DECISION_THEATRE_ICONIC_ROLES,
  type NexoraDecisionTheatreIconicEpistemicStatus,
  type NexoraDecisionTheatreIconicInteractionCapability,
  type NexoraDecisionTheatreIconicProvenanceKind,
  type NexoraDecisionTheatreIconicRole,
  type NexoraDecisionTheatreIconicValueKind,
} from "./nexoraDecisionTheatreIconicRegistry.ts";
import {
  deriveNexoraDecisionTheatreIconicPresentationId,
  isNexoraDecisionTheatreIconicPresentationId,
  resolveCanonicalExecutiveObjectType,
  type NexoraDecisionTheatreCanonicalObjectType,
} from "./nexoraDecisionTheatreVisualFamily.ts";

export const NEXORA_DECISION_THEATRE_ICONIC_SELECTION_LIMIT = 6 as const;

const ROLE_ORDER: readonly NexoraDecisionTheatreIconicRole[] = NEXORA_DECISION_THEATRE_ICONIC_ROLES;

export type NexoraDecisionTheatreIconicAuthoritativeSource = Readonly<{
  ownerExecutiveObjectId: string;
  role: NexoraDecisionTheatreIconicRole;
  relationshipId?: string | null;
  sourceAuthority: string;
  sourceRef: string;
  provenance: NexoraDecisionTheatreIconicProvenanceKind;
  value: string | number | null;
  valueKind: NexoraDecisionTheatreIconicValueKind;
  unit: string | null;
  epistemicStatus: NexoraDecisionTheatreIconicEpistemicStatus;
  confidenceRef: string | null;
  unknown: boolean;
  missing: boolean;
  managerReadableLabel: string;
  explanation: string;
  whyVisible: string;
  mustNotInterpretAs: readonly string[];
  derivationVersion: string;
}>;

export type NexoraDecisionTheatreIconicObject = Readonly<{
  visualFamily: "ICONIC_OBJECT";
  presentationId: string;
  role: NexoraDecisionTheatreIconicRole;
  ownerExecutiveObjectId: string;
  relationshipId: string | null;
  authoritativeSource: string;
  provenance: NexoraDecisionTheatreIconicProvenanceKind;
  provenanceRef: string;
  value: string | number | null;
  valueKind: NexoraDecisionTheatreIconicValueKind;
  unit: string | null;
  confidenceRef: string | null;
  unknown: boolean;
  missing: boolean;
  epistemicStatus: NexoraDecisionTheatreIconicEpistemicStatus;
  managerReadableLabel: string;
  advisorExplanation: string;
  whyVisible: string;
  mustNotInterpretAs: readonly string[];
  rendererIconToken: string;
  accessibilityLabel: string;
  interactionCapability: NexoraDecisionTheatreIconicInteractionCapability;
  visibility: "visible-attached" | "hidden";
  derivationVersion: string;
}>;

const ZEROISH = /^(0+(\.0+)?|\$0(\.00)?|0\s*(day|days|week|weeks))$/i;

function flattenNumericZero(value: string | number | null): boolean {
  if (value == null) return false;
  if (typeof value === "number") return value === 0;
  return ZEROISH.test(value.trim());
}

export function iconicValueHonestlyRepresentable(
  source: NexoraDecisionTheatreIconicAuthoritativeSource,
): boolean {
  if (source.unknown || source.missing || source.epistemicStatus === "unknown" || source.epistemicStatus === "missing") {
    return source.value == null && !flattenNumericZero(source.value);
  }
  if (source.value == null) return false;
  return !flattenNumericZero(source.value) || source.epistemicStatus === "fact";
}

function wouldReplaceCanonicalExecutive(input: {
  readonly source: NexoraDecisionTheatreIconicAuthoritativeSource;
  readonly visibleExecutives: readonly {
    readonly id: string;
    readonly kind: string;
    readonly label: string;
  }[];
}): boolean {
  const owner = input.visibleExecutives.find((item) => item.id === input.source.ownerExecutiveObjectId);
  if (owner == null) return true;
  const ownerType = resolveCanonicalExecutiveObjectType(owner);
  if (input.source.role === "capacity" && (owner.id === "obj-capacity" || ownerType === "kpi" && /capacity/i.test(owner.label))) {
    return true;
  }
  if (input.source.role === "goal-impact" && ownerType === "goal") {
    return true;
  }
  return false;
}

export function projectNexoraDecisionTheatreIconicObjects(input: {
  readonly visibleExecutives: readonly {
    readonly id: string;
    readonly kind: string;
    readonly label: string;
  }[];
  readonly focusedExecutiveId: string | null;
  readonly relationships: readonly { readonly id: string }[];
  readonly catalogExecutiveIds: readonly string[];
  readonly sources?: readonly NexoraDecisionTheatreIconicAuthoritativeSource[] | null;
}): readonly NexoraDecisionTheatreIconicObject[] {
  const sources = input.sources ?? [];
  if (sources.length === 0) return Object.freeze([]);
  const visibleIds = new Set(input.visibleExecutives.map((item) => item.id));
  const relationshipIds = new Set(input.relationships.map((item) => item.id));
  const catalogIds = new Set(input.catalogExecutiveIds);
  const focusedId = input.focusedExecutiveId;
  const accepted: NexoraDecisionTheatreIconicObject[] = [];
  const sorted = sources.slice().sort((left, right) => {
    const owner = left.ownerExecutiveObjectId.localeCompare(right.ownerExecutiveObjectId);
    if (owner !== 0) return owner;
    return ROLE_ORDER.indexOf(left.role) - ROLE_ORDER.indexOf(right.role);
  });
  const perOwner = new Map<string, number>();
  for (const source of sorted) {
    const definition = getNexoraDecisionTheatreIconicRoleDefinition(source.role);
    if (definition == null) continue;
    if (!visibleIds.has(source.ownerExecutiveObjectId)) continue;
    if (focusedId != null && source.ownerExecutiveObjectId !== focusedId) continue;
    if (!source.sourceAuthority.trim() || !source.sourceRef.trim()) continue;
    if (source.relationshipId && !relationshipIds.has(source.relationshipId)) continue;
    if (!iconicValueHonestlyRepresentable(source)) continue;
    if (wouldReplaceCanonicalExecutive({ source, visibleExecutives: input.visibleExecutives })) continue;
    const presentationId = deriveNexoraDecisionTheatreIconicPresentationId({
      ownerExecutiveObjectId: source.ownerExecutiveObjectId,
      role: source.role,
      relationshipId: source.relationshipId,
      sourceRef: source.sourceRef,
    });
    if (!isNexoraDecisionTheatreIconicPresentationId(presentationId)) continue;
    if (catalogIds.has(presentationId) || visibleIds.has(presentationId)) continue;
    const ownerCount = perOwner.get(source.ownerExecutiveObjectId) ?? 0;
    if (ownerCount >= NEXORA_DECISION_THEATRE_ICONIC_SELECTION_LIMIT) continue;
    const owner = input.visibleExecutives.find((item) => item.id === source.ownerExecutiveObjectId);
    const ownerType: NexoraDecisionTheatreCanonicalObjectType | null = owner
      ? resolveCanonicalExecutiveObjectType(owner)
      : null;
    if (ownerType != null && !definition.applicableExecutiveObjectTypes.includes(ownerType)) {
      continue;
    }
    const status = source.unknown
      ? "unknown"
      : source.missing
        ? "missing"
        : source.value == null
          ? source.epistemicStatus
          : String(source.value);
    accepted.push(
      Object.freeze({
        visualFamily: "ICONIC_OBJECT",
        presentationId,
        role: source.role,
        ownerExecutiveObjectId: source.ownerExecutiveObjectId,
        relationshipId: source.relationshipId ?? null,
        authoritativeSource: source.sourceAuthority,
        provenance: source.provenance,
        provenanceRef: source.sourceRef,
        value: source.value,
        valueKind: source.valueKind,
        unit: source.unit,
        confidenceRef: source.confidenceRef,
        unknown: source.unknown,
        missing: source.missing,
        epistemicStatus: source.epistemicStatus,
        managerReadableLabel: source.managerReadableLabel,
        advisorExplanation: source.explanation,
        whyVisible: source.whyVisible,
        mustNotInterpretAs: Object.freeze(source.mustNotInterpretAs.slice()),
        rendererIconToken: definition.rendererIconToken,
        accessibilityLabel: formatNexoraDecisionTheatreIconicAccessibilityLabel({
          role: source.role,
          ownerLabel: owner?.label ?? source.ownerExecutiveObjectId,
          status,
        }),
        interactionCapability: definition.interactionCapability,
        visibility: "visible-attached",
        derivationVersion: source.derivationVersion,
      }),
    );
    perOwner.set(source.ownerExecutiveObjectId, ownerCount + 1);
  }
  return Object.freeze(accepted);
}

export function iconicIdsPolluteExecutiveSurface(input: {
  readonly iconicObjects: readonly NexoraDecisionTheatreIconicObject[];
  readonly executiveIds: readonly string[];
  readonly queueObjectIds?: readonly string[];
  readonly collectionObjectIds?: readonly string[];
  readonly navigationObjectIds?: readonly string[];
  readonly relatedObjectIds?: readonly string[];
}): readonly string[] {
  const iconicIds = input.iconicObjects.map((item) => item.presentationId);
  const failures: string[] = [];
  const check = (ids: readonly string[] | undefined, label: string) => {
    if (ids == null) return;
    for (const id of iconicIds) {
      if (ids.includes(id)) failures.push(`${label}:${id}`);
    }
  };
  check(input.executiveIds, "executive");
  check(input.queueObjectIds, "queue");
  check(input.collectionObjectIds, "collection");
  check(input.navigationObjectIds, "navigation");
  check(input.relatedObjectIds, "topology");
  return Object.freeze(failures);
}
