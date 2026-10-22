import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import {
  GITHUB_ACTIONS_APP_SLUG,
  NEXORA_REPOSITORY,
  REQUIRED_BRANCH,
  REQUIRED_EVENT,
  WORKFLOW_PATH,
  decideRenderBuild,
  frontendCheckFromApiPayloads,
  trustedCheckFromApiPayloads,
} from "./renderBuildGate.mjs";
import {
  RELEASE_EVENT,
  RELEASE_REF,
  REQUIRED_CI_MARKERS,
  REQUIRED_RELEASE_CHECKS,
  authorizeRelease,
  decideRelease,
  deployHookConfigured,
} from "./releaseAuthorization.mjs";

const sha = "1dead5f6abd8500be70c74d4fe34dee1c9f812f5";
const otherSha = "a".repeat(40);
const runId = 39499416170;
const jobId = 118892799464;

const workflowText = REQUIRED_CI_MARKERS.join("\n");

function trustedCheck(head = sha) {
  return frontendCheckFromApiPayloads({
    sha: head,
    runs: {
      total_count: 1,
      workflow_runs: [{
        id: runId,
        run_attempt: 1,
        path: WORKFLOW_PATH,
        event: REQUIRED_EVENT,
        status: "completed",
        conclusion: "success",
        head_sha: head,
        head_branch: REQUIRED_BRANCH,
        repository: { full_name: NEXORA_REPOSITORY },
      }],
    },
    jobs: {
      total_count: 1,
      jobs: [{
        id: jobId,
        name: "Frontend",
        status: "completed",
        conclusion: "success",
        head_sha: head,
        run_id: runId,
        check_run_url: `https://api.github.com/repos/${NEXORA_REPOSITORY}/check-runs/555`,
      }],
    },
    check: {
      name: "Frontend",
      head_sha: head,
      status: "completed",
      conclusion: "success",
      details_url: `https://github.com/${NEXORA_REPOSITORY}/actions/runs/${runId}/job/${jobId}`,
      app: { slug: GITHUB_ACTIONS_APP_SLUG },
    },
  });
}

function workflowProof(contract, mutate = (parts) => parts) {
  const index = REQUIRED_RELEASE_CHECKS.findIndex((item) => item.id === contract.id);
  const parts = mutate({
    workflowPath: contract.workflowPath,
    jobName: contract.jobName,
    event: REQUIRED_EVENT,
    branch: REQUIRED_BRANCH,
    repository: NEXORA_REPOSITORY,
    headSha: sha,
    runId: 51000 + index,
    jobId: 61000 + index,
    runStatus: "completed",
    runConclusion: "success",
    jobStatus: "completed",
    jobConclusion: "success",
    appSlug: GITHUB_ACTIONS_APP_SLUG,
    totalCount: null,
    runs: null,
  });
  const runs = parts.runs || [{
    id: parts.runId,
    run_attempt: 1,
    path: parts.workflowPath,
    event: parts.event,
    status: parts.runStatus,
    conclusion: parts.runConclusion,
    head_sha: parts.headSha,
    head_branch: parts.branch,
    repository: { full_name: parts.repository },
  }];
  return trustedCheckFromApiPayloads({
    sha,
    workflowPath: parts.workflowPath,
    jobName: parts.jobName,
    runs: { total_count: parts.totalCount ?? runs.length, workflow_runs: runs },
    jobs: {
      total_count: 1,
      jobs: [{
        id: parts.jobId,
        name: parts.jobName,
        status: parts.jobStatus,
        conclusion: parts.jobConclusion,
        head_sha: parts.headSha,
        run_id: parts.runId,
        check_run_url: `https://api.github.com/repos/${NEXORA_REPOSITORY}/check-runs/${parts.jobId}`,
      }],
    },
    check: {
      name: parts.jobName,
      head_sha: parts.headSha,
      status: "completed",
      conclusion: "success",
      details_url: `https://github.com/${NEXORA_REPOSITORY}/actions/runs/${parts.runId}/job/${parts.jobId}`,
      app: { slug: parts.appSlug },
    },
  });
}

function otherProofs() {
  return REQUIRED_RELEASE_CHECKS
    .filter((contract) => contract.id !== "frontend-ci")
    .map((contract) => workflowProof(contract));
}

function release(overrides = {}) {
  return decideRelease({
    repository: NEXORA_REPOSITORY,
    ref: RELEASE_REF,
    eventName: RELEASE_EVENT,
    requestedSha: sha,
    mainSha: sha,
    check: trustedCheck(),
    checks: otherProofs(),
    workflowText,
    ...overrides,
  });
}

function contractById(id) {
  return REQUIRED_RELEASE_CHECKS.find((item) => item.id === id);
}

test("a normal push does not authorize production deployment", () => {
  const ci = readFileSync(new URL("../../.github/workflows/ci.yml", import.meta.url), "utf8");
  assert.doesNotMatch(ci, /RENDER_DEPLOY_HOOK_URL/);
  assert.equal(release({ eventName: "push" }).action, "deny");
  assert.equal(release({ eventName: "pull_request" }).action, "deny");
  assert.equal(release({ eventName: "workflow_run" }).action, "deny");
});

test("manual release authorization fails closed", () => {
  assert.equal(release({ repository: "other/STATESTUDIO" }).action, "deny");
  assert.equal(release({ ref: "refs/heads/feature" }).action, "deny");
  assert.equal(release({ requestedSha: "not-a-sha" }).action, "deny");
  assert.equal(release({ requestedSha: otherSha, mainSha: sha }).action, "deny");
  assert.equal(release({ mainSha: otherSha }).action, "deny");
  assert.equal(release({ workflowText: "name: CI\n" }).action, "deny");
  assert.equal(release({ check: null }).action, "deny");
  assert.equal(release({ check: { ...trustedCheck(), conclusion: "failure", status: "completed" } }).action, "deny");
  assert.equal(deployHookConfigured(""), false);
  assert.equal(deployHookConfigured("https://example.invalid/deploy"), false);
  assert.equal(deployHookConfigured("https://api.render.com/deploy/srv-example"), true);
});

test("an authorized current main SHA permits the same commit the build gate checks", () => {
  const decision = release();
  assert.equal(decision.action, "permit");
  assert.equal(decision.sha, sha);
  const build = decideRenderBuild({
    env: {
      NEXORA_RENDER_BUILD: "1",
      RENDER: "true",
      RENDER_GIT_COMMIT: decision.sha,
      RENDER_GIT_BRANCH: REQUIRED_BRANCH,
    },
    check: trustedCheck(),
  });
  assert.equal(build.action, "compile-after-ci");
  assert.equal(build.sha, decision.sha);
  assert.equal(decideRenderBuild({
    env: {
      NEXORA_RENDER_BUILD: "1",
      RENDER: "true",
      RENDER_GIT_COMMIT: otherSha,
      RENDER_GIT_BRANCH: REQUIRED_BRANCH,
    },
    check: trustedCheck(),
  }).action, "refuse");
});

test("GitHub API failure and a failed CI lookup deny the release", async () => {
  const denied = await authorizeRelease({
    RELEASE_SHA: sha,
    GITHUB_REPOSITORY: NEXORA_REPOSITORY,
    GITHUB_REF: RELEASE_REF,
    GITHUB_EVENT_NAME: RELEASE_EVENT,
  }, async () => {
    throw new Error("network down");
  });
  assert.equal(denied.action, "deny");
  let tokenSent = false;
  const failedCi = await authorizeRelease({
    RELEASE_SHA: sha,
    GITHUB_REPOSITORY: NEXORA_REPOSITORY,
    GITHUB_REF: RELEASE_REF,
    GITHUB_EVENT_NAME: RELEASE_EVENT,
    GITHUB_TOKEN: "test-token-value",
  }, async (url, options) => {
    tokenSent = options.headers.Authorization === "Bearer test-token-value";
    if (url.endsWith("/commits/main")) {
      return { ok: true, json: async () => ({ sha }) };
    }
    if (url.includes("/contents/.github/workflows/ci.yml")) {
      return { ok: true, text: async () => workflowText };
    }
    return { ok: false, json: async () => ({}) };
  });
  assert.equal(tokenSent, true);
  assert.equal(failedCi.action, "deny");
  assert.equal(JSON.stringify(failedCi).includes("test-token-value"), false);
});

test("R1 — all four trusted checks pass", async () => {
  const decision = release();
  assert.equal(decision.action, "permit");
  assert.equal(decision.sha, sha);
  assert.equal(REQUIRED_RELEASE_CHECKS.length, 4);
  const permitted = await authorizeRelease({
    RELEASE_SHA: sha,
    GITHUB_REPOSITORY: NEXORA_REPOSITORY,
    GITHUB_REF: RELEASE_REF,
    GITHUB_EVENT_NAME: RELEASE_EVENT,
  }, async (url) => {
    if (url.endsWith("/commits/main")) return { ok: true, json: async () => ({ sha }) };
    if (url.includes("/contents/.github/workflows/ci.yml")) return { ok: true, text: async () => workflowText };
    const contract = REQUIRED_RELEASE_CHECKS.find((item) => url.includes(`/workflows/${item.workflowFile}/runs`));
    if (contract) {
      const proofRunId = 70000 + REQUIRED_RELEASE_CHECKS.indexOf(contract);
      return {
        ok: true,
        json: async () => ({
          total_count: 1,
          workflow_runs: [{
            id: proofRunId,
            run_attempt: 1,
            path: contract.workflowPath,
            event: REQUIRED_EVENT,
            status: "completed",
            conclusion: "success",
            head_sha: sha,
            head_branch: REQUIRED_BRANCH,
            repository: { full_name: NEXORA_REPOSITORY },
          }],
        }),
      };
    }
    const jobsMatch = url.match(/\/actions\/runs\/(\d+)\/jobs/);
    if (jobsMatch) {
      const proofRunId = Number(jobsMatch[1]);
      const contract = REQUIRED_RELEASE_CHECKS[proofRunId - 70000];
      const jobIdForRun = proofRunId + 1000;
      return {
        ok: true,
        json: async () => ({
          total_count: 1,
          jobs: [{
            id: jobIdForRun,
            name: contract.jobName,
            status: "completed",
            conclusion: "success",
            head_sha: sha,
            run_id: proofRunId,
            check_run_url: `https://api.github.com/repos/${NEXORA_REPOSITORY}/check-runs/${jobIdForRun}`,
          }],
        }),
      };
    }
    const checkMatch = url.match(/\/check-runs\/(\d+)$/);
    if (checkMatch) {
      const jobIdForRun = Number(checkMatch[1]);
      const proofRunId = jobIdForRun - 1000;
      const contract = REQUIRED_RELEASE_CHECKS[proofRunId - 70000];
      return {
        ok: true,
        json: async () => ({
          name: contract.jobName,
          head_sha: sha,
          status: "completed",
          conclusion: "success",
          details_url: `https://github.com/${NEXORA_REPOSITORY}/actions/runs/${proofRunId}/job/${jobIdForRun}`,
          app: { slug: GITHUB_ACTIONS_APP_SLUG },
        }),
      };
    }
    return { ok: false, status: 404, json: async () => ({}) };
  });
  assert.equal(permitted.action, "permit");
  assert.equal(permitted.sha, sha);
});

test("R2 — Frontend CI failed", () => {
  assert.equal(release({
    check: { ...trustedCheck(), conclusion: "failure", status: "completed" },
  }).action, "deny");
});

test("R3 — Frontend Lint failed", () => {
  const lint = contractById("frontend-lint");
  assert.equal(workflowProof(lint, (parts) => ({ ...parts, jobConclusion: "failure" })), null);
  assert.equal(release({
    checks: otherProofs().filter((item) => item.workflowPath !== lint.workflowPath),
  }).action, "deny");
});

test("R4 — Backend Lint failed", () => {
  const backend = contractById("backend-lint");
  assert.equal(release({
    checks: otherProofs().filter((item) => item.workflowPath !== backend.workflowPath),
  }).action, "deny");
});

test("R5 — AI Routing Regression failed", () => {
  const routing = contractById("ai-routing");
  assert.equal(workflowProof(routing, (parts) => ({ ...parts, jobConclusion: "timed_out" })), null);
  assert.equal(release({
    checks: otherProofs().filter((item) => item.name !== routing.jobName),
  }).action, "deny");
});

test("R6 — Frontend Lint missing", () => {
  const lint = contractById("frontend-lint");
  assert.equal(release({
    checks: otherProofs().filter((item) => item.workflowPath !== lint.workflowPath),
  }).action, "deny");
});

test("R7 — Backend Lint pending", () => {
  const backend = contractById("backend-lint");
  assert.equal(workflowProof(backend, (parts) => ({
    ...parts,
    runStatus: "in_progress",
    jobStatus: "in_progress",
    jobConclusion: null,
  })), null);
  assert.equal(release({
    checks: otherProofs().map((item) => (
      item.workflowPath === backend.workflowPath
        ? { ...item, status: "in_progress", conclusion: null }
        : item
    )),
  }).action, "deny");
});

test("R8 — AI Routing cancelled", () => {
  const routing = contractById("ai-routing");
  assert.equal(workflowProof(routing, (parts) => ({ ...parts, jobConclusion: "cancelled" })), null);
  assert.equal(release({
    checks: otherProofs().map((item) => (
      item.name === routing.jobName ? { ...item, conclusion: "cancelled" } : item
    )),
  }).action, "deny");
});

test("R9 — wrong commit SHA", () => {
  assert.equal(release({ requestedSha: otherSha, mainSha: sha }).action, "deny");
  assert.equal(release({
    check: trustedCheck(otherSha),
  }).action, "deny");
});

test("R10 — wrong repository", () => {
  assert.equal(release({ repository: "other/STATESTUDIO" }).action, "deny");
});

test("R11 — wrong branch", () => {
  assert.equal(release({ ref: "refs/heads/feature" }).action, "deny");
});

test("R12 — pull-request check instead of push", () => {
  const lint = contractById("frontend-lint");
  assert.equal(workflowProof(lint, (parts) => ({ ...parts, event: "pull_request" })), null);
  assert.equal(release({
    checks: otherProofs().map((item) => (
      item.workflowPath === lint.workflowPath ? { ...item, event: "pull_request" } : item
    )),
  }).action, "deny");
});

test("R13 — spoofed workflow name", () => {
  const spoof = workflowProof(contractById("frontend-ci"), (parts) => ({
    ...parts,
    workflowPath: ".github/workflows/not-the-frontend-workflow.yml",
    jobName: "Frontend",
  }));
  assert.equal(spoof.workflowPath, ".github/workflows/not-the-frontend-workflow.yml");
  assert.equal(release({ check: spoof }).action, "deny");
});

test("R14 — wrong workflow file path", () => {
  const backend = contractById("backend-lint");
  const wrong = workflowProof(backend, (parts) => ({
    ...parts,
    workflowPath: ".github/workflows/backend-lint.yml",
  }));
  assert.equal(release({
    checks: otherProofs().map((item) => (item.name === backend.jobName ? wrong : item)),
  }).action, "deny");
});

test("R15 — untrusted application", () => {
  const lint = contractById("frontend-lint");
  assert.equal(workflowProof(lint, (parts) => ({ ...parts, appSlug: "third-party-status" })), null);
  assert.equal(release({
    checks: otherProofs().map((item) => (
      item.workflowPath === lint.workflowPath ? { ...item, appSlug: "third-party-status" } : item
    )),
  }).action, "deny");
});

test("R16 — wrong job identity", () => {
  const ci = contractById("frontend-ci");
  const wrongJob = workflowProof(ci, (parts) => ({ ...parts, jobName: "Backend" }));
  assert.equal(wrongJob.name, "Backend");
  assert.equal(release({ check: wrongJob }).action, "deny");
});

test("R17 — older success, newer failure", () => {
  const lint = contractById("frontend-lint");
  const denied = workflowProof(lint, (parts) => ({
    ...parts,
    runId: 80,
    runs: [
      {
        id: 70,
        run_attempt: 1,
        path: lint.workflowPath,
        event: REQUIRED_EVENT,
        status: "completed",
        conclusion: "success",
        head_sha: sha,
        head_branch: REQUIRED_BRANCH,
        repository: { full_name: NEXORA_REPOSITORY },
      },
      {
        id: 80,
        run_attempt: 1,
        path: lint.workflowPath,
        event: REQUIRED_EVENT,
        status: "completed",
        conclusion: "failure",
        head_sha: sha,
        head_branch: REQUIRED_BRANCH,
        repository: { full_name: NEXORA_REPOSITORY },
      },
    ],
    jobConclusion: "failure",
  }));
  assert.equal(denied, null);
  assert.equal(release({
    checks: otherProofs().filter((item) => item.workflowPath !== lint.workflowPath),
  }).action, "deny");
});

test("R18 — older failure, newer success", () => {
  const lint = contractById("frontend-lint");
  const accepted = workflowProof(lint, (parts) => ({
    ...parts,
    runId: 90,
    runs: [
      {
        id: 70,
        run_attempt: 1,
        path: lint.workflowPath,
        event: REQUIRED_EVENT,
        status: "completed",
        conclusion: "failure",
        head_sha: sha,
        head_branch: REQUIRED_BRANCH,
        repository: { full_name: NEXORA_REPOSITORY },
      },
      {
        id: 90,
        run_attempt: 1,
        path: lint.workflowPath,
        event: REQUIRED_EVENT,
        status: "completed",
        conclusion: "success",
        head_sha: sha,
        head_branch: REQUIRED_BRANCH,
        repository: { full_name: NEXORA_REPOSITORY },
      },
    ],
  }));
  assert.equal(accepted.workflowRunId, 90);
  assert.equal(release({
    checks: otherProofs().map((item) => (item.workflowPath === lint.workflowPath ? accepted : item)),
  }).action, "permit");
});

test("R19 — GitHub API error", async () => {
  for (const status of [401, 403, 404, 429, 500]) {
    const denied = await authorizeRelease({
      RELEASE_SHA: sha,
      GITHUB_REPOSITORY: NEXORA_REPOSITORY,
      GITHUB_REF: RELEASE_REF,
      GITHUB_EVENT_NAME: RELEASE_EVENT,
    }, async (url) => {
      if (url.endsWith("/commits/main")) return { ok: true, json: async () => ({ sha }) };
      if (url.includes("/contents/.github/workflows/ci.yml")) return { ok: true, text: async () => workflowText };
      return { ok: false, status, json: async () => ({ message: "unavailable" }) };
    });
    assert.equal(denied.action, "deny");
  }
});

test("R20 — missing required API fields", () => {
  const lint = contractById("frontend-lint");
  assert.equal(workflowProof(lint, (parts) => ({ ...parts, headSha: "" })), null);
  assert.equal(release({
    checks: otherProofs().map((item) => (
      item.workflowPath === lint.workflowPath ? { name: lint.jobName } : item
    )),
  }).action, "deny");
});

test("R21 — ambiguous duplicate runs", () => {
  const lint = contractById("frontend-lint");
  const ambiguous = workflowProof(lint, (parts) => ({
    ...parts,
    runs: [
      {
        id: 90,
        run_attempt: 2,
        path: lint.workflowPath,
        event: REQUIRED_EVENT,
        status: "completed",
        conclusion: "success",
        head_sha: sha,
        head_branch: REQUIRED_BRANCH,
        repository: { full_name: NEXORA_REPOSITORY },
      },
      {
        id: 90,
        run_attempt: 2,
        path: lint.workflowPath,
        event: REQUIRED_EVENT,
        status: "completed",
        conclusion: "failure",
        head_sha: sha,
        head_branch: REQUIRED_BRANCH,
        repository: { full_name: NEXORA_REPOSITORY },
      },
    ],
  }));
  assert.equal(ambiguous, null);
  const duplicated = otherProofs().filter((item) => item.workflowPath === lint.workflowPath);
  assert.equal(release({
    checks: [...otherProofs(), duplicated[0]],
  }).action, "deny");
});

test("R22 — incomplete pagination", () => {
  const lint = contractById("frontend-lint");
  assert.equal(workflowProof(lint, (parts) => ({ ...parts, totalCount: 5 })), null);
  assert.equal(release({
    checks: otherProofs().filter((item) => item.workflowPath !== lint.workflowPath),
  }).action, "deny");
});

test("R23 — only three of four checks pass", () => {
  assert.equal(release({ checks: otherProofs().slice(0, 2) }).action, "deny");
  assert.equal(release({ checks: [] }).action, "deny");
});

test("R24 — Render hook cannot run before authorization", () => {
  const workflow = readFileSync(new URL("../../.github/workflows/release.yml", import.meta.url), "utf8");
  const source = readFileSync(new URL("./releaseAuthorization.mjs", import.meta.url), "utf8");
  const authorizeAt = workflow.indexOf("node frontend/scripts/releaseAuthorization.mjs");
  const hookAt = workflow.indexOf("urlopen");
  assert.ok(authorizeAt > 0 && hookAt > authorizeAt);
  assert.doesNotMatch(workflow, /continue-on-error/);
  assert.match(workflow, /steps\.authorize\.outputs\.authorized_sha/);
  const hookNameAt = workflow.indexOf("RENDER_DEPLOY_HOOK_URL");
  assert.ok(hookNameAt > authorizeAt);
  for (const contract of REQUIRED_RELEASE_CHECKS) {
    const text = readFileSync(new URL(`../../${contract.workflowPath}`, import.meta.url), "utf8");
    assert.doesNotMatch(text, /RENDER_DEPLOY_HOOK_URL/);
  }
  assert.ok(source.indexOf("process.exit(1)") < source.indexOf("authorized_sha="));
  const denied = release({ check: null, checks: [] });
  assert.equal(denied.action, "deny");
  assert.equal(denied.sha, undefined);
});

test("R25 — push event attempts release", () => {
  assert.equal(release({ eventName: "push" }).action, "deny");
  assert.equal(release({ eventName: "pull_request" }).action, "deny");
});

test("required release checks match the workflow files", () => {
  for (const contract of REQUIRED_RELEASE_CHECKS) {
    const text = readFileSync(new URL(`../../${contract.workflowPath}`, import.meta.url), "utf8");
    assert.match(text, /^on:\n {2}push:\n/m);
    assert.match(text, new RegExp(`name: ${contract.jobName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
    assert.doesNotMatch(text, /RENDER_DEPLOY_HOOK_URL/);
  }
});
