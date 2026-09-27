"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { ManagementLevelSpatialComposition } from "@/app/lib/nmi/nmiManagementLevelSpatialContract.ts";
import { nmiManagementLevelInteractionIdentity } from "@/app/lib/nmi/nmiManagementLevelInteractionIdentity.ts";
import { nmiManagementLevelMotionIdentity } from "@/app/lib/nmi/nmiManagementLevelMotionIdentity.ts";
import type { ManagementLevelMotionPlan } from "@/app/lib/nmi/nmiManagementLevelMotionContract.ts";
import {
  liveSamplesFromMotionSample,
  motionCssTransition,
  planManagementLevelMotion,
  sampleManagementLevelMotion,
} from "@/app/lib/nmi/nmiManagementLevelMotionCompose.ts";

type Props = {
  readonly composition: ManagementLevelSpatialComposition;
  readonly selectedCanonicalId?: string | null;
  readonly onSelectSubject: (subjectId: string) => void;
};

function compositionFingerprint(composition: ManagementLevelSpatialComposition): string {
  return composition.slots
    .map(
      (slot) =>
        `${slot.canonicalId}:${slot.role}:${slot.placement.normalized.x}:${slot.placement.normalized.y}:${slot.scale}`,
    )
    .join("|");
}

/**
 * Live L2/L3 affordance. Canonical clicks still go to onSelectSubject.
 * After selection recomposes MLEVEL:2, this surface interpolates placement
 * with STAGE-MOTION:1 tokens. It does not own selection or hierarchy.
 */
export function NexoraManagementLevelContextNav({
  composition,
  selectedCanonicalId = null,
  onSelectSubject,
}: Props) {
  const previousRef = useRef<ManagementLevelSpatialComposition | null>(null);
  const liveRef = useRef<ReturnType<typeof liveSamplesFromMotionSample>>([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [progress, setProgress] = useState(1);
  const [plan, setPlan] = useState<ManagementLevelMotionPlan>(() =>
    planManagementLevelMotion({
      previous: null,
      next: composition,
      selectedCanonicalId:
        selectedCanonicalId ?? composition.slots.find((slot) => slot.role === "ACTIVE")?.canonicalId ?? null,
      reducedMotion: false,
    }),
  );

  const fingerprint = useMemo(() => compositionFingerprint(composition), [composition]);
  const resolvedSelected =
    selectedCanonicalId ?? composition.slots.find((slot) => slot.role === "ACTIVE")?.canonicalId ?? null;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const nextPlan = planManagementLevelMotion({
      previous: previousRef.current,
      next: composition,
      selectedCanonicalId: resolvedSelected,
      reducedMotion,
      liveSamples: liveRef.current,
    });
    setPlan(nextPlan);
    setProgress(nextPlan.phase === "complete" ? 1 : 0);
    const frame = window.requestAnimationFrame(() => setProgress(1));
    previousRef.current = composition;
    return () => window.cancelAnimationFrame(frame);
  }, [fingerprint, resolvedSelected, reducedMotion, composition]);

  const sample = sampleManagementLevelMotion(plan, progress);
  liveRef.current = liveSamplesFromMotionSample(sample);

  const ancestors = sample.participants.filter((item) => {
    const contextualRole = item.targetRole ?? item.sourceRole;
    if (contextualRole !== "PARENT" && contextualRole !== "GRANDPARENT") return false;
    return (
      item.targetRole === "PARENT" ||
      item.targetRole === "GRANDPARENT" ||
      item.kind === "EXITING_CONTEXT"
    );
  });
  if (ancestors.length === 0) return null;

  return (
    <nav
      data-testid="nexora-management-level-context-nav"
      data-mlevel-interaction={nmiManagementLevelInteractionIdentity}
      data-mlevel-motion={nmiManagementLevelMotionIdentity}
      data-mlevel-motion-phase={sample.phase}
      data-mlevel-motion-settled={sample.settled ? "true" : "false"}
      data-mlevel-selected={sample.selectedCanonicalId ?? "none"}
      data-mlevel-owns-navigation="false"
      data-mlevel-owns-referent="false"
      aria-label="Management context levels"
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 8,
        padding: "6px 8px 2px",
        pointerEvents: "auto",
      }}
    >
      {ancestors.map((item) => {
        const nx = item.current.normalized.x;
        const prominence = item.current.prominence;
        return (
          <button
            key={`mlevel-slot-${item.canonicalId}`}
            type="button"
            data-testid={
              item.targetRole === "PARENT"
                ? "nexora-management-level-slot-parent"
                : item.targetRole === "GRANDPARENT"
                  ? "nexora-management-level-slot-grandparent"
                  : `nexora-management-level-slot-exit-${item.canonicalId}`
            }
            data-canonical-id={item.canonicalId}
            data-level-role={item.targetRole ?? item.sourceRole ?? "ACTIVE"}
            data-motion-kind={item.kind}
            data-semantic-selected={item.semanticSelected ? "true" : "false"}
            data-mlevel-identity-authoritative="false"
            disabled={!item.clickable}
            aria-label={`Navigate to ${item.displayIdentity ?? item.canonicalId}`}
            onClick={() => {
              if (item.clickable) onSelectSubject(item.canonicalId);
            }}
            style={{
              border: "1px solid rgba(148, 163, 184, 0.45)",
              background: "rgba(15, 23, 42, 0.55)",
              color: "#cbd5e1",
              borderRadius: 6,
              padding: "4px 10px",
              fontSize: item.targetRole === "PARENT" ? "0.72rem" : "0.64rem",
              letterSpacing: "0.04em",
              cursor: item.clickable ? "pointer" : "default",
              opacity: Math.max(0.18, prominence),
              transform: `translateX(${((nx - 0.5) * 24).toFixed(2)}px) scale(${item.current.scale.toFixed(3)})`,
              transition: motionCssTransition(reducedMotion),
            }}
          >
            {item.displayIdentity ?? item.canonicalId}
          </button>
        );
      })}
    </nav>
  );
}
