/**
 * RTC-1:2 — Executive Object Registry.
 *
 * Registers executable business object categories.
 * Specific business entities are introduced by higher layers.
 *
 * Ownership: owned exclusively by RTC-1:2.
 */

import { registerExecutiveRuntimeEntries } from "./executiveRuntimeRegistryMetadata.ts";

/** Object Registry — business object category identities. */
export const ExecutiveObjectRegistry = registerExecutiveRuntimeEntries(
  "Object",
  Object.freeze([
    {
      name: "Business Object",
      description: "Business object category identity.",
    },
    {
      name: "Executive Object",
      description: "Executive object category identity.",
    },
    {
      name: "Knowledge Object",
      description: "Knowledge object category identity.",
    },
    {
      name: "Relationship Object",
      description: "Relationship object category identity.",
    },
    {
      name: "Data Object",
      description: "Data object category identity.",
    },
  ]),
);
