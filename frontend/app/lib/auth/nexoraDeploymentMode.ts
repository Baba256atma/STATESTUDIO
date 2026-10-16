/**
 * HOSTED-MVP:1 — one deployment-mode authority.
 *
 * Unset and "local" keep the certified local Manager Workspace path.
 * Only the exact value "hosted" enables the authentication gate.
 * This is not a secret and is not read from NEXT_PUBLIC_*.
 */

export const NEXORA_DEPLOYMENT_MODE_ENV = "NEXORA_DEPLOYMENT_MODE" as const;

export type NexoraDeploymentMode = "local" | "hosted";

export function readNexoraDeploymentMode(
  env: Readonly<Record<string, string | undefined>> = process.env,
): NexoraDeploymentMode {
  return env[NEXORA_DEPLOYMENT_MODE_ENV] === "hosted" ? "hosted" : "local";
}

/** Hosted mode must not load the browser registry as account ownership. */
export function hostedManagerRegistryRecovery(
  deploymentMode: NexoraDeploymentMode,
): "recover" | "contain" {
  return deploymentMode === "hosted" ? "contain" : "recover";
}
