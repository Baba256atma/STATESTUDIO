/** WS-5:6 — Controlled future extension declarations. */
import { ScenarioWorkspaceManifest } from "./scenarioWorkspaceManifest.ts";

const names = Object.freeze([
  "Scenario Type Extensions",
  "Scenario Metadata Extensions",
  "Capability Extensions",
  "Contract Extensions",
  "Model Extensions",
  "Relationship Extensions",
  "Composition Extensions",
  "Compatibility Extensions",
  "Public API Extensions",
  "Future Phase Extensions",
] as const);

export const ScenarioWorkspacePlatformExtensions = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-5:6/Extension/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `${name} may extend functionality without modifying canonical Platform metadata.`,
    compatibilityImpact: "Additive Only",
    extensionScope: "Future controlled phase or version",
    source: ScenarioWorkspaceManifest,
    state: "Extensible",
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);
