/**
 * DEPLOY:5-RENDER-BUILD-ENTRY-REPAIR:1
 *
 * NEXORA_RENDER_BUILD selects the Render build mode. It is not authorization.
 * The existing decideRenderBuild gate remains the only permit authority.
 */

import { decideRenderBuild } from "./renderBuildGate.mjs";

export function planRenderBuildEntry({ env, check = null, decide = decideRenderBuild }) {
  if (env?.RENDER !== "true") {
    return Object.freeze({
      action: "local",
      gateEnv: env,
      decision: null,
      compile: false,
      exitCode: 0,
      message: null,
    });
  }
  const gateEnv = Object.freeze({
    ...env,
    RENDER: "true",
    NEXORA_RENDER_BUILD: "1",
  });
  const decision = decide({ env: gateEnv, check });
  if (decision?.action === "compile-after-ci") {
    return Object.freeze({
      action: "compile-after-ci",
      gateEnv,
      decision,
      compile: true,
      exitCode: 0,
      message: null,
    });
  }
  if (decision?.action === "refuse") {
    return Object.freeze({
      action: "refuse",
      gateEnv,
      decision,
      compile: false,
      exitCode: 1,
      message: refusalMessage(decision),
    });
  }
  const label = typeof decision?.action === "string" && decision.action.length > 0
    ? decision.action
    : "missing";
  return Object.freeze({
    action: "unexpected",
    gateEnv,
    decision,
    compile: false,
    exitCode: 1,
    message: `nexora_render_build unexpected_decision=${label}`,
  });
}

function refusalMessage(decision) {
  return typeof decision?.reason === "string" && decision.reason.trim().length > 0
    ? decision.reason
    : "Render build refused.";
}
