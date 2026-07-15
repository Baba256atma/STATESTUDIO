import { ExecutivePlanningCertificationGates } from "./executivePlanningCertificationGates.ts";
import { ExecutivePlanningCertificationPlatform } from "./executivePlanningCertificationPlatform.ts";

export const isExecutivePlanningCertified = () =>
  ExecutivePlanningCertificationPlatform.metadata.status === "Certified";

export const isExecutivePlanningReadyForFreeze = () =>
  ExecutivePlanningCertificationPlatform.metadata.readiness === "ReadyForFreeze";

export const getExecutivePlanningCertificationStatus = () =>
  ExecutivePlanningCertificationPlatform.metadata.status;

export const getExecutivePlanningCertificationGateCount = () =>
  ExecutivePlanningCertificationGates.length as 15;
