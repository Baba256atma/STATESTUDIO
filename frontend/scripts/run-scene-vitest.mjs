#!/usr/bin/env node
/**
 * TEST-ONLY: run all active Scene Vitest files (no watch).
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listSceneTestFiles } from "./list-scene-tests.mjs";

const cwd = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(cwd);

let files;
try {
  files = listSceneTestFiles("vitest").map((file) => path.relative(cwd, file));
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
if (files.length === 0) {
  console.error("No Scene Vitest files discovered.");
  process.exit(1);
}

const vitestBin = path.join(cwd, "node_modules", ".bin", "vitest");
const result = spawnSync(vitestBin, ["run", ...files], {
  cwd,
  stdio: "inherit",
  env: process.env,
  shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
