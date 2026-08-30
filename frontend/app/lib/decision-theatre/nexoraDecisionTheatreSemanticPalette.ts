/**
 * DTH:3 — Semantic state palette. Maps existing runtime status; does not create a second status model.
 * Manager-facing names avoid internal codes such as WATCH.
 */

import type { NexoraDecisionTheatreSemanticStateToken } from "./nexoraDecisionTheatreVisualGrammar.ts";

export const nexoraDecisionTheatreSemanticPaletteIdentity =
  "DTH:3/SemanticStatePalette" as const;

export type NexoraDecisionTheatreSemanticPaletteEntry = Readonly<{
  token: NexoraDecisionTheatreSemanticStateToken;
  managerMeaning: string;
  allowedInputs: readonly string[];
  prohibitedInterpretations: readonly string[];
  accessibleLabel: string;
  nonColorEquivalent: string;
  rendererToken: string;
}>;

export const NEXORA_DECISION_THEATRE_SEMANTIC_PALETTE: Readonly<
  Record<NexoraDecisionTheatreSemanticStateToken, NexoraDecisionTheatreSemanticPaletteEntry>
> = Object.freeze({
  "state-neutral": Object.freeze({
    token: "state-neutral",
    managerMeaning: "No supported distinctive state is shown.",
    allowedInputs: Object.freeze(["missing", "unknown", "none"]),
    prohibitedInterpretations: Object.freeze(["healthy", "approved", "zero risk"]),
    accessibleLabel: "Neutral state",
    nonColorEquivalent: "No state marker",
    rendererToken: "nxg-state-neutral",
  }),
  "state-stable": Object.freeze({
    token: "state-stable",
    managerMeaning: "The supported current state is stable or on track.",
    allowedInputs: Object.freeze(["stable"]),
    prohibitedInterpretations: Object.freeze(["unimportant", "no attention needed forever"]),
    accessibleLabel: "On track",
    nonColorEquivalent: "On-track marker",
    rendererToken: "nxg-state-stable",
  }),
  "state-attention-required": Object.freeze({
    token: "state-attention-required",
    managerMeaning: "The supported current state needs attention.",
    allowedInputs: Object.freeze(["watch"]),
    prohibitedInterpretations: Object.freeze(["critical failure", "approved urgency"]),
    accessibleLabel: "Attention required",
    nonColorEquivalent: "Attention marker",
    rendererToken: "nxg-state-attention",
  }),
  "state-critical": Object.freeze({
    token: "state-critical",
    managerMeaning: "The supported current state is critical.",
    allowedInputs: Object.freeze(["risk"]),
    prohibitedInterpretations: Object.freeze(["this Object type is inherently critical"]),
    accessibleLabel: "Critical",
    nonColorEquivalent: "Critical marker",
    rendererToken: "nxg-state-critical",
  }),
  "state-positive-movement": Object.freeze({
    token: "state-positive-movement",
    managerMeaning: "Supported movement is improving.",
    allowedInputs: Object.freeze(["improving"]),
    prohibitedInterpretations: Object.freeze(["goal achieved", "outcome closed"]),
    accessibleLabel: "Improving",
    nonColorEquivalent: "Improvement marker",
    rendererToken: "nxg-state-positive",
  }),
  "state-uncertain": Object.freeze({
    token: "state-uncertain",
    managerMeaning: "The supported current state is unresolved or uncertain.",
    allowedInputs: Object.freeze(["unresolved", "uncertain"]),
    prohibitedInterpretations: Object.freeze(["false", "zero", "deleted"]),
    accessibleLabel: "Uncertain",
    nonColorEquivalent: "Uncertain pattern",
    rendererToken: "nxg-state-uncertain",
  }),
  "state-unavailable": Object.freeze({
    token: "state-unavailable",
    managerMeaning: "A supported state is not available.",
    allowedInputs: Object.freeze(["missing"]),
    prohibitedInterpretations: Object.freeze(["stable by default", "low risk"]),
    accessibleLabel: "Unavailable",
    nonColorEquivalent: "Unavailable marker",
    rendererToken: "nxg-state-unavailable",
  }),
}) as Readonly<Record<NexoraDecisionTheatreSemanticStateToken, NexoraDecisionTheatreSemanticPaletteEntry>>;

export function resolveSemanticStateToken(status: string | null | undefined): NexoraDecisionTheatreSemanticStateToken {
  const value = (status ?? "").trim().toLowerCase();
  if (value === "stable") return "state-stable";
  if (value === "watch") return "state-attention-required";
  if (value === "risk") return "state-critical";
  if (value === "improving") return "state-positive-movement";
  if (value === "unresolved" || value === "uncertain") return "state-uncertain";
  if (value === "missing") return "state-unavailable";
  return "state-neutral";
}
