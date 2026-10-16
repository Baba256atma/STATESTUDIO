/**
 * HOSTED-MVP:3B — authenticated workspace operations.
 * Request identity fields are not ownership.
 */

import { NextResponse } from "next/server";

import { authorizeHostedDataRequest, ownershipShaped } from "./hostedManagerDataHttp.ts";
import {
  HostedOperationalError,
  readHostedOperationalSnapshot,
  replaceHostedDecisionExecution,
  replaceHostedSavedScenes,
} from "./hostedOperationalPersistence.ts";

function failure(error: HostedOperationalError): NextResponse {
  const status = error.code === "data_store_unavailable" ? 503 : error.code === "workspace_not_found" ? 404 : 400;
  return NextResponse.json({ error: error.code }, { status });
}

export async function getHostedOperations(workspaceId: string): Promise<NextResponse> {
  const refused = await authorizeHostedDataRequest(workspaceId);
  if (refused) return refused;
  try {
    return NextResponse.json(await readHostedOperationalSnapshot(workspaceId));
  } catch (error) {
    if (error instanceof HostedOperationalError) return failure(error);
    return NextResponse.json({ error: "data_store_unavailable" }, { status: 503 });
  }
}

export async function putHostedOperations(workspaceId: string, body: unknown): Promise<NextResponse> {
  const refused = await authorizeHostedDataRequest(workspaceId);
  if (refused) return refused;
  if (ownershipShaped(body)) return NextResponse.json({ error: "invalid_record" }, { status: 400 });
  const record = body && typeof body === "object" ? body as {
    decisions?: unknown;
    executions?: unknown;
    scenes?: unknown;
  } : null;
  if (!record) return NextResponse.json({ error: "invalid_record" }, { status: 400 });
  try {
    if (Array.isArray(record.decisions) || Array.isArray(record.executions)) {
      await replaceHostedDecisionExecution(workspaceId, {
        ...(Array.isArray(record.decisions) ? { decisions: record.decisions } : {}),
        ...(Array.isArray(record.executions) ? { executions: record.executions } : {}),
      });
    }
    if (Array.isArray(record.scenes)) await replaceHostedSavedScenes(workspaceId, record.scenes);
    return NextResponse.json(await readHostedOperationalSnapshot(workspaceId));
  } catch (error) {
    if (error instanceof HostedOperationalError) return failure(error);
    return NextResponse.json({ error: "data_store_unavailable" }, { status: 503 });
  }
}
