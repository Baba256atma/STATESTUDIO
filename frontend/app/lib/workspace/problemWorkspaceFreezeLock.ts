/** WS-6:8 — Canonical immutable Problem Workspace architecture lock. */
import { ProblemWorkspaceCertification } from "./problemWorkspaceCertification.ts";

export const ProblemWorkspaceFreezeLock = Object.freeze({
  id: "WS-6-PROBLEM-WORKSPACE-LOCKED",
  name: "Problem Workspace Architecture Lock",
  source: ProblemWorkspaceCertification,
  status: "Locked",
  frozen: true,
  mutationAllowed: false,
  metadataOnly: true,
  immutable: true,
} as const);
