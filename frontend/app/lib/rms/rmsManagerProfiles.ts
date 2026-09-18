/**
 * NPA-T RMS:4 — deterministic Manager Profiles. Profiles change language, not knowledge.
 */

import type { RmsManagerProfile } from "./rmsManagerContract.ts";

export const RMS_STANDARD_MANAGER: RmsManagerProfile = Object.freeze({
  profileId: "STANDARD_MANAGER",
  experienceLevel: "standard",
  patience: "balanced",
  dataOrientation: "balanced",
  questioningDepth: "balanced",
  riskSensitivity: "balanced",
  communicationBrevity: "balanced",
  groundTruthAccess: false,
});

export const RMS_IMPATIENT_MANAGER: RmsManagerProfile = Object.freeze({
  profileId: "IMPATIENT_MANAGER",
  experienceLevel: "standard",
  patience: "low",
  dataOrientation: "balanced",
  questioningDepth: "shallow",
  riskSensitivity: "balanced",
  communicationBrevity: "short",
  groundTruthAccess: false,
});

export const RMS_DATA_DRIVEN_MANAGER: RmsManagerProfile = Object.freeze({
  profileId: "DATA_DRIVEN_MANAGER",
  experienceLevel: "seasoned",
  patience: "balanced",
  dataOrientation: "high",
  questioningDepth: "deep",
  riskSensitivity: "high",
  communicationBrevity: "balanced",
  groundTruthAccess: false,
});

export const RMS_MANAGER_PROFILES = Object.freeze({
  STANDARD_MANAGER: RMS_STANDARD_MANAGER,
  IMPATIENT_MANAGER: RMS_IMPATIENT_MANAGER,
  DATA_DRIVEN_MANAGER: RMS_DATA_DRIVEN_MANAGER,
});
