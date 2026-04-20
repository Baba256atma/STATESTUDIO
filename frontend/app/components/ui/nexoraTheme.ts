import type React from "react";

/** Shared motion for hover / focus polish (authority, not playfulness). */
export const nxTransition = "border-color 180ms ease, box-shadow 180ms ease, background 180ms ease, transform 180ms ease, opacity 180ms ease";

/**
 * Semantic tokens resolved from CSS variables on `html[data-theme="night"|"day"]` (resolved theme).
 * See `globals.css` for night/day values. User preference may be `auto` (system).
 */
export const nx = {
  bgApp: "var(--nx-bg-app)",
  bgPanel: "var(--nx-bg-panel)",
  bgPanelSoft: "var(--nx-bg-panel-soft)",
  bgElevated: "var(--nx-bg-elevated)",
  bgHud: "var(--nx-bg-hud)",
  bgDeep: "var(--nx-bg-deep)",
  bgControl: "var(--nx-bg-control)",
  border: "var(--nx-border)",
  borderSoft: "var(--nx-border-soft)",
  borderStrong: "var(--nx-border-strong)",
  divider: "var(--nx-divider)",
  dividerStrong: "var(--nx-divider-strong)",
  text: "var(--nx-text)",
  textStrong: "var(--nx-text-strong)",
  textSoft: "var(--nx-text-soft)",
  muted: "var(--nx-muted)",
  lowMuted: "var(--nx-low-muted)",
  accent: "var(--nx-accent)",
  accentSoft: "var(--nx-accent-soft)",
  accentMuted: "var(--nx-accent-muted)",
  accentInk: "var(--nx-accent-ink)",
  success: "var(--nx-success)",
  warning: "var(--nx-warning)",
  risk: "var(--nx-risk)",
  headerBg: "var(--nx-header-bg)",
  bgShell: "var(--nx-bg-shell)",
  headerShadow: "var(--nx-header-shadow)",
  shadowDrawer: "var(--nx-shadow-drawer)",
  shadowBadge: "var(--nx-shadow-badge)",
  textPrimary: "var(--nx-text-primary)",
  btnPrimaryBg: "var(--nx-btn-primary-bg)",
  btnPrimaryText: "var(--nx-btn-primary-text)",
  btnSecondaryBg: "var(--nx-btn-secondary-bg)",
  btnSecondaryText: "var(--nx-btn-secondary-text)",
  chatBubbleUserBg: "var(--nx-chat-bubble-user-bg)",
  chatBubbleAssistantBg: "var(--nx-chat-bubble-assistant-bg)",
  leftNavBg: "var(--nx-leftnav-bg)",
  stageBg: "var(--nx-stage-bg)",
  stageInset: "var(--nx-stage-inset)",
  rightRailBg: "var(--nx-right-rail-bg)",
  logoBorder: "var(--nx-logo-border)",
  logoBg: "var(--nx-logo-bg)",
  logoText: "var(--nx-logo-text)",
  consoleBg: "var(--nx-console-bg)",
  consoleInset: "var(--nx-console-inset)",
  statusWellBg: "var(--nx-status-well-bg)",
  chipSurface: "var(--nx-chip-surface)",
  chipInset: "var(--nx-chip-inset)",
  chipValueText: "var(--nx-chip-value-text)",
  primaryCtaBorder: "var(--nx-primary-cta-border)",
  primaryCtaBg: "var(--nx-primary-cta-bg)",
  primaryCtaColor: "var(--nx-primary-cta-color)",
  secondaryCtaBg: "var(--nx-secondary-cta-bg)",
  popoverBg: "var(--nx-popover-bg)",
  popoverShadow: "var(--nx-popover-shadow)",
  overlayBackdrop: "var(--nx-overlay-backdrop)",
  workspacePanelBg: "var(--nx-workspace-panel-bg)",
  workspaceShadow: "var(--nx-workspace-shadow)",
  workspaceCloseBg: "var(--nx-workspace-close-bg)",
  workspaceCloseBorder: "var(--nx-workspace-close-border)",
  focusRing: "var(--nx-focus-ring)",
  placeholder: "var(--nx-placeholder)",
  metaPillModeBg: "var(--nx-meta-pill-mode-bg)",
  metaPillDriverBg: "var(--nx-meta-pill-driver-bg)",
  studioPanelBg: "var(--nx-studio-panel-bg)",
  studioPanelBorder: "var(--nx-studio-panel-border)",
  navTileActiveBorder: "var(--nx-nav-tile-active-border)",
  navTileActiveBg: "var(--nx-nav-tile-active-bg)",
  navTileInactiveBg: "var(--nx-nav-tile-inactive-bg)",
  navTileActiveShadow: "var(--nx-nav-tile-active-shadow)",
  navShortActive: "var(--nx-nav-short-active)",
  surfacePanel: "var(--nx-surface-panel)",
};

/** Primary decision surfaces (inspector rail, modals). */
export const panelSurfaceStyle: React.CSSProperties = {
  borderRadius: 14,
  border: `1px solid ${nx.border}`,
  background: "var(--nx-surface-panel)",
  backdropFilter: "blur(12px) saturate(1.05)",
};

/** Scene overlays: empty state, guided prompts — calmer than raw rgba. */
export const sceneOverlayCardStyle: React.CSSProperties = {
  ...panelSurfaceStyle,
  padding: 18,
  maxWidth: 520,
  boxShadow: "var(--nx-overlay-card-shadow)",
  background: "var(--nx-overlay-card-bg)",
};

/** Edge falloff above the WebGL layer; keeps focus on center intelligence. */
export const sceneVignetteLayerStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  zIndex: 1,
  pointerEvents: "none",
  background: "var(--nx-scene-vignette)",
};

/** Right panel host: subtle frame so mounted panels read as one analytical surface. */
export const insightPanelHostFrame: React.CSSProperties = {
  minHeight: 0,
  flex: 1,
  display: "flex",
  flexDirection: "column",
  height: "100%",
  padding: "8px 12px 12px",
  boxSizing: "border-box",
};

/** Non-primary chrome actions (e.g. switch workspace). */
export const tertiaryButtonStyle: React.CSSProperties = {
  borderRadius: 999,
  border: `1px solid ${nx.border}`,
  background: nx.bgPanelSoft,
  color: nx.muted,
  padding: "6px 14px",
  fontSize: 11,
  fontWeight: 600,
  cursor: "pointer",
};

/** Subtle processing indicator on the scene. */
export const sceneWorkingBadgeStyle: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 12,
  border: `1px solid ${nx.border}`,
  background: nx.bgElevated,
  color: nx.text,
  fontSize: 12,
  fontWeight: 600,
   boxShadow: nx.shadowBadge,
  backdropFilter: "blur(10px)",
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
  borderRadius: 10,
  border: `1px solid ${nx.primaryCtaBorder}`,
  background: nx.btnPrimaryBg,
  color: nx.btnPrimaryText,
  padding: "8px 10px",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  transition: nxTransition,
};

export const secondaryButtonStyle: React.CSSProperties = {
  borderRadius: 10,
  border: `1px solid ${nx.border}`,
  background: nx.btnSecondaryBg,
  color: nx.btnSecondaryText,
  padding: "8px 10px",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
  transition: nxTransition,
};

export const inputStyle: React.CSSProperties = {
  borderRadius: 8,
  border: `1px solid ${nx.border}`,
  background: nx.bgPanelSoft,
  color: nx.text,
  padding: "8px 10px",
  fontSize: 12,
  outline: "none",
};
