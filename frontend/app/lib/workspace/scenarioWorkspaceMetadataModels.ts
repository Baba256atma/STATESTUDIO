/** WS-5:3 — Canonical immutable Scenario metadata descriptors. */
import type { ScenarioWorkspaceModelDescriptor } from "./scenarioWorkspaceIdentityModel.ts";
import { ScenarioWorkspaceRegistry } from "./scenarioWorkspaceRegistry.ts";

const names = Object.freeze([
  "Identity",
  "Name",
  "Description",
  "Scenario Type",
  "Status",
  "Owner",
  "Priority",
  "Confidence",
  "Version",
  "Tags",
  "Creation Metadata",
  "Modification Metadata",
] as const);

export const ScenarioWorkspaceMetadataModels = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-5:3/MetadataModel/${String(index + 1).padStart(2, "0")}`,
    name: `${name} Descriptor`,
    description: `Defines the canonical ${name.toLowerCase()} descriptor.`,
    source: ScenarioWorkspaceRegistry,
    metadataOnly: true,
    immutable: true,
  })) satisfies readonly ScenarioWorkspaceModelDescriptor[],
);
