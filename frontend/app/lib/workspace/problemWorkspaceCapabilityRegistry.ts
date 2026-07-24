/** WS-6:2 — Canonical capability registrations with Foundation traceability. */
import { ProblemWorkspaceFoundation } from "./problemWorkspaceFoundation.ts";

const canonicalNames = Object.freeze([
  "Define Problem",
  "Structure Problem",
  "Classify Problem",
  "Register Evidence",
  "Register Constraints",
  "Register Assumptions",
  "Declare Context",
  "Prepare Root Cause",
  "Prepare Impact",
  "Prepare Decision Inputs",
  "Prepare Scenario Inputs",
] as const);

export const ProblemWorkspaceCapabilityRegistry = Object.freeze(
  canonicalNames.map((name, index) => Object.freeze({
    id: `WS-6:2/Capability/${String(index + 1).padStart(2, "0")}`,
    key: `capability-${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Registers ${name.toLowerCase()} as a non-executable capability.`,
    registryCategory: "Capability",
    source:
      ProblemWorkspaceFoundation.capabilities[index]
      ?? ProblemWorkspaceFoundation,
    sourcePhase: "WS-6:1",
    version: "1.0.0",
    ownership: "Problem Workspace",
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
