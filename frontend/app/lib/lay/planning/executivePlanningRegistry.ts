import type { ExecutivePlanningCapabilityId } from "./executivePlanningTypes.ts";

export type ExecutivePlanningCapabilityDefinition = Readonly<{
  id: ExecutivePlanningCapabilityId;
  name: string;
  description: string;
  runtime: "deterministic";
}>;

export const EXECUTIVE_PLANNING_CAPABILITY_REGISTRY: readonly ExecutivePlanningCapabilityDefinition[] = Object.freeze([
  Object.freeze({ id: "goalPlanning", name: "Goal Planning", description: "Decomposes accepted judgment into traceable executive goals.", runtime: "deterministic" }),
  Object.freeze({ id: "milestonePlanning", name: "Milestone Planning", description: "Builds deterministic milestones without calendar scheduling.", runtime: "deterministic" }),
  Object.freeze({ id: "dependencyPlanning", name: "Dependency Planning", description: "Builds logical dependency graphs without execution.", runtime: "deterministic" }),
  Object.freeze({ id: "phasePlanning", name: "Phase Planning", description: "Groups milestones into logical execution phases.", runtime: "deterministic" }),
  Object.freeze({ id: "resourcePlanning", name: "Resource Planning", description: "Defines logical resource structures without real user allocation.", runtime: "deterministic" }),
  Object.freeze({ id: "timelinePlanning", name: "Timeline Planning", description: "Builds logical sequence only with no real dates or durations.", runtime: "deterministic" }),
  Object.freeze({ id: "explanationGeneration", name: "Explanation Generation", description: "Explains plan traceability to judgment.", runtime: "deterministic" }),
]);

export function listExecutivePlanningCapabilities(): readonly ExecutivePlanningCapabilityDefinition[] {
  return EXECUTIVE_PLANNING_CAPABILITY_REGISTRY;
}
