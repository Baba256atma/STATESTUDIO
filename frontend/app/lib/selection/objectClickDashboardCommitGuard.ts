import { traceNexoraLoopGuard } from "../runtime/nexoraLoopGuardDiagnostics.ts";
import { isObjectClickSceneWriteSource } from "./objectClickSelectionReadOnlyGuard.ts";

export type ObjectClickDashboardCommitGuardResult = Readonly<{
  allowed: boolean;
  reason: "selection_only_event" | "allowed";
}>;

export function isObjectClickDashboardCommitSource(input: {
  source: string | null | undefined;
  intent?: string | null;
  reason?: string | null;
}): boolean {
  const source = String(input.source ?? "").trim();
  const intent = String(input.intent ?? "").trim();
  const reason = String(input.reason ?? "").trim();
  if (isObjectClickSceneWriteSource(source)) return true;
  if (source === "object" && intent === "object_selected") return true;
  if (reason.startsWith("object_click:")) return true;
  if (reason === "object_selected" && source === "object") return true;
  return false;
}

export function evaluateObjectClickDashboardCommitGuard(input: {
  source: string | null | undefined;
  intent?: string | null;
  reason?: string | null;
}): ObjectClickDashboardCommitGuardResult {
  if (isObjectClickDashboardCommitSource(input)) {
    return { allowed: false, reason: "selection_only_event" };
  }
  return { allowed: true, reason: "allowed" };
}

export function traceObjectClickDashboardCommitBlocked(input: {
  source: string | null | undefined;
  intent?: string | null;
  reason?: string | null;
  selectedObjectId?: string | null;
  workspaceId?: string | null;
  surfaceId?: string | null;
}): void {
  const objectId =
    typeof input.selectedObjectId === "string" ? input.selectedObjectId.trim() : null;
  traceNexoraLoopGuard({
    source: "object_click",
    action: "selection_resolved",
    reason: "readonly_selection",
    stateSignature: JSON.stringify({
      writeSource: input.source ?? null,
      intent: input.intent ?? null,
      routeReason: input.reason ?? null,
      objectId,
    }),
    objectId,
    surfaceId: input.surfaceId ?? null,
    workspaceId: input.workspaceId ?? null,
  });
}
