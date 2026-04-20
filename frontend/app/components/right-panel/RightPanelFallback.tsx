"use client";

import React from "react";
import { nx, panelSurfaceStyle, primaryButtonStyle } from "../ui/nexoraTheme";

type RightPanelFallbackProps = {
  title: string;
  message: string;
  suggestedActionLabel?: string | null;
  onSuggestedAction?: (() => void) | null;
};

export const RightPanelFallback = React.memo(function RightPanelFallback(props: RightPanelFallbackProps) {
  const title = props.title ?? "";
  const message = props.message ?? "";
  const hasCTA = Boolean(props.suggestedActionLabel && props.onSuggestedAction);
  const onSuggestedAction = props.onSuggestedAction ?? undefined;

  return (
    <div
      style={{
        ...panelSurfaceStyle,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: 16,
        color: nx.text,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: nx.lowMuted }}>
        Executive insight
      </div>
      <div style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.25 }}>{title}</div>
      <div style={{ color: nx.muted, fontSize: 13, lineHeight: 1.55 }}>{message}</div>
      {hasCTA ? (
        <button type="button" onClick={onSuggestedAction} style={{ ...primaryButtonStyle, alignSelf: "flex-start" }}>
          {props.suggestedActionLabel}
        </button>
      ) : null}
    </div>
  );
});
