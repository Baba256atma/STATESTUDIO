"use client";

import React, { useCallback } from "react";

import type { ExecutiveFavoriteCardView } from "../../lib/dashboard/executiveFavoritesLayer/executiveFavoritesLayerContract";
import {
  dashboardVisualSpacing,
  dashboardVisualTypography,
} from "../../lib/dashboard/dashboardVisualTheme";
import { nx } from "../ui/nexoraTheme";

export type ExecutiveFavoriteCardProps = Readonly<{
  card: ExecutiveFavoriteCardView;
  onQuickOpen?: (card: ExecutiveFavoriteCardView) => void;
}>;

export function ExecutiveFavoriteCard(props: ExecutiveFavoriteCardProps): React.ReactElement {
  const { card } = props;

  const handleOpen = useCallback(() => {
    if (!card.launchable || !props.onQuickOpen) return;
    props.onQuickOpen(card);
  }, [card, props.onQuickOpen]);

  return (
    <article
      data-nx="executive-favorite-card"
      data-favorite-id={card.id}
      data-favorite-type={card.itemType}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: dashboardVisualSpacing.sm,
        padding: dashboardVisualSpacing.md,
        borderRadius: 12,
        border: `1px solid ${nx.border}`,
        background: nx.bgElevated,
        minWidth: 0,
      }}
    >
      <div
        style={{
          ...dashboardVisualTypography.cardTitle,
          color: nx.text,
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        {card.name}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>
          Type
        </div>
        <div style={{ color: nx.textSoft, fontSize: 12 }}>{card.typeLabel}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ color: nx.lowMuted, fontSize: 10, fontWeight: 700, textTransform: "uppercase" }}>
          Last Opened
        </div>
        <div style={{ color: nx.textSoft, fontSize: 12 }}>{card.lastAccessedLabel}</div>
      </div>

      <button
        type="button"
        disabled={!card.launchable}
        onClick={handleOpen}
        style={{
          alignSelf: "flex-start",
          marginTop: 2,
          padding: "6px 14px",
          borderRadius: 999,
          border: `1px solid ${card.launchable ? nx.navTileActiveBorder : nx.border}`,
          background: card.launchable ? nx.btnSecondaryBg : nx.bgControl,
          color: card.launchable ? nx.btnSecondaryText : nx.lowMuted,
          fontSize: 11,
          fontWeight: 700,
          cursor: card.launchable ? "pointer" : "not-allowed",
        }}
      >
        {card.quickOpenLabel}
      </button>
    </article>
  );
}

export default ExecutiveFavoriteCard;
