/**
 * HOSTED-MVP:1 — canonical server principal seam.
 * Routes and pages call this. They do not parse session cookies themselves.
 */

import { getServerSession } from "next-auth";

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
