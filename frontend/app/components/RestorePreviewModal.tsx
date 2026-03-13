"use client";

import React from "react";
import type { BackupV1 } from "../screens/homeScreenUtils";

export type RestorePreviewPayload = { backup: BackupV1; lines: string[] };

type Props = {
  restorePreview: RestorePreviewPayload;
  onCancel: () => void;
  onConfirm: (backup: BackupV1) => void;
};

export function RestorePreviewModal({ restorePreview, onCancel, onConfirm }: Props) {
  const { backup, lines } = restorePreview;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        zIndex: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div
        style={{
          width: "min(520px, 92vw)",
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.12)",
          background: "rgba(20,26,38,0.92)",
          color: "white",
          padding: 12,
          backdropFilter: "blur(10px)",
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 8 }}>Restore Preview</div>
        <div style={{ display: "grid", gap: 6, fontSize: 12, opacity: 0.9, marginBottom: 12 }}>
          {lines.map((line, idx) => (
            <div key={`${idx}-${line}`} style={{ fontFamily: "monospace" }}>{line}</div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button
            type="button"
            onClick={() => onCancel()}
            style={{
              padding: "6px 10px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.9)",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(backup);
            }}
            style={{
              padding: "6px 10px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(56,189,248,0.18)",
              color: "rgba(255,255,255,0.95)",
              cursor: "pointer",
            }}
          >
            Restore
          </button>
        </div>
      </div>
    </div>
  );
}
