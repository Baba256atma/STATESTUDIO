/**
 * B.26 — Unified error envelope for Nexora API / pipeline surfaces.
 */

export type NexoraErrorFields = {
  code: string;
  message: string;
  safeMessage: string;
};

/** Structured app error safe for UI (see `safeMessage`). */
export class NexoraError extends Error implements NexoraErrorFields {
  readonly code: string;
  readonly safeMessage: string;

  constructor(init: NexoraErrorFields) {
    super(init.message);
    this.name = "NexoraError";
    this.code = init.code;
    this.safeMessage = init.safeMessage;
  }

  toJSON(): NexoraErrorFields {
    return { code: this.code, message: this.message, safeMessage: this.safeMessage };
  }
}

function safeUserLine(message: string): string {
  const t = message.trim().slice(0, 400);
  if (!t) return "Something went wrong. Please try again.";
  return t;
}

export function toNexoraError(e: unknown): NexoraError {
  if (e instanceof NexoraError) return e;

  if (typeof e === "object" && e !== null && "code" in e && "safeMessage" in e) {
    const o = e as Record<string, unknown>;
    const code = typeof o.code === "string" ? o.code : "unknown";
    const message = typeof o.message === "string" ? o.message : String(o.message ?? "Error");
    const safeMessage = typeof o.safeMessage === "string" ? o.safeMessage : safeUserLine(message);
    return new NexoraError({ code, message, safeMessage });
  }

  const err = e as { status?: number; message?: string } | null;
  const status = typeof err?.status === "number" ? err.status : undefined;
  const raw =
    e instanceof Error
      ? e.message
      : typeof err?.message === "string"
        ? err.message
        : typeof e === "string"
          ? e
          : "Unexpected error";

  if (status === 429) {
    return new NexoraError({
      code: "rate_limited",
      message: raw,
      safeMessage: "Too many requests. Please wait a moment and try again.",
    });
  }
  if (status != null && status >= 500) {
    return new NexoraError({
      code: "server_error",
      message: raw,
      safeMessage: "The service had a problem completing this request.",
    });
  }
  if (status != null && status >= 400) {
    return new NexoraError({
      code: "client_error",
      message: raw,
      safeMessage: safeUserLine(raw),
    });
  }

  const m = String(raw);
  const networkish =
    /failed to fetch|networkerror|network request failed|load failed|econnrefused|enotfound|socket|aborted|abort/i.test(
      m
    ) || (typeof e === "object" && e !== null && "status" in e && (e as { status?: unknown }).status === undefined);

  if (networkish || e instanceof TypeError) {
    return new NexoraError({
      code: "network",
      message: m,
      safeMessage: "Unable to reach the server. Check your connection and try again.",
    });
  }

  return new NexoraError({
    code: "unknown",
    message: m,
    safeMessage: "Something went wrong. Please try again.",
  });
}
