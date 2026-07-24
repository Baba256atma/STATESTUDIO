/** WS-7:2 — Foundation-derived immutable capability registry. */
import { DecisionWorkspaceV7Foundation } from "./decisionWorkspaceV7Foundation.ts";

export const DecisionWorkspaceV7CapabilityRegistry = Object.freeze(
  DecisionWorkspaceV7Foundation.capabilities.map((source, index) =>
    Object.freeze({
      id: `WS-7:2/Capability/${String(index + 1).padStart(2, "0")}`,
      key: `capability-${String(index + 1).padStart(2, "0")}`,
      name: source.name,
      group: "Workspace Capability",
      source,
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
