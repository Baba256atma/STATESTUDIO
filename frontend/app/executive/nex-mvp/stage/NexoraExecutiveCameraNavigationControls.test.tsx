/**
 * SP:1.3 — Executive camera navigation control surface tests.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { NexoraExecutiveCameraNavigationControls } from "./NexoraExecutiveCameraNavigationControls";
import type { ExecutiveCameraNavigationLimitState } from "@/app/lib/spatial-presentation/executiveCameraNavigation";

const HERE = dirname(fileURLToPath(import.meta.url));

const OPEN_LIMITS: ExecutiveCameraNavigationLimitState = Object.freeze({
  canOrbitLeft: true,
  canOrbitRight: true,
  canTiltUp: true,
  canTiltDown: true,
  canZoomIn: true,
  canZoomOut: true,
  canReset: true,
  atMinimumAzimuth: false,
  atMaximumAzimuth: false,
  atMinimumElevation: false,
  atMaximumElevation: false,
  atMinimumDistance: false,
  atMaximumDistance: false,
});

test("camera navigation controls render semantic actions", () => {
  const html = renderToStaticMarkup(
    React.createElement(NexoraExecutiveCameraNavigationControls, {
      limits: OPEN_LIMITS,
      onNavigate: () => undefined,
    }),
  );
  assert.match(html, /data-testid="nexora-executive-camera-navigation"/);
  assert.match(html, /aria-label="Executive camera navigation"/);
  for (const action of [
    "orbit-left",
    "orbit-right",
    "tilt-up",
    "tilt-down",
    "zoom-in",
    "zoom-out",
    "reset",
  ]) {
    assert.match(html, new RegExp(`data-nav-action="${action}"`));
  }
  assert.match(html, /aria-label="Orbit Left"/);
  assert.match(html, /aria-label="Orbit Right"/);
  assert.match(html, /aria-label="Tilt Up"/);
  assert.match(html, /aria-label="Tilt Down"/);
  assert.match(html, /aria-label="Zoom In"/);
  assert.match(html, /aria-label="Zoom Out"/);
  assert.match(html, /aria-label="Reset View"/);
});

test("limit state disables corresponding controls", () => {
  const html = renderToStaticMarkup(
    React.createElement(NexoraExecutiveCameraNavigationControls, {
      limits: Object.freeze({
        ...OPEN_LIMITS,
        canOrbitLeft: false,
        canZoomIn: false,
        canReset: false,
      }),
      onNavigate: () => undefined,
    }),
  );
  assert.match(
    html,
    /data-testid="nexora-camera-nav-orbit-left"[^>]*disabled/,
  );
  assert.match(html, /data-testid="nexora-camera-nav-zoom-in"[^>]*disabled/);
  assert.match(html, /data-testid="nexora-camera-nav-reset"[^>]*disabled/);
  assert.doesNotMatch(
    html,
    /data-testid="nexora-camera-nav-orbit-right"[^>]*disabled/,
  );
});

test("control surface does not mutate Three.js camera directly", () => {
  const source = readFileSync(
    join(HERE, "NexoraExecutiveCameraNavigationControls.tsx"),
    "utf8",
  );
  assert.doesNotMatch(source, /camera\.position\.set/);
  assert.doesNotMatch(source, /OrbitControls/);
  assert.doesNotMatch(source, /useThree|useFrame/);
  assert.doesNotMatch(source, /from\s+["']three["']/);
  assert.match(source, /onNavigate/);
});
