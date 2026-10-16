import { postAccept } from "@/app/lib/workspace-auth/hostedManagerDataHttp.ts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  context: { params: Promise<{ workspaceId: string; pendingId: string }> },
) {
  const { workspaceId, pendingId } = await context.params;
  const body = await request.json().catch(() => ({}));
  return postAccept(workspaceId, pendingId, body);
}
