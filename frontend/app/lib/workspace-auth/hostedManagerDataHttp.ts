/**
 * HOSTED-MVP:3A — authenticated, workspace-scoped manager data HTTP.
 * Ownership comes from the session. Request identity fields are ignored.
 */

import { NextResponse } from "next/server";

import { readAuthenticatedNexoraPrincipal } from "../auth/nexoraPrincipalServer.ts";
import { authorizeNexoraWorkspace } from "./authorizeNexoraWorkspace.ts";
import { hostedWorkspaceFailure } from "./hostedWorkspaceHttp.ts";
import { isCustomerHostedWorkspaceId } from "./hostedWorkspaceId.ts";
import {
  HostedManagerDataError,
  acceptHostedPendingCsv,
  createHostedPendingCsv,
  discardHostedPendingCsv,
  readHostedManagerDataSnapshot,
  readHostedPendingCsv,
  removeHostedDataSource,
} from "./hostedManagerData.ts";

const OWNERSHIP_FIELDS = ["ownerUserId", "userId", "accountId"] as const;

function dataError(error: HostedManagerDataError): NextResponse {
  const status = error.code === "data_store_unavailable" ? 503 : error.code === "pending_not_found" || error.code === "source_not_found" ? 404 : 400;
  return NextResponse.json({ error: error.code }, { status });
}

export async function authorizeHostedDataRequest(workspaceId: string): Promise<NextResponse | null> {
  if (!isCustomerHostedWorkspaceId(workspaceId)) {
    return NextResponse.json({ error: "workspace_not_found" }, { status: 404 });
  }
  const principal = await readAuthenticatedNexoraPrincipal();
  if (!principal) return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  const decision = await authorizeNexoraWorkspace({ principal, workspaceId });
  if (decision.outcome !== "AUTHORIZED") return hostedWorkspaceFailure(decision.outcome);
  return null;
}

export function ownershipShaped(body: unknown): boolean {
  if (!body || typeof body !== "object") return false;
  return OWNERSHIP_FIELDS.some((field) => field in body);
}

export async function postPending(workspaceId: string, body: unknown): Promise<NextResponse> {
  const refused = await authorizeHostedDataRequest(workspaceId);
  if (refused) return refused;
  if (ownershipShaped(body)) return NextResponse.json({ error: "invalid_csv" }, { status: 400 });
  const record = body as { fileName?: unknown; csvText?: unknown };
  try {
    const pending = await createHostedPendingCsv({
      workspaceId,
      fileName: record.fileName,
      csvText: record.csvText,
    });
    return NextResponse.json({
      pendingId: pending.pendingId,
      workspaceId: pending.workspaceId,
      fileName: pending.fileName,
      createdAt: pending.createdAt,
      expiresAt: pending.expiresAt,
      prepared: pending.prepared,
    });
  } catch (error) {
    if (error instanceof HostedManagerDataError) return dataError(error);
    return NextResponse.json({ error: "data_store_unavailable" }, { status: 503 });
  }
}

export async function getPending(workspaceId: string, pendingId: string): Promise<NextResponse> {
  const refused = await authorizeHostedDataRequest(workspaceId);
  if (refused) return refused;
  try {
    const pending = await readHostedPendingCsv(workspaceId, pendingId);
    return NextResponse.json({
      pendingId: pending.pendingId,
      workspaceId: pending.workspaceId,
      fileName: pending.fileName,
      expiresAt: pending.expiresAt,
      prepared: pending.prepared,
    });
  } catch (error) {
    if (error instanceof HostedManagerDataError) return dataError(error);
    return NextResponse.json({ error: "data_store_unavailable" }, { status: 503 });
  }
}

export async function deletePending(workspaceId: string, pendingId: string): Promise<NextResponse> {
  const refused = await authorizeHostedDataRequest(workspaceId);
  if (refused) return refused;
  try {
    await discardHostedPendingCsv(workspaceId, pendingId);
    return NextResponse.json({ discarded: true });
  } catch (error) {
    if (error instanceof HostedManagerDataError) return dataError(error);
    return NextResponse.json({ error: "data_store_unavailable" }, { status: 503 });
  }
}

export async function postAccept(workspaceId: string, pendingId: string, body: unknown): Promise<NextResponse> {
  const refused = await authorizeHostedDataRequest(workspaceId);
  if (refused) return refused;
  if (ownershipShaped(body)) return NextResponse.json({ error: "invalid_csv" }, { status: 400 });
  const mapping = body && typeof body === "object" && "mapping" in body ? (body as { mapping?: unknown }).mapping : undefined;
  try {
    const snapshot = await acceptHostedPendingCsv({ workspaceId, pendingId, mapping });
    return NextResponse.json(snapshot);
  } catch (error) {
    if (error instanceof HostedManagerDataError) return dataError(error);
    return NextResponse.json({ error: "data_store_unavailable" }, { status: 503 });
  }
}

export async function getSnapshot(workspaceId: string): Promise<NextResponse> {
  const refused = await authorizeHostedDataRequest(workspaceId);
  if (refused) return refused;
  try {
    return NextResponse.json(await readHostedManagerDataSnapshot(workspaceId));
  } catch (error) {
    if (error instanceof HostedManagerDataError) return dataError(error);
    return NextResponse.json({ error: "data_store_unavailable" }, { status: 503 });
  }
}

export async function deleteSource(workspaceId: string, sourceId: string): Promise<NextResponse> {
  const refused = await authorizeHostedDataRequest(workspaceId);
  if (refused) return refused;
  try {
    await removeHostedDataSource(workspaceId, sourceId);
    return NextResponse.json(await readHostedManagerDataSnapshot(workspaceId));
  } catch (error) {
    if (error instanceof HostedManagerDataError) return dataError(error);
    return NextResponse.json({ error: "data_store_unavailable" }, { status: 503 });
  }
}
