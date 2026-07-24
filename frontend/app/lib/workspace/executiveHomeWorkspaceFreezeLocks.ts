/** WS-2:8 — Canonical architectural locks. */
import { ExecutiveHomeWorkspaceCertification } from "./executiveHomeWorkspaceCertification.ts";
import type { ExecutiveHomeWorkspaceFreezeLock } from "./executiveHomeWorkspaceFreezeTypes.ts";
export const ExecutiveHomeWorkspaceCanonicalLockId =
  "WS-2-EXECUTIVE-HOME-WORKSPACE-LOCKED" as const;
const names = Object.freeze(["Identity", "Namespace", "Version", "Foundation", "Registry", "Model",
  "Validation", "Manifest", "Platform", "Certification", "Executive Home Category", "Contract",
  "Capability", "Responsibility", "Lifecycle", "Boundary", "Relationship", "Inventory",
  "Compatibility", "Extension Policy", "Dependency", "Immutability", "Runtime Absence",
  "UI Absence", "Rendering Absence", "Orchestration Absence",
  "Public Index Readiness"] as const);
export const ExecutiveHomeWorkspaceFreezeLocks = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-2:8/Lock/${String(index + 1).padStart(2, "0")}`, name: `${name} Lock`,
  description: `Locks the certified ${name.toLowerCase()} baseline.`,
  lockedTarget: name,
  certificationEvidenceReference: ExecutiveHomeWorkspaceCertification.evidence,
  lockStatus: "Locked", version: "1.0.0", mutationPolicy: "Immutable",
})) satisfies readonly ExecutiveHomeWorkspaceFreezeLock[]);

