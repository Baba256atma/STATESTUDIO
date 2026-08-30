/**
 * DTH:3 — Theatre → NexoGraph semantic directives → renderer-neutral tokens.
 * Does not mutate Executive Objects, Queue, navigation, or domain state.
 */

import { NEXORA_DECISION_THEATRE_CHANNEL_MEANING } from "./nexoraDecisionTheatreVisualGrammar.ts";
import {
  nexoraDecisionTheatreVisualGrammarIdentity,
  nexoraDecisionTheatreVisualGrammarVersion,
  type NexoraDecisionTheatreVisualDirective,
  type NexoraDecisionTheatreSemanticStateToken,
} from "./nexoraDecisionTheatreVisualGrammar.ts";
import { resolveSemanticStateToken } from "./nexoraDecisionTheatreSemanticPalette.ts";
import { NEXORA_DECISION_THEATRE_SEMANTIC_PALETTE } from "./nexoraDecisionTheatreSemanticPalette.ts";
import { paletteRendererToken } from "./nexoraDecisionTheatreRendererTokens.ts";
import type {
  NexoraDecisionTheatreAdvisorVisualExplanation,
  NexoraDecisionTheatreExecutiveObject,
  NexoraDecisionTheatreRelationship,
} from "./nexoraDecisionTheatreContract.ts";
import type { NexoraDecisionTheatreIconicObject } from "./nexoraDecisionTheatreIconicProjection.ts";
import {
  resolveNexoraDecisionTheatreRelationshipVisual,
  type NexoraDecisionTheatreRelationshipSupportState,
  type NexoraDecisionTheatreRelationshipVisual,
} from "./nexoraDecisionTheatreRelationshipGrammar.ts";
import {
  createNexoraDecisionTheatreVisualClaim,
  type NexoraDecisionTheatreVisualClaim,
} from "./nexoraDecisionTheatreVisualClaimLedger.ts";

export const nexoraDecisionTheatreVisualProjectionIdentity =
  "DTH:3/VisualGrammarProjection" as const;

const HEX_OR_CSS = /#([0-9a-f]{3,8})\b|\brgba?\(|\bhsl\(|\bclassName\b|\.[a-z][\w-]*\s*\{/i;

export type NexoraDecisionTheatreImpactCriterion = Readonly<{
  criterionId: string;
  unit: string;
  values: Readonly<Record<string, number | null | undefined>>;
}>;

export type NexoraDecisionTheatreRelationshipPresentationInput = Readonly<{
  relationshipId: string;
  supportState?: NexoraDecisionTheatreRelationshipSupportState | null;
  strength?: number | null;
  strengthComparable?: boolean;
  direction?: "source-to-target" | "target-to-source" | "none" | null;
  causalAuthority?: boolean;
  provenance?: string | null;
}>;

export type NexoraDecisionTheatreVisualGrammarInput = Readonly<{
  impactCriterion?: NexoraDecisionTheatreImpactCriterion | null;
  relationshipPresentations?: readonly NexoraDecisionTheatreRelationshipPresentationInput[] | null;
  contextDeemphasizedIds?: readonly string[] | null;
  reducedMotion?: boolean;
}>;

export type NexoraDecisionTheatreVisualConflict = Readonly<{
  code: string;
  participantIds: readonly string[];
  resolution: string;
  fallback: "none" | "neutral";
}>;

export type NexoraDecisionTheatreParticipantVisualPresentation = Readonly<{
  participantId: string;
  visualFamily: "EXECUTIVE_OBJECT" | "ICONIC_OBJECT";
  formToken: string;
  stateToken: NexoraDecisionTheatreSemanticStateToken;
  rendererStateToken: string;
  scaleToken: "size-equal" | "size-lower" | "size-higher" | "size-subordinate";
  opacityToken: "opacity-full" | "opacity-deemphasized";
  haloToken: "halo-none" | "halo-attention";
  overlayFocus: boolean;
  overlaySelection: boolean;
  accessibilityDescription: string;
  subordinate: boolean;
}>;

export type NexoraDecisionTheatreVisualGrammarProjection = Readonly<{
  identity: typeof nexoraDecisionTheatreVisualProjectionIdentity;
  grammarIdentity: typeof nexoraDecisionTheatreVisualGrammarIdentity;
  grammarVersion: typeof nexoraDecisionTheatreVisualGrammarVersion;
  directives: readonly NexoraDecisionTheatreVisualDirective[];
  claims: readonly NexoraDecisionTheatreVisualClaim[];
  conflicts: readonly NexoraDecisionTheatreVisualConflict[];
  fallbacks: readonly string[];
  relationshipVisuals: readonly NexoraDecisionTheatreRelationshipVisual[];
  presentations: readonly NexoraDecisionTheatreParticipantVisualPresentation[];
  advisorVisualExplanations: readonly NexoraDecisionTheatreAdvisorVisualExplanation[];
  legendReserved: true;
  legendVisible: false;
  reducedMotion: boolean;
  atmosphere: "none";
  mutatedDomain: false;
}>;

function freezeTree<T>(value: T): T {
  if (value == null || typeof value !== "object") return value;
  if (Array.isArray(value)) {
    for (const item of value) freezeTree(item);
    return Object.freeze(value) as T;
  }
  for (const nested of Object.values(value as Record<string, unknown>)) {
    freezeTree(nested);
  }
  return Object.freeze(value);
}

function directive(input: Omit<NexoraDecisionTheatreVisualDirective, "grammarVersion" | "derivationVersion">): NexoraDecisionTheatreVisualDirective {
  const built: NexoraDecisionTheatreVisualDirective = Object.freeze({
    grammarVersion: nexoraDecisionTheatreVisualGrammarVersion,
    derivationVersion: nexoraDecisionTheatreVisualProjectionIdentity,
    ...input,
  });
  if (HEX_OR_CSS.test(built.visualToken) || HEX_OR_CSS.test(built.semanticToken)) {
    throw new Error("renderer-specific token leaked into grammar");
  }
  return built;
}

function comparableFinite(values: readonly (number | null | undefined)[]): number[] {
  return values.filter((value): value is number => typeof value === "number" && Number.isFinite(value));
}

export function resolveImpactScaleTokens(
  criterion: NexoraDecisionTheatreImpactCriterion | null | undefined,
  participantIds: readonly string[],
): Readonly<Record<string, "size-equal" | "size-lower" | "size-higher">> {
  const result: Record<string, "size-equal" | "size-lower" | "size-higher"> = {};
  const equalize = () => {
    for (const id of participantIds) result[id] = "size-equal";
    return result;
  };
  if (criterion == null || !criterion.unit.trim() || !criterion.criterionId.trim()) {
    return Object.freeze(equalize());
  }
  const values = participantIds.map((id) => criterion.values[id]);
  const finite = comparableFinite(values);
  if (finite.length !== participantIds.length || finite.length < 2) {
    return Object.freeze(equalize());
  }
  const min = Math.min(...finite);
  const max = Math.max(...finite);
  if (max === min) return Object.freeze(equalize());
  const mid = (min + max) / 2;
  for (const id of participantIds) {
    const value = criterion.values[id];
    if (typeof value !== "number") {
      result[id] = "size-equal";
      continue;
    }
    result[id] = value < mid ? "size-lower" : value > mid ? "size-higher" : "size-equal";
  }
  return Object.freeze(result);
}

function attentionRequestsHalo(attention: string): boolean {
  const value = attention.trim().toLowerCase();
  return value === "elevated" || value === "important" || value === "critical";
}

function opacityFloor(deemphasized: boolean, reducedMotion: boolean): "opacity-full" | "opacity-deemphasized" {
  void reducedMotion;
  return deemphasized ? "opacity-deemphasized" : "opacity-full";
}

export function projectNexoraDecisionTheatreVisualGrammar(input: {
  readonly executives: readonly NexoraDecisionTheatreExecutiveObject[];
  readonly iconicObjects: readonly NexoraDecisionTheatreIconicObject[];
  readonly relationships: readonly NexoraDecisionTheatreRelationship[];
  readonly grammar?: NexoraDecisionTheatreVisualGrammarInput | null;
}): NexoraDecisionTheatreVisualGrammarProjection {
  const grammar = input.grammar ?? {};
  const reducedMotion = grammar.reducedMotion === true;
  const deemphasized = new Set(grammar.contextDeemphasizedIds ?? []);
  const directives: NexoraDecisionTheatreVisualDirective[] = [];
  const claims: NexoraDecisionTheatreVisualClaim[] = [];
  const conflicts: NexoraDecisionTheatreVisualConflict[] = [];
  const fallbacks: string[] = [];
  const presentations: NexoraDecisionTheatreParticipantVisualPresentation[] = [];
  const advisorVisualExplanations: NexoraDecisionTheatreAdvisorVisualExplanation[] = [];

  const executiveIds = input.executives.map((item) => item.id).slice().sort();
  const scaleById = resolveImpactScaleTokens(grammar.impactCriterion, executiveIds);
  if (grammar.impactCriterion == null) {
    fallbacks.push("impact-incomparable-equal-size");
  } else if (
    executiveIds.some((id) => {
      const value = grammar.impactCriterion?.values[id];
      return value == null || !Number.isFinite(value);
    })
  ) {
    fallbacks.push("impact-missing-equal-size");
  }

  function pushClaim(partial: Omit<NexoraDecisionTheatreVisualClaim, "claimId">) {
    claims.push(createNexoraDecisionTheatreVisualClaim(partial));
  }

  function pushDirective(
    next: Omit<NexoraDecisionTheatreVisualDirective, "grammarVersion" | "derivationVersion">,
    claim?: Omit<NexoraDecisionTheatreVisualClaim, "claimId" | "participantId" | "channel" | "semanticToken">,
  ) {
    const built = directive(next);
    directives.push(built);
    if (built.nonNeutral && claim) {
      pushClaim({
        participantId: built.participantId,
        channel: built.channel,
        semanticToken: built.semanticToken,
        ...claim,
      });
    }
  }

  for (const executive of [...input.executives].sort((a, b) => a.id.localeCompare(b.id))) {
    const formToken = `form-executive-${executive.canonicalObjectType}`;
    const stateToken = resolveSemanticStateToken(executive.lifecycleStatus);
    const palette = NEXORA_DECISION_THEATRE_SEMANTIC_PALETTE[stateToken];
    const halo = attentionRequestsHalo(executive.attention);
    const deemph = deemphasized.has(executive.id) || executive.visibility === "background-discoverable";
    const opacityToken = opacityFloor(deemph, reducedMotion);
    const scaleToken = scaleById[executive.id] ?? "size-equal";
    if (executive.focused && stateToken !== "state-neutral") {
      conflicts.push(
        Object.freeze({
          code: "focus-versus-status",
          participantIds: Object.freeze([executive.id]),
          resolution: "Focus overlay remains; status color token is preserved",
          fallback: "none",
        }),
      );
    }
    if (executive.selected && stateToken !== "state-neutral") {
      conflicts.push(
        Object.freeze({
          code: "selection-versus-status",
          participantIds: Object.freeze([executive.id]),
          resolution: "Selection overlay remains; status color token is preserved",
          fallback: "none",
        }),
      );
    }
    if (halo && executive.focused) {
      conflicts.push(
        Object.freeze({
          code: "halo-versus-focus",
          participantIds: Object.freeze([executive.id]),
          resolution: "Halo remains attention; focus uses the existing focus contract",
          fallback: "none",
        }),
      );
    }
    if (halo && stateToken === "state-critical") {
      conflicts.push(
        Object.freeze({
          code: "attention-versus-critical",
          participantIds: Object.freeze([executive.id]),
          resolution: "Critical state color remains; halo does not replace identity or critical meaning",
          fallback: "none",
        }),
      );
    }
    if (deemph && opacityToken === "opacity-deemphasized") {
      conflicts.push(
        Object.freeze({
          code: "deemphasis-versus-accessibility",
          participantIds: Object.freeze([executive.id]),
          resolution: "Opacity is reduced but remains above a readable floor; meaning is also in the accessible description",
          fallback: "none",
        }),
      );
    }

    pushDirective(
      {
        participantId: executive.id,
        visualFamily: "EXECUTIVE_OBJECT",
        channel: "form",
        semanticToken: formToken,
        meaning: NEXORA_DECISION_THEATRE_CHANNEL_MEANING.form,
        authoritativeSource: executive.authoritativeSource,
        provenance: "canonical-object-type",
        confidenceOrLimitation: "Identity follows the canonical Executive Object type",
        visualToken: formToken,
        explanationRef: `explain:${executive.id}:form`,
        fallback: "none",
        conflict: null,
        accessibilityEquivalent: `${executive.canonicalObjectType} object`,
        nonNeutral: true,
      },
      {
        channelMeaning: NEXORA_DECISION_THEATRE_CHANNEL_MEANING.form,
        supportingFact: `canonicalObjectType=${executive.canonicalObjectType}`,
        provenance: "canonical-object-type",
        confidenceOrLimitation: "Type is independent of status",
        whyVisible: "The object remains identifiable by type",
        mustNotInfer: Object.freeze(["status", "urgency", "confidence"]),
        advisorExplanation: `This remains a ${executive.canonicalObjectType}, independent of its current state.`,
      },
    );

    const colorNeutral = stateToken === "state-neutral";
    pushDirective(
      {
        participantId: executive.id,
        visualFamily: "EXECUTIVE_OBJECT",
        channel: "color",
        semanticToken: stateToken,
        meaning: palette.managerMeaning,
        authoritativeSource: executive.authoritativeSource,
        provenance: "lifecycle-status",
        confidenceOrLimitation: colorNeutral
          ? "No supported distinctive state"
          : `Mapped from runtime status without exposing internal codes`,
        visualToken: paletteRendererToken(stateToken),
        explanationRef: `explain:${executive.id}:color`,
        fallback: colorNeutral ? "neutral" : "none",
        conflict: executive.focused ? "focus-versus-status" : null,
        accessibilityEquivalent: palette.accessibleLabel,
        nonNeutral: !colorNeutral,
      },
      colorNeutral
        ? undefined
        : {
            channelMeaning: NEXORA_DECISION_THEATRE_CHANNEL_MEANING.color,
            supportingFact: `lifecycleStatus=${executive.lifecycleStatus ?? "none"}`,
            provenance: "lifecycle-status",
            confidenceOrLimitation: "Color is never the only carrier",
            whyVisible: palette.managerMeaning,
            mustNotInfer: Object.freeze([...palette.prohibitedInterpretations, "object type"]),
            advisorExplanation: `${palette.accessibleLabel}. ${palette.nonColorEquivalent}.`,
          },
    );

    const sizeNonNeutral = scaleToken !== "size-equal";
    pushDirective(
      {
        participantId: executive.id,
        visualFamily: "EXECUTIVE_OBJECT",
        channel: "size",
        semanticToken: scaleToken,
        meaning: NEXORA_DECISION_THEATRE_CHANNEL_MEANING.size,
        authoritativeSource: grammar.impactCriterion?.criterionId ?? "none",
        provenance: "comparable-impact",
        confidenceOrLimitation: sizeNonNeutral
          ? `Criterion ${grammar.impactCriterion?.criterionId} in ${grammar.impactCriterion?.unit}`
          : "Peers remain equal-sized because comparable impact is not supported",
        visualToken: scaleToken,
        explanationRef: `explain:${executive.id}:size`,
        fallback: sizeNonNeutral ? "none" : "neutral",
        conflict: null,
        accessibilityEquivalent: sizeNonNeutral
          ? `Relative impact ${scaleToken.replace("size-", "")}`
          : "Equal size; no impact ranking",
        nonNeutral: sizeNonNeutral,
      },
      sizeNonNeutral
        ? {
            channelMeaning: NEXORA_DECISION_THEATRE_CHANNEL_MEANING.size,
            supportingFact: `criterion=${grammar.impactCriterion?.criterionId};unit=${grammar.impactCriterion?.unit}`,
            provenance: "comparable-impact",
            confidenceOrLimitation: "Bounded relative scale only",
            whyVisible: "Comparable impact values are available for the active criterion",
            mustNotInfer: Object.freeze(["urgency", "confidence", "selection", "business value"]),
            advisorExplanation: "Size shows relative impact on the active comparison, not importance in general.",
          }
        : undefined,
    );

    pushDirective({
      participantId: executive.id,
      visualFamily: "EXECUTIVE_OBJECT",
      channel: "distance",
      semanticToken: "distance-layout-existing",
      meaning: NEXORA_DECISION_THEATRE_CHANNEL_MEANING.distance,
      authoritativeSource: "existing-stage-layout",
      provenance: "stage-layout",
      confidenceOrLimitation: "Existing layout is preserved; nearby does not mean causal",
      visualToken: "distance-layout-existing",
      explanationRef: `explain:${executive.id}:distance`,
      fallback: "neutral",
      conflict: "existing-stage-versus-dth-directive",
      accessibilityEquivalent: "Existing layout distance; not a causal claim",
      nonNeutral: false,
    });

    const opacityNonNeutral = opacityToken !== "opacity-full";
    pushDirective(
      {
        participantId: executive.id,
        visualFamily: "EXECUTIVE_OBJECT",
        channel: "opacity",
        semanticToken: opacityToken,
        meaning: NEXORA_DECISION_THEATRE_CHANNEL_MEANING.opacity,
        authoritativeSource: "theatre-visibility",
        provenance: "contextual-emphasis",
        confidenceOrLimitation: "Still part of the scene",
        visualToken: opacityToken,
        explanationRef: `explain:${executive.id}:opacity`,
        fallback: opacityNonNeutral ? "none" : "neutral",
        conflict: opacityNonNeutral ? "deemphasis-versus-accessibility" : null,
        accessibilityEquivalent: opacityNonNeutral
          ? "Present but not central to the current context"
          : "Fully present",
        nonNeutral: opacityNonNeutral,
      },
      opacityNonNeutral
        ? {
            channelMeaning: NEXORA_DECISION_THEATRE_CHANNEL_MEANING.opacity,
            supportingFact: `visibility=${executive.visibility}`,
            provenance: "contextual-emphasis",
            confidenceOrLimitation: "Not deleted, invalid, or low confidence",
            whyVisible: "The object remains in the scene with reduced emphasis",
            mustNotInfer: Object.freeze(["deleted", "invalid", "unimportant", "low confidence"]),
            advisorExplanation: "Reduced emphasis means this is not central now, not that it was removed.",
          }
        : undefined,
    );

    const haloToken = halo ? "halo-attention" : "halo-none";
    pushDirective(
      {
        participantId: executive.id,
        visualFamily: "EXECUTIVE_OBJECT",
        channel: "halo",
        semanticToken: haloToken,
        meaning: NEXORA_DECISION_THEATRE_CHANNEL_MEANING.halo,
        authoritativeSource: "stage-attention",
        provenance: "attention-field",
        confidenceOrLimitation: halo ? `attention=${executive.attention}` : "No attention halo",
        visualToken: haloToken,
        explanationRef: `explain:${executive.id}:halo`,
        fallback: halo ? "none" : "neutral",
        conflict: executive.focused ? "halo-versus-focus" : null,
        accessibilityEquivalent: halo ? "Attention requested" : "No attention halo",
        nonNeutral: halo,
      },
      halo
        ? {
            channelMeaning: NEXORA_DECISION_THEATRE_CHANNEL_MEANING.halo,
            supportingFact: `attention=${executive.attention}`,
            provenance: "attention-field",
            confidenceOrLimitation: "Halo is not focus, selection, or critical status",
            whyVisible: "Supported attention is requested",
            mustNotInfer: Object.freeze(["focus", "selection", "approval", "execution readiness"]),
            advisorExplanation: "A halo asks for attention. It is not the same as focus or selection.",
          }
        : undefined,
    );

    const motionToken = reducedMotion ? "motion-none" : "motion-none";
    pushDirective({
      participantId: executive.id,
      visualFamily: "EXECUTIVE_OBJECT",
      channel: "motion",
      semanticToken: motionToken,
      meaning: NEXORA_DECISION_THEATRE_CHANNEL_MEANING.motion,
      authoritativeSource: "none",
      provenance: "no-unsupported-animation",
      confidenceOrLimitation: "No decorative motion; DTH:5 behavior engine is out of scope",
      visualToken: motionToken,
      explanationRef: `explain:${executive.id}:motion`,
      fallback: "neutral",
      conflict: null,
      accessibilityEquivalent: "No motion required to understand state",
      nonNeutral: false,
    });

    const accessibilityDescription = [
      `${executive.canonicalObjectType} object`,
      palette.accessibleLabel,
      executive.focused ? "focused" : null,
      executive.selected ? "selected" : null,
      halo ? "attention requested" : null,
      opacityNonNeutral ? "present but not central" : null,
      sizeNonNeutral ? `relative impact ${scaleToken.replace("size-", "")}` : "equal size",
    ]
      .filter(Boolean)
      .join("; ");

    presentations.push(
      Object.freeze({
        participantId: executive.id,
        visualFamily: "EXECUTIVE_OBJECT",
        formToken,
        stateToken,
        rendererStateToken: paletteRendererToken(stateToken),
        scaleToken,
        opacityToken,
        haloToken,
        overlayFocus: executive.focused,
        overlaySelection: executive.selected,
        accessibilityDescription,
        subordinate: false,
      }),
    );

    advisorVisualExplanations.push(
      Object.freeze({
        subject: executive.advisorIdentity,
        appearance: `Form ${formToken}; state ${palette.accessibleLabel}`,
        meaning: `${palette.managerMeaning} Type remains ${executive.canonicalObjectType}.`,
        supportedBy: executive.lifecycleStatus
          ? `Current supported state is taken from the object’s status.`
          : "No distinctive status is supported, so the state stays neutral.",
        remainsUnknown: sizeNonNeutral
          ? "Impact comparison is limited to the stated criterion."
          : "Relative impact is not ranked.",
        doNotInfer: "Do not treat color as object type, halo as focus, or nearby placement as cause.",
      }),
    );
  }

  for (const iconic of [...input.iconicObjects].sort((a, b) =>
    a.presentationId.localeCompare(b.presentationId),
  )) {
    const formToken = `form-iconic-${iconic.role}`;
    const owner = input.executives.find((item) => item.id === iconic.ownerExecutiveObjectId);
    const stateToken: NexoraDecisionTheatreSemanticStateToken =
      iconic.unknown || iconic.missing ? "state-unavailable" : "state-neutral";
    const palette = NEXORA_DECISION_THEATRE_SEMANTIC_PALETTE[stateToken];
    conflicts.push(
      Object.freeze({
        code: "executive-versus-iconic",
        participantIds: Object.freeze([iconic.ownerExecutiveObjectId, iconic.presentationId]),
        resolution: "Iconic remains subordinate in size and attachment; it does not replace the owner",
        fallback: "none",
      }),
    );
    if (owner?.canonicalObjectType === "risk" && iconic.role !== "uncertainty") {
      conflicts.push(
        Object.freeze({
          code: "canonical-risk-versus-summary-icon",
          participantIds: Object.freeze([owner.id, iconic.presentationId]),
          resolution: "The Risk Executive Object remains the actor; the icon does not replace it",
          fallback: "none",
        }),
      );
    }

    pushDirective(
      {
        participantId: iconic.presentationId,
        visualFamily: "ICONIC_OBJECT",
        channel: "form",
        semanticToken: formToken,
        meaning: NEXORA_DECISION_THEATRE_CHANNEL_MEANING.iconography,
        authoritativeSource: iconic.authoritativeSource,
        provenance: iconic.provenance,
        confidenceOrLimitation: iconic.advisorExplanation,
        visualToken: iconic.rendererIconToken,
        explanationRef: `explain:${iconic.presentationId}:form`,
        fallback: "none",
        conflict: "executive-versus-iconic",
        accessibilityEquivalent: iconic.accessibilityLabel,
        nonNeutral: true,
      },
      {
        channelMeaning: NEXORA_DECISION_THEATRE_CHANNEL_MEANING.iconography,
        supportingFact: `role=${iconic.role};owner=${iconic.ownerExecutiveObjectId}`,
        provenance: iconic.provenance,
        confidenceOrLimitation: iconic.unknown
          ? "Unknown is not zero"
          : iconic.missing
            ? "Missing is not false"
            : "Value follows the supporting source",
        whyVisible: iconic.whyVisible,
        mustNotInfer: iconic.mustNotInterpretAs,
        advisorExplanation: iconic.advisorExplanation,
      },
    );

    pushDirective({
      participantId: iconic.presentationId,
      visualFamily: "ICONIC_OBJECT",
      channel: "color",
      semanticToken: stateToken,
      meaning: palette.managerMeaning,
      authoritativeSource: iconic.authoritativeSource,
      provenance: iconic.provenance,
      confidenceOrLimitation: "Iconic color does not encode magnitude",
      visualToken: paletteRendererToken(stateToken),
      explanationRef: `explain:${iconic.presentationId}:color`,
      fallback: "neutral",
      conflict: null,
      accessibilityEquivalent: palette.accessibleLabel,
      nonNeutral: stateToken !== "state-neutral",
    });
    if (stateToken !== "state-neutral") {
      pushClaim({
        participantId: iconic.presentationId,
        channel: "color",
        channelMeaning: NEXORA_DECISION_THEATRE_CHANNEL_MEANING.color,
        semanticToken: stateToken,
        supportingFact: `epistemicStatus=${iconic.epistemicStatus}`,
        provenance: iconic.provenance,
        confidenceOrLimitation: "Unavailable is not zero",
        whyVisible: "The indicator is shown with an honest unknown or missing state",
        mustNotInfer: Object.freeze(["zero", "low risk", "false"]),
        advisorExplanation: palette.managerMeaning,
      });
    }

    pushDirective({
      participantId: iconic.presentationId,
      visualFamily: "ICONIC_OBJECT",
      channel: "size",
      semanticToken: "size-subordinate",
      meaning: "Iconic Objects stay visually subordinate to their owner",
      authoritativeSource: iconic.authoritativeSource,
      provenance: "iconic-subordination",
      confidenceOrLimitation: "Size is not magnitude unless a comparable criterion is explicit",
      visualToken: "size-subordinate",
      explanationRef: `explain:${iconic.presentationId}:size`,
      fallback: "none",
      conflict: "executive-versus-iconic",
      accessibilityEquivalent: "Smaller attached indicator",
      nonNeutral: true,
    });
    pushClaim({
      participantId: iconic.presentationId,
      channel: "size",
      channelMeaning: NEXORA_DECISION_THEATRE_CHANNEL_MEANING.size,
      semanticToken: "size-subordinate",
      supportingFact: "Iconic family contract",
      provenance: "iconic-subordination",
      confidenceOrLimitation: "Not a magnitude encoding",
      whyVisible: "The indicator stays smaller than its owner",
      mustNotInfer: Object.freeze(["cost magnitude", "importance"]),
      advisorExplanation: "The smaller mark is an attached indicator, not a smaller business object.",
    });

    presentations.push(
      Object.freeze({
        participantId: iconic.presentationId,
        visualFamily: "ICONIC_OBJECT",
        formToken,
        stateToken,
        rendererStateToken: paletteRendererToken(stateToken),
        scaleToken: "size-subordinate",
        opacityToken: "opacity-full",
        haloToken: "halo-none",
        overlayFocus: false,
        overlaySelection: false,
        accessibilityDescription: iconic.accessibilityLabel,
        subordinate: true,
      }),
    );

    advisorVisualExplanations.push(
      Object.freeze({
        subject: iconic.managerReadableLabel,
        appearance: `Attached ${iconic.role} indicator`,
        meaning: iconic.advisorExplanation,
        supportedBy: "The attached indicator follows its supporting source.",
        remainsUnknown: iconic.unknown || iconic.missing ? "The value is not known." : "Limitations follow the source.",
        doNotInfer: iconic.mustNotInterpretAs.join("; "),
      }),
    );
  }

  const presentationByRel = new Map(
    (grammar.relationshipPresentations ?? []).map((item) => [item.relationshipId, item]),
  );
  const peerStrengths = (grammar.relationshipPresentations ?? [])
    .filter((item) => item.strengthComparable)
    .map((item) => item.strength ?? null);
  const relationshipVisuals: NexoraDecisionTheatreRelationshipVisual[] = [];

  for (const relationship of [...input.relationships].sort((a, b) => a.id.localeCompare(b.id))) {
    const extra = presentationByRel.get(relationship.id);
    const visual = resolveNexoraDecisionTheatreRelationshipVisual({
      relationshipId: relationship.id,
      semanticType: relationship.semanticRelation,
      supportState: extra?.supportState,
      strength: extra?.strength,
      peerStrengths,
      strengthComparable: extra?.strengthComparable === true,
      direction: extra?.direction,
      causalAuthority: false,
      provenance: extra?.provenance,
    });
    const honestVisual = visual;
    relationshipVisuals.push(honestVisual);
    conflicts.push(
      Object.freeze({
        code: "relationship-support-versus-causal-status",
        participantIds: Object.freeze([relationship.id]),
        resolution: "Line pattern follows support state; causal language stays off without causal authority",
        fallback: "none",
      }),
    );

    const patternNonNeutral = true;
    pushDirective(
      {
        participantId: relationship.id,
        visualFamily: "RELATIONSHIP",
        channel: "line-pattern",
        semanticToken: honestVisual.patternToken,
        meaning: NEXORA_DECISION_THEATRE_CHANNEL_MEANING["line-pattern"],
        authoritativeSource: honestVisual.provenance,
        provenance: honestVisual.provenance,
        confidenceOrLimitation: honestVisual.uncertainty,
        visualToken: honestVisual.patternToken,
        explanationRef: `explain:${relationship.id}:pattern`,
        fallback: honestVisual.fallback,
        conflict: "relationship-support-versus-causal-status",
        accessibilityEquivalent:
          honestVisual.supportState === "established"
            ? "Supported relationship"
            : honestVisual.supportState === "candidate"
              ? "Candidate relationship"
              : "Unresolved relationship",
        nonNeutral: patternNonNeutral,
      },
      {
        channelMeaning: NEXORA_DECISION_THEATRE_CHANNEL_MEANING["line-pattern"],
        supportingFact: `support=${honestVisual.supportState};relation=${relationship.semanticRelation ?? "none"}`,
        provenance: honestVisual.provenance,
        confidenceOrLimitation: honestVisual.uncertainty,
        whyVisible: honestVisual.explanation,
        mustNotInfer: honestVisual.mustNotInfer,
        advisorExplanation: honestVisual.explanation,
      },
    );

    const weightNonNeutral = honestVisual.weightToken !== "weight-neutral";
    pushDirective(
      {
        participantId: relationship.id,
        visualFamily: "RELATIONSHIP",
        channel: "line-weight",
        semanticToken: honestVisual.weightToken,
        meaning: NEXORA_DECISION_THEATRE_CHANNEL_MEANING["line-weight"],
        authoritativeSource: honestVisual.provenance,
        provenance: honestVisual.provenance,
        confidenceOrLimitation: weightNonNeutral
          ? "Comparable evidence strength"
          : "Strength unknown or incomparable",
        visualToken: honestVisual.weightToken,
        explanationRef: `explain:${relationship.id}:weight`,
        fallback: weightNonNeutral ? "none" : "neutral",
        conflict: null,
        accessibilityEquivalent: weightNonNeutral
          ? `Relative evidence strength ${honestVisual.weightToken.replace("weight-", "")}`
          : "Neutral line weight",
        nonNeutral: weightNonNeutral,
      },
      weightNonNeutral
        ? {
            channelMeaning: NEXORA_DECISION_THEATRE_CHANNEL_MEANING["line-weight"],
            supportingFact: "comparable evidence strength",
            provenance: honestVisual.provenance,
            confidenceOrLimitation: "Not mention count or proximity",
            whyVisible: "Comparable evidence strength is available",
            mustNotInfer: Object.freeze(["business impact", "mention count"]),
            advisorExplanation: "Line weight shows relative evidence strength, not business impact.",
          }
        : undefined,
    );

    const arrow = honestVisual.directionToken !== "arrow-none";
    pushDirective(
      {
        participantId: relationship.id,
        visualFamily: "RELATIONSHIP",
        channel: "direction",
        semanticToken: honestVisual.directionToken,
        meaning: NEXORA_DECISION_THEATRE_CHANNEL_MEANING.direction,
        authoritativeSource: honestVisual.provenance,
        provenance: honestVisual.provenance,
        confidenceOrLimitation: honestVisual.causalLanguageAllowed
          ? "Causal language allowed"
          : "Direction is not causality",
        visualToken: honestVisual.directionToken,
        explanationRef: `explain:${relationship.id}:direction`,
        fallback: arrow ? "none" : "neutral",
        conflict: "relationship-support-versus-causal-status",
        accessibilityEquivalent: arrow ? "Directed relationship" : "Undirected association",
        nonNeutral: arrow,
      },
      arrow
        ? {
            channelMeaning: NEXORA_DECISION_THEATRE_CHANNEL_MEANING.direction,
            supportingFact: `direction=${extra?.direction ?? "none"}`,
            provenance: honestVisual.provenance,
            confidenceOrLimitation: "Not a causal confirmation",
            whyVisible: "Authoritative direction of dependency or flow is available",
            mustNotInfer: Object.freeze(["confirmed cause"]),
            advisorExplanation: "An arrow shows direction. It does not by itself confirm cause.",
          }
        : undefined,
    );

    advisorVisualExplanations.push(
      Object.freeze({
        subject: `${relationship.sourceId} and ${relationship.targetId}`,
        appearance: `${honestVisual.patternToken}; ${honestVisual.directionToken}`,
        meaning: honestVisual.explanation,
        supportedBy: "The shown relationship follows the Stage association, not a confirmed cause.",
        remainsUnknown: honestVisual.uncertainty,
        doNotInfer: honestVisual.mustNotInfer.join("; "),
      }),
    );
  }

  if (input.executives.length === 0 && input.iconicObjects.length === 0) {
    fallbacks.push("empty-grammar-preserves-stage");
  }

  return freezeTree({
    identity: nexoraDecisionTheatreVisualProjectionIdentity,
    grammarIdentity: nexoraDecisionTheatreVisualGrammarIdentity,
    grammarVersion: nexoraDecisionTheatreVisualGrammarVersion,
    directives: Object.freeze(directives),
    claims: Object.freeze(claims),
    conflicts: Object.freeze(conflicts),
    fallbacks: Object.freeze(fallbacks),
    relationshipVisuals: Object.freeze(relationshipVisuals),
    presentations: Object.freeze(presentations),
    advisorVisualExplanations: Object.freeze(advisorVisualExplanations),
    legendReserved: true as const,
    legendVisible: false as const,
    reducedMotion,
    atmosphere: "none" as const,
    mutatedDomain: false as const,
  });
}

export function presentationByParticipantId(
  projection: NexoraDecisionTheatreVisualGrammarProjection,
): Readonly<Record<string, NexoraDecisionTheatreParticipantVisualPresentation>> {
  return Object.freeze(
    Object.fromEntries(projection.presentations.map((item) => [item.participantId, item])),
  );
}
