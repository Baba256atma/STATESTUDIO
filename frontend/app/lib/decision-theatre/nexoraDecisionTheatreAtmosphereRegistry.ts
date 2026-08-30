/**
 * DTH:4 — Semantic atmosphere registry. Manager meaning only; no hex or CSS.
 */

import type { NexoraDecisionTheatreAtmosphereMode } from "./nexoraDecisionTheatreAtmosphere.ts";

export const nexoraDecisionTheatreAtmosphereRegistryIdentity =
  "DTH:4/AtmosphereSemanticRegistry" as const;

export type NexoraDecisionTheatreAtmosphereRegistryEntry = Readonly<{
  mode: NexoraDecisionTheatreAtmosphereMode;
  managerMeaning: string;
  allowedWholeSceneSupport: string;
  prohibitedInferences: readonly string[];
  accessibleLabel: string;
  rendererToken: string;
}>;

export const NEXORA_DECISION_THEATRE_ATMOSPHERE_REGISTRY: Readonly<
  Record<NexoraDecisionTheatreAtmosphereMode, NexoraDecisionTheatreAtmosphereRegistryEntry>
> = Object.freeze({
  none: Object.freeze({
    mode: "none",
    managerMeaning: "No special Stage environment is active.",
    allowedWholeSceneSupport: "Missing, conflicting, navigational, or unsupported context",
    prohibitedInferences: Object.freeze(["no executive context", "healthy business", "system malfunction"]),
    accessibleLabel: "No special Stage atmosphere",
    rendererToken: "nxa-atmosphere-none",
  }),
  "executive-review": Object.freeze({
    mode: "executive-review",
    managerMeaning: "The Stage is in a calm executive review.",
    allowedWholeSceneSupport: "Supported non-escalated whole-scene review",
    prohibitedInferences: Object.freeze(["healthy business", "positive outcome", "low risk", "approved state"]),
    accessibleLabel: "Executive review atmosphere",
    rendererToken: "nxa-atmosphere-executive-review",
  }),
  investigation: Object.freeze({
    mode: "investigation",
    managerMeaning: "The Stage is in a calm investigation environment.",
    allowedWholeSceneSupport: "Authoritative whole-scene investigation",
    prohibitedInferences: Object.freeze(["confirmed cause", "high urgency", "critical state", "recommended action"]),
    accessibleLabel: "Investigation atmosphere",
    rendererToken: "nxa-atmosphere-investigation",
  }),
  "future-exploration": Object.freeze({
    mode: "future-exploration",
    managerMeaning: "The Stage is exploring possible futures.",
    allowedWholeSceneSupport: "Authoritative Scenario or future-path exploration",
    prohibitedInferences: Object.freeze([
      "prediction certainty",
      "preferred scenario",
      "approved decision",
      "simulation accuracy",
      "future truth",
    ]),
    accessibleLabel: "Future exploration atmosphere",
    rendererToken: "nxa-atmosphere-future-exploration",
  }),
  "commitment-review": Object.freeze({
    mode: "commitment-review",
    managerMeaning: "The Stage is reviewing a decision before approval.",
    allowedWholeSceneSupport: "Authoritative Decision commitment review",
    prohibitedInferences: Object.freeze(["decision approved", "execution started", "recommended option accepted"]),
    accessibleLabel: "Commitment review atmosphere",
    rendererToken: "nxa-atmosphere-commitment-review",
  }),
  "critical-response": Object.freeze({
    mode: "critical-response",
    managerMeaning: "The Stage reflects a critical whole-scene situation.",
    allowedWholeSceneSupport: "Explicit whole-scene critical response support",
    prohibitedInferences: Object.freeze(["one red object", "one risk", "alarm", "recommended action"]),
    accessibleLabel: "Critical response atmosphere",
    rendererToken: "nxa-atmosphere-critical-response",
  }),
  "recovery-or-improvement": Object.freeze({
    mode: "recovery-or-improvement",
    managerMeaning: "The Stage reflects supported recovery or improvement.",
    allowedWholeSceneSupport: "Authoritative observed recovery, not expected improvement",
    prohibitedInferences: Object.freeze(["goal achieved", "execution caused improvement", "outcome confirmed", "learning established"]),
    accessibleLabel: "Recovery atmosphere",
    rendererToken: "nxa-atmosphere-recovery",
  }),
  "context-insufficient": Object.freeze({
    mode: "context-insufficient",
    managerMeaning: "Important scene context is incomplete.",
    allowedWholeSceneSupport: "Explicitly known insufficient scene context",
    prohibitedInferences: Object.freeze(["bad performance", "low confidence everywhere", "missing business data generally", "system malfunction"]),
    accessibleLabel: "Insufficient context atmosphere",
    rendererToken: "nxa-atmosphere-context-insufficient",
  }),
});
