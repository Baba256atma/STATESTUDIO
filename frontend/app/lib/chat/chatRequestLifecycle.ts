export type ChatRequestLifecycleStatus =
  | "idle"
  | "submitting"
  | "success"
  | "error"
  | "aborted"
  | "stale_ignored";

export const DEFAULT_CHAT_REQUEST_TIMEOUT_MS = 14_000;

export function isAbortLikeError(error: unknown): boolean {
  return !!error && typeof error === "object" && (error as { name?: string }).name === "AbortError";
}

export function getChatLifecycleErrorMessage(error: unknown, timedOut: boolean): string {
  if (timedOut) return "Request timed out. Please try again.";
  if (isAbortLikeError(error)) return "Request canceled.";
  if (error instanceof Error && error.message.trim()) return error.message;
  return "Sorry, I couldn't reach the server.";
}
