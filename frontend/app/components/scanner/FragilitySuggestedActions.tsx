"use client";

import React from "react";

export function FragilitySuggestedActions({
  actions,
}: {
  actions: string[];
}): React.ReactElement | null {
  if (!actions.length) return null;

  return (
    <section style={{ display: "grid", gap: 8 }}>
      <h3 style={{ margin: 0, color: "#e2e8f0", fontSize: 13, fontWeight: 800 }}>Recommended Actions</h3>
      <div style={{ display: "grid", gap: 6 }}>
        {actions.map((action) => (
          <div
            key={action}
            style={{
              padding: "8px 10px",
              borderRadius: 12,
              border: "1px solid rgba(147,197,253,0.18)",
              background: "rgba(30,41,59,0.72)",
              color: "#dbeafe",
              fontSize: 12,
              lineHeight: 1.45,
            }}
          >
            {action}
          </div>
        ))}
      </div>
    </section>
  );
}
