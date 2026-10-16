import { deleteHostedAccountDataResponse } from "@/app/lib/workspace-auth/hostedLifecycleHttp.ts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(): Promise<Response> {
  return deleteHostedAccountDataResponse();
}
