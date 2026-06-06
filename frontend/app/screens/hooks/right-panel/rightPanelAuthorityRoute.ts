import type { RightPanelView } from "../../../lib/ui/right-panel/rightPanelTypes.ts";

/**
 * Deprecated compatibility view + legacy tab mapping for panel authority routing (O3:5).
 * Extracted from `HomeScreen.requestPanelAuthorityOpen` — keep behavior identical when changing call sites.
 * New MRP work must use MainRightPanelTab + DashboardContext from
 * `frontend/app/lib/ui/mainRightPanelContract.ts`.
 */
export function normalizeRawAuthorityPanelView(rawView: string): {
  view: RightPanelView;
  legacyTab: string | null;
} {
  const v = String(rawView ?? "").trim().toLowerCase();
  if (v === "focus") {
    return { view: "object", legacyTab: "object_focus" };
  }
  if (v === "risk_flow") {
    return { view: "risk", legacyTab: "risk_flow" };
  }
  if (v === "fragility_scan") {
    return { view: "fragility", legacyTab: "fragility_scan" };
  }
  return { view: v as RightPanelView, legacyTab: null };
}
