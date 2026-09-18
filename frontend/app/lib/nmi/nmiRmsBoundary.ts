/**
 * NPA-T NMI:1 — RMS Ground Truth is not management intelligence.
 *
 * RMS Ground Truth → Gate / canonical authorities → NMI Unified Management Model
 * → Advisor / VAI / NPS / Stage / Theatre.
 */

import { RMS_AUTHORITY_BOUNDARY } from "@/app/lib/rms/rmsAuthorityBoundary.ts";
import { RMS_DEFERRED_CAPABILITIES, RMS_FOUNDATION_CONTRACT } from "@/app/lib/rms/rmsFoundationContract.ts";

export const NMI_RMS_BOUNDARY = Object.freeze({
  rmsGroundTruthOwner: "RMS:1",
  nmiManagementOwner: "NMI:1",
  rmsWritesNmiTruth: false as const,
  nmiIsSimulationEngine: false as const,
  rmsDeferredNmi: RMS_DEFERRED_CAPABILITIES.includes("NMI"),
  rmsDoesNotOwnNmi: RMS_AUTHORITY_BOUNDARY.nmi === false,
  privilegedSimulationNexora: RMS_FOUNDATION_CONTRACT.privilegedSimulationNexora,
  startsRms2: false as const,
  conceptualFlow: Object.freeze([
    "RMS_GROUND_TRUTH",
    "GATE_AND_CANONICAL_AUTHORITIES",
    "NMI_UNIFIED_MANAGEMENT_MODEL",
    "ADVISOR_VAI_NPS_STAGE_THEATRE",
  ] as const),
});
