/**
 * EX-1:2 — Executive Stage Object Registry.
 *
 * Visual object categories. Concrete business objects are deferred.
 *
 * Ownership: owned exclusively by EX-1:2.
 */

import { registerExecutiveStageEntries } from "./executiveStageRegistryMetadata.ts";

/** Object Registry — visual object category identities. */
export const ExecutiveStageObjectRegistry = registerExecutiveStageEntries(
  "Object",
  Object.freeze([
    {
      name: "Executive Object",
      description: "Executive object visual category.",
    },
    {
      name: "Business Object",
      description: "Business object visual category.",
    },
    {
      name: "Knowledge Object",
      description: "Knowledge object visual category.",
    },
    {
      name: "Relationship Object",
      description: "Relationship object visual category.",
    },
    {
      name: "Placeholder Object",
      description: "Placeholder object visual category.",
    },
  ]),
);
