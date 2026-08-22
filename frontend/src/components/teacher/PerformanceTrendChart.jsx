import { useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  ReferenceLine,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const TREND_META = {
  IMPROVING: { label: 'Improving', hex: '#33C29B' },
  STABLE: { label: 'Stable', hex: '#EDA83F' },
  DECLINING: { label: 'Declining', hex: '#EA5B5B' },
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const row = payload[0].payload;
  return (
    <div className="trend-tooltip">
      <div className="tt-name">{row.student_name}</div>
      <div className="tt-id">{row.student_id}</div>
      <div className="tt-trend" style={{ color: TREND_META[row.trend].hex }}>
        Trend: {TREND_META[row.trend].label}
      </div>
    </div>
  );
}

export default function PerformanceTrendChart({ students }) {
  const [pinned, setPinned] = useState(null);

  const data = students.map((s, i) => ({
    ...s,
    x: i + 1,
  }));

  return (
    <div className="panel">
      <h3 className="panel-title">Student Performance Trend</h3>
      <p className="panel-subtitle">Identify students who are improving, stable or declining.</p>

      <ResponsiveContainer width="100%" height={220}>
        <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
          <XAxis type="number" dataKey="x" hide domain={[0, data.length + 1]} />
          <YAxis type="number" dataKey="trend_score" hide domain={[-50, 50]} />
          <ZAxis range={[90, 90]} />
          <ReferenceLine
            y={0}
            stroke="var(--text-tertiary)"
            strokeDasharray="4 4"
            strokeWidth={1.5}
          />
          <Tooltip
            cursor={{ strokeDasharray: '2 2' }}
            content={<CustomTooltip />}
            onMouseEnter={undefined}
          />
          <Scatter
            data={data}
            onClick={(entry) => setPinned(entry)}
            style={{ cursor: 'pointer' }}
            animationDuration={500}
          >
            {data.map((entry) => (
              <Cell key={entry.student_id} fill={TREND_META[entry.trend].hex} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>

      <div className="trend-legend">
        <span className="trend-legend-item">
          <span className="trend-legend-dot" style={{ background: TREND_META.IMPROVING.hex }} /> Improving
        </span>
        <span className="trend-legend-item">
          <span className="trend-legend-dot" style={{ background: TREND_META.STABLE.hex }} /> Stable
        </span>
        <span className="trend-legend-item">
          <span className="trend-legend-dot" style={{ background: TREND_META.DECLINING.hex }} /> Declining
        </span>
        <span className="trend-legend-item">
          <span className="trend-legend-line" /> Stability Line
        </span>
      </div>

      {pinned && (
        <div className="risk-callout" style={{ marginTop: 14 }}>
          <span className="dot" style={{ background: TREND_META[pinned.trend].hex }} />
          <strong>{pinned.student_name}</strong>&nbsp;({pinned.student_id}) — Trend:{' '}
          <strong>{TREND_META[pinned.trend].label}</strong>
        </div>
      )}
    </div>
  );
}
