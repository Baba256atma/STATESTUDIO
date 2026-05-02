"use client";

import React, { useEffect, useState } from "react";
import type { AccessMode } from "../../lib/paywall/psychAccess";
import type { PsychGameState } from "../../lib/game/psychGameScore";

type PsychDevPanelProps = {
  accessMode: AccessMode;
  memoryPresent: boolean;
  memoryWriteDisabled?: boolean;
  lastMemorySavedAt: number | null;
  lastInput: string | null;
  lastReaction: string | null;
  lastClickedObject: string | null;
  lastEventType: "chat" | "click" | "decay" | null;
  decayActive: boolean;
  gameState: PsychGameState;
  strongestObject?: string;
  backendDominant?: string | null;
  backendMergeResult?: string | null;
  onForceProPreview?: () => void;
  onTriggerDecayNow?: () => void;
  onClearMemory?: () => void;
};

export default function PsychDevPanel({
  accessMode,
  memoryPresent,
  memoryWriteDisabled = false,
  lastMemorySavedAt,
  lastInput,
  lastReaction,
  lastClickedObject,
  lastEventType,
  decayActive,
  gameState,
  strongestObject = "unknown",
  backendDominant = null,
  backendMergeResult = null,
  onForceProPreview,
  onTriggerDecayNow,
  onClearMemory,
}: PsychDevPanelProps): React.JSX.Element {
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") console.log("[Sycho][SYCHO-B10][DevPanelMounted]");
  }, []);

  const buttonStyle: React.CSSProperties = {
    border: "1px solid rgba(180, 210, 255, 0.16)",
    borderRadius: 6,
    background: "rgba(255,255,255,0.05)",
    color: "rgba(232, 241, 255, 0.84)",
    cursor: "pointer",
    font: "inherit",
    padding: "5px 7px",
    pointerEvents: "auto",
  };

  return (
    <div
      data-nx="psych-dev-panel"
      style={{
        position: "fixed",
        top: 58,
        right: 12,
        zIndex: 62,
        width: 280,
        maxHeight: "calc(100vh - 82px)",
        color: "rgba(232, 241, 255, 0.84)",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        fontSize: 11,
        lineHeight: 1.35,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          border: "1px solid rgba(180, 210, 255, 0.16)",
          borderRadius: 8,
          background: "rgba(4, 11, 24, 0.5)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 10px 34px rgba(0,0,0,0.24)",
          overflow: "hidden",
        }}
      >
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          style={{
            width: "100%",
            border: 0,
            borderBottom: collapsed ? 0 : "1px solid rgba(180, 210, 255, 0.12)",
            background: "rgba(255,255,255,0.04)",
            color: "rgba(232, 241, 255, 0.86)",
            cursor: "pointer",
            font: "inherit",
            fontWeight: 700,
            padding: "6px 8px",
            pointerEvents: "auto",
            textAlign: "left",
          }}
        >
          {collapsed ? "Psych Dev +" : "Psych Dev -"}
        </button>
        {!collapsed ? (
          <div style={{ maxHeight: "calc(100vh - 126px)", overflow: "auto", padding: 8 }}>
            <div style={{ marginBottom: 8 }}>
              <strong>PHASE</strong>
              <div>B04 reaction: on</div>
              <div>B06 decay: on</div>
              <div>B07 game: on</div>
              <div>B08 memory: on</div>
              <div>B09 paywall: on</div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>ACCESS</strong>
              <div>accessMode: {accessMode}</div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>MEMORY</strong>
              <div>present: {memoryPresent ? "yes" : "no"}</div>
              <div>write disabled: {memoryWriteDisabled ? "yes" : "no"}</div>
              <div>last saved: {lastMemorySavedAt ? new Date(lastMemorySavedAt).toLocaleTimeString() : "null"}</div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>PIPELINE</strong>
              <div>event: {lastEventType ?? "null"}</div>
              <div>lastInput: {lastInput ?? "null"}</div>
              <div>lastReaction: {lastReaction ?? "null"}</div>
              <div>clicked: {lastClickedObject ?? "null"}</div>
              <div>decay active: {decayActive ? "true" : "false"}</div>
              <div>backend dominant: {backendDominant ?? "null"}</div>
              <div>merge: {backendMergeResult ?? "null"}</div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>GAME</strong>
              <div>SAS: {gameState.selfAwarenessScore}</div>
              <div>level: {gameState.level}</div>
              <div>dominant element: {strongestObject}</div>
            </div>
            <div>
              <strong>CONTROLS</strong>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                <button type="button" onClick={onForceProPreview} style={buttonStyle}>Force Pro Preview</button>
                <button type="button" onClick={onTriggerDecayNow} style={buttonStyle}>Trigger Decay Now</button>
                <button type="button" onClick={onClearMemory} style={buttonStyle}>Clear Memory</button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
