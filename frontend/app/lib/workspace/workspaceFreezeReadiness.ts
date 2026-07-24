/** WS-1:8 — Public Index readiness derived from Certification. */
import { WorkspaceCertification } from "./workspaceCertification.ts";
import { WorkspaceFreezeLocks } from "./workspaceFreezeLocks.ts";
export const WorkspaceFreezeReadiness = Object.freeze({
  certificationState: WorkspaceCertification.certificationStatus,
  freezeState: "Frozen", status: "ReadyForPublicIndex",
  everyLockActive: WorkspaceFreezeLocks.every(({ lockStatus }) => lockStatus === "Locked"),
  publicIndexReady: true, source: WorkspaceCertification, immutable: true,
} as const);

