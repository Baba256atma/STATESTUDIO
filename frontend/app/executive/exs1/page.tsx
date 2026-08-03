/**
 * EXS-1 → EXS-7 — Executive Cockpit development sandbox.
 *
 * Experimental route for iterative EXS work.
 * Official production entry is /executive (Sprint 1 composition).
 * Shares the same Exs1Cockpit modules — no duplication.
 */

import type { Metadata } from "next";
import { Exs1Cockpit } from "./components/Exs1Cockpit";

export const metadata: Metadata = {
  title: "Nexora · Executive Cockpit Sandbox",
  description:
    "EXS development sandbox — same modules as /executive, for iterative experience work.",
};

export default function Exs1Page() {
  return (
    <main data-testid="exs1-page" style={{ height: "100vh", overflow: "hidden" }}>
      <Exs1Cockpit />
    </main>
  );
}
