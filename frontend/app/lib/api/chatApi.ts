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
