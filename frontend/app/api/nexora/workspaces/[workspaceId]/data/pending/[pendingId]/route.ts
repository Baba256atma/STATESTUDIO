import { deletePending, getPending } from "@/app/lib/workspace-auth/hostedManagerDataHttp.ts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ workspaceId: string; pendingId: string }> },
) {
  const { workspaceId, pendingId } = await context.params;
  return getPending(workspaceId, pendingId);
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ workspaceId: string; pendingId: string }> },
) {
  const { workspaceId, pendingId } = await context.params;
  return deletePending(workspaceId, pendingId);
}
