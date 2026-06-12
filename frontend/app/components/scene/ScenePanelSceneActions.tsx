"use client";

import React from "react";

import { hudPanelActionButtonStyle } from "../../lib/hud/hudPanelActionButtonStyle";
import type { NexoraHudThemeTokens } from "../../lib/scene/nexoraHudTheme";
import { nexoraHudSectionLabelStyle } from "../../lib/scene/nexoraHudTheme";

export type ScenePanelSceneActionsProps = {
  theme: NexoraHudThemeTokens;
  onAddObjectClick?: () => void;
  onCreateSystemClick?: () => void;
  onOpenTimelineClick?: () => void;
  onOpenWarRoomClick?: () => void;
};

const SCENE_ACTIONS = Object.freeze([
  { id: "add_object", label: "+ Add Object", handlerKey: "onAddObjectClick" as const },
  { id: "create_system", label: "Create System", handlerKey: "onCreateSystemClick" as const },
  { id: "open_timeline", label: "Open Timeline", handlerKey: "onOpenTimelineClick" as const },
  { id: "open_war_room", label: "Open War Room", handlerKey: "onOpenWarRoomClick" as const },
]);

export function ScenePanelSceneActions(props: ScenePanelSceneActionsProps): React.ReactElement | null {
  const handlers = {
    onAddObjectClick: props.onAddObjectClick,
    onCreateSystemClick: props.onCreateSystemClick,
    onOpenTimelineClick: props.onOpenTimelineClick,
    onOpenWarRoomClick: props.onOpenWarRoomClick,
  };

  const available = SCENE_ACTIONS.filter((entry) => Boolean(handlers[entry.handlerKey]));
  if (available.length === 0) return null;

  return (
    <section data-nx-section="scene-actions">
      <div style={{ ...nexoraHudSectionLabelStyle(props.theme), marginBottom: 6 }}>Scene Actions</div>
      <div
        role="group"
        aria-label="Scene actions"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr)",
          gap: 8,
          minWidth: 0,
        }}
      >
        {available.map((entry) => (
          <button
            key={entry.id}
            type="button"
            aria-label={entry.label}
            title={entry.label}
            onClick={handlers[entry.handlerKey]}
            style={{
              ...hudPanelActionButtonStyle(false, false),
              width: "100%",
              flex: undefined,
            }}
          >
            {entry.label}
          </button>
        ))}
      </div>
    </section>
  );
}

export default ScenePanelSceneActions;
