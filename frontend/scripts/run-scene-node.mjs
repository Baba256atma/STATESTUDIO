#!/usr/bin/env node
/**
 * TEST-ONLY: run all active Scene node:test files via the repository-local
 * TypeScript-aware loader (`jiti/register`). Compatible with Node 20+.
 *
 * Requires direct pinned `jiti@2.6.1` in frontend/package.json (devDependency).
 * Does not rewrite production imports. Does not convert suites to Vitest.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { listSceneTestFiles } from "./list-scene-tests.mjs";

const cwd = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(cwd);
const requireFromCwd = createRequire(path.join(cwd, "package.json"));

/**
 * Resolve jiti/register from local node_modules without requiring a direct dep.
 * @returns {string}
 */
function resolveJitiRegister() {
  const candidates = [
    () => requireFromCwd.resolve("jiti/lib/jiti-register.mjs"),
    () => requireFromCwd.resolve("jiti/register"),
    () => path.join(cwd, "node_modules/jiti/lib/jiti-register.mjs"),
    () => path.join(cwd, "node_modules/jiti/lib/jiti-register.cjs"),
  ];
  for (const candidate of candidates) {
    try {
      const resolved = candidate();
      if (resolved && fs.existsSync(resolved)) return resolved;
    } catch {
      // try next
    }
  }
  throw new Error(
    "Scene node:test runner requires pinned `jiti@2.6.1` as a frontend devDependency. Run npm install in frontend/."
  );
}

let files;
try {
  files = listSceneTestFiles("node").map((file) => path.relative(cwd, file));
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
if (files.length === 0) {
  console.error("No Scene node:test files discovered.");
  process.exit(1);
}

let jitiRegister;
try {
  jitiRegister = resolveJitiRegister();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}

const importSpecifier = pathToFileURL(jitiRegister).href;
const result = spawnSync(
  process.execPath,
  ["--import", importSpecifier, "--test", ...files],
  { cwd, stdio: "inherit", env: process.env }
);

process.exit(result.status ?? 1);
