import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import {
  backgroundMonitoringRuntimeIdentity,
  BACKGROUND_MONITORING_RUNTIME_CLASSIFICATION,
} from "@/app/lib/data-reality/backgroundMonitoringRuntime";
import { durableMonitoringRuntimeIdentity, type NexoraDurableMonitoringSnapshot } from "@/app/lib/data-reality/durableMonitoringRuntime";
import {
  getNexoraBackgroundMonitoringRepository,
  getNexoraBackgroundMonitoringScheduler,
  importNexoraBackgroundMonitoringSnapshot,
  runNexoraBackgroundManualObservation,
} from "@/app/lib/data-reality/backgroundMonitoringServer";

export const runtime = "nodejs";

function authorized(request: Request): boolean {
  const expected = process.env.NEXORA_SCHEDULER_SECRET;
  const actual = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!expected || !actual || actual.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}

export async function GET(request: Request): Promise<NextResponse> {
  const state = await getNexoraBackgroundMonitoringRepository().read();
  const workspaceId = new URL(request.url).searchParams.get("workspaceId");
  const ownsWorkspace = Boolean(state && (!workspaceId || state.monitoring.policies.some((policy) => policy.workspaceId === workspaceId && policy.executionOwner === "background")));
  return NextResponse.json({ ok: true, identity: backgroundMonitoringRuntimeIdentity, classification: BACKGROUND_MONITORING_RUNTIME_CLASSIFICATION, state: ownsWorkspace ? state : null });
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: Readonly<{ action?: "sync" | "run-due" | "manual"; snapshot?: NexoraDurableMonitoringSnapshot; now?: string; workspaceId?: string; connectionId?: string }>;
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false, message: "A valid request is required." }, { status: 400 }); }
  const now = typeof body.now === "string" && Number.isFinite(Date.parse(body.now)) ? body.now : new Date().toISOString();
  if (body.action === "run-due") {
    if (!authorized(request)) return NextResponse.json({ ok: false, message: "Scheduler authorization is required." }, { status: 401 });
    const report = await getNexoraBackgroundMonitoringScheduler().runDuePolicies(now, `pm6:protected:${now}`);
    return NextResponse.json({ ok: true, report });
  }
  if (body.action === "sync" && body.snapshot?.identity === durableMonitoringRuntimeIdentity) {
    if (!body.snapshot.policies.some((policy) => policy.executionOwner === "background")) return NextResponse.json({ ok: false, message: "Explicit background ownership is required." }, { status: 400 });
    const state = await importNexoraBackgroundMonitoringSnapshot(body.snapshot, now);
    return NextResponse.json({ ok: true, revision: state.revision, writtenAt: state.writtenAt });
  }
  if (body.action === "manual" && typeof body.workspaceId === "string" && typeof body.connectionId === "string") {
    const result = await runNexoraBackgroundManualObservation({ workspaceId: body.workspaceId.slice(0, 120), connectionId: body.connectionId.slice(0, 180), observedAt: now });
    return NextResponse.json({ ok: result?.completed === true, result }, { status: result?.completed ? 200 : result?.reason === "already-observing" ? 409 : 400 });
  }
  return NextResponse.json({ ok: false, message: "A supported action is required." }, { status: 400 });
}
