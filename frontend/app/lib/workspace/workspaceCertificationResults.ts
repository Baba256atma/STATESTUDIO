/** WS-1:7 — Immutable certification results and summary. */
import { WorkspaceCertificationCriteria } from "./workspaceCertificationCriteria.ts";
import { WorkspaceCertificationEvidence } from "./workspaceCertificationEvidence.ts";
import { WorkspaceCertificationGates } from "./workspaceCertificationGates.ts";
export const WorkspaceCertificationResults = Object.freeze({
  criteria: WorkspaceCertificationCriteria, gates: WorkspaceCertificationGates,
  certificationStatus: "Certified", failureReasons: Object.freeze([]), warnings: Object.freeze([]),
  evidenceReference: WorkspaceCertificationEvidence, readinessOutcome: "ReadyForFreeze",
  freezeRecommendation: "ReadyForFreeze",
  criterionCount: WorkspaceCertificationCriteria.length,
  gateCount: WorkspaceCertificationGates.length,
  allMandatoryCriteriaPass: WorkspaceCertificationCriteria.every(({ result }) => result === "Pass"),
  allMandatoryGatesPass: WorkspaceCertificationGates.every(({ result }) => result === "Pass"),
  immutable: true,
} as const);

