import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scripts = dirname(fileURLToPath(import.meta.url));
const frontend = join(scripts, "..");
const result = spawnSync(
  join(frontend, "node_modules/.bin/tsx"),
  [join(scripts, "nxa-test-funnel-run.ts"), ...process.argv.slice(2)],
  { cwd: frontend, stdio: "inherit", env: process.env },
);
process.exit(result.status ?? 1);
