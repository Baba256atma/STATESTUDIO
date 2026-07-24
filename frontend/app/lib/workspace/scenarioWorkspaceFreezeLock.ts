/** WS-5:8 — Single canonical immutable architecture lock. */
import { ScenarioWorkspaceCertification } from "./scenarioWorkspaceCertification.ts";

export const ScenarioWorkspaceFreezeLock = Object.freeze({
  id: "WS-5-SCENARIO-WORKSPACE-LOCKED",
  name: "Scenario Workspace Architecture Lock",
  guarantees: Object.freeze([
    "Certified metadata is immutable",
    "Canonical identities cannot change",
    "Public API inventory cannot change",
    "Platform composition cannot change",
    "Compatibility declarations cannot change",
    "Extension declarations cannot change",
    "Freeze metadata is read-only",
  ]),
  source: ScenarioWorkspaceCertification,
  status: "Locked",
  mutationAllowed: false,
  metadataOnly: true,
  immutable: true,
} as const);
