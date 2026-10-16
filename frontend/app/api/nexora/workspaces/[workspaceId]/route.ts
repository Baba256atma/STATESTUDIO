import { NextResponse } from "next/server";

import { readAuthenticatedNexoraPrincipal } from "@/app/lib/auth/nexoraPrincipalServer";
import { logWorkspaceAuthorization } from "@/app/lib/workspace-auth/authorizeNexoraWorkspace";
import { readAuthorizedHostedWorkspace } from "@/app/lib/workspace-auth/hostedWorkspaceCommands";
import { deleteHostedWorkspaceResponse } from "@/app/lib/workspace-auth/hostedLifecycleHttp";
import { hostedWorkspaceFailure } from "@/app/lib/workspace-auth/hostedWorkspaceHttp";
import { projectHostedWorkspace } from "@/app/lib/workspace-auth/hostedWorkspaceRecord";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ workspaceId: string }> },
): Promise<NextResponse> {
  const principal = await readAuthenticatedNexoraPrincipal();
  const { workspaceId } = await context.params;
  const read = await readAuthorizedHostedWorkspace({ principal, workspaceId });
  logWorkspaceAuthorization({
    route: "workspaces.read",
    outcome: read.ok ? "AUTHORIZED" : read.outcome,
    userId: principal?.userId ?? null,
    workspaceId,
  });
  if (!read.ok) return hostedWorkspaceFailure(read.outcome);
  return NextResponse.json({ workspace: projectHostedWorkspace(read.value) });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ workspaceId: string }> },
): Promise<NextResponse> {
  const principal = await readAuthenticatedNexoraPrincipal();
  const { workspaceId } = await context.params;
  const response = await deleteHostedWorkspaceResponse(workspaceId);
  logWorkspaceAuthorization({
    route: "workspaces.delete",
    outcome: response.status === 200 ? "AUTHORIZED" : response.status === 401 ? "NOT_AUTHENTICATED" : response.status === 503 ? "UNAVAILABLE" : "WORKSPACE_NOT_FOUND",
    userId: principal?.userId ?? null,
    workspaceId,
  });
  return response;
}
