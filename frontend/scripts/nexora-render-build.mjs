/**
 * Render production build.
 *
 * On Render, Next compiles only after the Frontend GitHub check has passed
 * for RENDER_GIT_COMMIT. Anywhere else, this command runs the full typecheck
 * and then one memory-bounded compile for measurement. It does not deploy.
 */

import { randomBytes } from "node:crypto";
import { execFileSync, spawn } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  RENDER_BUILD_HEAP_MB,
  decideRenderBuild,
  fetchFrontendCheck,
  readLocalTypecheckProof,
} from "./renderBuildGate.mjs";

const frontendRoot = new URL("..", import.meta.url).pathname;
const RSS_BUDGET_KB = 7.2 * 1024 * 1024;

const sha = await git(["rev-parse", "HEAD"]);
console.log(`nexora_render_build sha=${sha} node=${process.version}`);

if (process.env.RENDER === "true") {
  const check = await fetchFrontendCheck(
    process.env.RENDER_GIT_COMMIT?.trim() || "",
    fetch,
    process.env.GITHUB_TOKEN,
  );
  const decision = decideRenderBuild({ env: process.env, check });
  if (decision.action !== "compile-after-ci") {
    console.error(decision.reason);
    process.exit(1);
  }
  process.exit(await compile(decision.heapMb, {
    NEXORA_RENDER_BUILD: "1",
    RENDER: "true",
    RENDER_GIT_COMMIT: decision.sha,
  }));
}

console.log("Local measurement: running the full TypeScript gate before the bounded compile.");
const typecheck = await run("npm", ["run", "typecheck"], {
  NODE_OPTIONS: "--max-old-space-size=8192",
});
if (typecheck !== 0) process.exit(typecheck);

const proofDir = mkdtempSync(join(tmpdir(), "nexora-typecheck-proof-"));
const proofFile = join(proofDir, "proof.json");
const nonce = randomBytes(16).toString("hex");
writeFileSync(proofFile, JSON.stringify({
  purpose: "local-measurement",
  status: "passed",
  nonce,
  sha,
  expires: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
}));
const decision = decideRenderBuild({
  env: {
    NEXORA_RENDER_BUILD: "1",
    NEXORA_LOCAL_COMPILE_MEASUREMENT: "1",
    NEXORA_LOCAL_TYPECHECK_NONCE: nonce,
  },
  localProof: readLocalTypecheckProof({
    NEXORA_LOCAL_TYPECHECK_FILE: proofFile,
  }),
});
if (decision.action !== "compile-after-ci") {
  console.error(decision.reason || "Local typecheck proof was not accepted.");
  process.exit(1);
}
const status = await compile(RENDER_BUILD_HEAP_MB, {
  NEXORA_RENDER_BUILD: "1",
  NEXORA_LOCAL_COMPILE_MEASUREMENT: "1",
  NEXORA_LOCAL_TYPECHECK_FILE: proofFile,
  NEXORA_LOCAL_TYPECHECK_NONCE: nonce,
}, join(frontendRoot, ".next-render-build"));
rmSync(proofDir, { recursive: true, force: true });
process.exit(status);

function compile(heapMb, env, distDir) {
  if (distDir) rmSync(distDir, { recursive: true, force: true });
  console.log(`nexora_render_build heap_mb=${heapMb} dist=${distDir || "default"}`);
  const childEnv = {
    ...env,
    NODE_OPTIONS: `--max-old-space-size=${heapMb}`,
  };
  if (distDir) childEnv.NEXORA_NEXT_DIST_DIR = distDir;
  return run("node", ["node_modules/next/dist/bin/next", "build"], childEnv, { sample: true }).finally(() => {
    if (distDir) rmSync(distDir, { recursive: true, force: true });
  });
}

function git(args) {
  return new Promise((resolve, reject) => {
    const child = spawn("git", args, { cwd: frontendRoot });
    let out = "";
    child.stdout.on("data", (chunk) => {
      out += chunk;
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) reject(new Error(`git ${args.join(" ")} exited ${code}`));
      else resolve(out.trim());
    });
  });
}

function run(command, args, env, options = {}) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: frontendRoot,
      env: { ...process.env, ...env },
      stdio: ["ignore", "inherit", "inherit"],
    });
    let peakKb = 0;
    let stopped = false;
    const timer = options.sample
      ? setInterval(() => {
        const rss = treeRssKb(child.pid);
        if (rss > peakKb) peakKb = rss;
        if (rss > RSS_BUDGET_KB && !stopped) {
          stopped = true;
          console.error(`nexora_render_build rss_kb=${rss} exceeded budget; stopping`);
          child.kill("SIGTERM");
        }
      }, 2000)
      : null;
    child.on("close", (code) => {
      if (timer) clearInterval(timer);
      if (options.sample) {
        console.log(`nexora_render_build peak_tree_rss_kb=${peakKb} exit=${code ?? 1}`);
      }
      resolve(code ?? 1);
    });
  });
}

function treeRssKb(pid) {
  const seen = new Set();
  const pending = [pid];
  let total = 0;
  while (pending.length > 0) {
    const current = pending.pop();
    if (!current || seen.has(current)) continue;
    seen.add(current);
    total += rssKb(current);
    for (const child of childPids(current)) pending.push(child);
  }
  return total;
}

function rssKb(pid) {
  try {
    const output = execFileSync("ps", ["-o", "rss=", "-p", String(pid)], { encoding: "utf8" });
    const value = Number(output.trim());
    return Number.isFinite(value) ? value : 0;
  } catch {
    return 0;
  }
}

function childPids(pid) {
  try {
    return execFileSync("ps", ["-ax", "-o", "pid=,ppid="], { encoding: "utf8" })
      .split("\n")
      .map((line) => line.trim().split(/\s+/).map(Number))
      .filter((pair) => pair[1] === pid)
      .map((pair) => pair[0]);
  } catch {
    return [];
  }
}
