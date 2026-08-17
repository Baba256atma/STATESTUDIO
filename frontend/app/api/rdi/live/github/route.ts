import { NextResponse } from "next/server";

import {
  createGithubRepositoryConnector,
  createNexoraLiveConnection,
  prepareNexoraLiveObservation,
  transitionNexoraLiveConnection,
} from "@/app/lib/data-reality/liveDataConnectorFoundation";

export const runtime = "nodejs";

type RequestBody = Readonly<{
  action?: "test" | "observe";
  workspaceId?: string;
  connectionId?: string;
  displayName?: string;
  owner?: string;
  repository?: string;
  observationId?: string;
  observedAt?: string;
}>;

function safeText(value: unknown, maximum = 120): string {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: RequestBody;
  try { body = await request.json() as RequestBody; } catch { return NextResponse.json({ ok: false, message: "A valid request is required." }, { status: 400 }); }
  const workspaceId = safeText(body.workspaceId); const connectionId = safeText(body.connectionId);
  const owner = safeText(body.owner, 80); const repository = safeText(body.repository, 100);
  if (!workspaceId || !connectionId || !owner || !repository || (body.action !== "test" && body.action !== "observe")) return NextResponse.json({ ok: false, message: "Workspace, connection, repository, and action are required." }, { status: 400 });
  const now = safeText(body.observedAt) || new Date().toISOString();
  const connector = createGithubRepositoryConnector(fetch, process.env.GITHUB_TOKEN);
  const base = createNexoraLiveConnection({ connectionId, workspaceId, providerId: "github", providerType: "source-control", displayName: safeText(body.displayName) || `${owner}/${repository}`, capabilities: connector.capabilities(), createdAt: now, configurationReference: `github:${owner}/${repository}`, credentialReference: process.env.GITHUB_TOKEN ? "env:GITHUB_TOKEN" : null });
  const configuration = Object.freeze({ owner, repository });
  if (body.action === "test") {
    const result = await connector.testConnection(base, configuration);
    return NextResponse.json({ ok: result.ok, state: result.state, message: result.message, credentialMode: process.env.GITHUB_TOKEN ? "server-managed" : "public-access" }, { status: result.ok ? 200 : 502 });
  }
  const connection = transitionNexoraLiveConnection(base, "connected", now);
  const observationId = safeText(body.observationId) || `OBS-${Date.now().toString(36)}`;
  const prepared = await prepareNexoraLiveObservation({ connector, connection, configuration, observationId, observedAt: now });
  return NextResponse.json({ ok: prepared.ready, prepared, connection: prepared.ready ? transitionNexoraLiveConnection(connection, "connected", now, now) : transitionNexoraLiveConnection(connection, "degraded", now), message: prepared.ready ? "Live observation is ready for review." : prepared.errors[0] ?? "Refresh failed." }, { status: prepared.ready ? 200 : 502 });
}
