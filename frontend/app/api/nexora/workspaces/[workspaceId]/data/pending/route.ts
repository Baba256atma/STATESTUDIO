import { postPending } from "@/app/lib/workspace-auth/hostedManagerDataHttp.ts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  context: { params: Promise<{ workspaceId: string }> },
) {
  const { workspaceId } = await context.params;
  const body = await request.json().catch(() => null);
  return postPending(workspaceId, body);
}
