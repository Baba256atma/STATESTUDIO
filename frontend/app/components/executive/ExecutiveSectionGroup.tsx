"use client";

import React from "react";

import { nx } from "../ui/nexoraTheme";

type ExecutiveSectionGroupProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export function ExecutiveSectionGroup(props: ExecutiveSectionGroupProps) {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        padding: 14,
        borderRadius: 18,
        border: `1px solid ${nx.border}`,
        background: "linear-gradient(180deg, rgba(15,23,42,0.58), rgba(2,6,23,0.2))",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div
          style={{
            color: "#dbeafe",
            fontSize: 10,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
          }}
        >
          {props.title}
        </div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45, maxWidth: 420 }}>{props.subtitle}</div>
      </div>
      {props.children}
    </section>
  );
}
