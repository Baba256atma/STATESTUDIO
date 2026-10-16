import { NextResponse } from "next/server";

import { readAuthenticatedNexoraPrincipal } from "@/app/lib/auth/nexoraPrincipalServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Safe session projection. No tokens, cookies, or provider secrets. */
export async function GET(): Promise<NextResponse> {
  const principal = await readAuthenticatedNexoraPrincipal();
  if (!principal) return NextResponse.json({ authenticated: false });
  return NextResponse.json({ authenticated: true, userId: principal.userId });
}
