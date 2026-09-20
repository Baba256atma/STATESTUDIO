/**
 * NPA-T STAGE-PROD:5 — bounded, read-only disclosure projection.
 * Selection remains owned by NEX-MVP:4 and content remains owned by DTH:6.
 */

import type { NexoraDecisionTheatreObjectInvestigation } from "@/app/lib/decision-theatre/nexoraDecisionTheatreObjectInvestigation.ts";

export const stageProdInteractiveDisclosureIdentity =
  "NPA-T STAGE-PROD:5/InteractiveDisclosure" as const;

export type StageProdInteractiveDisclosure = Readonly<{
  identity: typeof stageProdInteractiveDisclosureIdentity;
  status: "disclosed" | "dismissed" | "unavailable" | "stale";
  canonicalObjectId: string | null;
  investigation: NexoraDecisionTheatreObjectInvestigation | null;
  lookedUpByLabel: false;
  writesCanonicalManagementState: false;
  staleObjectSubstituted: false;
}>;

export function projectStageProdInteractiveDisclosure(input: Readonly<{
  selectedCanonicalObjectId: string | null;
  visibleCanonicalObjectIds: readonly string[];
  investigation: NexoraDecisionTheatreObjectInvestigation | null;
  disclosureVisible: boolean;
}>): StageProdInteractiveDisclosure {
  const base = {
    identity: stageProdInteractiveDisclosureIdentity,
    lookedUpByLabel: false as const,
    writesCanonicalManagementState: false as const,
    staleObjectSubstituted: false as const,
  };
  if (!input.disclosureVisible) {
    return Object.freeze({
      ...base,
      status: "dismissed" as const,
      canonicalObjectId: null,
      investigation: null,
    });
  }
  if (input.selectedCanonicalObjectId == null || input.investigation == null) {
    return Object.freeze({
      ...base,
      status: "unavailable" as const,
      canonicalObjectId: null,
      investigation: null,
    });
  }
  const exactIdentityMatches =
    input.investigation.objectId === input.selectedCanonicalObjectId;
  const identityRemainsVisible = input.visibleCanonicalObjectIds.includes(
    input.selectedCanonicalObjectId,
  );
  if (!exactIdentityMatches || !identityRemainsVisible) {
    return Object.freeze({
      ...base,
      status: "stale" as const,
      canonicalObjectId: null,
      investigation: null,
    });
  }
  return Object.freeze({
    ...base,
    status: "disclosed" as const,
    canonicalObjectId: input.selectedCanonicalObjectId,
    investigation: input.investigation,
  });
}
