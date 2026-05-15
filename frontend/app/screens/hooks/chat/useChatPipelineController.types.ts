import type { MutableRefObject } from "react";

import type { RightPanelView } from "../../../lib/ui/right-panel/rightPanelTypes.ts";
import type { Msg } from "../../homeScreenUtils.ts";
import type { RequestPanelAuthorityOpenFn } from "../right-panel/useRightPanelController.types.ts";

// ======================================================
// Chat Pipeline Controller Types
// ======================================================
//
// This file stabilizes Chat Pipeline orchestration ownership before extraction from HomeScreen.
// **Types, readonly contracts, extraction metadata, and callback signatures only** — no hooks,
// no runtime orchestration, no UI, no network I/O.
//
// See `HomeScreenOptimizationInventory.md` → **O4 — Chat Pipeline Controller Extraction**.

/**
 * Persisted chat row today is `Msg` from `homeScreenUtils` (`text` body, optional `id`, optional `meta`).
 * `system` is reserved for future server / tool rows; not yet written by the current UI pipeline.
 */
export type ChatMessageRole = Msg["role"] | "system";

/**
 * Canonical transcript row for extraction — aligned with HomeScreen `messages: Msg[]`.
 * Use `text` as the message body (not `content`) until a dedicated migration prompt re-shapes rows.
 */
export type ChatPipelineMessage = Readonly<Msg>;

/** Normalized send payload for the future controller (HomeScreen today uses `sendText(text, requestId?, options?)`). */
export type ChatSendInput = Readonly<{
  text: string;
  source?: "user" | "system" | "retry" | string;
  force?: boolean;
}>;

/** Mirrors HomeScreen `SendTextOptions` (O4:5). */
export type SendTextOptions = Readonly<{
  source?: "user" | "demo";
  guidedPrompt?: {
    prompt: string;
    resolvedPanel: RightPanelView;
    contextId?: string | null;
  };
}>;

/** HomeScreen `useMemo` snapshot passed into `createChatPipelineSendText` deps slot (O4:5); excludes O4:7 bridge callbacks. */
export type ChatPipelineSendTextDeps = Readonly<Record<string, unknown>>;

/**
 * Read model for the future hook (names aligned with HomeScreen concepts).
 * Today `error` may be derived from `chatRequestStatus === "error"` and/or user-safe lifecycle strings — wiring TBD in O4:4+.
 */
export type ChatPipelineControllerState = Readonly<{
  messages: readonly ChatPipelineMessage[];
  inputValue: string;
  isLoading: boolean;
  error: string | null;
  lastRunId: string | null;
}>;

/**
 * Controller-owned ref surface for run / dedupe / stale guards.
 *
 * **HomeScreen names today (runtime unchanged — map during hook extraction):**
 * - `activeRunIdRef` ← `latestChatPipelineRunIdRef`
 * - `lastPromptSignatureRef` ← duplicate-prompt ledger (`lastChatDedupRef` + `normalizeChatInputForDedup` companion)
 * - `lastAssistantMessageSignatureRef` ← pipeline idempotency (`lastAppliedChatPipelineSignatureRef`; assistant-specific splits TBD)
 * - `staleRunGuardRef` ← request generation / staleness (`chatRequestSeqRef` + `activeChatRequestRef` + `isLatestChatRequestSeq` pattern; no single ref yet)
 */
export type ChatPipelineControllerRefs = Readonly<{
  activeRunIdRef: MutableRefObject<string | null>;
  lastPromptSignatureRef: MutableRefObject<string | null>;
  lastAssistantMessageSignatureRef: MutableRefObject<string | null>;
  staleRunGuardRef: MutableRefObject<string | null>;
}>;

/**
 * Optional bridges into sibling controllers — wired from HomeScreen (O4:7).
 * Chat pipeline dispatches only through these slots (no direct hook imports).
 */
export type ChatPipelineBridgeCallbacks = Readonly<{
  applySceneChangeSafe?:
    | ((nextOrUpdater: unknown, source: string, options?: { bypassDedupe?: boolean }) => void)
    | null;
  /** Scene writes with upstream dedupe (chat / describe / starter paths). */
  applySceneChangeUpstreamDedup?:
    | ((nextOrUpdater: unknown, source: string, options?: { bypassDedupe?: boolean }) => void)
    | null;
  /** Unified reaction apply used by chat pipeline stability / scene highlights. */
  applyUnifiedSceneReactionUpstreamDedup?:
    | ((reaction: unknown, options: { allowSceneReplacement: boolean; sceneReplacement?: unknown | null }) => void)
    | null;
  openRightPanel?: ((view: string, source: string, options?: Record<string, unknown>) => void) | null;
  /** Panel authority opens from chat intents (preferred over `openRightPanel` for chat). */
  requestPanelAuthorityOpen?: RequestPanelAuthorityOpenFn | null;
  closeRightPanel?: ((reason?: string) => void) | null;
  /** Type-C chat intent short-circuit (returns whether chat was handled by Type-C). */
  applyTypeCChatIntent?: ((userText: string) => boolean) | null;
  runTypeCAction?: ((actionName: string, payload?: unknown) => void) | null;
}>;

/** Public orchestration surface for `useChatPipelineController` (implemented in later O4 steps). */
export type ChatPipelineControllerCallbacks = Readonly<{
  sendText: (
    textRaw: string | ChatSendInput,
    requestId?: string | undefined,
    options?: SendTextOptions | undefined
  ) => Promise<void>;
  clearChatError: () => void;
  appendMessage: (message: ChatPipelineMessage) => void;
  replaceMessages: (messages: readonly ChatPipelineMessage[]) => void;
}>;

export type ChatPipelineDiagnosticEventName =
  | "send_requested"
  | "send_skipped"
  | "request_started"
  | "request_completed"
  | "request_failed"
  | "stale_response_ignored"
  | "duplicate_prompt_skipped"
  | "duplicate_assistant_message_skipped"
  | "message_appended"
  | "routing_resolved"
  | "bridge_action_dispatched";

export type ChatPipelineDiagnosticPayload = Readonly<{
  runId?: string | null;
  activeRunId?: string | null;
  promptSignature?: string | null;
  assistantSignature?: string | null;
  messageCount?: number;
  source?: string | null;
  intent?: string | null;
  targetPanel?: string | null;
  bridgeTarget?: string | null;
  skippedReason?: string | null;
  error?: string | null;
  target?: string | null;
  role?: string | null;
  requestSeq?: number | null;
  chatRequestStatus?: string | null;
}>;

export type EmitChatPipelineDiagnosticFn = (
  eventName: ChatPipelineDiagnosticEventName,
  payload: ChatPipelineDiagnosticPayload
) => void;

export type UseChatPipelineControllerContract = Readonly<{
  state: ChatPipelineControllerState;
  refs: ChatPipelineControllerRefs;
  bridges: ChatPipelineBridgeCallbacks;
  callbacks: ChatPipelineControllerCallbacks;
  /** O4:8 — dev-only deduped pipeline diagnostics (no state updates). */
  emitChatPipelineDiagnostic: EmitChatPipelineDiagnosticFn;
}>;

export const CHAT_PIPELINE_CONTROLLER_EXTRACTION_PLAN = {
  phase: "O4",
  zone: "chat_pipeline_controller",
  extractionOrder: [
    "types",
    "hook_skeleton",
    "message_state_helpers",
    "send_text_lifecycle",
    "intent_routing",
    "bridge_wiring",
    "diagnostics",
    "cleanup",
  ],
  protectedAreas: [
    "scene_apply_controller",
    "right_panel_controller",
    "type_c_orchestration",
    "chat_ui",
  ],
} as const;
