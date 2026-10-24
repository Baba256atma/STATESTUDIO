import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import {
  FRONTEND_CHECK_NAME,
  GITHUB_ACTIONS_APP_SLUG,
  NEXORA_REPOSITORY,
  RENDER_BUILD_HEAP_MB,
  REQUIRED_BRANCH,
  REQUIRED_EVENT,
  WORKFLOW_PATH,
  decideRenderBuild,
  fetchFrontendCheck,
  frontendCheckFromApiPayloads,
} from "./renderBuildGate.mjs";
import { planRenderBuildEntry } from "./renderBuildEntry.mjs";

const sha = "1dead5f6abd8500be70c74d4fe34dee1c9f812f5";
const otherSha = "a".repeat(40);
const runId = 39499416170;
const jobId = 118892799464;
const checkRunId = 555;

function run(overrides = {}) {
  return {
    id: runId,
    run_attempt: 1,
    path: WORKFLOW_PATH,
    event: REQUIRED_EVENT,
    status: "in_progress",
    conclusion: null,
    head_sha: sha,
    head_branch: REQUIRED_BRANCH,
    repository: { full_name: NEXORA_REPOSITORY },
    ...overrides,
  };
}

function jobs(overrides = {}) {
  return {
    total_count: 1,
    jobs: [{
      id: jobId,
      name: FRONTEND_CHECK_NAME,
      status: "completed",
      conclusion: "success",
      head_sha: sha,
      run_id: runId,
      check_run_url: `https://api.github.com/repos/${NEXORA_REPOSITORY}/check-runs/${checkRunId}`,
      ...overrides,
    }],
  };
}

function check(overrides = {}) {
  return {
    name: FRONTEND_CHECK_NAME,
    head_sha: sha,
    status: "completed",
    conclusion: "success",
    details_url: `https://github.com/${NEXORA_REPOSITORY}/actions/runs/${runId}/job/${jobId}`,
    app: { slug: GITHUB_ACTIONS_APP_SLUG },
    ...overrides,
  };
}

function evidence(overrides = {}) {
  return frontendCheckFromApiPayloads({
    sha,
    runs: { total_count: 1, workflow_runs: [run(overrides.run)] },
    jobs: jobs(overrides.job),
    check: check(overrides.check),
  });
}

const passed = evidence();

function renderEnv(extra = {}) {
  return {
    NEXORA_RENDER_BUILD: "1",
    RENDER: "true",
    RENDER_GIT_COMMIT: sha,
    RENDER_GIT_BRANCH: REQUIRED_BRANCH,
    ...extra,
  };
}

test("normal builds keep TypeScript validation", () => {
  const decision = decideRenderBuild({ env: {} });
  assert.equal(decision.action, "full-typecheck");
  assert.equal(decision.ignoreBuildErrors, false);
  const renderAlone = decideRenderBuild({
    env: { NEXORA_RENDER_BUILD: "1", RENDER_GIT_COMMIT: sha, RENDER_GIT_BRANCH: REQUIRED_BRANCH },
    check: passed,
  });
  assert.equal(renderAlone.action, "refuse");
});

test("Render skips TypeScript only after the Frontend check passes for the same commit", () => {
  const decision = decideRenderBuild({ env: renderEnv(), check: passed });
  assert.equal(decision.action, "compile-after-ci");
  assert.equal(decision.ignoreBuildErrors, true);
  assert.equal(decision.sha, sha);
  assert.equal(decision.heapMb, RENDER_BUILD_HEAP_MB);
  assert.equal(decideRenderBuild({
    env: renderEnv(),
    check: evidence({ job: { conclusion: "failure" } }),
  }).action, "refuse");
  assert.equal(decideRenderBuild({
    env: renderEnv({ RENDER_GIT_COMMIT: otherSha }),
    check: passed,
  }).action, "refuse");
  assert.equal(decideRenderBuild({
    env: renderEnv(),
    check: { name: FRONTEND_CHECK_NAME, sha, conclusion: "success" },
  }).action, "refuse");
});

test("a local measurement flag cannot authorize Render", () => {
  const decision = decideRenderBuild({
    env: renderEnv({
      NEXORA_LOCAL_COMPILE_MEASUREMENT: "1",
      NEXORA_LOCAL_TYPECHECK_NONCE: "0123456789abcdef",
    }),
    check: passed,
    localProof: {
      purpose: "local-measurement",
      status: "passed",
      nonce: "0123456789abcdef",
      sha,
      expires: new Date(Date.now() + 60_000).toISOString(),
    },
  });
  assert.equal(decision.action, "refuse");
  assert.match(decision.reason, /local measurement flag/);
});

test("a display name is not provenance", () => {
  assert.equal(evidence({ run: { path: ".github/workflows/frontend-lint.yml" } }), null);
  assert.equal(evidence({ check: { app: { slug: "other-app" } } }), null);
  assert.equal(evidence({ run: { head_sha: otherSha } }), null);
  assert.equal(evidence({ run: { head_branch: "feature" } }), null);
  assert.equal(evidence({ job: { conclusion: "failure" } }), null);
  assert.equal(evidence({ job: { status: "in_progress", conclusion: null } }), null);
  assert.equal(evidence({ job: { conclusion: "skipped" } }), null);
  assert.equal(evidence({ job: { conclusion: "cancelled" } }), null);
  assert.equal(frontendCheckFromApiPayloads({
    sha,
    runs: { total_count: 1, workflow_runs: [run()] },
    jobs: { total_count: 0, jobs: [] },
    check: check(),
  }), null);
  assert.equal(frontendCheckFromApiPayloads({
    sha,
    runs: { total_count: 1, workflow_runs: [run()] },
    jobs: {
      total_count: 2,
      jobs: [jobs().jobs[0], { ...jobs().jobs[0], id: jobId + 1 }],
    },
    check: check(),
  }), null);
  assert.equal(frontendCheckFromApiPayloads({
    sha,
    runs: { total_count: 5, workflow_runs: [run()] },
    jobs: jobs(),
    check: check(),
  }), null);
  assert.equal(evidence({ run: { status: "queued" } }), null);
  assert.equal(frontendCheckFromApiPayloads({ sha, runs: { unexpected: true }, jobs: jobs(), check: check() }), null);
  assert.equal(decideRenderBuild({
    env: renderEnv({ RENDER_GIT_BRANCH: "feature" }),
    check: passed,
  }).action, "refuse");
});

test("the newest workflow run is authoritative and an in-progress deploy does not deadlock", () => {
  const older = run({ id: runId - 1, status: "completed", conclusion: "success" });
  const newestFailed = run({ id: runId, status: "completed", conclusion: "failure" });
  assert.equal(frontendCheckFromApiPayloads({
    sha,
    runs: { total_count: 2, workflow_runs: [older, newestFailed] },
    jobs: jobs({ conclusion: "failure", run_id: runId }),
    check: check({ conclusion: "failure" }),
  }), null);
  const accepted = frontendCheckFromApiPayloads({
    sha,
    runs: {
      total_count: 2,
      workflow_runs: [
        run({ id: runId - 1, status: "completed", conclusion: "failure" }),
        run({ id: runId, status: "in_progress", conclusion: null }),
      ],
    },
    jobs: jobs(),
    check: check(),
  });
  assert.equal(accepted.workflowRunId, runId);
  assert.equal(accepted.workflowStatus, "in_progress");
  assert.equal(decideRenderBuild({ env: renderEnv(), check: accepted }).action, "compile-after-ci");
  assert.equal(frontendCheckFromApiPayloads({
    sha,
    runs: {
      total_count: 2,
      workflow_runs: [
        run({ id: runId, run_attempt: 2, status: "completed", conclusion: "success" }),
        run({ id: runId, run_attempt: 2, status: "completed", conclusion: "failure" }),
      ],
    },
    jobs: jobs(),
    check: check(),
  }), null);
});

test("a failed newest run is not rescued by an older success", async () => {
  const urls = [];
  const result = await fetchFrontendCheck(sha, async (url) => {
    urls.push(url);
    if (url.includes("/actions/workflows/ci.yml/runs")) {
      return {
        ok: true,
        json: async () => ({
          total_count: 2,
          workflow_runs: [
            run({ id: 10, status: "completed", conclusion: "success" }),
            run({ id: 20, status: "completed", conclusion: "failure" }),
          ],
        }),
      };
    }
    if (url.includes("/actions/runs/20/jobs")) {
      return { ok: true, json: async () => jobs({ run_id: 20, conclusion: "failure" }) };
    }
    return { ok: false, json: async () => ({}) };
  });
  assert.equal(result, null);
  assert.equal(urls.some((url) => url.includes("/runs/10/")), false);
  assert.equal(urls.some((url) => url.includes("/runs/20/jobs")), true);
});

test("check lookup does not send or echo a token when none is configured", async () => {
  const seen = [];
  const checkResult = await fetchFrontendCheck(sha, async (url, options) => {
    seen.push({ url, authorization: options.headers.Authorization });
    if (url.includes("/actions/workflows/ci.yml/runs")) {
      return { ok: true, json: async () => ({ total_count: 1, workflow_runs: [run()] }) };
    }
    if (url.includes(`/actions/runs/${runId}/jobs`)) {
      return { ok: true, json: async () => jobs() };
    }
    if (url.endsWith(`/check-runs/${checkRunId}`)) {
      return { ok: true, json: async () => check() };
    }
    return { ok: false, json: async () => ({}) };
  });
  assert.equal(seen.every((call) => call.authorization === undefined), true);
  assert.match(seen[0].url, new RegExp(`/repos/${NEXORA_REPOSITORY}/actions/workflows/ci.yml/runs`));
  assert.equal(checkResult.appSlug, GITHUB_ACTIONS_APP_SLUG);
  assert.equal(JSON.stringify(checkResult).includes("token"), false);
  const failed = await fetchFrontendCheck(sha, async () => {
    throw new Error("network down");
  });
  assert.equal(failed, null);
  const denied = await fetchFrontendCheck(sha, async () => ({ ok: false, json: async () => ({}) }));
  assert.equal(denied, null);
});

test("the local build script still typechecks and the Render script uses the bounded heap", () => {
  const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(pkg.scripts.build, "NODE_OPTIONS='--max-old-space-size=8192' next build");
  assert.match(pkg.scripts["build:render"], /nexora-render-build\.mjs/);
  const script = readFileSync(new URL("./nexora-render-build.mjs", import.meta.url), "utf8");
  const config = readFileSync(new URL("../next.config.ts", import.meta.url), "utf8");
  const workflow = readFileSync(new URL("../../.github/workflows/ci.yml", import.meta.url), "utf8");
  assert.match(script, /max-old-space-size=8192/);
  assert.match(script, /RENDER_BUILD_HEAP_MB/);
  assert.match(script, /planRenderBuildEntry/);
  assert.doesNotMatch(script, /console\.error\(decision\.reason\)/);
  assert.doesNotMatch(script, /process\.env\.NEXORA_RENDER_BUILD\s*=/);
  assert.doesNotMatch(config, /ignoreBuildErrors:\s*true/);
  assert.match(config, /decideRenderBuild/);
  assert.match(workflow, /hostedWorkspaceAuthorization\.test\.ts/);
  assert.doesNotMatch(workflow, /RENDER_DEPLOY_HOOK_URL/);
  assert.doesNotMatch(workflow, /api\.render\.com/);
  const release = readFileSync(new URL("../../.github/workflows/release.yml", import.meta.url), "utf8");
  assert.match(release, /^name: Release\n\non:\n  workflow_dispatch:\n/);
  assert.doesNotMatch(release, /\n {2}push:\n/);
  assert.doesNotMatch(release, /pull_request:/);
  assert.doesNotMatch(release, /workflow_run:/);
  assert.match(release, /steps\.authorize\.outputs\.authorized_sha/);
  assert.match(release, /len\(sha\) != 40/);
});

function renderShell(extra = {}) {
  return {
    RENDER: "true",
    RENDER_GIT_BRANCH: REQUIRED_BRANCH,
    RENDER_GIT_COMMIT: sha,
    ...extra,
  };
}

function assertRefused(plan) {
  assert.equal(plan.action, "refuse");
  assert.equal(plan.compile, false);
  assert.equal(plan.exitCode, 1);
  assert.equal(typeof plan.message, "string");
  assert.equal(plan.message.includes("undefined"), false);
  assert.equal(plan.message.length > 0, true);
}

test("authorized Render entry sets the build mode before the CI gate", () => {
  const env = renderShell();
  const plan = planRenderBuildEntry({ env, check: passed });
  assert.equal(env.NEXORA_RENDER_BUILD, undefined);
  assert.equal(plan.gateEnv.NEXORA_RENDER_BUILD, "1");
  assert.equal(plan.gateEnv.RENDER, "true");
  assert.equal(plan.action, "compile-after-ci");
  assert.equal(plan.compile, true);
  assert.equal(plan.decision.sha, sha);
  assert.equal(plan.decision.heapMb, RENDER_BUILD_HEAP_MB);
  assert.equal(plan.decision.ignoreBuildErrors, true);
});

test("missing Frontend CI refuses the Render entry before compilation", () => {
  assertRefused(planRenderBuildEntry({ env: renderShell(), check: null }));
});

test("failed Frontend CI refuses the Render entry before compilation", () => {
  assertRefused(planRenderBuildEntry({
    env: renderShell(),
    check: evidence({ job: { conclusion: "failure" } }),
  }));
});

test("trusted CI for a different SHA refuses the Render entry", () => {
  assertRefused(planRenderBuildEntry({
    env: renderShell({ RENDER_GIT_COMMIT: otherSha }),
    check: passed,
  }));
});

test("untrusted provenance refuses the Render entry", () => {
  assertRefused(planRenderBuildEntry({
    env: renderShell(),
    check: evidence({ check: { app: { slug: "untrusted-app" } } }),
  }));
});

test("a non-main branch refuses the Render entry", () => {
  assertRefused(planRenderBuildEntry({
    env: renderShell({ RENDER_GIT_BRANCH: "feature/test" }),
    check: passed,
  }));
});

test("GitHub API failure refuses the Render entry", async () => {
  const check = await fetchFrontendCheck(sha, async () => {
    throw new Error("network down");
  });
  assert.equal(check, null);
  assertRefused(planRenderBuildEntry({ env: renderShell(), check }));
});

test("a local environment does not enter the Render shortcut", () => {
  const env = {};
  const plan = planRenderBuildEntry({ env, check: passed });
  assert.equal(plan.action, "local");
  assert.equal(plan.compile, false);
  assert.equal(plan.gateEnv.NEXORA_RENDER_BUILD, undefined);
  const local = decideRenderBuild({ env });
  assert.equal(local.action, "full-typecheck");
  assert.equal(local.ignoreBuildErrors, false);
});

test("an unexpected Render decision is reported and does not compile", () => {
  const plan = planRenderBuildEntry({
    env: renderShell(),
    check: passed,
    decide: () => ({ action: "full-typecheck" }),
  });
  assert.equal(plan.action, "unexpected");
  assert.equal(plan.compile, false);
  assert.equal(plan.exitCode, 1);
  assert.equal(plan.message, "nexora_render_build unexpected_decision=full-typecheck");
  assert.equal(plan.message.includes("undefined"), false);
});

test("a refusal without a reason still prints an explicit diagnostic", () => {
  const plan = planRenderBuildEntry({
    env: renderShell(),
    check: null,
    decide: () => ({ action: "refuse" }),
  });
  assert.equal(plan.message, "Render build refused.");
  assert.equal(plan.compile, false);
});
