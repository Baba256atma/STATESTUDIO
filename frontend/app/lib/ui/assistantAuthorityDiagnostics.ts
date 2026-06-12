/**
 * MRP:12:6 — Single Assistant conversational authority diagnostics.
 */

let footerChatRemovedLogged = false;
let assistantChatActiveLogged = false;
let singleAuthorityLogged = false;

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

export function traceAssistantAuthorityFooterChatRemoved(): void {
  if (!isDev() || footerChatRemovedLogged) return;
  footerChatRemovedLogged = true;
  globalThis.console?.log?.("[NexoraAssistantAuthority]\nfooterChat=removed");
}

export function traceAssistantAuthorityAssistantChatActive(): void {
  if (!isDev() || assistantChatActiveLogged) return;
  assistantChatActiveLogged = true;
  globalThis.console?.log?.("[NexoraAssistantAuthority]\nassistantChat=active");
}

export function traceAssistantAuthoritySingleAuthority(): void {
  if (!isDev() || singleAuthorityLogged) return;
  singleAuthorityLogged = true;
  globalThis.console?.log?.("[NexoraAssistantAuthority]\nsingleAuthority=true");
}

export type AssistantAuthorityAudit = Readonly<{
  footerChatMounted: boolean;
  assistantChatMounted: boolean;
  singleConversationalAuthority: boolean;
}>;

export function auditAssistantAuthority(input: {
  footerChatMounted: boolean;
  assistantChatMounted: boolean;
}): AssistantAuthorityAudit {
  const singleConversationalAuthority =
    input.assistantChatMounted === true && input.footerChatMounted === false;
  if (isDev()) {
    globalThis.console?.log?.(
      `[NexoraAssistantAuthority]\nfooterChatMounted=${String(input.footerChatMounted)}\nassistantChatMounted=${String(input.assistantChatMounted)}\nsingleConversationalAuthority=${String(singleConversationalAuthority)}`
    );
  }
  return {
    footerChatMounted: input.footerChatMounted,
    assistantChatMounted: input.assistantChatMounted,
    singleConversationalAuthority,
  };
}

export function resetAssistantAuthorityDiagnosticsForTests(): void {
  footerChatRemovedLogged = false;
  assistantChatActiveLogged = false;
  singleAuthorityLogged = false;
}
