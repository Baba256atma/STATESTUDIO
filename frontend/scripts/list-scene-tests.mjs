#!/usr/bin/env node
/**
 * TEST-ONLY: discover active Scene test files by runner import style.
 * Excludes archived paths. Deterministic sort. No network.
 */
import fs from "node:fs";
import path from "node:path";

const SCENE_ROOT = path.resolve(process.cwd(), "app/lib/scene");

/**
 * @param {string} dir
 * @returns {string[]}
 */
function walk(dir) {
  /** @type {string[]} */
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "archive" || entry.name === "node_modules") continue;
      out.push(...walk(full));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".test.ts")) out.push(full);
  }
  return out;
}

/**
 * @param {"vitest" | "node"} runner
 * @returns {string[]}
 */
export function listSceneTestFiles(runner) {
  if (!fs.existsSync(SCENE_ROOT)) {
    throw new Error(`Scene test root missing: ${SCENE_ROOT}`);
  }
  if (!fs.statSync(SCENE_ROOT).isDirectory()) {
    throw new Error(`Scene test root is not a directory: ${SCENE_ROOT}`);
  }

  const files = walk(SCENE_ROOT).sort((a, b) => a.localeCompare(b));
  /** @type {Set<string>} */
  const seen = new Set();
  /** @type {string[]} */
  const selected = [];

  for (const file of files) {
    if (seen.has(file)) continue;
    seen.add(file);
    const text = fs.readFileSync(file, "utf8");
    const isVitest = /from\s+["']vitest["']/.test(text);
    const isNode = /from\s+["']node:test["']/.test(text);
    // Wrong-runner / dual-import files are excluded from both runners.
    if (isVitest && isNode) continue;
    if (runner === "vitest" ? isVitest : isNode) {
      selected.push(file);
    }
  }

  return selected;
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("list-scene-tests.mjs")) {
  const runner = process.argv[2] === "node" ? "node" : "vitest";
  for (const file of listSceneTestFiles(runner)) {
    console.log(path.relative(process.cwd(), file));
  }
}
