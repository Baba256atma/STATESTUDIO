import { describe, expect, it, vi } from "vitest";

import {
  attachDomListener,
  bindWindowListener,
  detachDomListener,
  logDomListenerAttached,
  logDomListenerSkippedNull,
} from "./domListenerLifecycle";

describe("domListenerLifecycle", () => {
  it("skips attach when target is null", () => {
    const infoSpy = vi.spyOn(globalThis.console, "info").mockImplementation(() => {});
    const attached = attachDomListener(null, "click", () => {}, undefined, {
      component: "test",
      eventType: "click",
    });
    expect(attached).toBe(false);
    expect(infoSpy).toHaveBeenCalledWith(
      "[Nexora][DOM][ListenerSkippedNull]",
      expect.objectContaining({ component: "test", eventType: "click" })
    );
    infoSpy.mockRestore();
  });

  it("returns noop cleanup when window is unavailable", () => {
    const infoSpy = vi.spyOn(globalThis.console, "info").mockImplementation(() => {});
    const originalWindow = globalThis.window;
    // @ts-expect-error test override
    delete globalThis.window;
    const cleanup = bindWindowListener("resize", () => {}, undefined, {
      component: "test",
      eventType: "resize",
    });
    expect(typeof cleanup).toBe("function");
    cleanup();
    expect(infoSpy).toHaveBeenCalledWith(
      "[Nexora][DOM][ListenerSkippedNull]",
      expect.objectContaining({ component: "test", eventType: "resize" })
    );
    globalThis.window = originalWindow;
    infoSpy.mockRestore();
  });

  it("detaches safely when target is null", () => {
    expect(() =>
      detachDomListener(null, "click", () => {}, undefined, {
        component: "test",
        eventType: "click",
      })
    ).not.toThrow();
  });

  it("exports dev log helpers", () => {
    expect(typeof logDomListenerAttached).toBe("function");
    expect(typeof logDomListenerSkippedNull).toBe("function");
  });
});
