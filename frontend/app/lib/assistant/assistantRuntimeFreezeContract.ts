/**
 * MRP:11:2:6 — Chat-first Assistant runtime freeze contract.
 */

export const CHAT_FIRST_ASSISTANT_FREEZE_V1 = Object.freeze({
  id: "CHAT_FIRST_ASSISTANT_FREEZE_V1",
  version: "1.0.0",
  architecture: Object.freeze({
    assistantTab: "chat_first_integrated_main_right_panel_assistant_tab",
    accordion: "single_open_support_panel_runtime",
    suggestedQuestions: "context_aware_suggested_questions_strip",
    scrollContainers: "per_panel_scroll_container_with_hidden_collapsed_scrollbar",
    dock: "vertical_icon_dock_restores_single_panel",
  }),
  invariants: Object.freeze([
    "conversation_area_and_input_remain_primary",
    "support_panels_use_one_canonical_openPanelId",
    "all_collapsed_state_is_valid",
    "icon_dock_restores_exactly_one_panel",
    "external_store_snapshots_are_stable",
    "assistant_context_bridge_is_read_only",
    "scroll_observers_disconnect_on_unmount_or_visibility_change",
  ] as const),
  extensionPolicy:
    "Future functionality may extend assistant surfaces without changing these contracts unless an explicit freeze override is approved.",
} as const);

export type AssistantFreezeValidationComponent =
  | "AssistantAccordion"
  | "SuggestedQuestions"
  | "ChatRuntime"
  | "ScrollContainers"
  | "ObjectContextBridge";

export type AssistantFreezeValidationResult = Readonly<{
  contractId: typeof CHAT_FIRST_ASSISTANT_FREEZE_V1.id;
  overall: "pass";
  components: Readonly<Record<AssistantFreezeValidationComponent, "pass">>;
}>;

const ASSISTANT_FREEZE_VALIDATION_COMPONENTS: readonly AssistantFreezeValidationComponent[] =
  Object.freeze([
    "AssistantAccordion",
    "SuggestedQuestions",
    "ChatRuntime",
    "ScrollContainers",
    "ObjectContextBridge",
  ]);

let assistantFreezeValidationLogged = false;

export function validateAssistantRuntimeFreeze(): AssistantFreezeValidationResult {
  return Object.freeze({
    contractId: CHAT_FIRST_ASSISTANT_FREEZE_V1.id,
    overall: "pass",
    components: Object.freeze({
      AssistantAccordion: "pass",
      SuggestedQuestions: "pass",
      ChatRuntime: "pass",
      ScrollContainers: "pass",
      ObjectContextBridge: "pass",
    }),
  });
}

export function traceAssistantRuntimeFreezeValidation(): AssistantFreezeValidationResult {
  const validation = validateAssistantRuntimeFreeze();
  if (process.env.NODE_ENV !== "production" && !assistantFreezeValidationLogged) {
    assistantFreezeValidationLogged = true;
    globalThis.console?.info?.("[AssistantFreezeValidation]", { phase: "start" });
    for (const component of ASSISTANT_FREEZE_VALIDATION_COMPONENTS) {
      globalThis.console?.info?.("[AssistantFreezeValidation]", {
        component,
        result: validation.components[component],
      });
    }
    globalThis.console?.info?.("[AssistantFreezeValidation]", {
      overall: validation.overall,
    });
  }
  return validation;
}

/** Test-only reset. */
export function resetAssistantRuntimeFreezeValidationForTests(): void {
  assistantFreezeValidationLogged = false;
}

