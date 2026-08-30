/**
 * DTH:4 — Whole-scene atmosphere resolver.
 * Does not read Object color, count, display name, or keyword matching.
 */

import {
  nexoraDecisionTheatreAtmosphereIdentity,
  nexoraDecisionTheatreAtmosphereVersion,
  type NexoraDecisionTheatreAtmosphereClaim,
  type NexoraDecisionTheatreAtmosphereIntensity,
  type NexoraDecisionTheatreAtmosphereMode,
  type NexoraDecisionTheatreAtmosphereProjection,
  type NexoraDecisionTheatreAtmosphereTransition,
} from "./nexoraDecisionTheatreAtmosphere.ts";
import { NEXORA_DECISION_THEATRE_ATMOSPHERE_REGISTRY } from "./nexoraDecisionTheatreAtmosphereRegistry.ts";
import { atmosphereRendererToken } from "./nexoraDecisionTheatreAtmosphereRendererTokens.ts";

export const nexoraDecisionTheatreAtmosphereResolverIdentity =
  "DTH:4/AtmosphereResolver" as const;

export type NexoraDecisionTheatreAtmosphereAuthority = Readonly<{
  executiveReviewSupported?: boolean;
  investigationSupported?: boolean;
  futureExplorationSupported?: boolean;
  commitmentReviewSupported?: boolean;
  criticalWholeSceneSupported?: boolean;
  recoveryObservedSupported?: boolean;
  contextInsufficientKnown?: boolean;
  expectedImprovementOnly?: boolean;
  recommendationPresent?: boolean;
  intensitySupport?: NexoraDecisionTheatreAtmosphereIntensity;
  provenance?: string | null;
  sourceRefs?: readonly string[] | null;
  sceneContextRef?: string | null;
  previousMode?: NexoraDecisionTheatreAtmosphereMode | null;
  reducedMotion?: boolean;
}>;

const HEX_OR_CSS = /#([0-9a-f]{3,8})\b|\brgba?\(|\bgradient\b|\bbox-shadow\b/i;

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

function supportedModes(authority: NexoraDecisionTheatreAtmosphereAuthority): NexoraDecisionTheatreAtmosphereMode[] {
  const modes: NexoraDecisionTheatreAtmosphereMode[] = [];
  if (authority.executiveReviewSupported === true) modes.push("executive-review");
  if (authority.investigationSupported === true) modes.push("investigation");
  if (authority.futureExplorationSupported === true) modes.push("future-exploration");
  if (authority.commitmentReviewSupported === true) modes.push("commitment-review");
  if (authority.criticalWholeSceneSupported === true) modes.push("critical-response");
  if (authority.recoveryObservedSupported === true && authority.expectedImprovementOnly !== true) {
    modes.push("recovery-or-improvement");
  }
  if (authority.contextInsufficientKnown === true) modes.push("context-insufficient");
  return modes;
}

function resolveIntensity(
  mode: NexoraDecisionTheatreAtmosphereMode,
  requested: NexoraDecisionTheatreAtmosphereIntensity | undefined,
): NexoraDecisionTheatreAtmosphereIntensity {
  if (mode === "none") return "none";
  if (requested === "moderate" && (mode === "critical-response" || mode === "investigation")) {
    return "moderate";
  }
  return "subtle";
}

function resolveTransition(input: {
  readonly previous: NexoraDecisionTheatreAtmosphereMode;
  readonly next: NexoraDecisionTheatreAtmosphereMode;
  readonly reducedMotion: boolean;
}): NexoraDecisionTheatreAtmosphereTransition {
  if (input.previous === input.next) return "atmosphere-hold";
  if (input.reducedMotion) return "atmosphere-immediate";
  return "atmosphere-crossfade";
}

function claimFor(
  projection: Omit<NexoraDecisionTheatreAtmosphereProjection, "claim">,
  previous: NexoraDecisionTheatreAtmosphereMode,
): NexoraDecisionTheatreAtmosphereClaim | null {
  if (projection.mode === "none") return null;
  return Object.freeze({
    claimId: `dth4-claim:stage-environment:${projection.mode}:${projection.intensity}`,
    participantId: "stage-environment",
    channel: "atmosphere",
    mode: projection.mode,
    intensity: projection.intensity,
    supportingFact: projection.activationReason,
    provenance: projection.provenance,
    confidenceOrLimitation: projection.confidenceOrLimitation,
    whyVisible: projection.activationReason,
    mustNotInfer: projection.prohibitedInferences,
    advisorExplanation: projection.advisorExplanation,
    previousMode: previous,
    fallback: "none",
  });
}

export function projectNexoraDecisionTheatreAtmosphere(
  authority: NexoraDecisionTheatreAtmosphereAuthority | null | undefined,
): NexoraDecisionTheatreAtmosphereProjection {
  const input = authority ?? {};
  const previous = input.previousMode ?? "none";
  const reducedMotion = input.reducedMotion === true;
  const modes = supportedModes(input);
  let mode: NexoraDecisionTheatreAtmosphereMode = "none";
  let limitation = "No whole-scene atmosphere support is present.";
  let activationReason = "The Stage keeps its existing environment.";
  if (modes.length > 1) {
    limitation = "Conflicting whole-scene atmosphere support; atmosphere stays none.";
    activationReason = "Conflicting atmosphere support is not shown as a mixed environment.";
  } else if (modes.length === 1) {
    mode = modes[0];
    const entry = NEXORA_DECISION_THEATRE_ATMOSPHERE_REGISTRY[mode];
    limitation = `Atmosphere is environmental only. ${entry.prohibitedInferences[0] ?? "Do not over-read it."}`;
    activationReason = entry.allowedWholeSceneSupport;
  }
  const registry = NEXORA_DECISION_THEATRE_ATMOSPHERE_REGISTRY[mode];
  const intensity = resolveIntensity(mode, input.intensitySupport);
  const transitionToken = resolveTransition({ previous, next: mode, reducedMotion });
  const rendererToken = atmosphereRendererToken(mode);
  if (HEX_OR_CSS.test(rendererToken) || HEX_OR_CSS.test(mode)) {
    throw new Error("renderer-specific value leaked into atmosphere contract");
  }
  const base: Omit<NexoraDecisionTheatreAtmosphereProjection, "claim"> = {
    identity: nexoraDecisionTheatreAtmosphereIdentity,
    version: nexoraDecisionTheatreAtmosphereVersion,
    mode,
    intensity,
    authoritativeSourceRefs: Object.freeze([...(input.sourceRefs ?? [])]),
    sceneContextRef: input.sceneContextRef?.trim() || "current-theatre-scene",
    provenance: input.provenance?.trim() || "whole-scene-atmosphere-authority",
    confidenceOrLimitation: limitation,
    activationReason,
    prohibitedInferences: registry.prohibitedInferences,
    transitionToken,
    accessibilityDescription: `${registry.accessibleLabel}. Intensity ${intensity}. ${registry.managerMeaning}`,
    advisorExplanation: `${registry.managerMeaning} ${limitation} This is not object status, focus, or a recommendation.`,
    safeFallback: "none",
    derivationVersion: nexoraDecisionTheatreAtmosphereIdentity,
    reducedMotion,
    sceneIntentImplemented: false,
    mutatedDomain: false,
    rendererToken,
  };
  return freezeTree({
    ...base,
    claim: claimFor(base, previous),
  });
}
