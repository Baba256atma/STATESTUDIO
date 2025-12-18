"use client";

import React from "react";

export function InspectorHUD({ data }: { data: any }) {
  if (!data) return null;

  return (
    <div
      style={{
        position: "absolute",
        right: 16,
        top: 16,
        width: "min(320px, 90vw)",
        padding: 10,
        borderRadius: 12,
        background: "rgba(0,0,0,0.55)",
        color: "white",
        fontSize: 12,
        border: "1px solid rgba(255,255,255,0.12)",
        zIndex: 40,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 6 }}>State Vector</div>
      <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}