import type { SceneJson } from "../sceneTypes";

export const DEVOPS_SERVICE_RELIABILITY_DEMO_NAME = "DevOps Service Resilience Demo";

export const devopsServiceReliabilityDemoScene: SceneJson = {
  meta: {
    demo_id: "devops_dependency_failure_demo",
    demo_name: DEVOPS_SERVICE_RELIABILITY_DEMO_NAME,
  },
  state_vector: { intensity: 0.58, volatility: 0.44 },
  scene: {
    scene: { intensity: 0.58, volatility: 0.44 },
    camera: {
      autoFrame: true,
      pos: [1.5, 7.4, 14.4],
      lookAt: [1, 0, 0],
    },
    kpi: {
      reliability: 0.52,
      latency: 0.61,
      error_rate: 0.57,
    },
    objects: [
      { id: "obj_traffic_1", label: "User Traffic", type: "cone", position: [-8.5, 0, 0], transform: { pos: [-8.5, 0, 0] }, color: "#8B5CF6", emphasis: 0.48, role: "support_node", semantic: { role: "support_node", category: "traffic", domain: "devops_system", tags: ["traffic", "load", "requests"], keywords: ["traffic", "request load", "user traffic"], related_terms: ["volume", "inflow", "request surge"], business_meaning: "Ingress load entering the service stack and applying pressure to upstream systems.", dependencies: ["obj_api_gateway_1"] } },
      { id: "obj_api_gateway_1", label: "API Gateway", type: "torus", position: [-5.5, 0, 0], transform: { pos: [-5.5, 0, 0] }, color: "#0EA5E9", emphasis: 0.63, role: "flow_node", semantic: { role: "flow_node", category: "entrypoint", domain: "devops_system", tags: ["api", "gateway", "routing"], keywords: ["api gateway", "gateway", "edge"], related_terms: ["ingress", "routing", "traffic manager"], business_meaning: "Entry service that routes requests into the dependency chain and concentrates traffic pressure.", dependencies: ["obj_auth_service_1", "obj_cache_1"] } },
      { id: "obj_auth_service_1", label: "Auth Service", type: "box", position: [-2.2, 0, 0], transform: { pos: [-2.2, 0, 0] }, color: "#2563EB", emphasis: 0.67, role: "operational_node", semantic: { role: "operational_node", category: "service", domain: "devops_system", tags: ["service", "auth", "runtime"], keywords: ["auth service", "identity service", "auth"], related_terms: ["identity", "token", "session"], business_meaning: "Critical application service whose instability propagates to downstream platform reliability.", dependencies: ["obj_database_1", "obj_queue_1"] } },
      { id: "obj_database_1", label: "Primary Database", type: "sphere", position: [1.4, -0.8, 0], transform: { pos: [1.4, -0.8, 0] }, color: "#F59E0B", emphasis: 0.72, role: "dependency_node", semantic: { role: "dependency_node", category: "data", domain: "devops_system", tags: ["database", "storage", "latency"], keywords: ["database", "db", "storage"], related_terms: ["query", "persistence", "data layer"], business_meaning: "Core dependency whose latency or failure creates concentrated service fragility.", dependencies: ["obj_worker_pool_1"] } },
      { id: "obj_queue_1", label: "Job Queue", type: "cylinder", position: [1.8, 2.5, 0], transform: { pos: [1.8, 2.5, 0] }, color: "#22C55E", emphasis: 0.58, role: "buffer_node", semantic: { role: "buffer_node", category: "buffer", domain: "devops_system", tags: ["queue", "backlog", "buffer"], keywords: ["queue", "backlog", "message queue"], related_terms: ["buffer", "pending work", "async pipeline"], business_meaning: "Runtime buffer that absorbs load but becomes a visible bottleneck when backlog accumulates.", dependencies: ["obj_worker_pool_1"] } },
      { id: "obj_worker_pool_1", label: "Worker Pool", type: "box", position: [5.1, 1.4, 0], transform: { pos: [5.1, 1.4, 0] }, color: "#84CC16", emphasis: 0.56, role: "operational_node", semantic: { role: "operational_node", category: "compute", domain: "devops_system", tags: ["worker", "throughput", "processing"], keywords: ["worker pool", "workers", "compute"], related_terms: ["processor", "executor", "async workers"], business_meaning: "Execution layer that determines whether buffered work clears or turns into a service bottleneck.", dependencies: ["obj_uptime_1", "obj_error_rate_1"] } },
      { id: "obj_cache_1", label: "Cache Layer", type: "sphere", position: [-1.5, 3.2, 0], transform: { pos: [-1.5, 3.2, 0] }, color: "#14B8A6", emphasis: 0.46, role: "buffer_node", semantic: { role: "buffer_node", category: "resilience", domain: "devops_system", tags: ["cache", "resilience", "latency"], keywords: ["cache", "cache layer", "cache miss"], related_terms: ["hot path", "read optimization", "fallback"], business_meaning: "Protective layer that stabilizes latency until it fails or saturates under pressure.", dependencies: ["obj_auth_service_1"] } },
      { id: "obj_latency_1", label: "Latency Pressure", type: "icosahedron", position: [0.2, 5, 0], transform: { pos: [0.2, 5, 0] }, color: "#F97316", emphasis: 0.64, role: "risk_source", semantic: { role: "risk_source", category: "performance_pressure", domain: "devops_system", tags: ["latency", "pressure", "performance"], keywords: ["latency", "slowdown", "response time"], related_terms: ["delay", "tail latency", "performance degradation"], business_meaning: "Operational pressure source that amplifies dependency strain and service instability.", dependencies: ["obj_database_1", "obj_api_gateway_1"] } },
      { id: "obj_error_rate_1", label: "Error Rate", type: "icosahedron", position: [6.8, 4.2, 0], transform: { pos: [6.8, 4.2, 0] }, color: "#DC2626", emphasis: 0.61, role: "kpi_sensitive_node", semantic: { role: "kpi_sensitive_node", category: "quality", domain: "devops_system", tags: ["errors", "failures", "quality"], keywords: ["error rate", "failures", "incident rate"], related_terms: ["exceptions", "faults", "service errors"], business_meaning: "Reliability KPI showing when localized dependency issues have become user-visible failures.", dependencies: ["obj_uptime_1"] } },
      { id: "obj_uptime_1", label: "Service Reliability", type: "sphere", position: [8.8, 0.6, 0], transform: { pos: [8.8, 0.6, 0] }, color: "#38BDF8", emphasis: 0.52, role: "customer_or_outcome_node", semantic: { role: "customer_or_outcome_node", category: "outcome", domain: "devops_system", tags: ["uptime", "reliability", "availability"], keywords: ["service uptime", "reliability", "availability"], related_terms: ["service health", "continuity", "availability"], business_meaning: "Top-level reliability outcome reflecting whether the platform remains stable for users.", dependencies: [] } },
    ],
    relations: [
      { from: "obj_traffic_1", to: "obj_api_gateway_1", type: "flow" },
      { from: "obj_api_gateway_1", to: "obj_auth_service_1", type: "dependency" },
      { from: "obj_api_gateway_1", to: "obj_cache_1", type: "dependency" },
      { from: "obj_auth_service_1", to: "obj_database_1", type: "dependency" },
      { from: "obj_auth_service_1", to: "obj_queue_1", type: "dependency" },
      { from: "obj_queue_1", to: "obj_worker_pool_1", type: "flow" },
      { from: "obj_database_1", to: "obj_worker_pool_1", type: "dependency" },
      { from: "obj_worker_pool_1", to: "obj_uptime_1", type: "flow" },
      { from: "obj_worker_pool_1", to: "obj_error_rate_1", type: "dependency" },
      { from: "obj_latency_1", to: "obj_database_1", type: "pressure" },
      { from: "obj_latency_1", to: "obj_api_gateway_1", type: "pressure" },
      { from: "obj_error_rate_1", to: "obj_uptime_1", type: "risk" },
      { from: "obj_cache_1", to: "obj_auth_service_1", type: "flow" },
    ],
    loops: [
      {
        id: "loop_devops_dependency_chain",
        type: "service_reliability",
        label: "Service Dependency Chain",
        edges: [
          { from: "obj_traffic_1", to: "obj_api_gateway_1", weight: 0.68, polarity: "positive", kind: "flow" },
          { from: "obj_api_gateway_1", to: "obj_auth_service_1", weight: 0.74, polarity: "positive", kind: "dependency" },
          { from: "obj_auth_service_1", to: "obj_database_1", weight: 0.77, polarity: "positive", kind: "dependency" },
          { from: "obj_auth_service_1", to: "obj_queue_1", weight: 0.62, polarity: "positive", kind: "dependency" },
          { from: "obj_queue_1", to: "obj_worker_pool_1", weight: 0.64, polarity: "positive", kind: "flow" },
          { from: "obj_worker_pool_1", to: "obj_uptime_1", weight: 0.72, polarity: "positive", kind: "flow" },
        ],
      },
      {
        id: "loop_devops_latency_pressure",
        type: "risk_ignorance",
        label: "Latency Pressure Loop",
        edges: [
          { from: "obj_latency_1", to: "obj_database_1", weight: 0.79, polarity: "negative", kind: "pressure" },
          { from: "obj_database_1", to: "obj_auth_service_1", weight: 0.72, polarity: "negative", kind: "dependency" },
          { from: "obj_auth_service_1", to: "obj_queue_1", weight: 0.58, polarity: "negative", kind: "dependency" },
          { from: "obj_queue_1", to: "obj_worker_pool_1", weight: 0.67, polarity: "negative", kind: "flow" },
          { from: "obj_worker_pool_1", to: "obj_error_rate_1", weight: 0.66, polarity: "negative", kind: "dependency" },
          { from: "obj_error_rate_1", to: "obj_uptime_1", weight: 0.71, polarity: "negative", kind: "risk" },
        ],
      },
    ],
    active_loop: "loop_devops_dependency_chain",
    loops_suggestions: ["Contain the unstable dependency", "Protect queue and worker recovery capacity"],
  },
};

export const devopsServiceReliabilityDemoAnalysis = {
  reply:
    "DevOps service resilience demo loaded. Dependency and latency pressure are elevated; try a prompt like 'database latency' to see how instability propagates through the stack.",
  scene_json: devopsServiceReliabilityDemoScene,
  fragility: {
    score: 0.66,
    level: "high",
    drivers: {
      dependency_load: 0.71,
      latency_pressure: 0.74,
      recovery_gap: 0.58,
    },
  },
  conflicts: [
    { pair: ["obj_database_1", "obj_auth_service_1"], score: 0.73 },
    { pair: ["obj_queue_1", "obj_worker_pool_1"], score: 0.64 },
  ],
  object_selection: {
    rankings: [
      { id: "obj_database_1", score: 0.82, why: "Database latency is the clearest dependency concentration point." },
      { id: "obj_auth_service_1", score: 0.76, why: "The auth service fans instability into multiple downstream paths." },
      { id: "obj_queue_1", score: 0.7, why: "Queue backlog is the main buffer that can turn pressure into cascading delay." },
    ],
    highlighted_objects: ["obj_database_1", "obj_auth_service_1", "obj_queue_1"],
  },
  risk_propagation: {
    edges: [
      { from: "obj_latency_1", to: "obj_database_1", weight: 0.77 },
      { from: "obj_database_1", to: "obj_auth_service_1", weight: 0.73 },
      { from: "obj_auth_service_1", to: "obj_queue_1", weight: 0.62 },
      { from: "obj_queue_1", to: "obj_worker_pool_1", weight: 0.59 },
      { from: "obj_worker_pool_1", to: "obj_uptime_1", weight: 0.57 },
    ],
    summary: "Latency pressure is propagating through the database, auth service, and queue into broader service reliability risk.",
  },
  strategic_advice: {
    recommended_actions: [
      {
        type: "contain_dependency",
        action: "Contain the unstable dependency path and shed non-critical load",
        targets: ["obj_database_1", "obj_auth_service_1"],
        impact: "Limits cascading latency and prevents the core dependency chain from destabilizing the whole service.",
        priority: 1,
      },
      {
        type: "protect_recovery",
        action: "Protect queue recovery capacity and worker throughput",
        targets: ["obj_queue_1", "obj_worker_pool_1"],
        impact: "Stops backlog growth from turning into broader reliability failure.",
        priority: 2,
      },
    ],
    primary_recommendation: {
      type: "contain_dependency",
      action: "Contain the unstable dependency path and shed non-critical load",
      targets: ["obj_database_1", "obj_auth_service_1"],
      impact: "Limits cascading latency and prevents the core dependency chain from destabilizing the whole service.",
      priority: 1,
    },
    why: "Database and auth-service instability are already pushing the queue and reliability KPIs toward a broader service event.",
    confidence: 0.84,
    summary: "Best next move is to contain the dependency hotspot before it turns into a full reliability incident.",
  },
  opponent_model: {
    actor: { id: "runtime_instability", label: "Runtime Instability" },
    possible_moves: [
      { id: "amplify_latency", label: "Amplify latency under peak load", impact: "Pushes the service chain into timeout and error-rate pressure." },
    ],
    best_response: {
      id: "reduce_dependency_strain",
      label: "Reduce dependency strain and protect recovery path",
      targets: ["obj_database_1", "obj_queue_1"],
      why: "These nodes are the most exposed technical pressure points in the current stack.",
    },
    strategic_risk: 0.71,
    summary: "Instability is most likely to exploit the data and queue recovery path.",
  },
  strategic_patterns: {
    detected_patterns: [
      {
        id: "pattern_dependency_latency_cascade",
        label: "Dependency latency cascade",
        frequency: 5,
        avg_fragility: 0.64,
        key_objects: ["obj_database_1", "obj_auth_service_1", "obj_queue_1"],
        why: "Latency repeatedly concentrates in a dependency chain before appearing as service reliability loss.",
      },
    ],
    top_pattern: {
      id: "pattern_dependency_latency_cascade",
      label: "Dependency latency cascade",
      frequency: 5,
      avg_fragility: 0.64,
      key_objects: ["obj_database_1", "obj_auth_service_1", "obj_queue_1"],
      why: "Latency repeatedly concentrates in a dependency chain before appearing as service reliability loss.",
    },
    summary: "Most repeated pattern is latency-driven dependency fragility across the service stack.",
  },
};
