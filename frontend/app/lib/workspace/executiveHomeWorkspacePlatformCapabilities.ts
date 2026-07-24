/** WS-2:6 — Metadata discovery capabilities. */
import { ExecutiveHomeWorkspaceManifest } from "./executiveHomeWorkspaceManifest.ts";
const names = Object.freeze(["Executive Home Architecture Discovery",
  "Executive Home Category Discovery", "Executive Home Contract Discovery",
  "Executive Home Capability Discovery", "Executive Home Responsibility Discovery",
  "Executive Home Lifecycle Discovery", "Executive Home Boundary Discovery",
  "Executive Home Model Discovery", "Executive Home Relationship Discovery",
  "Executive Home Validation Discovery", "Executive Home Guarantee Discovery",
  "Executive Home Compatibility Discovery", "Executive Home Extension Discovery",
  "Executive Home Inventory Discovery", "Certification Readiness Inspection"] as const);
export const ExecutiveHomeWorkspacePlatformCapabilities = Object.freeze(names.map((name, index) => Object.freeze({
  id: `WS-2:6/Capability/${String(index + 1).padStart(2, "0")}`, name,
  description: `${name} provides immutable architectural metadata access only.`,
  source: ExecutiveHomeWorkspaceManifest, status: "Guaranteed",
  metadataOnly: true, immutable: true,
})));

