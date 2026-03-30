"use client";

import React from "react";

import { nx, softCardStyle } from "../ui/nexoraTheme";
import type { ComparePathDelta } from "../../lib/compare/compareTypes";

type PathDeltaListProps = {
  items: ComparePathDelta[];
};

function labelForPath(pathId: string): string {
  return pathId.replace(/:/g, " · ").replace(/->/g, " -> ");
}

export function PathDeltaList({ items }: PathDeltaListProps) {
  if (!items.length) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.slice(0, 4).map((item) => (
        <div key={item.path_id} style={{ ...softCardStyle, padding: 10 }}>
          <div style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>{labelForPath(item.path_id)}</div>
          <div style={{ color: nx.muted, fontSize: 12 }}>{item.rationale}</div>
        </div>
      ))}
    </div>
  );
}
