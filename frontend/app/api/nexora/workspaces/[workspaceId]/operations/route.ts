import { getHostedOperations, putHostedOperations } from "@/app/lib/workspace-auth/hostedOperationalHttp.ts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ workspaceId: string }> },
) {
  const { workspaceId } = await context.params;
  return getHostedOperations(workspaceId);
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ workspaceId: string }> },
) {
  const { workspaceId } = await context.params;
  const body = await request.json().catch(() => null);
  return putHostedOperations(workspaceId, body);
}
