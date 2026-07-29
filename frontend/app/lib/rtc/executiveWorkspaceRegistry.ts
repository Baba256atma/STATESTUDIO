/**
 * RTC-1:2 — Executive Workspace Registry.
 *
 * Registers every Workspace recognised by Runtime.
 * Future Workspaces extend this Registry without modifying previous identities.
 *
 * Ownership: owned exclusively by RTC-1:2.
 */

import { registerExecutiveRuntimeEntries } from "./executiveRuntimeRegistryMetadata.ts";

/** Workspace Registry — initial recognised workspaces. */
export const ExecutiveWorkspaceRegistry = registerExecutiveRuntimeEntries(
  "Workspace",
  Object.freeze([
    {
      name: "Global",
      description: "Global workspace recognised by Runtime.",
    },
    {
      name: "Goal",
      description: "Goal workspace recognised by Runtime.",
    },
    {
      name: "Problem",
      description: "Problem workspace recognised by Runtime.",
    },
    {
      name: "Scenario",
      description: "Scenario workspace recognised by Runtime.",
    },
    {
      name: "Decision",
      description: "Decision workspace recognised by Runtime.",
    },
    {
      name: "Monitoring",
      description: "Monitoring workspace recognised by Runtime.",
    },
    {
      name: "War Room",
      description: "War Room workspace recognised by Runtime.",
    },
  ]),
);
