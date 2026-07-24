/** WS-3:3 — Canonical immutable metadata descriptors. */
import type { GoalWorkspaceModelDescriptor } from "./goalWorkspaceIdentityModel.ts";
import { GoalWorkspaceRegistry } from "./goalWorkspaceRegistry.ts";
const names = Object.freeze(["Identity", "Name", "Description", "Category", "Owner", "Priority",
  "Status", "Lifecycle", "Version", "Tags", "Creation Metadata",
  "Modification Metadata"] as const);
export const GoalWorkspaceMetadataModels = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-3:3/MetadataModel/${String(index + 1).padStart(2, "0")}`,
  name: `${name} Descriptor`, description: `Defines the canonical ${name.toLowerCase()} descriptor.`,
  source: GoalWorkspaceRegistry, metadataOnly: true, immutable: true,
})) satisfies readonly GoalWorkspaceModelDescriptor[]);

