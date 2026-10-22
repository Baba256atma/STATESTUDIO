/**
 * HOSTED-MVP:1 — canonical server principal seam.
 * Routes and pages call this. They do not parse session cookies themselves.
 */

import { getServerSession } from "next-auth";

import { selectNexoraAuthProvider, type NexoraAuthProviderId } from "./nexoraAuthProviders.ts";
import { readNexoraDeploymentMode, type NexoraDeploymentMode } from "./nexoraDeploymentMode.ts";
import { resolveExecutiveAccess, type NexoraExecutiveAccess } from "./nexoraExecutiveAccess.ts";
import { nexoraAuthOptions } from "./nexoraAuthOptions.ts";
import {
  projectNexoraClientSession,
  projectNexoraPrincipal,
  type NexoraClientSessionProjection,
  type NexoraPrincipal,
} from "./nexoraPrincipal.ts";

export async function readAuthenticatedNexoraPrincipal(): Promise<NexoraPrincipal | null> {
  try {
    const session = await getServerSession(nexoraAuthOptions);
    return projectNexoraPrincipal(session);
  } catch {
    return null;
  }
}

export async function readNexoraClientSession(): Promise<NexoraClientSessionProjection> {
  return projectNexoraClientSession(await readAuthenticatedNexoraPrincipal());
}

/** One server decision for every Executive route. */
export async function readNexoraExecutiveGate(): Promise<{
  readonly deploymentMode: NexoraDeploymentMode;
  readonly authProvider: NexoraAuthProviderId;
  readonly access: NexoraExecutiveAccess;
  readonly session: NexoraClientSessionProjection;
}> {
  const deploymentMode = readNexoraDeploymentMode();
  const authProvider = selectNexoraAuthProvider(process.env, process.env.NODE_ENV);
  const principal = deploymentMode === "hosted" || authProvider !== "none"
    ? await readAuthenticatedNexoraPrincipal()
    : null;
  return {
    deploymentMode,
    authProvider,
    access: resolveExecutiveAccess({
      deploymentMode,
      provider: authProvider,
      principal,
    }),
    session: projectNexoraClientSession(principal),
  };
}
