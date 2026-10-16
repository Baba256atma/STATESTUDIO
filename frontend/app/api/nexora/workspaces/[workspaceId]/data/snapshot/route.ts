import { getSnapshot } from "@/app/lib/workspace-auth/hostedManagerDataHttp.ts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ workspaceId: string }> },
) {
  const { workspaceId } = await context.params;
  return getSnapshot(workspaceId);
}
