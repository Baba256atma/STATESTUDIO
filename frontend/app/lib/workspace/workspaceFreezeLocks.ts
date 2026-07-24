/** WS-1:8 — Canonical architectural locks. */
import { WorkspaceCertification } from "./workspaceCertification.ts";
import type { WorkspaceFreezeLock } from "./workspaceFreezeTypes.ts";
export const WorkspaceCanonicalLockId = "WS-1-WORKSPACE-FOUNDATION-LOCKED" as const;
const names = Object.freeze(["Identity", "Namespace", "Version", "Foundation", "Registry", "Model",
  "Validation", "Manifest", "Platform", "Certification", "Workspace Type", "Contract",
  "Capability", "Responsibility", "Lifecycle", "Boundary", "Relationship", "Inventory",
  "Compatibility", "Extension Policy", "Dependency", "Immutability", "Runtime Absence",
  "UI Absence", "Rendering Absence", "Orchestration Absence", "Public Index Readiness"] as const);
export const WorkspaceFreezeLocks = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-1:8/Lock/${String(index + 1).padStart(2, "0")}`, name: `${name} Lock`,
  description: `Locks the certified ${name.toLowerCase()} baseline.`,
  lockedTarget: name, sourceEvidence: WorkspaceCertification.evidence,
  lockStatus: "Locked", version: "1.0.0", mutationPolicy: "Immutable",
})) satisfies readonly WorkspaceFreezeLock[]);

