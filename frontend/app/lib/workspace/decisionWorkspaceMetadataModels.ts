/** WS-4:3 — Canonical immutable Decision metadata descriptors. */
import type { DecisionWorkspaceModelDescriptor } from "./decisionWorkspaceIdentityModel.ts";
import { DecisionWorkspaceRegistry } from "./decisionWorkspaceRegistry.ts";

const names = Object.freeze([
  "Identity",
  "Name",
  "Description",
  "Decision Type",
  "Status",
  "Owner",
  "Priority",
  "Confidence",
  "Version",
  "Tags",
  "Creation Metadata",
  "Modification Metadata",
] as const);

export const DecisionWorkspaceMetadataModels = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-4:3/MetadataModel/${String(index + 1).padStart(2, "0")}`,
    name: `${name} Descriptor`,
    description: `Defines the canonical ${name.toLowerCase()} descriptor.`,
    source: DecisionWorkspaceRegistry,
    metadataOnly: true,
    immutable: true,
  })) satisfies readonly DecisionWorkspaceModelDescriptor[],
);
