import { NextResponse } from "next/server";

import { hostedWorkspaceDatabase } from "@/app/lib/workspace-auth/hostedWorkspaceStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Public liveness. Database detail is only ready or unavailable. */
export async function GET(): Promise<NextResponse> {
  try {
    const db = await hostedWorkspaceDatabase();
    await db.query("SELECT 1");
    return NextResponse.json({ ok: true, database: "ready" });
  } catch {
    return NextResponse.json({ ok: false, database: "unavailable" }, { status: 503 });
  }
}
