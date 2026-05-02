import type { ChatIn, ChatResponseOut } from "./generated";
import { postChat } from "./client";

type ChatToBackendOptions = {
  signal?: AbortSignal;
};

export async function chatToBackend(
  payload: ChatIn,
  options?: ChatToBackendOptions
): Promise<ChatResponseOut> {
  return postChat(payload, { signal: options?.signal });
}

/**
 * Production-safe wrapper used by chat lifecycle integrations.
 * Keeps a single backend path while allowing future request shaping.
 */
export async function chatToBackendLifecycle(
  payload: ChatIn,
  options?: ChatToBackendOptions
): Promise<ChatResponseOut> {
  return chatToBackend(payload, options);
}
