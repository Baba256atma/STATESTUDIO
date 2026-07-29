/**
 * EX-1:2 — Executive Stage Overlay Registry.
 *
 * Overlay identities. Business overlays are excluded.
 *
 * Ownership: owned exclusively by EX-1:2.
 */

import { registerExecutiveStageEntries } from "./executiveStageRegistryMetadata.ts";

/** Overlay Registry — non-business overlay identities. */
export const ExecutiveStageOverlayRegistry = registerExecutiveStageEntries(
  "Overlay",
  Object.freeze([
    {
      name: "Loading",
      description: "Loading overlay identity.",
    },
    {
      name: "Empty",
      description: "Empty stage overlay identity.",
    },
    {
      name: "Runtime Error",
      description: "Runtime error overlay identity.",
    },
    {
      name: "Diagnostic",
      description: "Diagnostic overlay identity.",
    },
    {
      name: "Development",
      description: "Development overlay identity.",
    },
  ]),
);
