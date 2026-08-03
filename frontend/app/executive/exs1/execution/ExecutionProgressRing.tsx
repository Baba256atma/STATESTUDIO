import type { TaskProgress } from "./ExecutionConfig";
import { EXECUTION_TRANSITION_MS } from "./ExecutionConfig";

type Props = {
  readonly progress: TaskProgress | number;
  readonly color?: string;
  readonly size?: number;
};

/**
 * ExecutionProgressRing — static mock 0/25/50/75/100 visual.
 */
export function ExecutionProgressRing({
  progress,
  color = "#12B76A",
  size = 36,
}: Props) {
  const clamped = Math.max(0, Math.min(100, progress));
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      data-testid="execution-progress-ring"
      data-progress={clamped}
      style={{
        width: size,
        height: size,
        position: "relative",
        flexShrink: 0,
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(152,162,179,0.25)"
          strokeWidth={3}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            transition: `stroke-dashoffset ${EXECUTION_TRANSITION_MS}ms ease`,
          }}
        />
      </svg>
      <span
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          fontSize: size < 34 ? "0.48rem" : "0.55rem",
          color: "#E8EEF6",
          fontWeight: 600,
        }}
      >
        {clamped}%
      </span>
    </div>
  );
}
