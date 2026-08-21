import { useEffect, useRef, useState } from "react";
import { AlertTriangle, ArrowDownRight, TrendingDown, Users } from "lucide-react";
import "./HeroVisual.css";

/**
 * HeroVisual — an illustrative "Class Overview" preview of the product.
 *
 * This is intentionally NOT a generic dashboard. Every element maps to a
 * real step in the product's reasoning:
 *   class roster -> risk distribution -> performance trajectory
 *   -> early signal -> contributing factors -> recommended action
 *
 * The trajectory line "draws itself" once the component enters view, giving
 * a single deliberate motion moment rather than scattered animation.
 */
function HeroVisual() {
  const [revealed, setRevealed] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Trajectory path: a calm downward drift, illustrative only.
  const linePath = "M4,46 L28,40 L52,44 L76,34 L100,38 L124,26 L148,30 L172,16";

  return (
    <div className="hero-visual" ref={ref}>
      <div className="hero-visual__card">
        <div className="hero-visual__header">
          <span className="hero-visual__header-title">Class Overview</span>
          <span className="hero-visual__live-dot" aria-hidden="true" />
        </div>

        <div className="hero-visual__stats">
          <div className="hv-stat">
            <Users size={14} className="hv-stat__icon" />
            <span className="hv-stat__value">62</span>
            <span className="hv-stat__label">Students</span>
          </div>
          <div className="hv-stat hv-stat--danger">
            <span className="hv-stat__value">07</span>
            <span className="hv-stat__label">High Risk</span>
          </div>
          <div className="hv-stat hv-stat--warning">
            <span className="hv-stat__value">13</span>
            <span className="hv-stat__label">Medium Risk</span>
          </div>
          <div className="hv-stat hv-stat--success">
            <span className="hv-stat__value">42</span>
            <span className="hv-stat__label">Stable</span>
          </div>
        </div>

        <div className="hero-visual__chart">
          <div className="hero-visual__chart-label">
            <TrendingDown size={13} />
            <span>Performance Trajectory — Div. B, Sem IV</span>
          </div>
          <svg
            viewBox="0 0 180 60"
            className="hero-visual__svg"
            role="img"
            aria-label="Illustrative declining performance trend for a group of students"
          >
            <defs>
              <linearGradient id="traj-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-danger)" stopOpacity="0.28" />
                <stop offset="100%" stopColor="var(--color-danger)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`${linePath} L172,60 L4,60 Z`}
              fill="url(#traj-fill)"
              className={revealed ? "reveal-fill" : ""}
            />
            <path
              d={linePath}
              fill="none"
              stroke="var(--color-danger)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`hero-visual__line ${revealed ? "hero-visual__line--drawn" : ""}`}
            />
            {[
              [4, 46],
              [52, 44],
              [100, 38],
              [148, 30],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="2.4" fill="var(--color-danger)" />
            ))}
          </svg>
        </div>

        <div className="hero-visual__signal">
          <div className="hero-visual__signal-head">
            <span className="hero-visual__signal-icon">
              <AlertTriangle size={14} />
            </span>
            <span className="hero-visual__signal-title">EARLY SIGNAL DETECTED</span>
          </div>
          <p className="hero-visual__signal-text">7 students may require attention</p>

          <div className="hero-visual__why">
            <span className="hero-visual__why-label">Why?</span>
            <ul className="hero-visual__factors">
              <li>
                <ArrowDownRight size={12} /> Attendance trend
              </li>
              <li>
                <ArrowDownRight size={12} /> Assessment trend
              </li>
              <li>
                <ArrowDownRight size={12} /> Assignment completion
              </li>
            </ul>
          </div>

          <div className="hero-visual__action">
            <span className="hero-visual__action-label">Recommended action</span>
            <span className="hero-visual__action-text">Schedule targeted academic support</span>
          </div>
        </div>

        <span className="hero-visual__demo-tag">Illustrative data · Demo preview</span>
      </div>

      {/* Ambient depth glow behind the card — subtle, not a giant gradient blob */}
      <div className="hero-visual__glow" aria-hidden="true" />
    </div>
  );
}

export default HeroVisual;
