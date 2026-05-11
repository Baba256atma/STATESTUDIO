"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  listDomainExperiences,
  type NexoraDomainExperience,
} from "../lib/domain/domainExperienceRegistry";
import {
  NEXORA_LAUNCH_DOMAIN_IDS,
  NEXORA_MVP_SHIPPING_CHECKLIST,
  isLaunchDomain,
} from "../lib/product/mvpShippingPlan";

type DomainSelectionScreenProps = {
  selectedDomainId: string;
  onSelect: (domainId: string) => void;
  onContinue: () => void;
};

const domains = listDomainExperiences();

export function DomainSelectionScreen({
  selectedDomainId,
  onSelect,
  onContinue,
}: DomainSelectionScreenProps) {
  const selected =
    domains.find((domain) => domain.domainId === selectedDomainId) ?? domains[0];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background:
          "radial-gradient(140% 140% at 0% 0%, rgba(15,23,42,0.96) 0%, rgba(6,11,23,0.98) 58%, #04070d 100%)",
      }}
    >
      <div
        style={{
          width: "min(1100px, 100%)",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.2fr) minmax(320px, 0.8fr)",
          gap: 20,
        }}
      >
        <div
          style={{
            borderRadius: 24,
            border: "1px solid rgba(148,163,184,0.14)",
            background: "rgba(15,23,42,0.72)",
            boxShadow: "0 18px 60px rgba(2,6,23,0.36)",
            padding: 24,
          }}
        >
          <div style={{ color: "#93c5fd", fontSize: 12, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase" }}>
            Nexora Domains
          </div>
          <div style={{ color: "#f8fafc", fontSize: 32, fontWeight: 800, marginTop: 10, lineHeight: 1.05 }}>
            Choose the intelligence context before entering the workspace.
          </div>
          <div style={{ color: "#94a3b8", fontSize: 14, marginTop: 12, maxWidth: 620, lineHeight: 1.6 }}>
            Nexora keeps one shared engine stack. The selected domain changes the active pack, demo framing, panel emphasis, prompt examples, and cockpit defaults.
          </div>

          <div
            style={{
              marginTop: 24,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
              gap: 14,
            }}
          >
            {domains.map((domain) => {
              const active = domain.domainId === selectedDomainId;
              const launchReady = isLaunchDomain(domain.domainId);
              return (
                <button
                  key={domain.domainId}
                  type="button"
                  onClick={() => onSelect(domain.domainId)}
                  style={{
                    textAlign: "left",
                    borderRadius: 18,
                    border: active
                      ? "1px solid rgba(96,165,250,0.5)"
                      : "1px solid rgba(148,163,184,0.14)",
                    background: active ? "rgba(30,41,59,0.86)" : "rgba(15,23,42,0.54)",
                    padding: 16,
                    cursor: "pointer",
                    minHeight: 156,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: active ? "inset 0 0 0 1px rgba(96,165,250,0.18)" : "none",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                      <div style={{ color: active ? "#dbeafe" : "#e2e8f0", fontSize: 18, fontWeight: 800 }}>
                        {domain.label}
                      </div>
                      <div
                        style={{
                          height: 22,
                          padding: "0 8px",
                          borderRadius: 999,
                          border: launchReady
                            ? "1px solid rgba(56,189,248,0.22)"
                            : "1px solid rgba(148,163,184,0.14)",
                          background: launchReady ? "rgba(14,165,233,0.12)" : "rgba(71,85,105,0.24)",
                          color: launchReady ? "#bae6fd" : "#cbd5e1",
                          display: "inline-flex",
                          alignItems: "center",
                          fontSize: 10,
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        {launchReady ? "Launch" : "Preview"}
                      </div>
                    </div>
                    <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 8, lineHeight: 1.55 }}>
                      {domain.description}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 14 }}>
                    {domain.tags.slice(0, 3).map((tag) => (
                      <div
                        key={tag}
                        style={{
                          height: 24,
                          padding: "0 8px",
                          borderRadius: 999,
                          border: "1px solid rgba(148,163,184,0.12)",
                          background: "rgba(2,6,23,0.42)",
                          color: "#cbd5e1",
                          display: "inline-flex",
                          alignItems: "center",
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                        }}
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
            <NexoraTypeCCard />
            <NexoraPsychCard />
          </div>
        </div>

        <SelectionPreviewCard selected={selected} onContinue={onContinue} />
      </div>
    </div>
  );
}

function NexoraTypeCCard(): React.ReactElement {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("[Nexora][TypeC][DomainCardMounted]");
    }
  }, []);

  return (
    <Link href="/type-c" data-nx="open-nexora-type-c-domain-card" style={{ textDecoration: "none" }}>
      <div
        role="button"
        style={{
          textAlign: "left",
          borderRadius: 18,
          border: "1px solid rgba(125,211,252,0.22)",
          background: "linear-gradient(145deg, rgba(15,23,42,0.74), rgba(30,41,59,0.52))",
          padding: 16,
          cursor: "pointer",
          minHeight: 180,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "inset 0 0 0 1px rgba(14,165,233,0.08)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
            <div>
              <div style={{ color: "#e0f2fe", fontSize: 18, fontWeight: 800 }}>Nexora Type-C</div>
              <div style={{ color: "#bae6fd", fontSize: 12, fontWeight: 700, marginTop: 3 }}>
                Manager Workspace
              </div>
            </div>
            <div
              style={{
                height: 22,
                padding: "0 8px",
                borderRadius: 999,
                border: "1px solid rgba(56,189,248,0.24)",
                background: "rgba(14,165,233,0.14)",
                color: "#bae6fd",
                display: "inline-flex",
                alignItems: "center",
                fontSize: 10,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              LAUNCH
            </div>
          </div>
          <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 8, lineHeight: 1.55 }}>
            Executive decision workspace for system modeling, fragility analysis, scenarios, war room, and monitored execution.
          </div>
        </div>

        <div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 14 }}>
            {[
              "TYPE_C",
              "EXECUTIVE",
              "DECISION_OS",
            ].map((tag) => (
              <div
                key={tag}
                style={{
                  height: 24,
                  padding: "0 8px",
                  borderRadius: 999,
                  border: "1px solid rgba(148,163,184,0.12)",
                  background: "rgba(2,6,23,0.42)",
                  color: "#dbeafe",
                  display: "inline-flex",
                  alignItems: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 14,
              height: 34,
              borderRadius: 999,
              border: "1px solid rgba(125,211,252,0.22)",
              background: "rgba(8,47,73,0.34)",
              color: "#e0f2fe",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 12px",
              fontSize: 11,
              fontWeight: 800,
            }}
          >
            Enter Type-C Manager Workspace
          </div>
        </div>
      </div>
    </Link>
  );
}

function NexoraPsychCard(): React.ReactElement {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("[Sycho][SYCHO-B01-FIX][DomainCardMounted]");
    }
  }, []);

  return (
    <Link href="/psych" data-nx="open-nexora-psych-domain-card" style={{ textDecoration: "none" }}>
      <div
        role="button"
        style={{
          textAlign: "left",
          borderRadius: 18,
          border: "1px solid rgba(148,163,184,0.14)",
          background: "rgba(15,23,42,0.54)",
          padding: 16,
          cursor: "pointer",
          minHeight: 156,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <div style={{ color: "#e2e8f0", fontSize: 18, fontWeight: 800 }}>Nexora Psych</div>
            <div
              style={{
                height: 22,
                padding: "0 8px",
                borderRadius: 999,
                border: "1px solid rgba(34,197,94,0.22)",
                background: "rgba(34,197,94,0.12)",
                color: "#bbf7d0",
                display: "inline-flex",
                alignItems: "center",
                fontSize: 10,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              LAUNCH
            </div>
          </div>
          <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 8, lineHeight: 1.55 }}>
            Self Mirror experience where conversation awakens a living 3D psychological scene.
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 14 }}>
          {[
            "PSYCH",
            "SELF_MIRROR",
            "3D_SCENE",
          ].map((tag) => (
            <div
              key={tag}
              style={{
                height: 24,
                padding: "0 8px",
                borderRadius: 999,
                border: "1px solid rgba(148,163,184,0.12)",
                background: "rgba(2,6,23,0.42)",
                color: "#cbd5e1",
                display: "inline-flex",
                alignItems: "center",
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}

function SelectionPreviewCard({
  selected,
  onContinue,
}: {
  selected: NexoraDomainExperience;
  onContinue: () => void;
}) {
  return (
    <div
      style={{
        borderRadius: 24,
        border: "1px solid rgba(96,165,250,0.18)",
        background:
          "linear-gradient(180deg, rgba(15,23,42,0.92) 0%, rgba(8,15,28,0.94) 100%)",
        boxShadow: "0 18px 60px rgba(2,6,23,0.34)",
        padding: 22,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: 100,
      }}
    >
      <div>
        <div style={{ color: "#60a5fa", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
          Selected Domain
        </div>
        <div style={{ color: "#f8fafc", fontSize: 28, fontWeight: 800, marginTop: 10 }}>
          {selected.label}
        </div>
        <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 10, lineHeight: 1.6 }}>
          {selected.description}
        </div>
        <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <div
            style={{
              height: 24,
              padding: "0 8px",
              borderRadius: 999,
              border: isLaunchDomain(selected.domainId)
                ? "1px solid rgba(56,189,248,0.22)"
                : "1px solid rgba(148,163,184,0.14)",
              background: isLaunchDomain(selected.domainId)
                ? "rgba(14,165,233,0.12)"
                : "rgba(71,85,105,0.24)",
              color: isLaunchDomain(selected.domainId) ? "#bae6fd" : "#cbd5e1",
              display: "inline-flex",
              alignItems: "center",
              fontSize: 10,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {isLaunchDomain(selected.domainId) ? "Launch Domain" : "Preview Domain"}
          </div>
          <div
            style={{
              height: 24,
              padding: "0 8px",
              borderRadius: 999,
              border: "1px solid rgba(148,163,184,0.14)",
              background: "rgba(2,6,23,0.45)",
              color: "#cbd5e1",
              display: "inline-flex",
              alignItems: "center",
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {selected.defaultDemoId}
          </div>
        </div>
        <div style={{ color: "#cbd5e1", fontSize: 12, marginTop: 14, lineHeight: 1.6 }}>
          {selected.promptGuideBody}
        </div>

        <div style={{ marginTop: 18, color: "#cbd5e1", fontSize: 12, fontWeight: 700 }}>
          Prompt examples
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
          {selected.promptExamples.map((prompt) => (
            <div
              key={prompt}
              style={{
                borderRadius: 999,
                border: "1px solid rgba(148,163,184,0.14)",
                background: "rgba(2,6,23,0.45)",
                color: "#dbeafe",
                padding: "8px 10px",
                fontSize: 11,
              }}
            >
              {prompt}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 18, color: "#cbd5e1", fontSize: 12, fontWeight: 700 }}>
          MVP shipping focus
        </div>
        <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
          {NEXORA_MVP_SHIPPING_CHECKLIST.slice(0, 4).map((item) => (
            <div
              key={item.id}
              style={{
                borderRadius: 12,
                border: "1px solid rgba(148,163,184,0.14)",
                background: "rgba(2,6,23,0.36)",
                color: "#cbd5e1",
                padding: "10px 12px",
                fontSize: 11,
                lineHeight: 1.5,
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
        <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 10, lineHeight: 1.55 }}>
          {isLaunchDomain(selected.domainId)
            ? `Launch domains: ${NEXORA_LAUNCH_DOMAIN_IDS.join(", ")}.`
            : "Preview domains remain available, but the shipping MVP centers Business, DevOps, and Finance."}
        </div>
      </div>

      <button
        type="button"
        onClick={onContinue}
        style={{
          marginTop: 22,
          height: 42,
          borderRadius: 14,
          border: "1px solid rgba(96,165,250,0.34)",
          background: "rgba(59,130,246,0.2)",
          color: "#dbeafe",
          fontSize: 13,
          fontWeight: 800,
          cursor: "pointer",
        }}
      >
        {isLaunchDomain(selected.domainId)
          ? `Enter ${selected.label} Workspace`
          : `Enter ${selected.label} Preview`}
      </button>
    </div>
  );
}
