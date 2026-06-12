import { afterEach, describe, expect, it, vi } from "vitest";

import {
  auditAssistantAuthority,
  resetAssistantAuthorityDiagnosticsForTests,
  traceAssistantAuthorityAssistantChatActive,
  traceAssistantAuthorityFooterChatRemoved,
  traceAssistantAuthoritySingleAuthority,
} from "./assistantAuthorityDiagnostics";

describe("assistantAuthorityDiagnostics", () => {
  afterEach(() => {
    resetAssistantAuthorityDiagnosticsForTests();
    vi.restoreAllMocks();
  });

  it("logs single authority traces once", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    traceAssistantAuthorityFooterChatRemoved();
    traceAssistantAuthorityFooterChatRemoved();
    traceAssistantAuthorityAssistantChatActive();
    traceAssistantAuthoritySingleAuthority();
    expect(log).toHaveBeenCalledTimes(3);
    expect(log.mock.calls[0]?.[0]).toBe("[NexoraAssistantAuthority]\nfooterChat=removed");
    expect(log.mock.calls[1]?.[0]).toBe("[NexoraAssistantAuthority]\nassistantChat=active");
    expect(log.mock.calls[2]?.[0]).toBe("[NexoraAssistantAuthority]\nsingleAuthority=true");
  });

  it("audits single conversational authority when assistant is mounted and footer is not", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const audit = auditAssistantAuthority({
      footerChatMounted: false,
      assistantChatMounted: true,
    });
    expect(audit.singleConversationalAuthority).toBe(true);
    expect(log).toHaveBeenCalledTimes(1);
    expect(String(log.mock.calls[0]?.[0])).toContain("singleConversationalAuthority=true");
  });
});
