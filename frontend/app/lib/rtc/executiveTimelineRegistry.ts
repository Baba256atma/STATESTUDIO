/**
 * RTC-1:2 — Executive Timeline Registry.
 *
 * Registers supported runtime timeline modes.
 * No playback implementation exists.
 *
 * Ownership: owned exclusively by RTC-1:2.
 */

import { registerExecutiveRuntimeEntries } from "./executiveRuntimeRegistryMetadata.ts";

/** Timeline Registry — supported timeline mode identities. */
export const ExecutiveTimelineRegistry = registerExecutiveRuntimeEntries(
  "Timeline",
  Object.freeze([
    {
      name: "Global Timeline",
      description: "Global timeline mode identity.",
    },
    {
      name: "Pack Timeline",
      description: "Pack timeline mode identity.",
    },
    {
      name: "Object Timeline",
      description: "Object timeline mode identity.",
    },
    {
      name: "Snapshot Timeline",
      description: "Snapshot timeline mode identity.",
    },
  ]),
);
