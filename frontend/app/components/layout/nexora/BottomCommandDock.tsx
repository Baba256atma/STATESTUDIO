"use client";

import React from "react";
import { nx } from "../../ui/nexoraTheme";

type BottomCommandDockProps = {
  commandValue: string;
  placeholder: string;
  onCommandChange: (value: string) => void;
  onSubmit: () => void;
  onSuggestion: (prompt: string) => void;
  suggestions: string[];
  lastFeedback: string | null;
  lastCommandPreview: string | null;
  expanded: boolean;
  onExpandChange: (expanded: boolean) => void;
  onLoadScenario?: (() => void) | null;
  onAssessSources?: (() => void) | null;
};

export function BottomCommandDock(props: BottomCommandDockProps): React.ReactElement {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const visibleSuggestions = props.suggestions.slice(0, 3);

  React.useEffect(() => {
    const onFocus = () => {
      inputRef.current?.focus();
      props.onExpandChange(true);
    };
    window.addEventListener("nexora:focus-bottom-command-dock", onFocus);
    return () => window.removeEventListener("nexora:focus-bottom-command-dock", onFocus);
  }, [props]);

  return (
    <div
      id="nexora-bottom-command-dock"
      style={{
        border: `1px solid ${nx.border}`,
        borderRadius: 12,
        background: nx.bgDeep,
        padding: props.expanded ? "10px 12px" : "8px 12px",
        display: "flex",
        flexDirection: "column",
        gap: props.expanded ? 8 : 6,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: nx.lowMuted }}>
          Command dock
        </div>
        <button
          type="button"
          onClick={() => props.onExpandChange(!props.expanded)}
          style={{
            border: `1px solid ${nx.border}`,
            borderRadius: 8,
            background: "transparent",
            color: nx.muted,
            fontSize: 10,
            fontWeight: 700,
            cursor: "pointer",
            padding: "2px 8px",
          }}
        >
          {props.expanded ? "Compact" : "Expand"}
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
        <input
          ref={inputRef}
          value={props.commandValue}
          onFocus={() => props.onExpandChange(true)}
          onChange={(event) => props.onCommandChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") props.onSubmit();
          }}
          placeholder={props.placeholder}
          aria-label="Bottom command dock input"
          style={{
            flex: "1 1 0",
            minWidth: 0,
            minHeight: 40,
            borderRadius: 10,
            border: `1px solid ${nx.borderStrong}`,
            outline: "none",
            padding: "0 12px",
            background: nx.consoleBg,
            color: nx.text,
            fontSize: 13,
          }}
        />
        <button
          type="button"
          onClick={props.onSubmit}
          style={{
            minHeight: 40,
            borderRadius: 10,
            border: `1px solid ${nx.primaryCtaBorder}`,
            background: nx.btnPrimaryBg,
            color: nx.btnPrimaryText,
            padding: "0 14px",
            fontSize: 12,
            fontWeight: 800,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          Send
        </button>
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {visibleSuggestions.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => props.onSuggestion(prompt)}
            style={{
              border: `1px solid ${nx.border}`,
              borderRadius: 999,
              background: nx.bgControl,
              color: nx.textSoft,
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              padding: "4px 10px",
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {(props.onLoadScenario || props.onAssessSources) && props.expanded ? (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", borderTop: `1px solid ${nx.border}`, paddingTop: 6 }}>
          {props.onLoadScenario ? (
            <button
              type="button"
              onClick={props.onLoadScenario}
              style={{
                border: `1px solid ${nx.border}`,
                borderRadius: 8,
                background: nx.bgControl,
                color: nx.textSoft,
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                padding: "4px 10px",
              }}
            >
              [L] Load scenario
            </button>
          ) : null}
          {props.onAssessSources ? (
            <button
              type="button"
              onClick={props.onAssessSources}
              style={{
                border: `1px solid ${nx.border}`,
                borderRadius: 8,
                background: nx.bgControl,
                color: nx.textSoft,
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                padding: "4px 10px",
              }}
            >
              [M] Assess sources
            </button>
          ) : null}
        </div>
      ) : null}

      {props.lastFeedback ? (
        <div style={{ fontSize: 11, color: nx.muted, lineHeight: 1.35 }}>{props.lastFeedback}</div>
      ) : null}

      {props.expanded && props.lastCommandPreview ? (
        <div style={{ fontSize: 10, color: nx.lowMuted, borderTop: `1px solid ${nx.border}`, paddingTop: 6 }}>
          Recent: {props.lastCommandPreview}
        </div>
      ) : null}
    </div>
  );
}
