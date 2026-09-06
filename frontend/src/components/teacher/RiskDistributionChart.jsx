import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const LEVEL_META = {
  HIGH: { label: "High", color: "var(--risk)", hex: "#EA5B5B" },
  MEDIUM: { label: "Medium", color: "var(--warning)", hex: "#EDA83F" },
  LOW: { label: "Low", color: "var(--positive)", hex: "#33C29B" },
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const row = payload[0].payload;
  return (
    <div className="trend-tooltip">
      <div className="tt-name">{LEVEL_META[row.level].label} Risk</div>
      <div className="tt-trend">{row.count} students</div>
    </div>
  );
}

export default function RiskDistributionChart({ summary }) {
  const [activeLevel, setActiveLevel] = useState(null);

  const data = useMemo(
    () => [
      { level: "HIGH", count: summary.high },
      { level: "MEDIUM", count: summary.medium },
      { level: "LOW", count: summary.low },
    ],
    [summary],
  );

  const active = activeLevel ? data.find((d) => d.level === activeLevel) : null;

  return (
    <div className="panel">
      <h3 className="panel-title">Risk Distribution</h3>
      <p className="panel-subtitle">
        Current distribution of students by academic risk level.
      </p>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barCategoryGap="30%" onMouseLeave={() => {}}>
          <XAxis
            dataKey="level"
            tickFormatter={(lvl) => LEVEL_META[lvl].label}
            tick={{ fill: "var(--text-tertiary)", fontSize: 12.5 }}
            axisLine={{ stroke: "var(--border-subtle)" }}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip cursor={false} content={<CustomTooltip />} />
          <Bar
            dataKey="count"
            radius={[8, 8, 0, 0]}
            maxBarSize={64}
            onClick={(entry) =>
              setActiveLevel(entry.level === activeLevel ? null : entry.level)
            }
            style={{ cursor: "pointer" }}
            animationDuration={500}
            activeBar={{ stroke: "none" }}
          >
            {data.map((entry) => (
              <Cell
                key={entry.level}
                fill={LEVEL_META[entry.level].hex}
                opacity={activeLevel && activeLevel !== entry.level ? 0.35 : 1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="risk-callout">
        {active ? (
          <>
            <span
              className="dot"
              style={{ background: LEVEL_META[active.level].hex }}
            />
            Number of <strong>{LEVEL_META[active.level].label} Risk</strong>{" "}
            Students: <strong>{active.count}</strong>
          </>
        ) : (
          "Click a bar to see the exact number of students at that risk level."
        )}
      </div>
    </div>
  );
}
