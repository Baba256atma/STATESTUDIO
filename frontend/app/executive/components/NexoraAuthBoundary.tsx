"use client";

import { useState } from "react";
import type { NexoraAuthProviderId } from "@/app/lib/auth/nexoraAuthProviders";
import { beginNexoraSignIn, endNexoraSession } from "@/app/lib/auth/nexoraAuthBrowser";
import type { NexoraClientSessionProjection } from "@/app/lib/auth/nexoraPrincipal";

export function NexoraExecutiveAuthBoundary({
  provider,
  authError,
}: {
  readonly provider: NexoraAuthProviderId;
  readonly authError: string | null;
}) {
  const [phase, setPhase] = useState<"idle" | "loading" | "failed">("idle");

  async function signIn(userId?: string) {
    if (provider !== "github" && provider !== "nexora-dev") return;
    setPhase("loading");
    const result = await beginNexoraSignIn({ provider, userId });
    if (!result.ok) setPhase("failed");
  }

  return (
    <section
      data-testid="nexora-auth-boundary"
      style={{
        margin: "auto",
        width: "min(28rem, calc(100% - 2rem))",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        color: "#e8eef6",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 650 }}>Sign in to Nexora</h1>
      <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.5 }}>
        Executive Nexora opens after GitHub confirms this sign-in.
      </p>
      {provider === "github" ? (
        <button type="button" data-testid="nexora-sign-in" disabled={phase === "loading"} onClick={() => void signIn()}>
          {phase === "loading" ? "Signing in" : "Sign in with GitHub"}
        </button>
      ) : null}
      {provider === "nexora-dev" ? (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="button" data-testid="nexora-sign-in-user-a" disabled={phase === "loading"} onClick={() => void signIn("user_a")}>
            Sign in
          </button>
          <button type="button" data-testid="nexora-sign-in-user-b" disabled={phase === "loading"} onClick={() => void signIn("user_b")}>
            Sign in as second user
          </button>
        </div>
      ) : null}
      {provider !== "github" && provider !== "nexora-dev" ? (
        <p role="status" data-testid="nexora-auth-unavailable">Sign-in is unavailable.</p>
      ) : null}
      {authError || phase === "failed" ? (
        <p role="alert" data-testid="nexora-auth-failure">Sign-in failed. No session was created.</p>
      ) : null}
    </section>
  );
}

export function NexoraAccountControl({
  session,
}: {
  readonly session: NexoraClientSessionProjection;
}) {
  const [phase, setPhase] = useState<"idle" | "loading">("idle");
  const label = session.name ?? session.displayLabel ?? "Signed in";
  return (
    <div
      data-testid="nexora-account-control"
      data-principal-provider={session.provider ?? ""}
      style={{
        position: "fixed",
        top: 10,
        right: 10,
        zIndex: 70,
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        maxWidth: "min(22rem, calc(100vw - 1.25rem))",
        padding: "0.35rem 0.5rem",
        borderRadius: "0.4rem",
        background: "rgba(10, 14, 20, 0.92)",
        border: "1px solid rgba(148, 163, 184, 0.28)",
        color: "#e8eef6",
      }}
    >
      {session.image ? (
        <img
          data-testid="nexora-account-avatar"
          src={session.image}
          alt=""
          width={28}
          height={28}
          style={{ borderRadius: "999px", objectFit: "cover" }}
        />
      ) : null}
      <span data-testid="nexora-account-name" style={{ fontSize: "0.78rem" }}>{label}</span>
      {session.email ? (
        <span data-testid="nexora-account-email" style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{session.email}</span>
      ) : null}
      <button
        type="button"
        data-testid="nexora-account-sign-out"
        disabled={phase === "loading"}
        onClick={() => {
          setPhase("loading");
          void endNexoraSession();
        }}
      >
        {phase === "loading" ? "Signing out" : "Sign out"}
      </button>
    </div>
  );
}
