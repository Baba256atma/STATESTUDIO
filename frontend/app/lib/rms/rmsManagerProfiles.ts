/**
 * NPA-T RMS:4 — deterministic Manager Profiles. Profiles change language, not knowledge.
 */

import type { RmsManagerProfile, RmsManagerProfileId } from "./rmsManagerContract.ts";

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

function behaviorProfile(
  profileId: RmsManagerProfileId,
  patch: Partial<Omit<RmsManagerProfile, "profileId" | "groundTruthAccess">>,
): RmsManagerProfile {
  return Object.freeze({
    profileId,
    experienceLevel: "standard",
    patience: "balanced",
    dataOrientation: "balanced",
    questioningDepth: "balanced",
    riskSensitivity: "balanced",
    communicationBrevity: "balanced",
    groundTruthAccess: false,
    ...patch,
  });
}

export const RMS_STRUCTURED_MANAGER = behaviorProfile("STRUCTURED_MANAGER", {
  experienceLevel: "seasoned",
  patience: "high",
});

export const RMS_AMBIGUOUS_MANAGER = behaviorProfile("AMBIGUOUS_MANAGER", {
  experienceLevel: "junior",
  questioningDepth: "shallow",
  communicationBrevity: "short",
});

export const RMS_DISTRACTED_MANAGER = behaviorProfile("DISTRACTED_MANAGER", {
  patience: "low",
});

export const RMS_INVESTIGATIVE_MANAGER = behaviorProfile("INVESTIGATIVE_MANAGER", {
  experienceLevel: "seasoned",
  dataOrientation: "high",
  questioningDepth: "deep",
  riskSensitivity: "high",
});

export const RMS_DECISION_ORIENTED_MANAGER = behaviorProfile("DECISION_ORIENTED_MANAGER", {
  patience: "low",
});

export const RMS_SKEPTICAL_MANAGER = behaviorProfile("SKEPTICAL_MANAGER", {
  dataOrientation: "high",
  questioningDepth: "deep",
  riskSensitivity: "high",
});

export const RMS_NONLINEAR_MANAGER = behaviorProfile("NONLINEAR_MANAGER", {});

export const RMS_EXECUTIVE_MANAGER = behaviorProfile("EXECUTIVE_MANAGER", {
  experienceLevel: "seasoned",
  patience: "high",
});

export const RMS_DATA_CHALLENGING_MANAGER = behaviorProfile("DATA_CHALLENGING_MANAGER", {
  dataOrientation: "high",
  questioningDepth: "deep",
});

export const RMS_SIM_TEST_7_BEHAVIOR_PROFILE_IDS = Object.freeze([
  "STRUCTURED_MANAGER",
  "IMPATIENT_MANAGER",
  "AMBIGUOUS_MANAGER",
  "DISTRACTED_MANAGER",
  "INVESTIGATIVE_MANAGER",
  "DECISION_ORIENTED_MANAGER",
  "SKEPTICAL_MANAGER",
  "NONLINEAR_MANAGER",
  "EXECUTIVE_MANAGER",
  "DATA_CHALLENGING_MANAGER",
] as const satisfies readonly RmsManagerProfileId[]);

export const RMS_MANAGER_PROFILES: Readonly<Record<RmsManagerProfileId, RmsManagerProfile>> = Object.freeze({
  STANDARD_MANAGER: RMS_STANDARD_MANAGER,
  IMPATIENT_MANAGER: RMS_IMPATIENT_MANAGER,
  DATA_DRIVEN_MANAGER: RMS_DATA_DRIVEN_MANAGER,
  STRUCTURED_MANAGER: RMS_STRUCTURED_MANAGER,
  AMBIGUOUS_MANAGER: RMS_AMBIGUOUS_MANAGER,
  DISTRACTED_MANAGER: RMS_DISTRACTED_MANAGER,
  INVESTIGATIVE_MANAGER: RMS_INVESTIGATIVE_MANAGER,
  DECISION_ORIENTED_MANAGER: RMS_DECISION_ORIENTED_MANAGER,
  SKEPTICAL_MANAGER: RMS_SKEPTICAL_MANAGER,
  NONLINEAR_MANAGER: RMS_NONLINEAR_MANAGER,
  EXECUTIVE_MANAGER: RMS_EXECUTIVE_MANAGER,
  DATA_CHALLENGING_MANAGER: RMS_DATA_CHALLENGING_MANAGER,
});
