import { describe, expect, it, beforeEach } from "vitest";

import { HUD_PANEL_RADIUS } from "./hudPanelDesignContract.ts";
import { TIMELINE_BOTTOM_INSET_PX } from "./timelineBottomAnchorContract.ts";
import { resolveTimelineSceneWidthRatio } from "./timelineZoneContract.ts";
import {
  TIMELINE_PANEL_BOTTOM_INSET_PX,
  TIMELINE_PANEL_WIDTH_RATIO,
  TIMELINE_TRANSPORT_HEADER_STYLE,
  resetTimelinePanelPolishContractForTests,
} from "./timelinePanelPolishContract.ts";

describe("timelinePanelPolishContract", () => {
  beforeEach(() => {
    resetTimelinePanelPolishContractForTests();
  });

  it("aligns with shared HUD radius and unified edge inset width contract", () => {
    expect(HUD_PANEL_RADIUS).toBe(3);
    expect(TIMELINE_PANEL_WIDTH_RATIO).toBe(resolveTimelineSceneWidthRatio(900));
    expect(TIMELINE_PANEL_BOTTOM_INSET_PX).toBe(TIMELINE_BOTTOM_INSET_PX);
    expect(TIMELINE_PANEL_BOTTOM_INSET_PX).toBe(4);
    expect(TIMELINE_TRANSPORT_HEADER_STYLE.position).toBe("sticky");
  });
});
