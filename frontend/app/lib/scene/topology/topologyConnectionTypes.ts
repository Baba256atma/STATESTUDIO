/**
 * Topology connection line contracts (render-only bridge).
 */

export interface SceneConnectionLine {
  id: string;
  sourceId: string;
  targetId: string;
  sourcePosition: {
    x: number;
    y: number;
    z: number;
  };
  targetPosition: {
    x: number;
    y: number;
    z: number;
  };
  valid: boolean;
}

export type TopologyConnectionDiagnostics = {
  connectionCount: number;
  validLineCount: number;
  invalidLineCount: number;
  warnings: string[];
};

export type TopologyConnectionResolution = {
  lines: SceneConnectionLine[];
  diagnostics: TopologyConnectionDiagnostics;
};
