/**
 * Phase 5:6 — Advisory–War Room Integration registry.
 */

import { CANONICAL_DECISION_GUIDANCE_OWNER } from "../decisionGuidance/decisionGuidanceContract.ts";
import { CANONICAL_EXECUTIVE_ADVISORY_OWNER } from "../executiveAdvisory/executiveAdvisoryContract.ts";
import { CANONICAL_WAR_ROOM_INTELLIGENCE_OWNER } from "../warRoomIntelligence/warRoomIntelligenceContract.ts";
import type { IntegrationParticipantId, IntegrationRegistryEntry } from "./advisoryWarRoomIntegrationContract.ts";

export const ADVISORY_WAR_ROOM_INTEGRATION_REGISTRY_VERSION = "5.6.0";

export const ADVISORY_WAR_ROOM_INTEGRATION_REGISTRY = Object.freeze([
  Object.freeze({
    participantId: "war_room" as const,
    owner: CANONICAL_WAR_ROOM_INTELLIGENCE_OWNER,
    role: "intake" as const,
    description: "War Room Intelligence — primary decision-context source",
  }),
  Object.freeze({
    participantId: "executive_advisory" as const,
    owner: CANONICAL_EXECUTIVE_ADVISORY_OWNER,
    role: "transformation" as const,
    description: "Executive Advisory — guidance context transformation",
  }),
  Object.freeze({
    participantId: "decision_guidance" as const,
    owner: CANONICAL_DECISION_GUIDANCE_OWNER,
    role: "delivery" as const,
    description: "Decision Guidance Surface — executive presentation delivery",
  }),
] satisfies readonly IntegrationRegistryEntry[]);

export function listIntegrationParticipants(): readonly IntegrationParticipantId[] {
  return Object.freeze(ADVISORY_WAR_ROOM_INTEGRATION_REGISTRY.map((entry) => entry.participantId));
}

export function getIntegrationRegistryEntry(
  participantId: IntegrationParticipantId
): IntegrationRegistryEntry {
  const entry = ADVISORY_WAR_ROOM_INTEGRATION_REGISTRY.find(
    (item) => item.participantId === participantId
  );
  if (!entry) throw new Error(`Integration participant not registered: ${participantId}`);
  return entry;
}
