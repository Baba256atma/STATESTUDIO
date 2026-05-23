import { describe, expect, it } from "vitest";

import {
  getCommandHeaderResolvedContextLabel,
  getCommandHeaderServerSafeContextLabel,
} from "./commandHeaderContextLabel";

describe("commandHeaderContextLabel", () => {
  it("uses activeModeLabel when contextLabel is absent (SSR path)", () => {
    expect(getCommandHeaderServerSafeContextLabel("Strategy")).toBe("Strategy");
    expect(getCommandHeaderResolvedContextLabel(null, "Strategy")).toBe("Strategy");
  });

  it("prefers contextLabel after hydration", () => {
    expect(getCommandHeaderResolvedContextLabel("Retail Supply Chain", "Strategy")).toBe(
      "Retail Supply Chain"
    );
  });
});
