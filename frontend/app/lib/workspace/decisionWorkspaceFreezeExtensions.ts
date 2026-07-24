/** WS-4:8 — Frozen descriptive extension declarations. */
import { DecisionWorkspaceCertification } from "./decisionWorkspaceCertification.ts";

export const DecisionWorkspaceFreezeExtensions = Object.freeze(
  DecisionWorkspaceCertification.platform.extensions.map(
    (source, index) => Object.freeze({
      id: `WS-4:8/Extension/${String(index + 1).padStart(2, "0")}`,
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
