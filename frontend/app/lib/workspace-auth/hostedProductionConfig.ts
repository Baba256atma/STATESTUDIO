/**
 * HOSTED-MVP:6 — production configuration boundary.
 *
 * Development keeps the directory database. A production Hosted process
 * requires the managed database URL and refuses the development sign-in.
 */

export type HostedProductionConfig =
  | Readonly<{ ok: true }>
  | Readonly<{ ok: false; reason: "production_configuration_missing" }>;

export function readHostedProductionConfig(
  env: Readonly<Record<string, string | undefined>>,
  nodeEnv: string | undefined,
): HostedProductionConfig {
  if (env.NEXORA_DEPLOYMENT_MODE !== "hosted" || nodeEnv !== "production") {
    return Object.freeze({ ok: true });
  }
  const origin = env.NEXTAUTH_URL?.trim() ?? "";
  let httpsOrigin = false;
  try {
    const url = new URL(origin);
    httpsOrigin = url.protocol === "https:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1";
  } catch {
    httpsOrigin = false;
  }
  const ready = Boolean(env.DATABASE_URL?.trim())
    && Boolean(env.NEXTAUTH_SECRET?.trim())
    && Boolean(env.NEXORA_LLM_GATEWAY_SECRET?.trim())
    && Boolean(env.GITHUB_ID?.trim())
    && Boolean(env.GITHUB_SECRET?.trim())
    && httpsOrigin
    && env.NEXORA_AUTH_DEV_SIGN_IN !== "true";
  return ready
    ? Object.freeze({ ok: true })
    : Object.freeze({ ok: false, reason: "production_configuration_missing" });
}

export function assertHostedProductionConfig(
  env: Readonly<Record<string, string | undefined>> = process.env,
  nodeEnv: string | undefined = process.env.NODE_ENV,
): void {
  const config = readHostedProductionConfig(env, nodeEnv);
  if (!config.ok) {
    console.error(config.reason);
    process.exit(1);
  }
}
