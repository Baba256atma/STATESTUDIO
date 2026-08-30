/**
 * DTH:3 — Renderer token mapping only. Hex/CSS lives here, not in Director or domain logic.
 */

import type { NexoraDecisionTheatreSemanticStateToken } from "./nexoraDecisionTheatreVisualGrammar.ts";
import { NEXORA_DECISION_THEATRE_SEMANTIC_PALETTE } from "./nexoraDecisionTheatreSemanticPalette.ts";

export const nexoraDecisionTheatreRendererTokenRegistryIdentity =
  "DTH:3/RendererTokenRegistry" as const;

export type NexoraDecisionTheatreRendererSwatch = Readonly<{
  token: string;
  border: string;
  fill: string;
  pattern: "none" | "dot" | "dash";
}>;

const STATE_SWATCH: Readonly<Record<NexoraDecisionTheatreSemanticStateToken, NexoraDecisionTheatreRendererSwatch>> =
  Object.freeze({
    "state-neutral": Object.freeze({
      token: "nxg-state-neutral",
      border: "rgba(148, 163, 184, 0.45)",
      fill: "transparent",
      pattern: "none",
    }),
    "state-stable": Object.freeze({
      token: "nxg-state-stable",
      border: "rgba(125, 168, 148, 0.7)",
      fill: "rgba(125, 168, 148, 0.12)",
      pattern: "none",
    }),
    "state-attention-required": Object.freeze({
      token: "nxg-state-attention",
      border: "rgba(201, 162, 92, 0.75)",
      fill: "rgba(201, 162, 92, 0.12)",
      pattern: "none",
    }),
    "state-critical": Object.freeze({
      token: "nxg-state-critical",
      border: "rgba(176, 92, 92, 0.8)",
      fill: "rgba(176, 92, 92, 0.12)",
      pattern: "none",
    }),
    "state-positive-movement": Object.freeze({
      token: "nxg-state-positive",
      border: "rgba(110, 150, 170, 0.7)",
      fill: "rgba(110, 150, 170, 0.12)",
      pattern: "none",
    }),
    "state-uncertain": Object.freeze({
      token: "nxg-state-uncertain",
      border: "rgba(148, 163, 184, 0.7)",
      fill: "transparent",
      pattern: "dot",
    }),
    "state-unavailable": Object.freeze({
      token: "nxg-state-unavailable",
      border: "rgba(100, 116, 139, 0.5)",
      fill: "transparent",
      pattern: "dash",
    }),
  });

export function resolveNexoraDecisionTheatreStateSwatch(
  token: NexoraDecisionTheatreSemanticStateToken,
): NexoraDecisionTheatreRendererSwatch {
  return STATE_SWATCH[token];
}

export function paletteRendererToken(
  token: NexoraDecisionTheatreSemanticStateToken,
): string {
  return NEXORA_DECISION_THEATRE_SEMANTIC_PALETTE[token].rendererToken;
}
