/**
 * RTC-1:2 — Executive Context Registry.
 *
 * Registers runtime context identities. Only identities are registered.
 * Definitions only — no runtime values.
 *
 * Ownership: owned exclusively by RTC-1:2.
 */

import { registerExecutiveRuntimeEntries } from "./executiveRuntimeRegistryMetadata.ts";

/** Context Registry — runtime context identities. */
export const ExecutiveContextRegistry = registerExecutiveRuntimeEntries(
  "Context",
  Object.freeze([
    {
      name: "ExecutiveContext",
      description: "Primary Executive Context runtime identity.",
    },
    {
      name: "GlobalContext",
      description: "Global executive runtime context identity.",
    },
    {
      name: "ObjectContext",
      description: "Object-scoped executive runtime context identity.",
    },
    {
      name: "PackContext",
      description: "Pack-scoped executive runtime context identity.",
    },
    {
      name: "WorkspaceContext",
      description: "Workspace-scoped executive runtime context identity.",
    },
  ]),
);
