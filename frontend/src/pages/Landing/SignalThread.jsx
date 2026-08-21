import "./SignalThread.css";

/**
 * SignalThread — the page's recurring visual motif.
 *
 * stage="scattered"  -> used in the Problem section: disconnected data points
 * stage="connecting" -> used in the Solution section: points join into a line
 * stage="resolved"   -> used in How It Works: line resolves into a signal + arrow
 *
 * The same five node positions are reused across all three stages so the eye
 * recognizes it as one evolving idea, not three unrelated graphics.
 */
const NODES = [
  [10, 40],
  [55, 22],
  [100, 46],
  [145, 18],
  [190, 34],
];

function SignalThread({ stage = "scattered" }) {
  const pathD = `M${NODES.map(([x, y]) => `${x},${y}`).join(" L")}`;

  return (
    <svg
      viewBox="0 0 200 60"
      className={`signal-thread signal-thread--${stage}`}
      role="presentation"
      aria-hidden="true"
    >
      {stage !== "scattered" && (
        <path d={pathD} className="signal-thread__path" fill="none" strokeWidth="1.6" />
      )}
      {NODES.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={stage === "resolved" && i === NODES.length - 1 ? 5 : 3}
          className="signal-thread__node"
          style={{ animationDelay: `${i * 90}ms` }}
        />
      ))}
      {stage === "resolved" && (
        <circle
          cx={NODES[NODES.length - 1][0]}
          cy={NODES[NODES.length - 1][1]}
          r="9"
          className="signal-thread__pulse"
        />
      )}
    </svg>
  );
}

export default SignalThread;
