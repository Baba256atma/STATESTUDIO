import { ExecutiveEngineCertificationRegistry } from "./engineCertificationRegistry.ts";
import type { ExecutiveEngineCertificationSummaryDescriptor } from "./engineCertificationTypes.ts";

const passedGates = ExecutiveEngineCertificationRegistry.filter((entry) => entry.certificationStatus === "PASS").length;
const failedGates = ExecutiveEngineCertificationRegistry.length - passedGates;
const statusFor = (category: "Ownership" | "Dependency" | "AntiDuplication" | "PublicApi") => ExecutiveEngineCertificationRegistry.find((entry) => entry.certificationCategory === category)?.certificationStatus ?? "FAIL";

export const ExecutiveEngineCertificationSummary = Object.freeze({
  artifactId: "ENG-CERT-SUMMARY-001",
  certificationStatus: failedGates === 0 ? "Certified" : "Incomplete",
  totalCertificationGates: 15, passedGates, failedGates,
  compliancePercentage: (passedGates / ExecutiveEngineCertificationRegistry.length) * 100,
  ownershipCompliance: statusFor("Ownership"), dependencyCompliance: statusFor("Dependency"),
  antiDuplicationCompliance: statusFor("AntiDuplication"), publicApiCompliance: statusFor("PublicApi"),
  releaseReadiness: failedGates === 0 ? "ReadyForFreeze" : "Blocked",
  nextPhase: "ENG-1:8 — Executive Engine Freeze",
  metadataOnly: true, immutable: true, deterministic: true,
} as const satisfies ExecutiveEngineCertificationSummaryDescriptor);

export const getExecutiveEngineCertificationSummary = () => ExecutiveEngineCertificationSummary;
