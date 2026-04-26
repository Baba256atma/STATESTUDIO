/**
 * Local-first chat: trivial prompts never hit the backend.
 * Also normalizes raw network errors so users never see "Failed to fetch".
 */

export function getLocalChatResponse(input: string): string | null {
  const text = input.toLowerCase().trim();
  if (["hi", "hello", "hey"].includes(text)) {
    return "Hi 👋 How can I help you?";
  }
  if (text.includes("help")) {
    return "You can ask me to analyze your system, explore risks, or simulate decisions.";
  }
  if (text.length < 3) {
    return "Can you clarify your request?";
  }
  return null;
}

export function userSafeChatMessage(message: string): string {
  const t = message.trim();
  if (!t) {
    return "System temporarily unavailable. Try again.";
  }
  if (/failed to fetch|networkerror|network request failed|load failed|econnrefused|socket hang up/i.test(t)) {
    return "System temporarily unavailable. Try again.";
  }
  return message.trim();
}
