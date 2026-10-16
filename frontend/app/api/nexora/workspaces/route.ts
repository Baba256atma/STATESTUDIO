import { NextResponse } from "next/server";

import { readAuthenticatedNexoraPrincipal } from "@/app/lib/auth/nexoraPrincipalServer";
import { logWorkspaceAuthorization } from "@/app/lib/workspace-auth/authorizeNexoraWorkspace";
import {
  createHostedWorkspace,
  hostedWorkspaceCreationRejected,
  listOwnedHostedWorkspaces,
} from "@/app/lib/workspace-auth/hostedWorkspaceCommands";
import { hostedWorkspaceFailure } from "@/app/lib/workspace-auth/hostedWorkspaceHttp";
import { projectHostedWorkspace } from "@/app/lib/workspace-auth/hostedWorkspaceRecord";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const principal = await readAuthenticatedNexoraPrincipal();
  const listed = await listOwnedHostedWorkspaces(principal);
  logWorkspaceAuthorization({
    route: "workspaces.list",
    outcome: listed.ok ? "AUTHORIZED" : listed.outcome,
    userId: principal?.userId ?? null,
    workspaceId: null,
  });
  if (!listed.ok) return hostedWorkspaceFailure(listed.outcome);
  return NextResponse.json({ workspaces: listed.value.map(projectHostedWorkspace) });
}

export async function POST(request: Request): Promise<NextResponse> {
  const principal = await readAuthenticatedNexoraPrincipal();
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return hostedWorkspaceFailure("INVALID");
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return hostedWorkspaceFailure("INVALID");
  if (hostedWorkspaceCreationRejected(body)) return hostedWorkspaceFailure("INVALID");
  const record = body as { name?: unknown; kind?: unknown };
  const created = await createHostedWorkspace({
    principal,
    name: record.name,
    kind: record.kind,
  });
  logWorkspaceAuthorization({
    route: "workspaces.create",
    outcome: created.ok ? "AUTHORIZED" : created.outcome,
    userId: principal?.userId ?? null,
    workspaceId: created.ok ? created.value.workspaceId : null,
  });
  if (!created.ok) return hostedWorkspaceFailure(created.outcome);
  return NextResponse.json({ workspace: projectHostedWorkspace(created.value) }, { status: 201 });
}
