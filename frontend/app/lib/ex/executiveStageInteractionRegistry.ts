/**
 * EX-1:2 — Executive Stage Interaction Registry.
 *
 * Supported interaction identities. Handling is deferred to Platform.
 *
 * Ownership: owned exclusively by EX-1:2.
 */

import { registerExecutiveStageEntries } from "./executiveStageRegistryMetadata.ts";

/** Interaction Registry — interaction identities. */
export const ExecutiveStageInteractionRegistry = registerExecutiveStageEntries(
  "Interaction",
  Object.freeze([
    {
      name: "Click",
      description: "Click interaction identity.",
    },
    {
      name: "Double Click",
      description: "Double click interaction identity.",
    },
    {
      name: "Hover",
      description: "Hover interaction identity.",
    },
    {
      name: "Context Menu",
      description: "Context menu interaction identity.",
    },
    {
      name: "Keyboard Focus",
      description: "Keyboard focus interaction identity.",
    },
    {
      name: "Selection",
      description: "Selection interaction identity.",
    },
  ]),
);
