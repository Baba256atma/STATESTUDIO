/**
 * EXS-1 → EXS-7 — Executive Cockpit development sandbox.
 *
 * Experimental route for iterative EXS work.
 * Official production entry is /executive (Sprint 1 composition).
 * Shares the same Exs1Cockpit modules — no duplication.
 */

import type { Metadata } from "next";
import { readNexoraExecutiveGate } from "@/app/lib/auth/nexoraPrincipalServer";
import { NexoraExecutiveAuthBoundary } from "../components/NexoraAuthBoundary";
import { Exs1Cockpit } from "./components/Exs1Cockpit";

export const metadata: Metadata = {
  title: "Nexora · Executive Cockpit Sandbox",
  description:
    "EXS development sandbox — same modules as /executive, for iterative experience work.",
};

export default async function Exs1Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  const gate = await readNexoraExecutiveGate();
  if (gate.access.access === "authentication-boundary") {
    const params = await searchParams;
    const errorRaw = Array.isArray(params.error) ? params.error[0] : params.error;
    return (
      <main data-testid="exs1-page" style={{ height: "100vh", display: "flex", background: "#0a0e14" }}>
        <NexoraExecutiveAuthBoundary
          provider={gate.access.provider}
          authError={errorRaw ? "Sign-in failed. No session was created." : null}
        />
      </main>
    );
  }
  return (
    <main data-testid="exs1-page" style={{ height: "100vh", overflow: "hidden" }}>
      <Exs1Cockpit />
    </main>
  );
}
