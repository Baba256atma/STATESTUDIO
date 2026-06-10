"use client";

import { useEffect, useRef, useState } from "react";

import { DASHBOARD_ASSISTANT_CONTEXT_SYNC_EVENT } from "./assistantContextSyncContract";
import type { ExecutiveConversationContinuity } from "./conversationContinuityContract";
import {
  formatWorkspaceAwareResponse,
  resolveWorkspaceAwarePromptHints,
} from "./conversationContinuityContract";
import {
  createConversationSessionId,
  initializeConversationContinuity,
  mergeConversationContinuityFromSync,
} from "./conversationContinuityRuntime";

export type AssistantConversationContinuityState = Readonly<{
  continuity: ExecutiveConversationContinuity;
  workspaceAwareMessage: string | null;
  promptHints: readonly string[];
}>;

export function useAssistantConversationContinuity(): AssistantConversationContinuityState {
  const sessionIdRef = useRef<string>(createConversationSessionId());
  const [continuity, setContinuity] = useState<ExecutiveConversationContinuity>(() =>
    initializeConversationContinuity(sessionIdRef.current)
  );

  useEffect(() => {
    const onSync = (event: Event) => {
      const detail = (event as CustomEvent<unknown>).detail;
      setContinuity((prev) => {
        const result = mergeConversationContinuityFromSync(prev, detail, {
          expectedSessionId: sessionIdRef.current,
        });
        return result.continuity ?? prev;
      });
    };

    window.addEventListener(DASHBOARD_ASSISTANT_CONTEXT_SYNC_EVENT, onSync as EventListener);
    return () =>
      window.removeEventListener(DASHBOARD_ASSISTANT_CONTEXT_SYNC_EVENT, onSync as EventListener);
  }, []);

  const workspaceAwareMessage = formatWorkspaceAwareResponse(continuity.awareness);
  const promptHints = resolveWorkspaceAwarePromptHints(continuity.awareness.executiveIntent);

  return Object.freeze({
    continuity,
    workspaceAwareMessage,
    promptHints,
  });
}

export default useAssistantConversationContinuity;
