export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startNexoraBackgroundMonitoringServer } = await import("./app/lib/data-reality/backgroundMonitoringServer");
    startNexoraBackgroundMonitoringServer();
  }
}
