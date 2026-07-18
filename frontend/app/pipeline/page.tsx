"use client";

import React from "react";
import { PipelinePage } from "../components/pipeline/PipelinePage";

/**
 * Minimal route adapter for /pipeline.
 * Renders the canonical PipelinePage with no business logic.
 */
export default function PipelineRoutePage() {
  return <PipelinePage />;
}
