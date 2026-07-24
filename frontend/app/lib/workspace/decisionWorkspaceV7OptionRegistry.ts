/** WS-7:2 — Immutable Decision option type registry. */
import { DecisionWorkspaceV7Foundation } from "./decisionWorkspaceV7Foundation.ts";

const names = Object.freeze([
  "Preferred Option",
  "Alternative Option",
  "Conservative Option",
  "Aggressive Option",
  "Short-Term Option",
  "Long-Term Option",
  "Emergency Option",
] as const);

export const DecisionWorkspaceV7OptionRegistry = Object.freeze(
  names.map((name, index) =>
    Object.freeze({
      id: `WS-7:2/Option/${String(index + 1).padStart(2, "0")}`,
      key: `option-${String(index + 1).padStart(2, "0")}`,
      name,
      group: "Decision Option Type",
      source: DecisionWorkspaceV7Foundation,
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
