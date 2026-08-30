/**
 * DTH:4 — Renderer atmosphere tokens only. Hex/CSS lives here, not in Director or Runtime.
 */

import type { NexoraDecisionTheatreAtmosphereMode } from "./nexoraDecisionTheatreAtmosphere.ts";
import { NEXORA_DECISION_THEATRE_ATMOSPHERE_REGISTRY } from "./nexoraDecisionTheatreAtmosphereRegistry.ts";

export const nexoraDecisionTheatreAtmosphereRendererIdentity =
  "DTH:4/AtmosphereRendererTokens" as const;

export type NexoraDecisionTheatreAtmosphereSwatch = Readonly<{
  token: string;
  background: string;
  radial: string;
  vignette: string;
  edge: string;
  opacity: string;
}>;

const SWATCH: Readonly<Record<NexoraDecisionTheatreAtmosphereMode, NexoraDecisionTheatreAtmosphereSwatch>> =
  Object.freeze({
    none: Object.freeze({
      token: "nxa-atmosphere-none",
      background: "transparent",
      radial: "transparent",
      vignette: "transparent",
      edge: "transparent",
      opacity: "0",
    }),
    "executive-review": Object.freeze({
      token: "nxa-atmosphere-executive-review",
      background: "rgba(11, 18, 32, 0.18)",
      radial: "rgba(56, 90, 130, 0.10)",
      vignette: "rgba(8, 12, 20, 0.22)",
      edge: "rgba(148, 163, 184, 0.12)",
      opacity: "0.55",
    }),
    investigation: Object.freeze({
      token: "nxa-atmosphere-investigation",
      background: "rgba(36, 28, 16, 0.16)",
      radial: "rgba(201, 162, 92, 0.10)",
      vignette: "rgba(20, 14, 8, 0.20)",
      edge: "rgba(201, 162, 92, 0.14)",
      opacity: "0.55",
    }),
    "future-exploration": Object.freeze({
      token: "nxa-atmosphere-future-exploration",
      background: "rgba(18, 16, 36, 0.16)",
      radial: "rgba(120, 110, 180, 0.10)",
      vignette: "rgba(12, 10, 24, 0.20)",
      edge: "rgba(129, 140, 248, 0.12)",
      opacity: "0.55",
    }),
    "commitment-review": Object.freeze({
      token: "nxa-atmosphere-commitment-review",
      background: "rgba(16, 18, 28, 0.18)",
      radial: "rgba(90, 110, 140, 0.12)",
      vignette: "rgba(10, 12, 20, 0.24)",
      edge: "rgba(148, 163, 184, 0.16)",
      opacity: "0.58",
    }),
    "critical-response": Object.freeze({
      token: "nxa-atmosphere-critical-response",
      background: "rgba(32, 14, 14, 0.14)",
      radial: "rgba(140, 70, 70, 0.08)",
      vignette: "rgba(18, 8, 8, 0.22)",
      edge: "rgba(176, 92, 92, 0.12)",
      opacity: "0.50",
    }),
    "recovery-or-improvement": Object.freeze({
      token: "nxa-atmosphere-recovery",
      background: "rgba(12, 24, 22, 0.14)",
      radial: "rgba(80, 140, 150, 0.10)",
      vignette: "rgba(8, 16, 16, 0.18)",
      edge: "rgba(110, 150, 150, 0.12)",
      opacity: "0.50",
    }),
    "context-insufficient": Object.freeze({
      token: "nxa-atmosphere-context-insufficient",
      background: "rgba(14, 18, 24, 0.22)",
      radial: "rgba(80, 96, 120, 0.06)",
      vignette: "rgba(10, 14, 20, 0.28)",
      edge: "rgba(100, 116, 139, 0.10)",
      opacity: "0.60",
    }),
  });

export function resolveNexoraDecisionTheatreAtmosphereSwatch(
  mode: NexoraDecisionTheatreAtmosphereMode,
): NexoraDecisionTheatreAtmosphereSwatch {
  return SWATCH[mode];
}

export function atmosphereRendererToken(mode: NexoraDecisionTheatreAtmosphereMode): string {
  return NEXORA_DECISION_THEATRE_ATMOSPHERE_REGISTRY[mode].rendererToken;
}
