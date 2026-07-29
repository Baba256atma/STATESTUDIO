/**
 * RTC-1:2 — Executive Pack Registry.
 *
 * Defines recognised Pack categories as registry identities.
 * These are not lifecycle states — lifecycle is defined later by the Model.
 *
 * Ownership: owned exclusively by RTC-1:2.
 */

import { registerExecutiveRuntimeEntries } from "./executiveRuntimeRegistryMetadata.ts";

/** Pack Registry — recognised pack category identities. */
export const ExecutivePackRegistry = registerExecutiveRuntimeEntries(
  "Pack",
  Object.freeze([
    {
      name: "Conversation",
      description: "Conversation pack category identity.",
    },
    {
      name: "Goal",
      description: "Goal pack category identity.",
    },
    {
      name: "Problem",
      description: "Problem pack category identity.",
    },
    {
      name: "Understanding",
      description: "Understanding pack category identity.",
    },
    {
      name: "Scenario",
      description: "Scenario pack category identity.",
    },
    {
      name: "Decision",
      description: "Decision pack category identity.",
    },
    {
      name: "Monitoring",
      description: "Monitoring pack category identity.",
    },
    {
      name: "Knowledge",
      description: "Knowledge pack category identity.",
    },
    {
      name: "Archived",
      description: "Archived pack category identity.",
    },
  ]),
);
