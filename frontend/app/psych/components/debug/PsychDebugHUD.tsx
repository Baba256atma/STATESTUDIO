"use client";

import React, { useEffect, useState } from "react";
import type { ObjectState, PsychState } from "../../../lib/psych/reactionTypes";
import type { PsychGameState } from "../../lib/game/psychGameScore";

type PsychDebugHUDProps = {
  lastInput: string | null;
  psychState: PsychState;
  objects: Record<string, ObjectState>;
  lastReaction: string | null;
  dominantState: string;
  strongestObject: string;
  lastDecayAt: number | null;
  decayActive: boolean;
  gameState: PsychGameState;
  memoryWriteDisabled?: boolean;
  backendDominant?: string | null;
  backendMergeResult?: string | null;
  onClearMemory?: () => void;
};

function formatNumber(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

export default function PsychDebugHUD({ lastInput, psychState, objects, lastReaction, dominantState, strongestObject, lastDecayAt, decayActive, gameState, memoryWriteDisabled = false, backendDominant = null, backendMergeResult = null, onClearMemory }: PsychDebugHUDProps): React.JSX.Element {
  const [collapsed, setCollapsed] = useState(true);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") console.log("[Sycho][SYCHO-B04.5][DebugHUDMounted]");
  }, []);

  return (
    <div
      data-nx="psych-debug-hud"
      style={{
        position: "fixed",
        left: 12,
        bottom: 12,
        zIndex: 60,
        maxWidth: 260,
        color: "rgba(232, 241, 255, 0.86)",
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
          background: "rgba(4, 11, 24, 0.48)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 10px 34px rgba(0,0,0,0.22)",
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
          {collapsed ? "Psych Debug +" : "Psych Debug -"}
        </button>
        {!collapsed ? (
          <div style={{ padding: 8 }}>
            <div style={{ marginBottom: 8 }}>
              <strong>INPUT</strong>
              <div style={{ color: "rgba(199, 216, 238, 0.78)", overflowWrap: "anywhere" }}>{lastInput ?? "null"}</div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>STATE</strong>
              <div>dominant: {dominantState}</div>
              {Object.entries(psychState).map(([key, value]) => (
                <div key={key}>
                  {key}: {formatNumber(value)}
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>OBJECTS</strong>
              <div>strongest: {strongestObject}</div>
              <div>backend: {backendDominant ?? "null"}</div>
              <div>merge: {backendMergeResult ?? "null"}</div>
              {Object.entries(objects).map(([id, object]) => (
                <div key={id}>
                  {id}: b {formatNumber(object.brightness)} / a {formatNumber(object.activity)}
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>DECAY</strong>
              <div>active: {decayActive ? "true" : "false"}</div>
              <div>last: {lastDecayAt ? new Date(lastDecayAt).toLocaleTimeString() : "null"}</div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>MEMORY</strong>
              <div>write disabled: {memoryWriteDisabled ? "true" : "false"}</div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>GAME</strong>
              <div>SAS: {gameState.selfAwarenessScore}</div>
              <div>balance: {gameState.balanceScore}</div>
              <div>level: {gameState.level}</div>
              <div>achievements: {gameState.achievements.length ? gameState.achievements.join(", ") : "none"}</div>
            </div>
            <div style={{ marginBottom: 8 }}>
              {confirmReset ? (
                <div style={{ marginBottom: 6, color: "rgba(232, 241, 255, 0.86)" }}>Reset your self mirror state?</div>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  if (!confirmReset) {
                    setConfirmReset(true);
                    setResetFeedback(null);
                    return;
                  }
                  onClearMemory?.();
                  setConfirmReset(false);
                  setResetFeedback("Memory cleared");
                  window.setTimeout(() => setResetFeedback(null), 1800);
                }}
                style={{
                  border: "1px solid rgba(180, 210, 255, 0.18)",
                  borderRadius: 6,
                  background: "rgba(255,255,255,0.05)",
                  color: "rgba(232, 241, 255, 0.86)",
                  cursor: "pointer",
                  font: "inherit",
                  padding: "5px 7px",
                  pointerEvents: "auto",
                }}
              >
                {confirmReset ? "Confirm Reset" : "Clear Psych Memory"}
              </button>
              {confirmReset ? (
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  style={{
                    marginLeft: 6,
                    border: "1px solid rgba(180, 210, 255, 0.12)",
                    borderRadius: 6,
                    background: "transparent",
                    color: "rgba(232, 241, 255, 0.72)",
                    cursor: "pointer",
                    font: "inherit",
                    padding: "5px 7px",
                    pointerEvents: "auto",
                  }}
                >
                  Cancel
                </button>
              ) : null}
              {resetFeedback ? <div style={{ marginTop: 5, color: "rgba(160, 220, 190, 0.9)" }}>{resetFeedback}</div> : null}
            </div>
            <div>
              <strong>REACTION</strong>
              <div style={{ color: "rgba(199, 216, 238, 0.78)", overflowWrap: "anywhere" }}>{lastReaction ?? "null"}</div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
