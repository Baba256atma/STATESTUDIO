/**
 * NPA-T RMS:8 — customer WATCH entry on the executive experience.
 */

import type { Metadata } from "next";
import { RmsWatchExperience } from "./RmsWatchExperience.tsx";

export const metadata: Metadata = {
  title: "Nexora · Watch a Business or Project",
  description: "Watch a Simulated Manager work with Nexora as a business or project situation develops.",
};

export default function RmsWatchPage() {
  return (
    <main
      data-testid="rms-watch-page"
      style={{
        height: "100vh",
        minHeight: "100vh",
        background: "#0a0e14",
        color: "#e8eef6",
        fontFamily: '"IBM Plex Sans", "Segoe UI", system-ui, sans-serif',
      }}
    >
      <RmsWatchExperience />
    </main>
  );
}
