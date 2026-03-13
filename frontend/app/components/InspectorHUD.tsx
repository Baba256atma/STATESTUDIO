"use client";

import React from "react";

export function InspectorHUD({
  data,
  inline,
}: {
  data: any;
  inline?: boolean;
}) {
  if (!data) return null;

  const placementStyle = inline
    ? {
        position: "relative" as const,
        top: "auto",
        right: "auto",
        left: "auto",
        bottom: "auto",
        zIndex: "auto" as const,
        width: "100%",
        pointerEvents: "auto" as const,
      }
    : {
        position: "absolute" as const,
        right: 16,
        top: 16,
        zIndex: 40,
        pointerEvents: "auto" as const,
      };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        overflow: "hidden",
        width: "min(320px, 90vw)",
        ...placementStyle,
      }}
    >
      <div
        style={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
          padding: 10,
          borderRadius: 12,
          background: "rgba(0,0,0,0.55)",
          color: "white",
          fontSize: 12,
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 6 }}>State Vector</div>
        <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
