// O4:5 — shared sendText dedupe / effect-signature helpers (extracted from HomeScreen for chat pipeline controller).

export function normalizeChatInputForDedup(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function buildChatEffectSignature(input: {
  intent: string;
  targetPanel: string;
  sceneSignature?: string | null;
  userInput: string;
}): string {
  return [
    input.intent,
    input.targetPanel,
    input.sceneSignature ?? "no-scene",
    input.userInput.trim().toLowerCase().replace(/\s+/g, " "),
  ].join("::");
}
