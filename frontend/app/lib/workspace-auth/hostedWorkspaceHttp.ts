/**
 * HOSTED-MVP:2 — public workspace responses.
 *
 * Cross-user and missing workspaces share one non-disclosing response.
 */

import { NextResponse } from "next/server";

import type { WorkspaceAuthorization } from "./authorizeNexoraWorkspace.ts";

export function hostedWorkspaceFailure(outcome: Exclude<WorkspaceAuthorization["outcome"], "AUTHORIZED"> | "INVALID"): NextResponse {
  if (outcome === "NOT_AUTHENTICATED") {
    return NextResponse.json({ error: "authentication_required" }, { status: 401 });
  }
  if (outcome === "UNAVAILABLE") {
    return NextResponse.json({ error: "workspace_unavailable" }, { status: 503 });
  }
  if (outcome === "INVALID") {
    return NextResponse.json({ error: "invalid_workspace" }, { status: 400 });
  }
  return NextResponse.json({ error: "workspace_not_found" }, { status: 404 });
}
