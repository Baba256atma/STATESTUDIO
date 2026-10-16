import { deleteSource } from "@/app/lib/workspace-auth/hostedManagerDataHttp.ts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ workspaceId: string; sourceId: string }> },
) {
  const { workspaceId, sourceId } = await context.params;
  return deleteSource(workspaceId, sourceId);
}
