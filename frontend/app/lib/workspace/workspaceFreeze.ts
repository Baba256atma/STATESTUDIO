/** WS-1:8 — Canonical frozen release baseline for Public Index. */
import { WorkspaceCertification } from "./workspaceCertification.ts";
import { WorkspaceFreezeBaselines } from "./workspaceFreezeBaselines.ts";
import { WorkspaceFreezeCompatibility } from "./workspaceFreezeCompatibility.ts";
import { WorkspaceFreezeExtensions, WorkspaceFreezeMutationPolicy } from "./workspaceFreezeExtensions.ts";
import { WorkspaceCanonicalLockId, WorkspaceFreezeLocks } from "./workspaceFreezeLocks.ts";
import { WorkspaceFreezeReadiness } from "./workspaceFreezeReadiness.ts";
const phaseNames = Object.freeze(["Foundation", "Registry", "Model", "Validation", "Manifest",
  "Platform", "Certification", "Freeze"] as const);
const PublicApiRegistry = Object.freeze(phaseNames.map((name, index) => Object.freeze({
  id: `WS-1:${index + 1}/PublicAPI`, exportName: `Workspace${name}`,
  namespaceSection: name, sourcePhase: `WS-1:${index + 1}`,
  version: "1.0.0", stability: "Stable", consumerVisibility: "Freeze-Reachable",
})));
export const WorkspaceFreeze = Object.freeze({
  identity: Object.freeze({ id: "WS-1:8/WorkspaceFreeze", name: "Workspace Freeze",
    layer: "Workspace", phase: "1:8", version: "1.0.0", status: "ReadyForPublicIndex",
    namespace: "nexora.workspace.freeze", freezeState: "Frozen" }),
  certification: WorkspaceCertification, canonicalLockId: WorkspaceCanonicalLockId,
  locks: WorkspaceFreezeLocks, baselines: WorkspaceFreezeBaselines,
  compatibility: WorkspaceFreezeCompatibility, extensions: WorkspaceFreezeExtensions,
  mutationPolicy: WorkspaceFreezeMutationPolicy, inventory: WorkspaceCertification.inventory,
  readiness: WorkspaceFreezeReadiness, publicApiRegistry: PublicApiRegistry,
  upstreamDependencies: Object.freeze(["WS-1:7 Workspace Certification"]),
  publicApiSurface: Object.freeze(["WorkspaceFreeze"]),
  metadataOnly: true, immutable: true, runtime: false, ui: false, rendering: false,
  persistence: false, stateManagement: false, orchestration: false,
} as const);

