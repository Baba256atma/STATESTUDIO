"use client";

import React, { useEffect } from "react";
import PsychLayout from "./PsychLayout";
import { track } from "../lib/analytics/sychoAnalytics";

export default function PsychPage() {
  useEffect(() => {
    track("enter_space");
    const onPageHide = () => track("session_end");
    window.addEventListener("pagehide", onPageHide);
    return () => window.removeEventListener("pagehide", onPageHide);
  }, []);

  return (
    <div data-nx="psych-page" style={{ width: "100%", height: "100%" }}>
      <PsychLayout />
    </div>
  );
}
