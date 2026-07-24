/** WS-4:8 — Single canonical immutable architecture lock. */
import { DecisionWorkspaceCertification } from "./decisionWorkspaceCertification.ts";

export const DecisionWorkspaceFreezeLock = Object.freeze({
  id: "WS-4-DECISION-WORKSPACE-LOCKED",
  name: "Decision Workspace Architecture Lock",
  guarantees: Object.freeze([
    "Certified metadata is immutable",
    "Canonical identities cannot change",
    "Public API inventory cannot change",
    "Platform composition cannot change",
    "Compatibility declarations cannot change",
    "Extension declarations cannot change",
    "Freeze metadata is read-only",
  ]),
  source: DecisionWorkspaceCertification,
  status: "Locked",
  mutationAllowed: false,
  metadataOnly: true,
  immutable: true,
} as const);
