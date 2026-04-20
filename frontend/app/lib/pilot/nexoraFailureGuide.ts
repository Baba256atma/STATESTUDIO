/**
 * B.27 — Human-readable failure lines for operators (NexoraError + pipeline HUD).
 */

import { NexoraError, toNexoraError } from "../system/nexoraErrors";

export function explainNexoraFailure(error: NexoraError): string {
  const c = error.code;
  if (c === "network" || c === "rate_limited") {
    return "Connection issue — try again.";
  }
  if (c === "server_error") {
    return "The service had a problem — try again in a moment.";
  }
  if (c === "client_error" || c === "validation") {
    return "Request was rejected — check your input and try again.";
  }
  if (c === "scanner" || c.startsWith("scanner")) {
    return "Analysis failed — check input quality.";
  }
  if (c === "ingestion" || c.includes("ingest")) {
    return "Could not extract signals from input.";
  }
  const m = `${error.message} ${error.safeMessage}`.toLowerCase();
  if (/signal|extract|parse|ingest|bundle|connector/.test(m)) {
    return "Could not extract signals from input.";
  }
  if (/scan|fragility|driver|assessment/.test(m)) {
    return "Analysis failed — check input quality.";
  }
  if (/fetch|network|connection|timeout|unreachable/.test(m)) {
    return "Connection issue — try again.";
  }
  return "Something went wrong — try again.";
}

export function explainPipelineHudFailure(ui: {
  status: "idle" | "processing" | "ready" | "error";
  source: "ingestion" | "chat" | "scanner" | null;
  errorMessage: string | null;
}): string | null {
  if (ui.status !== "error" || !ui.errorMessage?.trim()) return null;
  const fromMessage = toNexoraError(ui.errorMessage);
  if (fromMessage.code === "network" || fromMessage.code === "rate_limited") {
    return explainNexoraFailure(fromMessage);
  }
  const synthetic = new NexoraError({
    code:
      ui.source === "scanner"
        ? "scanner"
        : ui.source === "ingestion"
          ? "ingestion"
          : "unknown",
    message: ui.errorMessage,
    safeMessage: ui.errorMessage,
  });
  return explainNexoraFailure(synthetic);
}
