import { auditedResolve } from "../../audit/auditedResolve";
import type { AttentionHierarchyTier, ExecutiveVisualWeightSnapshot } from "./executiveMinimalismTypes";
import { logExecutiveMinimalism } from "./executiveMinimalismInstrumentation";

/** Reduce decorative visual weight for executive command-center surfaces. */
export function resolveExecutiveVisualWeight(
  tier: AttentionHierarchyTier = "SECONDARY",
  themeMode: "day" | "night" = "night"
): ExecutiveVisualWeightSnapshot {
  return auditedResolve({
    auditName: "Minimalism",
    inputs: { kind: "visualWeight", tier, themeMode },
    compute: () => {
      const isNight = themeMode === "night";
      if (tier === "PRIMARY") {
        return {
          borderWidthPx: 1,
          shellShadow: isNight ? "0 1px 0 rgba(255,255,255,0.04)" : "0 1px 0 rgba(15,23,42,0.04)",
          blockPaddingPx: 8,
          useGlowAccents: false,
          backdropBlurPx: 10,
        };
      }
      if (tier === "SECONDARY") {
        return {
          borderWidthPx: 1,
          shellShadow: undefined,
          blockPaddingPx: 7,
          useGlowAccents: false,
          backdropBlurPx: 8,
        };
      }
      return {
        borderWidthPx: 1,
        shellShadow: undefined,
        blockPaddingPx: 6,
        useGlowAccents: false,
        backdropBlurPx: 6,
      };
    },
    formatLogPayload: (snapshot) => ({ visualWeightTier: tier, themeMode, snapshot }),
    log: logExecutiveMinimalism,
  });
}
