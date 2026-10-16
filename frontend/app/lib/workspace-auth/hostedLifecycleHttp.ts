/**
 * HOSTED-MVP:4 — authenticated deletion responses.
 * Missing and unauthorized workspaces share one response.
 */

import { NextResponse } from "next/server";

import { readAuthenticatedNexoraPrincipal } from "../auth/nexoraPrincipalServer.ts";
import { hostedWorkspaceFailure } from "./hostedWorkspaceHttp.ts";
import { deleteOwnedHostedAccountData, deleteOwnedHostedWorkspace } from "./hostedLifecycle.ts";

export async function deleteHostedWorkspaceResponse(workspaceId: string): Promise<NextResponse> {
  const principal = await readAuthenticatedNexoraPrincipal();
  const deleted = await deleteOwnedHostedWorkspace({ principal, workspaceId });
  if (!deleted.ok) return hostedWorkspaceFailure(deleted.outcome);
  return NextResponse.json({ deleted: true, workspaceId });
}

export async function deleteHostedAccountDataResponse(): Promise<NextResponse> {
  const principal = await readAuthenticatedNexoraPrincipal();
  const deleted = await deleteOwnedHostedAccountData(principal);
  if (!deleted.ok) return hostedWorkspaceFailure(deleted.outcome);
  return NextResponse.json({
    deleted: true,
    deletedWorkspaces: deleted.deletedWorkspaces,
    identityProviderDeleted: false,
  });
}
