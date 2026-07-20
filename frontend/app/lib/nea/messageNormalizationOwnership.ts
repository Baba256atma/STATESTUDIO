/**
 * NEA-6:1 — Message Normalization Ownership.
 *
 * Ownership and non-ownership declarations for Message Normalization Foundation.
 * Metadata only — no runtime assignment.
 *
 * Ownership: owned exclusively by NEA-6:1.
 */

export const MESSAGE_NORMALIZATION_OWNS = Object.freeze([
  "Executive Message Contract",
  "Message Metadata Contract",
  "Context Contracts",
  "Attachment Contracts",
  "Normalization Lifecycle",
  "Capabilities",
  "Ownership",
  "Boundaries",
] as const);

export const MESSAGE_NORMALIZATION_DOES_NOT_OWN = Object.freeze([
  "Message Parsing",
  "AI",
  "Intent Detection",
  "DKL",
  "Executive Engine",
  "Business Objects",
  "Storage",
  "Database",
  "Connector Runtime",
  "HTTP",
  "OAuth",
  "Session Runtime",
  "Conversation Runtime",
  "Routing",
  "Security",
  "Assistant",
  "Advisor",
  "Director",
  "EVE",
  "Runtime Normalization",
  "LLM",
  "Intent Recognition",
  "Entity Extraction",
  "Business Understanding",
  "REST",
  "WebSockets",
  "Authentication",
  "Queue",
  "Event Bus",
] as const);

/** Canonical immutable ownership declaration. */
export const MessageNormalizationOwnership = Object.freeze({
  ownershipId: "NEA-6:1/MessageNormalizationOwnership",
  sourcePhase: "NEA-6:1" as const,
  owns: MESSAGE_NORMALIZATION_OWNS,
  doesNotOwn: MESSAGE_NORMALIZATION_DOES_NOT_OWN,
  ownsCount: MESSAGE_NORMALIZATION_OWNS.length,
  doesNotOwnCount: MESSAGE_NORMALIZATION_DOES_NOT_OWN.length,
  ownsMessageParsing: false as const,
  ownsAi: false as const,
  ownsIntentDetection: false as const,
  ownsDkl: false as const,
  ownsExecutiveEngine: false as const,
  ownsBusinessObjects: false as const,
  ownsStorage: false as const,
  ownsDatabase: false as const,
  ownsConnectorRuntime: false as const,
  ownsHttp: false as const,
  ownsOauth: false as const,
  ownsSessionRuntime: false as const,
  ownsConversationRuntime: false as const,
  ownsRouting: false as const,
  ownsSecurity: false as const,
  ownsAssistant: false as const,
  ownsAdvisor: false as const,
  ownsDirector: false as const,
  ownsEve: false as const,
  ownsRuntimeNormalization: false as const,
  ownsLlm: false as const,
  ownsIntentRecognition: false as const,
  ownsEntityExtraction: false as const,
  ownsBusinessUnderstanding: false as const,
  ownsRest: false as const,
  ownsWebSockets: false as const,
  ownsAuthentication: false as const,
  ownsQueue: false as const,
  ownsEventBus: false as const,
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
