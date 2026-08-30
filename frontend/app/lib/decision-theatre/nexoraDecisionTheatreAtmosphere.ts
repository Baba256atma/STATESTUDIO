/**
 * DTH:4 — War Room Atmosphere contract.
 * Stage-environment only. Not Object status, focus, selection, halo, or relationship grammar.
 * Not DTH:5 Scene Intent.
 */

export const nexoraDecisionTheatreAtmosphereIdentity =
  "DTH:4/WarRoomAtmosphere" as const;
export const nexoraDecisionTheatreAtmosphereVersion = "1.0.0" as const;

export const NEXORA_DECISION_THEATRE_ATMOSPHERE_MODES = Object.freeze([
  "none",
  "executive-review",
  "investigation",
  "future-exploration",
  "commitment-review",
  "critical-response",
  "recovery-or-improvement",
  "context-insufficient",
] as const);

export type NexoraDecisionTheatreAtmosphereMode =
  (typeof NEXORA_DECISION_THEATRE_ATMOSPHERE_MODES)[number];

export const NEXORA_DECISION_THEATRE_ATMOSPHERE_INTENSITIES = Object.freeze([
  "none",
  "subtle",
  "moderate",
] as const);

export type NexoraDecisionTheatreAtmosphereIntensity =
  (typeof NEXORA_DECISION_THEATRE_ATMOSPHERE_INTENSITIES)[number];

export const NEXORA_DECISION_THEATRE_ATMOSPHERE_TRANSITIONS = Object.freeze([
  "atmosphere-hold",
  "atmosphere-crossfade",
  "atmosphere-immediate",
] as const);

export type NexoraDecisionTheatreAtmosphereTransition =
  (typeof NEXORA_DECISION_THEATRE_ATMOSPHERE_TRANSITIONS)[number];

export const NEXORA_DECISION_THEATRE_ATMOSPHERE_ENVIRONMENT_CHANNELS = Object.freeze([
  "stage-background-tone",
  "background-radial-field",
  "reserved-region-edge-light",
  "environmental-vignette",
] as const);

export type NexoraDecisionTheatreAtmosphereClaim = Readonly<{
  claimId: string;
  participantId: "stage-environment";
  channel: "atmosphere";
  mode: NexoraDecisionTheatreAtmosphereMode;
  intensity: NexoraDecisionTheatreAtmosphereIntensity;
  supportingFact: string;
  provenance: string;
  confidenceOrLimitation: string;
  whyVisible: string;
  mustNotInfer: readonly string[];
  advisorExplanation: string;
  previousMode: NexoraDecisionTheatreAtmosphereMode;
  fallback: "none";
}>;

export type NexoraDecisionTheatreAtmosphereProjection = Readonly<{
  identity: typeof nexoraDecisionTheatreAtmosphereIdentity;
  version: typeof nexoraDecisionTheatreAtmosphereVersion;
  mode: NexoraDecisionTheatreAtmosphereMode;
  intensity: NexoraDecisionTheatreAtmosphereIntensity;
  authoritativeSourceRefs: readonly string[];
  sceneContextRef: string;
  provenance: string;
  confidenceOrLimitation: string;
  activationReason: string;
  prohibitedInferences: readonly string[];
  transitionToken: NexoraDecisionTheatreAtmosphereTransition;
  accessibilityDescription: string;
  advisorExplanation: string;
  safeFallback: "none";
  claim: NexoraDecisionTheatreAtmosphereClaim | null;
  derivationVersion: typeof nexoraDecisionTheatreAtmosphereIdentity;
  reducedMotion: boolean;
  sceneIntentImplemented: false;
  mutatedDomain: false;
  rendererToken: string;
}>;
