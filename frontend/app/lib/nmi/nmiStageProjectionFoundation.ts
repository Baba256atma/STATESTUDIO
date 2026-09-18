/**
 * NPA-T NMI:6 — Stage projection verification.
 * Requires certified NMI:1–5. Does not start NMI:7 or DTH-EXP.
 */

import { DirectorFoundationId } from "@/app/lib/director/directorFoundation.ts";
import { NMI_AUTHORITY_BOUNDARY, verifyNmiAuthorityBoundary } from "./nmiAuthorityBoundary.ts";
import { NMI_FOUNDATION_CONTRACT } from "./nmiContract.ts";
import { verifyNmiFoundation } from "./nmiFoundation.ts";
import { NMI_GATE_BOUNDARY } from "./nmiGateBoundary.ts";
import { NMI_RMS_BOUNDARY } from "./nmiRmsBoundary.ts";
import { NMI_MANAGEMENT_NAVIGATION_CONTRACT } from "./nmiManagementNavigationContract.ts";
import { verifyNmiManagementNavigation } from "./nmiManagementNavigationFoundation.ts";
import {
  NMI_STAGE_PROJECTION_CONTRACT,
  NMI_STAGE_PROJECTION_GATE_FLOW,
} from "./nmiStageProjectionContract.ts";
import { getNmiStageProjectionIdentity, nmiStageProjectionIdentity } from "./nmiStageProjectionIdentity.ts";

export function verifyNmiStageProjection(): {
  readonly ok: true;
  readonly identity: typeof nmiStageProjectionIdentity;
} {
  verifyNmiFoundation();
  verifyNmiManagementNavigation();
  verifyNmiAuthorityBoundary();
  if (getNmiStageProjectionIdentity().id !== nmiStageProjectionIdentity) {
    throw new Error("NMI:6 identity mismatch");
  }
  if (NMI_FOUNDATION_CONTRACT.startsNmi2) {
    throw new Error("NMI:1 must remain UnifiedManagementModel only");
  }
  if (NMI_MANAGEMENT_NAVIGATION_CONTRACT.startsNmi6) {
    throw new Error("NMI:5 must not start NMI:6");
  }
  if (NMI_STAGE_PROJECTION_CONTRACT.startsNmi7) {
    throw new Error("NMI:6 must not start NMI:7");
  }
  if (NMI_STAGE_PROJECTION_CONTRACT.startsDthExp) {
    throw new Error("NMI:6 must not start DTH-EXP");
  }
  if (NMI_STAGE_PROJECTION_CONTRACT.createsNmiStage || NMI_STAGE_PROJECTION_CONTRACT.secondStage) {
    throw new Error("NMI:6 must not create an NMI Stage");
  }
  if (NMI_STAGE_PROJECTION_CONTRACT.secondDirector) {
    throw new Error("NMI:6 must not create a second Director");
  }
  if (NMI_STAGE_PROJECTION_CONTRACT.secondFocusRegistry) {
    throw new Error("NMI:6 must not create a second focus registry");
  }
  if (NMI_STAGE_PROJECTION_CONTRACT.presentationAuthority !== DirectorFoundationId) {
    throw new Error("NMI:6 must hand context to DIRECTOR-1:1");
  }
  if (NMI_STAGE_PROJECTION_CONTRACT.nmiWroteStage) {
    throw new Error("NMI must not write Stage");
  }
  if (NMI_AUTHORITY_BOUNDARY.parallelStage) {
    throw new Error("NMI must not own a parallel Stage");
  }
  if (NMI_GATE_BOUNDARY.nmiGate) {
    throw new Error("NMI must not create a Gate");
  }
  if (NMI_RMS_BOUNDARY.nmiIsSimulationEngine) {
    throw new Error("NMI must not become RMS");
  }
  if (NMI_STAGE_PROJECTION_GATE_FLOW[NMI_STAGE_PROJECTION_GATE_FLOW.length - 1] !== "EXISTING_DIRECTOR_STAGE_WRITER") {
    throw new Error("NMI:6 must terminate at the existing Director/Stage writer");
  }
  return Object.freeze({ ok: true as const, identity: nmiStageProjectionIdentity });
}
