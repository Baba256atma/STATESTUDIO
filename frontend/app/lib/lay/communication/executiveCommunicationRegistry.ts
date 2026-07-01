import type { ExecutiveCommunicationCapabilityId } from "./executiveCommunicationTypes.ts";

export type ExecutiveCommunicationCapabilityDefinition = Readonly<{
  id: ExecutiveCommunicationCapabilityId;
  name: string;
  description: string;
}>;

export const EXECUTIVE_COMMUNICATION_CAPABILITY_REGISTRY: readonly ExecutiveCommunicationCapabilityDefinition[] = Object.freeze([
  Object.freeze({ id: "briefingGeneration", name: "Briefing Generation", description: "Builds deterministic executive briefing metadata." }),
  Object.freeze({ id: "summaryGeneration", name: "Summary Generation", description: "Builds board-style summary metadata." }),
  Object.freeze({ id: "situationExplanation", name: "Situation Explanation", description: "Communicates situation context from reasoning." }),
  Object.freeze({ id: "rationaleCommunication", name: "Rationale Communication", description: "Communicates judgment rationale metadata." }),
  Object.freeze({ id: "riskCommunication", name: "Risk Communication", description: "Communicates risk, opportunity, and blind spot metadata." }),
  Object.freeze({ id: "planCommunication", name: "Plan Communication", description: "Communicates logical plan metadata." }),
  Object.freeze({ id: "audienceFraming", name: "Audience Framing", description: "Builds audience-specific framing metadata." }),
]);

export function listExecutiveCommunicationCapabilities(): readonly ExecutiveCommunicationCapabilityDefinition[] {
  return EXECUTIVE_COMMUNICATION_CAPABILITY_REGISTRY;
}
