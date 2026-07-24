/** WS-5:8 — Frozen descriptive extension declarations. */
import { ScenarioWorkspaceCertification } from "./scenarioWorkspaceCertification.ts";

export const ScenarioWorkspaceFreezeExtensions = Object.freeze(
  ScenarioWorkspaceCertification.platform.extensions.map(
    (source, index) => Object.freeze({
      id: `WS-5:8/Extension/${String(index + 1).padStart(2, "0")}`,
      name: source.name,
      description:
        "Supports future approved consumers without modifying frozen architecture.",
      source,
      state: "Extensible",
      runtimeMechanism: false,
      order: index + 1,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
