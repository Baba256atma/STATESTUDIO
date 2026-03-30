import type { ChatActionOut, ChatResponseOut } from "./generated";

export type Action = ChatActionOut;
export type ChatResponse = ChatResponseOut;

export type ChatEvent = {
  id: string;
  timestamp: string;
  user_id: string;
  user_text: string;
  reply: string;
  actions: Action[];
};
