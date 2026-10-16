export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { assertHostedProductionConfig } = await import("./app/lib/workspace-auth/hostedProductionConfig");
    assertHostedProductionConfig();
    const { startNexoraBackgroundMonitoringServer } = await import("./app/lib/data-reality/backgroundMonitoringServer");
    startNexoraBackgroundMonitoringServer();
  }
}
