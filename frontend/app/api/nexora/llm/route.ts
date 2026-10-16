import { NextResponse } from "next/server";

import { readAuthenticatedNexoraPrincipal } from "@/app/lib/auth/nexoraPrincipalServer";
import { hostedLlmRequestPayload, readHostedLlmEvidence } from "@/app/lib/workspace-auth/hostedLlmContext";
import { dispatchAuthorizedHostedLlm } from "@/app/lib/workspace-auth/hostedLlmDispatch";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Browser calls stop here. The provider is reached only after workspace authorization. */
export async function POST(request: Request): Promise<NextResponse> {
  const principal = await readAuthenticatedNexoraPrincipal();
  let body: {
    workspaceId?: unknown;
    turnId?: unknown;
    deterministicResponse?: unknown;
    experienceStatus?: unknown;
    managementContext?: { workspaceId?: unknown; conversation?: { currentUtterance?: unknown } };
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ status: "skipped", contribution: null, policy: { reason: "workspace_not_found" } }, { status: 400 });
  }
  const utterance = body.managementContext?.conversation?.currentUtterance;
  const dispatched = await dispatchAuthorizedHostedLlm({
    principal,
    workspaceId: body.workspaceId,
    contextWorkspaceId: body.managementContext?.workspaceId,
    payload: body,
    preparePayload: async (workspaceId) => hostedLlmRequestPayload({
      workspaceId,
      turnId: body.turnId,
      deterministicResponse: body.deterministicResponse,
      experienceStatus: body.experienceStatus,
      utterance,
      evidence: await readHostedLlmEvidence(workspaceId),
    }),
  });
  return NextResponse.json(dispatched.body, { status: dispatched.status });
}
