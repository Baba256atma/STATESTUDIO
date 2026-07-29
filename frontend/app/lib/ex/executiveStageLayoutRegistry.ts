/**
 * EX-1:2 — Executive Stage Layout Registry.
 *
 * Stage layout region identities. Sizing is not defined here.
 *
 * Ownership: owned exclusively by EX-1:2.
 */

import { registerExecutiveStageEntries } from "./executiveStageRegistryMetadata.ts";

/** Layout Registry — layout region identities. */
export const ExecutiveStageLayoutRegistry = registerExecutiveStageEntries(
  "Layout",
  Object.freeze([
    {
      name: "Stage Surface",
      description: "Stage surface layout region.",
    },
    {
      name: "Viewport",
      description: "Viewport layout region.",
    },
    {
      name: "Safe Area",
      description: "Safe area layout region.",
    },
    {
      name: "Interaction Zone",
      description: "Interaction zone layout region.",
    },
    {
      name: "Reserved Zones",
      description: "Reserved layout zones.",
    },
  ]),
);
