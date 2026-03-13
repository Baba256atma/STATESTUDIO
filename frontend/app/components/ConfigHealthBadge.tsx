"use client";

import React from "react";
import { useConfigHealth } from "../hooks/useConfigHealth";

export function ConfigHealthBadge(): React.ReactElement | null {
  const { hasIssues, issueCount } = useConfigHealth();

  if (!hasIssues) return null;

  return (
    <button
      type="button"
      onClick={() => alert("Config issues detected. Open DevTools Console for details.")}
      title="Your customer KPI/Loop JSON has validation issues. Check console."
      style={{
        fontSize: 12,
        background: "rgba(255, 180, 0, 0.18)",
        border: "1px solid rgba(255, 180, 0, 0.35)",
        color: "#ffb400",
        borderRadius: 999,
        padding: "4px 8px",
        cursor: "pointer",
        zIndex: 1500,
      }}
    >
      Config issues: {issueCount}
    </button>
  );
}
