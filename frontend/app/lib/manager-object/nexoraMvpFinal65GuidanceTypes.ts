/**
 * NEX-MVP-FINAL:6.5 — guidance and self-knowledge contracts.
 * Projection over existing authorities. Not a second registry or journey engine.
 */

export const GUIDANCE_INTENTS = Object.freeze([
  "CAPABILITY",
  "HOW_TO_USE",
  "WHAT_TO_ASK",
  "EXAMPLES",
  "NEXT_STEP",
  "WHERE_WE_ARE",
  "PROGRESS",
  "REMAINING",
  "NEED_INFO",
  "KNOW",
  "DONT_KNOW",
  "INVESTIGATE",
  "OPTIONS",
  "HELP_DECIDE",
  "YOU_DECIDE",
  "DO_IT_FOR_ME",
  "START",
  "MONITOR",
  "DID_WE_DECIDE",
  "ARE_WE_DOING",
  "PRODUCT_FICTION",
  "PARTIAL_FORECAST",
  "NONE",
] as const);

export type GuidanceIntent = (typeof GUIDANCE_INTENTS)[number];

export const CAPABILITY_AVAILABILITY = Object.freeze([
  "SUPPORTED",
  "AVAILABLE_NOW",
  "BLOCKED_BY_PREREQUISITE",
  "NOT_SUPPORTED",
  "UNKNOWN",
] as const);

export type CapabilityAvailability = (typeof CAPABILITY_AVAILABILITY)[number];

export type ProjectedCapability = {
  readonly id: string;
  readonly label: string;
  readonly availability: CapabilityAvailability;
  readonly prerequisite: string | null;
  readonly authority: string;
};

export type GuidanceTurnResult = {
  readonly identity: "NEX-MVP-FINAL:6.5/GuidanceSelfKnowledge";
  readonly intent: GuidanceIntent;
  readonly action: "replace" | "append" | "keep";
  readonly answer: string | null;
  readonly capabilityId: string | null;
  readonly availability: CapabilityAvailability | null;
  readonly prerequisite: string | null;
  readonly journeyPhase: string | null;
  readonly selectedGuidance: string | null;
  readonly guidanceReason: string | null;
  readonly proactiveEligible: boolean;
  readonly proactiveSuppressed: string | null;
  readonly authoritySource: string;
  readonly commitsDecision: false;
  readonly startsExecution: false;
};
