/**
 * DEPLOY:5-RELEASE-GATE-EXPANSION:1 — manual production release decision.
 *
 * A push does not approve a release. workflow_dispatch on main supplies a
 * full SHA. A Render request is permitted only when that SHA is the current
 * main HEAD and all four trusted push workflows have a completed successful
 * job for it. The hook URL is not an input here.
 */

import { pathToFileURL } from "node:url";

import {
  NEXORA_REPOSITORY,
  WORKFLOW_PATH,
  fetchTrustedWorkflowCheck,
  isTrustedWorkflowCheck,
} from "./renderBuildGate.mjs";

export const REQUIRED_RELEASE_CHECKS = Object.freeze([
  Object.freeze({
    id: "frontend-ci",
    workflowPath: ".github/workflows/ci.yml",
    workflowFile: "ci.yml",
    jobName: "Frontend",
  }),
  Object.freeze({
    id: "frontend-lint",
    workflowPath: ".github/workflows/frontend-lint.yml",
    workflowFile: "frontend-lint.yml",
    jobName: "frontend-lint",
  }),
  Object.freeze({
    id: "backend-lint",
    workflowPath: ".github/workflows/python-lint.yml",
    workflowFile: "python-lint.yml",
    jobName: "backend-lint",
  }),
  Object.freeze({
    id: "ai-routing",
    workflowPath: ".github/workflows/ai-routing-regression.yml",
    workflowFile: "ai-routing-regression.yml",
    jobName: "AI Routing Regression",
  }),
]);

export const RELEASE_EVENT = "workflow_dispatch";
export const RELEASE_REF = "refs/heads/main";
export const REQUIRED_CI_MARKERS = Object.freeze([
  "npm run typecheck",
  "app/lib/auth/nexoraExecutiveAccess.test.ts",
  "app/lib/workspace-auth/hostedManagerData.test.ts",
  "app/lib/workspace-auth/hostedWorkspaceAuthorization.test.ts",
  "scripts/renderBuildGate.test.mjs",
]);

const SHA = /^[0-9a-f]{40}$/;

export function deployHookConfigured(value) {
  return typeof value === "string" && value.trim().startsWith("https://api.render.com/deploy/");
}

export function workflowIncludesSecurityTests(workflowText) {
  return typeof workflowText === "string"
    && REQUIRED_CI_MARKERS.every((marker) => workflowText.includes(marker));
}

function proofsForRelease(check, checks) {
  const listed = Array.isArray(checks) ? checks.filter(Boolean) : [];
  const others = listed.filter((item) => item.workflowPath !== WORKFLOW_PATH || item.name !== "Frontend");
  if (check !== undefined) return [check, ...others].filter(Boolean);
  return listed;
}

export function decideRelease({
  repository,
  ref,
  eventName,
  requestedSha,
  mainSha,
  check,
  checks,
  workflowText,
}) {
  if (eventName !== RELEASE_EVENT) return deny("A push does not approve a production release.");
  if (repository !== NEXORA_REPOSITORY) return deny("The release repository is not Baba256atma/STATESTUDIO.");
  if (ref !== RELEASE_REF) return deny("Production release runs only from refs/heads/main.");
  if (!SHA.test(requestedSha || "")) return deny("The release SHA must be 40 hexadecimal characters.");
  if (!SHA.test(mainSha || "") || requestedSha !== mainSha) {
    return deny("The release SHA is not the current main HEAD. An older commit was not substituted.");
  }
  if (!workflowIncludesSecurityTests(workflowText)) {
    return deny("The CI workflow at this SHA does not include the required security tests.");
  }
  const proofs = proofsForRelease(check, checks);
  for (const contract of REQUIRED_RELEASE_CHECKS) {
    const matching = proofs.filter((item) => item.workflowPath === contract.workflowPath && item.name === contract.jobName);
    if (matching.length !== 1 || !isTrustedWorkflowCheck(matching[0], requestedSha, contract)) {
      return deny(`The trusted ${contract.jobName} job in ${contract.workflowPath} has not passed for this commit.`);
    }
  }
  return Object.freeze({ action: "permit", sha: requestedSha });
}

function deny(reason) {
  return Object.freeze({ action: "deny", reason });
}

async function readBody(response) {
  if (!response || response.ok !== true) return null;
  try {
    if (typeof response.text === "function") return await response.text();
    if (typeof response.json === "function") return JSON.stringify(await response.json());
  } catch {
    return null;
  }
  return null;
}

export async function authorizeRelease(env, fetchImpl) {
  const requestedSha = typeof env.RELEASE_SHA === "string" ? env.RELEASE_SHA.trim() : "";
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "nexora-release",
  };
  if (env.GITHUB_TOKEN) headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
  let mainSha = "";
  let workflowText = "";
  let check = null;
  let checks = [];
  try {
    if (SHA.test(requestedSha)) {
      const mainResponse = await fetchImpl(
        `https://api.github.com/repos/${NEXORA_REPOSITORY}/commits/${RELEASE_REF.split("/").pop()}`,
        { headers },
      );
      if (mainResponse?.ok && typeof mainResponse.json === "function") {
        const mainCommit = await mainResponse.json();
        mainSha = typeof mainCommit?.sha === "string" ? mainCommit.sha : "";
      }
      const workflowResponse = await fetchImpl(
        `https://api.github.com/repos/${NEXORA_REPOSITORY}/contents/${WORKFLOW_PATH}?ref=${requestedSha}`,
        { headers: { ...headers, Accept: "application/vnd.github.raw" } },
      );
      workflowText = await readBody(workflowResponse) || "";
      checks = await Promise.all(REQUIRED_RELEASE_CHECKS.map((contract) => (
        fetchTrustedWorkflowCheck(requestedSha, fetchImpl, env.GITHUB_TOKEN, contract)
      )));
      check = checks.find((item) => item && item.workflowPath === WORKFLOW_PATH && item.name === "Frontend") || null;
    }
  } catch {
    mainSha = "";
    workflowText = "";
    check = null;
    checks = [];
  }
  return decideRelease({
    repository: env.GITHUB_REPOSITORY,
    ref: env.GITHUB_REF,
    eventName: env.GITHUB_EVENT_NAME,
    requestedSha,
    mainSha,
    check,
    checks,
    workflowText,
  });
}

async function main() {
  const decision = await authorizeRelease(process.env, fetch);
  if (decision.action !== "permit") {
    console.error(decision.reason);
    process.exit(1);
  }
  const output = process.env.GITHUB_OUTPUT;
  const line = `authorized_sha=${decision.sha}\n`;
  if (output) {
    const { appendFileSync } = await import("node:fs");
    appendFileSync(output, line);
  } else {
    process.stdout.write(line);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
