import type React from "react";

export const nx = {
  bgApp: "#071019",
  bgPanel: "rgba(15,23,42,0.78)",
  bgPanelSoft: "rgba(2,6,23,0.46)",
  border: "rgba(148,163,184,0.14)",
  borderStrong: "rgba(96,165,250,0.35)",
  text: "#e2e8f0",
  muted: "#94a3b8",
  lowMuted: "#64748b",
  accent: "#60a5fa",
  accentSoft: "rgba(96,165,250,0.14)",
  success: "#86efac",
  warning: "#fde68a",
  risk: "#fca5a5",
};

export const panelSurfaceStyle: React.CSSProperties = {
  borderRadius: 16,
  border: `1px solid ${nx.border}`,
  background: nx.bgPanel,
  backdropFilter: "blur(8px)",
};

export const cardStyle: React.CSSProperties = {
  padding: 12,
  borderRadius: 12,
  border: `1px solid ${nx.border}`,
  background: nx.bgPanel,
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

export const softCardStyle: React.CSSProperties = {
  ...cardStyle,
  background: nx.bgPanelSoft,
};

export const sectionTitleStyle: React.CSSProperties = {
  color: nx.muted,
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: 0.55,
  fontWeight: 700,
};

export const primaryMetricStyle: React.CSSProperties = {
  color: nx.text,
  fontSize: 18,
  fontWeight: 800,
  lineHeight: 1.2,
};

export const primaryButtonStyle: React.CSSProperties = {
  borderRadius: 8,
  border: `1px solid ${nx.borderStrong}`,
  background: "rgba(59,130,246,0.18)",
  color: "#dbeafe",
  padding: "8px 10px",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
};

export const secondaryButtonStyle: React.CSSProperties = {
  borderRadius: 8,
  border: "1px solid rgba(148,163,184,0.24)",
  background: "rgba(30,41,59,0.75)",
  color: nx.text,
  padding: "8px 10px",
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
};

export const inputStyle: React.CSSProperties = {
  borderRadius: 8,
  border: "1px solid rgba(148,163,184,0.24)",
  background: "rgba(2,6,23,0.55)",
  color: nx.text,
  padding: "8px 10px",
  fontSize: 12,
  outline: "none",
};
