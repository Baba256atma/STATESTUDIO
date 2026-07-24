/** WS-7:7 — Exactly 18 immutable Certification criteria. */
import { DecisionWorkspaceV7Platform } from "./decisionWorkspaceV7Platform.ts";

const names = Object.freeze([
  "Foundation Complete",
  "Registry Complete",
  "Model Complete",
  "Validation Complete",
  "Manifest Complete",
  "Platform Complete",
  "Canonical Identity Verified",
  "Namespace Verified",
  "Version Verified",
  "Dependency Integrity Verified",
  "Metadata Completeness Verified",
  "Capability Publication Verified",
  "Responsibility Publication Verified",
  "Boundary Compliance Verified",
  "Export Stability Verified",
  "Immutable Architecture Verified",
  "Workspace Integrity Verified",
  "ReadyForFreeze",
] as const);

export const DecisionWorkspaceV7CertificationCriteria = Object.freeze(
  names.map((name, index) =>
    Object.freeze({
      id: `WS-7:7/Criterion/${String(index + 1).padStart(2, "0")}`,
      name,
      expectedState: "Satisfied",
      declaredState: "Satisfied",
      evidence: DecisionWorkspaceV7Platform,
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
