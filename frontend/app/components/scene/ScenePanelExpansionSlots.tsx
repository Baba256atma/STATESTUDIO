"use client";

import React from "react";

import { SCENE_PANEL_EXPANSION_SLOTS } from "../../lib/scene/scenePanelPurposeContract";
import type { NexoraHudThemeTokens } from "../../lib/scene/nexoraHudTheme";
import { nexoraHudSectionLabelStyle } from "../../lib/scene/nexoraHudTheme";
import { nx } from "../ui/nexoraTheme";

export type ScenePanelExpansionSlotsProps = {
  theme: NexoraHudThemeTokens;
};

export function ScenePanelExpansionSlots(props: ScenePanelExpansionSlotsProps): React.ReactElement {
  return (
    <section data-nx-section="expansion-slots" aria-label="Future capabilities">
      <div style={{ ...nexoraHudSectionLabelStyle(props.theme), marginBottom: 6 }}>Future Capabilities</div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          minWidth: 0,
          opacity: 0.55,
        }}
      >
        {SCENE_PANEL_EXPANSION_SLOTS.map((slot) => (
          <div
            key={slot.id}
            data-nx-expansion-slot={slot.id}
            aria-disabled="true"
            style={{
              padding: "4px 6px",
              borderRadius: 6,
              border: `1px dashed color-mix(in srgb, ${nx.borderSoft} 70%, transparent)`,
              color: nx.muted,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {slot.label} — reserved
          </div>
        ))}
      </div>
    </section>
  );
}

export default ScenePanelExpansionSlots;
