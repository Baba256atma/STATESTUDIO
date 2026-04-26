"use client";

import React from "react";
import { nx, panelSurfaceStyle, primaryButtonStyle } from "../ui/nexoraTheme";

export type RightPanelFallbackMode = "message" | "loading" | "empty";

type RightPanelFallbackProps = {
  /** `loading` / `empty` = compact host chrome; `message` (default) = titled fallback. */
  mode?: RightPanelFallbackMode;
  title?: string;
  message?: string;
  suggestedActionLabel?: string | null;
  onSuggestedAction?: (() => void) | null;
  /** When true, omit duplicate rail chrome (host already shows the executive header). */
  embedded?: boolean;
};

export const RightPanelFallback = React.memo(function RightPanelFallback(props: RightPanelFallbackProps) {
  const mode = props.mode ?? "message";
  const title = props.title ?? "";
  const message = props.message ?? "";
  const hasCTA = Boolean(props.suggestedActionLabel && props.onSuggestedAction);
  const onSuggestedAction = props.onSuggestedAction ?? undefined;
  const embedded = props.embedded === true;

  if (mode === "loading") {
    const inner = (
      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
        <div style={{ height: 11, borderRadius: 6, background: "rgba(148,163,184,0.16)", width: "48%" }} />
        <div style={{ height: 9, borderRadius: 6, background: "rgba(148,163,184,0.12)", width: "88%" }} />
        <div style={{ height: 9, borderRadius: 6, background: "rgba(148,163,184,0.12)", width: "72%" }} />
        <div style={{ minHeight: 72, borderRadius: 10, background: "rgba(148,163,184,0.06)" }} />
      </div>
    );
    if (embedded) {
      return <div style={{ ...panelSurfaceStyle, padding: 16, color: nx.text }}>{inner}</div>;
    }
    return (
      <div style={{ ...panelSurfaceStyle, display: "flex", flexDirection: "column", gap: 12, padding: 16, color: nx.text }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: nx.lowMuted }}>
          Executive insight
        </div>
        {inner}
      </div>
    );
  }

  if (mode === "empty") {
    const body =
      message.trim().length > 0 ? (
        message
      ) : (
        "Nothing to show for this view yet. Run a scan or scenario when you are ready."
      );
    if (embedded) {
      return (
        <div style={{ ...panelSurfaceStyle, padding: 16, color: nx.muted, fontSize: 13, lineHeight: 1.55 }}>
          {body}
        </div>
      );
    }
    return (
      <div style={{ ...panelSurfaceStyle, display: "flex", flexDirection: "column", gap: 12, padding: 16, color: nx.text }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: nx.lowMuted }}>
          Executive insight
        </div>
        {title ? <div style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.25 }}>{title}</div> : null}
        <div style={{ color: nx.muted, fontSize: 13, lineHeight: 1.55 }}>{body}</div>
      </div>
    );
  }

  if (embedded) {
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
        {title ? <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.35 }}>{title}</div> : null}
        <div style={{ color: nx.muted, fontSize: 13, lineHeight: 1.55 }}>{message}</div>
        {hasCTA ? (
          <button type="button" onClick={onSuggestedAction} style={{ ...primaryButtonStyle, alignSelf: "flex-start" }}>
            {props.suggestedActionLabel}
          </button>
        ) : null}
      </div>
    );
  }

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
