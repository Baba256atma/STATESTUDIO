"use client";

import { useContext } from "react";
import { ExecutiveConversationReactContext } from "../ExecutiveConversationProvider";

/**
 * Shared Executive Conversation session hook.
 * One conversation across Advisor (Assist) and Insight perspectives.
 */
export function useExecutiveConversation() {
  const value = useContext(ExecutiveConversationReactContext);
  if (!value) {
    throw new Error(
      "useExecutiveConversation must be used within ExecutiveConversationProvider",
    );
  }
  return value;
}
