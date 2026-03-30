"use client";

import React from "react";

import type { CustomerDemoProfile } from "../../lib/demo/customerDemoTypes";
import { nx, softCardStyle } from "../ui/nexoraTheme";

type CustomerDemoHeroProps = {
  profile: CustomerDemoProfile;
};

export function CustomerDemoHero(props: CustomerDemoHeroProps) {
  return (
    <div
      style={{
        ...softCardStyle,
        gap: 8,
        border: "1px solid rgba(96,165,250,0.22)",
        background: "linear-gradient(180deg, rgba(15,23,42,0.88), rgba(8,16,28,0.72))",
        padding: 12,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
        <div>
          <div style={{ color: "#f8fafc", fontSize: 14, fontWeight: 800 }}>{props.profile.label}</div>
          <div
            style={{
              color: nx.lowMuted,
              fontSize: 10,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginTop: 3,
            }}
          >
            {props.profile.executive_focus}
          </div>
        </div>
        <div
          style={{
            padding: "4px 8px",
            borderRadius: 999,
            border: `1px solid ${nx.border}`,
            background: "rgba(59,130,246,0.14)",
            color: "#dbeafe",
            fontSize: 10,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            whiteSpace: "nowrap",
          }}
        >
          {props.profile.domain}
        </div>
      </div>
      <div style={{ color: "#e2e8f0", fontSize: 12, lineHeight: 1.45 }}>{props.profile.hero_summary}</div>
      <div style={{ color: nx.lowMuted, fontSize: 11, lineHeight: 1.4 }}>{props.profile.business_context}</div>
    </div>
  );
}
