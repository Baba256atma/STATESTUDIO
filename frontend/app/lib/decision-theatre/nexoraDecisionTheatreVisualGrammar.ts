/**
 * DTH:3 — NexoGraph Visual Grammar contract.
 * Renderer-neutral semantic directives. Not CSS, not a second status store, not DTH:4 atmosphere.
 */

export const nexoraDecisionTheatreVisualGrammarIdentity =
  "DTH:3/NexoGraphVisualGrammar" as const;
export const nexoraDecisionTheatreVisualGrammarVersion = "1.0.0" as const;

export const NEXORA_DECISION_THEATRE_VISUAL_CHANNELS = Object.freeze([
  "form",
  "color",
  "size",
  "distance",
  "opacity",
  "halo",
  "line-pattern",
  "line-weight",
  "direction",
  "motion",
  "iconography",
] as const);

export type NexoraDecisionTheatreVisualChannel =
  (typeof NEXORA_DECISION_THEATRE_VISUAL_CHANNELS)[number];

export const NEXORA_DECISION_THEATRE_CHANNEL_MEANING = Object.freeze({
  form: "Object identity: Executive versus Iconic family and type or role",
  color: "Current supported managerial state",
  size: "Supported relative impact when values are comparable",
  distance: "Contextual relevance to the focal context, not causality",
  opacity: "Contextual de-emphasis; the Object remains part of the scene",
  halo: "Supported manager attention, separate from focus and selection",
  "line-pattern": "Relationship support state: established, candidate, or unknown",
  "line-weight": "Supported relative relationship or evidence strength when comparable",
  direction: "Authoritative dependency or flow direction, not causality by default",
  motion: "Supported state or scene transition; never decorative life",
  iconography: "Identity of an Iconic semantic role",
} as const);

export type NexoraDecisionTheatreSemanticStateToken =
  | "state-neutral"
  | "state-stable"
  | "state-attention-required"
  | "state-critical"
  | "state-positive-movement"
  | "state-uncertain"
  | "state-unavailable";

export type NexoraDecisionTheatreVisualDirective = Readonly<{
  grammarVersion: typeof nexoraDecisionTheatreVisualGrammarVersion;
  participantId: string;
  visualFamily: "EXECUTIVE_OBJECT" | "ICONIC_OBJECT" | "RELATIONSHIP";
  channel: NexoraDecisionTheatreVisualChannel;
  semanticToken: string;
  meaning: string;
  authoritativeSource: string;
  provenance: string;
  confidenceOrLimitation: string;
  visualToken: string;
  explanationRef: string;
  fallback: "none" | "neutral";
  conflict: string | null;
  accessibilityEquivalent: string;
  derivationVersion: string;
  nonNeutral: boolean;
}>;
