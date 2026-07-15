import { ExecutivePlanningFreezeMetadata } from "./executivePlanningFreezeMetadata.ts";
import { ExecutivePlanningFreezePlatform, getExecutivePlanningFreezeSummary } from "./executivePlanningFreezePlatform.ts";
import {
  ExecutivePlanningFreezeRegistry,
  getExecutivePlanningFreezeRegistry as getFreezeRegistry,
} from "./executivePlanningFreezeRegistry.ts";

export const getExecutivePlanningFreezePlatform = () => ExecutivePlanningFreezePlatform;
export const getExecutivePlanningFreezeMetadata = () => ExecutivePlanningFreezeMetadata;
export { getExecutivePlanningFreezeSummary };
export const getExecutivePlanningFreezeRegistry = () => getFreezeRegistry();

export const isExecutivePlanningFrozen = () =>
  ExecutivePlanningFreezeMetadata.freezeStatus === "Frozen"
  && ExecutivePlanningFreezeRegistry.every(({ freezeStatus }) => freezeStatus === "Frozen");

export const isExecutivePlanningReadyForPublicIndex = () =>
  ExecutivePlanningFreezeMetadata.readiness === "ReadyForPublicIndex";
