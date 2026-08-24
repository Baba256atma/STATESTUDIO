/**
 * MVP:1 — frozen manager-facing Nexora MVP release baseline identity.
 *
 * Product version remains the canonical manager-visible shell version.
 * This module does not add product capability.
 */

import { nexoraExecutiveShellVersion } from "./nexoraExecutiveShell.ts";

export const nexoraManagerMvpReleaseBaselineIdentity =
  "MVP:1/NexoraManagerMVPReleaseBaseline" as const;

export const nexoraManagerMvpReleaseBaselineVersion =
  nexoraExecutiveShellVersion;

export const nexoraManagerMvpReleaseBaselineNamespace =
  "nexora.mvp.manager-release-baseline" as const;

export const nexoraManagerMvpReleaseBaselinePhase =
  "ManagerMvpReleaseBaselineFreeze" as const;

export const nexoraManagerMvpReleaseBaselineArchitecturalRole =
  "NexoraManagerMvpReleaseBaseline" as const;

export const nexoraManagerMvpReleaseBaselineCanonicalRoute =
  "/executive" as const;

export type NexoraManagerMvpReleaseBaselineIdentity = {
  readonly id: typeof nexoraManagerMvpReleaseBaselineIdentity;
  readonly version: typeof nexoraManagerMvpReleaseBaselineVersion;
  readonly namespace: typeof nexoraManagerMvpReleaseBaselineNamespace;
  readonly phase: typeof nexoraManagerMvpReleaseBaselinePhase;
  readonly architecturalRole: typeof nexoraManagerMvpReleaseBaselineArchitecturalRole;
  readonly canonicalRoute: typeof nexoraManagerMvpReleaseBaselineCanonicalRoute;
};

const IDENTITY: NexoraManagerMvpReleaseBaselineIdentity = Object.freeze({
  id: nexoraManagerMvpReleaseBaselineIdentity,
  version: nexoraManagerMvpReleaseBaselineVersion,
  namespace: nexoraManagerMvpReleaseBaselineNamespace,
  phase: nexoraManagerMvpReleaseBaselinePhase,
  architecturalRole: nexoraManagerMvpReleaseBaselineArchitecturalRole,
  canonicalRoute: nexoraManagerMvpReleaseBaselineCanonicalRoute,
});

export function getNexoraManagerMvpReleaseBaselineIdentity(): NexoraManagerMvpReleaseBaselineIdentity {
  return IDENTITY;
}
