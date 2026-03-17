"use client";

import React from "react";
import type { FragilityFinding } from "../../types/fragilityScanner";

export function FragilityFindingsList({
  findings,
}: {
  findings: FragilityFinding[];
}): React.ReactElement | null {
  if (!findings.length) return null;

  return (
    <section style={{ display: "grid", gap: 8 }}>
      <h3 style={{ margin: 0, color: "#e2e8f0", fontSize: 13, fontWeight: 800 }}>Findings</h3>
      {findings.map((finding) => (
        <article
          key={finding.id}
          style={{
            padding: 10,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(15,23,42,0.6)",
            display: "grid",
            gap: 6,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 700 }}>{finding.title}</div>
            <div style={{ color: "#94a3b8", fontSize: 11, textTransform: "uppercase" }}>{finding.severity}</div>
          </div>
          <div style={{ color: "#cbd5e1", fontSize: 12, lineHeight: 1.5 }}>{finding.explanation}</div>
          <div style={{ color: "#93c5fd", fontSize: 12, lineHeight: 1.45 }}>{finding.recommendation}</div>
        </article>
      ))}
    </section>
  );
}
