/**
 * EX-1:2 — Executive Stage Layer Registry.
 *
 * Canonical visual layers with fixed ordering.
 *
 * Ownership: owned exclusively by EX-1:2.
 */

import { registerExecutiveStageEntries } from "./executiveStageRegistryMetadata.ts";

/**
 * Layer Registry — fixed canonical order.
 * Background → Relationship → Object → Focus → Interaction → Overlay
 */
export const ExecutiveStageLayerRegistry = registerExecutiveStageEntries(
  "Layer",
  Object.freeze([
    {
      name: "Background Layer",
      description: "Background visual layer identity.",
    },
    {
      name: "Relationship Layer",
      description: "Relationship visual layer identity.",
    },
    {
      name: "Object Layer",
      description: "Object visual layer identity.",
    },
    {
      name: "Focus Layer",
      description: "Focus visual layer identity.",
    },
    {
      name: "Interaction Layer",
      description: "Interaction visual layer identity.",
    },
    {
      name: "Overlay Layer",
      description: "Overlay visual layer identity.",
    },
  ]),
);

/** Canonical layer ordering is fixed by the Registry. */
export const ExecutiveStageCanonicalLayerOrder = Object.freeze(
  ExecutiveStageLayerRegistry.map((entry) => entry.name),
);
