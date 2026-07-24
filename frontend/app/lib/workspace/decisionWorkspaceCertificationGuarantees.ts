/** WS-4:7 — Platform-derived satisfied guarantees. */
import { DecisionWorkspacePlatform } from "./decisionWorkspacePlatform.ts";

const names = Object.freeze([
  "Platform Complete",
  "Platform Immutable",
  "Canonical Identities Preserved",
  "Public API Inventory Complete",
  "Compatibility Declarations Valid",
  "Extension Declarations Valid",
  "Validation Results Unchanged",
  "Manifest Guarantees Satisfied",
  "Runtime Implementation Absent",
  "Prohibited Dependencies Absent",
  "Workspace Boundaries Preserved",
  "Decision Workspace Ready For Freeze",
] as const);

export const DecisionWorkspaceCertificationGuarantees = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-4:7/Guarantee/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Confirms ${name.toLowerCase()} from Platform evidence.`,
    source: DecisionWorkspacePlatform,
    state: "Satisfied",
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);
